# Narzędzia do pozyskiwania klientów

Trzy rzeczy, które zamieniają "szukam klientów" w powtarzalny proces:

| Narzędzie | Co robi | Czas |
|-----------|---------|------|
| `leads/leads.py` | Lista firm z okolicy bez strony WWW (Google Places API) → CSV | 1 min na dzielnicę |
| `mockup/mockup.py` | Gotowe demo strony dla konkretnej firmy z jej danymi | 1 min na firmę |
| `szablony/` | Umowa, wycena, brief, wiadomości, prośba o opinię, arkusz CRM | kopiuj-wklej |
| `screenshots.js` | Odświeża miniatury dem na stronie głównej | 30 s |

Plan działania tydzień po tygodniu: [ROADMAP.md](ROADMAP.md).

## Przepływ dnia (30–45 min)

```bash
# 1. Lista firm bez strony w jednej dzielnicy
export GOOGLE_PLACES_API_KEY=...          # raz, patrz leads/README.md
python3 tools/leads/leads.py --typ fryzjer --gdzie "Mokotów, Warszawa"

# 2. Demo dla firmy z wiersza 1 (nazwa, telefon, adres wchodzą same)
python3 tools/mockup/mockup.py --csv tools/leads/out/fryzjer-mokotow-warszawa.csv --wiersz 1

# 3. Publikacja: commit + push do master, GitHub Actions wdraża w minutę
git add demo/ && git commit -m "Demo: Salon Anna" && git push
# -> https://collabessence.github.io/strona-portfolio/demo/salon-anna/

# 4. Kontakt: telefon / wizyta / Messenger z linkiem (szablony/wiadomosci.md)
# 5. Wpis do CRM (szablony/crm.csv) z datą follow-upu
```

## Uwagi

- **Dane firm w `tools/leads/out/` są w `.gitignore`.** Nie commituj list z telefonami.
- **Dema w `demo/` są publiczne** (tak muszą być, żeby wysłać link). Mają `noindex`, więc Google ich nie pokaże. Po zakończeniu rozmowy z firmą usuń folder, żeby repo nie rosło.
- Google Places API: scraping Map przez HTML łamie regulamin Google. API ma darmowy pakiet; skrypt robi 20 wyników na zapytanie, więc 100 firm to 5 zapytań.
- Pasek "Propozycja strony dla…" w demie jest dodawany automatycznie. Gdy firma kupi stronę, budujesz ją od nowa z szablonu, bez paska.
