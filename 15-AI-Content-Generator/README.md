# 🤖 AI Content Generator - Lokalny generator tekstu

Profesjonalna aplikacja desktopowa do generowania treści AI **bez API** i **bez kosztów**. Używa lokalnych modeli Hugging Face (GPT-2).

![Python](https://img.shields.io/badge/Python-3.8+-blue)
![AI](https://img.shields.io/badge/AI-Hugging%20Face-orange)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Funkcje

### Generowanie treści
- 📱 **Posty social media** (Facebook, LinkedIn, Instagram)
- 🛍️ **Opisy produktów** dla e-commerce
- 📰 **Artykuły blogowe** z wprowadzeniem i podsumowaniem
- ✉️ **Emaile marketingowe** z call-to-action
- 🎯 **Meta descriptions SEO** (optymalizowane pod Google)
- 🎨 **Własne prompty** - pełna kontrola

### Parametry AI
- **Długość tekstu**: 50-500 słów
- **Kreatywność (temperatura)**: 0.1-1.5
- **Ton wypowiedzi**: profesjonalny, przyjazny, entuzjastyczny, formalny, humorystyczny
- **Typ treści**: 8 gotowych szablonów

### Funkcje dodatkowe
- 💾 **Export**: TXT, DOCX
- 📋 **Kopiuj do schowka** jednym kliknięciem
- 📜 **Historia generacji** z timestampami
- 🎨 **Nowoczesne GUI** (dark mode)
- 🔒 **100% lokalnie** - bez wysyłania danych do internetu
- ⚡ **Bez kosztów API** - darmowe użytkowanie

## 🚀 Instalacja

### Wymagania
- Python 3.8 lub nowszy
- 2GB wolnego miejsca na dysku
- Połączenie z internetem (tylko przy pierwszym uruchomieniu)

### Krok 1: Sklonuj / pobierz projekt

```bash
cd 15-AI-Content-Generator
```

### Krok 2: Zainstaluj zależności

**Windows:**
```bash
pip install -r requirements.txt
```

**macOS/Linux:**
```bash
pip3 install -r requirements.txt
```

**Instalacja może potrwać 5-10 minut** (pobieranie PyTorch ~1GB).

### Krok 3: Uruchom aplikację

```bash
python main.py
```

### Krok 4: Załaduj model AI

1. Kliknij przycisk **"Załaduj Model"** w aplikacji
2. Poczekaj 1-2 minuty (pierwsze uruchomienie pobiera model ~500MB)
3. Kolejne uruchomienia są natychmiastowe (model już pobrany)

## 📖 Jak używać

### Podstawowe użycie

1. **Wybierz typ treści**
   - Z listy rozwijanej wybierz np. "Post na Facebooka"

2. **Wpisz temat**
   - Np. "Promocja 20% na wszystkie produkty w Black Friday"

3. **Ustaw parametry**
   - Długość: 100 słów
   - Kreatywność: 0.7 (średnia)
   - Ton: profesjonalny

4. **Generuj**
   - Kliknij "Generuj Tekst"
   - Poczekaj 5-30 sekund

5. **Użyj wyniku**
   - Skopiuj do schowka
   - Zapisz do pliku
   - Edytuj i generuj ponownie

### Przykładowe wyniki

**Prompt:** "Post na LinkedIn o nowym kursie Python"
**Ton:** Profesjonalny
**Wynik:**
> 🎓 Excited to announce our new Python programming course! Whether you're a beginner or looking to level up your skills, this comprehensive program covers everything from basics to advanced concepts. Join hundreds of successful graduates who transformed their careers. Limited spots available - enroll today! 💻 #Python #Programming #CareerDevelopment

## ⚙️ Konfiguracja

### Zmiana modelu AI

W pliku `main.py`, linia 286:

```python
model_name = "distilgpt2"  # Lekki model (500MB)
# model_name = "gpt2"      # Średni model (1GB)
# model_name = "gpt2-medium"  # Duży model (2GB)
```

**Większy model = lepsza jakość, ale wolniejsze generowanie**

### Parametry generowania

```python
result = self.generator(prompt,
                       max_length=150,        # Maksymalna długość
                       temperature=0.7,       # Kreatywność (0.1-1.5)
                       top_p=0.9,            # Nucleus sampling
                       num_return_sequences=1)  # Liczba wersji
```

### Ton wypowiedzi

Dodaj własne tony w `create_generator_tab()`:

```python
tones = [
    ('Profesjonalny', 'profesjonalny'),
    ('Twój nowy ton', 'nazwa_tonu'),
]
```

## 🎯 Zastosowanie komercyjne

### Idealne dla:
- 📱 **Social media managerów** - szybkie tworzenie postów
- ✍️ **Copywriterów** - inspiracja i wstępne drafty
- 🛍️ **E-commerce** - opisy produktów na skalę
- 📰 **Blogerów** - pomoc w pisaniu artykułów
- 💼 **Agencji marketingowych** - content dla klientów
- 🎓 **Edukacie** - materiały dydaktyczne

### Wycena projektu

**Sprzedaż gotowej aplikacji:** 2000-3500 zł

**Customizacja:**
- Zmiana modelu AI (+500 zł)
- Dodanie własnych szablonów (+300 zł)
- Export do DOCX/PDF (+400 zł)
- Integracja z CMS (WordPress) (+1500 zł)
- Tłumaczenia wielojęzyczne (+800 zł)
- Własny branding (+200 zł)

**Miesięczne wsparcie:** 200-400 zł

### Argumenty sprzedażowe

1. **Zero kosztów operacyjnych** - w przeciwieństwie do OpenAI API
2. **Prywatność danych** - wszystko lokalne, nie opuszcza komputera
3. **Nieograniczone użycie** - generuj ile chcesz
4. **Offline capable** - działa bez internetu (po pierwszym uruchomieniu)
5. **Szybkie** - 5-30 sekund na generację
6. **Customizowalne** - możesz dodać swoje szablony

## 🛠 Tech Stack

- **Python 3.8+** - język programowania
- **tkinter** - GUI framework (built-in w Pythonie)
- **Hugging Face Transformers** - modele AI
- **PyTorch** - backend dla modeli
- **GPT-2 / DistilGPT2** - model językowy

## 📊 Wydajność

### Czas generowania (zależy od sprzętu):

| Sprzęt | 100 słów | 500 słów |
|--------|----------|----------|
| CPU (i5) | ~15 sek | ~60 sek |
| CPU (i7) | ~10 sek | ~40 sek |
| GPU (GTX 1660) | ~3 sek | ~12 sek |
| GPU (RTX 3070) | ~1 sek | ~4 sek |

### Zużycie zasobów:

- **RAM**: 1-2GB podczas generowania
- **Dysk**: 500MB-2GB (zależy od modelu)
- **CPU**: 50-100% podczas generowania

## 🐛 Rozwiązywanie problemów

### Błąd: "No module named 'transformers'"

```bash
pip install transformers torch
```

### Błąd: "CUDA out of memory" (GPU)

Zmniejsz `max_length` lub użyj CPU:

```python
device = "cpu"  # Zamiast "cuda"
```

### Generowanie trwa bardzo długo

1. Zmień model na `distilgpt2` (lżejszy)
2. Zmniejsz długość tekstu (max_length)
3. Sprawdź czy inne programy nie obciążają CPU

### Model pobiera się bardzo wolno

- Normalne przy pierwszym uruchomieniu (500MB-2GB)
- Kolejne uruchomienia używają cache lokalnego
- Model zapisany w: `~/.cache/huggingface/`

## 📝 TODO / Roadmap

- [ ] Export do DOCX z formatowaniem
- [ ] Export do PDF
- [ ] Batch processing (wiele tekstów naraz)
- [ ] Integracja z Google Docs API
- [ ] Tłumaczenia (wielojęzyczność)
- [ ] Voice input (mówienie zamiast pisania)
- [ ] Wersja webowa (Flask)
- [ ] Własne fine-tuned modele

## 📄 Licencja

Ten projekt jest częścią portfolio i może być:
- ✅ Używany komercyjnie dla klientów
- ✅ Modyfikowany i dostosowywany
- ✅ Sprzedawany jako gotowe rozwiązanie
- ❌ Nie można odsprzedawać jako szablon/kod źródłowy

## 🤝 Wsparcie

Masz pytania? Problemy z instalacją?

- 📧 Email: twoj-email@example.com
- 💼 LinkedIn: [Twój profil]
- 🌐 Portfolio: [Link]

## 🌟 Podziękowania

- Hugging Face za modele open-source
- OpenAI za inspirację GPT-2
- Społeczność Python za wsparcie

---

**Wersja:** 1.0.0  
**Data wydania:** 2025  
**Autor:** [Twoje imię]

⭐ **Jeśli projekt Ci się podoba, zostaw gwiazdkę!**
