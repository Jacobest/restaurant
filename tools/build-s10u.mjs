// Builds uc/s10u/index.html: what we know about S10U and its integrations (from tools/s10u-facts.mjs).
// Run:  node tools/build-s10u.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { CHECKED, SITE, GROUPS, META_RULES, ROUTES, QUESTIONS } from './s10u-facts.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..') + path.sep;
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const LEVEL = {
  site: ['Stated by S10U', 'site'],
  dash: ['Seen in the inbox', 'dash'],
  meta: ['From Meta', 'meta'],
  infer: ['Our inference', 'infer'],
  none: ['Not published', 'none'],
};
const counts = Object.fromEntries(Object.keys(LEVEL).map(k => [k, 0]));
GROUPS.forEach(g => g.facts.forEach(f => counts[f[0]]++));
counts.meta = META_RULES.length;

const fact = ([lvl, text, src]) => `<li><span class="b ${LEVEL[lvl][1]}">${LEVEL[lvl][0]}</span><span class="t">${esc(text)}${src ? ` <a href="${SITE}${src}" target="_blank" rel="noopener">source</a>` : ''}</span></li>`;

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="icon" type="image/png" href="/favicon.png?v=2">
<title>S10U platform facts – EngageONE</title>
<style>
  *{box-sizing:border-box}
  body{margin:0;background:#EFEAE2;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:#111B21;line-height:1.5}
  header.site{background:#075E54;color:#fff;padding:14px 24px;display:flex;justify-content:space-between;align-items:center}
  header.site b{font-size:18px} header.site b span{color:#25D366}
  header.site a{color:#D9FDD3;font-size:14px;text-decoration:none;white-space:nowrap}
  .crumbs{display:flex;align-items:center;flex-wrap:wrap;gap:8px 12px;padding:14px 24px;background:#fff;border-bottom:1px solid #d5e3dc;font-weight:600;font-size:17px;line-height:1.2}
  .crumbs a{color:#075E54;text-decoration:none} .crumbs a:hover{text-decoration:underline}
  .crumbs .back{background:#075E54;color:#fff;padding:8px 14px;border-radius:99px;font-size:15px;margin-right:6px}
  .crumbs .sep{color:#8aa39b;font-weight:400} .crumbs .cur{color:#111B21}
  main{max-width:960px;margin:0 auto;padding:30px 20px 70px}
  h1{margin:0 0 8px;color:#075E54}
  h2{margin:38px 0 12px;color:#075E54;font-size:22px}
  h3{margin:0 0 8px;color:#075E54;font-size:17px}
  .lead{margin:0 0 8px;color:#444;max-width:760px}
  .checked{font-size:13px;color:#667781;margin:0 0 20px}
  .card{background:#fff;border-radius:14px;padding:18px 22px;box-shadow:0 4px 16px rgba(7,94,84,.12);margin-bottom:16px}
  .sum{display:flex;gap:10px;flex-wrap:wrap;margin:6px 0 0}
  .b{flex:none;display:inline-block;font-size:11.5px;font-weight:700;padding:3px 10px;border-radius:99px;white-space:nowrap}
  .b.site{background:#D9FDD3;color:#075E54} .b.dash{background:#DDEBFF;color:#0d3b66} .b.meta{background:#e6e0f7;color:#3b2a7a}
  .b.infer{background:#FFF4D6;color:#6b4e00} .b.none{background:#e9ecee;color:#44575a}
  ul.facts{list-style:none;margin:0;padding:0}
  ul.facts li{display:flex;gap:12px;align-items:flex-start;padding:10px 0;border-top:1px solid #eef1f0;font-size:15px}
  ul.facts li:first-child{border-top:0}
  ul.facts .b{margin-top:3px;min-width:132px;text-align:center}
  .t a{color:#128C7E;font-size:13px;margin-left:4px}
  .rules{display:grid;grid-template-columns:repeat(auto-fill,minmax(420px,1fr));gap:14px}
  .rule{background:#fff;border-radius:12px;padding:14px 18px;box-shadow:0 2px 10px rgba(7,94,84,.1)}
  .rule b{display:block;color:#075E54} .rule p{margin:4px 0 6px;font-size:14px;color:#44575a} .rule a{font-size:13px;color:#128C7E}
  ol.q{margin:0;padding-left:22px} ol.q li{margin:8px 0}
  .routes{display:grid;grid-template-columns:repeat(auto-fill,minmax(420px,1fr));gap:14px}
  .route{background:#fff;border-radius:12px;padding:14px 18px;box-shadow:0 2px 10px rgba(7,94,84,.1)} .route b{color:#075E54} .route p{margin:4px 0 0;font-size:14px;color:#44575a}
  .warn{background:#FFF4D6;color:#6b4e00;border-radius:10px;padding:12px 16px;font-size:14px;margin:14px 0}
  @media (max-width:760px){.rules,.routes{grid-template-columns:1fr}.crumbs{padding:12px 16px;font-size:16px}header.site{padding:12px 16px}ul.facts li{flex-direction:column;gap:6px}ul.facts .b{min-width:0}}
</style>
</head>
<body>
<header class="site"><b>Engage<span>ONE</span></b><a href="/logout">Sign out</a></header>
<nav class="crumbs" aria-label="Breadcrumb"><a class="back" href="/uc/">‹ Back</a><a href="/uc/">Use cases</a> <span class="sep">›</span> <span class="cur">S10U platform facts</span></nav>
<main>
  <h1>S10U platform facts and integrations</h1>
  <p class="lead">Everything we could find about S10U (Sideways10Up) and its AI Studio, with where it came from and how sure we are. Use this before you promise a customer an integration.</p>
  <p class="checked">Checked ${esc(CHECKED)}. Sources: <a href="${SITE}">s10u.co.za</a> (read through a page summariser, so wording is paraphrased), a screenshot of the real inbox, and Meta’s documentation.</p>

  <div class="card">
    <h3>The short version</h3>
    <ul class="facts">
      <li><span class="b site">Good news</span><span class="t">S10U states a no-code workflow builder, AI chatbots with hand-over, a shared inbox, broadcasts, in-chat payments, voice and web chat, “80+ integrations”, and an API with OAuth 2.0, API keys and signed webhooks. Data is stored in South Africa.</span></li>
      <li><span class="b none">Gap</span><span class="t">The integrations are listed as categories only (CRM, ERP, eCommerce, helpdesk, payments). No product names, no API documentation, no pricing and no help centre are public.</span></li>
      <li><span class="b infer">So</span><span class="t">Every connection on the “What you need” pages is <b>possible in principle</b>, but each one must be confirmed with S10U: ready connector, custom work, or an automation tool in between. See the questions at the bottom.</span></li>
    </ul>
    <div class="sum">${Object.entries(LEVEL).map(([k, [l, c]]) => `<span class="b ${c}">${l}: ${counts[k]}</span>`).join('')}</div>
  </div>

  ${GROUPS.map(g => `<h2>${esc(g.title)}</h2><div class="card"><ul class="facts">${g.facts.map(fact).join('')}</ul></div>`).join('\n  ')}

  <h2>How an integration would get connected</h2>
  <p class="lead">Our reading of the options, not S10U’s words.</p>
  <div class="routes">${ROUTES.map(([t, d]) => `<div class="route"><b>${esc(t)}</b><p>${esc(d)}</p></div>`).join('')}</div>

  <h2>WhatsApp rules that affect every demo</h2>
  <p class="lead">From Meta’s official documentation, checked ${esc(CHECKED)}. S10U sits on top of these rules.</p>
  <div class="rules">${META_RULES.map(([t, d, u]) => `<div class="rule"><b>${esc(t)}</b><p>${esc(d)}</p>${u ? `<a href="${u}" target="_blank" rel="noopener">Meta source</a>` : ''}</div>`).join('')}</div>
  <div class="warn">Rand prices you may see in news articles are conversions from Meta’s dollar rate card. One article says free service replies end on 1 October 2026. Meta’s own pricing page does not say that. Always check Meta’s current South Africa rate card before quoting a price.</div>

  <h2>Questions to ask S10U</h2>
  <div class="card"><ol class="q">${QUESTIONS.map(q => `<li>${esc(q)}</li>`).join('')}</ol></div>
</main>
</body>
</html>
`;
fs.mkdirSync(ROOT + 'uc/s10u', { recursive: true });
fs.writeFileSync(ROOT + 'uc/s10u/index.html', html);
console.log('built uc/s10u/index.html', GROUPS.reduce((n, g) => n + g.facts.length, 0), 'facts');
