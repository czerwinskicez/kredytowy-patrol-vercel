# Kredytowy Patrol - Dokumentacja

Witamy w dokumentacji projektu Kredytowy Patrol. Celem tego dokumentu jest zapewnienie kompleksowego przeglądu aplikacji, od jej architektury i struktury, po kluczowe funkcjonalności i proces wdrożenia.

## O Projekcie

Kredytowy Patrol to nowoczesna aplikacja internetowa stworzona przy użyciu Next.js i React, której głównym celem jest dostarczanie aktualnych rankingów kredytów i lokat. Aplikacja została zoptymalizowana pod kątem wydajności (SEO i szybkość ładowania), wykorzystując techniki takie jak Server-Side Rendering (SSR) i Service Workers do cache'owania zasobów.

## Kluczowe Technologie

- **Framework:** [Next.js](https://nextjs.org/) (z App Router)
- **Biblioteka UI:** [React](https://react.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Język:** [TypeScript](https://www.typescriptlang.org/)
- **Dane:** [Google Sheets API](https://developers.google.com/sheets/api)
- **Analityka:** [Vercel Analytics](https://vercel.com/analytics) & [Vercel Speed Insights](https://vercel.com/speed-insights)
- **Hosting:** [Vercel](https://vercel.com/)

## Struktura Dokumentacji

- **[Architektura](ARCHITECTURE.md):** Opis struktury projektu, kluczowych katalogów i przepływu pracy.
- **[Komponenty](COMPONENTS.md):** Przegląd najważniejszych komponentów React.
- **[Przepływ Danych](DATA_FLOW.md):** Wyjaśnienie, jak dane są pobierane i zarządzane.
- **[SEO](SEO.md):** Strategie optymalizacji dla wyszukiwarek.
- **[Service Worker](SW.md):** Szczegóły implementacji Service Workera.
- **[Wdrożenie](DEPLOYMENT.md):** Instrukcje dotyczące budowania i wdrażania aplikacji.

## Pierwsze Kroki

### Wymagania

- Node.js (wersja zalecana w `.nvmrc`)
- npm lub yarn

### Instalacja

1. Sklonuj repozytorium:
   ```bash
   git clone <adres-repozytorium>
   ```
2. Przejdź do katalogu projektu:
   ```bash
   cd kredytowy-patrol-vercel
   ```
3. Zainstaluj zależności:
   ```bash
   npm install
   ```

### Uruchomienie lokalne

Aby uruchomić aplikację w trybie deweloperskim, użyj polecenia:

```bash
npm run dev
```

Aplikacja będzie dostępna pod adresem `http://localhost:3000`. 