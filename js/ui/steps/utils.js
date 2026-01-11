/**
 * Shared UI helpers for wizard step renderers.
 * These are intentionally simple global helpers so step files can remain
 * plain scripts and drop-in compatible with the existing codebase.
 */

/**
 * Escape a string for safe insertion into innerHTML.
 * @param {any} s
 * @returns {string}
 */
function escapeHtml(s) {
    return String(s == null ? '' : s)
        .replace(/&/g, '&')
        .replace(/</g, '<')
        .replace(/>/g, '>');
}

/**
 * Build a consistent section header block.
 * @param {string} title
 * @param {string} [description]
 * @returns {string} HTML
 */
function sectionHeader(title, description) {
    return '<div class="section-header"><h2 class="section-title">' + escapeHtml(title) + '</h2>' +
        (description ? '<p class="section-description">' + escapeHtml(description) + '</p>' : '') +
        '</div>';
}

/**
 * Small FLUX display used by the Ebon step.
 * @param {number|string} flux
 * @returns {string} HTML
 */
function fluxDisplayHtml(flux) {
    return '<div class="flux-display"><div class="flux-icon">✨</div><div class="flux-info">' +
        '<h3>FLUX: ' + escapeHtml(flux) + '</h3><p>Psychic energy for powering abilities</p></div></div>';
}

/**
 * Generic equipment / list item renderer used by multiple steps.
 * @param {Object} opts
 * @param {string} opts.idAttr - attribute string (e.g. 'data-equipment="Knife"')
 * @param {string} opts.icon
 * @param {string} opts.name
 * @param {string[]} [opts.metaLines]
 * @param {string} [opts.desc]
 * @param {boolean} [opts.selected]
 * @returns {string}
 */
function equipmentItemHtml({ idAttr, icon, name, metaLines = [], desc = '', selected = false }) {
    return '<div class="equipment-item ' + (selected ? 'selected' : '') + '" ' + idAttr + ' style="cursor:pointer">' +
        '<div class="equipment-icon">' + icon + '</div>' +
        '<div class="equipment-info">' +
        '<div class="equipment-name">' + escapeHtml(name) + '</div>' +
        (metaLines.length ? '<div class="equipment-stats">' + metaLines.map(escapeHtml).join(' • ') + '</div>' : '') +
        (desc ? '<div class="equipment-desc">' + escapeHtml(desc) + '</div>' : '') +
        '</div>' +
        '<div class="advantage-checkbox">' + (selected ? '✓' : '') + '</div>' +
        '</div>';
}
