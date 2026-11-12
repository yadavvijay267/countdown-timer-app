/* Countdown Timer & Event Reminder — original code by Clamor.
   Multiple named countdowns (or count-ups), flip animation, browser
   notifications at zero, localStorage persistence, and shareable
   countdown URLs with the event + date encoded in the query string. */
"use strict";

const STORAGE_KEY = "countdown-timers-v1";
const $ = (id) => document.getElementById(id);
const timersEl = $("timers");

let timers = load();
const notified = new Set();

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
}
function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(timers)); }

function fmt(n) { return String(n).padStart(2, "0"); }
function escapeHtml(s) { return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }

function diffParts(target, now, mode) {
  let ms = mode === "up" ? now - target : target - now;
  const past = ms < 0;
  ms = Math.abs(ms);
  const days = Math.floor(ms / 86400000);
  const hours = Math.floor(ms / 3600000) % 24;
  const minutes = Math.floor(ms / 60000) % 60;
  const seconds = Math.floor(ms / 1000) % 60;
  return { days, hours, minutes, seconds, past };
}

function render() {
  timersEl.innerHTML = "";
  $("emptyState").hidden = timers.length !== 0;
  timers.forEach((t) => {
    const card = document.createElement("article");
    card.className = "timer-card"; card.dataset.id = t.id;
    const target = new Date(t.date);
    const dateStr = target.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
    card.innerHTML = `
      <button class="delete-btn" aria-label="Delete ${escapeHtml(t.name)}">✕</button>
      <span class="mode-badge">${t.mode === "up" ? "▲ Counting up" : "▼ Counting down"}</span>
      <h3>${escapeHtml(t.name)}</h3>
      <p class="date">${dateStr}</p>
      <div class="digits">
        <div class="digit"><b data-part="days">00</b><span>Days</span></div>
        <div class="digit"><b data-part="hours">00</b><span>Hours</span></div>
        <div class="digit"><b data-part="minutes">00</b><span>Min</span></div>
        <div class="digit"><b data-part="seconds">00</b><span>Sec</span></div>
      </div>
      <p class="done-msg" hidden></p>
      <div class="timer-actions">
        <button class="share-btn">🔗 Share</button>
        <button class="copy-btn">📋 Copy link</button>
      </div>`;
    card.querySelector(".delete-btn").addEventListener("click", () => {
      timers = timers.filter((x) => x.id !== t.id); save(); render();
    });
    card.querySelector(".share-btn").addEventListener("click", async () => {
      const url = shareUrl(t);
      if (navigator.share) { try { await navigator.share({ title: t.name, text: `Countdown to ${t.name}`, url }); } catch { /* user cancelled */ } }
      else { await copyText(url); }
    });
    card.querySelector(".copy-btn").addEventListener("click", async () => { await copyText(shareUrl(t)); });
    timersEl.appendChild(card);
  });
  tick();
}

async function copyText(text) {
  try { await navigator.clipboard.writeText(text); }
  catch { const ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); ta.remove(); }
  $("notifyStatus").textContent = "🔗 Share link copied to clipboard.";
  setTimeout(() => { $("notifyStatus").textContent = ""; }, 3000);
}

function shareUrl(t) {
  const url = new URL(location.href.split("?")[0]);
  url.searchParams.set("event", t.name);
  url.searchParams.set("date", t.date);
  url.searchParams.set("mode", t.mode);
  return url.toString();
}

function tick() {
  const now = Date.now();
  timers.forEach((t) => {
    const card = timersEl.querySelector(`[data-id="${t.id}"]`);
    if (!card) return;
    const target = new Date(t.date).getTime();
    const p = diffParts(target, now, t.mode);
    const msg = card.querySelector(".done-msg");
    if (t.mode === "down" && p.past) {
      card.classList.add("done");
      msg.hidden = false; msg.textContent = `🎉 ${t.name} is here!`;
      if (!notified.has(t.id)) { notified.add(t.id); notify(t); }
    } else {
      card.classList.remove("done"); msg.hidden = true;
    }
    ["days", "hours", "minutes", "seconds"].forEach((part) => {
      const el = card.querySelector(`[data-part="${part}"]`);
      const val = part === "days" ? String(p[part]) : fmt(p[part]);
      if (el.textContent !== val) { el.textContent = val; el.classList.remove("flip"); void el.offsetWidth; el.classList.add("flip"); }
    });
  });
}

function notify(t) {
  if (Notification.permission !== "granted") return;
  try { new Notification(`⏰ ${t.name}`, { body: `Your countdown to ${t.name} has reached zero!` }); } catch { /* notifications unavailable */ }
}

$("addForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = $("eventName").value.trim();
  const date = $("eventDate").value;
  const mode = $("eventMode").value;
  if (!name || !date) return;
  if (mode === "down" && new Date(date).getTime() < Date.now()) {
    if (!confirm("That date is in the past. Add it as a count-up instead?")) return;
  }
  timers.push({ id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), name, date, mode });
  save(); render();
  e.target.reset();
});

document.querySelectorAll("[data-preset]").forEach((b) => {
  b.addEventListener("click", () => {
    timers.push({ id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), name: b.dataset.preset, date: b.dataset.date, mode: "down" });
    save(); render();
  });
});

$("notifyBtn").addEventListener("click", async () => {
  if (!("Notification" in window)) { $("notifyStatus").textContent = "This browser does not support notifications."; return; }
  const perm = await Notification.requestPermission();
  $("notifyStatus").textContent = perm === "granted"
    ? "✅ Reminders enabled — you'll be notified when a countdown reaches zero."
    : "Notifications not enabled. Countdowns will still show on screen.";
});

/* Import a shared countdown from the URL (?event=…&date=…&mode=…). */
(function importFromUrl() {
  const q = new URLSearchParams(location.search);
  const name = q.get("event"), date = q.get("date");
  if (!name || !date || Number.isNaN(new Date(date).getTime())) return;
  if (timers.some((t) => t.name === name && t.date === date)) return;
  timers.push({ id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), name, date, mode: q.get("mode") === "up" ? "up" : "down" });
  save();
})();

render();
setInterval(tick, 1000);
