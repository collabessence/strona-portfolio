# 🤖 Telegram Bot dla Firm

**Auto-responder z FAQ i zbieraniem kontaktów**

## 💰 Wartość komercyjna: 300-600 zł

---

## ✨ Funkcje

- ✅ Automatyczne odpowiedzi na FAQ
- ✅ Inteligentne rozpoznawanie pytań
- ✅ Zbieranie kontaktów klientów
- ✅ System rezerwacji/umówień
- ✅ Menu z przyciskami
- ✅ Logowanie wszystkich wiadomości

---

## 🚀 Instalacja

### Krok 1: Utwórz bota na Telegramie

1. Otwórz Telegram
2. Znajdź **@BotFather**
3. Wyślij: `/newbot`
4. Podaj nazwę bota (np. "MojaFirmaBot")
5. Podaj username (np. "mojafirma_bot")
6. **Skopiuj TOKEN** (wygląda tak: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

### Krok 2: Zainstaluj bibliotekę

```bash
pip install -r requirements.txt
```

### Krok 3: Wklej TOKEN

Otwórz `telegram_bot.py` i w linii 18 wklej swój TOKEN:

```python
BOT_TOKEN = "123456789:ABCdefGHIjklMNOpqrsTUVwxyz"  # ← Tutaj
```

### Krok 4: Uruchom bota

```bash
python telegram_bot.py
```

✅ **Gotowe!** Bot działa 24/7 (dopóki terminal jest włączony)

---

## 📖 Personalizacja

### 1. Zmień FAQ (linia 23-42)

```python
FAQ = {
    "godziny": "Twoje godziny otwarcia",
    "adres": "Twój adres",
    "cennik": "Twój cennik",
    # itd...
}
```

### 2. Zmień nazwę firmy (linia 76)

```python
Jestem botem firmy **TWOJA NAZWA FIRMY**
```

### 3. Dodaj więcej komend

Skopiuj funkcję i dodaj handler:

```python
async def moja_komenda(self, update, context):
    await update.message.reply_text("Odpowiedź")

# W funkcji run() dodaj:
app.add_handler(CommandHandler("mojakomenda", self.moja_komenda))
```

---

## 💼 Jak sprzedać ten produkt

### Do kogo sprzedać:

- 🏪 Małe sklepy (FAQ o produktach)
- 💇 Salony (umówienie wizyty)
- 🍕 Restauracje (przyjmowanie zamówień)
- 🏋️ Siłownie/Studia (info o grafiku)
- 📚 Szkoły online (wsparcie uczniów)
- 🏨 Hotele/Pensjonaty (rezerwacje)

### Cennik sugerowany:

- **Podstawowy bot (jak ten)**: 300-400 zł
- **+ Integracja z kalendarzem**: +200 zł
- **+ Wysyłanie powiadomień**: +150 zł
- **+ Płatności online**: +300 zł
- **Miesięczne wsparcie**: 50 zł/m

### Przykładowa oferta:

```
Temat: Bot Telegram dla Twojej firmy

Cześć!

Widzę że prowadzisz [BIZNES]. Mam dla Ciebie rozwiązanie które:

✅ Odpowiada na pytania klientów 24/7
✅ Umawia wizyty/rezerwacje automatycznie
✅ Zbiera kontakty potencjalnych klientów
✅ Oszczędza Twój czas

Przykład działania: [LINK DO DEMO BOTA]

Cena: 400 zł (jednorazowo) + 50 zł/m hosting

Zainteresowany?
```

---

## 🎯 Gdzie szukać klientów

1. **Grupy Telegram biznesowe**
   - Napisz: "Tworzę boty Telegram dla firm"
   - Pokaż działającego bota

2. **Lokalne firmy**
   - Fryzjerzy, restauracje, sklepy
   - "Potrzebujesz bota do automatycznych odpowiedzi?"

3. **LinkedIn**
   - Właściciele firm, marketerzy
   - "Automatyzacja obsługi klienta przez Telegram"

4. **Facebook Groups**
   - Grupy dla przedsiębiorców
   - "Bot który odpowiada zamiast Ciebie"

---

## 🔧 Możliwe rozszerzenia (dodatkowa płatność)

### +200 zł: Integracja z Google Calendar
Bot automatycznie dodaje rezerwacje do kalendarza

### +150 zł: Powiadomienia push
Wysyłanie ofert/aktualności do wszystkich użytkowników

### +300 zł: Płatności
Przyjmowanie płatności przez bota (Stripe/PayU)

### +200 zł: Multi-język
Bot w 2-3 językach

### +250 zł: Integracja z CRM
Automatyczne dodawanie leadów do systemu

---

## 💡 Przykłady użycia

### Salon fryzjerski:
"Bot odpowiada na pytania o cennik, umawia wizyty, przypomina o terminie"

### Restauracja:
"Klient wysyła zamówienie przez bota, dostaje potwierdzenie i czas dostawy"

### Sklep:
"Bot informuje o dostępności produktu, cenach, promocjach"

### Szkoła online:
"Bot odpowiada na pytania o kursy, zapisuje na zajęcia, wysyła materiały"

---

## 🎓 Hosting bota (24/7)

### OPCJA 1: Lokalny komputer
- Darmowe
- Bot działa gdy komputer włączony
- Dla testów

### OPCJA 2: VPS (np. OVH, nazwa.pl)
- 20-40 zł/miesiąc
- Bot działa 24/7
- Profesjonalne

### OPCJA 3: Railway/Heroku
- Darmowe (z limitami)
- Łatwe wdrożenie
- Dla małych botów

**Możesz doliczyć 50 zł/m za hosting!**

---

## 📞 Wsparcie dla klientów

Po sprzedaniu oferuj:

- ✅ 7 dni wsparcia gratis
- ✅ Instrukcja krok po kroku
- ✅ Dalsze wsparcie: 50 zł/miesiąc
- ✅ Aktualizacje: według potrzeb

---

## 🚨 Najczęstsze pytania

**Q: Czy bot działa 24/7?**
A: Tak, gdy uruchomiony na serwerze

**Q: Czy mogę dodać więcej funkcji?**
A: Tak, kod jest łatwy do rozbudowy

**Q: Ile kosztuje hosting?**
A: 20-50 zł/miesiąc (możesz to doliczyć)

**Q: Czy trzeba znać programowanie?**
A: Nie, wystarczy zmienić teksty w FAQ

---

## 🎁 BONUS: Demo dla klienta

Przed sprzedażą:

1. Uruchom bota ze swoim TOKEN
2. Spersonalizuj dla branży klienta
3. Wyślij link do bota
4. Klient testuje → kupuje!

**Działający demo = 80% szans na sprzedaż!**

---

## 📊 Statystyki sprzedaży

- **Konwersja**: 30-50% (wysoka)
- **Czas wdrożenia**: 1-2h
- **Zarobek na godzinę**: 150-300 zł
- **Powtarzalne zlecenia**: Tak (hosting, updates)

---

**Powodzenia ze sprzedażą! 💰🤖**
