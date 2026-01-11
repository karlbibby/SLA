// Phobias selection step - multi-select up to PHOBIA_RULES.max_at_creation (UI + validation)
function renderPhobiasStep(character, container, onUpdate) {
    const max = (typeof PHOBIA_RULES !== 'undefined' && PHOBIA_RULES.max_at_creation) ? PHOBIA_RULES.max_at_creation : 3;
    character.phobias = character.phobias || [];
    const selectedNames = character.phobias.map(p => p.name);

    function isConflicting(existingName, candidateName) {
        if (!PHOBIA_RULES || !PHOBIA_RULES.conflicting_pairs) return false;
        return PHOBIA_RULES.conflicting_pairs.some(pair => (pair[0] === existingName && pair[1] === candidateName) || (pair[1] === existingName && pair[0] === candidateName));
    }

    function anyConflictWithSelected(candidateName) {
        return selectedNames.some(sel => isConflicting(sel, candidateName));
    }

    let html = '<div class="section-header"><h2 class="section-title">Step: Phobias</h2><p class="section-description">Select up to ' + max + ' phobias. Conflicting phobias cannot be taken together. Click a phobia to toggle and add an optional trigger note.</p></div>';
    html += '<div id="phobia-feedback" class="phobia-feedback" style="margin-bottom:8px;color:#a00"></div>';
    html += '<div class="phobias-container">';

    const rankKeys = ['rank1','rank2','rank3'];
    rankKeys.forEach(rankKey => {
        const rank = PHOBIAS[rankKey];
        if (!rank) return;
        html += '<div class="phobia-rank"><h3>' + rank.name + '</h3><div class="rank-desc">' + (rank.description || '') + '</div><div class="phobia-list">';
        for (const name in rank.phobia_data) {
            const data = rank.phobia_data[name];
            const checked = selectedNames.includes(name);
            const currentlySelectedCount = selectedNames.length;
            const disabledByCount = !checked && currentlySelectedCount >= max;
            const disabledByConflict = !checked && anyConflictWithSelected(name);
            const disabled = disabledByCount || disabledByConflict;
            html += '<div class="phobia-item" data-name="' + name + '">';
            html += '<label style="display:flex;align-items:center;gap:8px;">';
            html += '<input type="checkbox" class="phobia-checkbox" data-name="' + name + '"' + (checked ? ' checked' : '') + (disabled ? ' disabled' : '') + ' />';
            html += '<div><strong>' + name + '</strong> <span style="color:#666"> (Rank ' + data.rank + ' • ' + data.points + ' pts)</span><div style="font-size:12px;color:#444">' + (data.description || '') + '</div></div>';
            html += '</label>';
            html += '<div class="phobia-trigger" style="' + (checked ? '' : 'display:none;') + '"><label>Trigger / Note: <input type="text" class="phobia-trigger-input" data-name="' + name + '" value="' + (character.phobias.find(p => p.name === name)?.trigger || '') + '" /></label></div>';
            html += '</div>';
        }
        html += '</div></div>';
    });

    html += '<div style="margin-top:12px;color:#555">Selected: <span id="phobia-selected-count">' + selectedNames.length + '</span> / ' + max + '</div>';
    html += '</div>';

    container.innerHTML = html;

    const feedbackEl = container.querySelector('#phobia-feedback');
    function showFeedback(msg, timeout = 3000) {
        if (!feedbackEl) return;
        feedbackEl.textContent = msg;
        if (timeout) setTimeout(() => { if (feedbackEl) feedbackEl.textContent = ''; }, timeout);
    }

    // Checkbox handlers
    container.querySelectorAll('.phobia-checkbox').forEach(cb => {
        cb.addEventListener('change', e => {
            const name = cb.dataset.name;
            const wasChecked = cb.checked;
            // re-evaluate selected list from character to avoid stale state
            const currentSelected = character.phobias.map(p => p.name);
            if (wasChecked) {
                if (currentSelected.length >= max) {
                    cb.checked = false;
                    showFeedback('Maximum of ' + max + ' phobias allowed.');
                    return;
                }
                if (anyConflictWithSelected(name)) {
                    cb.checked = false;
                    showFeedback('This phobia conflicts with an already selected phobia.');
                    return;
                }
                // add
                const rankVal = (() => {
                    for (const rk of ['rank1','rank2','rank3']) {
                        if (PHOBIAS[rk].phobia_data[name]) return PHOBIAS[rk].phobia_data[name].rank || (rk === 'rank1' ? 1 : rk === 'rank2' ? 2 : 3);
                    }
                    return 1;
                })();
                character.phobias.push({ name: name, rank: rankVal, trigger: '' });
            } else {
                // remove
                const idx = character.phobias.findIndex(p => p.name === name);
                if (idx > -1) character.phobias.splice(idx, 1);
            }
            // re-render to update disabled states and trigger inputs
            renderPhobiasStep(character, container, onUpdate);
            if (typeof onUpdate === 'function') onUpdate();
        });
    });

    // Trigger input handlers (delegate)
    container.querySelectorAll('.phobia-trigger-input').forEach(inp => {
        inp.addEventListener('input', e => {
            const name = inp.dataset.name;
            const ph = character.phobias.find(p => p.name === name);
            if (ph) ph.trigger = inp.value;
            if (typeof onUpdate === 'function') onUpdate();
        });
    });
}
