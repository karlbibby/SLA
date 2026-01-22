/**
 * Step 11: Weapons
 * - renderWeaponsStep(character, container, onUpdate)
 */

function formatWeaponCost(weapon) {
    if (!weapon || typeof weapon.cost !== 'number') return 'n/a';
    const currency = weapon.costCurrency === 'u' ? 'u' : 'c';
    return weapon.cost + currency;
}

function formatWeaponBlackMarketCost(weapon) {
    if (!weapon || typeof weapon.blackMarketCost !== 'number') return '—';
    const currency = weapon.blackMarketCurrency === 'c' ? 'c' : 'u';
    return weapon.blackMarketCost + currency;
}

function getWeaponCostCredits(weapon) {
    if (!weapon || typeof weapon.cost !== 'number') return null;
    if (weapon.costCurrency === 'u') return weapon.cost / 10;
    return weapon.cost;
}

function renderWeaponsStep(character, container, onUpdate) {
    if (typeof sectionHeader !== 'function' || typeof escapeHtml !== 'function') {
        container.innerHTML = '<div class="info-box">Missing utilities for Weapons step.</div>';
        return;
    }

    character.weaponInventory = character.weaponInventory || {};

    const items = (Array.isArray(WEAPONS) ? WEAPONS.slice() : []).sort((a, b) => {
        const aName = a && a.type ? a.type : '';
        const bName = b && b.type ? b.type : '';
        return aName.localeCompare(bName);
    });

    let html = sectionHeader('Step 11: Weapons', 'Purchase melee weapons using your available credits.');
    html += '<div class="weapons-container">';
    html += '<div class="weapons-table">';
    html += '<div class="weapons-header">' +
        '<div>Type</div><div>DMG</div><div>PEN</div><div>Armour DMG</div><div>Weight</div><div>Cost</div><div>Black Market</div><div>Qty</div>' +
        '</div>';

    items.forEach(weapon => {
        const qty = character.weaponInventory[weapon.type] || 0;
        const costCredits = getWeaponCostCredits(weapon);
        const canPurchase = typeof costCredits === 'number';
        html += '<div class="weapon-row" data-weapon="' + escapeHtml(weapon.type) + '">' +
            '<div class="weapon-type">' + escapeHtml(weapon.type) + '</div>' +
            '<div>' + escapeHtml(weapon.dmg) + '</div>' +
            '<div>' + escapeHtml(weapon.pen) + '</div>' +
            '<div>' + escapeHtml(weapon.armourDmg) + '</div>' +
            '<div>' + escapeHtml(weapon.weight) + '</div>' +
            '<div class="weapon-cost">' + escapeHtml(formatWeaponCost(weapon)) + '</div>' +
            '<div class="weapon-black-market">' + escapeHtml(formatWeaponBlackMarketCost(weapon)) + '</div>' +
            '<div class="weapon-qty">' +
                '<button class="weapon-qty-btn weapon-decrease" ' + (qty <= 0 ? 'disabled' : '') + '>−</button>' +
                '<span class="weapon-qty-value">' + escapeHtml(String(qty)) + '</span>' +
                '<button class="weapon-qty-btn weapon-increase" ' + (!canPurchase ? 'disabled' : '') + '>+</button>' +
            '</div>' +
        '</div>';
    });

    html += '</div></div>';

    container.innerHTML = html;

    if (container._weaponsHandler) {
        container.removeEventListener('click', container._weaponsHandler);
    }
    container._weaponsHandler = function (e) {
        if (!container.contains(e.target)) return;

        const inc = e.target.closest('.weapon-qty-btn.weapon-increase');
        const dec = e.target.closest('.weapon-qty-btn.weapon-decrease');

        function findWeaponByType(type) {
            if (!Array.isArray(WEAPONS)) return null;
            return WEAPONS.find(w => w.type === type) || null;
        }

        if (inc) {
            const type = inc.closest('[data-weapon]').getAttribute('data-weapon');
            const weapon = findWeaponByType(type);
            const price = getWeaponCostCredits(weapon);
            if (typeof price !== 'number') return;
            character.credits = (typeof character.credits !== 'undefined') ? character.credits : 0;
            if (price > 0 && character.credits < price) {
                alert('Insufficient credits to purchase ' + type + ' (' + price + 'c).');
                return;
            }
            if (price > 0) character.credits -= price;
            character.weaponInventory[type] = (character.weaponInventory[type] || 0) + 1;
            renderWeaponsStep(character, container, onUpdate);
            if (typeof onUpdate === 'function') onUpdate();
            return;
        }

        if (dec) {
            const type = dec.closest('[data-weapon]').getAttribute('data-weapon');
            const current = character.weaponInventory[type] || 0;
            if (current > 0) {
                const weapon = findWeaponByType(type);
                const price = getWeaponCostCredits(weapon);
                character.weaponInventory[type] = current - 1;
                if (typeof price === 'number' && price > 0) {
                    character.credits = (typeof character.credits !== 'undefined') ? character.credits : 0;
                    character.credits += price;
                }
            }
            renderWeaponsStep(character, container, onUpdate);
            if (typeof onUpdate === 'function') onUpdate();
            return;
        }
    };
    container.addEventListener('click', container._weaponsHandler);
}
