/**
 * Step 12: Equipment
 * - renderEquipmentStep(character, container, onUpdate)
 */

function formatEquipmentCost(item) {
	if (!item || typeof item.cost !== 'number') return 'n/a';
	const currency = item.costCurrency === 'u' ? 'u' : 'c';
	const prefix = item.costPrefix || '';
	const suffix = item.costSuffix || '';
	return prefix + item.cost + currency + suffix;
}

function formatEquipmentBlackMarketCost(item) {
	if (!item || typeof item.blackMarketCost !== 'number') return '—';
	const currency = item.blackMarketCurrency === 'c' ? 'c' : 'u';
	const prefix = item.blackMarketPrefix || '';
	const suffix = item.blackMarketSuffix || '';
	return prefix + item.blackMarketCost + currency + suffix;
}

function getEquipmentCostCredits(item) {
	if (!item || typeof item.cost !== 'number') return null;
	if (item.costCurrency === 'u') return item.cost / 10;
	return item.cost;
}

function renderEquipmentStep(character, container, onUpdate) {
	if (typeof sectionHeader !== 'function' || typeof escapeHtml !== 'function') {
		container.innerHTML = '<div class="info-box">Missing utilities for Equipment step.</div>';
		return;
	}

	character.equipmentInventory = character.equipmentInventory || {};

	const items = (Array.isArray(EQUIPMENT) ? EQUIPMENT.slice() : []).filter(item => !item.hidden);

	let html = sectionHeader('Step 12: Equipment', 'Purchase equipment using your available credits.');
	html += '<div class="equipment-container">';
	html += '<div class="equipment-table">';
	html += '<div class="equipment-header">' +
		'<div>Type</div><div>Cost</div><div>Black Market</div><div>Max. Weight</div><div>Range</div><div>User Life</div><div>Qty</div>' +
		'</div>';

	items.forEach(item => {
		const qty = character.equipmentInventory[item.type] || 0;
		const lockedQty = (character.lockedInventory && character.lockedInventory.equipment && character.lockedInventory.equipment[item.type]) || 0;
		const costCredits = getEquipmentCostCredits(item);
		const canPurchase = typeof costCredits === 'number';
		html += '<div class="equipment-row" data-equipment="' + escapeHtml(item.type) + '">' +
			'<div class="equipment-type">' + escapeHtml(item.type) + '</div>' +
			'<div class="equipment-cost">' + escapeHtml(formatEquipmentCost(item)) + '</div>' +
			'<div class="equipment-black-market">' + escapeHtml(formatEquipmentBlackMarketCost(item)) + '</div>' +
			'<div>' + escapeHtml(item.maxWeight) + '</div>' +
			'<div>' + escapeHtml(item.range) + '</div>' +
			'<div>' + escapeHtml(item.userLife) + '</div>' +
			'<div class="equipment-qty">' +
				'<button class="equipment-qty-btn equipment-decrease" ' + (qty <= lockedQty ? 'disabled' : '') + '>−</button>' +
				'<span class="equipment-qty-value">' + escapeHtml(String(qty)) + '</span>' +
				'<button class="equipment-qty-btn equipment-increase" ' + (!canPurchase ? 'disabled' : '') + '>+</button>' +
			'</div>' +
		'</div>';
	});

	html += '</div></div>';

	container.innerHTML = html;

	if (container._equipmentHandler) {
		container.removeEventListener('click', container._equipmentHandler);
	}
	container._equipmentHandler = function (e) {
		if (!container.contains(e.target)) return;

		const inc = e.target.closest('.equipment-qty-btn.equipment-increase');
		const dec = e.target.closest('.equipment-qty-btn.equipment-decrease');

		function findEquipmentByType(type) {
			if (!Array.isArray(EQUIPMENT)) return null;
			return EQUIPMENT.find(a => a.type === type) || null;
		}

		function getLockedEquipmentQty(type) {
			if (!character.lockedInventory || !character.lockedInventory.equipment) return 0;
			return character.lockedInventory.equipment[type] || 0;
		}

		if (inc) {
			const type = inc.closest('[data-equipment]').getAttribute('data-equipment');
			const item = findEquipmentByType(type);
			const price = getEquipmentCostCredits(item);
			if (typeof price !== 'number') return;
			character.credits = (typeof character.credits !== 'undefined') ? character.credits : 0;
			if (price > 0 && character.credits < price) {
				alert('Insufficient credits to purchase ' + type + ' (' + price + 'c).');
				return;
			}
			if (price > 0) character.credits -= price;
			character.equipmentInventory[type] = (character.equipmentInventory[type] || 0) + 1;
			renderEquipmentStep(character, container, onUpdate);
			if (typeof onUpdate === 'function') onUpdate();
			return;
		}

		if (dec) {
			const type = dec.closest('[data-equipment]').getAttribute('data-equipment');
			const current = character.equipmentInventory[type] || 0;
			const lockedQty = getLockedEquipmentQty(type);
			if (current > lockedQty) {
				const item = findEquipmentByType(type);
				const price = getEquipmentCostCredits(item);
				character.equipmentInventory[type] = current - 1;
				if (typeof price === 'number' && price > 0) {
					character.credits = (typeof character.credits !== 'undefined') ? character.credits : 0;
					character.credits += price;
				}
			}
			renderEquipmentStep(character, container, onUpdate);
			if (typeof onUpdate === 'function') onUpdate();
			return;
		}
	};
	container.addEventListener('click', container._equipmentHandler);
}
