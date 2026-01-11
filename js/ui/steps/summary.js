/**
 * Step 11: Summary
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

    // Skills
    let skillsHtml = '<div class="skills-summary"><h4>Skills</h4>';
    const skillEntries = Object.entries(character.skills || {}).filter(([,v]) => v > 0);
    if (skillEntries.length) {
        skillEntries.sort((a,b) => b[1] - a[1]);
        skillsHtml += '<div class="grid-2">';
        skillEntries.forEach(([k,v]) => {
            skillsHtml += '<div>' + escapeHtml(k) + ': <strong>' + escapeHtml(String(v)) + '</strong></div>';
        });
        skillsHtml += '</div>';
    } else {
        skillsHtml += '<div style="color:#666">No skills allocated</div>';
    }
    skillsHtml += '</div>';

    // Advantages / Disadvantages
    const advEntries = Object.entries(character.advantages || {});
    const disEntries = Object.entries(character.disadvantages || {});
    const advantagesHtml = advEntries.length ? advEntries.map(([k,v]) => '<div><strong>' + escapeHtml(k) + '</strong> (Rank ' + escapeHtml(String(v)) + ')</div>').join('') : '<div style="color:#666">None</div>';
    const disadvantagesHtml = disEntries.length ? disEntries.map(([k,v]) => '<div><strong>' + escapeHtml(k) + '</strong> (Rank ' + escapeHtml(String(v)) + ')</div>').join('') : '<div style="color:#666">None</div>';

    // Training packages
    const trainingHtml = (character.trainingPackages && character.trainingPackages.length) ? character.trainingPackages.map(tp => '<div>' + escapeHtml(tp) + '</div>').join('') : '<div style="color:#666">None</div>';

    // Ebon abilities & formulae
    const ebonHtml = (character.ebonAbilities && character.ebonAbilities.length) ? character.ebonAbilities.map(e => '<div>' + escapeHtml(e) + '</div>').join('') : '<div style="color:#666">None</div>';
    const formulaeHtml = (character.selectedFormulae && character.selectedFormulae.length) ? character.selectedFormulae.map(f => '<div>' + escapeHtml(f) + '</div>').join('') : '<div style="color:#666">None</div>';

    // Equipment
    const equipmentHtml = (character.selectedEquipment && character.selectedEquipment.length) ? character.selectedEquipment.map(e => '<div>' + escapeHtml(e) + '</div>').join('') : '<div style="color:#666">No equipment selected</div>';

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

    container.innerHTML = sectionHeader('Step 11: Character Summary') +
        '<div class="card"><div class="card-title">' + escapeHtml(name) + '</div><div class="card-subtitle">' + escapeHtml(race) + ' • ' + escapeHtml(cls) + '</div></div>' +
        '<div style="margin-top:12px;display:grid;grid-template-columns:1fr 1fr;gap:12px">' +
            '<div>' +
                '<h3>Primary Stats</h3>' + statsHtml +
                '<h3 style="margin-top:12px">Derived & Resources</h3>' + derivedHtml +
                '<div style="margin-top:10px"><strong>SCL:</strong> ' + escapeHtml(scl) + ' • <strong>Total Points:</strong> ' + escapeHtml(String(totalPoints)) + ' • <strong>Spent:</strong> ' + escapeHtml(String(spentPoints)) + '</div>' +
                '<div style="margin-top:8px"><h3>Points Available: ' + escapeHtml(String(availablePoints)) + '</h3></div>' +
            '</div>' +
            '<div>' +
                '<h3>Skills & Packages</h3>' + skillsHtml +
                '<h4 style="margin-top:12px">Training Packages</h4>' + trainingHtml +
                '<h4 style="margin-top:12px">Advantages</h4>' + advantagesHtml +
                '<h4 style="margin-top:12px">Disadvantages</h4>' + disadvantagesHtml +
            '</div>' +
        '</div>' +
        '<div style="margin-top:18px;display:grid;grid-template-columns:1fr 1fr;gap:12px">' +
            '<div><h4>Equipment</h4>' + equipmentHtml + '</div>' +
            '<div><h4>Drugs</h4>' + drugsHtml + '</div>' +
        '</div>' +
        '<div style="margin-top:18px;display:grid;grid-template-columns:1fr 1fr;gap:12px">' +
            '<div><h4>Ebon Abilities</h4>' + ebonHtml + '<h5 style="margin-top:8px">Formulae</h5>' + formulaeHtml + '</div>' +
            '<div><h4>Phobias</h4>' + phobiasList + '</div>' +
        '</div>' +
        '<div style="margin-top:18px;font-size:12px;color:#666">Created: ' + escapeHtml(created) + ' • Version: ' + escapeHtml(version) + '</div>';
}
