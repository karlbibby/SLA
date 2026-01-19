/**
 * Step 9: Starting Equipment
 * - renderEquipmentStep(character, container, onUpdate)
 * - detectEquipmentIcon(name)
 *
 * Provides default SLA starting equipment.
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

    // Ensure defaults
    character.credits = (typeof character.credits !== 'undefined') ? character.credits : 0;
    character.selectedEquipment = character.selectedEquipment || [];

    // Auto-add standard SLA starting equipment (mark as selected but do not charge)
    const defaultEquipment = ['Headset Communicator', 'Klippo Lighter', 'Pen', 'FEN 603', 'FEN Ammo Clip', 'Blueprint News File Case', 'S.C.L. Card', 'Finance Card', 'Package Card', 'Departmental Authorization Card', 'Clothes (2 sets)', 'Footwear (1 set)', 'Operative Organizer', 'SLA Badge', 'Weapons Maintenance Kit', 'Personal Effects', 'Contraceptives Pack'];
    for (const se of defaultEquipment) {
        if (!character.selectedEquipment.includes(se)) {
            character.selectedEquipment.push(se);
        }
    }

    let html = sectionHeader('Step 9: Starting Equipment', 'Select weapons, armour and gear available from the new equipment catalog. Click items to add/remove from your loadout.');
    // Financial summary (Credits / UNI / Induction)
    const uni = character.credits * 10;
    html += '<div class="equipment-finances" style="margin-bottom:8px"><strong>Credits:</strong> ' + escapeHtml(String(character.credits)) + 'c • <strong>UNI:</strong> ' + escapeHtml(String(uni)) + 'n';
    if (character.inductionLocked) html += ' • <em>Induction Bonus: ' + escapeHtml(String(character.inductionBonus || 0)) + 'c (locked)</em>';
    else html += ' • <em>Induction Bonus: ' + escapeHtml(String(character.inductionBonus || 0)) + 'c</em>';
    html += ' • <strong>Finance:</strong> ' + (character.financeChip ? 'Chip' : (character.financeCard ? 'Card' : 'None')) + '</div>';

    // Build a flattened catalog from the EQUIPMENT dataset
    const eqCatalog = (typeof window !== 'undefined' && window.EQUIPMENT) ? window.EQUIPMENT : {};
    const catalogItems = [];
    (eqCatalog.ammunitions || []).forEach(a => catalogItems.push({ name: a.calibre, category: 'Ammunition', metaObj: a }));
    (eqCatalog.specialisedAmmunition || []).forEach(a => catalogItems.push({ name: a.type, category: 'Special Ammo', metaObj: a }));
    (eqCatalog.grenades || []).forEach(a => catalogItems.push({ name: a.type, category: 'Grenade', metaObj: a }));
    (eqCatalog.armour || []).forEach(a => catalogItems.push({ name: a.name, category: 'Armour', metaObj: a }));
    (eqCatalog.vehicles || []).forEach(a => catalogItems.push({ name: a.name, category: 'Vehicle', metaObj: a }));
    // Optional: hardware entries (if global HARDWARE exists)
    if (typeof HARDWARE !== 'undefined') {
        Object.keys(HARDWARE).forEach(k => catalogItems.push({ name: k, category: 'Hardware', metaObj: HARDWARE[k] }));
    }

    // Helper to parse cost strings like "10c", "17,000u", "60u/pack", etc. Returns cost in credits (c) as integer, or null if unknown/free.
    function parseCostToCredits(cost) {
        if (!cost) return null;
        const s = String(cost).replace(/,/g, '').trim();
        const m = s.match(/([\d]+)([cu]?)/i);
        if (!m) return null;
        const value = parseInt(m[1], 10);
        const unit = (m[2] || 'c').toLowerCase();
        if (unit === 'c' || unit === '') return value;
        if (unit === 'u') {
            // Convert UNI to credits: 10 UNI == 1 credit? Based on display uni = credits*10, therefore 1 UNI = 0.1 credits.
            // To convert UNI -> credits: credits = Math.ceil(UNI / 10)
            return Math.ceil(value / 10);
        }
        return value;
    }

    html += '<div class="equipment-grid">';
    for (const ci of catalogItems) {
        const name = ci.name || 'Unknown';
        const meta = [];
        const icon = detectEquipmentIcon(name);
        // Build meta lines from metaObj
        const mo = ci.metaObj || {};
        if (ci.category === 'Ammunition') {
            if (mo.std) meta.push(`STD: ${escapeHtml(mo.std)}`);
            if (mo.ap) meta.push(`AP: ${escapeHtml(mo.ap)}`);
            if (mo.hp) meta.push(`HP: ${escapeHtml(mo.hp)}`);
        } else if (ci.category === 'Special Ammo') {
            if (mo.dmg != null) meta.push(`DMG: ${escapeHtml(String(mo.dmg))}`);
            if (mo.pen != null) meta.push(`PEN: ${escapeHtml(String(mo.pen))}`);
            if (mo.arm != null) meta.push(`ARM: ${escapeHtml(String(mo.arm))}`);
            if (mo.cost) meta.push(`COST: ${escapeHtml(String(mo.cost))}`);
        } else if (ci.category === 'Grenade') {
            meta.push(`Blast: ${escapeHtml(mo.blast == null ? '-' : String(mo.blast))}`);
            if (mo.pen != null) meta.push(`PEN: ${escapeHtml(String(mo.pen))}`);
            if (mo.weight) meta.push(`W: ${escapeHtml(mo.weight)}`);
        } else if (ci.category === 'Armour') {
            meta.push(`PV: ${escapeHtml(String(mo.pv || '-'))}`);
            if (mo.torso != null) meta.push(`Torso: ${escapeHtml(String(mo.torso))}`);
            if (mo.arms != null) meta.push(`Arms: ${escapeHtml(String(mo.arms))}`);
            if (mo.legs != null) meta.push(`Legs: ${escapeHtml(String(mo.legs))}`);
            if (mo.modifiers) meta.push(`${escapeHtml(mo.modifiers)}`);
        } else if (ci.category === 'Vehicle') {
            if (mo.type) meta.push(escapeHtml(mo.type));
            if (mo.speed) meta.push(`Speed: ${escapeHtml(mo.speed)}`);
            if (mo.pv_id) meta.push(`P.V./I.D.: ${escapeHtml(mo.pv_id)}`);
        } else if (ci.category === 'Hardware') {
            if (mo.price) meta.push(`Price: ${escapeHtml(String(mo.price)) + 'c'}`);
            if (mo.desc) meta.push(escapeHtml(mo.desc));
        }

        // Determine cost (if present)
        const costStr = mo.cost || mo.price || mo.blackmarket || null;
        const costCredits = parseCostToCredits(costStr);
        if (costCredits !== null) meta.unshift(`${escapeHtml(String(costCredits))}c`);

        // Support multi-purchase for Ammunition, Special Ammo and Grenade
        character._purchasedEquipmentCounts = character._purchasedEquipmentCounts || {};
        const qty = character._purchasedEquipmentCounts[name] || 0;

        // Show quantity in meta if present
        if (qty > 0) meta.unshift(`Qty: ${qty}`);

        const isMultiItem = ['Ammunition','Special Ammo','Grenade'].includes(ci.category);
        const isSelected = qty > 0 || character.selectedEquipment.includes(name);
        const displayName = name + (ci.category ? ` (${ci.category})` : '') + (qty > 0 ? ` x${qty}` : '');
        const idAttr = 'data-equipment="' + escapeHtml(name) + '"' + (isMultiItem ? ' data-multi="1"' : '');

        html += equipmentItemHtml({
            idAttr,
            icon,
            name: displayName,
            metaLines: meta,
            desc: mo.description || mo.desc || '',
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

    // Equipment item toggle: supports multi-buy for ammo/grenades. Ctrl+click decreases one unit.
    container._equipmentHandler = function (e) {
        const item = e.target.closest('.equipment-item[data-equipment]');
        if (!item || !container.contains(item)) return;
        const equipmentName = item.getAttribute('data-equipment');
        character.selectedEquipment = character.selectedEquipment || [];
        character._purchasedEquipment = character._purchasedEquipment || {};
        character._purchasedEquipmentCounts = character._purchasedEquipmentCounts || {};

        // Determine item metadata
        const eq = (typeof window !== 'undefined' && window.EQUIPMENT) ? window.EQUIPMENT : {};
        let meta = null;
        meta = (eq.ammunitions || []).find(a => a.calibre === equipmentName) || meta;
        meta = (eq.specialisedAmmunition || []).find(a => a.type === equipmentName) || meta;
        meta = (eq.grenades || []).find(a => a.type === equipmentName) || meta;
        meta = (eq.armour || []).find(a => a.name === equipmentName) || meta;
        meta = (eq.vehicles || []).find(a => a.name === equipmentName) || meta;
        if (!meta && typeof HARDWARE !== 'undefined') meta = HARDWARE[equipmentName];

        const costStr = meta ? (meta.cost || meta.price || meta.blackmarket || null) : null;
        const priceToPay = parseCostToCredits(costStr);

        // Categories that support multiple purchases
        const isMulti = !!((eq.ammunitions || []).find(a => a.calibre === equipmentName)
            || (eq.specialisedAmmunition || []).find(a => a.type === equipmentName)
            || (eq.grenades || []).find(g => g.type === equipmentName));

        const currentQty = character._purchasedEquipmentCounts[equipmentName] || 0;

        // Button-driven quantity controls
        const incBtn = e.target.closest('[data-action="increase"]');
        const decBtn = e.target.closest('[data-action="decrease"]');

        if (incBtn) {
            // Increase quantity (multi items) or behave like purchase for single items
            if (isMulti) {
                if (priceToPay !== null && priceToPay > 0) {
                    if (character.credits >= priceToPay) {
                        character.credits -= priceToPay;
                        const newQty = currentQty + 1;
                        character._purchasedEquipmentCounts[equipmentName] = newQty;
                        character._purchasedEquipment[equipmentName] = priceToPay * newQty;
                        if (!character.selectedEquipment.includes(equipmentName)) character.selectedEquipment.push(equipmentName);
                    } else {
                        alert('Insufficient credits to purchase ' + equipmentName + ' (' + priceToPay + 'c).');
                        return;
                    }
                } else {
                    const newQty = currentQty + 1;
                    character._purchasedEquipmentCounts[equipmentName] = newQty;
                    if (!character.selectedEquipment.includes(equipmentName)) character.selectedEquipment.push(equipmentName);
                }
            } else {
                // Single item: add if not present
                const idx = character.selectedEquipment.indexOf(equipmentName);
                if (idx === -1) {
                    if (priceToPay !== null && priceToPay > 0) {
                        if (character.credits >= priceToPay) {
                            character.credits -= priceToPay;
                            character.selectedEquipment.push(equipmentName);
                            character._purchasedEquipment[equipmentName] = priceToPay;
                        } else {
                            alert('Insufficient credits to purchase ' + equipmentName + ' (' + priceToPay + 'c).');
                            return;
                        }
                    } else {
                        character.selectedEquipment.push(equipmentName);
                    }
                }
            }
        } else if (decBtn) {
            // Decrease quantity: for multi items remove one unit; for single, remove item entirely and refund if purchased
            if (isMulti) {
                if (currentQty > 0) {
                    if (typeof priceToPay === 'number' && priceToPay > 0) {
                        character.credits = (character.credits || 0) + priceToPay;
                    }
                    const newQty = currentQty - 1;
                    if (newQty <= 0) {
                        delete character._purchasedEquipmentCounts[equipmentName];
                        delete character._purchasedEquipment[equipmentName];
                        const idxRem = character.selectedEquipment.indexOf(equipmentName);
                        if (idxRem > -1) character.selectedEquipment.splice(idxRem, 1);
                    } else {
                        character._purchasedEquipmentCounts[equipmentName] = newQty;
                        if (typeof priceToPay === 'number') character._purchasedEquipment[equipmentName] = priceToPay * newQty;
                    }
                }
            } else {
                const idx = character.selectedEquipment.indexOf(equipmentName);
                if (idx > -1) {
                    const purchasedAmount = character._purchasedEquipment[equipmentName];
                    if (typeof purchasedAmount === 'number' && purchasedAmount > 0) {
                        character.credits = (character.credits || 0) + purchasedAmount;
                        delete character._purchasedEquipment[equipmentName];
                    }
                    character.selectedEquipment.splice(idx, 1);
                }
            }
        } else {
            // Click on item body => toggle for non-multi, or open selection for multi (treat as add one)
            if (isMulti) {
                // treat as add-one
                if (priceToPay !== null && priceToPay > 0) {
                    if (character.credits >= priceToPay) {
                        character.credits -= priceToPay;
                        const newQty = currentQty + 1;
                        character._purchasedEquipmentCounts[equipmentName] = newQty;
                        character._purchasedEquipment[equipmentName] = priceToPay * newQty;
                        if (!character.selectedEquipment.includes(equipmentName)) character.selectedEquipment.push(equipmentName);
                    } else {
                        alert('Insufficient credits to purchase ' + equipmentName + ' (' + priceToPay + 'c).');
                        return;
                    }
                } else {
                    const newQty = currentQty + 1;
                    character._purchasedEquipmentCounts[equipmentName] = newQty;
                    if (!character.selectedEquipment.includes(equipmentName)) character.selectedEquipment.push(equipmentName);
                }
            } else {
                const idx = character.selectedEquipment.indexOf(equipmentName);
                if (idx > -1) {
                    const purchasedAmount = character._purchasedEquipment[equipmentName];
                    if (typeof purchasedAmount === 'number' && purchasedAmount > 0) {
                        character.credits = (character.credits || 0) + purchasedAmount;
                        delete character._purchasedEquipment[equipmentName];
                    }
                    character.selectedEquipment.splice(idx, 1);
                } else {
                    if (priceToPay !== null && priceToPay > 0) {
                        if (character.credits >= priceToPay) {
                            character.credits -= priceToPay;
                            character.selectedEquipment.push(equipmentName);
                            character._purchasedEquipment[equipmentName] = priceToPay;
                        } else {
                            alert('Insufficient credits to purchase ' + equipmentName + ' (' + priceToPay + 'c).');
                            return;
                        }
                    } else {
                        character.selectedEquipment.push(equipmentName);
                    }
                }
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
