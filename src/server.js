import express from "express";
import QRCode from "qrcode";
import { currentCode, verify, ROTATE_MS } from "./codes.js";
import { createSession, getSession, markPresent } from "./store.js";

const app = express();
app.use(express.json());
app.use(express.static("public"));

app.post("/api/sessions", (req, res) => {
  const { course } = req.body || {};
  if (!course) return res.status(400).json({ error: "course is required" });
  res.status(201).json(createSession(course));
});

app.get("/api/sessions/:id/qr", async (req, res) => {
  const session = getSession(req.params.id);
  if (!session) return res.status(404).json({ error: "no such session" });

  const code = currentCode(session.id);
  const url = `${req.protocol}://${req.get("host")}/scan.html?s=${session.id}&c=${code}`;
  res.json({ qr: await QRCode.toDataURL(url, { margin: 1, width: 480 }), rotatesIn: ROTATE_MS });
});

app.post("/api/sessions/:id/checkin", (req, res) => {
  const { code, studentId, name } = req.body || {};
  if (!verify(req.params.id, code)) return res.status(403).json({ error: "code expired, scan again" });
  if (!studentId || !name) return res.status(400).json({ error: "studentId and name are required" });

  const session = markPresent(req.params.id, studentId, name);
  if (!session) return res.status(404).json({ error: "no such session" });
  res.json({ ok: true, count: Object.keys(session.present).length });
});

app.get("/api/sessions/:id", (req, res) => {
  const session = getSession(req.params.id);
  session ? res.json(session) : res.status(404).json({ error: "no such session" });
});

app.get("/api/sessions/:id/export.csv", (req, res) => {
  const session = getSession(req.params.id);
  if (!session) return res.status(404).send("no such session");
  const rows = Object.entries(session.present).map(([id, p]) => [id, p.name, p.at]);
  const csv = [["student_id", "name", "checked_in_at"], ...rows]
    .map((r) => r.map((v) => `"${String(v).replaceAll('"', '""')}"`).join(","))
    .join("\n");
  res.type("text/csv").attachment(`${session.course}.csv`).send(csv);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`HereNow on http://localhost:${PORT}`));
