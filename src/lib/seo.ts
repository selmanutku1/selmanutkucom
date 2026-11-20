import { useEffect } from 'react';
import { SITE_CONFIG } from '../data/profile';
import type { Language } from './i18n';

export interface SEOConfig {
  title: string;
  description: string;
  path?: string;
  type?: 'website' | 'article' | 'profile';
  lang?: Language;
  image?: string;
  imageAlt?: string;
  publishedTime?: string;
  modifiedTime?: string;
  noIndex?: boolean;
  jsonLd?: Record<string, unknown>;
}

function setMetaTag(selector: string, attribute: 'name' | 'property', key: string, content: string) {
  let element = document.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function removeMetaTag(selector: string) {
  const element = document.querySelector(selector);
  if (element) {
    element.remove();
  }
}

function setLinkTag(selector: string, attrs: Record<string, string>) {
  let element = document.querySelector<HTMLLinkElement>(selector);
  if (!element) {
    element = document.createElement('link');
    document.head.appendChild(element);
  }
  Object.entries(attrs).forEach(([k, v]) => {
    element!.setAttribute(k, v);
  });
}

function resolveAbsoluteUrl(origin: string, assetPath: string): string {
  if (/^https?:\/\//i.test(assetPath)) {
    return assetPath;
  }
  const normalized = assetPath.startsWith('/') ? assetPath : `/${assetPath}`;
  return `${origin}${normalized}`;
}

export function useDocumentSEO({
  title,
  description,
  path = '/',
  type = 'website',
  lang = 'en',
  image = SITE_CONFIG.ogImage,
  imageAlt,
  publishedTime,
  modifiedTime,
  noIndex = false,
  jsonLd,
}: SEOConfig) {
  useEffect(() => {
    document.title = title;
    document.documentElement.lang = lang;

    const cleanOrigin =
      typeof window !== 'undefined' && window.location.origin
        ? window.location.origin
        : SITE_CONFIG.siteUrl;
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    const canonicalUrl = `${cleanOrigin}${normalizedPath}`;
    const resolvedImage = resolveAbsoluteUrl(cleanOrigin, image || SITE_CONFIG.ogImage);
    const resolvedImageAlt =
      imageAlt ||
      (lang === 'tr'
        ? 'Selman Utku – Dijital Dönüşüm, İnovasyon ve Spor Teknolojileri'
        : 'Selman Utku – Digital Transformation, Innovation & Sports Technology');

    const robotsContent = noIndex
      ? 'noindex, follow'
      : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

    setMetaTag('meta[name="description"]', 'name', 'description', description);
    setMetaTag('meta[name="robots"]', 'name', 'robots', robotsContent);

    // Open Graph
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', type);
    setMetaTag(
      'meta[property="og:locale"]',
      'property',
      'og:locale',
      lang === 'tr' ? 'tr_TR' : 'en_US',
    );
    setMetaTag(
      'meta[property="og:locale:alternate"]',
      'property',
      'og:locale:alternate',
      lang === 'tr' ? 'en_US' : 'tr_TR',
    );
    setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', SITE_CONFIG.fullName);
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', title);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', resolvedImage);
    setMetaTag('meta[property="og:image:secure_url"]', 'property', 'og:image:secure_url', resolvedImage);
    setMetaTag('meta[property="og:image:alt"]', 'property', 'og:image:alt', resolvedImageAlt);

    if (image === SITE_CONFIG.ogImage) {
      setMetaTag('meta[property="og:image:type"]', 'property', 'og:image:type', 'image/png');
      setMetaTag(
        'meta[property="og:image:width"]',
        'property',
        'og:image:width',
        String(SITE_CONFIG.ogImageWidth),
      );
      setMetaTag(
        'meta[property="og:image:height"]',
        'property',
        'og:image:height',
        String(SITE_CONFIG.ogImageHeight),
      );
    } else {
      removeMetaTag('meta[property="og:image:width"]');
      removeMetaTag('meta[property="og:image:height"]');
      removeMetaTag('meta[property="og:image:type"]');
    }

    // Twitter / X Card
    setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', resolvedImage);
    setMetaTag('meta[name="twitter:image:alt"]', 'name', 'twitter:image:alt', resolvedImageAlt);

    // Article timestamps
    if (publishedTime) {
      setMetaTag(
        'meta[property="article:published_time"]',
        'property',
        'article:published_time',
        publishedTime,
      );
    } else {
      removeMetaTag('meta[property="article:published_time"]');
    }

    if (modifiedTime) {
      setMetaTag(
        'meta[property="article:modified_time"]',
        'property',
        'article:modified_time',
        modifiedTime,
      );
    } else {
      removeMetaTag('meta[property="article:modified_time"]');
    }

    // Canonical & hreflang links
    setLinkTag('link[rel="canonical"]', {
      rel: 'canonical',
      href: canonicalUrl,
    });
    setLinkTag('link[rel="alternate"][hreflang="tr-TR"]', {
      rel: 'alternate',
      hreflang: 'tr-TR',
      href: canonicalUrl,
    });
    setLinkTag('link[rel="alternate"][hreflang="en"]', {
      rel: 'alternate',
      hreflang: 'en',
      href: canonicalUrl,
    });
    setLinkTag('link[rel="alternate"][hreflang="x-default"]', {
      rel: 'alternate',
      hreflang: 'x-default',
      href: canonicalUrl,
    });

    // Remove any build-time static route schema once SPA takes over route metadata
    const staticRouteSchema = document.getElementById('schema-route');
    if (staticRouteSchema) {
      staticRouteSchema.remove();
    }

    // Dynamic page JSON-LD
    const dynamicSchemaId = 'schema-dynamic-page';
    const existingScript = document.getElementById(dynamicSchemaId);
    if (jsonLd) {
      const script = existingScript || document.createElement('script');
      script.id = dynamicSchemaId;
      script.setAttribute('type', 'application/ld+json');
      script.textContent = JSON.stringify(jsonLd);
      if (!existingScript) {
        document.head.appendChild(script);
      }
    } else if (existingScript) {
      existingScript.remove();
    }
  }, [title, description, path, type, lang, image, imageAlt, publishedTime, modifiedTime, noIndex, jsonLd]);
}
