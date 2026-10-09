// Builds the Aesthetic Clinic extras:
//  1. uc/aesthetic-clinic/index.html     public landing page with the 3 journeys
//  2. uc/aesthetic-clinic/proposal.html  public form: "Yes, this is for me!" lands here (saved by functions/api/proposal.js)
//  3. the bottom bar on each journey page: final cost (logged-in viewers only) + the button "Yes, this is for me!"
// Run after build-costs.mjs (it needs the pages and the cost-summary.json files). Run:  node tools/build-clinic.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { CLINIC } from './clinic.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..') + path.sep;
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const PROPOSAL = `/uc/${CLINIC.slug}/proposal`;
const START = '<!--CLINIC_CTA-->', END = '<!--/CLINIC_CTA-->';

const CTA_CSS = `<style>
  .cta{max-width:820px;margin:36px auto 56px;padding:0 16px;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:#111B21}
  .cta .box{background:#fff;border-radius:16px;box-shadow:0 4px 18px rgba(7,94,84,.14);padding:26px 24px;text-align:center}
  .cta h2{margin:0 0 6px;color:#075E54;font-size:26px}
  .cta p{margin:0 auto 16px;color:#444;max-width:560px;line-height:1.5}
  .cta .cost{background:#f1f7f4;border:1px solid #d5e3dc;border-radius:12px;padding:14px 16px;margin:0 auto 18px;max-width:560px;text-align:left}
  .cta .cost[hidden]{display:none}
  .cta .cost small{display:block;color:#667781;font-size:12.5px;margin-top:6px;line-height:1.4}
  .cta .cost .big{font-size:30px;font-weight:700;color:#075E54}
  .cta .cost a{color:#075E54;font-weight:600;font-size:14px}
  .cta .tag{display:inline-block;background:#3b2a7a;color:#fff;border-radius:99px;padding:2px 10px;font-size:11.5px;font-weight:700;margin-bottom:6px}
  .cta .go{display:inline-block;background:#25D366;color:#053b2f;font-weight:700;font-size:18px;text-decoration:none;border-radius:99px;padding:14px 30px}
  .cta .go:hover{background:#1fbd5b}
  @media (max-width:520px){.cta .go{display:block}.cta h2{font-size:22px}}
</style>`;

const cta = j => `${START}
${CTA_CSS}
<section class="cta" id="clinicCta"><div class="box">
  <h2>Is this for me?</h2>
  <p>${j ? 'Like this journey for your clinic?' : 'Like what you see for your clinic?'} Ask for a proposal. It takes one minute.</p>
${j ? `  <div class="cost" id="clinicCost" hidden><span class="tag">SALES ONLY</span><div>Final cost: WhatsApp message fees for one ${esc(j.unit)}</div><div class="big" id="clinicCostZar"></div><small id="clinicCostNote"></small><a href="/uc/${j.slug}/cost">See the full cost breakdown</a></div>` : ''}
  <a class="go" href="${PROPOSAL}${j ? '?journey=' + j.key : ''}">Yes, this is for me!</a>
</div></section>
${j ? `<script>
(function () {
  var box = document.getElementById('clinicCost'); if (!box) return;
  fetch('/uc/${j.slug}/cost-summary.json', { credentials: 'same-origin' })
    .then(function (r) { if (!r.ok || (r.headers.get('content-type') || '').indexOf('json') < 0) throw 0; return r.json(); })
    .then(function (d) {
      document.getElementById('clinicCostZar').textContent = 'R' + d.zar.toFixed(2);
      document.getElementById('clinicCostNote').textContent = d.messages + ' messages from the clinic, ' + d.templates + ' of them an approved template. Meta fees only, before VAT. The platform and AI fees are not included. Rates checked ' + d.checked + ' and not yet confirmed with Meta.';
      box.hidden = false;
    })
    .catch(function () {});
})();
</script>` : ''}
${END}`;

// 3. the bottom bar on each journey page (chat, dashboard-chat, phones, flow). Idempotent: an old bar is replaced.
for (const j of CLINIC.journeys) {
  for (const page of ['chat', 'dashboard-chat', 'phones', 'flow']) {
    const f = ROOT + `uc/${j.slug}/${page}.html`;
    let h = fs.readFileSync(f, 'utf8');
    const a = h.indexOf(START), b = h.indexOf(END);
    if (a >= 0 && b > a) h = h.slice(0, a) + h.slice(b + END.length);
    const i = h.lastIndexOf('</body>');
    if (i < 0) throw new Error(f + ': no </body>');
    fs.writeFileSync(f, h.slice(0, i) + cta(j) + '\n' + h.slice(i));
  }
  console.log('added the bottom bar to', j.slug);
}

// shared page frame for the two new pages
const frame = (title, crumbs, body, extraCss = '') => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="icon" type="image/png" href="/favicon.png?v=2">
<title>${esc(title)} – EngageONE</title>
<style>
  *{box-sizing:border-box}
  body{margin:0;background:#EFEAE2;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:#111B21}
  header{background:#075E54;color:#fff;padding:14px 24px;display:flex;justify-content:space-between;align-items:center}
  header b{font-size:18px} header b span{color:#25D366}
  .hl{display:flex;align-items:center;gap:14px}
  .demo{font-size:18px;color:#D9FDD3;padding-left:14px;border-left:1px solid rgba(255,255,255,.35);white-space:nowrap}
  .demo strong{font-weight:700;color:#fff}
  .crumbs{display:flex;align-items:center;flex-wrap:wrap;gap:8px 12px;padding:14px 24px;background:#fff;border-bottom:1px solid #d5e3dc;font-weight:600;font-size:17px;line-height:1.2}
  .crumbs a{color:#075E54;text-decoration:none} .crumbs a:hover{text-decoration:underline}
  .crumbs .back{background:#075E54;color:#fff;padding:8px 14px;border-radius:99px;font-size:15px;margin-right:6px}
  .crumbs .sep{color:#8aa39b;font-weight:400} .crumbs .cur{color:#111B21}
  main{max-width:900px;margin:0 auto;padding:32px 20px 40px}
  h1{margin:0 0 8px;color:#075E54}
  .lead{margin:0 0 28px;color:#444;line-height:1.6;max-width:680px}
  ${extraCss}
</style>
</head>
<body>
<header><div class="hl"><b>Engage<span>ONE</span></b><span class="demo">Clinic <strong>Demo</strong></span></div></header>
<nav class="crumbs" aria-label="Breadcrumb">${crumbs}</nav>
${body}
</body>
</html>
`;

// 1. landing page
const cards = CLINIC.journeys.map((j, i) => `    <div class="card"><span class="n">${i + 1}</span><h3>${esc(j.title)}</h3><p>${esc(j.blurb)}</p>
      <a class="b pr" href="/uc/${j.slug}/dashboard-chat">Watch on laptop and phone</a><a class="b" href="/uc/${j.slug}/chat">Watch the phone chat</a></div>`).join('\n');
const landing = frame('Aesthetic Clinic journeys',
  `<a class="back" href="/uc/">‹ Back</a><a href="/uc/">Use cases</a> <span class="sep">›</span> <span class="cur">${esc(CLINIC.biz)}: 3 client journeys</span>`,
  `<main>
  <h1>${esc(CLINIC.biz)}</h1>
  <p class="lead">Three client journeys on WhatsApp for an aesthetic clinic: book, reschedule and get support. Each one plays by itself. Watch it on a phone, or on a laptop screen next to the phone to see what the clinic sees.</p>
  <div class="grid">
${cards}
  </div>
</main>
${cta(null)}`,
  `.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:20px}
  .card{background:#fff;border-radius:14px;padding:22px;box-shadow:0 4px 16px rgba(7,94,84,.12);position:relative;display:flex;flex-direction:column;gap:10px}
  .card .n{position:absolute;top:16px;right:18px;width:26px;height:26px;border-radius:50%;background:#D9FDD3;color:#075E54;font-size:13px;font-weight:700;display:grid;place-items:center}
  .card h3{margin:0;color:#075E54;padding-right:30px} .card p{margin:0;color:#444;line-height:1.5;font-size:15px;flex:1}
  .b{display:block;text-align:center;text-decoration:none;border-radius:99px;padding:10px 14px;font-weight:600;font-size:14.5px;background:#e3efe9;color:#075E54}
  .b.pr{background:#075E54;color:#fff}`);
fs.mkdirSync(ROOT + `uc/${CLINIC.slug}`, { recursive: true });
fs.writeFileSync(ROOT + `uc/${CLINIC.slug}/index.html`, landing);

// 2. proposal form
const boxes = CLINIC.journeys.map(j => `<label class="chk"><input type="checkbox" name="journeys" value="${j.key}"> ${esc(j.title)}</label>`).join('\n      ');
const proposal = frame('Ask for a proposal',
  `<a class="back" href="/uc/${CLINIC.slug}/">‹ Back</a><a href="/uc/${CLINIC.slug}/">${esc(CLINIC.biz)}</a> <span class="sep">›</span> <span class="cur">Ask for a proposal</span>`,
  `<main>
  <h1>Yes, this is for me!</h1>
  <p class="lead">Tell us about your clinic and we will send you a proposal. We use these details only to contact you about it.</p>
  <form id="f" class="form" novalidate>
    <label>Clinic name<input name="clinic" maxlength="120" autocomplete="organization" required></label>
    <label>Your name<input name="name" maxlength="120" autocomplete="name" required></label>
    <label>Cell number<input name="cell" type="tel" maxlength="30" autocomplete="tel" required></label>
    <label>Email<input name="email" type="email" maxlength="120" autocomplete="email" required></label>
    <fieldset><legend>Which journeys are you interested in?</legend>
      ${boxes}
    </fieldset>
    <label>Anything else we should know? (optional)<textarea name="note" maxlength="1000" rows="3"></textarea></label>
    <input name="website" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;width:1px;height:1px">
    <div id="err" class="err" hidden></div>
    <button type="submit" class="go" id="go">Send my request</button>
    <p class="fine">Your details are personal information. They are stored so we can reply, and you can ask us to delete them at any time.</p>
  </form>
  <div id="done" class="done" hidden><h2>Thank you!</h2><p>We have your request and will be in touch soon.</p><a class="go" href="/uc/${CLINIC.slug}/">Back to the journeys</a></div>
</main>
<script>
(function () {
  var f = document.getElementById('f'), err = document.getElementById('err'), go = document.getElementById('go');
  var q = new URLSearchParams(location.search).get('journey');
  var keys = ${JSON.stringify(CLINIC.journeys.map(j => j.key))};
  [].forEach.call(f.querySelectorAll('input[name=journeys]'), function (c) { c.checked = !q || keys.indexOf(q) < 0 || c.value === q; });
  f.addEventListener('submit', function (e) {
    e.preventDefault(); err.hidden = true;
    var d = new FormData(f);
    var body = { clinic: d.get('clinic'), name: d.get('name'), cell: d.get('cell'), email: d.get('email'), note: d.get('note'), website: d.get('website'),
      journeys: [].filter.call(f.querySelectorAll('input[name=journeys]'), function (c) { return c.checked; }).map(function (c) { return c.value; }) };
    go.disabled = true; go.textContent = 'Sending…';
    fetch('/api/proposal', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (x) {
        if (!x.ok) throw new Error(x.j.error || 'Something went wrong. Please try again.');
        f.hidden = true; document.getElementById('done').hidden = false; window.scrollTo(0, 0);
      })
      .catch(function (e2) { err.textContent = e2.message; err.hidden = false; go.disabled = false; go.textContent = 'Send my request'; });
  });
})();
</script>`,
  `.form{background:#fff;border-radius:16px;box-shadow:0 4px 18px rgba(7,94,84,.14);padding:24px;display:grid;gap:16px;max-width:560px}
  label{display:grid;gap:6px;font-weight:600;font-size:14.5px;color:#075E54}
  input,textarea{font:inherit;font-weight:400;color:#111B21;border:1px solid #b8cfc5;border-radius:10px;padding:11px 12px;width:100%}
  input:focus,textarea:focus{outline:2px solid #25D366;border-color:#25D366}
  fieldset{border:1px solid #d5e3dc;border-radius:10px;padding:10px 14px;display:grid;gap:8px} legend{font-weight:600;font-size:14.5px;color:#075E54;padding:0 6px}
  .chk{display:flex;align-items:center;gap:10px;font-weight:400;color:#111B21} .chk input{width:auto}
  .go{display:inline-block;background:#25D366;color:#053b2f;font-weight:700;font-size:17px;border:0;text-decoration:none;text-align:center;border-radius:99px;padding:13px 26px;cursor:pointer}
  .go:disabled{opacity:.6;cursor:default}
  .err{background:#fdecea;color:#8a1c12;border-radius:10px;padding:10px 12px;font-size:14.5px}
  .fine{margin:0;color:#667781;font-size:12.5px;line-height:1.4}
  .done{background:#fff;border-radius:16px;box-shadow:0 4px 18px rgba(7,94,84,.14);padding:28px 24px;max-width:560px} .done h2{margin:0 0 8px;color:#075E54} .done p{color:#444}
  [hidden]{display:none!important}`);
fs.writeFileSync(ROOT + `uc/${CLINIC.slug}/proposal.html`, proposal);
console.log('built uc/' + CLINIC.slug + '/index.html and proposal.html');
