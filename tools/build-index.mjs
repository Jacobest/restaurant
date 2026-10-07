// Builds uc/<slug>/index.html: the use case page with the 5 standard demos, in this order:
//   1 Live phone chat   2 Live chat with dashboard   3 Phone chat screens   4 Journey diagram   5 What you need
// Run:  node tools/build-index.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { USECASES } from './usecases.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..') + path.sep;
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

const DEMOS = u => [
  ['chat.html', 'Live phone chat (auto-play)', `One phone that plays a whole ${u.who} conversation by itself. Messages pop up and the chat scrolls. Jump to any step.`],
  ['dashboard-chat.html', 'Live chat with dashboard (auto-play)', `The ${u.who}’s phone next to the S10U AI Studio inbox. Both screens show the same chat together.`],
  ['phones.html', 'Phone chat screens', 'Every step as a WhatsApp screen, side by side. Made for viewing on a phone.'],
  ['flow.html', u.slug === 'restaurant-booking' ? 'Guest journey diagram' : 'Journey diagram', 'The full flow in swim lanes: the customer, the bot, your systems and your team.'],
  ['requirements.html', 'What you need to make this work', 'Integrations and set-up, with an easy and an ideal option for each, for South African businesses.'],
];

for (const u of USECASES) {
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="icon" type="image/png" href="/favicon.png?v=2">
<title>${esc(u.name)} – EngageONE</title>
<style>
  *{box-sizing:border-box}
  body{margin:0;background:#EFEAE2;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:#111B21}
  header{background:#075E54;color:#fff;padding:14px 24px;display:flex;justify-content:space-between;align-items:center}
  header b{font-size:18px}
  header b span{color:#25D366}
  .hl{display:flex;align-items:center;gap:14px}
  .demo{font-size:18px;color:#D9FDD3;padding-left:14px;border-left:1px solid rgba(255,255,255,.35);white-space:nowrap}
  .demo strong{font-weight:700;color:#fff}
  header a{color:#D9FDD3;font-size:14px;text-decoration:none;margin-left:16px;white-space:nowrap}
  main{max-width:900px;margin:0 auto;padding:32px 20px 60px}
  h1{margin:0 0 8px;color:#075E54}
  .lead{margin:0 0 28px;color:#444;line-height:1.6;max-width:680px}
  h3{margin:0 0 14px;color:#075E54}
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px}
  .card{display:block;background:#fff;border-radius:14px;padding:22px;text-decoration:none;color:inherit;box-shadow:0 4px 16px rgba(7,94,84,.12);transition:transform .15s;position:relative}
  .card:hover{transform:translateY(-3px)}
  .card .n{position:absolute;top:16px;right:18px;width:26px;height:26px;border-radius:50%;background:#D9FDD3;color:#075E54;font-size:13px;font-weight:700;display:grid;place-items:center}
  .card h2{margin:0 36px 6px 0;font-size:18px;color:#075E54}
  .card p{margin:0;color:#667781;font-size:14px;line-height:1.5}
  .go{display:inline-block;margin-top:12px;font-size:14px;font-weight:600;color:#128C7E}
  .crumbs{display:flex;align-items:center;flex-wrap:wrap;gap:8px 12px;padding:14px 24px;background:#fff;border-bottom:1px solid #d5e3dc;font-family:inherit;font-weight:600;font-size:17px;line-height:1.2}
  .crumbs a{color:#075E54;text-decoration:none}
  .crumbs a:hover{text-decoration:underline}
  .crumbs .back{background:#075E54;color:#fff;padding:8px 14px;border-radius:99px;font-size:15px;margin-right:6px}
  .crumbs .back:hover{background:#128C7E;text-decoration:none}
  .crumbs .sep{color:#8aa39b;font-weight:400}
  .crumbs .cur{color:#111B21}
  @media (max-width:600px){.crumbs{padding:12px 16px;font-size:16px}header{padding:12px 16px}.demo{font-size:15px;padding-left:10px}.hl{gap:10px}}
</style>
</head>
<body>
<header><div class="hl"><b>Engage<span>ONE</span></b><span class="demo">${esc(u.label)} <strong>Demo</strong></span></div><span><a href="/uc/">All use cases</a><a href="/logout">Sign out</a></span></header>
<nav class="crumbs" aria-label="Breadcrumb"><a class="back" href="/uc/">‹ Back</a><a href="/uc/">Use cases</a> <span class="sep">›</span> <span class="cur">${esc(u.name)}</span></nav>
<main>
  <h1>${esc(u.name)}</h1>
  <p class="lead">${esc(u.lead)}</p>
  <h3>Demos</h3>
  <div class="grid">
${DEMOS(u).map(([href, t, d], i) => `    <a class="card" href="${href}"><span class="n">${i + 1}</span>
      <h2>${esc(t)}</h2>
      <p>${esc(d)}</p>
      <span class="go">Open →</span>
    </a>`).join('\n')}
  </div>
</main>
<script>fetch("/api/me").then(r=>r.json()).then(d=>{if(d.role==="owner"){const n=document.querySelector("header a[href=\\"/logout\\"]");if(n)n.insertAdjacentHTML("beforebegin","<a href=\\"/admin/\\">Admin</a>")}})</script>
</body>
</html>
`;
  fs.writeFileSync(ROOT + `uc/${u.slug}/index.html`, html);
  console.log('built', u.slug);
}
