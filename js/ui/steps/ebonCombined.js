/**
 * Combined Ebon step
 * - renderEbonCombinedStep(character, container, onUpdate)
 */

function renderEbonCombinedStep(character, container, onUpdate) {
    // Defensive: ensure helpers exist
    if (typeof sectionHeader !== 'function' || typeof fluxDisplayHtml !== 'function' || typeof escapeHtml !== 'function') {
        container.innerHTML = '<div class="info-box">Missing utilities for Ebon step.</div>';
        return;
    }

    if (!character.isFluxUser || !character.isFluxUser()) {
        container.innerHTML = sectionHeader('Step 7: Ebon') +
            '<div class="info-box"><h4>Not an Ebon User</h4><p>Only Ebon and Brain Waster characters can use Flux abilities and Ebon equipment.</p></div>';
        return;
    }

    // Compatibility: store ranks as an object { categoryKey: rank }
    character.ebonRanks = character.ebonRanks || {};
    character.ebonEquipmentInventory = character.ebonEquipmentInventory || {};

    const isNecanthrope = (typeof character.isNecanthrope === 'function')
        ? !!character.isNecanthrope()
        : (character.class && String(character.class).toLowerCase().includes('necanthrope'));

    let html = '';
    html += sectionHeader('Step 7: Ebon');
    html += '<div class="section-header"><h3 class="section-title">Ebon Skills (max rank 10)</h3></div>';
    html += '<div class="ebon-categories" style="display:grid;grid-template-columns:repeat(2, 1fr);gap:10px;margin-top:8px;background:transparent;color:#eee">';

    for (const catKey in EBON_ABILITIES) {
        const cat = EBON_ABILITIES[catKey];
        if (!cat) continue;
        const selectedRank = Number(character.ebonRanks[catKey] || 0);
        const startingMax = (typeof cat.startingMaxRank === 'number') ? cat.startingMaxRank : 10;
        const maxAllowed = 20; // overall cap
        const maxStartAllowed = startingMax;
        const necaOnly = !!cat.necanthropeOnly;
        const canPurchase = !!cat.canPurchase;

        const disabledForCharacter = necaOnly && !isNecanthrope;
        const inputMax = Math.min(maxAllowed, (canPurchase ? maxStartAllowed : 20));

        // build a concise current-rank summary
        let currentSummary = '—';
        if (selectedRank > 0 && Array.isArray(cat.ranks) && cat.ranks[selectedRank - 1]) {
            const rankData = cat.ranks[selectedRank - 1];
            currentSummary = `${escapeHtml(rankData.title || ('Rank ' + selectedRank))}${rankData.description ? ' — ' + escapeHtml(String(rankData.description).substring(0, 50)) + '...' : ''}`;
        }

        const fluxCost = (typeof computeCumulativeCost === 'function')
            ? computeCumulativeCost(catKey, selectedRank)
            : (() => {
                let t = 0;
                if (Array.isArray(cat.ranks)) {
                    for (let i = 0; i < Math.min(selectedRank, cat.ranks.length); i++) {
                        const c = cat.ranks[i].cost;
                        if (typeof c === 'number') t += c;
                    }
                }
                return t;
            })();
        const pointCost = selectedRank > 0 ? (selectedRank * (selectedRank + 1)) / 2 : 0;

        html += `<div class="ebon-category" style="border:1px solid #333;padding:8px;border-radius:4px;background:#1e1e1e;color:#eee">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
            <div style="font-weight:700;color:#fff">${escapeHtml(cat.name)}</div>
            <div style="font-size:12px;color:#bbb">${escapeHtml(cat.freeAbility || '')}</div>
          </div>

          <div style="display:flex;gap:10px;align-items:center;margin-bottom:6px">
            <label style="font-size:13px;color:#ddd">Rank</label>
            <input class="ebon-rank-input" data-cat="${escapeHtml(catKey)}" type="number" min="0" max="${inputMax}" value="${selectedRank}" style="width:64px;padding:6px;border:1px solid #444;border-radius:4px;background:#333;color:#eee" ${disabledForCharacter ? 'disabled' : ''} ${canPurchase ? '' : 'readonly'}>
            <div style="font-size:12px;color:#ddd;flex:1"><strong>Current:</strong> ${currentSummary}</div>
            <div style="font-size:12px;color:#ddd"><strong>Points:</strong> ${pointCost || 0} • <strong>Flux:</strong> ${fluxCost || 0}</div>
          </div>

          <div style="font-size:12px;color:#bbb;line-height:1.4">${cat.ranks && cat.ranks[0] && cat.ranks[0].description ? renderMarkdown(cat.ranks[0].description) : ''}</div>
        </div>`;
    }

    html += '</div>';

    html += '<div class="section-header"><h3 class="section-title">Ebon Equipment</h3></div>';
    html += '<div class="ebon-equipment-container">';
    html += '<div class="ebon-equipment-table">';
    html += '<div class="ebon-equipment-header">' +
        '<div>Ability</div><div>Equipment</div><div>Cost</div><div>Qty</div>' +
        '</div>';

    const items = (Array.isArray(EBON_EQUIPMENT) ? EBON_EQUIPMENT.slice() : []);

    items.forEach(item => {
        const key = item.ability + ' — ' + item.equipment;
        const qty = character.ebonEquipmentInventory[key] || 0;
        const costCredits = getEbonEquipmentCostCredits(item);
        const canPurchase = typeof costCredits === 'number';
        const isDeathSuit = item.equipment === 'DeathSuit';
        const disableIncrease = (!canPurchase) || (isDeathSuit && qty >= 1);
        html += '<div class="ebon-equipment-row" data-ebon-equipment="' + escapeHtml(key) + '">' +
            '<div class="ebon-equipment-ability">' + escapeHtml(item.ability) + '</div>' +
            '<div>' + escapeHtml(item.equipment) + '</div>' +
            '<div class="ebon-equipment-cost">' + escapeHtml(formatEbonEquipmentCost(item)) + '</div>' +
            '<div class="ebon-equipment-qty">' +
                '<button class="ebon-equipment-qty-btn ebon-equipment-decrease" ' + (qty <= 0 ? 'disabled' : '') + '>−</button>' +
                '<span class="ebon-equipment-qty-value">' + escapeHtml(String(qty)) + '</span>' +
                '<button class="ebon-equipment-qty-btn ebon-equipment-increase" ' + (disableIncrease ? 'disabled' : '') + '>+</button>' +
            '</div>' +
            (isDeathSuit ? (function(){
                const owned = qty > 0;
                const dsType = typeof character.getDeathSuitTypeFromProtectRank === 'function' ? character.getDeathSuitTypeFromProtectRank() : 'Light';
                return owned ? '<div class="deathsuit-type" style="margin-left:8px">' +
                    '<label style="font-size:12px;margin-right:6px;color:#ddd">Type (Protect Rank):</label>' +
                    '<span style="font-size:12px;color:#fff;font-weight:bold">' + escapeHtml(dsType) + '</span>' +
                '</div>' : '';
            })() : '') +
        '</div>';
    });

    html += '</div></div>';

    container.innerHTML = html;

    const handlerKeys = ['_ebonHandler', '_ebonEquipmentHandler', '_ebonCombinedInputHandler', '_ebonCombinedClickHandler'];
    handlerKeys.forEach(key => {
        if (container[key]) {
            container.removeEventListener('input', container[key]);
            container.removeEventListener('change', container[key]);
            container.removeEventListener('click', container[key]);
        }
    });

    container._ebonCombinedInputHandler = function (e) {
        const input = e.target.closest('.ebon-rank-input');
        if (!input || !container.contains(input)) return;
        const cat = input.getAttribute('data-cat');
        if (!cat) return;

        const catDef = EBON_ABILITIES[cat];
        const isNecOnly = catDef && !!catDef.necanthropeOnly;
        const isNec = isNecanthrope;
        if (isNecOnly && !isNec) {
            input.value = 0;
            character.ebonRanks[cat] = 0;
            return;
        }

        let val = Number(input.value) || 0;
        const startMax = (catDef && typeof catDef.startingMaxRank === 'number') ? catDef.startingMaxRank : 10;
        if (val > startMax && catDef && !!catDef.canPurchase) {
            val = startMax;
            input.value = val;
        }
        if (val < 0) {
            val = 0;
            input.value = 0;
        }

        character.ebonRanks = character.ebonRanks || {};
        character.ebonRanks[cat] = val;

        renderEbonCombinedStep(character, container, onUpdate);
        if (typeof onUpdate === 'function') onUpdate();
    };

    container._ebonCombinedClickHandler = function (e) {
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
            if (item && item.equipment === 'DeathSuit') {
                const current = character.ebonEquipmentInventory[key] || 0;
                if (current >= 1) return; // cap at 1
            }
            character.credits = (typeof character.credits !== 'undefined') ? character.credits : 0;
            if (price > 0 && character.credits < price) {
                alert('Insufficient credits to purchase ' + key + ' (' + price + 'c).');
                return;
            }
            if (price > 0) character.credits -= price;
            character.ebonEquipmentInventory[key] = (character.ebonEquipmentInventory[key] || 0) + 1;
            renderEbonCombinedStep(character, container, onUpdate);
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
            renderEbonCombinedStep(character, container, onUpdate);
            if (typeof onUpdate === 'function') onUpdate();
        }
    };

    container.addEventListener('input', container._ebonCombinedInputHandler);
    container.addEventListener('change', container._ebonCombinedInputHandler);
    container.addEventListener('click', container._ebonCombinedClickHandler);
}
