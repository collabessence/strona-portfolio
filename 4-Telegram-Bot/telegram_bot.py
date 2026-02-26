"""
Telegram Bot dla Firm - Auto-responder z FAQ
Wersja: 1.0
Wartość komercyjna: 300-600 zł

INSTALACJA:
1. pip install python-telegram-bot
2. Utwórz bota przez @BotFather na Telegramie
3. Wklej TOKEN poniżej
4. Uruchom: python telegram_bot.py
"""

from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, MessageHandler, CallbackQueryHandler, ContextTypes, filters
import datetime
import json
import os

# ⚠️ ZAMIEŃ NA SWÓJ TOKEN Z @BotFather
BOT_TOKEN = "TUTAJ_WKLEJ_TOKEN_BOTA"

# Baza danych kontaktów (prosty JSON)
CONTACTS_FILE = "contacts.json"

# FAQ - można łatwo edytować
FAQ = {
    "godziny": "🕐 Godziny otwarcia:\nPn-Pt: 9:00 - 18:00\nSobota: 10:00 - 14:00\nNiedziela: Zamknięte",
    
    "adres": "📍 Adres:\nul. Przykładowa 123\n00-000 Warszawa\n\nDojazd:\n🚇 Metro: Centrum (5 min pieszo)\n🚌 Autobus: 180, 195 (przystanek obok)",
    
    "cennik": "💰 Cennik:\n\n📦 Usługa A - 200 zł\n📦 Usługa B - 350 zł\n📦 Usługa C - 500 zł\n📦 Pakiet kompletny - 900 zł\n\n💡 Pierwsza konsultacja GRATIS!",
    
    "kontakt": "📞 Kontakt:\n\n☎️ Telefon: +48 123 456 789\n📧 Email: kontakt@firma.pl\n🌐 Strona: www.firma.pl\n\n💬 Lub napisz tutaj - odpowiem w ciągu 24h!",
    
    "rezerwacja": "📅 Rezerwacja/Umówienie:\n\n1️⃣ Napisz: /rezerwacja\n2️⃣ Podaj datę i godzinę\n3️⃣ Potwierdzimy w ciągu 1h\n\nLub zadzwoń: +48 123 456 789",
    
    "oferta": "🎯 Nasza oferta:\n\n✅ Usługa A - dla początkujących\n✅ Usługa B - standard\n✅ Usługa C - premium\n✅ Konsultacje indywidualne\n✅ Wsparcie 24/7\n\n💡 Zapytaj o szczegóły!"
}


class TelegramBot:
    def __init__(self):
        self.contacts = self.load_contacts()
    
    def load_contacts(self):
        """Ładuje zapisane kontakty"""
        if os.path.exists(CONTACTS_FILE):
            with open(CONTACTS_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        return {}
    
    def save_contacts(self):
        """Zapisuje kontakty do pliku"""
        with open(CONTACTS_FILE, 'w', encoding='utf-8') as f:
            json.dump(self.contacts, f, ensure_ascii=False, indent=2)
    
    def save_contact(self, user_id, username, first_name, message):
        """Zapisuje kontakt klienta"""
        contact_data = {
            'username': username,
            'first_name': first_name,
            'last_message': message,
            'timestamp': datetime.datetime.now().isoformat(),
            'message_count': self.contacts.get(str(user_id), {}).get('message_count', 0) + 1
        }
        self.contacts[str(user_id)] = contact_data
        self.save_contacts()
    
    async def start_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Komenda /start - powitanie"""
        user = update.effective_user
        
        welcome_message = f"""
👋 Witaj {user.first_name}!

Jestem botem firmy **[NAZWA FIRMY]** i pomogę Ci w:

🔹 Odpowiedzi na najczęstsze pytania
🔹 Informacjach o ofercie
🔹 Umówieniu spotkania
🔹 Kontakcie z obsługą

🎯 Wybierz z menu poniżej lub napisz pytanie!
"""
        
        # Klawiatura z przyciskami
        keyboard = [
            [InlineKeyboardButton("📋 Nasza Oferta", callback_data='oferta')],
            [InlineKeyboardButton("💰 Cennik", callback_data='cennik')],
            [InlineKeyboardButton("🕐 Godziny otwarcia", callback_data='godziny')],
            [InlineKeyboardButton("📍 Adres i dojazd", callback_data='adres')],
            [InlineKeyboardButton("📞 Kontakt", callback_data='kontakt')],
            [InlineKeyboardButton("📅 Umów spotkanie", callback_data='rezerwacja')]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)
        
        await update.message.reply_text(welcome_message, reply_markup=reply_markup, parse_mode='Markdown')
    
    async def help_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Komenda /help - pomoc"""
        help_text = """
📚 **Dostępne komendy:**

/start - Powitanie i menu główne
/help - Ta wiadomość
/oferta - Nasza oferta
/cennik - Cennik usług
/kontakt - Dane kontaktowe
/rezerwacja - Umów spotkanie
/status - Sprawdź status zapytania

💬 **Możesz też po prostu napisać pytanie!**

Odpowiem automatycznie lub przekażę do obsługi.
"""
        await update.message.reply_text(help_text, parse_mode='Markdown')
    
    async def button_handler(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Obsługa przycisków"""
        query = update.callback_query
        await query.answer()
        
        # Pobierz odpowiedź z FAQ
        response = FAQ.get(query.data, "Przepraszam, nie znalazłem tej informacji.")
        
        # Dodaj przycisk powrotu
        keyboard = [[InlineKeyboardButton("⬅️ Powrót do menu", callback_data='menu')]]
        reply_markup = InlineKeyboardMarkup(keyboard)
        
        await query.edit_message_text(text=response, reply_markup=reply_markup)
    
    async def menu_handler(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Powrót do menu głównego"""
        query = update.callback_query
        await query.answer()
        
        keyboard = [
            [InlineKeyboardButton("📋 Nasza Oferta", callback_data='oferta')],
            [InlineKeyboardButton("💰 Cennik", callback_data='cennik')],
            [InlineKeyboardButton("🕐 Godziny otwarcia", callback_data='godziny')],
            [InlineKeyboardButton("📍 Adres i dojazd", callback_data='adres')],
            [InlineKeyboardButton("📞 Kontakt", callback_data='kontakt')],
            [InlineKeyboardButton("📅 Umów spotkanie", callback_data='rezerwacja')]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)
        
        await query.edit_message_text(
            "🎯 Menu główne - wybierz opcję:",
            reply_markup=reply_markup
        )
    
    async def message_handler(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Obsługa zwykłych wiadomości"""
        user = update.effective_user
        message_text = update.message.text.lower()
        
        # Zapisz kontakt
        self.save_contact(
            user.id,
            user.username,
            user.first_name,
            update.message.text
        )
        
        # Inteligentne odpowiedzi na podstawie słów kluczowych
        if any(word in message_text for word in ['godziny', 'otwarcie', 'kiedy', 'otwarte']):
            response = FAQ['godziny']
        
        elif any(word in message_text for word in ['adres', 'gdzie', 'dojazd', 'lokalizacja']):
            response = FAQ['adres']
        
        elif any(word in message_text for word in ['cena', 'cennik', 'koszt', 'ile', 'płatność']):
            response = FAQ['cennik']
        
        elif any(word in message_text for word in ['kontakt', 'telefon', 'email', 'napisać']):
            response = FAQ['kontakt']
        
        elif any(word in message_text for word in ['rezerwacja', 'umówić', 'spotkanie', 'wizyta']):
            response = FAQ['rezerwacja']
        
        elif any(word in message_text for word in ['oferta', 'usługi', 'co oferujecie', 'czym się zajmujecie']):
            response = FAQ['oferta']
        
        else:
            # Domyślna odpowiedź
            response = f"""
🤔 Dziękuję za wiadomość, {user.first_name}!

Twoje pytanie: "{update.message.text}"

📝 Zapisałem Twoje zapytanie i przekażę je do obsługi.
Odpowiemy w ciągu 24h.

💡 W międzyczasie możesz:
• Sprawdzić /oferta
• Zobaczyć /cennik
• Napisać /kontakt

Lub wybierz z menu: /start
"""
        
        await update.message.reply_text(response)
        
        # Logowanie do konsoli dla właściciela bota
        print(f"\n📨 NOWA WIADOMOŚĆ:")
        print(f"👤 Od: {user.first_name} (@{user.username})")
        print(f"💬 Treść: {update.message.text}")
        print(f"🕐 Czas: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("-" * 50)
    
    async def oferta_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Komenda /oferta"""
        await update.message.reply_text(FAQ['oferta'])
    
    async def cennik_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Komenda /cennik"""
        await update.message.reply_text(FAQ['cennik'])
    
    async def kontakt_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Komenda /kontakt"""
        await update.message.reply_text(FAQ['kontakt'])
    
    async def rezerwacja_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Komenda /rezerwacja"""
        user = update.effective_user
        
        response = f"""
📅 **Rezerwacja/Umówienie - {user.first_name}**

Aby umówić spotkanie, podaj proszę:

1️⃣ Preferowaną datę (np. 15.12.2024)
2️⃣ Preferowaną godzinę (np. 14:00)
3️⃣ Rodzaj usługi (A/B/C)
4️⃣ Numer telefonu do kontaktu

📝 Przykład:
"Chciałbym umówić się na 15.12.2024 o 14:00, usługa B, tel: 123456789"

💬 Napisz teraz lub zadzwoń: +48 123 456 789
"""
        
        await update.message.reply_text(response, parse_mode='Markdown')
    
    async def status_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Status zapytania użytkownika"""
        user = update.effective_user
        contact = self.contacts.get(str(user.id))
        
        if contact:
            last_contact = datetime.datetime.fromisoformat(contact['timestamp'])
            time_diff = datetime.datetime.now() - last_contact
            hours = int(time_diff.total_seconds() / 3600)
            
            response = f"""
📊 **Twój Status**

👤 Imię: {contact['first_name']}
📨 Liczba wiadomości: {contact['message_count']}
🕐 Ostatni kontakt: {hours}h temu
✅ Status: Oczekuje na odpowiedź

💬 Odpowiemy w ciągu 24h od pierwszego kontaktu.
Pilne sprawy: +48 123 456 789
"""
        else:
            response = "❌ Nie znalazłem Twojego zapytania. Napisz /start aby rozpocząć."
        
        await update.message.reply_text(response, parse_mode='Markdown')
    
    def run(self):
        """Uruchomienie bota"""
        print("🤖 Uruchamianie bota...")
        print("⚠️  Pamiętaj: Ustaw TOKEN w linii 18!")
        print("-" * 50)
        
        # Tworzenie aplikacji
        app = Application.builder().token(BOT_TOKEN).build()
        
        # Dodanie handlerów
        app.add_handler(CommandHandler("start", self.start_command))
        app.add_handler(CommandHandler("help", self.help_command))
        app.add_handler(CommandHandler("oferta", self.oferta_command))
        app.add_handler(CommandHandler("cennik", self.cennik_command))
        app.add_handler(CommandHandler("kontakt", self.kontakt_command))
        app.add_handler(CommandHandler("rezerwacja", self.rezerwacja_command))
        app.add_handler(CommandHandler("status", self.status_command))
        
        # Obsługa przycisków
        app.add_handler(CallbackQueryHandler(self.menu_handler, pattern='^menu$'))
        app.add_handler(CallbackQueryHandler(self.button_handler))
        
        # Obsługa zwykłych wiadomości
        app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, self.message_handler))
        
        print("✅ Bot uruchomiony!")
        print("📱 Testuj na Telegramie")
        print("🛑 Ctrl+C aby zatrzymać")
        print("-" * 50)
        
        # Start polling
        app.run_polling(allowed_updates=Update.ALL_TYPES)


def main():
    """Główna funkcja"""
    bot = TelegramBot()
    bot.run()


if __name__ == "__main__":
    main()
