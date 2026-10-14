/**
 * Valarotech contact form -> Google Sheet
 *
 * Paste this into Extensions > Apps Script of the Google Sheet that should
 * collect enquiries, then deploy it as a web app (see README.md in this folder).
 * Each form submission from valarotech.com/contact.html is appended as a row.
 */

var SHEET_NAME = "Enquiries";
var COLUMNS = ["Timestamp", "Name", "Email", "Phone", "Company", "Service", "Message", "Auto-reply"];

// Auto-reply settings. The reply is sent from REPLY_FROM when that address is set
// up in Gmail as a "Send mail as" alias; otherwise from this Google account, with
// the display name and Reply-To below so answers still reach REPLY_FROM.
var AUTO_REPLY = true;
var REPLY_FROM = "karthikeyanp@valarotech.com";
var REPLY_NAME = "Valarotech";
var REPLY_PHONE = "+91 79049 31067";
var WEBSITE = "https://valarotech.com";

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
      clean(p.message),
      ""
    ]);
    var row = sheet.getLastRow();
    lock.releaseLock();

    // The row is saved first, so a mail problem never loses an enquiry.
    sheet.getRange(row, COLUMNS.length).setValue(sendAutoReply(p));
    return respond({ result: "success" });
  } finally {
    lock.releaseLock();
  }
}

// Sends the thank-you email to the enquirer and returns a status for the sheet.
function sendAutoReply(p) {
  if (!AUTO_REPLY) return "off";
  var to = String(p.email || "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) return "skipped: invalid email";

  var name = String(p.name || "").trim().split(/\s+/)[0] || "there";
  var service = String(p.service || "").trim();
  var subject = "Thanks for contacting Valarotech";

  var text =
    "Hi " + name + ",\n\n" +
    "Thank you for reaching out to Valarotech" + (service ? " about " + service : "") + ". " +
    "We have received your enquiry and will get back to you within one business day.\n\n" +
    "If it's urgent, you can call us on " + REPLY_PHONE + " or simply reply to this email.\n\n" +
    "Best regards,\nKarthikeyan P\nValarotech\n" + REPLY_FROM + " | " + REPLY_PHONE + "\n" + WEBSITE;

  var html =
    '<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#1f2937;max-width:560px">' +
    "<p>Hi " + esc(name) + ",</p>" +
    "<p>Thank you for reaching out to <strong>Valarotech</strong>" + (service ? " about <strong>" + esc(service) + "</strong>" : "") + ". " +
    "We have received your enquiry and will get back to you within <strong>one business day</strong>.</p>" +
    "<p>If it's urgent, you can call us on " + esc(REPLY_PHONE) + " or simply reply to this email.</p>" +
    '<p style="margin-top:24px">Best regards,<br><strong>Karthikeyan P</strong><br>Valarotech<br>' +
    '<a href="mailto:' + REPLY_FROM + '">' + REPLY_FROM + "</a> | " + esc(REPLY_PHONE) + "<br>" +
    '<a href="' + WEBSITE + '">' + WEBSITE.replace("https://", "") + "</a></p>" +
    '<hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0">' +
    '<p style="font-size:13px;color:#6b7280">Your message:<br>' + esc(p.message).replace(/\n/g, "<br>") + "</p>" +
    "</div>";

  var options = { name: REPLY_NAME, replyTo: REPLY_FROM, htmlBody: html };
  var viaAlias = GmailApp.getAliases().indexOf(REPLY_FROM) !== -1;
  if (viaAlias) options.from = REPLY_FROM;

  try {
    GmailApp.sendEmail(to, subject, text, options);
    return viaAlias ? "sent from " + REPLY_FROM : "sent (reply-to " + REPLY_FROM + ")";
  } catch (err) {
    return "failed: " + err.message;
  }
}

function esc(value) {
  return String(value || "").replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
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
    sheet.setFrozenRows(1);
  }
  // Keep the header row current if columns were added in a later version
  sheet.getRange(1, 1, 1, COLUMNS.length).setValues([COLUMNS]).setFontWeight("bold");
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
