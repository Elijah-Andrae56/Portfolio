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

const DOMAIN_LABELS = {
  ds: "Data Science",
  marketing: "Marketing / Business",
  nanofab: "Nanofabrication",
  cs: "Computer Science",
};

// Invisible fallback if user clears everything (used only at download time)
const PDF_FALLBACK_DOMAINS = ["ds"];

function getVisiblePdfDomains() {
  const menu = qs("#pdfDdMenu");
  if (!menu) return [];
  return [...menu.querySelectorAll('input[type="checkbox"]:checked')].map(cb => cb.value);
}

function getEffectivePdfDomains() {
  const visible = getVisiblePdfDomains();
  return visible.length ? visible : PDF_FALLBACK_DOMAINS;
}

function buildResumeHtml(domains) {
  const person = SITE.person;

  // 1. Helper to check if an item matches the selected domains
  const isVisible = (item) => {
    const tags = item.domains || item.categories;
    if (!tags || tags.length === 0) return true; // Global item
    return tags.some(tag => domains.includes(tag));
  };

  // 2. Filter Research FIRST
  const research = (SITE.research || [])
    .filter(isVisible);

  // 3. Create a Set of titles that are already shown in Research
  //    This helps us "subtract" them from the Projects list below.
  const researchTitles = new Set(research.map(r => r.title));

  // 4. Filter Projects (Visible + NOT in Research)
  const projects = (SITE.projects || [])
    .filter(p => isVisible(p) && !researchTitles.has(p.title)) // <--- THE FIX
    .sort((a, b) => parseDate(b.date) - parseDate(a.date));

  const skills = (SITE.skills || [])
    .filter(isVisible);

  const experience = (SITE.experience || [])
    .filter(isVisible);

  const education = SITE.education || [];
  const coursework = SITE.coursework || [];

  // 5. Construct Title based on selection
  const cfgTitle = domains.map((d) => DOMAIN_LABELS[d] || d).join(" + ");

  // 6. HTML Generators
  const skillsHtml = skills.map(cat => `
    <div class="block">
      <div class="block-title">${escapeHtml(cat.title)}</div>
      <div class="pill-wrap">
        ${(cat.items || []).map(s => `<span class="pill">${escapeHtml(s)}</span>`).join("")}
      </div>
    </div>
  `).join("");

  const eduHtml = education.map(e => `
    <div class="block">
      <div class="block-title">${escapeHtml(e.title)}</div>
      ${e.meta ? `<div class="meta">${escapeHtml(e.meta)}</div>` : ""}
      ${(e.bullets || []).length ? `<ul class="bullets">${e.bullets.map(b => `<li>${escapeHtml(b)}</li>`).join("")}</ul>` : ""}
    </div>
  `).join("");

  const courseHtml = coursework.map(c => `
    <div class="block">
      <div class="block-title">${escapeHtml(c.title)}</div>
      ${(c.bullets || []).length ? `<ul class="bullets">${c.bullets.map(b => `<li>${escapeHtml(b)}</li>`).join("")}</ul>` : ""}
    </div>
  `).join("");

  const researchHtml = research.map(r => `
    <div class="item">
      <div class="item-head">
        <div class="item-title">${escapeHtml(r.title)}</div>
        ${r.meta ? `<div class="meta">${escapeHtml(r.meta)}</div>` : ""}
      </div>
      ${(r.bullets || []).length ? `<ul class="bullets">${r.bullets.map(b => `<li>${escapeHtml(b)}</li>`).join("")}</ul>` : ""}
    </div>
  `).join("");

  const experienceHtml = experience.map(exp => `
    <div class="item">
      <div class="item-head">
        <div class="item-title">${escapeHtml(exp.title)}</div>
        ${exp.meta ? `<div class="meta">${escapeHtml(exp.meta)}</div>` : ""}
      </div>
      ${(exp.bullets || []).length ? `<ul class="bullets">${exp.bullets.map(b => `<li>${escapeHtml(b)}</li>`).join("")}</ul>` : ""}
    </div>
  `).join("");

  const projectsHtml = projects.map(p => `
    <div class="item">
      <div class="item-head">
        <div class="item-title">${escapeHtml(p.title)}</div>
        <div class="meta">${escapeHtml(formatMonthYear(p.date))}</div>
      </div>
      ${p.blurb ? `<div class="desc">${escapeHtml(p.blurb)}</div>` : ""}
      ${(p.tools || []).length ? `
        <div class="tools">
          ${(p.tools || []).slice(0, 8).map(t => `<span class="pill pill-soft">${escapeHtml(t)}</span>`).join("")}
        </div>
      ` : ""}
    </div>
  `).join("");

  // Helper to strip https:// for cleaner print display
  const stripUrl = (url) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

  const contactHtml = `
    ${person.contact?.email ? `<div>${escapeHtml(person.contact.email)}</div>` : ""}
    ${person.contact?.phone ? `<div>${escapeHtml(person.contact.phone)}</div>` : ""}
    ${person.contact?.linkedin ? `<div><a href="${person.contact.linkedin}">linkedin.com/in/elijah-andrae</a></div>` : ""}
    ${person.contact?.github ? `<div><a href="${person.contact.github}">${stripUrl(person.contact.github)}</a></div>` : ""}
    ${person.contact?.portfolio ? `<div><a href="${person.contact.portfolio}">${stripUrl(person.contact.portfolio)}</a></div>` : ""}
  `;

  return `
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>${escapeHtml(person.name)} — ${escapeHtml(cfgTitle)}</title>
<style>
  :root { --text: #1f2937; --muted: #6b7280; --accent: #2563eb; --line: #e5e7eb; }
  * { box-sizing: border-box; }
  body { 
    margin: 0; 
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; 
    color: var(--text); 
    line-height: 1.4; 
    font-size: 12px;
  }
  a { color: var(--accent); text-decoration: none; }
  .page { max-width: 900px; margin: 0 auto; padding: 40px; }
  
  /* Header */
  .header { border-bottom: 2px solid var(--text); padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-start; }
  .name { font-size: 28px; font-weight: 800; line-height: 1.1; letter-spacing: -0.5px; }
  .headline { font-size: 14px; color: var(--muted); margin-top: 4px; font-weight: 500; }
  .contact-info { text-align: right; font-size: 11px; line-height: 1.5; color: var(--muted); }
  
  /* Layout */
  .grid { display: grid; grid-template-columns: 220px 1fr; gap: 32px; }
  
  /* Sections */
  .section { margin-bottom: 24px; }
  
  /* Major Headers */
  .section-title { 
    font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px; 
    color: var(--accent); border-bottom: 2px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 12px; 
  }

  /* Sub Headers (Bold) */
  .block-title {
    font-weight: 800; 
    font-size: 12.5px;
    margin-bottom: 4px;
    color: #111;
  }
  
  /* Items */
  .item { margin-bottom: 14px; }
  .item-head { display: flex; justify-content: space-between; align-items: baseline; }
  .item-title { font-weight: 700; font-size: 13px; }
  .meta { font-size: 11px; color: var(--muted); font-style: italic; }
  .desc { margin-top: 4px; font-size: 12px; color: #374151; }
  
  /* Lists */
  .bullets { margin: 4px 0 0 16px; padding: 0; color: #4b5563; }
  .bullets li { margin-bottom: 3px; padding-left: 2px; }
  
  /* Skills Pills */
  .pill-wrap { display: flex; flex-wrap: wrap; gap: 4px; }
  .pill { 
    background: #f3f4f6; 
    padding: 1px 6px; 
    border-radius: 4px; 
    font-size: 9.5px; 
    color: #374151; 
    font-weight: 500; 
    border: 1px solid #e5e7eb;
  }
  .pill-soft { background: transparent; border: 1px solid var(--line); padding: 1px 5px; font-size: 9px; }
  
  .tools { margin-top: 6px; }
  
  /* Print overrides */
  @media print {
    body { -webkit-print-color-adjust: exact; }
    .page { padding: 0; }
    a { color: #111; text-decoration: underline; }
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
      <div class="contact-info">
        ${contactHtml}
      </div>
    </div>

    <div class="grid">
      <div class="left">
        <div class="section">
          <div class="section-title">Education</div>
          ${eduHtml}
        </div>

        <div class="section">
          <div class="section-title">Skills</div>
          ${skillsHtml}
        </div>

        <div class="section">
          <div class="section-title">Coursework</div>
          ${courseHtml}
        </div>
      </div>

      <div class="right">
        <div class="section">
          <div class="section-title">Summary</div>
          <div style="font-size:12px; color:#374151;">${escapeHtml(person.summary)}</div>
        </div>

        ${researchHtml ? `
        <div class="section">
          <div class="section-title">Research</div>
          ${researchHtml}
        </div>` : ""}

        ${projectsHtml ? `
        <div class="section">
          <div class="section-title">Projects</div>
          ${projectsHtml}
        </div>` : ""}

        ${experienceHtml ? `
        <div class="section">
          <div class="section-title">Work Experience</div>
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

  // Modal close
  modal.closeBtn.addEventListener("click", () => modal.close());
  modal.backdrop.addEventListener("click", (e) => {
    if (e.target === modal.backdrop) modal.close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") modal.close();
  });

  // PDF dropdown (single button)
  const ddBtn = qs("#pdfDdBtn");
  const ddMenu = qs("#pdfDdMenu");
  const ddWrap = qs("#pdfDropdown");

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

  ddMenu.addEventListener("change", () => {});


    qs("#pdfDdClear").addEventListener("click", (e) => {
    e.preventDefault();
    ddMenu.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    });


  qs("#pdfDdDownload").addEventListener("click", (e) => {
    e.preventDefault();

    const domains = getEffectivePdfDomains();
    const html = buildResumeHtml(domains);

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

    let printed = false;
    iframe.onload = () => {
      if (printed) return;
      printed = true;

      win.onafterprint = () => {
        setTimeout(() => {
          try { document.body.removeChild(iframe); } catch {}
        }, 0);
        win.onafterprint = null;
      };

      win.focus();
      win.print();
    };

    closePdfMenu();
  });

  document.addEventListener("click", (e) => {
    if (!ddWrap.contains(e.target)) closePdfMenu();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closePdfMenu();
  });

}
// small CSS helper for modal headings
const style = document.createElement("style");
style.textContent = `
  .modal-section-title { margin-top: 12px; font-weight: 700; color: #111; }
`;
document.head.appendChild(style);

init();
