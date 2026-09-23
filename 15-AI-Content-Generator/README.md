# 🤖 AI Content Generator - Lokalny generator tekstu

Profesjonalna aplikacja desktopowa do generowania treści AI **bez API** i **bez kosztów**. Używa lokalnych modeli Hugging Face (GPT-2).

![Python](https://img.shields.io/badge/Python-3.8+-blue)
![AI](https://img.shields.io/badge/AI-Hugging%20Face-orange)
![License](https://img.shields.io/badge/License-MIT-green)

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

## 🛠 Tech Stack

- **Python 3.8+** - język programowania
- **tkinter** - GUI framework (built-in w Pythonie)
- **Hugging Face Transformers** - modele AI
- **PyTorch** - backend dla modeli
- **GPT-2 / DistilGPT2** - model językowy

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

## 🌟 Podziękowania

- Hugging Face za modele open-source
- OpenAI za inspirację GPT-2
- Społeczność Python za wsparcie

---

**Wersja:** 1.0.0  
**Data wydania:** 2025  
**Autor:** [Twoje imię]

⭐ **Jeśli projekt Ci się podoba, zostaw gwiazdkę!**
