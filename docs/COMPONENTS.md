# Dokumentacja Komponentów

Ten dokument zawiera przegląd kluczowych komponentów w aplikacji Kredytowy Patrol.

## 🏗️ **Komponenty Główne**

### **`Header.tsx`**
- **Opis**: Główny nagłówek nawigacyjny aplikacji
- **Funkcje**:
  - Responsywny design z menu mobilnym
  - Dropdown menu dla zagnieżdżonej nawigacji
  - Linki do wszystkich sekcji produktów
  - Integracja z blogiem FinanSowa

### **`Footer.tsx`**
- **Opis**: Stopka aplikacji
- **Zawartość**:
  - Linki do dokumentów prawnych
  - Social media
  - Informacje kontaktowe
  - Linki do sekcji produktów

### **`HeroSection.tsx`**
- **Opis**: Sekcja hero na stronie głównej
- **Funkcje**:
  - Główny przekaz marketingowy
  - Call-to-action buttons
  - Responsywny design

## 💳 **Komponenty Kredytów**

### **`Ranking.tsx`**
- **Opis**: Server component wyświetlający ranking ofert kredytowych
- **Dane**: Pobiera dane za pomocą `getLoanOffers`
- **Funkcje**:
  - Interaktywne suwaki dla kwoty i okresu kredytu
  - Kalkulacje w czasie rzeczywistym rat miesięcznych i kosztów całkowitych
  - Filtrowanie i sortowanie ofert

### **`LoanCard.tsx`**
- **Opis**: Komponent wyświetlający pojedynczą ofertę kredytową
- **Props**: Otrzymuje obiekt `LoanOffer`
- **Funkcje**:
  - Logo dostawcy, stopy procentowe, RRSO
  - Szczegóły kredytu (kwota, okres, prowizja)
  - Przycisk CTA do strony dostawcy
  - Responsywny design

### **`PromotedLoansSection.tsx`**
- **Opis**: Sekcja promowanych kredytów na stronie głównej
- **Funkcje**:
  - Wyświetla promowane oferty z różnych kategorii
  - Automatyczne kalkulacje dla każdej oferty
  - Linki do szczegółowych rankingów

## 🏦 **Komponenty Lokat**

### **`DepositRanking.tsx`**
- **Opis**: Komponent do wyświetlania i porównywania standardowych ofert lokat
- **Dane**: Pobiera dane za pomocą `getDepositOffers`
- **Funkcje**:
  - Ranking lokat według oprocentowania
  - Filtrowanie według okresu i kwoty
  - Kalkulacje zysków

### **`DepositCard.tsx`**
- **Opis**: Renderuje pojedynczą standardową ofertę lokaty
- **Funkcje**:
  - Wyświetla kluczowe informacje o lokacie
  - Logo banku i nazwa produktu
  - Oprocentowanie i warunki

### **`CurrencyDepositRanking.tsx`**
- **Opis**: Zaawansowany komponent do wyświetlania i filtrowania lokat walutowych
- **Dane**: Pobiera dane za pomocą `getCurrencyDepositOffers`
- **Funkcje**:
  - **Multi-select filtr walut**: Pozwala na porównywanie ofert w różnych walutach (EUR, USD, GBP, CHF)
  - **Filtr okresu**: Filtruje oferty według czasu trwania lokaty
  - **Suwak kwoty**: Dostosowuje kwotę lokaty do kalkulacji potencjalnego zysku
  - **Połączony ranking**: Ranking wszystkich wybranych ofert walutowych według rentowności dla danego okresu

### **`CurrencyDepositCard.tsx`**
- **Opis**: Renderuje pojedynczą ofertę lokaty walutowej
- **Funkcje**:
  - **Pływająca odznaka waluty**: Stylowa odznaka w prawym górnym rogu wskazuje walutę oferty (np. EUR, USD)
  - **Jasna prezentacja**: Wyświetla kluczowe informacje jak zysk, oprocentowanie i całkowity zwrot
  - **Responsywny design**: Dostosowuje się do różnych rozmiarów ekranu

## 💰 **Komponenty Kont Oszczędnościowych**

### **`SavingsAccountRanking.tsx`**
- **Opis**: Komponent do wyświetlania rankingów kont oszczędnościowych
- **Dane**: Pobiera dane za pomocą `getSavingsAccountOffers`
- **Funkcje**:
  - Ranking kont według oprocentowania
  - Filtrowanie według warunków
  - Kalkulacje zysków

### **`SavingsAccountCard.tsx`**
- **Opis**: Renderuje pojedynczą ofertę konta oszczędnościowego
- **Funkcje**:
  - Logo banku i nazwa produktu
  - Oprocentowanie i warunki
  - Link do strony banku

### **`SavingsAccountComparisonSection.tsx`**
- **Opis**: Sekcja porównywania kont oszczędnościowych
- **Funkcje**:
  - Tabela porównawcza ofert
  - Filtrowanie według różnych kryteriów
  - Kalkulacje zysków

## 📈 **Komponenty Obligacji Skarbowych**

### **`TreasuryBondOffers.tsx`**
- **Opis**: Komponent wyświetlający oferty obligacji skarbowych
- **Dane**: Pobiera dane za pomocą `getTreasuryBondOffers`
- **Funkcje**:
  - Lista dostępnych obligacji
  - Kalkulacje zysków i zwrotów
  - Informacje o terminach wykupu

### **`TreasuryBondCard.tsx`**
- **Opis**: Renderuje pojedynczą ofertę obligacji skarbowej
- **Funkcje**:
  - Symbol obligacji
  - Oprocentowanie i opis
  - Kalkulacje zysków
  - Link do szczegółów

## 📊 **Komponenty Rankingów i Porównań**

### **`Ranking.tsx`**
- **Opis**: Uniwersalny komponent rankingowy
- **Funkcje**:
  - Może być używany dla różnych typów produktów
  - Konfigurowalne filtry
  - Sortowanie według różnych kryteriów

### **`ComparisonSection.tsx`**
- **Opis**: Sekcja porównywania produktów
- **Funkcje**:
  - Tabele porównawcze
  - Filtrowanie i sortowanie
  - Responsywny design

### **`DepositComparisonSection.tsx`**
- **Opis**: Specjalistyczna sekcja porównywania lokat
- **Funkcje**:
  - Porównanie lokat PLN
  - Kalkulacje zysków
  - Filtry według warunków

## 🎨 **Komponenty UI**

### **`CustomSlider.tsx`**
- **Opis**: Wielokrotnego użytku komponent suwaka
- **Stylowanie**: Stylizowany za pomocą Tailwind CSS dla spójnego wyglądu
- **Funkcje**:
  - Konfigurowalne zakresy wartości
  - Callback dla zmian wartości
  - Responsywny design

### **`BondBadge.tsx`**
- **Opis**: Odznaka dla obligacji skarbowych
- **Funkcje**:
  - Wizualne oznaczenie typu produktu
  - Spójny design z resztą aplikacji

## 📝 **Komponenty Blogowe (FinanSowa)**

### **`PostCard.tsx`**
- **Opis**: Karta pojedynczego posta na blogu
- **Funkcje**:
  - Tytuł i fragment posta
  - Obraz główny
  - Informacje o autorze i dacie
  - Link do pełnego posta

### **`PostBody.tsx`**
- **Opis**: Renderuje treść pojedynczego posta
- **Funkcje**:
  - Obsługa Portable Text z Sanity.io
  - Formatowanie tekstu
  - Obrazy i multimedia

### **`MarkdownContent.tsx`**
- **Opis**: Renderuje treść w formacie Markdown
- **Funkcje**:
  - Parsowanie Markdown
  - Stylizowanie treści
  - Obsługa różnych elementów

## 🔍 **Komponenty SEO i Metadanych**

### **`StructuredData.tsx`**
- **Opis**: Komponent wstrzykujący dane strukturalne JSON-LD do strony
- **Dane**: Używa danych z `baseMetadata` w `src/lib/metadata.ts`
- **Funkcje**:
  - Schema markup dla wyszukiwarek
  - Open Graph metadane
  - Twitter Cards

### **`sitemap.ts` & `robots.ts`**
- **Opis**: Te pliki generują `sitemap.xml` i `robots.txt`
- **Funkcje**:
  - Automatyczne generowanie mapy strony
  - Konfiguracja dla crawlerów wyszukiwarek
  - Dynamiczne URL-e

## 📊 **Komponenty Analityki**

### **`AnalyticsScripts.tsx`**
- **Opis**: Ładuje skrypty analityczne
- **Funkcje**:
  - Google Analytics 4
  - Google Tag Manager
  - Microsoft Clarity
  - Cloudflare Analytics

### **`CookieBanner.tsx`**
- **Opis**: Banner zgody na cookies
- **Funkcje**:
  - Zgodność z RODO/GDPR
  - Wybór poziomu zgody
  - Integracja z ConsentContext

## 🎯 **Komponenty Specjalistyczne**

### **`TestimonialsSection.tsx`**
- **Opis**: Sekcja opinii klientów
- **Funkcje**:
  - Rotujące opinie
  - Responsywny design
  - Integracja z analityką

### **`NewsletterSection.tsx`**
- **Opis**: Sekcja newslettera
- **Funkcje**:
  - Formularz zapisu
  - Walidacja danych
  - Integracja z systemem mailingowym

### **`TrustBar.tsx`**
- **Opis**: Pasek zaufania
- **Funkcje**:
  - Logo partnerów
  - Certyfikaty bezpieczeństwa
  - Informacje o regulacjach

## 🔧 **Komponenty Techniczne**

### **`PageSpeedOptimizer.tsx`**
- **Opis**: Optymalizator wydajności strony
- **Funkcje**:
  - Lazy loading obrazów
  - Prefetching zasobów
  - Optymalizacja Core Web Vitals

### **`icons.tsx`**
- **Opis**: Biblioteka ikon
- **Funkcje**:
  - Ikony z Lucide React
  - Spójny styl
  - Optymalizacja rozmiaru

## 📱 **Responsywność i Accessibility**

Wszystkie komponenty są zaprojektowane z myślą o:
- **Responsywności** - działają na wszystkich urządzeniach
- **Accessibility** - zgodność z WCAG 2.1
- **Performance** - optymalizacja renderowania
- **SEO** - semantyczny HTML i metadane

## 🚀 **Architektura Komponentów**

Ta architektura oparta na komponentach pozwala na:
- **Łatwe utrzymanie** - każdy komponent ma określoną odpowiedzialność
- **Skalowalność** - nowe funkcjonalności można łatwo dodawać
- **Reużywalność** - komponenty mogą być używane w różnych miejscach
- **Testowanie** - każdy komponent można testować niezależnie

---

**Kredytowy Patrol** - Komponenty zaprojektowane dla wydajności i użyteczności 🏦
