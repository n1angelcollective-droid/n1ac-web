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

`n1-ac.com` currently resolves to Squarespace. To move it:

1. Deploy to Netlify first and confirm the `.netlify.app` URL works.
2. Netlify → **Domain management** → add `n1-ac.com` and `www.n1-ac.com`.
3. Update the DNS records at your registrar to the values Netlify shows.
4. Wait for DNS to propagate, confirm HTTPS is issued, then cancel Squarespace.

Do step 4 last — cancelling Squarespace before DNS moves will take the site down.

## Editing content

Section copy lives in `index.html`. The typographic roles:

- `.section__label` — small mono uppercase category, with the `01`–`05` numeral
- `h2` — the short declarative statement
- `.section__claim` — brighter, slightly larger emphasis line
- `.section__refrain` — italic emphasis line
- `.cta` — underlined mono link with trailing arrow

Colours and the content column width are CSS variables at the top of `style.css`.
