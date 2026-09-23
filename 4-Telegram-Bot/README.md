# 🤖 Telegram Bot dla Firm

**Auto-responder z FAQ i zbieraniem kontaktów**

## ✨ Funkcje

- ✅ Automatyczne odpowiedzi na FAQ
- ✅ Inteligentne rozpoznawanie pytań
- ✅ Zbieranie kontaktów klientów
- ✅ System rezerwacji/umówień
- ✅ Menu z przyciskami
- ✅ Logowanie wszystkich wiadomości

---

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

### Salon fryzjerski:
"Bot odpowiada na pytania o cennik, umawia wizyty, przypomina o terminie"

### Restauracja:
"Klient wysyła zamówienie przez bota, dostaje potwierdzenie i czas dostawy"

### Sklep:
"Bot informuje o dostępności produktu, cenach, promocjach"

### Szkoła online:
"Bot odpowiada na pytania o kursy, zapisuje na zajęcia, wysyła materiały"

---

### OPCJA 1: Lokalny komputer
- Darmowe
- Bot działa gdy komputer włączony
- Dla testów

### OPCJA 2: VPS (np. OVH, nazwa.pl)
- Bot działa 24/7
- Profesjonalne

### OPCJA 3: Railway/Heroku
- Darmowe (z limitami)
- Łatwe wdrożenie
- Dla małych botów

---

## 🚨 Najczęstsze pytania

**Q: Czy bot działa 24/7?**
A: Tak, gdy uruchomiony na serwerze

**Q: Czy mogę dodać więcej funkcji?**
A: Tak, kod jest łatwy do rozbudowy

**Q: Ile kosztuje hosting?**

**Q: Czy trzeba znać programowanie?**
A: Nie, wystarczy zmienić teksty w FAQ
