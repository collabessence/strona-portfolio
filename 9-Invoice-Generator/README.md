# Generator Faktur VAT PL

Profesjonalny generator faktur VAT dostosowany do polskich przepisów podatkowych. Automatyczne obliczenia, generowanie PDF, zapis i wczytywanie danych.

## 📋 Funkcje

### Podstawowe
- ✅ Kompletne formularze sprzedawcy i nabywcy
- ✅ Automatyczne obliczenia VAT (23%, 8%, 5%, 0%, ZW, NP)
- ✅ Wielopozycyjne faktury z sumami częściowymi
- ✅ Kwota słownie w języku polskim
- ✅ Generowanie profesjonalnych faktur PDF
- ✅ Podgląd faktury przed wydrukiem
- ✅ Zapis/wczytywanie danych faktury (JSON)
- ✅ Automatyczne zapamiętywanie danych sprzedawcy

### Funkcje zaawansowane
- 📱 Responsywny interfejs (działa na telefonach i tabletach)
- 🔢 Automatyczne formatowanie: NIP (XXX-XXX-XX-XX), kod pocztowy (XX-XXX), konto bankowe
- 📆 Inteligentne daty: automatyczny termin płatności (+14 dni)
- 💾 LocalStorage: zapamiętywanie danych sprzedawcy między sesjami
- 🖨️ Stylowanie gotowe do druku
- 📊 Różne jednostki miary (szt., godz., usł., kg, m, m², kpl.)
- 💰 Różne metody płatności (przelew, gotówka, karta, pobranie)

## 🚀 Instalacja

### Metoda 1: Uruchomienie lokalne
1. Pobierz folder `9-Invoice-Generator`
2. Otwórz `index.html` w przeglądarce
3. Gotowe! Nie wymaga instalacji dodatkowych narzędzi

### Metoda 2: Hosting online
```bash
# Netlify Drop
- Wejdź na app.netlify.com/drop
- Przeciągnij folder 9-Invoice-Generator
- Otrzymasz link: https://your-invoice-gen.netlify.app

# GitHub Pages
git init
git add .
git commit -m "Invoice Generator"
git branch -M main
git remote add origin https://github.com/username/invoice-gen.git
git push -u origin main
# Włącz GitHub Pages w ustawieniach repo
```

## 📖 Instrukcja użycia

### 1. Dane sprzedawcy (zapamiętywane automatycznie)
```
Nazwa firmy: Twoja Firma Sp. z o.o.
NIP: 123-456-78-90 (auto-formatowanie)
Adres: ul. Przykładowa 1
Kod: 00-001 (auto-formatowanie)
Miasto: Warszawa
Telefon: +48 123 456 789
Email: kontakt@firma.pl
Bank: PKO BP
Konto: 12 3456 7890 1234 5678 9012 3456
```

### 2. Dane nabywcy
Wypełnij formularz nabywcy (nazwa, NIP, adres, miasto)

### 3. Szczegóły faktury
```
Numer faktury: FV/2025/05/001
Data wystawienia: [auto: dzisiaj]
Data sprzedaży: [auto: dzisiaj]
Termin płatności: [auto: dzisiaj + 14 dni]
Sposób płatności: przelew/gotówka/karta/pobranie
```

### 4. Pozycje faktury
**Dodawanie pozycji:**
- Kliknij "➕ Dodaj pozycję"
- Wypełnij: nazwę, ilość, jednostkę, cenę netto, stawkę VAT
- Totale obliczają się automatycznie

**Stawki VAT w Polsce:**
- **23%** - stawka podstawowa (większość towarów i usług)
- **8%** - stawka obniżona (żywność, książki, czasopisma)
- **5%** - stawka superobniżona (podstawowa żywność, leki)
- **0%** - stawka zerowa (eksport, usługi wewnątrzwspólnotowe)
- **ZW** - zwolniony z VAT (edukacja, opieka zdrowotna)
- **NP** - nie podlega VAT (niektóre usługi finansowe)

**Przykładowe pozycje:**
```
1. Konsultacja IT | 10 | godz. | 200.00 | 23%
2. Hosting serwera | 1 | usł. | 500.00 | 23%
3. Projekt graficzny | 1 | szt. | 1500.00 | 23%
```

### 5. Uwagi (opcjonalnie)
Dodaj dodatkowe informacje, np.:
- Faktura opłacona
- Termin wykonania usługi
- Informacje o gwarancji

### 6. Generowanie faktury

**Podgląd:**
- Kliknij "👁️ Podgląd faktury"
- Sprawdź poprawność danych
- Gotowa do druku

**PDF:**
- Kliknij "📄 Generuj PDF"
- Faktura zostanie pobrana jako `Faktura_FV_2025_05_001.pdf`
- Profesjonalny layout zgodny z polskimi przepisami

**Zapis danych:**
- Kliknij "💾 Zapisz dane"
- Pobierze się plik JSON z wszystkimi danymi faktury
- Możesz go później wczytać przyciskiem "📂 Wczytaj dane"

## 💼 Zastosowania biznesowe

### Dla freelancerów
- Szybkie wystawianie faktur dla klientów
- Zapamiętywanie swoich danych (nie trzeba wpisywać za każdym razem)
- Profesjonalne PDF-y do wysyłki email

### Dla małych firm
- Proste fakturowanie bez kosztownych programów księgowych
- Brak abonamentów i opłat miesięcznych
- Działa offline po pierwszym załadowaniu

### Dla agencji
- Generowanie faktur dla wielu klientów
- Zapis szablonów dla stałych klientów
- Szybkie kopiowanie i modyfikacja

## 🔧 Zaawansowane funkcje

### Automatyczne formatowanie
System automatycznie formatuje:
- **NIP**: `123456789` → `123-456-78-90`
- **Kod pocztowy**: `00001` → `00-001`
- **Nr konta**: `12345678901234567890123456` → `12 3456 7890 1234 5678 9012 3456`

### LocalStorage
- Dane sprzedawcy są zapisywane w przeglądarce
- Przy następnym otwarciu formularze są wypełnione
- Oszczędza czas przy wystawianiu wielu faktur

### Obliczenia
```javascript
Wartość netto = ilość × cena netto
Kwota VAT = wartość netto × (stawka VAT / 100)
Wartość brutto = wartość netto + kwota VAT

Razem netto = suma wszystkich netto
Razem VAT = suma wszystkich VAT
DO ZAPŁATY = suma wszystkich brutto
```

### Kwota słownie
Automatyczna konwersja kwoty na słowa:
```
1234.56 PLN → "tysiąc dwieście trzydzieści cztery złotych 56/100"
45.90 PLN → "czterdzieści pięć złotych 90/100"
1000000.00 PLN → "jeden milion złotych 00/100"
```

## 📊 Zgodność prawna

### Elementy obowiązkowe faktury VAT (spełnione ✅)
- ✅ Słowa "FAKTURA VAT" lub "FAKTURA"
- ✅ Numer kolejny faktury
- ✅ Data wystawienia faktury
- ✅ Data sprzedaży (lub okresu sprzedaży)
- ✅ Dane sprzedawcy (nazwa, adres, NIP)
- ✅ Dane nabywcy (nazwa, adres, NIP)
- ✅ Nazwa towaru/usługi
- ✅ Jednostka miary i ilość
- ✅ Cena jednostkowa netto
- ✅ Wartość netto, podatek VAT, wartość brutto
- ✅ Suma wartości netto, VAT i brutto
- ✅ Kwota należności słownie

### Uwaga prawna
⚠️ Generator tworzy faktury zgodne z polskimi przepisami, ale:
- Nie zastępuje profesjonalnego programu księgowego
- Nie integruje się z systemami ERP
- Nie wysyła automatycznie do systemu e-Deklaracje
- Zalecamy konsultację z księgowym dla firm rozliczających się z VAT

## 🎨 Personalizacja

### Zmiana kolorów
W pliku `style.css` zmień zmienne:
```css
:root {
    --primary-color: #2c3e50;    /* Główny kolor */
    --accent-color: #3498db;     /* Kolor akcentu */
    --success-color: #27ae60;    /* Kolor sukcesu */
    --danger-color: #e74c3c;     /* Kolor usuwania */
}
```

### Logo firmy
Dodaj w pliku `script.js` funkcji `generatePDF()`:
```javascript
// Po linii: const doc = new jsPDF('p', 'mm', 'a4');
const logoImg = 'data:image/png;base64,YOUR_LOGO_BASE64';
doc.addImage(logoImg, 'PNG', 15, 10, 30, 30);
```

### Domyślna metoda płatności
W `index.html` zmień `selected` w `<select id="paymentMethod">`:
```html
<option value="gotówka" selected>Gotówka</option>
```

## 💰 Wartość produktu

### Wycena rynkowa
- Podobne generatory online: 300-500 zł/rok (abonament)
- Programy księgowe z modułem faktur: 50-150 zł/miesiąc
- **Twój produkt**: jednorazowa opłata 200-400 zł

### Argumenty sprzedażowe
1. **Brak abonamentów** - jednorazowy zakup, używasz bez limitów
2. **Offline** - działa bez internetu po pierwszym załadowaniu
3. **Prywatność** - dane przechowywane lokalnie, nie wysyłane na serwer
4. **Polski VAT** - dostosowany do polskich przepisów
5. **Łatwy** - nie wymaga instalacji, działa w przeglądarce

### Przykładowe pakiety
```
SOLO - 250 zł
- Generator faktur
- Nieograniczona liczba faktur
- Generowanie PDF
- Zapis/wczytywanie danych

FIRMA - 400 zł
- Generator faktur
- 3 szablony firmowe (możliwość dodania logo)
- Konsultacja wdrożeniowa (30 min)
- Instrukcja obsługi PDF

AGENCJA - 800 zł
- Generator faktur
- Dostosowanie wizualne (kolory, logo)
- 10 szablonów klientów
- Wsparcie techniczne (3 miesiące)
- Instrukcja + video tutorial
```

## 🐛 Rozwiązywanie problemów

### Faktura PDF nie generuje się
**Problem**: Kliknięcie "Generuj PDF" nie działa
**Rozwiązanie**: 
- Sprawdź czy biblioteka jsPDF załadowała się (otwórz konsolę F12)
- Sprawdź połączenie internetowe (CDN wymaga internetu)
- Wypełnij wszystkie wymagane pola

### Dane sprzedawcy nie zapisują się
**Problem**: Po odświeżeniu strony dane znikają
**Rozwiązanie**:
- Sprawdź czy przeglądarka ma włączone LocalStorage
- Nie używaj trybu incognito
- Wyczyść cache i spróbuj ponownie

### Błędne obliczenia VAT
**Problem**: Kwoty VAT się nie zgadzają
**Rozwiązanie**:
- Sprawdź stawkę VAT (czy przypadkiem nie ZW zamiast 23%)
- Pamiętaj o zaokrągleniach (system zaokrągla do 2 miejsc)
- Dla VAT ZW i NP kwota VAT = 0.00

### PDF wygląda źle
**Problem**: Layout PDF jest zniekształcony
**Rozwiązanie**:
- Skróć długie nazwy produktów (max 40 znaków)
- Jeśli masz >15 pozycji, zostanie dodana druga strona
- Sprawdź czy używasz najnowszej wersji przeglądarki

## 📈 Rozbudowa produktu

### Możliwe dodatki (zwiększenie wartości)
1. **Moduł klientów** - baza stałych klientów z autouzupełnianiem
2. **Historia faktur** - lista wystawionych faktur z wyszukiwarką
3. **Faktura korygująca** - generowanie korekt
4. **Faktura proforma** - faktury pro forma
5. **Eksport do CSV** - dla księgowych
6. **Integracja email** - wysyłka faktur bezpośrednio z aplikacji
7. **Multi-waluta** - obsługa EUR, USD
8. **Szablony** - zapisywanie szablonów dla powtarzających się faktur

### Wersja PRO (dodatkowa sprzedaż)
```
Generator Faktur PRO - 800 zł
+ Wszystkie funkcje podstawowe
+ Baza klientów (nieograniczona)
+ Historia faktur z wyszukiwarką
+ Faktury korygujące
+ 5 szablonów graficznych
+ Eksport do Excel/CSV
+ Wsparcie email (12 miesięcy)
```

## 🎓 Materiały marketingowe

### Tytuły postów sprzedażowych
1. "Generuj faktury VAT w 60 sekund - bez abonamentów!"
2. "Przestań przepłacać za programy księgowe - Generator za 250 zł jednorazowo"
3. "Freelancerzy! Ta aplikacja wyręczy Cię w fakturowaniu"
4. "Polski generator faktur VAT z PDF - działa offline!"
5. "Jak wystawić fakturę VAT? Prosty generator dla każdego"

### Opis na OLX/Marketplace
```
🧾 Generator Faktur VAT - Profesjonalny, Polski, Bez Abonamentów!

✅ Kompletne faktury VAT zgodne z polskimi przepisami
✅ Automatyczne obliczenia (23%, 8%, 5%, 0%, ZW, NP)
✅ Generowanie PDF - profesjonalny wygląd
✅ Działa OFFLINE - nie potrzebujesz internetu
✅ Zapamiętuje Twoje dane - wpisujesz raz
✅ Bez limitów faktur - wystawiaj ile chcesz

💰 CENA: 250 zł jednorazowo (nie ma żadnych abonamentów!)

🎁 W PAKIECIE:
- Pełna wersja generatora
- Instrukcja PDF
- Wsparcie techniczne (email)

📦 Dostawa: natychmiast po płatności (link do pobrania)

Idealne dla: freelancerów, małych firm, agencji, wszystkich którzy wystawiają faktury VAT

Kontakt: [Twój kontakt]
```

## 🔐 Bezpieczeństwo danych

- ✅ Wszystkie dane przechowywane lokalnie w przeglądarce
- ✅ Brak wysyłania danych na zewnętrzne serwery
- ✅ Brak wymagań logowania
- ✅ Brak śledzenia użytkownika
- ✅ Kod źródłowy dostępny do weryfikacji

**Uwaga**: Dane w LocalStorage można utracić przy czyszczeniu przeglądarki. Zalecamy regularne eksportowanie faktur do JSON.

## 📞 Wsparcie

Dla klientów oferujemy:
- 📧 Wsparcie email: [Twój email]
- 📱 Szybkie FAQ w dokumentacji
- 🎥 Video tutorial (opcjonalnie)
- 💬 Konsultacja wdrożeniowa (w pakietach FIRMA i wyżej)

## 📄 Licencja

Produkt sprzedawany z licencją na użytek własny:
- ✅ Nieograniczone wystawianie faktur
- ✅ Instalacja na własnym serwerze
- ✅ Modyfikacje dla własnych potrzeb
- ❌ Odsprzedaż/redystrybucja bez zgody
- ❌ Używanie kodu w innych komercyjnych projektach

---

**Generator Faktur VAT PL v1.0** | Made with ❤️ for Polish freelancers and small businesses
