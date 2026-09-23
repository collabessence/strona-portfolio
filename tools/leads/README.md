# leads.py – firmy bez strony WWW

## Klucz API (raz, 10 minut)

1. https://console.cloud.google.com → nowy projekt (np. "leady").
2. APIs & Services → Library → **Places API (New)** → Enable.
3. Credentials → Create credentials → API key. W "API restrictions" zaznacz tylko Places API (New).
4. Billing trzeba podpiąć (karta), ale Google daje co miesiąc darmowy pakiet, który wystarcza na kilkaset zapytań Text Search. Ustaw w Billing → Budgets alert na 10 zł, żeby spać spokojnie.

```bash
export GOOGLE_PLACES_API_KEY="AIza..."
```

## Użycie

```bash
python3 tools/leads/leads.py --typ fryzjer --gdzie "Mokotów, Warszawa"
python3 tools/leads/leads.py --typ mechanik --gdzie "Piaseczno" --strony 3
python3 tools/leads/leads.py --typ dentysta --gdzie "Ursynów, Warszawa" --wszystkie
```

Typy: `fryzjer`, `mechanik`, `restauracja`, `dentysta`, `fitness`, `kosmetyczka`, `fizjoterapeuta`. Każda strona wyników to 20 firm i jedno zapytanie do API.

Domyślnie w CSV zostają tylko firmy **bez strony** albo z linkiem tylko do Facebooka/Instagrama/Booksy (`tylko_social = TAK`). `--wszystkie` zapisuje wszystkie.

## Kolumny

`typ, nazwa, telefon, adres, ocena, opinie, strona, ma_strone, tylko_social, maps`

Najlepsi kandydaci: dużo opinii (firma działa i ma klientów), brak strony. Firma z 200 opiniami i bez strony traci klientów codziennie i zwykle o tym wie.

## Co dalej

Otwórz CSV w arkuszu, dodaj kolumny z `szablony/crm.csv` (status, data kontaktu, follow-up) i pracuj po 10 firm dziennie. Demo dla wiersza N: `python3 tools/mockup/mockup.py --csv <plik> --wiersz N`.
