# Architektura Aplikacji

Ten dokument opisuje architekturę aplikacji Kredytowy Patrol, strukturę projektu oraz kluczowe decyzje technologiczne.

## 🚀 **Przegląd Technologii**

Aplikacja została zbudowana na nowoczesnym stosie technologicznym, zoptymalizowanym pod kątem wydajności, skalowalności i łatwości utrzymania.

### **Frontend Framework**
- **[Next.js 15](https://nextjs.org/)** z App Router - najnowsza wersja z Turbopack
- **[React 19](https://react.dev/)** - najnowsza wersja z nowymi funkcjami
- **[TypeScript 5](https://www.typescriptlang.org/)** - statyczne typowanie
- **[Tailwind CSS 4](https://tailwindcss.com/)** - najnowsza wersja z nowymi funkcjami

### **Backend & Integracje**
- **[Sanity.io](https://www.sanity.io/)** - Headless CMS do zarządzania treścią bloga "FinanSowa"
- **[Google Sheets API](https://developers.google.com/sheets/api)** - źródło danych dla ofert finansowych
- **[Vercel](https://vercel.com/)** - hosting i deployment z automatycznym CI/CD

### **Analityka & Monitoring**
- **[Vercel Analytics](https://vercel.com/analytics)** - metryki wydajności i Core Web Vitals
- **[Google Analytics 4](https://analytics.google.com/)** - śledzenie zachowań użytkowników
- **[Microsoft Clarity](https://clarity.microsoft.com/)** - nagrywanie sesji i heatmapy
- **[Cloudflare Analytics](https://www.cloudflare.com/web-analytics/)** - analiza ruchu z zachowaniem prywatności

## 📁 **Struktura Katalogów**

Struktura projektu jest zorganizowana w sposób modułowy i zgodny z konwencjami Next.js 15:

```
kredytowy-patrol-vercel/
├── .sanity/              # Konfiguracja i lokalne studio deweloperskie Sanity.io
├── docs/                  # Dokumentacja projektu
├── public/                # Statyczne zasoby
│   ├── logos/            # Logo banków i instytucji finansowych
│   ├── sw.js             # Service Worker (generowany automatycznie)
│   └── [inne-assets]/    # Obrazy, ikony, manifesty
├── scripts/               # Skrypty pomocnicze
│   └── build-sw.js       # Budowanie Service Workera z unikalną wersją
├── src/
│   ├── app/               # Routing aplikacji (App Router)
│   │   ├── api/           # Endpointy API (revalidate, etc.)
│   │   ├── finansowa/     # Blog FinanSowa (CMS)
│   │   │   ├── aktualnosci/ # Lista postów
│   │   │   └── kategorie/   # Kategorie postów
│   │   ├── kredyty/       # Sekcja kredytów
│   │   │   └── [slug]/    # Dynamiczne strony kredytów
│   │   ├── lokata/        # Sekcja lokat PLN
│   │   ├── lokaty-walutowe/ # Sekcja lokat walutowych
│   │   ├── konto-oszczednosciowe/ # Konta oszczędnościowe
│   │   ├── obligacje-skarbowe/ # Obligacje skarbowe
│   │   ├── layout.tsx     # Główny layout aplikacji
│   │   ├── page.tsx       # Strona główna
│   │   ├── sitemap.ts     # Generowanie mapy strony
│   │   └── robots.ts      # Konfiguracja robots.txt
│   ├── components/        # Komponenty React wielokrotnego użytku
│   │   ├── Header.tsx     # Nagłówek z nawigacją
│   │   ├── Footer.tsx     # Stopka
│   │   ├── LoanCard.tsx   # Karta kredytu
│   │   ├── DepositCard.tsx # Karta lokaty
│   │   ├── Ranking.tsx    # Rankingi produktów
│   │   └── [inne-komponenty]/ # Pozostałe komponenty
│   ├── contexts/          # Konteksty React
│   │   └── ConsentContext.tsx # Zarządzanie zgodą na cookies
│   ├── hooks/             # Niestandardowe hooki React
│   │   └── useAnalytics.ts # Hook do analityki
│   ├── lib/               # Logika biznesowa i funkcje pomocnicze
│   │   ├── google-sheets.ts # Integracja z Google Sheets API
│   │   ├── sanity.ts      # Klient i funkcje do pobierania danych z Sanity.io
│   │   ├── analytics.ts   # Obsługa analityki i śledzenia
│   │   ├── metadata.ts    # Metadane SEO i Open Graph
│   │   └── treasury-bonds-calculations.ts # Kalkulacje obligacji
│   └── types/             # Definicje typów TypeScript
│       ├── index.ts       # Główne typy aplikacji
│       └── analytics.ts   # Typy analityki
├── tailwind.config.ts     # Konfiguracja Tailwind CSS 4
├── next.config.ts         # Konfiguracja Next.js 15
├── postcss.config.mjs     # Konfiguracja PostCSS
├── tsconfig.json          # Konfiguracja TypeScript
└── package.json           # Zależności i skrypty projektu
```

## 🔧 **Kluczowe Decyzje Technologiczne**

### **Next.js 15 z App Router**
- **Server Components** - domyślnie renderowanie po stronie serwera dla lepszego SEO
- **Static Site Generation (SSG)** - generowanie statycznych stron dla maksymalnej wydajności
- **Incremental Static Regeneration (ISR)** - automatyczne odświeżanie treści
- **Turbopack** - szybsze budowanie w trybie development

### **TypeScript 5**
- **Strict Mode** - pełne sprawdzanie typów
- **Generic Types** - elastyczne typy dla komponentów
- **Utility Types** - wbudowane typy pomocnicze
- **Type Guards** - bezpieczne sprawdzanie typów w runtime

### **Tailwind CSS 4**
- **CSS-in-JS** - nowe podejście do stylowania
- **Design Tokens** - spójny system designu
- **Performance** - lepsza optymalizacja CSS
- **Modern Features** - najnowsze funkcje CSS

### **Sanity.io CMS**
- **Headless Architecture** - oddzielenie treści od prezentacji
- **Real-time Collaboration** - współpraca w czasie rzeczywistym
- **GROQ Query Language** - zaawansowane zapytania do danych
- **Portable Text** - format treści niezależny od platformy

## 🔄 **Architektura Danych**

### **Źródła Danych**
1. **Google Sheets** - produkty finansowe (kredyty, lokaty, obligacje)
2. **Sanity.io** - treści bloga FinanSowa
3. **Static Data** - metadane, konfiguracja

### **Przepływ Danych**
```
Google Sheets → API → Server Components → UI
     ↓
Sanity.io → GROQ → Server Components → UI
     ↓
Static Data → Build Time → Pre-rendered Pages
```

### **Cache'owanie**
- **Next.js Cache** - automatyczne cache'owanie na poziomie frameworka
- **Service Worker** - cache'owanie zasobów po stronie klienta
- **CDN** - cache'owanie statycznych zasobów przez Vercel

## 🚀 **Performance & SEO**

### **Optymalizacja Wydajności**
- **Server-Side Rendering** - szybkie pierwsze renderowanie
- **Static Generation** - pre-renderowane strony
- **Image Optimization** - automatyczna optymalizacja obrazów
- **Code Splitting** - automatyczne dzielenie kodu
- **Service Worker** - cache'owanie i offline support

### **SEO Optimization**
- **Structured Data** - JSON-LD schema markup
- **Dynamic Metadata** - metadane generowane dynamicznie
- **Sitemap Generation** - automatyczna mapa strony
- **Robots.txt** - konfiguracja dla crawlerów
- **Open Graph** - metadane dla social media

## 🔒 **Bezpieczeństwo**

### **Authentication & Authorization**
- **Environment Variables** - bezpieczne przechowywanie kluczy API
- **Service Account** - Google Sheets API authentication
- **Read-only Tokens** - Sanity.io API tokens
- **CORS Protection** - ochrona przed cross-origin requests

### **Data Protection**
- **GDPR Compliance** - pełna zgodność z RODO
- **Cookie Consent** - zarządzanie zgodą użytkowników
- **Data Encryption** - szyfrowanie w transporcie
- **Privacy-first Analytics** - analityka z poszanowaniem prywatności

## 📊 **Monitoring & Analytics**

### **Performance Monitoring**
- **Vercel Analytics** - Core Web Vitals, performance metrics
- **Real User Monitoring** - rzeczywiste dane użytkowników
- **Error Tracking** - automatyczne śledzenie błędów

### **User Analytics**
- **Google Analytics 4** - zachowania użytkowników, konwersje
- **Microsoft Clarity** - nagrywanie sesji, heatmapy
- **Custom Events** - śledzenie specyficznych akcji

## 🔄 **Deployment & CI/CD**

### **Vercel Platform**
- **Automatic Deployments** - automatyczne wdrażanie przy push
- **Preview Deployments** - podglądy dla Pull Requestów
- **Edge Functions** - serwery na krawędzi sieci
- **Global CDN** - dystrybucja treści na całym świecie

### **Build Process**
1. **Service Worker Build** - generowanie unikalnej wersji SW
2. **Next.js Build** - kompilacja aplikacji
3. **Static Generation** - generowanie statycznych stron
4. **Deployment** - wdrożenie na Vercel

---

**Kredytowy Patrol** - Nowoczesna architektura dla produktów finansowych 🏦 