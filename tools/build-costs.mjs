// Builds uc/<slug>/cost.html: the PRIVATE sales card with the WhatsApp message cost breakdown.
// Needs an entry in tools/costs.mjs. It reads the use case's own chat, so the table matches the demo.
// Run:  node tools/build-costs.mjs   (prices live in tools/pricing.mjs: re-check them every month)
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { USECASES } from './all-cases.mjs';
import { COSTS } from './costs.mjs';
import { PRICING } from './pricing.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..') + path.sep;
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const cap = s => s[0].toUpperCase() + s.slice(1);

// run the chat's own steps
const tpl = fs.readFileSync(ROOT + 'uc/restaurant-booking/chat.html', 'utf8').split('\n');
const ha = tpl.findIndex(l => l.startsWith('function buildPhones')), hb = tpl.findIndex(l => l.startsWith('  const steps = ['));
const helpers = tpl.slice(ha + 1, hb).join('\n');
const kindOf = h => h.includes('align-self:flex-end') ? 'out' : h.includes('max-width:80%') ? 'in' : h.includes('width:80%') ? 'btn' : h.includes('align-self:center') ? 'chip' : 'in';
const plain = h => h.replace(/<br\s*\/?>/g, ' ').replace(/<\/div><div[^>]*>/g, ' | ').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/\s+/g, ' ').replace(/\s*\d{2}:\d{2}(\s*✓✓)?\s*$/, '').trim();

function rowsFor(slug, cfg) {
  const L = fs.readFileSync(ROOT + `uc/${slug}/chat.html`, 'utf8').split('\n');
  const a = L.findIndex(l => l.startsWith('  const steps = [')), b = L.findIndex((l, i) => i > a && l === '  ];');
  const steps = new Function(helpers + '\n' + L.slice(a, b + 1).join('\n') + '\nreturn steps;')();
  const rows = [], used = new Set();
  for (const [title, msgs] of steps) {
    if ((cfg.skipSteps || []).includes(title)) continue;
    let botN = 0;
    for (const m of msgs) {
      const k = kindOf(m);
      if (k === 'btn' || k === 'chip') continue;
      let text = plain(m); if (text.length > 96) text = text.slice(0, 93) + '…';
      if (k === 'out') { rows.push({ step: title, who: 'person', text, type: 'free' }); continue; }
      const t = (cfg.templates || []).find(x => x.step === title && x.n === botN);
      if (t) used.add(t);
      botN++;
      const agent = (cfg.agentMessages || []).some(x => x.step === title && x.n === botN - 1);
      rows.push({ step: title, who: agent ? 'agent' : 'bot', text, type: t ? t.kind : 'service', label: t ? t.label : '' });
    }
  }
  for (const t of cfg.templates || []) if (!used.has(t)) throw new Error(`${slug}: template not found in the chat: ${t.step} #${t.n}`);
  return rows;
}

const pageFor = (u, cfg) => {
  const rows = rowsFor(u.slug, cfg);
  const count = t => rows.filter(r => r.type === t).length;
  const nService = count('service'), nUtility = count('utility'), nFeedback = count('feedback'), nMarketing = count('marketing');
  const nPerson = rows.filter(r => r.who === 'person').length, nBot = rows.length - nPerson;
  const W = cfg.who, Ws = cfg.whoPlural, Wc = cap(W), B = cfg.bizNoun, Bc = cap(B), U = cfg.unit, Uc = cap(U), R = cfg.roi;
  const DATA = { rows, rates: PRICING.rates, fx: PRICING.fx, free: PRICING.freeServiceMessages, vat: PRICING.vat, nService, nUtility, nFeedback, nMarketing, Who: Wc, unit: U, freeEntry: !!cfg.freeEntry, replyLabel: cfg.replyLabel || 'Bot replies' };
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<link rel="icon" type="image/png" href="/favicon.png?v=2">
<title>EngageONE – ${esc(u.name)}: cost breakdown (sales only)</title>
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
  .private{background:#3b2a7a;color:#fff;font-size:13.5px;padding:9px 24px}
  .private b{background:#fff;color:#3b2a7a;border-radius:99px;padding:2px 10px;margin-right:8px;font-size:12px}
  main{max-width:1040px;margin:0 auto;padding:28px 20px 70px}
  h1{margin:0 0 6px;color:#075E54}
  h2{margin:36px 0 12px;color:#075E54;font-size:22px}
  .lead{margin:0 0 6px;color:#444;max-width:780px}
  .checked{font-size:13px;color:#667781;margin:0 0 18px}
  .card{background:#fff;border-radius:14px;padding:18px 22px;box-shadow:0 4px 16px rgba(7,94,84,.12);overflow-x:auto}
  .grid4{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px}
  .big{background:#fff;border-radius:14px;padding:16px 18px;box-shadow:0 4px 16px rgba(7,94,84,.12)}
  .big .n{font-size:28px;font-weight:800;color:#075E54;line-height:1.1}
  .big .t{font-weight:700;margin-top:4px} .big p{margin:4px 0 0;font-size:14px;color:#44575a}
  .big.free .n{color:#128C7E} .big.warn .n{color:#b3571a}
  table{width:100%;border-collapse:collapse;font-size:14px}
  th{text-align:left;font-size:12px;text-transform:uppercase;letter-spacing:.04em;color:#667781;padding:8px 10px;border-bottom:2px solid #e3e9e6}
  td{padding:9px 10px;border-bottom:1px solid #eef1f0;vertical-align:top}
  td.num,th.num{text-align:right;white-space:nowrap}
  tr.step td{background:#f3f8f5;font-weight:700;color:#075E54;font-size:13px}
  .badge{display:inline-block;font-size:11.5px;font-weight:700;padding:2px 10px;border-radius:99px;white-space:nowrap}
  .b-free{background:#D9FDD3;color:#075E54} .b-service{background:#DDEBFF;color:#0d3b66} .b-utility{background:#e6e0f7;color:#3b2a7a} .b-feedback{background:#FFF4D6;color:#6b4e00} .b-marketing{background:#fde2d3;color:#8a3b00}
  .who{color:#667781;font-size:12px;display:block}
  tr.tot td{font-weight:800;border-top:2px solid #cfe3d8;background:#f8fbf9}
  .controls{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:12px;margin-bottom:14px}
  .controls label{font-size:13px;font-weight:600;color:#44575a;display:block}
  .controls input[type=number],.controls select{width:100%;padding:9px 10px;border:1px solid #cfd8d6;border-radius:8px;font-size:15px;margin-top:4px;background:#fff}
  .controls .chk{display:flex;gap:8px;align-items:flex-start;font-weight:500;font-size:13.5px}
  .result{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;margin-top:6px}
  .result .r{background:#f3f8f5;border-radius:12px;padding:14px 16px}
  .result .r b{display:block;font-size:24px;color:#075E54} .result .r span{font-size:13px;color:#44575a}
  .result .r.hi{background:#075E54} .result .r.hi b,.result .r.hi span{color:#fff}
  .lines{margin:14px 0 0;font-size:14px} .lines div{display:flex;justify-content:space-between;gap:12px;padding:5px 0;border-bottom:1px dashed #dfe7e3}
  .note{font-size:13.5px;color:#6b4e00;background:#FFF4D6;border-radius:10px;padding:10px 14px;margin-top:12px}
  .two{display:grid;grid-template-columns:repeat(auto-fit,minmax(440px,1fr));gap:14px}
  .item{background:#fff;border-radius:12px;padding:14px 18px;box-shadow:0 2px 10px rgba(7,94,84,.1)}
  .item b{display:block;color:#075E54;margin-bottom:2px} .item p{margin:0;font-size:14px;color:#44575a}
  details{background:#fff;border-radius:12px;padding:12px 18px;margin-bottom:10px;box-shadow:0 2px 10px rgba(7,94,84,.1)}
  summary{cursor:pointer;font-weight:700;color:#075E54} details p{margin:8px 0 0;font-size:14px;color:#44575a}
  ul.tips{margin:0;padding-left:20px} ul.tips li{margin:6px 0}
  footer{margin-top:36px;font-size:13px;color:#667781} footer a{color:#128C7E}
  @media (max-width:760px){td,th{padding:7px 6px;font-size:13px}.usd,.idx{display:none}.badge{font-size:10.5px;padding:2px 7px}.card{padding:14px 12px}.two{grid-template-columns:1fr}.crumbs{padding:12px 16px;font-size:16px}header.site{padding:12px 16px}.demo{font-size:15px;padding-left:10px}.hl{gap:10px}.private{padding:9px 16px}}
  @media print{.private,.crumbs,header.site{display:none}}
</style>
</head>
<body>
<header class="site"><div class="hl"><b>Engage<span>ONE</span></b><span class="demo">${esc(u.label)} <strong>Demo</strong></span></div><a href="/logout">Sign out</a></header>
<nav class="crumbs" aria-label="Breadcrumb"><a class="back" href="/uc/${u.slug}/">‹ Back</a><a href="/uc/">Use cases</a> <span class="sep">›</span> <a href="/uc/${u.slug}/">${esc(u.name)}</a> <span class="sep">›</span> <span class="cur">Cost breakdown</span></nav>
<div class="private"><b>SALES ONLY</b>Needs a login. Safe to screen-share with a customer. Please do not send the link to anyone outside the team.</div>
<main>
  <h1>What WhatsApp costs: ${esc(u.name)}</h1>
  <p class="lead">${esc(u.biz)} starts with a ${W} who writes first. This page shows, message by message, who pays what, using the same chat as the demo.</p>
  <p class="checked">Meta prices checked ${esc(PRICING.checked)}. Meta charges in US dollars, so rand amounts use an exchange rate you can change below. Prices exclude VAT and exclude S10U’s own fees (not published: we quote those once S10U confirms). ⚠ marks anything we could not confirm on Meta’s own pages.</p>

  <h2>The short answer</h2>
  <div class="grid4">
    <div class="big free"><div class="n">Free</div><div class="t">Messages the ${W} sends</div><p>Meta never charges for a message a person sends to a business. In this chat that is ${nPerson} messages.</p></div>
    <div class="big"><div class="n" id="s-svc">R0.15</div><div class="t">Each bot reply inside 24 hours</div><p>A “service message”. Meta started charging for these on 1 October 2026. The ${B} pays, not the ${W}. ${nService} in this chat.</p></div>
    <div class="big"><div class="n" id="s-utl">R0.15</div><div class="t">Each reminder template</div><p>A message the ${B} starts after the 24 hours have ended, such as ${cfg.templateExample}. Always a template that Meta approved.</p></div>
    <div class="big warn"><div class="n" id="s-tot">R3.05</div><div class="t">One whole ${U}</div><p>${esc(cfg.journeyText)}: ${nBot} bot messages. Meta fees only.</p></div>
  </div>

  <h2>Who pays what</h2>
  <div class="card"><table>
    <tr><th>What happens</th><th>Who pays</th><th>How much (Meta list price)</th></tr>
    <tr><td>The ${W} sends a message</td><td><span class="badge b-free">Nobody</span></td><td>Free. The ${W} also pays nothing extra, apart from normal data use on their phone.</td></tr>
    <tr><td>The bot replies within 24 hours of the ${W}’s last message</td><td><span class="badge b-service">The ${B}</span></td><td><span class="r-svc"></span> each. Meta reportedly gives 1,000 free per business phone number each month. ⚠</td></tr>
    <tr><td>The ${B} starts a message after 24 hours (reminder, follow-up)</td><td><span class="badge b-utility">The ${B}</span></td><td>Utility template: <span class="r-utl"></span> each. A marketing template (offers, invitations): <span class="r-mkt"></span> each.</td></tr>
    <tr><td>The ${W} starts from a Click-to-WhatsApp ad or a Facebook page button</td><td><span class="badge b-free">Nobody</span></td><td>Free for 72 hours: every message type, if the ${B} replies within 24 hours.</td></tr>
    <tr><td>The platform and the AI (S10U)</td><td><span class="badge b-feedback">The ${B}</span></td><td>Not published. Ask S10U. ⚠</td></tr>
  </table></div>

  <h2>One ${U}, message by message</h2>
  <div class="card"><table id="msgs">
    <tr><th class="idx">#</th><th>Message</th><th>Type</th><th class="num usd">USD</th><th class="num">Rand</th></tr>
  </table></div>
  <div class="note">${esc(cfg.windowNote)}</div>
  ${cfg.skipNote ? '<div class="note">' + esc(cfg.skipNote) + '</div>' : ''}
  ${cfg.freeEntry ? '<div class="note" id="adnote" style="background:#D9FDD3;color:#075E54"><b>Started from an ad:</b> Meta does not charge for any message for 72 hours, as long as the ' + B + ' replies within 24 hours (phone app only, not WhatsApp Web). You pay for the ad itself, not for the chat. Switch the source above to see the normal prices.</div>' : ''}

  <h2>Monthly cost for the ${B}</h2>
  <div class="card">
    <div class="controls">
      <label>${esc(cfg.convLabel || (Uc + 's booked on WhatsApp per month'))}<input type="number" id="conv" value="300" min="1"></label>
      ${cfg.freeEntry ? '<label>Where does the ' + W + ' start the chat?<select id="src"><option value="ad">From a Facebook or Instagram ad (free for 72 hours)</option><option value="link">From a link, QR code or website button</option></select></label>' : '<input type="hidden" id="src" value="link">'}
      <label>Rand per US dollar<input type="number" id="fx" value="${PRICING.fx}" step="0.05" min="1"></label>
      ${nFeedback ? '<label>Feedback request counts as<select id="fbk"><option value="utility">Utility (cheaper)</option><option value="marketing">Marketing (about 4× more)</option></select></label>' : '<input type="hidden" id="fbk" value="utility">'}
      <label class="chk"><input type="checkbox" id="alw"> Include the 1,000 free service messages a month ⚠ (not confirmed on Meta’s page)</label>
      <label class="chk"><input type="checkbox" id="vat"> Add 15% VAT</label>
    </div>
    <div class="result">
      <div class="r hi"><b id="m-zar">R0</b><span>Meta fees per month</span></div>
      <div class="r"><b id="m-per">R0</b><span>Meta fees per ${U}</span></div>
      <div class="r"><b id="m-usd">$0</b><span>Meta fees per month in US dollars</span></div>
    </div>
    <div class="lines" id="m-lines"></div>
    <div class="note">Plus S10U’s platform fee and any AI usage: not published yet. ⚠ ${esc(cfg.moreCosts || '')} We will add S10U’s fees to this page once S10U confirms its prices.</div>
  </div>

  <h2>Is it worth it?</h2>
  <div class="card">
    <p class="lead" style="margin-bottom:12px">${esc(R.lead)}</p>
    <div class="controls">
      <label>${esc(R.feeLabel)}<input type="number" id="fee" value="${R.fee}" min="0"></label>
      <label>${esc(R.nsLabel)}<input type="number" id="ns" value="${R.nsDefault}" min="0" max="100"></label>
      <label>${esc(R.redLabel)}<input type="number" id="red" value="${R.redDefault}" min="0" max="100"></label>
    </div>
    <div class="result">
      <div class="r"><b id="v-prev">0</b><span>${esc(R.prevLabel || 'no-shows prevented per month')}</span></div>
      <div class="r hi"><b id="v-val">R0</b><span>${esc(R.valueLabel)}</span></div>
      <div class="r"><b id="v-cost">0%</b><span>of that value goes to Meta fees</span></div>
    </div>
    <div class="note">${esc(R.note)}</div>
  </div>

  <h2>Meta’s rules that matter to a ${B}</h2>
  <div class="two">
    <div class="item"><b>${cap(Ws)} must opt in</b><p>The booking chat starts with the ${W}, so that is clear permission. For reminders and follow-ups, say so when they book and make “stop” easy.</p></div>
    <div class="item"><b>The 24-hour window</b><p>After a ${W} writes, the bot can reply freely for 24 hours. After that, only approved templates can be sent. Each new message from the ${W} opens a fresh 24 hours.</p></div>
    <div class="item"><b>Templates need Meta’s approval</b><p>Reminders are “utility” templates. Offers, invitations and promotions are “marketing” and cost more. A survey or a welcome message may be reviewed as either. ⚠</p></div>
    <div class="item"><b>Rules for AI bots</b><p>A bot built for one business’s customer service is allowed. Meta does not allow a general-purpose AI assistant to be the main product on its platform. Chat data cannot be used to train general AI models.</p></div>
    <div class="item"><b>Quality and sending limits</b><p>If many ${Ws} block or report the number, Meta can lower its limits. A new number starts at 250 ${Ws} a day outside the window. Business verification lifts that to 2,000 and beyond.</p></div>
    <div class="item"><b>Prices can change</b><p>Meta bills in US dollars and may update rates up to quarterly. Utility and authentication get cheaper with volume. Service replies and marketing do not. Meta’s own AI agent (“Meta Business Agent”) is charged by tokens from 1 August 2026: ask S10U whether its bot uses it. ⚠</p></div>
  </div>

  <h2>${esc(cfg.privacyTitle)}</h2>
  <div class="card"><ul class="tips">${cfg.privacy.map(p => `<li>${esc(p)}</li>`).join('')}</ul></div>

  <h2>Ways to keep the cost low</h2>
  <div class="card"><ul class="tips">
    <li><b>${esc(cfg.startTip.split('. ')[0])}.</b> ${esc(cfg.startTip.split('. ').slice(1).join('. '))}</li>
    <li><b>Use buttons and short answers.</b> Every bot reply is a separate charge, so fewer, clearer messages cost less.</li>
    <li><b>Let ${Ws} start the chat.</b> Their messages are free and open the free 24-hour window. Ads that open WhatsApp give 72 free hours.</li>
    <li><b>Keep marketing separate.</b> Offers and invitations cost about four times a reminder. Do not mix them into reminders.</li>
    <li><b>Check the monthly Meta report.</b> We watch the cost per ${U} so nothing surprises the ${B}.</li>
  </ul></div>

  <h2>Questions the customer may ask</h2>
  <details><summary>Do we pay when the ${W} messages us?</summary><p>No. Meta never charges for messages a person sends to a business.</p></details>
  <details><summary>Do we pay for the bot’s replies?</summary><p>Yes, since 1 October 2026. Each reply inside the 24-hour window is a service message, about <span class="r-svc"></span> at Meta’s list price. Meta reportedly gives 1,000 free each month for every business number. ⚠ Until the end of September 2026 they were free, so older articles and quotes may say “free replies”.</p></details>
  <details><summary>Does the ${W} pay anything?</summary><p>No fee from us or from Meta. They use WhatsApp as normal, with their usual data or Wi-Fi.</p></details>
  <details><summary>Why not use the free WhatsApp Business app?</summary><p>The app is free but manual: someone must answer every message on a phone. It cannot run an AI assistant, book into your system, send automatic reminders or share one inbox between staff. These Meta fees apply only to the automated platform.</p></details>
  <details><summary>What if we get busier?</summary><p>Cost grows with each message, in a straight line. Use the calculator above with the busier number. Utility reminders get cheaper at high volume.</p></details>
  <details><summary>Will the price change?</summary><p>Meta can change rates up to quarterly and bills in US dollars, so the rand cost also moves with the exchange rate. We check the rates every month and will tell the ${B}.</p></details>
  <details><summary>What does the platform cost on top?</summary><p>S10U’s own fee is not published. We will give a full quote once S10U confirms it. ⚠</p></details>
  <details><summary>Who sends the invoice?</summary><p>Not yet confirmed: Meta may bill the ${B} directly in US dollars, or S10U may bill in rand, possibly with a mark-up. Ask S10U. ⚠</p></details>

  <h2>How to use this in a meeting</h2>
  <div class="card"><ul class="tips">
    <li>Show “One ${U}, message by message” first: it is easy to follow and builds trust.</li>
    <li>Type the ${B}’s own numbers into the two calculators. Compare Meta’s fee per ${U} with ${esc(R.meetingLine)}.</li>
    <li>Offer a 30-day pilot with reminders first, then the booking chat.</li>
    <li>Be open about what is not yet confirmed (S10U’s fee, the free allowance, invoicing). Honest answers close better.</li>
  </ul></div>

  <footer>Sources: ${PRICING.sources.map(([t, url]) => `<a href="${url}" target="_blank" rel="noopener">${esc(t)}</a>`).join('; ')}. South African rates ($${PRICING.rates.marketing} marketing, $${PRICING.rates.utility} utility, authentication and service) come from articles that cite Meta’s rate card: download Meta’s USD rate card to confirm before quoting. Exchange rate R${PRICING.fx} per US dollar (3 September 2026).</footer>
</main>
<script>
const D = ${JSON.stringify(DATA)};
const $ = id => document.getElementById(id);
const zar = n => 'R' + n.toFixed(2).replace(/\\B(?=(\\d{3})+(?!\\d))/g, ' ');
const usd = n => '$' + n.toFixed(4);
const num = id => Math.max(0, parseFloat($(id).value) || 0);
const fbRate = () => $('fbk').value === 'marketing' ? D.rates.marketing : D.rates.utility;
const adMode = () => D.freeEntry && $('src').value === 'ad';
function rate(type) { return type === 'free' || adMode() ? 0 : type === 'service' ? D.rates.service : type === 'utility' ? D.rates.utility : type === 'marketing' ? D.rates.marketing : fbRate(); }
const LABEL = { free: 'Free', service: 'Service', utility: 'Utility template', marketing: 'Marketing template', feedback: 'Template' };
function render() {
  const fx = num('fx') || D.fx;
  document.querySelectorAll('.r-svc').forEach(e => e.textContent = zar(D.rates.service * fx));
  document.querySelectorAll('.r-utl').forEach(e => e.textContent = zar(D.rates.utility * fx));
  document.querySelectorAll('.r-mkt').forEach(e => e.textContent = zar(D.rates.marketing * fx));
  $('s-svc').textContent = zar(D.rates.service * fx); $('s-utl').textContent = zar(D.rates.utility * fx);
  // message table
  let html = '<tr><th class="idx">#</th><th>Message</th><th>Type</th><th class="num usd">USD</th><th class="num">Rand</th></tr>', last = '', n = 0, totUsd = 0;
  for (const r of D.rows) {
    if (r.step !== last) { html += '<tr class="step"><td colspan="5">' + r.step + '</td></tr>'; last = r.step; }
    n++; const u = rate(r.type); totUsd += u;
    const type = r.type === 'feedback' ? (fbRate() === D.rates.marketing ? 'Marketing template' : 'Utility template') : LABEL[r.type];
    const cls = adMode() && r.who !== 'person' ? 'free' : r.type === 'feedback' && fbRate() === D.rates.marketing ? 'marketing' : r.type;
    html += '<tr><td class="idx">' + n + '</td><td><span class="who">' + (r.who === 'person' ? D.Who + ' writes' : r.who === 'agent' ? 'Agent replies' : 'Bot replies') + '</span>' + r.text.replace(/&/g, '&amp;').replace(/</g, '&lt;') + (r.label ? '<span class="who">' + r.label + '</span>' : '') + '</td><td><span class="badge b-' + cls + '">' + (adMode() && r.who !== 'person' ? 'Free (ad window)' : type) + '</span></td><td class="num usd">' + (u ? usd(u) : '—') + '</td><td class="num">' + (u ? zar(u * fx) : 'Free') + '</td></tr>';
  }
  html += '<tr class="tot"><td class="idx"></td><td>Total for one ' + D.unit + ' (Meta fees, before VAT)</td><td></td><td class="num usd">' + usd(totUsd) + '</td><td class="num">' + zar(totUsd * fx) + '</td></tr>';
  $('msgs').innerHTML = html;
  $('s-tot').textContent = zar(totUsd * fx);
  if ($('adnote')) $('adnote').style.display = adMode() ? '' : 'none';
  // monthly
  const conv = num('conv') || 1, vat = $('vat').checked ? 1 + D.vat : 1;
  const svcAll = conv * D.nService, freeSvc = $('alw').checked ? Math.min(D.free, svcAll) : 0, svcBill = svcAll - freeSvc;
  const m0 = adMode() ? 0 : 1;
  const l1 = m0 * svcBill * D.rates.service, l2 = m0 * conv * D.nUtility * D.rates.utility, l3 = m0 * conv * D.nFeedback * fbRate(), l4 = m0 * conv * D.nMarketing * D.rates.marketing;
  const tot = (l1 + l2 + l3 + l4) * vat;
  $('m-zar').textContent = zar(tot * fx); $('m-per').textContent = zar(tot * fx / conv); $('m-usd').textContent = '$' + tot.toFixed(2);
  const nf = x => x.toLocaleString('en-ZA');
  $('m-lines').innerHTML =
    '<div><span>' + D.replyLabel + ': ' + nf(svcAll) + (freeSvc ? ' (' + nf(freeSvc) + ' free)' : '') + (adMode() ? ' (free in the ad window)' : '') + ' × ' + usd(D.rates.service) + '</span><b>' + zar(l1 * fx) + '</b></div>' +
    (D.nUtility ? '<div><span>Reminder and notice templates: ' + nf(conv * D.nUtility) + ' × ' + usd(D.rates.utility) + '</span><b>' + zar(l2 * fx) + '</b></div>' : '') +
    (D.nMarketing ? '<div><span>Marketing templates (offers, invitations): ' + nf(conv * D.nMarketing) + ' × ' + usd(D.rates.marketing) + '</span><b>' + zar(l4 * fx) + '</b></div>' : '') +
    (D.nFeedback ? '<div><span>Feedback requests: ' + nf(conv * D.nFeedback) + ' × ' + usd(fbRate()) + '</span><b>' + zar(l3 * fx) + '</b></div>' : '') +
    '<div><span>' + D.Who + ' messages: ' + nf(conv * D.rows.filter(r => r.who === 'person').length) + '</span><b>Free</b></div>' +
    ($('vat').checked ? '<div><span>VAT 15%</span><b>' + zar((l1 + l2 + l3 + l4) * D.vat * fx) + '</b></div>' : '');
  // value
  const prev = conv * (num('ns') / 100) * (num('red') / 100), val = prev * num('fee');
  $('v-prev').textContent = prev.toFixed(1); $('v-val').textContent = zar(val).replace('.00', '');
  $('v-cost').textContent = val ? Math.round(tot * fx / val * 100) + '%' : '—';
}
document.querySelectorAll('input,select').forEach(e => e.addEventListener('input', render));
render();
</script>
</body>
</html>
`;
};

for (const u of USECASES) {
  const cfg = COSTS[u.slug];
  if (!cfg) continue;
  fs.writeFileSync(ROOT + `uc/${u.slug}/cost.html`, pageFor(u, cfg));
  console.log('built cost card for', u.slug);
}
