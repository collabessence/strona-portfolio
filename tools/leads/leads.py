#!/usr/bin/env python3
"""Lista firm bez strony WWW z OpenStreetMap (Overpass API) -> CSV. Darmowe, bez klucza.

OpenStreetMap ma tagi website / contact:website / contact:facebook / phone.
Firma bez tagu website to kandydat, ale OSM nie jest kompletne: część z nich
ma stronę, tylko nikt jej nie wpisał. Dlatego CSV ma kolumnę `sprawdz`
(link do wyszukiwarki) - 10 sekund przed kontaktem, żeby nie strzelić kulą w płot.

Użycie:
    python3 tools/leads/leads.py --typ fryzjer --gdzie "Mokotów"
    python3 tools/leads/leads.py --typ mechanik --gdzie "Piaseczno" --wszystkie

`--gdzie` to nazwa obszaru administracyjnego w OSM: dzielnica ("Mokotów", "Wola"),
miasto ("Chełm", "Piaseczno") albo gmina. Musi być dokładnie tak, jak w OSM.

Wynik: tools/leads/out/<typ>-<gdzie>.csv z kolumnami:
    typ, nazwa, telefon, adres, strona, ma_strone, tylko_social, godziny, osm, sprawdz
"""

import argparse
import csv
import json
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

OUT_DIR = Path(__file__).resolve().parent / "out"
ENDPOINTS = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
]

# Typ -> lista tagów OSM (klucz=wartość). Kilka wariantów, bo mapowanie bywa niespójne.
TAGI = {
    "fryzjer": ['"shop"="hairdresser"'],
    "kosmetyczka": ['"shop"="beauty"'],
    "mechanik": ['"shop"="car_repair"', '"craft"="car_repair"'],
    "restauracja": ['"amenity"="restaurant"', '"amenity"="cafe"'],
    "dentysta": ['"amenity"="dentist"', '"healthcare"="dentist"'],
    "fitness": ['"leisure"="fitness_centre"'],
    "fizjoterapeuta": ['"healthcare"="physiotherapist"'],
    "weterynarz": ['"amenity"="veterinary"'],
    "kwiaciarnia": ['"shop"="florist"'],
}

SOCIAL = re.compile(r"facebook\.com|instagram\.com|linktr\.ee|booksy\.com|znanylekarz\.pl", re.I)


def zapytanie(typ: str, gdzie: str) -> str:
    selektory = "".join(f'nwr[{t}]["name"](area.a);' for t in TAGI[typ])
    return (
        '[out:json][timeout:60];'
        f'area["boundary"="administrative"]["name"="{gdzie}"]->.a;'
        f'({selektory});'
        'out tags center;'
    )


def overpass(query: str) -> dict:
    data = urllib.parse.urlencode({"data": query}).encode()
    ostatni = None
    for url in ENDPOINTS:
        try:
            req = urllib.request.Request(url, data=data, headers={"User-Agent": "leads.py (portfolio)"})
            with urllib.request.urlopen(req, timeout=90) as r:
                return json.load(r)
        except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError) as e:
            ostatni = e
            time.sleep(2)
    sys.exit(f"Overpass niedostępny: {ostatni}")


def adres(t: dict) -> str:
    ulica = " ".join(x for x in (t.get("addr:street", ""), t.get("addr:housenumber", "")) if x)
    miasto = " ".join(x for x in (t.get("addr:postcode", ""), t.get("addr:city", "")) if x)
    return ", ".join(x for x in (ulica, miasto) if x)


def to_row(typ: str, el: dict) -> dict:
    t = el.get("tags", {})
    strona = t.get("website") or t.get("contact:website") or ""
    social = t.get("contact:facebook") or t.get("contact:instagram") or ""
    link = strona or social
    nazwa = t.get("name", "")
    q = urllib.parse.quote_plus(f'"{nazwa}" {t.get("addr:city", "")} strona')
    return {
        "typ": typ,
        "nazwa": nazwa,
        "telefon": t.get("phone") or t.get("contact:phone") or t.get("contact:mobile") or "",
        "adres": adres(t),
        "strona": link,
        "ma_strone": "TAK" if strona and not SOCIAL.search(strona) else "NIE",
        "tylko_social": "TAK" if link and SOCIAL.search(link) else "",
        "godziny": t.get("opening_hours", ""),
        "osm": f"https://www.openstreetmap.org/{el.get('type')}/{el.get('id')}",
        "sprawdz": f"https://duckduckgo.com/?q={q}",
    }


def szukaj(typ: str, gdzie: str, wszystkie: bool = False) -> list[dict]:
    """Zwraca wiersze dla typu i obszaru; domyślnie tylko firmy bez strony lub tylko z social."""
    if typ not in TAGI:
        sys.exit(f"Nieznany typ '{typ}'. Dostępne: {', '.join(TAGI)}")
    dane = overpass(zapytanie(typ, gdzie))
    rows = [to_row(typ, el) for el in dane.get("elements", [])]
    if not wszystkie:
        rows = [r for r in rows if r["ma_strone"] == "NIE"]
    # firmy z telefonem na górze, bo do nich da się zadzwonić od razu
    rows.sort(key=lambda r: (r["telefon"] == "", r["nazwa"]))
    return rows


def zapisz_csv(rows: list[dict], typ: str, gdzie: str) -> Path:
    OUT_DIR.mkdir(exist_ok=True)
    slug = re.sub(r"[^a-z0-9]+", "-", gdzie.lower()).strip("-")
    out = OUT_DIR / f"{typ}-{slug}.csv"
    with open(out, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=list(to_row("", {}).keys()))
        w.writeheader()
        w.writerows(rows)
    return out


def main() -> None:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--typ", required=True, choices=TAGI.keys())
    p.add_argument("--gdzie", required=True, help='obszar w OSM, np. "Mokotów", "Chełm"')
    p.add_argument("--wszystkie", action="store_true", help="zapisz też firmy, które mają stronę")
    a = p.parse_args()

    rows = szukaj(a.typ, a.gdzie, a.wszystkie)
    if not rows:
        sys.exit(f"0 wyników. Sprawdź nazwę obszaru (musi być jak w OSM) albo spróbuj innego typu.")
    out = zapisz_csv(rows, a.typ, a.gdzie)
    z_tel = sum(1 for r in rows if r["telefon"])
    print(f"{len(rows)} firm bez strony ({z_tel} z telefonem) -> {out}")


if __name__ == "__main__":
    main()
