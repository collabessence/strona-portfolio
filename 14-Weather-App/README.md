# ☀️ Weather App - Aplikacja Pogodowa

Profesjonalna aplikacja pogodowa z integracją OpenWeatherMap API, prognozą 5-dniową, geolokalizacją i zapisywaniem ulubionych miast.

### 🌦️ Pogoda
- **Aktualna pogoda** - Temperatura, opis, ikona
- **Szczegółowe dane** - Wiatr, wilgotność, ciśnienie, widoczność
- **Wschód/zachód słońca** - Dokładne godziny
- **Prognoza 5-dniowa** - Przyszła pogoda
- **Temperatura odczuwalna** - "Feels like"

### 🔍 Wyszukiwanie
- **Wyszukiwarka miast** - Z auto-complete suggestions
- **Geolokalizacja** - Użyj mojej lokalizacji (GPS)
- **Historia wyszukań** - Ostatnie miasto zapisywane
- **Ulubione miasta** - Zapisuj i szybko przełączaj

### ⚙️ Personalizacja
- **Jednostki temperatury** - Przełącznik °C / °F
- **Tryb demo** - Testuj bez API key
- **LocalStorage** - Zapisywanie preferencji
- **Responsive design** - Działa na wszystkich urządzeniach

### Krok 1: Pobierz pliki
```bash
# Sklonuj lub pobierz folder
cd 14-Weather-App
```

### Krok 2: Otwórz w przeglądarce
```bash
# Kliknij dwukrotnie index.html
# LUB użyj Live Server w VS Code
```

### Krok 3: Konfiguracja API Key

#### Opcja A: Darmowy klucz OpenWeatherMap (POLECANE)

1. **Zarejestruj się** na [OpenWeatherMap.org](https://home.openweathermap.org/users/sign_up)
   - Email
   - Hasło
   - Potwierdź email

2. **Uzyskaj API Key**
   - Przejdź do [API Keys](https://home.openweathermap.org/api_keys)
   - Skopiuj swój klucz (wygląda tak: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`)

3. **Wklej w aplikacji**
   - Przy pierwszym uruchomieniu pojawi się modal
   - Wklej klucz API
   - Kliknij "Zapisz i Kontynuuj"
   - Gotowe!

**Uwaga**: Aktywacja klucza API może zająć 10-15 minut po rejestracji.

#### Opcja B: Tryb Demo (bez API)

- Kliknij "Użyj Trybu Demo" w modalu
- Aplikacja załaduje przykładowe dane
- Idealne do testowania funkcjonalności

### Wyszukiwanie miasta

1. **Wpisz nazwę miasta** w polu wyszukiwania
2. Pojawią się **sugestie** - wybierz miasto
3. Pogoda załaduje się automatycznie

### Użyj geolokalizacji

1. Kliknij ikonę **📍 lokalizacji**
2. Przeglądarka zapyta o pozwolenie
3. Zaakceptuj i poczekaj
4. Pogoda dla Twojej lokalizacji!

### Ulubione miasta

1. Wyszukaj miasto
2. Kliknij **❤️ serce** przy nazwie miasta
3. Miasto pojawi się w sekcji "Ulubione"
4. Kliknij na ulubione miasto aby szybko zobaczyć pogodę

### Zmiana jednostek

- Kliknij **°C | °F** w prawym górnym rogu
- Temperatura automatycznie się przelicza
- Preferowana jednostka jest zapisywana

### Zmiana domyślnego miasta

W `script.js`, linia 38:
```javascript
fetchWeatherByCity('Warsaw');  // Zmień na swoje miasto
```

### Zmiana języka

API wspiera wiele języków. W `script.js`, linia 285:
```javascript
&lang=pl  // pl=Polski, en=English, de=Deutsch, etc.
```

### Zmiana kolorów

W `style.css`, zmienne CSS:
```css
:root {
    --primary: #6366f1;     /* Główny kolor */
    --secondary: #8b5cf6;   /* Drugi kolor */
    --success: #10b981;     /* Zielony */
    --danger: #ef4444;      /* Czerwony */
    --dark: #1e293b;        /* Ciemne tło */
}
```

## 🔧 Tech Stack

- **HTML5** - Semantyczny markup
- **CSS3** - Modern design, animations
- **Vanilla JavaScript (ES6+)** - Czysta logika, async/await
- **OpenWeatherMap API** - Dane pogodowe
- **Geolocation API** - GPS lokalizacja
- **LocalStorage API** - Trwałe dane
- **Font Awesome 6.4** - Ikony

### OpenWeatherMap - Free Plan
- **60 wywołań/minutę**
- **1,000,000 wywołań/miesiąc**
- **Aktualna pogoda** ✅
- **Prognoza 5 dni** ✅
- **Geolokalizacja** ✅

To **więcej niż wystarczy** dla małych i średnich aplikacji!

### "Failed to fetch weather"
**Przyczyna**: Nieprawidłowy API key lub brak internetu
**Rozwiązanie**:
1. Sprawdź czy API key jest poprawny
2. Sprawdź czy minęło 10-15 min od aktywacji
3. Sprawdź połączenie z internetem

### "City not found"
**Przyczyna**: Błędna nazwa miasta
**Rozwiązanie**:
1. Użyj sugestii (auto-complete)
2. Spróbuj angielskiej nazwy: "Warsaw" zamiast "Warszawa"
3. Dodaj kraj: "London, UK"

### Geolokalizacja nie działa
**Przyczyna**: Brak pozwolenia w przeglądarce
**Rozwiązanie**:
1. Sprawdź ustawienia przeglądarki
2. Zezwól na dostęp do lokalizacji
3. Odśwież stronę (F5)
4. Użyj HTTPS (HTTP może blokować geolokalizację)

### Tryb demo nie ładuje danych
**Przyczyna**: JavaScript error
**Rozwiązanie**:
1. Otwórz konsolę (F12)
2. Sprawdź błędy
3. Wyczyść cache (Ctrl+Shift+R)

### Dodanie dodatkowych danych

OpenWeatherMap API oferuje więcej danych:
- **UV Index** - `uvi`
- **Air Pollution** - `/air_pollution`
- **Alerts** - `alerts`

Przykład:
```javascript
// W displayWeather()
if (data.uvi) {
    document.getElementById('uvIndex').textContent = data.uvi;
}
```

### Własne ikony pogody

Zastąp Font Awesome własnymi obrazkami:
```javascript
function getWeatherIcon(code) {
    return `<img src="icons/${code}.png" alt="Weather icon">`;
}
```

### Dodanie wykresów

Użyj Chart.js dla prognoz:
```html
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
```

## 🔐 Security

- ✅ API key przechowywany w LocalStorage (bezpieczne dla małych app)
- ✅ Brak wysyłania wrażliwych danych
- ✅ HTTPS zalecane dla geolokalizacji
- ⚠️ Dla dużych aplikacji: używaj backend proxy dla API key

## 🌟 Features Roadmap

- [ ] Powiadomienia push o pogodzie
- [ ] Widget dla innych stron (iframe)
- [ ] Mapa pogodowa
- [ ] Historyczne dane pogodowe
- [ ] Porównanie miast side-by-side
- [ ] Dark mode
- [ ] Własny backend API
- [ ] Progressive Web App (PWA)

---

**Wersja**: 1.0  
**Data**: 2025  
**Autor**: [Twoje imię]  

⭐ **Gotowy do użycia! Zarejestruj się na OpenWeatherMap i zacznij!**
