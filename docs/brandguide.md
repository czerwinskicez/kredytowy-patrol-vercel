## Brand Guide — Kredytowy Patrol

Ten dokument definiuje identyfikację wizualną i zasady stylistyczne dla projektu Kredytowy Patrol. Zawiera wytyczne dotyczące kolorów, typografii, logo, elementów UI, obrazów i tonu komunikacji, aby zapewnić spójność we wszystkich miejscach wykorzystania marki.

### Rdzeń marki
- **Nazwa**: Kredytowy Patrol
- **Skrót**: KP (używać wyłącznie w kontekście technicznym, nie w interfejsie użytkownika)
- **Branża**: Porównywarka produktów finansowych (kredyty i oszczędności)
- **Obietnica marki**: Rzetelne porównania, przejrzystość i oszczędność czasu pieniędzy użytkownika

## Paleta kolorów

- **Primary Green (Akcent funkcjonalny)**: `#0a472e`
  - Zastosowanie: stany focus, akcenty kontrolne, elementy interaktywne na jasnym tle
  - Przykłady: outline focus slidera i checkboxów; `theme-color` w metadanych

- **Deep Green (Tła brandowe)**: `#053320`
  - Zastosowanie: tła sekcji brandowych (nagłówek, stopka, hero), mobilne menu
  - Przykład: `Header`, `Footer`, `HeroSection`

- **Gold (Kolor akcentu)**: `#f0c14b`
  - Zastosowanie: wyróżnienia linków, elementy dekoracyjne (kropki w hero), akcenty w menu
  - Uwaga: stosować oszczędnie jako akcent, nie jako kolor tła dla długich bloków tekstu

- **Background (Tło globalne)**: `#ffffff`
  - Zastosowanie: domyślne tło strony

- **Foreground (Tekst na jasnym tle)**: `#171717`
  - Zastosowanie: kolor bazowy tekstu

- **Dodatkowe odcienie systemowe (wg użycia w projekcie)**:
  - Ciemny do tooltipów/kontrastu: `#333333`
  - Obramowania neutralne: `#d1d5db`
  - Obramowanie sekcji w stopce: `#374151` (Tailwind `border-gray-700`)

### Kontrast i dostępność
- Na tle `#053320` używaj tekstu w kolorze białym, akcenty `#f0c14b` wyłącznie do wyróżnień.
- Linki i elementy aktywne muszą zachować kontrast WCAG AA.
- Focus states muszą być zawsze widoczne (w projekcie: outline `#0a472e`).

## Typografia

- **Font podstawowy**: Sarala (Google Fonts) — wagi 400, 700
  - Wczytywanie: zmienna CSS `--font-sarala` (Next.js `next/font`)
  - Domyślne przypisanie: `html { font-family: var(--font-sarala) }`

- **Zastosowania rozmiarów (przykłady Tailwind)**:
  - H1 (hero): `text-4xl md:text-5xl lg:text-6xl` + `font-bold`
  - Treść akapitowa: `text-base`–`text-lg` (w zależności od kontekstu);
    akapity na ciemnym tle: `text-gray-300`

- **Zasady**:
  - Nagłówki: waga 700, zwarta hierarchia, maks. 2–3 poziomy w jednej sekcji.
  - Długość linii: 60–80 znaków dla tekstu na jasnym tle; krótsze na ciemnym.
  - Nie mieszaj wielu rodzin fontów; Sarala jest jedyną rodziną w UI.

## Logo i znak

- **Pliki**: `public/logo_male.png`, favikony i ikony aplikacji (`public/favicon.svg`, `public/apple-touch-icon.png`, manifestowe rozmiary)
- **Wariant użycia w UI**:
  - W nagłówku i stopce stosowany jest znak graficzny (`logo_male.png`) oraz logotyp tekstowy „Kredytowy” (biały) + „Patrol” (złoty `#f0c14b`).
  - Minimalna wysokość w nawigacji: `48px` (`h-12`).
  - Zachowaj margines ochronny co najmniej 0.5 wysokości znaku wokół logo.
- **Tła**:
  - Na ciemnych tłach (`#053320`) preferuj pełnokolorowy znak + tekst biały/złoty.
  - Na jasnych tłach zachowaj odpowiedni kontrast (nie zmieniaj kolorystyki logotypu tekstowego bez uzasadnienia).

## Elementy UI i komponenty

- **Header (`src/components/Header.tsx`)**
  - Tło: `#053320`, tekst: biały; linki: hover `#f0c14b`.
  - Dropdowny: tło białe, tekst `#0a472e`, hover `#f0c14b`.
  - Mobile: pełnoekranowe menu na tle `#053320`.

- **Footer (`src/components/Footer.tsx`)**
  - Tło: `#053320`, nagłówki kolumn i linki: `#f0c14b` (akcent), treść: `text-gray-300`.
  - Pasek praw autorskich: cienka linia `border-gray-700`.

- **Hero (`src/components/HeroSection.tsx`)**
  - Tło: `#0a472e` + overlay z `public/background.jpg` (opacity ~0.32).
  - Dekor: trio złotych kropek `#f0c14b`.
  - Ilustracja: `public/kredytowy_pies.png`.

- **Focus i dostępność**
  - Globalny outline i kontrolki (slider, checkbox): `#0a472e`.

### Proponowane klasy narzędziowe (przykłady)

```html
<!-- Primary button na jasnym tle -->
<button class="bg-[#0a472e] text-white hover:bg-[#053320] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0a472e] px-4 py-2 rounded-md">
  Zobacz ofertę
</button>

<!-- Link akcentowy na ciemnym tle -->
<a class="text-[#f0c14b] hover:text-white">Strona Główna</a>
```

## Obrazowanie i ikony

- **Tła**: `public/background.jpg` w sekcjach hero (subtelna tekstura, nie przytłacza treści).
- **Ilustracje**: `kredytowy_pies.png` — lekki, przyjazny akcent. Nie nadużywać.
- **Logotypy banków**: `public/logos/*` — w belce zaufania (wysokość ~ `h-8`).
- **Ikony**: Material Symbols Outlined (ładowane globalnie w `layout.tsx`). Stosować 1 styl ikon w całym UI.

## SEO i meta

- **Nazwa witryny**: „Kredytowy Patrol” (w `src/lib/metadata.ts`).
- **Kolor motywu**: `#0a472e` (Open Graph, Windows tile) oraz `#053320` (viewport themeColor).
- **Logo do JSON-LD**: `logo_male.png` (Organization, WebSite).

## Ton komunikacji

- **Wartości**: rzetelność, przejrzystość, oszczędność czasu, partnerstwo.
- **Styl**: prosty, informacyjny, bez żargonu; krótkie zdania i korzyści w pierwszej kolejności.
- **CTA**: konkretne i pomocne („Porównaj oferty”, „Sprawdź oprocentowanie”).

## Przykłady wzorców kompozycji

- **Sekcja brandowa (ciemne tło)**: tytuł (700), akapit `text-gray-300`, linki akcentowe `#f0c14b`.
- **Dropdown na tle ciemnym**: panel biały, tekst `#0a472e`, hover `#f0c14b`.
- **Karty/okna modalne**: jasne tło, akcenty liniowe `#d1d5db`, przyciski brandowe jak w przykładzie powyżej.

## Zasady „Do / Don’t”

- Do: utrzymuj spójność zieleni (`#053320` jako tło brandowe, `#0a472e` jako akcent funkcjonalny) i złota (`#f0c14b` jako akcent treściowy).
- Do: dbaj o kontrast (szczególnie na ciemnych tłach) i wyraźne stany focus.
- Don’t: używaj `#f0c14b` jako koloru długich bloków tekstu lub tła.
- Don’t: wprowadzaj nowych rodzin fontów bez uzasadnienia.

## Zasoby

- **Logo i ikony**: pliki w `public/` (`logo_male.png`, `favicon.svg`, ikony PWA).
- **Tła**: `public/background.jpg`.
- **Zrzuty ekranu / podglądy**: `public/screenshot_wide.jpg`, `public/screenshot_narrow_vertical.jpg`.

## Implementacja w kodzie (odniesienia)

- Kolory i meta: `src/lib/metadata.ts`, `src/app/layout.tsx`
- Style globalne i focus: `src/app/globals.css`
- Komponenty brandowe: `src/components/Header.tsx`, `src/components/Footer.tsx`, `src/components/HeroSection.tsx`



