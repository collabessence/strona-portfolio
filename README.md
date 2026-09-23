# Strona portfolio – Adam, web developer

Strona oferty tworzenia stron internetowych dla małych firm (wizytówki, landing page, strony firmowe) plus projekty demonstracyjne.

🌐 **Live:** https://collabessence.github.io/strona-portfolio/

## Struktura

| Ścieżka | Co to jest |
|---------|------------|
| `index.html`, `style.css`, `script.js` | Strona główna (czysty HTML/CSS/JS, bez frameworka) |
| `assets/` | Zrzuty ekranu projektów demo pokazywane na stronie głównej |
| `tools/screenshots.js` | Skrypt (Node + Playwright) generujący te zrzuty |
| `2-Strony-Wizytowki/`, `10-StronaHR/`, `11-Dentysta-Klinika/`, `12-Fitness-Silownia/` | Strony demo dla fikcyjnych firm |
| `5-…`, `6-…`, `8-…`, `9-…`, `13-…`, `14-…` | Narzędzia webowe (kalkulatory, generatory, TODO, rezerwacje, pogoda) |
| `1-…`, `3-…`, `4-…`, `15-…`, `16-…` | Skrypty Python (scraper, Excel, bot Telegram, narzędzia AI) |
| `7-Portfolio-Strona/` | Starszy szablon strony portfolio do personalizacji |

Wszystkie projekty w podfolderach to koncepcje dla fikcyjnych firm, nie realizacje dla klientów.

## Uruchomienie lokalne

```bash
python3 -m http.server 8000
# http://localhost:8000
```

Odświeżenie zrzutów ekranu w sekcji „Projekty”:

```bash
npm i -D playwright && npx playwright install chromium
node tools/screenshots.js
```

## Kontakt

- Email: collabessence@gmail.com
- Telefon: +48 727 705 045
