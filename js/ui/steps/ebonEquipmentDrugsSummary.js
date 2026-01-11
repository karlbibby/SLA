/* Step 8: Ebon/Flux Abilities (reformatted to match other tabs) */
function renderEbonStep(character, container, onUpdate) {
    if (!character.isFluxUser()) {
        container.innerHTML = '<div class="section-header"><h2 class="section-title">Step 8: Flux Abilities</h2></div><div class="info-box"><h4>Not an Ebon User</h4><p>Only Ebon and Brain Waster characters can use Flux abilities.</p></div>';
        return;
    }

    const classHeader = '<div class="section-header"><h2 class="section-title">Step 8: Flux Abilities</h2><p class="section-description">Select your Ebon abilities. These require FLUX to use and have various effects.</p></div>';
    const fluxDisplay = '<div class="flux-display"><div class="flux-icon">✨</div><div class="flux-info"><h3>FLUX: ' + character.derivedStats.FLUX + '</h3><p>Psychic energy for powering abilities</p></div></div>';

    let equipmentHtml = '<div class="equipment-grid">';
    for (const categoryKey in EBON_ABILITIES) {
        const category = EBON_ABILITIES[categoryKey];
        for (const abilityName in category.abilities) {
            const abilityData = category.abilities[abilityName];
            const isSelected = character.ebonAbilities.includes(abilityName);
            let icon = '✨';
            if (abilityData.category === 'blast') icon = '💥';
            else if (abilityData.category === 'glyph') icon = '🛡️';
            else if (abilityData.category === 'science') icon = '🔬';
            else if (abilityData.category === 'deathsuit') icon = '🦾';
            else if (abilityData.category === 'necanthrope') icon = '🧠';

            equipmentHtml += '<div class="equipment-item ' + (isSelected ? 'selected' : '') + '" data-ability="' + abilityName + '" style="cursor:pointer">' +
                '<div class="equipment-icon">' + icon + '</div>' +
                '<div class="equipment-info">' +
                '<div class="equipment-name">' + abilityName + '</div>' +
                '<div class="equipment-stats">Flux: ' + (abilityData.fluxCost || 0) + (abilityData.category ? ' • ' + abilityData.category : '') + '</div>' +
                '<div class="equipment-desc">' + (abilityData.description || '') + '</div>' +
                (abilityData.effect ? '<div class="equipment-desc"><strong>Effect:</strong> ' + abilityData.effect + '</div>' : '') +
                (abilityData.damage ? '<div class="equipment-desc"><strong>Damage:</strong> ' + abilityData.damage + '</div>' : '') +
                (abilityData.range ? '<div class="equipment-desc"><strong>Range:</strong> ' + abilityData.range + '</div>' : '') +
                (abilityData.duration ? '<div class="equipment-desc"><strong>Duration:</strong> ' + abilityData.duration + '</div>' : '') +
                '</div>' +
                '<div class="advantage-checkbox">' + (isSelected ? '✓' : '') + '</div>' +
                '</div>';
        }
    }
    equipmentHtml += '</div>';

    container.innerHTML = classHeader + fluxDisplay + equipmentHtml;

    // Attach handlers similar to other tabs
    container.querySelectorAll('.equipment-item[data-ability]').forEach(item => {
        item.addEventListener('click', () => {
            const abilityName = item.dataset.ability;
            const idx = character.ebonAbilities.indexOf(abilityName);
            if (idx > -1) character.ebonAbilities.splice(idx, 1);
            else character.ebonAbilities.push(abilityName);
            renderEbonStep(character, container, onUpdate);
            if (typeof onUpdate === 'function') onUpdate();
        });
    });
}

// Step 9: Equipment
function renderEquipmentStep(character, container, onUpdate) {
    if (!character.class) {
        container.innerHTML = '<div class="section-header"><h2 class="section-title">Step 9: Starting Equipment</h2></div><div class="info-box"><h4>Class Required</h4><p>Please select a class first.</p></div>';
        return;
    }

    const classData = CLASSES[character.class] || { startingEquipment: [] };
    let equipmentHtml = '<div class="equipment-grid">';
    for (const item of classData.startingEquipment) {
        // support either string entries or objects { name, description }
        const name = typeof item === 'string' ? item : (item.name || item.label || 'Unknown');
        const desc = typeof item === 'object' ? (item.description || '') : '';
        const isSelected = character.selectedEquipment.includes(name);
        let icon = '🔧';
        const ln = name.toLowerCase();
        if (ln.includes('pistol') || ln.includes('rifle') || ln.includes('shotgun') || ln.includes('blitzer') || ln.includes('fen')) icon = '🔫';
        else if (ln.includes('armor') || ln.includes('suit') || ln.includes('deathsuit') || ln.includes('bomb')) icon = '🛡️';
        else if (ln.includes('knife') || ln.includes('sword') || ln.includes('club')) icon = '⚔️';
        else if (ln.includes('grenade') || ln.includes('explosive')) icon = '💣';
        equipmentHtml += '<div class="equipment-item ' + (isSelected ? 'selected' : '') + '" data-equipment="' + name + '" style="cursor:pointer">' +
            '<div class="equipment-icon">' + icon + '</div>' +
            '<div class="equipment-info">' +
            '<div class="equipment-name">' + name + '</div>' +
            (desc ? '<div class="equipment-desc">' + desc + '</div>' : '') +
            '</div>' +
            '<div class="advantage-checkbox">' + (isSelected ? '✓' : '') + '</div>' +
            '</div>';
    }
    equipmentHtml += '</div>';

    container.innerHTML = '<div class="section-header"><h2 class="section-title">Step 9: Starting Equipment</h2><p class="section-description">Select starting weapons, armour and gear provided by your class. Click items to add/remove from your loadout.</p></div>' + equipmentHtml;

    container.querySelectorAll('.equipment-item[data-equipment]').forEach(item => {
        item.addEventListener('click', () => {
            const equipmentName = item.dataset.equipment;
            const idx = character.selectedEquipment.indexOf(equipmentName);
            if (idx > -1) character.selectedEquipment.splice(idx, 1);
            else character.selectedEquipment.push(equipmentName);
            renderEquipmentStep(character, container, onUpdate);
            if (typeof onUpdate === 'function') onUpdate();
        });
    });
}

/* Step 10: Drugs */
function renderDrugsStep(character, container, onUpdate) {
    let drugsHtml = '<div class="drugs-container">';
    for (const categoryKey in DRUGS) {
        const category = DRUGS[categoryKey];
        drugsHtml += '<div class="drug-category"><div class="drug-category-header"><div class="drug-category-title">' + category.name + '</div><div class="drug-category-desc">' + (category.description || '') + '</div></div><div class="drug-list">';
        for (const drug of category.drugs) {
            const quantity = character.drugInventory[drug.name] || 0;
            const isSelected = quantity > 0;
            // build effects html
            let effectsHtml = '';
            if (drug.effects) {
                if (drug.effects.stat_modifiers) {
                    drug.effects.stat_modifiers.forEach(e => { effectsHtml += '<span class="drug-effect-tag positive">+' + e.delta + ' ' + e.stat + (e.duration_minutes ? ' (' + e.duration_minutes + 'm)' : (e.duration_hours ? ' (' + e.duration_hours + 'h)' : '')) + '</span>'; });
                }
                if (drug.effects.skill_modifiers) {
                    drug.effects.skill_modifiers.forEach(e => { effectsHtml += '<span class="drug-effect-tag positive">+' + e.delta + ' ' + e.skill + (e.duration_minutes ? ' (' + e.duration_minutes + 'm)' : '') + '</span>'; });
                }
                if (drug.effects.other_effects && drug.effects.other_effects.length) {
                    drug.effects.other_effects.forEach(e => { effectsHtml += '<div class="drug-effect-note">' + e + '</div>'; });
                }
            }
            // side-effects summary
            let crashSummary = 'None';
            if (drug.side_effects) {
                const crash = drug.side_effects.crash;
                if (Array.isArray(crash)) {
                    crashSummary = crash.map(c => (c.stat ? (c.delta + ' ' + c.stat) : (c.damage ? (c.damage + ' ' + (c.type || '')) : (c.effect || JSON.stringify(c)))) ).join('; ');
                } else if (crash) {
                    crashSummary = crash.stat ? (crash.delta + ' ' + crash.stat) : (crash.damage ? (crash.damage + ' ' + (crash.type || '')) : (crash.effect || 'None'));
                }
            }
            // addiction info
            const addiction = drug.addiction || {};
            const legal = drug.legal_status || 'unknown';
            const cost = drug.cost_uni || 0;

            drugsHtml += '<div class="drug-item ' + (isSelected ? 'selected' : '') + '" data-drug="' + drug.name + '">';
            drugsHtml += '<div class="drug-header"><div class="drug-info"><div class="drug-name">' + drug.name + '</div><div class="drug-meta"><span class="drug-cost">' + cost + ' cr</span><span class="drug-legal ' + (legal === 'restricted' || legal === 'restricted_medical' ? 'legal-restricted' : (legal === 'licensed' ? 'legal-licensed' : 'legal-common')) + '">' + legal + '</span></div></div>';
            drugsHtml += '<div class="drug-quantity"><button class="drug-qty-btn drug-decrease" ' + (quantity <= 0 ? 'disabled' : '') + '>−</button><span class="drug-qty-value">' + quantity + '</span><button class="drug-qty-btn drug-increase">+</button></div></div>';
            drugsHtml += '<div class="drug-effects">' + (effectsHtml || '<span class="drug-effect-tag">Special effects</span>') + '</div>';
            drugsHtml += '<div class="drug-side-effects"><strong>Crash:</strong> ' + crashSummary + ' <em>(' + (drug.side_effects ? (drug.side_effects.timing || 'timing unknown') : 'timing unknown') + ')</em></div>';
            drugsHtml += '<div class="drug-addiction"><strong>Addiction:</strong> ' + (addiction.difficulty || 'n/a') + ' — ' + (addiction.failure_effect || 'no special failure effect') + '</div>';
            if (drug.description) drugsHtml += '<div class="drug-description">' + drug.description + '</div>';
            drugsHtml += '</div>';
        }
        drugsHtml += '</div></div>';
    }
    drugsHtml += '</div>';

    container.innerHTML = "<div class=\"section-header\"><h2 class=\"section-title\">Step 10: SLA Drugs</h2><p class=\"section-description\">Select drugs for your character's inventory. Each entry shows effects, side-effects and addiction risks.</p></div>" + drugsHtml;

    // Increase handlers
    container.querySelectorAll('.drug-qty-btn.drug-increase').forEach(btn => btn.addEventListener('click', () => {
        const drugName = btn.closest('[data-drug]').dataset.drug;
        character.drugInventory[drugName] = (character.drugInventory[drugName] || 0) + 1;
        renderDrugsStep(character, container, onUpdate);
        if (typeof onUpdate === 'function') onUpdate();
    }));

    // Decrease handlers
    container.querySelectorAll('.drug-qty-btn.drug-decrease').forEach(btn => btn.addEventListener('click', () => {
        const drugName = btn.closest('[data-drug]').dataset.drug;
        const current = character.drugInventory[drugName] || 0;
        if (current > 0) {
            character.drugInventory[drugName] = current - 1;
        }
        renderDrugsStep(character, container, onUpdate);
        if (typeof onUpdate === 'function') onUpdate();
    }));
}

// Step 11: Summary
function renderSummaryStep(character, container, onUpdate) {
    const availablePoints = character.getAvailablePoints();
    let phobiasList = '';
    if (character.phobias && character.phobias.length > 0) {
        phobiasList = '<div class="phobia-summary"><h4>Phobias (' + character.phobias.length + ' Active)</h4>';
        character.phobias.forEach(phobia => { phobiasList += '<div class="phobia-card"><div class="phobia-card-name">' + phobia.name + ' (Rank ' + phobia.rank + ')</div></div>'; });
        phobiasList += '</div>';
    }
    container.innerHTML = `<div class="section-header"><h2 class="section-title">Step 11: Character Summary</h2></div><div class="card"><div class="card-title">${character.name || 'Unnamed'}</div><div class="card-subtitle">${character.race || 'No Race'} • ${character.class || 'No Class'}</div></div><div style="margin-top:20px"><h3>Points Available: ${availablePoints}</h3></div>${phobiasList}`;
}
