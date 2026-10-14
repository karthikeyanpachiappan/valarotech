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

## Automatic reply to the enquirer

After saving the row, the script emails the visitor a short thank-you ("We have received your enquiry and will get back to you within one business day"), signed by Karthikeyan P with the Valarotech email, phone and website. The **Auto-reply** column in the sheet records whether it was sent. Settings (`AUTO_REPLY`, `REPLY_FROM`, `REPLY_NAME`, `REPLY_PHONE`) are at the top of `Code.gs`.

Sending email needs Gmail permission, so after pasting a new version of `Code.gs`:

1. In Apps Script, select the function **`doGet`** and click **Run**, then approve the new Gmail permission (use the same incognito window / Google account as before).
2. **Deploy → Manage deployments → pencil (Edit) → Version: New version → Deploy.** The URL stays the same.

### Sending as karthikeyanp@valarotech.com

Without extra setup, the reply is sent from the Google account that owns the script, shown as **"Valarotech"**, with Reply-To set to karthikeyanp@valarotech.com, so the enquirer's answers land in that inbox.

To make the email come **from** karthikeyanp@valarotech.com, add it as a Gmail alias on the Google account that owns the script:

1. Gmail → **Settings (gear) → See all settings → Accounts and Import → Send mail as → Add another email address**.
2. Name `Valarotech`, email `karthikeyanp@valarotech.com`, click **Next Step**.
3. SMTP server `smtp.hostinger.com`, port `587`, username `karthikeyanp@valarotech.com`, your Hostinger email password, **Secured connection using TLS** (port 465 needs SSL instead).
4. Enter the confirmation code Gmail sends to karthikeyanp@valarotech.com.

The script detects the alias automatically; no code change is needed. The sheet's Auto-reply column then shows "sent from karthikeyanp@valarotech.com".

Consumer Gmail accounts can send about 100 automatic emails per day, which is plenty for enquiries.
