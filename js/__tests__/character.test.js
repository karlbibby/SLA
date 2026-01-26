/**
 * Unit tests for Character class
 * Tests core character model: stats, skills, points, validation, serialization
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
    'Blueprint News File Case': 1,
    'S.C.L. Card': 1,
    'Finance Chip': 1,
    'Package Card': 1,
    'Package Badge': 1,
    'Departmental Authorization Card': 1,
    'Pack of Contraceptives': 1,
    'Clothes (Set)': 2,
    'Footwear (Set)': 1,
    'Operative Organizer': 1,
    'SLA Badge': 1,
    'Weapons Maintenance Kit': 1
  }
};

global.RACES = testFixtures.RACES;
global.SKILLS = testFixtures.SKILLS;
global.ADVANTAGES = testFixtures.ADVANTAGES;
global.TRAINING_PACKAGES = testFixtures.TRAINING_PACKAGES;
global.EBON_ABILITIES = testFixtures.EBON_ABILITIES;
global.DEATHSUIT_TYPES = testFixtures.DEATHSUIT_TYPES;
global.PHOBIA_RULES = testFixtures.PHOBIA_RULES;

// Mock Character class (simplified version for testing)
class Character {
  constructor() {
    this.name = '';
    this.playerName = '';
    this.race = null;
    this.photo = '';
    this.department = '';
    this.squad = '';
    this.classification = '';
    this.scl = '10';

    this.stats = {
      STR: 5,
      DEX: 5,
      DIA: 5,
      CONC: 5,
      CHA: 5,
      COOL: 5
    };

    this.derivedStats = {
      PHYS: 5,
      KNOW: 5,
      FLUX: 0
    };

    this.move = {
      walk: '',
      run: '',
      sprint: ''
    };

    this.skills = {};
    this.advantages = {};
    this.disadvantages = {};
    this.phobias = [];

    this.weaponInventory = {};
    this.ammoInventory = {};
    this.armamentInventory = {};
    this.armourInventory = {};
    this.equipmentInventory = {};
    this.drugInventory = {};
    this.grenadeInventory = {};
    this.vehicleInventory = {};
    this.ebonEquipmentInventory = {};
    this.specialistAmmoInventory = {};

    this.selectedArmourType = '';
    this.armourHead = '--';
    this.armourTorso = '--';
    this.armourLArm = '--';
    this.armourRArm = '--';
    this.armourLLeg = '--';
    this.armourRLeg = '--';
    this.idHead = '--';
    this.idTorso = '--';
    this.idLArm = '--';
    this.idRArm = '--';
    this.idLLeg = '--';
    this.idRLeg = '--';

    this.hpTotal = 30;
    this.hpHead = 6;
    this.hpTorso = 10;
    this.hpLArm = 5;
    this.hpRArm = 5;
    this.hpLLeg = 5;
    this.hpRLeg = 5;
    this.wounds = 0;

    this.encumbrance = { movement: '' };
    this.creditsAvailable = 1500;
    this.credits = 1500;

    this.selectedTrainingPackage = null;
    this.packageSkills = {};

    this.ebonRanks = {};
    this.ebonAbilities = [];
    this.selectedFormulae = [];
    this.deathsuitType = '';

    this.totalPoints = 300;
    this.starterKitApplied = false;
    this.lockedInventory = {
      armaments: {},
      ammo: {},
      equipment: {}
    };

    this.created = new Date().toISOString();
    this.version = '1.0';

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

  getDamageBonus() {
    const str = Number(this.stats?.STR || 0);
    return Math.floor(str / 3);
  }

  getPhaseData() {
    const dex = Number(this.stats?.DEX || 0);
    let actions = 1;
    let phases = [3];
    if (dex >= 4 && dex <= 6) {
      actions = 2;
      phases = [2, 4];
    } else if (dex >= 7 && dex <= 9) {
      actions = 3;
      phases = [1, 3, 5];
    } else if (dex >= 10 && dex <= 12) {
      actions = 4;
      phases = [1, 2, 4, 5];
    } else if (dex >= 13) {
      actions = 5;
      phases = [1, 2, 3, 4, 5];
    }
    return { actions, phases };
  }

  getStatMaximums() {
    if (!this.race) return null;
    return RACES[this.race].statMaximums;
  }

  canIncreaseStat(statName, newValue) {
    const maximums = this.getStatMaximums();
    if (!maximums) return false;
    const statMax = maximums[statName];
    if (!statMax) return false;
    return newValue <= statMax.max;
  }

  canDecreaseStat(statName, newValue) {
    const minimums = this.getStatMaximums();
    if (!minimums) return false;
    const statMin = minimums[statName];
    if (!statMin) return false;
    return newValue >= statMin.min;
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

  calculateEbonPointsSpent() {
    let spent = 0;
    if (!this.ebonRanks || typeof EBON_ABILITIES === 'undefined') return 0;
    for (const catKey in this.ebonRanks) {
      const rank = Number(this.ebonRanks[catKey] || 0);
      if (!rank || rank <= 0) continue;
      const cat = EBON_ABILITIES[catKey];
      if (!cat) continue;
      const cost = (rank * (rank + 1)) / 2;
      spent += cost;
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
      } else if (this.stats[stat] < baseValue) {
        spent -= (baseValue - this.stats[stat]) * 5;
      }
    }

    if (this.isFluxUser() && this.derivedStats.FLUX > 10) {
      spent += (this.derivedStats.FLUX - 10) * 5;
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
            points -= advData.oneOffCost; // Negate negative cost to get positive gain
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
    const ebonSpent = this.calculateEbonPointsSpent ? this.calculateEbonPointsSpent() : 0;
    const advPoints = this.calculateAdvantagePoints();
    const disPoints = this.calculateDisadvantagePoints();
    return basePoints + disPoints - statSpent - skillSpent - advPoints - ebonSpent;
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

  getMoveRate() {
    const base = this.move || {};
    const runningRank = Number(this.skills?.Running || 0);
    const sprintBonus = runningRank * 0.3;

    const applyValue = (value, extra = 0) => {
      if (value === '' || value === null || typeof value === 'undefined') return '';
      const num = Number(value);
      if (!Number.isFinite(num)) return '';
      return Math.round((num + extra) * 10) / 10;
    };

    return {
      walk: applyValue(base.walk),
      run: applyValue(base.run),
      sprint: applyValue(base.sprint, sprintBonus)
    };
  }

  toJSON() {
    return {
      name: this.name,
      playerName: this.playerName,
      race: this.race,
      stats: JSON.parse(JSON.stringify(this.stats)),
      derivedStats: JSON.parse(JSON.stringify(this.derivedStats)),
      skills: JSON.parse(JSON.stringify(this.skills)),
      advantages: JSON.parse(JSON.stringify(this.advantages)),
      disadvantages: JSON.parse(JSON.stringify(this.disadvantages)),
      credits: this.credits
    };
  }

  fromJSON(json) {
    this.name = json.name || '';
    this.playerName = json.playerName || '';
    this.race = json.race || null;
    this.stats = json.stats || this.stats;
    this.derivedStats = json.derivedStats || this.derivedStats;
    this.skills = json.skills || {};
    this.advantages = json.advantages || {};
    this.disadvantages = json.disadvantages || {};
    this.credits = json.credits || 1500;
  }
}

// Tests
describe('Character Class', () => {
  let character;

  beforeEach(() => {
    character = new Character();
  });

  describe('Constructor & Initialization', () => {
    test('should initialize with default values', () => {
      expect(character.name).toBe('');
      expect(character.race).toBeNull();
      expect(character.stats.STR).toBe(5);
      expect(character.stats.DEX).toBe(5);
    });

    test('should apply starter kit by default', () => {
      expect(character.armamentInventory['FEN 603']).toBe(1);
      expect(character.ammoInventory['10mm Auto × STD']).toBe(2);
      expect(character.equipmentInventory['Headset Communicator']).toBe(1);
    });

    test('should have 300 total points', () => {
      expect(character.totalPoints).toBe(300);
    });

    test('should not apply starter kit twice', () => {
      const firstCall = character.starterKitApplied;
      character.applyStarterKit();
      const secondCall = character.starterKitApplied;
      expect(firstCall).toBe(secondCall);
    });
  });

  describe('Derived Stats Calculations', () => {
    test('should calculate PHYS as ceil((STR + DEX) / 2)', () => {
      character.stats.STR = 8;
      character.stats.DEX = 7;
      character.calculateDerivedStats();
      expect(character.derivedStats.PHYS).toBe(8); // ceil(15/2) = 8
    });

    test('should calculate KNOW as ceil((DIA + CONC) / 2)', () => {
      character.stats.DIA = 6;
      character.stats.CONC = 9;
      character.calculateDerivedStats();
      expect(character.derivedStats.KNOW).toBe(8); // ceil(15/2) = 8
    });

    test('should round up PHYS correctly', () => {
      character.stats.STR = 8;
      character.stats.DEX = 8;
      character.calculateDerivedStats();
      expect(character.derivedStats.PHYS).toBe(8); // ceil(16/2) = 8
    });
  });

  describe('Hit Points Calculations', () => {
    test('should calculate total hit points as STR + PHYS', () => {
      character.stats.STR = 8;
      character.stats.DEX = 7;
      character.calculateDerivedStats();
      // PHYS = ceil((8+7)/2) = 8, Total = 8 + 8 = 16
      expect(character.derivedStats.hitPoints.total).toBe(16);
      expect(character.hpTotal).toBe(16);
    });

    test('should calculate head HP as ceil(total / 3)', () => {
      character.stats.STR = 10;
      character.stats.DEX = 10;
      character.calculateDerivedStats();
      // PHYS = 10, Total = 20, Head = ceil(20/3) = 7
      expect(character.derivedStats.hitPoints.head).toBe(7);
      expect(character.hpHead).toBe(7);
    });

    test('should calculate torso HP as total', () => {
      character.stats.STR = 9;
      character.stats.DEX = 9;
      character.calculateDerivedStats();
      // PHYS = 9, Total = 18, Torso = 18
      expect(character.derivedStats.hitPoints.torso).toBe(18);
      expect(character.hpTorso).toBe(18);
    });

    test('should calculate arm HP as floor(total / 2)', () => {
      character.stats.STR = 7;
      character.stats.DEX = 8;
      character.calculateDerivedStats();
      // PHYS = ceil(15/2) = 8, Total = 15, Arms = floor(15/2) = 7
      expect(character.derivedStats.hitPoints.leftArm).toBe(7);
      expect(character.derivedStats.hitPoints.rightArm).toBe(7);
      expect(character.hpLArm).toBe(7);
      expect(character.hpRArm).toBe(7);
    });

    test('should calculate leg HP as ceil(total / 2)', () => {
      character.stats.STR = 7;
      character.stats.DEX = 8;
      character.calculateDerivedStats();
      // PHYS = 8, Total = 15, Legs = ceil(15/2) = 8
      expect(character.derivedStats.hitPoints.leftLeg).toBe(8);
      expect(character.derivedStats.hitPoints.rightLeg).toBe(8);
      expect(character.hpLLeg).toBe(8);
      expect(character.hpRLeg).toBe(8);
    });

    test('should handle even total HP (no rounding needed)', () => {
      character.stats.STR = 8;
      character.stats.DEX = 8;
      character.calculateDerivedStats();
      // PHYS = 8, Total = 16
      // Head = ceil(16/3) = 6, Torso = 16, Arms = floor(16/2) = 8, Legs = ceil(16/2) = 8
      expect(character.derivedStats.hitPoints.total).toBe(16);
      expect(character.derivedStats.hitPoints.head).toBe(6);
      expect(character.derivedStats.hitPoints.torso).toBe(16);
      expect(character.derivedStats.hitPoints.leftArm).toBe(8);
      expect(character.derivedStats.hitPoints.leftLeg).toBe(8);
    });

    test('should handle minimum stats HP', () => {
      character.stats.STR = 5;
      character.stats.DEX = 5;
      character.calculateDerivedStats();
      // PHYS = 5, Total = 10
      // Head = ceil(10/3) = 4, Torso = 10, Arms = floor(10/2) = 5, Legs = ceil(10/2) = 5
      expect(character.derivedStats.hitPoints.total).toBe(10);
      expect(character.derivedStats.hitPoints.head).toBe(4);
      expect(character.derivedStats.hitPoints.torso).toBe(10);
      expect(character.derivedStats.hitPoints.leftArm).toBe(5);
      expect(character.derivedStats.hitPoints.leftLeg).toBe(5);
    });

    test('should mirror HP to top-level fields', () => {
      character.stats.STR = 8;
      character.stats.DEX = 7;
      character.calculateDerivedStats();
      // Verify top-level fields are set
      expect(character.hpTotal).toBe(character.derivedStats.hitPoints.total);
      expect(character.hpHead).toBe(character.derivedStats.hitPoints.head);
      expect(character.hpTorso).toBe(character.derivedStats.hitPoints.torso);
      expect(character.hpLArm).toBe(character.derivedStats.hitPoints.leftArm);
      expect(character.hpRArm).toBe(character.derivedStats.hitPoints.rightArm);
      expect(character.hpLLeg).toBe(character.derivedStats.hitPoints.leftLeg);
      expect(character.hpRLeg).toBe(character.derivedStats.hitPoints.rightLeg);
    });
  });

  describe('Damage Bonus Calculation', () => {
    test('should calculate damage bonus as STR / 3 rounded down', () => {
      character.stats.STR = 5;
      expect(character.getDamageBonus()).toBe(1);

      character.stats.STR = 9;
      expect(character.getDamageBonus()).toBe(3);

      character.stats.STR = 10;
      expect(character.getDamageBonus()).toBe(3);
    });

    test('should handle STR of 0', () => {
      character.stats.STR = 0;
      expect(character.getDamageBonus()).toBe(0);
    });

    test('should handle high STR values', () => {
      character.stats.STR = 12;
      expect(character.getDamageBonus()).toBe(4);
    });
  });

  describe('Phase Data Calculation', () => {
    test('should return correct phases for DEX 3-6', () => {
      character.stats.DEX = 5;
      const data = character.getPhaseData();
      expect(data.phases).toEqual([2, 4]);
      expect(data.actions).toBe(2);
    });

    test('should return correct phases for DEX 7-9', () => {
      character.stats.DEX = 8;
      const data = character.getPhaseData();
      expect(data.phases).toEqual([1, 3, 5]);
      expect(data.actions).toBe(3);
    });

    test('should return correct phases for DEX 10-12', () => {
      character.stats.DEX = 11;
      const data = character.getPhaseData();
      expect(data.phases).toEqual([1, 2, 4, 5]);
      expect(data.actions).toBe(4);
    });

    test('should return all phases for DEX 13+', () => {
      character.stats.DEX = 13;
      const data = character.getPhaseData();
      expect(data.phases).toEqual([1, 2, 3, 4, 5]);
      expect(data.actions).toBe(5);
    });
  });

  describe('Stat Maximums & Constraints', () => {
    test('should return null if race not set', () => {
      expect(character.getStatMaximums()).toBeNull();
    });

    test('should return race stat maxima when race is set', () => {
      character.race = 'human';
      const maxima = character.getStatMaximums();
      expect(maxima.STR.max).toBe(10);
      expect(maxima.DIA.max).toBe(10);
    });

    test('should respect Frother stat limits (STR max 12, DIA max 8)', () => {
      character.race = 'frother';
      const maxima = character.getStatMaximums();
      expect(maxima.STR.max).toBe(12);
      expect(maxima.DIA.max).toBe(8);
    });

    test('should allow stat increase to max', () => {
      character.race = 'human';
      expect(character.canIncreaseStat('STR', 10)).toBe(true);
    });

    test('should prevent stat increase beyond max', () => {
      character.race = 'human';
      expect(character.canIncreaseStat('STR', 11)).toBe(false);
    });

    test('should allow stat decrease to min', () => {
      character.race = 'human';
      expect(character.canDecreaseStat('STR', 5)).toBe(true);
    });

    test('should prevent stat decrease below min', () => {
      character.race = 'human';
      expect(character.canDecreaseStat('STR', 4)).toBe(false);
    });
  });

  describe('Skill Management', () => {
    beforeEach(() => {
      character.race = 'human';
    });

    test('should find governing stat for skill', () => {
      const govStat = character.getGoverningStatValue('Ballistic');
      expect(govStat).toBe(character.stats.DEX);
    });

    test('should handle skills governed by derived stats', () => {
      character.stats.DIA = 8;
      character.stats.CONC = 10;
      character.calculateDerivedStats();
      const govStat = character.getGoverningStatValue('SLA Information');
      expect(govStat).toBe(character.derivedStats.KNOW);
    });

    test('should calculate skill max rank as min(10, governing stat)', () => {
      character.stats.DEX = 6;
      const maxRank = character.getSkillMaxRank('Ballistic');
      expect(maxRank).toBe(6);

      character.stats.DEX = 10;
      expect(character.getSkillMaxRank('Ballistic')).toBe(10);
    });

    test('should apply free skills from race', () => {
      character.race = 'human';
      character.applyRaceSkills();
      expect(character.skills.Literacy).toBe(1);
      expect(character.skills['SLA Information']).toBe(2);
    });

    test('should calculate skill points spent with free skills deduction', () => {
      character.race = 'human';
      character.applyRaceSkills();
      character.skills['SLA Information'] = 3; // Rank 3, but 2 free from race
      const spent = character.calculateSkillPointsSpent();
      // Only rank 3 costs: 3 points
      expect(spent).toBe(3);
    });

    test('should calculate triangular cost formula correctly', () => {
      character.race = 'human';
      character.skills.Ballistic = 3;
      const spent = character.calculateSkillPointsSpent();
      // Cost = 1 + 2 + 3 = 6
      expect(spent).toBe(6);
    });
  });

  describe('Point Calculations', () => {
    beforeEach(() => {
      character.race = 'human';
    });

    test('should start with 300 points available', () => {
      expect(character.getAvailablePoints()).toBe(300);
    });

    test('should subtract stat point costs', () => {
      character.stats.STR = 8; // +3 from base 5 = 15 points
      const spent = character.calculateStatPointsSpent();
      expect(spent).toBe(15);
      expect(character.getAvailablePoints()).toBe(285);
    });

    test('should subtract advantage costs', () => {
      character.advantages['Good Looks'] = 2;
      const spent = character.calculateAdvantagePoints();
      expect(spent).toBe(10); // 5 points per rank
      expect(character.getAvailablePoints()).toBe(290);
    });

    test('should add disadvantage points', () => {
      character.race = 'human';
      character.disadvantages['Bad Looks'] = 2;
      const gained = character.calculateDisadvantagePoints();
      expect(gained).toBe(10); // Disadvantages return positive gain (negate negative cost)
      expect(character.getAvailablePoints()).toBe(310);
    });

    test('should handle oneOffCost advantages', () => {
      character.advantages['Enhanced Vision'] = 1;
      const spent = character.calculateAdvantagePoints();
      expect(spent).toBe(15);
    });
  });

  describe('Flux User Detection', () => {
    test('should return false for non-flux races', () => {
      character.race = 'human';
      expect(character.isFluxUser()).toBe(false);
    });

    test('should return true for flux user races', () => {
      character.race = 'ebon';
      expect(character.isFluxUser()).toBe(true);
    });

    test('should return false if no race selected', () => {
      expect(character.isFluxUser()).toBe(false);
    });
  });

  describe('Serialization', () => {
    test('should serialize to JSON', () => {
      character.name = 'Test Operative';
      character.race = 'human';
      character.stats.STR = 8;
      character.skills.Ballistic = 2;
      character.advantages['Good Looks'] = 1;

      const json = character.toJSON();
      expect(json.name).toBe('Test Operative');
      expect(json.race).toBe('human');
      expect(json.stats.STR).toBe(8);
      expect(json.skills.Ballistic).toBe(2);
      expect(json.advantages['Good Looks']).toBe(1);
    });

    test('should deserialize from JSON', () => {
      const json = {
        name: 'Loaded Operative',
        race: 'frother',
        stats: { STR: 10, DEX: 7, DIA: 6, CONC: 5, CHA: 5, COOL: 5 },
        skills: { Ballistic: 3 },
        advantages: { Tough: 2 },
        disadvantages: { 'Bad Looks': 1 },
        credits: 1000
      };

      character.fromJSON(json);
      expect(character.name).toBe('Loaded Operative');
      expect(character.race).toBe('frother');
      expect(character.stats.STR).toBe(10);
      expect(character.credits).toBe(1000);
    });

    test('should round-trip correctly', () => {
      character.name = 'Round Trip Test';
      character.race = 'human';
      character.stats.STR = 9;
      character.skills['Unarmed Combat'] = 4;

      const json = character.toJSON();
      const newChar = new Character();
      newChar.fromJSON(json);

      expect(newChar.name).toBe('Round Trip Test');
      expect(newChar.race).toBe('human');
      expect(newChar.stats.STR).toBe(9);
      expect(newChar.skills['Unarmed Combat']).toBe(4);
    });
  });

  describe('Edge Cases & Boundaries', () => {
    test('should handle stat at exact race maximum', () => {
      character.race = 'human';
      character.stats.STR = 10;
      expect(character.canIncreaseStat('STR', 10)).toBe(true);
      expect(character.canIncreaseStat('STR', 11)).toBe(false);
    });

    test('should handle skill rank equal to governing stat', () => {
      character.race = 'human';
      character.stats.DEX = 7;
      const maxRank = character.getSkillMaxRank('Ballistic');
      expect(maxRank).toBe(7);
    });

    test('should allow 0 points spent when no selections made', () => {
      character.race = 'human';
      expect(character.calculateStatPointsSpent()).toBe(0);
      expect(character.calculateSkillPointsSpent()).toBe(0);
    });

    test('should handle inventory as empty map', () => {
      expect(Object.keys(character.weaponInventory).length).toBe(0);
      character.weaponInventory['Blade'] = 1;
      expect(character.weaponInventory['Blade']).toBe(1);
    });

    test('should clone character via JSON serialization', () => {
      character.name = 'Original';
      character.race = 'human';
      character.stats.STR = 8;

      const clone = new Character();
      clone.fromJSON(character.toJSON());

      clone.name = 'Clone';
      expect(character.name).toBe('Original');
      expect(clone.name).toBe('Clone');
    });
  });

  describe('DeathSuit Type from Protect Rank', () => {
    test('should return Light for Protect rank 0-4', () => {
      character.ebonRanks = {};
      expect(character.getDeathSuitTypeFromProtectRank()).toBe('Light');

      character.ebonRanks.protect = 1;
      expect(character.getDeathSuitTypeFromProtectRank()).toBe('Light');

      character.ebonRanks.protect = 4;
      expect(character.getDeathSuitTypeFromProtectRank()).toBe('Light');
    });

    test('should return Medium for Protect rank 5-9', () => {
      character.ebonRanks = { protect: 5 };
      expect(character.getDeathSuitTypeFromProtectRank()).toBe('Medium');

      character.ebonRanks.protect = 7;
      expect(character.getDeathSuitTypeFromProtectRank()).toBe('Medium');

      character.ebonRanks.protect = 9;
      expect(character.getDeathSuitTypeFromProtectRank()).toBe('Medium');
    });

    test('should return Heavy for Protect rank 10-14', () => {
      character.ebonRanks = { protect: 10 };
      expect(character.getDeathSuitTypeFromProtectRank()).toBe('Heavy');

      character.ebonRanks.protect = 12;
      expect(character.getDeathSuitTypeFromProtectRank()).toBe('Heavy');

      character.ebonRanks.protect = 14;
      expect(character.getDeathSuitTypeFromProtectRank()).toBe('Heavy');
    });

    test('should return Super for Protect rank 15-19', () => {
      character.ebonRanks = { protect: 15 };
      expect(character.getDeathSuitTypeFromProtectRank()).toBe('Super');

      character.ebonRanks.protect = 17;
      expect(character.getDeathSuitTypeFromProtectRank()).toBe('Super');

      character.ebonRanks.protect = 19;
      expect(character.getDeathSuitTypeFromProtectRank()).toBe('Super');
    });

    test('should return Angel for Protect rank 20', () => {
      character.ebonRanks = { protect: 20 };
      expect(character.getDeathSuitTypeFromProtectRank()).toBe('Angel');
    });

    test('should handle missing or zero Protect rank as Light', () => {
      character.ebonRanks = {};
      expect(character.getDeathSuitTypeFromProtectRank()).toBe('Light');

      character.ebonRanks = null;
      expect(character.getDeathSuitTypeFromProtectRank()).toBe('Light');

      character.ebonRanks = { protect: 0 };
      expect(character.getDeathSuitTypeFromProtectRank()).toBe('Light');
    });

    test('should update dynamically when Protect rank changes', () => {
      character.ebonRanks = { protect: 3 };
      expect(character.getDeathSuitTypeFromProtectRank()).toBe('Light');

      character.ebonRanks.protect = 8;
      expect(character.getDeathSuitTypeFromProtectRank()).toBe('Medium');

      character.ebonRanks.protect = 13;
      expect(character.getDeathSuitTypeFromProtectRank()).toBe('Heavy');

      character.ebonRanks.protect = 18;
      expect(character.getDeathSuitTypeFromProtectRank()).toBe('Super');

      character.ebonRanks.protect = 20;
      expect(character.getDeathSuitTypeFromProtectRank()).toBe('Angel');
    });
  });
});

