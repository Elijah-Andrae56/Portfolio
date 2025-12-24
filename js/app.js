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

  for (const c of children) {
    node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
  }

  return node;
}

/** -------------------------
 * State
 * -------------------------- */
const state = {
  activeCategory: "all",
  searchQuery: "",
  sortMode: "relevance", 
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
 * - Works automatically "within subcategories" because category filtering already happens before sorting.
 * - If no search query, relevance falls back to date_desc (so it is stable and sensible).
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

  // Bonus: exact phrase match in title
  const q = normalize(query).trim();
  if (q && title.includes(q)) score += 40;

  return score;
}


function parseDate(value) {
  // ISO strings compare lexicographically, but Date parsing is fine too.
  // If missing/invalid, treat as very old (0).
  const t = Date.parse(value);
  return Number.isFinite(t) ? t : 0;
}

function compareProjects(a, b) {
  switch (state.sortMode) {
    case "relevance": {
      const sa = relevanceScore(a, state.searchQuery);
      const sb = relevanceScore(b, state.searchQuery);

      // Higher score first
      if (sb !== sa) return sb - sa;

      // Tie-breakers for stable ordering:
      // 1) Newest first if scores equal (or query empty => all scores 0)
      const dt = parseDate(b.date) - parseDate(a.date);
      if (dt !== 0) return dt;

      // 2) Title A-Z
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

function focusConfig(focusKey) {
  // This controls which projects show in the PDF when a focus is selected.
  // You can expand this later (e.g., include ds+marketing together, etc.)
  const map = {
    all: { title: "Portfolio", categories: null },
    ds: { title: "Data Science Portfolio", categories: ["ds"] },
    marketing: { title: "Marketing / Business Portfolio", categories: ["marketing"] },
    nanofab: { title: "Nanofabrication Portfolio", categories: ["nanofab"] },
    cs: { title: "Computer Science Portfolio", categories: ["cs"] },
  };
  return map[focusKey] || map.all;
}

function pickProjectsForFocus(projects, focusKey) {
  const cfg = focusConfig(focusKey);
  if (!cfg.categories) return [...projects];

  // Keep only projects that match the selected focus category
  return projects.filter(p => (p.categories || []).some(c => cfg.categories.includes(c)));
}

function buildResumeHtml(focusKey) {
  const cfg = focusConfig(focusKey);
  const person = SITE.person;

  const projects = pickProjectsForFocus(SITE.projects, focusKey)
    .slice()
    .sort((a, b) => parseDate(b.date) - parseDate(a.date)); // newest first in PDF

  const research = SITE.research || [];
  const skills = SITE.skills || [];
  const education = SITE.education || [];
  const coursework = SITE.coursework || [];

  // Contact lines
  const email = person.contact?.email ? `<div><strong>Email:</strong> ${escapeHtml(person.contact.email)}</div>` : "";
  const phone = person.contact?.phone ? `<div><strong>Phone:</strong> ${escapeHtml(person.contact.phone)}</div>` : "";
  const linkedin = person.contact?.linkedin ? `<div><strong>LinkedIn:</strong> ${escapeHtml(person.contact.linkedin)}</div>` : "";
  const github = person.contact?.github ? `<div><strong>GitHub:</strong> ${escapeHtml(person.contact.github)}</div>` : "";

  // Skills (grouped)
  const skillsHtml = skills.map(cat => `
    <div class="block">
      <div class="block-title">${escapeHtml(cat.title)}</div>
      <div class="pill-wrap">
        ${(cat.items || []).map(s => `<span class="pill">${escapeHtml(s)}</span>`).join("")}
      </div>
    </div>
  `).join("");

  // Education
  const eduHtml = education.map(e => `
    <div class="block">
      <div class="block-title">${escapeHtml(e.title)}</div>
      ${e.meta ? `<div class="meta">${escapeHtml(e.meta)}</div>` : ""}
      ${(e.bullets || []).length ? `<ul class="bullets">${e.bullets.map(b => `<li>${escapeHtml(b)}</li>`).join("")}</ul>` : ""}
    </div>
  `).join("");

  // Coursework
  const courseHtml = coursework.map(c => `
    <div class="block">
      <div class="block-title">${escapeHtml(c.title)}</div>
      ${(c.bullets || []).length ? `<ul class="bullets">${c.bullets.map(b => `<li>${escapeHtml(b)}</li>`).join("")}</ul>` : ""}
    </div>
  `).join("");

  // Research
  const researchHtml = research.map(r => `
    <div class="item">
      <div class="item-head">
        <div class="item-title">${escapeHtml(r.title)}</div>
        ${r.meta ? `<div class="meta">${escapeHtml(r.meta)}</div>` : ""}
      </div>
      ${(r.bullets || []).length ? `<ul class="bullets">${r.bullets.map(b => `<li>${escapeHtml(b)}</li>`).join("")}</ul>` : ""}
    </div>
  `).join("");

  // Projects
  const projectsHtml = projects.map(p => `
    <div class="item">
      <div class="item-head">
        <div class="item-title">${escapeHtml(p.title)}</div>
        <div class="meta">${escapeHtml(formatMonthYear(p.date))}</div>
      </div>
      ${p.blurb ? `<div class="desc">${escapeHtml(p.blurb)}</div>` : ""}
      ${(p.tools || []).length ? `
        <div class="tools">
          ${(p.tools || []).slice(0, 10).map(t => `<span class="pill pill-soft">${escapeHtml(t)}</span>`).join("")}
        </div>
      ` : ""}
      ${(p.links || []).length ? `
        <div class="links">
          ${(p.links || []).map(l => `<div class="link">${escapeHtml(l.label)}: ${escapeHtml(l.url)}</div>`).join("")}
        </div>
      ` : ""}
    </div>
  `).join("");

  // Print-optimized CSS is embedded so the PDF view is independent of your site CSS.
  return `
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${escapeHtml(person.name)} — ${escapeHtml(cfg.title)}</title>
<style>
  :root{
    --text:#111;
    --muted:#555;
    --line:#e6e6e6;
    --accent:#2563eb;
  }
  *{ box-sizing:border-box; }
  body{
    margin:0;
    font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
    color:var(--text);
    line-height:1.25;
    background:#fff;
  }
  .page{
    padding: 28px 30px;
    max-width: 1050px;
    margin: 0 auto;
  }
  .header{
    display:flex;
    align-items:flex-end;
    justify-content:space-between;
    gap:16px;
    border-bottom: 2px solid var(--line);
    padding-bottom: 12px;
    margin-bottom: 14px;
  }
  .name{
    font-size: 26px;
    font-weight: 800;
    letter-spacing: 0.2px;
  }
  .headline{
    margin-top: 4px;
    color: var(--muted);
    font-size: 13.5px;
  }
  .focus{
    color: var(--muted);
    font-size: 12.5px;
    text-align:right;
    white-space:nowrap;
  }
  .grid{
    display:grid;
    grid-template-columns: 1fr 2fr; /* left 1/3, right 2/3 */
    gap: 18px;
  }
  .left{
    border-right: 1px solid var(--line);
    padding-right: 16px;
  }
  .section{
    margin: 0 0 14px 0;
  }
  .section-title{
    font-size: 12px;
    font-weight: 800;
    letter-spacing: .08em;
    text-transform: uppercase;
    color: var(--accent);
    margin: 0 0 8px 0;
  }
  .contact{
    font-size: 12.5px;
    color: var(--muted);
  }
  .block{ margin: 0 0 10px 0; }
  .block-title{
    font-weight: 750;
    font-size: 12.5px;
    margin-bottom: 6px;
  }
  .meta{
    color: var(--muted);
    font-size: 12px;
  }
  .bullets{
    margin: 6px 0 0 18px;
    padding:0;
    color: var(--muted);
    font-size: 12.3px;
  }
  .bullets li{ margin: 0 0 4px 0; }
  .pill-wrap{ display:flex; flex-wrap:wrap; gap:6px; }
  .pill{
    border: 1px solid var(--line);
    border-radius: 999px;
    padding: 3px 8px;
    font-size: 11.5px;
    color: var(--muted);
    white-space: nowrap;
  }
  .pill-soft{
    border-radius: 7px;
    white-space: normal;
  }
  .right .summary{
    color: var(--muted);
    font-size: 12.8px;
    line-height: 1.35;
    margin-top: 2px;
  }
  .item{
    border: 1px solid var(--line);
    border-radius: 10px;
    padding: 10px 12px;
    margin: 0 0 10px 0;
  }
  .item-head{
    display:flex;
    justify-content: space-between;
    gap: 10px;
    align-items: baseline;
  }
  .item-title{
    font-weight: 800;
    font-size: 13px;
  }
  .desc{
    margin-top: 6px;
    color: var(--muted);
    font-size: 12.3px;
    line-height: 1.35;
  }
  .tools{ margin-top: 8px; display:flex; flex-wrap:wrap; gap:6px; }
  .links{ margin-top: 8px; font-size: 11.8px; color: var(--muted); }
  .link{ margin-top: 2px; }

  /* Print tuning */
  @media print{
    .page{ padding: 0; }
    .item{ break-inside: avoid; page-break-inside: avoid; }
    .section{ break-inside: avoid; page-break-inside: avoid; }
    a{ color: inherit; text-decoration: none; }
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
      <div class="focus">${escapeHtml(cfg.title)}</div>
    </div>

    <div class="grid">
      <div class="left">
        <div class="section">
          <div class="section-title">Contact</div>
          <div class="contact">
            ${email}
            ${phone}
            ${linkedin}
            ${github}
          </div>
        </div>

        <div class="section">
          <div class="section-title">Education</div>
          ${eduHtml}
        </div>

        <div class="section">
          <div class="section-title">Coursework</div>
          ${courseHtml}
        </div>
      </div>

      <div class="right">
        <div class="section">
          <div class="section-title">Summary</div>
          <div class="summary">${escapeHtml(person.summary)}</div>
        </div>

        <div class="section">
          <div class="section-title">Research</div>
          ${researchHtml || `<div class="meta">No research items listed.</div>`}
        </div>

        <div class="section">
          <div class="section-title">Skills</div>
          ${skillsHtml}
        </div>

        <div class="section">
          <div class="section-title">Projects</div>
          ${projectsHtml || `<div class="meta">No projects match this focus.</div>`}
        </div>
      </div>
    </div>
  </div>

<script>
  // auto-open print dialog; user saves as PDF
  window.addEventListener("load", () => {
    setTimeout(() => window.print(), 150);
  });
</script>
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

    // cleanup any prior listeners
    if (typeof this.cleanup === "function") this.cleanup();
    this.cleanup = null;

    const cleanupFn = buildBody?.(this.body);
    if (typeof cleanupFn === "function") this.cleanup = cleanupFn;

    this.backdrop.style.display = "flex";
    this.backdrop.setAttribute("aria-hidden", "false");

    // focus close for accessibility
    this.closeBtn.focus();
  },

  close() {
    if (typeof this.cleanup === "function") this.cleanup();
    this.cleanup = null;

    this.backdrop.style.display = "none";
    this.backdrop.setAttribute("aria-hidden", "true");

    // restore focus
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
    // only while modal is open
    if (modal.backdrop.style.display !== "flex") return;
    if (imgList.length <= 1) return;

    if (e.key === "ArrowLeft") prevBtn.click();
    if (e.key === "ArrowRight") nextBtn.click();
  };

  document.addEventListener("keydown", onKeyDown);

  // cleanup function
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

        // Requirement: switching category automatically uses relevance sort
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
  ]
    .join(" ")
    .toLowerCase();

  return inCategory && haystack.includes(q);
}

function openProjectModal(project, triggerEl) {
  modal.lastFocus = triggerEl instanceof HTMLElement ? triggerEl : document.activeElement;

  modal.open({
    title: project.title,
    buildBody: (body) => {
      // carousel (returns cleanup)
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

      // cleanup returned to modal
      return () => {
        cleanupCarousel();
      };
    },
  });
}

function renderProjects() {
  const grid = qs("#projectsGrid");
  grid.innerHTML = "";

const visible = SITE.projects
  .filter(projectMatches)
  .sort(compareProjects);

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
        const dateLine = p.date
            ? el("p", { class: "project-date", text: new Date(p.date).toLocaleDateString() })
            : null;


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

  qs("#projectSearch").addEventListener("input", (e) => {
    state.searchQuery = e.target.value || "";
    renderProjects();
  });

  qs("#projectSort").addEventListener("change", (e) => {
  state.sortMode = e.target.value;
  renderProjects();
});

qs("#downloadPdfBtn").addEventListener("click", () => {
  const focusKey = qs("#pdfFocus")?.value || "all";
  const html = buildResumeHtml(focusKey);

  // Create hidden iframe
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";

  document.body.appendChild(iframe);

  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(html);
  doc.close();

  // Wait for styles & layout, then print
  iframe.onload = () => {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();

    // Cleanup after print dialog opens
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1000);
  };
})
}

modal.closeBtn.addEventListener("click", () => modal.close());


// small CSS helper for modal headings (kept here to avoid adding extra classes everywhere)
const style = document.createElement("style");
style.textContent = `
  .modal-section-title { margin-top: 12px; font-weight: 700; color: #111; }
`;
document.head.appendChild(style);

init();
