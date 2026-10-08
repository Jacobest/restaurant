// Extra dashboard views shown after the chat ends (demo 2). One entry per use case slug.
// Each view = { tab, css, html, js }. build-demos.mjs injects them into uc/<slug>/dashboard-chat.html.
// The template provides window.__dash = { onStart[], onEnd[], setView(name) } and the tab menu.

export const COMMON_CSS = `  .xview{flex:1;min-height:0;display:flex;gap:12px}
  .xview[hidden]{display:none}
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

const doctorCss = `
  .xview .cal{flex:1;min-width:0;display:flex;flex-direction:column;padding:0}
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

// ---------------------------------------------------------------------------------------------
// Restaurant: the Bookings tab. A dinner-service timeline by area, plus the latest booking.
const restaurantCss = `
  .xview .tlv{flex:1;min-width:0;display:flex;flex-direction:column;padding:0}
  .stats{display:flex;gap:10px;margin-left:auto}
  .stats span{background:#f0f1f6;border-radius:8px;padding:5px 12px;font-size:13px;color:#31365a}
  .stats b{color:#0a3a9a}
  .tlbox{flex:1;min-height:0;display:flex;flex-direction:column;padding:6px 0 0}
  .axis{display:grid;grid-template-columns:130px 1fr;border-bottom:1px solid #f0f0f5}
  .axis .ticks{position:relative;height:30px}
  .axis .ticks span{position:absolute;top:8px;transform:translateX(-50%);font-size:12px;color:#7d7f8d;font-weight:600}
  .arow{display:grid;grid-template-columns:130px 1fr;border-bottom:1px solid #f0f0f5}
  .alabel{padding:12px 14px;font-weight:600;font-size:14px;border-right:1px solid #f0f0f5}
  .alabel small{display:block;font-weight:400;color:#7d7f8d;font-size:12px;margin-top:2px}
  .track{position:relative;background-image:linear-gradient(to right,#f0f0f5 1px,transparent 1px);background-size:20% 100%}
  .bk{position:absolute;height:48px;border-radius:8px;padding:5px 9px;font-size:12px;overflow:hidden;border-left:4px solid;line-height:1.3;white-space:nowrap;text-overflow:ellipsis}
  .bk b{display:block;font-size:12.5px;overflow:hidden;text-overflow:ellipsis}
  .bk span{color:inherit;opacity:.8}
  .bk.main{background:#e5f1ff;border-color:#2d7ff0;color:#0a4aa8}
  .bk.alf{background:#e3f6e6;border-color:#2fa05b;color:#12663a}
  .bk.mez{background:#efe9fb;border-color:#7e57c2;color:#4a2f8a}
  .bk.prv{background:#fff0dc;border-color:#f09a2a;color:#8a4b00}
  .bk.nw{background:#0a3a9a;border-color:#6aa8ff;color:#fff;box-shadow:0 0 0 3px rgba(10,58,154,.2);animation:glow2 1.6s ease-in-out 3;z-index:2}
  @keyframes glow2{50%{box-shadow:0 0 0 8px rgba(10,58,154,.07)}}
  body:not(.booked) .bk.nw{display:none}
  .nextrow{display:flex;gap:10px;align-items:center;padding:9px 16px;border-bottom:1px solid #f0f0f5;font-size:13px}
  .nextrow .tm{flex:none;width:52px;text-align:center;border-radius:8px;background:#f0f1f6;padding:6px 0;font-weight:700;font-size:13px}
  .nextrow .tx{flex:1;min-width:0}.nextrow .tx span{display:block;color:#7d7f8d;font-size:12px}
  .nextrow.nwrow{background:#eef3ff}
  body:not(.booked) .nextrow.nwrow{display:none}
`;

const restaurantHtml = `        <div class="xview" id="v-bookings" hidden>
          <div class="pane tlv">
            <div class="cal-head">
              <div class="cal-nav"><span class="bt">‹</span><b>Sat 14 November 2026</b><span class="bt">›</span><span class="today">Today</span></div>
              <div class="stats"><span><b id="stBk">0</b> bookings</span><span><b id="stCv">0</b> guests</span><span>First arrival <b id="stNx">17:30</b></span></div>
              <div class="seg"><span>Lunch</span><span class="on">Dinner</span></div>
              <div class="seg"><span class="on">Timeline</span><span>List</span><span>Floor</span></div>
            </div>
            <div class="tlbox"><div class="axis"><div></div><div class="ticks" id="ticks"></div></div><div id="areas"></div></div>
          </div>
          <div class="xside">
            <div class="pane latest">
              <div class="sh">Latest booking <span class="badge new post">New · WhatsApp</span></div>
              <div class="pre">No new booking yet. The bot is still taking the reservation.</div>
              <div class="body post">
                <div class="who"><div class="av2">S</div><div><b>Sarah van der Merwe</b><span>Booked by the WhatsApp bot</span></div></div>
                <div class="kv">
                  <span>Date</span><b>Sat 14/11/2026</b>
                  <span>Time</span><b>19:00</b>
                  <span>Area</span><b>Alfresco</b>
                  <span>Guests</span><b>4</b>
                  <span>Dietary</span><b>1 vegetarian</b>
                  <span>Occasion</span><b>Anniversary</b>
                  <span>Pre-order</span><b>Yes, sent</b>
                  <span>Reference</span><b>FB-2026-0142</b>
                  <span>Status</span><b><span class="badge ok" style="color:#12663a">Confirmed</span></b>
                </div>
                <ul class="tl"><li>Booked on WhatsApp</li><li>Pre-order received</li><li>Reminder sent Fri 13/11</li><li>Reminder due Sat 14/11 at 17:00</li></ul>
                <div class="btns2"><span class="pr">Open chat</span><span>Send reminder</span></div>
              </div>
            </div>
            <div class="pane prev">
              <div class="sh">Arrivals tonight <span class="badge gr" id="nextCount">0</span></div>
              <div id="nextList"></div>
            </div>
          </div>
        </div>`;

const restaurantJs = `
(function () {
  // Dinner service on Sat 14 Nov 2026, 17:30 to 22:30. [area, lane, start hour, hours, name, guests, tags, isNew]
  const START = 17.5, SPAN = 5;
  const AREAS = [["main", "Main", 60, 2], ["alf", "Alfresco", 30, 2], ["mez", "Mezzanine", 24, 1], ["prv", "Private", 12, 1]];
  const BK = [
    ["main", 0, 17.5, 2, "T. Mokoena", 2, ""], ["main", 0, 19.5, 2, "E. Clarke", 4, ""],
    ["main", 1, 18, 2, "Botha family", 6, "🎂"], ["main", 1, 20.5, 1.5, "S. Ndlovu", 3, ""],
    ["alf", 0, 18, 1.5, "A. Patel", 2, ""], ["alf", 0, 20, 1.5, "N. Khumalo", 2, "🥗"],
    ["alf", 1, 19, 2, "S. van der Merwe", 4, "🥗 🎉", true],
    ["mez", 0, 18.5, 2, "L. Zulu", 3, ""], ["mez", 0, 20.5, 1.5, "M. Brown", 5, ""],
    ["prv", 0, 19, 3, "J. Pretorius · Corporate dinner", 10, ""],
  ];
  const fmt = h => { const m = Math.round((h % 1) * 60); return Math.floor(h) + ":" + (m < 10 ? "0" : "") + m; };
  document.getElementById("ticks").innerHTML = [18, 19, 20, 21, 22].map(h => '<span style="left:' + (h - START) / SPAN * 100 + '%">' + h + ":00</span>").join("");
  document.getElementById("areas").innerHTML = AREAS.map(([k, name, seats, lanes]) => {
    const blocks = BK.filter(b => b[0] === k).map(([, lane, s, d, who, n, tags, nw]) =>
      '<div class="bk ' + k + (nw ? " nw" : "") + '" style="top:' + (6 + lane * 54) + "px;left:" + (s - START) / SPAN * 100 + "%;width:calc(" + d / SPAN * 100 + '% - 4px)"><b>' + (nw ? "NEW  " : "") + who + "</b><span>" + fmt(s) + " · " + n + " guests " + tags + "</span></div>").join("");
    return '<div class="arow"><div class="alabel">' + name + "<small>" + seats + ' seats</small></div><div class="track" style="height:' + (lanes * 54 + 6) + 'px">' + blocks + "</div></div>";
  }).join("");
  function stats() {
    const booked = document.body.classList.contains("booked");
    const list = BK.filter(b => booked || !b[7]);
    const guests = list.reduce((n, b) => n + b[5], 0);
    document.getElementById("stBk").textContent = list.length;
    document.getElementById("stCv").textContent = guests;
    document.getElementById("stNx").textContent = fmt(Math.min(...list.map(b => b[2])));
    const next = list.slice().sort((a, b) => a[2] - b[2]).slice(0, 6);
    document.getElementById("nextCount").textContent = list.length;
    document.getElementById("nextList").innerHTML = next.map(b => '<div class="nextrow' + (b[7] ? " nwrow" : "") + '"><div class="tm">' + fmt(b[2]) + '</div><div class="tx"><b>' + b[4] + "</b><span>" + AREAS.find(a => a[0] === b[0])[1] + " · " + b[5] + " guests " + b[6] + '</span></div><span class="badge ' + (b[7] ? "new" : "ok") + '" style="' + (b[7] ? "" : "color:#12663a") + '">' + (b[7] ? "New" : "Confirmed") + "</span></div>").join("");
  }
  stats();
  // After the chat: show the booking on the timeline and open the Bookings tab.
  let timer;
  window.__dash.onStart.push(() => { clearTimeout(timer); document.body.classList.remove("booked"); stats(); });
  window.__dash.onEnd.push(() => { timer = setTimeout(() => { document.body.classList.add("booked"); stats(); window.__dash.setView("bookings"); }, 1800); });
})();
`;

// ---------------------------------------------------------------------------------------------
// Salon: the Bookings tab. A day timeline by stylist, plus the latest booking.
const salonCss = `
  .xview .tlv{flex:1;min-width:0;display:flex;flex-direction:column;padding:0}
  .stats{display:flex;gap:10px;margin-left:auto}
  .stats span{background:#f0f1f6;border-radius:8px;padding:5px 12px;font-size:13px;color:#31365a}
  .stats b{color:#0a3a9a}
  .tlbox{flex:1;min-height:0;display:flex;flex-direction:column;padding:6px 0 0}
  .axis{display:grid;grid-template-columns:130px 1fr;border-bottom:1px solid #f0f0f5}
  .axis .ticks{position:relative;height:30px}
  .axis .ticks span{position:absolute;top:8px;transform:translateX(-50%);font-size:12px;color:#7d7f8d;font-weight:600}
  .arow{display:grid;grid-template-columns:130px 1fr;border-bottom:1px solid #f0f0f5}
  .alabel{padding:12px 14px;font-weight:600;font-size:14px;border-right:1px solid #f0f0f5}
  .alabel small{display:block;font-weight:400;color:#7d7f8d;font-size:12px;margin-top:2px}
  .track{position:relative;background-image:linear-gradient(to right,#f0f0f5 1px,transparent 1px);background-size:11.111% 100%}
  .bk{position:absolute;height:48px;border-radius:8px;padding:5px 9px;font-size:12px;overflow:hidden;border-left:4px solid;line-height:1.3;white-space:nowrap;text-overflow:ellipsis}
  .bk b{display:block;font-size:12.5px;overflow:hidden;text-overflow:ellipsis}
  .bk span{color:inherit;opacity:.8}
  .bk.ler{background:#e5f1ff;border-color:#2d7ff0;color:#0a4aa8}
  .bk.jad{background:#e3f6e6;border-color:#2fa05b;color:#12663a}
  .bk.tha{background:#efe9fb;border-color:#7e57c2;color:#4a2f8a}
  .bk.nw{background:#0a3a9a;border-color:#6aa8ff;color:#fff;box-shadow:0 0 0 3px rgba(10,58,154,.2);animation:glow2 1.6s ease-in-out 3;z-index:2}
  @keyframes glow2{50%{box-shadow:0 0 0 8px rgba(10,58,154,.07)}}
  body:not(.booked) .bk.nw{display:none}
  .nextrow{display:flex;gap:10px;align-items:center;padding:9px 16px;border-bottom:1px solid #f0f0f5;font-size:13px}
  .nextrow .tm{flex:none;width:52px;text-align:center;border-radius:8px;background:#f0f1f6;padding:6px 0;font-weight:700;font-size:13px}
  .nextrow .tx{flex:1;min-width:0}.nextrow .tx span{display:block;color:#7d7f8d;font-size:12px}
  .nextrow.nwrow{background:#eef3ff}
  body:not(.booked) .nextrow.nwrow{display:none}
`;

const salonHtml = `        <div class="xview" id="v-bookings" hidden>
          <div class="pane tlv">
            <div class="cal-head">
              <div class="cal-nav"><span class="bt">‹</span><b>Sat 21 November 2026</b><span class="bt">›</span><span class="today">Today</span></div>
              <div class="stats"><span><b id="stBk">0</b> bookings</span><span><b id="stCv">0</b> stylists in</span><span>First client <b id="stNx">09:00</b></span></div>
              <div class="seg"><span class="on">Day</span><span>Week</span></div>
              <div class="seg"><span class="on">Timeline</span><span>List</span></div>
            </div>
            <div class="tlbox"><div class="axis"><div></div><div class="ticks" id="ticks"></div></div><div id="areas"></div></div>
          </div>
          <div class="xside">
            <div class="pane latest">
              <div class="sh">Latest booking <span class="badge new post">New · WhatsApp</span></div>
              <div class="pre">No new booking yet. The bot is still taking the booking.</div>
              <div class="body post">
                <div class="who"><div class="av2">N</div><div><b>Naledi Khumalo</b><span>Booked by the WhatsApp bot</span></div></div>
                <div class="kv">
                  <span>Date</span><b>Sat 21/11/2026</b>
                  <span>Time</span><b>11:30</b>
                  <span>Stylist</span><b>Lerato</b>
                  <span>Service</span><b>Half head highlights</b>
                  <span>Add-on</span><b>Blow-dry</b>
                  <span>Total</span><b>R970.00</b>
                  <span>Deposit</span><b>R100 paid</b>
                  <span>Reference</span><b>SB-2026-0077</b>
                  <span>Status</span><b><span class="badge ok" style="color:#12663a">Confirmed</span></b>
                </div>
                <ul class="tl"><li>Booked on WhatsApp</li><li>Deposit of R100 received</li><li>Reminder due Fri 20/11 at 11:30</li><li>Thank-you message after the visit</li></ul>
                <div class="btns2"><span class="pr">Open chat</span><span>Send reminder</span></div>
              </div>
            </div>
            <div class="pane prev">
              <div class="sh">Arrivals today <span class="badge gr" id="nextCount">0</span></div>
              <div id="nextList"></div>
            </div>
          </div>
        </div>`;

const salonJs = `
(function () {
  // Saturday 21 Nov 2026, 08:00 to 17:00. [stylist, start hour, hours, client, service, isNew]
  const START = 8, SPAN = 9;
  const STY = [["ler", "Lerato", "Colour"], ["jad", "Jade", "Cut and style"], ["tha", "Thandi", "Nails"]];
  const BK = [
    ["ler", 9, 2, "T. Mokoena", "Full colour"], ["ler", 11.5, 3, "Naledi Khumalo", "Half head highlights + blow-dry", true],
    ["jad", 8.5, 1, "E. Clarke", "Cut and blow-dry"], ["jad", 10, 1.5, "A. Patel", "Cut and style"], ["jad", 12.5, 1, "S. Ndlovu", "Fringe trim"], ["jad", 14, 1.5, "Z. Dube", "Cut and style"],
    ["tha", 9, 1.5, "M. Smith", "Gel manicure"], ["tha", 11, 1, "L. Zulu", "Nail repair"], ["tha", 13, 2, "N. Botha", "Gel overlay"],
  ];
  const fmt = h => { const m = Math.round((h % 1) * 60); return Math.floor(h) + ":" + (m < 10 ? "0" : "") + m; };
  const pad = t => (t.length < 5 ? "0" + t : t);
  document.getElementById("ticks").innerHTML = [9, 10, 11, 12, 13, 14, 15, 16].map(h => '<span style="left:' + (h - START) / SPAN * 100 + '%">' + h + ":00</span>").join("");
  document.getElementById("areas").innerHTML = STY.map(([k, name, role]) => {
    const blocks = BK.filter(b => b[0] === k).map(([, s, d, who, svc, nw]) =>
      '<div class="bk ' + k + (nw ? " nw" : "") + '" style="top:6px;left:' + (s - START) / SPAN * 100 + "%;width:calc(" + d / SPAN * 100 + '% - 4px)"><b>' + (nw ? "NEW  " : "") + who + "</b><span>" + fmt(s) + " · " + svc + "</span></div>").join("");
    return '<div class="arow"><div class="alabel">' + name + "<small>" + role + '</small></div><div class="track" style="height:60px">' + blocks + "</div></div>";
  }).join("");
  function stats() {
    const booked = document.body.classList.contains("booked");
    const list = BK.filter(b => booked || !b[5]);
    document.getElementById("stBk").textContent = list.length;
    document.getElementById("stCv").textContent = new Set(list.map(b => b[0])).size;
    document.getElementById("stNx").textContent = pad(fmt(Math.min(...list.map(b => b[1]))));
    const next = list.slice().sort((a, b) => a[1] - b[1]).slice(0, 6);
    document.getElementById("nextCount").textContent = list.length;
    document.getElementById("nextList").innerHTML = next.map(b => '<div class="nextrow' + (b[5] ? " nwrow" : "") + '"><div class="tm">' + pad(fmt(b[1])) + '</div><div class="tx"><b>' + b[3] + "</b><span>" + STY.find(s => s[0] === b[0])[1] + " · " + b[4] + '</span></div><span class="badge ' + (b[5] ? "new" : "ok") + '" style="' + (b[5] ? "" : "color:#12663a") + '">' + (b[5] ? "New" : "Confirmed") + "</span></div>").join("");
  }
  stats();
  // After the chat: show the booking on the timeline and open the Bookings tab.
  let timer;
  window.__dash.onStart.push(() => { clearTimeout(timer); document.body.classList.remove("booked"); stats(); });
  window.__dash.onEnd.push(() => { timer = setTimeout(() => { document.body.classList.add("booked"); stats(); window.__dash.setView("bookings"); }, 1800); });
})();
`;

// ---------------------------------------------------------------------------------------------
// Real estate: the Bookings tab. A viewings diary by agent, plus the latest booking.
const propCss = `
  .xview .tlv{flex:1;min-width:0;display:flex;flex-direction:column;padding:0}
  .stats{display:flex;gap:10px;margin-left:auto}
  .stats span{background:#f0f1f6;border-radius:8px;padding:5px 12px;font-size:13px;color:#31365a}
  .stats b{color:#0a3a9a}
  .tlbox{flex:1;min-height:0;display:flex;flex-direction:column;padding:6px 0 0}
  .axis{display:grid;grid-template-columns:130px 1fr;border-bottom:1px solid #f0f0f5}
  .axis .ticks{position:relative;height:30px}
  .axis .ticks span{position:absolute;top:8px;transform:translateX(-50%);font-size:12px;color:#7d7f8d;font-weight:600}
  .arow{display:grid;grid-template-columns:130px 1fr;border-bottom:1px solid #f0f0f5}
  .alabel{padding:12px 14px;font-weight:600;font-size:14px;border-right:1px solid #f0f0f5}
  .alabel small{display:block;font-weight:400;color:#7d7f8d;font-size:12px;margin-top:2px}
  .track{position:relative;background-image:linear-gradient(to right,#f0f0f5 1px,transparent 1px);background-size:12.5% 100%}
  .bk{position:absolute;height:48px;border-radius:8px;padding:5px 9px;font-size:12px;overflow:hidden;border-left:4px solid;line-height:1.3;white-space:nowrap;text-overflow:ellipsis}
  .bk b{display:block;font-size:12.5px;overflow:hidden;text-overflow:ellipsis}
  .bk span{color:inherit;opacity:.8}
  .bk.ler{background:#e5f1ff;border-color:#2d7ff0;color:#0a4aa8}
  .bk.jad{background:#e3f6e6;border-color:#2fa05b;color:#12663a}
  .bk.tha{background:#efe9fb;border-color:#7e57c2;color:#4a2f8a}
  .bk.nw{background:#0a3a9a;border-color:#6aa8ff;color:#fff;box-shadow:0 0 0 3px rgba(10,58,154,.2);animation:glow2 1.6s ease-in-out 3;z-index:2}
  @keyframes glow2{50%{box-shadow:0 0 0 8px rgba(10,58,154,.07)}}
  body:not(.booked) .bk.nw{display:none}
  .nextrow{display:flex;gap:10px;align-items:center;padding:9px 16px;border-bottom:1px solid #f0f0f5;font-size:13px}
  .nextrow .tm{flex:none;width:52px;text-align:center;border-radius:8px;background:#f0f1f6;padding:6px 0;font-weight:700;font-size:13px}
  .nextrow .tx{flex:1;min-width:0}.nextrow .tx span{display:block;color:#7d7f8d;font-size:12px}
  .nextrow.nwrow{background:#eef3ff}
  body:not(.booked) .nextrow.nwrow{display:none}
`;

const propHtml = `        <div class="xview" id="v-bookings" hidden>
          <div class="pane tlv">
            <div class="cal-head">
              <div class="cal-nav"><span class="bt">‹</span><b>Sat 14 November 2026</b><span class="bt">›</span><span class="today">Today</span></div>
              <div class="stats"><span><b id="stBk">0</b> viewings</span><span><b id="stCv">0</b> agents out</span><span>First viewing <b id="stNx">09:00</b></span></div>
              <div class="seg"><span class="on">Day</span><span>Week</span></div>
              <div class="seg"><span class="on">Timeline</span><span>List</span></div>
            </div>
            <div class="tlbox"><div class="axis"><div></div><div class="ticks" id="ticks"></div></div><div id="areas"></div></div>
          </div>
          <div class="xside">
            <div class="pane latest">
              <div class="sh">Latest booking <span class="badge new post">New · WhatsApp</span></div>
              <div class="pre">No new booking yet. The bot is still taking the booking.</div>
              <div class="body post">
                <div class="who"><div class="av2">S</div><div><b>Sipho Dlamini</b><span>Booked by the WhatsApp bot</span></div></div>
                <div class="kv">
                  <span>Date</span><b>Sat 14/11/2026</b>
                  <span>Time</span><b>11:00</b>
                  <span>Agent</span><b>Karen van der Merwe</b>
                  <span>Homes</span><b>P24-118203, P24-118377</b>
                  <span>Budget</span><b>R3 200 000</b>
                  <span>Bond</span><b>Pre-approved</b>
                  <span>Reference</span><b>ASP-2026-0412</b>
                  <span>Status</span><b><span class="badge ok" style="color:#12663a">Confirmed</span></b>
                </div>
                <ul class="tl"><li>Enquiry from listing P24-118203</li><li>Buyer qualified: budget, bedrooms, bond</li><li>Reminder due Fri 13/11 at 16:00</li><li>Follow-up after the viewing</li></ul>
                <div class="btns2"><span class="pr">Open chat</span><span>Send reminder</span></div>
              </div>
            </div>
            <div class="pane prev">
              <div class="sh">Viewings today <span class="badge gr" id="nextCount">0</span></div>
              <div id="nextList"></div>
            </div>
          </div>
        </div>`;

const propJs = `
(function () {
  // Saturday 14 Nov 2026, 08:00 to 16:00. [agent, start hour, hours, buyer, homes, isNew]
  const START = 8, SPAN = 8;
  const STY = [["ler", "Karen van der Merwe", "Sea Point, Green Point"], ["jad", "Lwazi Dube", "Camps Bay"], ["tha", "Megan Smith", "City Bowl"]];
  const BK = [
    ["ler", 9, 1, "T. Mokoena", "1 home · Sea Point"], ["ler", 11, 1.5, "Sipho Dlamini", "2 homes · Sea Point, Green Point", true], ["ler", 14, 1, "E. Clarke", "1 home · Sea Point"],
    ["jad", 9.5, 1.5, "A. Patel", "1 home · Camps Bay"], ["jad", 12, 1, "S. Ndlovu", "1 home · Camps Bay"], ["jad", 14.5, 1, "Z. Dube", "2 homes · Bakoven"],
    ["tha", 10, 1, "P. Botha", "1 home · Gardens"], ["tha", 13, 1.5, "L. Zulu", "2 homes · Vredehoek"],
  ];
  const fmt = h => { const m = Math.round((h % 1) * 60); return Math.floor(h) + ":" + (m < 10 ? "0" : "") + m; };
  const pad = t => (t.length < 5 ? "0" + t : t);
  document.getElementById("ticks").innerHTML = [9, 10, 11, 12, 13, 14, 15].map(h => '<span style="left:' + (h - START) / SPAN * 100 + '%">' + h + ":00</span>").join("");
  document.getElementById("areas").innerHTML = STY.map(([k, name, role]) => {
    const blocks = BK.filter(b => b[0] === k).map(([, s, d, who, svc, nw]) =>
      '<div class="bk ' + k + (nw ? " nw" : "") + '" style="top:6px;left:' + (s - START) / SPAN * 100 + "%;width:calc(" + d / SPAN * 100 + '% - 4px)"><b>' + (nw ? "NEW  " : "") + who + "</b><span>" + fmt(s) + " · " + svc + "</span></div>").join("");
    return '<div class="arow"><div class="alabel">' + name + "<small>" + role + '</small></div><div class="track" style="height:60px">' + blocks + "</div></div>";
  }).join("");
  function stats() {
    const booked = document.body.classList.contains("booked");
    const list = BK.filter(b => booked || !b[5]);
    document.getElementById("stBk").textContent = list.length;
    document.getElementById("stCv").textContent = new Set(list.map(b => b[0])).size;
    document.getElementById("stNx").textContent = pad(fmt(Math.min(...list.map(b => b[1]))));
    const next = list.slice().sort((a, b) => a[1] - b[1]).slice(0, 6);
    document.getElementById("nextCount").textContent = list.length;
    document.getElementById("nextList").innerHTML = next.map(b => '<div class="nextrow' + (b[5] ? " nwrow" : "") + '"><div class="tm">' + pad(fmt(b[1])) + '</div><div class="tx"><b>' + b[3] + "</b><span>" + STY.find(s => s[0] === b[0])[1] + " · " + b[4] + '</span></div><span class="badge ' + (b[5] ? "new" : "ok") + '" style="' + (b[5] ? "" : "color:#12663a") + '">' + (b[5] ? "New" : "Confirmed") + "</span></div>").join("");
  }
  stats();
  // After the chat: show the booking on the timeline and open the Bookings tab.
  let timer;
  window.__dash.onStart.push(() => { clearTimeout(timer); document.body.classList.remove("booked"); stats(); });
  window.__dash.onEnd.push(() => { timer = setTimeout(() => { document.body.classList.add("booked"); stats(); window.__dash.setView("bookings"); }, 1800); });
})();
`;

// ---------------------------------------------------------------------------------------------
// Hotel: the Bookings tab. A stay calendar by room, plus the latest booking.
const hotelCss = `
  .xview .tlv{flex:1;min-width:0;display:flex;flex-direction:column;padding:0}
  .stats{display:flex;gap:10px;margin-left:auto}
  .stats span{background:#f0f1f6;border-radius:8px;padding:5px 12px;font-size:13px;color:#31365a}
  .stats b{color:#0a3a9a}
  .tlbox{flex:1;min-height:0;display:flex;flex-direction:column;padding:6px 0 0}
  .axis{display:grid;grid-template-columns:130px 1fr;border-bottom:1px solid #f0f0f5}
  .axis .ticks{position:relative;height:30px}
  .axis .ticks span{position:absolute;top:8px;transform:translateX(-50%);font-size:12px;color:#7d7f8d;font-weight:600}
  .arow{display:grid;grid-template-columns:130px 1fr;border-bottom:1px solid #f0f0f5}
  .alabel{padding:12px 14px;font-weight:600;font-size:14px;border-right:1px solid #f0f0f5}
  .alabel small{display:block;font-weight:400;color:#7d7f8d;font-size:12px;margin-top:2px}
  .track{position:relative;background-image:linear-gradient(to right,#f0f0f5 1px,transparent 1px);background-size:12.5% 100%}
  .bk{position:absolute;height:48px;border-radius:8px;padding:5px 9px;font-size:12px;overflow:hidden;border-left:4px solid;line-height:1.3;white-space:nowrap;text-overflow:ellipsis}
  .bk b{display:block;font-size:12.5px;overflow:hidden;text-overflow:ellipsis}
  .bk span{color:inherit;opacity:.8}
  .bk.ler{background:#e5f1ff;border-color:#2d7ff0;color:#0a4aa8}
  .bk.jad{background:#e3f6e6;border-color:#2fa05b;color:#12663a}
  .bk.fam{background:#fff0dc;border-color:#f09a2a;color:#8a4b00}
  .bk.tha{background:#efe9fb;border-color:#7e57c2;color:#4a2f8a}
  .bk.nw{background:#0a3a9a;border-color:#6aa8ff;color:#fff;box-shadow:0 0 0 3px rgba(10,58,154,.2);animation:glow2 1.6s ease-in-out 3;z-index:2}
  @keyframes glow2{50%{box-shadow:0 0 0 8px rgba(10,58,154,.07)}}
  body:not(.booked) .bk.nw{display:none}
  .nextrow{display:flex;gap:10px;align-items:center;padding:9px 16px;border-bottom:1px solid #f0f0f5;font-size:13px}
  .nextrow .tm{flex:none;width:52px;text-align:center;border-radius:8px;background:#f0f1f6;padding:6px 0;font-weight:700;font-size:13px}
  .nextrow .tx{flex:1;min-width:0}.nextrow .tx span{display:block;color:#7d7f8d;font-size:12px}
  .nextrow.nwrow{background:#eef3ff}
  body:not(.booked) .nextrow.nwrow{display:none}
`;

const hotelHtml = `        <div class="xview" id="v-bookings" hidden>
          <div class="pane tlv">
            <div class="cal-head">
              <div class="cal-nav"><span class="bt">‹</span><b>December 2026</b><span class="bt">›</span><span class="today">Today</span></div>
              <div class="stats"><span><b id="stBk">0</b> stays</span><span><b id="stCv">0</b> rooms in use</span><span>First arrival <b id="stNx">10 Dec</b></span></div>
              <div class="seg"><span>Week</span><span class="on">10 days</span><span>Month</span></div>
              <div class="seg"><span class="on">Timeline</span><span>List</span></div>
            </div>
            <div class="tlbox"><div class="axis"><div></div><div class="ticks" id="ticks"></div></div><div id="areas"></div></div>
          </div>
          <div class="xside">
            <div class="pane latest">
              <div class="sh">Latest booking <span class="badge new post">New · WhatsApp</span></div>
              <div class="pre">No new booking yet. The bot is still taking the booking.</div>
              <div class="body post">
                <div class="who"><div class="av2">N</div><div><b>Naledi Khumalo</b><span>Booked by the WhatsApp bot</span></div></div>
                <div class="kv">
                  <span>Room</span><b>Garden Room</b>
                  <span>Check-in</span><b>Sat 12/12/2026</b>
                  <span>Check-out</span><b>Tue 15/12/2026</b>
                  <span>Guests</span><b>2 adults</b>
                  <span>Total</span><b>R4 350.00</b>
                  <span>Deposit</span><b>R1 450 paid</b>
                  <span>Reference</span><b>JG-2026-0214</b>
                  <span>Status</span><b><span class="badge ok" style="color:#12663a">Confirmed</span></b>
                </div>
                <ul class="tl"><li>Booked on WhatsApp</li><li>Deposit of R1 450 received</li><li>Arrival info due Thu 10/12</li><li>Review request after check-out</li></ul>
                <div class="btns2"><span class="pr">Open chat</span><span>Send reminder</span></div>
              </div>
            </div>
            <div class="pane prev">
              <div class="sh">Arrivals this week <span class="badge gr" id="nextCount">0</span></div>
              <div id="nextList"></div>
            </div>
          </div>
        </div>`;

const hotelJs = `
(function () {
  // Thu 10 to Thu 17 Dec 2026. Start and length are in days (check-in 14:00 = .58, check-out 10:00 = .42). [room, start, days, guest, detail, isNew]
  const START = 10, SPAN = 8;
  const STY = [["ler", "Garden Room 1", "Queen bed"], ["jad", "Garden Room 2", "Queen bed"], ["tha", "Vineyard Suite", "King, lounge"], ["fam", "Family Room", "Sleeps 4"]];
  const BK = [
    ["ler", 10.58, 2.83, "T. Mokoena", "2 guests · Breakfast"], ["ler", 12.58, 2.83, "Naledi Khumalo", "2 guests · Deposit paid", true],
    ["jad", 10.58, 3.83, "E. Clarke", "2 guests"], ["jad", 14.58, 2.83, "P. Botha", "1 guest"],
    ["tha", 11.58, 4.83, "A. Patel", "2 guests · Anniversary"],
    ["fam", 10.58, 1.83, "S. Ndlovu", "4 guests"], ["fam", 13.58, 3.83, "Z. Dube", "4 guests"],
  ];
  const fmt = h => Math.floor(h) + " Dec";
  const pad = t => t;
  document.getElementById("ticks").innerHTML = [10, 11, 12, 13, 14, 15, 16, 17].map(h => '<span style="left:' + (h - START) / SPAN * 100 + '%">' + ["Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed", "Thu"][h - 10] + " " + h + "</span>").join("");
  document.getElementById("areas").innerHTML = STY.map(([k, name, role]) => {
    const blocks = BK.filter(b => b[0] === k).map(([, s, d, who, svc, nw]) =>
      '<div class="bk ' + k + (nw ? " nw" : "") + '" style="top:6px;left:' + (s - START) / SPAN * 100 + "%;width:calc(" + d / SPAN * 100 + '% - 4px)"><b>' + (nw ? "NEW  " : "") + who + "</b><span>" + fmt(s) + " · " + svc + "</span></div>").join("");
    return '<div class="arow"><div class="alabel">' + name + "<small>" + role + '</small></div><div class="track" style="height:60px">' + blocks + "</div></div>";
  }).join("");
  function stats() {
    const booked = document.body.classList.contains("booked");
    const list = BK.filter(b => booked || !b[5]);
    document.getElementById("stBk").textContent = list.length;
    document.getElementById("stCv").textContent = new Set(list.map(b => b[0])).size;
    document.getElementById("stNx").textContent = pad(fmt(Math.min(...list.map(b => b[1]))));
    const next = list.slice().sort((a, b) => a[1] - b[1]).slice(0, 6);
    document.getElementById("nextCount").textContent = list.length;
    document.getElementById("nextList").innerHTML = next.map(b => '<div class="nextrow' + (b[5] ? " nwrow" : "") + '"><div class="tm">' + pad(fmt(b[1])) + '</div><div class="tx"><b>' + b[3] + "</b><span>" + STY.find(s => s[0] === b[0])[1] + " · " + b[4] + '</span></div><span class="badge ' + (b[5] ? "new" : "ok") + '" style="' + (b[5] ? "" : "color:#12663a") + '">' + (b[5] ? "New" : "Confirmed") + "</span></div>").join("");
  }
  stats();
  // After the chat: show the booking on the timeline and open the Bookings tab.
  let timer;
  window.__dash.onStart.push(() => { clearTimeout(timer); document.body.classList.remove("booked"); stats(); });
  window.__dash.onEnd.push(() => { timer = setTimeout(() => { document.body.classList.add("booked"); stats(); window.__dash.setView("bookings"); }, 1800); });
})();
`;

// ---------------------------------------------------------------------------------------------
// Gym classes: the Bookings tab. A class timetable by studio, plus the latest booking.
const gymCss = `
  .xview .tlv{flex:1;min-width:0;display:flex;flex-direction:column;padding:0}
  .stats{display:flex;gap:10px;margin-left:auto}
  .stats span{background:#f0f1f6;border-radius:8px;padding:5px 12px;font-size:13px;color:#31365a}
  .stats b{color:#0a3a9a}
  .tlbox{flex:1;min-height:0;display:flex;flex-direction:column;padding:6px 0 0}
  .axis{display:grid;grid-template-columns:130px 1fr;border-bottom:1px solid #f0f0f5}
  .axis .ticks{position:relative;height:30px}
  .axis .ticks span{position:absolute;top:8px;transform:translateX(-50%);font-size:12px;color:#7d7f8d;font-weight:600}
  .arow{display:grid;grid-template-columns:130px 1fr;border-bottom:1px solid #f0f0f5}
  .alabel{padding:12px 14px;font-weight:600;font-size:14px;border-right:1px solid #f0f0f5}
  .alabel small{display:block;font-weight:400;color:#7d7f8d;font-size:12px;margin-top:2px}
  .track{position:relative;background-image:linear-gradient(to right,#f0f0f5 1px,transparent 1px);background-size:16.667% 100%}
  .bk{position:absolute;height:48px;border-radius:8px;padding:5px 9px;font-size:12px;overflow:hidden;border-left:4px solid;line-height:1.3;white-space:nowrap;text-overflow:ellipsis}
  .bk b{display:block;font-size:12.5px;overflow:hidden;text-overflow:ellipsis}
  .bk span{color:inherit;opacity:.8}
  .bk.ler{background:#e5f1ff;border-color:#2d7ff0;color:#0a4aa8}
  .bk.jad{background:#e3f6e6;border-color:#2fa05b;color:#12663a}
  .bk.tha{background:#efe9fb;border-color:#7e57c2;color:#4a2f8a}
  .bk.nw{background:#0a3a9a;border-color:#6aa8ff;color:#fff;box-shadow:0 0 0 3px rgba(10,58,154,.2);animation:glow2 1.6s ease-in-out 3;z-index:2}
  @keyframes glow2{50%{box-shadow:0 0 0 8px rgba(10,58,154,.07)}}
  body:not(.booked) .bk.nw{display:none}
  .nextrow{display:flex;gap:10px;align-items:center;padding:9px 16px;border-bottom:1px solid #f0f0f5;font-size:13px}
  .nextrow .tm{flex:none;width:52px;text-align:center;border-radius:8px;background:#f0f1f6;padding:6px 0;font-weight:700;font-size:13px}
  .nextrow .tx{flex:1;min-width:0}.nextrow .tx span{display:block;color:#7d7f8d;font-size:12px}
  .nextrow.nwrow{background:#eef3ff}
  body:not(.booked) .nextrow.nwrow{display:none}
`;

const gymHtml = `        <div class="xview" id="v-bookings" hidden>
          <div class="pane tlv">
            <div class="cal-head">
              <div class="cal-nav"><span class="bt">‹</span><b>Sat 17 October 2026</b><span class="bt">›</span><span class="today">Today</span></div>
              <div class="stats"><span><b id="stBk">0</b> classes</span><span><b id="stCv">0</b> studios in use</span><span>First class <b id="stNx">06:00</b></span></div>
              <div class="seg"><span class="on">Day</span><span>Week</span></div>
              <div class="seg"><span class="on">Timeline</span><span>List</span></div>
            </div>
            <div class="tlbox"><div class="axis"><div></div><div class="ticks" id="ticks"></div></div><div id="areas"></div></div>
          </div>
          <div class="xside">
            <div class="pane latest">
              <div class="sh">Latest booking <span class="badge new post">New · WhatsApp</span></div>
              <div class="pre">No new booking yet. The bot is still taking the booking.</div>
              <div class="body post">
                <div class="who"><div class="av2">N</div><div><b>Naledi Khumalo</b><span>Booked by the WhatsApp bot</span></div></div>
                <div class="kv">
                  <span>Class</span><b>Yoga Flow</b>
                  <span>Date</span><b>Sat 17/10/2026</b>
                  <span>Time</span><b>08:00</b>
                  <span>Coach</span><b>Lindiwe</b>
                  <span>Membership</span><b>Premium</b>
                  <span>Spot</span><b>From the waiting list</b>
                  <span>Reference</span><b>IP-2026-0215</b>
                  <span>Status</span><b><span class="badge ok" style="color:#12663a">Confirmed</span></b>
                </div>
                <ul class="tl"><li>Joined the waiting list (number 2)</li><li>Spot opened when a member cancelled</li><li>Took the spot on WhatsApp</li><li>Rating request after the class</li></ul>
                <div class="btns2"><span class="pr">Open chat</span><span>Send reminder</span></div>
              </div>
            </div>
            <div class="pane prev">
              <div class="sh">Classes today <span class="badge gr" id="nextCount">0</span></div>
              <div id="nextList"></div>
            </div>
          </div>
        </div>`;

const gymJs = `
(function () {
  // Saturday 17 Oct 2026, 06:00 to 12:00. [studio, start hour, hours, class, coach and spots, isNew]
  const START = 6, SPAN = 6;
  const STY = [["ler", "Studio 1", "Yoga, Pilates"], ["jad", "Spin room", "20 bikes"], ["tha", "Main floor", "HIIT, Boxing"]];
  const BK = [
    ["ler", 6, 1, "Pilates", "Zanele · 14/16"], ["ler", 8, 1, "Yoga Flow", "Lindiwe · 20/20 full", true], ["ler", 9.5, 1, "Stretch and mobility", "Zanele · 9/20"],
    ["jad", 6, 1, "Early Spin", "Sipho · 18/20"], ["jad", 9, 1, "Spin", "Sipho · 20/20 full"],
    ["tha", 7, 1, "HIIT", "Pieter · 16/18"], ["tha", 10, 1, "Boxing", "Thabo · 11/16"],
  ];
  const fmt = h => { const m = Math.round((h % 1) * 60); return Math.floor(h) + ":" + (m < 10 ? "0" : "") + m; };
  const pad = t => (t.length < 5 ? "0" + t : t);
  document.getElementById("ticks").innerHTML = [7, 8, 9, 10, 11].map(h => '<span style="left:' + (h - START) / SPAN * 100 + '%">' + h + ":00</span>").join("");
  document.getElementById("areas").innerHTML = STY.map(([k, name, role]) => {
    const blocks = BK.filter(b => b[0] === k).map(([, s, d, who, svc, nw]) =>
      '<div class="bk ' + k + (nw ? " nw" : "") + '" style="top:6px;left:' + (s - START) / SPAN * 100 + "%;width:calc(" + d / SPAN * 100 + '% - 4px)"><b>' + (nw ? "NEW  " : "") + who + "</b><span>" + fmt(s) + " · " + svc + "</span></div>").join("");
    return '<div class="arow"><div class="alabel">' + name + "<small>" + role + '</small></div><div class="track" style="height:60px">' + blocks + "</div></div>";
  }).join("");
  function stats() {
    const booked = document.body.classList.contains("booked");
    const list = BK.filter(b => booked || !b[5]);
    document.getElementById("stBk").textContent = list.length;
    document.getElementById("stCv").textContent = new Set(list.map(b => b[0])).size;
    document.getElementById("stNx").textContent = pad(fmt(Math.min(...list.map(b => b[1]))));
    const next = list.slice().sort((a, b) => a[1] - b[1]).slice(0, 6);
    document.getElementById("nextCount").textContent = list.length;
    document.getElementById("nextList").innerHTML = next.map(b => '<div class="nextrow' + (b[5] ? " nwrow" : "") + '"><div class="tm">' + pad(fmt(b[1])) + '</div><div class="tx"><b>' + b[3] + "</b><span>" + STY.find(s => s[0] === b[0])[1] + " · " + b[4] + '</span></div><span class="badge ' + (b[5] ? "new" : "ok") + '" style="' + (b[5] ? "" : "color:#12663a") + '">' + (b[5] ? "New" : "Confirmed") + "</span></div>").join("");
  }
  stats();
  // After the chat: show the booking on the timeline and open the Bookings tab.
  let timer;
  window.__dash.onStart.push(() => { clearTimeout(timer); document.body.classList.remove("booked"); stats(); });
  window.__dash.onEnd.push(() => { timer = setTimeout(() => { document.body.classList.add("booked"); stats(); window.__dash.setView("bookings"); }, 1800); });
})();
`;

// ---------------------------------------------------------------------------------------------
// Vehicle service: the Bookings tab. A workshop-day timeline by technician, plus the latest booking.
const vehicleCss = `
  .xview .tlv{flex:1;min-width:0;display:flex;flex-direction:column;padding:0}
  .stats{display:flex;gap:10px;margin-left:auto}
  .stats span{background:#f0f1f6;border-radius:8px;padding:5px 12px;font-size:13px;color:#31365a}
  .stats b{color:#0a3a9a}
  .tlbox{flex:1;min-height:0;display:flex;flex-direction:column;padding:6px 0 0}
  .axis{display:grid;grid-template-columns:130px 1fr;border-bottom:1px solid #f0f0f5}
  .axis .ticks{position:relative;height:30px}
  .axis .ticks span{position:absolute;top:8px;transform:translateX(-50%);font-size:12px;color:#7d7f8d;font-weight:600}
  .arow{display:grid;grid-template-columns:130px 1fr;border-bottom:1px solid #f0f0f5}
  .alabel{padding:12px 14px;font-weight:600;font-size:14px;border-right:1px solid #f0f0f5}
  .alabel small{display:block;font-weight:400;color:#7d7f8d;font-size:12px;margin-top:2px}
  .track{position:relative;background-image:linear-gradient(to right,#f0f0f5 1px,transparent 1px);background-size:10% 100%}
  .bk{position:absolute;height:48px;border-radius:8px;padding:5px 9px;font-size:12px;overflow:hidden;border-left:4px solid;line-height:1.3;white-space:nowrap;text-overflow:ellipsis}
  .bk b{display:block;font-size:12.5px;overflow:hidden;text-overflow:ellipsis}
  .bk span{color:inherit;opacity:.8}
  .bk.ler{background:#e5f1ff;border-color:#2d7ff0;color:#0a4aa8}
  .bk.jad{background:#e3f6e6;border-color:#2fa05b;color:#12663a}
  .bk.tha{background:#efe9fb;border-color:#7e57c2;color:#4a2f8a}
  .bk.nw{background:#0a3a9a;border-color:#6aa8ff;color:#fff;box-shadow:0 0 0 3px rgba(10,58,154,.2);animation:glow2 1.6s ease-in-out 3;z-index:2}
  @keyframes glow2{50%{box-shadow:0 0 0 8px rgba(10,58,154,.07)}}
  body:not(.booked) .bk.nw{display:none}
  .nextrow{display:flex;gap:10px;align-items:center;padding:9px 16px;border-bottom:1px solid #f0f0f5;font-size:13px}
  .nextrow .tm{flex:none;width:52px;text-align:center;border-radius:8px;background:#f0f1f6;padding:6px 0;font-weight:700;font-size:13px}
  .nextrow .tx{flex:1;min-width:0}.nextrow .tx span{display:block;color:#7d7f8d;font-size:12px}
  .nextrow.nwrow{background:#eef3ff}
  body:not(.booked) .nextrow.nwrow{display:none}
`;

const vehicleHtml = `        <div class="xview" id="v-bookings" hidden>
          <div class="pane tlv">
            <div class="cal-head">
              <div class="cal-nav"><span class="bt">‹</span><b>Mon 16 November 2026</b><span class="bt">›</span><span class="today">Today</span></div>
              <div class="stats"><span><b id="stBk">0</b> bookings</span><span><b id="stCv">0</b> technicians in</span><span>First drop-off <b id="stNx">07:00</b></span></div>
              <div class="seg"><span class="on">Day</span><span>Week</span></div>
              <div class="seg"><span class="on">Timeline</span><span>List</span></div>
            </div>
            <div class="tlbox"><div class="axis"><div></div><div class="ticks" id="ticks"></div></div><div id="areas"></div></div>
          </div>
          <div class="xside">
            <div class="pane latest">
              <div class="sh">Latest booking <span class="badge new post">New · WhatsApp</span></div>
              <div class="pre">No new booking yet. The bot is still taking the booking.</div>
              <div class="body post">
                <div class="who"><div class="av2">S</div><div><b>Sipho Dlamini</b><span>Booked by the WhatsApp bot</span></div></div>
                <div class="kv">
                  <span>Drop-off</span><b>Mon 16/11/2026</b>
                  <span>Time</span><b>07:30</b>
                  <span>Vehicle</span><b>Corolla 2019</b>
                  <span>Reg. no.</span><b>CA 123-456</b>
                  <span>Service</span><b>Full service</b>
                  <span>Estimate</span><b>R1 560.00</b>
                  <span>Reference</span><b>KR-2026-0214</b>
                  <span>Status</span><b><span class="badge ok" style="color:#12663a">Confirmed</span></b>
                </div>
                <ul class="tl"><li>Booked on WhatsApp</li><li>Reminder due Sun 15/11 at 17:00</li><li>Status updates on the day</li><li>Next-service reminder in 6 months</li></ul>
                <div class="btns2"><span class="pr">Open chat</span><span>Send reminder</span></div>
              </div>
            </div>
            <div class="pane prev">
              <div class="sh">Drop-offs today <span class="badge gr" id="nextCount">0</span></div>
              <div id="nextList"></div>
            </div>
          </div>
        </div>`;

const vehicleJs = `
(function () {
  // Monday 16 Nov 2026, 07:00 to 17:00. [technician, start hour, hours, client, job, isNew]
  const START = 7, SPAN = 10;
  const STY = [["ler", "Pieter", "Bay 1 · Services"], ["jad", "Themba", "Bay 2 · Services"], ["tha", "Lwazi", "Bay 3 · Tyres, brakes"]];
  const BK = [
    ["ler", 7, 3, "T. Mokoena", "Basic service"], ["ler", 10.5, 4, "E. Clarke", "Clutch replacement"],
    ["jad", 7.5, 6.8, "Sipho Dlamini", "Full service + brake pads", true], ["jad", 14.5, 2, "A. Patel", "Basic service"],
    ["tha", 7.5, 2, "M. Smith", "Tyres and balancing"], ["tha", 10, 1.5, "S. Ndlovu", "Wheel alignment"], ["tha", 12, 3, "Z. Dube", "Brake discs"],
  ];
  const fmt = h => { const m = Math.round((h % 1) * 60); return Math.floor(h) + ":" + (m < 10 ? "0" : "") + m; };
  const pad = t => (t.length < 5 ? "0" + t : t);
  document.getElementById("ticks").innerHTML = [8, 9, 10, 11, 12, 13, 14, 15, 16].map(h => '<span style="left:' + (h - START) / SPAN * 100 + '%">' + h + ":00</span>").join("");
  document.getElementById("areas").innerHTML = STY.map(([k, name, role]) => {
    const blocks = BK.filter(b => b[0] === k).map(([, s, d, who, svc, nw]) =>
      '<div class="bk ' + k + (nw ? " nw" : "") + '" style="top:6px;left:' + (s - START) / SPAN * 100 + "%;width:calc(" + d / SPAN * 100 + '% - 4px)"><b>' + (nw ? "NEW  " : "") + who + "</b><span>" + fmt(s) + " · " + svc + "</span></div>").join("");
    return '<div class="arow"><div class="alabel">' + name + "<small>" + role + '</small></div><div class="track" style="height:60px">' + blocks + "</div></div>";
  }).join("");
  function stats() {
    const booked = document.body.classList.contains("booked");
    const list = BK.filter(b => booked || !b[5]);
    document.getElementById("stBk").textContent = list.length;
    document.getElementById("stCv").textContent = new Set(list.map(b => b[0])).size;
    document.getElementById("stNx").textContent = pad(fmt(Math.min(...list.map(b => b[1]))));
    const next = list.slice().sort((a, b) => a[1] - b[1]).slice(0, 6);
    document.getElementById("nextCount").textContent = list.length;
    document.getElementById("nextList").innerHTML = next.map(b => '<div class="nextrow' + (b[5] ? " nwrow" : "") + '"><div class="tm">' + pad(fmt(b[1])) + '</div><div class="tx"><b>' + b[3] + "</b><span>" + STY.find(s => s[0] === b[0])[1] + " · " + b[4] + '</span></div><span class="badge ' + (b[5] ? "new" : "ok") + '" style="' + (b[5] ? "" : "color:#12663a") + '">' + (b[5] ? "New" : "Confirmed") + "</span></div>").join("");
  }
  stats();
  // After the chat: show the booking on the timeline and open the Bookings tab.
  let timer;
  window.__dash.onStart.push(() => { clearTimeout(timer); document.body.classList.remove("booked"); stats(); });
  window.__dash.onEnd.push(() => { timer = setTimeout(() => { document.body.classList.add("booked"); stats(); window.__dash.setView("bookings"); }, 1800); });
})();
`;

// ---------------------------------------------------------------------------------------------
// Event tickets: the Bookings tab. Ticket sales by type, plus the latest order.
const eventCss = `
  .xview .tlv{flex:1;min-width:0;display:flex;flex-direction:column;padding:0}
  .stats{display:flex;gap:10px;margin-left:auto}
  .stats span{background:#f0f1f6;border-radius:8px;padding:5px 12px;font-size:13px;color:#31365a}
  .stats b{color:#0a3a9a}
  .tkbox{flex:1;min-height:0;padding:14px 16px;display:flex;flex-direction:column;gap:14px;overflow:hidden}
  .tkcard{border:1px solid #ececf3;border-radius:12px;padding:12px 14px}
  .tkcard .top{display:flex;justify-content:space-between;align-items:baseline;font-size:14px}
  .tkcard .top b{font-size:15px}
  .tkcard .top span{color:#7d7f8d;font-size:12.5px}
  .tkbar{height:12px;border-radius:99px;background:#f0f1f6;margin:10px 0 6px;overflow:hidden}
  .tkbar i{display:block;height:100%;border-radius:99px;transition:width .8s}
  .tkcard.gen .tkbar i{background:#2d7ff0}.tkcard.vip .tkbar i{background:#7e57c2}
  .tkcard .sub{display:flex;justify-content:space-between;font-size:12.5px;color:#4a4d5c}
  .tkcard .sub .pct{font-weight:700;color:#0a3a9a}
  .nextrow{display:flex;gap:10px;align-items:center;padding:9px 16px;border-bottom:1px solid #f0f0f5;font-size:13px}
  .nextrow .tm{flex:none;width:52px;text-align:center;border-radius:8px;background:#f0f1f6;padding:6px 0;font-weight:700;font-size:13px}
  .nextrow .tx{flex:1;min-width:0}.nextrow .tx span{display:block;color:#7d7f8d;font-size:12px}
  .nextrow.nwrow{background:#eef3ff}
  body:not(.booked) .nextrow.nwrow{display:none}
`;

const eventHtml = `        <div class="xview" id="v-bookings" hidden>
          <div class="pane tlv">
            <div class="cal-head">
              <div class="cal-nav"><b style="min-width:0">Sunset Sessions 2026 · Sat 14/11/2026</b></div>
              <div class="stats"><span><b id="stBk">0</b> tickets sold</span><span><b id="stRv">R0</b> sales</span><span>Gates <b>12:00</b></span></div>
            </div>
            <div class="tkbox">
              <div class="tkcard gen"><div class="top"><b>General · R650</b><span id="gTxt"></span></div><div class="tkbar"><i id="gBar"></i></div><div class="sub"><span>Lawn, food market</span><span class="pct" id="gPct"></span></div></div>
              <div class="tkcard vip"><div class="top"><b>VIP · R1 450</b><span id="vTxt"></span></div><div class="tkbar"><i id="vBar"></i></div><div class="sub"><span>Deck, private bar, fast entry</span><span class="pct" id="vPct"></span></div></div>
            </div>
          </div>
          <div class="xside">
            <div class="pane latest">
              <div class="sh">Latest order <span class="badge new post">New · WhatsApp</span></div>
              <div class="pre">No new order yet. The bot is still selling the tickets.</div>
              <div class="body post">
                <div class="who"><div class="av2">N</div><div><b>Naledi Khumalo</b><span>Ordered from the WhatsApp bot</span></div></div>
                <div class="kv">
                  <span>Tickets</span><b>2 x VIP</b>
                  <span>Total</span><b>R2 900.00</b>
                  <span>Payment</span><b>Paid, card or EFT</b>
                  <span>Tickets sent</span><b>2 QR codes</b>
                  <span>Reference</span><b>SSF-2026-0412</b>
                  <span>Status</span><b><span class="badge ok" style="color:#12663a">Confirmed</span></b>
                </div>
                <ul class="tl"><li>Paid on WhatsApp</li><li>2 QR tickets delivered</li><li>Gate info due Fri 13/11 at 09:00</li><li>Feedback request after the event</li></ul>
                <div class="btns2"><span class="pr">Open chat</span><span>Resend tickets</span></div>
              </div>
            </div>
            <div class="pane prev">
              <div class="sh">Latest orders <span class="badge gr" id="nextCount">0</span></div>
              <div id="nextList"></div>
            </div>
          </div>
        </div>`;

const eventJs = `
(function () {
  // Sales so far. [buyer, ticket, count, time, isNew]
  const CAP = { gen: 2000, vip: 250 }, BASE = { gen: 1612, vip: 186 }, PRICE = { gen: 650, vip: 1450 };
  const ORD = [
    ["T. Mokoena", "gen", 4, "17:42"], ["E. Clarke", "vip", 2, "17:10"], ["P. Botha", "gen", 2, "16:55"], ["A. Patel", "gen", 6, "16:31"], ["S. Ndlovu", "vip", 1, "15:48"],
    ["Naledi Khumalo", "vip", 2, "19:08", true],
  ];
  const fmt = n => String(n).replace(/\\B(?=(\\d{3})+(?!\\d))/g, " ");
  function draw() {
    const booked = document.body.classList.contains("booked");
    const n = { gen: BASE.gen, vip: BASE.vip + (booked ? 2 : 0) };
    for (const [k, p] of [["gen", "g"], ["vip", "v"]]) {
      document.getElementById(p + "Txt").textContent = fmt(n[k]) + " of " + fmt(CAP[k]) + " sold";
      document.getElementById(p + "Bar").style.width = (n[k] / CAP[k] * 100).toFixed(1) + "%";
      document.getElementById(p + "Pct").textContent = Math.round(n[k] / CAP[k] * 100) + "% sold";
    }
    document.getElementById("stBk").textContent = fmt(n.gen + n.vip);
    document.getElementById("stRv").textContent = "R" + fmt(n.gen * PRICE.gen + n.vip * PRICE.vip);
    const list = ORD.filter(o => booked || !o[4]).slice().sort((a, b) => b[3].localeCompare(a[3]));
    document.getElementById("nextCount").textContent = list.length;
    document.getElementById("nextList").innerHTML = list.map(o => '<div class="nextrow' + (o[4] ? " nwrow" : "") + '"><div class="tm">' + o[3] + '</div><div class="tx"><b>' + o[0] + "</b><span>" + o[2] + " x " + (o[1] === "vip" ? "VIP" : "General") + '</span></div><span class="badge ' + (o[4] ? "new" : "ok") + '" style="' + (o[4] ? "" : "color:#12663a") + '">' + (o[4] ? "New" : "Paid") + "</span></div>").join("");
  }
  draw();
  // After the chat: show the new order in the sales and open the Bookings tab.
  let timer;
  window.__dash.onStart.push(() => { clearTimeout(timer); document.body.classList.remove("booked"); draw(); });
  window.__dash.onEnd.push(() => { timer = setTimeout(() => { document.body.classList.add("booked"); draw(); window.__dash.setView("bookings"); }, 1800); });
})();
`;

export const VIEWS = {
  'event-tickets': { tab: 'bookings', css: eventCss, html: eventHtml, js: eventJs },
  'real-estate-viewing': { tab: 'bookings', css: propCss, html: propHtml, js: propJs },
  'hotel-guest-house': { tab: 'bookings', css: hotelCss, html: hotelHtml, js: hotelJs },
  'gym-classes': { tab: 'bookings', css: gymCss, html: gymHtml, js: gymJs },
  'vehicle-service': { tab: 'bookings', css: vehicleCss, html: vehicleHtml, js: vehicleJs },
  'salon-booking': { tab: 'bookings', css: salonCss, html: salonHtml, js: salonJs },
  'restaurant-booking': { tab: 'bookings', css: restaurantCss, html: restaurantHtml, js: restaurantJs },
  'doctors-appointment': { tab: 'appointments', css: doctorCss, html: doctorHtml, js: doctorJs },
};
