// Step 2: Race Selection
function renderRaceStep(character, container, onUpdate) {
    let racesHtml = '<div class="grid-2">';
    for (const raceId in RACES) {
        const raceData = RACES[raceId];
        const isSelected = character.race === raceId;
        let statSummary = '';
        for (const stat in raceData.statMaximums) {
            statSummary += stat + ': ' + raceData.statMaximums[stat].max + ' ';
        }
        racesHtml += '<div class="card ' + (isSelected ? 'selected' : '') + '" data-race="' + raceId + '" style="cursor:pointer">' +
            '<div class="card-header"><div><div class="card-title">' + raceData.name + '</div>' +
            '<div class="card-subtitle">Flux User: ' + (raceData.fluxUser ? 'Yes' : 'No') + '</div></div></div>' +
            '<div class="card-description">' + raceData.description + '</div>' +
            '<div class="form-hint" style="margin-top:10px">Stat Maxes: ' + statSummary + '</div>' +
            '<div class="form-hint">' + raceData.special + '</div></div>';
    }
    racesHtml += '</div>';
    container.innerHTML = '<div class="section-header"><h2 class="section-title">Step 2: Select Race</h2><p class="section-description">Choose your character\'s species. Each race has different stat maximums and abilities.</p></div>' + racesHtml;
    container.querySelectorAll('[data-race]').forEach(card => card.addEventListener('click', () => { 
        const raceId = card.dataset.race;
        const isNewRace = character.race !== raceId;
        character.race = raceId;
        if (isNewRace) {
            const maximums = RACES[raceId]?.statMaximums || {};
            for (const stat in character.stats) {
                const min = maximums[stat]?.min ?? 5;
                character.stats[stat] = min;
            }
            character.skills = {};
            if (character.isFluxUser()) {
                character.derivedStats.FLUX = 10;
            }
        }
        character.calculateDerivedStats(); 
        character.applyRaceSkills();
        renderRaceStep(character, container, onUpdate); 
        onUpdate(); 
    }));
}

// Step 3: Class Selection
function renderClassStep(character, container, onUpdate) {
    // Class selection removed
}

// Step 4: Statistics
function renderStatsStep(character, container, onUpdate) {
    if (!character.race) { container.innerHTML = '<p>Please select a race first.</p>'; return; }
    const maximums = RACES[character.race].statMaximums;
    character.calculateDerivedStats();
    let statsHtml = '<div class="stats-grid">';
    for (const stat in character.stats) {
        const value = character.stats[stat];
        const max = maximums[stat]?.max || 10;
        const min = maximums[stat]?.min || 5;
        statsHtml += '<div class="stat-row" data-stat="' + stat + '"><span class="stat-label">' + stat + '</span><span class="stat-value">' + value + '</span>' +
            '<div class="stat-controls"><button class="stat-btn stat-decrease">−</button><button class="stat-btn stat-increase">+</button></div><span class="stat-max">Max: ' + max + '</span></div>';
    }
    statsHtml += '</div>';
    let derivedHtml = '<div style="margin-top:30px"><h3 style="margin-bottom:15px;color:var(--text-secondary)">Derived Statistics</h3><div class="stats-grid">' +
        '<div class="stat-row stat-derived"><span class="stat-label">PHYS</span><span class="stat-value">' + character.derivedStats.PHYS + '</span><span class="stat-max">(STR + DEX) ÷ 2</span></div>' +
        '<div class="stat-row stat-derived"><span class="stat-label">KNOW</span><span class="stat-value">' + character.derivedStats.KNOW + '</span><span class="stat-max">(DIA + CONC) ÷ 2</span></div>';
    
    if (character.isFluxUser()) {
        derivedHtml += '<div class="stat-row stat-derived" style="border-color:var(--color-primary)" data-stat="FLUX"><span class="stat-label">FLUX</span><span class="stat-value">' + character.derivedStats.FLUX + '</span><div class="stat-controls"><button class="stat-btn stat-flux-decrease" ' + (character.derivedStats.FLUX <= 10 ? 'disabled' : '') + '>−</button><button class="stat-btn stat-flux-increase">+</button></div><span class="stat-max">Cost: 5pts</span></div>';
    }
    
    derivedHtml += '</div></div>';
    container.innerHTML = '<div class="section-header"><h2 class="section-title">Step 4: Allocate Statistics</h2><p class="section-description">Spend points to increase your stats. Each point above 5 costs 5 points.</p></div>' + statsHtml + derivedHtml;
    container.querySelectorAll('.stat-increase').forEach(btn => btn.addEventListener('click', () => { const stat = btn.closest('[data-stat]').dataset.stat; if (character.stats[stat] < (maximums[stat]?.max || 10)) { character.stats[stat]++; character.calculateDerivedStats(); renderStatsStep(character, container, onUpdate); onUpdate(); } }));
    container.querySelectorAll('.stat-decrease').forEach(btn => btn.addEventListener('click', () => { const stat = btn.closest('[data-stat]').dataset.stat; if (character.stats[stat] > (maximums[stat]?.min || 5)) { character.stats[stat]--; character.calculateDerivedStats(); renderStatsStep(character, container, onUpdate); onUpdate(); } }));
    container.querySelectorAll('.stat-flux-increase').forEach(btn => btn.addEventListener('click', () => { character.derivedStats.FLUX++; renderStatsStep(character, container, onUpdate); onUpdate(); }));
    container.querySelectorAll('.stat-flux-decrease').forEach(btn => btn.addEventListener('click', () => { if (character.derivedStats.FLUX > 10) { character.derivedStats.FLUX--; renderStatsStep(character, container, onUpdate); onUpdate(); } }));
}
