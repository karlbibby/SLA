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

