import { useMemo } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { getArticles, type ArticleItem } from '../data/articles';
import { SITE_CONFIG } from '../data/profile';
import { UI_COPY, useLanguage } from '../lib/i18n';
import { getArticlePath, getHomePath, getSectionHref } from '../lib/routes';
import { useDocumentSEO } from '../lib/seo';
import { ArticleSportTechCover } from './ArticleSportTechCover';
import { SocialShareWidget } from './SocialShareWidget';

interface ArticleDetailPageProps {
  article: ArticleItem;
  onNavigate: (to: string) => void;
}

export function ArticleDetailPage({ article, onNavigate }: ArticleDetailPageProps) {
  const { lang } = useLanguage();
  const copy = UI_COPY[lang].articles;
  const allArticles = getArticles(lang);
  const articleIndex = Math.max(
    0,
    allArticles.findIndex((a) => a.slug === article.slug),
  );

  const routePath = getArticlePath(article.slug, lang);
  const shareUrl = `${SITE_CONFIG.siteUrl}${routePath}`;
  const enArticlePath = getArticlePath(article.slug, 'en');
  const trArticlePath = getArticlePath(article.slug, 'tr');

  const jsonLd = useMemo(() => {
    const routeUrl = `${SITE_CONFIG.siteUrl}${routePath}`;
    const homeUrl = `${SITE_CONFIG.siteUrl}${getHomePath(lang)}`;
    const researchSectionUrl = `${SITE_CONFIG.siteUrl}${getSectionHref('research', lang)}`;

    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Article',
          headline: article.title,
          description: article.seoDescription,
          datePublished: article.isoDate,
          dateModified: article.isoDate,
          articleSection: article.category,
          inLanguage: lang === 'tr' ? 'tr-TR' : 'en-US',
          image: article.coverImage.startsWith('http')
            ? article.coverImage
            : `${SITE_CONFIG.siteUrl}${article.coverImage.startsWith('/') ? '' : '/'}${article.coverImage}`,
          author: {
            '@id': `${SITE_CONFIG.siteUrl}/#person`,
          },
          publisher: {
            '@id': `${SITE_CONFIG.siteUrl}/#person`,
          },
          mainEntityOfPage: routeUrl,
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: lang === 'tr' ? 'Ana Sayfa' : 'Home',
              item: homeUrl,
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: lang === 'tr' ? 'Araştırma' : 'Research',
              item: researchSectionUrl,
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: article.title,
              item: routeUrl,
            },
          ],
        },
      ],
    };
  }, [article, lang, routePath]);

  useDocumentSEO({
    title: article.seoTitle,
    description: article.seoDescription,
    path: routePath,
    type: 'article',
    lang,
    image: article.coverImage,
    imageAlt: article.coverAlt,
    imageWidth: 1200,
    imageHeight: 630,
    imageType: 'image/png',
    publishedTime: article.isoDate,
    modifiedTime: article.isoDate,
    alternatePaths: {
      en: enArticlePath,
      tr: trArticlePath,
    },
    jsonLd,
  });

  const relatedArticles = allArticles.filter((a) => a.slug !== article.slug).slice(0, 2);

  return (
    <article className="relative overflow-hidden bg-white pb-24 pt-10 lg:pb-32 lg:pt-14">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-20 h-[360px] w-[360px] rounded-full bg-[#38BDF8]/[0.09] blur-3xl"
      />

      <div className="relative mx-auto max-w-[820px] px-6 lg:px-8">
        {/* Back Link */}
        <button
          type="button"
          onClick={() => onNavigate(getSectionHref('research', lang))}
          className="inline-flex items-center gap-2 text-[13.5px] font-medium text-[#4B6075] transition-colors hover:text-[#145DA0]"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
          <span>{copy.backToAll}</span>
        </button>

        {/* Research Header */}
        <header className="mt-8 border-b border-[#DCE7F2] pb-8">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[13px] text-[#5B7086]">
            <span className="font-medium text-[#145DA0]">{copy.heading}</span>
            <span aria-hidden="true">·</span>
            <span className="font-medium text-[#0A192F]">{article.category}</span>
          </div>

          <h1 className="mt-4 text-[clamp(1.85rem,4vw,2.9rem)] font-bold leading-[1.15] tracking-[-0.025em] text-[#0A192F]">
            {article.title}
          </h1>

          <p className="mt-5 text-[17.5px] leading-[1.7] text-[#465B71]">
            {article.excerpt}
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-2">
            <p className="text-[13.5px] text-[#4B6075]">
              {copy.authorLabel}:{' '}
              <span className="font-semibold text-[#0A192F]">{SITE_CONFIG.fullName}</span>
            </p>

            <SocialShareWidget
              url={shareUrl}
              title={article.title}
              description={article.excerpt}
              hashtags={[article.category, 'SportTech']}
            />
          </div>
        </header>

        {/* Fixed SportTech Editorial Cover */}
        <div className="mt-10">
          <ArticleSportTechCover article={article} index={articleIndex} lang={lang} />
        </div>

        {/* Key Takeaways Box */}
        <div className="mt-10 rounded-lg border border-[#DCE7F2] bg-[#F3F8FC] p-6 lg:p-8">
          <h2 className="text-[14px] font-semibold text-[#0A192F]">
            {copy.keyTakeaways}
          </h2>
          <ul className="mt-4 space-y-2.5">
            {article.keyTakeaways.map((point, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 text-[15px] leading-[1.65] text-[#2C4157]"
              >
                <span className="mt-0.5 text-[12px] font-semibold text-[#145DA0] tabular-nums">
                  0{idx + 1}
                </span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Essay Prose */}
        <div className="mt-12 space-y-10">
          {article.sections.map((section, idx) => (
            <section key={idx} className="space-y-4">
              <h2 className="text-[22px] font-semibold tracking-[-0.015em] text-[#0A192F]">
                {section.heading}
              </h2>
              {section.paragraphs.map((paragraph, pIdx) => (
                <p
                  key={pIdx}
                  className="text-[16.5px] leading-[1.85] text-[#33485E]"
                >
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>

        {/* Author Closing CTA */}
        <div className="mt-14 flex flex-col items-start justify-between gap-6 border-t border-[#DCE7F2] pt-10 sm:flex-row sm:items-center">
          <div>
            <p className="text-[15px] font-semibold text-[#0A192F]">
              {copy.discussTitle}
            </p>
            <p className="mt-1 text-[14px] text-[#465B71]">{copy.discussText}</p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate(getSectionHref('contact', lang))}
            className="whitespace-nowrap shrink-0 rounded-md bg-[#0C2340] px-5 py-2.5 text-[13.5px] font-medium text-white transition-colors hover:bg-[#143966]"
          >
            {copy.discussCta}
          </button>
        </div>

        {/* Related Articles */}
        <section
          aria-labelledby="related-articles-heading"
          className="mt-16 border-t border-[#DCE7F2] pt-12"
        >
          <h2
            id="related-articles-heading"
            className="text-[18px] font-semibold tracking-[-0.01em] text-[#0A192F]"
          >
            {copy.relatedTitle}
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {relatedArticles.map((related) => (
              <button
                key={related.slug}
                type="button"
                onClick={() => onNavigate(getArticlePath(related.slug, lang))}
                className="group flex flex-col justify-between rounded-lg border border-[#DCE7F2] p-6 text-left transition-colors hover:border-[#94BBE0] hover:bg-[#F8FBFE]"
              >
                <div>
                  <p className="text-[12.5px] font-medium text-[#145DA0]">
                    {related.category}
                  </p>
                  <h3 className="mt-2.5 text-[16.5px] font-semibold leading-[1.4] text-[#0A192F]">
                    {related.title}
                  </h3>
                </div>
                <span className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-[#145DA0]">
                  <span>{copy.readArticle}</span>
                  <ArrowRight
                    className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                    strokeWidth={1.75}
                  />
                </span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </article>
  );
}
