# HereNow

Attendance in five seconds: scan the QR on the screen, done.

Built at the Neumont Hackathon (Nov 28, 2026) by **The Null Pointers**.

## How it works

1. The instructor starts a session; the projector shows a QR code.
2. The code rotates every 10 seconds (HMAC of session + time window), so a
   photo posted to Discord is useless by the time anyone opens it.
3. Students scan, enter their ID once (remembered on the phone), and they're in.
4. Export the list as CSV for the gradebook (one click).

## Run it

```sh
npm install
HERENOW_SECRET=change-me npm start
# open http://localhost:3000
```

Tests: `npm test`
