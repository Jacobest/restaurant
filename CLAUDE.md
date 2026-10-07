# EngageONE demo site (demo.engageone.plus)

Static site on Cloudflare Pages (project `demo`, repo `Jacobest/restaurant`, auto-deploys on push to `main`).
Login, invites and admin are Pages Functions in `functions/` (KV binding `USERS`; secrets `DEMO_PASSWORD`, `OWNER_EMAIL`).
Never commit secrets. `.dev.vars` is git-ignored.

## The standard: every use case has these 5 demos, in this order

1. **Live phone chat** (`chat.html`): auto-play, default speed 0.5x, shows the client name. Public.
2. **Live chat with dashboard** (`dashboard-chat.html`): phone on the right, S10U AI Studio inbox on a laptop screen on the left, synced. Auto-play, 0.5x, client name. Public.
3. **Phone chat screens** (`phones.html`): static, every step as a phone screen.
4. **Journey diagram** (`flow.html`): swim lanes (customer, bot, systems, team).
5. **What you need** (`requirements.html`): integrations with an Easy and an Ideal option per function, for South Africa. Facts from S10U's site are separated from "ask S10U" items.

Each use case also has `index.html` (cards for the 5 demos) and a card on `uc/index.html`.
Every demo shows the client's name (for example "Florentine's Bistro") and uses made-up but realistic data (names, references like FB-2026-0142). No `[Placeholders]`.

## How the pages are made

`uc/<slug>/chat.html` holds the conversation and is the single source of truth. Do not hand-edit generated pages.

- `tools/usecases.mjs`: names, labels, client name, dashboard contacts and AI-summary lines.
- `tools/journeys.mjs`: diagram data (nodes and edges).
- `tools/requirements.mjs`: integration content. Re-check S10U (s10u.co.za) and South African tools before changing it.
- Run: `node tools/build-demos.mjs` (dashboard + phones), `node tools/build-journeys.mjs`, `node tools/build-requirements.mjs`, `node tools/build-index.mjs`.
- The restaurant is the reference: its `dashboard-chat.html`, `phones.html` and `flow.html` are the templates/hand-made; the build scripts copy from them.
- New use case: add `uc/<slug>/chat.html` (copy a sibling), add entries in the three data files, add a card in `uc/index.html`, run all builds.
- Any `/uc/<name>/chat` and `/uc/<name>/dashboard-chat` page is public (see `functions/_middleware.js`). Everything else needs a login.

## Conventions

- Plain, short words. Breadcrumbs and a Back button on every page. Favicon `/favicon.png?v=2`.
- Brand: EngageONE. Header shows "<Use case> Demo" label.
- Test locally with `python -m http.server` (static) or `npx wrangler pages dev . --kv USERS --compatibility-date 2026-08-01` (functions). Stop servers afterwards.
