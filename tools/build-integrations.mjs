// Builds uc/integrations/index.html: the master guide, organised by type of tool.  Run:  node tools/build-integrations.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { CHECKED, CASES, SECTIONS } from './integrations.mjs';
import { USECASES } from './all-cases.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..') + path.sep;
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const known = new Set(USECASES.map(u => u.slug));

const opt = (kind, [tool, note]) => `<div class="opt ${kind}"><span class="pill">${kind === 'easy' ? 'Easy' : 'Ideal'}</span><div><b>${esc(tool)}</b><p>${esc(note)}</p></div></div>`;
const item = it => {
  for (const s of it.used) if (!known.has(s)) throw new Error('unknown use case in integrations: ' + s);
  const used = it.used.length === Object.keys(CASES).length ? '<span class="all">All use cases</span>' : it.used.map(s => `<a href="/uc/${s}/requirements.html">${esc(CASES[s])}</a>`).join('');
  return `<article class="fn" data-t="${esc((it.title + ' ' + it.why + ' ' + it.easy.join(' ') + ' ' + it.ideal.map(i => i.join(' ')).join(' ')).toLowerCase())}"><h3>${esc(it.title)}</h3><p class="why">${esc(it.why)}</p>${opt('easy', it.easy)}${it.ideal.map(i => opt('ideal', i)).join('')}${it.note ? `<p class="fnote">${esc(it.note)}</p>` : ''}${used ? `<div class="used"><span>Used in:</span>${used}</div>` : ''}</article>`;
};
const total = SECTIONS.reduce((n, s) => n + s.items.length, 0);

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="icon" type="image/png" href="/favicon.png?v=2">
<title>Integration guide – EngageONE</title>
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
  main{max-width:1000px;margin:0 auto;padding:30px 20px 70px}
  h1{margin:0 0 8px;color:#075E54}
  h2{margin:34px 0 12px;color:#075E54;font-size:22px;scroll-margin-top:12px}
  .lead{margin:0 0 8px;color:#444;max-width:780px}
  .checked{font-size:13px;color:#667781;margin:0 0 18px}
  .tools{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin:0 0 6px}
  .tools input{flex:1;min-width:240px;padding:11px 14px;border:1px solid #cfd8d6;border-radius:10px;font-size:15px}
  .chips{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0 0}
  .chips a{background:#fff;color:#075E54;text-decoration:none;font-weight:600;font-size:14px;padding:6px 14px;border-radius:99px;box-shadow:0 1px 4px rgba(7,94,84,.15)}
  .chips a:hover{background:#D9FDD3}
  .legend{display:flex;gap:16px;flex-wrap:wrap;font-size:13px;color:#44575a;margin:14px 0 0;align-items:center}
  .fns{display:grid;grid-template-columns:repeat(auto-fill,minmax(440px,1fr));gap:18px}
  .fn{background:#fff;border-radius:14px;padding:18px 20px;box-shadow:0 4px 16px rgba(7,94,84,.12)}
  .fn.hide{display:none}
  .fn h3{margin:0 0 2px;color:#075E54;font-size:18px}
  .why{margin:0 0 12px;color:#667781;font-size:14px}
  .opt{display:flex;gap:12px;align-items:flex-start;padding:10px 0;border-top:1px solid #eef1f0}
  .opt p{margin:2px 0 0;font-size:14px;color:#44575a}
  .pill{flex:none;font-size:12px;font-weight:700;padding:3px 10px;border-radius:99px;margin-top:2px}
  .easy .pill{background:#D9FDD3;color:#075E54} .ideal .pill{background:#DDEBFF;color:#0d3b66}
  .fnote{margin:8px 0 0;font-size:13px;color:#6b4e00;background:#FFF4D6;border-radius:8px;padding:8px 10px}
  .used{display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin-top:12px;padding-top:10px;border-top:1px solid #eef1f0;font-size:12.5px;color:#667781}
  .used a{background:#eef6f1;color:#075E54;text-decoration:none;padding:2px 9px;border-radius:99px;font-weight:600}
  .used a:hover{background:#D9FDD3} .used .all{font-weight:600;color:#075E54}
  .card{background:#fff;border-radius:14px;padding:16px 20px;box-shadow:0 4px 16px rgba(7,94,84,.12);margin:18px 0 0}
  .empty{display:none;margin-top:20px;color:#667781}
  @media (max-width:760px){.fns{grid-template-columns:1fr}.crumbs{padding:12px 16px;font-size:16px}header.site{padding:12px 16px}}
</style>
</head>
<body>
<header class="site"><b>Engage<span>ONE</span></b><a href="/logout">Sign out</a></header>
<nav class="crumbs" aria-label="Breadcrumb"><a class="back" href="/uc/">‹ Back</a><a href="/uc/">Use cases</a> <span class="sep">›</span> <span class="cur">Integration guide</span></nav>
<main>
  <h1>Integration guide</h1>
  <p class="lead">What you need to connect, by type of tool, with an <b>easy</b> option and one or more <b>ideal</b> options for each. Chosen for what South African small businesses use most, with the information we have today.</p>
  <p class="checked">Prepared ${CHECKED}. ${total} tool types. We will update this guide when S10U answers our questions. Popularity is our judgement, not market share. ⚠ means the API access, price or availability was not verified. Per-demo versions are linked under “Used in”.</p>

  <div class="tools"><input id="q" type="search" placeholder="Search: calendar, CRM, payments, Dineplan, Xero …" aria-label="Search the guide"></div>
  <div class="chips">${SECTIONS.map(s => `<a href="#${s.id}">${esc(s.title)}</a>`).join('')}<a href="/uc/s10u/">S10U platform facts →</a></div>
  <div class="legend"><span><span class="pill" style="background:#D9FDD3;color:#075E54">Easy</span> cheap or free, quick, little or no code</span><span><span class="pill" style="background:#DDEBFF;color:#0d3b66">Ideal</span> best fit as you grow</span></div>

  ${SECTIONS.map(s => `<section id="${s.id}" data-sec><h2>${esc(s.title)}</h2><div class="fns">${s.items.map(item).join('')}</div></section>`).join('\n  ')}
  <p class="empty" id="empty">Nothing matches. Try a shorter word.</p>

  <div class="card"><b>How connections get made.</b> S10U says it has 80+ integrations, but publishes only categories. For each tool above there are four routes: (1) a ready S10U connector, (2) S10U custom development or its API, (3) an automation tool (Make, n8n or Zapier) through webhooks, or (4) staff confirming in the inbox, which is the easy option for most demos. See <a href="/uc/s10u/">S10U platform facts</a> for what is stated, what is not, and the questions we are asking S10U.</div>
</main>
<script>
const q = document.getElementById('q'), cards = [...document.querySelectorAll('.fn')], secs = [...document.querySelectorAll('[data-sec]')];
q.addEventListener('input', () => {
  const t = q.value.trim().toLowerCase();
  cards.forEach(c => c.classList.toggle('hide', !!t && !c.dataset.t.includes(t)));
  secs.forEach(s => s.style.display = s.querySelector('.fn:not(.hide)') ? '' : 'none');
  document.getElementById('empty').style.display = cards.some(c => !c.classList.contains('hide')) ? 'none' : 'block';
});
</script>
</body>
</html>
`;
fs.mkdirSync(ROOT + 'uc/integrations', { recursive: true });
fs.writeFileSync(ROOT + 'uc/integrations/index.html', html);
console.log('built uc/integrations/index.html:', total, 'tool types in', SECTIONS.length, 'sections');
