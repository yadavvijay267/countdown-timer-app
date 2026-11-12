# Architecture — Countdown Timer & Event Reminder

## Overview

A single-page multi-timer dashboard. Timers are plain objects in an array, persisted to `localStorage`, rendered as cards, and ticked by one global 1-second interval. No framework, no build step, no server.

## Files

| File | Role |
| --- | --- |
| `src/index.html` | Add-countdown form, quick-add presets, notification opt-in, timer grid. |
| `src/styles.css` | Dark theme, timer cards, flip animation for changing digits. |
| `src/app.js` | Timer engine, persistence, notifications, share-URL import/export. |

## Flow

```
Add (form / preset / shared URL)
  → timers[] += { id, name, date (ISO string), mode: "down" | "up" }
  → save() → localStorage["countdown-timers-v1"]
  → render(): rebuild cards, then tick()
  → setInterval(tick, 1000): for each timer, diffParts(target, now, mode)
     → update the 4 digit elements; re-trigger the flip animation only
       when a digit's text actually changes
     → count-down timer that has passed zero: card gets .done, shows
       "🎉 … is here!" and fires a Notification once (tracked in `notified`)
```

## Key decisions

- **One interval for all timers:** a single `setInterval` updates every card, instead of one timer per countdown — cheap and easy to reason about.
- **Count-up mode:** the same `diffParts` function computes `now − target` when `mode === "up"`, so elapsed time reuses the countdown display.
- **Shareable URLs:** `shareUrl()` builds `?event=…&date=…&mode=…` from the current page URL. On load, `importFromUrl()` reads those params and adds the timer (skipping duplicates). Works with plain `file://` opening too, since it only reads `location.search`.
- **Notifications:** opt-in only (`Notification.requestPermission()` behind a button). The `notified` set guarantees one notification per timer per page load.
- **Storage:** the whole array is serialised as JSON under one key, so adding/removing timers is a single `save()` call.
