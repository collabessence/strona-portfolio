# mockup.py – demo strony dla konkretnej firmy

Zamiast "zrobię Panu stronę" wysyłasz link: "tak mogłaby wyglądać strona Pana warsztatu", z jego nazwą, telefonem, adresem, godzinami i mapą. To jest różnica między Tobą a dziesięcioma ofertami z Oferteo.

## Użycie

```bash
# ręcznie
python3 tools/mockup/mockup.py --typ mechanik --firma "Auto-Max Kowalski" \
    --telefon "+48 601 202 303" --adres "ul. Wolska 88" --miasto "01-141 Warszawa" \
    --godziny "Pn-Pt: 8:00 - 17:00"

# z CSV od leads.py (typ, nazwa, telefon, adres wchodzą same)
python3 tools/mockup/mockup.py --csv tools/leads/out/mechanik-wola-warszawa.csv --wiersz 4
```

Typy: `fryzjer`, `mechanik`, `restauracja`, `dentysta`, `fitness`.

Wynik: `demo/<slug>/index.html` + `style.css` + `script.js`. Podgląd lokalnie:

```bash
python3 -m http.server 8000
# http://localhost:8000/demo/auto-max-kowalski/
```

## Publikacja

Commit + push do `master`. GitHub Actions wdraża całe repo, więc demo jest pod
`https://collabessence.github.io/strona-portfolio/demo/<slug>/` po ~1 minucie.

Alternatywa, jeśli nie chcesz dem w repo portfolio: przeciągnij folder `demo/<slug>` na https://app.netlify.com/drop (darmowe, link od ręki, znika po 24 h bez konta).

## Co jest podmieniane

Nazwa (logo, tytuł, stopka), telefon (tekst, `tel:`, WhatsApp), e-mail, ulica, kod i miasto, pierwsza linia godzin otwarcia, mapa Google (embed po adresie, bez klucza API). Reszta treści (usługi, cennik, opinie) zostaje z szablonu; to demo, nie gotowa strona.

Dodatkowo: `<meta name="robots" content="noindex">` i pasek w lewym dolnym rogu "Propozycja strony dla: X. Przygotował Adam. Zadzwoń…". Dane autora są na górze `mockup.py`.

## Gdy firma kupi

Nie oddawaj dema. Zbuduj stronę z szablonu od nowa według briefu (`szablony/brief.md`), z prawdziwymi usługami, cennikiem i zdjęciami, bez paska dema. Usuń folder `demo/<slug>/`.
