# Kredytowy Patrol - Dokumentacja Projektu

Witamy w dokumentacji projektu **Kredytowy Patrol** - nowoczesnej aplikacji internetowej do porównywania ofert kredytowych i lokat. Ta dokumentacja zapewnia kompleksowy przegląd aplikacji, od architektury technicznej po proces wdrażania.

## 🎯 O Projekcie

Kredytowy Patrol to aplikacja internetowa stworzona w technologii Next.js, której głównym celem jest dostarczanie aktualnych rankingów produktów finansowych:

- **Kredyty gotówkowe, hipoteczne i konsolidacyjne**
- **Lokaty standardowe (PLN)**
- **Lokaty walutowe (EUR, USD, CHF)**

Aplikacja została zoptymalizowana pod kątem wydajności, SEO i doświadczenia użytkownika, wykorzystując najnowsze technologie webowe.

## 🚀 Kluczowe Funkcjonalności

- **Rankingi produktów finansowych** z dynamicznymi kalkulatorami
- **Filtrowanie i porównywanie** ofert według różnych kryteriów
- **Responsywny design** dostosowany do wszystkich urządzeń
- **Optymalizacja SEO** z danymi strukturalnymi i mapą strony
- **Service Worker** zapewniający działanie offline
- **Analityka użytkowników** z pełną zgodnością GDPR
- **Automatyczne aktualizacje** danych z Google Sheets

## 🛠️ Stos Technologiczny

### Frontend
- **[Next.js 15](https://nextjs.org/)** z App Router - framework React
- **[React 19](https://react.dev/)** - biblioteka UI
- **[TypeScript](https://www.typescriptlang.org/)** - statyczne typowanie
- **[Tailwind CSS 4](https://tailwindcss.com/)** - framework CSS

### Backend & API
- **[Google Sheets API](https://developers.google.com/sheets/api)** - źródło danych
- **[Vercel](https://vercel.com/)** - hosting i deployment
- **[Server-Side Rendering (SSR)](https://nextjs.org/docs/app/building-your-application/rendering/server-components)** - optymalizacja SEO

### Analityka & Monitoring
- **[Vercel Analytics](https://vercel.com/analytics)** - metryki wydajności
- **[Vercel Speed Insights](https://vercel.com/speed-insights)** - Core Web Vitals
- **[Google Analytics 4](https://analytics.google.com/)** - śledzenie użytkowników
- **[Microsoft Clarity](https://clarity.microsoft.com/)** - nagrywanie sesji

## 📁 Struktura Projektu

```
kredytowy-patrol-vercel/
├── docs/                    # Dokumentacja projektu
├── public/                  # Zasoby statyczne
│   ├── logos/              # Logo banków
│   └── sw.js               # Service Worker
├── scripts/                 # Skrypty pomocnicze
│   └── build-sw.js         # Budowanie Service Workera
├── src/
│   ├── app/                # Routing (App Router)
│   │   ├── api/            # Endpointy API
│   │   ├── kredyty/        # Strony kredytów
│   │   ├── lokata/         # Strony lokat
│   │   └── layout.tsx      # Główny layout
│   ├── components/         # Komponenty React
│   ├── contexts/           # Konteksty React
│   ├── hooks/              # Niestandardowe hooki
│   ├── lib/                # Logika biznesowa
│   └── types/              # Definicje TypeScript
└── package.json            # Zależności i skrypty
```

## 📚 Dokumentacja Szczegółowa

### Architektura i Struktura
- **[Architektura Aplikacji](docs/ARCHITECTURE.md)** - struktura projektu, kluczowe decyzje technologiczne
- **[Komponenty](docs/COMPONENTS.md)** - przegląd najważniejszych komponentów React
- **[Przepływ Danych](docs/DATA_FLOW.md)** - jak dane są pobierane i zarządzane

### Optymalizacja i SEO
- **[Strategia SEO](docs/SEO.md)** - techniki optymalizacji dla wyszukiwarek
- **[Service Worker](docs/SW.md)** - implementacja cache'owania i działania offline
- **[Analityka](docs/ANALYTICS.md)** - kompleksowy system śledzenia użytkowników

### Wdrażanie i Utrzymanie
- **[Wdrożenie](docs/DEPLOYMENT.md)** - proces budowania i wdrażania na Vercel
- **[Polityka Prywatności](docs/POLITYKA%20PRYWATNOŚCI.md)** - zasady ochrony danych
- **[Regulamin Serwisu](docs/REGULAMIN%20SERWISU.md)** - warunki korzystania

## 🚀 Szybki Start

### Wymagania Systemowe

- **Node.js** (wersja 18+)
- **npm** lub **yarn**
- **Git**

### Instalacja i Uruchomienie

1. **Sklonuj repozytorium:**
   ```bash
   git clone <adres-repozytorium>
   cd kredytowy-patrol-vercel
   ```

2. **Zainstaluj zależności:**
   ```bash
   npm install
   ```

3. **Skonfiguruj zmienne środowiskowe:**
   ```bash
   cp env.example .env.local
   # Edytuj .env.local i dodaj wymagane klucze API
   ```

4. **Uruchom w trybie deweloperskim:**
   ```bash
   npm run dev
   ```

   Aplikacja będzie dostępna pod adresem `http://localhost:3000`

### Zmienne Środowiskowe

Utwórz plik `.env.local` z następującymi zmiennymi:

```bash
# Google Sheets API
GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id
GOOGLE_SHEETS_CLIENT_EMAIL=your_service_account_email
GOOGLE_SHEETS_PRIVATE_KEY=your_private_key

# Analityka
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_CONTAINER_ID=GTM-XXXXXXX
NEXT_PUBLIC_CLARITY_PROJECT_ID=your_clarity_id

# SEO
NEXT_PUBLIC_SITE_URL=https://kredytowypatrol.pl
```

## 🏗️ Skrypty NPM

```bash
npm run dev          # Uruchomienie w trybie deweloperskim
npm run build        # Budowanie aplikacji (z Service Worker)
npm run build:sw     # Budowanie tylko Service Workera
npm run start        # Uruchomienie w trybie produkcyjnym
npm run lint         # Sprawdzenie jakości kodu
```

## 🔧 Kluczowe Funkcje Techniczne

### Service Worker
- Automatyczne cache'owanie zasobów
- Działanie offline
- Inteligentne strategie cache'owania
- Automatyczne aktualizacje przy każdym deployu

### Optymalizacja SEO
- Server-Side Rendering (SSR)
- Dynamiczne metadane
- Dane strukturalne (JSON-LD)
- Automatyczna mapa strony
- Optymalizacja Core Web Vitals

### Analityka i Monitoring
- Pełna zgodność z GDPR
- Śledzenie zachowań użytkowników
- Metryki wydajności
- Nagrywanie sesji i heatmapy

## 🤝 Współpraca

### Struktura Branchy
- `main` - główna gałąź produkcyjna
- `develop` - gałąź deweloperska
- `feature/*` - nowe funkcjonalności
- `hotfix/*` - szybkie poprawki

### Proces Deployu
1. Push do `main` automatycznie uruchamia build na Vercel
2. Service Worker jest automatycznie aktualizowany
3. Nowa wersja jest dostępna w ciągu kilku minut

## 📊 Monitoring i Analityka

Aplikacja wykorzystuje zaawansowany stack analityczny:

- **Vercel Analytics** - metryki wydajności i Core Web Vitals
- **Google Analytics 4** - śledzenie zachowań użytkowników
- **Microsoft Clarity** - nagrywanie sesji i heatmapy
- **Cloudflare Analytics** - analiza ruchu z zachowaniem prywatności

Więcej szczegółów w [dokumentacji analityki](docs/ANALYTICS.md).

## 🔒 Bezpieczeństwo i Prywatność

- Pełna zgodność z RODO/GDPR
- Zgoda na cookies z możliwością wyboru
- Bezpieczne zarządzanie kluczami API
- Szyfrowanie danych w transporcie

## 📞 Wsparcie

W przypadku pytań lub problemów:

1. Sprawdź odpowiednią sekcję dokumentacji
2. Przejrzyj [dokumentację architektury](docs/ARCHITECTURE.md)
3. Skonsultuj [dokumentację wdrożenia](docs/DEPLOYMENT.md)

---

**Kredytowy Patrol** - Nowoczesne porównywanie produktów finansowych 🏦 