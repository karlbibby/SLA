/**
 * Step 14: Specialist Ammunition
 * - renderSpecialistAmmunitionStep(character, container, onUpdate)
 */

function formatSpecialistAmmoCost(item) {
    if (!item || typeof item.cost !== 'number') return 'n/a';
    const currency = item.costCurrency === 'u' ? 'u' : 'c';
    const suffix = item.costSuffix || '';
    return item.cost + currency + suffix;
}

function getSpecialistAmmoCostCredits(item) {
    if (!item || typeof item.cost !== 'number') return null;
    if (item.costCurrency === 'u') return item.cost / 10;
    return item.cost;
}

function renderSpecialistAmmunitionStep(character, container, onUpdate) {
    if (typeof sectionHeader !== 'function' || typeof escapeHtml !== 'function') {
        container.innerHTML = '<div class="info-box">Missing utilities for Specialist Ammunition step.</div>';
        return;
    }

    character.specialistAmmoInventory = character.specialistAmmoInventory || {};

    const items = (Array.isArray(SPECIALIST_AMMUNITION) ? SPECIALIST_AMMUNITION.slice() : []);

    let html = sectionHeader('Step 14: Specialist Ammunition', 'Purchase specialised ammunition using your available credits.');
    html += '<div class="specialist-ammo-container">';
    html += '<div class="specialist-ammo-table">';
    html += '<div class="specialist-ammo-header">' +
        '<div>Type</div><div>DMG</div><div>PEN</div><div>ARM DMG</div><div>Cost</div><div>Weight</div><div>Weapon</div><div>Qty</div>' +
        '</div>';

    items.forEach(item => {
        const qty = character.specialistAmmoInventory[item.type] || 0;
        const costCredits = getSpecialistAmmoCostCredits(item);
        const canPurchase = typeof costCredits === 'number';
        html += '<div class="specialist-ammo-row" data-specialist-ammo="' + escapeHtml(item.type) + '">' +
            '<div class="specialist-ammo-type">' + escapeHtml(item.type) + '</div>' +
            '<div>' + escapeHtml(item.dmg) + '</div>' +
            '<div>' + escapeHtml(item.pen) + '</div>' +
            '<div>' + escapeHtml(item.armDmg) + '</div>' +
            '<div class="specialist-ammo-cost">' + escapeHtml(formatSpecialistAmmoCost(item)) + '</div>' +
            '<div>' + escapeHtml(item.weight) + '</div>' +
            '<div>' + escapeHtml(item.weapon) + '</div>' +
            '<div class="specialist-ammo-qty">' +
                '<button class="specialist-ammo-qty-btn specialist-ammo-decrease" ' + (qty <= 0 ? 'disabled' : '') + '>−</button>' +
                '<span class="specialist-ammo-qty-value">' + escapeHtml(String(qty)) + '</span>' +
                '<button class="specialist-ammo-qty-btn specialist-ammo-increase" ' + (!canPurchase ? 'disabled' : '') + '>+</button>' +
            '</div>' +
        '</div>';
    });

    html += '</div></div>';

    container.innerHTML = html;

    if (container._specialistAmmoHandler) {
        container.removeEventListener('click', container._specialistAmmoHandler);
    }
    container._specialistAmmoHandler = function (e) {
        if (!container.contains(e.target)) return;

        const inc = e.target.closest('.specialist-ammo-qty-btn.specialist-ammo-increase');
        const dec = e.target.closest('.specialist-ammo-qty-btn.specialist-ammo-decrease');

        function findSpecialistAmmoByType(type) {
            if (!Array.isArray(SPECIALIST_AMMUNITION)) return null;
            return SPECIALIST_AMMUNITION.find(a => a.type === type) || null;
        }

        if (inc) {
            const type = inc.closest('[data-specialist-ammo]').getAttribute('data-specialist-ammo');
            const item = findSpecialistAmmoByType(type);
            const price = getSpecialistAmmoCostCredits(item);
            if (typeof price !== 'number') return;
            character.credits = (typeof character.credits !== 'undefined') ? character.credits : 0;
            if (price > 0 && character.credits < price) {
                alert('Insufficient credits to purchase ' + type + ' (' + price + 'c).');
                return;
            }
            if (price > 0) character.credits -= price;
            character.specialistAmmoInventory[type] = (character.specialistAmmoInventory[type] || 0) + 1;
            renderSpecialistAmmunitionStep(character, container, onUpdate);
            if (typeof onUpdate === 'function') onUpdate();
            return;
        }

        if (dec) {
            const type = dec.closest('[data-specialist-ammo]').getAttribute('data-specialist-ammo');
            const current = character.specialistAmmoInventory[type] || 0;
            if (current > 0) {
                const item = findSpecialistAmmoByType(type);
                const price = getSpecialistAmmoCostCredits(item);
                character.specialistAmmoInventory[type] = current - 1;
                if (typeof price === 'number' && price > 0) {
                    character.credits = (typeof character.credits !== 'undefined') ? character.credits : 0;
                    character.credits += price;
                }
            }
            renderSpecialistAmmunitionStep(character, container, onUpdate);
            if (typeof onUpdate === 'function') onUpdate();
            return;
        }
    };
    container.addEventListener('click', container._specialistAmmoHandler);
}
