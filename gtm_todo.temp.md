
# Plan wdrożenia Google Tag Manager dla Kredytowy Patrol

## Wprowadzenie
Ten dokument opisuje kroki niezbędne do wdrożenia kompleksowej analityki w serwisie Kredytowy Patrol przy użyciu Google Tag Manager (GTM). Zakładamy, że kontener GTM jest już zaimplementowany na stronie, a celem jest centralizacja i rozszerzenie śledzenia z wykorzystaniem GA4. Plan jest przeznaczony dla osoby technicznej, która nie ma dużego doświadczenia w GTM.

---

### Faza 1: Podstawowa Konfiguracja i Migracja z GA4

Celem tej fazy jest zapewnienie, że GTM jest jedynym źródłem danych dla GA4, co zapobiega duplikacji zdarzeń (np. podwójne zliczanie odsłon).

- [ ] **1. Weryfikacja Centralnego Tagu Konfiguracyjnego GA4 w GTM:**
    - W GTM, utwórz nowy tag typu `Google Analytics: Konfiguracja GA4`.
    - W polu `Identyfikator pomiaru` wklej swój identyfikator z GA4 (w formacie `G-XXXXXXXXXX`).
    - W sekcji "Ustawienia konfiguracji" dodaj parametr `send_page_view` z wartością `true`. To sprawi, że ten tag będzie automatycznie wysyłał zdarzenie `page_view` przy każdej odsłonie.
    - Ustaw regułę (trigger) `Initialization - All Pages`. Użycie `Initialization` zamiast `Page View` zapewnia, że tag konfiguracyjny odpali się przed innymi tagami zdarzeń.

- [ ] **2. Usunięcie starego kodu śledzącego GA4 (gtag.js) z aplikacji:**
    - Przejrzyj kod aplikacji (prawdopodobnie w `src/app/layout.tsx` lub `src/components/AnalyticsScripts.tsx`) i usuń wszelkie fragmenty kodu ładujące `gtag.js` bezpośrednio. Po skonfigurowaniu GTM, tylko skrypt GTM powinien być obecny w kodzie strony. To krytyczny krok, aby uniknąć podwójnego zliczania odsłon i zdarzeń.

- [ ] **3. Włączenie wbudowanych zmiennych (Built-in Variables):**
    - W sekcji `Zmienne` (Variables) -> `Wbudowane zmienne` (Built-in Variables), kliknij `Konfiguruj` (Configure).
    - Włącz **wszystkie** zmienne z sekcji `Kliknięcia` (Clicks), `Formularze` (Forms) i `Przewijanie` (Scrolling). Będą one niezbędne do tworzenia reguł.

---

### Faza 2: Śledzenie Kluczowych Interakcji Użytkownika

Ta faza koncentruje się na śledzeniu zdarzeń, które wskazują na zaangażowanie użytkownika i są kluczowe z perspektywy biznesowej serwisu. Najlepszą praktyką jest wykorzystanie `dataLayer` do przesyłania danych z aplikacji do GTM.

- [ ] **1. Śledzenie kliknięć w linki wychodzące (oferty banków):**
    - **Cel:** Mierzenie, ilu użytkowników przechodzi do stron partnerów. To najważniejszy wskaźnik konwersji.
    - **Implementacja w GTM:**
        - **Reguła (Trigger):** Utwórz nową regułę typu `Kliknięcie - Tylko linki` (Click - Just Links). Ustaw jej warunek na `Niektóre kliknięcia linków` (Some Link Clicks) i skonfiguruj `Click URL` -> `does not contain` -> `kredytowy-patrol.pl` (lub Twoja domena produkcyjna).
        - **Tag:** Utwórz nowy tag `Google Analytics: Zdarzenie GA4`.
            - Wybierz tag konfiguracyjny utworzony w Fazie 1.
            - Nazwa zdarzenia: `click_outbound_offer`.
            - **Parametry zdarzenia (Event Parameters):**
                - `link_url`: `{{Click URL}}`
                - `link_text`: `{{Click Text}}`
                - `item_brand`: Ten parametr jest trudniejszy. Wymaga przekazania nazwy banku. Najlepiej zaimplementować to przez `dataLayer` (patrz punkt 2) lub przez atrybuty `data-*` w kodzie HTML.

- [ ] **2. Implementacja `dataLayer` dla zdarzeń E-commerce:**
    - **Cel:** Przekazywanie szczegółowych danych o produktach (kredytach, lokatach) w ustrukturyzowany sposób, zgodny ze schematem E-commerce w GA4.
    - **Przykład implementacji w kodzie React (np. w `LoanCard.tsx` dla kliknięcia w ofertę):**
      ```javascript
      // W komponencie przycisku oferty
      const handleOfferClick = () => {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: 'select_promotion', // Nazwa zdarzenia dla GTM
          ecommerce: {
            items: [{
              item_id: loan.id, // np. 'kredyt-gotowkowy-pko-bp'
              item_name: loan.name, // np. 'Pożyczka Gotówkowa online'
              item_brand: loan.bankName, // np. 'PKO BP'
              item_category: 'Kredyt Gotówkowy', // Kategoria produktu
              price: loan.amount, // Opcjonalnie: kwota kredytu
              currency: 'PLN'
            }]
          }
        });
      };

      return <button onClick={handleOfferClick}>Zobacz ofertę</button>;
      ```
    - **Implementacja w GTM:**
        - **Zmienna (Variable):** Utwórz zmienną typu `Data Layer Variable` o nazwie `ecommerce`.
        - **Reguła (Trigger):** Utwórz regułę typu `Zdarzenie niestandardowe` (Custom Event) z nazwą zdarzenia `select_promotion`.
        - **Tag:** Utwórz tag `Google Analytics: Zdarzenie GA4`.
            - Nazwa zdarzenia: `{{Event}}` (automatycznie pobierze `select_promotion`).
            - Włącz "Wyślij dane e-commerce" i wybierz źródło danych `Data Layer`.
            - Podłącz regułę `select_promotion`.

- [ ] **3. Śledzenie wyświetleń szczegółów oferty (np. w modalu `LoanDetailModal.tsx`):**
    - **Cel:** Analiza, które oferty są najczęściej przeglądane.
    - **Implementacja w kodzie React (przy otwarciu modala):**
      ```javascript
      // useEffect w komponencie modala
      useEffect(() => {
        if (isOpen) {
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            event: 'view_item',
            ecommerce: {
              items: [{
                item_id: loan.id,
                item_name: loan.name,
                item_brand: loan.bankName,
                item_category: 'Kredyt Gotówkowy'
              }]
            }
          });
        }
      }, [isOpen, loan]);
      ```
    - **Implementacja w GTM:** Analogicznie jak w punkcie 2, ale dla zdarzenia `view_item`. Utwórz nową regułę dla `Custom Event` -> `view_item` i podłącz ją do tego samego tagu e-commerce. GTM jest na tyle inteligentny, że tag obsłuży oba zdarzenia.

- [ ] **4. Śledzenie zapisu do newslettera (`NewsletterSection.tsx`):**
    - **Cel:** Mierzenie konwersji na leady.
    - **Implementacja w GTM:**
        - **Reguła (Trigger):** Utwórz regułę typu `Przesłanie formularza` (Form Submission). Skonfiguruj ją tak, by odpalała się tylko dla formularza newslettera (np. poprzez `Form ID` lub `Form Classes`).
        - **Tag:** Utwórz tag `Google Analytics: Zdarzenie GA4`.
            - Nazwa zdarzenia: `generate_lead`.
            - Parametry: `lead_type`: `newsletter`.
            - Podłącz regułę przesyłania formularza.

---

### Faza 3: Zaawansowana Konfiguracja i Consent Mode

- [ ] **1. Implementacja Google Consent Mode v2:**
    - **Cel:** Dostosowanie działania tagów analitycznych i reklamowych do zgody użytkownika, zgodnie z wymogami RODO/DMA.
    - **Analiza:** Posiadasz `CookieBanner.tsx` i `ConsentContext.tsx`. To idealne miejsce na integrację.
    - **Implementacja w kodzie React:**
        1.  **Domyślny stan zgody:** Zanim załaduje się skrypt GTM, musisz zdefiniować domyślny, najczęściej "odrzucony" stan zgody. To musi być wykonane bardzo wcześnie w kodzie `<head>`.
            ```html
            <script>
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                'ad_storage': 'denied',
                'analytics_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied',
                'wait_for_update': 500
              });
            </script>
            <!-- Tutaj skrypt GTM -->
            ```
        2.  **Aktualizacja zgody:** W momencie, gdy użytkownik podejmie decyzję w banerze (np. kliknie "Akceptuj"), musisz zaktualizować stan zgody.
            ```javascript
            // W logice obsługi kliknięcia w `CookieBanner.tsx`
            const handleAccept = () => {
              gtag('consent', 'update', {
                'ad_storage': 'granted',
                'analytics_storage': 'granted'
              });
              // ... reszta logiki
            };

            const handleDeny = () => {
              gtag('consent', 'update', {
                'ad_storage': 'denied',
                'analytics_storage': 'denied'
              });
              // ... reszta logiki
            };
            ```
    - **Konfiguracja w GTM:**
        - W GTM wejdź w `Admin` -> `Container Settings` i włącz `Enable Consent Overview`.
        - Przejrzyj swoje tagi (szczególnie te od Google) i w sekcji `Advanced Settings` -> `Consent Settings` sprawdź, czy mają ustawione odpowiednie wymagania dotyczące zgody (np. `analytics_storage` dla tagów GA4). Domyślnie GTM dobrze sobie z tym radzi dla tagów Google.

---

### Faza 4: Testowanie i Publikacja

- [ ] **1. Użycie trybu podglądu (Preview Mode) w GTM:**
    - Przed publikacją, ZAWSZE używaj trybu podglądu w GTM.
    - Otwórz swoją stronę z panelu podglądu. Obserwuj w konsoli `Tag Assistant`, które tagi się odpalają, a które nie.
    - Sprawdzaj `dataLayer` po wykonaniu każdej kluczowej akcji (kliknięcie oferty, otwarcie modala).
    - W GA4 wejdź w `Administracja` -> `DebugView`, aby zobaczyć zdarzenia spływające w czasie rzeczywistym.

- [ ] **2. Publikacja kontenera:**
    - Gdy wszystko działa poprawnie w trybie podglądu, opublikuj kontener GTM. Pamiętaj o dodaniu nazwy i opisu wersji, np. "Initial GA4 tracking implementation".
