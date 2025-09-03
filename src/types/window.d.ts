// This file is for custom global type declarations.

export {};

declare global {
  interface Window {
    ow: {
      analytics: {
        status: () => any;
        consent: () => void;
        updateConsent?: (consent: any) => void;
        _consentManager?: {
          current: any;
          listeners: Array<(consent: any) => void>;
          get: () => any;
          set: (consent: any) => void;
          notify: () => void;
          onChange: (callback: (consent: any) => void) => void;
        };
      };
    };
  }
}
