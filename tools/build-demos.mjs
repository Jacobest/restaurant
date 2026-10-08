// Builds, for every non-reference use case:
//   uc/<slug>/dashboard-chat.html  (demo 2: phone + S10U dashboard, synced)
//   uc/<slug>/phones.html          (demo 3: static phone chat screens)
// Templates are the restaurant pages. Run:  node tools/build-demos.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { USECASES } from './all-cases.mjs';
import { VIEWS, COMMON_CSS } from './dashboard-views.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..') + path.sep;
const read = f => fs.readFileSync(ROOT + f, 'utf8');
const write = (f, s) => { fs.mkdirSync(path.dirname(ROOT + f), { recursive: true }); fs.writeFileSync(ROOT + f, s); };
const swap = (h, a, b, label) => { if (!h.includes(a)) throw new Error('template changed, missing: ' + (label || a.slice(0, 60))); return h.split(a).join(b); };
const sub = (h, re, to, label) => { if (!re.test(h)) throw new Error('template changed, no match: ' + label); return h.replace(re, () => to); };
const WORDS = { 7: 'seven', 8: 'eight', 9: 'nine', 10: 'ten', 11: 'eleven', 12: 'twelve' };

const REF = USECASES.find(u => u.reference);
// The dashboard template is the restaurant's page without any extra view (tools/templates/).
const refDash = read('tools/templates/dashboard-chat.template.html');
const refPhones = read(`uc/${REF.slug}/phones.html`);

// helpers + steps block of a chat page: from "function buildPhones() {" to "  ];"
function stepsBlock(html) {
  const L = html.split('\n');
  const a = L.findIndex(l => l.startsWith('function buildPhones'));
  const b = L.findIndex((l, i) => i > a && l === '  ];');
  if (a < 0 || b < 0) throw new Error('steps block not found');
  return { lines: L.slice(a + 1, b + 1), count: (L.slice(a + 1, b + 1).join('\n').match(/^    \['/gm) || []).length };
}
const crumbs = (u, last, extra = '') => `<nav class="crumbs" aria-label="Breadcrumb"${extra}><a class="back" href="/uc/${u.slug}/">‹ Back</a><a href="/uc/">Use cases</a> <span class="sep">›</span> <a href="/uc/${u.slug}/">${u.name}</a> <span class="sep">›</span> <span class="cur">${last}</span></nav>`;

// Add the optional extra tab view (shown after the chat) to a dashboard page.
const addView = (d, view) => {
  d = d.replace('<!--EXTRA_VIEWS-->', () => (view ? view.html : ''));
  if (view) {
    d = d.replace('</style>', () => COMMON_CSS + view.css + '</style>');
    d = d.replace('</body>', () => '<script>' + view.js + '</script>\n</body>');
  }
  return d;
};
// The reference use case already has its own chat in the template, so only its view is added.
write(`uc/${REF.slug}/dashboard-chat.html`, addView(refDash, VIEWS[REF.slug]));

for (const u of USECASES.filter(x => !x.reference)) {
  const { lines, count } = stepsBlock(read(`uc/${u.slug}/chat.html`));
  if (u.summary.length !== count) throw new Error(`${u.slug}: ${count} steps but ${u.summary.length} summary lines`);

  // ---------- dashboard chat ----------
  let d = refDash;
  // swap the steps (inside loadSteps) first, so the restaurant text is gone before the global renames
  const L = d.split('\n');
  const a = L.findIndex(l => l.startsWith('function loadSteps'));
  const b = L.findIndex((l, i) => i > a && l === '  return steps;');
  if (a < 0 || b < 0) throw new Error('loadSteps not found');
  d = L.slice(0, a + 1).join('\n') + '\n' + lines.join('\n') + '\n' + L.slice(b).join('\n');
  d = sub(d, /const SUMMARY = \[[\s\S]*?\n  \];/, 'const SUMMARY = [\n' + u.summary.map(s => '    ' + JSON.stringify(s) + ',').join('\n') + '\n  ];', 'SUMMARY');
  d = swap(d, REF.biz, u.biz, 'business name');
  d = swap(d, REF.emoji, u.emoji, 'emoji');
  d = swap(d, `${REF.label} <strong>Demo</strong>`, `${u.label} <strong>Demo</strong>`, 'label');
  d = sub(d, /<title>.*?<\/title>/, `<title>EngageONE – ${u.name} live chat with dashboard</title>`, 'title');
  d = sub(d, /<nav class="crumbs"[\s\S]*?<\/nav>/, crumbs(u, 'Live chat with dashboard', ' id="crumbs" hidden'), 'crumbs');
  // The first contact is the live chat; the next two show a green "online" dot, the rest do not.
  const ct = (n, time, preview, { on = false, dot = false } = {}) =>
    `<div class="ct${on ? ' on' : ''}"><span class="cb2"></span><div class="av">${n[0]}${dot ? '<b></b>' : ''}</div><div class="tx"><div class="r1"><span>${n}</span><small${on ? ' id="ctime"' : ''}>${time}</small></div><div class="r2"${on ? ' id="cprev"' : ''}>${preview}</div></div></div>`;
  const list = [
    ct(u.active, 'Just now', 'Starting a chat…', { on: true, dot: true }),
    ...u.contacts.map(([n, t, pv], i) => ct(n, t, pv, { dot: i < 2 })),
  ];
  d = sub(d, /<div class="ct on">[\s\S]*?(?=\n          <\/div>\n\n          <div class="pane chatp">)/, list.join('\n            '), 'contacts');
  d = addView(d, VIEWS[u.slug]);
  write(`uc/${u.slug}/dashboard-chat.html`, d);

  // ---------- static phone screens ----------
  let p = refPhones;
  const P = p.split('\n');
  const pa = P.findIndex(l => l.startsWith('function buildPhones'));
  const pb = P.findIndex((l, i) => i > pa && l === '  ];');
  if (pa < 0 || pb < 0) throw new Error('phones steps not found');
  p = P.slice(0, pa + 1).join('\n') + '\n' + lines.join('\n') + '\n' + P.slice(pb + 1).join('\n');
  p = swap(p, REF.biz, u.biz, 'phones biz');
  p = swap(p, REF.emoji, u.emoji, 'phones emoji');
  p = swap(p, `${REF.label} <strong>Demo</strong>`, `${u.label} <strong>Demo</strong>`, 'phones label');
  p = swap(p, REF.journeyTitle, u.journeyTitle, 'journey title');
  p = swap(p, 'The twelve steps as the guest sees them', `The ${WORDS[count] || count} steps as the ${u.who} sees them`, 'subtitle');
  p = sub(p, /<title>.*?<\/title>/, `<title>EngageONE – ${u.name} phone chat screens</title>`, 'phones title');
  p = sub(p, /<nav class="crumbs"[\s\S]*?<\/nav>/, crumbs(u, 'Phone chat screens'), 'phones crumbs');
  write(`uc/${u.slug}/phones.html`, p);
  console.log('built', u.slug, count + ' steps');
}
