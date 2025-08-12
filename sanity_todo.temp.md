
# Sanity.io - Konfiguracja i zadania

Ten plik zawiera instrukcje dotyczące konfiguracji panelu Sanity.io, które są niezbędne do pełnego działania modułu bloga "FinanSowa".

## 1. Konfiguracja Webhooka do rewalidacji treści

Aby zapewnić, że zmiany w treści (publikacja nowego posta, aktualizacja istniejącego) są natychmiast widoczne na stronie produkcyjnej, musimy skonfigurować webhook w Sanity, który poinformuje naszą aplikację Next.js o konieczności odświeżenia danych.

### Kroki do wykonania w panelu Sanity:

1.  **Zaloguj się do swojego panelu zarządzania Sanity**:
    Przejdź na [sanity.io/manage](https://sanity.io/manage) i wybierz swój projekt (`kredytowy-patrol`).

2.  **Przejdź do zakładki API**:
    W menu projektu znajdź i kliknij "API".

3.  **Stwórz nowy Webhook**:
    *   W sekcji "Webhooks" kliknij przycisk **"Add new webhook"**.
    *   **Name**: Nazwij go `Blog Content Revalidation` (lub podobnie).
    *   **URL**: Wklej następujący adres URL, zastępując `[twoja-domena-produkcyjna]` adresem Twojej wdrożonej aplikacji na Vercel:
        ```
        https://[twoja-domena-produkcyjna]/api/revalidate?tag=sanity&secret=[TWÓJ_SECRET]
        ```
        **Ważne:**
        *   `tag=sanity` pozwoli naszej aplikacji wiedzieć, które dane ma odświeżyć.
        *   `secret=[TWÓJ_SECRET]` to token, który zabezpieczy endpoint przed nieautoryzowanym dostępem. Wygeneruj silny, losowy ciąg znaków i zapisz go w zmiennych środowiskowych na Vercelu pod nazwą `SANITY_REVALIDATE_SECRET`.

    *   **Dataset**: Wybierz `production`.
    *   **Trigger on**: Zaznacz wszystkie opcje: `Create`, `Update`, `Delete`. Dzięki temu rewalidacja zadziała dla każdej zmiany.
    *   **Filter**: Pozostaw puste, aby webhook reagował na zmiany we wszystkich dokumentach.
    *   **Projection**: Pozostaw domyślne.
    *   **HTTP Method**: `POST`.
    *   **Status**: Upewnij się, że jest `Enabled`.

4.  **Zapisz Webhook**:
    Kliknij "Save". Od teraz każda zmiana w Sanity Studio wywoła rewalidację strony.

## 2. (Opcjonalnie) Stworzenie tokena tylko do odczytu

Dla zwiększenia bezpieczeństwa, warto stworzyć osobny token API, który ma uprawnienia tylko do odczytu danych. Będzie on używany w aplikacji do publicznego pobierania treści.

1.  W zakładce **API** znajdź sekcję **"Tokens"**.
2.  Kliknij **"Add new token"**.
3.  Nadaj mu nazwę, np. `Frontend Read Only`.
4.  Wybierz uprawnienia **"Read"**.
5.  Skopiuj wygenerowany token i dodaj go do zmiennych środowiskowych na Vercelu jako `SANITY_API_READ_TOKEN`.
