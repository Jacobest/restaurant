// Rebuilds the card grid on uc/index.html (the use cases page) from the data. Run:  node tools/build-hub.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { USECASES } from './all-cases.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..') + path.sep;
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
let hub = fs.readFileSync(ROOT + 'uc/index.html', 'utf8');
const m = hub.match(/<div class="grid">[\s\S]*?\n  <\/div>\n<\/main>/);
if (!m) throw new Error('grid not found in uc/index.html');

const cards = USECASES.map(u => {
  if (!u.grad || !u.icon || !u.card) throw new Error(`${u.slug}: meta needs grad, icon and card`);
  return `    <a class="card" href="/uc/${u.slug}/">
      <div class="img" style="background:linear-gradient(135deg,${u.grad})">
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">${u.icon}</svg>
      </div>
      <div class="body">
        <h2>${esc(u.name)}</h2>
        <p>${esc(u.card)}</p>
        <span class="tag">Demo ready</span>
      </div>
    </a>`;
});
hub = hub.replace(/<p class="sub">[\s\S]*?<\/p>/, '<p class="sub">Pick a use case to see how it works on WhatsApp. <a href="/uc/s10u/" style="color:#128C7E;font-weight:600">S10U platform facts and integrations →</a></p>');
hub = hub.replace(m[0], '<div class="grid">\n\n' + cards.join('\n\n') + '\n\n  </div>\n</main>');
fs.writeFileSync(ROOT + 'uc/index.html', hub);
console.log('hub built with', cards.length, 'cards');
