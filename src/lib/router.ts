import { useCallback, useEffect, useState } from 'react';
import { trackPageView } from './analytics';
import { useLanguage } from './i18n';
import {
  getHomePath,
  getSectionHref,
  getSectionId,
  resolveSectionKeyFromHash,
} from './routes';

export type AppRoute =
  | { type: 'home' }
  | { type: 'project'; slug: string }
  | { type: 'article'; slug: string };

function parsePathname(pathname: string): AppRoute {
  const clean = pathname.replace(/\/+$/, '') || '/';

  if (clean.startsWith('/projects/')) {
    const slug = decodeURIComponent(clean.slice('/projects/'.length));
    if (slug) return { type: 'project', slug };
  }

  if (clean.startsWith('/projeler/')) {
    const slug = decodeURIComponent(clean.slice('/projeler/'.length));
    if (slug) return { type: 'project', slug };
  }

  if (clean.startsWith('/research/')) {
    const slug = decodeURIComponent(clean.slice('/research/'.length));
    if (slug) return { type: 'article', slug };
  }

  if (clean.startsWith('/arastirma/')) {
    const slug = decodeURIComponent(clean.slice('/arastirma/'.length));
    if (slug) return { type: 'article', slug };
  }

  // Backward compatibility for legacy /yazilar/<slug> links
  if (clean.startsWith('/yazilar/')) {
    const slug = decodeURIComponent(clean.slice('/yazilar/'.length));
    if (slug) return { type: 'article', slug };
  }

  return { type: 'home' };
}

export function useRouter() {
  const { lang } = useLanguage();
  const [route, setRoute] = useState<AppRoute>(() =>
    typeof window !== 'undefined' ? parsePathname(window.location.pathname) : { type: 'home' },
  );

  useEffect(() => {
    const syncRoute = () => {
      setRoute(parsePathname(window.location.pathname));
      trackPageView(`${window.location.pathname}${window.location.hash}`);
    };

    window.addEventListener('popstate', syncRoute);
    window.addEventListener('app:urlchange', syncRoute);
    return () => {
      window.removeEventListener('popstate', syncRoute);
      window.removeEventListener('app:urlchange', syncRoute);
    };
  }, []);

  // Scroll to initial section hash on first load (e.g. /#projects or /tr#projeler)
  useEffect(() => {
    if (typeof window === 'undefined' || !window.location.hash) return;
    const sectionKey = resolveSectionKeyFromHash(window.location.hash);
    if (!sectionKey || sectionKey === 'home') return;
    const targetId = getSectionId(sectionKey, lang);
    window.setTimeout(() => {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 80);
    // Run once on initial mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navigate = useCallback(
    (to: string) => {
      if (typeof window === 'undefined') return;

      const homePath = getHomePath(lang);
      const currentFullUrl = `${window.location.pathname}${window.location.hash}`;

      // 1. Bare homepage navigation ('/' or '/tr') — always clears any #hash and returns to top
      if (to === '/' || to === '/tr') {
        const targetHome = homePath;
        if (currentFullUrl !== targetHome) {
          window.history.pushState({}, '', targetHome);
        }
        setRoute({ type: 'home' });
        trackPageView(targetHome);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      // 2. Hash or home-section navigation ('#about', '#hakkimda', '/#projects', '/tr#projeler', etc.)
      const hashIndex = to.indexOf('#');
      if (hashIndex !== -1) {
        const rawHash = to.slice(hashIndex);
        const sectionKey = resolveSectionKeyFromHash(rawHash);
        const targetId = sectionKey ? getSectionId(sectionKey, lang) : rawHash.slice(1);

        if (sectionKey === 'home') {
          if (currentFullUrl !== homePath) {
            window.history.pushState({}, '', homePath);
          }
          setRoute({ type: 'home' });
          trackPageView(homePath);
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }

        const targetUrl = sectionKey
          ? getSectionHref(sectionKey, lang)
          : `${homePath}#${targetId}`;
        const currentlyOnHome = parsePathname(window.location.pathname).type === 'home';

        if (!currentlyOnHome) {
          window.history.pushState({}, '', targetUrl);
          setRoute({ type: 'home' });
          trackPageView(targetUrl);
          window.setTimeout(() => {
            const el = document.getElementById(targetId);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }, 60);
        } else {
          if (currentFullUrl !== targetUrl) {
            window.history.pushState({}, '', targetUrl);
          }
          const el = document.getElementById(targetId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
        return;
      }

      // 3. Full path navigation (project or research detail routes)
      const normalized = to.startsWith('/') ? to : `/${to}`;
      if (currentFullUrl !== normalized) {
        window.history.pushState({}, '', normalized);
      }
      setRoute(parsePathname(normalized));
      trackPageView(normalized);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [lang],
  );

  return { route, navigate };
}
