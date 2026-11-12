# Testing — Countdown Timer & Event Reminder

## Automated check

```bash
python3 tests/validate.py
```

`validate.py` parses `src/index.html` and `src/app.js` and asserts the required structure is present: the add form, mode selector, presets, notification opt-in, the four time digits, flip animation, share-URL building/import, count-up mode, and `localStorage` persistence. It exits non-zero on any failure.

## Manual test checklist

- [ ] Open `src/index.html` — empty state shows with no countdowns.
- [ ] Add a countdown 2 minutes in the future — a card appears ticking down in days/hours/min/sec.
- [ ] Reload the page — the countdown is still there (localStorage).
- [ ] Add a count-up timer for a past date — it ticks upward from that date.
- [ ] Use a quick-add preset (e.g. Diwali 2027) — a card appears with the right date.
- [ ] Click "Enable browser reminders" and allow notifications — when a short countdown reaches zero, the card turns green, shows the "is here!" message, and a browser notification fires.
- [ ] Click "Copy link" on a timer, paste the URL in a new tab — the countdown is added there automatically (shared-URL import).
- [ ] Click ✕ on a card — the timer is deleted and stays deleted after reload.
- [ ] Submit the form with an empty name — nothing is added (required validation).
- [ ] Resize to a 360px-wide viewport — form stacks to one column, digits stay readable.
