# Roadmap: pierwszy klient w 2 tygodnie, kilku w miesiąc

Zasada: pierwszego klienta zdobywasz przez ludzi, nie przez automat. Automatyzacja (narzędzia w tym folderze) opłaca się od drugiego klienta, bo wtedy powtarzasz te same czynności.

Lejek, na który realnie możesz liczyć: **100 kontaktów → 10–15 rozmów → 2–4 klientów.**

## Tydzień 1: fundament + pierwszy klient

### Dzień 1: formalności minimum (2–3 h)
- [ ] Forma prawna: sprawdź aktualny limit działalności nierejestrowanej (75% minimalnego wynagrodzenia miesięcznie). 2–3 strony miesięcznie zwykle się mieszczą. Powyżej: JDG.
- [ ] Umowa: `szablony/umowa.md` uzupełniona Twoimi danymi, zapisana jako PDF.
- [ ] Brief: pytania z `szablony/brief.md` wklejone do Tally / Google Forms, link zapisany.
- [ ] CRM: `szablony/crm.csv` zaimportowany do Google Sheets + `crm-apps-script.js` z codziennym przypomnieniem.
- [ ] Profile z tym samym opisem i linkiem do strony: LinkedIn, Facebook, Useme, Oferteo, Fixly.
- [ ] Klucz Google Places API (`leads/README.md`).

### Dzień 1–2: oferta "pierwszy klient"
- [ ] Dwie strony wizytówki po 400 zł (zamiast 800) w zamian za: opinię z imieniem i nazwą firmy, zgodę na portfolio, dwa polecenia. Limit dwie, potem cennik normalny.

### Dzień 2–3: ciepła sieć (najczęstsze źródło pierwszego klienta)
- [ ] Lista 30 osób: znajomi, rodzina, byli współpracownicy, znajomi rodziców.
- [ ] Wiadomość nr 1 z `szablony/wiadomosci.md`. Nie pytasz, czy oni chcą stronę. Pytasz, kogo znają.
- [ ] Każda odpowiedź "znam X" → demo dla X tego samego dnia.

### Dzień 3–7: firmy lokalne z gotowym demem
- [ ] `leads.py` dla 2–3 kategorii w Twojej okolicy (fryzjer, mechanik, dentysta, restauracja).
- [ ] Codziennie 10 firm: demo (`mockup.py`) + kontakt telefon / wizyta / Messenger (wiadomości 2–4). Nie masowy e-mail (patrz "Ostrzeżenia").
- [ ] Codziennie 15 min: Useme, Oferteo, OLX "zlecę stronę", grupy FB. Wiadomość nr 6 + link do dema z branży. Przewaga: "jutro wyślę podgląd".
- [ ] Każdy kontakt do CRM z datą follow-upu (+3 dni).

## Tydzień 2: domknąć pierwszego, zbudować taśmę

- [ ] Follow-upy z CRM (wiadomość nr 5). Większość sprzedaży dzieje się tu.
- [ ] Pierwszy projekt w pełni po procesie: brief → wycena (`szablony/wycena.md`) → umowa + zaliczka → podgląd → 2 rundy poprawek → publikacja → opinia. Każdy krok z szablonu.
- [ ] Starter dla klienta: kopia szablonu wizytówki + formularz przez Web3Forms lub Formspree (darmowe, bez backendu) + deploy na Cloudflare Pages / Netlify + checklist: domena, SSL, `sitemap.xml`, Google Business Profile klienta.
- [ ] Dzień publikacji: prośba o opinię (wiadomość nr 7), case study na Twojej stronie (sekcja "Projekty": pierwsza prawdziwa realizacja zamiast jednego dema), post na LinkedIn / FB.

## Tygodnie 3–4: kilku klientów

- [ ] Kadencja: 25 nowych kontaktów tygodniowo, każdy z demem. 10 dziennie to ~45 min.
- [ ] Google Business Profile "Adam – strony internetowe, Warszawa" (usługa bez lokalu, obszar działania). Darmowa widoczność na "strony internetowe Warszawa" w Mapach.
- [ ] Polecenia: 100 zł za każdego poleconego klienta. Mówisz o tym każdemu przy odbiorze.
- [ ] Treści: 2 posty tygodniowo z konkretem ("zrobiłem stronę dla X, 3 rzeczy, które zwiększyły liczbę telefonów"). Bez ogólników.
- [ ] Upsell po miesiącu: "dodam Google Business + opinie za 200 zł", "landing pod promocję za 600 zł".
- [ ] Co piątek 15 min: przejrzyj CRM. Ile kontaktów, ile rozmów, ile umów. Jeśli kontakty → rozmowy < 10%, popraw wiadomość. Jeśli rozmowy → umowy < 20%, popraw wycenę / rozmowę.

## Co jest automatyczne, a co Twoje

| Czynność | Automat | Ty |
|---|---|---|
| Znajdowanie firm bez strony | `leads.py` → CSV | wybór kategorii i dzielnicy |
| Demo dla konkretnej firmy | `mockup.py` → link | rzut oka przed wysłaniem |
| Pierwsza wiadomość | szablon | wysyłka i rozmowa |
| Follow-upy | mail z arkusza co rano | treść odpowiedzi |
| Brief od klienta | formularz → arkusz | rozmowa 20 min |
| Wycena, umowa, zaliczka | szablony | decyzja o cenie, podpis |
| Budowa strony | szablon + deploy | treść, dopasowanie, poprawki |
| Opinia, case study, post | szablony | wysłanie prośby |

## Ostrzeżenia (ogólne, nie porada prawna)

1. **Masowe cold maile do firm są w Polsce ryzykowne.** Przepisy o komunikacji elektronicznej wymagają zgody na informację handlową, także wobec firm. Dlatego w planie jest telefon, wizyta, DM i formularze kontaktowe. Jeśli chcesz mailować, pierwsza wiadomość może być tylko pytaniem o zgodę na przesłanie oferty.
2. **Places API zamiast scrapowania Map.** Scraping łamie regulamin Google i grozi blokadą konta. API ma darmowy pakiet wystarczający na setki firm miesięcznie.
3. **Dane firm (telefony) trzymaj poza publicznym repo.** `tools/leads/out/` jest w `.gitignore`. Dema w `demo/` są publiczne, ale z `noindex`; usuwaj je po zakończeniu rozmowy.
