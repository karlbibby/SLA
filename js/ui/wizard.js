// SLA Industries Character Generator - Wizard Controller (Modular)
const WIZARD = {
    currentStep: 0,
    steps: [
        { name: 'Basic Info', key: 'basicInfo' },
        { name: 'Race', key: 'race' },
        { name: 'Class', key: 'class' },
        { name: 'Statistics', key: 'stats' },
        { name: 'Skills', key: 'skills' },
        { name: 'Advantages', key: 'advantages' },
        { name: 'Training', key: 'training' },
        { name: 'Ebon Abilities', key: 'ebon' },
        { name: 'Equipment', key: 'equipment' },
        { name: 'Drugs', key: 'drugs' },
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
        if (this.currentStep < this.steps.length - 1) {
            this.goToStep(this.currentStep + 1);
        }
    },

    prevStep() {
        if (this.currentStep > 0) {
            this.goToStep(this.currentStep - 1);
        }
    },

    renderStepIndicators() {
        const container = document.getElementById('stepIndicators');
        container.innerHTML = '';
        const stepNames = ['1. Basics', '2. Race', '3. Class', '4. Stats', '5. Skills', '6. Adv/Dis', '7. Training', '8. Flux', '9. Equipment', '10. Drugs', '11. Summary'];
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
    },

    renderCurrentStep() {
        const container = document.getElementById('mainContent');
        this.updatePointsDisplay();
        const stepKey = this.steps[this.currentStep].key;
        
        switch (stepKey) {
            case 'basicInfo': renderBasicInfoStep(this.character, container, this.onUpdate); break;
            case 'race': renderRaceStep(this.character, container, this.onUpdate); break;
            case 'class': renderClassStep(this.character, container, this.onUpdate); break;
            case 'stats': renderStatsStep(this.character, container, this.onUpdate); break;
            case 'skills': renderSkillsStep(this.character, container, this.onUpdate); break;
            case 'advantages': renderAdvantagesStep(this.character, container, this.onUpdate); break;
            case 'training': renderTrainingStep(this.character, container, this.onUpdate); break;
            case 'ebon': renderEbonStep(this.character, container, this.onUpdate); break;
            case 'equipment': renderEquipmentStep(this.character, container, this.onUpdate); break;
            case 'drugs': renderDrugsStep(this.character, container, this.onUpdate); break;
            case 'summary': renderSummaryStep(this.character, container, this.onUpdate); break;
        }
    }
};
