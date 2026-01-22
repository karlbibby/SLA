/**
 * Step 17: Ebon Equipment
 * - renderEbonEquipmentStep(character, container, onUpdate)
 */

function formatEbonEquipmentCost(item) {
    if (!item || typeof item.cost !== 'number') return 'n/a';
    const currency = item.costCurrency === 'u' ? 'u' : 'c';
    const suffix = item.costSuffix || '';
    return item.cost + currency + suffix;
}

function getEbonEquipmentCostCredits(item) {
    if (!item || typeof item.cost !== 'number') return null;
    if (item.costCurrency === 'u') return item.cost / 10;
    return item.cost;
}

function renderEbonEquipmentStep(character, container, onUpdate) {
    if (typeof sectionHeader !== 'function' || typeof escapeHtml !== 'function') {
        container.innerHTML = '<div class="info-box">Missing utilities for Ebon Equipment step.</div>';
        return;
    }

    if (!character.isFluxUser || !character.isFluxUser()) {
        container.innerHTML = sectionHeader('Step 17: Ebon Equipment') +
            '<div class="info-box"><h4>Not an Ebon User</h4><p>Only Ebon and Brain Waster characters can use Ebon equipment.</p></div>';
        return;
    }

    character.ebonEquipmentInventory = character.ebonEquipmentInventory || {};

    const items = (Array.isArray(EBON_EQUIPMENT) ? EBON_EQUIPMENT.slice() : []);

    let html = sectionHeader('Step 17: Ebon Equipment', 'Purchase Ebon equipment using your available credits.');
    html += '<div class="ebon-equipment-container">';
    html += '<div class="ebon-equipment-table">';
    html += '<div class="ebon-equipment-header">' +
        '<div>Ability</div><div>Equipment</div><div>Cost</div><div>Qty</div>' +
        '</div>';

    items.forEach(item => {
        const key = item.ability + ' — ' + item.equipment;
        const qty = character.ebonEquipmentInventory[key] || 0;
        const costCredits = getEbonEquipmentCostCredits(item);
        const canPurchase = typeof costCredits === 'number';
        html += '<div class="ebon-equipment-row" data-ebon-equipment="' + escapeHtml(key) + '">' +
            '<div class="ebon-equipment-ability">' + escapeHtml(item.ability) + '</div>' +
            '<div>' + escapeHtml(item.equipment) + '</div>' +
            '<div class="ebon-equipment-cost">' + escapeHtml(formatEbonEquipmentCost(item)) + '</div>' +
            '<div class="ebon-equipment-qty">' +
                '<button class="ebon-equipment-qty-btn ebon-equipment-decrease" ' + (qty <= 0 ? 'disabled' : '') + '>−</button>' +
                '<span class="ebon-equipment-qty-value">' + escapeHtml(String(qty)) + '</span>' +
                '<button class="ebon-equipment-qty-btn ebon-equipment-increase" ' + (!canPurchase ? 'disabled' : '') + '>+</button>' +
            '</div>' +
        '</div>';
    });

    html += '</div></div>';

    container.innerHTML = html;

    if (container._ebonEquipmentHandler) {
        container.removeEventListener('click', container._ebonEquipmentHandler);
    }
    container._ebonEquipmentHandler = function (e) {
        if (!container.contains(e.target)) return;

        const inc = e.target.closest('.ebon-equipment-qty-btn.ebon-equipment-increase');
        const dec = e.target.closest('.ebon-equipment-qty-btn.ebon-equipment-decrease');

        function findEbonEquipmentByKey(key) {
            if (!Array.isArray(EBON_EQUIPMENT)) return null;
            return EBON_EQUIPMENT.find(a => (a.ability + ' — ' + a.equipment) === key) || null;
        }

        if (inc) {
            const key = inc.closest('[data-ebon-equipment]').getAttribute('data-ebon-equipment');
            const item = findEbonEquipmentByKey(key);
            const price = getEbonEquipmentCostCredits(item);
            if (typeof price !== 'number') return;
            character.credits = (typeof character.credits !== 'undefined') ? character.credits : 0;
            if (price > 0 && character.credits < price) {
                alert('Insufficient credits to purchase ' + key + ' (' + price + 'c).');
                return;
            }
            if (price > 0) character.credits -= price;
            character.ebonEquipmentInventory[key] = (character.ebonEquipmentInventory[key] || 0) + 1;
            renderEbonEquipmentStep(character, container, onUpdate);
            if (typeof onUpdate === 'function') onUpdate();
            return;
        }

        if (dec) {
            const key = dec.closest('[data-ebon-equipment]').getAttribute('data-ebon-equipment');
            const current = character.ebonEquipmentInventory[key] || 0;
            if (current > 0) {
                const item = findEbonEquipmentByKey(key);
                const price = getEbonEquipmentCostCredits(item);
                character.ebonEquipmentInventory[key] = current - 1;
                if (typeof price === 'number' && price > 0) {
                    character.credits = (typeof character.credits !== 'undefined') ? character.credits : 0;
                    character.credits += price;
                }
            }
            renderEbonEquipmentStep(character, container, onUpdate);
            if (typeof onUpdate === 'function') onUpdate();
            return;
        }
    };
    container.addEventListener('click', container._ebonEquipmentHandler);
}
