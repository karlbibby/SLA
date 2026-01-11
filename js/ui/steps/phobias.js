// Phobias selection step - list from PHOBIAS.items, allow up to PHOBIA_RULES.max_at_creation and set rank + trigger
function renderPhobiasStep(character, container, onUpdate) {
    const max = (typeof PHOBIA_RULES !== 'undefined' && PHOBIA_RULES.max_at_creation) ? PHOBIA_RULES.max_at_creation : 3;
    const globalMaxRank = (typeof PHOBIA_RULES !== 'undefined' && PHOBIA_RULES.max_rank) ? PHOBIA_RULES.max_rank : 10;
    character.phobias = character.phobias || []; // array of { id, name, rank, trigger }

    // support both new 'conflicts' and legacy 'conflicting_pairs' keys
    function getConflicts() {
        if (!PHOBIA_RULES) return [];
        return PHOBIA_RULES.conflicts || PHOBIA_RULES.conflicting_pairs || [];
    }

    function isConflicting(existingId, candidateId) {
        const conflicts = getConflicts();
        if (!Array.isArray(conflicts)) return false;
        return conflicts.some(pair => (pair[0] === existingId && pair[1] === candidateId) || (pair[1] === existingId && pair[0] === candidateId));
    }

    function anyConflictWithSelected(candidateId) {
        return character.phobias.some(p => isConflicting(p.id, candidateId));
    }

    // Build items array with fallback for older PHOBIAS structure
    let items = [];
    if (typeof PHOBIAS !== 'undefined' && PHOBIAS.items && Object.keys(PHOBIAS.items).length > 0) {
        items = Object.values(PHOBIAS.items).slice();
    } else {
        // legacy: PHOBIAS.rank1 / rank2 / rank3 with phobia_data
        ['rank1','rank2','rank3'].forEach(rk => {
            if (PHOBIAS && PHOBIAS[rk] && PHOBIAS[rk].phobia_data) {
                for (const key in PHOBIAS[rk].phobia_data) {
                    const d = PHOBIAS[rk].phobia_data[key];
                    items.push({
                        id: key,
                        name: d.name || key,
                        description: d.description || '',
                        maxRank: d.rank || (rk === 'rank1' ? 1 : rk === 'rank2' ? 2 : 3),
                        costPerRank: d.points || (PHOBIA_RULES && PHOBIA_RULES.costPerRank) || 2
                    });
                }
            }
        });
    }

    // sort by name
    items.sort((a,b) => (a.name || a.id).localeCompare(b.name || b.id));

    // build HTML
    let html = '<div class="section-header"><h2 class="section-title">Step: Phobias</h2><p class="section-description">Select up to ' + max + ' phobias. Conflicting phobias cannot be taken together. Tick to add and set a Rank and optional trigger note.</p></div>';
    html += '<div id="phobia-feedback" class="phobia-feedback" style="margin-bottom:8px;color:#a00"></div>';
    html += '<div class="phobias-container">';

    if (items.length === 0) {
        html += '<div style="color:#666">No phobias available.</div>';
    } else {
        html += '<div class="phobia-list">';
        items.forEach(item => {
            const id = item.id || item.name;
            const checked = !!character.phobias.find(p => p.id === id);
            const currentlySelectedCount = character.phobias.length;
            const disabledByCount = !checked && currentlySelectedCount >= max;
            const disabledByConflict = !checked && anyConflictWithSelected(id);
            const disabled = disabledByCount || disabledByConflict;

            const displayRank = item.maxRank || globalMaxRank || 10;
            const selectedEntry = character.phobias.find(p => p.id === id);
            const selectedRank = selectedEntry ? selectedEntry.rank : 1;
            const triggerValue = selectedEntry ? selectedEntry.trigger : '';

            html += '<div class="phobia-item" data-id="' + escapeHtml(id) + '" style="margin-bottom:8px;padding:6px;border-bottom:1px solid #eee">';
            html += '<label style="display:flex;align-items:center;gap:10px;">';
            html += '<input type="checkbox" class="phobia-checkbox" data-id="' + escapeHtml(id) + '"' + (checked ? ' checked' : '') + (disabled ? ' disabled' : '') + ' />';
            html += '<div style="flex:1"><strong>' + escapeHtml(item.name || id) + '</strong> <span style="color:#666">(' + escapeHtml(item.description || '') + ')</span></div>';
            html += '</label>';
            // Rank selector (visible when checked)
            html += '<div class="phobia-controls" style="' + (checked ? '' : 'display:none;') + ' margin-top:6px;">';
            html += '<label style="margin-right:12px">Rank: <select class="phobia-rank-select" data-id="' + escapeHtml(id) + '">';
            for (let r = 1; r <= displayRank; r++) {
                html += '<option value="' + r + '"' + (r === selectedRank ? ' selected' : '') + '>' + r + '</option>';
            }
            html += '</select></label>';
            html += '<label>Trigger / Note: <input type="text" class="phobia-trigger-input" data-id="' + escapeHtml(id) + '" value="' + escapeHtml(triggerValue) + '" /></label>';
            html += '</div>'; // controls
            html += '</div>'; // item
        });
        html += '</div>';
    }

    html += '<div style="margin-top:12px;color:#555">Selected: <span id="phobia-selected-count">' + character.phobias.length + '</span> / ' + max + '</div>';
    html += '</div>';

    container.innerHTML = html;

    const feedbackEl = container.querySelector('#phobia-feedback');
    function showFeedback(msg, timeout = 3000) {
        if (!feedbackEl) return;
        feedbackEl.textContent = msg;
        if (timeout) setTimeout(() => { if (feedbackEl) feedbackEl.textContent = ''; }, timeout);
    }

    // Helpers for manipulating character.phobias
    function addPhobia(id) {
        const item = (PHOBIAS && PHOBIAS.items && PHOBIAS.items[id]) ? PHOBIAS.items[id] : null;
        const name = (item && item.name) ? item.name : id;
        const rank = 1;
        character.phobias.push({ id: id, name: name, rank: rank, trigger: '' });
    }
    function removePhobia(id) {
        const idx = character.phobias.findIndex(p => p.id === id);
        if (idx > -1) character.phobias.splice(idx, 1);
    }

    // Checkbox handlers
    container.querySelectorAll('.phobia-checkbox').forEach(cb => {
        cb.addEventListener('change', e => {
            const id = cb.dataset.id;
            const wasChecked = cb.checked;
            if (wasChecked) {
                if (character.phobias.length >= max) {
                    cb.checked = false;
                    showFeedback('Maximum of ' + max + ' phobias allowed.');
                    return;
                }
                if (anyConflictWithSelected(id)) {
                    cb.checked = false;
                    showFeedback('This phobia conflicts with an already selected phobia.');
                    return;
                }
                // add
                addPhobia(id);
            } else {
                removePhobia(id);
            }
            // re-render to update states
            renderPhobiasStep(character, container, onUpdate);
            if (typeof onUpdate === 'function') onUpdate();
        });
    });

    // Rank selectors
    container.querySelectorAll('.phobia-rank-select').forEach(sel => {
        sel.addEventListener('change', e => {
            const id = sel.dataset.id;
            const ph = character.phobias.find(p => p.id === id);
            if (ph) ph.rank = parseInt(sel.value, 10) || 1;
            if (typeof onUpdate === 'function') onUpdate();
        });
    });

    // Trigger inputs
    container.querySelectorAll('.phobia-trigger-input').forEach(inp => {
        inp.addEventListener('input', e => {
            const id = inp.dataset.id;
            const ph = character.phobias.find(p => p.id === id);
            if (ph) ph.trigger = inp.value;
            if (typeof onUpdate === 'function') onUpdate();
        });
    });

    // small utility to escape HTML in strings inserted into the DOM
    function escapeHtml(str) {
        if (str === null || str === undefined) return '';
        return String(str)
            .replace(/&/g, '&')
            .replace(/"/g, '"')
            .replace(/'/g, '&#39;')
            .replace(/</g, '<')
            .replace(/>/g, '>');
    }
}
