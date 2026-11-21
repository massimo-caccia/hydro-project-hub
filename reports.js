import { PROJECTS, TASKS, PERIOD, summarizeProjects } from "./data.js";
import { escapeHtml, money, icon } from "./ui.js";

/** Build an immutable weekly report from the selected demo records.
 * @param {string} scope - 'all' or a project ID.
 * @param {string[]} reviewed - IDs of actions reviewed in this browser.
 * @param {object} sections - Toggles for financial, risk, and milestone sections.
 * @returns {object} Report snapshot suitable for display and local storage.
 */
export function buildReport(scope, reviewed, sections) {
  const projects = PROJECTS.filter(
    (project) => scope === "all" || project.id === scope,
  );
  const summary = summarizeProjects(projects);
  const tasks = TASKS.filter((task) =>
    projects.some((project) => project.id === task.project),
  );
  const name =
    scope === "all"
      ? "Portfolio weekly report"
      : `${projects[0].short} weekly report`;
  return {
    id: crypto.randomUUID(),
    created: new Date().toISOString(),
    name,
    period: PERIOD,
    projects: structuredClone(projects),
    summary,
    sections,
    tasks: structuredClone(tasks),
    reviewed: [...reviewed],
    narrative: `${projects.length === 1 ? "This project is" : `${projects.length} projects are`} included in this reporting period. ${summary.onTrack} on track, ${summary.atRisk} at risk, and ${summary.delayed} delayed. Recorded spending is ${money(summary.spent)} against an approved budget of ${money(summary.budget)} CAD. ${tasks.filter((task) => !reviewed.includes(task.id)).length} follow-up actions still need review.`,
  };
}

/** Serialize a report into readable Markdown with record references.
 * @param {object} report - Stored report snapshot.
 * @returns {string} A downloadable Markdown report.
 */
export function reportMarkdown(report) {
  const lines = [
    `# ${report.name}`,
    `Period: ${report.period}`,
    "Independent concept demo · All data is fictional · Currency: CAD",
    "",
    "## Executive summary",
    report.narrative,
    "",
    "## Project updates",
  ];
  report.projects.forEach((project) =>
    lines.push(
      `### ${project.name} (${project.id})`,
      `${project.progress}% complete · ${project.status.replaceAll("-", " ")} · Owner: ${project.owner}`,
      project.update,
      "",
    ),
  );
  if (report.sections.financials) {
    lines.push(
      "## Financial overview",
      "| Project | Approved budget | Actual spending | Remaining budget |",
      "| --- | --- | --- | --- |",
    );
    report.projects.forEach((project) =>
      lines.push(
        `| ${project.short} | ${money(project.budget)} | ${money(project.spent)} | ${money(project.budget - project.spent)} |`,
      ),
    );
    lines.push(
      "Source: fictional SAP records matched by Project ID. Remaining budget is budget minus spending; it is not a forecast.",
      "",
    );
  }
  if (report.sections.risks) {
    lines.push("## Risks and follow-ups");
    report.tasks.forEach((task) =>
      lines.push(
        `- ${task.title} — ${task.detail} Owner: ${task.owner}. Source: ${task.source} / ${task.record}. Review: ${report.reviewed.includes(task.id) ? "reviewed locally; source status unchanged" : "pending"}.`,
      ),
    );
    if (!report.tasks.length)
      lines.push("No follow-ups recorded for this selection.");
    lines.push("");
  }
  if (report.sections.milestones) {
    lines.push("## Upcoming milestones");
    report.projects.forEach((project) =>
      lines.push(
        `- ${project.short}: ${project.milestone} — ${project.due}. Source: Primavera P6 / ${project.id}.`,
      ),
    );
    lines.push("");
  }
  lines.push(
    "## Provenance",
    "Demo snapshot: November 20, 2026. Sources: SAP, IBM Maximo, SharePoint, and Primavera P6 fixtures. Records are joined by Project ID. No live systems are connected. Generated from deterministic templates; no AI service is used.",
  );
  return lines.join("\n");
}

/** Render the report body from its saved snapshot.
 * @param {object} report - Saved report data.
 * @returns {string} Printable report markup.
 */
export function reportBody(report) {
  return `<article class="report-paper">
    <div class="report-letterhead"><div class="report-brand"><img src="./assets/hydro-quebec-logo.svg" alt="Hydro-Québec" width="200" height="65" /><span>COURANT<br>PROJECT INTELLIGENCE</span></div><span>WEEKLY BRIEFING<br>INDEPENDENT DEMO</span></div>
    <h2>${escapeHtml(report.name)}</h2><p class="muted">${escapeHtml(report.period)} · All amounts in CAD</p>
    <div class="report-summary"><h3>Executive summary</h3><p>${escapeHtml(report.narrative)}</p></div>
    <h3>Project updates</h3>${report.projects.map((project) => `<div class="report-project"><h4>${escapeHtml(project.name)} <span>${project.progress}%</span></h4><p>${escapeHtml(project.update)}</p><small>${project.id} · ${escapeHtml(project.owner)} · Maximo / Primavera P6</small></div>`).join("")}
    ${report.sections.financials ? financialSection(report) : ""}
    ${report.sections.risks ? `<h3>Risks & follow-ups</h3>${report.tasks.length ? report.tasks.map((task) => `<div class="report-action"><strong>${escapeHtml(task.title)}</strong><p>${escapeHtml(task.detail)}</p><small>${escapeHtml(task.owner)} · ${task.record} · ${report.reviewed.includes(task.id) ? "Reviewed locally — source unchanged" : "Needs review"}</small></div>`).join("") : "<p>No follow-ups recorded for this selection.</p>"}` : ""}
    ${report.sections.milestones ? `<h3>Upcoming milestones</h3><ul class="report-milestones">${report.projects.map((project) => `<li><div><strong>${escapeHtml(project.short)}</strong><span>${escapeHtml(project.milestone)}</span></div><span>${project.due}</span></li>`).join("")}</ul>` : ""}
    <footer class="report-footnote">Independent concept demo. All data is fictional. Snapshot: November 20, 2026.<br>Records are matched by Project ID across SAP, IBM Maximo, SharePoint, and Primavera P6 demo fixtures. Draft prepared from templates; review before sharing.</footer>
  </article>`;
}

/** Render a financial table for a report snapshot.
 * @param {object} report - Saved report data.
 * @returns {string} Financial section HTML.
 */
function financialSection(report) {
  return `<h3>Financial overview</h3><div class="table-scroll"><table class="report-table"><thead><tr><th>Project</th><th>Budget</th><th>Spent</th><th>Remaining</th></tr></thead><tbody>${report.projects.map((project) => `<tr><td>${escapeHtml(project.short)}</td><td>${money(project.budget)}</td><td>${money(project.spent)}</td><td>${money(project.budget - project.spent)}</td></tr>`).join("")}</tbody></table></div><p class="caption">Source: SAP demo records. Remaining budget = budget − spending; this is not a forecast.</p>`;
}

/** Render the report-generation screen and saved report history.
 * @param {object[]} reports - Reports saved in this browser.
 * @returns {string} Reports page content.
 */
export function reportsPage(reports) {
  return `<div class="page-heading"><div><div class="eyebrow">LESS PREPARATION. MORE PERSPECTIVE.</div><h1>Reports, ready when you are.</h1><p>Turn connected project records into a briefing you can actually use.</p></div></div>
    <div class="reports-layout"><section class="panel report-builder"><div class="section-heading"><span class="feature-icon">${icon("reports", 24)}</span><div><h2>Build your weekly report</h2><p>One consistent view, with the sources included.</p></div></div>
      <form id="report-form"><label class="field-label" for="report-scope">Report scope</label><select id="report-scope" name="scope"><option value="all">All projects · Portfolio overview</option>${PROJECTS.map((project) => `<option value="${project.id}">${escapeHtml(project.name)}</option>`).join("")}</select>
        <label class="field-label" for="report-period">Reporting period</label><input id="report-period" value="${PERIOD}" readonly /><p class="caption">This demo uses a fixed, fictional weekly snapshot.</p>
        <fieldset><legend>Include in your report</legend><label class="check-field"><input type="checkbox" name="financials" checked />Financial overview <span>Budgets & actual spending</span></label><label class="check-field"><input type="checkbox" name="risks" checked />Risks & follow-ups <span>Exceptions & ownership</span></label><label class="check-field"><input type="checkbox" name="milestones" checked />Upcoming milestones <span>What happens next</span></label></fieldset>
        <button class="button primary full-width" type="submit">${icon("spark", 18)} Generate weekly report ${icon("arrow", 18)}</button><p class="caption centered">Generated locally. Ready to review, copy, or download.</p>
      </form></section>
      <section class="report-explainer"><span class="eyebrow">FROM FOUR SYSTEMS TO ONE STORY</span><h2>The update is already<br>in your data.</h2><p>Courant brings the pieces together so your team can spend less time preparing the meeting, and more time moving projects forward.</p><ol><li><span>01</span><div><h3>Bring the records together</h3><p>Match budgets, work orders, documents, and schedules by project ID.</p></div></li><li><span>02</span><div><h3>Surface what matters</h3><p>Summarize progress and highlight outstanding follow-ups.</p></div></li><li><span>03</span><div><h3>Make it yours</h3><p>Review the draft. Copy it into your workflow or save it as a PDF.</p></div></li></ol><div class="source-chain">SAP <span>+</span> Maximo <span>+</span> SharePoint <span>+</span> P6</div></section></div>
    <section class="panel history"><div class="section-heading"><div><h2>Recent reports</h2><p>Saved in this browser · ${reports.length} ${reports.length === 1 ? "report" : "reports"}</p></div></div>${reports.length ? reports.map((report) => `<button class="history-row" data-action="open-report" data-id="${escapeHtml(report.id)}"><span class="history-icon">${icon("reports")}</span><span><strong>${escapeHtml(report.name)}</strong><small>${escapeHtml(report.period)} · Generated ${escapeHtml(new Date(report.created).toLocaleDateString("en-CA"))}</small></span><span class="badge neutral">Draft</span>${icon("chevron", 17)}</button>`).join("") : `<div class="empty-state">${icon("reports", 30)}<h3>A little less reporting starts here.</h3><p>Your first generated report will appear here.</p></div>`}</section>`;
}
