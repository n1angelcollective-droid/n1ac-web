# N1AC

Static site for Neuron One Angel Collective.

```
index.html    home
submit.html   founder submission form   → /submit
apply.html    investor application form → /apply
thanks.html   post-submit confirmation  → /thanks
style.css     all styling
script.js     hero glyphs + scroll reveals (home only)
serve.py      local dev server
netlify.toml  deploy + security headers
```

No build step, no dependencies. Edit the HTML directly.

## Run locally

```bash
python serve.py 4321
```

Then open http://127.0.0.1:4321.

Use `serve.py` rather than `python -m http.server` — it resolves extensionless
URLs (`/submit` → `submit.html`) the way Netlify does, so local matches production.

## Deploy to Netlify

1. Push this folder to a GitHub repo.
2. Netlify → **Add new site** → **Import an existing project** → pick the repo.
3. Leave build command empty, publish directory `.`, then deploy.

Forms work automatically — Netlify detects `data-netlify="true"` at deploy time
and captures submissions under **Site configuration → Forms**. Add a notification
there to get an email on each submission, otherwise they only appear in the dashboard.

Each form has a honeypot field (`bot-field`) to absorb basic spam bots.

## Point the domain at it

`n1-ac.com` is registered through **Squarespace Domains** (expires 2027-05-06).
The plan is to keep the domain registered there and cancel only the website
subscription — registration and the website plan are billed separately.

1. Deploy to Netlify and confirm the temporary `*.netlify.app` URL works.
2. Netlify → **Domain management** → **Add a domain** → `n1-ac.com`.
   Choose to keep your existing DNS host when asked. Netlify then shows the
   exact records to create — use those values, not the ones below, if they differ.
3. Squarespace → **Domains** → `n1-ac.com` → **DNS settings**. Remove the existing
   Squarespace A records and the `www` CNAME, then add:

   | Type  | Host | Value                    |
   |-------|------|--------------------------|
   | A     | `@`  | Netlify's load balancer IP |
   | CNAME | `www`| `<your-site>.netlify.app` |

4. Wait for DNS to propagate (usually under an hour, up to 48h) and confirm
   Netlify has issued the HTTPS certificate.
5. Only then: Squarespace → **Billing** → cancel the **website subscription**.
   Do not cancel or delete the domain.

Step 5 must come last — cancelling before DNS propagates takes the site offline.

Two things to watch:

- Squarespace continues to manage DNS for domains registered with them even
  without an active website plan, so DNS keeps working after cancellation.
- If the domain came free with an annual website plan, renewal in May 2027 may
  become a separate charge. Check that auto-renew is still on afterwards.

Verify the cutover with:

```bash
nslookup n1-ac.com
curl -sI https://n1-ac.com | head -1
```

## Editing content

Section copy lives in `index.html`. The typographic roles:

- `.section__label` — small mono uppercase category, with the `01`–`05` numeral
- `h2` — the short declarative statement
- `.section__claim` — brighter, slightly larger emphasis line
- `.section__refrain` — italic emphasis line
- `.cta` — underlined mono link with trailing arrow

Colours and the content column width are CSS variables at the top of `style.css`.
