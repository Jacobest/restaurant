// Merges the original 5 use cases with one module per extra use case in tools/cases/<slug>.mjs.
// A case module is: export default { meta, chat, journey, requirements }  (see tools/cases/README.md)
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pathToFileURL } from 'url';
import { USECASES as BASE } from './usecases.mjs';
import { JOURNEYS as BASE_J } from './journeys.mjs';
import { REQS as BASE_R, COMMON } from './requirements.mjs';

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'cases');

// Order on the use cases page, after the original 5.
export const ORDER = [
  'hotel-guest-house', 'gym-classes', 'vehicle-service', 'takeaway-order', 'retail-catalogue', 'quote-request',
  'delivery-tracking', 'payment-reminders', 'loyalty-rewards', 'feedback-reviews', 'event-tickets', 'real-estate-viewing', 'school-fees',
];

export const USECASES = [...BASE];
export const JOURNEYS = { ...BASE_J };
export const REQS = { ...BASE_R };
export { COMMON };

const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => f.endsWith('.mjs') && !f.startsWith('_')) : [];
const found = new Map();
for (const f of files) {
  const mod = (await import(pathToFileURL(path.join(dir, f)).href)).default;
  if (!mod || !mod.meta) throw new Error(`tools/cases/${f} has no default export with meta`);
  found.set(mod.meta.slug, mod);
}
const slugs = [...ORDER.filter(s => found.has(s)), ...[...found.keys()].filter(s => !ORDER.includes(s))];
for (const slug of slugs) {
  const m = found.get(slug);
  USECASES.push({ ...m.meta, chat: m.chat });
  JOURNEYS[slug] = m.journey;
  REQS[slug] = m.requirements;
}
