# Firebase Integration - Dokumentacja API

## Przegląd

Aplikacja Kredytowy Patrol wykorzystuje Firebase Functions jako backend do obsługi formularzy kontaktowych i zapisów do newslettera. System składa się z trzech warstw:

1. **Frontend (React/Next.js)** - zbiera dane od użytkowników
2. **API Routes (Next.js)** - warstwy pośredniczącej na Vercel
3. **Firebase Functions** - backend w chmurze Firebase

## Architektura

```
Browser → Vercel (Next.js API) → Firebase Functions → Firestore
```

### Przepływ danych

1. **Klient** zbiera metadane (userAgent, referrer, rozdzielczość)
2. **Vercel API** wzbogaca dane o IP, kraj, nagłówki serwera
3. **Firebase Function** waliduje i zapisuje do Firestore
4. **Firestore** przechowuje dane z pełnymi metadanymi

## Endpoints

### 1. Newsletter Subscription

**URL:** `https://europe-central2-{PROJECT_ID}.cloudfunctions.net/subscribeNewsletter`

**Metoda:** `POST`

**Payload:**
```json
{
  "email": "user@example.com",
  "serviceAccountKey": "{JSON_STRING}",
  "metadata": {
    "userAgent": "Mozilla/5.0...",
    "referer": "https://kredytowy-patrol.pl",
    "origin": "https://kredytowy-patrol.pl",
    "screenResolution": "1920x1080",
    "ip": "192.168.1.1",
    "vercelIpCountry": "PL",
    "headers": {
      "accept-language": "pl-PL,pl;q=0.9",
      "host": "kredytowy-patrol.pl"
    }
  }
}
```

**Odpowiedź sukces (200):**
```json
{
  "success": true,
  "message": "Pomyślnie zapisano do newslettera."
}
```

**Odpowiedź błąd (409 - duplikat):**
```json
{
  "success": false,
  "error": "Ten adres e-mail jest już zapisany."
}
```

### 2. Contact Form Submission

**URL:** `https://europe-central2-{PROJECT_ID}.cloudfunctions.net/submitContactForm`

**Metoda:** `POST`

**Payload:**
```json
{
  "name": "Jan Kowalski",
  "email": "jan@example.com",
  "phone": "123456789",
  "subject": "Pytanie o kredyt",
  "message": "Treść wiadomości...",
  "consent": true,
  "serviceAccountKey": "{JSON_STRING}",
  "metadata": {
    "userAgent": "Mozilla/5.0...",
    "referer": "https://kredytowy-patrol.pl/kontakt",
    "origin": "https://kredytowy-patrol.pl",
    "screenResolution": "1920x1080",
    "ip": "192.168.1.1",
    "vercelIpCountry": "PL",
    "headers": {
      "accept-language": "pl-PL,pl;q=0.9",
      "host": "kredytowy-patrol.pl"
    }
  }
}
```

**Odpowiedź sukces (200):**
```json
{
  "success": true,
  "message": "Formularz został pomyślnie wysłany."
}
```

## Next.js API Routes

### 1. `/api/newsletter`

**Endpoint wewnętrzny:** `POST /api/newsletter`

**Funkcja:**
- Odbiera dane od klienta
- Łączy metadane klienta z danymi serwera Vercel
- Przekazuje do Firebase Function

**Przykład użycia:**
```javascript
const response = await fetch('/api/newsletter', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    clientMetadata: {
      userAgent: navigator.userAgent,
      referer: document.referrer,
      origin: window.location.origin,
      screenResolution: `${screen.width}x${screen.height}`
    }
  })
});
```

### 2. `/api/contact`

**Endpoint wewnętrzny:** `POST /api/contact`

**Funkcja:**
- Odbiera dane formularza kontaktowego
- Waliduje wymagane pola
- Wzbogaca metadane o dane serwera
- Przekazuje do Firebase Function

## Struktura danych w Firestore

### Kolekcja: `newsletter_subscriptions`

```json
{
  "email": "user@example.com",
  "subscribed": true,
  "type": "newsletter",
  "metadata": {
    "timestamp": "2024-01-15T10:30:00Z",
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)...",
    "referer": "https://kredytowy-patrol.pl",
    "origin": "https://kredytowy-patrol.pl",
    "screenResolution": "1920x1080",
    "ip": "192.168.1.1",
    "vercelIpCountry": "PL",
    "headers": {
      "accept-language": "pl-PL,pl;q=0.9",
      "host": "kredytowy-patrol.pl"
    }
  }
}
```

### Kolekcja: `contact_submissions`

```json
{
  "name": "Jan Kowalski",
  "email": "jan@example.com",
  "phone": "123456789",
  "subject": "Pytanie o kredyt",
  "message": "Treść wiadomości...",
  "consent": true,
  "type": "contact_form",
  "status": "new",
  "metadata": {
    "timestamp": "2024-01-15T10:30:00Z",
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)...",
    "referer": "https://kredytowy-patrol.pl/kontakt",
    "origin": "https://kredytowy-patrol.pl",
    "screenResolution": "1920x1080",
    "ip": "192.168.1.1",
    "vercelIpCountry": "PL",
    "headers": {
      "accept-language": "pl-PL,pl;q=0.9",
      "host": "kredytowy-patrol.pl"
    }
  }
}
```

## Konfiguracja

### Zmienne środowiskowe (Vercel)

```env
FIREBASE_FUNCTIONS_URL=https://europe-central2-PROJECT-ID.cloudfunctions.net
FIREBASE_PROJECT_ID=twoj-project-id
FIREBASE_PRIVATE_KEY_ID=klucz-prywatny-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@projekt.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=client-id
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/...
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
```

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## Bezpieczeństwo

### Zabezpieczenia implementowane:

1. **Walidacja Service Account** - każde żądanie musi zawierać prawidłowy klucz
2. **CORS Protection** - funkcje akceptują tylko żądania z dozwolonych domen
3. **Input Validation** - wszystkie dane wejściowe są walidowane
4. **Firestore Rules** - dostęp tylko przez Admin SDK
5. **Rate Limiting** - ograniczenie liczby instancji funkcji

### Metadane bezpieczeństwa:

Każde żądanie zapisuje:
- IP użytkownika
- User Agent
- Referer/Origin
- Znacznik czasu
- Kraj pochodzenia (Vercel)
- Rozdzielczość ekranu
- Nagłówki HTTP

## Monitoring i logi

### Firebase Console

1. **Functions Logs** - `Firebase Console → Functions → Logs`
2. **Firestore Data** - `Firebase Console → Firestore → Data`
3. **Performance** - automatyczne metryki wydajności

### Vercel Dashboard

1. **Function Logs** - logi API routes
2. **Performance Metrics** - czasy odpowiedzi
3. **Error Tracking** - automatyczne śledzenie błędów

## Troubleshooting

### Częste problemy:

**1. "Invalid service account credentials"**
- Sprawdź czy wszystkie zmienne środowiskowe są ustawione
- Upewnij się, że klucz prywatny zawiera `\n` dla nowych linii

**2. "CORS error"**
- Sprawdź konfigurację CORS w Firebase Functions
- Upewnij się, że żądanie pochodzi z dozwolonej domeny

**3. "Firestore permission denied"**
- Sprawdź reguły Firestore
- Upewnij się, że używasz Admin SDK, nie Client SDK

**4. "Function timeout"**
- Sprawdź logi funkcji w Firebase Console
- Rozważ zwiększenie timeout w konfiguracji

## Deployment

### Firebase Functions

```bash
cd .firebase/functions
npm install
firebase deploy --only functions
```

### Next.js (Vercel)

```bash
npm run build
# Automatyczny deploy przez GitHub integration
```

## Wersjonowanie

- **Firebase Functions:** v2 (region: europe-central2)
- **Next.js:** 15.4.2
- **Node.js:** 22
- **Firebase Admin SDK:** 12.6.0
