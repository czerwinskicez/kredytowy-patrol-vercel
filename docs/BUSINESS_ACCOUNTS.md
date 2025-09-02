# Konta Firmowe - Dokumentacja

Ten dokument opisuje implementację funkcjonalności kont firmowych w aplikacji Kredytowy Patrol.

## 🏢 **Przegląd Funkcjonalności**

Konta firmowe to nowa sekcja aplikacji dedykowana przedsiębiorcom i firmom poszukującym rachunków bankowych dla prowadzenia działalności gospodarczej.

### **Główne Cechy**
- **Porównywarka kosztów** - uwzględnia opłaty za prowadzenie konta, karty i wypłaty z bankomatów
- **Kalkulacja na podstawie użytkowania** - personalizacja na podstawie przewidywanej liczby transakcji
- **Uwzględnienie bonusów** - kalkulacja efektywnego zysku (bonus minus roczne koszty)
- **Responsywny design** - optymalizacja dla wszystkich urządzeń

## 📊 **Struktura Danych**

### **Google Sheets - Arkusz `Konta_Firmowe`**

Struktura kolumn w arkuszu:
```
provider | accountFeeMin | accountFeeMax | cardFeeMin | cardFeeMax | atmWithdrawalMin | atmWithdrawalMax | bonus | promoted | hidden | extraLabel | url
```

#### **Opis Kolumn**
- `provider` - nazwa banku/instytucji
- `accountFeeMin/Max` - minimalne/maksymalne miesięczne opłaty za prowadzenie konta
- `cardFeeMin/Max` - minimalne/maksymalne miesięczne opłaty za kartę płatniczą
- `atmWithdrawalMin/Max` - minimalne/maksymalne opłaty za wypłatę z bankomatu
- `bonus` - bonus w PLN za założenie konta
- `promoted` - czy oferta jest promowana (boolean)
- `hidden` - czy oferta jest ukryta (boolean)
- `extraLabel` - dodatkowa etykieta promocyjna
- `url` - link do oferty na stronie banku

## 🔧 **Implementacja Techniczna**

### **Typy TypeScript**

```typescript
export type BusinessAccountOffer = {
  provider: string;
  logo: string;
  accountFeeMin: number;
  accountFeeMax: number;
  cardFeeMin: number;
  cardFeeMax: number;
  atmWithdrawalMin: number;
  atmWithdrawalMax: number;
  bonus: number;
  promoted: boolean;
  hidden: boolean;
  extraLabel: string;
  url: string;
};

export type CalculatedBusinessAccountOffer = BusinessAccountOffer & {
  totalMonthlyCost: number;
  totalYearlyCost: number;
  effectiveBonus: number;
};
```

### **Komponenty**

#### **`BusinessAccountRanking.tsx`**
- **Lokalizacja**: `src/components/BusinessAccountRanking.tsx`
- **Typ**: Client Component
- **Funkcjonalność**:
  - Slidery do konfiguracji użytkowania (liczba wypłat z bankomatów, transakcji)
  - Kalkulacje kosztów w czasie rzeczywistym
  - Sortowanie według efektywnego bonusu/najniższych kosztów
  - Podział na promowane i regularne oferty

#### **`BusinessAccountCard.tsx`**
- **Lokalizacja**: `src/components/BusinessAccountCard.tsx`
- **Typ**: Presentational Component
- **Funkcjonalność**:
  - Wyświetlanie szczegółów oferty
  - Formatowanie opłat (0-0 jako "Bezpłatne")
  - Wyróżnienie promowanych ofert
  - Link do strony banku

#### **`BusinessAccountComparisonSection.tsx`**
- **Lokalizacja**: `src/components/BusinessAccountComparisonSection.tsx`
- **Typ**: Wrapper Component
- **Funkcjonalność**:
  - Dynamic import dla optymalizacji
  - Loading state
  - SSR compatibility

### **Pobieranie Danych**

#### **`getBusinessAccountOffers()`**
- **Lokalizacja**: `src/lib/google-sheets.ts`
- **Cache**: `unstable_cache` z tagami `['businessAccountOffers', 'sheets']`
- **Funkcjonalność**:
  - Pobieranie danych z Google Sheets
  - Łączenie z logo banków
  - Parsowanie wartości numerycznych
  - Error handling

## 🧮 **Logika Kalkulacji**

### **Koszt Miesięczny**
```typescript
const avgAccountFee = (offer.accountFeeMin + offer.accountFeeMax) / 2;
const avgCardFee = (offer.cardFeeMin + offer.cardFeeMax) / 2;
const avgAtmFee = (offer.atmWithdrawalMin + offer.atmWithdrawalMax) / 2;
const monthlyAtmCosts = monthlyAtmWithdrawals * avgAtmFee;
const totalMonthlyCost = avgAccountFee + avgCardFee + monthlyAtmCosts;
```

### **Efektywny Bonus**
```typescript
const totalYearlyCost = totalMonthlyCost * 12;
const effectiveBonus = offer.bonus - totalYearlyCost;
```

### **Sortowanie**
1. **Oferty z bonusem** - sortowane według najwyższego efektywnego bonusu
2. **Oferty bez bonusu** - sortowane według najniższego miesięcznego kosztu
3. **Promowane** zawsze na górze w swoich kategoriach

## 🎨 **Design System**

### **Kolory**
- **Promowane oferty**: Border z `border-[#f0c14b]` i ring `ring-[#f0c14b]/20`
- **Bonus**: Tło `bg-green-50`, tekst `text-green-700/800`
- **Główny CTA**: `bg-[#053320]` z hover `bg-[#0a472e]`

### **Ikony**
- **Hero Section**: `FaBuilding` z react-icons/fa
- **Bonus**: 🎁 emoji
- **Promowane**: 🔥 emoji

## 🌐 **SEO & Metadata**

### **Strona `/konta-firmowe`**
- **Title**: "Najlepsze Konta Firmowe - Ranking i Porównywarka 2024"
- **Description**: "Znajdź najlepsze konto firmowe dla swojego biznesu..."
- **Canonical URL**: `/konta-firmowe`
- **OpenGraph**: Dedykowane og:title i og:description

### **Sitemap**
- Dodano wpis w `src/app/sitemap.ts`
- Priority: 0.9 (wysoki)
- ChangeFrequency: daily

## 🧪 **Testowanie**

### **Scenariusze Testowe**
1. **Różne wzorce użytkowania**:
   - 0 wypłat z bankomatów (tylko online)
   - Wysokie użytkowanie (50+ wypłat/miesiąc)
   - Średnie użytkowanie (10-20 wypłat/miesiąc)

2. **Oferty z bonusami vs bez bonusów**
3. **Responsywność na różnych urządzeniach**
4. **Loading states i error handling**

### **Edge Cases**
- Brak ofert w arkuszu
- Błędne dane w Google Sheets
- Problemy z połączeniem API
- Bardzo wysokie opłaty prowadzące do ujemnego efektywnego bonusu

## 🔄 **Integracja z Istniejącym Systemem**

### **Nawigacja**
- **Header**: Zastąpiono "Karty Kredytowe" → "Konta Firmowe"
- **Footer**: Dodano link w sekcji "Oszczędności"
- **Hero Section**: Zaktualizowano opis o konta firmowe
- **ProductCategories**: Zmieniono ikonę i link

### **Cache Strategy**
- Wykorzystuje ten sam system cache co inne produkty
- Revalidation przez `/api/revalidate` endpoint
- Tags: `['businessAccountOffers', 'sheets']`

## 📈 **Metryki i Analytics**

### **Śledzenie**
- Page views na `/konta-firmowe`
- Kliki w oferty (zewnętrzne linki)
- Zmiany w sliderach użytkowania
- Bounce rate i time on page

### **A/B Testing Opportunities**
- Różne formatowanie kosztów
- Pozycjonowanie promowanych ofert
- Kopie marketingowe w opisach
- Call-to-action button text

## 🚀 **Przyszłe Rozszerzenia**

### **Planowane Funkcje**
- **Filtry branżowe** - różne potrzeby dla różnych typów działalności
- **Kalkulator oszczędności** - porównanie z aktualnym kontem
- **Notyfikacje o nowych ofertach**
- **Integracja z API banków** dla real-time danych

### **Optymalizacje**
- **Lazy loading** logo banków
- **Preload** danych dla popularnych konfiguracji użytkowania
- **Service Worker** caching strategia
- **Progressive Web App** features dla mobilnych użytkowników
