import { useEffect, useState, type FormEvent } from 'react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import {
  AlertCircle,
  Check,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  Heading2,
  Plus,
  Save,
  Trash2,
} from 'lucide-react';
import {
  getArticleCategories,
  getArticles as getStaticArticles,
  type ArticleCategoryKey,
} from '../data/articles';
import {
  db,
  handleFirestoreError,
  OperationType,
  RESEARCH_ARTICLES_COLLECTION,
  RESEARCH_DATE_REGEX,
  RESEARCH_LIMITS,
  RESEARCH_SLUG_REGEX,
} from '../lib/firebase';
import { useLanguage } from '../lib/i18n';
import {
  parseFirestoreResearchDoc,
  slugifyResearchTitle,
  type DynamicResearchRecord,
  type ResearchVisibilityLang,
} from '../lib/researchStore';
import { getArticlePath } from '../lib/routes';

interface ResearchAdminModuleProps {
  onNavigate: (to: string) => void;
}

interface EditorFormState {
  id: string | null;
  slug: string;
  slugTouched: boolean;
  categoryKey: ArticleCategoryKey;
  lang: ResearchVisibilityLang;
  titleTr: string;
  titleEn: string;
  excerptTr: string;
  excerptEn: string;
  takeawaysTrText: string;
  takeawaysEnText: string;
  bodyTr: string;
  bodyEn: string;
  readTimeMinutes: number;
  publishedAt: string;
  published: boolean;
}

function getTodayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function createEmptyForm(): EditorFormState {
  return {
    id: null,
    slug: '',
    slugTouched: false,
    categoryKey: 'sports-tech',
    lang: 'tr',
    titleTr: '',
    titleEn: '',
    excerptTr: '',
    excerptEn: '',
    takeawaysTrText: '',
    takeawaysEnText: '',
    bodyTr: '',
    bodyEn: '',
    readTimeMinutes: 5,
    publishedAt: getTodayIso(),
    published: true,
  };
}

function recordToForm(record: DynamicResearchRecord): EditorFormState {
  return {
    id: record.id,
    slug: record.slug,
    slugTouched: true,
    categoryKey: record.categoryKey,
    lang: record.lang,
    titleTr: record.titleTr,
    titleEn: record.titleEn,
    excerptTr: record.excerptTr,
    excerptEn: record.excerptEn,
    takeawaysTrText: record.keyTakeawaysTr.join('\n'),
    takeawaysEnText: record.keyTakeawaysEn.join('\n'),
    bodyTr: record.bodyTr,
    bodyEn: record.bodyEn,
    readTimeMinutes: record.readTimeMinutes,
    publishedAt: record.publishedAt,
    published: record.published,
  };
}

function parseTakeaways(raw: string): string[] {
  return raw
    .split('\n')
    .map((line) => line.replace(/^[-•*]\s*/, '').trim().slice(0, RESEARCH_LIMITS.takeawayMaxLength))
    .filter(Boolean)
    .slice(0, RESEARCH_LIMITS.takeawaysMaxCount);
}

export function ResearchAdminModule({ onNavigate }: ResearchAdminModuleProps) {
  const { lang } = useLanguage();
  const isTr = lang === 'tr';
  const categories = getArticleCategories(lang);
  const staticCount = getStaticArticles(lang).length;

  const [articles, setArticles] = useState<DynamicResearchRecord[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [form, setForm] = useState<EditorFormState>(() => createEmptyForm());
  const [editorLangTab, setEditorLangTab] = useState<'tr' | 'en'>('tr');
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    setLoadingList(true);
    const q = query(
      collection(db, RESEARCH_ARTICLES_COLLECTION),
      orderBy('createdAt', 'desc'),
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((docSnap) =>
          parseFirestoreResearchDoc(docSnap.id, docSnap.data() as Record<string, unknown>),
        );
        setArticles(items);
        setLoadingList(false);
      },
      (error) => {
        setLoadingList(false);
        setErrorMessage(
          isTr
            ? 'Araştırma içerikleri yüklenirken yetki veya bağlantı hatası oluştu.'
            : 'Unable to load research articles due to a permission or connection error.',
        );
        try {
          handleFirestoreError(error, OperationType.LIST, RESEARCH_ARTICLES_COLLECTION);
        } catch {
          // Logged via handleFirestoreError
        }
      },
    );

    return () => unsubscribe();
  }, [isTr]);

  const handleSelectNew = () => {
    setForm(createEmptyForm());
    setEditorLangTab('tr');
    setErrorMessage(null);
    setSuccessMessage(null);
    setConfirmDeleteId(null);
  };

  const handleSelectEdit = (record: DynamicResearchRecord) => {
    setForm(recordToForm(record));
    setEditorLangTab(record.lang === 'en' ? 'en' : 'tr');
    setErrorMessage(null);
    setSuccessMessage(null);
    setConfirmDeleteId(null);
  };

  const handleTitleChange = (targetLang: 'tr' | 'en', value: string) => {
    setForm((prev) => {
      const next = targetLang === 'tr' ? { ...prev, titleTr: value } : { ...prev, titleEn: value };
      if (!prev.slugTouched) {
        const seed = targetLang === 'tr' ? value || prev.titleEn : value || prev.titleTr;
        next.slug = slugifyResearchTitle(seed);
      }
      return next;
    });
  };

  const handleInsertSubheading = () => {
    const template =
      editorLangTab === 'tr'
        ? '\n\n## Alt Başlık\n\nParagraf metninizi buraya yazın...'
        : '\n\n## Section Heading\n\nWrite your paragraph here...';
    setForm((prev) =>
      editorLangTab === 'tr'
        ? { ...prev, bodyTr: `${prev.bodyTr.trimEnd()}${template}`.trimStart() }
        : { ...prev, bodyEn: `${prev.bodyEn.trimEnd()}${template}`.trimStart() },
    );
  };

  const saveArticle = async (publishState: boolean) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanSlug = slugifyResearchTitle(form.slug || form.titleTr || form.titleEn);
    const titleTr = form.titleTr.trim().slice(0, RESEARCH_LIMITS.titleMax);
    const titleEn = form.titleEn.trim().slice(0, RESEARCH_LIMITS.titleMax);
    const excerptTr = form.excerptTr.trim().slice(0, RESEARCH_LIMITS.excerptMax);
    const excerptEn = form.excerptEn.trim().slice(0, RESEARCH_LIMITS.excerptMax);
    const bodyTr = form.bodyTr.trim().slice(0, RESEARCH_LIMITS.bodyMax);
    const bodyEn = form.bodyEn.trim().slice(0, RESEARCH_LIMITS.bodyMax);
    const keyTakeawaysTr = parseTakeaways(form.takeawaysTrText);
    const keyTakeawaysEn = parseTakeaways(form.takeawaysEnText);
    const readTimeMinutes = Math.min(
      RESEARCH_LIMITS.readTimeMax,
      Math.max(RESEARCH_LIMITS.readTimeMin, Math.round(Number(form.readTimeMinutes) || 5)),
    );
    const publishedAt = form.publishedAt.trim();

    if (
      cleanSlug.length < RESEARCH_LIMITS.slugMin ||
      cleanSlug.length > RESEARCH_LIMITS.slugMax ||
      !RESEARCH_SLUG_REGEX.test(cleanSlug)
    ) {
      setErrorMessage(
        isTr
          ? 'URL kısa adı (slug) en az 3 karakter olmalı ve yalnızca küçük harf, rakam ve tire içermelidir.'
          : 'Slug must be at least 3 characters using lowercase letters, numbers, and hyphens.',
      );
      return;
    }

    if (!RESEARCH_DATE_REGEX.test(publishedAt)) {
      setErrorMessage(
        isTr ? 'Yayın tarihi YYYY-AA-GG formatında olmalıdır.' : 'Date must follow YYYY-MM-DD format.',
      );
      return;
    }

    const needsTr = form.lang === 'tr' || form.lang === 'both';
    const needsEn = form.lang === 'en' || form.lang === 'both';

    if (needsTr) {
      if (titleTr.length < RESEARCH_LIMITS.titleMin) {
        setEditorLangTab('tr');
        setErrorMessage(isTr ? 'Türkçe başlık en az 3 karakter olmalıdır.' : 'Turkish title requires at least 3 characters.');
        return;
      }
      if (excerptTr.length < RESEARCH_LIMITS.excerptMin) {
        setEditorLangTab('tr');
        setErrorMessage(isTr ? 'Türkçe özet en az 10 karakter olmalıdır.' : 'Turkish excerpt requires at least 10 characters.');
        return;
      }
      if (bodyTr.length < RESEARCH_LIMITS.bodyMin) {
        setEditorLangTab('tr');
        setErrorMessage(isTr ? 'Türkçe içerik en az 20 karakter olmalıdır.' : 'Turkish body requires at least 20 characters.');
        return;
      }
    }

    if (needsEn) {
      if (titleEn.length < RESEARCH_LIMITS.titleMin) {
        setEditorLangTab('en');
        setErrorMessage(isTr ? 'İngilizce başlık en az 3 karakter olmalıdır.' : 'English title requires at least 3 characters.');
        return;
      }
      if (excerptEn.length < RESEARCH_LIMITS.excerptMin) {
        setEditorLangTab('en');
        setErrorMessage(isTr ? 'İngilizce özet en az 10 karakter olmalıdır.' : 'English excerpt requires at least 10 characters.');
        return;
      }
      if (bodyEn.length < RESEARCH_LIMITS.bodyMin) {
        setEditorLangTab('en');
        setErrorMessage(isTr ? 'İngilizce içerik en az 20 karakter olmalıdır.' : 'English body requires at least 20 characters.');
        return;
      }
    }

    // Check duplicate slug among other dynamic records
    const duplicate = articles.find((a) => a.slug === cleanSlug && a.id !== form.id);
    if (duplicate) {
      setErrorMessage(
        isTr
          ? 'Bu URL kısa adına sahip başka bir araştırma içeriği zaten var. Lütfen farklı bir slug girin.'
          : 'Another research article already uses this slug. Please choose a unique slug.',
      );
      return;
    }

    setSaving(true);
    const payload = {
      slug: cleanSlug,
      categoryKey: form.categoryKey,
      lang: form.lang,
      titleTr,
      titleEn,
      excerptTr,
      excerptEn,
      keyTakeawaysTr,
      keyTakeawaysEn,
      bodyTr,
      bodyEn,
      readTimeMinutes,
      published: publishState,
      publishedAt,
      updatedAt: serverTimestamp(),
    };

    try {
      if (form.id) {
        const docPath = `${RESEARCH_ARTICLES_COLLECTION}/${form.id}`;
        try {
          await updateDoc(doc(db, RESEARCH_ARTICLES_COLLECTION, form.id), payload);
          setForm((prev) => ({ ...prev, slug: cleanSlug, published: publishState }));
          setSuccessMessage(
            publishState
              ? isTr
                ? 'Araştırma içeriği güncellendi ve yayında.'
                : 'Research article updated and live.'
              : isTr
                ? 'Taslak olarak kaydedildi.'
                : 'Saved as draft.',
          );
        } catch (error) {
          handleFirestoreError(error, OperationType.UPDATE, docPath);
        }
      } else {
        try {
          const ref = await addDoc(collection(db, RESEARCH_ARTICLES_COLLECTION), {
            ...payload,
            createdAt: serverTimestamp(),
          });
          setForm((prev) => ({
            ...prev,
            id: ref.id,
            slug: cleanSlug,
            slugTouched: true,
            published: publishState,
          }));
          setSuccessMessage(
            publishState
              ? isTr
                ? 'Yeni araştırma içeriği yayınlandı ve Araştırma bölümüne eklendi.'
                : 'New research article published to the Research section.'
              : isTr
                ? 'Yeni araştırma taslak olarak kaydedildi.'
                : 'New research article saved as draft.',
          );
        } catch (error) {
          handleFirestoreError(error, OperationType.CREATE, RESEARCH_ARTICLES_COLLECTION);
        }
      }
    } catch {
      setErrorMessage(
        isTr
          ? 'İçerik kaydedilemedi. Alanları kontrol edip tekrar deneyin.'
          : 'Could not save article. Check fields and try again.',
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void saveArticle(true);
  };

  const handleTogglePublished = async (record: DynamicResearchRecord) => {
    const docPath = `${RESEARCH_ARTICLES_COLLECTION}/${record.id}`;
    setBusyId(record.id);
    setErrorMessage(null);
    try {
      await updateDoc(doc(db, RESEARCH_ARTICLES_COLLECTION, record.id), {
        published: !record.published,
        updatedAt: serverTimestamp(),
      });
      if (form.id === record.id) {
        setForm((prev) => ({ ...prev, published: !record.published }));
      }
    } catch (error) {
      setErrorMessage(
        isTr ? 'Yayın durumu güncellenemedi.' : 'Could not update publish status.',
      );
      try {
        handleFirestoreError(error, OperationType.UPDATE, docPath);
      } catch {
        // Logged via handleFirestoreError
      }
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id: string) => {
    const docPath = `${RESEARCH_ARTICLES_COLLECTION}/${id}`;
    setBusyId(id);
    setErrorMessage(null);
    try {
      await deleteDoc(doc(db, RESEARCH_ARTICLES_COLLECTION, id));
      setConfirmDeleteId(null);
      if (form.id === id) {
        handleSelectNew();
      }
    } catch (error) {
      setErrorMessage(isTr ? 'İçerik silinemedi.' : 'Failed to delete article.');
      try {
        handleFirestoreError(error, OperationType.DELETE, docPath);
      } catch {
        // Logged via handleFirestoreError
      }
    } finally {
      setBusyId(null);
    }
  };

  const categoryLabel = (key: ArticleCategoryKey) =>
    categories.find((c) => c.key === key)?.label ?? key;

  return (
    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Left: Dynamic Research Items List */}
      <div className="lg:col-span-4">
        <div className="rounded-lg border border-[#DCE7F2] bg-white">
          <div className="flex items-center justify-between gap-3 border-b border-[#EAF1F8] px-5 py-4">
            <div>
              <h2 className="text-[14.5px] font-semibold text-[#0A192F]">
                {isTr ? 'Eklenen İçerikler' : 'Added Articles'}
              </h2>
              <p className="mt-0.5 text-[12px] text-[#5B7086]">
                <span className="tabular-nums">{articles.length}</span>{' '}
                {isTr ? 'dinamik' : 'dynamic'} ·{' '}
                <span className="tabular-nums">{staticCount}</span>{' '}
                {isTr ? 'yerleşik' : 'built-in'}
              </p>
            </div>
            <button
              type="button"
              onClick={handleSelectNew}
              className="inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-md bg-[#0C2340] px-3 text-[12.5px] font-medium text-white transition-colors hover:bg-[#143966]"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
              <span>{isTr ? 'Yeni Ekle' : 'New'}</span>
            </button>
          </div>

          {loadingList ? (
            <div className="divide-y divide-[#EAF1F8]">
              {[0, 1].map((i) => (
                <div key={i} className="animate-pulse space-y-2 p-5">
                  <div className="h-3 w-1/3 rounded bg-[#EAF1F8]" />
                  <div className="h-4 w-4/5 rounded bg-[#E4EDF6]" />
                </div>
              ))}
            </div>
          ) : articles.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
              <FileText className="h-6 w-6 text-[#8FA4BA]" strokeWidth={1.5} aria-hidden="true" />
              <p className="mt-3 text-[14px] font-medium text-[#0A192F]">
                {isTr ? 'Henüz dinamik araştırma eklenmedi.' : 'No custom research added yet.'}
              </p>
              <p className="mt-1 text-[12.5px] leading-[1.6] text-[#5B7086]">
                {isTr
                  ? 'Sağdaki editörden yeni bir araştırma içeriği oluşturup anında yayınlayabilirsiniz.'
                  : 'Use the editor to create and publish a new research brief instantly.'}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-[#EAF1F8]">
              {articles.map((item) => {
                const isEditing = form.id === item.id;
                const displayTitle = item.titleTr || item.titleEn;
                const liveHref = getArticlePath(item.slug, item.lang === 'en' ? 'en' : 'tr');

                return (
                  <li
                    key={item.id}
                    className={`p-4 transition-colors ${
                      isEditing ? 'bg-[#F3F8FC]' : 'bg-white hover:bg-[#F8FBFE]'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleSelectEdit(item)}
                      className="block w-full text-left"
                    >
                      <div className="flex items-center justify-between gap-2 text-[11.5px]">
                        <span
                          className={
                            item.published
                              ? 'font-semibold text-[#145DA0]'
                              : 'font-medium text-[#7D95AE]'
                          }
                        >
                          {item.published
                            ? isTr
                              ? 'Yayında'
                              : 'Published'
                            : isTr
                              ? 'Taslak'
                              : 'Draft'}
                        </span>
                        <span className="tabular-nums text-[#7D95AE]">{item.publishedAt}</span>
                      </div>
                      <p className="mt-1.5 line-clamp-2 text-[14px] font-semibold leading-[1.4] text-[#0A192F]">
                        {displayTitle}
                      </p>
                      <p className="mt-1 text-[12px] text-[#5B7086]">
                        {categoryLabel(item.categoryKey)} · {item.lang.toUpperCase()}
                      </p>
                    </button>

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[#EAF1F8] pt-2.5">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={busyId === item.id}
                          onClick={() => void handleTogglePublished(item)}
                          className="inline-flex items-center gap-1 text-[12px] font-medium text-[#4B6075] transition-colors hover:text-[#145DA0] disabled:opacity-50"
                        >
                          {item.published ? (
                            <>
                              <EyeOff className="h-3.5 w-3.5" strokeWidth={1.75} />
                              <span>{isTr ? 'Taslağa Al' : 'Unpublish'}</span>
                            </>
                          ) : (
                            <>
                              <Eye className="h-3.5 w-3.5" strokeWidth={1.75} />
                              <span>{isTr ? 'Yayınla' : 'Publish'}</span>
                            </>
                          )}
                        </button>

                        {item.published && (
                          <button
                            type="button"
                            onClick={() => onNavigate(liveHref)}
                            className="inline-flex items-center gap-1 text-[12px] font-medium text-[#145DA0] hover:underline"
                          >
                            <span>{isTr ? 'Aç' : 'View'}</span>
                            <ExternalLink className="h-3 w-3" strokeWidth={1.75} />
                          </button>
                        )}
                      </div>

                      {confirmDeleteId === item.id ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            disabled={busyId === item.id}
                            onClick={() => void handleDelete(item.id)}
                            className="rounded bg-red-700 px-2 py-1 text-[11.5px] font-medium text-white hover:bg-red-800"
                          >
                            {isTr ? 'Sil' : 'Confirm'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            className="rounded border border-[#DCE7F2] px-2 py-1 text-[11.5px] text-[#4B6075]"
                          >
                            {isTr ? 'İptal' : 'Cancel'}
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(item.id)}
                          aria-label={isTr ? 'İçeriği sil' : 'Delete article'}
                          className="inline-flex items-center gap-1 text-[12px] text-[#7D95AE] transition-colors hover:text-red-700"
                        >
                          <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
                        </button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Right: Research Article Editor */}
      <div className="lg:col-span-8">
        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-[#DCE7F2] bg-[#F8FBFE]/60 p-6 lg:p-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DCE7F2] pb-5">
            <div>
              <h2 className="text-[19px] font-bold tracking-[-0.015em] text-[#0A192F]">
                {form.id
                  ? isTr
                    ? 'Araştırma İçeriğini Düzenle'
                    : 'Edit Research Article'
                  : isTr
                    ? 'Yeni Araştırma İçeriği Ekle'
                    : 'Create Research Article'}
              </h2>
              <p className="mt-1 text-[13px] text-[#5B7086]">
                {isTr
                  ? 'Yayınladığınız içerikler sitenin Araştırma (05) bölümüne otomatik olarak eklenir.'
                  : 'Published articles appear immediately in the public Research (05) section.'}
              </p>
            </div>
            {form.id && (
              <button
                type="button"
                onClick={handleSelectNew}
                className="text-[13px] font-medium text-[#145DA0] hover:underline"
              >
                {isTr ? '+ Yeni boş taslak' : '+ New blank draft'}
              </button>
            )}
          </div>

          {errorMessage && (
            <div
              role="alert"
              className="mt-5 flex items-start gap-2.5 rounded-md border border-red-200 bg-red-50/90 p-3.5 text-[13.5px] text-red-800"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-700" aria-hidden="true" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div
              role="status"
              className="mt-5 flex items-center gap-2.5 rounded-md border border-[#BFD8EE] bg-[#EDF5FC] p-3.5 text-[13.5px] font-medium text-[#0C2340]"
            >
              <Check className="h-4 w-4 shrink-0 text-[#145DA0]" strokeWidth={2} aria-hidden="true" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Metadata Row */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="sm:col-span-2">
              <label
                htmlFor="research-category"
                className="block text-[12.5px] font-medium text-[#33485E]"
              >
                {isTr ? 'Kategori' : 'Category'}
              </label>
              <select
                id="research-category"
                value={form.categoryKey}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    categoryKey: e.target.value as ArticleCategoryKey,
                  }))
                }
                className="mt-1.5 h-10 w-full rounded-md border border-[#CEDEEA] bg-white px-3 text-[13.5px] text-[#0A192F] focus:border-[#145DA0] focus:outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat.key} value={cat.key}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="research-lang"
                className="block text-[12.5px] font-medium text-[#33485E]"
              >
                {isTr ? 'Yayın Dili' : 'Language'}
              </label>
              <select
                id="research-lang"
                value={form.lang}
                onChange={(e) => {
                  const nextLang = e.target.value as ResearchVisibilityLang;
                  setForm((prev) => ({ ...prev, lang: nextLang }));
                  if (nextLang === 'en') setEditorLangTab('en');
                  else if (nextLang === 'tr') setEditorLangTab('tr');
                }}
                className="mt-1.5 h-10 w-full rounded-md border border-[#CEDEEA] bg-white px-3 text-[13.5px] text-[#0A192F] focus:border-[#145DA0] focus:outline-none"
              >
                <option value="tr">{isTr ? 'Yalnızca Türkçe' : 'Turkish Only'}</option>
                <option value="both">{isTr ? 'Türkçe + İngilizce' : 'Turkish + English'}</option>
                <option value="en">{isTr ? 'Yalnızca İngilizce' : 'English Only'}</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="research-date"
                className="block text-[12.5px] font-medium text-[#33485E]"
              >
                {isTr ? 'Tarih' : 'Date'}
              </label>
              <input
                id="research-date"
                type="date"
                value={form.publishedAt}
                onChange={(e) => setForm((prev) => ({ ...prev, publishedAt: e.target.value }))}
                className="mt-1.5 h-10 w-full rounded-md border border-[#CEDEEA] bg-white px-3 text-[13.5px] text-[#0A192F] tabular-nums focus:border-[#145DA0] focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div className="sm:col-span-3">
              <label
                htmlFor="research-slug"
                className="block text-[12.5px] font-medium text-[#33485E]"
              >
                {isTr ? 'URL Kısa Adı (Slug)' : 'URL Slug'}
              </label>
              <div className="mt-1.5 flex items-center rounded-md border border-[#CEDEEA] bg-white focus-within:border-[#145DA0]">
                <span className="select-none pl-3 text-[12.5px] text-[#7D95AE]">
                  {editorLangTab === 'tr' ? '/arastirma/' : '/research/'}
                </span>
                <input
                  id="research-slug"
                  type="text"
                  value={form.slug}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      slug: slugifyResearchTitle(e.target.value),
                      slugTouched: true,
                    }))
                  }
                  placeholder="sporda-yapay-zeka-uygulamalari"
                  className="h-10 w-full bg-transparent pr-3 text-[13.5px] text-[#0A192F] placeholder:text-[#9BB0C5] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="research-readtime"
                className="block text-[12.5px] font-medium text-[#33485E]"
              >
                {isTr ? 'Okuma (dk)' : 'Read (min)'}
              </label>
              <input
                id="research-readtime"
                type="number"
                min={RESEARCH_LIMITS.readTimeMin}
                max={RESEARCH_LIMITS.readTimeMax}
                value={form.readTimeMinutes}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    readTimeMinutes: Number.parseInt(e.target.value, 10) || 1,
                  }))
                }
                className="mt-1.5 h-10 w-full rounded-md border border-[#CEDEEA] bg-white px-3 text-[13.5px] text-[#0A192F] tabular-nums focus:border-[#145DA0] focus:outline-none"
              />
            </div>
          </div>

          {/* Language Content Switcher (shown when both or switching manually) */}
          {form.lang === 'both' && (
            <div className="mt-6 flex items-center gap-1 rounded-lg bg-[#EAF2F9] p-1 w-fit">
              <button
                type="button"
                onClick={() => setEditorLangTab('tr')}
                className={`rounded-md px-3.5 py-1.5 text-[12.5px] font-medium transition-colors ${
                  editorLangTab === 'tr'
                    ? 'bg-white text-[#0A192F] shadow-xs'
                    : 'text-[#4B6075] hover:text-[#0A192F]'
                }`}
              >
                Türkçe İçerik
              </button>
              <button
                type="button"
                onClick={() => setEditorLangTab('en')}
                className={`rounded-md px-3.5 py-1.5 text-[12.5px] font-medium transition-colors ${
                  editorLangTab === 'en'
                    ? 'bg-white text-[#0A192F] shadow-xs'
                    : 'text-[#4B6075] hover:text-[#0A192F]'
                }`}
              >
                English Content
              </button>
            </div>
          )}

          {/* Content Fields */}
          <div className="mt-5 space-y-4">
            <div>
              <label
                htmlFor="research-title"
                className="block text-[12.5px] font-medium text-[#33485E]"
              >
                {editorLangTab === 'tr' ? 'Araştırma Başlığı (TR)' : 'Research Title (EN)'}
              </label>
              <input
                id="research-title"
                type="text"
                maxLength={RESEARCH_LIMITS.titleMax}
                value={editorLangTab === 'tr' ? form.titleTr : form.titleEn}
                onChange={(e) => handleTitleChange(editorLangTab, e.target.value)}
                placeholder={
                  editorLangTab === 'tr'
                    ? 'Örn: Spor Teknolojilerinde Veri Odaklı Karar Mimarisi'
                    : 'e.g. Data-Driven Decision Architecture in Sports Technology'
                }
                className="mt-1.5 h-11 w-full rounded-md border border-[#CEDEEA] bg-white px-3.5 text-[14.5px] text-[#0A192F] placeholder:text-[#9BB0C5] focus:border-[#145DA0] focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="research-excerpt"
                className="block text-[12.5px] font-medium text-[#33485E]"
              >
                {editorLangTab === 'tr' ? 'Kısa Özet (Kart Açıklaması)' : 'Short Summary (Card Excerpt)'}
              </label>
              <textarea
                id="research-excerpt"
                rows={2}
                maxLength={RESEARCH_LIMITS.excerptMax}
                value={editorLangTab === 'tr' ? form.excerptTr : form.excerptEn}
                onChange={(e) =>
                  setForm((prev) =>
                    editorLangTab === 'tr'
                      ? { ...prev, excerptTr: e.target.value }
                      : { ...prev, excerptEn: e.target.value },
                  )
                }
                placeholder={
                  editorLangTab === 'tr'
                    ? 'Araştırma kartında ve detay sayfasının üst kısmında görünecek 1-2 cümlelik özet...'
                    : 'A concise 1-2 sentence summary displayed on the research card and header...'
                }
                className="mt-1.5 w-full rounded-md border border-[#CEDEEA] bg-white px-3.5 py-2.5 text-[14px] leading-[1.6] text-[#0A192F] placeholder:text-[#9BB0C5] focus:border-[#145DA0] focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="research-takeaways"
                className="block text-[12.5px] font-medium text-[#33485E]"
              >
                {editorLangTab === 'tr'
                  ? 'Öne Çıkan Bulgular (Her satıra 1 madde, en fazla 8)'
                  : 'Key Takeaways (One per line, max 8)'}
              </label>
              <textarea
                id="research-takeaways"
                rows={3}
                value={editorLangTab === 'tr' ? form.takeawaysTrText : form.takeawaysEnText}
                onChange={(e) =>
                  setForm((prev) =>
                    editorLangTab === 'tr'
                      ? { ...prev, takeawaysTrText: e.target.value }
                      : { ...prev, takeawaysEnText: e.target.value },
                  )
                }
                placeholder={
                  editorLangTab === 'tr'
                    ? 'Veri standartları proje başında tanımlanmalıdır.\nSaha geri bildirimi ürün yol haritasını doğrudan beslemelidir.'
                    : 'Define data standards before technical implementation.\nField feedback should continuously guide the product roadmap.'
                }
                className="mt-1.5 w-full rounded-md border border-[#CEDEEA] bg-white px-3.5 py-2.5 text-[13.5px] leading-[1.6] text-[#0A192F] placeholder:text-[#9BB0C5] focus:border-[#145DA0] focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between gap-2">
                <label
                  htmlFor="research-body"
                  className="block text-[12.5px] font-medium text-[#33485E]"
                >
                  {editorLangTab === 'tr'
                    ? 'İçerik Metni (Alt başlıklar için ## kullanın)'
                    : 'Article Body (Use ## for section headings)'}
                </label>
                <button
                  type="button"
                  onClick={handleInsertSubheading}
                  className="inline-flex items-center gap-1 text-[12px] font-medium text-[#145DA0] hover:underline"
                >
                  <Heading2 className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                  <span>{isTr ? 'Alt Başlık Ekle' : 'Insert Heading'}</span>
                </button>
              </div>
              <textarea
                id="research-body"
                rows={9}
                maxLength={RESEARCH_LIMITS.bodyMax}
                value={editorLangTab === 'tr' ? form.bodyTr : form.bodyEn}
                onChange={(e) =>
                  setForm((prev) =>
                    editorLangTab === 'tr'
                      ? { ...prev, bodyTr: e.target.value }
                      : { ...prev, bodyEn: e.target.value },
                  )
                }
                placeholder={
                  editorLangTab === 'tr'
                    ? '## Temel Çerçeve\n\nAraştırma metninizi paragraflar halinde buraya yazın...\n\n## Uygulama Önerileri\n\nİkinci bölüm metni...'
                    : '## Core Framework\n\nWrite your research brief in structured paragraphs...\n\n## Practical Takeaways\n\nSecond section...'
                }
                className="mt-1.5 w-full rounded-md border border-[#CEDEEA] bg-white px-3.5 py-3 text-[14px] leading-[1.7] text-[#0A192F] placeholder:text-[#9BB0C5] focus:border-[#145DA0] focus:outline-none"
              />
            </div>
          </div>

          {/* Save / Publish Footer */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#DCE7F2] pt-5">
            <button
              type="button"
              disabled={saving}
              onClick={() => void saveArticle(false)}
              className="inline-flex min-h-[42px] items-center gap-2 whitespace-nowrap rounded-md border border-[#D4E2F0] bg-white px-4 py-2 text-[13.5px] font-medium text-[#33485E] transition-colors hover:border-[#145DA0] hover:text-[#0A192F] disabled:opacity-50"
            >
              <Save className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
              <span>{isTr ? 'Taslak Olarak Kaydet' : 'Save as Draft'}</span>
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex min-h-[42px] items-center gap-2 whitespace-nowrap rounded-md bg-[#0C2340] px-5 py-2 text-[13.5px] font-medium text-white transition-colors hover:bg-[#143966] disabled:opacity-60"
            >
              <Check className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
              <span>
                {saving
                  ? isTr
                    ? 'Kaydediliyor...'
                    : 'Saving...'
                  : form.id
                    ? isTr
                      ? 'Güncelle ve Yayınla'
                      : 'Update & Publish'
                    : isTr
                      ? 'Araştırmaya Yayınla'
                      : 'Publish to Research'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
