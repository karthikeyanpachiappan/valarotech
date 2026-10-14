# Valarotech website

Company website for **Valarotech**, an IT services company focused on DevOps, cloud and automation.

It is a static site: plain HTML, CSS and vanilla JavaScript, with **no build step**. You can host it directly on GitHub Pages or on any static host.

## Structure

```
.
├── index.html          Home: hero, services overview, why us, process, tech stack, CTA
├── about.html          Company story, mission & vision, values, approach
├── services.html       Detailed sections for every service (with in-page nav)
├── privacy.html        Privacy Policy (DPDP Act 2023)
├── terms.html          Terms of Use
├── 404.html            Custom page-not-found page
├── robots.txt, sitemap.xml  Search engine files (update sitemap when adding pages)
├── contact.html        Contact form (email via FormSubmit + Google Sheets) + contact details
├── google-apps-script/ Apps Script that saves enquiries to a Google Sheet
├── assets/
│   ├── css/style.css   All styles (mobile-first, CSS variables at the top for colours/fonts)
│   ├── js/main.js      Mobile menu, scroll effects, counters, contact form validation
│   ├── img/favicon.svg Browser-tab icon (same as the logo mark)
│   └── brand/          Logo files: mark (SVG), horizontal logos, profile picture, social banners
├── .nojekyll           Tells GitHub Pages to serve files as-is
└── README.md
```

- **Shared header and footer** are repeated in each HTML file (no build step). If you change the nav or footer, update it in all four pages. Each block is marked with `HEADER (shared …)` / `FOOTER (shared …)` comments.
- **Colours and fonts** live in the `:root` block at the top of `assets/css/style.css`.
- Service sections use anchors so you can link straight to them: `services.html#devops`, `#docker`, `#iac`, `#cicd`, `#devsecops`, `#kubernetes`, `#dataops`, `#cloud`, `#custom`.
- The contact form accepts `?service=<id>` to pre-select a service, e.g. `contact.html?service=cloud`.

## Contact details

Already set in `contact.html` and in the footer of every page: email `karthikeyanp@valarotech.com`, phone `+91 79049 31067`, location Salem, Tamil Nadu, India. If they change, update all four pages.

## Placeholders to fill in

Search the HTML for `PLACEHOLDER` to find each spot.

| What | Where | Current placeholder |
|---|---|---|
| Business hours | `contact.html` | `Monday to Friday, 9:00 to 18:00 IST`. Confirm or change. |
| Social links (LinkedIn, GitHub, X) | Footer of all pages, `href="#"` | `#` |
| Home page stats | `index.html`, "Why Valarotech" section | `50+` pipelines, `10x` faster releases, `40%` cost savings, `24/7` support. **Replace with real figures or remove them.** |
| Company story | `about.html`, "Our story" section | Generic founding story. Adjust to Valarotech's real history (founding year, founders, location). |
| Testimonials | `index.html`, "Our promise" section | Shows commitment cards for now. A testimonial card template is commented out in the HTML for when you have real client quotes. |
| Team names | Not on the site yet | Add a team section to `about.html` if you want one. |

## Contact form

The form on `contact.html` is delivered by [FormSubmit](https://formsubmit.co) (free, no account) to **karthikeyanp@valarotech.com**.

- **One-time activation:** the very first submission triggers an email from FormSubmit to karthikeyanp@valarotech.com titled "Action Required: Activate FormSubmit". Click **Activate Form** in it. Until then, submissions are not delivered.
- After activating, FormSubmit's email also offers a random alias string. You can replace the email in the form's `action` URL with that alias (`https://formsubmit.co/<alias>`) to hide the address from bots.
- To change the recipient, edit the email in the form's `action` URL in `contact.html`.
- `assets/js/main.js` validates the fields, then posts to FormSubmit's AJAX endpoint and shows the success or error message inline. Without JavaScript the browser posts directly and is redirected back to `contact.html?sent=1`.
- **Google Sheets copy:** each enquiry is also appended to a Google Sheet through a small Apps Script web app. Setup steps and the script are in [`google-apps-script/`](google-apps-script/README.md); paste the web app URL into the form's `data-sheet-url` attribute in `contact.html`. While it is empty, the sheet step is skipped.
- Fields collected: name, email, contact number, company, service, message.
- Hidden fields: `_subject` (email subject), `_template=table` (nicer email layout), `_next` (redirect for non-JS), `_honey` (spam honeypot).

## Previewing locally (optional)

Open `index.html` in a browser, or run a small server from the repo folder:

```bash
python -m http.server 8000
```

Then visit <http://localhost:8000>.

## Publishing with GitHub Pages

1. On GitHub, open the repository, then **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
3. Pick the branch, either **`dev`** (to preview now) or **`main`** (after you merge), and the **`/ (root)`** folder. Click **Save**.
4. After a minute or two the site is live at `https://karthikeyanpachiappan.github.io/valarotech/`.

All links are relative, so the site works both at that project URL and on a custom domain.

**Custom domain (optional):** in **Settings → Pages → Custom domain**, enter e.g. `www.valarotech.com`, then add a `CNAME` DNS record pointing `www` to `karthikeyanpachiappan.github.io` at your domain registrar. Tick **Enforce HTTPS** once the certificate is issued.

## Branching

Work happens on `dev`. When you're happy with it, open a pull request from `dev` into `main` and merge it. If Pages is set to deploy from `main`, the live site updates automatically.
