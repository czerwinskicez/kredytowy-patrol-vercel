# Kredytowy Patrol - Dokumentacja Wewnętrzna

## 🎯 **Przegląd Projektu**

**Kredytowy Patrol** to aplikacja Next.js do porównywania produktów finansowych:
- Kredyty (gotówkowe, hipoteczne, konsolidacyjne)
- Lokaty (PLN, walutowe)
- Konta oszczędnościowe
- Obligacje skarbowe
- Blog FinanSowa (CMS Sanity.io)

## 🚀 **Szybki Start**

### Wymagania
- Node.js 18+
- npm/yarn
- Git

### Instalacja
```bash
git clone <repo>
cd kredytowy-patrol-vercel
npm install
cp env.example .env.local
# Uzupełnij zmienne środowiskowe
npm run dev
```

## 📁 **Struktura Projektu**

```
src/
├── app/                    # App Router (Next.js 15)
│   ├── api/               # Endpointy API
│   │   ├── newsletter/    # Newsletter subscription
│   │   ├── contact/       # Formularz kontaktowy
│   │   └── revalidate/    # Cache revalidation
│   ├── finansowa/         # Blog FinanSowa
│   ├── kredyty/           # Strony kredytów
│   ├── lokata/            # Strony lokat
│   └── [inne-sekcje]/     # Pozostałe sekcje
├── components/             # Komponenty React
│   ├── ContactForm.tsx    # Formularz kontaktowy
│   ├── NewsletterSection.tsx # Newsletter signup
│   └── [inne-komponenty]/ # Pozostałe komponenty
├── lib/                    # Logika biznesowa
│   ├── google-sheets.ts   # Integracja z Google Sheets
│   ├── sanity.ts          # CMS Sanity.io
│   └── analytics.ts       # Analityka
└── types/                  # Definicje TypeScript
```

## 🔧 **Konfiguracja**

### Zmienne Środowiskowe
```bash
# Google Sheets API
GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id
GOOGLE_SHEETS_CLIENT_EMAIL=your_service_account_email
GOOGLE_SHEETS_PRIVATE_KEY=your_private_key

# Firebase Backend
FIREBASE_FUNCTIONS_URL=https://europe-central2-PROJECT-ID.cloudfunctions.net
FIREBASE_PROJECT_ID=twoj-project-id
FIREBASE_PRIVATE_KEY_ID=klucz-prywatny-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@projekt.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=client-id
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/...
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n

# Sanity.io CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=6yfusasm
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-06-10
SANITY_API_READ_TOKEN=your_read_token

# Analityka
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_CONTAINER_ID=GTM-XXXXXXX
NEXT_PUBLIC_CLARITY_PROJECT_ID=your_clarity_id
```

## 📚 **Dokumentacja Szczegółowa**

### Architektura i Struktura
- **[Architektura](docs/ARCHITECTURE.md)** - struktura projektu, decyzje technologiczne
- **[Komponenty](docs/COMPONENTS.md)** - przegląd komponentów React
- **[Przepływ Danych](docs/DATA_FLOW.md)** - źródła danych i ich przepływ
- **[Firebase API](docs/FIREBASE.md)** - dokumentacja backendu i API
- **[Brand Guide](docs/brandguide.md)** - identyfikacja wizualna

### Optymalizacja i SEO
- **[SEO](docs/SEO.md)** - strategia optymalizacji
- **[Service Worker](docs/SW.md)** - cache'owanie i offline
- **[Analityka](docs/ANALYTICS.md)** - system śledzenia użytkowników

### Wdrażanie i Utrzymanie
- **[Wdrożenie](docs/DEPLOYMENT.md)** - proces budowania i wdrażania
- **[Polityka Prywatności](docs/POLITYKA%20PRYWATNOŚCI.md)** - RODO/GDPR
- **[Regulamin](docs/REGULAMIN%20SERWISU.md)** - warunki korzystania

## 🎛️ **Panele Sterowania**

### Dane Produktów Finansowych
- **[Google Sheets](https://docs.google.com/spreadsheets/d/1YX6oAWYoAcqhv8iF4AGFL0VTvkGFApyocEF-L2P2-JU/edit?gid=263687724#gid=263687724)** - główne źródło danych o ofertach

### CMS Blog FinanSowa
- **[Sanity Studio](https://finansowa.sanity.studio/structure)** - zarządzanie treścią bloga

## 🛠️ **Skrypty NPM**

```bash
npm run dev          # Development z Turbopack
npm run build        # Build + Service Worker
npm run build:sw     # Tylko Service Worker
npm run start        # Production
npm run lint         # ESLint
```

## 🔄 **Źródła Danych**

### Google Sheets
- **Kredyt_Gotówkowy** - oferty kredytów gotówkowych
- **Kredyt_Hipoteczny** - oferty kredytów hipotecznych  
- **Kredyt_Konsolidacyjny** - oferty kredytów konsolidacyjnych
- **Lokata** - lokaty PLN
- **Lokaty_Walutowe** - lokaty walutowe
- **Logo** - logo banków i instytucji

### Sanity.io CMS
- **Post** - wpisy na blogu
- **Author** - autorzy
- **Category** - kategorie wpisów

## 📊 **Analityka**

- **Google Analytics 4** - zachowania użytkowników
- **Google Tag Manager** - zarządzanie tagami
- **Microsoft Clarity** - nagrywanie sesji
- **Vercel Analytics** - metryki wydajności
- **Cloudflare Analytics** - analiza ruchu

## 🚀 **Deployment**

### Frontend (Vercel)
- **Platforma**: Vercel
- **CI/CD**: Automatyczny przy push do `main`
- **Service Worker**: Automatyczna aktualizacja przy każdym buildzie
- **Rewalidacja**: On-demand przez `/api/revalidate`

### Backend (Firebase)
- **Firebase Functions**: region `europe-central2` (Warszawa)
- **Firestore**: baza danych NoSQL
- **Security Rules**: dostęp tylko przez Admin SDK
- **Deploy**: `firebase deploy --only functions`

## 🔒 **Bezpieczeństwo**

- Pełna zgodność z RODO/GDPR
- Zgoda na cookies z wyborem
- Bezpieczne zarządzanie kluczami API
- Firebase Security Rules
- Service Account authentication
- CORS protection
- Input validation i sanitization
- Szyfrowanie w transporcie

## 📞 **Wsparcie**

1. Sprawdź odpowiednią sekcję dokumentacji w `./docs/`
2. Przejrzyj [architekturę](docs/ARCHITECTURE.md)
3. Skonsultuj [wdrożenie](docs/DEPLOYMENT.md)

---

**Kredytowy Patrol** - Nowoczesne porównywanie produktów finansowych 🏦 