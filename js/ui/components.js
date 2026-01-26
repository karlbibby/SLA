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

/**
 * Render markdown to HTML with limited feature set (headings, bold, italic, lists, tables)
 * Sanitized against XSS attacks using DOMPurify
 * @param {string} markdown - Markdown text to render
 * @returns {string} Sanitized HTML
 */
function renderMarkdown(markdown) {
    if (!markdown || typeof markdown !== 'string') return '';
    
    try {
        // Use marked if available (browser), otherwise fallback to simple parsing
        if (typeof marked !== 'undefined' && marked.parse) {
            const html = marked.parse(markdown);
            // Sanitize with DOMPurify if available
            if (typeof DOMPurify !== 'undefined') {
                return DOMPurify.sanitize(html);
            }
            return html;
        } else {
            // Fallback: simple markdown-like parsing for environments without marked
            return simpleMarkdownParse(markdown);
        }
    } catch (error) {
        console.warn('Error rendering markdown:', error);
        return escapeHtml(markdown);
    }
}

/**
 * Simple markdown parsing fallback for limited feature set
 * Supports: headings (#, ##, ###), bold (**), italic (*), lists (-, *), code blocks
 */
function simpleMarkdownParse(text) {
    let html = escapeHtml(text);
    
    // Headings: ## Heading -> <h3>Heading</h3>
    html = html.replace(/^### (.*?)$/gm, '<h4 style="margin:6px 0 3px 0;font-weight:700">$1</h4>');
    html = html.replace(/^## (.*?)$/gm, '<h3 style="margin:8px 0 4px 0;font-weight:700">$1</h3>');
    html = html.replace(/^# (.*?)$/gm, '<h2 style="margin:10px 0 5px 0;font-weight:700">$1</h2>');
    
    // Bold: **text** -> <strong>text</strong>
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Italic: *text* -> <em>text</em>
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Line breaks: convert \n to <br>
    html = html.replace(/\n/g, '<br>');
    
    // Lists: - item -> indented item
    html = html.replace(/^- (.*?)$/gm, '&nbsp;&nbsp;• $1');
    
    return html;
}

/**
 * Escape HTML special characters to prevent XSS
 */
function escapeHtml(text) {
    if (!text || typeof text !== 'string') return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Make closeModal globally available
window.closeModal = function(modalId) {
    UI.closeModal(modalId);
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UI;
}
