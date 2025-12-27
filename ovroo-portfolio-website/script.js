(function () {
  const data = window.PORTFOLIO_DATA;
  const root = document.documentElement;

  // Theme
  const themeBtn = document.getElementById("themeBtn");
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) root.setAttribute("data-theme", savedTheme);

  function setTheme(next) {
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    themeBtn.textContent = next === "light" ? "🌞" : "🌙";
  }
  themeBtn.addEventListener("click", () => {
    const cur = root.getAttribute("data-theme") || "dark";
    setTheme(cur === "dark" ? "light" : "dark");
  });
  // initial icon
  themeBtn.textContent = (root.getAttribute("data-theme") || "dark") === "light" ? "🌞" : "🌙";

  // Hero images
  const heroBg = document.querySelector(".hero__bg");
  heroBg.style.backgroundImage = `url("${data.profile.banner_img}")`;
  document.getElementById("profileImg").src = data.profile.profile_img;

  // Links
  const behanceBtn = document.getElementById("behanceBtn");
  behanceBtn.href = data.profile.behance;
  const facebookBtn = document.getElementById("facebookBtn");
  facebookBtn.href = data.profile.facebook;

  // Filters
  const search = document.getElementById("search");
  const tag = document.getElementById("tag");

  const tags = Array.from(new Set(data.projects.map(p => p.tag))).sort();
  tags.forEach(t => {
    const opt = document.createElement("option");
    opt.value = t;
    opt.textContent = t;
    tag.appendChild(opt);
  });

  const grid = document.getElementById("grid");

  function render() {
    const q = (search.value || "").trim().toLowerCase();
    const t = tag.value;

    const filtered = data.projects.filter(p => {
      const matchesQ = !q || (p.title.toLowerCase().includes(q) || (p.tag || "").toLowerCase().includes(q));
      const matchesT = !t || p.tag === t;
      return matchesQ && matchesT;
    });

    grid.innerHTML = "";
    filtered.forEach(p => {
      const a = document.createElement("a");
      a.className = "cardProj";
      a.href = p.url;
      a.target = "_blank";
      a.rel = "noreferrer";
      a.innerHTML = `
        <img class="cardProj__img" src="${p.thumb}" alt="${escapeHtml(p.title)} cover" loading="lazy" />
        <div class="cardProj__body">
          <div class="cardProj__title">${escapeHtml(p.title)}</div>
          <p class="cardProj__tag">${escapeHtml(p.tag || "Project")}</p>
          <div class="cardProj__cta">
            <span>Open on Behance</span>
            <span class="badge">View →</span>
          </div>
        </div>
      `;
      grid.appendChild(a);
    });

    if (filtered.length === 0) {
      const empty = document.createElement("div");
      empty.className = "card";
      empty.innerHTML = `<strong>No projects found.</strong><div class="muted small" style="margin-top:8px">Try clearing the search or choosing “All categories”.</div>`;
      grid.appendChild(empty);
    }
  }

  function escapeHtml(str){
    return String(str)
      .replaceAll("&","&amp;")
      .replaceAll("<","&lt;")
      .replaceAll(">","&gt;")
      .replaceAll('"',"&quot;")
      .replaceAll("'","&#039;");
  }

  search.addEventListener("input", render);
  tag.addEventListener("change", render);
  render();
})();
