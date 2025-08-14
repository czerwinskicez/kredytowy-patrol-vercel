import { ConsentSettings, GoogleConsentSettings } from '@/types/analytics';

export const ANALYTICS_CONFIG = {
  GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '',
  GTM_CONTAINER_ID: process.env.NEXT_PUBLIC_GTM_CONTAINER_ID || '',
  CLARITY_PROJECT_ID: process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || '',
  FACEBOOK_PIXEL_ID: process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || '',
  CLOUDFLARE_TOKEN: process.env.NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN || '',
};

// Analytics debugging and validation
const isDev = process.env.NODE_ENV === 'development';

const logAnalyticsEvent = (source: string, event: string, data?: any) => {
  if (isDev) {
    console.log(`🔍 [${source}]`, event, data);
  }
};

const validateEventData = (eventName: string, parameters?: Record<string, any>): boolean => {
  if (!eventName || typeof eventName !== 'string') {
    console.warn('⚠️ Invalid event name:', eventName);
    return false;
  }
  
  if (parameters && typeof parameters !== 'object') {
    console.warn('⚠️ Invalid event parameters:', parameters);
    return false;
  }
  
  return true;
};

// Enhanced error handling wrapper
const safelyExecute = (fn: () => void, context: string) => {
  try {
    fn();
  } catch (error) {
    console.error(`❌ Analytics error in ${context}:`, error);
    // Track analytics failures
    if (window.gtag) {
      window.gtag('event', 'analytics_error', {
        error_context: context,
        error_message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
};

// Helper function to convert ConsentSettings to GoogleConsentSettings
const mapToGoogleConsent = (consentSettings: ConsentSettings): GoogleConsentSettings => ({
  ad_storage: consentSettings.marketing ? 'granted' : 'denied',
  ad_user_data: consentSettings.marketing ? 'granted' : 'denied',
  ad_personalization: consentSettings.marketing ? 'granted' : 'denied',
  analytics_storage: consentSettings.analytics ? 'granted' : 'denied',
  functionality_storage: consentSettings.preferences ? 'granted' : 'denied',
  personalization_storage: consentSettings.preferences ? 'granted' : 'denied',
  security_storage: 'granted',
});

// Google Tag Manager
export const initializeGTM = (consentSettings: ConsentSettings) => {
  if (!ANALYTICS_CONFIG.GTM_CONTAINER_ID || typeof window === 'undefined') return;

  safelyExecute(() => {
    // Initialize dataLayer for GTM
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      window.dataLayer?.push(arguments);
    };
    
    // Set default consent state for GTM
    const googleConsentSettings: GoogleConsentSettings = mapToGoogleConsent(consentSettings);
    window.gtag('consent', 'default', googleConsentSettings);
    
    logAnalyticsEvent('GTM', 'Default consent set', googleConsentSettings);

    // Initialize GTM
    window.dataLayer.push({
      'gtm.start': new Date().getTime(),
      event: 'gtm.js'
    });

    // Load GTM script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${ANALYTICS_CONFIG.GTM_CONTAINER_ID}`;
    script.onload = () => logAnalyticsEvent('GTM', 'Loaded successfully');
    script.onerror = () => console.error('❌ Failed to load GTM');
    document.head.appendChild(script);
    
    logAnalyticsEvent('GTM', 'Initialized', { containerId: ANALYTICS_CONFIG.GTM_CONTAINER_ID });
  }, 'GTM initialization');
};

// Update GTM consent
export const updateGTMConsent = (consentSettings: ConsentSettings) => {
  if (typeof window === 'undefined' || !window.dataLayer) return;

  safelyExecute(() => {
    const googleConsentSettings: GoogleConsentSettings = mapToGoogleConsent(consentSettings);
    
    // Użyj standardowego eventu 'consent' z 'update' dla GTM i GA4
    window.gtag?.('consent', 'update', googleConsentSettings);
    
    logAnalyticsEvent('GTM', 'Consent updated', googleConsentSettings);
  }, 'GTM consent update');
};

// Update Google Consent Mode
export const updateGoogleConsent = (consentSettings: ConsentSettings) => {
  if (typeof window === 'undefined') return;

  const googleConsentSettings: GoogleConsentSettings = mapToGoogleConsent(consentSettings);
  
  // Update GTM consent if available
  if (ANALYTICS_CONFIG.GTM_CONTAINER_ID && window.dataLayer) {
    updateGTMConsent(consentSettings);
  }
  
  // Update direct GA4 consent is now handled by GTM
  if (window.gtag) {
    safelyExecute(() => {
      window.gtag?.('consent', 'update', googleConsentSettings);
      logAnalyticsEvent('GA4', 'Consent updated via GTM', googleConsentSettings);
    }, 'GA4 consent update');
  }
};

// Facebook Pixel
export const initializeFacebookPixel = (consentSettings: ConsentSettings) => {
  if (!ANALYTICS_CONFIG.FACEBOOK_PIXEL_ID || typeof window === 'undefined' || !consentSettings.marketing) return;

  safelyExecute(() => {
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
    
    logAnalyticsEvent('Facebook Pixel', 'Initialized', { pixelId: ANALYTICS_CONFIG.FACEBOOK_PIXEL_ID });
  }, 'Facebook Pixel initialization');
};

// Cloudflare Web Analytics
export const initializeCloudflareAnalytics = () => {
  if (!ANALYTICS_CONFIG.CLOUDFLARE_TOKEN || typeof window === 'undefined') return;

  safelyExecute(() => {
    const script = document.createElement('script');
    script.defer = true;
    script.src = 'https://static.cloudflareinsights.com/beacon.min.js';
    script.setAttribute('data-cf-beacon', `{"token": "${ANALYTICS_CONFIG.CLOUDFLARE_TOKEN}"}`);
    script.onload = () => logAnalyticsEvent('Cloudflare', 'Loaded successfully');
    script.onerror = () => console.error('❌ Failed to load Cloudflare Analytics');
    document.head.appendChild(script);
    
    logAnalyticsEvent('Cloudflare', 'Initialized', { token: ANALYTICS_CONFIG.CLOUDFLARE_TOKEN });
  }, 'Cloudflare Analytics initialization');
};

// Microsoft Clarity
export const initializeClarity = () => {
  if (!ANALYTICS_CONFIG.CLARITY_PROJECT_ID || typeof window === 'undefined') return;

  safelyExecute(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (function(c: any, l: Document, a: string, r: string, i: string, t?: HTMLScriptElement, y?: Element) {
      c[a] = c[a] || function() { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r) as HTMLScriptElement;
      t.async = true;
      t.src = "https://www.clarity.ms/tag/" + i;
      t.onload = () => logAnalyticsEvent('Clarity', 'Loaded successfully');
      t.onerror = () => console.error('❌ Failed to load Microsoft Clarity');
      y = l.getElementsByTagName(r)[0];
      if (y && y.parentNode) {
        y.parentNode.insertBefore(t, y);
      }
    })(window, document, "clarity", "script", ANALYTICS_CONFIG.CLARITY_PROJECT_ID);
    
    logAnalyticsEvent('Clarity', 'Initialized', { projectId: ANALYTICS_CONFIG.CLARITY_PROJECT_ID });
  }, 'Clarity initialization');
};

// Vercel Analytics - handled by @vercel/analytics package
export const initializeVercelAnalytics = () => {
  // Vercel Analytics is handled by the @vercel/analytics package
  // No manual initialization needed
  logAnalyticsEvent('Vercel', 'Initialized via @vercel/analytics package');
};

// Enhanced tracking functions with validation
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (!validateEventData(eventName, parameters)) return;
  if (typeof window === 'undefined') return;

  safelyExecute(() => {
    // GTM DataLayer (preferred method)
    if (window.dataLayer) {
      window.dataLayer.push({
        event: eventName,
        ...parameters,
        timestamp: Date.now(),
        page_url: window.location.href,
      });
      logAnalyticsEvent('GTM DataLayer', eventName, parameters);
    }

    // Google Analytics (fallback or additional)
    if (window.gtag) {
      window.gtag('event', eventName, parameters);
      logAnalyticsEvent('GA4', eventName, parameters);
    }

    // Facebook Pixel
    if (window.fbq) {
      window.fbq('track', eventName, parameters);
      logAnalyticsEvent('Facebook Pixel', eventName, parameters);
    }
  }, `Event tracking: ${eventName}`);
};

// Track page view
export const trackPageView = (url: string, title?: string) => {
  if (typeof window === 'undefined') return;

  safelyExecute(() => {
    const pageData = {
      page_title: title || document.title,
      page_location: url,
      timestamp: Date.now(),
    };

    // GTM DataLayer (preferred method)
    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'page_view',
        ...pageData,
      });
      logAnalyticsEvent('GTM DataLayer', 'page_view', pageData);
    }

    // Google Analytics (fallback)
    if (window.gtag && ANALYTICS_CONFIG.GA_MEASUREMENT_ID) {
      window.gtag('config', ANALYTICS_CONFIG.GA_MEASUREMENT_ID, pageData);
      logAnalyticsEvent('GA4', 'page_view', pageData);
    }

    // Facebook Pixel
    if (window.fbq) {
      window.fbq('track', 'PageView');
      logAnalyticsEvent('Facebook Pixel', 'PageView', pageData);
    }
  }, 'Page view tracking');
};

// Initialize all analytics based on consent
export const initializeAnalytics = (consentSettings: ConsentSettings) => {
  if (typeof window === 'undefined') return;

  const startTime = performance.now();
  
  logAnalyticsEvent('Analytics', 'Initialization started', consentSettings);

  // Always initialize Cloudflare (minimal privacy impact)
  initializeCloudflareAnalytics();
  
  // Always initialize Clarity (first-party, privacy-friendly)
  if (consentSettings.analytics) {
    initializeClarity();
  }
  
  // Vercel Analytics is handled by @vercel/analytics package
  initializeVercelAnalytics();

  // Initialize GTM if available
  if (ANALYTICS_CONFIG.GTM_CONTAINER_ID) {
    initializeGTM(consentSettings);
  }

  // Initialize Facebook Pixel only if marketing consent is given
  if (consentSettings.marketing) {
    initializeFacebookPixel(consentSettings);
  }
  
  const endTime = performance.now();
  logAnalyticsEvent('Analytics', 'Initialization completed', {
    duration: `${(endTime - startTime).toFixed(2)}ms`,
    enabledServices: {
      gtm: !!ANALYTICS_CONFIG.GTM_CONTAINER_ID,
      ga4: !!ANALYTICS_CONFIG.GA_MEASUREMENT_ID,
      clarity: !!ANALYTICS_CONFIG.CLARITY_PROJECT_ID && consentSettings.analytics,
      facebook: !!ANALYTICS_CONFIG.FACEBOOK_PIXEL_ID && consentSettings.marketing,
      cloudflare: !!ANALYTICS_CONFIG.CLOUDFLARE_TOKEN,
    }
  });
};

// Standardized financial tracking events
export const trackLoanInterest = (loanType: string, bankName: string, amount?: number) => {
  trackEvent('loan_interest', {
    loan_type: loanType,
    bank_name: bankName,
    amount: amount,
    currency: 'PLN',
    interaction_type: 'view_details',
  });
};

export const trackLoanComparison = (loanType: string, banksCompared: string[], filters?: Record<string, any>) => {
  trackEvent('loan_comparison', {
    loan_type: loanType,
    banks_compared: banksCompared,
    comparison_count: banksCompared.length,
    ...filters,
    event_category: 'engagement',
  });
};

export const trackBankLinkClick = (bankName: string, loanType: string, position: number) => {
  trackEvent('bank_link_click', {
    bank_name: bankName,
    loan_type: loanType,
    position: position,
    click_location: 'comparison_table',
    event_category: 'conversion',
  });
};

export const trackFilterUsage = (filterType: string, filterValue: string | number, loanType?: string) => {
  trackEvent('filter_usage', {
    filter_type: filterType,
    filter_value: filterValue,
    loan_type: loanType,
    event_category: 'interaction',
  });
};

export const trackCalculatorUsage = (calculatorType: string, values: Record<string, any>) => {
  trackEvent('calculator_usage', {
    calculator_type: calculatorType,
    ...values,
    event_category: 'tool_usage',
  });
};

// Analytics health check
export const checkAnalyticsHealth = (): Record<string, boolean> => {
  if (typeof window === 'undefined') return {};
  
  return {
    gtm_loaded: !!(window.dataLayer && window.google_tag_manager),
    ga4_loaded: !!window.gtag,
    facebook_loaded: !!window.fbq,
    clarity_loaded: !!window.clarity,
    cloudflare_loaded: !!document.querySelector('[data-cf-beacon]'),
  };
};

// Development analytics debugger
export const enableAnalyticsDebugger = () => {
  if (!isDev) return;
  
  // @ts-ignore - Development only
  window.analyticsDebugger = {
    config: ANALYTICS_CONFIG,
    healthCheck: checkAnalyticsHealth,
    testEvent: (name: string, params?: any) => trackEvent(name, params),
    testPageView: (url?: string) => trackPageView(url || window.location.href),
    clearDataLayer: () => { window.dataLayer = []; },
  };
  
  console.log('🔧 Analytics Debugger enabled! Use window.analyticsDebugger');
}; 