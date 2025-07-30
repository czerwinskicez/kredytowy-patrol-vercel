# Service Worker Build Scripts

## Automatyczne Cache Versioning

Ten system automatycznie aktualizuje cache service workera przy każdym deployu, zapewniając że użytkownicy zawsze otrzymują najnowszą wersję aplikacji.

## Jak to działa

### 1. Build Script (`build-sw.js`)
- Generuje unikalną wersję cache na podstawie:
  - Aktualnego timestampu
  - Krótkiego hash commitu Git (jeśli dostępny)
- Zastępuje placeholder `__CACHE_VERSION__` w `public/sw.js`
- Tworzy `public/sw-version.json` z informacjami o buildzie

### 2. Service Worker (`public/sw.js`)
- Używa dynamicznej wersji cache: `kredytowy-patrol-${CACHE_VERSION}`
- Automatycznie usuwa stare cache przy aktywacji
- Implementuje inteligentną strategię cache'owania:
  - **Stale-while-revalidate** dla stron HTML
  - **Cache-first** dla statycznych assetów
  - **Network-first** dla API calls

### 3. Rejestracja Service Workera (`PageSpeedOptimizer.tsx`)
- Automatycznie wykrywa dostępne aktualizacje
- Przeładowuje stronę gdy nowa wersja jest gotowa
- Obsługuje smooth updates bez przerywania UX

## Użycie

### Podczas developmentu:
```bash
npm run build:sw  # Ręczna aktualizacja SW
```

### Podczas buildu/deployu:
```bash
npm run build     # Automatycznie aktualizuje SW i buduje app
```

## Korzyści

1. **Automatyczne invalidowanie cache** - każdy deploy = nowa wersja cache
2. **Zero-downtime updates** - płynne przejście na nową wersję
3. **Debugowanie** - `sw-version.json` zawiera informacje o buildzie
4. **Fallback offline** - aplikacja działa bez internetu
5. **Performance** - inteligentne cache'owanie różnych typów zasobów

## Pliki

- `scripts/build-sw.js` - Główny skrypt budowy
- `public/sw.js` - Service Worker template
- `public/sw-version.json` - Info o aktualnej wersji (ignorowany przez git)
- `src/components/PageSpeedOptimizer.tsx` - Rejestracja i update handling

## Troubleshooting

### Service Worker nie aktualizuje się
1. Sprawdź DevTools → Application → Service Workers
2. Sprawdź console na błędy rejestracji
3. Upewnij się że `sw-version.json` zawiera aktualną wersję

### Cache nie invaliduje się
1. Sprawdź czy build script był uruchomiony
2. Sprawdź czy `CACHE_VERSION` w `sw.js` jest aktualny
3. W DevTools → Application → Storage → Clear storage

### Problemy podczas development
1. W DevTools zaznacz "Update on reload"
2. Lub wyczyść cache ręcznie: Application → Clear storage 