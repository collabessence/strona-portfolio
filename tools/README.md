# Narzędzia do pozyskiwania klientów

Trzy rzeczy, które zamieniają "szukam klientów" w powtarzalny proces:

| Narzędzie | Co robi | Czas |
|-----------|---------|------|
| `pipeline/pipeline.py` | **Jedno polecenie na cały proces**: lista → demo → wiadomość → follow-up → wycena → umowa, z lokalną bazą (SQLite) | 30 min dziennie |
| `leads/leads.py` | Lista firm z okolicy bez strony WWW (OpenStreetMap, darmowe, bez klucza) → CSV | 1 min na dzielnicę |
| `mockup/mockup.py` | Gotowe demo strony dla konkretnej firmy z jej danymi | 1 min na firmę |
| `szablony/` | Umowa, wycena, brief, wiadomości, prośba o opinię, arkusz CRM | kopiuj-wklej |
| `screenshots.js` | Odświeża miniatury dem na stronie głównej | 30 s |

Plan działania tydzień po tygodniu: [ROADMAP.md](ROADMAP.md).

## Przepływ dnia (30–45 min, wszystko przez `pipeline.py`)

```bash
P="python3 tools/pipeline/pipeline.py"

$P szukaj --typ fryzjer --gdzie "Mokotów"   # firmy bez strony z OSM -> baza (raz na dzielnicę)
$P dzisiaj                                  # follow-upy na dziś, dema do wysłania, nowe firmy
$P demo 12                                  # demo dla firmy #12 (brak telefonu? $P edytuj 12 --telefon ...)
$P publikuj                                 # git push -> linki działają po ~1 min
$P wiadomosc 12                             # gotowy tekst z linkiem; wyślij Messenger/WhatsApp/telefon
$P status 12 kontakt --notatka "Messenger"  # follow-up +3 dni ustawia się sam
$P wiadomosc 12 --rodzaj followup           # gdy dzisiaj pokaże follow-up
$P wycena 12 --pakiet wizytowka --cena 800  # mail z wyceną (status: wycena)
$P umowa 12 --cena 800                      # umowa z szablonu (status: umowa)
$P status 12 klient                         # po zaliczce
$P raport                                   # lejek i konwersje
```

Statusy: `nowy → demo_gotowe → kontakt → rozmowa → wycena → umowa → klient`, boczny `zimny`. Zmiana statusu ustawia follow-up automatycznie (kontakt +3 dni, rozmowa +2, wycena +3, umowa +7), a `dzisiaj` pokazuje, co jest do zrobienia. `export` zrzuca bazę do CSV, jeśli wolisz arkusz.

Czego pipeline **nie** robi: nie wysyła wiadomości. Wysyłasz sam (telefon, Messenger, WhatsApp, wizyta). Masowa wysyłka e-maili do firm bez zgody jest w Polsce ryzykowna prawnie, a wiadomość wysłana ręcznie z linkiem do dema i tak ma większą skuteczność.

## Uwagi

- **Baza i listy firm (`tools/pipeline/out/`, `tools/leads/out/`) są w `.gitignore`.** Telefony nie trafiają do publicznego repo.
- **Dema w `demo/` są publiczne** (tak muszą być, żeby wysłać link). Mają `noindex`. Po zakończeniu rozmowy z firmą usuń folder.
- **OSM nie jest kompletne.** Brak tagu `website` nie zawsze znaczy brak strony. `wiadomosc` pokazuje link `sprawdz` do wyszukiwarki: 10 sekund przed wysyłką.
- Pasek "Propozycja strony dla…" w demie jest dodawany automatycznie. Gdy firma kupi, budujesz stronę z szablonu od nowa, bez paska.
