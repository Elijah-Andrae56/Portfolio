// cv-builder.js — comprehensive single-column CV
import { SITE } from "./data.js";

/* ---- Helpers ---- */
function escapeHtml(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;").replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function parseDate(x) { const t = Date.parse(x); return Number.isFinite(t) ? t : 0; }
function formatMonthYear(d) {
  if (!d) return "";
  const dt = new Date(d);
  if (!Number.isFinite(dt.getTime())) return "";
  return new Intl.DateTimeFormat(undefined, { year: "numeric", month: "short" }).format(dt);
}
function stripUrl(url) {
  return String(url || "").replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}
function commaLine(arr) { return Array.isArray(arr) ? arr.filter(Boolean).join(", ") : ""; }
function limitBullets(arr, max) {
  const a = Array.isArray(arr) ? arr : [];
  return Number.isFinite(max) && max > 0 ? a.slice(0, max) : a;
}

function labToCvBullets(lab) {
  const cv = lab.descriptions?.cv;
  if (Array.isArray(cv) && cv.length) return cv;
  if (Array.isArray(lab.cvBullets) && lab.cvBullets.length) return lab.cvBullets;
  const out = [];
  if (Array.isArray(lab.modules)) {
    for (const m of lab.modules) {
      if (Array.isArray(m.bullets) && m.bullets.length) out.push(...m.bullets.map((b) => `${m.title}: ${b}`));
      else if (m.blurb) out.push(`${m.title}: ${m.blurb}`);
    }
  }
  return out;
}

function getCardCvBullets(card) {
  const cv = card.descriptions?.cv;
  if (Array.isArray(cv) && cv.length) return cv;
  if (Array.isArray(card.cvBullets) && card.cvBullets.length) return card.cvBullets;
  return Array.isArray(card.bullets) ? card.bullets : [];
}

export function buildCvHtml(config) {
  const person = SITE.person;
  const highlights = (SITE.highlights || []).filter(Boolean);
  const skills = SITE.skills || [];
  const education = SITE.education || [];
  const experience = SITE.experience || [];

  const researchCards = (SITE.cards || [])
    .filter((c) => c.kind === "research")
    .sort((a, b) => parseDate(b.date) - parseDate(a.date));

  const labCards = (SITE.cards || [])
    .filter((c) => c.kind === "lab")
    .sort((a, b) => parseDate(b.date) - parseDate(a.date));

  const projectCards = (SITE.cards || [])
    .filter((c) => c.kind === "project")
    .sort((a, b) => parseDate(b.date) - parseDate(a.date));

  const { contact } = person;

  const contactHtml = [
    contact?.email ? `<div>${escapeHtml(contact.email)}</div>` : "",
    contact?.linkedin ? `<div><a href="${contact.linkedin}">${escapeHtml(stripUrl(contact.linkedin))}</a></div>` : "",
    contact?.github ? `<div><a href="${contact.github}">${escapeHtml(stripUrl(contact.github))}</a></div>` : "",
    contact?.portfolio ? `<div><a href="${contact.portfolio}">${escapeHtml(stripUrl(contact.portfolio))}</a></div>` : "",
  ].join("");

  const highlightsHtml = highlights.length
    ? `<ul class="bullets">${highlights.map((h) => `<li>${escapeHtml(h)}</li>`).join("")}</ul>`
    : "";

  const eduHtml = education.map((e) => `
    <div class="entry">
      <div class="entry-head"><div class="entry-title">${escapeHtml(e.title)}</div>${e.meta ? `<div class="entry-meta">${escapeHtml(e.meta)}</div>` : ""}</div>
      ${(e.bullets || []).length ? `<ul class="bullets">${e.bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>` : ""}
    </div>`).join("");

  const skillsHtml = skills.map((cat) => `
    <div class="skillrow">
      <span class="skillrow-title">${escapeHtml(cat.title)}:</span>
      <span class="skillrow-items"> ${escapeHtml(commaLine(cat.items))}</span>
    </div>`).join("");

  const researchHtml = researchCards.map((r) => {
    const buls = getCardCvBullets(r);
    return `
    <div class="entry">
      <div class="entry-head"><div class="entry-title">${escapeHtml(r.title)}</div><div class="entry-meta">${escapeHtml(formatMonthYear(r.date))}</div></div>
      ${buls.length ? `<ul class="bullets">${buls.map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>` : (r.blurb ? `<div class="desc">${escapeHtml(r.blurb)}</div>` : "")}
    </div>`;
  }).join("");

  const labsHtml = labCards.map((l) => {
    const buls = labToCvBullets(l);
    const tools = commaLine(l.tools);
    return `
    <div class="entry">
      <div class="entry-head"><div class="entry-title">${escapeHtml(l.title)}</div><div class="entry-meta">${escapeHtml(formatMonthYear(l.date))}</div></div>
      ${buls.length ? `<ul class="bullets">${buls.map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>` : (l.blurb ? `<div class="desc">${escapeHtml(l.blurb)}</div>` : "")}
      ${tools ? `<div class="tools-commas"><span class="tools-label">Tools:</span> ${escapeHtml(tools)}</div>` : ""}
    </div>`;
  }).join("");

  const projectsHtml = projectCards.map((p) => {
    const buls = getCardCvBullets(p);
    const tools = commaLine(p.tools);
    return `
    <div class="entry">
      <div class="entry-head"><div class="entry-title">${escapeHtml(p.title)}</div><div class="entry-meta">${escapeHtml(formatMonthYear(p.date))}</div></div>
      ${buls.length ? `<ul class="bullets">${buls.slice(0, 2).map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>` : (p.blurb ? `<div class="desc">${escapeHtml(p.blurb)}</div>` : "")}
      ${tools ? `<div class="tools-commas"><span class="tools-label">Tools:</span> ${escapeHtml(tools)}</div>` : ""}
    </div>`;
  }).join("");

  const expHtml = experience.map((exp) => `
    <div class="entry">
      <div class="entry-head"><div class="entry-title">${escapeHtml(exp.title)}</div>${exp.meta ? `<div class="entry-meta">${escapeHtml(exp.meta)}</div>` : ""}</div>
      ${(exp.bullets || []).length ? `<ul class="bullets">${exp.bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>` : ""}
    </div>`).join("");

  const nameSlug = person.name.replace(/\s+/g, "_");
  const docTitle = `${nameSlug}_CV`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>${escapeHtml(docTitle)}</title>
<style>
  :root { --text:#111827; --muted:#6b7280; --accent:#2563eb; --line:#e5e7eb; }
  * { box-sizing: border-box; }
  html, body { margin:0; padding:0; }
  @page { size: letter portrait; margin: 0.65in; }
  body { font-family: Arial, Helvetica, "Segoe UI", sans-serif; color: var(--text); font-size: 11.2px; line-height: 1.35; }
  a { color: var(--text); text-decoration: underline; }
  .page { width: 100%; max-width: 8.5in; margin: 0 auto; }
  .hdr { display:flex; justify-content:space-between; gap:18px; align-items:flex-start; padding-bottom: 10px; border-bottom: 2px solid #111; margin-bottom: 14px; }
  .hdr-left .name { font-size: 22px; font-weight: 900; letter-spacing: -0.3px; line-height: 1.1; }
  .hdr-left .headline { margin-top: 4px; color: var(--muted); font-size: 12px; font-weight: 600; }
  .hdr-right { text-align:right; color: var(--muted); font-size: 10.6px; line-height: 1.45; }
  .section { margin: 12px 0 14px 0; }
  .stitle { font-size: 10.8px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.08em; color: var(--accent); border-bottom: 1px solid var(--line); padding-bottom: 4px; margin-bottom: 8px; }
  .entry { margin: 0 0 10px 0; break-inside: avoid; page-break-inside: avoid; }
  .entry-head { display:flex; justify-content:space-between; align-items:baseline; gap:12px; }
  .entry-title { font-weight: 800; font-size: 12px; }
  .entry-meta { color: var(--muted); font-style: italic; font-size: 10.5px; text-align:right; }
  .desc { margin-top: 3px; color:#374151; }
  .bullets { margin: 4px 0 0 16px; padding: 0; color:#374151; }
  .bullets li { margin: 0 0 2px 0; }
  .skillrow { margin: 0 0 6px 0; }
  .skillrow-title { font-weight: 900; color: #111; }
  .skillrow-items { color: #374151; }
  .tools-commas { margin-top: 3px; color: var(--muted); font-size: 10.4px; }
  .tools-label { font-weight: 800; color: #4b5563; }
  .cv-footer { margin-top: 16px; padding-top: 10px; border-top: 1px solid var(--line); display:flex; justify-content:flex-end; gap:10px; color: var(--muted); font-size: 10px; }
  .qr { width: 72px; height: 72px; border: 1px solid var(--line); border-radius: 6px; padding: 4px; background: #fff; }
  .qr-label { text-align: right; line-height: 1.25; }
  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .page { max-width: none; width: 100%; }
    @page { size: letter portrait; margin: 0.65in; }
    * { transform: none !important; filter: none !important; }
    a { color: inherit; }
  }
</style>
</head>
<body>
  <div class="page">
    <div class="hdr">
      <div class="hdr-left">
        <div class="name">${escapeHtml(person.name)}</div>
        <div class="headline">${escapeHtml(person.headline)}</div>
      </div>
      <div class="hdr-right">${contactHtml}</div>
    </div>

    ${highlightsHtml ? `<div class="section"><div class="stitle">Selected Highlights</div>${highlightsHtml}</div>` : ""}

    <div class="section"><div class="stitle">Education</div>${eduHtml}</div>

    ${researchHtml ? `<div class="section"><div class="stitle">Research</div>${researchHtml}</div>` : ""}
    ${labsHtml ? `<div class="section"><div class="stitle">Technical Experience</div>${labsHtml}</div>` : ""}
    ${projectsHtml ? `<div class="section"><div class="stitle">Projects</div>${projectsHtml}</div>` : ""}
    ${expHtml ? `<div class="section"><div class="stitle">Teaching and Leadership</div>${expHtml}</div>` : ""}

    <div class="section"><div class="stitle">Skills</div>${skillsHtml}</div>

    <div class="cv-footer">
      <div class="qr-label">
        <div><strong>Portfolio</strong></div>
        <div>${escapeHtml(stripUrl(contact?.portfolio || ""))}</div>
      </div>
      ${contact?.portfolio ? `<img class="qr" alt="Portfolio QR code" src="https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(contact.portfolio)}" />` : ""}
    </div>
  </div>
<script>
  window.addEventListener("load", function () {
    var doPrint = function () { window.print(); };
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(doPrint).catch(doPrint);
    } else {
      doPrint();
    }
  });
</script>
</body>
</html>`;
}
