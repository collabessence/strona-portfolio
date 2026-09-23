/**
 * Przypomnienia o follow-upie z arkusza CRM (Google Sheets).
 *
 * 1. Zaimportuj crm.csv do Google Sheets (Plik → Importuj).
 * 2. Rozszerzenia → Apps Script → wklej ten plik → Zapisz.
 * 3. Uruchom raz funkcję `ustawWyzwalacz` (poprosi o uprawnienia).
 *    Od tej pory codziennie o 8:00 dostajesz mail z listą firm,
 *    które mają dziś (lub wcześniej) zaplanowany follow-up.
 *
 * Statusy (kolumna G): nowy, wyslane_demo, rozmowa, wycena, umowa, zimny, klient
 */

const ARKUSZ = 'Arkusz1';        // nazwa zakładki
const MAIL = 'collabessence@gmail.com';
const KOL_FIRMA = 1, KOL_TELEFON = 3, KOL_LINK = 6, KOL_STATUS = 7, KOL_FOLLOWUP = 9, KOL_NOTATKI = 10;

function przypomnijFollowUpy() {
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(ARKUSZ);
  const rows = sh.getDataRange().getValues().slice(1);
  const dzis = new Date(); dzis.setHours(0, 0, 0, 0);

  const doZrobienia = rows.filter(r => {
    const fu = r[KOL_FOLLOWUP - 1];
    const status = String(r[KOL_STATUS - 1]);
    return fu instanceof Date && fu <= dzis && !['zimny', 'klient'].includes(status);
  });
  if (!doZrobienia.length) return;

  const linie = doZrobienia.map(r =>
    `• ${r[KOL_FIRMA - 1]} (${r[KOL_STATUS - 1]}) – ${r[KOL_TELEFON - 1]}\n  ${r[KOL_LINK - 1]}\n  ${r[KOL_NOTATKI - 1] || ''}`
  );
  MailApp.sendEmail({
    to: MAIL,
    subject: `Follow-up dziś: ${doZrobienia.length} firm`,
    body: linie.join('\n\n') + '\n\nPo kontakcie przesuń datę follow-upu o 4–7 dni albo zmień status.',
  });
}

/** Po wpisaniu daty kontaktu (kolumna H) ustawia follow-up +3 dni, jeśli pusty. */
function onEdit(e) {
  const r = e.range;
  if (r.getSheet().getName() !== ARKUSZ || r.getColumn() !== 8 || r.getRow() === 1) return;
  const fuCell = r.getSheet().getRange(r.getRow(), KOL_FOLLOWUP);
  if (fuCell.getValue() === '' && r.getValue() instanceof Date) {
    const d = new Date(r.getValue()); d.setDate(d.getDate() + 3);
    fuCell.setValue(d);
  }
}

function ustawWyzwalacz() {
  ScriptApp.getProjectTriggers().forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('przypomnijFollowUpy').timeBased().everyDays(1).atHour(8).create();
}
