// SLA Industries Character Generator - Wizard Controller (Modular)
const WIZARD = {
    currentStep: 0,
    steps: [
        { name: 'Basic Info', key: 'basicInfo' },
        { name: 'Race', key: 'race' },
        { name: 'Statistics', key: 'stats' },
        { name: 'Advantages', key: 'advantages' },
        { name: 'Phobias', key: 'phobias' },
        { name: 'Skills', key: 'skills' },
        { name: 'Ebon Abilities', key: 'ebon' },
        { name: 'Drugs', key: 'drugs' },
        { name: 'Armaments', key: 'armaments' },
        { name: 'Armour', key: 'armour' },
        { name: 'Weapons', key: 'weapons' },
        { name: 'Grenades', key: 'grenades' },
        { name: 'Ammunition', key: 'ammunition' },
        { name: 'Specialist Ammo', key: 'specialistAmmo' },
        { name: 'Equipment', key: 'equipment' },
        { name: 'Vehicles', key: 'vehicles' },
        { name: 'Summary', key: 'summary' }
    ],

    init(character, onUpdate) {
        this.character = character;
        this.onUpdate = () => {
            this.updatePointsDisplay();
            onUpdate();
        };
        this.renderStepIndicators();
        this.renderCurrentStep();
        this.updateNavigation();
    },

    goToStep(stepIndex) {
        if (stepIndex >= 0 && stepIndex < this.steps.length) {
            this.currentStep = stepIndex;
            this.renderStepIndicators();
            this.renderCurrentStep();
            this.updateNavigation();
        }
    },

    nextStep() {
        if (this.currentStep >= this.steps.length - 1) return;

        // Validate phobias step before advancing
        const stepKey = this.steps[this.currentStep].key;
        if (stepKey === 'phobias') {
            const selected = (this.character.phobias || []).map(p => p.name);
            const max = (typeof PHOBIA_RULES !== 'undefined' && PHOBIA_RULES.max_at_creation) ? PHOBIA_RULES.max_at_creation : 3;
            if (selected.length > max) {
                if (typeof UI !== 'undefined' && UI.showToast) UI.showToast(`You may select up to ${max} phobias.`, 'error');
                return;
            }
            if (PHOBIA_RULES && Array.isArray(PHOBIA_RULES.conflicting_pairs)) {
                for (const pair of PHOBIA_RULES.conflicting_pairs) {
                    if (selected.includes(pair[0]) && selected.includes(pair[1])) {
                        if (typeof UI !== 'undefined' && UI.showToast) UI.showToast(`Conflicting phobias selected: ${pair[0]} and ${pair[1]}`, 'error');
                        return;
                    }
                }
            }
        }

        this.goToStep(this.currentStep + 1);
    },

    prevStep() {
        if (this.currentStep > 0) {
            this.goToStep(this.currentStep - 1);
        }
    },

    renderStepIndicators() {
        const container = document.getElementById('stepIndicators');
        container.innerHTML = '';
        const stepNames = ['1. Basics', '2. Race', '3. Stats', '4. Adv/Dis', '5. Phobias', '6. Skills', '7. Flux', '8. Drugs', '9. Armaments', '10. Armour', '11. Weapons', '12. Grenades', '13. Ammunition', '14. Specialist Ammo', '15. Equipment', '16. Vehicles', '17. Summary'];
        this.steps.forEach((step, index) => {
            const indicator = document.createElement('div');
            indicator.className = 'step-indicator' + (index === this.currentStep ? ' active' : '') + (index < this.currentStep ? ' completed' : '');
            indicator.textContent = stepNames[index] || step.name;
            indicator.addEventListener('click', () => this.goToStep(index));
            container.appendChild(indicator);
        });
        document.getElementById('progressFill').style.width = (this.currentStep / (this.steps.length - 1) * 100) + '%';
    },

    updateNavigation() {
        document.getElementById('prevStepBtn').disabled = this.currentStep === 0;
        document.getElementById('nextStepBtn').textContent = this.currentStep === this.steps.length - 1 ? 'Finish' : 'Next →';
    },

    updatePointsDisplay() {
        const points = this.character.getAvailablePoints();
        const pointsEl = document.getElementById('pointsAvailable');
        pointsEl.textContent = points;
        pointsEl.style.color = points < 0 ? 'var(--color-error)' : 'var(--color-primary)';

        // Update credits display in footer (if present)
        const creditsEl = document.getElementById('creditsAvailable');
        if (creditsEl) {
            const credits = (typeof this.character.credits !== 'undefined') ? this.character.credits : (this.character.startingCredits || 1500);
            creditsEl.textContent = credits;
            creditsEl.style.color = (credits < 0) ? 'var(--color-error)' : 'inherit';
        }
    },

    renderCurrentStep() {
        const container = document.getElementById('mainContent');
        this.updatePointsDisplay();
        const stepKey = this.steps[this.currentStep].key;

        // If the phobias step is reached but the character hasn't selected the phobia placeholder,
        // skip the phobias step automatically.
        if (stepKey === 'phobias') {
            const showPhobias = !!(this.character && this.character.disadvantages && this.character.disadvantages.phobia);
            if (!showPhobias) {
                // advance to next step
                if (this.currentStep < this.steps.length - 1) {
                    this.currentStep++;
                    this.renderStepIndicators();
                    this.updateNavigation();
                    return this.renderCurrentStep();
                }
            }
        }

        // Skip Ebon/Flux step for non-flux races
        if (stepKey === 'ebon') {
            const isFlux = this.character && typeof this.character.isFluxUser === 'function' && this.character.isFluxUser();
            if (!isFlux) {
                if (this.currentStep < this.steps.length - 1) {
                    this.currentStep++;
                    this.renderStepIndicators();
                    this.updateNavigation();
                    return this.renderCurrentStep();
                }
            }
        }
        
        switch (stepKey) {
            case 'basicInfo': renderBasicInfoStep(this.character, container, this.onUpdate); break;
            case 'race': renderRaceStep(this.character, container, this.onUpdate); break;
            case 'stats': renderStatsStep(this.character, container, this.onUpdate); break;
            case 'skills': renderSkillsStep(this.character, container, this.onUpdate); break;
            case 'advantages': renderAdvantagesStep(this.character, container, this.onUpdate); break;
            case 'ebon': renderEbonStep(this.character, container, this.onUpdate); break;
            case 'drugs': renderDrugsStep(this.character, container, this.onUpdate); break;
            case 'armaments': renderArmamentsStep(this.character, container, this.onUpdate); break;
            case 'armour': renderArmourStep(this.character, container, this.onUpdate); break;
            case 'weapons': renderWeaponsStep(this.character, container, this.onUpdate); break;
            case 'grenades': renderGrenadesStep(this.character, container, this.onUpdate); break;
            case 'ammunition': renderAmmunitionStep(this.character, container, this.onUpdate); break;
            case 'specialistAmmo': renderSpecialistAmmunitionStep(this.character, container, this.onUpdate); break;
            case 'equipment': renderEquipmentStep(this.character, container, this.onUpdate); break;
            case 'vehicles': renderVehiclesStep(this.character, container, this.onUpdate); break;
            case 'phobias': renderPhobiasStep(this.character, container, this.onUpdate); break;
            case 'summary': renderSummaryStep(this.character, container, this.onUpdate); break;
        }
    }
};
