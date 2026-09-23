#!/usr/bin/env python3
"""Generator dem: gotowa strona wizytówka dla konkretnej firmy w minutę.

Bierze jeden z szablonów z tego repo, podmienia nazwę, telefon, adres,
e-mail, godziny i mapę na dane firmy, dokleja pasek "propozycja strony
od Adama" i zapisuje wynik do demo/<slug>/. Po pushu do master strona
jest pod https://collabessence.github.io/strona-portfolio/demo/<slug>/.

Użycie:
    python3 tools/mockup/mockup.py --typ fryzjer --firma "Salon Anna" \
        --telefon "+48 600 700 800" --adres "ul. Puławska 12" \
        --miasto "02-566 Warszawa" --godziny "Pn-Pt: 9:00 - 18:00"

    # z arkusza leadów (wiersz 3 z pliku CSV wygenerowanego przez tools/leads):
    python3 tools/mockup/mockup.py --csv tools/leads/out/fryzjer-mokotow.csv --wiersz 3

Typy: fryzjer, mechanik, restauracja, dentysta, fitness
"""

import argparse
import csv
import datetime
import re
import shutil
import sys
import unicodedata
import urllib.parse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT_DIR = ROOT / "demo"

# Dane kontaktowe autora, pokazywane na pasku dema
AUTHOR_NAME = "Adam"
AUTHOR_PHONE = "+48 727 705 045"
AUTHOR_EMAIL = "collabessence@gmail.com"
AUTHOR_SITE = "https://collabessence.github.io/strona-portfolio/"

# Co w którym szablonie trzeba podmienić. Klucze: fragmenty tekstu w index.html.
TEMPLATES = {
    "fryzjer": {
        "dir": "2-Strony-Wizytowki/1-Fryzjer-Salon",
        "brand": ["Studio Loft"],
        "title": "Salon Fryzjerski - Profesjonalna Pielęgnacja Włosów",
        "phone": "+48 123 456 789",
        "phone_raw": "48123456789",
        "email": "kontakt@salon.pl",
        "street": "ul. Przykładowa 123",
        "city": "00-000 Warszawa",
        "hours": "Pn-Pt: 9:00 - 19:00",
    },
    "mechanik": {
        "dir": "2-Strony-Wizytowki/2-Mechanik-Warsztat",
        "brand": ["AUTO-SERWIS"],
        "title": "Warsztat Samochodowy - Profesjonalne Naprawy",
        "phone": "+48 123 456 789",
        "phone_raw": "48123456789",
        "email": "kontakt@warsztat.pl",
        "street": "ul. Mechaniczna 45",
        "city": "00-000 Warszawa",
        "hours": "<strong>Pn-Pt:</strong> 8:00 - 18:00",
    },
    "restauracja": {
        "dir": "2-Strony-Wizytowki/3-Restauracja-Bar",
        "brand": [">RESTAURACJA<"],
        "title": "Restauracja - Smaki Tradycji",
        "phone": "+48 123 456 789",
        "phone_raw": "48123456789",
        "email": "kontakt@restauracja.pl",
        "street": "ul. Smaczna 15",
        "city": "00-000 Warszawa",
        "hours": "Pn-Nd: 12:00 - 22:00",
    },
    "dentysta": {
        "dir": "11-Dentysta-Klinika",
        "brand": ["DentCare"],
        "title": "DentCare - Profesjonalna Klinika Stomatologiczna w Warszawie",
        "phone": "+48 123 456 789",
        "phone_raw": "48123456789",
        "email": "kontakt@dentcare.pl",
        "street": "ul. Piękna 15/3",
        "city": "00-549 Warszawa",
        "hours": "Pon-Pt: 8:00-20:00",
    },
    "fitness": {
        "dir": "12-Fitness-Silownia",
        "brand": ["POWER<strong>GYM</strong>", "PowerGym"],
        "title": "PowerGym - Twoja Droga do Formy | Siłownia & Fitness Warszawa",
        "phone": "+48 500 600 700",
        "phone_raw": "48500600700",
        "email": "info@powergym.pl",
        "street": "ul. Sportowa 10",
        "city": "00-001 Warszawa",
        "hours": None,
    },
}

DEMO_BAR = """
<!-- Pasek dema (usuń przed oddaniem strony klientowi) -->
<style>
#demo-bar{position:fixed;left:16px;bottom:16px;z-index:2147483000;max-width:min(360px,calc(100vw - 32px));background:#0b1220;color:#e8ecf4;border:1px solid #223049;border-radius:14px;padding:14px 16px;font:14px/1.45 Inter,system-ui,sans-serif;box-shadow:0 12px 32px rgba(0,0,0,.35)}
#demo-bar strong{display:block;font-size:15px;margin-bottom:4px}
#demo-bar a{color:#7aa7ff;font-weight:600;text-decoration:none}
#demo-bar button{position:absolute;top:6px;right:8px;background:none;border:0;color:#9aa5b8;font-size:18px;cursor:pointer}
</style>
<div id="demo-bar" role="note">
  <button type="button" aria-label="Zamknij" onclick="this.parentNode.remove()">×</button>
  <strong>Propozycja strony dla: __FIRMA__</strong>
  Przygotował __AUTHOR__. Podoba się? Zadzwoń: <a href="tel:__AUTHOR_PHONE_RAW__">__AUTHOR_PHONE__</a>
  lub napisz: <a href="mailto:__AUTHOR_EMAIL__">__AUTHOR_EMAIL__</a>.
</div>
"""


PL = str.maketrans("ąćęłńóśźżĄĆĘŁŃÓŚŹŻ", "acelnoszzACELNOSZZ")


def slugify(text: str) -> str:
    text = unicodedata.normalize("NFKD", text.translate(PL)).encode("ascii", "ignore").decode()
    text = re.sub(r"[^a-zA-Z0-9]+", "-", text).strip("-").lower()
    return text or "firma"


def phone_raw(phone: str) -> str:
    digits = re.sub(r"\D", "", phone)
    if len(digits) == 9:
        digits = "48" + digits
    return digits


def build(typ: str, firma: str, telefon: str, adres: str, miasto: str,
          godziny: str | None, email: str | None, slug: str | None) -> Path:
    if typ not in TEMPLATES:
        sys.exit(f"Nieznany typ '{typ}'. Dostępne: {', '.join(TEMPLATES)}")
    t = TEMPLATES[typ]
    src = ROOT / t["dir"]
    slug = slug or slugify(firma)
    out = OUT_DIR / slug
    out.mkdir(parents=True, exist_ok=True)

    html = (src / "index.html").read_text(encoding="utf-8")

    # Tytuł: nazwa firmy + opisowa końcówka z szablonu ("Salon X - Profesjonalna ...")
    suffix = t["title"].partition(" - ")[2]
    html = html.replace(t["title"], f"{firma} - {suffix}" if suffix else firma, 1)
    for b in t["brand"]:
        html = html.replace(b, f">{firma}<" if b.startswith(">") else firma)
    html = re.sub(
        r"&copy; \d{4} [^.<]*",
        f"&copy; {datetime.date.today().year} {firma}",
        html,
    )
    html = html.replace(t["phone"], telefon)
    html = html.replace(t["phone_raw"], phone_raw(telefon))
    html = html.replace(t["email"], email or f"kontakt@{slug}.pl")
    html = html.replace(t["street"], adres)
    html = html.replace(t["city"], miasto)
    if godziny and t["hours"]:
        html = html.replace(t["hours"], godziny, 1)

    # Mapa Google bez klucza API: embed po adresie
    q = urllib.parse.quote(f"{firma}, {adres}, {miasto}")
    html = re.sub(
        r'src="https://www\.google\.com/maps/embed[^"]*"',
        f'src="https://www.google.com/maps?q={q}&output=embed"',
        html,
    )

    # Demo nie ma trafiać do Google
    html = html.replace("<head>", '<head>\n    <meta name="robots" content="noindex, nofollow">', 1)

    bar = (DEMO_BAR.replace("__FIRMA__", firma)
           .replace("__AUTHOR__", AUTHOR_NAME)
           .replace("__AUTHOR_PHONE__", AUTHOR_PHONE)
           .replace("__AUTHOR_PHONE_RAW__", "+" + phone_raw(AUTHOR_PHONE))
           .replace("__AUTHOR_EMAIL__", AUTHOR_EMAIL))
    html = html.replace("</body>", bar + "</body>", 1)

    (out / "index.html").write_text(html, encoding="utf-8")
    for name in ("style.css", "script.js"):
        if (src / name).exists():
            shutil.copy(src / name, out / name)
    return out


def from_csv(path: Path, row: int) -> dict:
    with open(path, newline="", encoding="utf-8") as f:
        rows = list(csv.DictReader(f))
    if not 1 <= row <= len(rows):
        sys.exit(f"Plik ma {len(rows)} wierszy, podano {row}")
    r = rows[row - 1]
    adres, _, miasto = r.get("adres", "").partition(", ")
    return {
        "firma": r.get("nazwa", ""),
        "telefon": r.get("telefon", "") or "+48 000 000 000",
        "adres": adres,
        "miasto": miasto or "Warszawa",
        "typ": r.get("typ", ""),
    }


def main() -> None:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--typ", choices=TEMPLATES.keys())
    p.add_argument("--firma")
    p.add_argument("--telefon")
    p.add_argument("--adres", help="ulica i numer")
    p.add_argument("--miasto", help="kod pocztowy i miasto, np. '02-566 Warszawa'")
    p.add_argument("--godziny", help="np. 'Pn-Pt: 9:00 - 18:00'")
    p.add_argument("--email")
    p.add_argument("--slug", help="nazwa folderu w demo/ (domyślnie z nazwy firmy)")
    p.add_argument("--csv", type=Path, help="CSV z tools/leads")
    p.add_argument("--wiersz", type=int, default=1, help="numer wiersza w CSV (od 1)")
    a = p.parse_args()

    data = {}
    if a.csv:
        data = from_csv(a.csv, a.wiersz)
    for key in ("typ", "firma", "telefon", "adres", "miasto"):
        val = getattr(a, key)
        if val:
            data[key] = val
        if not data.get(key):
            sys.exit(f"Brakuje --{key}")

    out = build(data["typ"], data["firma"], data["telefon"], data["adres"],
                data["miasto"], a.godziny, a.email, a.slug)
    rel = out.relative_to(ROOT)
    print(f"Gotowe: {rel}/index.html")
    print(f"Podgląd lokalny: python3 -m http.server 8000  ->  http://localhost:8000/{rel}/")
    print(f"Po pushu do master: {AUTHOR_SITE}{rel}/")


if __name__ == "__main__":
    main()
