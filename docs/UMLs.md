# 🔄 Diagramy UML - Mechanizmy Kredytowy Patrol

## 📋 Spis Treści
1. [Diagram Sekwencji - Pobieranie Danych Finansowych](#diagram-sekwencji---pobieranie-danych-finansowych)
2. [Diagram Aktywności - Proces Obliczania Ofert](#diagram-aktywności---proces-obliczania-ofert)
3. [Diagram Sekwencji - Wysyłanie Formularza Kontaktowego](#diagram-sekwencji---wysyłanie-formularza-kontaktowego)
4. [Diagram Stanu - Zarządzanie Zgodami GDPR](#diagram-stanu---zarządzanie-zgodami-gdpr)
5. [Diagram Sekwencji - System Cache i Rewalidacji](#diagram-sekwencji---system-cache-i-rewalidacji)
6. [Diagram Komponentów - Architektura Analityki](#diagram-komponentów---architektura-analityki)

---

## 1. Diagram Sekwencji - Pobieranie Danych Finansowych

Ten diagram pokazuje jak aplikacja pobiera i przetwarza dane o produktach finansowych z Google Sheets.

```mermaid
sequenceDiagram
    participant Browser
    participant VercelEdge as Vercel Edge
    participant NextApp as Next.js App
    participant GoogleAPI as Google Sheets API
    participant ServiceWorker as Service Worker
    participant Cache as Next.js Cache

    Browser->>VercelEdge: GET /kredyty/gotowkowy
    VercelEdge->>NextApp: Route request
    
    NextApp->>Cache: Check cached data
    alt Cache Miss
        NextApp->>GoogleAPI: getLoanOffers("gotowkowy")
        GoogleAPI->>GoogleAPI: Authenticate with Service Account
        GoogleAPI->>GoogleAPI: Query Kredyt_Gotówkowy sheet
        GoogleAPI->>GoogleAPI: Query Logo sheet
        GoogleAPI-->>NextApp: Raw sheet data
        NextApp->>NextApp: Parse & validate data
        NextApp->>NextApp: Merge loans with logos
        NextApp->>Cache: Store processed data
    else Cache Hit
        Cache-->>NextApp: Return cached data
    end
    
    NextApp->>NextApp: Server-side render with data
    NextApp-->>VercelEdge: HTML + JSON payload
    VercelEdge-->>Browser: Optimized response
    
    Browser->>Browser: Hydrate React components
    Browser->>ServiceWorker: Cache static assets
    ServiceWorker->>ServiceWorker: Store in browser cache
    
    Note over Browser,GoogleAPI: Subsequent requests served from cache<br/>until revalidation triggers
```

---

## 2. Diagram Aktywności - Proces Obliczania Ofert

Pokazuje jak komponenty React obliczają i sortują oferty finansowe na podstawie parametrów użytkownika.

```mermaid
flowchart TD
    A[("🎯 User Input<br/>Amount & Months")] --> B{{"🔍 Filter Offers<br/>amount ≤ maxLoanValue<br/>months ≤ maxLoanTime"}}
    
    B --> C[("💰 Calculate Financials<br/>for each offer")]
    
    C --> D["📊 Calculate Commission<br/>commissionAmount = principal × (commission/100)"]
    D --> E["💳 Calculate Total Principal<br/>totalPrincipal = principal + commissionAmount"]
    E --> F["📈 Calculate Monthly Rate<br/>monthlyRate = totalPrincipal × formula"]
    F --> G["💸 Calculate Total Amount<br/>totalAmount = monthlyRate × months"]
    
    G --> H{{"🏷️ Categorize Offers"}}
    
    H --> I["⭐ Promoted Offers<br/>promoted = true"]
    H --> J["📋 Regular Offers<br/>!hidden && !promoted"]
    
    I --> K["🔝 Sort Promoted<br/>by monthlyRate ASC"]
    J --> L["📊 Sort Regular<br/>by monthlyRate ASC"]
    
    K --> M[("🎨 Render LoanCards<br/>with calculated data")]
    L --> M
    
    M --> N["👀 Display to User"]
    
    N --> O{{"⚡ User Changes Input?"}}
    O -->|Yes| A
    O -->|No| P[("✅ End Process")]
    
    style A fill:#e3f2fd
    style C fill:#f3e5f5
    style H fill:#e8f5e8
    style M fill:#fff3e0
    style N fill:#fce4ec
```

---

## 3. Diagram Sekwencji - Wysyłanie Formularza Kontaktowego

Przedstawia pełny przepływ danych od wypełnienia formularza do zapisu w Firebase Firestore.

```mermaid
sequenceDiagram
    participant User as 👤 User
    participant Form as 📝 Contact Form
    participant Browser as 🌐 Browser
    participant VercelAPI as 🚀 Vercel API
    participant FirebaseFunc as 🔥 Firebase Function
    participant Firestore as 🗄️ Firestore
    participant Admin as 👨‍💼 Admin Panel

    User->>Form: Fill contact form
    Form->>Form: Validate client-side
    Form->>Browser: Collect metadata<br/>(userAgent, referrer, screen)
    
    Browser->>VercelAPI: POST /api/contact<br/>{name, email, message, clientMetadata}
    
    VercelAPI->>VercelAPI: Server-side validation
    VercelAPI->>VercelAPI: Collect server metadata<br/>(IP, country, headers)
    VercelAPI->>VercelAPI: Build service account key
    
    VercelAPI->>FirebaseFunc: POST submitContactForm<br/>{data + serviceAccountKey + metadata}
    
    FirebaseFunc->>FirebaseFunc: Validate request
    FirebaseFunc->>FirebaseFunc: Initialize Admin SDK
    FirebaseFunc->>FirebaseFunc: Prepare document data
    
    FirebaseFunc->>Firestore: Create document in<br/>contact_submissions collection
    Firestore-->>FirebaseFunc: Document created
    
    FirebaseFunc-->>VercelAPI: {success: true, message}
    VercelAPI-->>Browser: Success response
    Browser->>Form: Show success message
    Form->>User: Display confirmation
    
    Note over Firestore,Admin: Admin can view submissions<br/>in Firebase Console
    
    alt Error Handling
        FirebaseFunc->>FirebaseFunc: Validation fails
        FirebaseFunc-->>VercelAPI: {success: false, error}
        VercelAPI-->>Browser: Error response
        Browser->>Form: Show error message
        Form->>User: Display error
    end
```

---

## 4. Diagram Stanu - Zarządzanie Zgodami GDPR

Pokazuje stany i przejścia w systemie zarządzania zgodami użytkownika zgodnie z GDPR.

```mermaid
stateDiagram-v2
    [*] --> Initial: Page Load
    
    Initial --> CheckingStorage: Check localStorage
    
    CheckingStorage --> NoConsent: No saved consent
    CheckingStorage --> ValidatingConsent: Found saved consent
    
    ValidatingConsent --> ValidConsent: Valid & not expired
    ValidatingConsent --> ExpiredConsent: Expired or invalid version
    
    NoConsent --> ShowingBanner: Display cookie banner
    ExpiredConsent --> ShowingBanner: Clear old consent
    
    ShowingBanner --> AcceptAll: User clicks "Accept All"
    ShowingBanner --> RejectAll: User clicks "Reject All"
    ShowingBanner --> CustomizeConsent: User clicks "Customize"
    
    CustomizeConsent --> PartialConsent: User selects preferences
    
    AcceptAll --> ConsentGranted: All services enabled
    RejectAll --> ConsentMinimal: Only necessary cookies
    PartialConsent --> ConsentPartial: Selected services enabled
    ValidConsent --> ConsentRestored: Restore previous settings
    
    ConsentGranted --> InitializeAnalytics: Enable GA4, GTM, Clarity, Facebook
    ConsentMinimal --> InitializeMinimal: Enable only Cloudflare
    ConsentPartial --> InitializeSelective: Enable based on consent
    ConsentRestored --> InitializeSelective: Restore analytics state
    
    InitializeAnalytics --> Active: System fully operational
    InitializeMinimal --> Active: Basic functionality only
    InitializeSelective --> Active: Partial functionality
    
    Active --> ShowingBanner: User opens preferences
    Active --> ConsentUpdated: Settings changed
    ConsentUpdated --> UpdateAnalytics: Apply new consent
    UpdateAnalytics --> Active: Updated state
    
    state ConsentGranted {
        necessary: true
        analytics: true
        marketing: true
        preferences: true
    }
    
    state ConsentMinimal {
        necessary: true
        analytics: false
        marketing: false
        preferences: false
    }
    
    state ConsentPartial {
        necessary: true
        analytics: ?
        marketing: ?
        preferences: ?
    }
```

---

## 5. Diagram Sekwencji - System Cache i Rewalidacji

Ilustruje jak działa system cache'owania i automatycznej rewalidacji przy zmianach danych.

```mermaid
sequenceDiagram
    participant Admin as 👨‍💼 Admin
    participant GoogleSheets as 📊 Google Sheets
    participant AppsScript as 📜 Apps Script
    participant VercelAPI as 🚀 Vercel API
    participant NextCache as 💾 Next.js Cache
    participant ServiceWorker as ⚡ Service Worker
    participant Users as 👥 Users

    Admin->>GoogleSheets: Edit loan offer data
    GoogleSheets->>AppsScript: onEdit trigger
    
    AppsScript->>AppsScript: Get edited sheet name
    AppsScript->>VercelAPI: POST /api/revalidate<br/>{sheetName: "Kredyt_Gotówkowy"}
    
    VercelAPI->>VercelAPI: Validate secret token
    VercelAPI->>VercelAPI: Map sheet to route<br/>"Kredyt_Gotówkowy" → "gotowkowy"
    
    VercelAPI->>NextCache: revalidatePath("/kredyty/gotowkowy")
    VercelAPI->>NextCache: revalidateTag("loanOffers")
    
    NextCache->>NextCache: Invalidate cached data
    NextCache->>NextCache: Mark for regeneration
    
    VercelAPI-->>AppsScript: {revalidated: true}
    
    Note over NextCache,Users: Next user request triggers<br/>fresh data fetch
    
    Users->>VercelAPI: GET /kredyty/gotowkowy
    VercelAPI->>GoogleSheets: Fresh API call
    GoogleSheets-->>VercelAPI: Updated data
    VercelAPI->>NextCache: Cache new data
    VercelAPI-->>Users: Updated page
    
    Users->>ServiceWorker: Cache new assets
    ServiceWorker->>ServiceWorker: Update local cache
    
    alt Global Revalidation
        AppsScript->>VercelAPI: POST /api/revalidate<br/>{sheetName: "ALL"}
        VercelAPI->>NextCache: revalidatePath("/", "layout")
        VercelAPI->>NextCache: revalidateTag("sanity")
        Note over NextCache: Revalidate entire site
    end
    
    alt Logo Update
        AppsScript->>VercelAPI: POST /api/revalidate<br/>{sheetName: "Logo"}
        VercelAPI->>NextCache: revalidatePath("/", "layout")
        Note over NextCache: Logos affect all pages
    end
```

---

## 6. Diagram Komponentów - Architektura Analityki

Pokazuje architekturę systemu analityki z wieloma platformami i zarządzaniem zgodami.

```mermaid
graph TB
    subgraph "🎭 Consent Management Layer"
        ConsentContext["🍪 ConsentContext<br/><small>Zarządzanie zgodami GDPR</small>"]
        ConsentBanner["🔔 CookieBanner<br/><small>UI zgód użytkownika</small>"]
        ConsentStorage["💾 LocalStorage<br/><small>Przechowywanie preferencji</small>"]
    end
    
    subgraph "🪝 React Hooks Layer"
        useAnalytics["📊 useAnalytics Hook<br/><small>Consent-aware tracking</small>"]
        useConsent["🎯 useConsent Hook<br/><small>Dostęp do stanu zgód</small>"]
    end
    
    subgraph "🔧 Analytics Core Library"
        AnalyticsManager["⚙️ analytics.ts<br/><small>Multi-platform manager</small>"]
        ConsentMapper["🗺️ Consent Mapper<br/><small>GDPR → Platform mapping</small>"]
        EventValidator["✅ Event Validator<br/><small>Data validation & sanitization</small>"]
    end
    
    subgraph "📈 Analytics Platforms"
        GTM["🏷️ Google Tag Manager<br/><small>Central tag management</small>"]
        GA4["📊 Google Analytics 4<br/><small>Behavioral analytics</small>"]
        Clarity["🔍 Microsoft Clarity<br/><small>Session recording & heatmaps</small>"]
        FacebookPixel["📘 Facebook Pixel<br/><small>Conversion tracking</small>"]
        CloudflareAnalytics["☁️ Cloudflare Analytics<br/><small>Privacy-first metrics</small>"]
        VercelAnalytics["🚀 Vercel Analytics<br/><small>Performance monitoring</small>"]
    end
    
    subgraph "🎨 UI Components"
        LoanCard["💳 LoanCard<br/><small>Bank link tracking</small>"]
        Ranking["🏆 Ranking<br/><small>Filter usage tracking</small>"]
        Calculator["🧮 Calculator<br/><small>Usage analytics</small>"]
        ContactForm["📝 ContactForm<br/><small>Form events</small>"]
    end
    
    subgraph "📊 Event Types"
        PageViews["👁️ Page Views<br/><small>Navigation tracking</small>"]
        LoanEvents["💰 Loan Events<br/><small>Interest, comparison, clicks</small>"]
        UserActions["🖱️ User Actions<br/><small>Filters, calculations, forms</small>"]
        ConversionEvents["🎯 Conversions<br/><small>Newsletter, contact, bank CTAs</small>"]
    end
    
    %% Consent Flow
    ConsentBanner --> ConsentContext
    ConsentContext --> ConsentStorage
    ConsentContext --> useConsent
    
    %% Analytics Hook Flow
    useConsent --> useAnalytics
    useAnalytics --> AnalyticsManager
    
    %% Core Analytics Flow
    AnalyticsManager --> ConsentMapper
    AnalyticsManager --> EventValidator
    ConsentMapper --> GTM
    ConsentMapper --> GA4
    ConsentMapper --> Clarity
    ConsentMapper --> FacebookPixel
    
    %% Always-on Analytics (no consent required)
    AnalyticsManager --> CloudflareAnalytics
    AnalyticsManager --> VercelAnalytics
    
    %% Component Events
    LoanCard --> useAnalytics
    Ranking --> useAnalytics
    Calculator --> useAnalytics
    ContactForm --> useAnalytics
    
    %% Event Classification
    useAnalytics --> PageViews
    useAnalytics --> LoanEvents
    useAnalytics --> UserActions
    useAnalytics --> ConversionEvents
    
    %% Platform-specific Events
    GTM --> GA4
    GTM --> FacebookPixel
    PageViews --> GA4
    LoanEvents --> GA4
    UserActions --> Clarity
    ConversionEvents --> FacebookPixel
    
    %% Styling
    classDef consent fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    classDef hooks fill:#f3e5f5,stroke:#4a148c,stroke-width:2px  
    classDef core fill:#e8f5e8,stroke:#1b5e20,stroke-width:2px
    classDef platforms fill:#fff3e0,stroke:#e65100,stroke-width:2px
    classDef components fill:#fce4ec,stroke:#880e4f,stroke-width:2px
    classDef events fill:#f1f8e9,stroke:#33691e,stroke-width:2px
    
    class ConsentContext,ConsentBanner,ConsentStorage consent
    class useAnalytics,useConsent hooks
    class AnalyticsManager,ConsentMapper,EventValidator core
    class GTM,GA4,Clarity,FacebookPixel,CloudflareAnalytics,VercelAnalytics platforms
    class LoanCard,Ranking,Calculator,ContactForm components
    class PageViews,LoanEvents,UserActions,ConversionEvents events
```

---

## 🔍 Szczegóły Implementacyjne

### Kluczowe Mechanizmy:

1. **Pobieranie Danych**: Server-side rendering z cache'owaniem na wielu poziomach
2. **Obliczenia Finansowe**: Real-time calculations w React z useMemo optimization
3. **Formularze**: Proxy przez Vercel API → Firebase Functions → Firestore
4. **GDPR**: Zaawansowany system zgód z mapowaniem na platformy analityczne
5. **Cache**: Multi-layer strategy z automatyczną rewalidacją
6. **Analityka**: Consent-aware tracking z obsługą 6+ platform

### Performance Optimizations:

- **Server Components**: Dane pobierane na serwerze, bez wpływu na bundle size
- **Service Worker**: Intelligent caching strategy dla różnych typów zasobów
- **React Optimizations**: useMemo, useCallback dla expensive calculations
- **Edge Computing**: Vercel Edge Functions dla globalnej dystrybucji

### Security Features:

- **Service Account Authentication**: Bezpieczny dostęp do Google Sheets API
- **Environment Variables**: Sensitive data oddzielone od kodu
- **CORS Protection**: Ograniczenie dostępu do API endpoints
- **Input Validation**: Walidacja na wszystkich poziomach (client/server/Firebase)

---

*Diagramy UML wygenerowane dla projektu Kredytowy Patrol*  
*Ostatnia aktualizacja: Styczeń 2025*
