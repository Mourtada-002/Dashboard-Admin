const charts = {};
let currentPage = "page-dashboard";
let usersPage = 1;
const PER_PAGE = 5;

let usersData = [
  {
    id: 1,
    name: "Marie Dupont",
    email: "marie.dupont@exemple.fr",
    role: "admin",
    status: "active",
    date: "2024-01-12",
    seed: "Marie",
  },
  {
    id: 2,
    name: "Amadou Diallo",
    email: "amadou.diallo@exemple.sn",
    role: "user",
    status: "active",
    date: "2024-02-18",
    seed: "Amadou",
  },
  {
    id: 3,
    name: "Fatou Ndiaye",
    email: "fatou.ndiaye@exemple.sn",
    role: "moderator",
    status: "active",
    date: "2024-03-05",
    seed: "Fatou",
  },
  {
    id: 4,
    name: "Jean-Pierre Martin",
    email: "jp.martin@exemple.fr",
    role: "user",
    status: "inactive",
    date: "2024-03-22",
    seed: "JeanPierre",
  },
  {
    id: 5,
    name: "Aïssatou Ba",
    email: "aissatou.ba@exemple.sn",
    role: "user",
    status: "active",
    date: "2024-04-10",
    seed: "Aissatou",
  },
  {
    id: 6,
    name: "Thomas Leroy",
    email: "thomas.leroy@exemple.fr",
    role: "admin",
    status: "active",
    date: "2024-05-02",
    seed: "Thomas",
  },
  {
    id: 7,
    name: "Chloé Bernard",
    email: "chloe.bernard@exemple.fr",
    role: "user",
    status: "active",
    date: "2024-05-28",
    seed: "Chloe",
  },
  {
    id: 8,
    name: "Ousmane Sow",
    email: "ousmane.sow@exemple.ml",
    role: "user",
    status: "inactive",
    date: "2024-06-14",
    seed: "Ousmane",
  },
  {
    id: 9,
    name: "Camille Rousseau",
    email: "camille.rousseau@exemple.fr",
    role: "moderator",
    status: "active",
    date: "2024-07-01",
    seed: "Camille",
  },
  {
    id: 10,
    name: "Ibrahim Koné",
    email: "ibrahim.kone@exemple.ci",
    role: "user",
    status: "active",
    date: "2024-08-19",
    seed: "Ibrahim",
  },
  {
    id: 11,
    name: "Léa Moreau",
    email: "lea.moreau@exemple.fr",
    role: "user",
    status: "active",
    date: "2024-09-30",
    seed: "Lea",
  },
  {
    id: 12,
    name: "Sophie Kamga",
    email: "sophie.kamga@exemple.cm",
    role: "admin",
    status: "inactive",
    date: "2024-10-15",
    seed: "Sophie",
  },
];

// ── Toast ──
function showToast(msg, type = "success") {
  const c = document.getElementById("toast-container");
  const icons = {
    success:
      '<svg class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>',
    error:
      '<svg class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>',
    info: '<svg class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
  };
  const t = document.createElement("div");
  t.className = `toast ${type}`;
  t.innerHTML = `${icons[type]}<span>${msg}</span>`;
  c.appendChild(t);
  const dismiss = () => {
    t.classList.add("toast-out");
    setTimeout(() => t.remove(), 300);
  };
  t.addEventListener("click", dismiss);
  setTimeout(dismiss, 3500);
}

// ── Charts helpers ──
function tooltipStyle() {
  return {
    backgroundColor: "rgba(10,10,15,.9)",
    borderColor: "rgba(99,102,241,.3)",
    borderWidth: 1,
    titleColor: "rgba(255,255,255,.6)",
    bodyColor: "#fff",
    padding: 12,
    cornerRadius: 10,
  };
}
function scaleStyle() {
  return {
    grid: { color: "rgba(255,255,255,.05)", drawBorder: false },
    ticks: { color: "rgba(255,255,255,.35)", font: { size: 11 } },
    border: { display: false },
  };
}
function destroyChart(k) {
  if (charts[k]) {
    charts[k].destroy();
    delete charts[k];
  }
}

// ── SPA Router ──
function showPage(id) {
  if (id === currentPage) return;

  const chartMap = {
    "page-dashboard": ["line", "donut"],
    "page-statistics": ["bar", "signups", "radar"],
  };
  (chartMap[currentPage] || []).forEach(destroyChart);

  document.querySelectorAll(".page").forEach((p) => {
    p.classList.remove("active");
  });
  document
    .querySelectorAll(".nav-item")
    .forEach((n) => n.classList.toggle("active", n.dataset.page === id));

  const target = document.getElementById(id);
  if (!target) return;
  requestAnimationFrame(() =>
    requestAnimationFrame(() => target.classList.add("active")),
  );

  currentPage = id;
  document
    .getElementById("scrollContent")
    .scrollTo({ top: 0, behavior: "smooth" });

  if (id === "page-dashboard") initDashboardCharts();
  if (id === "page-users") renderUsers();
  if (id === "page-statistics") initStatsCharts();

  if (window.innerWidth < 1024) closeSidebar();
}

// ── Dashboard ──
function animCounter(el, dur = 500) {
  const target = parseFloat(el.dataset.target);
  const fmt = el.dataset.format;
  const sfx = el.dataset.suffix || "";
  const start = performance.now();
  const tick = (now) => {
    const p = Math.min((now - start) / dur, 1);
    const e = 1 - Math.pow(1 - p, 3);
    const v = target * e;
    el.textContent =
      fmt === "int"
        ? Math.round(v).toLocaleString("fr-FR")
        : fmt === "decimal"
          ? v.toFixed(1) + sfx
          : Math.round(v);
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function initDashboardCharts() {
  if (charts.line) return;
  const lc = document.getElementById("lineChart");
  const dc = document.getElementById("donutChart");
  if (!lc || !dc) return;

  const lctx = lc.getContext("2d");
  const grad = lctx.createLinearGradient(0, 0, 0, 260);
  grad.addColorStop(0, "rgba(99,102,241,.35)");
  grad.addColorStop(1, "rgba(99,102,241,0)");

  charts.line = new Chart(lctx, {
    type: "line",
    data: {
      labels: [
        "Jan",
        "Fév",
        "Mar",
        "Avr",
        "Mai",
        "Jun",
        "Jul",
        "Aoû",
        "Sep",
        "Oct",
        "Nov",
        "Déc",
      ],
      datasets: [
        {
          data: [
            640, 680, 800, 870, 920, 960, 1000, 1050, 1100, 1160, 1200, 1248,
          ],
          borderColor: "#6366f1",
          backgroundColor: grad,
          borderWidth: 2.5,
          pointBackgroundColor: "#6366f1",
          pointRadius: 4,
          pointHoverRadius: 7,
          fill: true,
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: { ...tooltipStyle(), displayColors: false },
      },
      scales: { x: scaleStyle(), y: { ...scaleStyle(), min: 500 } },
    },
  });

  charts.donut = new Chart(dc, {
    type: "doughnut",
    data: {
      labels: ["Admins", "Modérateurs", "Utilisateurs"],
      datasets: [
        {
          data: [15, 20, 65],
          backgroundColor: ["#6366f1", "#a78bfa", "#22d3ee"],
          borderColor: "rgba(10,10,15,.8)",
          borderWidth: 3,
          hoverOffset: 12,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      cutout: "65%",
      plugins: {
        legend: { display: false },
        tooltip: {
          ...tooltipStyle(),
          callbacks: { label: (c) => ` ${c.parsed}%` },
        },
      },
    },
  });
}

function initPeriodSelect() {
  document.getElementById("period-select")?.addEventListener("change", (e) => {
    if (!charts.line) return;
    const p = e.target.value;
    const sets = {
      month: {
        labels: [
          "Jan",
          "Fév",
          "Mar",
          "Avr",
          "Mai",
          "Jun",
          "Jul",
          "Aoû",
          "Sep",
          "Oct",
          "Nov",
          "Déc",
        ],
        data: [
          640, 680, 800, 870, 920, 960, 1000, 1050, 1100, 1160, 1200, 1248,
        ],
      },
      week: {
        labels: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
        data: [1100, 1150, 1180, 1200, 1220, 1235, 1248],
      },
      year: {
        labels: [
          "Jan",
          "Fév",
          "Mar",
          "Avr",
          "Mai",
          "Jun",
          "Jul",
          "Aoû",
          "Sep",
          "Oct",
          "Nov",
          "Déc",
        ],
        data: [
          400, 520, 640, 760, 880, 960, 1040, 1100, 1150, 1190, 1220, 1248,
        ],
      },
    };
    charts.line.data.labels = sets[p].labels;
    charts.line.data.datasets[0].data = sets[p].data;
    charts.line.update();
  });
}

// ── Users ──
function getFiltered() {
  const q = (document.getElementById("user-search")?.value || "").toLowerCase();
  const r = document.getElementById("filter-role")?.value || "";
  const s = document.getElementById("filter-status")?.value || "";
  return usersData.filter(
    (u) =>
      (u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)) &&
      (!r || u.role === r) &&
      (!s || u.status === s),
  );
}

function roleBadge(role) {
  return (
    {
      admin: ["badge-role-admin", "Admin"],
      moderator: ["badge-role-moderator", "Modérateur"],
      user: ["badge-role-user", "Utilisateur"],
    }[role] || ["badge-role-user", "Utilisateur"]
  );
}

function renderUsers() {
  const tbody = document.getElementById("users-table-body");
  if (!tbody) return;
  const filtered = getFiltered();
  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  if (usersPage > pages) usersPage = pages;
  const slice = filtered.slice(
    (usersPage - 1) * PER_PAGE,
    usersPage * PER_PAGE,
  );

  tbody.innerHTML = slice
    .map((u) => {
      const [cls, label] = roleBadge(u.role);
      const active = u.status === "active";
      const date = new Date(u.date).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      return `<tr>
      <td><div class="flex items-center gap-3"><img src="https://api.dicebear.com/7.x/avataaars/svg?seed=${u.seed}&backgroundColor=6366f1" class="h-9 w-9 rounded-full border border-white/10" /><span class="font-medium text-white">${u.name}</span></div></td>
      <td class="text-white/60">${u.email}</td>
      <td><span class="role-badge ${cls}">${label}</span></td>
      <td><span class="status-badge ${active ? "badge-status-active" : "badge-status-inactive"}"><span class="h-2 w-2 rounded-full ${active ? "bg-green-400 status-dot" : "bg-red-400 status-dot inactive"}"></span>${active ? "Actif" : "Inactif"}</span></td>
      <td class="text-white/50">${date}</td>
      <td><div class="flex gap-1">
        <button class="btn-icon" data-action="view" data-id="${u.id}" data-name="${u.name}" title="Voir"><svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg></button>
        <button class="btn-icon" data-action="edit" data-id="${u.id}" data-name="${u.name}" title="Modifier"><svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg></button>
        <button class="btn-icon" data-action="delete" data-id="${u.id}" data-name="${u.name}" title="Supprimer"><svg class="h-4 w-4 text-red-400/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>
      </div></td>
    </tr>`;
    })
    .join("");

  const pg = document.getElementById("users-pagination");
  if (!pg) return;
  let html = "";
  for (let i = 1; i <= pages; i++) {
    if (pages > 5 && i > 3 && i < pages) {
      if (i === 4) html += '<span class="text-white/30 px-1">…</span>';
      continue;
    }
    html += `<button class="pagination-pill ${i === usersPage ? "active" : ""}" data-p="${i}">${i}</button>`;
  }
  pg.innerHTML = html;
  pg.querySelectorAll("[data-p]").forEach((b) =>
    b.addEventListener("click", () => {
      usersPage = +b.dataset.p;
      renderUsers();
    }),
  );
}

// ── Statistics charts ──
function initStatsCharts() {
  if (charts.bar) return;

  const barC = document.getElementById("barWeeklyChart");
  if (barC) {
    const ctx = barC.getContext("2d");
    const g = ctx.createLinearGradient(0, 0, 0, 280);
    g.addColorStop(0, "#6366f1");
    g.addColorStop(1, "#22d3ee");
    charts.bar = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
        datasets: [
          {
            data: [120, 190, 150, 280, 220, 310, 180],
            backgroundColor: g,
            borderRadius: 8,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: tooltipStyle() },
        scales: { x: scaleStyle(), y: scaleStyle() },
      },
    });
  }

  const lineC = document.getElementById("signupsLineChart");
  if (lineC) {
    const ctx = lineC.getContext("2d");
    const g = ctx.createLinearGradient(0, 0, 0, 200);
    g.addColorStop(0, "rgba(34,211,238,.35)");
    g.addColorStop(1, "rgba(34,211,238,0)");
    charts.signups = new Chart(ctx, {
      type: "line",
      data: {
        labels: Array.from({ length: 30 }, (_, i) => `${i + 1}`),
        datasets: [
          {
            data: [
              3, 5, 4, 7, 6, 8, 5, 9, 7, 10, 8, 12, 9, 11, 14, 10, 13, 15, 12,
              16, 14, 18, 15, 17, 19, 16, 20, 18, 22, 21,
            ],
            borderColor: "#22d3ee",
            backgroundColor: g,
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 4,
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: tooltipStyle() },
        scales: {
          x: {
            ...scaleStyle(),
            ticks: { ...scaleStyle().ticks, maxTicksLimit: 10 },
          },
          y: scaleStyle(),
        },
      },
    });
  }

  const radarC = document.getElementById("radarChart");
  if (radarC) {
    charts.radar = new Chart(radarC, {
      type: "radar",
      data: {
        labels: ["Vitesse", "Sécurité", "UX", "Mobile", "SEO", "Dispo."],
        datasets: [
          {
            data: [88, 92, 78, 85, 70, 95],
            backgroundColor: "rgba(99,102,241,.3)",
            borderColor: "#22d3ee",
            borderWidth: 2,
            pointBackgroundColor: "#6366f1",
            pointRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: tooltipStyle() },
        scales: {
          r: {
            angleLines: { color: "rgba(255,255,255,.06)" },
            grid: { color: "rgba(255,255,255,.06)" },
            pointLabels: { color: "rgba(255,255,255,.5)", font: { size: 11 } },
            ticks: { display: false },
            suggestedMin: 0,
            suggestedMax: 100,
          },
        },
      },
    });
  }
}

// ── Sidebar ──
function openSidebar() {
  document.getElementById("sidebar")?.classList.add("sidebar-open");
  document.getElementById("sidebar-overlay")?.classList.add("active");
}
function closeSidebar() {
  document.getElementById("sidebar")?.classList.remove("sidebar-open");
  document.getElementById("sidebar-overlay")?.classList.remove("active");
}

// ── Boot sequence ──
function boot() {
  const overlay = document.getElementById("boot-overlay");
  const sidebar = document.getElementById("sidebar");
  const dash = document.getElementById("page-dashboard");
  const isMobile = window.innerWidth < 1024;

  if (!isMobile) {
    setTimeout(() => sidebar?.classList.add("visible"), 50);
  } else {
    setTimeout(() => sidebar?.classList.add("visible"), 50);
  }

  setTimeout(
    () => dash?.querySelector("#topbar")?.classList.add("visible"),
    400,
  );
  dash
    ?.querySelectorAll(".anim-kpi")
    .forEach((c, i) =>
      setTimeout(() => c.classList.add("visible"), 700 + i * 150),
    );
  setTimeout(
    () =>
      dash?.querySelectorAll(".kpi-counter").forEach((el) => animCounter(el)),
    1200,
  );
  setTimeout(() => {
    dash
      ?.querySelectorAll(".anim-chart")
      .forEach((w) => w.classList.add("visible"));
    initDashboardCharts();
  }, 1600);
  setTimeout(() => overlay?.classList.add("hidden"), 200);
  setTimeout(() => overlay?.remove(), 700);
}

// ── Init ──
document.addEventListener("DOMContentLoaded", () => {
  boot();
  initPeriodSelect();

  document.querySelectorAll(".nav-item").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      showPage(item.dataset.page);
    });
  });

  document.querySelectorAll(".hamburger-btn").forEach((btn) => {
    btn.addEventListener("click", () =>
      document.getElementById("sidebar")?.classList.contains("sidebar-open")
        ? closeSidebar()
        : openSidebar(),
    );
  });
  document
    .getElementById("sidebar-overlay")
    ?.addEventListener("click", closeSidebar);

  ["user-search", "filter-role", "filter-status"].forEach((id) => {
    document.getElementById(id)?.addEventListener("input", () => {
      usersPage = 1;
      renderUsers();
    });
    document.getElementById(id)?.addEventListener("change", () => {
      usersPage = 1;
      renderUsers();
    });
  });

  document
    .getElementById("users-table-body")
    ?.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-action]");
      if (!btn) return;
      const { action, id, name } = btn.dataset;
      if (action === "delete") {
        usersData = usersData.filter((u) => u.id != id);
        renderUsers();
        showToast(`« ${name} » supprimé`, "info");
      }
      if (action === "view") showToast(`Aperçu de ${name}`, "info");
      if (action === "edit") showToast(`Édition de ${name}`, "info");
    });

  // Modal add user
  const modal = document.getElementById("add-user-modal");
  document
    .getElementById("add-user-btn")
    ?.addEventListener("click", () => modal?.classList.add("open"));
  document
    .getElementById("modal-cancel")
    ?.addEventListener("click", () => modal?.classList.remove("open"));
  modal?.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.remove("open");
  });
  document.getElementById("modal-confirm")?.addEventListener("click", () => {
    const name = document.getElementById("new-name").value.trim();
    const email = document.getElementById("new-email").value.trim();
    const role = document.getElementById("new-role").value;
    if (!name || !email) {
      showToast("Remplissez nom et email", "error");
      return;
    }
    usersData.unshift({
      id: Date.now(),
      name,
      email,
      role,
      status: "active",
      date: new Date().toISOString().split("T")[0],
      seed: name.replace(/\s/g, ""),
    });
    usersPage = 1;
    renderUsers();
    modal.classList.remove("open");
    document.getElementById("new-name").value = "";
    document.getElementById("new-email").value = "";
    showToast(`${name} ajouté avec succès !`, "success");
  });

  // Settings tabs
  document.querySelectorAll(".settings-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document
        .querySelectorAll(".settings-tab")
        .forEach((t) => t.classList.remove("active"));
      document
        .querySelectorAll(".settings-panel")
        .forEach((p) => p.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById(tab.dataset.tab)?.classList.add("active");
    });
  });

  // Settings actions
  document
    .getElementById("save-profile-btn")
    ?.addEventListener("click", () =>
      showToast("Profil sauvegardé !", "success"),
    );
  document
    .getElementById("save-notif-btn")
    ?.addEventListener("click", () =>
      showToast("Notifications enregistrées", "success"),
    );
  document.querySelectorAll(".password-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const inp = btn.parentElement.querySelector("input");
      inp.type = inp.type === "password" ? "text" : "password";
    });
  });
  document.querySelectorAll(".revoke-session").forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.closest(".session-item")?.remove();
      showToast("Session révoquée", "info");
    });
  });
  document.querySelectorAll(".color-swatch").forEach((sw) => {
    sw.addEventListener("click", () => {
      document
        .querySelectorAll(".color-swatch")
        .forEach((s) => s.classList.remove("active"));
      sw.classList.add("active");
      document.documentElement.style.setProperty("--accent", sw.dataset.color);
      showToast("Couleur d'accent mise à jour", "info");
    });
  });
  document
    .getElementById("compact-toggle")
    ?.addEventListener("change", (e) =>
      document.body.classList.toggle("compact-mode", e.target.checked),
    );
  document.querySelectorAll(".lang-pill").forEach((p) => {
    p.addEventListener("click", () => {
      document
        .querySelectorAll(".lang-pill")
        .forEach((l) => l.classList.remove("active"));
      p.classList.add("active");
    });
  });

  // Reports
  const genBtn = document.getElementById("generate-report-btn");
  genBtn?.addEventListener("click", () => {
    genBtn.classList.add("btn-loading");
    genBtn.disabled = true;
    setTimeout(() => {
      genBtn.classList.remove("btn-loading");
      genBtn.disabled = false;
      showToast("Rapport généré !", "success");
    }, 1500);
  });
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-download-report]"))
      showToast("Téléchargement démarré", "success");
    if (e.target.closest("[data-delete-report]")) {
      e.target.closest("tr")?.remove();
      showToast("Rapport supprimé", "info");
    }
  });

  // Scroll top
  const sc = document.getElementById("scrollContent");
  const stb = document.getElementById("scroll-top-btn");
  sc?.addEventListener("scroll", () =>
    stb?.classList.toggle("visible", sc.scrollTop > 300),
  );
  stb?.addEventListener("click", () =>
    sc?.scrollTo({ top: 0, behavior: "smooth" }),
  );

  // Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      modal?.classList.remove("open");
      closeSidebar();
    }
  });

  // Resize charts
  window.addEventListener("resize", () =>
    Object.values(charts).forEach((c) => c?.resize?.()),
  );
});
