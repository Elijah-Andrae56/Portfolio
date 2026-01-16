// app.js
import { SITE, CATEGORY_LABELS } from "./data.js";

/** -------------------------
 * Small DOM helpers
 * -------------------------- */
const qs = (sel, root = document) => root.querySelector(sel);

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);

  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") node.className = v;
    else if (k === "text") node.textContent = v;
    else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v);
  }

  for (const c of children) node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
  return node;
}

/** -------------------------
 * State
 * -------------------------- */
const state = {
  activeCategory: "all",
  searchQuery: "",
  sortMode: "relevance",

  pdfConfig: {
    domain: "ds",         // "nanotech" | "ds"
    audience: "industry", // "academic" | "industry"
    doctype: "resume",    // "resume" | "cv"
  },
};

function normalize(text) {
  return String(text || "").toLowerCase();
}

function tokenize(query) {
  return normalize(query)
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean);
}

/**
 * Relevance rules:
 * - Score matches by where they occur (title > tags/tools > blurb > details)
 * - If no search query, relevance falls back to date_desc (stable).
 */
function relevanceScore(project, query) {
  const tokens = tokenize(query);
  if (tokens.length === 0) return 0;

  const title = normalize(project.title);
  const blurb = normalize(project.blurb);
  const details = normalize(project.details);
  const tags = normalize((project.tags || []).join(" "));
  const tools = normalize((project.tools || []).join(" "));

  let score = 0;
  for (const tok of tokens) {
    if (title.includes(tok)) score += 50;
    if (tags.includes(tok)) score += 25;
    if (tools.includes(tok)) score += 22;
    if (blurb.includes(tok)) score += 12;
    if (details.includes(tok)) score += 6;
  }

  const q = normalize(query).trim();
  if (q && title.includes(q)) score += 40;

  return score;
}

function parseDate(value) {
  const t = Date.parse(value);
  return Number.isFinite(t) ? t : 0;
}

function compareProjects(a, b) {
  switch (state.sortMode) {
    case "relevance": {
      const sa = relevanceScore(a, state.searchQuery);
      const sb = relevanceScore(b, state.searchQuery);
      if (sb !== sa) return sb - sa;

      const dt = parseDate(b.date) - parseDate(a.date);
      if (dt !== 0) return dt;

      return a.title.localeCompare(b.title);
    }
    case "date_asc":
      return parseDate(a.date) - parseDate(b.date);
    case "date_desc":
      return parseDate(b.date) - parseDate(a.date);
    case "title_asc":
      return a.title.localeCompare(b.title);
    case "title_desc":
      return b.title.localeCompare(a.title);
    default:
      return 0;
  }
}

function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatMonthYear(isoDate) {
  if (!isoDate) return "";
  const d = new Date(isoDate);
  if (!Number.isFinite(d.getTime())) return "";
  return new Intl.DateTimeFormat(undefined, { year: "numeric", month: "short" }).format(d);
}

const DOMAIN_LABELS = {
  ds: "Data Science",
  marketing: "Marketing / Business",
  nanofab: "Nanofabrication",
  cs: "Computer Science",
};

/** -------------------------
 * PDF logic: domains + academic/industry + resume/cv
 * -------------------------- */

function getAllDomains() {
  return ["ds", "marketing", "nanofab", "cs"];
}

function domainsFromSlider(domainMode) {
  if (domainMode === "nanotech") return ["nanofab"];
  return ["ds", "cs", "marketing"];
}

function inferTrack(item, section) {
  if (item && typeof item.track === "string") return item.track;

  if (section === "research" || section === "education" || section === "coursework") return "academic";

  if (section === "experience") {
    const t = normalize(item?.title);
    if (t.includes("assistant") || t.includes("teaching") || t.includes("learning") || t.includes("marker") || t.includes("grader")) {
      return "academic";
    }
    return "industry";
  }

  if (section === "projects") {
    const cats = item?.categories || [];
    if (cats.includes("nanofab")) return "academic";
    return "industry";
  }

  return "industry";
}

function trackMatches(item, section, audience) {
  if (!audience || audience === "all") return true;
  const tr = inferTrack(item, section);
  if (tr === "both") return true;
  return tr === audience;
}

function domainMatches(item, domains) {
  const tags = item?.domains || item?.categories;
  if (!tags || tags.length === 0) return true;
  return tags.some((tag) => domains.includes(tag));
}

function limitBullets(bullets, maxCount) {
  const arr = Array.isArray(bullets) ? bullets : [];
  if (!Number.isFinite(maxCount) || maxCount <= 0) return arr;
  return arr.slice(0, maxCount);
}

/**
 * CV/Resume content shaping:
 * - CV wants bullets and scanable lines; avoid paragraphs.
 * - If no explicit bullets exist for projects, synthesize from the blurb.
 */
function synthProjectBullets(p, max = 3) {
  // If user later adds p.cvBullets or p.resumeBullets, prefer them automatically.
  const explicit =
    Array.isArray(p?.cvBullets) && p.cvBullets.length ? p.cvBullets :
    Array.isArray(p?.resumeBullets) && p.resumeBullets.length ? p.resumeBullets :
    null;

  if (explicit) return limitBullets(explicit, max);

  const blurb = String(p?.blurb || "").trim();
  if (!blurb) return [];

  // Split into clauses; keep it conservative.
  const parts = blurb
    .replace(/\s+/g, " ")
    .split(/(?:\.\s+|;\s+|,\s+(?=[A-Z]))/g)
    .map((s) => s.trim())
    .filter(Boolean);

  // Convert to action-ish bullets without inventing facts.
  const bullets = parts.map((s) => {
    // If already verb-led, keep. Otherwise, prefix with “Developed/Analyzed/Designed” would be fabrication.
    // Safer: keep original wording but remove leading “I”.
    return s.replace(/^I\s+/i, "").replace(/\.$/, "");
  });

  return bullets.slice(0, max);
}

function stripUrl(url) {
  return String(url || "").replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}

/** -------------------------
 * PDF templates
 * -------------------------- */

function buildResumeHtml(config) {
  const person = SITE.person;

  const isCV = config?.doctype === "cv";
  const domains = isCV ? getAllDomains() : domainsFromSlider(config?.domain);
  const audience = isCV ? "all" : (config?.audience || "industry");

  // CV shows everything; Resume is selective.
  const showCoursework = isCV ? true : (audience === "academic");
  const showResearch = isCV ? true : (audience === "academic");
  const showExperience = isCV ? true : (audience === "industry");
  const showProjects = true;

  const BULLETS_MAX_RESEARCH = isCV ? 999 : 3;
  const BULLETS_MAX_EXP = isCV ? 999 : 3;
  const BULLETS_MAX_EDU = isCV ? 999 : 3;
  const BULLETS_MAX_COURSE = isCV ? 999 : 10;

  const education = (SITE.education || []).filter((e) => domainMatches(e, domains));
  const coursework = (SITE.coursework || []).filter((c) => domainMatches(c, domains));
  const skills = (SITE.skills || []).filter((s) => domainMatches(s, domains));

  const research = (SITE.research || [])
    .filter((r) => domainMatches(r, domains))
    .filter((r) => trackMatches(r, "research", audience));

  const researchTitles = new Set(research.map((r) => r.title));

  const projects = (SITE.projects || [])
    .filter((p) => domainMatches(p, domains))
    .filter((p) => trackMatches(p, "projects", audience))
    .filter((p) => (isCV ? true : !researchTitles.has(p.title)))
    .sort((a, b) => parseDate(b.date) - parseDate(a.date));

  const experience = (SITE.experience || [])
    .filter((x) => domainMatches(x, domains))
    .filter((x) => trackMatches(x, "experience", audience));

  const cfgTitleParts = [];
  cfgTitleParts.push(isCV ? "CV" : "Resume");
  if (!isCV) cfgTitleParts.push(audience === "academic" ? "Academic" : "Industry");
  if (!isCV) cfgTitleParts.push(config?.domain === "nanotech" ? "Nanotech" : "Data Science");
  const cfgTitle = cfgTitleParts.join(" — ");

  const contactHtml = `
    ${person.contact?.email ? `<div>${escapeHtml(person.contact.email)}</div>` : ""}
    ${person.contact?.linkedin ? `<div><a href="${person.contact.linkedin}">${escapeHtml(stripUrl(person.contact.linkedin))}</a></div>` : ""}
    ${person.contact?.github ? `<div><a href="${person.contact.github}">${escapeHtml(stripUrl(person.contact.github))}</a></div>` : ""}
    ${person.contact?.portfolio ? `<div><a href="${person.contact.portfolio}">${escapeHtml(stripUrl(person.contact.portfolio))}</a></div>` : ""}
  `;

  // Shared “blocks”
  const eduHtml = education.map((e) => `
    <div class="entry">
      <div class="entry-head">
        <div class="entry-title">${escapeHtml(e.title)}</div>
        ${e.meta ? `<div class="entry-meta">${escapeHtml(e.meta)}</div>` : ""}
      </div>
      ${(e.bullets || []).length
        ? `<ul class="bullets">${limitBullets(e.bullets, BULLETS_MAX_EDU).map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>`
        : ""}
    </div>
  `).join("");

  const skillsHtml = skills.map((cat) => `
    <div class="skillblock">
      <div class="skillblock-title">${escapeHtml(cat.title)}</div>
      <div class="pillwrap">
        ${(cat.items || []).map((s) => `<span class="pill">${escapeHtml(s)}</span>`).join("")}
      </div>
    </div>
  `).join("");

  const courseHtml = coursework.map((c) => `
    <div class="entry">
      <div class="entry-title">${escapeHtml(c.title)}</div>
      ${(c.bullets || []).length
        ? `<ul class="bullets">${limitBullets(c.bullets, BULLETS_MAX_COURSE).map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>`
        : ""}
    </div>
  `).join("");

  const researchHtml = research.map((r) => `
    <div class="entry">
      <div class="entry-head">
        <div class="entry-title">${escapeHtml(r.title)}</div>
        ${r.meta ? `<div class="entry-meta">${escapeHtml(r.meta)}</div>` : ""}
      </div>
      ${(r.bullets || []).length
        ? `<ul class="bullets">${limitBullets(r.bullets, BULLETS_MAX_RESEARCH).map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>`
        : ""}
    </div>
  `).join("");

  const experienceHtml = experience.map((exp) => `
    <div class="entry">
      <div class="entry-head">
        <div class="entry-title">${escapeHtml(exp.title)}</div>
        ${exp.meta ? `<div class="entry-meta">${escapeHtml(exp.meta)}</div>` : ""}
      </div>
      ${(exp.bullets || []).length
        ? `<ul class="bullets">${limitBullets(exp.bullets, BULLETS_MAX_EXP).map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>`
        : ""}
    </div>
  `).join("");

  // For CV, projects should not be paragraph heavy.
  const projectsHtmlCv = projects.map((p) => {
    const bullets = synthProjectBullets(p, 3);
    return `
      <div class="entry">
        <div class="entry-head">
          <div class="entry-title">${escapeHtml(p.title)}</div>
          <div class="entry-meta">${escapeHtml(formatMonthYear(p.date))}</div>
        </div>
        ${p.tools?.length ? `
          <div class="toolsline">
            ${(p.tools || []).slice(0, 10).map((t) => `<span class="pill pill-soft">${escapeHtml(t)}</span>`).join("")}
          </div>` : ""}
        ${bullets.length ? `<ul class="bullets">${bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>` : ""}
      </div>
    `;
  }).join("");

  // For Resume, keep 1–2 line blurb.
  const projectsHtmlResume = projects.map((p) => `
    <div class="entry">
      <div class="entry-head">
        <div class="entry-title">${escapeHtml(p.title)}</div>
        <div class="entry-meta">${escapeHtml(formatMonthYear(p.date))}</div>
      </div>
      ${p.blurb ? `<div class="desc">${escapeHtml(p.blurb)}</div>` : ""}
      ${p.tools?.length ? `
        <div class="toolsline">
          ${(p.tools || []).slice(0, 7).map((t) => `<span class="pill pill-soft">${escapeHtml(t)}</span>`).join("")}
        </div>` : ""}
    </div>
  `).join("");

  // =========================
  // TEMPLATE: CV (single column)
  // =========================
  if (isCV) {
    return `
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>${escapeHtml(person.name)} — ${escapeHtml(cfgTitle)}</title>
<style>
  :root { --text:#111827; --muted:#6b7280; --accent:#2563eb; --line:#e5e7eb; }
  * { box-sizing: border-box; }
  html, body { margin:0; padding:0; }
  @page { size: letter portrait; margin: 0.65in; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
    color: var(--text);
    font-size: 11.2px;
    line-height: 1.35;
  }

    .cv-footer {
    margin-top: 16px;
    padding-top: 10px;
    border-top: 1px solid var(--line);
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 10px;
    color: var(--muted);
    font-size: 10px;
  }
  .qr {
    width: 72px;
    height: 72px;
    border: 1px solid var(--line);
    border-radius: 6px;
    padding: 4px;
    background: #fff;
  }
  .qr-label {
    text-align: right;
    line-height: 1.25;
  }

  a { color: var(--text); text-decoration: underline; }
  .page { width: 100%; max-width: 8.5in; margin: 0 auto; }

  /* Header */
  .hdr { display:flex; justify-content:space-between; gap:18px; align-items:flex-start; padding-bottom: 10px; border-bottom: 2px solid #111; margin-bottom: 14px; }
  .hdr-left .name { font-size: 22px; font-weight: 900; letter-spacing: -0.3px; line-height: 1.1; }
  .hdr-left .headline { margin-top: 4px; color: var(--muted); font-size: 12px; font-weight: 600; }
  .hdr-right { text-align:right; color: var(--muted); font-size: 10.6px; line-height: 1.45; }

  /* Sections */
  .section { margin: 12px 0 14px 0; }
  .stitle {
    font-size: 10.8px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--accent);
    border-bottom: 1px solid var(--line);
    padding-bottom: 4px;
    margin-bottom: 8px;
  }

  .summary { color: #111827; margin-top: 2px; }
  .entry { margin: 0 0 10px 0; break-inside: avoid; page-break-inside: avoid; }
  .entry-head { display:flex; justify-content:space-between; align-items:baseline; gap:12px; }
  .entry-title { font-weight: 800; font-size: 12px; }
  .entry-meta { color: var(--muted); font-style: italic; font-size: 10.5px; text-align:right; }
  .desc { margin-top: 3px; color:#374151; }

  .bullets { margin: 4px 0 0 16px; padding: 0; color:#374151; }
  .bullets li { margin: 0 0 2px 0; }

  .pillwrap { display:flex; flex-wrap:wrap; gap:4px; }
  .pill {
    background:#f3f4f6;
    border: 1px solid var(--line);
    border-radius: 4px;
    padding: 1px 6px;
    font-size: 9.4px;
    color:#374151;
    font-weight: 600;
  }
  .pill-soft { background: transparent; }
  .skillblock { margin-bottom: 10px; break-inside: avoid; page-break-inside: avoid; }
  .skillblock-title { font-weight: 900; font-size: 11px; margin-bottom: 4px; color:#111; }
  .toolsline { margin-top: 5px; }

  /* Print hardening */
  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .page { max-width: none; }
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
      <div class="hdr-right">
        ${contactHtml}
      </div>
    </div>

    <div class="section">
      <div class="stitle">Education</div>
      ${eduHtml}
    </div>

    <div class="section">
      <div class="stitle">Selected Highlights</div>
      <ul class="bullets">
        <li>Cleanroom microfabrication: photolithography, thin films, multilayer alignment, metrology (Dektak/ellipsometry)</li>
        <li>DOE-driven lithography characterization (2³ factorial); analysis in JMP</li>
        <li>Reproducible data pipelines (Python/pandas) for program evaluation and operational analytics</li>
        <li>Teaching/mentorship: Learning Assistant (Applied DS) and mathematics grader (proof + LA)</li>
      </ul>
    </div>


    ${researchHtml ? `
    <div class="section">
      <div class="stitle">Research</div>
      ${researchHtml}
    </div>` : ""}

    ${projectsHtmlCv ? `
    <div class="section">
      <div class="stitle">Projects</div>
      ${projectsHtmlCv}
    </div>` : ""}

    ${experienceHtml ? `
    <div class="section">
      <div class="stitle">Teaching & Leadership</div>
      ${experienceHtml}
    </div>` : ""}

    <div class="section">
      <div class="stitle">Skills</div>
      ${skillsHtml}
    </div>

    ${showCoursework && courseHtml ? `
    <div class="section">
      <div class="stitle">Coursework</div>
      ${courseHtml}
    </div>` : ""}
    <div class="cv-footer">
  <div class="qr-label">
    <div><strong>Portfolio</strong></div>
    <div>${escapeHtml(stripUrl(person.contact?.portfolio || ""))}</div>
  </div>
  ${
    person.contact?.portfolio
      ? `<img class="qr" alt="Portfolio QR code" src="https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(person.contact.portfolio)}" />`
      : ""
  }
</div>

  </div>
</body>
</html>
    `;
  }

  // =========================
  // TEMPLATE: Resume (two-column)
  // =========================
  return `
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>${escapeHtml(person.name)} — ${escapeHtml(cfgTitle)}</title>
<style>
  :root { --text:#111827; --muted:#6b7280; --accent:#2563eb; --line:#e5e7eb; }
  * { box-sizing: border-box; }
  html, body { margin:0; padding:0; }
  @page { size: letter portrait; margin: 0.55in; }

  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
    color: var(--text);
    font-size: 11.2px;
    line-height: 1.35;
  }

  a { color: var(--accent); text-decoration: none; }
  .page { width: 100%; max-width: 8.5in; margin: 0 auto; }

  .header {
    border-bottom: 2px solid #111;
    padding-bottom: 10px;
    margin-bottom: 12px;
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: flex-start;
  }
  .name { font-size: 22px; font-weight: 900; line-height: 1.1; letter-spacing: -0.3px; }
  .headline { font-size: 12px; color: var(--muted); margin-top: 4px; font-weight: 600; }
  .contact { text-align: right; font-size: 10.6px; line-height: 1.45; color: var(--muted); }

  .grid { display: grid; grid-template-columns: 2.35in 1fr; gap: 0.35in; align-items: start; }
  .section { margin: 0 0 12px 0; break-inside: avoid; page-break-inside: avoid; }
  .stitle {
    font-size: 10.8px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--accent);
    border-bottom: 1px solid var(--line);
    padding-bottom: 4px;
    margin-bottom: 8px;
  }

  .entry { margin: 0 0 10px 0; break-inside: avoid; page-break-inside: avoid; }
  .entry-head { display:flex; justify-content:space-between; align-items:baseline; gap:12px; }
  .entry-title { font-weight: 800; font-size: 12px; }
  .entry-meta { color: var(--muted); font-style: italic; font-size: 10.5px; text-align:right; }
  .desc { margin-top: 3px; color:#374151; }

  .bullets { margin: 4px 0 0 16px; padding: 0; color:#374151; }
  .bullets li { margin: 0 0 2px 0; }

  .pillwrap { display:flex; flex-wrap:wrap; gap:4px; }
  .pill {
    background:#f3f4f6;
    border: 1px solid var(--line);
    border-radius: 4px;
    padding: 1px 6px;
    font-size: 9.4px;
    color:#374151;
    font-weight: 600;
  }
  .pill-soft { background: transparent; }
  .skillblock { margin-bottom: 10px; }
  .skillblock-title { font-weight: 900; font-size: 11px; margin-bottom: 4px; color:#111; }
  .toolsline { margin-top: 5px; }

  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .page { max-width: none; }
    /* Prevent any “wide layout => landscape” heuristics */
    .grid { width: 100%; }
  }
</style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div>
        <div class="name">${escapeHtml(person.name)}</div>
        <div class="headline">${escapeHtml(person.headline)}</div>
      </div>
      <div class="contact">${contactHtml}</div>
    </div>

    <div class="grid">
      <div class="left">
        <div class="section">
          <div class="stitle">Education</div>
          ${eduHtml}
        </div>

        <div class="section">
          <div class="stitle">Skills</div>
          ${skillsHtml}
        </div>

        ${showCoursework && courseHtml ? `
        <div class="section">
          <div class="stitle">Coursework</div>
          ${courseHtml}
        </div>` : ""}
      </div>

      <div class="right">
        <div class="section">
          <div class="stitle">Summary</div>
          <div class="desc">${escapeHtml(person.summary)}</div>
        </div>

        ${showResearch && researchHtml ? `
        <div class="section">
          <div class="stitle">Research</div>
          ${researchHtml}
        </div>` : ""}

        ${showProjects && projectsHtmlResume ? `
        <div class="section">
          <div class="stitle">Projects</div>
          ${projectsHtmlResume}
        </div>` : ""}

        ${showExperience && experienceHtml ? `
        <div class="section">
          <div class="stitle">Work Experience</div>
          ${experienceHtml}
        </div>` : ""}
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

/** -------------------------
 * Modal + Carousel (with cleanup)
 * -------------------------- */
const modal = {
  backdrop: qs("#modalBackdrop"),
  title: qs("#modalTitle"),
  body: qs("#modalBody"),
  closeBtn: qs("#modalCloseBtn"),
  cleanup: null,
  lastFocus: null,

  open({ title, buildBody }) {
    this.lastFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    this.title.textContent = title;
    this.body.innerHTML = "";

    if (typeof this.cleanup === "function") this.cleanup();
    this.cleanup = null;

    const cleanupFn = buildBody?.(this.body);
    if (typeof cleanupFn === "function") this.cleanup = cleanupFn;

    this.backdrop.style.display = "flex";
    this.backdrop.setAttribute("aria-hidden", "false");

    this.closeBtn.focus();
  },

  close() {
    if (typeof this.cleanup === "function") this.cleanup();
    this.cleanup = null;

    this.backdrop.style.display = "none";
    this.backdrop.setAttribute("aria-hidden", "true");

    if (this.lastFocus) this.lastFocus.focus();
    this.lastFocus = null;
  },
};

function mountCarousel(container, project) {
  const imgList = Array.isArray(project.images) && project.images.length
    ? project.images
    : (project.image ? [project.image] : []);

  if (!imgList.length) return () => {};

  let slideIndex = 0;

  const track = el(
    "div",
    { class: "carousel-track" },
    imgList.map((src, i) => {
      const alt = project.imageAlt
        ? `${project.imageAlt} (${i + 1}/${imgList.length})`
        : `${project.title} (${i + 1}/${imgList.length})`;

      return el("div", { class: "carousel-slide" }, [
        el("img", { src, alt, loading: "lazy" }),
      ]);
    })
  );

  const viewport = el("div", { class: "carousel-viewport" }, [track]);

  const dotsWrap = el(
    "div",
    { class: "carousel-dots" },
    imgList.map((_, i) =>
      el("button", {
        class: `carousel-dot ${i === 0 ? "active" : ""}`,
        type: "button",
        "aria-label": `Go to image ${i + 1}`,
        onclick: () => {
          slideIndex = i;
          update();
        },
      })
    )
  );

  const prevBtn = el(
    "button",
    {
      class: "carousel-btn prev",
      type: "button",
      "aria-label": "Previous image",
      onclick: () => {
        slideIndex = (slideIndex - 1 + imgList.length) % imgList.length;
        update();
      },
    },
    ["‹"]
  );

  const nextBtn = el(
    "button",
    {
      class: "carousel-btn next",
      type: "button",
      "aria-label": "Next image",
      onclick: () => {
        slideIndex = (slideIndex + 1) % imgList.length;
        update();
      },
    },
    ["›"]
  );

  const carousel = el("div", { class: "carousel" }, [
    viewport,
    ...(imgList.length > 1 ? [prevBtn, nextBtn, dotsWrap] : []),
  ]);

  container.appendChild(carousel);

  function update() {
    track.style.transform = `translateX(-${slideIndex * 100}%)`;
    const dots = dotsWrap.querySelectorAll(".carousel-dot");
    dots.forEach((d, idx) => d.classList.toggle("active", idx === slideIndex));
  }

  const onKeyDown = (e) => {
    if (modal.backdrop.style.display !== "flex") return;
    if (imgList.length <= 1) return;
    if (e.key === "ArrowLeft") prevBtn.click();
    if (e.key === "ArrowRight") nextBtn.click();
  };

  document.addEventListener("keydown", onKeyDown);

  return () => {
    document.removeEventListener("keydown", onKeyDown);
  };
}

/** -------------------------
 * Renderers
 * -------------------------- */
function renderHeader() {
  qs("#name").textContent = SITE.person.name;
  qs("#headline").textContent = SITE.person.headline;

  const headshotWrap = qs("#headshotWrap");
  headshotWrap.innerHTML = "";
  if (SITE.person.photo) {
    headshotWrap.appendChild(
      el("img", {
        class: "headshot",
        src: SITE.person.photo,
        alt: SITE.person.photoAlt || SITE.person.name,
        loading: "lazy",
      })
    );
  }

  const domainWrap = qs("#domainTags");
  domainWrap.innerHTML = "";
  SITE.person.domains.forEach((d) => domainWrap.appendChild(el("span", { class: "domain-tag", text: d })));

  const social = qs("#socialLinks");
  social.innerHTML = "";
  social.appendChild(el("a", { href: `mailto:${SITE.person.contact.email}`, text: "Email" }));
  social.appendChild(el("a", { href: SITE.person.contact.linkedin, target: "_blank", rel: "noreferrer", text: "LinkedIn" }));
  social.appendChild(el("a", { href: SITE.person.contact.github, target: "_blank", rel: "noreferrer", text: "GitHub" }));

  qs("#summaryText").textContent = SITE.person.summary;
  qs("#footer").innerHTML = `&copy; ${new Date().getFullYear()} ${SITE.person.name}.`;
}

function renderSkills() {
  const grid = qs("#skillsGrid");
  grid.innerHTML = "";

  SITE.skills.forEach((cat) => {
    const pills = el("div", { class: "skill-list" }, cat.items.map((s) => el("span", { class: "skill-pill", text: s })));
    grid.appendChild(
      el("div", { class: "skill-category" }, [
        el("h3", { text: cat.title }),
        pills,
      ])
    );
  });
}

function renderTimeline(targetId, items) {
  const wrap = qs(`#${targetId}`);
  wrap.innerHTML = "";

  items.forEach((it) => {
    const ul = el("ul", { class: "clean" }, (it.bullets || []).map((b) => el("li", {}, [b])));

    wrap.appendChild(
      el("div", { class: "timeline-item" }, [
        el("p", { class: "timeline-title", text: it.title }),
        it.meta
          ? el("p", { class: "timeline-meta", text: it.meta })
          : el("p", { class: "timeline-meta hidden", text: "" }),
        ul,
      ])
    );
  });
}

/** -------------------------
 * Project filters
 * -------------------------- */
function renderFilters() {
  const wrap = qs("#filterContainer");
  wrap.innerHTML = "";

  Object.entries(CATEGORY_LABELS).forEach(([key, label]) => {
    wrap.appendChild(
      el("button", {
        class: `filter-btn ${key === state.activeCategory ? "active" : ""}`,
        type: "button",
        text: label,
        onclick: () => {
          state.activeCategory = key;
          state.sortMode = "relevance";
          const sortSelect = qs("#projectSort");
          if (sortSelect) sortSelect.value = "relevance";
          renderFilters();
          renderProjects();
        },
      })
    );
  });
}

function projectMatches(project) {
  const inCategory = state.activeCategory === "all" || project.categories.includes(state.activeCategory);
  const q = state.searchQuery.trim().toLowerCase();
  if (!q) return inCategory;

  const haystack = [
    project.title,
    project.blurb,
    project.details || "",
    ...(project.tags || []),
    ...(project.tools || []),
    ...(project.categories || []),
  ].join(" ").toLowerCase();

  return inCategory && haystack.includes(q);
}

function openProjectModal(project, triggerEl) {
  modal.lastFocus = triggerEl instanceof HTMLElement ? triggerEl : document.activeElement;

  modal.open({
    title: project.title,
    buildBody: (body) => {
      const cleanupCarousel = mountCarousel(body, project);

      body.appendChild(el("p", { class: "muted", text: project.blurb }));

      if (project.tools?.length) {
        body.appendChild(el("p", { class: "modal-section-title", text: "Tools / Methods" }));
        body.appendChild(el("div", { class: "skill-list" }, project.tools.map((t) => el("span", { class: "skill-pill", text: t }))));
      }

      if (project.details) {
        body.appendChild(el("p", { class: "modal-section-title", text: "Details" }));
        body.appendChild(el("p", { class: "muted", text: project.details }));
      }

      if (project.links?.length) {
        body.appendChild(el("p", { class: "modal-section-title", text: "Links" }));
        body.appendChild(
          el(
            "div",
            { class: "project-actions" },
            project.links.map((l) =>
              el("a", { class: "project-link", href: l.url, target: "_blank", rel: "noreferrer", text: `${l.label} →` })
            )
          )
        );
      }

      return () => cleanupCarousel();
    },
  });
}

function renderProjects() {
  const grid = qs("#projectsGrid");
  grid.innerHTML = "";

  const visible = SITE.projects.filter(projectMatches).sort(compareProjects);

  visible.forEach((p) => {
    const thumb = p.image
      ? el("img", {
          class: "project-thumb",
          src: p.image,
          alt: p.imageAlt || p.title,
          loading: "lazy",
        })
      : null;

    const tagLine = el("div", { class: "card-tags" }, (p.tags || []).map((t) => el("span", { class: "tag", text: t })));
    const dateLine = p.date ? el("p", { class: "project-date", text: new Date(p.date).toLocaleDateString() }) : null;

    const viewBtn = el("button", {
      class: "btn-secondary",
      type: "button",
      text: "View Details",
      onclick: (e) => openProjectModal(p, e.currentTarget),
    });

    const actions = el("div", { class: "project-actions" }, [
      viewBtn,
      ...(p.links || []).slice(0, 2).map((l) =>
        el("a", { class: "project-link", href: l.url, target: "_blank", rel: "noreferrer", text: `${l.label} →` })
      ),
    ]);

    const card = el("div", { class: "project-card" }, [
      ...(thumb ? [thumb] : []),
      tagLine,
      el("h3", { class: "project-title", text: p.title }),
      ...(dateLine ? [dateLine] : []),
      el("p", { class: "project-desc", text: p.blurb }),
      actions,
    ]);

    grid.appendChild(card);
  });

  if (visible.length === 0) {
    grid.appendChild(
      el("div", { class: "project-card" }, [
        el("h3", { class: "project-title", text: "No projects match your filters." }),
        el("p", { class: "project-desc", text: "Try a different category or remove the search term." }),
      ])
    );
  }
}

/** -------------------------
 * PDF Controls
 * -------------------------- */
function setSeg(group, value) {
  state.pdfConfig[group] = value;
  renderPdfControls();
}

function renderPdfControls() {
  const cfg = state.pdfConfig;

  const hint = qs("#pdfHint");
  const controls = qs("#pdfDdMenu");
  if (!controls) return;

  const btns = controls.querySelectorAll(".seg-btn");
  btns.forEach((b) => {
    const g = b.getAttribute("data-group");
    const v = b.getAttribute("data-value");
    const active = cfg[g] === v;

    b.classList.toggle("active", active);
    b.setAttribute("aria-checked", active ? "true" : "false");
  });

  const isCV = cfg.doctype === "cv";
  const disableGroups = isCV ? new Set(["domain", "audience"]) : new Set();

  btns.forEach((b) => {
    const g = b.getAttribute("data-group");
    const shouldDisable = disableGroups.has(g);
    b.disabled = shouldDisable;
    b.classList.toggle("disabled", shouldDisable);
  });

  if (hint) {
    if (isCV) hint.textContent = "CV mode: single-column academic CV output; Focus/Target sliders disabled.";
    else {
      const focus = cfg.domain === "nanotech" ? "Nanotech" : "Data Science";
      const target = cfg.audience === "academic" ? "Academic" : "Industry";
      hint.textContent = `Resume mode: ${target} • ${focus}.`;
    }
  }
}

function closePdfDropdown() {
  const ddMenu = qs("#pdfDdMenu");
  const ddBtn = qs("#pdfDdBtn");
  if (!ddMenu || !ddBtn) return;
  ddMenu.classList.add("hidden");
  ddBtn.setAttribute("aria-expanded", "false");
}

function wirePdfControls() {
  const controls = qs("#pdfDdMenu");
  if (!controls) return;

  // Segmented control clicks
  controls.addEventListener("click", (e) => {
    const t = e.target;
    if (!(t instanceof HTMLElement)) return;

    if (t.classList.contains("seg-btn")) {
      const g = t.getAttribute("data-group");
      const v = t.getAttribute("data-value");
      if (!g || !v) return;
      if (t.disabled) return;
      setSeg(g, v);
    }
  });

  // Download button
  const dl = qs("#pdfDownloadBtn");
  if (!dl) return;

  dl.addEventListener("click", async (e) => {
    e.preventDefault();

    const html = buildResumeHtml(state.pdfConfig);

    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);

    const win = iframe.contentWindow;
    const doc = win.document;

    doc.open();
    doc.write(html);
    doc.close();

    // Hardening: fonts/layout settle before print (fixes occasional blank/landscape oddities)
    const safePrint = async () => {
      try {
        if (win.document?.fonts?.ready) await win.document.fonts.ready;
      } catch {}
      // One more tick for layout
      await new Promise((r) => setTimeout(r, 30));

      win.onafterprint = () => {
        setTimeout(() => {
          try { document.body.removeChild(iframe); } catch {}
        }, 0);
        win.onafterprint = null;
      };

      win.focus();
      win.print();
    };

    // Some browsers never fire iframe.onload after doc.write; handle both.
    let fired = false;
    iframe.onload = () => {
      if (fired) return;
      fired = true;
      safePrint();
    };
    // Fallback if onload does not fire.
    setTimeout(() => {
      if (fired) return;
      fired = true;
      safePrint();
    }, 60);

    closePdfDropdown();
  });
}

/** -------------------------
 * Init + wiring
 * -------------------------- */
function init() {
  renderHeader();
  renderSkills();
  renderTimeline("researchList", SITE.research);
  renderTimeline("experienceList", SITE.experience);
  renderTimeline("courseworkList", SITE.coursework);
  renderTimeline("educationList", SITE.education);

  renderFilters();
  renderProjects();

  const projectSearch = qs("#projectSearch");
  if (projectSearch) {
    projectSearch.addEventListener("input", (e) => {
      state.searchQuery = e.target.value || "";
      renderProjects();
    });
  }

  const projectSort = qs("#projectSort");
  if (projectSort) {
    projectSort.addEventListener("change", (e) => {
      state.sortMode = e.target.value;
      renderProjects();
    });
  }

  // Modal close
  modal.closeBtn.addEventListener("click", () => modal.close());
  modal.backdrop.addEventListener("click", (e) => {
    if (e.target === modal.backdrop) modal.close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") modal.close();
  });

  // PDF controls defaults
  state.pdfConfig.domain = "ds";
  state.pdfConfig.audience = "industry";
  state.pdfConfig.doctype = "resume";

  wirePdfControls();
  renderPdfControls();

  // PDF dropdown open/close (guarded)
  const ddBtn = qs("#pdfDdBtn");
  const ddMenu = qs("#pdfDdMenu");
  const ddWrap = qs("#pdfDropdown");

  if (ddBtn && ddMenu && ddWrap) {
    function openPdfMenu() {
      ddMenu.classList.remove("hidden");
      ddBtn.setAttribute("aria-expanded", "true");
    }

    function closePdfMenu() {
      ddMenu.classList.add("hidden");
      ddBtn.setAttribute("aria-expanded", "false");
    }

    ddBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const isOpen = !ddMenu.classList.contains("hidden");
      if (isOpen) closePdfMenu();
      else openPdfMenu();
    });

    document.addEventListener("click", (e) => {
      if (!ddWrap.contains(e.target)) closePdfMenu();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closePdfMenu();
    });
  }
}

// small CSS helper for modal headings
const style = document.createElement("style");
style.textContent = `.modal-section-title { margin-top: 12px; font-weight: 700; color: #111; }`;
document.head.appendChild(style);

init();
