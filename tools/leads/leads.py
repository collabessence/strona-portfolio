#!/usr/bin/env python3
"""Lista firm bez strony WWW z Google Places API (New) -> CSV.

Wymaga klucza API z włączonym "Places API (New)":
https://console.cloud.google.com/apis/library/places-backend.googleapis.com
Darmowy limit Google wystarcza na kilkaset zapytań miesięcznie. Nie scrapuj
Map przez HTML - to łamie regulamin Google, a API jest legalne i stabilne.

Użycie:
    export GOOGLE_PLACES_API_KEY=...
    python3 tools/leads/leads.py --typ fryzjer --gdzie "Mokotów, Warszawa"
    python3 tools/leads/leads.py --typ mechanik --gdzie "Wola, Warszawa" --strony 3

Wynik: tools/leads/out/<typ>-<gdzie>.csv z kolumnami:
    typ, nazwa, telefon, adres, ocena, opinie, strona, ma_strone, tylko_social, maps
Filtruj w arkuszu: ma_strone = NIE albo tylko_social = TAK.
"""

import argparse
import csv
import json
import os
import re
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

OUT_DIR = Path(__file__).resolve().parent / "out"
ENDPOINT = "https://places.googleapis.com/v1/places:searchText"
FIELDS = ",".join([
    "places.displayName", "places.formattedAddress", "places.nationalPhoneNumber",
    "places.websiteUri", "places.rating", "places.userRatingCount", "places.googleMapsUri",
    "nextPageToken",
])

# Fraza wyszukiwania per typ (to samo słowo, którego użyłby klient w Google)
QUERIES = {
    "fryzjer": "salon fryzjerski",
    "mechanik": "warsztat samochodowy",
    "restauracja": "restauracja",
    "dentysta": "dentysta",
    "fitness": "siłownia",
    "kosmetyczka": "salon kosmetyczny",
    "fizjoterapeuta": "fizjoterapeuta",
}

SOCIAL = re.compile(r"facebook\.com|instagram\.com|linktr\.ee|booksy\.com|znanylekarz\.pl", re.I)


def search(api_key: str, query: str, page_token: str | None) -> dict:
    body = {"textQuery": query, "languageCode": "pl", "regionCode": "PL", "pageSize": 20}
    if page_token:
        body["pageToken"] = page_token
    req = urllib.request.Request(
        ENDPOINT,
        data=json.dumps(body).encode(),
        headers={
            "Content-Type": "application/json",
            "X-Goog-Api-Key": api_key,
            "X-Goog-FieldMask": FIELDS,
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        sys.exit(f"Places API {e.code}: {e.read().decode()[:400]}")


def to_row(typ: str, place: dict) -> dict:
    site = place.get("websiteUri", "") or ""
    return {
        "typ": typ,
        "nazwa": place.get("displayName", {}).get("text", ""),
        "telefon": place.get("nationalPhoneNumber", ""),
        "adres": place.get("formattedAddress", ""),
        "ocena": place.get("rating", ""),
        "opinie": place.get("userRatingCount", ""),
        "strona": site,
        "ma_strone": "TAK" if site else "NIE",
        "tylko_social": "TAK" if site and SOCIAL.search(site) else "",
        "maps": place.get("googleMapsUri", ""),
    }


def main() -> None:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--typ", required=True, choices=QUERIES.keys())
    p.add_argument("--gdzie", required=True, help="dzielnica/miasto, np. 'Mokotów, Warszawa'")
    p.add_argument("--strony", type=int, default=2, help="ile stron po 20 wyników (domyślnie 2)")
    p.add_argument("--wszystkie", action="store_true", help="zapisz też firmy, które mają stronę")
    a = p.parse_args()

    api_key = os.environ.get("GOOGLE_PLACES_API_KEY")
    if not api_key:
        sys.exit("Ustaw zmienną GOOGLE_PLACES_API_KEY (patrz README).")

    query = f"{QUERIES[a.typ]} {a.gdzie}"
    rows, token = [], None
    for _ in range(a.strony):
        data = search(api_key, query, token)
        rows += [to_row(a.typ, pl) for pl in data.get("places", [])]
        token = data.get("nextPageToken")
        if not token:
            break
        time.sleep(1)

    if not a.wszystkie:
        rows = [r for r in rows if r["ma_strone"] == "NIE" or r["tylko_social"]]

    OUT_DIR.mkdir(exist_ok=True)
    slug = re.sub(r"[^a-z0-9]+", "-", a.gdzie.lower()).strip("-")
    out = OUT_DIR / f"{a.typ}-{slug}.csv"
    with open(out, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=list(to_row("", {}).keys()))
        w.writeheader()
        w.writerows(rows)
    print(f"{len(rows)} firm -> {out.relative_to(Path.cwd()) if out.is_relative_to(Path.cwd()) else out}")


if __name__ == "__main__":
    main()
