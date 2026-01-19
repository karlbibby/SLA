/**
 * Step 8: Drugs
 * - renderDrugsStep(character, container, onUpdate)
 *
 * Delegated click handler is replaced on each render to avoid duplicated listeners.
 * Relies on DRUGS data and shared helpers (escapeHtml).
 */

/**
 * Format detox/side-effect summary into a short string.
 */
function formatDetoxSummary(detox) {
    if (!detox) return 'None';
    if (typeof detox === 'string') return detox;
    if (Array.isArray(detox)) {
        return detox.map(d => {
            if (d.stat) return (d.delta || '') + ' ' + d.stat;
            if (d.damage) return (d.damage || '') + ' ' + (d.type || '');
            if (d.effects) return d.effects;
            return d.effect || JSON.stringify(d);
        }).join('; ');
    }
    if (detox.effects) return detox.effects;
    if (detox.stat) return (detox.delta || '') + ' ' + detox.stat;
    if (detox.damage) return (detox.damage || '') + ' ' + (detox.type || '');
    return detox.effect || JSON.stringify(detox);
}

/**
 * Build HTML describing a drug's effects.
 */
function drugEffectsHtml(drug) {
    let effects = '';
    const e = drug.effects || {};
    if (e.game) {
        effects += '<div class="drug-effect-note"><strong>Game Effects:</strong> ' + escapeHtml(e.game) + '</div>';
    }
    if (e.stat_modifiers) {
        e.stat_modifiers.forEach(m => {
            const dur = m.duration_minutes ? ' (' + m.duration_minutes + 'm)' : (m.duration_hours ? ' (' + m.duration_hours + 'h)' : '');
            effects += '<span class="drug-effect-tag positive">+' + escapeHtml(m.delta) + ' ' + escapeHtml(m.stat) + dur + '</span>';
        });
    }
    if (e.skill_modifiers) {
        e.skill_modifiers.forEach(m => {
            const dur = m.duration_minutes ? ' (' + m.duration_minutes + 'm)' : '';
            effects += '<span class="drug-effect-tag positive">+' + escapeHtml(m.delta) + ' ' + escapeHtml(m.skill) + dur + '</span>';
        });
    }
    if (e.other_effects && e.other_effects.length) {
        e.other_effects.forEach(o => effects += '<div class="drug-effect-note">' + escapeHtml(o) + '</div>');
    }
    return effects || '<span class="drug-effect-tag">Special effects</span>';
}

/**
 * Render the drugs step UI.
 */
function renderDrugsStep(character, container, onUpdate) {
    if (typeof sectionHeader !== 'function' || typeof escapeHtml !== 'function') {
        container.innerHTML = '<div class="info-box">Missing utilities for Drugs step.</div>';
        return;
    }

    character.drugInventory = character.drugInventory || {};

    let html = sectionHeader('Step 8: SLA Drugs', "Select drugs for your character's inventory. Each entry shows effects, side-effects and addiction risks.");
    html += '<div class="drugs-container">';
    for (const catKey in DRUGS) {
        const category = DRUGS[catKey];
        if (!category) continue;
        html += '<div class="drug-category"><div class="drug-category-header"><div class="drug-category-title">' + escapeHtml(category.name) + '</div>' +
            '<div class="drug-category-desc">' + escapeHtml(category.description || '') + '</div></div><div class="drug-list">';
        for (const drug of category.drugs || []) {
            const quantity = character.drugInventory[drug.name] || 0;
            const isSelected = quantity > 0;
            const effectsHtml = drugEffectsHtml(drug);
            const detoxSummary = formatDetoxSummary(drug.detox || (drug.side_effects && drug.side_effects.crash));
            const detoxTiming = (drug.detox && drug.detox.timing) || (drug.side_effects && drug.side_effects.timing) || 'timing unknown';
            const legal = drug.legal_status || drug.availability || 'unknown';
            const cost = drug.cost || 0;
            const addictionLabel = drug.addiction ? (drug.addiction.rate || drug.addiction.type || 'n/a') : 'n/a';
            const addictionEffects = drug.addiction ? (drug.addiction.effects || drug.addiction.failure_effect || 'no special failure effect') : 'no special failure effect';

            html += '<div class="drug-item ' + (isSelected ? 'selected' : '') + '" data-drug="' + escapeHtml(drug.name) + '">';
            html += '<div class="drug-header"><div class="drug-info"><div class="drug-name">' + escapeHtml(drug.name) + '</div>' +
                '<div class="drug-meta"><span class="drug-cost">' + escapeHtml(cost) + ' cr</span>' +
                '<span class="drug-legal ' + (legal === 'restricted' || legal === 'restricted_medical' ? 'legal-restricted' : (legal === 'licensed' ? 'legal-licensed' : 'legal-common')) + '">' + escapeHtml(legal) + '</span></div></div>';
            html += '<div class="drug-quantity"><button class="drug-qty-btn drug-decrease" ' + (quantity <= 0 ? 'disabled' : '') + '>−</button>' +
                '<span class="drug-qty-value">' + escapeHtml(quantity) + '</span><button class="drug-qty-btn drug-increase">+</button></div></div>';
            html += '<div class="drug-effects">' + effectsHtml + '</div>';
            html += '<div class="drug-side-effects"><strong>Detox:</strong> ' + escapeHtml(detoxSummary) + ' <em>(' + escapeHtml(detoxTiming) + ')</em></div>';
            html += '<div class="drug-addiction"><strong>Addiction:</strong> ' + escapeHtml(addictionLabel) + ' — ' + escapeHtml(addictionEffects) + '</div>';
            if (drug.description) html += '<div class="drug-description">' + escapeHtml(drug.description) + '</div>';
            html += '</div>';
        }
        html += '</div></div>';
    }
    html += '</div>';

    container.innerHTML = html;

    // Replace previous handler to avoid duplicates
    if (container._drugsHandler) {
        container.removeEventListener('click', container._drugsHandler);
    }
    container._drugsHandler = function (e) {
        if (!container.contains(e.target)) return;

        const inc = e.target.closest('.drug-qty-btn.drug-increase');
        const dec = e.target.closest('.drug-qty-btn.drug-decrease');

        function findDrugByName(name) {
            for (const k in DRUGS) {
                const cat = DRUGS[k];
                for (const d of (cat.drugs || [])) {
                    if (d.name === name) return d;
                }
            }
            return null;
        }

        if (inc) {
            const drugName = inc.closest('[data-drug]').getAttribute('data-drug');
            const drugObj = findDrugByName(drugName);
            const price = (drugObj && typeof drugObj.cost === 'number') ? drugObj.cost : 0;
            character.credits = (typeof character.credits !== 'undefined') ? character.credits : 0;
            if (price > 0 && character.credits < price) {
                alert('Insufficient credits to purchase ' + drugName + ' (' + price + 'c).');
                return;
            }
            if (price > 0) character.credits -= price;
            character.drugInventory[drugName] = (character.drugInventory[drugName] || 0) + 1;
            renderDrugsStep(character, container, onUpdate);
            if (typeof onUpdate === 'function') onUpdate();
            return;
        } else if (dec) {
            const drugName = dec.closest('[data-drug]').getAttribute('data-drug');
            const current = character.drugInventory[drugName] || 0;
            if (current > 0) {
                const drugObj = findDrugByName(drugName);
                const price = (drugObj && typeof drugObj.cost === 'number') ? drugObj.cost : 0;
                character.drugInventory[drugName] = current - 1;
                if (price > 0) {
                    character.credits = (typeof character.credits !== 'undefined') ? character.credits : 0;
                    character.credits += price;
                }
            }
            renderDrugsStep(character, container, onUpdate);
            if (typeof onUpdate === 'function') onUpdate();
            return;
        }
    };
    container.addEventListener('click', container._drugsHandler);
}
