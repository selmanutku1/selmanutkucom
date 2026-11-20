import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig} from 'vite';
import {getArticles} from './src/data/articles';
import {getProjects} from './src/data/projects';

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function replaceMetaByName(html: string, name: string, content: string): string {
  const escaped = escapeHtml(content);
  const regex = new RegExp(
    `<meta\\s+[^>]*name=["']${name}["'][^>]*>`,
    'i',
  );
  return html.replace(regex, `<meta name="${name}" content="${escaped}" />`);
}

function replaceMetaByProperty(html: string, property: string, content: string): string {
  const escaped = escapeHtml(content);
  const regex = new RegExp(
    `<meta\\s+[^>]*property=["']${property}["'][^>]*>`,
    'i',
  );
  return html.replace(regex, `<meta property="${property}" content="${escaped}" />`);
}

function buildRouteHtml(
  templateHtml: string,
  options: {
    origin: string;
    routePath: string;
    title: string;
    description: string;
    ogType: 'website' | 'article';
    publishedTime?: string;
    routeSchema: Record<string, unknown>;
    noscriptHtml: string;
  },
): string {
  const canonicalUrl = `${options.origin}${options.routePath}`;
  let html = templateHtml;

  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(options.title)}</title>`);
  html = replaceMetaByName(html, 'description', options.description);
  html = replaceMetaByProperty(html, 'og:type', options.ogType);
  html = replaceMetaByProperty(html, 'og:title', options.title);
  html = replaceMetaByProperty(html, 'og:description', options.description);
  html = replaceMetaByProperty(html, 'og:url', canonicalUrl);
  html = replaceMetaByName(html, 'twitter:title', options.title);
  html = replaceMetaByName(html, 'twitter:description', options.description);

  // Update canonical and hreflang links to the route-specific URL
  html = html.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
    `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`,
  );
  html = html.replace(
    /<link\s+rel="alternate"\s+hreflang="en"\s+href="[^"]*"\s*\/?>/i,
    `<link rel="alternate" hreflang="en" href="${escapeHtml(canonicalUrl)}" />`,
  );
  html = html.replace(
    /<link\s+rel="alternate"\s+hreflang="tr-TR"\s+href="[^"]*"\s*\/?>/i,
    `<link rel="alternate" hreflang="tr-TR" href="${escapeHtml(canonicalUrl)}" />`,
  );
  html = html.replace(
    /<link\s+rel="alternate"\s+hreflang="x-default"\s+href="[^"]*"\s*\/?>/i,
    `<link rel="alternate" hreflang="x-default" href="${escapeHtml(canonicalUrl)}" />`,
  );

  // Remove homepage profile:* meta tags on subpages
  html = html.replace(/<meta\s+property="profile:first_name"[^>]*>\s*/gi, '');
  html = html.replace(/<meta\s+property="profile:last_name"[^>]*>\s*/gi, '');

  const extraHeadTags: string[] = [];
  if (options.publishedTime) {
    extraHeadTags.push(
      `    <meta property="article:published_time" content="${escapeHtml(options.publishedTime)}" />`,
    );
  }
  const safeJsonLd = JSON.stringify(options.routeSchema).replaceAll('</script>', '<\\/script>');
  extraHeadTags.push(
    `    <script type="application/ld+json" id="schema-route">${safeJsonLd}</script>`,
  );

  html = html.replace('</head>', `${extraHeadTags.join('\n')}\n  </head>`);
  html = html.replace(
    /<noscript>[\s\S]*?<\/noscript>/i,
    `<noscript>\n      ${options.noscriptHtml}\n    </noscript>`,
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
    'https://selmanutku.com'
  ).replace(/\/+$/, '');

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'resolve-og-image-origin',
        transformIndexHtml(html: string): string {
          if (resolvedSiteOrigin === 'https://selmanutku.com') {
            return html;
          }
          return html
            .replaceAll('https://selmanutku.com/og-image.png', `${resolvedSiteOrigin}/og-image.png`)
            .replaceAll(
              'content="https://selmanutku.com/"',
              `content="${resolvedSiteOrigin}/"`,
            );
        },
      },
      // Generates dedicated static HTML files for every internal project and research route
      // so search engines and zero-JS AI crawlers (OAI-SearchBot, PerplexityBot, ClaudeBot, GPTBot)
      // receive unique canonical, Open Graph, Schema.org JSON-LD, and semantic content per URL.
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

          const templateHtml = fs.readFileSync(indexHtmlPath, 'utf-8');
          const projectsEn = getProjects('en');
          const projectsTr = getProjects('tr');
          const articlesEn = getArticles('en');
          const articlesTr = getArticles('tr');

          // 1. Pre-generate internal project detail routes (/projeler/<slug>)
          for (const projectEn of projectsEn) {
            const projectTr = projectsTr.find((item) => item.slug === projectEn.slug);
            const routePath = `/projeler/${projectEn.slug}`;
            const routeUrl = `${resolvedSiteOrigin}${routePath}`;
            const imageUrl = projectEn.coverImage.startsWith('http')
              ? projectEn.coverImage
              : `${resolvedSiteOrigin}${projectEn.coverImage.startsWith('/') ? '' : '/'}${projectEn.coverImage}`;
            const entityId = `${routeUrl}#entity`;
            const isSoftware = projectEn.slug === 'sportsfly';

            const entityNode = isSoftware
              ? {
                  '@type': 'SoftwareApplication',
                  '@id': entityId,
                  name: projectEn.title,
                  url: projectEn.projectUrl || routeUrl,
                  mainEntityOfPage: routeUrl,
                  applicationCategory: 'BusinessApplication',
                  operatingSystem: 'Web',
                  image: imageUrl,
                  description: projectEn.overview,
                  creator: {'@id': `${resolvedSiteOrigin}/#person`},
                }
              : {
                  '@type': 'Organization',
                  '@id': entityId,
                  name: projectEn.title,
                  url: projectEn.projectUrl || routeUrl,
                  mainEntityOfPage: routeUrl,
                  logo: imageUrl,
                  description: projectEn.overview,
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
                  name: projectEn.title,
                  description: projectEn.seoDescription,
                  inLanguage: ['en-US', 'tr-TR'],
                  genre: projectEn.category,
                  keywords: projectEn.technologies.join(', '),
                  image: imageUrl,
                  url: routeUrl,
                  sameAs: projectEn.projectUrl ? [projectEn.projectUrl] : undefined,
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
                      name: 'Home',
                      item: `${resolvedSiteOrigin}/`,
                    },
                    {
                      '@type': 'ListItem',
                      position: 2,
                      name: 'Projects',
                      item: `${resolvedSiteOrigin}/#projeler`,
                    },
                    {
                      '@type': 'ListItem',
                      position: 3,
                      name: projectEn.title,
                      item: routeUrl,
                    },
                  ],
                },
              ],
            };

            const externalLinkHtml = projectEn.projectUrl
              ? `<p><strong>Official Website:</strong> <a href="${escapeHtml(projectEn.projectUrl)}">${escapeHtml(projectEn.projectUrl)}</a></p>`
              : '';
            const trBlockHtml = projectTr
              ? `<section lang="tr"><h2>${escapeHtml(projectTr.title)} (Türkçe Özet)</h2><p>${escapeHtml(projectTr.overview)}</p><ul>${projectTr.outcomes.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul></section>`
              : '';

            const noscriptHtml = `<main style="max-width:860px;margin:40px auto;padding:0 24px;font-family:sans-serif;line-height:1.6;color:#0A192F;">
        <p><a href="${escapeHtml(resolvedSiteOrigin)}/">Selman Utku</a> / Projects / ${escapeHtml(projectEn.title)}</p>
        <h1>${escapeHtml(projectEn.title)} – ${escapeHtml(projectEn.category)}</h1>
        <p>${escapeHtml(projectEn.overview)}</p>
        ${externalLinkHtml}
        <h2>Problem &amp; Need</h2>
        ${projectEn.problemAndNeed.map((p) => `<p>${escapeHtml(p)}</p>`).join('')}
        <h2>Solution Architecture</h2>
        <ul>${projectEn.solutionDeveloped.map((s) => `<li>${escapeHtml(s)}</li>`).join('')}</ul>
        <h2>Key Outcomes</h2>
        <ul>${projectEn.outcomes.map((o) => `<li>${escapeHtml(o)}</li>`).join('')}</ul>
        <h2>Capabilities &amp; Stack</h2>
        <p>${escapeHtml(projectEn.technologies.join(' · '))}</p>
        ${trBlockHtml}
        <p>Founded by <a href="${escapeHtml(resolvedSiteOrigin)}/">Selman Utku</a> · Istanbul, Türkiye · <a href="mailto:info@selmanutku.com">info@selmanutku.com</a></p>
      </main>`;

            const routeHtml = buildRouteHtml(templateHtml, {
              origin: resolvedSiteOrigin,
              routePath,
              title: projectEn.seoTitle,
              description: projectEn.seoDescription,
              ogType: 'website',
              routeSchema,
              noscriptHtml,
            });

            const outDir = path.join(distDir, 'projeler', projectEn.slug);
            fs.mkdirSync(outDir, {recursive: true});
            fs.writeFileSync(path.join(outDir, 'index.html'), routeHtml, 'utf-8');
          }

          // 2. Pre-generate internal research routes (/yazilar/<slug>)
          for (const articleEn of articlesEn) {
            const articleTr = articlesTr.find((item) => item.slug === articleEn.slug);
            const routePath = `/yazilar/${articleEn.slug}`;
            const routeUrl = `${resolvedSiteOrigin}${routePath}`;
            const imageUrl = `${resolvedSiteOrigin}/og-image.png`;

            const routeSchema = {
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Article',
                  '@id': `${routeUrl}#article`,
                  headline: articleEn.title,
                  description: articleEn.seoDescription,
                  inLanguage: ['en-US', 'tr-TR'],
                  articleSection: articleEn.category,
                  datePublished: articleEn.isoDate,
                  dateModified: articleEn.isoDate,
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
                      name: 'Home',
                      item: `${resolvedSiteOrigin}/`,
                    },
                    {
                      '@type': 'ListItem',
                      position: 2,
                      name: 'Research',
                      item: `${resolvedSiteOrigin}/#yazilar`,
                    },
                    {
                      '@type': 'ListItem',
                      position: 3,
                      name: articleEn.title,
                      item: routeUrl,
                    },
                  ],
                },
              ],
            };

            const trArticleHtml = articleTr
              ? `<section lang="tr"><h2>${escapeHtml(articleTr.title)}</h2><p>${escapeHtml(articleTr.excerpt)}</p><ul>${articleTr.keyTakeaways.map((k) => `<li>${escapeHtml(k)}</li>`).join('')}</ul></section>`
              : '';

            const noscriptHtml = `<main style="max-width:860px;margin:40px auto;padding:0 24px;font-family:sans-serif;line-height:1.6;color:#0A192F;">
        <p><a href="${escapeHtml(resolvedSiteOrigin)}/">Selman Utku</a> / Research / ${escapeHtml(articleEn.category)}</p>
        <h1>${escapeHtml(articleEn.title)}</h1>
        <p>${escapeHtml(articleEn.excerpt)}</p>
        <h2>Key Takeaways</h2>
        <ul>${articleEn.keyTakeaways.map((k) => `<li>${escapeHtml(k)}</li>`).join('')}</ul>
        ${articleEn.sections.map((sec) => `<section><h2>${escapeHtml(sec.heading)}</h2>${sec.paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join('')}</section>`).join('')}
        ${trArticleHtml}
        <p>Author: <a href="${escapeHtml(resolvedSiteOrigin)}/">Selman Utku</a> · Istanbul, Türkiye · <a href="mailto:info@selmanutku.com">info@selmanutku.com</a></p>
      </main>`;

            const routeHtml = buildRouteHtml(templateHtml, {
              origin: resolvedSiteOrigin,
              routePath,
              title: articleEn.seoTitle,
              description: articleEn.seoDescription,
              ogType: 'article',
              publishedTime: articleEn.isoDate,
              routeSchema,
              noscriptHtml,
            });

            const outDir = path.join(distDir, 'yazilar', articleEn.slug);
            fs.mkdirSync(outDir, {recursive: true});
            fs.writeFileSync(path.join(outDir, 'index.html'), routeHtml, 'utf-8');
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
