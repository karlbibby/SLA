/**
 * Step 12: Grenades
 * - renderGrenadesStep(character, container, onUpdate)
 */

function formatGrenadeCost(grenade) {
    if (!grenade || typeof grenade.cost !== 'number') return 'n/a';
    const currency = grenade.costCurrency === 'u' ? 'u' : 'c';
    return grenade.cost + currency;
}

function getGrenadeCostCredits(grenade) {
    if (!grenade || typeof grenade.cost !== 'number') return null;
    if (grenade.costCurrency === 'u') return grenade.cost / 10;
    return grenade.cost;
}

function renderGrenadesStep(character, container, onUpdate) {
    if (typeof sectionHeader !== 'function' || typeof escapeHtml !== 'function') {
        container.innerHTML = '<div class="info-box">Missing utilities for Grenades step.</div>';
        return;
    }

    character.grenadeInventory = character.grenadeInventory || {};

    const items = (Array.isArray(GRENADES) ? GRENADES.slice() : []);

    let html = sectionHeader('Step 12: Grenades', 'Purchase grenades using your available credits.');
    html += '<div class="grenades-container">';
    html += '<div class="grenades-table">';
    html += '<div class="grenades-header">' +
        '<div>Type</div><div>Blast Rating</div><div>PEN</div><div>Weight</div><div>Cost</div><div>Qty</div>' +
        '</div>';

    items.forEach(grenade => {
        const qty = character.grenadeInventory[grenade.type] || 0;
        const costCredits = getGrenadeCostCredits(grenade);
        const canPurchase = typeof costCredits === 'number';
        html += '<div class="grenade-row" data-grenade="' + escapeHtml(grenade.type) + '">' +
            '<div class="grenade-type">' + escapeHtml(grenade.type) + '</div>' +
            '<div>' + escapeHtml(grenade.blast) + '</div>' +
            '<div>' + escapeHtml(grenade.pen) + '</div>' +
            '<div>' + escapeHtml(grenade.weight) + '</div>' +
            '<div class="grenade-cost">' + escapeHtml(formatGrenadeCost(grenade)) + '</div>' +
            '<div class="grenade-qty">' +
                '<button class="grenade-qty-btn grenade-decrease" ' + (qty <= 0 ? 'disabled' : '') + '>−</button>' +
                '<span class="grenade-qty-value">' + escapeHtml(String(qty)) + '</span>' +
                '<button class="grenade-qty-btn grenade-increase" ' + (!canPurchase ? 'disabled' : '') + '>+</button>' +
            '</div>' +
        '</div>';
    });

    html += '</div></div>';

    container.innerHTML = html;

    if (container._grenadesHandler) {
        container.removeEventListener('click', container._grenadesHandler);
    }
    container._grenadesHandler = function (e) {
        if (!container.contains(e.target)) return;

        const inc = e.target.closest('.grenade-qty-btn.grenade-increase');
        const dec = e.target.closest('.grenade-qty-btn.grenade-decrease');

        function findGrenadeByType(type) {
            if (!Array.isArray(GRENADES)) return null;
            return GRENADES.find(g => g.type === type) || null;
        }

        if (inc) {
            const type = inc.closest('[data-grenade]').getAttribute('data-grenade');
            const grenade = findGrenadeByType(type);
            const price = getGrenadeCostCredits(grenade);
            if (typeof price !== 'number') return;
            character.credits = (typeof character.credits !== 'undefined') ? character.credits : 0;
            if (price > 0 && character.credits < price) {
                alert('Insufficient credits to purchase ' + type + ' (' + price + 'c).');
                return;
            }
            if (price > 0) character.credits -= price;
            character.grenadeInventory[type] = (character.grenadeInventory[type] || 0) + 1;
            renderGrenadesStep(character, container, onUpdate);
            if (typeof onUpdate === 'function') onUpdate();
            return;
        }

        if (dec) {
            const type = dec.closest('[data-grenade]').getAttribute('data-grenade');
            const current = character.grenadeInventory[type] || 0;
            if (current > 0) {
                const grenade = findGrenadeByType(type);
                const price = getGrenadeCostCredits(grenade);
                character.grenadeInventory[type] = current - 1;
                if (typeof price === 'number' && price > 0) {
                    character.credits = (typeof character.credits !== 'undefined') ? character.credits : 0;
                    character.credits += price;
                }
            }
            renderGrenadesStep(character, container, onUpdate);
            if (typeof onUpdate === 'function') onUpdate();
            return;
        }
    };
    container.addEventListener('click', container._grenadesHandler);
}
