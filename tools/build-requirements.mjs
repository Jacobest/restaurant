// Builds uc/<slug>/requirements.html (demo 5: what you need to make this work).
// Run:  node tools/build-requirements.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { USECASES, COMMON, REQS } from './all-cases.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..') + path.sep;
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const li = a => a.map(t => `<li>${esc(t)}</li>`).join('');

const opt = (kind, [tool, note]) => `<div class="opt ${kind}"><span class="pill">${kind === 'easy' ? 'Easy' : 'Ideal'}</span><div><b>${esc(tool)}</b><p>${esc(note)}</p></div></div>`;
const fn = f => `<article class="fn"><h3>${esc(f.fn)}</h3><p class="why">${esc(f.why)}</p>${opt('easy', f.easy)}${f.ideal.map(i => opt('ideal', i)).join('')}${f.note ? `<p class="fnote">${esc(f.note)}</p>` : ''}</article>`;

function page(u) {
  const r = REQS[u.slug];
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="icon" type="image/png" href="/favicon.png?v=2">
<title>EngageONE – ${esc(u.name)}: what you need</title>
<style>
  *{box-sizing:border-box}
  body{margin:0;background:#EFEAE2;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:#111B21;line-height:1.5}
  header.site{background:#075E54;color:#fff;padding:14px 24px;display:flex;justify-content:space-between;align-items:center}
  header.site b{font-size:18px} header.site b span{color:#25D366}
  header.site a{color:#D9FDD3;font-size:14px;text-decoration:none;white-space:nowrap}
  .hl{display:flex;align-items:center;gap:14px}
  .demo{font-size:18px;color:#D9FDD3;padding-left:14px;border-left:1px solid rgba(255,255,255,.35);white-space:nowrap}
  .demo strong{font-weight:700;color:#fff}
  .crumbs{display:flex;align-items:center;flex-wrap:wrap;gap:8px 12px;padding:14px 24px;background:#fff;border-bottom:1px solid #d5e3dc;font-weight:600;font-size:17px;line-height:1.2}
  .crumbs a{color:#075E54;text-decoration:none} .crumbs a:hover{text-decoration:underline}
  .crumbs .back{background:#075E54;color:#fff;padding:8px 14px;border-radius:99px;font-size:15px;margin-right:6px}
  .crumbs .sep{color:#8aa39b;font-weight:400} .crumbs .cur{color:#111B21}
  main{max-width:960px;margin:0 auto;padding:30px 20px 70px}
  h1{margin:0 0 8px;color:#075E54}
  .lead{margin:0 0 8px;color:#444;max-width:720px}
  .checked{font-size:13px;color:#667781;margin:0 0 26px}
  h2{margin:38px 0 12px;color:#075E54;font-size:22px}
  .card{background:#fff;border-radius:14px;padding:20px 22px;box-shadow:0 4px 16px rgba(7,94,84,.12)}
  .card ul{margin:0;padding-left:20px} .card li{margin:6px 0}
  .basics{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px}
  .basics .b{background:#fff;border-radius:12px;padding:14px 16px;box-shadow:0 2px 10px rgba(7,94,84,.1)}
  .basics .b b{display:block;color:#075E54;margin-bottom:4px} .basics .b span{font-size:14px;color:#44575a}
  .fns{display:grid;grid-template-columns:repeat(auto-fill,minmax(420px,1fr));gap:18px}
  .fn{background:#fff;border-radius:14px;padding:18px 20px;box-shadow:0 4px 16px rgba(7,94,84,.12)}
  .fn h3{margin:0 0 2px;color:#075E54;font-size:18px}
  .why{margin:0 0 12px;color:#667781;font-size:14px}
  .opt{display:flex;gap:12px;align-items:flex-start;padding:10px 0;border-top:1px solid #eef1f0}
  .opt p{margin:2px 0 0;font-size:14px;color:#44575a}
  .pill{flex:none;font-size:12px;font-weight:700;padding:3px 10px;border-radius:99px;margin-top:2px}
  .easy .pill{background:#D9FDD3;color:#075E54} .ideal .pill{background:#DDEBFF;color:#0d3b66}
  .fnote{margin:8px 0 0;font-size:13px;color:#6b4e00;background:#FFF4D6;border-radius:8px;padding:8px 10px}
  .two{display:grid;grid-template-columns:1fr 1fr;gap:18px}
  .tag{display:inline-block;font-size:12px;font-weight:700;padding:3px 10px;border-radius:99px;margin-bottom:8px}
  .tag.ok{background:#D9FDD3;color:#075E54} .tag.ask{background:#FFF4D6;color:#6b4e00}
  .note{font-size:14px;color:#44575a}
  footer{margin-top:40px;font-size:13px;color:#667781}
  footer a{color:#128C7E}
  @media (max-width:760px){.fns{grid-template-columns:1fr}.two{grid-template-columns:1fr}.crumbs{padding:12px 16px;font-size:16px}header.site{padding:12px 16px}.demo{font-size:15px;padding-left:10px}.hl{gap:10px}}
</style>
</head>
<body>
<header class="site"><div class="hl"><b>Engage<span>ONE</span></b><span class="demo">${esc(u.label)} <strong>Demo</strong></span></div><a href="/logout">Sign out</a></header>
<nav class="crumbs" aria-label="Breadcrumb"><a class="back" href="/uc/${u.slug}/">‹ Back</a><a href="/uc/">Use cases</a> <span class="sep">›</span> <a href="/uc/${u.slug}/">${esc(u.name)}</a> <span class="sep">›</span> <span class="cur">What you need</span></nav>
<main>
  <h1>What you need to make this work</h1>
  <p class="lead">${esc(r.intro)}</p>
  <p class="checked">Prepared ${COMMON.checked} for South African businesses. “Easy” means cheap or free and quick to set up. “Ideal” means the best fit as you grow. ⚠ means check with the vendor before promising it.</p>

  <h2>1. The basics for any WhatsApp AI chat</h2>
  <div class="basics">${COMMON.basics.map(([t, d]) => `<div class="b"><b>${esc(t)}</b><span>${esc(d.replace("{biz}", u.biz))}</span></div>`).join('')}</div>

  <h2>2. What S10U AI Studio gives you</h2>
  <p class="note">The full list, with the source for every fact and how sure we are, is on the <a href="/uc/s10u/">S10U platform facts</a> page.</p>
  <div class="two">
    <div class="card"><span class="tag ok">Stated on S10U’s site</span><ul>${li(COMMON.s10uStated)}</ul></div>
    <div class="card"><span class="tag ask">Ask S10U before you promise anything</span><ul>${li(COMMON.s10uQuestions)}</ul></div>
  </div>

  <h2>3. Connections for this demo</h2>
  <p class="note">Each row shows the simplest option first, then the better long-term options. S10U says it has 80+ integrations but publishes only categories (CRM, ERP, eCommerce, helpdesk, payment gateways), not product names. So confirm every connection below with S10U. If there is no ready connector, the usual routes are S10U custom development, its API and webhooks, or an automation tool such as Make, n8n or Zapier. See <a href="/uc/s10u/">how integrations get connected</a>, or the <a href="/uc/integrations/">Integration guide</a> for every tool type in one place.</p>
  <div class="fns">${r.functions.map(fn).join('')}</div>

  <h2>4. The AI behind the chat</h2>
  <div class="fns">
    <article class="fn"><h3>AI provider</h3><p class="why">The model that writes the replies.</p>${opt('easy', COMMON.ai.easy)}${COMMON.ai.ideal.map(i => opt('ideal', i)).join('')}<p class="fnote">${esc(COMMON.ai.note)}</p></article>
    <article class="fn"><h3>MCP (later)</h3><p class="why">A standard way for the AI to use your tools.</p><p class="note">${esc(COMMON.mcp)}</p></article>
  </div>

  <h2>5. Privacy (POPIA)</h2>
  <div class="card"><ul>${li(COMMON.popia)}</ul></div>

  <footer>
    Sources: <a href="https://www.s10u.co.za">s10u.co.za</a> (AI Studio, WhatsApp for Business, AI Studio Terms, case studies);
    <a href="/uc/s10u/">S10U platform facts</a>;
    <a href="https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing">Meta WhatsApp pricing</a>;
    <a href="https://learn.dineplan.com/api-integration">Dineplan API</a>;
    <a href="https://paystack.com/stripe/south-africa">Paystack in South Africa</a>;
    <a href="https://modelcontextprotocol.io">Model Context Protocol</a>.
    Tool popularity is our judgement, not measured market share. Prices change: check each vendor’s page. Meta charges per delivered template message and South Africa has its own rate card in US dollars, so check Meta’s current rate card before quoting a price.
  </footer>
</main>
</body>
</html>
`;
}

for (const u of USECASES) {
  if (!REQS[u.slug]) throw new Error('no requirements for ' + u.slug);
  fs.writeFileSync(ROOT + `uc/${u.slug}/requirements.html`, page(u));
  console.log('built', u.slug, REQS[u.slug].functions.length + ' functions');
}
