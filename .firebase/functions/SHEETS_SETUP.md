# Google Sheets Integration - Instrukcje konfiguracji

## ✅ Co zostało zaimplementowane

1. **Dwie nowe funkcje Firebase z triggerami Firestore:**
   - `onNewsletterCreated` - reaguje na nowe dokumenty w kolekcji `newsletter_subscriptions`
   - `onContactCreated` - reaguje na nowe dokumenty w kolekcji `contact_submissions`

2. **Google Sheets API integration:**
   - Automatyczne dodawanie nowych wierszy do arkusza
   - Wykorzystanie ADC (Application Default Credentials)
   - Mapowanie pól z Firestore do kolumn arkusza

3. **Zakodowane na twardo:**
   - ID arkusza (do zastąpienia)
   - Nazwy zakładek: "Newsletter" i "Kontakt"
   - Mapowanie pól

## 🔧 Co musisz jeszcze zrobić

### 1. Zastąp ID arkusza
W pliku `index.js` linia 221:
```js
const SPREADSHEET_ID = "1abc123def456-YOUR_SPREADSHEET_ID_HERE"; // TODO: Replace with actual ID
```

Znajdź swój prawdziwy ID arkusza Google Sheets (z URL) i zastąp.

### 2. Włącz Google Sheets API
W Google Cloud Console dla Twojego projektu Firebase:
- Przejdź do "APIs & Services" > "Library"
- Znajdź "Google Sheets API"
- Kliknij "Enable"

### 3. Sprawdź adres service account
Sprawdź jaki service account używają Twoje Functions:
```bash
gcloud functions describe onNewsletterCreated --gen2 --region=europe-central2 --format="value(serviceConfig.serviceAccountEmail)"
```

Powinien być w formacie: `PROJECT_NUMBER-compute@developer.gserviceaccount.com`

### 4. Udostępnij arkusz service accountowi
W Google Sheets:
- Kliknij "Share" w prawym górnym rogu
- Dodaj adres service account (z kroku 3)
- Nadaj uprawnienia "Editor"
- Usuń opcję "Notify people" przed wysłaniem

### 5. Utwórz zakładki w arkuszu
Stwórz dwie zakładki (tabs) w swoim arkuszu:
- `Newsletter`
- `Kontakt`

### 6. Dodaj nagłówki kolumn

**W zakładce "Newsletter":**
```
Timestamp | Email | IP | Country | Language | Host | Type | Status
```

**W zakładce "Kontakt":**
```
Timestamp | Name | Email | Phone | Subject | Message | Consent | IP | Country | Language | Host | Status
```

### 7. Zainstaluj nowe zależności
```bash
cd .firebase/functions
npm install
```

### 8. Wdróż nowe funkcje
```bash
firebase deploy --only functions:onNewsletterCreated,functions:onContactCreated
```

## 📝 Struktura danych

### Newsletter (kolekcja: newsletter_subscriptions)
Funkcja reaguje na nowe dokumenty i tworzy wiersz z:
- Timestamp
- Email
- IP (z metadata)
- Country (z metadata)
- Language (z headers)
- Host (z headers)
- Type
- Status ("NEW")

### Kontakt (kolekcja: contact_submissions)
Funkcja reaguje na nowe dokumenty i tworzy wiersz z:
- Timestamp
- Name
- Email
- Phone
- Subject
- Message
- Consent (TRUE/FALSE)
- IP (z metadata)
- Country (z metadata)
- Language (z headers)
- Host (z headers)
- Status

## 🔍 Testowanie

Po wdrożeniu możesz przetestować:
1. Wypełnij formularz newslettera na stronie
2. Sprawdź czy w Firestore pojawiła się kolekcja `newsletter_subscriptions`
3. Sprawdź czy w arkuszu pojawiła się nowa linia w zakładce "Newsletter"
4. Powtórz dla formularza kontaktowego

## 🚨 Troubleshooting

**Jeśli nie działa:**
1. Sprawdź logi Functions: `firebase functions:log`
2. Upewnij się, że Sheets API jest włączone
3. Sprawdź uprawnienia service account w arkuszu
4. Zweryfikuj ID arkusza
5. Sprawdź czy zakładki mają właściwe nazwy

**Bezpieczeństwo:**
- Service account ma dostęp tylko do udostępnionego arkusza
- Nie ma kluczy prywatnych w kodzie
- Wykorzystuje ADC (Application Default Credentials)
