const $ = (id) => document.getElementById(id);
let session;

$("new-session").addEventListener("submit", async (e) => {
  e.preventDefault();
  const course = new FormData(e.target).get("course");
  const res = await fetch("/api/sessions", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ course }),
  });
  session = await res.json();
  $("start").hidden = true;
  $("projector").hidden = false;
  $("course").textContent = session.course;
  tick();
});

async function tick() {
  const [qr, s] = await Promise.all([
    fetch(`/api/sessions/${session.id}/qr`).then((r) => r.json()),
    fetch(`/api/sessions/${session.id}`).then((r) => r.json()),
  ]);
  $("qr").src = qr.qr;
  $("count").textContent = Object.keys(s.present).length;

  const bar = $("progress");
  bar.style.transition = "none";
  bar.style.width = "100%";
  requestAnimationFrame(() => {
    bar.style.transition = `width ${qr.rotatesIn}ms linear`;
    bar.style.width = "0%";
  });
  setTimeout(tick, qr.rotatesIn);
}
