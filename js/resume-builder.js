// resume-builder.js: single-column ATS-optimized resume, site-styled
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
function slugify(s) {
  return String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
function cardDeepLink(card) {
  const base = SITE.person?.contact?.portfolio;
  if (!base) return "";
  const slug = card.slug || slugify(card.title);
  if (!slug) return "";
  return base.replace(/\/+$/, "") + "/#" + slug;
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
  // synthesize from modules if nothing else exists
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

/* ---- Section HTML builders (semantic: h3 for entry title, ul/li for bullets) ---- */
function renderEntry({ title, sub, date, bullets, tools, url, maxBullets = 999 }) {
  const buls = limitBullets(bullets, maxBullets);
  const titleInner = url
    ? `<a class="entry-title-link" href="${escapeHtml(url)}">${escapeHtml(title)}<span class="ext-mark" aria-hidden="true"> &#8599;</span></a>`
    : escapeHtml(title);
  return `
  <article class="entry">
    <div class="entry-hd">
      <h3 class="entry-title">${titleInner}</h3>
      ${date ? `<span class="entry-date">${escapeHtml(date)}</span>` : ""}
    </div>
    ${sub ? `<p class="entry-sub">${escapeHtml(sub)}</p>` : ""}
    ${buls.length ? `<ul class="bullets">${buls.map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>` : ""}
    ${tools ? `<p class="tools-line"><span class="tools-label">Tools:</span> ${escapeHtml(tools)}</p>` : ""}
  </article>`;
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

  // Bullet caps (two pages allowed; cap per-entry but allow more entries)
  const CAP_EXP = 4;
  const CAP_RESEARCH = isProcess ? 5 : 4;
  const CAP_LABS = isProcess ? 5 : 3;
  const CAP_PROJECTS = isProcess ? 3 : 3;
  const CAP_EDU = 4;

  // --- Skills (ATS-clean: plain text rows) ---
  const skillsHtml = skills.map((cat) => `
    <p class="skill-row">
      <span class="skill-cat">${escapeHtml(cat.title)}:</span>
      <span class="skill-items">${escapeHtml(commaLine(cat.items))}</span>
    </p>`).join("");

  // --- Education ---
  const eduHtml = education.map((e) => renderEntry({
    title: e.title,
    sub: e.meta,
    bullets: e.bullets,
    maxBullets: CAP_EDU,
  })).join("");

  // --- Experience ---
  const expHtml = experience.map((exp) => {
    const buls = getExpBullets(exp, focus);
    if (buls === null) return "";
    return renderEntry({ title: exp.title, sub: exp.meta, bullets: buls, maxBullets: CAP_EXP });
  }).join("");

  // --- Research ---
  const researchHtml = researchCards.map((r) => {
    const buls = getCardBullets(r, focus);
    if (buls === null) return "";
    return renderEntry({
      title: r.title,
      sub: formatMonthYear(r.date),
      bullets: buls,
      maxBullets: CAP_RESEARCH,
      tools: isProcess ? commaLine(r.tools) : null,
      url: cardDeepLink(r),
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
      maxBullets: CAP_LABS,
      tools: isProcess ? commaLine(l.tools) : null,
      url: cardDeepLink(l),
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
      maxBullets: CAP_PROJECTS,
      tools: commaLine(p.tools),
      url: cardDeepLink(p),
    });
  }).join("");

  // --- Contact line (real anchors so ATS parsers see live links) ---
  const { contact } = person;
  const contactItems = [
    contact?.email ? `<a href="mailto:${escapeHtml(contact.email)}">${escapeHtml(contact.email)}</a>` : null,
    contact?.linkedin ? `<a href="${escapeHtml(contact.linkedin)}">${escapeHtml(stripUrl(contact.linkedin))}</a>` : null,
    contact?.github ? `<a href="${escapeHtml(contact.github)}">${escapeHtml(stripUrl(contact.github))}</a>` : null,
    contact?.portfolio ? `<a href="${escapeHtml(contact.portfolio)}">${escapeHtml(stripUrl(contact.portfolio))}</a>` : null,
  ].filter(Boolean);
  const contactHtml = contactItems.map((c) => `<span class="contact-item">${c}</span>`).join("");

  // --- Section order differs by focus ---
  // Process: Summary > Skills > Research > Lab Experience > Projects > Experience > Education
  // DS:      Summary > Skills > Projects > Research > Experience > Education
  const sectionsProcess = `
    ${summary ? `<section class="section"><h2 class="stitle">Professional Summary</h2><p class="summary-text">${escapeHtml(summary)}</p></section>` : ""}
    ${skillsHtml ? `<section class="section"><h2 class="stitle">Technical Skills</h2>${skillsHtml}</section>` : ""}
    ${researchHtml ? `<section class="section"><h2 class="stitle">Independent Research</h2>${researchHtml}</section>` : ""}
    ${labsHtml ? `<section class="section"><h2 class="stitle">Laboratory and Process Experience</h2>${labsHtml}</section>` : ""}
    ${projectsHtml ? `<section class="section"><h2 class="stitle">Projects</h2>${projectsHtml}</section>` : ""}
    ${expHtml ? `<section class="section"><h2 class="stitle">Work Experience</h2>${expHtml}</section>` : ""}
    <section class="section"><h2 class="stitle">Education</h2>${eduHtml}</section>
  `;

  const sectionsDs = `
    ${summary ? `<section class="section"><h2 class="stitle">Professional Summary</h2><p class="summary-text">${escapeHtml(summary)}</p></section>` : ""}
    ${skillsHtml ? `<section class="section"><h2 class="stitle">Technical Skills</h2>${skillsHtml}</section>` : ""}
    ${projectsHtml ? `<section class="section"><h2 class="stitle">Projects</h2>${projectsHtml}</section>` : ""}
    ${researchHtml ? `<section class="section"><h2 class="stitle">Research</h2>${researchHtml}</section>` : ""}
    ${expHtml ? `<section class="section"><h2 class="stitle">Work Experience</h2>${expHtml}</section>` : ""}
    <section class="section"><h2 class="stitle">Education</h2>${eduHtml}</section>
  `;

  const bodySections = isProcess ? sectionsProcess : sectionsDs;

  // Filename hint: Chrome uses <title> as the suggested save-as name
  const nameSlug = person.name.replace(/\s+/g, "_");
  const docTitle = focus === "process"
    ? `${nameSlug}_Process_Resume`
    : `${nameSlug}_Data_Science_Resume`;

  // QR code (portfolio link). Falls back gracefully if portfolio is missing.
  const qrHtml = contact?.portfolio
    ? `<div class="doc-footer">
         <div class="footer-text">
           <p class="footer-line"><strong>Portfolio</strong></p>
           <p class="footer-line">${escapeHtml(stripUrl(contact.portfolio))}</p>
         </div>
         <img class="qr" alt="Portfolio QR code" src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(contact.portfolio)}" />
       </div>`
    : "";

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>${escapeHtml(docTitle)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  :root {
    --ink:       #15171C;
    --ink-soft:  #4B4D55;
    --ink-mute:  #7C7A72;
    --rule:      #D8D3C5;
    --accent:    #7A2E2A;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { margin: 0; padding: 0; background: #fff; }
  @page { size: letter portrait; margin: 0.55in 0.65in; }

  body {
    font-family: 'Inter', Arial, sans-serif;
    color: var(--ink);
    font-size: 10.5px;
    line-height: 1.45;
    -webkit-font-smoothing: antialiased;
  }
  a { color: var(--ink); text-decoration: none; }

  .page { width: 100%; max-width: 8.5in; margin: 0 auto; }

  /* Header */
  .hdr {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 24px;
    padding-bottom: 11px;
    margin-bottom: 14px;
    border-bottom: 1.5px solid var(--ink);
  }
  .hdr-name { min-width: 0; }
  .hdr-name h1 {
    font-family: 'Fraunces', Georgia, serif;
    font-size: 30px;
    font-weight: 500;
    font-style: italic;
    font-variation-settings: 'opsz' 144;
    letter-spacing: -0.02em;
    line-height: 1.0;
    color: var(--ink);
  }
  .tagline {
    margin-top: 6px;
    font-family: 'Fraunces', Georgia, serif;
    font-style: italic;
    font-weight: 400;
    font-size: 10.5px;
    color: var(--ink-soft);
    max-width: 4.8in;
    line-height: 1.4;
  }
  .hdr-contact {
    text-align: right;
    font-family: 'JetBrains Mono', 'Consolas', monospace;
    font-size: 9.5px;
    line-height: 1.7;
    color: var(--ink-soft);
    flex-shrink: 0;
  }
  .contact-item { display: block; }
  .contact-item a { color: var(--ink-soft); }

  /* Sections */
  .section { margin-bottom: 11px; }
  .stitle {
    font-family: 'JetBrains Mono', 'Consolas', monospace;
    font-size: 9.5px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    color: var(--accent);
    border-bottom: 1px solid var(--rule);
    padding-bottom: 3px;
    margin-bottom: 7px;
  }

  /* Summary */
  .summary-text { color: var(--ink-soft); line-height: 1.55; }

  /* Skills */
  .skill-row { margin-bottom: 4px; line-height: 1.45; }
  .skill-cat { font-weight: 600; color: var(--ink); }
  .skill-items { color: var(--ink-soft); }

  /* Entries */
  .entry { margin-bottom: 9px; break-inside: avoid; page-break-inside: avoid; }
  .entry-hd {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 12px;
    margin-bottom: 1px;
  }
  .entry-title {
    font-family: 'Inter', Arial, sans-serif;
    font-weight: 600;
    font-size: 11.4px;
    color: var(--ink);
    line-height: 1.2;
  }
  .entry-title-link {
    color: inherit;
    text-decoration: none;
    border-bottom: 1px dotted var(--ink-mute);
  }
  .entry-title-link:hover { color: var(--accent); border-bottom-color: var(--accent); }
  .ext-mark {
    font-family: 'JetBrains Mono', 'Consolas', monospace;
    font-size: 0.78em;
    color: var(--accent);
    vertical-align: super;
    margin-left: 1px;
    border-bottom: none;
  }
  .entry-date {
    font-family: 'JetBrains Mono', 'Consolas', monospace;
    font-size: 9.5px;
    font-style: italic;
    color: var(--ink-mute);
    flex-shrink: 0;
    white-space: nowrap;
  }
  .entry-sub {
    font-style: italic;
    font-size: 10px;
    color: var(--ink-mute);
    margin-bottom: 2px;
  }
  .bullets {
    margin: 3px 0 0 16px;
    padding: 0;
    color: var(--ink-soft);
  }
  .bullets li { margin-bottom: 2px; }
  .tools-line {
    margin-top: 3px;
    font-family: 'JetBrains Mono', 'Consolas', monospace;
    font-size: 9.5px;
    color: var(--ink-mute);
  }
  .tools-label { font-weight: 500; color: var(--ink-soft); }

  /* QR footer */
  .doc-footer {
    margin-top: 18px;
    padding-top: 10px;
    border-top: 1px solid var(--rule);
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 14px;
    break-inside: avoid;
    page-break-inside: avoid;
  }
  .footer-text {
    text-align: right;
    font-family: 'JetBrains Mono', 'Consolas', monospace;
    font-size: 9.5px;
    line-height: 1.4;
    color: var(--ink-soft);
  }
  .footer-text strong { font-weight: 500; color: var(--accent); }
  .qr {
    width: 62px;
    height: 62px;
    border: 1px solid var(--rule);
    padding: 3px;
    background: #fff;
  }

  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .page { max-width: none; width: 100%; }
    @page { size: letter portrait; margin: 0.55in 0.65in; }
    * { transform: none !important; filter: none !important; }
    a { color: inherit; }
  }
</style>
</head>
<body>
  <div class="page">
    <header class="hdr">
      <div class="hdr-name">
        <h1>${escapeHtml(person.name)}</h1>
        <p class="tagline">${escapeHtml(person.headline)}</p>
      </div>
      <address class="hdr-contact">${contactHtml}</address>
    </header>

    ${bodySections}

    ${qrHtml}
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
