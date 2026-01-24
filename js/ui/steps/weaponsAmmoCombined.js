/**
 * Combined Weapons/Ammo steps
 * - renderWeaponsCombinedStep(character, container, onUpdate)
 * - renderAmmoCombinedStep(character, container, onUpdate)
 */

function renderWeaponsCombinedStep(character, container, onUpdate) {
    if (typeof sectionHeader !== 'function' || typeof escapeHtml !== 'function') {
        container.innerHTML = '<div class="info-box">Missing utilities for Weapons step.</div>';
        return;
    }

    character.armamentInventory = character.armamentInventory || {};
    character.weaponInventory = character.weaponInventory || {};

    const armaments = (Array.isArray(ARMAMENTS) ? ARMAMENTS.slice() : []).sort((a, b) => {
        const aName = a && a.type ? a.type : '';
        const bName = b && b.type ? b.type : '';
        return aName.localeCompare(bName);
    });

    const weapons = (Array.isArray(WEAPONS) ? WEAPONS.slice() : []).sort((a, b) => {
        const aName = a && a.type ? a.type : '';
        const bName = b && b.type ? b.type : '';
        return aName.localeCompare(bName);
    });

    let html = sectionHeader('Step 9: Weapons', 'Purchase armaments and melee weapons using your available credits.');

    html += '<div class="section-header"><h3 class="section-title">Armaments</h3></div>';
    html += '<div class="armaments-container">';
    html += '<div class="armaments-table">';
    html += '<div class="armaments-header">' +
        '<div>Type</div><div>Size</div><div>Clip</div><div>Cal</div><div>ROF</div><div>Recoil</div><div>Range</div><div>Weight</div><div>Cost</div><div>Qty</div>' +
        '</div>';

    armaments.forEach(armament => {
        const qty = character.armamentInventory[armament.type] || 0;
        const lockedQty = (character.lockedInventory && character.lockedInventory.armaments && character.lockedInventory.armaments[armament.type]) || 0;
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
                '<button class="armament-qty-btn armament-decrease" ' + (qty <= lockedQty ? 'disabled' : '') + '>−</button>' +
                '<span class="armament-qty-value">' + escapeHtml(String(qty)) + '</span>' +
                '<button class="armament-qty-btn armament-increase" ' + (!canPurchase ? 'disabled' : '') + '>+</button>' +
            '</div>' +
        '</div>';
    });

    html += '</div></div>';

    html += '<div class="section-header"><h3 class="section-title">Weapons</h3></div>';
    html += '<div class="weapons-container">';
    html += '<div class="weapons-table">';
    html += '<div class="weapons-header">' +
        '<div>Type</div><div>DMG</div><div>PEN</div><div>Armour DMG</div><div>Weight</div><div>Cost</div><div>Black Market</div><div>Qty</div>' +
        '</div>';

    weapons.forEach(weapon => {
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

    const handlerKeys = ['_armamentsHandler', '_weaponsHandler', '_weaponsCombinedHandler'];
    handlerKeys.forEach(key => {
        if (container[key]) {
            container.removeEventListener('click', container[key]);
        }
    });

    container._weaponsCombinedHandler = function (e) {
        if (!container.contains(e.target)) return;

        const armInc = e.target.closest('.armament-qty-btn.armament-increase');
        const armDec = e.target.closest('.armament-qty-btn.armament-decrease');
        const weaponInc = e.target.closest('.weapon-qty-btn.weapon-increase');
        const weaponDec = e.target.closest('.weapon-qty-btn.weapon-decrease');

        function findArmamentByType(type) {
            if (!Array.isArray(ARMAMENTS)) return null;
            return ARMAMENTS.find(a => a.type === type) || null;
        }

        function getLockedArmamentQty(type) {
            if (!character.lockedInventory || !character.lockedInventory.armaments) return 0;
            return character.lockedInventory.armaments[type] || 0;
        }

        function findWeaponByType(type) {
            if (!Array.isArray(WEAPONS)) return null;
            return WEAPONS.find(w => w.type === type) || null;
        }

        if (armInc) {
            const type = armInc.closest('[data-armament]').getAttribute('data-armament');
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
            renderWeaponsCombinedStep(character, container, onUpdate);
            if (typeof onUpdate === 'function') onUpdate();
            return;
        }

        if (armDec) {
            const type = armDec.closest('[data-armament]').getAttribute('data-armament');
            const current = character.armamentInventory[type] || 0;
            const lockedQty = getLockedArmamentQty(type);
            if (current > lockedQty) {
                const armament = findArmamentByType(type);
                const price = getArmamentCostCredits(armament);
                character.armamentInventory[type] = current - 1;
                if (typeof price === 'number' && price > 0) {
                    character.credits = (typeof character.credits !== 'undefined') ? character.credits : 0;
                    character.credits += price;
                }
            }
            renderWeaponsCombinedStep(character, container, onUpdate);
            if (typeof onUpdate === 'function') onUpdate();
            return;
        }

        if (weaponInc) {
            const type = weaponInc.closest('[data-weapon]').getAttribute('data-weapon');
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
            renderWeaponsCombinedStep(character, container, onUpdate);
            if (typeof onUpdate === 'function') onUpdate();
            return;
        }

        if (weaponDec) {
            const type = weaponDec.closest('[data-weapon]').getAttribute('data-weapon');
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
            renderWeaponsCombinedStep(character, container, onUpdate);
            if (typeof onUpdate === 'function') onUpdate();
            return;
        }
    };

    container.addEventListener('click', container._weaponsCombinedHandler);
}

function renderAmmoCombinedStep(character, container, onUpdate) {
    if (typeof sectionHeader !== 'function' || typeof escapeHtml !== 'function') {
        container.innerHTML = '<div class="info-box">Missing utilities for Ammo step.</div>';
        return;
    }

    character.grenadeInventory = character.grenadeInventory || {};
    character.ammoInventory = character.ammoInventory || {};
    character.specialistAmmoInventory = character.specialistAmmoInventory || {};

    const grenades = (Array.isArray(GRENADES) ? GRENADES.slice() : []);
    const ammoItems = Array.isArray(AMMUNITION) ? AMMUNITION.slice() : [];
    const ammoTypes = ['STD', 'AP', 'HP', 'HEAP', 'HESH'];
    const specialist = (Array.isArray(SPECIALIST_AMMUNITION) ? SPECIALIST_AMMUNITION.slice() : []);

    let html = sectionHeader('Step 10: Ammo', 'Purchase grenades and ammunition using your available credits.');

    html += '<div class="section-header"><h3 class="section-title">Grenades</h3></div>';
    html += '<div class="grenades-container">';
    html += '<div class="grenades-table">';
    html += '<div class="grenades-header">' +
        '<div>Type</div><div>Blast Rating</div><div>PEN</div><div>Weight</div><div>Cost</div><div>Qty</div>' +
        '</div>';

    grenades.forEach(grenade => {
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

    html += '<div class="section-header"><h3 class="section-title">Ammunition</h3></div>';
    html += '<div class="ammo-container">';
    html += '<div class="ammo-table">';
    html += '<div class="ammo-header">' +
        '<div>Calibre</div>' +
        ammoTypes.map(t => '<div>' + escapeHtml(t) + '</div>').join('') +
        '</div>';

    ammoItems.forEach(ammo => {
        html += '<div class="ammo-row" data-calibre="' + escapeHtml(ammo.calibre) + '">';
        html += '<div class="ammo-calibre">' + escapeHtml(ammo.calibre) + '</div>';

        ammoTypes.forEach(type => {
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

    html += '<div class="section-header"><h3 class="section-title">Specialist Ammo</h3></div>';
    html += '<div class="specialist-ammo-container">';
    html += '<div class="specialist-ammo-table">';
    html += '<div class="specialist-ammo-header">' +
        '<div>Type</div><div>DMG</div><div>PEN</div><div>ARM DMG</div><div>Cost</div><div>Weight</div><div>Weapon</div><div>Qty</div>' +
        '</div>';

    specialist.forEach(item => {
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

    const handlerKeys = ['_grenadesHandler', '_ammoHandler', '_specialistAmmoHandler', '_ammoCombinedHandler'];
    handlerKeys.forEach(key => {
        if (container[key]) {
            container.removeEventListener('click', container[key]);
        }
    });

    container._ammoCombinedHandler = function (e) {
        if (!container.contains(e.target)) return;

        const grenadeInc = e.target.closest('.grenade-qty-btn.grenade-increase');
        const grenadeDec = e.target.closest('.grenade-qty-btn.grenade-decrease');
        const ammoInc = e.target.closest('.ammo-qty-btn.ammo-increase');
        const ammoDec = e.target.closest('.ammo-qty-btn.ammo-decrease');
        const specInc = e.target.closest('.specialist-ammo-qty-btn.specialist-ammo-increase');
        const specDec = e.target.closest('.specialist-ammo-qty-btn.specialist-ammo-decrease');

        function findGrenadeByType(type) {
            if (!Array.isArray(GRENADES)) return null;
            return GRENADES.find(g => g.type === type) || null;
        }

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

        function findSpecialistAmmoByType(type) {
            if (!Array.isArray(SPECIALIST_AMMUNITION)) return null;
            return SPECIALIST_AMMUNITION.find(a => a.type === type) || null;
        }

        if (grenadeInc) {
            const type = grenadeInc.closest('[data-grenade]').getAttribute('data-grenade');
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
            renderAmmoCombinedStep(character, container, onUpdate);
            if (typeof onUpdate === 'function') onUpdate();
            return;
        }

        if (grenadeDec) {
            const type = grenadeDec.closest('[data-grenade]').getAttribute('data-grenade');
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
            renderAmmoCombinedStep(character, container, onUpdate);
            if (typeof onUpdate === 'function') onUpdate();
            return;
        }

        if (ammoInc) {
            const cellEl = ammoInc.closest('[data-ammo]');
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
            renderAmmoCombinedStep(character, container, onUpdate);
            if (typeof onUpdate === 'function') onUpdate();
            return;
        }

        if (ammoDec) {
            const cellEl = ammoDec.closest('[data-ammo]');
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
            renderAmmoCombinedStep(character, container, onUpdate);
            if (typeof onUpdate === 'function') onUpdate();
            return;
        }

        if (specInc) {
            const type = specInc.closest('[data-specialist-ammo]').getAttribute('data-specialist-ammo');
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
            renderAmmoCombinedStep(character, container, onUpdate);
            if (typeof onUpdate === 'function') onUpdate();
            return;
        }

        if (specDec) {
            const type = specDec.closest('[data-specialist-ammo]').getAttribute('data-specialist-ammo');
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
            renderAmmoCombinedStep(character, container, onUpdate);
            if (typeof onUpdate === 'function') onUpdate();
            return;
        }
    };

    container.addEventListener('click', container._ammoCombinedHandler);
}
