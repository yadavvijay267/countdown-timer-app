#!/usr/bin/env python3
"""Automated structural validation for the Countdown Timer app.
Checks that src/index.html + src/app.js contain every element the
guide entry requires. Run: python3 tests/validate.py (exit 0 = pass)."""
import pathlib, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
html = (ROOT / "src" / "index.html").read_text()
js = (ROOT / "src" / "app.js").read_text()
css = (ROOT / "src" / "styles.css").read_text()

checks = [
    ("index.html exists and references styles.css", 'href="styles.css"' in html),
    ("index.html references app.js", 'src="app.js"' in html),
    ("add-countdown form present", 'id="addForm"' in html),
    ("event name + date inputs present", 'id="eventName"' in html and 'id="eventDate"' in html),
    ("mode selector present (count down / count up)", 'id="eventMode"' in html and '"up"' in js),
    ("notification opt-in button present", 'id="notifyBtn"' in html),
    ("Diwali preset present", "Diwali 2027" in html),
    ("timers container present", 'id="timers"' in html),
    ("four time digits rendered", all(p in js for p in ('"days"', '"hours"', '"minutes"', '"seconds"'))),
    ("flip animation defined", "@keyframes flip" in css),
    ("1-second tick interval", "setInterval(tick, 1000)" in js),
    ("Notification API used", "new Notification" in js and "requestPermission" in js),
    ("share URL built with event + date params", 'searchParams.set("event"' in js and 'searchParams.set("date"' in js),
    ("shared URL imported on load", "importFromUrl" in js and "URLSearchParams" in js),
    ("timers persisted in localStorage", "countdown-timers-v1" in js),
    ("delete action present", "delete-btn" in js),
]
failed = [name for name, ok in checks if not ok]
for name, ok in checks:
    print(("PASS " if ok else "FAIL ") + name)
print(f"{len(checks) - len(failed)}/{len(checks)} checks passed")
sys.exit(1 if failed else 0)
