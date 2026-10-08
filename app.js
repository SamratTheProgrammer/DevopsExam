const loginForm = document.querySelector("#loginForm");
const loginView = document.querySelector("#loginView");
const dashboardView = document.querySelector("#dashboardView");
const passwordInput = document.querySelector("#password");
const formMessage = document.querySelector("#formMessage");
const viewContent = document.querySelector("#viewContent");
const toast = document.querySelector("#toast");

const overviewMarkup = `
  <div class="stats-grid">
    <article class="stat-card"><p class="stat-label">Active projects</p><p class="stat-value">04</p><p class="stat-change">2 moving this week</p></article>
    <article class="stat-card"><p class="stat-label">Tasks completed</p><p class="stat-value">18</p><p class="stat-change">On track this month</p></article>
    <article class="stat-card"><p class="stat-label">Team updates</p><p class="stat-value">07</p><p class="stat-change">3 new since yesterday</p></article>
  </div>
  <section class="content-panel" aria-labelledby="activityTitle">
    <div class="panel-heading">
      <h2 id="activityTitle">Recent activity</h2>
      <input class="search-input" id="activitySearch" type="search" placeholder="Search activity" aria-label="Search activity">
    </div>
    <div class="activity-list" id="activityList">
      <div class="activity-row"><span class="activity-dot"></span><span class="activity-description">Project plan was updated</span><span class="activity-time">12 minutes ago</span></div>
      <div class="activity-row"><span class="activity-dot amber"></span><span class="activity-description">A new task is ready for review</span><span class="activity-time">1 hour ago</span></div>
      <div class="activity-row"><span class="activity-dot"></span><span class="activity-description">Weekly team notes were published</span><span class="activity-time">Yesterday</span></div>
    </div>
    <p class="empty-message" id="emptyMessage" hidden>No activity matches that search.</p>
  </section>`;

const pages = {
  overview: {
    eyebrow: "Workspace",
    title: "Good morning",
    subtitle: "Here is what is happening with your work.",
    content: overviewMarkup,
    showCreate: true,
  },
  projects: {
    eyebrow: "Workspace",
    title: "Projects",
    subtitle: "Keep the work in progress easy to see.",
    content: `<section class="content-panel simple-view"><div class="panel-heading"><h2>Your projects</h2></div><p>Your project list is ready for your work. Use “New project” to add a project to this demo workspace.</p></section>`,
    showCreate: true,
  },
  team: {
    eyebrow: "Workspace",
    title: "Team",
    subtitle: "A clear view of the people around your work.",
    content: `<section class="content-panel simple-view"><div class="panel-heading"><h2>Workspace team</h2></div><p>This demo workspace is set up for one member. Team profiles and collaboration can be connected when a backend is added.</p></section>`,
    showCreate: false,
  },
};

function openDashboard(email) {
  const displayName = email.split("@")[0].replace(/[._-]+/g, " ");
  const firstName = displayName.split(" ")[0] || "there";
  loginView.hidden = true;
  dashboardView.hidden = false;
  document.querySelector("#sidebarEmail").textContent = email;
  document.querySelector("#sidebarAvatar").textContent = firstName.charAt(0).toUpperCase();
  document.querySelector("#pageTitle").textContent = `Good morning, ${firstName}`;
  document.querySelector("#today").textContent = new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date());
  showPage("overview");
}

function showPage(pageName) {
  const page = pages[pageName];
  if (!page) return;

  document.querySelectorAll(".nav-item[data-view]").forEach((button) => {
    const isActive = button.dataset.view === pageName;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-current", isActive ? "page" : "false");
  });
  document.querySelector("#pageEyebrow").textContent = page.eyebrow;
  document.querySelector("#pageTitle").textContent = page.title;
  document.querySelector("#pageSubtitle").textContent = page.subtitle;
  document.querySelector("#createButton").hidden = !page.showCreate;
  viewContent.innerHTML = page.content;

  const searchInput = document.querySelector("#activitySearch");
  if (searchInput) searchInput.addEventListener("input", filterActivity);
}

function filterActivity(event) {
  const query = event.target.value.trim().toLowerCase();
  const rows = [...document.querySelectorAll(".activity-row")];
  let visibleCount = 0;

  rows.forEach((row) => {
    const matches = row.textContent.toLowerCase().includes(query);
    row.hidden = !matches;
    if (matches) visibleCount += 1;
  });
  document.querySelector("#emptyMessage").hidden = visibleCount > 0;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => toast.classList.remove("is-visible"), 2600);
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  formMessage.textContent = "";

  if (!loginForm.reportValidity()) return;

  const email = new FormData(loginForm).get("email").toString().trim();
  sessionStorage.setItem("northstar-demo-email", email);
  openDashboard(email);
});

document.querySelector("#togglePassword").addEventListener("click", (event) => {
  const isVisible = passwordInput.type === "text";
  passwordInput.type = isVisible ? "password" : "text";
  event.currentTarget.textContent = isVisible ? "Show" : "Hide";
  event.currentTarget.setAttribute("aria-pressed", String(!isVisible));
});

document.querySelectorAll(".nav-item[data-view]").forEach((button) => {
  button.addEventListener("click", () => showPage(button.dataset.view));
});

document.querySelector("#signOutButton").addEventListener("click", () => {
  sessionStorage.removeItem("northstar-demo-email");
  dashboardView.hidden = true;
  loginView.hidden = false;
  loginForm.reset();
  formMessage.textContent = "";
  document.querySelector("#email").focus();
});

document.querySelector("#createButton").addEventListener("click", () => {
  showToast("Project creation is a demo interaction.");
});

document.querySelector("#today").textContent = new Intl.DateTimeFormat(undefined, {
  weekday: "short",
  month: "short",
  day: "numeric",
}).format(new Date());

const savedEmail = sessionStorage.getItem("northstar-demo-email");
if (savedEmail) openDashboard(savedEmail);