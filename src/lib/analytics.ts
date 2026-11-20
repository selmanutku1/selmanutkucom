declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;

let isInitialized = false;

export function initAnalytics(): void {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID || isInitialized) {
    return;
  }

  isInitialized = true;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_MEASUREMENT_ID)}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer?.push(args);
  };

  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    send_page_view: false,
  });
}

export function trackPageView(path: string, title?: string): void {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID || !window.gtag) {
    return;
  }
  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title || document.title,
  });
}

export function trackEvent(eventName: string, params?: Record<string, string | number | boolean>): void {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID || !window.gtag) {
    return;
  }
  window.gtag('event', eventName, params);
}
