import { PROJECTS, TASKS, CONNECTIONS } from "./data.js";
import { escapeHtml, icon, money, appMark, downloadText } from "./ui.js";
import {
  shell,
  overviewPage,
  projectsPage,
  connectionsPage,
  projectDetail,
  projectTable,
  filterProjects,
  attentionList,
} from "./components.js";
import {
  reportsPage,
  buildReport,
  reportBody,
  reportMarkdown,
} from "./reports.js";

const STORAGE_KEY = "courant-demo-v1";
const app = document.querySelector("#app");
const dialog = document.querySelector("#detail-dialog");
const filters = { search: "", status: "all" };
let state = loadState();
let activeReport = null;
let toastTimer;
let returnFocus = null;

/** Load validated demo state without requiring persistent browser storage.
 * @returns {object} Reviewed actions, report snapshots, and last simulated sync.
 */
function loadState() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (
      stored &&
      Array.isArray(stored.reviewed) &&
      Array.isArray(stored.reports)
    ) {
      return {
        reviewed: stored.reviewed.filter((id) =>
          TASKS.some((task) => task.id === id),
        ),
        reports: stored.reports.filter(isReport).slice(0, 20),
        syncedAt: typeof stored.syncedAt === "string" ? stored.syncedAt : null,
      };
    }
  } catch {
    /* A private browser or invalid saved state can still run the demo. */
  }
  return { reviewed: [], reports: [], syncedAt: null };
}

/** Check the shape of a locally stored report before rendering it.
 * @param {unknown} report - Parsed local-storage value.
 * @returns {boolean} Whether the report has the required snapshot fields.
 */
function isReport(report) {
  return (
    !!report &&
    typeof report.id === "string" &&
    typeof report.name === "string" &&
    typeof report.period === "string" &&
    typeof report.created === "string" &&
    typeof report.narrative === "string" &&
    report.sections &&
    report.summary &&
    Array.isArray(report.projects) &&
    report.projects.every(
      (project) =>
        PROJECTS.some((item) => item.id === project.id) &&
        Number.isFinite(project.budget) &&
        Number.isFinite(project.spent),
    ) &&
    Array.isArray(report.tasks) &&
    report.tasks.every((task) => TASKS.some((item) => item.id === task.id)) &&
    Array.isArray(report.reviewed)
  );
}

/** Save current demo state while allowing storage-disabled sessions to continue.
 * @returns {void} Persists state or explains that it is temporary.
 */
function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    toast(
      "Browser storage is unavailable. Changes will last for this session only.",
    );
  }
}

/** Read the current supported page from the URL hash.
 * @returns {string} A supported page identifier.
 */
function currentPage() {
  const page = location.hash.slice(1);
  return ["overview", "projects", "reports", "connections"].includes(page)
    ? page
    : "overview";
}

/** Render the active page while preserving the persistent demo state.
 * @returns {void} Updates the application DOM and document title.
 */
function render() {
  const page = currentPage();
  const pages = {
    overview: () => overviewPage(state),
    projects: () => projectsPage(filters),
    reports: () => reportsPage(state.reports),
    connections: () => connectionsPage(state),
  };
  app.innerHTML = shell(
    page,
    pages[page](),
    TASKS.filter((task) => !state.reviewed.includes(task.id)).length,
  );
  document.title = `${page[0].toUpperCase() + page.slice(1)} · Courant`;
}

/** Show a short accessible confirmation message.
 * @param {string} message - Plain text to announce.
 * @returns {void} Displays and schedules removal of a toast.
 */
function toast(message) {
  const element = document.querySelector("#toast");
  clearTimeout(toastTimer);
  element.textContent = message;
  element.classList.add("visible");
  toastTimer = setTimeout(() => element.classList.remove("visible"), 4500);
}

/** Show content in the native modal, with focus containment and Escape support.
 * @param {string} content - Escaped or trusted template markup.
 * @param {string} className - Optional modal layout class.
 * @returns {void} Opens or updates the modal.
 */
function showDialog(content, className = "") {
  if (!dialog.open) returnFocus = document.activeElement;
  dialog.className = className;
  dialog.innerHTML = `<button class="dialog-close icon-button" data-action="close" aria-label="Close dialog">${icon("close", 21)}</button>${content}`;
  if (!dialog.open) dialog.showModal();
  document.body.classList.add("modal-open");
  dialog.scrollTop = 0;
}

/** Show the complete action list and its local review state.
 * @returns {void} Opens the follow-up modal.
 */
function showAttention() {
  showDialog(
    `<div class="dialog-heading"><span class="eyebrow">KEEP THINGS MOVING</span><h2 id="dialog-title">Your follow-ups</h2><p>Review outstanding items and prepare reminders for project leads.</p></div><div class="detail-body">${attentionList(state.reviewed, true)}<div class="context-note">${icon("info", 17)} Review states are saved in this browser. Marking an item reviewed does not resolve the issue in its source system.</div></div>`,
  );
}

/** Display a generated report and its export controls.
 * @param {object} report - Current or previously saved report snapshot.
 * @returns {void} Opens the printable report modal.
 */
function showReport(report) {
  if (!report) return;
  activeReport = report;
  showDialog(
    `<div class="report-toolbar"><div><span class="badge green">${icon("check", 13)} Draft ready</span><h2 id="dialog-title">Your weekly briefing</h2></div><div><button class="small-button" data-action="copy-report">${icon("copy", 15)} Copy</button><button class="small-button" data-action="download-report">${icon("download", 15)} Download</button><button class="small-button" data-action="print-report">${icon("print", 15)} Print / PDF</button></div></div>${reportBody(report)}`,
    "report-dialog",
  );
}

/** Generate and save a report using the selected project scope and sections.
 * @param {string} scope - All projects or one project ID.
 * @param {object} sections - Enabled report sections.
 * @returns {void} Saves the snapshot and opens the report preview.
 */
function generateReport(
  scope = "all",
  sections = { financials: true, risks: true, milestones: true },
) {
  const report = buildReport(scope, state.reviewed, sections);
  state.reports = [report, ...state.reports].slice(0, 20);
  saveState();
  render();
  showReport(report);
  toast("Weekly draft generated. Source references are included.");
}

/** Copy text to the clipboard, reporting failures without claiming success.
 * @param {string} content - Text to copy.
 * @returns {Promise<void>} Resolves after the clipboard attempt.
 */
async function copyText(content) {
  try {
    await navigator.clipboard.writeText(content);
    toast("Copied to clipboard.");
  } catch {
    toast(
      "Clipboard access is unavailable. Use Download, or select and copy the text.",
    );
  }
}

/** Draft a follow-up message without sending it to anyone.
 * @param {string} id - Action fixture ID.
 * @returns {void} Opens a selectable reminder draft.
 */
function showReminder(id) {
  const task = TASKS.find((item) => item.id === id);
  const project = PROJECTS.find((item) => item.id === task.project);
  const text = `Subject: Follow-up: ${project.short} — ${task.title}\n\nHi ${task.owner.split(" ")[0]},\n\nCould you please share an update on the following item for ${project.name} (${project.id})?\n\n${task.detail}\n\nReference: ${task.record}\nRequested follow-up: ${task.due}, 2026\n\nPlease confirm the current status and the next step.\n\nThank you,\nJamie\n\n[Demo draft based on fictional data. Not sent.]`;
  showDialog(
    `<div class="dialog-heading"><span class="eyebrow">A SMALL TASK, TAKEN CARE OF</span><h2 id="dialog-title">Your reminder draft</h2><p>Review and copy this message into your usual workflow.</p></div><div class="detail-body"><label class="sr-only" for="reminder-draft">Reminder draft</label><textarea id="reminder-draft" rows="16">${escapeHtml(text)}</textarea><div class="dialog-actions"><button class="small-button" data-action="attention">Back to follow-ups</button><button class="button primary" data-action="copy-reminder">${icon("copy", 16)} Copy draft</button></div><p class="caption">This demo does not send emails or messages.</p></div>`,
  );
}

/** Render the normalized source fields for one project and application.
 * @param {object} project - Project fixture.
 * @param {string} source - Source application ID.
 * @returns {Array} Label/value rows for the record viewer.
 */
function sourceFields(project, source) {
  const shared = [
    ["Project ID", project.id],
    ["Project name", project.name],
  ];
  const fields = {
    sap: [
      ["Approved budget", `${money(project.budget)} CAD`],
      ["Actual spending", `${money(project.spent)} CAD`],
      ["Remaining budget", `${money(project.budget - project.spent)} CAD`],
    ],
    maximo: [
      ["Work orders", String(project.workOrders)],
      ["Project lead", project.owner],
      ["Latest update", project.update],
    ],
    sharepoint: [
      ["Project documents", String(project.documents)],
      ["Document owner", project.owner],
      [
        "Document status",
        project.id === "HQ-2604"
          ? "Foundation inspection report outstanding"
          : "Current sample documents available",
      ],
    ],
    primavera: [
      ["Progress", `${project.progress}%`],
      ["Next milestone", project.milestone],
      ["Milestone date", project.due],
    ],
  };
  return [...shared, ...fields[source]];
}

/** Show source fixtures for a connection, optionally scoped to a project.
 * @param {string} id - Source application ID.
 * @param {string|null} projectId - Optional project ID.
 * @returns {void} Opens the source provenance dialog.
 */
function showConnection(id, projectId = null) {
  const connection = CONNECTIONS.find((item) => item.id === id);
  const projects = PROJECTS.filter(
    (project) => !projectId || project.id === projectId,
  );
  showDialog(
    `<div class="dialog-heading"><div class="source-dialog-title">${appMark(connection)}<span class="eyebrow">DEMO SOURCE RECORDS</span></div><h2 id="dialog-title">${connection.name}</h2><p>${connection.description}</p></div><div class="detail-body"><div class="demo-notice">${icon("info", 17)} Fictional snapshot · November 20, 2026 · No live connection</div>${projects
      .map(
        (project) =>
          `<section class="source-data"><button class="text-button" data-action="project" data-id="${project.id}">${escapeHtml(project.short)} ${icon("arrow", 15)}</button><dl>${sourceFields(
            project,
            id,
          )
            .map(
              ([label, value]) =>
                `<div><dt>${label}</dt><dd>${escapeHtml(value)}</dd></div>`,
            )
            .join("")}</dl>${TASKS.filter(
            (task) => task.project === project.id && task.source === id,
          )
            .map(
              (task) =>
                `<div class="source-exception">${icon("alert", 15)}<span>${task.record}: ${escapeHtml(task.detail)}</span></div>`,
            )
            .join("")}</section>`,
      )
      .join("")}</div>`,
  );
}

/** Simulate reading source fixtures without claiming a live network integration.
 * @param {HTMLButtonElement} button - Trigger button to disable temporarily.
 * @returns {Promise<void>} Resolves when the simulated sync finishes.
 */
async function simulateSync(button) {
  button.disabled = true;
  button.innerHTML = `${icon("refresh", 17)} Simulating…`;
  await new Promise((resolve) => setTimeout(resolve, 700));
  state.syncedAt = new Date().toISOString();
  saveState();
  render();
  toast("Simulation complete: 490 sample records linked across 6 projects.");
}

/** Export the currently filtered project list as a CSV file.
 * @returns {void} Starts a CSV download with values in Canadian dollars.
 */
function exportProjects() {
  const rows = [
    [
      "Project ID",
      "Project",
      "Region",
      "Owner",
      "Status",
      "Progress (%)",
      "Budget (CAD)",
      "Spent (CAD)",
      "Next milestone",
      "Milestone date",
    ],
  ];
  filterProjects(filters).forEach((project) =>
    rows.push([
      project.id,
      project.name,
      project.region,
      project.owner,
      project.status,
      project.progress,
      Math.round(project.budget * 1e6),
      Math.round(project.spent * 1e6),
      project.milestone,
      project.due,
    ]),
  );
  const content = rows
    .map((row) =>
      row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","),
    )
    .join("\r\n");
  downloadText(
    "courant-fictional-projects.csv",
    "\ufeff" + content,
    "text/csv;charset=utf-8",
  );
  toast("Project CSV exported. All amounts are in CAD.");
}

/** Explain the demo's boundaries and offer a local reset.
 * @returns {void} Opens the about dialog.
 */
function showAbout() {
  showDialog(
    `<div class="dialog-heading"><span class="eyebrow">MEET COURANT</span><h2 id="dialog-title">Connected information.<br>Clearer decisions.</h2></div><div class="detail-body about-copy"><p>Courant is an independent concept for a Hydro-Québec project and maintenance reporting hub. It is not affiliated with or endorsed by Hydro-Québec.</p><h3>What you can try</h3><p>Explore six fictional projects, trace records across four sample systems, review follow-ups, prepare reminder drafts, and generate downloadable weekly reports.</p><h3>How this demo works</h3><p>All records, people, budgets, and project updates are fictional. The reporting snapshot is November 16–20, 2026. SAP, IBM Maximo, SharePoint, and Primavera P6 are illustrative integration choices, not claims about Hydro-Québec’s systems.</p><p>Report drafts and review states are saved in this browser only. Reports use deterministic templates; no AI service, email delivery, or live connection is involved.</p><button class="small-button" data-action="reset">${icon("reset", 15)} Reset saved reports & reviews</button></div>`,
  );
}

/** Apply a local review toggle and keep the action list open.
 * @param {string} id - Action ID to toggle.
 * @returns {void} Persists review state and refreshes the display.
 */
function toggleReview(id) {
  state.reviewed = state.reviewed.includes(id)
    ? state.reviewed.filter((item) => item !== id)
    : [...state.reviewed, id];
  saveState();
  render();
  showAttention();
  dialog.querySelector(`[data-action="review"][data-id="${id}"]`)?.focus();
  toast("Review state updated in this browser.");
}

/** Refresh only search results so typing retains its input focus.
 * @returns {void} Updates the project table and result count.
 */
function updateProjectResults() {
  const projects = filterProjects(filters);
  document.querySelector("#project-results").innerHTML = projectTable(projects);
  document.querySelector("#project-count").textContent =
    `${projects.length} of ${PROJECTS.length} projects · November 20, 2026 snapshot · CAD`;
}

/** Dispatch the explicit UI action associated with a clicked button.
 * @param {MouseEvent} event - Delegated click event.
 * @returns {void} Runs the matching UI action.
 */
function handleClick(event) {
  const button = event.target.closest("[data-action]");
  if (!button || button.disabled) return;
  const { action, id, project } = button.dataset;
  const actions = {
    close: () => dialog.close(),
    about: showAbout,
    attention: showAttention,
    project: () =>
      showDialog(
        projectDetail(
          PROJECTS.find((item) => item.id === id),
          state.reviewed,
        ),
      ),
    connection: () => showConnection(id),
    "source-record": () => showConnection(id, project),
    "quick-report": () => generateReport(),
    "project-report": () => generateReport(id),
    "open-report": () =>
      showReport(state.reports.find((item) => item.id === id)),
    "copy-report": () => copyText(reportMarkdown(activeReport)),
    "download-report": () =>
      downloadText(
        `courant-weekly-report-${activeReport.id.slice(0, 8)}.md`,
        reportMarkdown(activeReport),
      ),
    "print-report": () => window.print(),
    "sync-all": () => simulateSync(button),
    "export-projects": exportProjects,
    review: () => toggleReview(id),
    reminder: () => showReminder(id),
    "copy-reminder": () =>
      copyText(document.querySelector("#reminder-draft").value),
    "clear-filters": () => {
      filters.search = "";
      filters.status = "all";
      render();
      document.querySelector("#project-search")?.focus();
    },
    reset: () => {
      state = { reviewed: [], reports: [], syncedAt: null };
      saveState();
      render();
      dialog.close();
      toast("Demo reset. Saved reports and reviews cleared.");
    },
  };
  actions[action]?.();
}

document.addEventListener("click", handleClick);
document.addEventListener("input", (event) => {
  if (event.target.id === "project-search") {
    filters.search = event.target.value;
    updateProjectResults();
  }
});
document.addEventListener("change", (event) => {
  if (event.target.id === "project-status") {
    filters.status = event.target.value;
    updateProjectResults();
  }
});
document.addEventListener("submit", (event) => {
  if (event.target.id !== "report-form") return;
  event.preventDefault();
  const data = new FormData(event.target);
  generateReport(data.get("scope"), {
    financials: data.has("financials"),
    risks: data.has("risks"),
    milestones: data.has("milestones"),
  });
});
window.addEventListener("hashchange", () => {
  if (dialog.open) dialog.close();
  render();
  window.scrollTo(0, 0);
});
dialog.addEventListener("close", () => {
  document.body.classList.remove("modal-open");
  if (returnFocus?.isConnected) returnFocus.focus();
  else document.querySelector("#main")?.focus({ preventScroll: true });
});
dialog.addEventListener("click", (event) => {
  if (event.target !== dialog) return;
  const box = dialog.getBoundingClientRect();
  if (
    event.clientX < box.left ||
    event.clientX > box.right ||
    event.clientY < box.top ||
    event.clientY > box.bottom
  )
    dialog.close();
});
render();
