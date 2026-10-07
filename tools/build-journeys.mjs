// Builds uc/<slug>/flow.html (demo 4: guest journey diagram) from tools/journeys.mjs.
// Run:  node tools/build-journeys.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { USECASES } from './all-cases.mjs';
import { JOURNEYS } from './all-cases.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..') + path.sep;
const STYLE = {
  start: { fill: '#25D366', stroke: '#075E54', text: '#06352f', rx: 28 },
  step: { fill: '#ffffff', stroke: '#128C7E', text: '#111B21', rx: 10 },
  system: { fill: '#E3F2FD', stroke: '#1976D2', text: '#0d3b66', rx: 4 },
  decision: { fill: '#FFF8E1', stroke: '#F9A825', text: '#5d4300' },
  human: { fill: '#EDE7F6', stroke: '#7E57C2', text: '#2e1a63', rx: 10 },
  offline: { fill: '#F5F5F5', stroke: '#9e9e9e', text: '#444', rx: 10, dash: '5 4' },
  end: { fill: '#075E54', stroke: '#075E54', text: '#ffffff', rx: 28 },
};
const COLW = 184, NW = 150, NH = 58, LANEH = 124, HEAD = 44, PAD = 24;
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

function diagram(j) {
  const cols = Math.max(...j.nodes.map(n => n[1])) + 1;
  const W = PAD * 2 + cols * COLW, H = HEAD + j.lanes.length * LANEH + 8;
  const N = {};
  for (const [id, col, lane, type, label] of j.nodes) {
    const h = type === 'decision' ? 76 : NH;
    N[id] = { id, type, label, lane, w: NW, h, cx: PAD + col * COLW + COLW / 2, cy: HEAD + lane * LANEH + LANEH / 2 };
  }
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="Inter,system-ui,sans-serif">
<defs><marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#4b6b66"/></marker></defs>`;
  j.lanes.forEach((_, i) => { s += `<rect x="0" y="${HEAD + i * LANEH}" width="${W}" height="${LANEH}" fill="${i % 2 ? '#e9f4ee' : '#f4faf7'}"/><line x1="0" x2="${W}" y1="${HEAD + i * LANEH}" y2="${HEAD + i * LANEH}" stroke="#cfe3d8"/>`; });
  for (const [label, a, b] of j.stages) {
    const x = PAD + a * COLW + 4, w = (b - a + 1) * COLW - 8;
    s += `<rect x="${x}" y="6" width="${w}" height="${HEAD - 14}" rx="8" fill="#075E54"/><text x="${x + w / 2}" y="${6 + (HEAD - 14) / 2 + 5}" text-anchor="middle" font-size="14" font-weight="600" fill="#fff">${esc(label)}</text>`;
  }
  // edges first (under nodes)
  const labels = [];
  for (const [from, to, label, mode] of j.edges) {
    const a = N[from], b = N[to];
    if (!a || !b) throw new Error('edge references missing node: ' + from + '->' + to);
    let d, lx, ly;
    if (mode === 'back') {
      const dir = b.cy < a.cy ? -1 : 1;
      const yb = HEAD + a.lane * LANEH + (dir < 0 ? 0 : LANEH);
      d = `M${a.cx} ${a.cy + dir * a.h / 2} V${yb} H${b.cx} V${b.cy - dir * b.h / 2}`;
      lx = (a.cx + b.cx) / 2; ly = yb;
    } else if (a.cy === b.cy) {
      d = `M${a.cx + a.w / 2} ${a.cy} H${b.cx - b.w / 2}`; lx = (a.cx + a.w / 2 + b.cx - b.w / 2) / 2; ly = a.cy - 8;
    } else if (a.cx === b.cx) {
      const dir = b.cy > a.cy ? 1 : -1;
      d = `M${a.cx} ${a.cy + dir * a.h / 2} V${b.cy - dir * b.h / 2}`; lx = a.cx + 6; ly = (a.cy + b.cy) / 2;
    } else {
      const x1 = a.cx + a.w / 2, x2 = b.cx - b.w / 2, mx = (x1 + x2) / 2;
      d = `M${x1} ${a.cy} H${mx} V${b.cy} H${x2}`; lx = mx; ly = (a.cy + b.cy) / 2;
    }
    s += `<path d="${d}" fill="none" stroke="#4b6b66" stroke-width="1.6" marker-end="url(#ar)"${mode === 'back' ? ' stroke-dasharray="5 4"' : ''}/>`;
    if (label) labels.push([lx, ly, label]);
  }
  for (const n of Object.values(N)) {
    const st = STYLE[n.type], x = n.cx - n.w / 2, y = n.cy - n.h / 2;
    if (n.type === 'decision') s += `<polygon points="${n.cx},${y} ${x + n.w},${n.cy} ${n.cx},${y + n.h} ${x},${n.cy}" fill="${st.fill}" stroke="${st.stroke}" stroke-width="1.6"/>`;
    else s += `<rect x="${x}" y="${y}" width="${n.w}" height="${n.h}" rx="${st.rx}" fill="${st.fill}" stroke="${st.stroke}" stroke-width="1.6"${st.dash ? ` stroke-dasharray="${st.dash}"` : ''}/>`;
    const lines = n.label.split('\n'), y0 = n.cy - (lines.length - 1) * 8 + 4;
    lines.forEach((t, i) => { s += `<text x="${n.cx}" y="${y0 + i * 16}" text-anchor="middle" font-size="12.5" font-weight="500" fill="${st.text}">${esc(t)}</text>`; });
  }
  for (const [x, y, t] of labels) {
    const w = t.length * 6.4 + 12;
    s += `<rect x="${x - w / 2}" y="${y - 10}" width="${w}" height="18" rx="9" fill="#fff" stroke="#cfe3d8"/><text x="${x}" y="${y + 3}" text-anchor="middle" font-size="11" font-weight="600" fill="#075E54">${esc(t)}</text>`;
  }
  return { svg: s + '</svg>', W, H };
}

function page(u, j) {
  const { svg, W, H } = diagram(j);
  const lanes = JSON.stringify(j.lanes);
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="icon" type="image/png" href="/favicon.png?v=2">
<title>EngageONE – ${u.name} journey diagram</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&display=swap">
<style>
  *{box-sizing:border-box}
  body{margin:0;background:#F0F7F2;color:#111B21;font-family:Inter,system-ui,sans-serif;-webkit-font-smoothing:antialiased}
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
  .top{padding:22px 24px 8px}
  h1{margin:0;font-family:'Cormorant Garamond',Georgia,serif;font-weight:600;font-size:clamp(28px,4vw,42px);color:#075E54;line-height:1.05}
  .sub{font-family:'Cormorant Garamond',Georgia,serif;font-style:italic;font-size:20px;margin-top:6px}
  .bar{display:flex;gap:18px;align-items:center;flex-wrap:wrap;padding:10px 24px;font-size:14px}
  .legend{display:flex;gap:14px;flex-wrap:wrap}
  .legend span{display:inline-flex;align-items:center;gap:6px}
  .legend i{width:16px;height:12px;border-radius:3px;border:1.5px solid;display:inline-block}
  .wrap{display:flex;margin:0 24px 40px;border:1px solid #cfe3d8;border-radius:10px;overflow:hidden;background:#fff}
  .labels{flex:none;width:112px;border-right:1px solid #cfe3d8;background:#fff}
  .labels div{display:flex;align-items:center;padding:0 10px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:#075E54;border-top:1px solid #cfe3d8}
  .labels div:first-child{border-top:0}
  .scroll{flex:1;overflow:auto}
  @media (max-width:600px){.top,.bar{padding-left:16px;padding-right:16px}.wrap{margin:0 12px 30px}.labels{width:84px}.labels div{font-size:10.5px;padding:0 6px}.crumbs{padding:12px 16px;font-size:16px}header.site{padding:12px 16px}.demo{font-size:15px;padding-left:10px}.hl{gap:10px}}
</style>
</head>
<body>
<header class="site"><div class="hl"><b>Engage<span>ONE</span></b><span class="demo">${u.label} <strong>Demo</strong></span></div><a href="/logout">Sign out</a></header>
<nav class="crumbs" aria-label="Breadcrumb"><a class="back" href="/uc/${u.slug}/">‹ Back</a><a href="/uc/">Use cases</a> <span class="sep">›</span> <a href="/uc/${u.slug}/">${u.name}</a> <span class="sep">›</span> <span class="cur">Journey diagram</span></nav>
<div class="top"><h1>${u.journeyTitle}</h1><div class="sub">${u.biz} · How the conversation moves between the ${u.who}, the bot, your systems and your team</div></div>
<div class="bar">
  <label>Zoom <input id="zoom" type="range" min="40" max="130" value="80"></label>
  <div class="legend">
    <span><i style="background:#25D366;border-color:#075E54"></i>Start</span>
    <span><i style="background:#fff;border-color:#128C7E"></i>Chat step</span>
    <span><i style="background:#E3F2FD;border-color:#1976D2"></i>System</span>
    <span><i style="background:#FFF8E1;border-color:#F9A825"></i>Decision</span>
    <span><i style="background:#EDE7F6;border-color:#7E57C2"></i>Team member</span>
    <span><i style="background:#F5F5F5;border-color:#9e9e9e;border-style:dashed"></i>Offline</span>
    <span><i style="background:#075E54;border-color:#075E54"></i>End</span>
  </div>
</div>
<div class="wrap"><div class="labels" id="labels"></div><div class="scroll" id="scroll">${svg}</div></div>
<script>
const LANES = ${lanes}, HEAD = ${HEAD}, LANEH = ${LANEH}, W = ${W}, H = ${H};
const svg = document.querySelector('svg'), labels = document.getElementById('labels');
function apply() {
  const s = document.getElementById('zoom').value / 100;
  svg.setAttribute('width', W * s); svg.setAttribute('height', H * s);
  labels.innerHTML = '<div style="height:' + (HEAD * s) + 'px;border:0"></div>' + LANES.map(l => '<div style="height:' + (LANEH * s) + 'px">' + l + '</div>').join('') + '<div style="height:' + (8 * s) + 'px;border-top:1px solid #cfe3d8"></div>';
}
document.getElementById('zoom').addEventListener('input', apply);
if (innerWidth < 700) document.getElementById('zoom').value = 55;
apply();
</script>
</body>
</html>
`;
}

for (const u of USECASES) {
  const j = JOURNEYS[u.slug];
  if (!j) continue;
  fs.writeFileSync(ROOT + `uc/${u.slug}/flow.html`, page(u, j));
  console.log('built', u.slug, j.nodes.length + ' nodes', j.edges.length + ' edges');
}
