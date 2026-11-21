import {
  PROJECTS,
  TASKS,
  CONNECTIONS,
  ACTIVITY,
  summarizeProjects,
} from "./data.js";
import { escapeHtml, money, icon, logo, statusBadge, appMark } from "./ui.js";

/** Render the persistent application navigation and content frame.
 * @param {string} page - Active navigation page.
 * @param {string} content - Page body markup.
 * @param {number} pending - Number of unreviewed follow-ups.
 * @returns {string} Full application shell.
 */
export function shell(page, content, pending) {
  const names = {
    overview: "Overview",
    projects: "Projects",
    reports: "Reports",
    connections: "Connections",
  };
  return `<aside class="sidebar"><a href="#overview" class="brand" aria-label="Hydro-Québec — Courant concept home">${logo()}</a>
    <div class="workspace"><div class="workspace-avatar">${icon("bolt", 17)}</div><div><strong>Courant</strong><small>Project intelligence</small></div><span class="demo-tag">DEMO</span></div>
    <div class="nav-label">WORKSPACE</div><nav aria-label="Main navigation">${Object.entries(
      names,
    )
      .map(
        ([id, label]) =>
          `<a href="#${id}" class="nav-link ${page === id ? "active" : ""}" ${page === id ? 'aria-current="page"' : ""}>${icon(id)}<span>${label}</span>${id === "projects" ? '<span class="nav-count">6</span>' : ""}</a>`,
      )
      .join("")}</nav>
    <div class="sidebar-note"><span class="small-wave">${icon("connections", 24)}</span><strong>Better, together.</strong><p>Four systems.<br>One connected perspective.</p><a href="#connections">Explore connections ${icon("arrow", 15)}</a></div>
    <div class="sidebar-bottom"><button data-action="about" class="quiet-button">${icon("info", 17)} About this demo</button><div class="profile"><span class="avatar mint">JD</span><div><strong>Jamie Dubois</strong><small>Portfolio manager · Demo</small></div></div></div>
  </aside><div class="main-shell"><header class="topbar"><div class="breadcrumbs"><span class="mobile-brand">${logo()}</span><span>Courant</span>${icon("chevron", 13)}<strong>${names[page]}</strong></div><div class="topbar-right"><span class="sample-label"><i></i> INDEPENDENT DEMO</span><button class="icon-button notifications" data-action="attention" aria-label="View ${pending} follow-ups">${icon("alert", 18)}${pending ? "<span></span>" : ""}</button><span class="avatar mint small">JD</span></div></header>
    <nav class="mobile-nav" aria-label="Mobile navigation">${Object.entries(
      names,
    )
      .map(
        ([id, label]) =>
          `<a href="#${id}" ${page === id ? 'aria-current="page"' : ""}>${icon(id, 17)}${label}</a>`,
      )
      .join(
        "",
      )}</nav><main id="main" tabindex="-1">${content}<footer class="site-footer"><span>${logo()} Connected information. Clearer decisions.</span><span>Independent demo · Not affiliated with Hydro-Québec</span></footer></main></div>`;
}

/** Render the four top-level portfolio metrics.
 * @param {number} pending - Unreviewed follow-up count.
 * @returns {string} Dashboard metric cards.
 */
function metricCards(pending) {
  const summary = summarizeProjects(PROJECTS);
  return `<section class="metrics" aria-label="Portfolio metrics">
    <div class="metric"><div class="metric-label">Active projects ${icon("projects", 18)}</div><div class="metric-value">${PROJECTS.length}<span>projects</span></div><div class="metric-foot"><span class="positive">${icon("checkCircle", 14)} ${summary.onTrack} on track</span><span>across 5 regions</span></div></div>
    <div class="metric"><div class="metric-label">Approved budget ${icon("money", 18)}</div><div class="metric-value">${money(summary.budget)}</div><div class="metric-foot"><span>CAD</span><span>Portfolio total</span></div></div>
    <div class="metric"><div class="metric-label">Actual spending ${icon("trend", 18)}</div><div class="metric-value">${money(summary.spent)}</div><div class="metric-foot"><span class="mini-progress"><span style="width:${(summary.spent / summary.budget) * 100}%"></span></span><span>${Math.round((summary.spent / summary.budget) * 100)}% of budget</span></div></div>
    <button class="metric metric-button" data-action="attention"><div class="metric-label">Needs your attention ${icon("alert", 18)}</div><div class="metric-value">${pending}<span>follow-ups</span></div><div class="metric-foot"><span class="amber-text">Review outstanding actions</span>${icon("arrow", 15)}</div></button>
  </section>`;
}

/** Render a budget-versus-spending chart directly from project records.
 * @returns {string} Interactive, accessible bar chart markup.
 */
function budgetChart() {
  return `<section class="panel budget-panel"><div class="section-heading"><div><h2>Every dollar, in perspective.</h2><p>Approved budget and actual spending by project</p></div><span class="unit-label">CAD · millions</span></div>
    <div class="chart-legend"><span><i class="budget-key"></i>Approved budget</span><span><i class="spent-key"></i>Actual spending</span></div><div class="budget-chart"><div class="chart-scale"><span>$0M</span><span>$15M</span><span>$30M</span><span>$45M</span></div>${PROJECTS.map((project) => `<button class="chart-row" data-action="project" data-id="${project.id}" aria-label="${escapeHtml(project.short)}: budget ${money(project.budget)}, spent ${money(project.spent)}"><span class="chart-name">${escapeHtml(project.short)}</span><span class="chart-track"><span class="budget-bar" style="width:${(project.budget / 45) * 100}%"><span class="spent-bar" style="width:${(project.spent / project.budget) * 100}%"></span></span></span><span class="chart-number">${money(project.spent)}</span></button>`).join("")}</div><div class="chart-note">${icon("link", 14)} Matched by project ID <span>Source: SAP demo records</span></div></section>`;
}

/** Render action cards, optionally including previously reviewed actions.
 * @param {string[]} reviewed - Locally reviewed action IDs.
 * @param {boolean} expanded - Whether to include all actions and review controls.
 * @returns {string} Follow-up list markup.
 */
export function attentionList(reviewed, expanded = false) {
  const tasks = expanded
    ? TASKS
    : TASKS.filter((task) => !reviewed.includes(task.id)).slice(0, 3);
  return `<div class="attention-list">${
    tasks.length
      ? tasks
          .map((task) => {
            const project = PROJECTS.find(
              (project) => project.id === task.project,
            );
            const done = reviewed.includes(task.id);
            return `<div class="attention-item ${done ? "reviewed" : ""}"><span class="priority-dot ${task.severity}"></span><div><button class="text-button action-title" data-action="project" data-id="${project.id}">${escapeHtml(task.title)}</button><p>${escapeHtml(project.short)} <span>·</span> ${task.overdue ? "Overdue" : "Due"} ${task.due}</p>${expanded ? `<p class="action-detail">${escapeHtml(task.detail)}</p><div class="action-controls"><button class="small-button" data-action="review" data-id="${task.id}">${icon(done ? "reset" : "check", 14)} ${done ? "Reopen review" : "Mark reviewed"}</button><button class="text-button" data-action="reminder" data-id="${task.id}">${icon("copy", 14)} Draft reminder</button></div>` : ""}</div>${done ? '<span class="badge green">Reviewed</span>' : ""}</div>`;
          })
          .join("")
      : `<div class="empty-state compact">${icon("checkCircle", 28)}<h3>You’re all caught up.</h3><p>All demo follow-ups have been reviewed.</p></div>`
  }</div>`;
}

/** Render the portfolio overview dashboard.
 * @param {object} state - Persisted local demo state.
 * @returns {string} Dashboard page content.
 */
export function overviewPage(state) {
  const pending = TASKS.filter(
    (task) => !state.reviewed.includes(task.id),
  ).length;
  return `<div class="page-heading"><div><div class="eyebrow">HYDRO-QUÉBEC · PROJECT INTELLIGENCE</div><h1>Your projects. One connected view.</h1><p>Budgets, maintenance, and milestones — together in one workspace. Fictional demo data.</p></div><span class="date-chip">${icon("calendar", 16)} Nov 16–20, 2026</span></div>
    <section class="briefing-banner"><div class="briefing-copy"><span class="briefing-icon">${icon("spark", 24)}</span><div><span class="eyebrow">YOUR WEEK, CONNECTED</span><h2>The data is in. Your briefing is a click away.</h2><p>6 projects · 4 source systems · One ready-to-review report</p></div></div><button class="button primary" data-action="quick-report">${icon("reports", 17)} Generate weekly report ${icon("arrow", 17)}</button><div class="banner-rings" aria-hidden="true"></div></section>
    ${metricCards(pending)}<div class="insight-grid">${budgetChart()}<section class="panel attention-panel"><div class="section-heading"><div><h2>A little attention goes a long way.</h2><p>Follow-ups that keep projects moving</p></div><span class="count-badge">${pending}</span></div>${attentionList(state.reviewed)}<button class="panel-footer-button" data-action="attention">Review all follow-ups ${icon("arrow", 16)}</button></section></div>
    <section class="panel portfolio-panel"><div class="section-heading"><div><h2>Your project portfolio</h2><p>A shared view, from generation to distribution.</p></div><a class="text-link" href="#projects">View all projects ${icon("arrow", 16)}</a></div>${projectTable(PROJECTS)}</section>
    <div class="bottom-grid">${activityPanel()}${connectionSummary(state)}</div>`;
}

/** Render an accessible table of project records.
 * @param {Array} projects - Filtered projects to display.
 * @returns {string} Project table or empty result message.
 */
export function projectTable(projects) {
  if (!projects.length)
    return `<div class="empty-state">${icon("search", 30)}<h3>No projects found</h3><p>Try a different project name, region, or status.</p><button class="small-button" data-action="clear-filters">Clear filters</button></div>`;
  return `<div class="table-scroll"><table class="project-table"><thead><tr><th>Project / Region</th><th>Status</th><th>Progress</th><th>Spent / Budget</th><th>Project lead</th><th><span class="sr-only">Details</span></th></tr></thead><tbody>${projects.map((project) => `<tr><td><button class="project-name" data-action="project" data-id="${project.id}"><span class="project-type-icon ${project.color}">${icon(project.type === "Generation" ? "bolt" : "projects", 18)}</span><span><strong>${escapeHtml(project.name)}</strong><small>${escapeHtml(project.region)} <span>·</span> ${project.id}</small></span></button></td><td>${statusBadge(project.status)}</td><td><div class="table-progress"><span><i style="width:${project.progress}%"></i></span><strong>${project.progress}%</strong></div></td><td class="spend-cell"><strong>${money(project.spent)}</strong><span> / ${money(project.budget)}</span></td><td><span class="owner"><span class="avatar ${project.color}">${project.initials}</span><span>${escapeHtml(project.owner)}</span></span></td><td><button class="icon-button" data-action="project" data-id="${project.id}" aria-label="Open ${escapeHtml(project.name)}">${icon("chevron", 17)}</button></td></tr>`).join("")}</tbody></table></div>`;
}

/** Render the searchable project directory.
 * @param {object} filters - Current search and status values.
 * @returns {string} Project directory content.
 */
export function projectsPage(filters) {
  return `<div class="page-heading"><div><div class="eyebrow">ONE PORTFOLIO. A SHARED PERSPECTIVE.</div><h1>Projects that move Québec.</h1><p>Find the details. Connect the dots. Keep things moving.</p></div><button class="button secondary" data-action="export-projects">${icon("download", 17)} Export CSV</button></div>
    <section class="panel"><div class="project-filters"><label class="search-field">${icon("search", 18)}<input id="project-search" type="search" placeholder="Search projects, regions, or people…" aria-label="Search projects" value="${escapeHtml(filters.search)}" /></label><label class="filter-select"><span>Status</span><select id="project-status" aria-label="Filter by status"><option value="all">All statuses</option><option value="on-track" ${filters.status === "on-track" ? "selected" : ""}>On track</option><option value="at-risk" ${filters.status === "at-risk" ? "selected" : ""}>At risk</option><option value="delayed" ${filters.status === "delayed" ? "selected" : ""}>Delayed</option></select></label></div><div id="project-results">${projectTable(filterProjects(filters))}</div><div class="table-caption" id="project-count">${filterProjects(filters).length} of ${PROJECTS.length} projects · November 20, 2026 snapshot · CAD</div></section>
    <div class="context-note">${icon("info", 18)} Open any project to explore its source records, upcoming milestone, and follow-ups.</div>`;
}

/** Find projects matching the current search text and status.
 * @param {object} filters - Search text and selected status.
 * @returns {Array} Matching project fixtures.
 */
export function filterProjects(filters) {
  const query = filters.search
    .trim()
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  return PROJECTS.filter((project) => {
    const text =
      `${project.name} ${project.region} ${project.owner} ${project.id} ${project.type}`
        .toLocaleLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
    return (
      text.includes(query) &&
      (filters.status === "all" || project.status === filters.status)
    );
  });
}

/** Render the snapshot's recent activity stream.
 * @returns {string} Activity panel markup.
 */
function activityPanel() {
  return `<section class="panel activity-panel"><div class="section-heading"><div><h2>The latest, together.</h2><p>Activity across your demo systems · Nov 20</p></div>${icon("clock", 18)}</div>${ACTIVITY.map((activity) => `<button class="activity-row" data-action="project" data-id="${activity.project}">${appMark(CONNECTIONS.find((connection) => connection.id === activity.source))}<span><strong>${escapeHtml(activity.title)}</strong><small>${activity.detail}</small></span><time>${activity.time}</time></button>`).join("")}</section>`;
}

/** Render a compact overview of simulated source connections.
 * @param {object} state - Local synchronization state.
 * @returns {string} Connection summary markup.
 */
function connectionSummary(state) {
  return `<section class="panel connection-summary"><div class="section-heading"><div><h2>Connected by design.</h2><p>Your information, brought together.</p></div><span class="badge green">4 demo sources</span></div><div class="source-logos">${CONNECTIONS.map((connection) => `<button data-action="connection" data-id="${connection.id}">${appMark(connection)}<span>${connection.name}</span></button>`).join("")}</div><div class="connection-summary-footer"><span><i class="live-dot"></i>${state.syncedAt ? "Demo sync completed" : "Sample records loaded"}</span><a href="#connections">Manage ${icon("arrow", 15)}</a></div></section>`;
}

/** Render the source connection catalog and the data matching explanation.
 * @param {object} state - Local synchronization state.
 * @returns {string} Connections page content.
 */
export function connectionsPage(state) {
  return `<div class="page-heading"><div><div class="eyebrow">BRING THE PIECES TOGETHER</div><h1>Different systems. Shared context.</h1><p>One project ID connects the information your team needs.</p></div><button class="button primary" data-action="sync-all">${icon("refresh", 17)} Simulate sync</button></div>
    <div class="demo-notice">${icon("info", 18)}<span><strong>A working concept, with sample connections.</strong> These integrations use fictional records. No accounts or live Hydro-Québec systems are connected.</span></div>
    <div class="connection-grid">${CONNECTIONS.map((connection) => `<section class="panel connection-card"><div class="connection-card-top">${appMark(connection)}<span class="badge green">Demo source ready</span></div><h2>${connection.name}</h2><span class="eyebrow">${connection.category}</span><p>${connection.description}</p><div class="connection-stat"><strong>${connection.records}</strong><span>${connection.entity.toLowerCase()}</span></div><div class="connection-card-bottom"><span>${state.syncedAt ? "Simulated sync complete" : "Nov 20 sample snapshot"}</span><button class="text-button" data-action="connection" data-id="${connection.id}">View records ${icon("arrow", 15)}</button></div></section>`).join("")}</div>
    <section class="matching-panel"><div><span class="eyebrow">THE THREAD THAT TIES IT TOGETHER</span><h2>Same project.<br>Complete picture.</h2><p>Each system keeps its own records. Courant uses a shared project ID to bring the relevant pieces into one view.</p></div><div class="matching-diagram"><div class="matching-sources">${CONNECTIONS.map((connection) => `<span>${appMark(connection)} ${connection.name}</span>`).join("")}</div><div class="matching-arrow">${icon("arrow", 30)}</div><div class="matching-key"><span class="eyebrow">SHARED PROJECT ID</span><strong>HQ-2601</strong><span>Manic-5 turbine refurbishment</span><button class="small-button" data-action="project" data-id="HQ-2601">Explore the project ${icon("arrow", 15)}</button></div></div></section>`;
}

/** Render the detailed project view with source records and actions.
 * @param {object} project - Selected project fixture.
 * @param {string[]} reviewed - Locally reviewed action IDs.
 * @returns {string} Project dialog content.
 */
export function projectDetail(project, reviewed) {
  const tasks = TASKS.filter((task) => task.project === project.id);
  return `<div class="detail-hero"><span class="eyebrow">${project.id} · ${escapeHtml(project.type)}</span><h2 id="dialog-title">${escapeHtml(project.name)}</h2><p>${icon("location", 15)} ${escapeHtml(project.region)} ${statusBadge(project.status)}</p></div><div class="detail-body"><p class="detail-description">${escapeHtml(project.description)}</p><div class="detail-metrics"><div><span>Approved budget</span><strong>${money(project.budget)}</strong></div><div><span>Actual spending</span><strong>${money(project.spent)}</strong></div><div><span>Completion</span><strong>${project.progress}%</strong></div></div>
    <div class="detail-update"><span class="eyebrow">LATEST PROJECT UPDATE</span><p>${escapeHtml(project.update)}</p><span class="owner"><span class="avatar ${project.color}">${project.initials}</span>${escapeHtml(project.owner)} <small>· Project lead</small></span></div>
    <h3>Next on the calendar</h3><div class="milestone-card">${icon("calendar", 24)}<div><strong>${escapeHtml(project.milestone)}</strong><span>Primavera P6 · ${project.id}</span></div><span class="badge neutral">${project.due}</span></div>
    <h3>Connected source records <span class="caption">Matched by ${project.id}</span></h3><div class="source-records">${CONNECTIONS.map((connection) => `<button data-action="source-record" data-id="${connection.id}" data-project="${project.id}">${appMark(connection)}<span><strong>${connection.name}</strong><small>${connection.id === "sap" ? `${money(project.spent)} spent / ${money(project.budget)} budget` : connection.id === "maximo" ? `${project.workOrders} work orders` : connection.id === "sharepoint" ? `${project.documents} project documents` : `${project.progress}% complete · next milestone`}</small></span>${icon("chevron", 15)}</button>`).join("")}</div>
    <h3>Follow-ups <span class="count-badge">${tasks.length}</span></h3>${tasks.length ? tasks.map((task) => `<div class="project-followup"><span class="priority-dot ${task.severity}"></span><div><strong>${escapeHtml(task.title)}</strong><p>${task.record} · ${escapeHtml(task.owner)}</p></div><span class="badge ${reviewed.includes(task.id) ? "green" : "neutral"}">${reviewed.includes(task.id) ? "Reviewed" : "Needs review"}</span></div>`).join("") : '<p class="positive">No follow-ups recorded for this project.</p>'}
    <button class="button primary full-width" data-action="project-report" data-id="${project.id}">${icon("spark", 17)} Generate project report</button></div>`;
}
