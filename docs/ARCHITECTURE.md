# Architektura Aplikacji

Ten dokument opisuje architekturę aplikacji Kredytowy Patrol, strukturę projektu oraz kluczowe decyzje technologiczne.

## Przegląd Technologii

Aplikacja została zbudowana na nowoczesnym stosie technologicznym, zoptymalizowanym pod kątem wydajności, skalowalności i łatwości utrzymania.

- **Next.js (App Router):** Jako główny framework, Next.js zapewnia renderowanie po stronie serwera (SSR), generowanie statycznych stron (SSG), a także routing oparty na systemie plików (App Router), co znacząco poprawia SEO i wydajność.
- **React i TypeScript:** React służy do budowy interfejsu użytkownika w sposób komponentowy, a TypeScript dodaje statyczne typowanie, co zwiększa bezpieczeństwo i czytelność kodu.
- **Tailwind CSS:** Używany do szybkiego i spójnego stylowania interfejsu bez opuszczania kodu HTML.
- **Vercel:** Platforma do hostingu i deploymentu, w pełni zintegrowana z Next.js, oferująca CI/CD, analitykę i monitoring wydajności.

## Struktura Katalogów

Struktura projektu jest zorganizowana w sposób modułowy i zgodny z konwencjami Next.js:

```
kredytowy-patrol-vercel/
├── public/              # Statyczne zasoby (obrazy, czcionki, sw.js)
├── scripts/             # Skrypty pomocnicze (np. build-sw.js)
├── src/
│   ├── app/             # Routing aplikacji (App Router)
│   │   ├── api/         # Endpointy API
│   │   ├── [slug]/      # Dynamiczne strony produktów
│   │   ├── layout.tsx   # Główny layout aplikacji
│   │   └── page.tsx     # Strona główna
│   ├── components/      # Komponenty React wielokrotnego użytku
│   ├── contexts/        # Konteksty React (np. zgoda na cookies)
│   ├── hooks/           # Niestandardowe hooki React
│   ├── lib/             # Logika biznesowa, funkcje pomocnicze
│   │   ├── google-sheets.ts # Integracja z Google Sheets API
│   │   └── analytics.ts     # Obsługa analityki
│   └── types/           # Definicje typów TypeScript
├── tailwind.config.ts   # Konfiguracja Tailwind CSS
├── next.config.ts       # Konfiguracja Next.js
└── package.json         # Zależności i skrypty projektu
```

### Kluczowe Foldery

- **`src/app`**: Serce aplikacji, gdzie zdefiniowane są wszystkie trasy. Każdy folder odpowiada za konkretny segment URL. `layout.tsx` definiuje wspólny szkielet strony, a `page.tsx` jej zawartość.
- **`src/components`**: Zbiór komponentów UI, takich jak `Header`, `Footer`, `LoanCard` czy `DepositRanking`. Komponenty są zaprojektowane tak, aby były jak najbardziej reużywalne.
- **`src/lib`**: Tutaj znajduje się główna logika aplikacji, oddzielona od warstwy prezentacji. `google-sheets.ts` odpowiada za komunikację z API Google Sheets w celu pobierania danych o produktach finansowych.
- **`scripts`**: Zawiera skrypty automatyzujące zadania, np. `build-sw.js`, który generuje Service Workera z dynamicznym numerem wersji. 