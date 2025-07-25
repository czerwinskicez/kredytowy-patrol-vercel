'use client';

import { useCallback } from 'react';
import { 
  trackEvent, 
  trackPageView, 
  trackLoanInterest,
  trackLoanComparison as trackLoanComparisonAnalytics,
  trackBankLinkClick,
  trackFilterUsage as trackFilterUsageAnalytics,
  trackCalculatorUsage 
} from '@/lib/analytics';
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

  // Enhanced tracking functions for financial services
  const trackLoanInterestEvent = useCallback((loanType: string, bankName: string, amount?: number) => {
    if (!hasConsent || !consent.analytics) return;
    trackLoanInterest(loanType, bankName, amount);
  }, [hasConsent, consent.analytics]);

  const trackLoanComparison = useCallback((loanType: string, banksCompared: string[], filters?: Record<string, any>) => {
    if (!hasConsent || !consent.analytics) return;
    trackLoanComparisonAnalytics(loanType, banksCompared, filters);
  }, [hasConsent, consent.analytics]);

  const trackBankClick = useCallback((bankName: string, loanType: string, position: number) => {
    if (!hasConsent || !consent.marketing) return; // Bank clicks are marketing-related
    trackBankLinkClick(bankName, loanType, position);
  }, [hasConsent, consent.marketing]);

  const trackFilterUsage = useCallback((filterType: string, filterValue: string | number, loanType?: string) => {
    if (!hasConsent || !consent.analytics) return;
    trackFilterUsageAnalytics(filterType, filterValue, loanType);
  }, [hasConsent, consent.analytics]);

  const trackCalculator = useCallback((calculatorType: string, values: Record<string, any>) => {
    if (!hasConsent || !consent.analytics) return;
    trackCalculatorUsage(calculatorType, values);
  }, [hasConsent, consent.analytics]);

  // Legacy functions for backward compatibility
  const trackLoanApplication = useCallback((bankName: string, loanType: string, amount?: number) => {
    track('loan_application_start', {
      bank_name: bankName,
      loan_type: loanType,
      amount: amount,
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
    // Core tracking
    track,
    trackPage,
    
    // Enhanced financial tracking
    trackLoanInterest: trackLoanInterestEvent,
    trackLoanComparison,
    trackBankClick,
    trackFilterUsage,
    trackCalculator,
    
    // Legacy functions
    trackLoanApplication,
    trackNewsletterSignup,
    trackContactFormSubmit,
    
    // Consent info
    hasConsent,
    consent,
  };
} 