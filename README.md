# Courant — Project reporting demo

An independent, interactive concept for a Hydro-Québec project and maintenance reporting hub. All project records, budgets, people, and updates are fictional. This application is not affiliated with or endorsed by Hydro-Québec.

## Run locally

No build or package installation is required. From this directory:

```bash
python3 -m http.server 8080 --bind 127.0.0.1
```

Open http://localhost:8080. Serve the directory over HTTP; JavaScript modules do not work by opening `index.html` directly.

## Demo workflows

- Overview: computed portfolio totals, budget/spending chart, project directory, and follow-ups.
- Projects: accent-insensitive search, status filters, CSV export, project detail, and source record inspection.
- Reports: generate portfolio or project reports, select sections, view saved drafts, copy Markdown, download Markdown, or print/save a PDF.
- Connections: inspect four illustrative source systems and simulate a sync.
- Follow-ups: mark items reviewed locally and prepare editable reminder drafts. No messages are sent.

The fixed reporting snapshot is November 16–20, 2026. Currency is CAD. Totals and reports derive from the fixtures in `data.js`. Report drafts are deterministic templates; no external AI API is used. Reviews, saved report snapshots (up to 20), and simulated sync state are stored only in the visitor's browser. Reviewing an action does not resolve it or change the source system.

## Files

- `data.js`: fictional project, source, activity, and follow-up records.
- `components.js`: dashboard, directory, source catalog, and project views.
- `reports.js`: report snapshots, Markdown exports, and printable previews.
- `app.js`: routing, local persistence, dialogs, and user actions.
- `ui.js`: formatting, escaping, icons, and downloads.
- `styles.css`: responsive design and print styles.

Deploy these static files at any path on a static web host. All application links are relative; navigation uses URL hashes. The only external asset request is Google Fonts; system fallback fonts work without it. No secrets, account credentials, or real source-system connections are needed.

## Hosting

The public demo is served by GitHub Pages from the `main` branch root of the standalone `massimo-caccia/hydro-project-hub` repository. Only this demo directory is published; the surrounding workspace is not included.

## Visual identity references

The demo uses Hydro-Québec’s public website palette: blue `#1224B8`, navy `#0F096C`, orange `#FF9B00`, and light blue `#E7F1FC`. Open Sans follows the body typography on its public site. These are implemented in local theme variables rather than importing the organization’s stylesheet.

References inspected November 21, 2026:

- [Hydro-Québec public website](https://www.hydroquebec.com/residential/)
- [Public web styles](https://www.hydroquebec.com/design/proto-kit/css-snapshots/hq-styles-1.2.1.min.css)
- [Official color wordmark](https://www.hydroquebec.com/images2016/logo-hydro-quebec-couleur.svg), saved as `assets/hydro-quebec-logo.svg`; its symbol is also used for the favicon. The marks belong to Hydro-Québec and are used here to identify this independent concept.

The navigation and report letterhead visibly label the application as an independent demo.
