# Przewodnik po obrazach Open Graph w Sanity

## 📏 WYMIARY OBRAZÓW OG - WAŻNE!

### Zalecane wymiary
**ZAWSZE używaj obrazów o wymiarach: 1200 × 630 pikseli**
- **Proporcja:** 1.91:1
- **Format:** JPG lub PNG (preferowany JPG dla lepszej kompresji)
- **Rozmiar pliku:** Maksymalnie 8MB (zalecane poniżej 1MB)

### Dlaczego te wymiary?
Te wymiary są optymalne dla:
- ✅ Facebook
- ✅ LinkedIn
- ✅ Twitter
- ✅ WhatsApp
- ✅ Telegram
- ✅ Discord
- ✅ Slack

## 🎯 Jak dodać obraz OG w Sanity

### Opcja 1: Dedykowany obraz OG (ZALECANE)
1. W edytorze posta znajdź sekcję **"SEO"**
2. W polu **"OG Image"** dodaj obraz specjalnie przygotowany do udostępniania
3. Upewnij się, że obraz ma wymiary **1200 × 630 pikseli**

### Opcja 2: Użycie głównego obrazu postu
Jeśli nie dodasz dedykowanego obrazu OG, system automatycznie użyje głównego obrazu postu (`mainImage`) i przeskaluje go do prawidłowych wymiarów.

## ⚠️ Częste błędy

### ❌ Błędne wymiary
- Zbyt małe obrazy (np. 800×400) - będą rozciągnięte i rozmyte
- Zbyt duże obrazy bez odpowiedniej proporcji - będą przycięte
- Kwadratowe obrazy (1:1) - będą źle wyglądać na większości platform

### ❌ Złe pozycjonowanie tekstu
- Tekst zbyt blisko krawędzi - może zostać przycięty
- Kluczowe elementy w rogach - niektóre platformy mogą je przyciąć

### ❌ Zbyt mały tekst
- Tekst powinien być czytelny nawet w małym podglądzie
- Minimalna wielkość czcionki: 24px

## ✅ Najlepsze praktyki

### Kompozycja obrazu
1. **Wyśrodkuj kluczowe elementy** - unikaj umieszczania ważnych treści przy krawędziach
2. **Użyj kontrastowych kolorów** - obraz musi być czytelny w małym rozmiarze
3. **Dodaj logo lub branding** - ale nie rób go zbyt dużym
4. **Użyj czytelnych czcionek** - sans-serif działają najlepiej

### Techniczne wymagania
- **Rozdzielczość:** 1200 × 630 pikseli (dokładnie!)
- **Proporcja:** 1.91:1
- **Format:** JPG (zalecany) lub PNG
- **Jakość:** 85% dla JPG
- **Rozmiar:** poniżej 1MB dla szybkiego ładowania

### Testowanie
Po dodaniu obrazu sprawdź jak wygląda w:
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)

## 🔧 Automatyczne optymalizacje

System automatycznie:
- ✅ Przeskaluje obrazy do 1200×630 pikseli
- ✅ Ustawi jakość na 85% dla JPG
- ✅ Wykorzysta `fit=crop` dla zachowania proporcji
- ✅ Doda odpowiednie metadane (alt, rozmiary, typ)

## 📝 Kolejność priorytetów

System wybiera obraz OG w następującej kolejności:
1. **Dedykowany obraz OG** (pole `seo.ogImage`) - najwyższy priorytet
2. **Główny obraz postu** (`mainImage`) - fallback
3. **Domyślny obraz strony** - ostateczny fallback

## 💡 Przykłady dobrych obrazów OG

### Artykuł o kredytach
- Tło w kolorach marki (zielone/żółte)
- Tytuł artykułu dużą czcionką
- Ikona kredytu lub banku
- Logo Kredytowy Patrol w rogu

### Poradnik finansowy
- Czyste, minimalistyczne tło
- Tytuł + krótki opis
- Grafika ilustrująca temat
- Wyraźny call-to-action

### Ranking produktów
- Podium lub lista
- "TOP 5" / "RANKING" w tytule
- Loga banków/produktów
- Data aktualizacji

## 🚀 Narzędzia do tworzenia obrazów OG

### Zalecane narzędzia:
- **Canva** - ma gotowe szablony OG (1200×630)
- **Figma** - dla bardziej zaawansowanych projektów
- **Adobe Express** - proste i szybkie
- **Pablo by Buffer** - specjalnie do social media

### Szablony:
W folderze `/design-templates/og-images/` znajdziesz gotowe szablony dla:
- Artykułów blogowych
- Rankingów produktów
- Poradników
- Aktualności

---

## ❓ Pytania?

Jeśli masz pytania dotyczące obrazów OG, skontaktuj się z zespołem technicznym lub sprawdź dokumentację w `/docs/`.

**Pamiętaj:** Dobry obraz OG może zwiększyć klikalność o nawet 40%! 📈
