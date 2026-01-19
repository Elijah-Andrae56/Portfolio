// app.js
import { SITE, CATEGORY_LABELS } from "./data.js";

/* -------------------------
   Helpers
-------------------------- */
const qs = (sel, root = document) => root.querySelector(sel);

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") node.className = v;
    else if (k === "text") node.textContent = v;
    else if (k === "html") node.innerHTML = v;
    else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v);
  }
  for (const c of children) node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
  return node;
}

function normalize(x) { return String(x || "").toLowerCase(); }
function parseDate(x) { const t = Date.parse(x); return Number.isFinite(t) ? t : 0; }

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

function stripUrl(url) {
  return String(url || "").replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}

function commaLine(arr) {
  return Array.isArray(arr) ? arr.filter(Boolean).join(", ") : "";
}

function flattenText(card) {
  const parts = [
    card.title, card.blurb, card.details || "",
    ...(card.tags || []),
    ...(card.tools || []),
    ...(card.categories || []),
    card.kind || ""
  ];
  if (Array.isArray(card.modules)) {
    for (const m of card.modules) {
      parts.push(m.title, m.blurb, ...(m.tools || []), ...(m.bullets || []));
    }
  }
  return normalize(parts.join(" "));
}

/* -------------------------
   State
-------------------------- */
const state = {
  activeCategories: new Set(["all"]), // default: show everything
  searchQuery: "",
  sortMode: "relevance",
  pdfConfig: {
    domain: "ds",
    audience: "industry",
    doctype: "resume",
  },
};

/* -------------------------
   Sorting
-------------------------- */
function relevanceScore(card, query) {
  const q = normalize(query).trim();
  if (!q) return 0;

  const hay = flattenText(card);
  if (!hay.includes(q)) return 0;

  const title = normalize(card.title);
  const tags = normalize((card.tags || []).join(" "));
  const tools = normalize((card.tools || []).join(" "));
  const blurb = normalize(card.blurb);
  const details = normalize(card.details);

  let score = 0;
  if (title.includes(q)) score += 80;
  if (tags.includes(q)) score += 35;
  if (tools.includes(q)) score += 30;
  if (blurb.includes(q)) score += 18;
  if (details.includes(q)) score += 10;

  return score;
}

function compareCards(a, b) {
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

/* -------------------------
   Filters
-------------------------- */
function categoryMatches(card) {
  const selected = state.activeCategories;

  // "All" means no filtering
  if (selected.has("all") || selected.size === 0) return true;

  // Support kind filters: research/lab/project
  const kindSelected = ["research", "lab", "project"].filter((k) => selected.has(k));
  if (kindSelected.length && !kindSelected.includes(card.kind)) return false;

  // Support tag/category filters (ds/cs/marketing/nanofab/etc.)
  const tagSelected = [...selected].filter((k) => !["research", "lab", "project"].includes(k));
  if (tagSelected.length) {
    const cats = Array.isArray(card.categories) ? card.categories : [];
    if (!tagSelected.some((t) => cats.includes(t))) return false;
  }

  return true;
}


function searchMatches(card) {
  const q = normalize(state.searchQuery).trim();
  if (!q) return true;
  return flattenText(card).includes(q);
}

function getGridCards() {
  // Do not repeat featured items in the main grid
  return getVisibleCards().filter((c) => !c.featured);
}

function getVisibleCards() {
  return (SITE.cards || [])
    .filter(categoryMatches)
    .filter(searchMatches)
    .sort(compareCards);
}

/* -------------------------
   Modal + Carousel
-------------------------- */
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

function mountCarousel(container, obj) {
  const imgList = Array.isArray(obj.images) && obj.images.length
    ? obj.images
    : (obj.image ? [obj.image] : []);

  if (!imgList.length) return () => {};

  let slideIndex = 0;

  const track = el(
    "div",
    { class: "carousel-track" },
    imgList.map((src, i) => {
      const altBase = obj.imageAlt || obj.title || "Image";
      const alt = `${altBase} (${i + 1}/${imgList.length})`;
      return el("div", { class: "carousel-slide" }, [el("img", { src, alt, loading: "lazy" })]);
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
        onclick: () => { slideIndex = i; update(); },
      })
    )
  );

  const prevBtn = el(
    "button",
    {
      class: "carousel-btn prev",
      type: "button",
      "aria-label": "Previous image",
      onclick: () => { slideIndex = (slideIndex - 1 + imgList.length) % imgList.length; update(); },
    },
    ["‹"]
  );

  const nextBtn = el(
    "button",
    {
      class: "carousel-btn next",
      type: "button",
      "aria-label": "Next image",
      onclick: () => { slideIndex = (slideIndex + 1) % imgList.length; update(); },
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

  return () => document.removeEventListener("keydown", onKeyDown);
}

function openCardModal(card, triggerEl) {
  modal.lastFocus = triggerEl instanceof HTMLElement ? triggerEl : document.activeElement;

  modal.open({
    title: card.title,
    buildBody: (body) => {
      const cleanupCarousel = mountCarousel(body, card);

      if (card.blurb) body.appendChild(el("p", { class: "muted", text: card.blurb }));

      if (card.tools?.length) {
        body.appendChild(el("p", { class: "modal-section-title", text: "Tools / Methods" }));
        body.appendChild(el("div", { class: "skill-list" }, card.tools.map((t) => el("span", { class: "skill-pill", text: t }))));
      }

      if (card.details) {
        body.appendChild(el("p", { class: "modal-section-title", text: "Details" }));
        body.appendChild(el("p", { class: "muted", text: card.details }));
      }

      // Modules: render as scroll-snap cards (interactive without JS)
      if (Array.isArray(card.modules) && card.modules.length) {
        body.appendChild(el("p", { class: "modal-section-title", text: "Modules" }));

        const strip = el("div", { class: "module-strip" });
        for (const m of card.modules) {
          const moduleCard = el("div", { class: "module-card" });

          moduleCard.appendChild(el("p", { class: "module-title", text: m.title }));
          moduleCard.appendChild(el("p", { class: "module-meta muted", text: formatMonthYear(m.date) }));

          const cleanup = mountCarousel(moduleCard, { ...m, title: m.title });
          // cleanup is not strictly necessary because modules are within modal and close triggers global cleanup,
          // but we keep it to avoid dangling listeners.
          // eslint-disable-next-line no-unused-vars
          void cleanup;

          if (m.blurb) moduleCard.appendChild(el("p", { class: "muted", text: m.blurb }));

          if (Array.isArray(m.bullets) && m.bullets.length) {
            moduleCard.appendChild(
              el("ul", { class: "clean" }, m.bullets.map((b) => el("li", {}, [b])))
            );
          }

          if (m.tools?.length) {
            moduleCard.appendChild(
              el("p", { class: "module-tools" }, [
                el("strong", { text: "Tools: " }),
                document.createTextNode(m.tools.join(", "))
              ])
            );
          }

          strip.appendChild(moduleCard);
        }

        body.appendChild(strip);
      }

      if (card.links?.length) {
        body.appendChild(el("p", { class: "modal-section-title", text: "Links" }));
        body.appendChild(
          el(
            "div",
            { class: "project-actions" },
            card.links.map((l) =>
              el("a", { class: "project-link", href: l.url, target: "_blank", rel: "noreferrer", text: `${l.label} →` })
            )
          )
        );
      }

      return () => cleanupCarousel();
    },
  });
}

/* -------------------------
   Renderers
-------------------------- */
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
  const wrap = qs("#skillsGrid");
  wrap.innerHTML = "";

  (SITE.skills || []).forEach((cat, idx) => {
    const det = el("details", { class: "skill-acc" });

    det.appendChild(
      el("summary", {}, [
        el("span", { text: cat.title }),
        el("span", { class: "chev", text: "▾" }),
      ])
    );

    det.appendChild(
      el("div", { class: "skill-list" }, (cat.items || []).map((s) => el("span", { class: "skill-pill", text: s })))
    );

    wrap.appendChild(det);
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

function renderFeatured() {
  const wrap = qs("#featuredWrap");
  if (!wrap) return;

  const featured = (SITE.cards || []).filter((c) => c.featured);
  wrap.innerHTML = "";

  if (!featured.length) {
    wrap.classList.remove("show");
    return;
  }

  wrap.classList.add("show");

  featured
    .sort((a, b) => parseDate(b.date) - parseDate(a.date))
    .forEach((c) => {
      const thumb = c.image ? el("img", { class: "project-thumb", src: c.image, alt: c.imageAlt || c.title, loading: "lazy" }) : null;

      const card = el("div", { class: "project-card" }, [
        ...(thumb ? [thumb] : []),
        el("div", { class: "card-tags" }, [
          el("span", { class: "tag", text: "Featured" }),
          ...(c.tags || []).slice(0, 2).map((t) => el("span", { class: "tag", text: t })),
        ]),
        el("h3", { class: "project-title", text: c.title }),
        ...(c.date ? [el("p", { class: "project-date", text: new Date(c.date).toLocaleDateString() })] : []),
        el("p", { class: "project-desc", text: c.blurb || "" }),
        el("div", { class: "project-actions" }, [
          el("button", { class: "btn-secondary", type: "button", text: "View Details", onclick: (e) => openCardModal(c, e.currentTarget) }),
        ]),
      ]);

      wrap.appendChild(card);
    });
}

function toggleCategory(key) {
  const s = state.activeCategories;

  if (key === "all") {
    s.clear();
    s.add("all");
    return;
  }

  // If selecting anything else, drop "all"
  if (s.has("all")) s.delete("all");

  // Toggle
  if (s.has(key)) s.delete(key);
  else s.add(key);

  // If nothing selected, fall back to All
  if (s.size === 0) s.add("all");
}

function renderFilters() {
  const wrap = qs("#filterContainer");
  wrap.innerHTML = "";

  Object.entries(CATEGORY_LABELS).forEach(([key, label]) => {
    const active = state.activeCategories.has(key);

    wrap.appendChild(
      el("button", {
        class: `filter-btn ${active ? "active" : ""}`,
        type: "button",
        text: label,
        onclick: (e) => {
          e.preventDefault();
          e.stopPropagation(); // keep Refine menu open for multi-select

          toggleCategory(key);
          state.sortMode = "relevance";
          const sortSelect = qs("#projectSort");
          if (sortSelect) sortSelect.value = "relevance";

          renderFilters();
          renderProjects();
          renderRefineHint();
        },
      })
    );
  });
}


function renderRefineHint() {
  const hint = qs("#refineHint");
  if (!hint) return;
  const count = getGridCards().length;
  hint.textContent = `${count} item${count === 1 ? "" : "s"} shown.`;
}

function renderProjects() {
  const grid = qs("#projectsGrid");
  grid.innerHTML = "";

  const visible = getGridCards();

  visible.forEach((c) => {
    const thumb = c.image
      ? el("img", { class: "project-thumb", src: c.image, alt: c.imageAlt || c.title, loading: "lazy" })
      : null;

    const tagLine = el("div", { class: "card-tags" }, [
      ...(c.kind ? [el("span", { class: "tag", text: c.kind })] : []),
      ...(c.tags || []).map((t) => el("span", { class: "tag", text: t })),
    ]);

    const dateLine = c.date ? el("p", { class: "project-date", text: new Date(c.date).toLocaleDateString() }) : null;

    const viewBtn = el("button", {
      class: "btn-secondary",
      type: "button",
      text: "View Details",
      onclick: (e) => openCardModal(c, e.currentTarget),
    });

    const actions = el("div", { class: "project-actions" }, [
      viewBtn,
      ...(c.links || []).slice(0, 2).map((l) =>
        el("a", { class: "project-link", href: l.url, target: "_blank", rel: "noreferrer", text: `${l.label} →` })
      ),
    ]);

    const card = el("div", { class: "project-card" }, [
      ...(thumb ? [thumb] : []),
      tagLine,
      el("h3", { class: "project-title", text: c.title }),
      ...(dateLine ? [dateLine] : []),
      el("p", { class: "project-desc", text: c.blurb || "" }),

      // Show module previews directly on the card (stronger nanofab visibility)
      ...(Array.isArray(c.modules) && c.modules.length
        ? [
            el("p", { class: "card-subtle", text: `Modules: ${c.modules.length}` }),
            el(
              "div",
              { class: "mini-pills" },
              c.modules.slice(0, 4).map((m) => el("span", { class: "mini-pill", text: m.title }))
            ),
          ]
        : []),

      actions,

    ]);

    grid.appendChild(card);
  });

  if (visible.length === 0) {
    grid.appendChild(
      el("div", { class: "project-card" }, [
        el("h3", { class: "project-title", text: "No items match your filters." }),
        el("p", { class: "project-desc", text: "Try another category or remove the search term." }),
      ])
    );
  }
}

/* -------------------------
   Refine dropdown wiring
-------------------------- */
function wireRefineDropdown() {
  const btn = qs("#refineBtn");
  const menu = qs("#refineMenu");
  const wrap = qs("#refineDropdown");
  if (!btn || !menu || !wrap) return;

  function open() { menu.classList.remove("hidden"); btn.setAttribute("aria-expanded", "true"); }
  function close() { menu.classList.add("hidden"); btn.setAttribute("aria-expanded", "false"); }

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const isOpen = !menu.classList.contains("hidden");
    if (isOpen) close();
    else open();
  });

  document.addEventListener("click", (e) => {
    if (!wrap.contains(e.target)) close();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
}

/* -------------------------
   PDF generation
-------------------------- */
function getAllDomains() { return ["ds", "marketing", "nanofab", "cs"]; }
function domainsFromSlider(domainMode) { return domainMode === "nanotech" ? ["nanofab"] : ["ds", "cs", "marketing"]; }

function domainMatches(item, domains) {
  const tags = item?.domains || item?.categories;
  if (!tags || tags.length === 0) return true;
  return tags.some((tag) => domains.includes(tag));
}

function inferTrack(item, section) {
  if (item && typeof item.track === "string") return item.track;
  if (section === "education" || section === "coursework" || section === "research" || section === "labs") return "academic";

  if (section === "experience") {
    const t = normalize(item?.title);
    if (t.includes("assistant") || t.includes("teaching") || t.includes("learning") || t.includes("marker") || t.includes("grader")) return "academic";
    return "industry";
  }

  // projects are mixed; default industry unless nanofab
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

function limitBullets(arr, max) {
  const a = Array.isArray(arr) ? arr : [];
  if (!Number.isFinite(max) || max <= 0) return a;
  return a.slice(0, max);
}

function labToCvBullets(lab) {
  // Prefer explicit cvBullets; otherwise synthesize from module bullets, but do not invent details.
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

function buildResumeHtml(config) {
  const person = SITE.person;

  const isCV = config?.doctype === "cv";
  const domains = isCV ? getAllDomains() : domainsFromSlider(config?.domain);
  const audience = isCV ? "all" : (config?.audience || "industry");

  const showCoursework = isCV ? false : (audience === "academic");
  const showResearch = isCV ? true : (audience === "academic");
  const showLabs = isCV ? true : (audience === "academic" || config?.domain === "nanotech");
  const showExperience = isCV ? true : (audience === "industry");
  const showProjects = true;

  const BUL_RESEARCH = isCV ? 999 : 3;
  const BUL_LABS = isCV ? 999 : 4;
  const BUL_EXP = isCV ? 999 : 3;
  const BUL_EDU = isCV ? 999 : 3;
  const BUL_COURSE = isCV ? 999 : 10;
  const CV_PROJECT_BUL = 2;

  const highlights = Array.isArray(SITE.highlights) ? SITE.highlights.filter(Boolean) : [];
  const highlightsHtml = highlights.length
    ? `<ul class="bullets">${highlights.map((h) => `<li>${escapeHtml(h)}</li>`).join("")}</ul>`
    : "";


  const education = (SITE.education || []).filter((e) => domainMatches(e, domains));
  const coursework = (SITE.coursework || []).filter((c) => domainMatches(c, domains));
  const skills = (SITE.skills || []).filter((s) => domainMatches(s, domains));
  const experience = (SITE.experience || []).filter((x) => domainMatches(x, domains)).filter((x) => trackMatches(x, "experience", audience));

  const researchCards = (SITE.cards || [])
    .filter((c) => c.kind === "research")
    .filter((c) => domainMatches(c, domains))
    .filter((c) => trackMatches(c, "research", audience))
    .sort((a, b) => parseDate(b.date) - parseDate(a.date));

  const labCards = (SITE.cards || [])
    .filter((c) => c.kind === "lab")
    .filter((c) => domainMatches(c, domains))
    .filter((c) => trackMatches(c, "labs", audience))
    .sort((a, b) => parseDate(b.date) - parseDate(a.date));

  const projectCards = (SITE.cards || [])
    .filter((c) => c.kind === "project")
    .filter((c) => domainMatches(c, domains))
    .filter((c) => trackMatches(c, "projects", audience))
    .sort((a, b) => parseDate(b.date) - parseDate(a.date));

  const cfgTitleParts = [];
  cfgTitleParts.push(isCV ? "CV" : "Resume");
  if (!isCV) cfgTitleParts.push(audience === "academic" ? "Academic" : "Industry");
  if (!isCV) cfgTitleParts.push(config?.domain === "nanotech" ? "Nanotech" : "Data Science");
  const cfgTitle = cfgTitleParts.join(" - ");

  const contactHtml = `
    ${person.contact?.email ? `<div>${escapeHtml(person.contact.email)}</div>` : ""}
    ${person.contact?.linkedin ? `<div><a href="${person.contact.linkedin}">${escapeHtml(stripUrl(person.contact.linkedin))}</a></div>` : ""}
    ${person.contact?.github ? `<div><a href="${person.contact.github}">${escapeHtml(stripUrl(person.contact.github))}</a></div>` : ""}
    ${person.contact?.portfolio ? `<div><a href="${person.contact.portfolio}">${escapeHtml(stripUrl(person.contact.portfolio))}</a></div>` : ""}
  `;

  const eduHtml = education.map((e) => `
    <div class="entry">
      <div class="entry-head">
        <div class="entry-title">${escapeHtml(e.title)}</div>
        ${e.meta ? `<div class="entry-meta">${escapeHtml(e.meta)}</div>` : ""}
      </div>
      ${(e.bullets || []).length
        ? `<ul class="bullets">${limitBullets(e.bullets, BUL_EDU).map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>`
        : ""}
    </div>
  `).join("");

  const skillsHtml = isCV
    ? skills.map((cat) => `
        <div class="skillrow">
          <span class="skillrow-title">${escapeHtml(cat.title)}:</span>
          <span class="skillrow-items">${escapeHtml(commaLine(cat.items))}</span>
        </div>
      `).join("")
    : skills.map((cat) => `
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
        ? `<ul class="bullets">${limitBullets(c.bullets, BUL_COURSE).map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>`
        : ""}
    </div>
  `).join("");

  const researchHtml = researchCards.map((r) => `
    <div class="entry">
      <div class="entry-head">
        <div class="entry-title">${escapeHtml(r.title)}</div>
        <div class="entry-meta">${escapeHtml(formatMonthYear(r.date))}</div>
      </div>
      ${(r.cvBullets || r.bullets || []).length
        ? `<ul class="bullets">${limitBullets(r.cvBullets || r.bullets, BUL_RESEARCH).map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>`
        : (r.blurb ? `<div class="desc">${escapeHtml(r.blurb)}</div>` : "")}
    </div>
  `).join("");

  const labsHtml = labCards.map((l) => {
    const bullets = labToCvBullets(l);
    const tools = commaLine(l.tools);

    return `
    <div class="entry">
      <div class="entry-head">
        <div class="entry-title">${escapeHtml(l.title)}</div>
        <div class="entry-meta">${escapeHtml(formatMonthYear(l.date))}</div>
      </div>
      ${bullets.length
        ? `<ul class="bullets">${limitBullets(bullets, BUL_LABS).map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>`
        : (l.blurb ? `<div class="desc">${escapeHtml(l.blurb)}</div>` : "")
      }
      ${tools ? `<div class="tools-commas"><span class="tools-label">Tools:</span> ${escapeHtml(tools)}</div>` : ""}
    </div>
    `;
  }).join("");

  const experienceHtml = experience.map((exp) => `
    <div class="entry">
      <div class="entry-head">
        <div class="entry-title">${escapeHtml(exp.title)}</div>
        ${exp.meta ? `<div class="entry-meta">${escapeHtml(exp.meta)}</div>` : ""}
      </div>
      ${(exp.bullets || []).length
        ? `<ul class="bullets">${limitBullets(exp.bullets, BUL_EXP).map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>`
        : ""}
    </div>
  `).join("");

  const projectsHtmlCv = projectCards.map((p) => {
    const bullets = Array.isArray(p.cvBullets) ? p.cvBullets : [];
    const tools = commaLine(p.tools);

    return `
      <div class="entry">
        <div class="entry-head">
          <div class="entry-title">${escapeHtml(p.title)}</div>
          <div class="entry-meta">${escapeHtml(formatMonthYear(p.date))}</div>
        </div>

        ${bullets.length
          ? `<ul class="bullets">${bullets.slice(0, CV_PROJECT_BUL).map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>`
          : (p.blurb ? `<div class="desc">${escapeHtml(p.blurb)}</div>` : "")
        }

        ${tools ? `<div class="tools-commas"><span class="tools-label">Tools:</span> ${escapeHtml(tools)}</div>` : ""}
      </div>
    `;
  }).join("");

  const projectsHtmlResume = projectCards.map((p) => `
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

  if (isCV) {
    return `
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>${escapeHtml(person.name)} - ${escapeHtml(cfgTitle)}</title>
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
  a { color: var(--text); text-decoration: underline; }
  .page { width: 100%; max-width: 8.5in; margin: 0 auto; }
  .hdr { display:flex; justify-content:space-between; gap:18px; align-items:flex-start; padding-bottom: 10px; border-bottom: 2px solid #111; margin-bottom: 14px; }
  .hdr-left .name { font-size: 22px; font-weight: 900; letter-spacing: -0.3px; line-height: 1.1; }
  .hdr-left .headline { margin-top: 4px; color: var(--muted); font-size: 12px; font-weight: 600; }
  .hdr-right { text-align:right; color: var(--muted); font-size: 10.6px; line-height: 1.45; }
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
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } .page { max-width: none; } }
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

    <div class="section">
      <div class="stitle">Education</div>
      ${eduHtml}
    </div>

    ${researchHtml ? `<div class="section"><div class="stitle">Research</div>${researchHtml}</div>` : ""}

    ${labsHtml ? `<div class="section"><div class="stitle">Technical Experience</div>${labsHtml}</div>` : ""}

    ${projectsHtmlCv ? `<div class="section"><div class="stitle">Projects</div>${projectsHtmlCv}</div>` : ""}

    ${experienceHtml ? `<div class="section"><div class="stitle">Teaching and Leadership</div>${experienceHtml}</div>` : ""}

    <div class="section">
      <div class="stitle">Skills</div>
      ${skillsHtml}
    </div>

    ${showCoursework && courseHtml ? `<div class="section"><div class="stitle">Coursework</div>${courseHtml}</div>` : ""}

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

  return `
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>${escapeHtml(person.name)} - ${escapeHtml(cfgTitle)}</title>
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
  .header { border-bottom: 2px solid #111; padding-bottom: 10px; margin-bottom: 12px; display:flex; justify-content:space-between; gap:18px; align-items:flex-start; }
  .name { font-size: 22px; font-weight: 900; line-height: 1.1; letter-spacing: -0.3px; }
  .headline { font-size: 12px; color: var(--muted); margin-top: 4px; font-weight: 600; }
  .contact { text-align: right; font-size: 10.6px; line-height: 1.45; color: var(--muted); }
  .grid { display: grid; grid-template-columns: 2.35in 1fr; gap: 0.35in; align-items: start; }
  .section { margin: 0 0 12px 0; break-inside: avoid; page-break-inside: avoid; }
  .stitle {
    font-size: 10.8px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.08em;
    color: var(--accent); border-bottom: 1px solid var(--line); padding-bottom: 4px; margin-bottom: 8px;
  }
  .entry { margin: 0 0 10px 0; break-inside: avoid; page-break-inside: avoid; }
  .entry-head { display:flex; justify-content:space-between; align-items:baseline; gap:12px; }
  .entry-title { font-weight: 800; font-size: 12px; }
  .entry-meta { color: var(--muted); font-style: italic; font-size: 10.5px; text-align:right; }
  .desc { margin-top: 3px; color:#374151; }
  .bullets { margin: 4px 0 0 16px; padding: 0; color:#374151; }
  .bullets li { margin: 0 0 2px 0; }
  .pillwrap { display:flex; flex-wrap:wrap; gap:4px; }
  .pill { background:#f3f4f6; border: 1px solid var(--line); border-radius: 4px; padding: 1px 6px; font-size: 9.4px; color:#374151; font-weight: 600; }
  .pill-soft { background: transparent; }
  .skillblock { margin-bottom: 10px; }
  .skillblock-title { font-weight: 900; font-size: 11px; margin-bottom: 4px; color:#111; }
  .toolsline { margin-top: 5px; }
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } .page { max-width: none; } }
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

        ${showCoursework && courseHtml ? `<div class="section"><div class="stitle">Coursework</div>${courseHtml}</div>` : ""}
      </div>

      <div class="right">
        <div class="section">
          <div class="stitle">Summary</div>
          <div class="desc">${escapeHtml(person.summary)}</div>
        </div>

        ${showResearch && researchHtml ? `<div class="section"><div class="stitle">Research</div>${researchHtml}</div>` : ""}

        ${showLabs && labsHtml ? `<div class="section"><div class="stitle">Technical Experience</div>${labsHtml}</div>` : ""}

        ${showProjects && projectsHtmlResume ? `<div class="section"><div class="stitle">Projects</div>${projectsHtmlResume}</div>` : ""}

        ${showExperience && experienceHtml ? `<div class="section"><div class="stitle">Work Experience</div>${experienceHtml}</div>` : ""}
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

/* -------------------------
   PDF controls wiring (existing)
-------------------------- */
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
    if (isCV) hint.textContent = "CV mode: single-column output; Focus/Target disabled.";
    else {
      const focus = cfg.domain === "nanotech" ? "Nanotech" : "Data Science";
      const target = cfg.audience === "academic" ? "Academic" : "Industry";
      hint.textContent = `Resume mode: ${target} - ${focus}.`;
    }
  }
}

function closeDropdown(ddMenuId, ddBtnId) {
  const menu = qs(ddMenuId);
  const btn = qs(ddBtnId);
  if (!menu || !btn) return;
  menu.classList.add("hidden");
  btn.setAttribute("aria-expanded", "false");
}

function wirePdfControls() {
  const controls = qs("#pdfDdMenu");
  if (!controls) return;

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

    const safePrint = async () => {
      try {
        if (win.document?.fonts?.ready) await win.document.fonts.ready;
      } catch {}
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

    let fired = false;
    iframe.onload = () => {
      if (fired) return;
      fired = true;
      safePrint();
    };
    setTimeout(() => {
      if (fired) return;
      fired = true;
      safePrint();
    }, 60);

    closeDropdown("#pdfDdMenu", "#pdfDdBtn");
  });

  // PDF dropdown open/close
  const ddBtn = qs("#pdfDdBtn");
  const ddMenu = qs("#pdfDdMenu");
  const ddWrap = qs("#pdfDropdown");

  if (ddBtn && ddMenu && ddWrap) {
    function openMenu() { ddMenu.classList.remove("hidden"); ddBtn.setAttribute("aria-expanded", "true"); }
    function closeMenu() { ddMenu.classList.add("hidden"); ddBtn.setAttribute("aria-expanded", "false"); }

    ddBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const isOpen = !ddMenu.classList.contains("hidden");
      if (isOpen) closeMenu();
      else openMenu();
    });

    document.addEventListener("click", (e) => {
      if (!ddWrap.contains(e.target)) closeMenu();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });
  }
}

/* -------------------------
   Init
-------------------------- */
function init() {
  renderHeader();
  renderSkills();
  renderTimeline("experienceList", SITE.experience);
  renderTimeline("courseworkList", SITE.coursework);
  renderTimeline("educationList", SITE.education);

  renderFeatured();
  renderFilters();
  renderProjects();
  renderRefineHint();

  const projectSearch = qs("#projectSearch");
  if (projectSearch) {
    projectSearch.addEventListener("input", (e) => {
      state.searchQuery = e.target.value || "";
      state.sortMode = "relevance";
      const sortSelect = qs("#projectSort");
      if (sortSelect) sortSelect.value = "relevance";
      renderProjects();
      renderRefineHint();
    });
  }

  const projectSort = qs("#projectSort");
  if (projectSort) {
    projectSort.addEventListener("change", (e) => {
      state.sortMode = e.target.value;
      renderProjects();
      renderRefineHint();
    });
  }


  // Modal close
  modal.closeBtn.addEventListener("click", () => modal.close());
  modal.backdrop.addEventListener("click", (e) => { if (e.target === modal.backdrop) modal.close(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") modal.close(); });

  // PDF controls defaults
  state.pdfConfig.domain = "ds";
  state.pdfConfig.audience = "industry";
  state.pdfConfig.doctype = "resume";
  wirePdfControls();
  renderPdfControls();

  // Refine dropdown
  wireRefineDropdown();
}

init();
