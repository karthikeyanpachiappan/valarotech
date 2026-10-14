# Valarotech website

Company website for **Valarotech**, an IT services company focused on DevOps, cloud and automation.

It is a static site: plain HTML, CSS and vanilla JavaScript, with **no build step**. You can host it directly on GitHub Pages or on any static host.

## Structure

```
.
├── index.html          Home: hero, services overview, why us, process, tech stack, CTA
├── about.html          Company story, mission & vision, values, approach
├── services.html       Detailed sections for every service (with in-page nav)
├── contact.html        Contact form (front-end only) + contact details
├── assets/
│   ├── css/style.css   All styles (mobile-first, CSS variables at the top for colours/fonts)
│   ├── js/main.js      Mobile menu, scroll effects, counters, contact form validation
│   └── img/favicon.svg Logo mark / favicon
├── .nojekyll           Tells GitHub Pages to serve files as-is
└── README.md
```

- **Shared header and footer** are repeated in each HTML file (no build step). If you change the nav or footer, update it in all four pages. Each block is marked with `HEADER (shared …)` / `FOOTER (shared …)` comments.
- **Colours and fonts** live in the `:root` block at the top of `assets/css/style.css`.
- Service sections use anchors so you can link straight to them: `services.html#devops`, `#software`, `#iac`, `#cloud`, `#devsecops`, `#training`, `#custom`.
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
| Contact form endpoint | `contact.html`, `<form action="#">` | Not connected. See below. |
| Team names | Not on the site yet | Add a team section to `about.html` if you want one. |
| Logo | Header/footer (`.logo-mark` "V") and `assets/img/favicon.svg` | Simple gradient "V" mark. Swap for your real logo. |

## Wiring up the contact form

GitHub Pages only serves static files, so the form needs an external service to deliver messages. Until it is connected, submitting shows a "not connected yet" message and nothing is sent.

**Formspree (simplest):**

1. Sign up at <https://formspree.io> and create a form. Copy its endpoint, for example `https://formspree.io/f/abcdwxyz`.
2. In `contact.html`, change `action="#"` to that endpoint (keep `method="POST"`).
3. Commit and push. The JavaScript only intercepts the submission while the action is `#`, so the browser will post to Formspree normally and validation still runs first.

The hidden `_gotcha` field is a Formspree honeypot for spam bots. Alternatives that work the same way: Web3Forms, Getform, Basin, or a Netlify / Cloudflare serverless function.

If you'd rather stay on the page and show an inline success message, replace the placeholder block in `assets/js/main.js` (marked `TODO`) with something like:

```js
e.preventDefault();
fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
  .then(function (r) {
    if (!r.ok) throw new Error();
    status.className = "form-status success";
    status.textContent = "Thanks! We'll be in touch within one business day.";
    form.reset();
  })
  .catch(function () {
    status.className = "form-status error";
    status.textContent = "Sorry, something went wrong. Please email us directly.";
  });
```

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
