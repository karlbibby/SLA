/**
 * Step 13: Ammunition
 * - renderAmmunitionStep(character, container, onUpdate)
 */

function formatAmmoStandardCost(cell) {
    if (!cell || !cell.available || typeof cell.stdCost !== 'number') return '—';
    const currency = cell.stdCurrency === 'u' ? 'u' : 'c';
    return cell.stdCost + currency;
}

function getAmmoCostCredits(cell) {
    if (!cell || !cell.available || typeof cell.stdCost !== 'number') return null;
    if (cell.stdCurrency === 'u') return cell.stdCost / 10;
    return cell.stdCost;
}

function renderAmmunitionStep(character, container, onUpdate) {
    if (typeof sectionHeader !== 'function' || typeof escapeHtml !== 'function') {
        container.innerHTML = '<div class="info-box">Missing utilities for Ammunition step.</div>';
        return;
    }

    character.ammoInventory = character.ammoInventory || {};

    const items = Array.isArray(AMMUNITION) ? AMMUNITION.slice() : [];
    const types = ['STD', 'AP', 'HP', 'HEAP', 'HESH'];

    let html = sectionHeader('Step 13: Ammunition', 'Purchase ammunition using your available credits.');
    html += '<div class="ammo-container">';
    html += '<div class="ammo-table">';
    html += '<div class="ammo-header">' +
        '<div>Calibre</div>' +
        types.map(t => '<div>' + escapeHtml(t) + '</div>').join('') +
        '</div>';

    items.forEach(ammo => {
        html += '<div class="ammo-row" data-calibre="' + escapeHtml(ammo.calibre) + '">';
        html += '<div class="ammo-calibre">' + escapeHtml(ammo.calibre) + '</div>';

        types.forEach(type => {
            const cell = ammo.types ? ammo.types[type] : null;
            const available = cell && cell.available;
            const priceCredits = getAmmoCostCredits(cell);
            const canPurchase = typeof priceCredits === 'number';
            const key = ammo.calibre + ' × ' + type;
            const qty = character.ammoInventory[key] || 0;
            const lockedQty = (character.lockedInventory && character.lockedInventory.ammo && character.lockedInventory.ammo[key]) || 0;

            html += '<div class="ammo-cell" data-ammo="' + escapeHtml(key) + '" data-type="' + escapeHtml(type) + '">' +
                '<div class="ammo-price ' + (available ? '' : 'is-unavailable') + '">' + escapeHtml(formatAmmoStandardCost(cell)) + '</div>' +
                '<div class="ammo-qty">' +
                    '<button class="ammo-qty-btn ammo-decrease" ' + (qty <= lockedQty ? 'disabled' : '') + '>−</button>' +
                    '<span class="ammo-qty-value">' + escapeHtml(String(qty)) + '</span>' +
                    '<button class="ammo-qty-btn ammo-increase" ' + (!canPurchase ? 'disabled' : '') + '>+</button>' +
                '</div>' +
            '</div>';
        });

        html += '</div>';
    });

    html += '</div></div>';

    container.innerHTML = html;

    if (container._ammoHandler) {
        container.removeEventListener('click', container._ammoHandler);
    }

    container._ammoHandler = function (e) {
        if (!container.contains(e.target)) return;

        const inc = e.target.closest('.ammo-qty-btn.ammo-increase');
        const dec = e.target.closest('.ammo-qty-btn.ammo-decrease');

        function findAmmoCellByKey(key) {
            if (!Array.isArray(AMMUNITION)) return null;
            for (const ammo of AMMUNITION) {
                const types = ammo.types || {};
                for (const type in types) {
                    if ((ammo.calibre + ' × ' + type) === key) {
                        return types[type];
                    }
                }
            }
            return null;
        }

        function getLockedAmmoQty(key) {
            if (!character.lockedInventory || !character.lockedInventory.ammo) return 0;
            return character.lockedInventory.ammo[key] || 0;
        }

        if (inc) {
            const cellEl = inc.closest('[data-ammo]');
            const key = cellEl.getAttribute('data-ammo');
            const cell = findAmmoCellByKey(key);
            const price = getAmmoCostCredits(cell);
            if (typeof price !== 'number') return;
            character.credits = (typeof character.credits !== 'undefined') ? character.credits : 0;
            if (price > 0 && character.credits < price) {
                alert('Insufficient credits to purchase ' + key + ' (' + price + 'c).');
                return;
            }
            if (price > 0) character.credits -= price;
            character.ammoInventory[key] = (character.ammoInventory[key] || 0) + 1;
            renderAmmunitionStep(character, container, onUpdate);
            if (typeof onUpdate === 'function') onUpdate();
            return;
        }

        if (dec) {
            const cellEl = dec.closest('[data-ammo]');
            const key = cellEl.getAttribute('data-ammo');
            const current = character.ammoInventory[key] || 0;
            const lockedQty = getLockedAmmoQty(key);
            if (current > lockedQty) {
                const cell = findAmmoCellByKey(key);
                const price = getAmmoCostCredits(cell);
                character.ammoInventory[key] = current - 1;
                if (typeof price === 'number' && price > 0) {
                    character.credits = (typeof character.credits !== 'undefined') ? character.credits : 0;
                    character.credits += price;
                }
            }
            renderAmmunitionStep(character, container, onUpdate);
            if (typeof onUpdate === 'function') onUpdate();
            return;
        }
    };

    container.addEventListener('click', container._ammoHandler);
}
