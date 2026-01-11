// Step 8: Ebon Abilities
function renderEbonStep(character, container, onUpdate) {
    if (!character.isFluxUser()) { container.innerHTML = '<div class="section-header"><h2 class="section-title">Step 8: Flux Abilities</h2></div><p>Not an Ebon user.</p>'; return; }
    let abilitiesHtml = '<div class="equipment-grid">';
    for (const abilityName of character.ebonAbilities) { abilitiesHtml += `<div class="equipment-item selected"><div class="equipment-name">${abilityName}</div></div>`; }
    abilitiesHtml += '</div>';
    container.innerHTML = `<div class="section-header"><h2 class="section-title">Step 8: Flux Abilities</h2></div><div class="flux-display"><div class="flux-value">${character.derivedStats.FLUX}</div></div>${abilitiesHtml}`;
}

// Step 9: Equipment
function renderEquipmentStep(character, container, onUpdate) {
    if (!character.class) return;
    let equipmentHtml = '<div class="equipment-grid">';
    for (const equipment of character.selectedEquipment) { equipmentHtml += `<div class="equipment-item selected"><div class="equipment-name">${equipment}</div></div>`; }
    equipmentHtml += '</div>';
    container.innerHTML = `<div class="section-header"><h2 class="section-title">Step 9: Starting Equipment</h2></div>${equipmentHtml}`;
}

// Step 10: Drugs
function renderDrugsStep(character, container, onUpdate) {
    let drugsHtml = '<div class="drugs-container">';
    for (const categoryKey in DRUGS) {
        const category = DRUGS[categoryKey];
        drugsHtml += `<div class="drug-category"><div class="drug-category-header"><span class="drug-category-title">${category.name}</span></div><div class="drug-list">`;
        for (const drug of category.drugs) {
            const quantity = character.drugInventory[drug.name] || 0;
            drugsHtml += `<div class="drug-item" data-drug="${drug.name}"><div class="drug-name">${drug.name}</div><div class="drug-quantity"><button class="drug-qty-btn drug-decrease" ${quantity <= 0 ? 'disabled' : ''}>−</button><span class="drug-qty-value">${quantity}</span><button class="drug-qty-btn drug-increase">+</button></div></div>`;
        }
        drugsHtml += '</div></div>';
    }
    drugsHtml += '</div>';
    container.innerHTML = `<div class="section-header"><h2 class="section-title">Step 10: SLA Drugs</h2></div>${drugsHtml}`;
    container.querySelectorAll('.drug-increase').forEach(btn => btn.addEventListener('click', () => { const drugName = btn.closest('[data-drug]').dataset.drug; character.drugInventory[drugName] = (character.drugInventory[drugName] || 0) + 1; renderDrugsStep(character, container, onUpdate); onUpdate(); }));
    container.querySelectorAll('.drug-decrease').forEach(btn => { const drugName = btn.closest('[data-drug]').dataset.drug; if (character.drugInventory[drugName] > 0) { character.drugInventory[drugName]--; } renderDrugsStep(character, container, onUpdate); onUpdate(); });
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
