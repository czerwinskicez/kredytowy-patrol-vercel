'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ConsentSettings, ConsentContextType, CookieConsentData } from '@/types/analytics';
import { enableAnalyticsDebugger } from '@/lib/analytics';

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

  // Sync with centralized consent manager
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if consent manager is ready
    const checkConsentManager = () => {
      if (window.ow?.analytics?._consentManager) {
        const currentConsent = window.ow.analytics._consentManager.get();
        
        if (currentConsent) {
          // Convert Google consent format back to our format
          const reactConsent: ConsentSettings = {
            necessary: true,
            analytics: currentConsent.analytics_storage === 'granted',
            marketing: currentConsent.ad_storage === 'granted', 
            preferences: currentConsent.functionality_storage === 'granted'
          };
          
          setConsent(reactConsent);
          setHasConsent(true);
          
          // If all denied, show banner
          if (!reactConsent.analytics && !reactConsent.marketing && !reactConsent.preferences) {
            setShowBanner(true);
          }
        }
        
        // Listen for future changes
        window.ow.analytics._consentManager.onChange((newGoogleConsent: any) => {
          const reactConsent: ConsentSettings = {
            necessary: true,
            analytics: newGoogleConsent.analytics_storage === 'granted',
            marketing: newGoogleConsent.ad_storage === 'granted',
            preferences: newGoogleConsent.functionality_storage === 'granted'
          };
          
          setConsent(reactConsent);
          setHasConsent(true);
        });
      } else {
        // Retry if consent manager not ready yet
        setTimeout(checkConsentManager, 50);
      }
    };
    
    checkConsentManager();

    // --- OW Analytics Consent Function ---
    window.ow = window.ow || {};
    window.ow.analytics = window.ow.analytics || {};
    window.ow.analytics.consent = () => {
      const savedConsentRaw = localStorage.getItem(CONSENT_STORAGE_KEY);
      const savedConsent = savedConsentRaw ? JSON.parse(savedConsentRaw) : null;
      
      const consentEvents = window.dataLayer?.filter((item: any) => item && item[0] === 'consent') || [];
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
    
    // 1. Save to localStorage
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consentData));
    
    // 2. Convert to Google format
    const googleConsent = {
      'ad_storage': newConsent.marketing ? 'granted' : 'denied',
      'ad_user_data': newConsent.marketing ? 'granted' : 'denied',
      'ad_personalization': newConsent.marketing ? 'granted' : 'denied',
      'analytics_storage': newConsent.analytics ? 'granted' : 'denied',
      'functionality_storage': newConsent.preferences ? 'granted' : 'denied',
      'personalization_storage': newConsent.preferences ? 'granted' : 'denied',
      'security_storage': 'granted'
    };
    
    // 3. Update centralized manager (this will notify all listeners including React)
    if (window.ow?.analytics?._consentManager) {
      window.ow.analytics._consentManager.set(googleConsent);
    }
    
    // 4. Update Google Consent Mode
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', googleConsent);
    }
    
    // 5. Update local React state and hide banner
    setConsent(newConsent);
    setHasConsent(true);
    setShowBanner(false);
    
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