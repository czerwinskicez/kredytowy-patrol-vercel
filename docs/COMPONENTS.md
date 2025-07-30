# Dokumentacja Komponentów

Ten dokument zawiera przegląd kluczowych komponentów React używanych w aplikacji Kredytowy Patrol.

## Komponenty Główne

### `Header.tsx`
- **Opis:** Nagłówek aplikacji, zawierający logo, główne menu nawigacyjne oraz przyciski akcji.
- **Lokalizacja:** `src/components/Header.tsx`
- **Cechy:**
  - Responsywny (dostosowuje się do urządzeń mobilnych).
  - Zawiera linki do kluczowych sekcji: Kredyty, Lokaty.

### `Footer.tsx`
- **Opis:** Stopka aplikacji, zawierająca dodatkowe linki, informacje o prawach autorskich i mediach społecznościowych.
- **Lokalizacja:** `src/components/Footer.tsx`

### `PageSpeedOptimizer.tsx`
- **Opis:** Kluczowy komponent do optymalizacji wydajności. Odpowiada za rejestrację i zarządzanie Service Workerem.
- **Lokalizacja:** `src/components/PageSpeedOptimizer.tsx`
- **Cechy:**
  - Rejestruje `sw.js`.
  - Nasłuchuje na aktualizacje Service Workera i automatycznie przeładowuje stronę, aby użytkownik otrzymał najnowszą wersję.
  - Szczegółowy opis działania znajduje się w [dokumentacji Service Workera](SW.md).

## Komponenty Produktowe

### `Ranking.tsx` i `DepositRanking.tsx`
- **Opis:** Komponenty wyświetlające rankingi produktów finansowych (odpowiednio kredytów i lokat) w formie tabeli.
- **Lokalizacja:** `src/components/Ranking.tsx`, `src/components/DepositRanking.tsx`
- **Props:**
  - `loans` / `deposits`: Tablica z danymi produktów do wyświetlenia.
  - `title`: Tytuł rankingu.
- **Funkcjonalność:**
  - Sortowanie i filtrowanie (jeśli zaimplementowane).
  - Wyświetla kluczowe informacje o każdym produkcie.

### `LoanCard.tsx` i `DepositCard.tsx`
- **Opis:** Karty reprezentujące pojedynczy produkt (kredyt lub lokatę) w rankingu.
- **Lokalizacja:** `src/components/LoanCard.tsx`, `src/components/DepositCard.tsx`
- **Funkcjonalność:**
  - Prezentuje logo banku, nazwę produktu i kluczowe parametry.
  - Zawiera przycisk "Zobacz szczegóły", który otwiera modal z pełnymi informacjami.

### `LoanDetailModal.tsx` i `DepositDetailModal.tsx`
- **Opis:** Okna modalne wyświetlające szczegółowe informacje o wybranym produkcie.
- **Lokalizacja:** `src/components/LoanDetailModal.tsx`, `src/components/DepositDetailModal.tsx`
- **Funkcjonalność:**
  - Aktywowane po kliknięciu przycisku na `LoanCard` lub `DepositCard`.
  - Przedstawia wszystkie dostępne informacje o produkcie w czytelnej formie.

## Komponenty UI i Sekcje

### `HeroSection.tsx`
- **Opis:** Sekcja "bohatera" na stronie głównej, zawierająca główny nagłówek i wezwanie do działania (CTA).
- **Lokalizacja:** `src/components/HeroSection.tsx`

### `CustomSlider.tsx`
- **Opis:** Generyczny komponent suwaka, używany do interaktywnego wybierania wartości (np. kwoty kredytu, okresu spłaty).
- **Lokalizacja:** `src/components/CustomSlider.tsx`

### `CookieBanner.tsx`
- **Opis:** Banner informujący o używaniu plików cookie i proszący o zgodę użytkownika.
- **Lokalizacja:** `src/components/CookieBanner.tsx`
- **Kontekst:** Używa `ConsentContext` do zarządzania stanem zgody.

### `StructuredData.tsx`
- **Opis:** Komponent do wstrzykiwania danych strukturalnych (JSON-LD) do nagłówka strony, co pomaga w SEO.
- **Lokalizacja:** `src/components/StructuredData.tsx` 