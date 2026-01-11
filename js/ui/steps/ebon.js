/**
 * Step 8: Ebon / Flux Abilities
 * - renderEbonStep(character, container, onUpdate)
 * - abilityIcon(category)
 *
 * Event handler is attached per-render and replaced each time to ensure the
 * closure captures the current character and onUpdate references (avoids
 * stale closures or duplicated listeners).
 */

function abilityIcon(category) {
    switch (category) {
        case 'blast': return '💥';
        case 'glyph': return '🛡️';
        case 'science': return '🔬';
        case 'deathsuit': return '🦾';
        case 'necanthrope': return '🧠';
        default: return '✨';
    }
}

function renderEbonStep(character, container, onUpdate) {
    // Defensive: ensure helpers exist
    if (typeof sectionHeader !== 'function' || typeof fluxDisplayHtml !== 'function' || typeof equipmentItemHtml !== 'function') {
        container.innerHTML = '<div class="info-box">Missing utilities for Ebon step.</div>';
        return;
    }

    if (!character.isFluxUser || !character.isFluxUser() ) {
        container.innerHTML = sectionHeader('Step 8: Flux Abilities') +
            '<div class="info-box"><h4>Not an Ebon User</h4><p>Only Ebon and Brain Waster characters can use Flux abilities.</p></div>';
        return;
    }

    let html = '';
    html += sectionHeader('Step 8: Flux Abilities', 'Select your Ebon abilities. These require FLUX to use and have various effects.');
    html += fluxDisplayHtml(character.derivedStats.FLUX);

    html += '<div class="equipment-grid">';
    for (const catKey in EBON_ABILITIES) {
        const category = EBON_ABILITIES[catKey];
        if (!category || !category.abilities) continue;
        for (const abilityName in category.abilities) {
            const abilityData = category.abilities[abilityName] || {};
            const isSelected = (character.ebonAbilities || []).includes(abilityName);
            const icon = abilityIcon(abilityData.category);
            const meta = ['Flux: ' + (abilityData.fluxCost || 0), abilityData.category || ''];
            let desc = abilityData.description || '';
            if (abilityData.effect) desc += (desc ? ' ' : '') + 'Effect: ' + abilityData.effect;
            if (abilityData.damage) desc += (desc ? ' ' : '') + 'Damage: ' + abilityData.damage;
            if (abilityData.range) desc += (desc ? ' ' : '') + 'Range: ' + abilityData.range;
            if (abilityData.duration) desc += (desc ? ' ' : '') + 'Duration: ' + abilityData.duration;

            html += equipmentItemHtml({
                idAttr: 'data-ability="' + escapeHtml(abilityName) + '"',
                icon,
                name: abilityName,
                metaLines: meta.filter(Boolean),
                desc,
                selected: isSelected
            });
        }
    }
    html += '</div>';

    container.innerHTML = html;

    // Replace previous handler so closure captures current character/onUpdate
    if (container._ebonHandler) {
        container.removeEventListener('click', container._ebonHandler);
    }
    container._ebonHandler = function (e) {
        const item = e.target.closest('.equipment-item[data-ability]');
        if (!item || !container.contains(item)) return;
        const abilityName = item.getAttribute('data-ability');
        character.ebonAbilities = character.ebonAbilities || [];
        const idx = character.ebonAbilities.indexOf(abilityName);
        if (idx > -1) character.ebonAbilities.splice(idx, 1);
        else character.ebonAbilities.push(abilityName);
        // Re-render with current state
        renderEbonStep(character, container, onUpdate);
        if (typeof onUpdate === 'function') onUpdate();
    };
    container.addEventListener('click', container._ebonHandler);
}
