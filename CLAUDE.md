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

6. **Cost breakdown** (`cost.html`, optional, private, sales only): what WhatsApp costs message by message, who pays what, calculators. Built from `tools/costs.mjs` + `tools/pricing.mjs` by `build-costs.mjs`. Done for Doctor, Restaurant, Salon and Lead Capture (add a use case by adding its entry to `tools/costs.mjs`: words, example numbers and which bot messages are templates). Needs a login and is never public. **Re-check `tools/pricing.mjs` against Meta's rate card every month.** Since 1 Oct 2026 Meta charges for the bot's replies inside the 24-hour window (service messages).

Each use case also has `index.html` (cards for the 5 demos) and a card on `uc/index.html`.
Every demo shows the client's name (for example "Florentine's Bistro") and uses made-up but realistic data (names, references like FB-2026-0142). No `[Placeholders]`.

## How the pages are made

`uc/<slug>/chat.html` holds the conversation and is the single source of truth. Do not hand-edit generated pages.

- `tools/usecases.mjs`: names, labels, client name, dashboard contacts and AI-summary lines.
- `tools/journeys.mjs`: diagram data (nodes and edges).
- `tools/requirements.mjs`: integration content. Re-check S10U (s10u.co.za) and South African tools before changing it.
- `tools/s10u-facts.mjs` + `build-s10u.mjs` make `uc/s10u/` (what S10U publishes, with source and certainty for each fact, Meta rules, questions for S10U). Keep the "stated vs inferred vs not published" labels honest. S10U publishes integration categories only, no product names.
- `tools/integrations.mjs` + `build-integrations.mjs` make `uc/integrations/` (master guide by tool type, easy vs ideal). Update it when S10U answers.
- `tools/templates/dashboard-chat.template.html`: the dashboard page template (restaurant text, no extra view). Edit the dashboard here, never in `uc/*/dashboard-chat.html`.
- `tools/dashboard-views.mjs`: the screen the dashboard switches to when the chat ends (demo 2). Done: Restaurant (Bookings timeline), Doctor (Appointments calendar). Every dashboard has a tab menu: Chats, Orders, Appointments, Contacts, Groups, Bookings. Other use cases still show only the inbox. Owner plan: add one view per use case.
- `tools/cases/<slug>.mjs`: one file per newer use case (meta, chat, journey, requirements). Spec: `tools/cases/README.md`. Check one with `node tools/validate-case.mjs <slug>`. `tools/all-cases.mjs` merges everything (add the slug to its `ORDER` list).
- Run everything with `node tools/build-all.mjs` (chats, dashboard + phones, journeys, requirements, index pages, and the cards on `uc/index.html`).
- The restaurant is the reference: its `chat.html`, `phones.html` and `flow.html` are the templates/hand-made, and the dashboard template is in `tools/templates/`; the build scripts copy from them.
- New use case: write `tools/cases/<slug>.mjs` following the README, add the slug to `ORDER` in `tools/all-cases.mjs`, validate, run `node tools/build-all.mjs`, test, commit.
- Any `/uc/<name>/chat` and `/uc/<name>/dashboard-chat` page is public (see `functions/_middleware.js`). Everything else needs a login.

## Conventions

- Plain, short words. Breadcrumbs and a Back button on every page. Favicon `/favicon.png?v=2`.
- Brand: EngageONE. Header shows "<Use case> Demo" label.
- Test locally with `python -m http.server` (static) or `npx wrangler pages dev . --kv USERS --compatibility-date 2026-08-01` (functions). Stop servers afterwards.
