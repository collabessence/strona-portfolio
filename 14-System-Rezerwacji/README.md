# 📅 System Rezerwacji Online - BookEasy

Profesjonalny system rezerwacji online dla firm usługowych - salony fryzjerskie, gabinety kosmetyczne, centra medyczne, studia masażu i inne.

## ✨ Funkcje

### Dla Klientów
- **Wybór usługi** - przejrzysty katalog usług z cenami i czasem trwania
- **Interaktywny kalendarz** - wybór daty z wykluczonymi weekendami i przeszłymi datami
- **Dostępne godziny** - automatyczna blokada zajętych terminów
- **Formularz rezerwacji** - proste dane kontaktowe
- **Podsumowanie** - przegląd przed potwierdzeniem
- **Potwierdzenie** - modal z numerem rezerwacji

### Dla Właścicieli
- **Panel administracyjny** - zarządzanie wszystkimi rezerwacjami
- **Filtrowanie** - po dacie, usłudze, statusie
- **Zarządzanie statusami** - potwierdź/anuluj/usuń rezerwacje
- **Eksport CSV** - pobierz dane rezerwacji
- **Statystyki** - liczba klientów, oceny
- **LocalStorage** - bez bazy danych, wszystko w przeglądarce

## 🚀 Instalacja

1. **Pobierz pliki**
   ```
   14-System-Rezerwacji/
   ├── index.html
   ├── style.css
   ├── script.js
   └── README.md
   ```

2. **Otwórz w przeglądarce**
   - Kliknij dwukrotnie `index.html`
   - Lub użyj Live Server w VS Code

3. **Gotowe!**
   - Brak instalacji, brak serwera, brak bazy danych
   - Wszystkie dane zapisywane lokalnie w przeglądarce

## 📖 Jak używać

### Rezerwacja wizyty (Klient)

1. **Krok 1: Wybierz usługę**
   - Kliknij na kartę usługi
   - Zobaczysz czas trwania i cenę
   - Naciśnij "Dalej"

2. **Krok 2: Wybierz termin**
   - Wybierz datę z kalendarza (weekendy zablokowane)
   - Wybierz dostępną godzinę
   - Zajęte terminy są nieaktywne
   - Naciśnij "Dalej"

3. **Krok 3: Uzupełnij dane**
   - Imię i nazwisko
   - Email i telefon
   - Opcjonalne uwagi
   - Akceptacja regulaminu
   - Naciśnij "Potwierdź rezerwację"

4. **Potwierdzenie**
   - Otrzymasz numer rezerwacji
   - Szczegóły wizyty
   - Gotowe!

### Zarządzanie rezerwacjami (Admin)

1. **Wejdź do panelu**
   - Kliknij "Panel Admin" w nawigacji
   - Zobaczysz listę wszystkich rezerwacji

2. **Filtrowanie**
   - Po dacie - wybierz konkretny dzień
   - Po usłudze - wybierz rodzaj
   - Po statusie - oczekujące/potwierdzone/anulowane
   - Naciśnij "Reset" aby wyczyścić filtry

3. **Akcje na rezerwacjach**
   - **Potwierdź** - zmienia status na "Potwierdzone"
   - **Anuluj** - zmienia status na "Anulowane"
   - **Usuń** - usuwa rezerwację (wymaga potwierdzenia)

4. **Eksport danych**
   - Naciśnij "Eksport CSV"
   - Pobierze plik z wszystkimi rezerwacjami
   - Otwórz w Excel/Google Sheets

## ⚙️ Konfiguracja

### Zmiana usług

Edytuj `script.js`, sekcja `services`:

```javascript
const services = {
    haircut: { name: 'Strzyżenie', duration: 45, price: 80 },
    // Dodaj nowe:
    manicure: { name: 'Manicure', duration: 60, price: 100 },
    pedicure: { name: 'Pedicure', duration: 75, price: 120 }
};
```

Następnie dodaj kartę w `index.html` w sekcji `<div class="services-grid">`:

```html
<div class="service-card" data-service="manicure" data-duration="60" data-price="100">
    <div class="service-icon">
        <i class="fas fa-hand-sparkles"></i>
    </div>
    <h4>Manicure</h4>
    <p>Stylizacja paznokci</p>
    <div class="service-meta">
        <span><i class="fas fa-clock"></i> 60 min</span>
        <span><i class="fas fa-tag"></i> 100 zł</span>
    </div>
</div>
```

### Zmiana godzin pracy

Edytuj `script.js`, sekcja `workingHours`:

```javascript
const workingHours = {
    start: 10,    // Rozpoczęcie o 10:00
    end: 20,      // Zakończenie o 20:00
    interval: 30  // Co 30 minut (można zmienić na 60)
};
```

### Zmiana kolorów

Edytuj `style.css`, sekcja `:root`:

```css
:root {
    --primary: #6366f1;      /* Fioletowy */
    --primary-dark: #4f46e5; /* Ciemniejszy fiolet */
    --success: #10b981;      /* Zielony */
    --warning: #f59e0b;      /* Pomarańczowy */
    --danger: #ef4444;       /* Czerwony */
}
```

### Włączenie rezerwacji w weekendy

W `script.js`, funkcja `renderCalendar()`, usuń linię:

```javascript
// Usuń lub zakomentuj:
if (isWeekend) classes += ' disabled';
```

I w funkcji `selectDate()`:

```javascript
// Usuń:
if (clickedDate.getDay() === 0 || clickedDate.getDay() === 6) return;
```

## 🛠 Stack technologiczny

- **HTML5** - Semantyczna struktura
- **CSS3** - Modern design, Grid, Flexbox
- **Vanilla JavaScript (ES6+)** - Czysta logika, bez frameworków
- **LocalStorage API** - Trwałe przechowywanie danych
- **Font Awesome 6.4** - Ikony
- **Date API** - Zarządzanie kalendarzem

## 💼 Zastosowanie komercyjne

### Idealne dla:
- ✂️ Salony fryzjerskie
- 💅 Gabinety kosmetyczne
- 🏥 Przychodnie medyczne
- 💆 Studia masażu
- 🦷 Gabinety stomatologiczne
- 🏋️ Siłownie i studia fitness
- 🧘 Studia jogi
- 🎓 Korepetycje i szkolenia

### Wartość komercyjna

**Cena sprzedaży:** 1500-3000 zł

**Dodatkowe usługi:**
- Personalizacja (logo, kolory) - +300 zł
- Dodatkowe usługi/kategorie - +200 zł
- Integracja z email - +500 zł
- Backend z bazą danych - +2000 zł
- Powiadomienia SMS - +800 zł
- Płatności online - +1500 zł

**Miesięczne utrzymanie:** 100-300 zł

### Argumenty sprzedażowe

1. **Oszczędność czasu** - brak telefonów, 24/7 rezerwacje
2. **Wygoda dla klientów** - rezerwacja w 2 minuty
3. **Automatyczna blokada** - brak podwójnych rezerwacji
4. **Panel administracyjny** - zarządzanie w jednym miejscu
5. **Mobilny dostęp** - działa na każdym urządzeniu
6. **Bez dodatkowych kosztów** - brak abonamentów i baz danych

## 📊 Rozbudowa (opcjonalnie)

### Proste usprawnienia
- [ ] Dodaj więcej usług
- [ ] Zmień godziny pracy
- [ ] Dodaj więcej statystyk
- [ ] Niestandardowe kolory brandowe

### Średnio zaawansowane
- [ ] Email powiadomienia (EmailJS)
- [ ] Przypomnienia SMS (Twilio)
- [ ] Google Calendar sync
- [ ] Eksport PDF zamiast CSV

### Zaawansowane (wymaga backendu)
- [ ] Backend Node.js/PHP
- [ ] Baza danych MySQL/PostgreSQL
- [ ] Multi-user (różni użytkownicy)
- [ ] Płatności online (Stripe/PayU)
- [ ] System lojalnościowy
- [ ] Statystyki i analytics

## 📝 Licencja

Ten projekt jest własnością autora portfolio. Możesz:
- ✅ Używać dla klientów komercyjnych
- ✅ Modyfikować i dostosowywać
- ✅ Sprzedawać jako część swoich usług
- ❌ Nie możesz odsprzedawać kodu źródłowego jako szablon

## 📞 Wsparcie

Pytania? Problemy? Kontakt:
- 📧 Email: twoj-email@example.com
- 💼 LinkedIn: [Twój profil]
- 🌐 Portfolio: [Link do portfolio]

---

**Wersja:** 1.0.0  
**Data wydania:** 2025  
**Autor:** [Twoje imię]  

⭐ Jeśli podoba Ci się ten projekt, zostaw gwiazdkę!
