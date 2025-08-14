// This file is for custom global type declarations.

export {};

declare global {
  interface Window {
    ow: {
      analytics: {
        status: () => void;
        consent: () => void;
      };
    };
  }
}
