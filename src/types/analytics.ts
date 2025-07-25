export interface ConsentSettings {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

export interface AnalyticsConfig {
  googleAnalyticsId?: string;
  gtmContainerId?: string;
  clarityProjectId?: string;
  facebookPixelId?: string;
  cloudflareToken?: string;
}

export interface CookieConsentData {
  consent: ConsentSettings;
  timestamp: number;
  version: string;
}

export interface ConsentContextType {
  consent: ConsentSettings;
  hasConsent: boolean;
  showBanner: boolean;
  updateConsent: (settings: Partial<ConsentSettings>) => void;
  acceptAll: () => void;
  rejectAll: () => void;
  showPreferences: () => void;
  hideBanner: () => void;
}

// Google Consent Mode v2 types
export interface GoogleConsentSettings {
  ad_storage: 'granted' | 'denied';
  ad_user_data: 'granted' | 'denied';
  ad_personalization: 'granted' | 'denied';
  analytics_storage: 'granted' | 'denied';
  functionality_storage: 'granted' | 'denied';
  personalization_storage: 'granted' | 'denied';
  security_storage: 'granted' | 'denied';
}

// GTM DataLayer event types
export interface GTMEvent {
  event: string;
  [key: string]: any;
}

export interface GTMConsentEvent extends GTMEvent {
  event: 'gtm_consent_default' | 'gtm_consent_update';
  gtm_consent_default?: GoogleConsentSettings;
  gtm_consent_update?: GoogleConsentSettings;
}

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: (GTMEvent | any)[];
    fbq?: any;
    _fbq?: any;
    clarity?: {
      q?: any[];
      (...args: any[]): void;
    };
    google_tag_manager?: any;
    analyticsDebugger?: {
      config: any;
      healthCheck: () => Record<string, boolean>;
      testEvent: (name: string, params?: any) => void;
      testPageView: (url?: string) => void;
      clearDataLayer: () => void;
    };
  }
} 