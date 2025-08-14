# Wdrożenie i Budowanie

Ten dokument opisuje proces budowania i wdrażania aplikacji Kredytowy Patrol, ze szczególnym uwzględnieniem integracji z platformą Vercel i niestandardowego procesu budowania Service Workera.

## 🚀 **Platforma: Vercel**

Aplikacja jest hostowana na Vercel, platformie stworzonej przez twórców Next.js. Zapewnia to optymalną wydajność, skalowalność i bezproblemowy proces wdrożenia.

### **Kluczowe Funkcje Vercel**

- **Ciągła Integracja i Wdrożenie (CI/CD):** Każde wypchnięcie (push) do głównej gałęzi (`main`) na GitHubie automatycznie uruchamia proces budowania i wdrożenia nowej wersji aplikacji
- **Podglądy Wdrożeń (Preview Deployments):** Każdy Pull Request generuje unikalny, działający podgląd aplikacji, co pozwala na testowanie zmian w izolowanym środowisku przed ich scaleniem
- **Zmienne Środowiskowe:** Klucze API i inne poufne dane są bezpiecznie zarządzane poprzez panel Vercel
- **Edge Functions:** Serwery na krawędzi sieci dla lepszej wydajności
- **Global CDN:** Dystrybucja treści na całym świecie

## 🏗️ **Proces Budowania**

Proces budowania jest zdefiniowany w `package.json` i składa się z dwóch głównych kroków:

```json
"scripts": {
  "dev": "next dev --turbopack",
  "build": "node scripts/build-sw.js && next build --turbopack",
  "build:sw": "node scripts/build-sw.js",
  "start": "next start",
  "lint": "next lint"
}
```

### **Krok 1: Budowanie Service Workera (`npm run build:sw`)**

Przed standardowym procesem budowania Next.js, uruchamiany jest niestandardowy skrypt `scripts/build-sw.js`.

- **Cel:** Skrypt ten generuje unikalną wersję dla Service Workera przy każdym buildzie. Zapobiega to problemom z cache'owaniem i zapewnia, że użytkownicy zawsze otrzymują najnowszą wersję aplikacji
- **Działanie:**
  1. Odczytuje szablon Service Workera z `public/sw.js`
  2. Generuje unikalny identyfikator wersji (oparty na timestampie i hashu commita Git)
  3. Zastępuje placeholder `__CACHE_VERSION__` w szablonie tym identyfikatorem
  4. Zapisuje gotowy Service Worker z powrotem do `public/sw.js`
  5. Tworzy plik `public/sw-version.json` z metadanymi o buildzie (dla celów debuggingu)
- **Więcej informacji:** Zobacz [dokumentację Service Workera](SW.md)

### **Krok 2: Budowanie Aplikacji Next.js 15 (`next build --turbopack`)**

Po przygotowaniu Service Workera, Vercel wykonuje komendę `next build --turbopack`.

- **Turbopack:** Nowy bundler Next.js 15, znacznie szybszy niż Webpack
- **Działanie:**
  1. Kompiluje kod TypeScript 5 i React 19
  2. Renderuje statyczne strony (SSG) z App Router
  3. Optymalizuje zasoby (CSS, JavaScript, obrazy)
  4. Przygotowuje aplikację do wdrożenia na serwerach Vercel
  5. Generuje sitemap.xml i robots.txt

## 🔧 **Konfiguracja Next.js 15**

### **next.config.ts**
```typescript
const nextConfig: NextConfig = {
  // Optymalizacja obrazów
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/6yfusasm/production/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 dni
  },

  // Kompresja
  compress: true,

  // Nagłówki bezpieczeństwa
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },

  // Przekierowania SEO
  async redirects() {
    return [
      { source: '/kredyt', destination: '/kredyty/gotowkowy', permanent: true },
      { source: '/lokaty', destination: '/lokata', permanent: true },
      { source: '/finansowa', destination: '/finansowa/aktualnosci', permanent: true }
    ];
  },
};
```

## 🌍 **Zmienne Środowiskowe**

Do poprawnego działania aplikacji (zarówno lokalnie, jak i na serwerze) wymagane są następujące zmienne środowiskowe:

### **Google Sheets API**
```bash
GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id
GOOGLE_SHEETS_CLIENT_EMAIL=your_service_account_email
GOOGLE_SHEETS_PRIVATE_KEY=your_private_key
```

### **Sanity.io CMS**
```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=6yfusasm
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-06-10
SANITY_API_READ_TOKEN=your_read_token
```

### **Analityka i SEO**
```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_CONTAINER_ID=GTM-XXXXXXX
NEXT_PUBLIC_CLARITY_PROJECT_ID=your_clarity_id
NEXT_PUBLIC_SITE_URL=https://kredytowypatrol.pl
```

### **Konfiguracja Lokalna**
Aby uruchomić projekt lokalnie:
1. Skopiuj plik `env.example` do `.env.local`
2. Uzupełnij wartości zmiennych środowiskowych
3. Uruchom `npm run dev`

### **Konfiguracja Vercel**
W przypadku Vercel, zmienne te należy dodać w ustawieniach projektu w panelu administracyjnym.

## 📱 **Optymalizacja Wydajności**

### **Turbopack**
- **Development:** Znacznie szybsze hot reloading
- **Build:** Szybsze budowanie aplikacji
- **Compatibility:** Pełna kompatybilność z Webpack

### **Image Optimization**
- **Automatic Formats:** AVIF, WebP, JPEG
- **Responsive Images:** Automatyczne generowanie różnych rozmiarów
- **Lazy Loading:** Obrazy są ładowane tylko gdy są potrzebne

### **Code Splitting**
- **Automatic:** Next.js automatycznie dzieli kod na chunki
- **Route-based:** Każda strona ma swój bundle
- **Dynamic Imports:** Lazy loading komponentów

## 🔄 **Rewalidacja i Cache'owanie**

### **On-Demand Revalidation**
Aplikacja używa funkcji Next.js on-demand revalidation do aktualizacji cache'u:

- **Endpoint:** `/api/revalidate`
- **Trigger:** Webhook lub ręczne żądanie
- **Action:** `revalidateTag` dla określonych stron
- **Cache Tags:** `loans`, `deposits`, `savings`, `bonds`, `blog`

### **Static Generation**
- **Build Time:** Strony są generowane podczas builda
- **Incremental:** Nowe strony mogą być dodawane bez pełnego rebuilda
- **Performance:** Maksymalna wydajność dzięki pre-renderowanym stronom

## 🚀 **Deployment Process**

### **Automatyczny Deployment**
1. **Push to main** → automatyczne uruchomienie builda na Vercel
2. **Service Worker Build** → generowanie unikalnej wersji
3. **Next.js Build** → kompilacja z Turbopack
4. **Static Generation** → generowanie statycznych stron
5. **Deployment** → wdrożenie na globalną sieć Vercel

### **Preview Deployments**
- Każdy Pull Request generuje unikalny URL
- Możliwość testowania zmian przed merge
- Automatyczne testy i analiza wydajności

## 📊 **Monitoring i Analityka**

### **Vercel Analytics**
- **Core Web Vitals:** LCP, FID, CLS
- **Performance Metrics:** Czas ładowania, rozmiar bundle
- **Real User Data:** Rzeczywiste dane użytkowników

### **Build Analytics**
- **Build Time:** Czas trwania procesu budowania
- **Bundle Size:** Rozmiar wygenerowanych plików
- **Performance Score:** Ocena wydajności aplikacji

## 🔒 **Bezpieczeństwo**

### **Headers Security**
- **X-Frame-Options:** Zapobiega clickjacking
- **X-Content-Type-Options:** Zapobiega MIME sniffing
- **Referrer-Policy:** Kontrola informacji o referrer
- **Permissions-Policy:** Kontrola dostępu do API przeglądarki

### **Environment Variables**
- **Secure Storage:** Zmienne są bezpiecznie przechowywane w Vercel
- **No Exposure:** Poufne dane nie są widoczne w kodzie klienta
- **Access Control:** Tylko autoryzowane osoby mają dostęp

## 🐛 **Debugging i Troubleshooting**

### **Build Logs**
- **Vercel Dashboard:** Szczegółowe logi z procesu budowania
- **Error Tracking:** Automatyczne wykrywanie błędów
- **Performance Insights:** Analiza wydajności builda

### **Local Development**
```bash
# Development z Turbopack
npm run dev

# Build lokalny
npm run build

# Start production
npm run start

# Analiza bundle
ANALYZE=true npm run build
```

## 📈 **Performance Optimization**

### **Core Web Vitals**
- **LCP (Largest Contentful Paint):** < 2.5s
- **FID (First Input Delay):** < 100ms
- **CLS (Cumulative Layout Shift):** < 0.1

### **Best Practices**
- **Server Components:** Maksymalne wykorzystanie SSR
- **Static Generation:** Pre-renderowanie gdzie to możliwe
- **Image Optimization:** Automatyczna optymalizacja obrazów
- **Code Splitting:** Minimalizacja rozmiaru bundle

---

**Kredytowy Patrol** - Nowoczesne wdrożenie z Next.js 15 i Vercel 🏦 