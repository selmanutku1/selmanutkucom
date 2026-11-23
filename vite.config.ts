import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig} from 'vite';
import {getArticles} from './src/data/articles';
import {getProjects} from './src/data/projects';
import {
  getArticlePath,
  getHomePath,
  getProjectPath,
  getSectionHref,
  type RouteLanguage,
} from './src/lib/routes';

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function replaceMetaByName(html: string, name: string, content: string): string {
  const escaped = escapeHtml(content);
  const regex = new RegExp(`<meta\\s+[^>]*name=["']${name}["'][^>]*>`, 'i');
  return html.replace(regex, `<meta name="${name}" content="${escaped}" />`);
}

function replaceMetaByProperty(html: string, property: string, content: string): string {
  const escaped = escapeHtml(content);
  const regex = new RegExp(`<meta\\s+[^>]*property=["']${property}["'][^>]*>`, 'i');
  return html.replace(regex, `<meta property="${property}" content="${escaped}" />`);
}

function rewriteOriginUrls(content: string, targetOrigin: string): string {
  const cleanOrigin = targetOrigin.replace(/\/+$/, '');
  return content.replace(
    /https:\/\/(?:www\.)?selmanutku\.com(?=[/"'< \r\n\t,;)]|$)/g,
    cleanOrigin,
  );
}

function buildRouteHtml(
  templateHtml: string,
  options: {
    origin: string;
    lang: RouteLanguage;
    routePath: string;
    enPath: string;
    trPath: string;
    title: string;
    description: string;
    ogType: 'profile' | 'website' | 'article';
    ogImagePath?: string;
    ogImageWidth?: number;
    ogImageHeight?: number;
    publishedTime?: string;
    routeSchema?: Record<string, unknown>;
    noIndex?: boolean;
    prerenderHtml: string;
  },
): string {
  const canonicalUrl = `${options.origin}${options.routePath}`;
  const enUrl = `${options.origin}${options.enPath}`;
  const trUrl = `${options.origin}${options.trPath}`;
  let html = templateHtml;

  html = html.replace(/<html\s+lang="[^"]*"/i, `<html lang="${options.lang}"`);
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(options.title)}</title>`);
  html = replaceMetaByName(html, 'description', options.description);
  if (options.noIndex) {
    html = replaceMetaByName(html, 'robots', 'noindex, nofollow');
    html = replaceMetaByName(html, 'googlebot', 'noindex, nofollow');
  }
  html = replaceMetaByProperty(html, 'og:type', options.ogType);
  html = replaceMetaByProperty(html, 'og:locale', options.lang === 'tr' ? 'tr_TR' : 'en_US');
  html = replaceMetaByProperty(
    html,
    'og:locale:alternate',
    options.lang === 'tr' ? 'en_US' : 'tr_TR',
  );
  const imagePath = options.ogImagePath || '/og-image.png';
  const normalizedImagePath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  const ogImageUrl = `${options.origin}${normalizedImagePath}`;
  const ogImageWidth = String(options.ogImageWidth ?? 1200);
  const ogImageHeight = String(options.ogImageHeight ?? 549);
  const ogImageAlt = options.title.includes('Selman Utku')
    ? options.title
    : `${options.title} – Selman Utku`;

  html = replaceMetaByProperty(html, 'og:title', options.title);
  html = replaceMetaByProperty(html, 'og:description', options.description);
  html = replaceMetaByProperty(html, 'og:url', canonicalUrl);
  html = replaceMetaByProperty(html, 'og:image', ogImageUrl);
  html = replaceMetaByProperty(html, 'og:image:url', ogImageUrl);
  html = replaceMetaByProperty(html, 'og:image:secure_url', ogImageUrl);
  html = replaceMetaByProperty(html, 'og:image:width', ogImageWidth);
  html = replaceMetaByProperty(html, 'og:image:height', ogImageHeight);
  html = replaceMetaByProperty(html, 'og:image:alt', ogImageAlt);
  html = html.replace(
    /<meta\s+itemprop=["']image["'][^>]*>/i,
    `<meta itemprop="image" content="${escapeHtml(ogImageUrl)}" />`,
  );
  html = replaceMetaByName(html, 'twitter:url', canonicalUrl);
  html = replaceMetaByName(html, 'twitter:title', options.title);
  html = replaceMetaByName(html, 'twitter:description', options.description);
  html = replaceMetaByName(html, 'twitter:image', ogImageUrl);
  html = replaceMetaByName(html, 'twitter:image:src', ogImageUrl);
  html = replaceMetaByName(html, 'twitter:image:alt', ogImageAlt);

  // Update canonical and bilingual hreflang links
  html = html.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
    `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`,
  );
  html = html.replace(
    /<link\s+rel="alternate"\s+hreflang="en"\s+href="[^"]*"\s*\/?>/i,
    `<link rel="alternate" hreflang="en" href="${escapeHtml(enUrl)}" />`,
  );
  html = html.replace(
    /<link\s+rel="alternate"\s+hreflang="tr-TR"\s+href="[^"]*"\s*\/?>/i,
    `<link rel="alternate" hreflang="tr-TR" href="${escapeHtml(trUrl)}" />`,
  );
  html = html.replace(
    /<link\s+rel="alternate"\s+hreflang="x-default"\s+href="[^"]*"\s*\/?>/i,
    `<link rel="alternate" hreflang="x-default" href="${escapeHtml(enUrl)}" />`,
  );

  if (options.ogType !== 'profile') {
    html = html.replace(/<meta\s+property="profile:first_name"[^>]*>\s*/gi, '');
    html = html.replace(/<meta\s+property="profile:last_name"[^>]*>\s*/gi, '');
  }

  const extraHeadTags: string[] = [];
  if (options.publishedTime) {
    extraHeadTags.push(
      `    <meta property="article:published_time" content="${escapeHtml(options.publishedTime)}" />`,
    );
  }
  if (options.routeSchema) {
    const safeJsonLd = JSON.stringify(options.routeSchema).replaceAll('</script>', '<\\/script>');
    extraHeadTags.push(
      `    <script type="application/ld+json" id="schema-route">${safeJsonLd}</script>`,
    );
  }

  if (extraHeadTags.length > 0) {
    html = html.replace('</head>', `${extraHeadTags.join('\n')}\n  </head>`);
  }

  html = html.replace(
    /<!--PRERENDER_ROOT_START-->[\s\S]*?<!--PRERENDER_ROOT_END-->/,
    () => `<!--PRERENDER_ROOT_START-->\n      ${options.prerenderHtml}\n      <!--PRERENDER_ROOT_END-->`,
  );

  return html;
}

export default defineConfig(() => {
  const resolvedSiteOrigin = (
    process.env.VITE_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : '') ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '') ||
    'https://www.selmanutku.com'
  ).replace(/\/+$/, '');

  const googleVerificationToken = (process.env.VITE_GOOGLE_SITE_VERIFICATION || '').trim();

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'resolve-canonical-origin-and-verification',
        transformIndexHtml(html: string): string {
          let updated = rewriteOriginUrls(html, resolvedSiteOrigin);
          if (googleVerificationToken && !/name=["']google-site-verification["']/i.test(updated)) {
            updated = updated.replace(
              '<meta name="viewport"',
              `<meta name="google-site-verification" content="${escapeHtml(googleVerificationToken)}" />\n    <meta name="viewport"`,
            );
          }
          return updated;
        },
      },
      // Generates dedicated static HTML files with visible Wave-1 semantic HTML inside #root
      // for ALL bilingual routes (EN + TR): /tr, /projects/*, /projeler/*, /research/*, /arastirma/*
      // and keeps sitemap.xml, robots.txt, llms.txt, llms-full.txt, and knowledge-graph.json origin-synced.
      {
        name: 'generate-static-seo-routes',
        apply: 'build',
        closeBundle(error?: Error): void {
          if (error) {
            return;
          }
          const distDir = path.resolve(__dirname, 'dist');
          const indexHtmlPath = path.join(distDir, 'index.html');
          if (!fs.existsSync(indexHtmlPath)) {
            return;
          }

          // Sync all static discovery endpoints in dist/ to resolvedSiteOrigin
          for (const assetName of [
            'sitemap.xml',
            'robots.txt',
            'llms.txt',
            'llms-full.txt',
            'knowledge-graph.json',
          ]) {
            const filePath = path.join(distDir, assetName);
            if (fs.existsSync(filePath)) {
              const raw = fs.readFileSync(filePath, 'utf-8');
              fs.writeFileSync(filePath, rewriteOriginUrls(raw, resolvedSiteOrigin), 'utf-8');
            }
          }

          const templateHtml = fs.readFileSync(indexHtmlPath, 'utf-8');
          const projectsByLang = {
            en: getProjects('en'),
            tr: getProjects('tr'),
          };
          const articlesByLang = {
            en: getArticles('en'),
            tr: getArticles('tr'),
          };

          // 1. Pre-generate Turkish homepage (/tr)
          const trHomePrerender = `<main lang="tr" class="mx-auto max-w-[960px] px-6 py-20 text-[#0A192F]">
        <p class="text-[13px] font-medium text-[#145DA0]">Dijital Dönüşüm | İnovasyon | Spor Teknolojileri</p>
        <h1 class="mt-3 text-[36px] font-bold tracking-[-0.03em] text-[#0A192F]">Selman Utku – Spor Teknolojileri, Spor Bilişimi ve Spor Yönetimi</h1>
        <p class="mt-4 text-[17px] leading-[1.7] text-[#334155]">İstanbul merkezli Tech Analyst, <strong>Bilişim Vadisi Spor Teknolojileri Mentoru</strong> ve SportTech girişimcisi. Spor yönetimi, spor bilişimi, spor teknolojileri, dijital dönüşüm, inovasyon yönetimi ve yapay zekâ otomasyonu alanlarının kesişiminde çalışmalarımızı sürdürüyoruz.</p>
        <section class="mt-10 border-t border-[#E2E8F0] pt-8">
          <h2 class="text-[20px] font-semibold text-[#0C2340]">Temel Referans Alanları</h2>
          <ul class="mt-4 space-y-3 text-[15px] leading-[1.65] text-[#475569]">
            <li><strong>Spor Teknolojileri (SportTech):</strong> Spor kulüpleri, federasyonlar ve akademiler için SaaS yönetim platformları, ekosistem inşası ve yapay zekâ destekli dijital çözümler.</li>
            <li><strong>Spor Bilişimi (Sports Informatics):</strong> Bilgi sistemleri, veri modelleme ve spor bilimlerini birleştiren kurumsal karar destek mimarileri.</li>
            <li><strong>Spor Yönetimi (Sports Management):</strong> Spor kulüpleri, federasyonlar ve tesisler için veriye dayalı, sürdürülebilir dijital dönüşüm stratejileri.</li>
          </ul>
        </section>
        <section class="mt-10 border-t border-[#E2E8F0] pt-8">
          <h2 class="text-[20px] font-semibold text-[#0C2340]">Mentorluk ve Kurulan Girişimler</h2>
          <ul class="mt-4 space-y-3 text-[15px] leading-[1.65] text-[#475569]">
            <li><strong>Bilişim Vadisi – Spor Teknolojileri Mentoru:</strong> Spor teknolojileri ve spor bilişimi girişimlerine ürün stratejisi, iş modeli ve ticarileşme mentorluğu.</li>
            ${projectsByLang.tr
              .map(
                (p) =>
                  `<li><a href="${escapeHtml(resolvedSiteOrigin)}${escapeHtml(getProjectPath(p.slug, 'tr'))}" class="font-semibold text-[#145DA0] underline">${escapeHtml(p.title)}</a>${p.projectUrl ? ` (<a href="${escapeHtml(p.projectUrl)}">${escapeHtml(p.projectUrlLabel || p.projectUrl)}</a>)` : ''} – ${escapeHtml(p.shortDescription)}</li>`,
              )
              .join('\n            ')}
          </ul>
        </section>
        <section class="mt-10 border-t border-[#E2E8F0] pt-8">
          <h2 class="text-[20px] font-semibold text-[#0C2340]">Araştırma ve Yayınlar</h2>
          <ul class="mt-4 space-y-2 text-[15px] leading-[1.65] text-[#145DA0]">
            ${articlesByLang.tr
              .map(
                (a) =>
                  `<li><a href="${escapeHtml(resolvedSiteOrigin)}${escapeHtml(getArticlePath(a.slug, 'tr'))}">${escapeHtml(a.title)}</a></li>`,
              )
              .join('\n            ')}
          </ul>
        </section>
        <footer class="mt-10 border-t border-[#E2E8F0] pt-6 text-[14px] text-[#475569]">
          <p><a href="${escapeHtml(resolvedSiteOrigin)}/" class="font-medium text-[#145DA0] underline">English Version (/)</a> · <a href="mailto:iletisim@selmanutku.com">iletisim@selmanutku.com</a></p>
        </footer>
      </main>`;

          const trHomeHtml = buildRouteHtml(templateHtml, {
            origin: resolvedSiteOrigin,
            lang: 'tr',
            routePath: '/tr',
            enPath: '/',
            trPath: '/tr',
            title: 'Selman Utku – Dijital Dönüşüm, İnovasyon & Spor Teknolojileri',
            description:
              'Selman Utku – Tech Analyst, Bilişim Vadisi Spor Teknolojileri Mentoru ve SportTech Türkiye, Sporsepeti & SportsFly kurucusu. Spor teknolojileri, spor bilişimi ve spor yönetimi referans portfolyosu.',
            ogType: 'profile',
            routeSchema: {
              '@context': 'https://schema.org',
              '@type': 'ProfilePage',
              name: 'Selman Utku – Dijital Dönüşüm, İnovasyon & Spor Teknolojileri',
              url: `${resolvedSiteOrigin}/tr`,
              inLanguage: 'tr-TR',
              mainEntity: {'@id': `${resolvedSiteOrigin}/#person`},
            },
            prerenderHtml: trHomePrerender,
          });
          const trDir = path.join(distDir, 'tr');
          fs.mkdirSync(trDir, {recursive: true});
          fs.writeFileSync(path.join(trDir, 'index.html'), trHomeHtml, 'utf-8');

          // 2. Pre-generate bilingual project detail routes (/projects/* & /projeler/*)
          for (const lang of ['en', 'tr'] as const) {
            const folder = lang === 'tr' ? 'projeler' : 'projects';
            for (const project of projectsByLang[lang]) {
              const routePath = getProjectPath(project.slug, lang);
              const enPath = getProjectPath(project.slug, 'en');
              const trPath = getProjectPath(project.slug, 'tr');
              const routeUrl = `${resolvedSiteOrigin}${routePath}`;
              const homeUrl = `${resolvedSiteOrigin}${getHomePath(lang)}`;
              const projectsSectionUrl = `${resolvedSiteOrigin}${getSectionHref('projects', lang)}`;
              const imageUrl = project.coverImage.startsWith('http')
                ? project.coverImage
                : `${resolvedSiteOrigin}${project.coverImage.startsWith('/') ? '' : '/'}${project.coverImage}`;
              const entityId = `${routeUrl}#entity`;
              const isSoftware = project.slug === 'sportsfly';

              const entityNode = isSoftware
                ? {
                    '@type': 'SoftwareApplication',
                    '@id': entityId,
                    name: project.title,
                    url: project.projectUrl || routeUrl,
                    mainEntityOfPage: routeUrl,
                    applicationCategory: 'BusinessApplication',
                    operatingSystem: 'Web',
                    image: imageUrl,
                    description: project.overview,
                    creator: {'@id': `${resolvedSiteOrigin}/#person`},
                  }
                : {
                    '@type': 'Organization',
                    '@id': entityId,
                    name: project.title,
                    url: project.projectUrl || routeUrl,
                    mainEntityOfPage: routeUrl,
                    logo: imageUrl,
                    description: project.overview,
                    founder: {'@id': `${resolvedSiteOrigin}/#person`},
                    areaServed: 'TR',
                  };

              const routeSchema = {
                '@context': 'https://schema.org',
                '@graph': [
                  entityNode,
                  {
                    '@type': 'CreativeWork',
                    '@id': `${routeUrl}#case-study`,
                    name: project.title,
                    description: project.seoDescription,
                    inLanguage: lang === 'tr' ? 'tr-TR' : 'en-US',
                    genre: project.category,
                    keywords: project.technologies.join(', '),
                    image: imageUrl,
                    url: routeUrl,
                    sameAs: project.projectUrl ? [project.projectUrl] : undefined,
                    about: {'@id': entityId},
                    author: {'@id': `${resolvedSiteOrigin}/#person`},
                    creator: {'@id': `${resolvedSiteOrigin}/#person`},
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
                        name: lang === 'tr' ? 'Projeler' : 'Projects',
                        item: projectsSectionUrl,
                      },
                      {
                        '@type': 'ListItem',
                        position: 3,
                        name: project.title,
                        item: routeUrl,
                      },
                    ],
                  },
                ],
              };

              const externalLinkHtml = project.projectUrl
                ? `<p class="mt-4"><strong>${lang === 'tr' ? 'Resmi Web Sitesi' : 'Official Website'}:</strong> <a href="${escapeHtml(project.projectUrl)}" class="text-[#145DA0] underline">${escapeHtml(project.projectUrl)}</a></p>`
                : '';

              const prerenderHtml = `<main lang="${lang}" class="mx-auto max-w-[960px] px-6 py-20 text-[#0A192F]">
        <p class="text-[13px] text-[#475569]"><a href="${escapeHtml(homeUrl)}" class="text-[#145DA0] underline">Selman Utku</a> / ${lang === 'tr' ? 'Projeler' : 'Projects'} / ${escapeHtml(project.title)}</p>
        <h1 class="mt-3 text-[34px] font-bold tracking-[-0.03em] text-[#0A192F]">${escapeHtml(project.title)} – ${escapeHtml(project.category)}</h1>
        <p class="mt-4 text-[17px] leading-[1.7] text-[#334155]">${escapeHtml(project.overview)}</p>
        ${externalLinkHtml}
        <h2 class="mt-8 text-[20px] font-semibold text-[#0C2340]">${lang === 'tr' ? 'Problem ve İhtiyaç' : 'Problem &amp; Need'}</h2>
        ${project.problemAndNeed.map((p) => `<p class="mt-3 text-[15px] leading-[1.65] text-[#475569]">${escapeHtml(p)}</p>`).join('')}
        <h2 class="mt-8 text-[20px] font-semibold text-[#0C2340]">${lang === 'tr' ? 'Geliştirilen Çözüm' : 'Solution Architecture'}</h2>
        <ul class="mt-3 list-disc pl-5 space-y-2 text-[15px] text-[#475569]">${project.solutionDeveloped.map((s) => `<li>${escapeHtml(s)}</li>`).join('')}</ul>
        <h2 class="mt-8 text-[20px] font-semibold text-[#0C2340]">${lang === 'tr' ? 'Proje Çıktıları' : 'Key Outcomes'}</h2>
        <ul class="mt-3 list-disc pl-5 space-y-2 text-[15px] text-[#475569]">${project.outcomes.map((o) => `<li>${escapeHtml(o)}</li>`).join('')}</ul>
        <p class="mt-8 text-[14px] text-[#475569]">${lang === 'tr' ? 'Kurucu' : 'Founded by'}: <a href="${escapeHtml(homeUrl)}" class="text-[#145DA0] underline">Selman Utku</a> · <a href="mailto:iletisim@selmanutku.com">iletisim@selmanutku.com</a></p>
      </main>`;

              const routeHtml = buildRouteHtml(templateHtml, {
                origin: resolvedSiteOrigin,
                lang,
                routePath,
                enPath,
                trPath,
                title: project.seoTitle,
                description: project.seoDescription,
                ogType: 'website',
                routeSchema,
                prerenderHtml,
              });

              const outDir = path.join(distDir, folder, project.slug);
              fs.mkdirSync(outDir, {recursive: true});
              fs.writeFileSync(path.join(outDir, 'index.html'), routeHtml, 'utf-8');
            }
          }

          // 3. Pre-generate bilingual research routes (/research/* & /arastirma/*)
          for (const lang of ['en', 'tr'] as const) {
            const folder = lang === 'tr' ? 'arastirma' : 'research';
            for (const article of articlesByLang[lang]) {
              const routePath = getArticlePath(article.slug, lang);
              const enPath = getArticlePath(article.slug, 'en');
              const trPath = getArticlePath(article.slug, 'tr');
              const routeUrl = `${resolvedSiteOrigin}${routePath}`;
              const homeUrl = `${resolvedSiteOrigin}${getHomePath(lang)}`;
              const researchSectionUrl = `${resolvedSiteOrigin}${getSectionHref('research', lang)}`;
              const normalizedCover = article.coverImage.startsWith('/')
                ? article.coverImage
                : `/${article.coverImage}`;
              const imageUrl = `${resolvedSiteOrigin}${normalizedCover}`;

              const routeSchema = {
                '@context': 'https://schema.org',
                '@graph': [
                  {
                    '@type': 'Article',
                    '@id': `${routeUrl}#article`,
                    headline: article.title,
                    description: article.seoDescription,
                    inLanguage: lang === 'tr' ? 'tr-TR' : 'en-US',
                    articleSection: article.category,
                    datePublished: article.isoDate,
                    dateModified: article.isoDate,
                    image: imageUrl,
                    author: {'@id': `${resolvedSiteOrigin}/#person`},
                    publisher: {'@id': `${resolvedSiteOrigin}/#person`},
                    mainEntityOfPage: {
                      '@type': 'WebPage',
                      '@id': routeUrl,
                    },
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

              const prerenderHtml = `<main lang="${lang}" class="mx-auto max-w-[820px] px-6 py-20 text-[#0A192F]">
        <p class="text-[13px] text-[#475569]"><a href="${escapeHtml(homeUrl)}" class="text-[#145DA0] underline">Selman Utku</a> / ${lang === 'tr' ? 'Araştırma' : 'Research'} / ${escapeHtml(article.category)}</p>
        <h1 class="mt-3 text-[34px] font-bold tracking-[-0.03em] text-[#0A192F]">${escapeHtml(article.title)}</h1>
        <p class="mt-4 text-[17px] leading-[1.7] text-[#334155]">${escapeHtml(article.excerpt)}</p>
        <h2 class="mt-8 text-[20px] font-semibold text-[#0C2340]">${lang === 'tr' ? 'Öne Çıkan Bulgular' : 'Key Takeaways'}</h2>
        <ul class="mt-3 list-disc pl-5 space-y-2 text-[15px] text-[#475569]">${article.keyTakeaways.map((k) => `<li>${escapeHtml(k)}</li>`).join('')}</ul>
        ${article.sections.map((sec) => `<section class="mt-8"><h2 class="text-[20px] font-semibold text-[#0C2340]">${escapeHtml(sec.heading)}</h2>${sec.paragraphs.map((p) => `<p class="mt-3 text-[15px] leading-[1.65] text-[#475569]">${escapeHtml(p)}</p>`).join('')}</section>`).join('')}
        <p class="mt-8 text-[14px] text-[#475569]">${lang === 'tr' ? 'Araştırmacı' : 'Author'}: <a href="${escapeHtml(homeUrl)}" class="text-[#145DA0] underline">Selman Utku</a> · <a href="mailto:iletisim@selmanutku.com">iletisim@selmanutku.com</a></p>
      </main>`;

              const routeHtml = buildRouteHtml(templateHtml, {
                origin: resolvedSiteOrigin,
                lang,
                routePath,
                enPath,
                trPath,
                title: article.seoTitle,
                description: article.seoDescription,
                ogType: 'article',
                ogImagePath: normalizedCover,
                ogImageWidth: 1200,
                ogImageHeight: 630,
                publishedTime: article.isoDate,
                routeSchema,
                prerenderHtml,
              });

              const outDir = path.join(distDir, folder, article.slug);
              fs.mkdirSync(outDir, {recursive: true});
              fs.writeFileSync(path.join(outDir, 'index.html'), routeHtml, 'utf-8');
            }
          }

          // 4. Pre-generate private noindex inbox shells (/mesajlar, /tr/mesajlar, /inbox)
          // so static hosts like Vercel with cleanUrls:true always return HTTP 200 directly.
          const inboxRoutes: Array<{
            dirParts: string[];
            routePath: string;
            lang: RouteLanguage;
            title: string;
            description: string;
            loadingText: string;
          }> = [
            {
              dirParts: ['mesajlar'],
              routePath: '/mesajlar',
              lang: 'tr',
              title: 'Mesaj Kutusu | Selman Utku',
              description: 'İletişim formu mesajları yönetim ekranı.',
              loadingText: 'Mesaj kutusu yükleniyor...',
            },
            {
              dirParts: ['tr', 'mesajlar'],
              routePath: '/tr/mesajlar',
              lang: 'tr',
              title: 'Mesaj Kutusu | Selman Utku',
              description: 'İletişim formu mesajları yönetim ekranı.',
              loadingText: 'Mesaj kutusu yükleniyor...',
            },
            {
              dirParts: ['inbox'],
              routePath: '/inbox',
              lang: 'en',
              title: 'Inbox | Selman Utku',
              description: 'Private contact form submissions inbox.',
              loadingText: 'Loading inbox...',
            },
          ];

          for (const inboxRoute of inboxRoutes) {
            const inboxHtml = buildRouteHtml(templateHtml, {
              origin: resolvedSiteOrigin,
              lang: inboxRoute.lang,
              routePath: inboxRoute.routePath,
              enPath: '/inbox',
              trPath: '/mesajlar',
              title: inboxRoute.title,
              description: inboxRoute.description,
              ogType: 'website',
              noIndex: true,
              prerenderHtml: `<main lang="${inboxRoute.lang}" class="mx-auto max-w-[480px] px-6 py-24 text-center text-[#465B71]"><p class="text-[14.5px]">${escapeHtml(inboxRoute.loadingText)}</p></main>`,
            });
            const inboxOutDir = path.join(distDir, ...inboxRoute.dirParts);
            fs.mkdirSync(inboxOutDir, {recursive: true});
            fs.writeFileSync(path.join(inboxOutDir, 'index.html'), inboxHtml, 'utf-8');
          }
        },
      },
      // Copies src/assets into dist/ so root-relative URLs like
      // "/src/assets/images/..." (e.g. generate_image output) still resolve
      // in production builds. Do not remove.
      {
        name: 'copy-unbundled-src-assets',
        apply: 'build',
        closeBundle(error?: Error): void {
          if (error) {
            return;
          }
          const distDir = path.resolve(__dirname, 'dist');
          const srcAssets = path.resolve(__dirname, 'src/assets');
          const distAssets = path.resolve(distDir, 'src/assets');
          if (fs.existsSync(distDir) && fs.existsSync(srcAssets)) {
            fs.cpSync(srcAssets, distAssets, {recursive: true, force: true});
          }
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
