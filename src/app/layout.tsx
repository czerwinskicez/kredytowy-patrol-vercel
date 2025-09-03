import type { Metadata, Viewport } from "next";
import { 
  // Poppins, 
  // Ubuntu, 
  Sarala, 
  // Merriweather_Sans, 
  // Fira_Sans 
} from "next/font/google";
import "./globals.css";
import { ConsentProvider } from '@/contexts/ConsentContext';
import { CookieBanner } from '@/components/CookieBanner';
import { ConditionalAnalyticsScripts } from '@/components/ConditionalAnalyticsScripts';
import { StructuredData } from '@/components/StructuredData';
import { PageSpeedOptimizer } from '@/components/PageSpeedOptimizer';
import { Analytics as VercelAnalytics } from '@vercel/analytics/react';
import { SpeedInsights as VercelSpeedInsights} from '@vercel/speed-insights/next'
import { baseMetadata } from '@/lib/metadata';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

// const fontHeading = Poppins({
//   subsets: ['latin'],
//   weight: ['400', '700'],
//   variable: '--font-heading',
// });

// const fontBody = Ubuntu({
//   subsets: ['latin'],
//   weight: ['400', '700'],
//   variable: '--font-body',
// });

const fontSarala = Sarala({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-sarala',
});

// const fontMerriweatherSans = Merriweather_Sans({
//   subsets: ['latin'],
//   weight: ['400', '700'],
//   variable: '--font-merriweather-sans',
// });

// const fontFiraSans = Fira_Sans({
//   subsets: ['latin'],
//   weight: ['400', '700'],
//   variable: '--font-fira-sans',
// });

export const metadata: Metadata = baseMetadata;

export const viewport: Viewport = {
  themeColor: '#053320',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" className={`
      ${fontSarala.variable}
    `}>
      <head>
        <meta name="mylead-verification" content="976678ce69b37a1ee1ec89b1b20f7e9d" />
        {/* mylead-verification: 976678ce69b37a1ee1ec89b1b20f7e9d */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://connect.facebook.net" />
        <link rel="preconnect" href="https://scripts.clarity.ms" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@40,200,0,0" />
        
        {/* Google Consent Mode v2 - MUST be before any analytics scripts */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              
              // Initialize centralized consent manager
              window.ow = window.ow || {};
              window.ow.analytics = window.ow.analytics || {};
              window.ow.analytics._consentManager = {
                current: null,
                listeners: [],
                
                get: function() {
                  return this.current;
                },
                
                set: function(newConsent) {
                  this.current = newConsent;
                  this.notify();
                },
                
                notify: function() {
                  this.listeners.forEach(fn => fn(this.current));
                },
                
                onChange: function(callback) {
                  this.listeners.push(callback);
                  if (this.current) callback(this.current);
                }
              };
              
              // Check localStorage for existing consent
              const savedConsent = localStorage.getItem('cookie-consent');
              let initialConsent;
              
              if (savedConsent) {
                try {
                  const consentData = JSON.parse(savedConsent);
                  const isValid = consentData.version === '1.0' && 
                                  Date.now() - consentData.timestamp < 365 * 24 * 60 * 60 * 1000;
                  
                  if (isValid) {
                    initialConsent = {
                      'ad_storage': consentData.consent.marketing ? 'granted' : 'denied',
                      'ad_user_data': consentData.consent.marketing ? 'granted' : 'denied',
                      'ad_personalization': consentData.consent.marketing ? 'granted' : 'denied',
                      'analytics_storage': consentData.consent.analytics ? 'granted' : 'denied',
                      'functionality_storage': consentData.consent.preferences ? 'granted' : 'denied',
                      'personalization_storage': consentData.consent.preferences ? 'granted' : 'denied',
                      'security_storage': 'granted'
                    };
                  }
                } catch (e) {
                  localStorage.removeItem('cookie-consent');
                }
              }
              
              // Default to denied if no valid consent found
              if (!initialConsent) {
                initialConsent = {
                  'ad_storage': 'denied',
                  'ad_user_data': 'denied',
                  'ad_personalization': 'denied',
                  'analytics_storage': 'denied',
                  'functionality_storage': 'denied',
                  'personalization_storage': 'denied',
                  'security_storage': 'granted'
                };
              }
              
              // Set initial consent state
              gtag('consent', 'default', initialConsent);
              window.ow.analytics._consentManager.set(initialConsent);
            `,
          }}
        />
      </head>
      <body className="antialiased font-body">
        <ConsentProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
            <CookieBanner />
          </div>
          <ConditionalAnalyticsScripts />
        </ConsentProvider>
        {/* Vercel Analytics - First-party, privacy-compliant, no consent required */}
        <VercelAnalytics />
        <StructuredData />
        <PageSpeedOptimizer />
        <VercelSpeedInsights />
        <div dangerouslySetInnerHTML={{__html: '<!-- mylead-verification: 976678ce69b37a1ee1ec89b1b20f7e9d -->'}} />
      </body>
    </html>
  );
}
