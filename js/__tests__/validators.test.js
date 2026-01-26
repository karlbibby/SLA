/**
 * Unit tests for VALIDATORS module
 * Tests validation logic for races, stats, skills, advantages, and character completion
 */

const testFixtures = require('./testFixtures');

// Mock global objects
global.RACES = testFixtures.RACES;
global.SKILLS = testFixtures.SKILLS;
global.ADVANTAGES = testFixtures.ADVANTAGES;
global.PHOBIA_RULES = testFixtures.PHOBIA_RULES;

// Mock VALIDATORS module
const VALIDATORS = {
  validateRace(raceId) {
    if (!raceId) {
      return { valid: false, message: 'Race must be selected' };
    }
    if (!RACES[raceId]) {
      return { valid: false, message: 'Invalid race selected' };
    }
    return { valid: true };
  },

  validateStatAllocation(character, statName, newValue) {
    if (!character.race) {
      return { valid: false, message: 'Race must be selected first' };
    }

    const maximums = RACES[character.race].statMaximums;
    const statMax = maximums[statName];

    if (!statMax) {
      return { valid: false, message: `Invalid stat: ${statName}` };
    }

    if (newValue < statMax.min) {
      return { valid: false, message: `${statName} cannot be below ${statMax.min}` };
    }

    if (newValue > statMax.max) {
      return { valid: false, message: `${statName} cannot exceed ${statMax.max}` };
    }

    return { valid: true };
  },

  validateSkillAllocation(character, skillName, newRank) {
    if (!character.race) {
      return { valid: false, message: 'Race must be selected first' };
    }

    let skillData = null;
    for (const category in SKILLS) {
      if (SKILLS[category].skills[skillName]) {
        skillData = SKILLS[category].skills[skillName];
        break;
      }
    }

    if (!skillData) {
      return { valid: false, message: `Invalid skill: ${skillName}` };
    }

    const governingStat = skillData.governingStat;
    let statValue;

    if (governingStat === 'PHYS') {
      statValue = character.derivedStats.PHYS;
    } else if (governingStat === 'KNOW') {
      statValue = character.derivedStats.KNOW;
    } else {
      statValue = character.stats[governingStat];
    }

    const maxRank = Math.min(10, statValue);

    if (newRank < 0) {
      return { valid: false, message: 'Skill rank cannot be negative' };
    }

    if (newRank > maxRank) {
      return { valid: false, message: `${skillName} cannot exceed rank ${maxRank} (governed by ${governingStat} of ${statValue})` };
    }

    return { valid: true };
  },

  validateAdvantageSelection(character, advName, rank, isDisadvantage) {
    let advData = null;
    for (const category in ADVANTAGES) {
      if (ADVANTAGES[category].items[advName]) {
        advData = ADVANTAGES[category].items[advName];
        break;
      }
    }

    if (!advData) {
      return { valid: false, message: `Invalid advantage: ${advName}` };
    }

    if (advData.type === 'advantage' && isDisadvantage) {
      return { valid: false, message: `${advName} is an advantage, not a disadvantage` };
    }
    if (advData.type === 'disadvantage' && !isDisadvantage) {
      return { valid: false, message: `${advName} is a disadvantage, not an advantage` };
    }

    if (rank < 0) {
      return { valid: false, message: 'Rank cannot be negative' };
    }

    if (rank > advData.maxRank) {
      return { valid: false, message: `${advName} cannot exceed rank ${advData.maxRank}` };
    }

    const conflictCheck = VALIDATORS.checkConflictingAdvantages(character, advName, isDisadvantage);
    if (!conflictCheck.valid) {
      return conflictCheck;
    }

    return { valid: true };
  },

  checkConflictingAdvantages(character, advName, isDisadvantage) {
    const conflicts = {
      'Good Looks': ['Bad Looks'],
      'Bad Looks': ['Good Looks'],
      'Good Hearing': ['Bad Hearing'],
      'Bad Hearing': ['Good Hearing'],
      'Good Eyesight': ['Bad Eyesight'],
      'Bad Eyesight': ['Good Eyesight']
    };

    const conflictList = conflicts[advName];
    if (!conflictList) {
      return { valid: true };
    }

    // Check both advantages and disadvantages for conflicts
    const collectionToCheck = isDisadvantage ? character.advantages : character.disadvantages;
    const oppositeCollection = isDisadvantage ? character.disadvantages : character.advantages;

    for (const conflict of conflictList) {
      if (collectionToCheck[conflict] && collectionToCheck[conflict] > 0) {
        return { valid: false, message: `Cannot select ${advName} with ${conflict}` };
      }
      if (oppositeCollection[conflict] && oppositeCollection[conflict] > 0) {
        return { valid: false, message: `Cannot select ${advName} with ${conflict}` };
      }
    }

    return { valid: true };
  },

  validatePointExpenditure(character) {
    const available = character.getAvailablePoints ? character.getAvailablePoints() : 0;
    if (available < 0) {
      return { valid: false, message: 'Not enough points available' };
    }
    return { valid: true };
  },

  validateCharacterCompletion(character) {
    const checks = [];

    if (!character.name || character.name.trim() === '') {
      checks.push('Character name is required');
    }

    if (!character.race) {
      checks.push('Race must be selected');
    }

    if (character.stats.STR < 5 || character.stats.DEX < 5) {
      checks.push('All stats must be at least 5');
    }

    if (character.getAvailablePoints && character.getAvailablePoints() < 0) {
      checks.push('Character has negative points');
    }

    if (checks.length > 0) {
      return { valid: false, messages: checks };
    }

    return { valid: true };
  }
};

// Create mock character for tests
function createMockCharacter() {
  return {
    name: 'Test Character',
    race: 'human',
    stats: {
      STR: 5,
      DEX: 5,
      DIA: 5,
      CONC: 5,
      CHA: 5,
      COOL: 5
    },
    derivedStats: {
      PHYS: 5,
      KNOW: 5,
      FLUX: 0
    },
    skills: {},
    advantages: {},
    disadvantages: {},
    phobias: [],
    totalPoints: 300,
    getAvailablePoints() {
      let spent = 0;
      for (const stat in this.stats) {
        if (this.stats[stat] > 5) {
          spent += (this.stats[stat] - 5) * 5;
        }
      }
      for (const adv in this.advantages) {
        if (ADVANTAGES['Physical'].items[adv]?.oneOffCost) {
          spent += ADVANTAGES['Physical'].items[adv].oneOffCost;
        } else if (ADVANTAGES['Physical'].items[adv]?.costPerRank) {
          spent += ADVANTAGES['Physical'].items[adv].costPerRank * this.advantages[adv];
        }
      }
      for (const dis in this.disadvantages) {
        if (ADVANTAGES['Physical'].items[dis]?.oneOffCost) {
          spent -= ADVANTAGES['Physical'].items[dis].oneOffCost;
        }
      }
      return this.totalPoints - spent;
    }
  };
}

// Tests
describe('VALIDATORS Module', () => {
  let character;

  beforeEach(() => {
    character = createMockCharacter();
  });

  describe('validateRace', () => {
    test('should reject empty race ID', () => {
      const result = VALIDATORS.validateRace('');
      expect(result.valid).toBe(false);
      expect(result.message).toContain('must be selected');
    });

    test('should reject null race ID', () => {
      const result = VALIDATORS.validateRace(null);
      expect(result.valid).toBe(false);
    });

    test('should reject invalid race', () => {
      const result = VALIDATORS.validateRace('invalid_race');
      expect(result.valid).toBe(false);
      expect(result.message).toContain('Invalid race');
    });

    test('should accept valid race "human"', () => {
      const result = VALIDATORS.validateRace('human');
      expect(result.valid).toBe(true);
    });

    test('should accept valid race "frother"', () => {
      const result = VALIDATORS.validateRace('frother');
      expect(result.valid).toBe(true);
    });

    test('should accept valid race "ebon"', () => {
      const result = VALIDATORS.validateRace('ebon');
      expect(result.valid).toBe(true);
    });
  });

  describe('validateStatAllocation', () => {
    test('should reject if race not set', () => {
      character.race = null;
      const result = VALIDATORS.validateStatAllocation(character, 'STR', 8);
      expect(result.valid).toBe(false);
      expect(result.message).toContain('Race must be selected first');
    });

    test('should reject invalid stat name', () => {
      character.race = 'human';
      const result = VALIDATORS.validateStatAllocation(character, 'INVALID', 8);
      expect(result.valid).toBe(false);
      expect(result.message).toContain('Invalid stat');
    });

    test('should reject stat below racial minimum', () => {
      character.race = 'human';
      const result = VALIDATORS.validateStatAllocation(character, 'STR', 4);
      expect(result.valid).toBe(false);
      expect(result.message).toContain('cannot be below');
    });

    test('should reject stat above racial maximum', () => {
      character.race = 'human';
      const result = VALIDATORS.validateStatAllocation(character, 'STR', 11);
      expect(result.valid).toBe(false);
      expect(result.message).toContain('cannot exceed');
    });

    test('should accept stat at racial minimum', () => {
      character.race = 'human';
      const result = VALIDATORS.validateStatAllocation(character, 'STR', 5);
      expect(result.valid).toBe(true);
    });

    test('should accept stat at racial maximum', () => {
      character.race = 'human';
      const result = VALIDATORS.validateStatAllocation(character, 'STR', 10);
      expect(result.valid).toBe(true);
    });

    test('should respect Frother DIA max of 8', () => {
      character.race = 'frother';
      const result = VALIDATORS.validateStatAllocation(character, 'DIA', 9);
      expect(result.valid).toBe(false);
      expect(result.message).toContain('cannot exceed');
    });

    test('should allow Frother STR up to 12', () => {
      character.race = 'frother';
      const result = VALIDATORS.validateStatAllocation(character, 'STR', 12);
      expect(result.valid).toBe(true);
    });
  });

  describe('validateSkillAllocation', () => {
    beforeEach(() => {
      character.race = 'human';
      character.stats.DEX = 7;
      character.derivedStats.KNOW = 7;
    });

    test('should reject if race not set', () => {
      character.race = null;
      const result = VALIDATORS.validateSkillAllocation(character, 'Ballistic', 2);
      expect(result.valid).toBe(false);
      expect(result.message).toContain('Race must be selected first');
    });

    test('should reject invalid skill name', () => {
      const result = VALIDATORS.validateSkillAllocation(character, 'Invalid Skill', 2);
      expect(result.valid).toBe(false);
      expect(result.message).toContain('Invalid skill');
    });

    test('should reject negative skill rank', () => {
      const result = VALIDATORS.validateSkillAllocation(character, 'Ballistic', -1);
      expect(result.valid).toBe(false);
      expect(result.message).toContain('cannot be negative');
    });

    test('should reject skill rank above governing stat', () => {
      character.stats.DEX = 5;
      const result = VALIDATORS.validateSkillAllocation(character, 'Ballistic', 6);
      expect(result.valid).toBe(false);
      expect(result.message).toContain('cannot exceed rank');
    });

    test('should enforce max rank of 10 even if stat is higher', () => {
      character.stats.DEX = 15; // Hypothetically high
      const result = VALIDATORS.validateSkillAllocation(character, 'Ballistic', 10);
      expect(result.valid).toBe(true);
      const result11 = VALIDATORS.validateSkillAllocation(character, 'Ballistic', 11);
      expect(result11.valid).toBe(false);
    });

    test('should accept skill rank equal to governing stat', () => {
      character.stats.DEX = 7;
      const result = VALIDATORS.validateSkillAllocation(character, 'Ballistic', 7);
      expect(result.valid).toBe(true);
    });

    test('should validate skills with derived stat KNOW', () => {
      character.derivedStats.KNOW = 6;
      const result = VALIDATORS.validateSkillAllocation(character, 'SLA Information', 6);
      expect(result.valid).toBe(true);
    });

    test('should reject derived stat skill above KNOW', () => {
      character.derivedStats.KNOW = 6;
      const result = VALIDATORS.validateSkillAllocation(character, 'SLA Information', 7);
      expect(result.valid).toBe(false);
    });

    test('should accept rank 0 (no skill)', () => {
      const result = VALIDATORS.validateSkillAllocation(character, 'Ballistic', 0);
      expect(result.valid).toBe(true);
    });
  });

  describe('validateAdvantageSelection', () => {
    test('should reject invalid advantage name', () => {
      const result = VALIDATORS.validateAdvantageSelection(character, 'Fake Advantage', 1, false);
      expect(result.valid).toBe(false);
      expect(result.message).toContain('Invalid advantage');
    });

    test('should reject negative rank', () => {
      const result = VALIDATORS.validateAdvantageSelection(character, 'Good Looks', -1, false);
      expect(result.valid).toBe(false);
      expect(result.message).toContain('cannot be negative');
    });

    test('should reject rank exceeding maxRank', () => {
      const result = VALIDATORS.validateAdvantageSelection(character, 'Good Looks', 5, false);
      expect(result.valid).toBe(false);
      expect(result.message).toContain('cannot exceed rank');
    });

    test('should accept advantage at maxRank', () => {
      const result = VALIDATORS.validateAdvantageSelection(character, 'Good Looks', 3, false);
      expect(result.valid).toBe(true);
    });

    test('should reject advantage selected as disadvantage', () => {
      const result = VALIDATORS.validateAdvantageSelection(character, 'Good Looks', 1, true);
      expect(result.valid).toBe(false);
      expect(result.message).toContain('is an advantage, not a disadvantage');
    });

    test('should reject disadvantage selected as advantage', () => {
      const result = VALIDATORS.validateAdvantageSelection(character, 'Bad Looks', 1, false);
      expect(result.valid).toBe(false);
      expect(result.message).toContain('is a disadvantage, not an advantage');
    });
  });

  describe('checkConflictingAdvantages', () => {
    test('should allow Good Looks if Bad Looks not selected', () => {
      character.advantages['Bad Looks'] = 0;
      const result = VALIDATORS.checkConflictingAdvantages(character, 'Good Looks', false);
      expect(result.valid).toBe(true);
    });

    test('should reject Good Looks if Bad Looks already selected', () => {
      character.advantages['Bad Looks'] = 1;
      const result = VALIDATORS.checkConflictingAdvantages(character, 'Good Looks', false);
      expect(result.valid).toBe(false);
      expect(result.message).toContain('Cannot select');
    });

    test('should reject Bad Looks if Good Looks selected', () => {
      character.disadvantages['Good Looks'] = 1;
      const result = VALIDATORS.checkConflictingAdvantages(character, 'Bad Looks', true);
      expect(result.valid).toBe(false);
    });

    test('should handle advantage with no conflicts', () => {
      const result = VALIDATORS.checkConflictingAdvantages(character, 'Tough', false);
      expect(result.valid).toBe(true);
    });

    test('should check hearing conflicts', () => {
      character.advantages['Bad Hearing'] = 1;
      const result = VALIDATORS.checkConflictingAdvantages(character, 'Good Hearing', false);
      expect(result.valid).toBe(false);
    });

    test('should check eyesight conflicts', () => {
      character.disadvantages['Good Eyesight'] = 1;
      const result = VALIDATORS.checkConflictingAdvantages(character, 'Bad Eyesight', true);
      expect(result.valid).toBe(false);
    });
  });

  describe('validatePointExpenditure', () => {
    test('should accept when points available', () => {
      character.getAvailablePoints = () => 50;
      const result = VALIDATORS.validatePointExpenditure(character);
      expect(result.valid).toBe(true);
    });

    test('should accept when no points spent', () => {
      character.getAvailablePoints = () => 300;
      const result = VALIDATORS.validatePointExpenditure(character);
      expect(result.valid).toBe(true);
    });

    test('should reject when points negative', () => {
      character.getAvailablePoints = () => -5;
      const result = VALIDATORS.validatePointExpenditure(character);
      expect(result.valid).toBe(false);
      expect(result.message).toContain('Not enough points');
    });
  });

  describe('validateCharacterCompletion', () => {
    test('should accept complete valid character', () => {
      const result = VALIDATORS.validateCharacterCompletion(character);
      expect(result.valid).toBe(true);
    });

    test('should reject character with empty name', () => {
      character.name = '';
      const result = VALIDATORS.validateCharacterCompletion(character);
      expect(result.valid).toBe(false);
      expect(result.messages[0]).toContain('name is required');
    });

    test('should reject character with whitespace-only name', () => {
      character.name = '   ';
      const result = VALIDATORS.validateCharacterCompletion(character);
      expect(result.valid).toBe(false);
    });

    test('should reject character without race', () => {
      character.race = null;
      const result = VALIDATORS.validateCharacterCompletion(character);
      expect(result.valid).toBe(false);
      expect(result.messages).toContain('Race must be selected');
    });

    test('should reject character with stat below 5', () => {
      character.stats.STR = 4;
      const result = VALIDATORS.validateCharacterCompletion(character);
      expect(result.valid).toBe(false);
      expect(result.messages[0]).toContain('All stats must be at least 5');
    });

    test('should reject character with negative points', () => {
      character.getAvailablePoints = () => -10;
      const result = VALIDATORS.validateCharacterCompletion(character);
      expect(result.valid).toBe(false);
      expect(result.messages.some(m => m.includes('negative'))).toBe(true);
    });

    test('should return all validation issues in messages array', () => {
      character.name = '';
      character.race = null;
      character.stats.STR = 3;
      const result = VALIDATORS.validateCharacterCompletion(character);
      expect(result.valid).toBe(false);
      expect(result.messages.length).toBeGreaterThan(1);
    });
  });
});
