import fs from "node:fs";
import crypto from "node:crypto";

const FILE = "data/sessions.json";

function load() {
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf8"));
  } catch {
    return {};
  }
}

let sessions = load();

function save() {
  fs.mkdirSync("data", { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(sessions, null, 2));
}

export function createSession(course) {
  const id = crypto.randomUUID();
  sessions[id] = { id, course, startedAt: new Date().toISOString(), present: {} };
  save();
  return sessions[id];
}

export function getSession(id) {
  return sessions[id] || null;
}

export function markPresent(id, studentId, name) {
  const s = sessions[id];
  if (!s) return null;
  s.present[studentId] ??= { name, at: new Date().toISOString() };
  save();
  return s;
}
