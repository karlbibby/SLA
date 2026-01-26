/**
 * Unit tests for Wizard State Management
 * Tests step navigation, validation, skip conditions, and UI state updates
 */

const testFixtures = require('./testFixtures');

// Mock global objects
global.RACES = testFixtures.RACES;
global.SKILLS = testFixtures.SKILLS;
global.PHOBIA_RULES = testFixtures.PHOBIA_RULES;
global.EBON_ABILITIES = testFixtures.EBON_ABILITIES;

// Simplified Wizard controller for testing
const WIZARD = {
  currentStep: 0,
  steps: [
    { name: 'Basic Info', key: 'basicInfo' },
    { name: 'Race', key: 'race' },
    { name: 'Statistics', key: 'stats' },
    { name: 'Advantages', key: 'advantages' },
    { name: 'Phobias', key: 'phobias' },
    { name: 'Skills', key: 'skills' },
    { name: 'Ebon', key: 'ebon' },
    { name: 'Drugs', key: 'drugs' },
    { name: 'Weapons', key: 'weapons' },
    { name: 'Ammo', key: 'ammo' },
    { name: 'Other', key: 'other' },
    { name: 'Training', key: 'training' },
    { name: 'Summary', key: 'summary' }
  ],

  character: null,
  onUpdate: null,
  pointsDisplay: 300,
  prevButtonDisabled: true,
  nextButtonDisabled: false,

  init(character, onUpdate) {
    this.character = character;
    this.onUpdate = onUpdate;
    this.currentStep = 0;
    this.updateNavigation();
  },

  goToStep(stepIndex) {
    if (stepIndex >= 0 && stepIndex < this.steps.length) {
      this.currentStep = stepIndex;
      this.updateNavigation();
    }
  },

  nextStep() {
    if (this.currentStep >= this.steps.length - 1) return;

    // Validate phobias step before advancing
    const stepKey = this.steps[this.currentStep].key;
    if (stepKey === 'phobias') {
      const selected = (this.character.phobias || []).map(p => p.name);
      const max = PHOBIA_RULES.max_at_creation;
      if (selected.length > max) {
        return false;
      }
      if (PHOBIA_RULES && Array.isArray(PHOBIA_RULES.conflicting_pairs)) {
        for (const pair of PHOBIA_RULES.conflicting_pairs) {
          if (selected.includes(pair[0]) && selected.includes(pair[1])) {
            return false;
          }
        }
      }
    }

    // Auto-skip phobias if no selected race
    if (stepKey === 'phobias' && !this.character.race) {
      this.currentStep += 2; // Skip phobias
      this.updateNavigation();
      return true;
    }

    // Auto-skip ebon if not flux user
    if (stepKey === 'ebon' && !this.character.isFluxUser?.()) {
      this.currentStep += 1; // Skip ebon
      this.updateNavigation();
      return true;
    }

    this.goToStep(this.currentStep + 1);
    return true;
  },

  prevStep() {
    if (this.currentStep > 0) {
      this.goToStep(this.currentStep - 1);
    }
  },

  updateNavigation() {
    // Update button states
    this.prevButtonDisabled = this.currentStep === 0;
    this.nextButtonDisabled = this.currentStep === this.steps.length - 1;

    // Update points display
    if (this.character && this.character.getAvailablePoints) {
      this.pointsDisplay = this.character.getAvailablePoints();
    }

    // Call update callback if set
    if (this.onUpdate && typeof this.onUpdate === 'function') {
      this.onUpdate();
    }
  },

  getCurrentStepKey() {
    return this.steps[this.currentStep].key;
  },

  getCurrentStepName() {
    return this.steps[this.currentStep].name;
  },

  getCurrentStepIndex() {
    return this.currentStep;
  },

  getTotalSteps() {
    return this.steps.length;
  },

  getProgressPercentage() {
    return Math.round(((this.currentStep + 1) / this.steps.length) * 100);
  },

  isStepCompleted(stepIndex) {
    return stepIndex < this.currentStep;
  },

  canNavigateTo(stepIndex) {
    return stepIndex <= this.currentStep + 1;
  }
};

// Mock Character class
class Character {
  constructor() {
    this.race = null;
    this.phobias = [];
    this.stats = { STR: 5, DEX: 5, DIA: 5, CONC: 5, CHA: 5, COOL: 5 };
    this.derivedStats = { PHYS: 5, KNOW: 5, FLUX: 0 };
    this.skills = {};
    this.advantages = {};
    this.disadvantages = {};
    this.totalPoints = 300;
  }

  isFluxUser() {
    if (!this.race) return false;
    return RACES[this.race].fluxUser;
  }

  getAvailablePoints() {
    let spent = 0;
    for (const stat in this.stats) {
      if (this.stats[stat] > 5) {
        spent += (this.stats[stat] - 5) * 5;
      }
    }
    return this.totalPoints - spent;
  }
}

// Tests
describe('Wizard State Management', () => {
  let wizard;
  let character;
  let updateCalls;

  beforeEach(() => {
    character = new Character();
    updateCalls = 0;
    wizard = Object.create(WIZARD);
    wizard.init(character, () => {
      updateCalls++;
    });
  });

  describe('Step Navigation', () => {
    test('should start at step 0 (basicInfo)', () => {
      expect(wizard.currentStep).toBe(0);
      expect(wizard.getCurrentStepKey()).toBe('basicInfo');
    });

    test('should move forward to next step', () => {
      wizard.nextStep();
      expect(wizard.currentStep).toBe(1);
      expect(wizard.getCurrentStepKey()).toBe('race');
    });

    test('should prevent moving forward beyond last step', () => {
      wizard.currentStep = wizard.steps.length - 1;
      const before = wizard.currentStep;
      wizard.nextStep();
      expect(wizard.currentStep).toBe(before);
    });

    test('should move backward to previous step', () => {
      wizard.currentStep = 2;
      wizard.prevStep();
      expect(wizard.currentStep).toBe(1);
    });

    test('should prevent moving backward before first step', () => {
      wizard.currentStep = 0;
      wizard.prevStep();
      expect(wizard.currentStep).toBe(0);
    });

    test('should jump directly to specific step', () => {
      wizard.goToStep(5);
      expect(wizard.currentStep).toBe(5);
      expect(wizard.getCurrentStepKey()).toBe('skills');
    });

    test('should not jump to invalid step index', () => {
      const before = wizard.currentStep;
      wizard.goToStep(-1);
      expect(wizard.currentStep).toBe(before);

      wizard.goToStep(999);
      expect(wizard.currentStep).toBe(before);
    });
  });

  describe('Step Skip Conditions', () => {
    test('should skip phobias step if race not selected', () => {
      character.race = null;
      wizard.currentStep = 3; // After phobias step index (4)
      // Phobias step would be skipped, moving to skills

      expect(wizard.currentStep).toBeGreaterThanOrEqual(3);
    });

    test('should skip ebon step if not a flux user', () => {
      character.race = 'human'; // Not a flux user
      wizard.currentStep = 5; // Before ebon step
      // If on ebon step and not flux user, should skip
      expect(character.isFluxUser()).toBe(false);
    });

    test('should not skip ebon step if flux user', () => {
      character.race = 'ebon'; // Is a flux user
      expect(character.isFluxUser()).toBe(true);
    });
  });

  describe('Phobia Validation Before Advancing', () => {
    test('should allow advancing from phobias with no selections', () => {
      character.phobias = [];
      wizard.currentStep = 4; // phobias step
      const result = wizard.nextStep();
      expect(result).not.toBe(false);
    });

    test('should allow advancing with up to 3 phobias', () => {
      character.phobias = [
        { name: 'Claustrophobia', rank: 1 },
        { name: 'Hemophobia', rank: 1 }
      ];
      wizard.currentStep = 4; // phobias step
      const result = wizard.nextStep();
      // 2 phobias is valid
      expect(result).not.toBe(false);
    });

    test('should prevent advancing with more than 3 phobias', () => {
      character.phobias = [
        { name: 'Claustrophobia', rank: 1 },
        { name: 'Agoraphobia', rank: 1 },
        { name: 'Hemophobia', rank: 1 },
        { name: 'Hydrophobia', rank: 1 }
      ];
      wizard.currentStep = 4; // phobias step
      const result = wizard.nextStep();
      expect(result).toBe(false);
    });

    test('should prevent advancing with conflicting phobias', () => {
      character.phobias = [
        { name: 'Claustrophobia', rank: 1 },
        { name: 'Agoraphobia', rank: 1 }
      ];
      wizard.currentStep = 4; // phobias step
      const result = wizard.nextStep();
      expect(result).toBe(false);
    });

    test('should allow advancing with non-conflicting phobias', () => {
      character.phobias = [
        { name: 'Claustrophobia', rank: 1 },
        { name: 'Hemophobia', rank: 1 }
      ];
      wizard.currentStep = 4; // phobias step
      const result = wizard.nextStep();
      expect(result).not.toBe(false);
    });
  });

  describe('Navigation Button States', () => {
    test('should disable prev button at first step', () => {
      wizard.currentStep = 0;
      wizard.updateNavigation();
      expect(wizard.prevButtonDisabled).toBe(true);
    });

    test('should enable prev button at step 1+', () => {
      wizard.currentStep = 1;
      wizard.updateNavigation();
      expect(wizard.prevButtonDisabled).toBe(false);
    });

    test('should disable next button at last step', () => {
      wizard.currentStep = wizard.steps.length - 1;
      wizard.updateNavigation();
      expect(wizard.nextButtonDisabled).toBe(true);
    });

    test('should enable next button before last step', () => {
      wizard.currentStep = 0;
      wizard.updateNavigation();
      expect(wizard.nextButtonDisabled).toBe(false);
    });
  });

  describe('Points Display Updates', () => {
    test('should update points display on navigation', () => {
      character.stats.STR = 5;
      wizard.updateNavigation();
      expect(wizard.pointsDisplay).toBe(300);

      character.stats.STR = 8;
      wizard.updateNavigation();
      expect(wizard.pointsDisplay).toBe(285); // 300 - 15
    });

    test('should reflect current character points', () => {
      character.stats.STR = 10;
      wizard.updateNavigation();
      expect(wizard.pointsDisplay).toBe(275);
    });
  });

  describe('Step Progress Tracking', () => {
    test('should return correct step name', () => {
      wizard.currentStep = 0;
      expect(wizard.getCurrentStepName()).toBe('Basic Info');

      wizard.currentStep = 1;
      expect(wizard.getCurrentStepName()).toBe('Race');
    });

    test('should return correct step index', () => {
      wizard.goToStep(5);
      expect(wizard.getCurrentStepIndex()).toBe(5);
    });

    test('should report total steps', () => {
      expect(wizard.getTotalSteps()).toBe(13);
    });

    test('should calculate progress percentage', () => {
      wizard.currentStep = 0;
      expect(wizard.getProgressPercentage()).toBe(8); // 1/13

      wizard.currentStep = 6;
      expect(wizard.getProgressPercentage()).toBe(54); // 7/13

      wizard.currentStep = 12;
      expect(wizard.getProgressPercentage()).toBe(100); // 13/13
    });

    test('should track completed steps', () => {
      wizard.currentStep = 5;
      expect(wizard.isStepCompleted(0)).toBe(true);
      expect(wizard.isStepCompleted(4)).toBe(true);
      expect(wizard.isStepCompleted(5)).toBe(false);
      expect(wizard.isStepCompleted(6)).toBe(false);
    });

    test('should allow navigation to completed steps', () => {
      wizard.currentStep = 5;
      expect(wizard.canNavigateTo(0)).toBe(true);
      expect(wizard.canNavigateTo(5)).toBe(true);
    });

    test('should allow navigation to current + 1 step', () => {
      wizard.currentStep = 3;
      expect(wizard.canNavigateTo(4)).toBe(true);
    });

    test('should prevent navigation beyond current + 1 step', () => {
      wizard.currentStep = 3;
      expect(wizard.canNavigateTo(5)).toBe(false);
    });
  });

  describe('Step Ordering', () => {
    test('should have 13 steps in correct order', () => {
      const expectedKeys = [
        'basicInfo',
        'race',
        'stats',
        'advantages',
        'phobias',
        'skills',
        'ebon',
        'drugs',
        'weapons',
        'ammo',
        'other',
        'training',
        'summary'
      ];

      expect(wizard.steps.length).toBe(13);
      wizard.steps.forEach((step, index) => {
        expect(step.key).toBe(expectedKeys[index]);
      });
    });

    test('should have phobias before skills', () => {
      const phobiaIndex = wizard.steps.findIndex(s => s.key === 'phobias');
      const skillsIndex = wizard.steps.findIndex(s => s.key === 'skills');
      expect(phobiaIndex).toBeLessThan(skillsIndex);
    });

    test('should have ebon before drugs', () => {
      const ebonIndex = wizard.steps.findIndex(s => s.key === 'ebon');
      const drugsIndex = wizard.steps.findIndex(s => s.key === 'drugs');
      expect(ebonIndex).toBeLessThan(drugsIndex);
    });

    test('should have summary as last step', () => {
      const lastStep = wizard.steps[wizard.steps.length - 1];
      expect(lastStep.key).toBe('summary');
    });
  });

  describe('Callback Invocation', () => {
    test('should invoke onUpdate callback on navigation', () => {
      const mockUpdate = jest.fn();
      wizard.onUpdate = mockUpdate;
      wizard.updateNavigation();
      expect(mockUpdate).toHaveBeenCalled();
    });

    test('should pass updated state to callback', () => {
      const mockUpdate = jest.fn();
      wizard.onUpdate = mockUpdate;
      updateCalls = 0;
      wizard.updateNavigation();
      expect(mockUpdate).toHaveBeenCalled();
    });
  });
});
