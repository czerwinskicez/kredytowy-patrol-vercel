# Strategia SEO

Ten dokument opisuje strategie i techniki optymalizacji pod kątem wyszukiwarek (SEO) zaimplementowane w aplikacji Kredytowy Patrol.

## 1. Renderowanie po Stronie Serwera (SSR)

Dzięki wykorzystaniu Next.js, wszystkie strony są domyślnie renderowane po stronie serwera. Oznacza to, że roboty wyszukiwarek otrzymują w pełni wyrenderowany kod HTML, a nie pustą stronę wymagającą wykonania JavaScriptu. To kluczowe dla prawidłowej indeksacji i wysokich pozycji w wynikach wyszukiwania.

## 2. Metadane i Tytuły

- **Dynamiczne Metadane:** Każda strona generuje unikalne metadane (tytuł, opis) na podstawie jej zawartości. Logika ta znajduje się w pliku `src/lib/metadata.ts`.
  ```typescript
  // Przykład użycia w page.tsx
  import { generateMetadata } from '@/lib/metadata';

  export async function generateMetadata({ params }) {
    // Logika generowania metadanych na podstawie slug
    return {
      title: `Kredyt ${params.slug} - Porównanie i Opinie`,
      description: `Znajdź najlepszy kredyt ${params.slug}. Porównaj oferty banków i przeczytaj opinie klientów.`,
    };
  }
  ```
- **Spójność:** Zapewnia to, że każda podstrona jest zoptymalizowana pod kątem konkretnych słów kluczowych.

## 3. Dane Strukturalne (JSON-LD)

Aplikacja wykorzystuje dane strukturalne, aby pomóc wyszukiwarkom zrozumieć kontekst i treść strony.

- **Komponent `StructuredData.tsx`:** Automatycznie generuje i wstawia skrypty JSON-LD do nagłówka strony.
- **Typy Danych:** Używane są schematy takie jak `FAQPage`, `BreadcrumbList` i `FinancialProduct`, aby precyzyjnie opisać zawartość (np. rankingi, pytania i odpowiedzi).
- **Korzyści:** Może to prowadzić do wyświetlania tzw. "rich snippets" w wynikach wyszukiwania, co zwiększa widoczność i CTR.

## 4. Mapa Strony (`sitemap.ts`)

- **Automatyczna Generacja:** Plik `src/app/sitemap.ts` dynamicznie generuje plik `sitemap.xml` na podstawie dostępnych stron i produktów.
- **Proces:**
  1. Pobiera listę wszystkich dynamicznych stron (np. szczegóły kredytów).
  2. Łączy je ze stronami statycznymi.
  3. Generuje XML, który jest następnie udostępniany wyszukiwarkom.
- **Cel:** Ułatwia robotom wyszukiwarek odnajdywanie i indeksowanie wszystkich podstron serwisu.

## 5. Plik `robots.ts`

- **Zarządzanie Robotami:** Plik `src/app/robots.ts` generuje plik `robots.txt`, który instruuje roboty wyszukiwarek, które części serwisu mogą indeksować, a które powinny pominąć.
- **Konfiguracja:** Zazwyczaj zezwala się na indeksowanie całej strony, z wyjątkiem ścieżek, które nie powinny znaleźć się w wynikach wyszukiwania (np. panele administracyjne, strony testowe). Wskazuje również lokalizację mapy strony.

## 6. Optymalizacja Wydajności

Wydajność strony jest kluczowym czynnikiem rankingowym.

- **Vercel Speed Insights:** Monitoruje wskaźniki Core Web Vitals (LCP, FID, CLS) i dostarcza rekomendacje.
- **Service Worker:** Cache'uje zasoby, skracając czas ładowania dla powracających użytkowników (zobacz [SW.md](SW.md)).
- **Optymalizacja Obrazów:** Next.js automatycznie optymalizuje obrazy, serwując je w nowoczesnych formatach (np. WebP) i odpowiednich rozmiarach.
- **Komponent `PageSpeedOptimizer.tsx`:** Agreguje różne techniki optymalizacyjne, w tym zarządzanie Service Workerem. 