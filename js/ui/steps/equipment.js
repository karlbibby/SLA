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
    // Financial summary (Credits / UNI / Induction)
    character.credits = (typeof character.credits !== 'undefined') ? character.credits : 0;
    const uni = character.credits * 10;
    html += '<div class="equipment-finances" style="margin-bottom:8px"><strong>Credits:</strong> ' + escapeHtml(String(character.credits)) + 'c • <strong>UNI:</strong> ' + escapeHtml(String(uni)) + 'n';
    if (character.inductionLocked) html += ' • <em>Induction Bonus: ' + escapeHtml(String(character.inductionBonus || 0)) + 'c (locked)</em>';
    else html += ' • <em>Induction Bonus: ' + escapeHtml(String(character.inductionBonus || 0)) + 'c</em>';
    html += ' • <strong>Finance:</strong> ' + (character.financeChip ? 'Chip' : (character.financeCard ? 'Card' : 'None')) + '</div>';

    html += '<div class="equipment-grid">';
    for (const item of classData.startingEquipment || []) {
        const name = typeof item === 'string' ? item : (item.name || item.label || 'Unknown');
        const desc = typeof item === 'object' ? (item.description || '') : '';
        character.selectedEquipment = character.selectedEquipment || [];
        const isSelected = character.selectedEquipment.includes(name);
        const icon = detectEquipmentIcon(name);

        // Check hardware price if catalogued
        const price = (typeof getHardwarePrice === 'function') ? getHardwarePrice(name) : (typeof HARDWARE !== 'undefined' && HARDWARE[name] ? HARDWARE[name].price : null);
        const meta = [];
        if (price !== null) meta.push(escapeHtml(String(price) + 'c'));
        html += equipmentItemHtml({
            idAttr: 'data-equipment="' + escapeHtml(name) + '"',
            icon,
            name,
            metaLines: meta,
            desc,
            selected: isSelected
        });
    }
    html += '</div>';
    container.innerHTML = html;

    // Replace previous handlers to avoid duplicates and ensure closure uses current character
    if (container._equipmentHandler) {
        container.removeEventListener('click', container._equipmentHandler);
    }
    if (container._financeHandler) {
        container.removeEventListener('click', container._financeHandler);
    }
    if (container._housingHandler) {
        container.removeEventListener('change', container._housingHandler);
    }

    // Equipment item toggle
    container._equipmentHandler = function (e) {
        const item = e.target.closest('.equipment-item[data-equipment]');
        if (!item || !container.contains(item)) return;
        const equipmentName = item.getAttribute('data-equipment');
        character.selectedEquipment = character.selectedEquipment || [];
        const idx = character.selectedEquipment.indexOf(equipmentName);
        if (idx > -1) character.selectedEquipment.splice(idx, 1);
        else {
            // Purchasing: if item has a price, deduct from credits
            const price = (typeof getHardwarePrice === 'function') ? getHardwarePrice(equipmentName) : (typeof HARDWARE !== 'undefined' && HARDWARE[equipmentName] ? HARDWARE[equipmentName].price : null);
            if (price !== null && price > 0) {
                if (character.credits >= price) {
                    character.credits -= price;
                    character.selectedEquipment.push(equipmentName);
                } else {
                    alert('Insufficient credits to purchase ' + equipmentName + ' (' + price + 'c).');
                    return;
                }
            } else {
                character.selectedEquipment.push(equipmentName);
            }
        }
        renderEquipmentStep(character, container, onUpdate);
        if (typeof onUpdate === 'function') onUpdate();
    };
    container.addEventListener('click', container._equipmentHandler);

    // Finance chip toggle button
    container._financeHandler = function (e) {
        const btn = e.target.closest('button.btn-toggle-finance');
        if (!btn || !container.contains(btn)) return;
        // Disallow for flux users (Ebons) and Brain Waster class
        if ((typeof character.isFluxUser === 'function' && character.isFluxUser()) || character.class === 'brainWaster') {
            alert('Finance chips cannot be fitted to Ebons or Brain Wasters.');
            return;
        }
        // Toggle chip/card
        character.financeChip = !character.financeChip;
        if (character.financeChip) {
            character.financeCard = false;
        } else {
            character.financeCard = true;
        }
        renderEquipmentStep(character, container, onUpdate);
        if (typeof onUpdate === 'function') onUpdate();
    };
    container.addEventListener('click', container._financeHandler);

    // Housing selector change
    container._housingHandler = function (e) {
        if (!e.target || !e.target.classList.contains('housing-select')) return;
        const val = e.target.value;
        character.housing = {
            type: val,
            providedBySLA: (val === 'SLA Apartment')
        };
        // If user selects 'Homeless', reflect as disadvantage entry suggestion (no automatic points handling)
        renderEquipmentStep(character, container, onUpdate);
        if (typeof onUpdate === 'function') onUpdate();
    };
    container.addEventListener('change', container._housingHandler);
}
