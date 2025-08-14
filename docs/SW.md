# Service Worker Documentation

Ten dokument opisuje implementację Service Workera w aplikacji Kredytowy Patrol, zapewniającego działanie offline i optymalizację wydajności.

## 🚀 **Przegląd Service Workera**

Service Worker w aplikacji Kredytowy Patrol zapewnia:
- **Działanie offline** - aplikacja działa nawet bez połączenia z internetem
- **Inteligentne cache'owanie** - zasoby są cache'owane dla szybszego dostępu
- **Automatyczne aktualizacje** - nowa wersja jest automatycznie wdrażana przy każdym buildzie
- **Performance optimization** - szybsze ładowanie dla powracających użytkowników

## 🏗️ **Automatyczne Budowanie**

### **Skrypt Build Script**

Service Worker jest automatycznie budowany przy każdym buildzie aplikacji za pomocą skryptu `scripts/build-sw.js`:

```javascript
// scripts/build-sw.js
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function buildServiceWorker() {
  const swTemplatePath = path.join(__dirname, '../public/sw.js');
  const swOutputPath = path.join(__dirname, '../public/sw.js');
  
  // Generuj unikalną wersję
  const timestamp = Date.now();
  const gitHash = getGitHash();
  const version = `${timestamp}-${gitHash}`;
  
  // Wczytaj szablon
  let swContent = fs.readFileSync(swTemplatePath, 'utf8');
  
  // Zastąp placeholder wersją
  swContent = swContent.replace(/__CACHE_VERSION__/g, version);
  
  // Zapisz zaktualizowany Service Worker
  fs.writeFileSync(swOutputPath, swContent);
  
  // Utwórz plik z metadanymi wersji
  const versionData = {
    version,
    timestamp,
    gitHash,
    buildDate: new Date().toISOString()
  };
  
  fs.writeFileSync(
    path.join(__dirname, '../public/sw-version.json'),
    JSON.stringify(versionData, null, 2)
  );
  
  console.log(`✅ Service Worker built with version: ${version}`);
}

function getGitHash() {
  try {
    const { execSync } = require('child_process');
    return execSync('git rev-parse --short HEAD').toString().trim();
  } catch (error) {
    return 'unknown';
  }
}

buildServiceWorker();
```

### **Integracja z Build Process**

Service Worker jest automatycznie budowany przed każdym buildem Next.js:

```json
// package.json
{
  "scripts": {
    "build": "node scripts/build-sw.js && next build --turbopack",
    "build:sw": "node scripts/build-sw.js"
  }
}
```

## 🔧 **Konfiguracja Service Workera**

### **Główny Plik Service Workera**

```javascript
// public/sw.js
const CACHE_VERSION = '__CACHE_VERSION__';
const CACHE_NAME = `kredytowy-patrol-${CACHE_VERSION}`;

// Zasoby do cache'owania
const STATIC_CACHE = [
  '/',
  '/offline',
  '/static/css/main.css',
  '/static/js/main.js',
  '/images/logo.png',
  '/favicon.ico'
];

// Strategie cache'owania
const CACHE_STRATEGIES = {
  STATIC: 'cache-first',
  API: 'network-first',
  IMAGES: 'stale-while-revalidate',
  FONTS: 'cache-first'
};

// Inicjalizacja Service Workera
self.addEventListener('install', (event) => {
  console.log(`Service Worker installing version: ${CACHE_VERSION}`);
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching static resources');
        return cache.addAll(STATIC_CACHE);
      })
      .then(() => {
        console.log('Service Worker installed successfully');
        return self.skipWaiting();
      })
  );
});

// Aktywacja i czyszczenie starych cache'ów
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker activated');
        return self.clients.claim();
      })
  );
});
```

## 📱 **Strategie Cache'owania**

### **Cache-First Strategy**

Dla statycznych zasobów, które rzadko się zmieniają:

```javascript
// Cache-first dla statycznych zasobów
self.addEventListener('fetch', (event) => {
  if (event.request.destination === 'style' || 
      event.request.destination === 'script' ||
      event.request.destination === 'image') {
    
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          if (response) {
            return response; // Zwróć z cache
          }
          
          return fetch(event.request)
            .then((response) => {
              if (!response || response.status !== 200) {
                return response;
              }
              
              // Cache'uj nowy zasób
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });
              
              return response;
            });
        })
    );
  }
});
```

### **Network-First Strategy**

Dla dynamicznych danych, które muszą być aktualne:

```javascript
// Network-first dla API calls
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            // Cache'uj udaną odpowiedź
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
          }
          return response;
        })
        .catch(() => {
          // Fallback do cache'u
          return caches.match(event.request);
        })
    );
  }
});
```

### **Stale-While-Revalidate Strategy**

Dla zasobów, które mogą być cache'owane, ale powinny być aktualizowane w tle:

```javascript
// Stale-while-revalidate dla obrazów
self.addEventListener('fetch', (event) => {
  if (event.request.destination === 'image') {
    event.respondWith(
      caches.match(event.request)
        .then((cachedResponse) => {
          const fetchPromise = fetch(event.request)
            .then((networkResponse) => {
              // Aktualizuj cache w tle
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, networkResponse.clone());
                });
              return networkResponse;
            });
          
          return cachedResponse || fetchPromise;
        })
    );
  }
});
```

## 🏦 **Cache'owanie Produktów Finansowych**

### **Cache'owanie Ofert Kredytowych**

```javascript
// Cache'uj oferty kredytowe
const cacheLoanOffers = async (loanType, offers) => {
  const cache = await caches.open(CACHE_NAME);
  const response = new Response(JSON.stringify(offers), {
    headers: { 'Content-Type': 'application/json' }
  });
  
  await cache.put(`/api/loans/${loanType}`, response);
};

// Pobierz oferty z cache'u
const getCachedLoanOffers = async (loanType) => {
  const cache = await caches.open(CACHE_NAME);
  const response = await cache.match(`/api/loans/${loanType}`);
  
  if (response) {
    return response.json();
  }
  
  return null;
};
```

### **Cache'owanie Lokat i Obligacji**

```javascript
// Cache'uj różne typy produktów
const PRODUCT_CACHE_KEYS = {
  LOANS: '/api/loans',
  DEPOSITS: '/api/deposits',
  CURRENCY_DEPOSITS: '/api/currency-deposits',
  SAVINGS_ACCOUNTS: '/api/savings-accounts',
  TREASURY_BONDS: '/api/treasury-bonds'
};

// Cache'uj produkty finansowe
const cacheFinancialProducts = async (type, data) => {
  const cache = await caches.open(CACHE_NAME);
  const response = new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' }
  });
  
  await cache.put(PRODUCT_CACHE_KEYS[type], response);
};
```

## 📝 **Cache'owanie Blogu FinanSowa**

### **Cache'owanie Postów**

```javascript
// Cache'uj posty blogowe
const cacheBlogPosts = async (posts) => {
  const cache = await caches.open(CACHE_NAME);
  
  // Cache'uj listę postów
  const postsResponse = new Response(JSON.stringify(posts), {
    headers: { 'Content-Type': 'application/json' }
  });
  await cache.put('/api/blog/posts', postsResponse);
  
  // Cache'uj pojedyncze posty
  for (const post of posts) {
    const postResponse = new Response(JSON.stringify(post), {
      headers: { 'Content-Type': 'application/json' }
    });
    await cache.put(`/api/blog/posts/${post.slug}`, postResponse);
  }
};

// Pobierz post z cache'u
const getCachedBlogPost = async (slug) => {
  const cache = await caches.open(CACHE_NAME);
  const response = await cache.match(`/api/blog/posts/${slug}`);
  
  if (response) {
    return response.json();
  }
  
  return null;
};
```

## 🔄 **Aktualizacje i Synchronizacja**

### **Background Sync**

```javascript
// Background sync dla aktualizacji danych
self.addEventListener('sync', (event) => {
  if (event.tag === 'update-financial-data') {
    event.waitUntil(updateFinancialData());
  }
  
  if (event.tag === 'update-blog-content') {
    event.waitUntil(updateBlogContent());
  }
});

// Aktualizuj dane finansowe w tle
const updateFinancialData = async () => {
  try {
    // Aktualizuj cache z nowymi danymi
    await updateLoansCache();
    await updateDepositsCache();
    await updateBondsCache();
    
    console.log('Financial data updated in background');
  } catch (error) {
    console.error('Background sync failed:', error);
  }
};

// Aktualizuj treści blogowe w tle
const updateBlogContent = async () => {
  try {
    await updateBlogCache();
    console.log('Blog content updated in background');
  } catch (error) {
    console.error('Blog sync failed:', error);
  }
};
```

### **Push Notifications**

```javascript
// Obsługa push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Nowe oferty finansowe!',
    icon: '/images/notification-icon.png',
    badge: '/images/badge-icon.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Zobacz oferty',
        icon: '/images/checkmark.png'
      },
      {
        action: 'close',
        title: 'Zamknij',
        icon: '/images/xmark.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Kredytowy Patrol', options)
  );
});

// Obsługa kliknięć w notifications
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/kredyty/gotowkowy')
    );
  }
});
```

## 📱 **Offline Support**

### **Offline Page**

```javascript
// Strona offline
const offlinePage = `
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Brak połączenia - Kredytowy Patrol</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
        .offline-icon { font-size: 64px; margin-bottom: 20px; }
        .retry-button { padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; }
    </style>
</head>
<body>
    <div class="offline-icon">📱</div>
    <h1>Brak połączenia z internetem</h1>
    <p>Niektóre funkcje mogą być niedostępne offline.</p>
    <button class="retry-button" onclick="window.location.reload()">Spróbuj ponownie</button>
</body>
</html>
`;

// Cache'uj stronę offline
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        const offlineResponse = new Response(offlinePage, {
          headers: { 'Content-Type': 'text/html' }
        });
        return cache.put('/offline', offlineResponse);
      })
  );
});

// Fallback do strony offline
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match('/offline');
        })
    );
  }
});
```

## 🔍 **Debugging i Monitoring**

### **Service Worker Logs**

```javascript
// Rozszerzone logowanie dla debugowania
const logEvent = (event, data) => {
  console.log(`[SW ${CACHE_VERSION}] ${event}:`, data);
  
  // Wyślij logi do analytics (jeśli dostępne)
  if (self.analytics) {
    self.analytics.track('service_worker_event', {
      event,
      version: CACHE_VERSION,
      timestamp: Date.now(),
      ...data
    });
  }
};

// Użyj w event listenerach
self.addEventListener('fetch', (event) => {
  logEvent('fetch', {
    url: event.request.url,
    method: event.request.method,
    mode: event.request.mode
  });
  
  // ... reszta logiki
});
```

### **Performance Monitoring**

```javascript
// Monitoruj wydajność cache'owania
const cachePerformance = {
  hits: 0,
  misses: 0,
  errors: 0
};

// Aktualizuj metryki
const updateCacheMetrics = (type) => {
  cachePerformance[type]++;
  
  // Wyślij metryki do analytics
  if (self.analytics) {
    self.analytics.track('cache_performance', {
      ...cachePerformance,
      hit_rate: cachePerformance.hits / (cachePerformance.hits + cachePerformance.misses)
    });
  }
};

// Użyj w strategiach cache'owania
self.addEventListener('fetch', (event) => {
  if (event.request.destination === 'image') {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          if (response) {
            updateCacheMetrics('hits');
            return response;
          } else {
            updateCacheMetrics('misses');
            return fetch(event.request);
          }
        })
        .catch(() => {
          updateCacheMetrics('errors');
        })
    );
  }
});
```

## 🚀 **Optymalizacje Wydajności**

### **Precaching Strategiczne**

```javascript
// Precache'uj krytyczne zasoby
const CRITICAL_RESOURCES = [
  '/',
  '/kredyty/gotowkowy',
  '/lokata',
  '/static/css/main.css',
  '/static/js/main.js',
  '/images/logo.png'
];

// Precaching podczas instalacji
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Precaching critical resources');
        return cache.addAll(CRITICAL_RESOURCES);
      })
  );
});
```

### **Inteligentne Cache'owanie**

```javascript
// Inteligentne cache'owanie na podstawie użycia
const cacheUsage = new Map();

// Śledź użycie zasobów
self.addEventListener('fetch', (event) => {
  const url = event.request.url;
  cacheUsage.set(url, (cacheUsage.get(url) || 0) + 1);
  
  // Cache'uj często używane zasoby
  if (cacheUsage.get(url) > 3) {
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then((cache) => {
          return fetch(event.request)
            .then((response) => {
              if (response && response.status === 200) {
                cache.put(event.request, response.clone());
              }
            });
        })
    );
  }
});
```

## 🔒 **Bezpieczeństwo**

### **Content Security Policy**

```javascript
// CSP dla Service Workera
const cspHeaders = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' https:",
    "frame-src 'none'",
    "object-src 'none'"
  ].join('; ')
};

// Dodaj nagłówki bezpieczeństwa
self.addEventListener('fetch', (event) => {
  if (event.request.destination === 'document') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const newResponse = new Response(response.body, response);
          Object.entries(cspHeaders).forEach(([key, value]) => {
            newResponse.headers.set(key, value);
          });
          return newResponse;
        })
    );
  }
});
```

## 📊 **Metryki i Raportowanie**

### **Cache Statistics**

```javascript
// Statystyki cache'owania
const getCacheStats = async () => {
  const cacheNames = await caches.keys();
  const stats = {};
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    stats[cacheName] = {
      size: keys.length,
      keys: keys.map(req => req.url)
    };
  }
  
  return stats;
};

// Wyślij statystyki do analytics
const reportCacheStats = async () => {
  const stats = await getCacheStats();
  
  if (self.analytics) {
    self.analytics.track('cache_statistics', {
      timestamp: Date.now(),
      version: CACHE_VERSION,
      stats
    });
  }
};

// Raportuj co godzinę
setInterval(reportCacheStats, 60 * 60 * 1000);
```

---

**Kredytowy Patrol** - Service Worker zapewniający wydajność i offline support 🏦 