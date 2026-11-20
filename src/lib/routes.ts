export type RouteLanguage = 'tr' | 'en';

export type SectionKey =
  | 'home'
  | 'about'
  | 'expertise'
  | 'experience'
  | 'projects'
  | 'research'
  | 'academic'
  | 'contact';

export const SECTION_KEYS: SectionKey[] = [
  'home',
  'about',
  'expertise',
  'experience',
  'projects',
  'research',
  'academic',
  'contact',
];

export const SECTION_IDS_BY_LANG: Record<RouteLanguage, Record<SectionKey, string>> = {
  en: {
    home: 'home',
    about: 'about',
    expertise: 'expertise',
    experience: 'experience',
    projects: 'projects',
    research: 'research',
    academic: 'academic',
    contact: 'contact',
  },
  tr: {
    home: 'ana-sayfa',
    about: 'hakkimda',
    expertise: 'uzmanlik',
    experience: 'deneyim',
    projects: 'projeler',
    research: 'arastirma',
    academic: 'akademik',
    contact: 'iletisim',
  },
};

export interface ArticleSlugPair {
  en: string;
  tr: string;
}

export const ARTICLE_SLUG_PAIRS: ArticleSlugPair[] = [
  {
    en: 'strategic-role-of-business-analysis-in-digital-transformation',
    tr: 'kurumsal-dijital-donusumde-is-analizinin-stratejik-rolu',
  },
  {
    en: 'ai-powered-business-workflows-and-institutional-productivity',
    tr: 'yapay-zeka-destekli-is-surecleri-ve-kurumsal-verimlilik',
  },
  {
    en: 'digital-management-architecture-for-sports-clubs-and-facilities',
    tr: 'spor-kulubleri-ve-tesisler-icin-dijital-yonetim-mimarisi',
  },
  {
    en: 'technology-strategy-from-tool-selection-to-value-architecture',
    tr: 'teknoloji-stratejisi-arac-seciminden-deger-mimarisine',
  },
  {
    en: 'product-development-and-entrepreneurship-in-sporttech',
    tr: 'sporttech-ekosisteminde-urun-gelistirme-ve-girisimcilik',
  },
  {
    en: 'building-an-internal-innovation-culture-for-sustainable-change',
    tr: 'kurum-ici-inovasyon-kulturu-ve-surdurulebilir-degisim',
  },
];

export function getHomePath(lang: RouteLanguage): string {
  return lang === 'tr' ? '/tr' : '/';
}

export function getSectionId(key: SectionKey, lang: RouteLanguage): string {
  return SECTION_IDS_BY_LANG[lang][key];
}

export function getSectionHref(key: SectionKey, lang: RouteLanguage): string {
  if (key === 'home') {
    return getHomePath(lang);
  }
  const sectionId = getSectionId(key, lang);
  return lang === 'tr' ? `/tr#${sectionId}` : `/#${sectionId}`;
}

export function getProjectPath(slug: string, lang: RouteLanguage): string {
  return lang === 'tr' ? `/projeler/${slug}` : `/projects/${slug}`;
}

export function translateArticleSlug(slug: string, targetLang: RouteLanguage): string {
  const pair = ARTICLE_SLUG_PAIRS.find((p) => p.en === slug || p.tr === slug);
  if (!pair) return slug;
  return pair[targetLang];
}

export function getArticlePath(slug: string, lang: RouteLanguage): string {
  const localizedSlug = translateArticleSlug(slug, lang);
  return lang === 'tr' ? `/arastirma/${localizedSlug}` : `/research/${localizedSlug}`;
}

export function resolveSectionKeyFromHash(hash: string): SectionKey | null {
  const clean = hash.replace(/^#/, '').trim().toLowerCase();
  if (!clean) return null;

  // Support legacy Turkish hash #yazilar
  if (clean === 'yazilar') return 'research';

  for (const key of SECTION_KEYS) {
    if (SECTION_IDS_BY_LANG.en[key] === clean || SECTION_IDS_BY_LANG.tr[key] === clean) {
      return key;
    }
  }
  return null;
}

export function detectLanguageFromLocation(pathname: string, hash: string): RouteLanguage {
  const clean = pathname.replace(/\/+$/, '') || '/';

  if (
    clean === '/tr' ||
    clean.startsWith('/tr/') ||
    clean.startsWith('/projeler/') ||
    clean.startsWith('/arastirma/') ||
    clean.startsWith('/yazilar/')
  ) {
    return 'tr';
  }

  if (clean.startsWith('/projects/') || clean.startsWith('/research/')) {
    return 'en';
  }

  const cleanHash = hash.replace(/^#/, '').trim().toLowerCase();
  if (cleanHash) {
    if (
      cleanHash === 'yazilar' ||
      Object.values(SECTION_IDS_BY_LANG.tr).includes(cleanHash)
    ) {
      return 'tr';
    }
    if (Object.values(SECTION_IDS_BY_LANG.en).includes(cleanHash)) {
      return 'en';
    }
  }

  return 'en';
}

export function translateUrlForLanguage(
  pathname: string,
  hash: string,
  targetLang: RouteLanguage,
): string {
  const clean = pathname.replace(/\/+$/, '') || '/';

  if (clean.startsWith('/projeler/')) {
    const slug = decodeURIComponent(clean.slice('/projeler/'.length));
    return getProjectPath(slug, targetLang);
  }
  if (clean.startsWith('/projects/')) {
    const slug = decodeURIComponent(clean.slice('/projects/'.length));
    return getProjectPath(slug, targetLang);
  }
  if (clean.startsWith('/arastirma/')) {
    const slug = decodeURIComponent(clean.slice('/arastirma/'.length));
    return getArticlePath(slug, targetLang);
  }
  if (clean.startsWith('/yazilar/')) {
    const slug = decodeURIComponent(clean.slice('/yazilar/'.length));
    return getArticlePath(slug, targetLang);
  }
  if (clean.startsWith('/research/')) {
    const slug = decodeURIComponent(clean.slice('/research/'.length));
    return getArticlePath(slug, targetLang);
  }

  const sectionKey = resolveSectionKeyFromHash(hash);
  if (sectionKey && sectionKey !== 'home') {
    return getSectionHref(sectionKey, targetLang);
  }

  return getHomePath(targetLang);
}
