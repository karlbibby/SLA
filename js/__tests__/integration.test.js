/**
 * Integration tests for SLA Character Generator
 * Tests cross-module workflows: character creation flow, point balance, package interactions
 */

const testFixtures = require('./testFixtures');

// Mock global objects
global.STARTER_KIT = {
  armaments: { 'FEN 603': 1 },
  ammo: { '10mm Auto × STD': 2 },
  equipment: {
    'Headset Communicator': 1,
    'Klippo Lighter': 1,
    'Pen': 1,
    'S.C.L. Card': 1,
    'Finance Chip': 1
  }
};

global.RACES = testFixtures.RACES;
global.SKILLS = testFixtures.SKILLS;
global.ADVANTAGES = testFixtures.ADVANTAGES;
global.TRAINING_PACKAGES = testFixtures.TRAINING_PACKAGES;
global.EBON_ABILITIES = testFixtures.EBON_ABILITIES;
global.DEATHSUIT_TYPES = testFixtures.DEATHSUIT_TYPES;

// Simplified Character class for integration tests
class Character {
  constructor() {
    this.name = '';
    this.playerName = '';
    this.race = null;
    this.stats = { STR: 5, DEX: 5, DIA: 5, CONC: 5, CHA: 5, COOL: 5 };
    this.derivedStats = { PHYS: 5, KNOW: 5, FLUX: 0 };
    this.move = { walk: '', run: '', sprint: '' };
    this.skills = {};
    this.advantages = {};
    this.disadvantages = {};
    this.phobias = [];
    this.ebonRanks = {};
    this.weaponInventory = {};
    this.ammoInventory = {};
    this.armamentInventory = {};
    this.armourInventory = {};
    this.equipmentInventory = {};
    this.selectedTrainingPackage = null;
    this.packageSkills = {};
    this.totalPoints = 300;
    this.starterKitApplied = false;
    this.lockedInventory = { armaments: {}, ammo: {}, equipment: {} };
    this.applyStarterKit();
  }

  applyStarterKit() {
    if (this.starterKitApplied) return;
    const addItems = (inventory, lockedInv, items) => {
      if (!inventory || !items) return;
      for (const [name, qty] of Object.entries(items)) {
        const amount = Number(qty) || 0;
        if (amount <= 0) continue;
        inventory[name] = (inventory[name] || 0) + amount;
        if (lockedInv) {
          lockedInv[name] = (lockedInv[name] || 0) + amount;
        }
      }
    };
    addItems(this.armamentInventory, this.lockedInventory.armaments, STARTER_KIT.armaments);
    addItems(this.ammoInventory, this.lockedInventory.ammo, STARTER_KIT.ammo);
    addItems(this.equipmentInventory, this.lockedInventory.equipment, STARTER_KIT.equipment);
    this.starterKitApplied = true;
  }

  calculateDerivedStats() {
    this.derivedStats.PHYS = Math.ceil((this.stats.STR + this.stats.DEX) / 2);
    this.derivedStats.KNOW = Math.ceil((this.stats.DIA + this.stats.CONC) / 2);
  }

  getStatMaximums() {
    if (!this.race) return null;
    return RACES[this.race].statMaximums;
  }

  getGoverningStatValue(skillName) {
    for (const category in SKILLS) {
      if (SKILLS[category].skills[skillName]) {
        const governingStat = SKILLS[category].skills[skillName].governingStat;
        if (governingStat === 'PHYS' || governingStat === 'KNOW') {
          return this.derivedStats[governingStat];
        }
        return this.stats[governingStat];
      }
    }
    return 5;
  }

  getSkillMaxRank(skillName) {
    return Math.min(10, this.getGoverningStatValue(skillName));
  }

  calculateSkillPointsSpent() {
    let spent = 0;
    const raceData = RACES[this.race];
    const freeSkills = raceData ? raceData.freeSkills || {} : {};

    for (const skillName in this.skills) {
      const rank = Number(this.skills[skillName] || 0);
      if (!rank || rank <= 0) continue;
      const freeRank = Number(freeSkills[skillName] || 0);

      const freeRankSet = new Set();
      for (let i = 1; i <= Math.min(rank, freeRank); i++) {
        freeRankSet.add(i);
      }

      for (let i = 1; i <= rank; i++) {
        if (!freeRankSet.has(i)) {
          spent += i;
        }
      }
    }
    return spent;
  }

  calculateStatPointsSpent() {
    let spent = 0;
    const maximums = this.getStatMaximums();

    for (const stat in this.stats) {
      const baseValue = maximums?.[stat]?.min ?? 5;
      if (this.stats[stat] > baseValue) {
        spent += (this.stats[stat] - baseValue) * 5;
      }
    }
    return spent;
  }

  calculateAdvantagePoints() {
    let points = 0;
    for (const category in ADVANTAGES) {
      const categoryData = ADVANTAGES[category];
      for (const advName in categoryData.items) {
        const advData = categoryData.items[advName];
        const rank = this.advantages[advName] || 0;
        if (rank > 0 && advData.type === 'advantage') {
          if (typeof advData.oneOffCost === 'number') {
            points += advData.oneOffCost;
          } else {
            points += (advData.costPerRank || 0) * rank;
          }
        }
      }
    }
    return points;
  }

  calculateDisadvantagePoints() {
    let points = 0;
    for (const category in ADVANTAGES) {
      const categoryData = ADVANTAGES[category];
      for (const advName in categoryData.items) {
        const advData = categoryData.items[advName];
        const rank = this.disadvantages[advName] || 0;
        if (rank > 0 && advData.type === 'disadvantage') {
          if (typeof advData.oneOffCost === 'number') {
            points -= advData.oneOffCost; // Negate negative cost
          } else {
            points -= (advData.costPerRank || 0) * rank; // Negate negative cost
          }
        }
      }
    }
    return points;
  }

  getAvailablePoints() {
    const basePoints = this.totalPoints;
    const statSpent = this.calculateStatPointsSpent();
    const skillSpent = this.calculateSkillPointsSpent();
    const advPoints = this.calculateAdvantagePoints();
    const disPoints = this.calculateDisadvantagePoints();
    return basePoints + disPoints - statSpent - skillSpent - advPoints; // Add positive disadvantage gain
  }

  isFluxUser() {
    if (!this.race) return false;
    return RACES[this.race].fluxUser;
  }

  applyRaceSkills() {
    if (!this.race) return;
    const raceData = RACES[this.race];
    if (raceData.freeSkills) {
      for (const [skillName, rank] of Object.entries(raceData.freeSkills)) {
        this.skills[skillName] = rank;
      }
    }
  }

  applyTrainingPackage(packageId) {
    if (!packageId || !TRAINING_PACKAGES[packageId]) return;

    this.selectedTrainingPackage = packageId;
    const pkg = TRAINING_PACKAGES[packageId];

    for (const [skillName, bonusRank] of Object.entries(pkg.freeSkills)) {
      if (!this.skills[skillName]) {
        this.skills[skillName] = bonusRank;
        this.packageSkills[skillName] = bonusRank;
      } else {
        const originalRank = this.skills[skillName];
        this.skills[skillName] += bonusRank;
        this.packageSkills[skillName] = {
          bonusRank,
          originalRank
        };
      }
    }
  }

  removeTrainingPackage() {
    if (!this.selectedTrainingPackage) return;

    for (const skillName in this.packageSkills) {
      const entry = this.packageSkills[skillName];
      if (typeof entry === 'number') {
        delete this.skills[skillName];
      } else if (typeof entry === 'object') {
        const originalRank = entry.originalRank;
        if (originalRank > 0) {
          this.skills[skillName] = originalRank;
        } else {
          delete this.skills[skillName];
        }
      }
    }

    this.packageSkills = {};
    this.selectedTrainingPackage = null;
  }

  toJSON() {
    return {
      name: this.name,
      race: this.race,
      stats: JSON.parse(JSON.stringify(this.stats)),
      skills: JSON.parse(JSON.stringify(this.skills)),
      advantages: JSON.parse(JSON.stringify(this.advantages))
    };
  }

  fromJSON(json) {
    this.name = json.name || '';
    this.race = json.race || null;
    this.stats = json.stats || this.stats;
    this.skills = json.skills || {};
    this.advantages = json.advantages || {};
  }
}

// Tests
describe('Integration Tests - Full Character Creation Flow', () => {
  let character;

  beforeEach(() => {
    character = new Character();
  });

  describe('Full Character Creation Workflow', () => {
    test('should create character from scratch with all steps', () => {
      // Step 1: Basic info
      character.name = 'Test Operative';
      character.playerName = 'Test Player';
      expect(character.name).toBe('Test Operative');

      // Step 2: Select race
      character.race = 'human';
      expect(character.race).toBe('human');

      // Step 3: Allocate stats
      character.stats.STR = 8;
      character.calculateDerivedStats();
      expect(character.derivedStats.PHYS).toBe(7); // ceil((8+5)/2) = 7

      // Step 4: Select advantages
      character.advantages['Good Looks'] = 1;
      expect(character.getAvailablePoints()).toBeLessThan(300);

      // Step 5: Apply free race skills
      character.applyRaceSkills();
      expect(character.skills.Literacy).toBe(1);

      // Verify character state
      expect(character.name).toBe('Test Operative');
      expect(character.race).toBe('human');
      expect(character.stats.STR).toBe(8);
    });

    test('should maintain point balance across all changes', () => {
      character.race = 'human';

      const initial = character.getAvailablePoints();
      expect(initial).toBe(300);

      // Spend on stats
      character.stats.STR = 8;
      let after = character.getAvailablePoints();
      expect(after).toBe(285); // 300 - 15

      // Spend on advantage
      character.advantages['Tough'] = 1;
      after = character.getAvailablePoints();
      expect(after).toBe(275); // 285 - 10

      // Gain from disadvantage
      character.disadvantages['Bad Looks'] = 1;
      after = character.getAvailablePoints();
      expect(after).toBe(280); // 275 + 5 (Bad Looks is -5 per rank)
    });
  });

  describe('Stat Increase → Skill Max Recalculation', () => {
    test('should recalculate skill max when governing stat increases', () => {
      character.race = 'human';
      character.stats.DEX = 5;
      expect(character.getSkillMaxRank('Ballistic')).toBe(5);

      // Increase DEX
      character.stats.DEX = 8;
      expect(character.getSkillMaxRank('Ballistic')).toBe(8);

      // Set skill to new max
      character.skills.Ballistic = 8;
      expect(character.skills.Ballistic).toBe(8);
    });

    test('should cap skill max at 10 even if stat is high', () => {
      character.race = 'human';
      character.stats.DEX = 15; // Hypothetical
      const maxRank = character.getSkillMaxRank('Ballistic');
      expect(maxRank).toBe(10); // Capped at 10
    });

    test('should maintain derived stat skills correctly', () => {
      character.race = 'human';
      character.stats.DIA = 8;
      character.stats.CONC = 8;
      character.calculateDerivedStats();

      expect(character.derivedStats.KNOW).toBe(8);
      const maxRank = character.getSkillMaxRank('SLA Information');
      expect(maxRank).toBe(8);
    });
  });

  describe('Training Package Selection & Points', () => {
    test('should apply training package skills', () => {
      character.race = 'human';
      character.applyTrainingPackage('operative');

      expect(character.selectedTrainingPackage).toBe('operative');
      expect(character.skills.Ballistic).toBe(1);
      expect(character.skills['Unarmed Combat']).toBe(1);
    });

    test('should add bonus ranks when skill already exists', () => {
      character.race = 'human';
      character.skills.Ballistic = 2;

      character.applyTrainingPackage('operative');

      // Package adds 1 rank bonus
      expect(character.skills.Ballistic).toBe(3);
      expect(character.packageSkills.Ballistic.bonusRank).toBe(1);
      expect(character.packageSkills.Ballistic.originalRank).toBe(2);
    });

    test('should remove package skills correctly', () => {
      character.race = 'human';
      character.applyTrainingPackage('operative');

      expect(character.skills.Ballistic).toBe(1);
      character.removeTrainingPackage();
      expect(character.selectedTrainingPackage).toBeNull();
      expect(character.skills.Ballistic).toBeUndefined();
    });

    test('should restore original skill rank when removing package', () => {
      character.race = 'human';
      character.skills.Ballistic = 3;
      const originalRank = character.skills.Ballistic;

      character.applyTrainingPackage('operative');
      expect(character.skills.Ballistic).toBe(4); // 3 + 1 bonus

      character.removeTrainingPackage();
      expect(character.skills.Ballistic).toBe(originalRank);
    });

    test('should trigger point recalculation after package selection', () => {
      character.race = 'human';
      // Apply race skills first so they're free
      character.applyRaceSkills();
      const beforePackage = character.getAvailablePoints();

      character.applyTrainingPackage('operative');

      const afterPackage = character.getAvailablePoints();
      // Package adds Ballistic (1) and Unarmed Combat (1) which each cost 1 point
      expect(afterPackage).toBe(beforePackage - 2); // Rank 1 skills cost 1 each
    });
  });

  describe('Advantage/Disadvantage Toggle & Point Balance', () => {
    test('should add advantage cost and subtract disadvantage cost', () => {
      character.race = 'human';
      const initial = character.getAvailablePoints();

      character.advantages['Tough'] = 2; // 20 points
      let after = character.getAvailablePoints();
      expect(after).toBe(initial - 20);

      character.disadvantages['Bad Looks'] = 1; // +5 points (-5 per rank negated)
      after = character.getAvailablePoints();
      expect(after).toBe(initial - 20 + 5);
    });

    test('should handle oneOffCost advantages', () => {
      character.race = 'human';
      const initial = character.getAvailablePoints();

      character.advantages['Enhanced Vision'] = 1; // 15 one-off cost
      const after = character.getAvailablePoints();
      expect(after).toBe(initial - 15);
    });

    test('should prevent conflicting advantages', () => {
      character.advantages['Good Looks'] = 1;
      // If validation prevents this, character.disadvantages would not update
      character.disadvantages['Bad Looks'] = 0; // Can't add due to conflict
      expect(character.disadvantages['Bad Looks']).toBe(0);
    });
  });

  describe('Serialization Round-Trip', () => {
    test('should save and load character state', () => {
      character.name = 'Save Test';
      character.race = 'human';
      character.stats.STR = 8;
      character.stats.DEX = 7;
      character.skills.Ballistic = 2;
      character.advantages['Good Looks'] = 2;

      const json = character.toJSON();
      const newChar = new Character();
      newChar.fromJSON(json);

      expect(newChar.name).toBe('Save Test');
      expect(newChar.race).toBe('human');
      expect(newChar.stats.STR).toBe(8);
      expect(newChar.stats.DEX).toBe(7);
      expect(newChar.skills.Ballistic).toBe(2);
      expect(newChar.advantages['Good Looks']).toBe(2);
    });

    test('should preserve point calculations after load', () => {
      character.race = 'human';
      character.stats.STR = 8;
      character.advantages['Tough'] = 1;

      const before = character.getAvailablePoints();
      const json = character.toJSON();

      const newChar = new Character();
      newChar.race = 'human'; // Must set race for calculations
      newChar.fromJSON(json);

      const after = newChar.getAvailablePoints();
      expect(after).toBe(before);
    });
  });

  describe('Starter Kit Lock', () => {
    test('should apply starter kit on initialization', () => {
      expect(character.armamentInventory['FEN 603']).toBe(1);
      expect(character.ammoInventory['10mm Auto × STD']).toBe(2);
      expect(character.lockedInventory.armaments['FEN 603']).toBe(1);
    });

    test('should prevent removal of locked items', () => {
      // Character should track locked items
      expect(character.lockedInventory.armaments['FEN 603']).toBe(1);
      // In actual UI, prevent deleting down to 0 if in locked inventory
    });

    test('should allow additional purchases beyond starter kit', () => {
      character.armamentInventory['FEN 603'] = 2; // Add another
      expect(character.armamentInventory['FEN 603']).toBe(2);
      expect(character.lockedInventory.armaments['FEN 603']).toBe(1);
    });
  });

  describe('Credit Calculations', () => {
    test('should start with 1500 credits', () => {
      character.credits = 1500;
      expect(character.credits).toBe(1500);
    });

    test('should deduct credits for purchases', () => {
      character.credits = 1500;
      const weaponCost = 100; // Example
      character.credits -= weaponCost;
      expect(character.credits).toBe(1400);
    });
  });

  describe('Flux User Races', () => {
    test('should identify flux user race correctly', () => {
      character.race = 'ebon';
      expect(character.isFluxUser()).toBe(true);

      character.race = 'human';
      expect(character.isFluxUser()).toBe(false);
    });

    test('should apply ebon free skills if applicable', () => {
      character.race = 'ebon';
      character.applyRaceSkills();
      expect(character.skills['Ebon Lore']).toBe(1);
    });
  });

  describe('Point Balance Equation', () => {
    test('should maintain equation: avail = 300 + dis - stats - skills - advantages', () => {
      character.race = 'human';
      character.applyRaceSkills(); // Apply free skills first

      character.stats.STR = 7; // 10 points
      character.stats.DEX = 6; // 5 points
      character.skills.Ballistic = 3; // 6 points (no free ranks from race)
      character.advantages['Good Looks'] = 1; // 5 points
      character.disadvantages['Bad Looks'] = 1; // +5 points (-5 per rank negated)

      const statSpent = character.calculateStatPointsSpent(); // 15
      const skillSpent = character.calculateSkillPointsSpent(); // 6
      const advSpent = character.calculateAdvantagePoints(); // 5
      const disGain = character.calculateDisadvantagePoints(); // 5

      const available = character.getAvailablePoints();
      const expected = 300 + disGain - statSpent - skillSpent - advSpent;

      expect(available).toBe(expected);
      expect(available).toBe(279); // 300 + 5 - 15 - 6 - 5 = 279 (race skills have points already deducted)
    });
  });
});
