# leads.py – firmy bez strony WWW (OpenStreetMap, za darmo)

Źródło: OpenStreetMap przez Overpass API. Bez klucza, bez karty, bez limitu płatnego. Dane na licencji ODbL, do takiego użytku w porządku.

## Użycie

```bash
python3 tools/leads/leads.py --typ fryzjer --gdzie "Mokotów"
python3 tools/leads/leads.py --typ mechanik --gdzie "Piaseczno"
python3 tools/leads/leads.py --typ dentysta --gdzie "Chełm" --wszystkie
```

Typy: `fryzjer`, `kosmetyczka`, `mechanik`, `restauracja`, `dentysta`, `fitness`, `fizjoterapeuta`, `weterynarz`, `kwiaciarnia`.

`--gdzie` to nazwa obszaru administracyjnego dokładnie tak, jak w OSM: dzielnica Warszawy („Mokotów”, „Wola”, „Ursynów”), miasto („Chełm”, „Piaseczno”) albo gmina. Jeśli wynik to 0, najpierw sprawdź pisownię na openstreetmap.org.

## Co dostajesz

CSV w `tools/leads/out/` (folder w `.gitignore`), kolumny:
`typ, nazwa, telefon, adres, strona, ma_strone, tylko_social, godziny, osm, sprawdz`

Domyślnie tylko firmy bez tagu `website` (albo z samym Facebookiem/Instagramem), firmy z telefonem na górze.

## Ograniczenie, o którym musisz wiedzieć

OSM nie jest kompletne. Brak tagu `website` oznacza „nikt nie wpisał”, nie „firma nie ma strony”. Przed kontaktem kliknij link z kolumny `sprawdz` (wyszukiwarka z nazwą firmy): 10 sekund i wiesz. W praktyce ok. połowa kandydatów z OSM faktycznie nie ma strony; to i tak lista, której nie musisz układać ręcznie.

Brak telefonu w OSM? Jest na Google Maps albo na drzwiach lokalu; wpisz go w CRM (`pipeline.py`) przed kontaktem.

## Dalej

Cały przepływ (lista → demo → wiadomość → follow-up → wycena → umowa) obsługuje `tools/pipeline/pipeline.py`, który wywołuje ten skrypt sam: `python3 tools/pipeline/pipeline.py szukaj --typ fryzjer --gdzie "Mokotów"`.
