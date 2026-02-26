# 🏋️ Fitness Club - Strona Siłowni

Profesjonalna strona internetowa dla klubu fitness/siłowni z dynamicznymi animacjami i responsywnym designem.

## ✨ Funkcje

### 🎨 Design
- **Energetyczna kolorystyka** - Pomarańczowe akcenty (#ff6b35) z ciemnym tłem
- **Hero z efektem video** - Placeholder dla tła wideo
- **Animacje scroll** - Płynne pojawianie się elementów
- **Efekt parallax** - Dynamiczne tło hero
- **Responsywny layout** - Doskonale wygląda na wszystkich urządzeniach

### 📱 Sekcje

1. **Hero Section**
   - Nagłówek z efektem video background
   - Call-to-action buttons
   - Statystyki klubu

2. **Features**
   - 4 karty zalet (Trenerzy, Sprzęt, Plan, Społeczność)
   - Ikony Font Awesome
   - Animacje hover

3. **Plany Treningowe**
   - 3 programy (Budowa Masy, Redukcja, Wellness)
   - Szczegółowe opisy
   - Przyciski zapisów

4. **Trenerzy**
   - 3 profile trenerów
   - Specjalizacje
   - Social media links

5. **Transformacje**
   - Galeria before/after
   - Toggle porównania
   - Inspirujące cytaty

6. **Cennik**
   - 3 plany członkostwa
   - Oznaczony "Najpopularniejszy"
   - Lista korzyści

7. **Formularz Zapisów**
   - Walidacja danych
   - Wybór planu i celu
   - Success message

8. **Kontakt**
   - Adres i dane
   - Godziny otwarcia
   - Placeholder mapy

## 🛠️ Technologie

- **HTML5** - Semantyczny markup
- **CSS3** - Flexbox, Grid, Animations, Gradients
- **JavaScript ES6+** - Modern features
- **Font Awesome 6.4.0** - Ikony
- **IntersectionObserver API** - Scroll animations

## 📋 JavaScript Features

### Mobile Menu
```javascript
- Toggle hamburger menu
- Smooth animations
- Auto-close on link click
- Body scroll lock when open
```

### Form Validation
```javascript
- Required fields check
- Email format validation
- Polish phone number validation
- Success popup with overlay
- Auto-reset after submission
```

### Scroll Animations
```javascript
- IntersectionObserver for performance
- Fade-in + translateY effect
- Staggered animations
- Unobserve after animation
```

### Counter Animation
```javascript
- Animated statistics
- Smooth number increment
- Trigger on scroll into view
- Polish locale formatting
```

### Interactive Effects
```javascript
- Navbar background on scroll
- Parallax hero effect
- Plan card hover enhancement
- Before/After toggle
- Page load fade-in
```

## 🎯 Customizacja

### Kolory
```css
--primary: #ff6b35 (pomarańczowy)
--dark: #1f2937 (ciemny szary)
--light: #f9fafb (jasny)
--accent: #10b981 (zielony)
```

### Czcionki
```css
font-family: 'Arial Black', sans-serif; /* Nagłówki */
font-family: 'Arial', sans-serif; /* Tekst */
```

### Obrazy
Zastąp placeholdery w HTML:
- Hero background video/image
- Zdjęcia trenerów
- Before/after transformacje
- Logo klubu

## 📱 Responsive Breakpoints

```css
@media (max-width: 968px) - Tablet
@media (max-width: 768px) - Mobile landscape
@media (max-width: 480px) - Mobile portrait
```

## 🚀 Instalacja

1. Pobierz wszystkie pliki
2. Zastąp placeholdery własnymi obrazami
3. Zaktualizuj dane kontaktowe w HTML
4. Opcjonalnie: Dodaj prawdziwy formularz backend (PHP/Node.js)
5. Wgraj na hosting

## 🔧 Integracja Formularza

### Opcja 1: Formspree (darmowe)
```html
<form action="https://formspree.io/f/YOUR_ID" method="POST">
```

### Opcja 2: EmailJS
```javascript
// Dodaj EmailJS SDK i skonfiguruj template
emailjs.send('service_id', 'template_id', formData);
```

### Opcja 3: Własny backend
```javascript
fetch('/api/signup', {
    method: 'POST',
    body: JSON.stringify(formData)
});
```

## 📊 Statystyki

Zaktualizuj liczby w HTML (data-target):
```html
<span class="stat-number" data-target="2000">2000</span>+
```

## 🎨 Dodatkowe Możliwości

- **Video Background** - Dodaj prawdziwy plik video w hero
- **Booking System** - Integracja z kalendarzem rezerwacji
- **Member Area** - Panel logowania dla członków
- **Blog** - Sekcja artykułów o fitnessie
- **Galeria** - Lightbox ze zdjęciami klubu
- **Testimonials** - Opinie klientów z Trustpilot

## 📄 Licencja

Projekt stworzony do portfolio. Możesz używać i modyfikować według potrzeb.

## 🤝 Wsparcie

W razie pytań lub problemów, sprawdź:
- Konsolę przeglądarki (F12)
- Walidację HTML/CSS
- Kompatybilność przeglądarki

---

**Stworzono z 💪 dla branży fitness**
