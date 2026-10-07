// Builds uc/<slug>/chat.html (demo 1: live phone chat) for use cases that define `chat` in tools/cases/.
// (The original 5 already have a hand-checked chat.html.) Run:  node tools/build-chats.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { USECASES } from './all-cases.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..') + path.sep;
const swap = (h, a, b, label) => { if (!h.includes(a)) throw new Error('template changed, missing: ' + label); return h.split(a).join(b); };
const REF = USECASES.find(u => u.reference);
const tpl = fs.readFileSync(ROOT + `uc/${REF.slug}/chat.html`, 'utf8');

for (const u of USECASES.filter(x => x.chat)) {
  let c = tpl;
  const L = c.split('\n');
  const a = L.findIndex(l => l.startsWith('  const steps = ['));
  const b = L.findIndex((l, i) => i > a && l === '  ];');
  if (a < 0 || b < 0) throw new Error('steps block not found in template');
  c = L.slice(0, a).join('\n') + '\n' + u.chat.trimEnd() + '\n' + L.slice(b + 1).join('\n');
  c = swap(c, REF.biz, u.biz, 'business name');
  c = swap(c, REF.emoji, u.emoji, 'emoji');
  c = swap(c, `${REF.label} <strong>Demo</strong>`, `${u.label} <strong>Demo</strong>`, 'label');
  c = c.replace(/<title>.*?<\/title>/, `<title>EngageONE – ${u.name} live chat</title>`);
  c = c.replace(/<nav class="crumbs"[\s\S]*?<\/nav>/, `<nav class="crumbs" aria-label="Breadcrumb" id="crumbs" hidden><a class="back" href="/uc/${u.slug}/">‹ Back</a><a href="/uc/">Use cases</a> <span class="sep">›</span> <a href="/uc/${u.slug}/">${u.name}</a> <span class="sep">›</span> <span class="cur">Live chat</span></nav>`);
  fs.mkdirSync(ROOT + `uc/${u.slug}`, { recursive: true });
  fs.writeFileSync(ROOT + `uc/${u.slug}/chat.html`, c);
  console.log('built chat', u.slug);
}
