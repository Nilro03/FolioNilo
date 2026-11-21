/* =====================================================
   Portfolio — rendering and interactions
   Content lives in /data/*.json; pictures in /images.
   ===================================================== */

const DATA = {
  profile: "data/profile.json",
  projects: "data/projects.json",
  events: "data/events.json",
  certificates: "data/certificates.json"
};

const $ = id => document.getElementById(id);

/* Font Awesome Free icons used by the script (change freely) */
const ICON = {
  arrowRight: "fa-solid fa-arrow-right",
  open: "fa-solid fa-arrow-right",        /* rotated to point up-right in CSS */
  external: "fa-solid fa-arrow-up-right-from-square"
};
const icon = cls => `<i class="${cls}" aria-hidden="true"></i>`;

/* Build an element from an HTML string, then fill text safely */
function el(html) {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}
function setText(root, map) {
  for (const sel in map) root.querySelector(sel).textContent = map[sel];
}
function chips(list, items) {
  items.forEach(t => {
    const li = document.createElement("li");
    li.textContent = t;
    list.appendChild(li);
  });
}

/* Warm placeholder if an image file is missing */
const PLACEHOLDER = "data:image/svg+xml;utf8," + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect width="800" height="600" fill="#E5D9CA"/><text x="400" y="310" font-family="Inter,system-ui,sans-serif" font-size="22" letter-spacing="4" fill="#6B574B" text-anchor="middle">IMAGE COMING SOON</text></svg>'
);
/* Pictures are sorted by type: images/projects, images/events, images/certificates */
const IMG = { projects: "images/projects/", events: "images/events/", certificates: "images/certificates/" };
function makeImg(file, alt, folder = "") {
  const img = document.createElement("img");
  img.src = folder + file;
  img.alt = alt;
  img.loading = "lazy";
  img.onerror = () => { img.onerror = null; img.src = PLACEHOLDER; };
  return img;
}

/* ---------- Sections ---------- */

function renderStats(stats, projects) {
  stats.forEach(s => {
    const value = s.value === "auto:projects" ? String(projects.length) : s.value;
    const d = el('<div><b></b><span class="meta"></span></div>');
    setText(d, { b: value, span: s.label });
    $("stats").appendChild(d);
  });
}

function renderPillars(pillars) {
  pillars.forEach(p => {
    const d = el(`<div><span class="ic">${icon(p.icon || "fa-solid fa-star")}</span><h3></h3><p></p></div>`);
    setText(d, { h3: p.title, p: p.text });
    $("pillars").appendChild(d);
  });
}

function renderProjects(projects) {
  const featured = projects.find(p => p.featured) || projects[0];
  const rest = projects.filter(p => p !== featured);
  $("workIntro").textContent = `${projects.length} projects from my subjects and industrial training at UiTM. Open any project for the full write-up, tools and gallery.`;

  if (featured) {
    const c = el(`<button type="button" class="card featured">
      <div class="media"></div>
      <div class="body">
        <div class="tags"><span class="tag"></span><span class="meta date"></span></div>
        <h3></h3><p class="sum"></p><ul class="stack"></ul>
        <span class="read">Read case study ${icon(ICON.arrowRight)}</span>
      </div></button>`);
    c.querySelector(".media").appendChild(makeImg(featured.cover || featured.images[0], featured.title + " project cover", IMG.projects));
    setText(c, { ".tag": featured.course, ".date": featured.date, h3: featured.title, ".sum": featured.summary });
    chips(c.querySelector(".stack"), featured.tech || []);
    c.setAttribute("aria-label", "Read case study: " + featured.title);
    c.addEventListener("click", () => openModal(featured, true));
    $("featured").appendChild(c);
  }

  rest.forEach(p => {
    const c = el(`<button type="button" class="card">
      <div class="media"><span class="badge">${icon(ICON.open)}</span></div>
      <div class="body">
        <div class="row meta"><span class="course"></span><span class="date"></span></div>
        <h3></h3><p class="sum"></p><ul class="stack"></ul>
      </div></button>`);
    c.querySelector(".media").prepend(makeImg(p.cover || p.images[0], p.title + " project cover", IMG.projects));
    setText(c, { ".course": p.course, ".date": p.date, h3: p.title, ".sum": p.summary });
    chips(c.querySelector(".stack"), p.tech || []);
    c.setAttribute("aria-label", "View project: " + p.title);
    c.addEventListener("click", () => openModal(p, true));
    $("projectGrid").appendChild(c);
  });
}

function renderSkills(skills) {
  skills.forEach(g => {
    const d = el(`<div><h3><span class="ic">${icon(g.icon || "fa-solid fa-circle")}</span><span class="g"></span></h3><ul></ul></div>`);
    d.querySelector(".g").textContent = g.group;
    if (g.wide) d.classList.add("wide");   /* full-width strip under the tool cards */
    chips(d.querySelector("ul"), g.items);
    $("skills").appendChild(d);
  });
}

function renderRoles(roles) {
  roles.forEach(r => {
    const d = el('<div class="line-row role-row"><div><span class="t"></span><span class="o"></span></div><span class="when meta"></span></div>');
    setText(d, { ".t": r.title, ".o": r.org, ".when": r.date });
    $("roles").appendChild(d);
  });
}

function renderEvents(events) {
  events.forEach(e => {
    const d = el(`<button type="button" class="line-row event-row"><span class="cat meta"></span><span><span class="t"></span><span class="r"></span></span><span class="go">${icon(ICON.open)}</span></button>`);
    setText(d, { ".cat": e.category, ".t": e.title, ".r": e.role + " · " + e.date });
    d.setAttribute("aria-label", "View details: " + e.title);
    d.addEventListener("click", () => openModal(e, false));
    $("events").appendChild(d);
  });
}

function renderCertificates(certs) {
  certs.forEach(c => {
    const d = el(`<button type="button" class="cert-row"><span class="y"></span><span><span class="t"></span><span class="i"></span></span><span class="go">${icon(ICON.open)}</span></button>`);
    setText(d, { ".y": c.date, ".t": c.title, ".i": c.issuer });
    d.setAttribute("aria-label", "View certificate: " + c.title);
    d.addEventListener("click", () => openLightbox(IMG.certificates + c.image, c.title + " certificate", c.title + " · " + c.issuer));
    $("certs").appendChild(d);
  });
}

/* ---------- Details window ---------- */

const modal = $("modal");
function openModal(item, isProject) {
  setText(modal, { "#m-title": item.title, "#m-role": item.role, "#m-date": item.date });

  const ul = $("m-points");
  ul.innerHTML = "";
  chips(ul, item.points || []);

  const tech = $("m-tech");
  tech.innerHTML = "";
  chips(tech, item.tech || []);
  tech.hidden = !(item.tech && item.tech.length);

  const links = $("m-links");
  links.innerHTML = "";
  const real = (item.links || []).filter(l => l.url);
  real.forEach(l => {
    const a = el(`<a class="btn ghost sm" target="_blank" rel="noopener"><span></span> ${icon(ICON.external)}</a>`);
    a.href = l.url;
    a.querySelector("span").textContent = l.label;
    links.appendChild(a);
  });
  links.hidden = !real.length;

  /* Projects use "contain" so charts and screenshots are not cropped */
  const g = $("m-gallery");
  g.innerHTML = "";
  g.classList.toggle("fit", !!isProject);
  (item.images || []).forEach((f, i) => {
    const b = el('<button type="button"></button>');
    const img = makeImg(f, item.title + " picture " + (i + 1), isProject ? IMG.projects : IMG.events);
    b.setAttribute("aria-label", "Enlarge picture " + (i + 1));
    b.appendChild(img);
    b.addEventListener("click", () => openLightbox(img.currentSrc || img.src, img.alt, item.title));
    g.appendChild(b);
  });

  modal.showModal();
  modal.scrollTop = 0;
}
$("close").addEventListener("click", () => modal.close());
modal.addEventListener("click", ev => { if (ev.target === modal) modal.close(); });

/* ---------- Picture viewer ---------- */

const lightbox = $("lightbox");
function openLightbox(src, alt, caption) {
  const img = $("lbImg");
  img.onerror = () => { img.onerror = null; img.src = PLACEHOLDER; };
  img.src = src;
  img.alt = alt;
  $("lbCap").textContent = caption || "";
  lightbox.showModal();
}
lightbox.addEventListener("click", () => lightbox.close());

/* ---------- Theme ---------- */

const themeBtn = $("themeToggle");
function applyTheme(t) {
  document.documentElement.setAttribute("data-theme", t);
  themeBtn.setAttribute("aria-checked", String(t === "dark"));
}
applyTheme(document.documentElement.getAttribute("data-theme") || "light");
themeBtn.addEventListener("click", () => {
  const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(next);
  try { localStorage.setItem("theme", next); } catch (e) {}
});

/* ---------- Mobile menu ---------- */

const menuToggle = $("menuToggle");
const mainMenu = $("mainMenu");
function setMenu(open) {
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
  mainMenu.classList.toggle("open", open);
}
menuToggle.addEventListener("click", () => setMenu(menuToggle.getAttribute("aria-expanded") !== "true"));
mainMenu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });
addEventListener("resize", () => { if (innerWidth > 960) setMenu(false); });

/* ---------- Active nav link ---------- */

const navLinks = [...mainMenu.querySelectorAll("a")];
const navSecs = navLinks.map(a => document.querySelector(a.getAttribute("href")));
function onScroll() {
  let current = -1;
  navSecs.forEach((s, i) => { if (s.getBoundingClientRect().top < 140) current = i; });
  /* Contact isn't in the menu: clear the highlight once it fills the view */
  if ($("contact").getBoundingClientRect().top < innerHeight * 0.5) current = -1;
  navLinks.forEach((a, i) => a.classList.toggle("active", i === current));
}
addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ---------- Fade-up on scroll ---------- */

function setupReveal() {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver(entries => entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add("show"); io.unobserve(en.target); }
  }), { threshold: 0.12 });
  document.querySelectorAll(".hero-copy > *, .portrait, .stats > div, .section-head, .split > div, .pillars > div, .card, .skills > div, .exp-intro, .exp-lists > div")
    .forEach((n, i) => { n.classList.add("reveal"); n.style.transitionDelay = (i % 3) * 90 + "ms"; io.observe(n); });
}

$("year").textContent = new Date().getFullYear();

/* ---------- Load data, then build the page ---------- */

async function loadJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(url + " → " + res.status);
  return res.json();
}

(async function init() {
  try {
    const [profile, projects, events, certificates] = await Promise.all(
      [DATA.profile, DATA.projects, DATA.events, DATA.certificates].map(loadJSON)
    );
    renderStats(profile.stats, projects);
    renderPillars(profile.pillars);
    renderProjects(projects);
    renderSkills(profile.skills);
    renderRoles(profile.roles);
    renderEvents(events);
    renderCertificates(certificates);
  } catch (err) {
    console.error("Could not load portfolio data:", err);
    const note = el('<p class="load-error" role="alert"></p>');
    note.textContent = location.protocol === "file:"
      ? "The project data can't load when this page is opened as a file. Run a local server in this folder (python3 -m http.server) and open http://localhost:8000."
      : "Sorry — the project data didn't load. Please refresh the page.";
    $("work").prepend(note);
  }
  setupReveal();
  onScroll();
})();
