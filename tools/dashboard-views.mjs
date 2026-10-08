// Extra dashboard views shown after the chat ends (demo 2). One entry per use case slug.
// Each view = { tab, css, html, js }. build-demos.mjs injects them into uc/<slug>/dashboard-chat.html.
// The template provides window.__dash = { onStart[], onEnd[], setView(name) } and the tab menu.

const doctorCss = `
  .xview{flex:1;min-height:0;display:flex;gap:12px}
  .xview[hidden]{display:none}
  .xview .cal{flex:1;min-width:0;display:flex;flex-direction:column;padding:0}
  .cal-head{display:flex;align-items:center;gap:16px;padding:12px 16px;border-bottom:1px solid #f0f0f5}
  .cal-nav{display:flex;align-items:center;gap:8px}
  .cal-nav b{font-size:18px;min-width:150px;text-align:center}
  .cal-nav .bt{width:30px;height:30px;border-radius:8px;background:#f0f1f6;display:grid;place-items:center;font-size:16px;color:#31365a}
  .cal-nav .today{border-radius:8px;background:#e9ecf8;color:#0a3a9a;padding:6px 12px;font-size:13px;font-weight:600}
  .cal-leg{display:flex;gap:14px;font-size:12.5px;color:#4a4d5c;margin-left:auto;align-items:center}
  .cal-leg i{display:inline-block;width:10px;height:10px;border-radius:3px;margin-right:5px}
  .seg{display:flex;background:#f0f1f6;border-radius:8px;padding:3px;font-size:13px}
  .seg span{padding:4px 12px;border-radius:6px;color:#4a4d5c}
  .seg span.on{background:#fff;color:#0a3a9a;font-weight:600;box-shadow:0 1px 3px rgba(0,0,0,.12)}
  .cal-grid{flex:1;min-height:0;display:grid;grid-template-columns:repeat(7,1fr);grid-template-rows:30px repeat(6,1fr)}
  .cal-grid .dow{font-size:12px;font-weight:600;color:#7d7f8d;padding:8px 10px;border-bottom:1px solid #f0f0f5;text-transform:uppercase;letter-spacing:.04em}
  .cal-grid .day{border-right:1px solid #f0f0f5;border-bottom:1px solid #f0f0f5;padding:6px 6px 4px;min-height:0;overflow:hidden}
  .cal-grid .day:nth-child(7n+1){border-right:0}
  .cal-grid .day.out{background:#fafafc}
  .cal-grid .day.out .dn{color:#b4b6c2}
  .cal-grid .day.wk{background:#fcfcfe}
  .cal-grid .dn{font-size:13px;font-weight:600;margin-bottom:2px;display:inline-grid;place-items:center;min-width:24px;height:24px;border-radius:12px;padding:0 4px}
  .cal-grid .day.td .dn{background:#0a3a9a;color:#fff}
  .ap{font-size:11.5px;border-radius:5px;padding:2px 6px;margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;border-left:3px solid}
  .ap.d1{background:#e5f1ff;border-color:#2d7ff0;color:#0a4aa8}
  .ap.d2{background:#e3f6e6;border-color:#2fa05b;color:#12663a}
  .ap.dn2{background:#f0f1f4;border-color:#b9bcc8;color:#6b7080}
  .ap.me{font-weight:700}
  .ap.mv{background:#fff;border:1px dashed #b9bcc8;border-left:3px dashed #b9bcc8;color:#8a8d9b;text-decoration:line-through}
  .ap.nw{background:#0a3a9a;border-color:#6aa8ff;color:#fff;font-weight:700;box-shadow:0 0 0 3px rgba(10,58,154,.18);animation:glow 1.6s ease-in-out 3}
  @keyframes glow{50%{box-shadow:0 0 0 7px rgba(10,58,154,.08)}}
  body:not(.booked) .nw,body:not(.booked) .mv{display:none}
  .xview .xside{width:370px;flex:none;display:flex;flex-direction:column;gap:12px;min-height:0}
  .xview .xside .pane{padding:0}
  .sh{padding:12px 16px;border-bottom:1px solid #f0f0f5;font-size:15px;font-weight:600;display:flex;justify-content:space-between;align-items:center}
  .badge{font-size:11.5px;font-weight:700;padding:3px 10px;border-radius:99px}
  .badge.new{background:#0a3a9a;color:#fff}.badge.ok{background:#e3f6e6;color:#12663a}.badge.gr{background:#f0f1f4;color:#6b7080}
  .latest .body{padding:14px 16px;font-size:13.5px}
  .latest .who{display:flex;align-items:center;gap:10px;margin-bottom:10px}
  .latest .who .av2{width:38px;height:38px;border-radius:50%;background:#e7e1f7;display:grid;place-items:center;font-weight:700}
  .latest .who b{font-size:15px;display:block}
  .latest .who span{font-size:12px;color:#7d7f8d}
  .kv{display:grid;grid-template-columns:96px 1fr;gap:5px 10px;margin:8px 0 12px}
  .kv span{color:#7d7f8d}
  .tl{margin:0 0 12px;padding:0;list-style:none;border-left:2px solid #e3e3ea}
  .tl li{position:relative;padding:0 0 8px 14px;font-size:12.5px;color:#4a4d5c}
  .tl li::before{content:"";position:absolute;left:-6px;top:4px;width:10px;height:10px;border-radius:50%;background:#2d7ff0;border:2px solid #fff}
  .btns2{display:flex;gap:8px}
  .btns2 span{flex:1;text-align:center;border-radius:8px;padding:8px;font-size:13px;font-weight:600;background:#e9ecf8;color:#0a3a9a}
  .btns2 span.pr{background:#0a3a9a;color:#fff}
  .pre{padding:26px 16px;color:#7d7f8d;font-size:13.5px;text-align:center}
  body:not(.booked) .post{display:none} body.booked .pre{display:none}
  .prev{flex:1;min-height:0;overflow:hidden}
  .prev .row{display:flex;gap:10px;align-items:center;padding:10px 16px;border-bottom:1px solid #f0f0f5;font-size:13px}
  .prev .row .dt{flex:none;width:58px;text-align:center;border-radius:8px;background:#f0f1f6;padding:4px 0;line-height:1.2}
  .prev .row .dt b{display:block;font-size:16px}.prev .row .dt span{font-size:10.5px;color:#7d7f8d;text-transform:uppercase}
  .prev .row .tx{flex:1;min-width:0}.prev .row .tx span{display:block;color:#7d7f8d;font-size:12px}
`;

const doctorHtml = `        <div class="xview" id="v-appointments" hidden>
          <div class="pane cal">
            <div class="cal-head">
              <div class="cal-nav"><span class="bt">‹</span><b>November 2026</b><span class="bt">›</span><span class="today">Today</span></div>
              <div class="cal-leg"><span><i style="background:#2d7ff0"></i>Dr van Wyk</span><span><i style="background:#2fa05b"></i>Dr Naidoo</span><span><i style="background:#b9bcc8"></i>Completed</span></div>
              <div class="seg"><span>Day</span><span>Week</span><span class="on">Month</span><span>List</span></div>
            </div>
            <div class="cal-grid" id="calGrid"></div>
          </div>
          <div class="xside">
            <div class="pane latest">
              <div class="sh">Latest appointment <span class="badge new post">New · WhatsApp</span></div>
              <div class="pre">No new appointment yet. The bot is still taking the booking.</div>
              <div class="body post">
                <div class="who"><div class="av2">S</div><div><b>Sarah van der Merwe</b><span>Booked by the WhatsApp bot</span></div></div>
                <div class="kv">
                  <span>Date</span><b>Fri 20/11/2026</b>
                  <span>Time</span><b>11:00</b>
                  <span>Doctor</span><b>Dr van Wyk</b>
                  <span>Visit</span><b>General consultation</b>
                  <span>Payment</span><b>Private</b>
                  <span>Reference</span><b>GW-2026-0318</b>
                  <span>Status</span><b><span class="badge ok" style="color:#12663a">Confirmed</span></b>
                </div>
                <ul class="tl"><li>Booked on WhatsApp for Wed 18/11 at 10:30</li><li>Reminder sent on Tue 17/11</li><li>Patient moved it to Fri 20/11 at 11:00</li></ul>
                <div class="btns2"><span class="pr">Open chat</span><span>Send reminder</span></div>
              </div>
            </div>
            <div class="pane prev">
              <div class="sh">Previous appointments <span class="badge gr">3</span></div>
              <div class="row"><div class="dt"><b>04</b><span>Nov</span></div><div class="tx">Follow-up visit<span>10:30 · Dr Naidoo</span></div><span class="badge gr">Completed</span></div>
              <div class="row"><div class="dt"><b>21</b><span>Oct</span></div><div class="tx">General consultation<span>09:15 · Dr van Wyk</span></div><span class="badge gr">Completed</span></div>
              <div class="row"><div class="dt"><b>02</b><span>Sep</span></div><div class="tx">Vaccination<span>14:00 · Dr Naidoo</span></div><span class="badge gr">Completed</span></div>
            </div>
          </div>
        </div>`;

const doctorJs = `
(function () {
  // November 2026 calendar. 1 Nov 2026 is a Sunday; weeks start on Monday. "Today" in the story is Wed 18 Nov.
  const grid = document.getElementById("calGrid");
  const TODAY = 18, NAMES = ["T. Mokoena", "E. Clarke", "P. Botha", "A. Patel", "L. Zulu", "M. Brown", "S. Ndlovu", "J. Pretorius", "N. Khumalo", "Z. Dube", "M. Smith", "T. Jacobs"];
  const SLOTS = ["08:30", "09:15", "10:00", "11:30", "14:00", "15:30"];
  let seed = 7; const rnd = n => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) % n;
  const byDay = {}; // key "m-d"
  const put = (m, d, time, text, cls) => (byDay[m + "-" + d] = byDay[m + "-" + d] || []).push({ time, text, cls });
  // background appointments for other patients (weekdays only, plus a few Saturdays)
  for (let m = 10; m <= 12; m++) {
    const days = m === 10 ? [26, 27, 28, 29, 30] : m === 11 ? Array.from({ length: 30 }, (_, i) => i + 1) : [1, 2, 3, 4];
    for (const d of days) {
      const dow = new Date(2026, m - 1, d).getDay();
      if (dow === 0) continue;
      const n = dow === 6 ? 1 : 2 + rnd(2);
      const used = new Set();
      for (let i = 0; i < n; i++) {
        let t; do { t = SLOTS[rnd(SLOTS.length)]; } while (used.has(t)); used.add(t);
        const past = m === 10 || (m === 11 && (d < TODAY || (d === TODAY && t < "09:00")));
        const doc = rnd(2) ? "d1" : "d2";
        put(m, d, t, NAMES[rnd(NAMES.length)], past ? "dn2" : doc);
      }
    }
  }
  // Sarah van der Merwe: earlier visit, the original slot (moved) and the new one
  put(11, 4, "10:30", "S. van der Merwe", "dn2 me");
  put(11, 18, "10:30", "S. van der Merwe → 20 Nov", "mv");
  put(11, 20, "11:00", "NEW  S. van der Merwe", "nw");
  const dow = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  let html = dow.map(d => '<div class="dow">' + d + "</div>").join("");
  // 6 weeks starting Monday 26 Oct 2026
  for (let i = 0; i < 42; i++) {
    const dt = new Date(2026, 9, 26 + i), m = dt.getMonth() + 1, d = dt.getDate();
    const list = (byDay[m + "-" + d] || []).sort((a, b) => a.time.localeCompare(b.time));
    const out = m !== 11, td = m === 11 && d === TODAY, wk = dt.getDay() === 0 || dt.getDay() === 6;
    const shown = list.filter(a => a.cls.includes("nw") || a.cls.includes("mv")).concat(list.filter(a => !a.cls.includes("nw") && !a.cls.includes("mv")).slice(0, 2));
    html += '<div class="day' + (out ? " out" : "") + (td ? " td" : "") + (wk ? " wk" : "") + '"><span class="dn">' + d + "</span>" +
      shown.sort((a, b) => a.time.localeCompare(b.time)).map(a => '<div class="ap ' + a.cls + '">' + a.time + " " + a.text + "</div>").join("") + "</div>";
  }
  grid.innerHTML = html;
  // After the chat: show the booking in the calendar and open the Appointments tab.
  let timer;
  window.__dash.onStart.push(() => { clearTimeout(timer); document.body.classList.remove("booked"); });
  window.__dash.onEnd.push(() => { timer = setTimeout(() => { document.body.classList.add("booked"); window.__dash.setView("appointments"); }, 1800); });
})();
`;

export const VIEWS = {
  'doctors-appointment': { tab: 'appointments', css: doctorCss, html: doctorHtml, js: doctorJs },
};
