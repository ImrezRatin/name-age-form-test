/**
 * Google Apps Script backend for the Name & Age Register.
 * Stores every submission as a row in the Google Sheet this script is attached to.
 *
 * Setup (see README.md): Google Sheet → Extensions → Apps Script → paste this file →
 * Deploy → New deployment → Web app → Execute as: Me, Who has access: Anyone → Deploy.
 */

const SHEET_NAME = 'Entries';

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['Timestamp', 'Name', 'Age']);
    sheet.getRange('A1:C1').setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/** Called when the web page POSTs a new entry. */
function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const data = JSON.parse(e.postData.contents || '{}');
    const name = String(data.name || '').trim().replace(/\s+/g, ' ').slice(0, 80);
    const age = Number(data.age);
    if (name.length < 2) return json_({ ok: false, error: 'Name is required' });
    if (!Number.isInteger(age) || age < 1 || age > 120) return json_({ ok: false, error: 'Age must be between 1 and 120' });
    getSheet_().appendRow([new Date(), name, age]);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/** Called when the web page loads the list of entries (newest first, max 500). */
function doGet(e) {
  try {
    const values = getSheet_().getDataRange().getValues();
    const entries = values.slice(1) // skip header
      .filter((r) => r[1] !== '')
      .map((r) => ({ time: r[0], name: r[1], age: r[2] }))
      .reverse()
      .slice(0, 500);
    return json_({ ok: true, entries: entries });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
