// Service Worker for Kredytowy Patrol
// Cache version will be replaced during build
const CACHE_VERSION = '1753895628637-c43f2d8';
const CACHE_NAME = `kredytowy-patrol-${CACHE_VERSION}`;
const STATIC_CACHE = `static-${CACHE_VERSION}`;

// Files to cache
const STATIC_FILES = [
  '/logo_male.png',
  '/kredytowy_pies.png',
  '/favicon.ico',
  '/site.webmanifest',
];

// Install event
self.addEventListener('install', (event) => {
  console.log(`Installing SW version: ${CACHE_VERSION}`);
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        return cache.addAll(STATIC_FILES);
      })
      .catch((error) => {
        console.error('Cache installation failed:', error);
      })
  );
  // Skip waiting to activate immediately
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log(`Activating SW version: ${CACHE_VERSION}`);
  event.waitUntil(
    Promise.all([
      // Clear old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Delete any cache that doesn't match current version
            if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Take control of all clients immediately
      self.clients.claim()
    ])
  );
});

// Fetch event with improved caching strategy
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip non-HTTP requests
  if (!event.request.url.startsWith('http')) {
    return;
  }

  // Skip analytics and tracking requests
  if (event.request.url.includes('analytics') || 
      event.request.url.includes('gtag') ||
      event.request.url.includes('fbevents') ||
      event.request.url.includes('vercel') ||
      event.request.url.includes('google-analytics')) {
    return;
  }

  // Handle different types of requests
  const url = new URL(event.request.url);
  
  // Special handling for homepage - Network First strategy
  if (url.pathname === '/' && event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // If network fails, try to serve from cache
          return caches.match(event.request);
        })
    );
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // If we have a cached response, return it
        if (cachedResponse) {
          // For HTML pages (except homepage), check for updates in background
          if (event.request.mode === 'navigate' && url.pathname !== '/') {
            // Background fetch to update cache
            fetch(event.request)
              .then((response) => {
                if (response && response.status === 200) {
                  const responseClone = response.clone();
                  caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseClone);
                  });
                }
              })
              .catch(() => {
                // Network failed, use cached version
              });
          }
          return cachedResponse;
        }

        // No cached response, fetch from network
        return fetch(event.request)
          .then((response) => {
            // Don't cache if not a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response for caching
            const responseToCache = response.clone();

            // Determine caching strategy based on request type
            const shouldCache = 
              // Cache static assets
              event.request.url.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|webp|avif)$/) ||
              // Cache HTML pages (except homepage)
              (event.request.mode === 'navigate' && url.pathname !== '/') ||
              // Cache API responses (with shorter TTL)
              event.request.url.includes('/api/');

            if (shouldCache) {
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                })
                .catch((error) => {
                  console.error('Failed to cache response:', error);
                });
            }

            return response;
          })
          .catch(() => {
            // Network failed - return offline fallback if available
            if (event.request.mode === 'navigate') {
              return caches.match('/').then((fallback) => {
                return fallback || new Response(
                  '<html><body><h1>Offline</h1><p>Sprawdź połączenie internetowe</p></body></html>',
                  { headers: { 'Content-Type': 'text/html' } }
                );
              });
            }
            // For other requests, just fail
            throw new Error('Network failed and no cache available');
          });
      })
  );
});

// Background sync for analytics
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-analytics') {
    event.waitUntil(
      // Handle background analytics sync
      Promise.resolve()
    );
  }
});

// Push notifications (for future use)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/favicon-96x96.png',
      badge: '/favicon-32x32.png',
      tag: 'kredytowy-patrol',
      data: data.url,
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.notification.data) {
    event.waitUntil(
      clients.openWindow(event.notification.data)
    );
  }
});

// Handle service worker updates
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
}); 