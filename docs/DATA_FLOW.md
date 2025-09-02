# Przepływ Danych

Ten dokument opisuje przepływ danych w aplikacji Kredytowy Patrol, od źródeł danych po komponenty wyświetlające informacje.

## 🔄 **Źródła Danych**

### **Google Sheets - Produkty Finansowe**
Główne źródło danych dla ofert kredytowych, lokat i innych produktów finansowych. Pozwala na łatwe aktualizacje i zarządzanie danymi bez wymagania zmian w kodzie.

- **Spreadsheet ID**: Przechowywane w `process.env.GOOGLE_SHEETS_SPREADSHEET_ID`
- **Authentication**: Używa konta serwisowego z credentials w zmiennych środowiskowych (`GOOGLE_SHEETS_CLIENT_EMAIL`, `GOOGLE_SHEETS_PRIVATE_KEY`)
- **Access**: Tylko do odczytu (read-only)

### **Sanity.io CMS - Blog "FinanSowa"**
Treści na bloga "FinanSowa" są zarządzane za pomocą headless CMS **Sanity.io**. Takie podejście oddziela zarządzanie treścią od kodu aplikacji, co umożliwia osobom nietechnicznym łatwe dodawanie i edytowanie postów przez dedykowany panel (Sanity Studio).

- **URL do Studio**: `https://finansowa.sanity.studio/structure`
- **Authentication**: Dostęp do Sanity Studio jest chroniony i wymaga logowania
- **API Access**: Token tylko do odczytu (`SANITY_API_READ_TOKEN`)

## 📊 **Struktura Danych Google Sheets**

### **Arkusze Kredytów**
- **`Kredyt_Gotówkowy`** - oferty kredytów gotówkowych
- **`Kredyt_Hipoteczny`** - oferty kredytów hipotecznych  
- **`Kredyt_Konsolidacyjny`** - oferty kredytów konsolidacyjnych

### **Arkusze Lokat**
- **`Lokata`** - lokaty standardowe w PLN
- **`Lokaty_Walutowe`** - lokaty w walutach obcych (EUR, USD, GBP, CHF)

### **Inne Produkty**
- **`Konto_Oszczędnościowe`** - konta oszczędnościowe
- **`Konta_Firmowe`** - konta firmowe dla przedsiębiorców
- **`Obligacje_Skarbowe`** - obligacje skarbowe

### **Arkusze Pomocnicze**
- **`Logo`** - logo banków i instytucji finansowych

## 🔍 **Pobieranie Danych**

### **Oferty Finansowe (Google Sheets)**
Dane są pobierane po stronie serwera za pomocą biblioteki `googleapis`. Główna logika znajduje się w `src/lib/google-sheets.ts`.

#### **1. `getLogos()`**
- **Sheet**: `Logo`
- **Function**: Pobiera listę nazw dostawców i odpowiadające im URL-e logo
- **Usage**: Dane są używane do wzbogacenia ofert o branding wizualny

#### **2. `getLoanOffers(loanType: string)`**
- **Sheets**: `Kredyt_Gotówkowy`, `Kredyt_Hipoteczny`, `Kredyt_Konsolidacyjny`
- **Function**: Pobiera oferty kredytowe dla określonego typu kredytu
- **Mapping**: Parametr `loanType` jest mapowany na odpowiadającą nazwę arkusza
- **Enrichment**: Łączy dane kredytowe z logo z `getLogos()`

#### **3. `getDepositOffers()`**
- **Sheet**: `Lokata`
- **Function**: Pobiera standardowe oferty lokat (w PLN)
- **Enrichment**: Łączy dane lokat z logo

#### **4. `getCurrencyDepositOffers()`**
- **Sheet**: `Lokaty_Walutowe`
- **Function**: Pobiera oferty lokat walutowych
- **Enrichment**: Łączy dane lokat z logo

#### **5. `getSavingsAccountOffers()`**
- **Sheet**: `Konto_Oszczędnościowe`
- **Function**: Pobiera oferty kont oszczędnościowych
- **Enrichment**: Łączy dane z logo

#### **6. `getBusinessAccountOffers()`**
- **Sheet**: `Konta_Firmowe`
- **Function**: Pobiera oferty kont firmowych
- **Data**: provider, accountFeeMin, accountFeeMax, cardFeeMin, cardFeeMax, atmWithdrawalMin, atmWithdrawalMax, bonus, promoted, hidden, extraLabel, url
- **Enrichment**: Łączy dane z logo

#### **7. `getTreasuryBondOffers()`**
- **Sheet**: `Obligacje_Skarbowe`
- **Function**: Pobiera oferty obligacji skarbowych
- **Enrichment**: Łączy dane z logo

### **Blog "FinanSowa" (Sanity.io)**
Dane z Sanity.io są pobierane po stronie serwera za pomocą biblioteki `next-sanity`. Logika zapytań znajduje się w `src/lib/sanity.ts`. Zapytania są pisane w języku GROQ.

#### **Główne Funkcje**
- **`getPosts()`**: Pobiera listę wszystkich opublikowanych postów, posortowaną po dacie
- **`getPost(slug)`**: Pobiera pojedynczy post na podstawie jego `slug`
- **`getCategories()`**: Pobiera listę kategorii
- **`getPostsByCategory(categoryId)`**: Pobiera posty z określonej kategorii

## 🏗️ **Struktura Danych Sanity.io**

### **Typy Dokumentów**
- **`Post`**: Główny typ treści zawierający:
  - `title`, `slug`, `author`, `mainImage`
  - `categories`, `publishedAt`, `excerpt`
  - `body` (w formacie Portable Text)
  - `seo` (metadane SEO)

- **`Author`**: Definiuje autora wpisów:
  - `name`, `slug`, `image`, `bio`

- **`Category`**: Pozwala na kategoryzację postów:
  - `title`, `slug`, `image`, `description`

## 📱 **Wyświetlanie Danych**

Pobrane dane są przekazywane jako props do server components, które następnie renderują informacje.

### **Produkty Finansowe**
- **Kredyty**: Wyświetlane w `Ranking.tsx` z użyciem `LoanCard.tsx`
- **Lokaty**: Wyświetlane w `DepositRanking.tsx` z użyciem `DepositCard.tsx`
- **Lokaty Walutowe**: Wyświetlane w `CurrencyDepositRanking.tsx` z użyciem `CurrencyDepositCard.tsx`
- **Konta Oszczędnościowe**: Wyświetlane w `SavingsAccountRanking.tsx` z użyciem `SavingsAccountCard.tsx`
- **Obligacje Skarbowe**: Wyświetlane w `TreasuryBondOffers.tsx` z użyciem `TreasuryBondCard.tsx`

### **Blog Posts**
Wyświetlane na dedykowanych stronach:
- **`/finansowa`**: Lista wszystkich postów (komponent `BlogList`)
- **`/finansowa/[slug]`**: Widok pojedynczego posta (komponent `BlogPost`)
- **`/finansowa/kategorie/[slug]`**: Posty z określonej kategorii

## 🔄 **Rewalidacja i Cache'owanie**

### **On-Demand Revalidation**
Aplikacja używa funkcji Next.js on-demand revalidation do aktualizacji cache'u gdy dane w Google Sheets się zmieniają.

- **Endpoint**: `/api/revalidate`
- **Trigger**: Bezpieczny webhook lub ręczne żądanie do tego endpointu
- **Action**: Wywołuje `revalidateTag` dla określonych stron
- **Cache Tags**: Funkcje w `google-sheets.ts` używają tagów cache (np. `loans`, `deposits`, `savings`, `bonds`)

### **Sanity.io Revalidation**
Zmiany w Sanity.io mogą również wyzwalać rewalidację strony bloga za pomocą webhooków, co zapewnia, że treści są zawsze aktualne bez konieczności przebudowywania całej aplikacji.

## 📊 **Przykłady Struktur Danych**

### **LoanOffer**
```typescript
type LoanOffer = {
  provider: string;
  logo: string;
  name: string;
  baseInterestRate: number;
  commission: number;
  rrso: number;
  maxLoanValue: number;
  maxLoanTime: number;
  representativeExample: string;
  promoted: boolean;
  hidden: boolean;
  extraLabel: string;
};
```

### **DepositOffer**
```typescript
type DepositOffer = {
  provider: string;
  logo: string;
  name: string;
  baseInterestRate: number;
  minDepositValue: number;
  maxDepositValue: number;
  period: number;
  new: boolean;
  newMoney: boolean;
  isOnline: boolean;
  inApp: boolean;
  accNeed: boolean;
  capitalization: string;
  brakeUp: boolean;
  safety: string;
  promoted: boolean;
  hidden: boolean;
};
```

### **Post (Sanity.io)**
```typescript
type Post = {
  _id: string;
  title: string;
  slug: SanitySlug;
  author: Author;
  mainImage: SanityImage;
  categories: Category[];
  publishedAt: string;
  excerpt: string;
  body: any[]; // Portable Text
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: SanityImage;
  };
};
```

## 🚀 **Optymalizacja Wydajności**

### **Server-Side Rendering**
- Dane są pobierane na serwerze podczas renderowania
- Eliminuje potrzebę dodatkowych requestów po stronie klienta
- Poprawia SEO i Core Web Vitals

### **Intelligent Caching**
- Next.js automatycznie cache'uje dane na poziomie frameworka
- Service Worker cache'uje zasoby po stronie klienta
- Vercel CDN cache'uje statyczne zasoby globalnie

### **Data Prefetching**
- Dane są pobierane równolegle za pomocą `Promise.all`
- Optymalizuje czas ładowania strony
- Redukuje waterfall requests

---

**Kredytowy Patrol** - Efektywny przepływ danych dla produktów finansowych 🏦
