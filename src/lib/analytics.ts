import { ConsentSettings, GoogleConsentSettings } from '@/types/analytics';

export const ANALYTICS_CONFIG = {
  GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '',
  FACEBOOK_PIXEL_ID: process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || '',
  CLOUDFLARE_TOKEN: process.env.NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN || '',
};

// Google Analytics 4
export const initializeGA = (consentSettings: ConsentSettings) => {
  if (!ANALYTICS_CONFIG.GA_MEASUREMENT_ID || typeof window === 'undefined') return;

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  window.gtag = function() {
    window.dataLayer?.push(arguments);
  };

  // Set default consent state
  window.gtag('consent', 'default', {
    ad_storage: consentSettings.marketing ? 'granted' : 'denied',
    ad_user_data: consentSettings.marketing ? 'granted' : 'denied',
    ad_personalization: consentSettings.marketing ? 'granted' : 'denied',
    analytics_storage: consentSettings.analytics ? 'granted' : 'denied',
    functionality_storage: consentSettings.preferences ? 'granted' : 'denied',
    personalization_storage: consentSettings.preferences ? 'granted' : 'denied',
    security_storage: 'granted',
  });

  // Initialize GA4
  window.gtag('js', new Date());
  window.gtag('config', ANALYTICS_CONFIG.GA_MEASUREMENT_ID, {
    page_title: document.title,
    page_location: window.location.href,
  });
};

// Update Google Consent Mode
export const updateGoogleConsent = (consentSettings: ConsentSettings) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('consent', 'update', {
    ad_storage: consentSettings.marketing ? 'granted' : 'denied',
    ad_user_data: consentSettings.marketing ? 'granted' : 'denied',
    ad_personalization: consentSettings.marketing ? 'granted' : 'denied',
    analytics_storage: consentSettings.analytics ? 'granted' : 'denied',
    functionality_storage: consentSettings.preferences ? 'granted' : 'denied',
    personalization_storage: consentSettings.preferences ? 'granted' : 'denied',
  });
};

// Facebook Pixel
export const initializeFacebookPixel = (consentSettings: ConsentSettings) => {
  if (!ANALYTICS_CONFIG.FACEBOOK_PIXEL_ID || typeof window === 'undefined' || !consentSettings.marketing) return;

  window.fbq = function() {
    if (window.fbq?.callMethod) {
      window.fbq.callMethod.apply(window.fbq, arguments);
    } else {
      window.fbq.queue = window.fbq.queue || [];
      window.fbq.queue.push(arguments);
    }
  };

  if (!window._fbq) window._fbq = window.fbq;
  window.fbq.push = window.fbq;
  window.fbq.loaded = true;
  window.fbq.version = '2.0';
  window.fbq.queue = [];

  window.fbq('init', ANALYTICS_CONFIG.FACEBOOK_PIXEL_ID);
  window.fbq('track', 'PageView');
};

// Cloudflare Web Analytics
export const initializeCloudflareAnalytics = () => {
  if (!ANALYTICS_CONFIG.CLOUDFLARE_TOKEN || typeof window === 'undefined') return;

  const script = document.createElement('script');
  script.defer = true;
  script.src = 'https://static.cloudflareinsights.com/beacon.min.js';
  script.setAttribute('data-cf-beacon', `{"token": "${ANALYTICS_CONFIG.CLOUDFLARE_TOKEN}"}`);
  document.head.appendChild(script);
};

// Vercel Analytics - handled by @vercel/analytics package
export const initializeVercelAnalytics = () => {
  // Vercel Analytics is handled by the @vercel/analytics package
  // No manual initialization needed
};

// Track custom events
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window === 'undefined') return;

  // Google Analytics
  if (window.gtag) {
    window.gtag('event', eventName, parameters);
  }

  // Facebook Pixel
  if (window.fbq) {
    window.fbq('track', eventName, parameters);
  }
};

// Track page view
export const trackPageView = (url: string, title?: string) => {
  if (typeof window === 'undefined') return;

  // Google Analytics
  if (window.gtag) {
    window.gtag('config', ANALYTICS_CONFIG.GA_MEASUREMENT_ID, {
      page_title: title || document.title,
      page_location: url,
    });
  }

  // Facebook Pixel
  if (window.fbq) {
    window.fbq('track', 'PageView');
  }
};

// Initialize all analytics based on consent
export const initializeAnalytics = (consentSettings: ConsentSettings) => {
  if (typeof window === 'undefined') return;

  // Always initialize Cloudflare (minimal privacy impact)
  initializeCloudflareAnalytics();
  
  // Vercel Analytics is handled by @vercel/analytics package

  // Initialize GA4 with consent settings
  initializeGA(consentSettings);

  // Initialize Facebook Pixel only if marketing consent is given
  if (consentSettings.marketing) {
    initializeFacebookPixel(consentSettings);
  }
}; 