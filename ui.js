/** Escape text before inserting it into HTML.
 * @param {unknown} value - Text or scalar to display.
 * @returns {string} HTML-safe text.
 */
export function escapeHtml(value) {
  return String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        character
      ],
  );
}

/** Format a CAD amount supplied in millions.
 * @param {number} value - Amount in millions of Canadian dollars.
 * @returns {string} Compact currency label.
 */
export function money(value) {
  return `$${value.toFixed(1)}M`;
}

/** Render a small, decorative line icon.
 * @param {string} name - Icon identifier.
 * @param {number} size - Width and height in pixels.
 * @returns {string} Accessible decorative SVG markup.
 */
export function icon(name, size = 20) {
  const paths = {
    overview:
      '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    projects: '<path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10H3Z"/>',
    reports: '<path d="M14 3H5v18h14V8Z"/><path d="M14 3v5h5M8 12h8M8 16h6"/>',
    connections:
      '<rect x="3" y="9" width="6" height="6" rx="2"/><rect x="15" y="3" width="6" height="6" rx="2"/><rect x="15" y="15" width="6" height="6" rx="2"/><path d="M9 12h3V6h3m-3 6v6h3"/>',
    arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
    chevron: '<path d="m9 5 7 7-7 7"/>',
    down: '<path d="m6 9 6 6 6-6"/>',
    search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
    spark:
      '<path d="m12 3 2.6 6.4L21 12l-6.4 2.6L12 21l-2.6-6.4L3 12l6.4-2.6Z"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    checkCircle: '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    alert: '<path d="m12 3 10 18H2Z"/><path d="M12 9v5m0 3v.1"/>',
    money:
      '<rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M6 12h.1M18 12h.1"/>',
    trend: '<path d="m3 16 6-6 4 4 8-9m-6 0h6v6"/>',
    calendar:
      '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/>',
    refresh:
      '<path d="M20 7v5h-5M4 17v-5h5"/><path d="M6.1 7a7 7 0 0 1 11.6-1L20 9M4 15l2.3 3A7 7 0 0 0 18 17"/>',
    download: '<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',
    close: '<path d="m6 6 12 12M6 18 18 6"/>',
    location:
      '<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2"/>',
    bolt: '<path d="m13 2-9 12h7l-1 8 10-13h-7Z"/>',
    link: '<path d="m10 13 4-4m-6 7-2 2a4 4 0 0 1-6-6l4-4a4 4 0 0 1 6 0m4-1 2-2a4 4 0 0 1 6 6l-4 4a4 4 0 0 1-6 0" transform="translate(1 0)"/>',
    copy: '<rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V3H3v13h5"/>',
    print: '<path d="M6 9V3h12v6M6 17H3V9h18v8h-3M6 14h12v7H6Z"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v.1"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    reset: '<path d="M3 4v6h6M3 10a9 9 0 1 1 1 7"/>',
  };
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.projects}</svg>`;
}

/** Render the public Hydro-Québec wordmark at its original aspect ratio.
 * @param {string} className - Optional visual class.
 * @returns {string} Decorative logo markup.
 */
export function logo(className = "") {
  return `<span class="brand-mark ${className}"><img src="./assets/hydro-quebec-logo.svg" alt="" width="200" height="65" /></span>`;
}

/** Render a project status badge with a text label.
 * @param {string} status - Project status identifier.
 * @returns {string} Status badge HTML.
 */
export function statusBadge(status) {
  const labels = {
    "on-track": "On track",
    "at-risk": "At risk",
    delayed: "Delayed",
  };
  return `<span class="status ${status}"><span></span>${labels[status] || escapeHtml(status)}</span>`;
}

/** Render an application identity tile.
 * @param {object} connection - Connection fixture.
 * @returns {string} Application tile HTML.
 */
export function appMark(connection) {
  return `<span class="app-mark ${connection.color}">${connection.mark}</span>`;
}

/** Download plain text without sending it to a server.
 * @param {string} filename - Download filename.
 * @param {string} content - File content.
 * @param {string} type - MIME type for the file.
 * @returns {void} Starts a browser download.
 */
export function downloadText(
  filename,
  content,
  type = "text/markdown;charset=utf-8",
) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
