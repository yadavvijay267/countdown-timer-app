# ⏳ Countdown Timer & Event Reminder

Create countdowns to any date, with multiple simultaneous timers and browser reminders. Track launches, exam dates, project deadlines, and festivals — or flip a timer into count-up mode to track elapsed time since an event.

## Features

- **Multiple named countdowns** — add as many as you like (Diwali, deadlines, launches); all tick live at once.
- **Days / hours / minutes / seconds display with flip animation** — digits flip each time they change.
- **Browser notification when a countdown reaches zero** — opt in with the "Enable browser reminders" button (Notification API); the finished timer is highlighted in green.
- **Share a countdown as a URL** — every timer has a Share/Copy link button; the event name, date, and mode are encoded in the query string (`?event=…&date=…&mode=…`), and opening that link adds the countdown automatically.
- **Count-up mode** — track elapsed time since an event (e.g. days since a launch) instead of time remaining.
- **Persistence** — all countdowns are saved in `localStorage` and restored on reload.
- **Quick-add presets** — one-click countdowns for Diwali 2027, New Year 2027, and Christmas 2026.

## Tech Stack

- HTML, CSS, JavaScript (no frameworks, no build step)
- Notification API, `localStorage`, URL query strings

## How to Run

No installation needed:

```bash
# Option 1: just open the file
open src/index.html        # macOS
xdg-open src/index.html    # Linux
start src/index.html       # Windows

# Option 2: serve it locally
python3 -m http.server --directory src 8000
# then visit http://localhost:8000
```

## How to Use

1. Enter an event name and date/time, choose **Count down** or **Count up**, and click **Add Countdown** (or use a quick-add preset).
2. Click **🔔 Enable browser reminders** and allow notifications to be alerted when a countdown hits zero.
3. Click **🔗 Share** or **📋 Copy link** on any timer to send it to someone — opening the link adds that countdown to their dashboard.
4. Click **✕** on a timer card to delete it.

## Screenshots

Screenshots live in [`screenshots/`](screenshots/) — see `SCREENSHOTS.md` there for the naming convention.

## Project Structure

```
countdown-timer-app/
├── src/
│   ├── index.html   # add form, presets, timer grid
│   ├── styles.css   # dark theme, flip animation, timer cards
│   └── app.js       # timer engine, notifications, share URLs, storage
├── assets/          # logo.svg
├── docs/            # ARCHITECTURE.md
├── tests/           # TESTING.md + validate.py
└── screenshots/     # SCREENSHOTS.md
```

## License

MIT — see [LICENSE](LICENSE). Copyright (c) 2026 Clamor.
