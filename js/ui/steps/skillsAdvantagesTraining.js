// Step 5: Skills
function renderSkillsStep(character, container, onUpdate) {
    let skillsHtml = '<div class=\"skills-container\">';
    for (const categoryKey in SKILLS) {
        const category = SKILLS[categoryKey];
        skillsHtml += '<div class=\"skill-category\"><div class=\"skill-category-header\"><span class=\"skill-category-title\">' + category.name + '</span><span class=\"skill-category-toggle\">▼</span></div><div class=\"skill-list\">';
        for (const skillName in category.skills) {
            const skillData = category.skills[skillName];
            const currentRank = character.skills[skillName] || 0;
            const maxRank = character.getSkillMaxRank(skillName);
            const raceData = RACES[character.race];
            const freeRank = raceData.freeSkills[skillName] || 0;
            skillsHtml += '<div class=\"skill-item\" data-skill=\"' + skillName + '\"><div class=\"skill-info\"><div class=\"skill-name\" title=\"' + (skillData.description || '') + '\">' + skillName + '</div><div class=\"skill-governing\">' + skillData.governingStat + ' • Max: ' + maxRank + '</div></div><div class=\"skill-rank\"><span class=\"skill-rank-value\">' + currentRank + '</span><div class=\"skill-rank-controls\"><button class=\"skill-rank-btn skill-increase\">▲</button><button class=\"skill-rank-btn skill-decrease\">▼</button></div></div></div>';
        }
        skillsHtml += '</div></div>';
    }
    skillsHtml += '</div>';
    container.innerHTML = '<div class=\"section-header\"><h2 class=\"section-title\">Step 5: Allocate Skills</h2><p class=\"section-description\">Your race provides free skills.</p></div>' + skillsHtml + '<div class=\"info-box\" style=\"margin-top:20px\"><h4>Skill Costs</h4><p>• Rank 1: 1 point • Rank 2: 2 points • Rank 3: 3 points...<br>• Total cost for rank N: N × (N + 1) ÷ 2</p></div>';
    container.querySelectorAll('.skill-increase').forEach(btn => btn.addEventListener('click', () => { const skillName = btn.closest('[data-skill]').dataset.skill; const currentRank = character.skills[skillName] || 0; const maxRank = character.getSkillMaxRank(skillName); if (currentRank < maxRank) { character.skills[skillName] = currentRank + 1; renderSkillsStep(character, container, onUpdate); onUpdate(); } }));
    container.querySelectorAll('.skill-decrease').forEach(btn => btn.addEventListener('click', () => { const skillName = btn.closest('[data-skill]').dataset.skill; const currentRank = character.skills[skillName] || 0; if (currentRank > 0) { character.skills[skillName] = currentRank - 1; renderSkillsStep(character, container, onUpdate); onUpdate(); } }));
}

// Step 6: Advantages
function renderAdvantagesStep(character, container, onUpdate) {
    let advantagesHtml = '<div class=\"advantages-grid\">';
    for (const categoryKey in ADVANTAGES) {
        const category = ADVANTAGES[categoryKey];
        for (const advName in category.items) {
            const advData = category.items[advName];
            const isDisadvantage = advData.type === 'disadvantage';
            const currentRank = isDisadvantage ? (character.disadvantages[advName] || 0) : (character.advantages[advName] || 0);
            const isSelected = currentRank > 0;
            const points = (typeof advData.oneOffCost === 'number') ? advData.oneOffCost : (advData.costPerRank || 0) * currentRank;
            const pointsDisplay = points >= 0 ? '+' + points : points;
            advantagesHtml += '<div class=\"advantage-item ' + (isDisadvantage ? 'disadvantage' : '') + ' ' + (isSelected ? 'selected' : '') + '\" data-advantage=\"' + advName + '\" data-type=\"' + advData.type + '\" style=\"cursor:pointer\">' +
                '<div class=\"advantage-checkbox\">' + (isSelected ? '✓' : '') + '</div>' +
                '<div class=\"advantage-content\">' +
                    '<div class=\"advantage-name\">' + advData.name + '</div>' +
                    '<div class=\"advantage-description\">' + (advData.description || '') + '</div>' +
                    (isSelected ? 
                        '<div class=\"advantage-ranks\">' +
                            '<button class=\"advantage-rank-btn\" data-action=\"decrease\" ' + (currentRank <= 0 ? 'disabled' : '') + '>−</button>' +
                            '<span class=\"advantage-rank-value\">' + currentRank + '</span>' +
                            '<button class=\"advantage-rank-btn\" data-action=\"increase\" ' + (currentRank >= (advData.maxRank || 1) ? 'disabled' : '') + '>+</button>' +
                            '<span class=\"advantage-points ' + (isDisadvantage ? 'negative' : 'positive') + '\">' + pointsDisplay + ' pts</span>' +
                        '</div>'
                    : '') +
                '</div>' +
            '</div>';
        }
    }
    advantagesHtml += '</div>';
    container.innerHTML = '<div class=\"section-header\"><h2 class=\"section-title\">Step 6: Advantages & Disadvantages</h2><p class=\"section-description\">Select traits that modify your character. Advantages cost points; disadvantages give you points.</p></div>' + advantagesHtml;
    // Use event delegation on the container for advantage interactions (simpler and avoids duplicate listeners)
    // Remove any previous handler to prevent duplicates
    if (container._advEventHandler) {
        container.removeEventListener('click', container._advEventHandler);
        container._advEventHandler = null;
    }

    // Insert a selector for the Drug Addict disadvantage so the user can pick which drug they're addicted to.
    (function insertDrugAddictSelectors() {
        // Build options using DRUGS metadata
        const drugList = [];
        for (const catKey in DRUGS) {
            const cat = DRUGS[catKey];
            for (const d of (cat.drugs || [])) {
                if (d && d.name) drugList.push(d.name);
            }
        }

        const items = container.querySelectorAll('.advantage-item[data-advantage="drug_addict"]');
        if (!items.length) return;

        items.forEach(item => {
            const content = item.querySelector('.advantage-content');
            if (!content) return;
            // avoid inserting twice
            if (content.querySelector('.drug-addict-select')) return;

            const wrapper = document.createElement('div');
            wrapper.className = 'adv-drug-selector';
            wrapper.style.marginTop = '6px';
            wrapper.style.fontSize = '13px';

            const label = document.createElement('label');
            label.textContent = 'Addicted drug: ';
            label.style.marginRight = '6px';
            wrapper.appendChild(label);

            const select = document.createElement('select');
            select.className = 'drug-addict-select';
            select.setAttribute('data-adv', 'drug_addict');

            const emptyOpt = document.createElement('option');
            emptyOpt.value = '';
            emptyOpt.textContent = '-- none --';
            select.appendChild(emptyOpt);

            drugList.forEach(name => {
                const opt = document.createElement('option');
                opt.value = name;
                opt.textContent = name;
                select.appendChild(opt);
            });

            // populate current selection if present
            const current = (character.disadvantages && character.disadvantages.drug_addict_drug) || '';
            if (current) select.value = current;

            // Prevent clicks on the selector from toggling the parent advantage item
            select.addEventListener('click', e => e.stopPropagation());
            select.addEventListener('mousedown', e => e.stopPropagation());

            select.addEventListener('change', () => {
                if (!character.disadvantages) character.disadvantages = {};
                if (select.value) character.disadvantages.drug_addict_drug = select.value;
                else delete character.disadvantages.drug_addict_drug;
                if (typeof onUpdate === 'function') onUpdate();
            });

            wrapper.appendChild(select);
            content.appendChild(wrapper);
        });
    })();

    // helper: find advData by name
    function findAdvDataByName(name) {
        for (const catKey in ADVANTAGES) {
            if (ADVANTAGES[catKey].items && ADVANTAGES[catKey].items[name]) {
                return ADVANTAGES[catKey].items[name];
            }
        }
        return null;
    }

    container._advEventHandler = function (e) {
        const btn = e.target.closest && e.target.closest('.advantage-rank-btn');
        const item = e.target.closest && e.target.closest('.advantage-item');
        if (!item) return;

        const advName = item.dataset.advantage;
        const isDisadvantage = item.dataset.type === 'disadvantage';

        // If a rank button was clicked
        if (btn) {
            e.stopPropagation();
            const action = btn.dataset.action;
            const advData = findAdvDataByName(advName);
            if (!advData) return;
            const maxRank = advData.maxRank || 1;

            if (action === 'increase') {
                if (isDisadvantage) {
                    const current = character.disadvantages[advName] || 0;
                    if (current < maxRank) character.disadvantages[advName] = current + 1;
                } else {
                    const current = character.advantages[advName] || 0;
                    if (current < maxRank) character.advantages[advName] = current + 1;
                }
            } else if (action === 'decrease') {
                if (isDisadvantage) {
                    const current = character.disadvantages[advName] || 0;
                    if (current > 1) {
                        character.disadvantages[advName] = current - 1;
                    } else {
                        // removing disadvantage entirely
                        delete character.disadvantages[advName];
                        // if this disadvantage is the phobia placeholder, clear selected phobias
                        if (advData && advData.isPhobiaPlaceholder && Array.isArray(character.phobias) && character.phobias.length) {
                            character.phobias = [];
                        }
                    }
                } else {
                    const current = character.advantages[advName] || 0;
                    if (current > 1) character.advantages[advName] = current - 1;
                    else delete character.advantages[advName];
                }
            }

            renderAdvantagesStep(character, container, onUpdate);
            onUpdate();
            return;
        }

        // Otherwise toggle selection
        if (item) {
            const advDataToggle = findAdvDataByName(advName);

            if (isDisadvantage) {
                if (character.disadvantages[advName]) {
                    // deselecting disadvantage
                    delete character.disadvantages[advName];
                    // clear phobias if this was the phobia placeholder
                    if (advDataToggle && advDataToggle.isPhobiaPlaceholder && Array.isArray(character.phobias) && character.phobias.length) {
                        character.phobias = [];
                    }
                } else {
                    character.disadvantages[advName] = 1;
                }
            } else {
                if (character.advantages[advName]) delete character.advantages[advName];
                else character.advantages[advName] = 1;
            }
            renderAdvantagesStep(character, container, onUpdate);
            onUpdate();
        }
    };

    container.addEventListener('click', container._advEventHandler);
}
