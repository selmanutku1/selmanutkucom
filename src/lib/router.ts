import { useCallback, useEffect, useState } from 'react';
import { trackPageView } from './analytics';

export type AppRoute =
  | { type: 'home' }
  | { type: 'project'; slug: string }
  | { type: 'article'; slug: string };

function parsePathname(pathname: string): AppRoute {
  const clean = pathname.replace(/\/+$/, '') || '/';

  if (clean.startsWith('/projeler/')) {
    const slug = decodeURIComponent(clean.slice('/projeler/'.length));
    if (slug) return { type: 'project', slug };
  }

  if (clean.startsWith('/yazilar/')) {
    const slug = decodeURIComponent(clean.slice('/yazilar/'.length));
    if (slug) return { type: 'article', slug };
  }

  return { type: 'home' };
}

export function useRouter() {
  const [route, setRoute] = useState<AppRoute>(() =>
    typeof window !== 'undefined' ? parsePathname(window.location.pathname) : { type: 'home' },
  );

  useEffect(() => {
    const handlePopState = () => {
      setRoute(parsePathname(window.location.pathname));
      trackPageView(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((to: string) => {
    if (typeof window === 'undefined') return;

    // Handle hash navigation to home sections cleanly from any detail route
    if (to.startsWith('#')) {
      const sectionId = to.slice(1);
      if (window.location.pathname !== '/') {
        window.history.pushState({}, '', `/${to}`);
        setRoute({ type: 'home' });
        trackPageView('/');
        window.setTimeout(() => {
          const el = document.getElementById(sectionId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }, 60);
      } else {
        window.history.replaceState({}, '', to);
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
      return;
    }

    const normalized = to.startsWith('/') ? to : `/${to}`;
    if (window.location.pathname !== normalized) {
      window.history.pushState({}, '', normalized);
    }
    setRoute(parsePathname(normalized));
    trackPageView(normalized);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return { route, navigate };
}
