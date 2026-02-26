# STRONAHR - Strona WWW

Profesjonalna strona internetowa dla firmy STRONAHR - specjalizującej się w szkoleniach, mentoringu i usługach HR dla contact center.

## 🚀 Co zostało dodane/ulepszone

### ✅ Grafika i wizualizacje
- **Favicon SVG** z logo firmy
- **Ikony SVG** dla sekcji oferty (HR, Szkolenia, Mentoring)
- Placeholder dla og-image (do zamiany na prawdziwy obraz)

### ✅ Funkcjonalność mobilna
- **Hamburger menu** z płynnymi animacjami
- Pełna responsywność na wszystkich urządzeniach
- **Przycisk "Powrót do góry"** (floating button)

### ✅ Bezpieczeństwo i RODO
- **Banner cookies** z obsługą zgód
- **Polityka Prywatności** (pełna strona)
- **Zgody RODO** w formularzu kontaktowym
- **Honeypot field** - ochrona przed botami
- Walidacja po stronie klienta i serwera

### ✅ SEO i analityka
- **Google Tag Manager** (GTM) - gotowy do konfiguracji
- Zintegrowane miejsce na Google Analytics
- Strukturalne dane JSON-LD
- Meta tagi Open Graph i Twitter Cards

### ✅ Nowa zawartość
- **Sekcja "O nas"** ze statystykami firmy
- **Testimoniale** - opinie klientów (3 przykładowe)
- **Rozbudowana stopka** z:
  - Danymi kontaktowymi (email, telefon, adres)
  - Linkami do social media (LinkedIn, Facebook, Instagram)
  - Szybkimi linkami nawigacyjnymi

### ✅ Ulepszenia UX/UI
- Płynne animacje i przejścia
- Lepsze efekty hover na wszystkich elementach
- Ikony graficzne zamiast tekstowych
- Spójny design na wszystkich podstronach

## 📋 Wymagane działania przed uruchomieniem

### 1. Konfiguracja Google Tag Manager
W plikach HTML znajdź:
```html
GTM-XXXXXXX
```
Zamień na swój ID z Google Tag Manager.

### 2. Aktualizacja danych kontaktowych
W `send.php` zmień:
```php
$recipient_email = "kontakt@stronahr.pl";
```

W stopce (`index.html` i wszystkie podstrony) zaktualizuj:
- Email
- Telefon
- Adres fizyczny
- Linki do social media (LinkedIn, Facebook, Instagram)

### 3. Obraz Open Graph
Przygotuj obraz **1200x630px** w formacie JPG i zamień placeholder:
```
images/og-image.jpg
```

### 4. Aktualizacja polityki prywatności
W `pages/polityka-prywatnosci.html` uzupełnij:
- NIP firmy
- Dokładne dane kontaktowe
- Szczegóły dotyczące przetwarzania danych (jeśli potrzebne)

## 🎨 Kolory strony

- **Primary (Piaskowy)**: #D2B48C
- **Accent (Burgund)**: #722F37
- **Tło**: #2C2C2C
- **Powierzchnie**: #3A3A3A
- **Tekst**: #D3D3D3

## 📂 Struktura plików

```
stronahr/
├── index.html              # Strona główna
├── favicon.svg            # Favicon
├── send.php               # Obsługa formularza
├── robots.txt
├── sitemap.xml
├── .htaccess              # Konfiguracja Apache (jeśli istnieje)
├── css/
│   └── style.css         # Wszystkie style
├── js/
│   ├── main.js           # Główna logika
│   └── cookies.js        # Zarządzanie cookies
├── images/
│   ├── og-image.jpg      # Obraz dla social media
│   ├── hr-icon.svg
│   ├── sales-icon.svg
│   └── mentoring-icon.svg
└── pages/
    ├── hr.html                    # Podstrona HR
    ├── szkolenia.html             # Podstrona szkoleń
    ├── mentoring.html             # Podstrona mentoringu
    └── polityka-prywatnosci.html  # Polityka prywatności
```

## 🔧 Technologie

- HTML5
- CSS3 (zmienne CSS, Grid, Flexbox, animacje)
- JavaScript (Vanilla JS, ES6+)
- PHP (backend formularza)
- Google Fonts (Poppins)

## 📱 Responsywność

Strona jest w pełni responsywna i testowana na:
- Desktop (1920px+)
- Laptop (1366px)
- Tablet (768px)
- Mobile (320px - 480px)

## ♿ Dostępność

- Semantyczny HTML5
- ARIA labels
- Breadcrumbs
- Obsługa klawiatury
- Prefers-reduced-motion support
- Alt tags dla obrazów

## 🚀 Uruchomienie

1. Skopiuj wszystkie pliki na serwer WWW
2. Upewnij się, że PHP jest zainstalowane i skonfigurowane
3. Zaktualizuj dane kontaktowe (patrz wyżej)
4. Skonfiguruj GTM
5. Przetestuj formularz kontaktowy

## 📧 Wsparcie

W razie pytań lub problemów, skontaktuj się z deweloperem.

---

**© 2025 STRONAHR - Wszystkie prawa zastrzeżone**
