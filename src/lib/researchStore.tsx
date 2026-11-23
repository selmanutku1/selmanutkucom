import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  collection,
  onSnapshot,
  query,
  where,
  type Timestamp,
} from 'firebase/firestore';
import {
  getArticleCategories,
  getArticles as getStaticArticles,
  getArticleBySlug as getStaticArticleBySlug,
  type ArticleCategoryKey,
  type ArticleItem,
  type ArticleSection,
} from '../data/articles';
import {
  db,
  handleFirestoreError,
  OperationType,
  RESEARCH_ARTICLES_COLLECTION,
} from './firebase';
import type { Language } from './i18n';

export type ResearchVisibilityLang = 'tr' | 'en' | 'both';

export interface DynamicResearchRecord {
  id: string;
  slug: string;
  categoryKey: ArticleCategoryKey;
  lang: ResearchVisibilityLang;
  titleTr: string;
  titleEn: string;
  excerptTr: string;
  excerptEn: string;
  keyTakeawaysTr: string[];
  keyTakeawaysEn: string[];
  bodyTr: string;
  bodyEn: string;
  readTimeMinutes: number;
  published: boolean;
  publishedAt: string;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

const VALID_CATEGORY_KEYS: ReadonlySet<string> = new Set<ArticleCategoryKey>([
  'digital-transformation',
  'ai',
  'sports-tech',
  'tech-strategy',
  'entrepreneurship',
  'innovation',
]);

export function slugifyResearchTitle(input: string): string {
  const trMap: Record<string, string> = {
    ç: 'c',
    Ç: 'c',
    ğ: 'g',
    Ğ: 'g',
    ı: 'i',
    İ: 'i',
    ö: 'o',
    Ö: 'o',
    ş: 's',
    Ş: 's',
    ü: 'u',
    Ü: 'u',
  };
  return input
    .trim()
    .split('')
    .map((ch) => trMap[ch] ?? ch)
    .join('')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
    .slice(0, 120);
}

export function parseResearchBodyToSections(
  rawBody: string,
  fallbackHeading: string,
): ArticleSection[] {
  const lines = rawBody.replace(/\r\n/g, '\n').split('\n');
  const sections: ArticleSection[] = [];
  let currentHeading = '';
  let currentParagraphLines: string[] = [];
  let currentParagraphs: string[] = [];

  const flushParagraph = () => {
    const joined = currentParagraphLines.join(' ').trim();
    if (joined) {
      currentParagraphs.push(joined);
    }
    currentParagraphLines = [];
  };

  const flushSection = () => {
    flushParagraph();
    if (currentParagraphs.length > 0) {
      sections.push({
        heading: currentHeading || fallbackHeading,
        paragraphs: currentParagraphs,
      });
    }
    currentParagraphs = [];
  };

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();
    if (trimmed.startsWith('## ')) {
      flushSection();
      currentHeading = trimmed.slice(3).trim();
    } else if (trimmed === '') {
      flushParagraph();
    } else {
      currentParagraphLines.push(trimmed);
    }
  }
  flushSection();

  if (sections.length === 0 && rawBody.trim()) {
    return [{ heading: fallbackHeading, paragraphs: [rawBody.trim()] }];
  }
  return sections;
}

function formatDisplayDate(isoDate: string, lang: Language): string {
  const parts = isoDate.split('-').map((n) => Number.parseInt(n, 10));
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) {
    return isoDate;
  }
  const date = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
  return new Intl.DateTimeFormat(lang === 'tr' ? 'tr-TR' : 'en-US', {
    day: '2-digit',
    month: lang === 'tr' ? 'long' : 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export function mapDynamicDocToArticleItem(
  record: DynamicResearchRecord,
  lang: Language,
): ArticleItem | null {
  if (record.lang === 'tr' && lang === 'en') return null;
  if (record.lang === 'en' && lang === 'tr') return null;

  const isTr = lang === 'tr';
  const title = (isTr ? record.titleTr || record.titleEn : record.titleEn || record.titleTr).trim();
  const excerpt = (
    isTr ? record.excerptTr || record.excerptEn : record.excerptEn || record.excerptTr
  ).trim();
  const body = (isTr ? record.bodyTr || record.bodyEn : record.bodyEn || record.bodyTr).trim();
  const rawTakeaways = isTr
    ? record.keyTakeawaysTr.length > 0
      ? record.keyTakeawaysTr
      : record.keyTakeawaysEn
    : record.keyTakeawaysEn.length > 0
      ? record.keyTakeawaysEn
      : record.keyTakeawaysTr;

  if (!title || !excerpt) return null;

  const categories = getArticleCategories(lang);
  const categoryLabel =
    categories.find((c) => c.key === record.categoryKey)?.label ??
    categories[0]?.label ??
    record.categoryKey;

  const fallbackHeading = isTr ? 'Değerlendirme' : 'Overview';
  const sections = parseResearchBodyToSections(body, fallbackHeading);
  const keyTakeaways =
    rawTakeaways.length > 0
      ? rawTakeaways
      : [excerpt];

  return {
    slug: record.slug,
    title,
    categoryKey: record.categoryKey,
    category: categoryLabel,
    publishedAt: formatDisplayDate(record.publishedAt, lang),
    isoDate: record.publishedAt,
    readTime: isTr ? `${record.readTimeMinutes} dk okuma` : `${record.readTimeMinutes} min read`,
    excerpt,
    coverImage: '/og-image.png',
    coverAlt: title,
    keyTakeaways,
    sections,
    seoTitle: `${title} | Selman Utku`,
    seoDescription: excerpt.slice(0, 160),
  };
}

interface ResearchStoreValue {
  dynamicRecords: DynamicResearchRecord[];
  loading: boolean;
}

const ResearchStoreContext = createContext<ResearchStoreValue>({
  dynamicRecords: [],
  loading: false,
});

export function parseFirestoreResearchDoc(
  id: string,
  data: Record<string, unknown>,
): DynamicResearchRecord {
  const rawCategory = String(data.categoryKey || 'digital-transformation');
  const categoryKey: ArticleCategoryKey = VALID_CATEGORY_KEYS.has(rawCategory)
    ? (rawCategory as ArticleCategoryKey)
    : 'digital-transformation';

  const rawLang = String(data.lang || 'tr');
  const lang: ResearchVisibilityLang =
    rawLang === 'en' || rawLang === 'both' ? rawLang : 'tr';

  const normalizeList = (value: unknown): string[] =>
    Array.isArray(value)
      ? value
          .map((item) => String(item || '').trim())
          .filter(Boolean)
          .slice(0, 8)
      : [];

  return {
    id,
    slug: String(data.slug || id),
    categoryKey,
    lang,
    titleTr: String(data.titleTr || ''),
    titleEn: String(data.titleEn || ''),
    excerptTr: String(data.excerptTr || ''),
    excerptEn: String(data.excerptEn || ''),
    keyTakeawaysTr: normalizeList(data.keyTakeawaysTr),
    keyTakeawaysEn: normalizeList(data.keyTakeawaysEn),
    bodyTr: String(data.bodyTr || ''),
    bodyEn: String(data.bodyEn || ''),
    readTimeMinutes:
      typeof data.readTimeMinutes === 'number' && Number.isFinite(data.readTimeMinutes)
        ? Math.min(60, Math.max(1, Math.round(data.readTimeMinutes)))
        : 5,
    published: Boolean(data.published),
    publishedAt: String(data.publishedAt || new Date().toISOString().slice(0, 10)),
    createdAt: (data.createdAt as Timestamp | null) ?? null,
    updatedAt: (data.updatedAt as Timestamp | null) ?? null,
  };
}

export function ResearchProvider({ children }: { children: ReactNode }) {
  const [dynamicRecords, setDynamicRecords] = useState<DynamicResearchRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Query only published == true so no composite index is needed and public rules pass cleanly.
    const publishedQuery = query(
      collection(db, RESEARCH_ARTICLES_COLLECTION),
      where('published', '==', true),
    );

    const unsubscribe = onSnapshot(
      publishedQuery,
      (snapshot) => {
        const items = snapshot.docs
          .map((docSnap) =>
            parseFirestoreResearchDoc(docSnap.id, docSnap.data() as Record<string, unknown>),
          )
          .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
        setDynamicRecords(items);
        setLoading(false);
      },
      (error) => {
        setLoading(false);
        try {
          handleFirestoreError(error, OperationType.LIST, RESEARCH_ARTICLES_COLLECTION);
        } catch {
          // Graceful fallback to static articles if offline or rules reject
        }
      },
    );

    return () => unsubscribe();
  }, []);

  const value = useMemo(
    () => ({ dynamicRecords, loading }),
    [dynamicRecords, loading],
  );

  return (
    <ResearchStoreContext.Provider value={value}>
      {children}
    </ResearchStoreContext.Provider>
  );
}

export function useAllArticles(lang: Language): { articles: ArticleItem[]; loading: boolean } {
  const { dynamicRecords, loading } = useContext(ResearchStoreContext);

  const articles = useMemo(() => {
    const staticItems = getStaticArticles(lang);
    const dynamicItems = dynamicRecords
      .map((rec) => mapDynamicDocToArticleItem(rec, lang))
      .filter((item): item is ArticleItem => item !== null);

    const dynamicSlugs = new Set(dynamicItems.map((d) => d.slug));
    const filteredStatic = staticItems.filter((s) => !dynamicSlugs.has(s.slug));
    return [...dynamicItems, ...filteredStatic];
  }, [dynamicRecords, lang]);

  return { articles, loading };
}

export function useArticleBySlug(
  slug: string,
  lang: Language,
): { article: ArticleItem | undefined; loading: boolean } {
  const { dynamicRecords, loading } = useContext(ResearchStoreContext);

  const article = useMemo(() => {
    const dynamicMatch = dynamicRecords.find((r) => r.slug === slug);
    if (dynamicMatch) {
      // If user switches language while viewing a single-language dynamic article, still render cleanly
      const localized = mapDynamicDocToArticleItem(dynamicMatch, lang);
      if (localized) return localized;
      const fallbackLang: Language = lang === 'tr' ? 'en' : 'tr';
      return mapDynamicDocToArticleItem(dynamicMatch, fallbackLang) ?? undefined;
    }
    return getStaticArticleBySlug(slug, lang);
  }, [dynamicRecords, slug, lang]);

  return { article, loading };
}
