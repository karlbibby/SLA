// Test fixtures for SLA Industries Character Generator unit tests

/**
 * Minimal mock data to isolate tests from full game data
 * Use these instead of importing full data files to keep tests fast and focused
 */

const testFixtures = {
  // Minimal RACES data for testing
  RACES: {
    human: {
      id: 'human',
      name: 'Human',
      description: 'Versatile baseline species',
      move: {
        walk: 1,
        run: 2,
        sprint: 3
      },
      statMaximums: {
        STR: { min: 5, max: 10 },
        DEX: { min: 5, max: 10 },
        DIA: { min: 5, max: 10 },
        CONC: { min: 5, max: 10 },
        CHA: { min: 5, max: 10 },
        COOL: { min: 5, max: 10 }
      },
      special: 'Balanced stats',
      fluxUser: false,
      freeSkills: {
        Literacy: 1,
        Detect: 1,
        'SLA Information': 2,
        Streetwise: 2
      }
    },
    frother: {
      id: 'frother',
      name: 'Frother',
      description: 'Genetically modified for strength',
      move: {
        walk: 1,
        run: 2,
        sprint: 4
      },
      statMaximums: {
        STR: { min: 5, max: 12 },
        DEX: { min: 5, max: 10 },
        DIA: { min: 5, max: 8 },
        CONC: { min: 5, max: 10 },
        CHA: { min: 5, max: 10 },
        COOL: { min: 5, max: 10 }
      },
      special: '+2 STR, -2 DIA maximum',
      fluxUser: false,
      freeSkills: {
        'Unarmed Combat': 1,
        Intimidation: 1
      }
    },
    ebon: {
      id: 'ebon',
      name: 'Ebon',
      description: 'Genetically modified flux users',
      move: {
        walk: 1,
        run: 2,
        sprint: 3
      },
      statMaximums: {
        STR: { min: 5, max: 10 },
        DEX: { min: 5, max: 10 },
        DIA: { min: 5, max: 10 },
        CONC: { min: 5, max: 10 },
        CHA: { min: 5, max: 10 },
        COOL: { min: 5, max: 10 }
      },
      special: 'Flux user, ebon abilities',
      fluxUser: true,
      freeSkills: {
        Literacy: 1,
        'Ebon Lore': 1
      }
    }
  },

  // Minimal SKILLS data for testing
  SKILLS: {
    'Basic Combat': {
      name: 'Basic Combat',
      skills: {
        'Unarmed Combat': {
          governingStat: 'DEX',
          description: 'Hand-to-hand combat',
          baseRank: 0,
          unarmedCombat: true
        },
        'Melee Weapons': {
          governingStat: 'STR',
          description: 'Melee weapon proficiency',
          baseRank: 0
        }
      }
    },
    'Ranged Combat': {
      name: 'Ranged Combat',
      skills: {
        Ballistic: {
          governingStat: 'DEX',
          description: 'Firearm proficiency',
          baseRank: 0
        },
        'Heavy Weapons': {
          governingStat: 'STR',
          description: 'Heavy weapon operation',
          baseRank: 0
        }
      }
    },
    Technical: {
      name: 'Technical',
      skills: {
        Electronics: {
          governingStat: 'DIA',
          description: 'Electronics knowledge',
          baseRank: 0
        },
        Mechanics: {
          governingStat: 'DIA',
          description: 'Mechanical systems',
          baseRank: 0
        }
      }
    },
    Medical: {
      name: 'Medical',
      skills: {
        'Medical, Paramedic': {
          governingStat: 'DIA',
          description: 'Paramedic training',
          baseRank: 0
        },
        'Medical, Practice': {
          governingStat: 'DIA',
          description: 'Medical doctor',
          baseRank: 0
        }
      }
    },
    Knowledge: {
      name: 'Knowledge',
      skills: {
        'SLA Information': {
          governingStat: 'KNOW',
          description: 'SLA Industries knowledge',
          baseRank: 0
        },
        Literacy: {
          governingStat: 'KNOW',
          description: 'Reading and writing',
          baseRank: 0
        },
        'Ebon Lore': {
          governingStat: 'KNOW',
          description: 'Ebon faction knowledge',
          baseRank: 0
        }
      }
    }
  },

  // Minimal ADVANTAGES/DISADVANTAGES data
  ADVANTAGES: {
    Physical: {
      name: 'Physical',
      items: {
        'Good Looks': {
          id: 'good_looks',
          name: 'Good Looks',
          type: 'advantage',
          maxRank: 3,
          costPerRank: 5,
          description: 'Attractive appearance'
        },
        'Bad Looks': {
          id: 'bad_looks',
          name: 'Bad Looks',
          type: 'disadvantage',
          maxRank: 3,
          costPerRank: -5,
          description: 'Unattractive appearance'
        },
        Tough: {
          id: 'tough',
          name: 'Tough',
          type: 'advantage',
          maxRank: 3,
          costPerRank: 10,
          description: 'Increased durability'
        }
      }
    },
    Sensory: {
      name: 'Sensory',
      items: {
        'Enhanced Vision': {
          id: 'enhanced_vision',
          name: 'Enhanced Vision',
          type: 'advantage',
          maxRank: 1,
          oneOffCost: 15,
          description: 'Improved eyesight'
        },
        'Poor Hearing': {
          id: 'poor_hearing',
          name: 'Poor Hearing',
          type: 'disadvantage',
          maxRank: 1,
          oneOffCost: -10,
          description: 'Hearing impairment'
        }
      }
    }
  },

  // Minimal TRAINING_PACKAGES data
  TRAINING_PACKAGES: {
    operative: {
      id: 'operative',
      name: 'Operative',
      scl: 2,
      skillPoints: 30,
      description: 'Standard field operative training',
      freeSkills: {
        Ballistic: 1,
        'Unarmed Combat': 1
      },
      special: 'Basic operative package'
    },
    specialist: {
      id: 'specialist',
      name: 'Specialist',
      scl: 3,
      skillPoints: 40,
      description: 'Advanced specialist training',
      freeSkills: {
        Electronics: 1,
        Mechanics: 1
      },
      special: 'Technical specialist focus'
    }
  },

  // Phobia rules
  PHOBIA_RULES: {
    max_at_creation: 3,
    conflicting_pairs: [
      ['Claustrophobia', 'Agoraphobia'],
      ['Hemophobia', 'Bloodlust']
    ]
  },

  // Ebon abilities sample
  EBON_ABILITIES: {
    'Ebon Might': {
      name: 'Ebon Might',
      description: 'Physical enhancement',
      ranks: [
        { rank: 1, title: 'Rank 1', cost: 5, dmg: null },
        { rank: 2, title: 'Rank 2', cost: 10, dmg: null }
      ]
    },
    'Ebon Shield': {
      name: 'Ebon Shield',
      description: 'Protective barrier',
      ranks: [
        { rank: 1, title: 'Rank 1', cost: 5, dmg: null }
      ]
    }
  },

  // DeathSuit types
  DEATHSUIT_TYPES: {
    'Standard DeathSuit': {
      name: 'Standard DeathSuit',
      pv: { base: 10, max: 15 },
      head: { base: 8, max: 12 },
      torso: { base: 10, max: 15 },
      arms: { base: 9, max: 14 },
      legs: { base: 9, max: 14 }
    }
  },

  // Helper function to create a test character
  createTestCharacter() {
    return {
      // Basic Info
      name: 'Test Operative',
      playerName: 'Test Player',
      race: 'human',
      photo: '',
      department: 'Test Dept',
      squad: 'Test Squad',
      classification: 'Operative',
      scl: 2,

      // Stats
      stats: {
        STR: 5,
        DEX: 5,
        DIA: 5,
        CONC: 5,
        CHA: 5,
        COOL: 5
      },

      // Derived stats
      derivedStats: {
        PHYS: 5,
        KNOW: 5,
        FLUX: 0
      },

      // Move
      move: {
        walk: '',
        run: '',
        sprint: ''
      },

      // Skills
      skills: {},

      // Advantages/disadvantages
      advantages: {},
      disadvantages: {},
      phobias: [],

      // Ebon
      ebonRanks: {},
      ebonAbilities: [],
      selectedFormulae: [],
      deathsuitType: '',

      // Inventories
      weaponInventory: {},
      ammoInventory: {},
      armamentInventory: {},
      armourInventory: {},
      equipmentInventory: {},
      drugInventory: {},
      grenadeInventory: {},
      vehicleInventory: {},
      ebonEquipmentInventory: {},
      specialistAmmoInventory: {},

      // Armour fields
      selectedArmourType: '',
      armourHead: '--',
      armourTorso: '--',
      armourLArm: '--',
      armourRArm: '--',
      armourLLeg: '--',
      armourRLeg: '--',
      idHead: '--',
      idTorso: '--',
      idLArm: '--',
      idRArm: '--',
      idLLeg: '--',
      idRLeg: '--',

      // HP
      hpTotal: 30,
      hpHead: 6,
      hpTorso: 10,
      hpLArm: 5,
      hpRArm: 5,
      hpLLeg: 5,
      hpRLeg: 5,
      wounds: 0,

      // Encumbrance
      encumbrance: {
        movement: ''
      },

      // Finance
      creditsAvailable: 1500,

      // Training
      selectedTrainingPackage: null,
      packageSkills: {},

      // Flux
      isFluxUser: () => {
        return this.race && this.RACES && this.RACES[this.race]?.fluxUser || false;
      },

      // Points/calculations
      calculatePoints: () => {
        const baseCost = (stat, base = 5) => (stat - base) * 5;
        const triCost = (rank) => rank > 0 ? (rank * (rank + 1)) / 2 : 0;

        let stats = 0;
        for (const stat in this.stats) {
          stats += baseCost(this.stats[stat]);
        }

        let skills = 0;
        for (const skill in this.skills) {
          skills += triCost(this.skills[skill]);
        }

        return { stats, skills };
      },

      calculateCredits: () => {
        return 1500; // Simplified
      }
    };
  }
};

module.exports = testFixtures;
