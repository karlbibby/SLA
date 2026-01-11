// SLA Industries Character Generator - UI Components

const UI = {
    // Create a race card element
    createRaceCard(raceId, raceData, isSelected, onClick) {
        const card = document.createElement('div');
        card.className = `card ${isSelected ? 'selected' : ''}`;
        card.dataset.raceId = raceId;
        
        const statMaxes = raceData.statMaximums;
        let statSummary = '';
        for (const stat in statMaxes) {
            statSummary += `${stat}: ${statMaxes[stat].max} `;
        }

        card.innerHTML = `
            <div class="card-header">
                <div>
                    <div class="card-title">${raceData.name}</div>
                    <div class="card-subtitle">Flux User: ${raceData.fluxUser ? 'Yes' : 'No'}</div>
                </div>
            </div>
            <div class="card-description">${raceData.description}</div>
            <div class="form-hint" style="margin-top: 10px;">Stat Maxes: ${statSummary}</div>
            <div class="form-hint">${raceData.special}</div>
        `;

        card.addEventListener('click', () => onClick(raceId));
        return card;
    },

    // Create a class card element
    createClassCard(classId, classData, isSelected, onClick) {
        const card = document.createElement('div');
        card.className = `card ${isSelected ? 'selected' : ''}`;
        card.dataset.classId = classId;

        let freeSkillsHtml = '';
        for (const skill in classData.freeSkills) {
            freeSkillsHtml += `<span class="skill-tag">${skill} (${classData.freeSkills[skill]})</span>`;
        }

        card.innerHTML = `
            <div class="card-header">
                <div class="card-title">${classData.name}</div>
                <div class="card-subtitle">SCL ${classData.scl} • ${classData.skillPoints} skill points</div>
            </div>
            <div class="card-description">${classData.description}</div>
            <div style="margin-top: 10px;">
                <strong>Free Skills:</strong><br>
                ${freeSkillsHtml}
            </div>
            <div class="form-hint" style="margin-top: 10px;">${classData.special}</div>
        `;

        card.addEventListener('click', () => onClick(classId));
        return card;
    },

    // Create a stat row element
    createStatRow(statName, value, canIncrease, canDecrease, maxValue, onIncrease, onDecrease) {
        const row = document.createElement('div');
        row.className = 'stat-row';
        row.dataset.stat = statName;

        row.innerHTML = `
            <span class="stat-label">${statName}</span>
            <span class="stat-value">${value}</span>
            <div class="stat-controls">
                <button class="stat-btn" data-action="decrease" ${!canDecrease ? 'disabled' : ''}>−</button>
                <button class="stat-btn" data-action="increase" ${!canIncrease ? 'disabled' : ''}>+</button>
            </div>
            <span class="stat-max">Max: ${maxValue}</span>
        `;

        row.querySelector('[data-action="decrease"]').addEventListener('click', () => onDecrease());
        row.querySelector('[data-action="increase"]').addEventListener('click', () => onIncrease());

        return row;
    },

    // Create a skill item element
    createSkillItem(skillName, skillData, rank, maxRank, onIncrease, onDecrease) {
        const item = document.createElement('div');
        item.className = 'skill-item';
        item.dataset.skill = skillName;

        const cost = rank > 0 ? (rank * (rank + 1)) / 2 : 0;
        const currentCost = ((rank + 1) * (rank + 2)) / 2 - rank;
        const decreaseCost = rank > 0 ? ((rank - 1) * rank) / 2 : 0;

        item.innerHTML = `
            <div class="skill-info">
                <div class="skill-name" title="${skillData.description}">${skillName}</div>
                <div class="skill-governing">${skillData.governingStat} • Max: ${maxRank}</div>
            </div>
            <div class="skill-rank">
                <span class="skill-rank-value">${rank}</span>
                <div class="skill-rank-controls">
                    <button class="skill-rank-btn" data-action="increase" ${rank >= maxRank ? 'disabled' : ''}>▲</button>
                    <button class="skill-rank-btn" data-action="decrease" ${rank <= 0 ? 'disabled' : ''}>▼</button>
                </div>
            </div>
        `;

        item.querySelector('[data-action="increase"]').addEventListener('click', () => onIncrease());
        item.querySelector('[data-action="decrease"]').addEventListener('click', () => onDecrease());

        return item;
    },

    // Create an advantage item element
    createAdvantageItem(advName, advData, rank, isSelected, onToggle, onIncrease, onDecrease) {
        const item = document.createElement('div');
        item.className = `advantage-item ${advData.type === 'disadvantage' ? 'disadvantage' : ''} ${isSelected ? 'selected' : ''}`;
        item.dataset.advantage = advName;

        const points = advData.basePoints * (rank || 0);
        const pointsDisplay = points >= 0 ? `+${points}` : points;

        item.innerHTML = `
            <div class="advantage-checkbox">${isSelected ? '✓' : ''}</div>
            <div class="advantage-content">
                <div class="advantage-name">${advName}</div>
                <div class="advantage-description">${advData.description}</div>
                ${isSelected ? `
                <div class="advantage-ranks">
                    <button class="advantage-rank-btn" data-action="decrease" ${rank <= 0 ? 'disabled' : ''}>−</button>
                    <span class="advantage-rank-value">${rank}</span>
                    <button class="advantage-rank-btn" data-action="increase" ${rank >= advData.maxRank ? 'disabled' : ''}>+</button>
                    <span class="advantage-points ${advData.type === 'disadvantage' ? 'negative' : 'positive'}">${pointsDisplay} pts</span>
                </div>
                ` : ''}
            </div>
        `;

        item.addEventListener('click', (e) => {
            if (!e.target.classList.contains('advantage-rank-btn')) {
                onToggle();
            }
        });

        const decreaseBtn = item.querySelector('[data-action="decrease"]');
        const increaseBtn = item.querySelector('[data-action="increase"]');

        if (decreaseBtn) {
            decreaseBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                onDecrease();
            });
        }

        if (increaseBtn) {
            increaseBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                onIncrease();
            });
        }

        return item;
    },

    // Create a training package card
    createTrainingPackageCard(packageName, packageData, isSelected, onToggle) {
        const card = document.createElement('div');
        card.className = `card ${isSelected ? 'selected' : ''}`;
        card.dataset.package = packageName;

        let skillsHtml = '';
        for (const skill in packageData.skills) {
            skillsHtml += `<span class="skill-tag">${skill} (${packageData.skills[skill]})</span>`;
        }

        card.innerHTML = `
            <div class="card-header">
                <div class="card-title">${packageData.name}</div>
                <div class="card-subtitle">${packageData.points} points</div>
            </div>
            <div class="card-description">${packageData.description}</div>
            <div style="margin-top: 10px;">
                <strong>Skills:</strong><br>
                ${skillsHtml}
            </div>
        `;

        card.addEventListener('click', () => onToggle(packageName));
        return card;
    },

    // Create an equipment item element
    createEquipmentItem(equipment, isSelected, onToggle) {
        const item = document.createElement('div');
        item.className = `equipment-item ${isSelected ? 'selected' : ''}`;
        item.dataset.equipment = equipment;

        // Get equipment icon based on type
        let icon = '🔧';
        if (equipment.includes('Pistol') || equipment.includes('Rifle') || equipment.includes('Shotgun')) {
            icon = '🔫';
        } else if (equipment.includes('Armor') || equipment.includes('Suit')) {
            icon = '🛡️';
        } else if (equipment.includes('Knife') || equipment.includes('Sword')) {
            icon = '⚔️';
        } else if (equipment.includes('Grenade') || equipment.includes('Explosive')) {
            icon = '💣';
        }

        item.innerHTML = `
            <div class="equipment-icon">${icon}</div>
            <div class="equipment-info">
                <div class="equipment-name">${equipment}</div>
            </div>
            <div class="advantage-checkbox" style="width: 24px; height: 24px;">${isSelected ? '✓' : ''}</div>
        `;

        item.addEventListener('click', () => onToggle(equipment));
        return item;
    },

    // Create an Ebon ability item
    createEbonAbilityItem(abilityName, abilityData, isSelected, onToggle) {
        const item = document.createElement('div');
        item.className = `equipment-item ${isSelected ? 'selected' : ''}`;
        item.dataset.ability = abilityName;

        item.innerHTML = `
            <div class="equipment-icon">✨</div>
            <div class="equipment-info">
                <div class="equipment-name">${abilityName}</div>
                <div class="equipment-stats">Flux Cost: ${abilityData.fluxCost} • ${abilityData.category}</div>
                <div class="equipment-stats">${abilityData.description}</div>
            </div>
            <div class="advantage-checkbox" style="width: 24px; height: 24px;">${isSelected ? '✓' : ''}</div>
        `;

        item.addEventListener('click', () => onToggle(abilityName));
        return item;
    },

    // Create step indicator
    createStepIndicator(stepIndex, stepName, isActive, isCompleted, onClick) {
        const indicator = document.createElement('div');
        indicator.className = `step-indicator ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`;
        indicator.dataset.step = stepIndex;
        indicator.textContent = stepName;
        indicator.title = stepName;
        indicator.addEventListener('click', () => onClick(stepIndex));
        return indicator;
    },

    // Create toast notification
    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast active ${type}`;

        setTimeout(() => {
            toast.classList.remove('active');
        }, 3000);
    },

    // Create modal
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
        }
    },

    // Close modal
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
        }
    },

    // Format points display
    formatPoints(points) {
        return points >= 0 ? `+${points}` : points;
    },

    // Get skill cost for a rank
    getSkillCost(rank) {
        if (rank <= 0) return 0;
        return (rank * (rank + 1)) / 2;
    }
};

// Make closeModal globally available
window.closeModal = function(modalId) {
    UI.closeModal(modalId);
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UI;
}
