'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { useConsent } from '@/contexts/ConsentContext';
import { ANALYTICS_CONFIG } from '@/lib/analytics';

export function ConditionalAnalyticsScripts() {
  const { consent, hasConsent } = useConsent();

  // Don't render anything until user has made a consent choice
  if (!hasConsent) {
    return null;
  }

  return (
    <>
      {/* Google Tag Manager - Only if analytics OR marketing consent */}
      {ANALYTICS_CONFIG.GTM_CONTAINER_ID && (consent.analytics || consent.marketing) && (
        <>
          <Script
            id="google-tag-manager"
            strategy="afterInteractive"
          >
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${ANALYTICS_CONFIG.GTM_CONTAINER_ID}');
            `}
          </Script>
          <noscript>
            <iframe 
              src={`https://www.googletagmanager.com/ns.html?id=${ANALYTICS_CONFIG.GTM_CONTAINER_ID}`}
              height="0" 
              width="0" 
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        </>
      )}

      {/* Microsoft Clarity - Only if analytics consent */}
      {ANALYTICS_CONFIG.CLARITY_PROJECT_ID && consent.analytics && (
        <Script id="microsoft-clarity" strategy="lazyOnload">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${ANALYTICS_CONFIG.CLARITY_PROJECT_ID}");
          `}
        </Script>
      )}

      {/* Facebook Pixel - Only if marketing consent */}
      {ANALYTICS_CONFIG.FACEBOOK_PIXEL_ID && consent.marketing && (
        <>
          <Script id="facebook-pixel" strategy="lazyOnload">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${ANALYTICS_CONFIG.FACEBOOK_PIXEL_ID}');
              fbq('track', 'PageView');
            `}
          </Script>
          <noscript>
            <img 
              height="1" 
              width="1" 
              style={{ display: 'none' }}
              src={`https://www.facebook.com/tr?id=${ANALYTICS_CONFIG.FACEBOOK_PIXEL_ID}&ev=PageView&noscript=1`}
            />
          </noscript>
        </>
      )}

      {/* Cloudflare Analytics - Always allowed (first-party, privacy-friendly) */}
      {ANALYTICS_CONFIG.CLOUDFLARE_TOKEN && (
        <Script id="cloudflare-analytics" strategy="lazyOnload">
          {`
            (function() {
              var script = document.createElement('script');
              script.defer = true;
              script.src = 'https://static.cloudflareinsights.com/beacon.min.js';
              script.setAttribute('data-cf-beacon', '{"token": "${ANALYTICS_CONFIG.CLOUDFLARE_TOKEN}"}');
              document.head.appendChild(script);
            })();
          `}
        </Script>
      )}

      {/* Note: Vercel Analytics is handled by @vercel/analytics package in layout.tsx */}
      {/* It's first-party analytics and privacy-compliant, so it can run without explicit consent */}

      {/* Enhanced OW Analytics Status Function */}
      <Script id="ow-analytics-status" strategy="afterInteractive">
        {`
          (function() {
            window.ow = window.ow || {};
            window.ow.analytics = window.ow.analytics || {};

            window.ow.analytics.status = function() {
              const ANALYTICS_CONFIG = {
                GTM_CONTAINER_ID: '${ANALYTICS_CONFIG.GTM_CONTAINER_ID || ''}',
                GA_MEASUREMENT_ID: '${ANALYTICS_CONFIG.GA_MEASUREMENT_ID || ''}',
                CLARITY_PROJECT_ID: '${ANALYTICS_CONFIG.CLARITY_PROJECT_ID || ''}',
                FACEBOOK_PIXEL_ID: '${ANALYTICS_CONFIG.FACEBOOK_PIXEL_ID || ''}',
                CLOUDFLARE_TOKEN: '${ANALYTICS_CONFIG.CLOUDFLARE_TOKEN || ''}',
              };

              // Helper to get the most recent Google Consent Mode state from dataLayer
              const getGoogleConsentState = () => {
                if (!window.dataLayer) return {};
                const consentEvents = window.dataLayer.filter(item => 
                  item && Array.isArray(item) && item[0] === 'consent' && item[1] === 'update'
                );
                if (consentEvents.length > 0) {
                  return consentEvents[consentEvents.length - 1][2] || {};
                }
                const defaultConsentEvents = window.dataLayer.filter(item => 
                  item && Array.isArray(item) && item[0] === 'consent' && item[1] === 'default'
                );
                if (defaultConsentEvents.length > 0) {
                  return defaultConsentEvents[defaultConsentEvents.length - 1][2] || {};
                }
                return {};
              };

              const consentState = getGoogleConsentState();

              const getServiceStatus = (serviceName) => {
                const status = {
                  name: serviceName,
                  configId: null,
                  consentRequired: true,
                  scriptState: 'Not Found',
                  consent: {
                    status: 'unknown',
                    relevantKeys: {}
                  },
                  details: {}
                };

                switch (serviceName) {
                  case 'Google Tag Manager':
                    status.configId = ANALYTICS_CONFIG.GTM_CONTAINER_ID;
                    status.consent.relevantKeys = { analytics_storage: consentState.analytics_storage, ad_storage: consentState.ad_storage };
                    status.consent.status = consentState.analytics_storage === 'granted' || consentState.ad_storage === 'granted' ? 'granted' : 'denied';
                    if (window.google_tag_manager) {
                      status.scriptState = 'Loaded';
                      status.details.dataLayerEvents = window.dataLayer.filter(e => e && e.event && (e.event === 'gtm.js' || e.event === 'gtm.load')).length;
                    } else if (window.dataLayer) {
                      status.scriptState = 'Initialized';
                    }
                    break;

                  case 'Google Analytics':
                    status.name = 'Google Analytics (GA4)';
                    status.configId = ANALYTICS_CONFIG.GA_MEASUREMENT_ID;
                    status.consent.relevantKeys = { analytics_storage: consentState.analytics_storage };
                    status.consent.status = consentState.analytics_storage || 'denied';
                    if (typeof window.gtag === 'function') {
                      status.scriptState = 'Initialized';
                      if (window.dataLayer && window.dataLayer.some(e => Array.isArray(e) && e[0] === 'config' && e[1] === ANALYTICS_CONFIG.GA_MEASUREMENT_ID)) {
                        status.details.isConfigured = true;
                        status.scriptState = 'Configured';
                      } else {
                        status.details.isConfigured = false;
                      }
                    }
                    break;

                  case 'Microsoft Clarity':
                    status.configId = ANALYTICS_CONFIG.CLARITY_PROJECT_ID;
                    status.consent.relevantKeys = { analytics_storage: consentState.analytics_storage };
                    status.consent.status = consentState.analytics_storage || 'denied';
                    if (typeof window.clarity === 'function') {
                      status.scriptState = 'Loaded';
                      const hasClarityCookie = document.cookie.split(';').some(c => c.trim().startsWith('_clck=') || c.trim().startsWith('_clsk='));
                      status.details.trackingCookieFound = hasClarityCookie;
                      status.scriptState = hasClarityCookie ? 'Tracking Active' : 'Loaded (Not Tracking)';
                    }
                    break;
                  
                  case 'Facebook Pixel':
                    status.configId = ANALYTICS_CONFIG.FACEBOOK_PIXEL_ID;
                    status.consent.relevantKeys = { ad_storage: consentState.ad_storage };
                    status.consent.status = consentState.ad_storage || 'denied';
                    if (typeof window.fbq === 'function') {
                      status.scriptState = 'Loaded';
                      if (window.fbq.getState) {
                         const state = window.fbq.getState();
                         status.details.pixels = state.pixels || [];
                      } else {
                         status.details.info = 'fbq.getState() not available';
                      }
                    }
                    break;

                  case 'Cloudflare Analytics':
                    status.configId = ANALYTICS_CONFIG.CLOUDFLARE_TOKEN;
                    status.consentRequired = false;
                    status.consent.status = 'Not Required';
                    if (document.querySelector('[data-cf-beacon]')) {
                      status.scriptState = 'Active';
                    }
                    break;

                  case 'Vercel Analytics':
                    status.name = 'Vercel Analytics';
                    status.configId = 'Managed by @vercel/analytics';
                    status.consentRequired = false;
                    status.consent.status = 'Not Required';
                    if (window.va || window.vaq) {
                       status.scriptState = 'Active';
                    }
                    break;
                }
                return status;
              };

              const report = {
                timestamp: new Date().toISOString(),
                fullConsentState: consentState,
                services: {
                  gtm: getServiceStatus('Google Tag Manager'),
                  ga4: getServiceStatus('Google Analytics'),
                  clarity: getServiceStatus('Microsoft Clarity'),
                  facebook: getServiceStatus('Facebook Pixel'),
                  cloudflare: getServiceStatus('Cloudflare Analytics'),
                  vercel: getServiceStatus('Vercel Analytics'),
                },
                table: function() {
                  console.log('--- Analytics Status Report ---');
                  console.log('Full Consent State:', this.fullConsentState);
                  
                  const tableData = Object.values(this.services).map(service => ({
                    'Service': service.name,
                    'Script State': service.scriptState,
                    'Consent Status': service.consent.status,
                    'Config ID': service.configId || 'N/A'
                  }));

                  console.table(tableData);
                  console.log('-----------------------------');
                }
              };

              return report;
            }
          })();
        `}
      </Script>
    </>
  );
}
