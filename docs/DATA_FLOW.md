## Data Flow
This document outlines the data flow within the Kredytowy Patrol application, from data sources to the components that display the information.

### Data Sources
The primary data source for loan and deposit offers is **Google Sheets**. This allows for easy updates and management of financial product data without requiring code changes.

- **Spreadsheet ID**: Stored in `process.env.GOOGLE_SHEETS_SPREADSHEET_ID`
- **Authentication**: Uses a service account with credentials stored in environment variables (`GOOGLE_SHEETS_CLIENT_EMAIL`, `GOOGLE_SHEETS_PRIVATE_KEY`).

### Blog Content: "FinanSowa" (via Sanity.io)
Treści na bloga "FinanSowa" są zarządzane za pomocą headless CMS **Sanity.io**. Takie podejście oddziela zarządzanie treścią od kodu aplikacji, co umożliwia osobom nietechnicznym łatwe dodawanie i edytowanie postów przez dedykowany panel (Sanity Studio).

- **URL do Studio**: Dostępny pod adresem `https://[nazwa-projektu].sanity.studio` (po wdrożeniu).
- **Authentication**: Dostęp do Sanity Studio jest chroniony i wymaga logowania (np. przez Google lub email), co zapewnia bezpieczeństwo.
- **Struktura Danych (Schematy)**: Zdefiniowano następujące typy danych w Sanity:
  - **`Post`**: Główny typ treści. Zawiera pola takie jak `title`, `slug`, `author`, `mainImage`, `categories`, `publishedAt`, treść wpisu (`body` w formacie Portable Text) oraz metadane SEO.
  - **`Author`**: Definiuje autora wpisów, włączając `name`, `slug`, `image` i `bio`.
  - **`Category`**: Pozwala na kategoryzację postów.

### Data Fetching

#### Oferty Finansowe (Google Sheets)
Data is fetched on the server-side using the `googleapis` library. The core logic is located in `src/lib/google-sheets.ts`.

#### 1. **`getLogos()`**
- **Sheet**: `Logo`
- **Function**: Fetches a list of provider names and their corresponding logo URLs. This data is used to enrich the offer data with visual branding.

#### 2. **`getLoanOffers(loanType: string)`**
- **Sheets**: `Kredyt_Gotówkowy`, `Kredyt_Hipoteczny`, `Kredyt_Konsolidacyjny`
- **Function**: Fetches loan offers for a specific loan type. It maps the `loanType` parameter to the corresponding sheet name.
- **Enrichment**: Merges loan data with logos from `getLogos()`.

#### Blog "FinanSowa" (Sanity.io)
Dane z Sanity.io są pobierane po stronie serwera za pomocą biblioteki `next-sanity`. Logika zapytań znajduje się w `src/lib/sanity.ts`. Zapytania są pisane w języku GROQ.

- **`getPosts()`**: Pobiera listę wszystkich opublikowanych postów, posortowaną po dacie.
- **`getPost(slug)`**: Pobiera pojedynczy post na podstawie jego `slug`.
- **`getCategories()` / `getAuthors()`**: Pobiera listy kategorii i autorów.

#### 3. **`getDepositOffers()`**
- **Sheet**: `Lokata`
- **Function**: Fetches standard deposit offers (in PLN).
- **Enrichment**: Merges deposit data with logos.

#### 4. **`getCurrencyDepositOffers()`**
- **Sheet**: `Lokaty_Walutowe`
- **Function**: Fetches currency deposit offers (EUR, USD, etc.).
- **Enrichment**: Merges deposit data with logos.

### Data Display
The fetched data is passed as props to server components, which then render the information.

- **Loan Offers**: Displayed in `Ranking.tsx`, which uses `LoanCard.tsx` to render individual offers.
- **Deposit Offers**: Displayed in `DepositRanking.tsx`, using `DepositCard.tsx`.
- **Currency Deposit Offers**: Displayed in `CurrencyDepositRanking.tsx`, using `CurrencyDepositCard.tsx` for each offer. This component includes advanced filtering by currency, amount, and period.
- **Blog Posts**: Wyświetlane na dedykowanych stronach:
  - `/finansowa`: Lista wszystkich postów (komponent `BlogList`).
  - `/finansowa/[slug]`: Widok pojedynczego posta (komponent `BlogPost`).

### Revalidation
- **On-Demand Revalidation**: The application uses Next.js's on-demand revalidation feature to update the cache when data in Google Sheets changes.
- **Endpoint**: `api/revalidate`
- **Trigger**: A secure webhook or manual request to this endpoint triggers a revalidation of the specified pages (`revalidateTag`).
- **Cache Tags**: Functions in `google-sheets.ts` use cache tags (e.g., `loans`, `deposits`) to control which data gets revalidated.

Zmiany w Sanity.io mogą również wyzwalać rewalidację strony bloga za pomocą webhooków, co zapewnia, że treści są zawsze aktualne bez konieczności przebudowywania całej aplikacji.

This data flow ensures that the application displays up-to-date information while maintaining high performance through server-side rendering and caching.
