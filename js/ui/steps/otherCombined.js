/**
 * Combined Other step
 * - renderOtherCombinedStep(character, container, onUpdate)
 */

function renderOtherCombinedStep(character, container, onUpdate) {
    if (typeof sectionHeader !== 'function' || typeof escapeHtml !== 'function') {
        container.innerHTML = '<div class="info-box">Missing utilities for Other step.</div>';
        return;
    }

    character.armourInventory = character.armourInventory || {};
    character.equipmentInventory = character.equipmentInventory || {};
    character.vehicleInventory = character.vehicleInventory || {};

    const armourItems = (Array.isArray(ARMOUR) ? ARMOUR.slice() : []);
    const equipmentItems = (Array.isArray(EQUIPMENT) ? EQUIPMENT.slice() : []).filter(item => !item.hidden);
    const vehicleItems = (Array.isArray(VEHICLES) ? VEHICLES.slice() : []);
    const dsOwned = !!(character.ebonEquipmentInventory && (character.ebonEquipmentInventory['Ebon Guard — DeathSuit'] || 0) > 0);

    if (!character.selectedArmourType) {
        const owned = Object.entries(character.armourInventory).find(([, qty]) => (Number(qty) || 0) > 0);
        if (owned) {
            const armour = armourItems.find(a => a.type === owned[0]) || null;
            applyArmourSelection(character, armour);
        }
    }

    let html = sectionHeader('Step 11: Other', 'Purchase armour, equipment, and vehicles using your available credits.');

    html += '<div class="section-header"><h3 class="section-title">Armour</h3></div>';
    // Effective armour display when DeathSuit owned
    (function(){
        try {
            const key = 'Ebon Guard — DeathSuit';
            const owned = (character.ebonEquipmentInventory && (character.ebonEquipmentInventory[key] || 0) > 0);
            if (owned && typeof DEATHSUIT_TYPES !== 'undefined') {
                const dtype = character.deathsuitType && DEATHSUIT_TYPES[character.deathsuitType]
                    ? character.deathsuitType
                    : Object.keys(DEATHSUIT_TYPES)[0];
                const ds = DEATHSUIT_TYPES[dtype];
                const fmt = (o) => escapeHtml(String(o.base)) + ' / ' + escapeHtml(String(o.max));
                html += '<div class="info-box" style="margin-bottom:8px">' +
                    '<div style="font-weight:700;margin-bottom:4px">DeathSuit active — armour purchases will not change protection values.</div>' +
                    '<div style="margin-bottom:4px">Type: <strong>' + escapeHtml(dtype) + '</strong></div>' +
                    '<table style="width:100%;border-collapse:collapse;font-size:14px">' +
                        '<thead><tr><th style="text-align:left;padding:2px 4px">Location</th><th style="text-align:left;padding:2px 4px">PV</th><th style="text-align:left;padding:2px 4px">ID</th></tr></thead>' +
                        '<tbody>' +
                            '<tr><td style="padding:2px 4px">Head</td><td style="padding:2px 4px">' + fmt(ds.pv) + '</td><td style="padding:2px 4px">' + fmt(ds.head) + '</td></tr>' +
                            '<tr><td style="padding:2px 4px">Torso</td><td style="padding:2px 4px">' + fmt(ds.pv) + '</td><td style="padding:2px 4px">' + fmt(ds.torso) + '</td></tr>' +
                            '<tr><td style="padding:2px 4px">L.Arm</td><td style="padding:2px 4px">' + fmt(ds.pv) + '</td><td style="padding:2px 4px">' + fmt(ds.arms) + '</td></tr>' +
                            '<tr><td style="padding:2px 4px">R.Arm</td><td style="padding:2px 4px">' + fmt(ds.pv) + '</td><td style="padding:2px 4px">' + fmt(ds.arms) + '</td></tr>' +
                            '<tr><td style="padding:2px 4px">L.Leg</td><td style="padding:2px 4px">' + fmt(ds.pv) + '</td><td style="padding:2px 4px">' + fmt(ds.legs) + '</td></tr>' +
                            '<tr><td style="padding:2px 4px">R.Leg</td><td style="padding:2px 4px">' + fmt(ds.pv) + '</td><td style="padding:2px 4px">' + fmt(ds.legs) + '</td></tr>' +
                        '</tbody>' +
                    '</table>' +
                '</div>';
            }
        } catch (e) {}
    })();
    html += '<div class="armour-container" ' + (dsOwned ? 'style="opacity:0.5;pointer-events:none"' : '') + '>';
    html += '<div class="armour-table">';
    html += '<div class="armour-header">' +
        '<div>Armour Types</div><div>Cost</div><div>P.V.</div><div>Head</div><div>Torso</div><div>Arms</div><div>Legs</div><div>Modifiers</div><div>Qty</div>' +
        '</div>';

    armourItems.forEach(armour => {
        const qty = character.armourInventory[armour.type] || 0;
        const costCredits = getArmourCostCredits(armour);
        const canPurchase = typeof costCredits === 'number';
        const disableIncrease = (!canPurchase) || dsOwned;
        html += '<div class="armour-row" data-armour="' + escapeHtml(armour.type) + '">' +
            '<div class="armour-type">' + escapeHtml(armour.type) + '</div>' +
            '<div class="armour-cost">' + escapeHtml(formatArmourCost(armour)) + '</div>' +
            '<div>' + escapeHtml(armour.pv) + '</div>' +
            '<div>' + escapeHtml(armour.head) + '</div>' +
            '<div>' + escapeHtml(armour.torso) + '</div>' +
            '<div>' + escapeHtml(armour.arms) + '</div>' +
            '<div>' + escapeHtml(armour.legs) + '</div>' +
            '<div>' + escapeHtml(armour.modifiers) + '</div>' +
            '<div class="armour-qty">' +
                '<button class="armour-qty-btn armour-decrease" ' + (qty <= 0 ? 'disabled' : '') + '>−</button>' +
                '<span class="armour-qty-value">' + escapeHtml(String(qty)) + '</span>' +
                '<button class="armour-qty-btn armour-increase" ' + (disableIncrease ? 'disabled' : '') + (dsOwned ? ' title="Disabled while DeathSuit is active"' : '') + '>+</button>' +
            '</div>' +
        '</div>';
    });

    html += '</div></div>';

    html += '<div class="section-header"><h3 class="section-title">Equipment</h3></div>';
    html += '<div class="equipment-container">';
    html += '<div class="equipment-table">';
    html += '<div class="equipment-header">' +
        '<div>Type</div><div>Cost</div><div>Black Market</div><div>Max. Weight</div><div>Range</div><div>User Life</div><div>Qty</div>' +
        '</div>';

    equipmentItems.forEach(item => {
        const qty = character.equipmentInventory[item.type] || 0;
        const lockedQty = (character.lockedInventory && character.lockedInventory.equipment && character.lockedInventory.equipment[item.type]) || 0;
        const costCredits = getEquipmentCostCredits(item);
        const canPurchase = typeof costCredits === 'number';
        html += '<div class="equipment-row" data-equipment="' + escapeHtml(item.type) + '">' +
            '<div class="equipment-type">' + escapeHtml(item.type) + '</div>' +
            '<div class="equipment-cost">' + escapeHtml(formatEquipmentCost(item)) + '</div>' +
            '<div class="equipment-black-market">' + escapeHtml(formatEquipmentBlackMarketCost(item)) + '</div>' +
            '<div>' + escapeHtml(item.maxWeight) + '</div>' +
            '<div>' + escapeHtml(item.range) + '</div>' +
            '<div>' + escapeHtml(item.userLife) + '</div>' +
            '<div class="equipment-qty">' +
                '<button class="equipment-qty-btn equipment-decrease" ' + (qty <= lockedQty ? 'disabled' : '') + '>−</button>' +
                '<span class="equipment-qty-value">' + escapeHtml(String(qty)) + '</span>' +
                '<button class="equipment-qty-btn equipment-increase" ' + (!canPurchase ? 'disabled' : '') + '>+</button>' +
            '</div>' +
        '</div>';
    });

    html += '</div></div>';

    html += '<div class="section-header"><h3 class="section-title">Vehicles</h3></div>';
    html += '<div class="vehicles-container">';
    html += '<div class="vehicles-table">';
    html += '<div class="vehicles-header">' +
        '<div>Name</div><div>Type</div><div>Max. Speed</div><div>Skill</div><div>Cost</div><div>P.V./I.D.</div><div>Max. Crew/Passengers</div><div>Qty</div>' +
        '</div>';

    vehicleItems.forEach(vehicle => {
        const key = vehicle.name + ' (' + vehicle.type + ')';
        const qty = character.vehicleInventory[key] || 0;
        const costCredits = getVehicleCostCredits(vehicle);
        const canPurchase = typeof costCredits === 'number';
        html += '<div class="vehicle-row" data-vehicle="' + escapeHtml(key) + '">' +
            '<div class="vehicle-name">' + escapeHtml(vehicle.name) + '</div>' +
            '<div>' + escapeHtml(vehicle.type) + '</div>' +
            '<div>' + escapeHtml(vehicle.maxSpeed) + '</div>' +
            '<div>' + escapeHtml(vehicle.skill) + '</div>' +
            '<div class="vehicle-cost">' + escapeHtml(formatVehicleCost(vehicle)) + '</div>' +
            '<div>' + escapeHtml(vehicle.pvId) + '</div>' +
            '<div>' + escapeHtml(vehicle.crewPassengers) + '</div>' +
            '<div class="vehicle-qty">' +
                '<button class="vehicle-qty-btn vehicle-decrease" ' + (qty <= 0 ? 'disabled' : '') + '>−</button>' +
                '<span class="vehicle-qty-value">' + escapeHtml(String(qty)) + '</span>' +
                '<button class="vehicle-qty-btn vehicle-increase" ' + (!canPurchase ? 'disabled' : '') + '>+</button>' +
            '</div>' +
        '</div>';
    });

    html += '</div></div>';

    container.innerHTML = html;

    const handlerKeys = ['_armourHandler', '_equipmentHandler', '_vehiclesHandler', '_otherCombinedHandler'];
    handlerKeys.forEach(key => {
        if (container[key]) {
            container.removeEventListener('click', container[key]);
        }
    });

    container._otherCombinedHandler = function (e) {
        if (!container.contains(e.target)) return;

        const armourInc = e.target.closest('.armour-qty-btn.armour-increase');
        const armourDec = e.target.closest('.armour-qty-btn.armour-decrease');
        const equipInc = e.target.closest('.equipment-qty-btn.equipment-increase');
        const equipDec = e.target.closest('.equipment-qty-btn.equipment-decrease');
        const vehicleInc = e.target.closest('.vehicle-qty-btn.vehicle-increase');
        const vehicleDec = e.target.closest('.vehicle-qty-btn.vehicle-decrease');

        function findArmourByType(type) {
            if (!Array.isArray(ARMOUR)) return null;
            return ARMOUR.find(a => a.type === type) || null;
        }

        function findEquipmentByType(type) {
            if (!Array.isArray(EQUIPMENT)) return null;
            return EQUIPMENT.find(a => a.type === type) || null;
        }

        function getLockedEquipmentQty(type) {
            if (!character.lockedInventory || !character.lockedInventory.equipment) return 0;
            return character.lockedInventory.equipment[type] || 0;
        }

        function findVehicleByKey(key) {
            if (!Array.isArray(VEHICLES)) return null;
            return VEHICLES.find(v => (v.name + ' (' + v.type + ')') === key) || null;
        }

        if (armourInc) {
            if (character.ebonEquipmentInventory && (character.ebonEquipmentInventory['Ebon Guard — DeathSuit'] || 0) > 0) {
                return; // purchasing disabled while DeathSuit owned
            }
            const type = armourInc.closest('[data-armour]').getAttribute('data-armour');
            const armour = findArmourByType(type);
            const price = getArmourCostCredits(armour);
            if (typeof price !== 'number') return;
            character.credits = (typeof character.credits !== 'undefined') ? character.credits : 0;
            if (price > 0 && character.credits < price) {
                alert('Insufficient credits to purchase ' + type + ' (' + price + 'c).');
                return;
            }
            if (price > 0) character.credits -= price;
            character.armourInventory[type] = (character.armourInventory[type] || 0) + 1;
            applyArmourSelection(character, armour);
            renderOtherCombinedStep(character, container, onUpdate);
            if (typeof onUpdate === 'function') onUpdate();
            return;
        }

        if (armourDec) {
            const type = armourDec.closest('[data-armour]').getAttribute('data-armour');
            const current = character.armourInventory[type] || 0;
            if (current > 0) {
                const armour = findArmourByType(type);
                const price = getArmourCostCredits(armour);
                character.armourInventory[type] = current - 1;
                if (typeof price === 'number' && price > 0) {
                    character.credits = (typeof character.credits !== 'undefined') ? character.credits : 0;
                    character.credits += price;
                }
                if (character.selectedArmourType === type && character.armourInventory[type] === 0) {
                    applyArmourSelection(character, null);
                }
            }
            renderOtherCombinedStep(character, container, onUpdate);
            if (typeof onUpdate === 'function') onUpdate();
            return;
        }

        if (equipInc) {
            const type = equipInc.closest('[data-equipment]').getAttribute('data-equipment');
            const item = findEquipmentByType(type);
            const price = getEquipmentCostCredits(item);
            if (typeof price !== 'number') return;
            character.credits = (typeof character.credits !== 'undefined') ? character.credits : 0;
            if (price > 0 && character.credits < price) {
                alert('Insufficient credits to purchase ' + type + ' (' + price + 'c).');
                return;
            }
            if (price > 0) character.credits -= price;
            character.equipmentInventory[type] = (character.equipmentInventory[type] || 0) + 1;
            renderOtherCombinedStep(character, container, onUpdate);
            if (typeof onUpdate === 'function') onUpdate();
            return;
        }

        if (equipDec) {
            const type = equipDec.closest('[data-equipment]').getAttribute('data-equipment');
            const current = character.equipmentInventory[type] || 0;
            const lockedQty = getLockedEquipmentQty(type);
            if (current > lockedQty) {
                const item = findEquipmentByType(type);
                const price = getEquipmentCostCredits(item);
                character.equipmentInventory[type] = current - 1;
                if (typeof price === 'number' && price > 0) {
                    character.credits = (typeof character.credits !== 'undefined') ? character.credits : 0;
                    character.credits += price;
                }
            }
            renderOtherCombinedStep(character, container, onUpdate);
            if (typeof onUpdate === 'function') onUpdate();
            return;
        }

        if (vehicleInc) {
            const key = vehicleInc.closest('[data-vehicle]').getAttribute('data-vehicle');
            const vehicle = findVehicleByKey(key);
            const price = getVehicleCostCredits(vehicle);
            if (typeof price !== 'number') return;
            character.credits = (typeof character.credits !== 'undefined') ? character.credits : 0;
            if (price > 0 && character.credits < price) {
                alert('Insufficient credits to purchase ' + key + ' (' + price + 'c).');
                return;
            }
            if (price > 0) character.credits -= price;
            character.vehicleInventory[key] = (character.vehicleInventory[key] || 0) + 1;
            renderOtherCombinedStep(character, container, onUpdate);
            if (typeof onUpdate === 'function') onUpdate();
            return;
        }

        if (vehicleDec) {
            const key = vehicleDec.closest('[data-vehicle]').getAttribute('data-vehicle');
            const current = character.vehicleInventory[key] || 0;
            if (current > 0) {
                const vehicle = findVehicleByKey(key);
                const price = getVehicleCostCredits(vehicle);
                character.vehicleInventory[key] = current - 1;
                if (typeof price === 'number' && price > 0) {
                    character.credits = (typeof character.credits !== 'undefined') ? character.credits : 0;
                    character.credits += price;
                }
            }
            renderOtherCombinedStep(character, container, onUpdate);
            if (typeof onUpdate === 'function') onUpdate();
        }
    };

    container.addEventListener('click', container._otherCombinedHandler);
}
