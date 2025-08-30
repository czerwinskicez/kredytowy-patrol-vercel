# Firebase Integration - Lista rzeczy do wykonania

## ✅ Co zostało zaimplementowane

1. **Firebase Function** (`.firebase/functions/index.js`)
   - Funkcja `subscribeNewsletter` do obsługi newslettera
   - Funkcja `submitContactForm` do obsługi formularza kontaktowego
   - Walidacja danych wejściowych
   - Zbieranie metadanych zapytań (IP, User-Agent, itp.)
   - Zabezpieczenia CORS

2. **API Routes w Next.js**
   - `/api/newsletter` - endpoint dla newslettera
   - `/api/contact` - endpoint dla formularza kontaktowego
   - Walidacja danych po stronie Next.js
   - Przekazywanie zapytań do Firebase Functions

3. **Zaktualizowane komponenty**
   - `NewsletterSection.tsx` - interaktywny formularz newslettera
   - `ContactForm.tsx` - nowy komponent formularza kontaktowego
   - Obsługa stanów loading/error/success
   - Walidacja formularzy po stronie klienta

4. **Konfiguracja Firebase**
   - Dodano zależność `cors` do `package.json`
   - Firestore rules skonfigurowane (dostęp tylko przez Admin SDK)

## 🔥 Rzeczy do wykonania przez Ciebie

### 1. Konfiguracja Firebase Project

```bash
# Jeśli nie masz projektu Firebase, utwórz go w konsoli Firebase
# https://console.firebase.google.com/

# Inicjalizacja Firebase w projekcie (jeśli jeszcze nie zrobione)
firebase init

# Upewnij się, że masz włączone:
# - Firestore Database
# - Cloud Functions
```

### 2. Instalacja zależności Firebase Functions

```bash
cd .firebase/functions
npm install
```

### 3. Deploy Firebase Functions

```bash
# Z katalogu głównego projektu
firebase deploy --only functions

# Lub tylko konkretne funkcje
firebase deploy --only functions:subscribeNewsletter,functions:submitContactForm
```

### 4. Pobranie URL Firebase Functions

Po wdrożeniu, Firebase pokaże URL Twoich funkcji. Będą wyglądać mniej więcej tak:
```
https://us-central1-TWOJ-PROJECT-ID.cloudfunctions.net/subscribeNewsletter
https://us-central1-TWOJ-PROJECT-ID.cloudfunctions.net/submitContactForm
```

### 5. Konfiguracja Service Account w Firebase

1. Idź do Firebase Console → Project Settings → Service Accounts
2. Kliknij "Generate new private key"
3. Pobierz plik JSON z kluczem service account

### 6. Konfiguracja zmiennych środowiskowych w Vercel

W panelu Vercel (Settings → Environment Variables) dodaj **każdą** z poniższych zmiennych. Skopiuj wartości **dokładnie** z Twojego pliku JSON service account.

```env
# URL do Twoich Firebase Functions (z odpowiednim regionem)
# np. https://europe-central2-TWOJ-PROJECT-ID.cloudfunctions.net
FIREBASE_FUNCTIONS_URL=TWOJ_URL_FUNKCJI

# Dane z pliku JSON klucza serwisowego
FIREBASE_PROJECT_ID=twoj-project-id
FIREBASE_PRIVATE_KEY_ID=twoj-private-key-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@twoj-project-id.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=twoj-client-id
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxx%40twoj-project-id.iam.gserviceaccount.com

# WAŻNE: Skopiuj całą zawartość klucza prywatnego, łącznie z "-----BEGIN PRIVATE KEY-----" i "-----END PRIVATE KEY-----".
# Vercel automatycznie obsłuży znaki nowej linii.
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
```

### 7. Testowanie lokalnie (opcjonalnie)

Utwórz plik `.env.local` w głównym katalogu projektu i dodaj te same zmienne co w Vercel:

```bash
# W pliku .env.local znaki nowej linii w kluczu prywatnym muszą być w cudzysłowach:
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Uruchom emulator Firebase
firebase emulators:start

# W nowym terminalu, uruchom aplikację Next.js
npm run dev

# Ustaw zmienne środowiskowe dla lokalnego testowania w .env.local:
FIREBASE_FUNCTIONS_URL=http://localhost:5001/TWOJ-PROJECT-ID/us-central1
FIREBASE_SERVICE_ACCOUNT_KEY='{ ... }'
```

### 8. Struktura danych w Firestore

Po implementacji, dane będą zapisywane w kolekcjach:

**newsletter_subscriptions:**
```json
{
  "email": "user@example.com",
  "subscribed": true,
  "metadata": {
    "timestamp": "2024-01-01T12:00:00Z",
    "ip": "192.168.1.1",
    "userAgent": "Mozilla/5.0...",
    "referer": "https://twoja-strona.com",
    "origin": "https://twoja-strona.com"
  },
  "type": "newsletter"
}
```

**contact_submissions:**
```json
{
  "name": "Jan Kowalski",
  "email": "jan@example.com",
  "phone": "123456789",
  "subject": "Pytanie o kredyt",
  "message": "Treść wiadomości...",
  "consent": true,
  "metadata": {
    "timestamp": "2024-01-01T12:00:00Z",
    "ip": "192.168.1.1",
    "userAgent": "Mozilla/5.0...",
    "referer": "https://twoja-strona.com/kontakt",
    "origin": "https://twoja-strona.com"
  },
  "type": "contact_form",
  "status": "new"
}
```

### 9. Bezpieczeństwo

- ✅ Firestore rules są skonfigurowane na `allow read, write: if false`
- ✅ Dostęp tylko przez Firebase Admin SDK
- ✅ Walidacja service account key w funkcjach
- ✅ Walidacja danych wejściowych
- ✅ Zabezpieczenia CORS

### 10. Monitorowanie

Po wdrożeniu możesz monitorować:
- Firebase Console → Functions → Logs
- Firebase Console → Firestore → Data
- Vercel Dashboard → Functions logs

## 🚨 Ważne uwagi

1. **Nigdy nie commituj** klucza service account do repozytorium!
2. **Zawsze** testuj na środowisku deweloperskim przed produkcją
3. **Regularnie** sprawdzaj logi Firebase Functions pod kątem błędów
4. **Rozważ** dodanie rate limiting w przyszłości
5. **Ustaw** alerty w Firebase Console dla błędów funkcji

## 📞 Troubleshooting

**Problem:** Funkcje nie działają po deploy
**Rozwiązanie:** Sprawdź logi w Firebase Console

**Problem:** Błąd CORS
**Rozwiązanie:** Upewnij się, że origin w zapytaniu jest poprawny

**Problem:** Invalid service account
**Rozwiązanie:** Sprawdź czy klucz w zmiennych środowiskowych jest poprawny

**Problem:** Firestore permission denied
**Rozwiązanie:** Upewnij się, że używasz Firebase Admin SDK, nie Client SDK
