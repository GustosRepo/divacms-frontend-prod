// SEO and Performance monitoring utilities
type WindowWithGtag = Window & { gtag?: (...args: unknown[]) => void };

export const trackPageView = (url: string) => {
  // Google Analytics 4 pageview tracking
  if (typeof window !== 'undefined' && (window as WindowWithGtag).gtag) {
    const gtag = (window as WindowWithGtag).gtag!;
    gtag('config', 'GA_MEASUREMENT_ID', {
      page_location: url,
    });
  }
};

export const trackEvent = (eventName: string, parameters: Record<string, unknown> = {}) => {
  if (typeof window !== 'undefined' && (window as WindowWithGtag).gtag) {
    const gtag = (window as WindowWithGtag).gtag!;
    gtag('event', eventName, parameters);
  }
};

// Core Web Vitals tracking
export const trackWebVitals = (metric: unknown) => {
  if (typeof window !== 'undefined' && (window as WindowWithGtag).gtag) {
    const gtag = (window as WindowWithGtag).gtag!;
    const m = metric as { name?: string; value?: number; id?: string };
    const name = m?.name ?? 'metric';
    const value = typeof m?.value === 'number' ? m.value : 0;
    const id = m?.id ?? '';
    gtag('event', name, {
      event_category: 'Web Vitals',
      value: Math.round(name === 'CLS' ? value * 1000 : value),
      event_label: id,
      non_interaction: true,
    });
  }
};
