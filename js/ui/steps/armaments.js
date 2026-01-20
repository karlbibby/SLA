/**
 * Step 9: Armaments
 * - renderArmamentsStep(character, container, onUpdate)
 */

function formatArmamentCost(armament) {
    if (!armament || typeof armament.cost !== 'number') return 'n/a';
    const currency = armament.costCurrency === 'u' ? 'u' : 'c';
    return armament.cost + currency;
}

function getArmamentCostCredits(armament) {
    if (!armament || typeof armament.cost !== 'number') return null;
    if (armament.costCurrency === 'u') return armament.cost / 10;
    return armament.cost;
}

function renderArmamentsStep(character, container, onUpdate) {
    if (typeof sectionHeader !== 'function' || typeof escapeHtml !== 'function') {
        container.innerHTML = '<div class="info-box">Missing utilities for Armaments step.</div>';
        return;
    }

    character.armamentInventory = character.armamentInventory || {};

    const items = (Array.isArray(ARMAMENTS) ? ARMAMENTS.slice() : []).sort((a, b) => {
        const aName = a && a.type ? a.type : '';
        const bName = b && b.type ? b.type : '';
        return aName.localeCompare(bName);
    });

    let html = sectionHeader('Step 9: Armaments', 'Purchase armaments using your available credits.');
    html += '<div class="armaments-container">';
    html += '<div class="armaments-table">';
    html += '<div class="armaments-header">' +
        '<div>Type</div><div>Size</div><div>Clip</div><div>Cal</div><div>ROF</div><div>Recoil</div><div>Range</div><div>Weight</div><div>Cost</div><div>Qty</div>' +
        '</div>';

    items.forEach(armament => {
        const qty = character.armamentInventory[armament.type] || 0;
        const costCredits = getArmamentCostCredits(armament);
        const canPurchase = typeof costCredits === 'number';
        html += '<div class="armament-row" data-armament="' + escapeHtml(armament.type) + '">' +
            '<div class="armament-type">' + escapeHtml(armament.type) + '</div>' +
            '<div>' + escapeHtml(armament.size) + '</div>' +
            '<div>' + escapeHtml(armament.clip) + '</div>' +
            '<div>' + escapeHtml(armament.cal) + '</div>' +
            '<div>' + escapeHtml(armament.rof) + '</div>' +
            '<div>' + escapeHtml(armament.recoil) + '</div>' +
            '<div>' + escapeHtml(armament.range) + '</div>' +
            '<div>' + escapeHtml(armament.weight) + '</div>' +
            '<div class="armament-cost">' + escapeHtml(formatArmamentCost(armament)) + '</div>' +
            '<div class="armament-qty">' +
                '<button class="armament-qty-btn armament-decrease" ' + (qty <= 0 ? 'disabled' : '') + '>−</button>' +
                '<span class="armament-qty-value">' + escapeHtml(String(qty)) + '</span>' +
                '<button class="armament-qty-btn armament-increase" ' + (!canPurchase ? 'disabled' : '') + '>+</button>' +
            '</div>' +
        '</div>';
    });

    html += '</div></div>';

    container.innerHTML = html;

    if (container._armamentsHandler) {
        container.removeEventListener('click', container._armamentsHandler);
    }
    container._armamentsHandler = function (e) {
        if (!container.contains(e.target)) return;

        const inc = e.target.closest('.armament-qty-btn.armament-increase');
        const dec = e.target.closest('.armament-qty-btn.armament-decrease');

        function findArmamentByType(type) {
            if (!Array.isArray(ARMAMENTS)) return null;
            return ARMAMENTS.find(a => a.type === type) || null;
        }

        if (inc) {
            const type = inc.closest('[data-armament]').getAttribute('data-armament');
            const armament = findArmamentByType(type);
            const price = getArmamentCostCredits(armament);
            if (typeof price !== 'number') return;
            character.credits = (typeof character.credits !== 'undefined') ? character.credits : 0;
            if (price > 0 && character.credits < price) {
                alert('Insufficient credits to purchase ' + type + ' (' + price + 'c).');
                return;
            }
            if (price > 0) character.credits -= price;
            character.armamentInventory[type] = (character.armamentInventory[type] || 0) + 1;
            renderArmamentsStep(character, container, onUpdate);
            if (typeof onUpdate === 'function') onUpdate();
            return;
        }

        if (dec) {
            const type = dec.closest('[data-armament]').getAttribute('data-armament');
            const current = character.armamentInventory[type] || 0;
            if (current > 0) {
                const armament = findArmamentByType(type);
                const price = getArmamentCostCredits(armament);
                character.armamentInventory[type] = current - 1;
                if (typeof price === 'number' && price > 0) {
                    character.credits = (typeof character.credits !== 'undefined') ? character.credits : 0;
                    character.credits += price;
                }
            }
            renderArmamentsStep(character, container, onUpdate);
            if (typeof onUpdate === 'function') onUpdate();
            return;
        }
    };
    container.addEventListener('click', container._armamentsHandler);
}
