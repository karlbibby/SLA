// Step 5: Skills
function renderSkillsStep(character, container, onUpdate) {
    if (!character.class) { container.innerHTML = '<div class="section-header"><h2 class="section-title">Step 5: Allocate Skills</h2></div><div class="info-box"><h4>Class Required</h4><p>Please select a class first.</p></div>'; return; }
    const classData = CLASSES[character.class];
    let skillsHtml = '<div class="skills-container">';
    for (const categoryKey in SKILLS) {
        const category = SKILLS[categoryKey];
        skillsHtml += '<div class="skill-category"><div class="skill-category-header"><span class="skill-category-title">' + category.name + '</span><span class="skill-category-toggle">▼</span></div><div class="skill-list">';
        for (const skillName in category.skills) {
            const skillData = category.skills[skillName];
            const currentRank = character.skills[skillName] || 0;
            const maxRank = character.getSkillMaxRank(skillName);
            const freeRank = classData.freeSkills[skillName] || 0;
            skillsHtml += '<div class="skill-item" data-skill="' + skillName + '"><div class="skill-info"><div class="skill-name" title="' + (skillData.description || '') + '">' + skillName + '</div><div class="skill-governing">' + skillData.governingStat + ' • Max: ' + maxRank + '</div></div><div class="skill-rank"><span class="skill-rank-value">' + currentRank + '</span><div class="skill-rank-controls"><button class="skill-rank-btn skill-increase">▲</button><button class="skill-rank-btn skill-decrease">▼</button></div></div></div>';
        }
        skillsHtml += '</div></div>';
    }
    skillsHtml += '</div>';
    container.innerHTML = '<div class="section-header"><h2 class="section-title">Step 5: Allocate Skills</h2><p class="section-description">Spend skill points on your abilities. Your class provides free skills. Skill ranks are limited by your governing statistics.</p></div>' + skillsHtml + '<div class="info-box" style="margin-top:20px"><h4>Skill Costs</h4><p>• Rank 1: 1 point • Rank 2: 2 points • Rank 3: 3 points...<br>• Total cost for rank N: N × (N + 1) ÷ 2</p></div>';
    container.querySelectorAll('.skill-increase').forEach(btn => btn.addEventListener('click', () => { const skillName = btn.closest('[data-skill]').dataset.skill; const currentRank = character.skills[skillName] || 0; const maxRank = character.getSkillMaxRank(skillName); if (currentRank < maxRank) { character.skills[skillName] = currentRank + 1; renderSkillsStep(character, container, onUpdate); onUpdate(); } }));
    container.querySelectorAll('.skill-decrease').forEach(btn => btn.addEventListener('click', () => { const skillName = btn.closest('[data-skill]').dataset.skill; const currentRank = character.skills[skillName] || 0; if (currentRank > 0) { character.skills[skillName] = currentRank - 1; renderSkillsStep(character, container, onUpdate); onUpdate(); } }));
}

// Step 6: Advantages
function renderAdvantagesStep(character, container, onUpdate) {
    let advantagesHtml = '<div class="advantages-grid">';
    for (const categoryKey in ADVANTAGES) {
        const category = ADVANTAGES[categoryKey];
        for (const advName in category.items) {
            const advData = category.items[advName];
            const isDisadvantage = advData.type === 'disadvantage';
            const currentRank = isDisadvantage ? (character.disadvantages[advName] || 0) : (character.advantages[advName] || 0);
            const isSelected = currentRank > 0;
            const points = isDisadvantage ? Math.abs(advData.basePoints * currentRank) : advData.basePoints * currentRank;
            const pointsDisplay = points >= 0 ? '+' + points : points;
            advantagesHtml += '<div class="advantage-item ' + (isDisadvantage ? 'disadvantage' : '') + ' ' + (isSelected ? 'selected' : '') + '" data-advantage="' + advName + '" data-type="' + advData.type + '" style="cursor:pointer"><div class="advantage-checkbox">' + (isSelected ? '✓' : '') + '</div><div class="advantage-content"><div class="advantage-name">' + advName + '</div><div class="advantage-description">' + (advData.description || '') + '</div>' + (isSelected ? '<div class="advantage-ranks"><span class="advantage-rank-value">' + currentRank + '</span><span class="advantage-points ' + (isDisadvantage ? 'negative' : 'positive') + '">' + pointsDisplay + ' pts</span></div>' : '') + '</div></div>';
        }
    }
    advantagesHtml += '</div>';
    container.innerHTML = '<div class="section-header"><h2 class="section-title">Step 6: Advantages & Disadvantages</h2><p class="section-description">Select traits that modify your character. Advantages cost points; disadvantages give you points.</p></div>' + advantagesHtml;
    container.querySelectorAll('.advantage-item').forEach(item => item.addEventListener('click', () => {
        const advName = item.dataset.advantage;
        const isDisadvantage = item.dataset.type === 'disadvantage';
        if (isDisadvantage) { if (character.disadvantages[advName]) delete character.disadvantages[advName]; else character.disadvantages[advName] = 1; }
        else { if (character.advantages[advName]) delete character.advantages[advName]; else character.advantages[advName] = 1; }
        renderAdvantagesStep(character, container, onUpdate); onUpdate();
    }));
}

// Step 7: Training
function renderTrainingStep(character, container, onUpdate) {
    if (!character.class) { container.innerHTML = '<div class="section-header"><h2 class="section-title">Step 7: Training Packages</h2></div><div class="info-box"><h4>Class Required</h4><p>Please select a class first.</p></div>'; return; }
    let packagesHtml = '<div class="grid-2">';
    for (const packageName in TRAINING_PACKAGES) {
        const packageData = TRAINING_PACKAGES[packageName];
        const isSelected = character.trainingPackages.includes(packageName);
        let skillsHtml = '';
        for (const skill in packageData.skills) { skillsHtml += '<span class="skill-tag">' + skill + ' (' + packageData.skills[skill] + ')</span>'; }
        packagesHtml += '<div class="card ' + (isSelected ? 'selected' : '') + '" data-package="' + packageName + '" style="cursor:pointer"><div class="card-header"><div class="card-title">' + packageData.name + '</div><div class="card-subtitle">' + packageData.points + ' points</div></div><div class="card-description">' + packageData.description + '</div><div style="margin-top:10px"><strong>Skills:</strong><br>' + skillsHtml + '</div></div>';
    }
    packagesHtml += '</div>';
    container.innerHTML = '<div class="section-header"><h2 class="section-title">Step 7: Training Packages</h2><p class="section-description">Select pre-built skill packages representing your character\'s background training.</p></div>' + packagesHtml + '<div class="info-box" style="margin-top:20px"><h4>Training Points</h4><p>Each training package costs points but provides multiple skills at once.</p></div>';
    container.querySelectorAll('[data-package]').forEach(card => card.addEventListener('click', () => {
        const packageName = card.dataset.package;
        const index = character.trainingPackages.indexOf(packageName);
        if (index > -1) character.trainingPackages.splice(index, 1);
        else character.trainingPackages.push(packageName);
        renderTrainingStep(character, container, onUpdate); onUpdate();
    }));
}
