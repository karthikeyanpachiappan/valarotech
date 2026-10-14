/**
 * Valarotech contact form -> Google Sheet
 *
 * Paste this into Extensions > Apps Script of the Google Sheet that should
 * collect enquiries, then deploy it as a web app (see README.md in this folder).
 * Each form submission from valarotech.com/contact.html is appended as a row.
 */

var SHEET_NAME = "Enquiries";
var COLUMNS = ["Timestamp", "Name", "Email", "Phone", "Company", "Service", "Message"];

function doPost(e) {
  var p = (e && e.parameter) || {};

  // Spam bots fill the hidden honeypot field; real visitors never see it.
  if (p._honey) return respond({ result: "ignored" });

  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var sheet = getSheet();
    sheet.appendRow([
      new Date(),
      clean(p.name),
      clean(p.email),
      clean(p.phone),
      clean(p.company),
      clean(p.service),
      clean(p.message)
    ]);
    return respond({ result: "success" });
  } finally {
    lock.releaseLock();
  }
}

// Lets you open the web app URL in a browser to check it is deployed.
function doGet() {
  return respond({ result: "ok", message: "Valarotech enquiry endpoint is running." });
}

function getSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(COLUMNS);
    sheet.getRange(1, 1, 1, COLUMNS.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// Trim, cap length, and stop values being read as spreadsheet formulas.
function clean(value) {
  var s = String(value || "").trim().slice(0, 5000);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function respond(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
