'use client';

import { useEffect } from 'react';

export function PageSpeedOptimizer() {
  useEffect(() => {
    // Preload critical resources
    const preloadCriticalResources = () => {
      // Preload Google Fonts
      const fontLink = document.createElement('link');
      fontLink.rel = 'preload';
      fontLink.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@40,200,0,0';
      fontLink.as = 'style';
      document.head.appendChild(fontLink);

      // Preload critical images
      const heroImage = new Image();
      heroImage.src = '/kredytowy_pies.png';
      
      const logoImage = new Image();
      logoImage.src = '/logo_male.png';
    };

    // Lazy load non-critical resources
    const lazyLoadResources = () => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          preloadCriticalResources();
        });
      } else {
        setTimeout(preloadCriticalResources, 1);
      }
    };

    // Optimize images loading
    const optimizeImages = () => {
      const images = document.querySelectorAll('img[data-src]');
      
      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement;
              img.src = img.dataset.src || '';
              img.classList.remove('lazy');
              imageObserver.unobserve(img);
            }
          });
        });

        images.forEach((img) => imageObserver.observe(img));
      }
    };

    // Service Worker registration for caching
    const registerServiceWorker = () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(() => {
          // Service worker registration failed - ignore silently
        });
      }
    };

    // Critical CSS inlining hint
    const inlineCriticalCSS = () => {
      const criticalCSS = `
        /* Critical above-the-fold styles */
        .hero-section { background-color: #0a472e; }
        .header { position: sticky; top: 0; z-index: 50; }
        .font-loading { font-display: swap; }
      `;
      
      const style = document.createElement('style');
      style.textContent = criticalCSS;
      document.head.insertBefore(style, document.head.firstChild);
    };

    // Initialize optimizations
    lazyLoadResources();
    optimizeImages();
    registerServiceWorker();
    inlineCriticalCSS();

    // Performance monitoring
    if ('performance' in window && 'PerformanceObserver' in window) {
      try {
        // Monitor Largest Contentful Paint
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.entryType === 'largest-contentful-paint') {
              console.log('LCP:', entry.startTime);
            }
          });
        });
        observer.observe({ entryTypes: ['largest-contentful-paint'] });

        // Monitor Cumulative Layout Shift
        const clsObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            const layoutShiftEntry = entry as any;
            if (!layoutShiftEntry.hadRecentInput) {
              console.log('CLS:', layoutShiftEntry.value);
            }
          });
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        // Performance monitoring failed - ignore silently
      }
    }
  }, []);

  return null; // This component doesn't render anything
} 