#!/usr/bin/env python3
"""Pipeline sprzedażowy w jednym poleceniu: lista firm -> demo -> wiadomość -> follow-up -> wycena -> umowa.

Wszystko trzyma w lokalnej bazie SQLite (tools/pipeline/out/pipeline.db, poza repo).
Łączy tools/leads (OpenStreetMap), tools/mockup (dema) i tools/szablony (dokumenty).

Codzienny cykl:
    python3 tools/pipeline/pipeline.py szukaj --typ fryzjer --gdzie "Mokotów"   # nowe firmy do bazy
    python3 tools/pipeline/pipeline.py dzisiaj                                   # co dziś zrobić
    python3 tools/pipeline/pipeline.py demo 12                                   # demo dla firmy #12
    python3 tools/pipeline/pipeline.py publikuj                                  # git push dem -> online
    python3 tools/pipeline/pipeline.py wiadomosc 12                              # tekst do wysłania
    python3 tools/pipeline/pipeline.py status 12 kontakt --notatka "Messenger"   # follow-up ustawia się sam
    python3 tools/pipeline/pipeline.py wycena 12 --pakiet wizytowka --cena 800   # mail z wyceną
    python3 tools/pipeline/pipeline.py umowa 12 --cena 800                       # umowa do podpisu
    python3 tools/pipeline/pipeline.py raport                                    # lejek

Statusy: nowy -> demo_gotowe -> kontakt -> rozmowa -> wycena -> umowa -> klient | zimny
"""

import argparse
import csv
import datetime as dt
import importlib.util
import re
import sqlite3
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = Path(__file__).resolve().parent / "out"
DB = OUT / "pipeline.db"
SZABLONY = ROOT / "tools" / "szablony"


def _load(name: str, rel: str):
    spec = importlib.util.spec_from_file_location(name, ROOT / rel)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


leads = _load("leads", "tools/leads/leads.py")
mockup = _load("mockup", "tools/mockup/mockup.py")

STATUSY = ["nowy", "demo_gotowe", "kontakt", "rozmowa", "wycena", "umowa", "klient", "zimny"]
# Po zmianie statusu follow-up ustawia się automatycznie (dni od dziś)
FOLLOW_UP = {"kontakt": 3, "rozmowa": 2, "wycena": 3, "umowa": 7}
PAKIETY = {
    "landing": ("Landing page", 600, "około tygodnia", "jedna strona z jednym celem, formularz na Twój e-mail, gotowa pod kampanię"),
    "wizytowka": ("Strona wizytówka", 800, "1–2 tygodnie", "do 6 sekcji: usługi, cennik, galeria, kontakt; formularz, mapa, przycisk „Zadzwoń”"),
    "firmowa": ("Strona firmowa", 1800, "2–4 tygodnie", "3–6 podstron, polityka prywatności i cookies, mapa strony i dane dla Google"),
}

WIADOMOSCI = {
    "pierwsza": (
        "Dzień dobry! Nazywam się {autor}, robię strony dla firm w Twojej okolicy ({okolica}). Zauważyłem, że {firma} "
        "nie ma swojej strony, a klienci szukają Was w Google. Przygotowałem propozycję, jak mogłaby "
        "wyglądać Wasza strona: {link}\n\nNie kosztuje to nic, chciałem po prostu pokazać. Gdyby był temat, "
        "strona wizytówka to od 800 zł i tydzień pracy. Do kogo mogę zadzwonić w tej sprawie?"
    ),
    "telefon": (
        "Dzień dobry, {autor} z tej strony, robię strony internetowe dla firm w okolicy ({okolica}). Dzwonię, bo {firma} "
        "nie ma strony, a ma dobre opinie. Przygotowałem propozycję, jak mogłaby wyglądać: mogę wysłać link "
        "na WhatsApp albo mail? [pauza] Super, na jaki numer / adres? [pauza] Wyślę za chwilę i zadzwonię "
        "jutro zapytać, co Pan/Pani o tym myśli. Miłego dnia!"
    ),
    "followup": (
        "Dzień dobry, {autor}. Wysyłałem link do propozycji strony dla {firma}: {link}\n\nChciałem zapytać, czy "
        "mieli Państwo chwilę spojrzeć i czy jest coś, co bym zmienił? Jeśli temat nieaktualny, proszę o "
        "krótkie „nie”, nie będę więcej pisał."
    ),
    "opinia": (
        "Strona działa: {link}. Dziękuję za współpracę! Mam prośbę: czy mógłby Pan/Pani napisać 2–3 zdania "
        "opinii, które umieszczę na swojej stronie? Wystarczy odpowiedź na tę wiadomość. I jeśli zna Pan/Pani "
        "kogoś, komu przydałaby się strona, za każde polecenie, które skończy się zleceniem, oddaję 100 zł."
    ),
}


# ---------- baza ----------

def db() -> sqlite3.Connection:
    OUT.mkdir(exist_ok=True)
    con = sqlite3.connect(DB)
    con.row_factory = sqlite3.Row
    con.execute("""CREATE TABLE IF NOT EXISTS firmy (
        id INTEGER PRIMARY KEY,
        typ TEXT, nazwa TEXT, telefon TEXT, adres TEXT, miasto TEXT, email TEXT,
        okolica TEXT, strona TEXT, osm TEXT UNIQUE, sprawdz TEXT,
        status TEXT DEFAULT 'nowy', demo TEXT, follow_up TEXT, notatki TEXT DEFAULT '',
        dodano TEXT, zmieniono TEXT)""")
    con.execute("""CREATE TABLE IF NOT EXISTS zdarzenia (
        id INTEGER PRIMARY KEY, firma_id INTEGER, kiedy TEXT, co TEXT)""")
    return con


def dzis() -> str:
    return dt.date.today().isoformat()


def firma(con, fid: int) -> sqlite3.Row:
    r = con.execute("SELECT * FROM firmy WHERE id=?", (fid,)).fetchone()
    if not r:
        sys.exit(f"Nie ma firmy #{fid}. Lista: pipeline.py lista")
    return r


def zdarzenie(con, fid: int, co: str) -> None:
    con.execute("INSERT INTO zdarzenia (firma_id, kiedy, co) VALUES (?,?,?)", (fid, dt.datetime.now().isoformat(timespec="minutes"), co))
    con.execute("UPDATE firmy SET zmieniono=? WHERE id=?", (dzis(), fid))


def ustaw_status(con, fid: int, status: str, notatka: str = "") -> None:
    if status not in STATUSY:
        sys.exit(f"Status musi być jednym z: {', '.join(STATUSY)}")
    fu = (dt.date.today() + dt.timedelta(days=FOLLOW_UP[status])).isoformat() if status in FOLLOW_UP else None
    con.execute("UPDATE firmy SET status=?, follow_up=? WHERE id=?", (status, fu, fid))
    if notatka:
        con.execute("UPDATE firmy SET notatki = notatki || ? WHERE id=?", (f"[{dzis()}] {notatka}\n", fid))
    zdarzenie(con, fid, f"status -> {status}" + (f" ({notatka})" if notatka else ""))


def rozdziel_adres(adres: str) -> tuple[str, str]:
    ulica, _, miasto = adres.partition(", ")
    return ulica, miasto


# ---------- komendy ----------

def cmd_szukaj(a):
    rows = leads.szukaj(a.typ, a.gdzie, a.wszystkie)
    con = db()
    nowe = 0
    for r in rows:
        ulica, miasto = rozdziel_adres(r["adres"])
        try:
            con.execute(
                "INSERT INTO firmy (typ,nazwa,telefon,adres,miasto,okolica,strona,osm,sprawdz,dodano) VALUES (?,?,?,?,?,?,?,?,?,?)",
                (r["typ"], r["nazwa"], r["telefon"], ulica, miasto, a.gdzie, r["strona"], r["osm"], r["sprawdz"], dzis()),
            )
            nowe += 1
        except sqlite3.IntegrityError:
            pass  # już w bazie
    con.commit()
    print(f"{len(rows)} firm z OSM, {nowe} nowych w bazie. Dalej: pipeline.py dzisiaj")


def cmd_lista(a):
    con = db()
    q = "SELECT * FROM firmy" + (" WHERE status=?" if a.status else "") + " ORDER BY status, id"
    rows = con.execute(q, (a.status,) if a.status else ()).fetchall()
    if not rows:
        print("Pusto."); return
    print(f"{'#':>4}  {'status':12} {'nazwa':34} {'telefon':16} {'follow-up':10}  demo")
    for r in rows:
        print(f"{r['id']:>4}  {r['status']:12} {r['nazwa'][:34]:34} {r['telefon'][:16]:16} {r['follow_up'] or '':10}  {r['demo'] or ''}")


def cmd_edytuj(a):
    con = db(); firma(con, a.id)
    pola = {k: v for k, v in vars(a).items() if k in ("nazwa", "typ", "telefon", "adres", "miasto", "email", "okolica") and v}
    if not pola:
        sys.exit("Podaj co zmienić, np. --telefon '600 700 800'")
    con.execute("UPDATE firmy SET " + ", ".join(f"{k}=?" for k in pola) + " WHERE id=?", (*pola.values(), a.id))
    zdarzenie(con, a.id, "edycja: " + ", ".join(pola)); con.commit()
    print("OK")


def cmd_demo(a):
    con = db(); f = firma(con, a.id)
    brak = [k for k in ("typ", "nazwa", "telefon", "adres", "miasto") if not f[k]]
    if brak:
        sys.exit(f"Brakuje: {', '.join(brak)}. Uzupełnij: pipeline.py edytuj {a.id} --{brak[0]} ...  (telefon/adres z Google Maps)")
    if f["typ"] not in mockup.TEMPLATES:
        sys.exit(f"Brak szablonu dla typu '{f['typ']}'. Zmień typ na jeden z: {', '.join(mockup.TEMPLATES)}")
    out = mockup.build(f["typ"], f["nazwa"], f["telefon"], f["adres"], f["miasto"], None, f["email"], None)
    link = f"{mockup.AUTHOR_SITE}{out.relative_to(ROOT)}/"
    con.execute("UPDATE firmy SET demo=? WHERE id=?", (link, a.id))
    if f["status"] == "nowy":
        ustaw_status(con, a.id, "demo_gotowe")
    zdarzenie(con, a.id, "demo wygenerowane"); con.commit()
    print(f"Demo: {out.relative_to(ROOT)}/index.html\nPo publikacji: {link}\nPodgląd: python3 -m http.server 8000 -> http://localhost:8000/{out.relative_to(ROOT)}/")


def cmd_publikuj(a):
    demo_dir = ROOT / "demo"
    if not demo_dir.exists():
        sys.exit("Brak folderu demo/. Najpierw: pipeline.py demo <id>")
    run = lambda *c: subprocess.run(c, cwd=ROOT, check=True, capture_output=True, text=True)
    run("git", "add", "demo")
    if not subprocess.run(["git", "diff", "--cached", "--quiet"], cwd=ROOT).returncode:
        print("Nic nowego do publikacji."); return
    run("git", "commit", "-m", f"Dema: {dzis()}")
    run("git", "push")
    print("Wypchnięte. GitHub Actions wdroży w ~1 min. Linki z kolumny demo będą działać.")


def cmd_wiadomosc(a):
    con = db(); f = firma(con, a.id)
    tekst = WIADOMOSCI[a.rodzaj].format(
        autor=mockup.AUTHOR_NAME, firma=f["nazwa"], okolica=f["okolica"] or f["miasto"] or "okolicy",
        link=f["demo"] or "[najpierw: pipeline.py demo]",
    )
    print(tekst)
    if f["sprawdz"]:
        print(f"\n--- Zanim wyślesz: sprawdź, czy firma naprawdę nie ma strony -> {f['sprawdz']}")


def cmd_status(a):
    con = db(); firma(con, a.id)
    ustaw_status(con, a.id, a.status, a.notatka or ""); con.commit()
    f = firma(con, a.id)
    print(f"#{a.id} {f['nazwa']}: {a.status}" + (f", follow-up {f['follow_up']}" if f["follow_up"] else ""))


def cmd_dzisiaj(a):
    con = db(); d = dzis()
    fu = con.execute("SELECT * FROM firmy WHERE follow_up<=? AND status NOT IN ('klient','zimny') ORDER BY follow_up", (d,)).fetchall()
    nowe = con.execute("SELECT * FROM firmy WHERE status='nowy' ORDER BY (telefon=''), id LIMIT ?", (a.limit,)).fetchall()
    gotowe = con.execute("SELECT * FROM firmy WHERE status='demo_gotowe' ORDER BY id").fetchall()
    print(f"== Follow-upy ({len(fu)})")
    for r in fu:
        print(f"  #{r['id']:<4} {r['nazwa'][:30]:30} {r['status']:10} {r['telefon']:16} -> pipeline.py wiadomosc {r['id']} --rodzaj followup")
    print(f"\n== Dema gotowe, do wysłania ({len(gotowe)})")
    for r in gotowe:
        print(f"  #{r['id']:<4} {r['nazwa'][:30]:30} {r['telefon']:16} -> pipeline.py wiadomosc {r['id']}; potem: status {r['id']} kontakt")
    print(f"\n== Nowe firmy, zrób demo ({len(nowe)} z limitu {a.limit})")
    for r in nowe:
        brak = " (brak telefonu: edytuj)" if not r["telefon"] else ""
        print(f"  #{r['id']:<4} {r['nazwa'][:30]:30} {r['adres'][:28]:28}{brak} -> pipeline.py demo {r['id']}")
    if gotowe or nowe:
        print("\nPo demach: pipeline.py publikuj")


def _wypelnij_umowe(szablon: str, f, nazwa_pakietu: str, cena: int, dni: int, zakres: str) -> str:
    """Podmienia tylko pola klienta i zakresu; dane Wykonawcy i konto zostają do ręcznego uzupełnienia."""
    zam = f"{f['nazwa']}, {f['adres']}, {f['miasto']}"
    for stare, nowe in [
        ("zawarta dnia {data} w {miasto}", f"zawarta dnia {dzis()} w {f['miasto'].split()[-1] if f['miasto'] else '{miasto}'}"),
        ("**Zamawiającym:** {nazwa firmy}, {adres}", f"**Zamawiającym:** {zam}"),
        ("{wizytówka / landing page / strona firmowa}", nazwa_pakietu.lower()),
        ("{liczba} sekcji / podstron: {lista}", f"{zakres}"),
        ("({liczba} dni roboczych", f"({dni} dni roboczych"),
        ("Wynagrodzenie wynosi {kwota} zł brutto", f"Wynagrodzenie wynosi {cena} zł brutto"),
        ("50% ({kwota}) zaliczki", f"50% ({cena // 2} zł) zaliczki"),
        ("50% ({kwota}) w ciągu", f"50% ({cena - cena // 2} zł) w ciągu"),
    ]:
        szablon = szablon.replace(stare, nowe, 1)
    return szablon


def cmd_wycena(a):
    con = db(); f = firma(con, a.id)
    nazwa, cena, czas, zakres = PAKIETY[a.pakiet]
    cena = a.cena or cena
    tekst = f"""Temat: Strona dla {f['nazwa']} – wycena i termin

Dzień dobry,

dziękuję za rozmowę. Podsumowanie tego, co ustaliliśmy, i wycena:

Zakres: {nazwa}: {zakres}. Wersja mobilna, podstawowe SEO, pomoc z domeną i hostingiem,
publikacja, instrukcja, jak samemu zmieniać teksty. 2 rundy poprawek w trakcie i 30 dni
na zgłaszanie błędów po publikacji.

Cena: {cena} zł (stała, bez dopłat w trakcie)
Płatność: 50% zaliczki na start, 50% po publikacji
Termin: podgląd w ciągu {a.dni} dni roboczych od otrzymania materiałów i zaliczki

Co potrzebuję od Państwa: krótki formularz (5–10 minut): {a.brief}, logo i zdjęcia, jeśli są.

Jeśli wycena pasuje, odsyłam umowę do podpisu (1 strona) i zaczynamy.

Pozdrawiam,
{mockup.AUTHOR_NAME}
{mockup.AUTHOR_PHONE}
{mockup.AUTHOR_SITE}
"""
    plik = OUT / f"{mockup.slugify(f['nazwa'])}-wycena.txt"
    plik.write_text(tekst, encoding="utf-8")
    ustaw_status(con, a.id, "wycena", f"wycena {cena} zł, {a.pakiet}"); con.commit()
    print(tekst); print(f"--- zapisane: {plik}")


def cmd_umowa(a):
    con = db(); f = firma(con, a.id)
    nazwa, cena, czas, zakres = PAKIETY[a.pakiet]
    cena = a.cena or cena
    szablon = (SZABLONY / "umowa.md").read_text(encoding="utf-8")
    czesci = szablon.split("\n---\n")
    tresc = czesci[1] if len(czesci) >= 3 else szablon
    tekst = _wypelnij_umowe(tresc, f, nazwa, cena, a.dni, zakres)
    plik = OUT / f"{mockup.slugify(f['nazwa'])}-umowa.md"
    plik.write_text(tekst, encoding="utf-8")
    ustaw_status(con, a.id, "umowa", f"umowa {cena} zł"); con.commit()
    print(f"Umowa zapisana: {plik}\nUzupełnij pola w nawiasach {{...}} (Twoje dane, NIP klienta, konto), zapisz jako PDF, wyślij do podpisu.")


def cmd_raport(a):
    con = db()
    print("Lejek:")
    for s in STATUSY:
        n = con.execute("SELECT COUNT(*) FROM firmy WHERE status=?", (s,)).fetchone()[0]
        print(f"  {s:12} {n:>4}  {'#' * n}")
    kontakty = con.execute("SELECT COUNT(*) FROM firmy WHERE status NOT IN ('nowy','demo_gotowe')").fetchone()[0]
    rozmowy = con.execute("SELECT COUNT(*) FROM firmy WHERE status IN ('rozmowa','wycena','umowa','klient')").fetchone()[0]
    klienci = con.execute("SELECT COUNT(*) FROM firmy WHERE status='klient'").fetchone()[0]
    if kontakty:
        print(f"\nKontakty -> rozmowy: {rozmowy}/{kontakty} ({100*rozmowy//kontakty}%)  (cel: >10%; jeśli mniej, popraw wiadomość)")
    if rozmowy:
        print(f"Rozmowy -> klienci:  {klienci}/{rozmowy} ({100*klienci//rozmowy}%)  (cel: >20%; jeśli mniej, popraw wycenę/rozmowę)")


def cmd_export(a):
    con = db()
    rows = con.execute("SELECT * FROM firmy ORDER BY id").fetchall()
    plik = OUT / "crm-export.csv"
    with open(plik, "w", newline="", encoding="utf-8") as fh:
        w = csv.writer(fh); w.writerow(rows[0].keys() if rows else []); w.writerows(rows)
    print(f"{len(rows)} wierszy -> {plik} (import do Google Sheets: Plik -> Importuj)")


def cmd_historia(a):
    con = db(); f = firma(con, a.id)
    print(f"#{f['id']} {f['nazwa']} [{f['status']}] {f['telefon']} {f['adres']}, {f['miasto']}\nDemo: {f['demo'] or '-'}\nNotatki:\n{f['notatki'] or '-'}")
    for z in con.execute("SELECT kiedy, co FROM zdarzenia WHERE firma_id=? ORDER BY id", (a.id,)):
        print(f"  {z['kiedy']}  {z['co']}")


def main() -> None:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = p.add_subparsers(dest="cmd", required=True)

    s = sub.add_parser("szukaj", help="pobierz firmy bez strony z OSM do bazy")
    s.add_argument("--typ", required=True, choices=leads.TAGI.keys()); s.add_argument("--gdzie", required=True)
    s.add_argument("--wszystkie", action="store_true"); s.set_defaults(fn=cmd_szukaj)

    s = sub.add_parser("lista", help="pokaż firmy"); s.add_argument("--status", choices=STATUSY); s.set_defaults(fn=cmd_lista)

    s = sub.add_parser("edytuj", help="popraw dane firmy"); s.add_argument("id", type=int)
    for k in ("nazwa", "typ", "telefon", "adres", "miasto", "email", "okolica"):
        s.add_argument(f"--{k}")
    s.set_defaults(fn=cmd_edytuj)

    s = sub.add_parser("demo", help="wygeneruj demo strony"); s.add_argument("id", type=int); s.set_defaults(fn=cmd_demo)
    s = sub.add_parser("publikuj", help="git add/commit/push dem"); s.set_defaults(fn=cmd_publikuj)

    s = sub.add_parser("wiadomosc", help="tekst wiadomości do firmy"); s.add_argument("id", type=int)
    s.add_argument("--rodzaj", choices=WIADOMOSCI.keys(), default="pierwsza"); s.set_defaults(fn=cmd_wiadomosc)

    s = sub.add_parser("status", help="zmień status (follow-up ustawia się sam)"); s.add_argument("id", type=int)
    s.add_argument("status", choices=STATUSY); s.add_argument("--notatka"); s.set_defaults(fn=cmd_status)

    s = sub.add_parser("dzisiaj", help="co dziś zrobić"); s.add_argument("--limit", type=int, default=10); s.set_defaults(fn=cmd_dzisiaj)

    s = sub.add_parser("wycena", help="mail z wyceną"); s.add_argument("id", type=int)
    s.add_argument("--pakiet", choices=PAKIETY.keys(), default="wizytowka"); s.add_argument("--cena", type=int)
    s.add_argument("--dni", type=int, default=7); s.add_argument("--brief", default="[link do briefu]"); s.set_defaults(fn=cmd_wycena)

    s = sub.add_parser("umowa", help="umowa z szablonu"); s.add_argument("id", type=int)
    s.add_argument("--pakiet", choices=PAKIETY.keys(), default="wizytowka"); s.add_argument("--cena", type=int)
    s.add_argument("--dni", type=int, default=7); s.set_defaults(fn=cmd_umowa)

    s = sub.add_parser("raport", help="lejek"); s.set_defaults(fn=cmd_raport)
    s = sub.add_parser("export", help="CSV do arkusza"); s.set_defaults(fn=cmd_export)
    s = sub.add_parser("historia", help="notatki i zdarzenia firmy"); s.add_argument("id", type=int); s.set_defaults(fn=cmd_historia)

    a = p.parse_args()
    a.fn(a)


if __name__ == "__main__":
    main()
