/**
 * Step 14: Summary
 * - renderSummaryStep(character, container, onUpdate)
 *
 * Displays a concise summary of the character, points and selected phobias.
 * Relies on shared helpers: escapeHtml, sectionHeader.
 */

function renderSummaryStep(character, container, onUpdate) {
    const availablePoints = (character.getAvailablePoints && typeof character.getAvailablePoints === 'function') ? character.getAvailablePoints() : 0;

    const name = character.name || 'Unnamed';
    const race = character.race || 'No Race';
    const cls = character.class || 'No Class';

    // Stats
    let statsHtml = '<div class="stats-grid">';
    for (const stat in character.stats) {
        statsHtml += '<div class="stat-row"><span class="stat-label">' + escapeHtml(stat) + '</span><span class="stat-value">' + escapeHtml(String(character.stats[stat])) + '</span></div>';
    }
    statsHtml += '</div>';

    // Derived stats
    const derived = character.derivedStats || {};
    let derivedHtml = '<div class="stats-grid">';
    derivedHtml += '<div class="stat-row stat-derived"><span class="stat-label">PHYS</span><span class="stat-value">' + escapeHtml(String(derived.PHYS || 0)) + '</span></div>';
    derivedHtml += '<div class="stat-row stat-derived"><span class="stat-label">KNOW</span><span class="stat-value">' + escapeHtml(String(derived.KNOW || 0)) + '</span></div>';
    if (character.isFluxUser && character.isFluxUser()) {
        derivedHtml += '<div class="stat-row stat-derived"><span class="stat-label">FLUX</span><span class="stat-value">' + escapeHtml(String(derived.FLUX || 0)) + '</span></div>';
    }
    derivedHtml += '</div>';

    // Skills (grouped by category)
    let skillsHtml = '<div class="skills-summary"><h4>Skills</h4>';
    let anySkills = false;
    for (const catKey in SKILLS) {
        const category = SKILLS[catKey];
        // collect skills in this category that have ranks
        const skillsInCat = [];
        for (const skillName in category.skills) {
            const rank = character.skills[skillName] || 0;
            if (rank > 0) skillsInCat.push({ name: skillName, rank });
        }
        if (skillsInCat.length) {
            anySkills = true;
            skillsHtml += '<div class="skill-category-summary"><strong>' + escapeHtml(category.name) + '</strong><div class="grid-2" style="margin-top:6px">';
            skillsInCat.forEach(s => {
                skillsHtml += '<div>' + escapeHtml(s.name) + ': <strong>' + escapeHtml(String(s.rank)) + '</strong></div>';
            });
            skillsHtml += '</div></div>';
        }
    }
    if (!anySkills) {
        skillsHtml += '<div style="color:#666">No skills allocated</div>';
    }
    skillsHtml += '</div>';

    // Advantages / Disadvantages
    const advEntries = Object.entries(character.advantages || {});
    const disEntries = Object.entries(character.disadvantages || {});
    function getAdvDisplayName(key) {
        for (const catKey in ADVANTAGES) {
            if (ADVANTAGES[catKey].items && ADVANTAGES[catKey].items[key]) {
                return ADVANTAGES[catKey].items[key].name || key;
            }
        }
        return key;
    }
    const advantagesHtml = advEntries.length ? advEntries.map(([k,v]) => '<div><strong>' + escapeHtml(getAdvDisplayName(k)) + '</strong> (Rank ' + escapeHtml(String(v)) + ')</div>').join('') : '<div style="color:#666">None</div>';
    const disadvantagesHtml = disEntries.length ? disEntries.map(([k,v]) => '<div><strong>' + escapeHtml(getAdvDisplayName(k)) + '</strong> (Rank ' + escapeHtml(String(v)) + ')</div>').join('') : '<div style="color:#666">None</div>';

    // Ebon abilities & formulae
    const ebonSelections = [];
    if (character.ebonRanks && typeof EBON_ABILITIES !== 'undefined') {
        for (const catKey in character.ebonRanks) {
            const rank = Number(character.ebonRanks[catKey] || 0);
            if (!rank || rank <= 0) continue;
            const cat = EBON_ABILITIES[catKey];
            if (!cat) continue;
            if (catKey === 'formulae') continue;
            const rankData = Array.isArray(cat.ranks) ? cat.ranks[rank - 1] : null;
            const rankTitle = rankData && rankData.title ? rankData.title : ('Rank ' + rank);
            ebonSelections.push(cat.name + ' ' + rankTitle);
        }
    }
    if (character.ebonAbilities && character.ebonAbilities.length) {
        character.ebonAbilities.forEach(e => ebonSelections.push(e));
    }
    const ebonHtml = ebonSelections.length ? ebonSelections.map(e => '<div>' + escapeHtml(e) + '</div>').join('') : '<div style="color:#666">None</div>';

    const formulaeSelections = [];
    if (character.selectedFormulae && character.selectedFormulae.length) {
        character.selectedFormulae.forEach(f => formulaeSelections.push(f));
    } else if (character.ebonRanks && typeof EBON_ABILITIES !== 'undefined') {
        const fRank = Number(character.ebonRanks.formulae || 0);
        if (fRank > 0 && EBON_ABILITIES.formulae && Array.isArray(EBON_ABILITIES.formulae.ranks)) {
            const rankData = EBON_ABILITIES.formulae.ranks[fRank - 1];
            const rankTitle = rankData && rankData.title ? rankData.title : ('Rank ' + fRank);
            formulaeSelections.push(rankTitle);
        }
    }
    const formulaeHtml = formulaeSelections.length ? formulaeSelections.map(f => '<div>' + escapeHtml(f) + '</div>').join('') : '<div style="color:#666">None</div>';

    // Drugs
    const drugEntries = Object.entries(character.drugInventory || {}).filter(([,q]) => q > 0);
    const drugsHtml = drugEntries.length ? drugEntries.map(([k,q]) => '<div>' + escapeHtml(k) + ' × ' + escapeHtml(String(q)) + '</div>').join('') : '<div style="color:#666">No drugs</div>';

    // Phobias (with trigger)
    let phobiasList = '';
    if (character.phobias && character.phobias.length) {
        phobiasList = '<div class="phobia-summary"><h4>Phobias (' + escapeHtml(String(character.phobias.length)) + ' Active)</h4>';
        character.phobias.forEach(phobia => {
            phobiasList += '<div class="phobia-card"><div class="phobia-card-name">' + escapeHtml(phobia.name) + ' (Rank ' + escapeHtml(String(phobia.rank)) + ')</div>';
            if (phobia.trigger) phobiasList += '<div class="phobia-trigger-note">' + escapeHtml(phobia.trigger) + '</div>';
            phobiasList += '</div>';
        });
        phobiasList += '</div>';
    } else {
        phobiasList = '<div style="color:#666">No phobias selected</div>';
    }

    // Points and meta
    const totalPoints = character.totalPoints || 0;
    const spentPoints = character.spentPoints || 0;
    const scl = character.scl || '';
    const created = character.created || '';
    const version = character.version || '';
    // Financials
    const credits = (typeof character.credits !== 'undefined') ? character.credits : 0;
    const uni = credits * 10;
    const inductionLocked = !!character.inductionLocked;
    const inductionBonus = character.inductionBonus || 0;
    const financeMedium = character.financeChip ? 'Chip' : (character.financeCard ? 'Card' : 'None');
    const housing = character.housing || {};
    const housingDisplay = housing.type || 'None';

    // Armaments (totals per type)
    const armamentEntries = Object.entries(character.armamentInventory || {}).filter(([,q]) => q > 0);
    const armamentsHtml = armamentEntries.length ? armamentEntries.map(([k,q]) => '<div>' + escapeHtml(k) + ' × ' + escapeHtml(String(q)) + '</div>').join('') : '<div style="color:#666">No armaments</div>';

    // Armour (totals per type)
    const armourEntries = Object.entries(character.armourInventory || {}).filter(([,q]) => q > 0);
    const armourHtml = armourEntries.length ? armourEntries.map(([k,q]) => '<div>' + escapeHtml(k) + ' × ' + escapeHtml(String(q)) + '</div>').join('') : '<div style="color:#666">No armour</div>';

    // Weapons (totals per type)
    const weaponEntries = Object.entries(character.weaponInventory || {}).filter(([,q]) => q > 0);
    const weaponsHtml = weaponEntries.length ? weaponEntries.map(([k,q]) => '<div>' + escapeHtml(k) + ' × ' + escapeHtml(String(q)) + '</div>').join('') : '<div style="color:#666">No weapons</div>';

    // Ammunition (totals per calibre x type)
    const ammoEntries = Object.entries(character.ammoInventory || {}).filter(([,q]) => q > 0);
    const ammoHtml = ammoEntries.length ? ammoEntries.map(([k,q]) => '<div>' + escapeHtml(k) + ' × ' + escapeHtml(String(q)) + '</div>').join('') : '<div style="color:#666">No ammunition</div>';

    // Grenades (totals per type)
    const grenadeEntries = Object.entries(character.grenadeInventory || {}).filter(([,q]) => q > 0);
    const grenadesHtml = grenadeEntries.length ? grenadeEntries.map(([k,q]) => '<div>' + escapeHtml(k) + ' × ' + escapeHtml(String(q)) + '</div>').join('') : '<div style="color:#666">No grenades</div>';

    // Vehicles (totals per type)
    const vehicleEntries = Object.entries(character.vehicleInventory || {}).filter(([,q]) => q > 0);
    const vehiclesHtml = vehicleEntries.length ? vehicleEntries.map(([k,q]) => '<div>' + escapeHtml(k) + ' × ' + escapeHtml(String(q)) + '</div>').join('') : '<div style="color:#666">No vehicles</div>';

    // Specialist Ammunition (totals per type)
    const specialistEntries = Object.entries(character.specialistAmmoInventory || {}).filter(([,q]) => q > 0);
    const specialistHtml = specialistEntries.length ? specialistEntries.map(([k,q]) => '<div>' + escapeHtml(k) + ' × ' + escapeHtml(String(q)) + '</div>').join('') : '<div style="color:#666">No specialist ammunition</div>';

    // Equipment (totals per type)
    const equipmentEntries = Object.entries(character.equipmentInventory || {}).filter(([,q]) => q > 0);
    const equipmentHtml = equipmentEntries.length ? equipmentEntries.map(([k,q]) => '<div>' + escapeHtml(k) + ' × ' + escapeHtml(String(q)) + '</div>').join('') : '<div style="color:#666">No equipment</div>';

    // Ebon Equipment (totals per type)
    const ebonEquipmentEntries = Object.entries(character.ebonEquipmentInventory || {}).filter(([,q]) => q > 0);
    const ebonEquipmentHtml = ebonEquipmentEntries.length ? ebonEquipmentEntries.map(([k,q]) => '<div>' + escapeHtml(k) + ' × ' + escapeHtml(String(q)) + '</div>').join('') : '<div style="color:#666">No ebon equipment</div>';

    container.innerHTML = sectionHeader('Step 14: Character Summary') +
        '<div class="card"><div class="card-title">' + escapeHtml(name) + '</div><div class="card-subtitle">' + escapeHtml(race) + '</div></div>' +
        '<div style="margin-top:12px;display:grid;grid-template-columns:1fr 1fr;gap:12px">' +
            '<div>' +
                '<h3>Primary Stats</h3>' + statsHtml +
                '<h3 style="margin-top:12px">Derived & Resources</h3>' + derivedHtml +
                '<div style="margin-top:10px"><strong>SCL:</strong> ' + escapeHtml(scl) + ' • <strong>Total Points:</strong> ' + escapeHtml(String(totalPoints)) + ' • <strong>Spent:</strong> ' + escapeHtml(String(spentPoints)) + '</div>' +
                '<div style="margin-top:6px"><strong>Credits:</strong> ' + escapeHtml(String(credits)) + 'c • <strong>UNI:</strong> ' + escapeHtml(String(uni)) + 'n • <strong>Finance:</strong> ' + escapeHtml(String(financeMedium)) + '</div>' +
                (inductionLocked ? '<div style="margin-top:6px"><em>Induction Bonus: ' + escapeHtml(String(inductionBonus)) + 'c (locked)</em></div>' : '<div style="margin-top:6px"><em>Induction Bonus: ' + escapeHtml(String(inductionBonus)) + 'c</em></div>') +
                '<div style="margin-top:6px"><strong>Housing:</strong> ' + escapeHtml(housingDisplay) + '</div>' +
                '<div style="margin-top:8px"><h3>Points Available: ' + escapeHtml(String(availablePoints)) + '</h3></div>' +
            '</div>' +
            '<div>' +
                '<h3>Skills & Packages</h3>' + skillsHtml +
                '<h4 style="margin-top:12px">Advantages</h4>' + advantagesHtml +
                '<h4 style="margin-top:12px">Disadvantages</h4>' + disadvantagesHtml +
            '</div>' +
        '</div>' +
        '<div style="margin-top:18px"><h4>Drugs</h4>' + drugsHtml + '</div>' +
        '<div style="margin-top:18px"><h4>Armaments</h4>' + armamentsHtml + '</div>' +
        '<div style="margin-top:18px"><h4>Armour</h4>' + armourHtml + '</div>' +
        '<div style="margin-top:18px"><h4>Weapons</h4>' + weaponsHtml + '</div>' +
        '<div style="margin-top:18px"><h4>Grenades</h4>' + grenadesHtml + '</div>' +
        '<div style="margin-top:18px"><h4>Ammunition</h4>' + ammoHtml + '</div>' +
        '<div style="margin-top:18px"><h4>Specialist Ammunition</h4>' + specialistHtml + '</div>' +
        '<div style="margin-top:18px"><h4>Equipment</h4>' + equipmentHtml + '</div>' +
        '<div style="margin-top:18px"><h4>Ebon Equipment</h4>' + ebonEquipmentHtml + '</div>' +
        '<div style="margin-top:18px"><h4>Vehicles</h4>' + vehiclesHtml + '</div>' +
        '<div style="margin-top:18px;display:grid;grid-template-columns:1fr 1fr;gap:12px">' +
            '<div><h4>Ebon Abilities</h4>' + ebonHtml + '<h5 style="margin-top:8px">Formulae</h5>' + formulaeHtml + '</div>' +
            '<div><h4>Phobias</h4>' + phobiasList + '</div>' +
        '</div>' +
        '<div style="margin-top:18px;font-size:12px;color:#666">Created: ' + escapeHtml(created) + ' • Version: ' + escapeHtml(version) + '</div>';
}
