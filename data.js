/** Fictional fixtures for the November 16–20, 2026 demo snapshot. */
export const SNAPSHOT = "November 20, 2026";
export const PERIOD = "November 16–20, 2026";

export const PROJECTS = [
  {
    id: "HQ-2601",
    name: "Manic-5 turbine refurbishment",
    short: "Manic-5",
    region: "Côte-Nord",
    type: "Generation",
    owner: "Camille Roy",
    initials: "CR",
    color: "mint",
    status: "on-track",
    budget: 42,
    spent: 30.2,
    progress: 72,
    milestone: "Rotor assembly inspection",
    due: "Nov 25, 2026",
    description:
      "Refurbish a turbine-generator unit to extend asset life and improve operational reliability.",
    update:
      "Rotor balancing is complete. The team is preparing for the next assembly inspection.",
    workOrders: 38,
    documents: 24,
  },
  {
    id: "HQ-2602",
    name: "Boucherville substation upgrade",
    short: "Boucherville",
    region: "Montérégie",
    type: "Transmission",
    owner: "Thomas Gagnon",
    initials: "TG",
    color: "sand",
    status: "at-risk",
    budget: 28.5,
    spent: 16.8,
    progress: 59,
    milestone: "Transformer delivery",
    due: "Nov 27, 2026",
    description:
      "Replace aging transformers and modernize protection systems at a regional substation.",
    update:
      "Civil works are complete. A purchase order approval is needed to keep transformer delivery on schedule.",
    workOrders: 26,
    documents: 18,
  },
  {
    id: "HQ-2603",
    name: "La Grande-2 control modernization",
    short: "La Grande-2",
    region: "Nord-du-Québec",
    type: "Generation",
    owner: "Alex Nguyen",
    initials: "AN",
    color: "blue",
    status: "on-track",
    budget: 18.8,
    spent: 12.6,
    progress: 67,
    milestone: "Control system acceptance",
    due: "Dec 02, 2026",
    description:
      "Modernize plant control equipment and validate the upgraded operator interfaces.",
    update:
      "Factory acceptance checks passed. Installation documentation is ready for site review.",
    workOrders: 22,
    documents: 31,
  },
  {
    id: "HQ-2604",
    name: "Québec East line reinforcement",
    short: "Québec East",
    region: "Capitale-Nationale",
    type: "Transmission",
    owner: "Sophie Tremblay",
    initials: "ST",
    color: "rose",
    status: "delayed",
    budget: 16.4,
    spent: 7.9,
    progress: 48,
    milestone: "Foundation sign-off",
    due: "Nov 24, 2026",
    description:
      "Reinforce a transmission corridor and replace selected tower foundations.",
    update:
      "Foundation work is three days behind plan. The field inspection report is still outstanding.",
    workOrders: 19,
    documents: 12,
  },
  {
    id: "HQ-2605",
    name: "Beauharnois spillway maintenance",
    short: "Beauharnois",
    region: "Montérégie",
    type: "Maintenance",
    owner: "Louis Bouchard",
    initials: "LB",
    color: "lavender",
    status: "on-track",
    budget: 12.2,
    spent: 8.5,
    progress: 70,
    milestone: "Gate movement test",
    due: "Nov 26, 2026",
    description:
      "Complete planned mechanical maintenance and verify spillway gate operation.",
    update:
      "Mechanical servicing is complete on four of six gates. Movement tests are booked for next week.",
    workOrders: 32,
    documents: 16,
  },
  {
    id: "HQ-2606",
    name: "Montréal distribution renewal",
    short: "Montréal",
    region: "Montréal",
    type: "Distribution",
    owner: "Emma Fortin",
    initials: "EF",
    color: "peach",
    status: "on-track",
    budget: 10.5,
    spent: 5.2,
    progress: 50,
    milestone: "Phase 2 crew mobilization",
    due: "Nov 30, 2026",
    description:
      "Renew selected underground distribution assets and coordinate the next phase of field work.",
    update:
      "Phase 1 is complete. The next crew coordination meeting will confirm mobilization details.",
    workOrders: 41,
    documents: 21,
  },
];

export const TASKS = [
  {
    id: "ACT-104",
    project: "HQ-2602",
    title: "Transformer purchase order awaiting approval",
    detail:
      "PO-4821 needs finance approval before the November 27 delivery milestone.",
    source: "sap",
    record: "PO-4821",
    owner: "Thomas Gagnon",
    severity: "high",
    due: "Nov 19",
    overdue: true,
  },
  {
    id: "ACT-108",
    project: "HQ-2604",
    title: "Field inspection report is missing",
    detail:
      "The foundation inspection document is needed for the November 24 sign-off.",
    source: "sharepoint",
    record: "DOC-4108",
    owner: "Sophie Tremblay",
    severity: "high",
    due: "Nov 18",
    overdue: true,
  },
  {
    id: "ACT-112",
    project: "HQ-2604",
    title: "Review the revised contractor schedule",
    detail:
      "Foundation completion has moved three days beyond the baseline schedule.",
    source: "primavera",
    record: "SCH-2614",
    owner: "Sophie Tremblay",
    severity: "medium",
    due: "Nov 23",
    overdue: false,
  },
  {
    id: "ACT-115",
    project: "HQ-2606",
    title: "Confirm phase 2 crew availability",
    detail:
      "Confirm crew assignments before the November 30 mobilization milestone.",
    source: "maximo",
    record: "WO-6115",
    owner: "Emma Fortin",
    severity: "low",
    due: "Nov 24",
    overdue: false,
  },
];

export const CONNECTIONS = [
  {
    id: "sap",
    name: "SAP",
    category: "Finance & procurement",
    mark: "SAP",
    color: "blue",
    description: "Budgets, actual spending, and purchase orders.",
    records: 126,
    entity: "Financial records",
    fields: [
      "Project ID",
      "Approved budget",
      "Actual spending",
      "Purchase order status",
    ],
  },
  {
    id: "maximo",
    name: "IBM Maximo",
    category: "Asset & work management",
    mark: "M",
    color: "lavender",
    description: "Work orders, asset references, and completion updates.",
    records: 178,
    entity: "Work orders",
    fields: [
      "Project ID",
      "Asset reference",
      "Work order",
      "Completion status",
    ],
  },
  {
    id: "sharepoint",
    name: "SharePoint",
    category: "Documents & field reports",
    mark: "S",
    color: "mint",
    description: "Inspection documents, field reports, and project files.",
    records: 122,
    entity: "Documents",
    fields: ["Project ID", "Document reference", "Document status", "Owner"],
  },
  {
    id: "primavera",
    name: "Primavera P6",
    category: "Planning & milestones",
    mark: "P6",
    color: "sand",
    description: "Milestones, planned dates, and project progress.",
    records: 64,
    entity: "Schedule records",
    fields: ["Project ID", "Milestone", "Planned date", "Progress"],
  },
];

export const ACTIVITY = [
  {
    source: "maximo",
    title: "Rotor balancing marked complete",
    project: "HQ-2601",
    time: "09:42",
    detail: "WO-1038 · Manic-5",
  },
  {
    source: "sap",
    title: "Purchase order requires approval",
    project: "HQ-2602",
    time: "09:36",
    detail: "PO-4821 · Boucherville",
  },
  {
    source: "sharepoint",
    title: "Acceptance documentation added",
    project: "HQ-2603",
    time: "09:21",
    detail: "DOC-3031 · La Grande-2",
  },
];

/** Sum financials and progress for a portfolio selection.
 * @param {Array} projects - Project records to aggregate.
 * @returns {object} Budget, spending, average progress, and status counts.
 */
export function summarizeProjects(projects) {
  return {
    budget: projects.reduce((sum, project) => sum + project.budget, 0),
    spent: projects.reduce((sum, project) => sum + project.spent, 0),
    progress: projects.length
      ? Math.round(
          projects.reduce((sum, project) => sum + project.progress, 0) /
            projects.length,
        )
      : 0,
    onTrack: projects.filter((project) => project.status === "on-track").length,
    atRisk: projects.filter((project) => project.status === "at-risk").length,
    delayed: projects.filter((project) => project.status === "delayed").length,
  };
}
