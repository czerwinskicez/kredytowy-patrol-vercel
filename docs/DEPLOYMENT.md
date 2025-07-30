# Wdrożenie i Budowanie

Ten dokument opisuje proces budowania i wdrażania aplikacji Kredytowy Patrol, ze szczególnym uwzględnieniem integracji z platformą Vercel i niestandardowego procesu budowania Service Workera.

## 1. Platforma: Vercel

Aplikacja jest hostowana na Vercel, platformie stworzonej przez twórców Next.js. Zapewnia to optymalną wydajność, skalowalność i bezproblemowy proces wdrożenia.

### Kluczowe Funkcje Vercel

- **Ciągła Integracja i Wdrożenie (CI/CD):** Każde wypchnięcie (push) do głównej gałęzi (np. `master` lub `main`) na GitHubie automatycznie uruchamia proces budowania i wdrożenia nowej wersji aplikacji.
- **Podglądy Wdrożeń (Preview Deployments):** Każdy Pull Request generuje unikalny, działający podgląd aplikacji, co pozwala na testowanie zmian w izolowanym środowisku przed ich scaleniem.
- **Zmienne Środowiskowe:** Klucze API i inne poufne dane są bezpiecznie zarządzane poprzez panel Vercel.

## 2. Proces Budowania

Proces budowania jest zdefiniowany w `package.json` i składa się z dwóch głównych kroków:

```json
"scripts": {
  "build": "node scripts/build-sw.js && next build",
  "build:sw": "node scripts/build-sw.js"
}
```

### Krok 1: Budowanie Service Workera (`npm run build:sw`)

Przed standardowym procesem budowania Next.js, uruchamiany jest niestandardowy skrypt `scripts/build-sw.js`.

- **Cel:** Skrypt ten generuje unikalną wersję dla Service Workera przy każdym buildzie. Zapobiega to problemom z cache'owaniem i zapewnia, że użytkownicy zawsze otrzymują najnowszą wersję aplikacji.
- **Działanie:**
  1. Odczytuje szablon Service Workera z `public/sw.js`.
  2. Generuje unikalny identyfikator wersji (oparty na timestampie i hashu commita Git).
  3. Zastępuje placeholder `__CACHE_VERSION__` w szablonie tym identyfikatorem.
  4. Zapisuje gotowy Service Worker z powrotem do `public/sw.js`.
  5. Tworzy plik `public/sw-version.json` z metadanymi o buildzie (dla celów debuggingu).
- **Więcej informacji:** Zobacz [dokumentację Service Workera](SW.md).

### Krok 2: Budowanie Aplikacji Next.js (`next build`)

Po przygotowaniu Service Workera, Vercel wykonuje standardową komendę `next build`.

- **Działanie:**
  1. Kompiluje kod TypeScript i React.
  2. Renderuje statyczne strony (SSG).
  3. Optymalizuje zasoby (CSS, JavaScript, obrazy).
  4. Przygotowuje aplikację do wdrożenia na serwerach Vercel.

## 3. Zmienne Środowiskowe

Do poprawnego działania aplikacji (zarówno lokalnie, jak i na serwerze) wymagane są następujące zmienne środowiskowe:

- `GOOGLE_SHEETS_API_KEY`: Klucz API do Google Sheets.
- `GOOGLE_SHEETS_CLIENT_EMAIL`: Email konta serwisowego Google.
- `GOOGLE_SHEETS_PRIVATE_KEY`: Klucz prywatny konta serwisowego.
- `NEXT_PUBLIC_GA_ID`: ID śledzenia Google Analytics (jeśli używane).

Aby uruchomić projekt lokalnie, skopiuj plik `env.example`, zmień jego nazwę na `.env.local` i uzupełnij wartości. W przypadku Vercel, zmienne te należy dodać w ustawieniach projektu. 