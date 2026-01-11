/**
 * Step 9: Starting Equipment
 * - renderEquipmentStep(character, container, onUpdate)
 * - detectEquipmentIcon(name)
 *
 * Uses CLASSES[...] to determine startingEquipment for the selected class.
 * Attaches a single click handler replaced on each render to avoid duplicated listeners.
 */

function detectEquipmentIcon(name) {
    const ln = (name || '').toLowerCase();
    if (ln.includes('pistol') || ln.includes('rifle') || ln.includes('shotgun') || ln.includes('blitzer') || ln.includes('fen')) return '🔫';
    if (ln.includes('armor') || ln.includes('suit') || ln.includes('deathsuit') || ln.includes('bomb')) return '🛡️';
    if (ln.includes('knife') || ln.includes('sword') || ln.includes('club')) return '⚔️';
    if (ln.includes('grenade') || ln.includes('explosive')) return '💣';
    return '🔧';
}

function renderEquipmentStep(character, container, onUpdate) {
    if (typeof sectionHeader !== 'function' || typeof equipmentItemHtml !== 'function') {
        container.innerHTML = '<div class="info-box">Missing utilities for Equipment step.</div>';
        return;
    }

    if (!character.class) {
        container.innerHTML = sectionHeader('Step 9: Starting Equipment') +
            '<div class="info-box"><h4>Class Required</h4><p>Please select a class first.</p></div>';
        return;
    }

    const classData = (typeof CLASSES !== 'undefined' && CLASSES[character.class]) ? CLASSES[character.class] : { startingEquipment: [] };
    let html = sectionHeader('Step 9: Starting Equipment', 'Select starting weapons, armour and gear provided by your class. Click items to add/remove from your loadout.');
    html += '<div class="equipment-grid">';
    for (const item of classData.startingEquipment || []) {
        const name = typeof item === 'string' ? item : (item.name || item.label || 'Unknown');
        const desc = typeof item === 'object' ? (item.description || '') : '';
        character.selectedEquipment = character.selectedEquipment || [];
        const isSelected = character.selectedEquipment.includes(name);
        const icon = detectEquipmentIcon(name);

        html += equipmentItemHtml({
            idAttr: 'data-equipment="' + escapeHtml(name) + '"',
            icon,
            name,
            metaLines: [],
            desc,
            selected: isSelected
        });
    }
    html += '</div>';
    container.innerHTML = html;

    // Replace previous handler to avoid duplicates and ensure closure uses current character
    if (container._equipmentHandler) {
        container.removeEventListener('click', container._equipmentHandler);
    }
    container._equipmentHandler = function (e) {
        const item = e.target.closest('.equipment-item[data-equipment]');
        if (!item || !container.contains(item)) return;
        const equipmentName = item.getAttribute('data-equipment');
        character.selectedEquipment = character.selectedEquipment || [];
        const idx = character.selectedEquipment.indexOf(equipmentName);
        if (idx > -1) character.selectedEquipment.splice(idx, 1);
        else character.selectedEquipment.push(equipmentName);
        renderEquipmentStep(character, container, onUpdate);
        if (typeof onUpdate === 'function') onUpdate();
    };
    container.addEventListener('click', container._equipmentHandler);
}
