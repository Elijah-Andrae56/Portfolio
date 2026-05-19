// resume-builder.js — single-column ATS-optimized resume
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

/* ---- Domain / focus config ---- */
function domainsFromFocus(focus) {
  return focus === "process" ? ["nanofab", "ds", "cs"] : ["ds", "cs", "marketing"];
}

function domainMatches(item, domains) {
  const tags = item?.domains || item?.categories;
  if (!tags || tags.length === 0) return true;
  return tags.some((t) => domains.includes(t));
}

/* ---- Bullet getters (null = skip item entirely) ---- */
function getCardBullets(card, focus) {
  const res = card.descriptions?.resume;
  if (res && focus in res) {
    if (res[focus] === null) return null;
    if (Array.isArray(res[focus]) && res[focus].length) return res[focus];
  }
  const cv = card.descriptions?.cv;
  if (Array.isArray(cv) && cv.length) return cv;
  if (Array.isArray(card.cvBullets) && card.cvBullets.length) return card.cvBullets;
  return Array.isArray(card.bullets) ? card.bullets : [];
}

function getLabBullets(lab, focus) {
  const res = lab.descriptions?.resume;
  if (res && focus in res) {
    if (res[focus] === null) return null;
    if (Array.isArray(res[focus]) && res[focus].length) return res[focus];
  }
  const cv = lab.descriptions?.cv;
  if (Array.isArray(cv) && cv.length) return cv;
  if (Array.isArray(lab.cvBullets) && lab.cvBullets.length) return lab.cvBullets;
  // synthesize from modules
  const out = [];
  if (Array.isArray(lab.modules)) {
    for (const m of lab.modules) {
      if (Array.isArray(m.bullets) && m.bullets.length) out.push(...m.bullets);
      else if (m.blurb) out.push(m.blurb);
    }
  }
  return out;
}

function getExpBullets(exp, focus) {
  const res = exp.resumeBullets;
  if (res && focus in res) {
    if (res[focus] === null) return null;
    if (Array.isArray(res[focus]) && res[focus].length) return res[focus];
  }
  return Array.isArray(exp.bullets) ? exp.bullets : [];
}

/* ---- Section HTML builders ---- */
function renderEntry({ title, sub, date, bullets, tools, maxBullets = 999 }) {
  const buls = limitBullets(bullets, maxBullets);
  return `
  <div class="entry">
    <div class="entry-hd">
      <span class="entry-title">${escapeHtml(title)}</span>
      ${date ? `<span class="entry-date">${escapeHtml(date)}</span>` : ""}
    </div>
    ${sub ? `<div class="entry-sub">${escapeHtml(sub)}</div>` : ""}
    ${buls.length ? `<ul class="bullets">${buls.map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>` : ""}
    ${tools ? `<div class="tools-line"><span class="tools-label">Tools:</span> ${escapeHtml(tools)}</div>` : ""}
  </div>`;
}

/* ---- Main export ---- */
export function buildResumeHtml(config) {
  const focus = config?.focus || "ds";
  const person = SITE.person;
  const domains = domainsFromFocus(focus);
  const isProcess = focus === "process";

  const summary = person.summaries?.[focus] || person.summary || "";

  // --- Filter datasets ---
  const skills = (SITE.skills || []).filter((s) => domainMatches(s, domains));
  const education = SITE.education || [];
  const experience = (SITE.experience || []).filter((x) => domainMatches(x, domains));

  const researchCards = (SITE.cards || [])
    .filter((c) => c.kind === "research" && domainMatches(c, domains))
    .sort((a, b) => parseDate(b.date) - parseDate(a.date));

  const labCards = (SITE.cards || [])
    .filter((c) => c.kind === "lab" && domainMatches(c, domains))
    .sort((a, b) => parseDate(b.date) - parseDate(a.date));

  const projectCards = (SITE.cards || [])
    .filter((c) => c.kind === "project" && domainMatches(c, domains))
    .sort((a, b) => parseDate(b.date) - parseDate(a.date));

  // --- Skills section (ATS: plain text rows, no pills) ---
  const skillsHtml = skills.map((cat) => `
    <div class="skill-row">
      <span class="skill-cat">${escapeHtml(cat.title)}:</span>
      <span class="skill-items">${escapeHtml(commaLine(cat.items))}</span>
    </div>`).join("");

  // --- Education ---
  const eduHtml = education.map((e) => renderEntry({
    title: e.title,
    sub: e.meta,
    bullets: e.bullets,
    maxBullets: 4,
  })).join("");

  // --- Experience ---
  const expHtml = experience.map((exp) => {
    const buls = getExpBullets(exp, focus);
    if (buls === null) return "";
    return renderEntry({ title: exp.title, sub: exp.meta, bullets: buls, maxBullets: 3 });
  }).join("");

  // --- Research ---
  const researchHtml = researchCards.map((r) => {
    const buls = getCardBullets(r, focus);
    if (buls === null) return "";
    return renderEntry({
      title: r.title,
      sub: formatMonthYear(r.date),
      bullets: buls,
      maxBullets: isProcess ? 4 : 3,
      tools: isProcess ? commaLine(r.tools) : null,
    });
  }).join("");

  // --- Labs ---
  const labsHtml = labCards.map((l) => {
    const buls = getLabBullets(l, focus);
    if (buls === null) return "";
    return renderEntry({
      title: l.title,
      sub: formatMonthYear(l.date),
      bullets: buls,
      maxBullets: isProcess ? 4 : 2,
      tools: isProcess ? commaLine(l.tools) : null,
    });
  }).join("");

  // --- Projects ---
  const projectsHtml = projectCards.map((p) => {
    const buls = getCardBullets(p, focus);
    if (buls === null) return "";
    return renderEntry({
      title: p.title,
      sub: formatMonthYear(p.date),
      bullets: buls,
      maxBullets: 2,
      tools: commaLine(p.tools),
    });
  }).join("");

  // --- Contact line (real <a href> anchors so ATS parsers see live links) ---
  const { contact } = person;
  const contactParts = [
    contact?.email
      ? `<a href="mailto:${escapeHtml(contact.email)}">${escapeHtml(contact.email)}</a>`
      : null,
    contact?.linkedin
      ? `<a href="${escapeHtml(contact.linkedin)}">${escapeHtml(stripUrl(contact.linkedin))}</a>`
      : null,
    contact?.github
      ? `<a href="${escapeHtml(contact.github)}">${escapeHtml(stripUrl(contact.github))}</a>`
      : null,
    contact?.portfolio
      ? `<a href="${escapeHtml(contact.portfolio)}">${escapeHtml(stripUrl(contact.portfolio))}</a>`
      : null,
  ].filter(Boolean);
  const contactHtml = contactParts.join('<span class="sep"> | </span>');

  // --- Section order differs by focus ---
  // Process: Summary > Skills > Research > Lab Experience > Projects > Experience > Education
  // DS:      Summary > Skills > Projects > Research > Experience > Education
  const sectionsProcess = `
    ${summary ? `<div class="section"><div class="stitle">Professional Summary</div><p class="summary-text">${escapeHtml(summary)}</p></div>` : ""}
    ${skillsHtml ? `<div class="section"><div class="stitle">Technical Skills</div>${skillsHtml}</div>` : ""}
    ${researchHtml ? `<div class="section"><div class="stitle">Independent Research</div>${researchHtml}</div>` : ""}
    ${labsHtml ? `<div class="section"><div class="stitle">Laboratory and Process Experience</div>${labsHtml}</div>` : ""}
    ${projectsHtml ? `<div class="section"><div class="stitle">Projects</div>${projectsHtml}</div>` : ""}
    ${expHtml ? `<div class="section"><div class="stitle">Work Experience</div>${expHtml}</div>` : ""}
    <div class="section"><div class="stitle">Education</div>${eduHtml}</div>
  `;

  const sectionsDs = `
    ${summary ? `<div class="section"><div class="stitle">Professional Summary</div><p class="summary-text">${escapeHtml(summary)}</p></div>` : ""}
    ${skillsHtml ? `<div class="section"><div class="stitle">Technical Skills</div>${skillsHtml}</div>` : ""}
    ${projectsHtml ? `<div class="section"><div class="stitle">Projects</div>${projectsHtml}</div>` : ""}
    ${researchHtml ? `<div class="section"><div class="stitle">Research</div>${researchHtml}</div>` : ""}
    ${expHtml ? `<div class="section"><div class="stitle">Work Experience</div>${expHtml}</div>` : ""}
    <div class="section"><div class="stitle">Education</div>${eduHtml}</div>
  `;

  const bodySections = isProcess ? sectionsProcess : sectionsDs;

  // Filename hint: Chrome uses <title> as the suggested save-as name
  const nameSlug = person.name.replace(/\s+/g, "_");
  const docTitle = focus === "process"
    ? `${nameSlug}_Process_Resume`
    : `${nameSlug}_Data_Science_Resume`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>${escapeHtml(docTitle)}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { margin: 0; padding: 0; }
  @page { size: letter portrait; margin: 0.6in 0.65in; }
  body {
    font-family: Arial, Helvetica, sans-serif;
    color: #111827;
    font-size: 10.6px;
    line-height: 1.42;
  }
  a { color: #111827; text-decoration: none; }
  .page { width: 100%; max-width: 8.5in; margin: 0 auto; }

  /* Header */
  .hdr { text-align: center; border-bottom: 1.5px solid #111827; padding-bottom: 8px; margin-bottom: 11px; }
  .name { font-size: 21px; font-weight: 700; letter-spacing: 0.2px; line-height: 1.1; }
  .contact-line { margin-top: 4px; font-size: 10px; color: #374151; }
  .contact-line .sep { color: #9ca3af; }

  /* Sections */
  .section { margin-bottom: 10px; }
  .stitle {
    font-size: 10.4px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: #2563eb;
    border-bottom: 1px solid #e5e7eb;
    padding-bottom: 2px;
    margin-bottom: 6px;
  }

  /* Summary */
  .summary-text { color: #1f2937; line-height: 1.45; }

  /* Skills */
  .skill-row { margin-bottom: 3px; }
  .skill-cat { font-weight: 700; color: #111827; }
  .skill-items { color: #374151; }

  /* Entries */
  .entry { margin-bottom: 8px; break-inside: avoid; page-break-inside: avoid; }
  .entry-hd { display: flex; justify-content: space-between; align-items: baseline; gap: 8px; }
  .entry-title { font-weight: 700; font-size: 10.8px; }
  .entry-date { color: #6b7280; font-size: 10px; flex-shrink: 0; font-style: italic; }
  .entry-sub { color: #374151; font-size: 10px; margin-top: 1px; font-style: italic; }
  .bullets { margin: 3px 0 0 14px; padding: 0; color: #1f2937; }
  .bullets li { margin-bottom: 1.5px; }
  .tools-line { margin-top: 2px; color: #6b7280; font-size: 10px; }
  .tools-label { font-weight: 700; color: #4b5563; }

  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .page { max-width: none; width: 100%; }
    @page { size: letter portrait; margin: 0.6in 0.65in; }
    /* Prevent any element from being clipped or transformed during print */
    * { transform: none !important; filter: none !important; }
    a { color: inherit; text-decoration: none; }
  }
</style>
</head>
<body>
  <div class="page">
    <div class="hdr">
      <div class="name">${escapeHtml(person.name)}</div>
      <div class="contact-line">${contactHtml}</div>
    </div>
    ${bodySections}
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
