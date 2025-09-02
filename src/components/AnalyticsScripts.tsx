'use client';

import Script from 'next/script';
import { ANALYTICS_CONFIG } from '@/lib/analytics';

export function AnalyticsScripts() {
  return (
    <>
      {/* Google Tag Manager */}
      {ANALYTICS_CONFIG.GTM_CONTAINER_ID && (
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

      {/* Microsoft Clarity */}
      {ANALYTICS_CONFIG.CLARITY_PROJECT_ID && (
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

      {/* Facebook Pixel Base Code */}
      {ANALYTICS_CONFIG.FACEBOOK_PIXEL_ID && (
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

      {/* --- OW Analytics Status Function --- */}
      <Script id="ow-analytics-status" strategy="lazyOnload">
        {`
          (function() {
            window.ow = window.ow || {};
            window.ow.analytics = window.ow.analytics || {};
            window.ow.analytics.status = function() {
              const getClarityStatus = () => {
                if (typeof window.clarity !== 'function') return 'Not Found';
                const clarityCookie = document.cookie.split(';').some(c => c.trim().startsWith('_clck=') || c.trim().startsWith('_clsk='));
                return clarityCookie ? 'Tracking Active (Cookie found)' : 'Initialized, but tracking might be blocked';
              };
              
              const getFbPixelStatus = () => {
                if (typeof window.fbq !== 'function') return 'Not Found';
                if (window.fbq.getState) {
                   const state = window.fbq.getState();
                   if (state && state.pixels && state.pixels.length > 0) {
                     return 'Initialized (ID: ' + state.pixels[0].id + ')';
                   }
                   return 'Initialized, but no pixel data found';
                }
                return 'Initialized (getState not available)';
              };

              const getGtmStatus = () => {
                if (!window.dataLayer) return 'Not Found';
                const gtmLoaded = window.dataLayer.some(e => e.event === 'gtm.js' || e.event === 'gtm.load');
                return gtmLoaded ? 'Loaded and Executed' : 'Initialized, but not fully loaded';
              };

              const status = {
                'Google Tag Manager': {
                  'State': !!window.google_tag_manager,
                  'Status': getGtmStatus(),
                  'Config ID': '${ANALYTICS_CONFIG.GTM_CONTAINER_ID || 'Not set'}'
                },
                'Google Analytics (gtag.js)': {
                  'State': typeof window.gtag === 'function',
                  'Status': typeof window.gtag === 'function' ? 'Initialized' : 'Not Found',
                  'Config ID': '${ANALYTICS_CONFIG.GA_MEASUREMENT_ID || 'Not set'}'
                },
                'Microsoft Clarity': {
                  'State': typeof window.clarity === 'function',
                  'Status': getClarityStatus(),
                  'Config ID': '${ANALYTICS_CONFIG.CLARITY_PROJECT_ID || 'Not set'}'
                },
                'Facebook Pixel': {
                  'State': typeof window.fbq === 'function',
                  'Status': getFbPixelStatus(),
                  'Config ID': '${ANALYTICS_CONFIG.FACEBOOK_PIXEL_ID || 'Not set'}'
                }
              };

              console.log('--- Detailed Analytics Status ---');
              console.table(status);
              console.log('-------------------------------');
            }
          })();
        `}
      </Script>
    </>
  );
} 