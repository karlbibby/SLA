/**
 * Step 13: Vehicles
 * - renderVehiclesStep(character, container, onUpdate)
 */

function formatVehicleCost(vehicle) {
    if (!vehicle || typeof vehicle.cost !== 'number') return 'n/a';
    const currency = vehicle.costCurrency === 'u' ? 'u' : 'c';
    return vehicle.cost + currency;
}

function getVehicleCostCredits(vehicle) {
    if (!vehicle || typeof vehicle.cost !== 'number') return null;
    if (vehicle.costCurrency === 'u') return vehicle.cost / 10;
    return vehicle.cost;
}

function renderVehiclesStep(character, container, onUpdate) {
    if (typeof sectionHeader !== 'function' || typeof escapeHtml !== 'function') {
        container.innerHTML = '<div class="info-box">Missing utilities for Vehicles step.</div>';
        return;
    }

    character.vehicleInventory = character.vehicleInventory || {};

    const items = (Array.isArray(VEHICLES) ? VEHICLES.slice() : []);

    let html = sectionHeader('Step 13: Vehicles', 'Purchase vehicles using your available credits.');
    html += '<div class="vehicles-container">';
    html += '<div class="vehicles-table">';
    html += '<div class="vehicles-header">' +
        '<div>Name</div><div>Type</div><div>Max. Speed</div><div>Skill</div><div>Cost</div><div>P.V./I.D.</div><div>Max. Crew/Passengers</div><div>Qty</div>' +
        '</div>';

    items.forEach(vehicle => {
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

    if (container._vehiclesHandler) {
        container.removeEventListener('click', container._vehiclesHandler);
    }
    container._vehiclesHandler = function (e) {
        if (!container.contains(e.target)) return;

        const inc = e.target.closest('.vehicle-qty-btn.vehicle-increase');
        const dec = e.target.closest('.vehicle-qty-btn.vehicle-decrease');

        function findVehicleByKey(key) {
            if (!Array.isArray(VEHICLES)) return null;
            return VEHICLES.find(v => (v.name + ' (' + v.type + ')') === key) || null;
        }

        if (inc) {
            const key = inc.closest('[data-vehicle]').getAttribute('data-vehicle');
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
            renderVehiclesStep(character, container, onUpdate);
            if (typeof onUpdate === 'function') onUpdate();
            return;
        }

        if (dec) {
            const key = dec.closest('[data-vehicle]').getAttribute('data-vehicle');
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
            renderVehiclesStep(character, container, onUpdate);
            if (typeof onUpdate === 'function') onUpdate();
            return;
        }
    };
    container.addEventListener('click', container._vehiclesHandler);
}
