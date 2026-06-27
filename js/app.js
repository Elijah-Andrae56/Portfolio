// app.js
import { SITE, CATEGORY_LABELS } from "./data.js";
import { buildResumeHtml } from "./resume-builder.js";
import { buildCvHtml } from "./cv-builder.js";

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

function formatMonthYear(isoDate) {
  if (!isoDate) return "";
  const d = new Date(isoDate);
  if (!Number.isFinite(d.getTime())) return "";
  return new Intl.DateTimeFormat(undefined, { year: "numeric", month: "short" }).format(d);
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
  activeCategories: new Set(["all"]),
  searchQuery: "",
  sortMode: "relevance",
  pdfConfig: { focus: "process", doctype: "resume" },
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
    case "date_asc":  return parseDate(a.date) - parseDate(b.date);
    case "date_desc": return parseDate(b.date) - parseDate(a.date);
    case "title_asc": return a.title.localeCompare(b.title);
    case "title_desc": return b.title.localeCompare(a.title);
    default: return 0;
  }
}

/* -------------------------
   Filters
-------------------------- */
function categoryMatches(card) {
  const selected = state.activeCategories;
  if (selected.has("all") || selected.size === 0) return true;
  const kindSelected = ["research", "lab", "project"].filter((k) => selected.has(k));
  if (kindSelected.length && !kindSelected.includes(card.kind)) return false;
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
function getVisibleCards() {
  return (SITE.cards || [])
    .filter(categoryMatches)
    .filter(searchMatches)
    .sort(compareCards);
}
function getGridCards() {
  return getVisibleCards().filter((c) => !c.featured);
}

/* -------------------------
   Reading view (modal)
-------------------------- */
const modal = {
  backdrop: qs("#modalBackdrop"),
  title: qs("#modalTitle"),
  body: qs("#modalBody"),
  closeBtn: qs("#modalCloseBtn"),
  cleanup: null,
  lastFocus: null,

  isOpen() { return this.backdrop.getAttribute("aria-hidden") === "false"; },

  open({ title, buildBody }) {
    this.lastFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    this.title.textContent = title;
    this.body.innerHTML = "";
    if (typeof this.cleanup === "function") this.cleanup();
    this.cleanup = null;
    const cleanupFn = buildBody?.(this.body);
    if (typeof cleanupFn === "function") this.cleanup = cleanupFn;
    this.backdrop.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    this.closeBtn.focus();
  },

  close() {
    if (typeof this.cleanup === "function") this.cleanup();
    this.cleanup = null;
    this.backdrop.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
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
  const track = el("div", { class: "carousel-track" },
    imgList.map((src, i) => {
      const altBase = obj.imageAlt || obj.title || "Image";
      return el("div", { class: "carousel-slide" }, [
        el("img", { src, alt: `${altBase} (${i + 1}/${imgList.length})`, loading: "lazy" }),
      ]);
    })
  );
  const viewport = el("div", { class: "carousel-viewport" }, [track]);
  const dotsWrap = el("div", { class: "carousel-dots" },
    imgList.map((_, i) =>
      el("button", {
        class: `carousel-dot ${i === 0 ? "active" : ""}`,
        type: "button",
        "aria-label": `Go to image ${i + 1}`,
        onclick: () => { slideIndex = i; update(); },
      })
    )
  );
  const prevBtn = el("button", {
    class: "carousel-btn prev", type: "button", "aria-label": "Previous image",
    onclick: () => { slideIndex = (slideIndex - 1 + imgList.length) % imgList.length; update(); },
  }, ["‹"]);
  const nextBtn = el("button", {
    class: "carousel-btn next", type: "button", "aria-label": "Next image",
    onclick: () => { slideIndex = (slideIndex + 1) % imgList.length; update(); },
  }, ["›"]);

  const carousel = el("div", { class: "carousel" }, [
    viewport,
    ...(imgList.length > 1 ? [prevBtn, nextBtn, dotsWrap] : []),
  ]);
  container.appendChild(carousel);

  function update() {
    track.style.transform = `translateX(-${slideIndex * 100}%)`;
    dotsWrap.querySelectorAll(".carousel-dot").forEach((d, idx) =>
      d.classList.toggle("active", idx === slideIndex));
  }

  const onKeyDown = (e) => {
    if (!modal.isOpen()) return;
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
        body.appendChild(el("div", { class: "skill-list" },
          card.tools.map((t) => el("span", { class: "chip", text: t }))));
      }
      if (card.details) {
        body.appendChild(el("p", { class: "modal-section-title", text: "Details" }));
        body.appendChild(el("p", { text: card.details }));
      }
      if (Array.isArray(card.modules) && card.modules.length) {
        body.appendChild(el("p", { class: "modal-section-title", text: "Modules" }));
        const strip = el("div", { class: "module-strip" });
        for (const m of card.modules) {
          const moduleCard = el("div", { class: "module-card" });
          moduleCard.appendChild(el("p", { class: "module-title", text: m.title }));
          moduleCard.appendChild(el("p", { class: "module-meta", text: formatMonthYear(m.date) }));
          mountCarousel(moduleCard, { ...m, title: m.title });
          if (m.blurb) moduleCard.appendChild(el("p", { class: "muted", text: m.blurb }));
          if (Array.isArray(m.bullets) && m.bullets.length) {
            moduleCard.appendChild(el("ul", { class: "clean" }, m.bullets.map((b) => el("li", {}, [b]))));
          }
          if (m.tools?.length) {
            moduleCard.appendChild(el("p", { class: "module-tools" }, [
              el("strong", { text: "Tools: " }),
              document.createTextNode(m.tools.join(", ")),
            ]));
          }
          strip.appendChild(moduleCard);
        }
        body.appendChild(strip);
      }
      if (card.links?.length) {
        body.appendChild(el("p", { class: "modal-section-title", text: "Links" }));
        body.appendChild(el("div", { class: "project-actions" },
          card.links.map((l) =>
            el("a", { class: "project-link", href: l.url, target: "_blank", rel: "noreferrer", text: `${l.label} →` })
          )
        ));
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
    headshotWrap.appendChild(el("img", {
      class: "headshot",
      src: SITE.person.photo,
      alt: SITE.person.photoAlt || SITE.person.name,
      loading: "eager",
    }));
  }

  const domainWrap = qs("#domainTags");
  domainWrap.innerHTML = "";
  SITE.person.domains.forEach((d) =>
    domainWrap.appendChild(el("span", { class: "domain-tag", text: d })));

  renderSocialLinks("#socialLinks");
  renderSocialLinks("#socialLinksFooter");

  qs("#summaryText").textContent = SITE.person.summary;

  const footer = qs("#footer");
  if (footer) footer.textContent = `© ${new Date().getFullYear()} ${SITE.person.name}`;
}

function renderSocialLinks(selector) {
  const wrap = qs(selector);
  if (!wrap) return;
  wrap.innerHTML = "";
  const c = SITE.person.contact || {};
  if (c.email)     wrap.appendChild(el("a", { class: "social-link", href: `mailto:${c.email}`, text: "Email" }));
  if (c.linkedin)  wrap.appendChild(el("a", { class: "social-link", href: c.linkedin, target: "_blank", rel: "noreferrer", text: "LinkedIn" }));
  if (c.github)    wrap.appendChild(el("a", { class: "social-link", href: c.github, target: "_blank", rel: "noreferrer", text: "GitHub" }));
  if (c.portfolio) wrap.appendChild(el("a", { class: "social-link", href: c.portfolio, target: "_blank", rel: "noreferrer", text: "Portfolio" }));
}

function renderHighlights() {
  const wrap = qs("#highlightsList");
  if (!wrap || !Array.isArray(SITE.highlights)) return;
  wrap.innerHTML = "";
  SITE.highlights.forEach((h) => wrap.appendChild(el("li", { text: h })));
}

function buildStageArrow() {
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", "0 0 48 14");
  svg.setAttribute("width", "48");
  svg.setAttribute("height", "14");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "1.3");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  const path = document.createElementNS(ns, "path");
  path.setAttribute("d", "M2 7 L44 7 M38 2 L44 7 L38 12");
  svg.appendChild(path);
  const wrap = el("div", { class: "stage-arrow", "aria-hidden": "true" });
  wrap.appendChild(svg);
  return wrap;
}

function renderPipeline() {
  const wrap = qs("#skillsGrid");
  if (!wrap) return;
  wrap.innerHTML = "";
  const stages = SITE.pipeline || [];

  stages.forEach((stage, i) => {
    const groups = (stage.groups || []).map((g) =>
      el("div", { class: "stage-group" }, [
        el("p", { class: "group-name mono", text: g.name }),
        el("div", { class: "group-chips" },
          (g.items || []).map((it) => el("span", { class: "chip", text: it }))),
      ])
    );

    const article = el("article", { class: "stage", "data-stage": stage.id }, [
      el("header", { class: "stage-head" }, [
        el("p", { class: "stage-num mono", text: stage.stage }),
        el("p", { class: "stage-role mono", text: stage.role }),
        el("h3", { class: "stage-title", text: stage.title }),
        el("p", { class: "stage-deck", text: stage.deck }),
      ]),
      el("div", { class: "stage-groups" }, groups),
    ]);
    wrap.appendChild(article);

    if (i < stages.length - 1) {
      wrap.appendChild(buildStageArrow());
    }
  });
}

function renderTimeline(targetId, items) {
  const wrap = qs(`#${targetId}`);
  if (!wrap) return;
  wrap.innerHTML = "";
  items.forEach((it) => {
    const meta = it.meta || "";
    const pipeIdx = meta.indexOf("|");
    let dateStr = "", orgLoc = "";
    if (pipeIdx > -1) {
      orgLoc = meta.slice(0, pipeIdx).trim();
      dateStr = meta.slice(pipeIdx + 1).trim();
    } else {
      orgLoc = meta;
    }

    const article = el("article", { class: "trajectory-item" }, [
      ...(dateStr ? [el("p", { class: "ti-date mono", text: dateStr })] : []),
      el("h4", { class: "ti-title", text: it.title }),
      ...(orgLoc ? [el("p", { class: "ti-org", text: orgLoc })] : []),
      ...(it.bullets?.length
        ? [el("ul", { class: "clean ti-bullets" }, it.bullets.map((b) => el("li", {}, [b])))]
        : []),
    ]);
    wrap.appendChild(article);
  });
}

function renderCurriculum() {
  const wrap = qs("#courseworkList");
  if (!wrap) return;
  wrap.innerHTML = "";
  (SITE.coursework || []).forEach((col, idx) => {
    const card = el("article", { class: "col-card" }, [
      el("p", { class: "col-num mono", text: String(idx + 1).padStart(2, "0") }),
      el("h3", { class: "col-title", text: col.title }),
      el("ul", { class: "clean col-list" }, (col.bullets || []).map((b) => el("li", {}, [b]))),
    ]);
    wrap.appendChild(card);
  });
}

function renderFeatured() {
  const wrap = qs("#featuredWrap");
  if (!wrap) return;
  const featured = (SITE.cards || []).filter((c) => c.featured);
  wrap.innerHTML = "";
  if (!featured.length) { wrap.classList.remove("show"); return; }
  wrap.classList.add("show");

  const c = featured.sort((a, b) => parseDate(b.date) - parseDate(a.date))[0];
  const figure = c.image
    ? el("img", { class: "lead-image", src: c.image, alt: c.imageAlt || c.title, loading: "lazy" })
    : el("div", { class: "lead-image" });

  const body = el("div", {}, [
    el("p", { class: "lead-eyebrow mono", text: "Featured" }),
    el("h3", { class: "lead-title", text: c.title }),
    el("p", { class: "lead-blurb", text: c.blurb || "" }),
    el("div", { class: "lead-meta" }, [
      el("p", { class: "lead-tools mono", text: (c.tools || []).slice(0, 5).join(" · ") }),
    ]),
    el("button", {
      class: "btn-read", type: "button", text: "Read more →",
      onclick: (e) => openCardModal(c, e.currentTarget),
    }),
  ]);

  wrap.appendChild(el("article", { class: "lead-article-card" }, [figure, body]));
}

function toggleCategory(key) {
  const s = state.activeCategories;
  if (key === "all") { s.clear(); s.add("all"); return; }
  if (s.has("all")) s.delete("all");
  if (s.has(key)) s.delete(key); else s.add(key);
  if (s.size === 0) s.add("all");
}

function renderFilters() {
  const wrap = qs("#filterContainer");
  wrap.innerHTML = "";
  Object.entries(CATEGORY_LABELS).forEach(([key, label]) => {
    const active = state.activeCategories.has(key);
    wrap.appendChild(el("button", {
      class: `filter-btn ${active ? "active" : ""}`,
      type: "button",
      text: label,
      onclick: (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleCategory(key);
        state.sortMode = "relevance";
        const sortSelect = qs("#projectSort");
        if (sortSelect) sortSelect.value = "relevance";
        renderFilters();
        renderProjects();
        renderRefineHint();
      },
    }));
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
    const hasMedia = !!c.image;
    const eyebrow = [c.kind, c.date ? formatMonthYear(c.date) : ""].filter(Boolean).join(" · ");

    const media = hasMedia
      ? el("div", {
          class: "card-media",
          onclick: (e) => openCardModal(c, e.currentTarget),
        }, [
          el("img", { class: "card-thumb", src: c.image, alt: c.imageAlt || c.title, loading: "lazy" }),
          el("div", { class: "card-overlay" }, [
            ...(c.tools?.length
              ? [el("p", { class: "card-tools mono", text: c.tools.slice(0, 5).join(" · ") })]
              : []),
            el("button", {
              class: "card-read",
              type: "button",
              text: "Read more →",
              onclick: (e) => { e.stopPropagation(); openCardModal(c, e.currentTarget); },
            }),
          ]),
        ])
      : null;

    const card = el("article", {
      class: `work-card${hasMedia ? "" : " no-media"}`,
      "data-kind": c.kind || "",
    }, [
      ...(media ? [media] : []),
      el("p", { class: "card-eyebrow mono", text: eyebrow }),
      el("h3", { class: "card-title", text: c.title, onclick: (e) => openCardModal(c, e.currentTarget) }),
      el("p", { class: "card-blurb", text: c.blurb || "" }),
      ...(c.tools?.length && !hasMedia
        ? [el("p", { class: "card-tools-inline mono", text: c.tools.slice(0, 5).join(" · ") })]
        : []),
      ...(Array.isArray(c.modules) && c.modules.length
        ? [el("p", { class: "card-modules mono", text: `${c.modules.length} modules · ${c.modules.slice(0, 2).map(m => m.title).join(", ")}…` })]
        : []),
      ...(!hasMedia ? [el("button", {
        class: "card-read inline",
        type: "button",
        text: "Read more →",
        onclick: (e) => openCardModal(c, e.currentTarget),
      })] : []),
    ]);
    grid.appendChild(card);
  });

  if (visible.length === 0) {
    grid.appendChild(el("article", { class: "work-card empty" }, [
      el("h3", { class: "card-title", text: "No items match your filters." }),
      el("p", { class: "card-blurb", text: "Try another category or remove the search term." }),
    ]));
  }
}

/* -------------------------
   Sticky rail / reveal / parallax
-------------------------- */
function wireRail() {
  const rail = qs(".rail");
  if (!rail) return;
  const links = Array.from(rail.querySelectorAll("a[href^='#']"));
  const sections = links
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);
  if (!("IntersectionObserver" in window)) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const id = e.target.id;
      links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + id));
    });
  }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });

  sections.forEach((s) => io.observe(s));
}

function wireReveals() {
  const els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) {
    els.forEach((e) => e.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
  els.forEach((e) => io.observe(e));
}

function wireParallax() {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const head = qs("#headshotWrap");
  if (!head) return;
  let raf = null;
  const onScroll = () => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      const y = Math.min(window.scrollY, 700);
      head.style.transform = `translateY(${(y * 0.14).toFixed(1)}px)`;
      raf = null;
    });
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* -------------------------
   Refine dropdown wiring
-------------------------- */
function wireRefineDropdown() {
  const btn = qs("#refineBtn");
  const menu = qs("#refineMenu");
  const wrap = qs("#refineDropdown");
  if (!btn || !menu || !wrap) return;

  const open  = () => { menu.classList.remove("hidden"); btn.setAttribute("aria-expanded", "true"); };
  const close = () => { menu.classList.add("hidden");    btn.setAttribute("aria-expanded", "false"); };

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    if (menu.classList.contains("hidden")) open(); else close();
  });
  document.addEventListener("click", (e) => { if (!wrap.contains(e.target)) close(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
}

/* -------------------------
   PDF generation
-------------------------- */
function dispatchBuild(config) {
  return config?.doctype === "cv" ? buildCvHtml(config) : buildResumeHtml(config);
}

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
  const disableGroups = isCV ? new Set(["focus"]) : new Set();
  btns.forEach((b) => {
    const g = b.getAttribute("data-group");
    const shouldDisable = disableGroups.has(g);
    b.disabled = shouldDisable;
    b.classList.toggle("disabled", shouldDisable);
  });
  if (hint) {
    if (isCV) hint.textContent = "CV mode: comprehensive output; Focus disabled.";
    else {
      const focusLabel = cfg.focus === "process" ? "Process Engineering" : "Data Science";
      hint.textContent = `Resume mode: ${focusLabel}.`;
    }
  }
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
  dl.addEventListener("click", (e) => {
    e.preventDefault();
    const ddMenu = qs("#pdfDdMenu");
    const ddBtn = qs("#pdfDdBtn");
    if (ddMenu) ddMenu.classList.add("hidden");
    if (ddBtn) ddBtn.setAttribute("aria-expanded", "false");

    const html = dispatchBuild(state.pdfConfig);
    const printWin = window.open(
      "", "_blank",
      "width=900,height=700,menubar=no,toolbar=no,location=no,scrollbars=yes,resizable=yes"
    );
    if (!printWin) {
      alert("Pop-ups are blocked. Please allow pop-ups for this site and try again.");
      return;
    }
    printWin.document.open();
    printWin.document.write(html);
    printWin.document.close();
  });

  const ddBtn = qs("#pdfDdBtn");
  const ddMenu = qs("#pdfDdMenu");
  const ddWrap = qs("#pdfDropdown");
  if (ddBtn && ddMenu && ddWrap) {
    const openMenu  = () => { ddMenu.classList.remove("hidden"); ddBtn.setAttribute("aria-expanded", "true"); };
    const closeMenu = () => { ddMenu.classList.add("hidden");    ddBtn.setAttribute("aria-expanded", "false"); };
    ddBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (ddMenu.classList.contains("hidden")) openMenu(); else closeMenu();
    });
    document.addEventListener("click", (e) => { if (!ddWrap.contains(e.target)) closeMenu(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });
  }
}

/* -------------------------
   Init
-------------------------- */
function init() {
  renderHeader();
  renderPipeline();
  renderTimeline("experienceList", SITE.experience);
  renderTimeline("educationList", SITE.education);
  renderCurriculum();

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
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && modal.isOpen()) modal.close(); });

  // PDF defaults
  state.pdfConfig.focus = "process";
  state.pdfConfig.doctype = "resume";
  wirePdfControls();
  renderPdfControls();

  wireRefineDropdown();

  // Layout / motion
  wireRail();
  wireReveals();
  wireParallax();
}

init();
