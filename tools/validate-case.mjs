// Checks one case module without building anything.   node tools/validate-case.mjs <slug>
// Exit code 0 = OK. Prints every problem it finds.
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const slug = process.argv[2];
if (!slug) { console.error('usage: node tools/validate-case.mjs <slug>'); process.exit(2); }
const errs = [];
const bad = m => errs.push(m);

const mod = (await import(pathToFileURL(path.join(dir, 'cases', slug + '.mjs')).href)).default;
const { meta, chat, journey, requirements } = mod || {};
if (!meta) { console.error('no meta'); process.exit(1); }

// --- meta ---
for (const k of ['slug', 'name', 'label', 'emoji', 'biz', 'who', 'journeyTitle', 'lead', 'active', 'grad', 'icon', 'card'])
  if (!meta[k] || typeof meta[k] !== 'string') bad(`meta.${k} missing`);
if (meta.slug !== slug) bad('meta.slug must equal the file name');
if (!Array.isArray(meta.contacts) || meta.contacts.length !== 4 || meta.contacts.some(c => !Array.isArray(c) || c.length !== 3 || c.some(x => typeof x !== 'string'))) bad('meta.contacts must be 4 x [name, time, preview]');
if (meta.card && meta.card.length > 130) bad('meta.card is too long (max 130 characters)');
if (meta.icon && /<(script|image|foreignObject)/i.test(meta.icon)) bad('meta.icon must be plain SVG shapes');

// --- chat: run it with the same helpers the chat page uses ---
const tplLines = fs.readFileSync(path.join(dir, '..', 'uc/restaurant-booking/chat.html'), 'utf8').split('\n');
const a = tplLines.findIndex(l => l.startsWith('function buildPhones')), b = tplLines.findIndex(l => l.startsWith('  const steps = ['));
const helpers = tplLines.slice(a + 1, b).join('\n');
let steps = [];
try { steps = new Function(helpers + '\n' + chat + '\nreturn steps;')(); } catch (e) { bad('chat code does not run: ' + e.message); }
if (!Array.isArray(steps) || steps.length < 6 || steps.length > 12) bad(`chat needs 6 to 12 steps, has ${steps.length || 0}`);
steps.forEach(([t, msgs], i) => {
  if (typeof t !== 'string' || !Array.isArray(msgs) || msgs.length < 2) bad(`chat step ${i + 1} malformed`);
  else if (msgs.some(m => typeof m !== 'string' || !m.startsWith('<div'))) bad(`chat step ${i + 1} has a non-HTML message`);
});
const all = JSON.stringify(steps);
if (/\[[A-Z][A-Za-z0-9 ]+\]/.test(all)) bad('chat contains a [Placeholder]');
if (!all.includes(meta.biz)) bad('chat never shows the client name (meta.biz)');
if (!Array.isArray(meta.summary) || meta.summary.length !== steps.length) bad(`meta.summary needs exactly ${steps.length} lines (one per step), has ${meta.summary?.length}`);

// --- journey ---
const j = journey || {};
if (!Array.isArray(j.lanes) || j.lanes.length !== 4) bad('journey.lanes must have exactly 4 lanes');
const ids = new Set(), pos = new Set();
const types = ['start', 'step', 'system', 'decision', 'human', 'offline', 'end'];
for (const n of j.nodes || []) {
  const [id, col, lane, type, label] = n;
  if (ids.has(id)) bad('duplicate node id ' + id); ids.add(id);
  if (!Number.isInteger(col) || col < 0 || col > 20) bad(`node ${id}: bad col`);
  if (!Number.isInteger(lane) || lane < 0 || lane > 3) bad(`node ${id}: lane must be 0 to 3`);
  if (!types.includes(type)) bad(`node ${id}: bad type ${type}`);
  if (typeof label !== 'string' || label.split('\n').some(l => l.length > 22) || label.split('\n').length > 3) bad(`node ${id}: label lines must be 22 characters or fewer, max 3 lines`);
  const k = col + ':' + lane; if (pos.has(k)) bad(`two nodes share col ${col} lane ${lane}`); pos.add(k);
}
if ((j.nodes || []).length < 12 || (j.nodes || []).length > 20) bad('journey needs 12 to 20 nodes');
const nodeById = Object.fromEntries((j.nodes || []).map(n => [n[0], n]));
for (const [f, t, , mode] of j.edges || []) {
  if (!nodeById[f] || !nodeById[t]) { bad(`edge ${f}->${t} uses an unknown node`); continue; }
  const [, c1, l1] = nodeById[f], [, c2, l2] = nodeById[t];
  if (mode !== 'back' && c2 < c1) bad(`edge ${f}->${t} goes backwards; mark it 'back'`);
  if (mode === 'back' && Math.abs(l1 - l2) !== 1) bad(`back edge ${f}->${t} must join neighbouring lanes`);
  if (mode !== 'back' && c1 !== c2 && l1 !== l2) { // elbow edge: its vertical run sits between the two columns; reject if a node sits in the gap column
    const mid = (c1 + c2) / 2; if (Number.isInteger(mid) && [...pos].some(k => { const [c, l] = k.split(':').map(Number); return c === mid && l >= Math.min(l1, l2) && l <= Math.max(l1, l2); })) bad(`edge ${f}->${t} would cross a node in column ${mid}`);
  }
  if (mode !== 'back' && l1 === l2 && c2 - c1 > 1 && [...pos].some(k => { const [c, l] = k.split(':').map(Number); return l === l1 && c > c1 && c < c2; })) bad(`edge ${f}->${t} runs through a node in the same lane`);
}
const linked = new Set((j.edges || []).flatMap(e => [e[0], e[1]]));
for (const id of ids) if (!linked.has(id)) bad(`node ${id} has no edges`);
const maxCol = Math.max(0, ...(j.nodes || []).map(n => n[1]));
for (const [s, c1, c2] of j.stages || []) if (c1 > c2 || c2 > maxCol) bad(`stage ${s} has bad columns`);
if (!(j.stages || []).length) bad('journey.stages missing');

// --- requirements ---
const r = requirements || {};
if (typeof r.intro !== 'string' || !r.intro) bad('requirements.intro missing');
if (!Array.isArray(r.functions) || r.functions.length < 6) bad('requirements needs at least 6 functions');
for (const f of r.functions || []) {
  if (!f.fn || !f.why || !Array.isArray(f.easy) || f.easy.length !== 2 || !Array.isArray(f.ideal) || !f.ideal.length || f.ideal.some(i => !Array.isArray(i) || i.length !== 2)) bad(`function "${f.fn}" must have fn, why, easy [tool, note], ideal [[tool, note], ...]`);
}

if (errs.length) { console.error(`${slug}: ${errs.length} problem(s)\n - ` + errs.join('\n - ')); process.exit(1); }
console.log(`${slug}: OK (${steps.length} steps, ${j.nodes.length} nodes, ${j.edges.length} edges, ${r.functions.length} functions)`);
