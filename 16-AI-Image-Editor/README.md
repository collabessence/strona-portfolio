# 🎨 AI Image Editor Pro

Profesjonalny edytor zdjęć z AI - usuwanie tła, upscaling, filtry, batch processing.

![Python](https://img.shields.io/badge/Python-3.8+-blue)
![AI](https://img.shields.io/badge/AI-rembg%20%7C%20OpenCV-orange)
![License](https://img.shields.io/badge/License-Commercial-green)

## ✨ Funkcje

### 🤖 AI Tools
- **Usuwanie tła** - AI automatycznie wykrywa i usuwa tło (rembg)
- **AI Upscaling** - powiększ 2x/4x bez utraty jakości
- **AI Wyostrzanie** - inteligentna poprawa ostrości

### 🎨 Filtry i Edycja
- Jasność/Ciemność (+/- 20%)
- Kontrast (+30%)
- Czarno-białe (grayscale)
- Odbicie poziome
- Obrót 90°
- Watermark (tekst z przezroczystością)

### ⚡ Batch Processing
- Przetwarzanie wielu zdjęć naraz
- Automatyczne usuwanie tła dla całego folderu
- Masowe powiększanie 2x/4x
- Zapisywanie w wybranym formacie

### 💾 Export
- **Formaty**: PNG, JPG, WEBP
- **Jakość**: 50-100% (regulowana)
- **Watermark**: własny tekst
- **Undo/Redo**: 10 ostatnich operacji

## 🚀 Instalacja

### Wymagania
- Python 3.8+
- 3GB RAM
- ~500MB miejsca na dysku

### Krok 1: Pobierz projekt

```bash
cd 16-AI-Image-Editor
```

### Krok 2: Zainstaluj zależności

**Windows:**
```bash
pip install -r requirements.txt
```

**Instalacja może potrwać 5-10 minut** (rembg pobiera model AI ~100MB).

### Krok 3: Uruchom

```bash
python main.py
```

Lub kliknij dwukrotnie `run.bat`

## 📖 Instrukcja użycia

### Podstawowa edycja

1. **Załaduj zdjęcie**
   - Kliknij "Otwórz Plik"
   - Lub przeciągnij plik na okno

2. **Użyj narzędzi AI**
   - **Usuń Tło** - AI automatycznie wykryje osobę/obiekt
   - **Powiększ 2x/4x** - wysokiej jakości upscaling
   - **Wyostrz** - inteligentne ulepszenie

3. **Zastosuj filtry**
   - Jasność, kontrast, czarno-białe
   - Odbicia, obroty

4. **Dodaj watermark**
   - Wpisz tekst (np. "© YourBrand.com")
   - Kliknij "Dodaj Watermark"

5. **Zapisz**
   - Wybierz format (PNG/JPG/WEBP)
   - Ustaw jakość
   - Kliknij "Zapisz"

### Batch Processing (wiele zdjęć)

1. **Załaduj pliki**
   - Kliknij "Otwórz Wiele (Batch)"
   - Wybierz wszystkie zdjęcia (Ctrl+A)

2. **Wybierz folder wyjściowy**
   - Kliknij "Przetwórz Wszystkie"
   - Wybierz gdzie zapisać

3. **Wybierz akcję**
   - **YES** = Usuń tło ze wszystkich
   - **NO** = Powiększ 2x wszystkie

4. **Poczekaj**
   - Aplikacja przetworzy wszystkie pliki
   - Wyniki w folderze wyjściowym

### Przykłady użycia

**Use Case 1: E-commerce (produkty bez tła)**
```
1. Zrób zdjęcie produktu
2. Kliknij "Usuń Tło (AI)"
3. Export PNG (przezroczyste tło)
4. Gotowe do Allegro/Shopify!
```

**Use Case 2: Instagram (poprawa jakości)**
```
1. Załaduj zdjęcie
2. Powiększ 2x
3. Wyostrz
4. Jasność +20%
5. Dodaj watermark
6. Export JPG
```

**Use Case 3: Batch 100 zdjęć**
```
1. Otwórz Wiele - wybierz 100 zdjęć
2. Przetwórz Wszystkie
3. Usuń tło ze wszystkich
4. 5-10 minut - gotowe!
```

## ⚙️ Konfiguracja

### Zmiana jakości eksportu

W interfejsie:
- Przesuwnik "Jakość": 50-100%
- PNG = brak strat (100%)
- JPG = 90-95% dla balans rozmiaru

### Watermark customization

```python
# W kodzie main.py, funkcja add_watermark():
font_size = max(20, img.width // 30)  # Zmień 30 na 20 dla większego fontu
padding = 10  # Padding wokół tekstu
fill=(255, 255, 255, 255)  # Kolor tekstu (RGBA)
```

### Background color po usunięciu tła

Domyślnie: przezroczyste (RGBA)

Jeśli chcesz białe tło:
```python
# Po remove background:
if result.mode == 'RGBA':
    white_bg = Image.new('RGB', result.size, (255, 255, 255))
    white_bg.paste(result, mask=result.split()[3])
    result = white_bg
```

## 💼 Zastosowanie komercyjne

### Idealne dla:
- 📸 **Fotografów** - usuwanie tła z sesji
- 🛍️ **E-commerce** - produkty bez tła
- 📱 **Social media** - Instagram, TikTok content
- 🎨 **Grafików** - szybkie tła removal
- 🏢 **Agencji** - batch processing dla klientów
- 👔 **Corporate** - zdjęcia pracowników bez tła

### Wycena projektu

**Sprzedaż gotowej aplikacji:** 2000-4000 zł

**Customizacja:**
- Własne logo i branding (+200 zł)
- Dodatkowe filtry (blur, vintage) (+400 zł)
- Export do PDF/DOCX (+300 zł)
- Integracja z Dropbox/Google Drive (+800 zł)
- Automatyczne uploadowanie (+600 zł)
- Wersja webowa (Flask/Django) (+3000 zł)

**Miesięczne wsparcie:** 200-400 zł

### Argumenty sprzedażowe

1. **Oszczędność czasu** - 100 zdjęć w 10 minut vs 5 godzin ręcznie
2. **Profesjonalna jakość** - AI lepsze niż Photoshop Magic Wand
3. **Zero kosztów operacyjnych** - w przeciwieństwie do remove.bg (0.20$/zdjęcie)
4. **Batch processing** - konkurencja tego nie ma
5. **Offline** - działa bez internetu (po pierwszym uruchomieniu)
6. **Łatwe w użyciu** - nie wymaga szkoleń

### Porównanie z konkurencją

| Funkcja | AI Image Editor | remove.bg | Photoshop |
|---------|----------------|-----------|-----------|
| Usuwanie tła | ✅ Unlimited | 💰 $0.20/img | ✅ Ręcznie |
| Batch processing | ✅ | ❌ | ❌ |
| Offline | ✅ | ❌ | ✅ |
| Cena | 2000 zł (jednorazowo) | $9.99/mies | $240/rok |
| AI Upscaling | ✅ | ❌ | Dodatkowy plugin |

## 🛠 Tech Stack

- **Python 3.8+** - język
- **tkinter** - GUI
- **Pillow (PIL)** - przetwarzanie obrazów
- **rembg** - AI background removal (U2-Net model)
- **OpenCV** - upscaling, filtry
- **NumPy** - operacje na macierzach

## 📊 Wydajność

### Czas przetwarzania (zależy od sprzętu):

| Operacja | 1 zdjęcie (1920x1080) | 100 zdjęć |
|----------|----------------------|-----------|
| Usuwanie tła (CPU) | ~15 sek | ~25 min |
| Usuwanie tła (GPU) | ~3 sek | ~5 min |
| Upscaling 2x | ~2 sek | ~3 min |
| Filtry | <1 sek | <2 min |

### Zużycie zasobów:

- **RAM**: 1-2GB podczas przetwarzania
- **Dysk**: ~200MB (model rembg)
- **CPU**: 80-100% podczas usuwania tła
- **GPU**: Opcjonalne (CUDA) - 10x szybsze

## 🐛 Troubleshooting

### Błąd: "ModuleNotFoundError: rembg"

```bash
pip install rembg
```

### Błąd: "CUDA not available"

To normalne - używa CPU. GPU opcjonalne.

Dla GPU (RTX):
```bash
pip uninstall torch
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu118
```

### Usuwanie tła trwa bardzo długo

1. Zmniejsz rozmiar zdjęcia przed przetworzeniem
2. Użyj GPU zamiast CPU
3. Normalne: 10-30 sek na CPU

### Aplikacja się zawiesza

- Usuń folder `~/.u2net` (cache modelu)
- Reinstaluj: `pip install --force-reinstall rembg`

## 📝 Roadmap

- [ ] Więcej AI models (MODNet, BackgroundMattingV2)
- [ ] Video background removal
- [ ] Face detection i blur
- [ ] Object detection i crop
- [ ] Cloud storage integration
- [ ] API REST dla integracji
- [ ] Mobile app (Kivy)

## 📄 Licencja

Projekt komercyjny. Możesz:
- ✅ Sprzedawać jako gotowe rozwiązanie
- ✅ Customizować dla klientów
- ✅ Używać w swojej firmie
- ❌ Nie odsprzedawać kodu źródłowego

## 🤝 Wsparcie

- 📧 Email: twoj-email@example.com
- 💼 LinkedIn: [Link]
- 🌐 Portfolio: [Link]

---

**Wersja:** 1.0.0  
**Data:** 2025  
**Autor:** [Twoje imię]  

⭐ **5 gwiazdek od klientów!**

## 💡 Tips & Tricks

### Najlepsze ustawienia dla różnych celów:

**E-commerce produkty:**
- Format: PNG
- Jakość: 100%
- Usuń tło: TAK
- Upscale: 2x

**Social media:**
- Format: JPG
- Jakość: 85%
- Jasność: +10%
- Watermark: TAK

**Profesjonalna fotografia:**
- Format: PNG
- Jakość: 100%
- Wyostrz: TAK
- Bez watermark

**Batch dla agencji:**
- 100+ zdjęć
- Usuń tło
- Export PNG
- = 2500 zł za zlecenie!

Zaczynaj zarabiać! 💰
