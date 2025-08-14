'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ConsentSettings, ConsentContextType, CookieConsentData } from '@/types/analytics';
import { initializeAnalytics, updateGoogleConsent, enableAnalyticsDebugger } from '@/lib/analytics';

const CONSENT_VERSION = '1.0';
const CONSENT_STORAGE_KEY = 'cookie-consent';

const defaultConsent: ConsentSettings = {
  necessary: true, // Always true, required for basic functionality
  analytics: false,
  marketing: false,
  preferences: false,
};

const ConsentContext = createContext<ConsentContextType | undefined>(undefined);

interface ConsentProviderProps {
  children: ReactNode;
}

export function ConsentProvider({ children }: ConsentProviderProps) {
  const [consent, setConsent] = useState<ConsentSettings>(defaultConsent);
  const [hasConsent, setHasConsent] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  // Enable analytics debugger in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      enableAnalyticsDebugger();
    }
  }, []);

  // Load consent from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedConsent = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (savedConsent) {
      try {
        const consentData: CookieConsentData = JSON.parse(savedConsent);
        
        // Check if consent is still valid (not expired, correct version)
        const isValid = consentData.version === CONSENT_VERSION && 
                        Date.now() - consentData.timestamp < 365 * 24 * 60 * 60 * 1000; // 1 year
        
        if (isValid) {
          setConsent(consentData.consent);
          setHasConsent(true);
          // Initialize analytics with saved consent
          setTimeout(() => initializeAnalytics(consentData.consent), 100);
        } else {
          // Remove expired consent
          localStorage.removeItem(CONSENT_STORAGE_KEY);
          setShowBanner(true);
        }
      } catch (error) {
        console.error('Error parsing consent data:', error);
        localStorage.removeItem(CONSENT_STORAGE_KEY);
        setShowBanner(true);
      }
    } else {
      setShowBanner(true);
    }

    // --- OW Analytics Consent Function ---
    window.ow = window.ow || {};
    window.ow.analytics = window.ow.analytics || {};
    window.ow.analytics.consent = () => {
      const savedConsentRaw = localStorage.getItem(CONSENT_STORAGE_KEY);
      const savedConsent = savedConsentRaw ? JSON.parse(savedConsentRaw) : null;
      
      const consentEvents = window.dataLayer?.filter((item: any) => Array.isArray(item) && item[0] === 'consent') || [];
      const lastConsentEvent = consentEvents.length > 0 ? consentEvents[consentEvents.length - 1] : null;
      const googleConsentState = lastConsentEvent ? lastConsentEvent[2] : {};

      const status = {
        'Local Storage Consent': {
          'Source': 'Browser Storage',
          'Analytics': savedConsent?.consent?.analytics ?? 'N/A',
          'Marketing': savedConsent?.consent?.marketing ?? 'N/A',
          'Preferences': savedConsent?.consent?.preferences ?? 'N/A',
        },
        'Google Consent Mode': {
          'Source': 'dataLayer (Current)',
          'analytics_storage': googleConsentState?.analytics_storage ?? 'Not Found',
          'ad_storage': googleConsentState?.ad_storage ?? 'Not Found',
          'ad_user_data': googleConsentState?.ad_user_data ?? 'Not Found',
          'ad_personalization': googleConsentState?.ad_personalization ?? 'Not Found',
        }
      };

      console.log('--- Consent Status ---');
      console.table(status);
      console.log('This table shows the consent stored locally and the most recent consent state sent to Google.');
      console.log('--------------------');
    };
  }, []);

  const saveConsent = (newConsent: ConsentSettings) => {
    const consentData: CookieConsentData = {
      consent: newConsent,
      timestamp: Date.now(),
      version: CONSENT_VERSION,
    };
    
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consentData));
    setConsent(newConsent);
    setHasConsent(true);
    setShowBanner(false);
    
    // Update analytics with new consent
    updateGoogleConsent(newConsent);
    
    // If analytics or marketing was just enabled, initialize those services
    if (newConsent.analytics || newConsent.marketing) {
      // Small delay to ensure DOM is ready
      setTimeout(() => initializeAnalytics(newConsent), 100);
    }
    
    // Log consent changes in development
    if (process.env.NODE_ENV === 'development') {
      console.log('🍪 Consent updated:', newConsent);
    }
  };

  const updateConsent = (settings: Partial<ConsentSettings>) => {
    const newConsent = { ...consent, ...settings, necessary: true };
    saveConsent(newConsent);
  };

  const acceptAll = () => {
    const allAccepted: ConsentSettings = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };
    saveConsent(allAccepted);
  };

  const rejectAll = () => {
    const rejected: ConsentSettings = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    };
    saveConsent(rejected);
  };

  const showPreferences = () => {
    setShowBanner(true);
  };

  const hideBanner = () => {
    setShowBanner(false);
  };

  const contextValue: ConsentContextType = {
    consent,
    hasConsent,
    showBanner,
    updateConsent,
    acceptAll,
    rejectAll,
    showPreferences,
    hideBanner,
  };

  return (
    <ConsentContext.Provider value={contextValue}>
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent(): ConsentContextType {
  const context = useContext(ConsentContext);
  if (context === undefined) {
    throw new Error('useConsent must be used within a ConsentProvider');
  }
  return context;
} 