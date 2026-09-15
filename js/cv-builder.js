// cv-builder.js: comprehensive single-column CV, site-styled
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

function labToCvBullets(lab) {
  const cv = lab.descriptions?.cv;
  if (Array.isArray(cv) && cv.length) return cv;
  if (Array.isArray(lab.cvBullets) && lab.cvBullets.length) return lab.cvBullets;
  const out = [];
  if (Array.isArray(lab.modules)) {
    for (const m of lab.modules) {
      if (Array.isArray(m.bullets) && m.bullets.length) {
        out.push(...m.bullets.map((b) => `${m.title}: ${b}`));
      } else if (m.blurb) {
        out.push(`${m.title}: ${m.blurb}`);
      }
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

/* ---- Entry block ---- */
function renderEntry({ title, meta, bullets, descFallback, tools, url }) {
  const buls = Array.isArray(bullets) ? bullets : [];
  const titleInner = url
    ? `<a class="entry-title-link" href="${escapeHtml(url)}">${escapeHtml(title)}<span class="ext-mark" aria-hidden="true"> &#8599;</span></a>`
    : escapeHtml(title);
  return `
  <article class="entry">
    <div class="entry-head">
      <h3 class="entry-title">${titleInner}</h3>
      ${meta ? `<span class="entry-meta">${escapeHtml(meta)}</span>` : ""}
    </div>
    ${buls.length
      ? `<ul class="bullets">${buls.map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>`
      : (descFallback ? `<p class="desc">${escapeHtml(descFallback)}</p>` : "")}
    ${tools ? `<p class="tools-line"><span class="tools-label">Tools:</span> ${escapeHtml(tools)}</p>` : ""}
  </article>`;
}

/* ---- Main export ---- */
export function buildCvHtml(/* config */) {
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
    contact?.email
      ? `<p class="contact-line"><a href="mailto:${escapeHtml(contact.email)}">${escapeHtml(contact.email)}</a></p>`
      : "",
    contact?.linkedin
      ? `<p class="contact-line"><a href="${escapeHtml(contact.linkedin)}">${escapeHtml(stripUrl(contact.linkedin))}</a></p>`
      : "",
    contact?.github
      ? `<p class="contact-line"><a href="${escapeHtml(contact.github)}">${escapeHtml(stripUrl(contact.github))}</a></p>`
      : "",
    contact?.portfolio
      ? `<p class="contact-line"><a href="${escapeHtml(contact.portfolio)}">${escapeHtml(stripUrl(contact.portfolio))}</a></p>`
      : "",
  ].join("");

  const highlightsHtml = highlights.length
    ? `<ul class="bullets highlights">${highlights.map((h) => `<li>${escapeHtml(h)}</li>`).join("")}</ul>`
    : "";

  const eduHtml = education.map((e) => renderEntry({
    title: e.title,
    meta: e.meta,
    bullets: e.bullets,
  })).join("");

  const skillsHtml = skills.map((cat) => `
    <p class="skill-row">
      <span class="skill-cat">${escapeHtml(cat.title)}:</span>
      <span class="skill-items">${escapeHtml(commaLine(cat.items))}</span>
    </p>`).join("");

  const researchHtml = researchCards.map((r) => renderEntry({
    title: r.title,
    meta: formatMonthYear(r.date),
    bullets: getCardCvBullets(r),
    descFallback: r.blurb,
    url: cardDeepLink(r),
  })).join("");

  const labsHtml = labCards.map((l) => renderEntry({
    title: l.title,
    meta: formatMonthYear(l.date),
    bullets: labToCvBullets(l),
    descFallback: l.blurb,
    tools: commaLine(l.tools),
    url: cardDeepLink(l),
  })).join("");

  const projectsHtml = projectCards.map((p) => {
    const buls = getCardCvBullets(p);
    return renderEntry({
      title: p.title,
      meta: formatMonthYear(p.date),
      bullets: buls.slice(0, 3),
      descFallback: p.blurb,
      tools: commaLine(p.tools),
      url: cardDeepLink(p),
    });
  }).join("");

  const expHtml = experience.map((exp) => renderEntry({
    title: exp.title,
    meta: exp.meta,
    bullets: exp.bullets,
  })).join("");

  const nameSlug = person.name.replace(/\s+/g, "_");
  const docTitle = `${nameSlug}_CV`;

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
  @page { size: letter portrait; margin: 0.6in 0.65in; }

  body {
    font-family: 'Inter', Arial, sans-serif;
    color: var(--ink);
    font-size: 10.8px;
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
    padding-bottom: 12px;
    margin-bottom: 14px;
    border-bottom: 1.5px solid var(--ink);
  }
  .hdr-left { min-width: 0; flex: 1; }
  .hdr-left h1 {
    font-family: 'Fraunces', Georgia, serif;
    font-size: 30px;
    font-weight: 500;
    font-style: italic;
    font-variation-settings: 'opsz' 144;
    letter-spacing: -0.02em;
    line-height: 1.0;
    color: var(--ink);
  }
  .headline {
    margin-top: 6px;
    font-family: 'Fraunces', Georgia, serif;
    font-style: italic;
    font-weight: 400;
    font-size: 11px;
    color: var(--ink-soft);
    max-width: 4.8in;
    line-height: 1.45;
  }
  .hdr-right {
    text-align: right;
    font-family: 'JetBrains Mono', 'Consolas', monospace;
    font-size: 9.8px;
    line-height: 1.7;
    color: var(--ink-soft);
    flex-shrink: 0;
  }
  .contact-line { margin: 0; }
  .contact-line a { color: var(--ink-soft); }

  /* Sections */
  .section { margin-bottom: 14px; }
  .stitle {
    font-family: 'JetBrains Mono', 'Consolas', monospace;
    font-size: 10px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: var(--accent);
    border-bottom: 1px solid var(--rule);
    padding-bottom: 4px;
    margin-bottom: 8px;
  }

  /* Highlights at top */
  .highlights { margin-left: 16px; color: var(--ink-soft); }
  .highlights li { margin-bottom: 2px; }

  /* Skills */
  .skill-row { margin-bottom: 5px; line-height: 1.45; }
  .skill-cat { font-weight: 600; color: var(--ink); }
  .skill-items { color: var(--ink-soft); }

  /* Entries */
  .entry { margin-bottom: 10px; break-inside: avoid; page-break-inside: avoid; }
  .entry-head {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 12px;
    margin-bottom: 1px;
  }
  .entry-title {
    font-family: 'Inter', Arial, sans-serif;
    font-weight: 600;
    font-size: 11.8px;
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
  .entry-meta {
    font-family: 'JetBrains Mono', 'Consolas', monospace;
    font-size: 9.8px;
    font-style: italic;
    color: var(--ink-mute);
    flex-shrink: 0;
    white-space: nowrap;
    text-align: right;
  }
  .desc { margin-top: 3px; color: var(--ink-soft); }
  .bullets { margin: 4px 0 0 16px; padding: 0; color: var(--ink-soft); }
  .bullets li { margin-bottom: 2px; }
  .tools-line {
    margin-top: 3px;
    font-family: 'JetBrains Mono', 'Consolas', monospace;
    font-size: 9.8px;
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
    font-size: 9.8px;
    line-height: 1.4;
    color: var(--ink-soft);
  }
  .footer-text strong { font-weight: 500; color: var(--accent); }
  .qr {
    width: 70px;
    height: 70px;
    border: 1px solid var(--rule);
    padding: 3px;
    background: #fff;
  }

  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .page { max-width: none; width: 100%; }
    @page { size: letter portrait; margin: 0.6in 0.65in; }
    * { transform: none !important; filter: none !important; }
    a { color: inherit; }
  }
</style>
</head>
<body>
  <div class="page">
    <header class="hdr">
      <div class="hdr-left">
        <h1>${escapeHtml(person.name)}</h1>
        <p class="headline">${escapeHtml(person.headline)}</p>
      </div>
      <address class="hdr-right">${contactHtml}</address>
    </header>

    ${highlightsHtml ? `<section class="section"><h2 class="stitle">Selected Highlights</h2>${highlightsHtml}</section>` : ""}

    <section class="section"><h2 class="stitle">Education</h2>${eduHtml}</section>

    ${researchHtml ? `<section class="section"><h2 class="stitle">Research</h2>${researchHtml}</section>` : ""}
    ${labsHtml ? `<section class="section"><h2 class="stitle">Technical Experience</h2>${labsHtml}</section>` : ""}
    ${projectsHtml ? `<section class="section"><h2 class="stitle">Projects</h2>${projectsHtml}</section>` : ""}
    ${expHtml ? `<section class="section"><h2 class="stitle">Teaching and Leadership</h2>${expHtml}</section>` : ""}

    <section class="section"><h2 class="stitle">Skills</h2>${skillsHtml}</section>

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
