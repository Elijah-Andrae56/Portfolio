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
    focus: "process", // or "ds"
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
   PDF generation — delegates to resume-builder.js / cv-builder.js
-------------------------- */
function dispatchBuild(config) {
  return config?.doctype === "cv" ? buildCvHtml(config) : buildResumeHtml(config);
}

/* -------------------------
   PDF controls wiring
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

  dl.addEventListener("click", (e) => {
    e.preventDefault();
    closeDropdown("#pdfDdMenu", "#pdfDdBtn");

    const html = dispatchBuild(state.pdfConfig);

    // Open a real popup window so Chrome's print engine has a proper rendering
    // context — a 0×0 iframe causes Chrome to rasterize instead of vector-text.
    const printWin = window.open(
      "",
      "_blank",
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
  state.pdfConfig.focus = "process"; // Changed from 'domain' to 'focus'
  state.pdfConfig.doctype = "resume";
  wirePdfControls();
  renderPdfControls(); 

  // Refine dropdown
  wireRefineDropdown();
}

init();
