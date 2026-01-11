// SLA Industries Character Generator - Ebon/Flux Abilities Data

const EBON_ABILITIES = {
    // Blast Abilities - Offensive Flux Attacks
    blast: {
        name: 'Blast Abilities',
        abilities: {
            'Flux Bolt': {
                description: 'Launch a bolt of raw Flux energy.',
                fluxCost: 1,
                damage: '2d10',
                range: '30m',
                category: 'blast'
            },
            'Flux Blast': {
                description: 'Area of effect Flux explosion.',
                fluxCost: 3,
                damage: '3d10',
                range: '10m radius',
                category: 'blast'
            },
            'Flux Wave': {
                description: 'Wave of Flux energy in a cone.',
                fluxCost: 2,
                damage: '2d10',
                range: '15m cone',
                category: 'blast'
            },
            'Mental Blast': {
                description: 'Direct mental attack on target mind.',
                fluxCost: 2,
                damage: '2d10 + DIA modifier',
                range: '20m',
                category: 'blast'
            }
        }
    },

    // Glyph Abilities - Protective/Utility Powers
    glyph: {
        name: 'Glyph Abilities',
        abilities: {
            'Shield Glyph': {
                description: 'Create a protective energy barrier.',
                fluxCost: 2,
                effect: '+5 armor for 1 round per FLUX',
                duration: '1 round/FLUX',
                category: 'glyph'
            },
            'Healing Glyph': {
                description: 'Heal wounds using Flux energy.',
                fluxCost: 3,
                effect: 'Heal 1d10 HP',
                category: 'glyph'
            },
            'Speed Glyph': {
                description: 'Enhance target speed and reflexes.',
                fluxCost: 2,
                effect: '+2 DEX for 1 round per FLUX',
                duration: '1 round/FLUX',
                category: 'glyph'
            },
            'Strength Glyph': {
                description: 'Enhance target physical strength.',
                fluxCost: 2,
                effect: '+2 STR for 1 round per FLUX',
                duration: '1 round/FLUX',
                category: 'glyph'
            }
        }
    },

    // Science Friction - Techno-Psychic Powers
    scienceFriction: {
        name: 'Science Friction',
        abilities: {
            'Machine Ghost': {
                description: 'Control machines remotely.',
                fluxCost: 2,
                effect: 'Control simple machines within 20m',
                duration: '1 round per FLUX',
                category: 'science'
            },
            'Tech Disrupt': {
                description: 'Disrupt electronic devices.',
                fluxCost: 1,
                effect: 'Disable tech within 10m radius',
                category: 'science'
            },
            'Data Ghost': {
                description: 'Create false data patterns.',
                fluxCost: 2,
                effect: 'Alter or create electronic data',
                category: 'science'
            }
        }
    },

    // DeathSuit Abilities - Special Ebon Armor
    deathsuit: {
        name: 'DeathSuit Abilities',
        abilities: {
            'DeathSuit Basic': {
                description: 'Basic DeathSuit provides protection and Flux enhancement.',
                fluxCost: 0,
                effect: '+2 armor, +1 FLUX',
                category: 'deathsuit'
            },
            'DeathSuit Enhanced': {
                description: 'Enhanced DeathSuit with advanced systems.',
                fluxCost: 1,
                effect: '+4 armor, +2 FLUX, +1 DEX',
                category: 'deathsuit'
            },
            'DeathSuit Advanced': {
                description: 'Advanced DeathSuit with full systems.',
                fluxCost: 2,
                effect: '+6 armor, +3 FLUX, +2 DEX, +1 CONC',
                category: 'deathsuit'
            }
        }
    },

    // Necanthrope Traits - Brain Waster Specific
    necanthrope: {
        name: 'Necanthrope Traits',
        abilities: {
            'Corrupted Mind': {
                description: 'Corrupted Flux ability that destabilizes targets.',
                fluxCost: 2,
                effect: 'Target must make DIA check or be confused',
                category: 'necanthrope'
            },
            'Flux Scream': {
                description: 'Psychic scream that damages multiple targets.',
                fluxCost: 3,
                damage: '2d10 to all within 15m',
                category: 'necanthrope'
            },
            'Mutation': {
                description: 'Corrupted mutation that enhances the Brain Waster.',
                fluxCost: 4,
                effect: '+3 STR, -1 CHA permanently',
                category: 'necanthrope',
                permanent: true
            }
        }
    }
};

// Formulae - Packaged Flux Abilities
const FORMULAE = {
    'Basic Flux Kit': {
        description: 'Starter package for new Ebon users.',
        abilities: ['Flux Bolt', 'Shield Glyph'],
        points: 5
    },
    'Combat Flux Kit': {
        description: 'Combat-oriented Flux abilities.',
        abilities: ['Flux Blast', 'Mental Blast', 'Speed Glyph'],
        points: 10
    },
    'Support Flux Kit': {
        description: 'Support and healing Flux abilities.',
        abilities: ['Healing Glyph', 'Shield Glyph', 'Strength Glyph'],
        points: 10
    },
    'Tech Flux Kit': {
        description: 'Techno-psychic Flux abilities.',
        abilities: ['Machine Ghost', 'Tech Disrupt', 'Data Ghost'],
        points: 10
    },
    'Brain Waster Kit': {
        description: 'Corrupted Flux abilities for Brain Wasters.',
        abilities: ['Corrupted Mind', 'Flux Scream'],
        points: 10
    },
    'DeathSuit Mastery': {
        description: 'Full DeathSuit proficiency.',
        abilities: ['DeathSuit Advanced'],
        points: 15
    }
};

// Flux stat functions
function getFluxStartingValue() {
    return 10;
}

function getFluxIncreaseCost() {
    return 5; // Points per FLUX increase during generation
}

function getFluxPlayIncreaseCost() {
    return 2; // Points per FLUX increase during play
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EBON_ABILITIES;
}
