import crypto from "node:crypto";

// A code is valid for its own window and the one before it, so a scan that
// lands right as the code rotates still counts.
export const ROTATE_MS = 10_000;

const secret = process.env.HERENOW_SECRET || crypto.randomBytes(32).toString("hex");

export function windowAt(now = Date.now()) {
  return Math.floor(now / ROTATE_MS);
}

export function codeFor(sessionId, window) {
  return crypto
    .createHmac("sha256", secret)
    .update(`${sessionId}:${window}`)
    .digest("base64url")
    .slice(0, 12);
}

export function currentCode(sessionId, now = Date.now()) {
  return codeFor(sessionId, windowAt(now));
}

export function verify(sessionId, code, now = Date.now()) {
  const w = windowAt(now);
  return [w, w - 1].some((win) => safeEqual(codeFor(sessionId, win), code));
}

function safeEqual(a, b) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(String(b));
  return ab.length === bb.length && crypto.timingSafeEqual(ab, bb);
}
