/**
 * Step 10: Armour
 * - renderArmourStep(character, container, onUpdate)
 */

function formatArmourCost(armour) {
    if (!armour || typeof armour.cost !== 'number') return 'n/a';
    const currency = armour.costCurrency === 'u' ? 'u' : 'c';
    return armour.cost + currency;
}

function getArmourCostCredits(armour) {
    if (!armour || typeof armour.cost !== 'number') return null;
    if (armour.costCurrency === 'u') return armour.cost / 10;
    return armour.cost;
}

function normalizeArmourValue(value) {
    if (value === null || value === undefined) return '--';
    const v = String(value).trim();
    if (v === '-' || v === '—' || v === '–' || v === '') return '--';
    return v;
}

function applyArmourSelection(character, armour) {
    if (!character) return;
    if (!armour) {
        character.selectedArmourType = '';
        character.armourHead = '--';
        character.armourTorso = '--';
        character.armourLArm = '--';
        character.armourRArm = '--';
        character.armourLLeg = '--';
        character.armourRLeg = '--';
        character.idHead = '--';
        character.idTorso = '--';
        character.idLArm = '--';
        character.idRArm = '--';
        character.idLLeg = '--';
        character.idRLeg = '--';
        return;
    }

    const pv = normalizeArmourValue(armour.pv);
    const head = normalizeArmourValue(armour.head);
    const torso = normalizeArmourValue(armour.torso);
    const arms = normalizeArmourValue(armour.arms);
    const legs = normalizeArmourValue(armour.legs);

    character.selectedArmourType = armour.type || '';
    character.armourHead = pv;
    character.armourTorso = pv;
    character.armourLArm = pv;
    character.armourRArm = pv;
    character.armourLLeg = pv;
    character.armourRLeg = pv;
    character.idHead = head;
    character.idTorso = torso;
    character.idLArm = arms;
    character.idRArm = arms;
    character.idLLeg = legs;
    character.idRLeg = legs;
}

function renderArmourStep(character, container, onUpdate) {
    if (typeof sectionHeader !== 'function' || typeof escapeHtml !== 'function') {
        container.innerHTML = '<div class="info-box">Missing utilities for Armour step.</div>';
        return;
    }

    character.armourInventory = character.armourInventory || {};

    const items = (Array.isArray(ARMOUR) ? ARMOUR.slice() : []);

    if (!character.selectedArmourType) {
        const owned = Object.entries(character.armourInventory).find(([, qty]) => (Number(qty) || 0) > 0);
        if (owned) {
            const armour = items.find(a => a.type === owned[0]) || null;
            applyArmourSelection(character, armour);
        }
    }

    let html = sectionHeader('Step 10: Armour', 'Purchase armour using your available credits.');
    html += '<div class="armour-container">';
    html += '<div class="armour-table">';
    html += '<div class="armour-header">' +
        '<div>Armour Types</div><div>Cost</div><div>P.V.</div><div>Head</div><div>Torso</div><div>Arms</div><div>Legs</div><div>Modifiers</div><div>Qty</div>' +
        '</div>';

    items.forEach(armour => {
        const qty = character.armourInventory[armour.type] || 0;
        const costCredits = getArmourCostCredits(armour);
        const canPurchase = typeof costCredits === 'number';
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
                '<button class="armour-qty-btn armour-increase" ' + (!canPurchase ? 'disabled' : '') + '>+</button>' +
            '</div>' +
        '</div>';
    });

    html += '</div></div>';

    container.innerHTML = html;

    if (container._armourHandler) {
        container.removeEventListener('click', container._armourHandler);
    }
    container._armourHandler = function (e) {
        if (!container.contains(e.target)) return;

        const inc = e.target.closest('.armour-qty-btn.armour-increase');
        const dec = e.target.closest('.armour-qty-btn.armour-decrease');

        function findArmourByType(type) {
            if (!Array.isArray(ARMOUR)) return null;
            return ARMOUR.find(a => a.type === type) || null;
        }

        if (inc) {
            const type = inc.closest('[data-armour]').getAttribute('data-armour');
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
            renderArmourStep(character, container, onUpdate);
            if (typeof onUpdate === 'function') onUpdate();
            return;
        }

        if (dec) {
            const type = dec.closest('[data-armour]').getAttribute('data-armour');
            const current = character.armourInventory[type] || 0;
            if (current > 0) {
                const armour = findArmourByType(type);
                const price = getArmourCostCredits(armour);
                character.armourInventory[type] = current - 1;
                if (typeof price === 'number' && price > 0) {
                    character.credits = (typeof character.credits !== 'undefined') ? character.credits : 0;
                    character.credits += price;
                }
                if (character.armourInventory[type] <= 0 && character.selectedArmourType === type) {
                    const nextOwned = Object.entries(character.armourInventory).find(([, qty]) => (Number(qty) || 0) > 0);
                    const nextArmour = nextOwned ? findArmourByType(nextOwned[0]) : null;
                    applyArmourSelection(character, nextArmour);
                }
            }
            renderArmourStep(character, container, onUpdate);
            if (typeof onUpdate === 'function') onUpdate();
            return;
        }
    };
    container.addEventListener('click', container._armourHandler);
}
