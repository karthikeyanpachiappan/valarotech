# Saving contact-form enquiries to Google Sheets

`Code.gs` is a small Google Apps Script. Once deployed, every enquiry sent from `contact.html` is added as a new row (Timestamp, Name, Email, Phone, Company, Service, Message) in a sheet called **Enquiries**. Emails via FormSubmit keep working alongside it.

## One-time setup (about 3 minutes)

1. Create a new Google Sheet (https://sheets.new), for example named **Valarotech Enquiries**.
2. In the sheet, open **Extensions → Apps Script**.
3. Delete the sample code, paste the full contents of `Code.gs`, and click **Save** (disk icon).
4. Click **Deploy → New deployment**.
   - Click the gear next to "Select type" and choose **Web app**.
   - Description: `Valarotech contact form`
   - Execute as: **Me**
   - Who has access: **Anyone** (needed so the public website can post to it; it can only append rows)
   - Click **Deploy**, then **Authorize access** and allow it with your Google account. If you see "Google hasn't verified this app", click **Advanced → Go to (project name)**; it is your own script.
5. Copy the **Web app URL** (it looks like `https://script.google.com/macros/s/AKfy.../exec`).
6. In `contact.html`, paste it into the form's `data-sheet-url="..."` attribute, then commit and push.

To check the deployment, open the Web app URL in a browser: it should say "Valarotech enquiry endpoint is running."

## Changing the script later

After editing `Code.gs` in Apps Script, use **Deploy → Manage deployments → Edit (pencil) → Version: New version → Deploy**. This keeps the same URL, so the website does not need changing.
