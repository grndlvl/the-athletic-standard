# The Athletic Standard — theathleticstandard.com

Static marketing site for **The Athletic Standard**, a sports massage and
athletic rehabilitation studio at 211 Hudson Trace Suite C, Augusta, GA 30907.
Single-page, no build step, deployed to GitHub Pages, with a full
SEO / AI-forward / social-sharing layer and CI-enforced accessibility gates.

## File map

```
index.html                     All content & structure (single-page scroll)
styles.css                     Full theme — palette in :root custom properties
script.js                      Nav toggle, scroll reveal, footer year
img/                           Served images (webp + jpg/png via <picture>), favicons, OG image
design/                        Source artwork & originals — committed for reference,
                               excluded from the deployed artifact by the workflow
robots.txt                     Welcomes search + AI crawlers, points at sitemap
llms.txt                       Plain-text brand summary for AI answer engines
sitemap.xml                    Single-URL sitemap
CNAME                          Custom domain (theathleticstandard.com)
.nojekyll                      Serve files as-is on GitHub Pages
package.json                   Dev-only tooling (lint + a11y) — nothing ships
playwright.config.js           Serves the site and runs tests/a11y/
tests/a11y/axe.spec.js         axe-core scan + keyboard-navigation tests
.pa11yci.json                  Pa11y WCAG2AA config
.github/workflows/deploy-pages.yml   Quality gate (lint + a11y) → deploy
```

## Local dev

No build step — open `index.html` directly, or serve it:

```bash
npm install
npm run serve          # http://localhost:4173
```

Quality gates (these also run in CI and block deploy):

```bash
npm run lint           # html-validate + stylelint + prettier --check
npx playwright install chromium   # first time only
npm run a11y           # axe-core (Playwright) + Pa11y against the served site
```

## Deploy

Pushing to `main` runs the quality gate and deploys to GitHub Pages
(repo **Settings → Pages → Source: GitHub Actions**). The workflow assembles
a clean `_site/` containing only the served files — `design/`, `tests/`, and
dev configs never reach production.

Custom domain: `CNAME` contains `theathleticstandard.com`. The domain
currently points at the old Carrd site — to cut over:

1. Update DNS to GitHub Pages (apex A records 185.199.108.153 / .109 / .110
   / .111, or `www` CNAME to `grndlvl.github.io`).
2. Set the custom domain: `gh api -X PUT repos/grndlvl/the-athletic-standard/pages -f cname=theathleticstandard.com`
   (for Actions-based deploys GitHub ignores the repo's `CNAME` file).
3. **Flip the share URLs back**: `og:image`, `twitter:image`, and `og:url` in
   `index.html` temporarily point at `grndlvl.github.io/the-athletic-standard/`
   so Facebook/Twitter previews work pre-cutover (the real domain 404s the
   image and FB fell back to the transparent logo). After DNS cutover, change
   all three back to `https://theathleticstandard.com/…`.
4. Re-scrape in Facebook's Sharing Debugger (developers.facebook.com/tools/debug)
   so FB drops its cached preview.

Canonical, sitemap, and robots URLs already use `https://theathleticstandard.com/`.

## Brand & design notes

- **Palette** (in `styles.css` `:root`): near-black `#0A0B0D`, off-white
  `#F4F6F8`, signature cyan `#00F0FF` — sampled from the existing site and
  wordmark. Dark theme throughout; cyan is used on dark only (contrast-safe).
- **Type**: [Sora](https://fonts.google.com/specimen/Sora) (Google Fonts) —
  the brand font on the existing site. 800 uppercase for display, 300 body.
- **Signature moves**: stacked white wordmark hero on black; scrolling sports
  marquee (paused under `prefers-reduced-motion`); cyan-edged service cards.
- **Assets** (`design/` holds originals): logo, team photos, and gallery
  photos harvested from theathleticstandard.com (the business's own
  published assets). OG image composed from the wordmark + Sora.

## ⚠️ Verify before launch

Everything below was compiled from public sources (the existing
theathleticstandard.com Carrd site, July 2026) — confirm with the owner.
Already confirmed: **prices** ($75 / $120 / $175 / $100 / $150, 5-pack 7%,
10-pack 10%, $100 out-of-office fee — confirmed July 2026).

- **Hours** — M–F 9am–6pm, Sat 9am–1pm, by appointment only. Sunday is not
  listed anywhere; the site intentionally omits it rather than claiming
  "closed".
- **Email** — `TheAthleticStandard@gmail.com` was decoded from the current
  site's obfuscated mailto link. Confirm spelling/capitalization.
- ~~**Facebook URL**~~ — confirmed: the owner's screenshot of the page's
  reviews tab shows profile ID 61563394255000, matching the linked URL.
- **Team bios & credentials** — LMT/BSKin/MMP/MsK/CPT credentials and bios
  were taken from the current site (bios lightly copyedited). Confirm all
  three therapists are still with the studio and credentials are accurate.
- **Team photos** — Brian's photo is a graduation shot and Brennan's is an
  outdoor casual shot (both from the current site). Professional studio
  portraits like Mike's would improve the team section.
- **Gallery photos** — pulled from the current site's gallery. They show
  event work (including a pro golf event) — alt text deliberately avoids
  claiming any official tournament/league affiliation. Swap in higher-res
  originals if available.
- **"Since 2014"** — the current site says "we have been in the sports world
  since 2014"; the business founding date itself is not published, so the
  new site repeats the same phrasing and the JSON-LD omits `foundingDate`.
- **Yoga booking links** — New Earth Somatic Yoga (kiwilaunch) and Yogahouser
  (appt.link) URLs copied from the current site; confirm both partnerships
  are active.
- **Apparel link** — `vgy31b-pu.myshopify.com` is the raw Shopify URL from
  the current site. If there's a nicer storefront domain, swap it.
- **Shop section** — the four featured products (Fitted T-Shirt $40, Unisex
  Hoodie $73, Trucker Cap $35, Gym Bag $85.50) and their images were pulled
  from the live Shopify store in July 2026. Prices/lineup on the page are a
  snapshot — if store prices change, update `index.html` (the store itself is
  always authoritative at checkout). A Shopify Buy-Button embed was
  deliberately skipped: it requires a Storefront API token from the Shopify
  admin and adds third-party JavaScript; the linked cards keep the site
  dependency-free. Generate a token and revisit if live cart/checkout on-page
  is ever wanted.
- **Testimonials & rating** — all four quotes are verbatim from public
  reviews: Facebook (Katie Oglesby Hardy, Feb 2026; Ilan Bental, Dec 2025,
  via owner screenshots) and Google (Michael Holder, ~July 2026; Laura
  Shinn, ~Oct 2025, pasted by the owner in July 2026 — Laura's is lightly
  trimmed with an ellipsis). The "5.0 on Google across 33 reviews"
  figure (also in JSON-LD `aggregateRating`) is a July 2026 snapshot from an
  owner screenshot — the count will drift as reviews come in, so refresh it
  occasionally (or on each content update).
