'use client';

import { useCallback } from 'react';
import { trackEvent, trackPageView } from '@/lib/analytics';
import { useConsent } from '@/contexts/ConsentContext';

export function useAnalytics() {
  const { consent, hasConsent } = useConsent();

  const track = useCallback((eventName: string, parameters?: Record<string, any>) => {
    if (!hasConsent) return;
    
    // Only track if user has given appropriate consent
    if (eventName.includes('purchase') || eventName.includes('conversion')) {
      if (!consent.marketing) return;
    } else if (!consent.analytics) {
      return;
    }

    trackEvent(eventName, parameters);
  }, [hasConsent, consent]);

  const trackPage = useCallback((url: string, title?: string) => {
    if (!hasConsent || !consent.analytics) return;
    trackPageView(url, title);
  }, [hasConsent, consent.analytics]);

  // Predefined tracking functions for common events
  const trackLoanComparison = useCallback((loanType: string, filters?: Record<string, any>) => {
    track('loan_comparison', {
      loan_type: loanType,
      ...filters,
    });
  }, [track]);

  const trackLoanApplication = useCallback((bankName: string, loanType: string, amount?: number) => {
    track('loan_application_start', {
      bank_name: bankName,
      loan_type: loanType,
      amount: amount,
    });
  }, [track]);

  const trackFilterUsage = useCallback((filterType: string, filterValue: string | number) => {
    track('filter_used', {
      filter_type: filterType,
      filter_value: filterValue,
    });
  }, [track]);

  const trackNewsletterSignup = useCallback((source?: string) => {
    track('newsletter_signup', {
      source: source || 'unknown',
    });
  }, [track]);

  const trackContactFormSubmit = useCallback((formType: string) => {
    track('contact_form_submit', {
      form_type: formType,
    });
  }, [track]);

  return {
    track,
    trackPage,
    trackLoanComparison,
    trackLoanApplication,
    trackFilterUsage,
    trackNewsletterSignup,
    trackContactFormSubmit,
    hasConsent,
    consent,
  };
} 