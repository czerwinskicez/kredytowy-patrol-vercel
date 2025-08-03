# Components Documentation

This document provides an overview of the key components in the Kredytowy Patrol application.

## Core Components

### `Header.tsx`
- **Description**: The main navigation header for the application. It includes links to different product categories and informational pages.
- **Features**:
  - Responsive design with a mobile-friendly menu.
  - Dropdown menus for nested navigation.

### `Footer.tsx`
- **Description**: The application footer, containing links to legal documents, social media, and other important information.

### `CustomSlider.tsx`
- **Description**: A reusable slider component used for selecting loan amounts and periods.
- **Styling**: Styled with Tailwind CSS for a consistent look and feel.

## Loan Components

### `Ranking.tsx`
- **Description**: A server component that displays a ranked list of loan offers.
- **Data**: Fetches loan data using `getLoanOffers`.
- **Features**:
  - Interactive sliders for loan amount and period.
  - Real-time calculation of monthly payments and total costs.

### `LoanCard.tsx`
- **Description**: A component that displays a single loan offer with all its details.
- **Data**: Receives a `LoanOffer` object as a prop.
- **Features**:
  - Displays provider logo, interest rates, RRSO, and other key details.
  - Includes a call-to-action button to the provider's website.

## Deposit Components

### `DepositRanking.tsx`
- **Description**: A component for displaying and comparing standard deposit offers.
- **Data**: Fetches data using `getDepositOffers`.

### `DepositCard.tsx`
- **Description**: Renders a single standard deposit offer.

### `CurrencyDepositRanking.tsx`
- **Description**: A sophisticated component for displaying and filtering currency deposit offers.
- **Data**: Fetches data using `getCurrencyDepositOffers`.
- **Features**:
  - **Multi-select currency filter**: Allows users to compare offers in different currencies (EUR, USD, etc.).
  - **Period filter**: Filters offers by deposit duration.
  - **Amount slider**: Adjusts the deposit amount to calculate potential profit.
  - **Combined ranking**: Ranks all selected currency offers together based on profitability for a given period.

### `CurrencyDepositCard.tsx`
- **Description**: Renders a single currency deposit offer.
- **Features**:
  - **Floating currency badge**: A stylish badge in the top-right corner indicates the currency of the offer (e.g., EUR, USD).
  - **Clear presentation**: Displays key information like profit, interest rate, and total return.

## SEO & Metadata

### `StructuredData.tsx`
- **Description**: A component that injects JSON-LD structured data into the page for SEO purposes.
- **Data**: Uses data from `baseMetadata` in `src/lib/metadata.ts`.

### `sitemap.ts` & `robots.ts`
- **Description**: These files generate the `sitemap.xml` and `robots.txt` files, respectively, to guide search engine crawlers.

This component-based architecture allows for easy maintenance and scalability of the application. Each component is designed to be reusable and focused on a specific piece of functionality.
