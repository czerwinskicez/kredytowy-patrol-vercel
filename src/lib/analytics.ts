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