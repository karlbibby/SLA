// SLA Industries - Enhanced Phobia Data

const PHOBIAS = {
    // Rank 1 Phobias (2 points each)
    rank1: {
        name: 'Rank 1 Phobias',
        description: 'Mild phobias causing minor penalties',
        phobia_data: {
            'Monophobia': {
                description: 'Fear of being alone',
                rank: 1,
                points: 2,
                triggers: ['being alone', 'isolated locations', 'separated from group'],
                cool_check: 12,
                effects: {
                    stat_modifiers: [{ stat: 'COOL', delta: -1 }],
                    skill_restrictions: [],
                    other_effects: ['Minor unease when alone']
                },
                treatment: {
                    duration_months: 1,
                    checks_required: 3,
                    cool_check: 12,
                    monthly_cost: 500
                }
            },
            'Hemophobia': {
                description: 'Fear of blood',
                rank: 1,
                points: 2,
                triggers: ['seeing blood', 'injuries', 'medical procedures'],
                cool_check: 12,
                effects: {
                    stat_modifiers: [{ stat: 'COOL', delta: -1 }],
                    skill_restrictions: ['Medicine'],
                    other_effects: ['−1 to Medicine checks when triggered']
                },
                treatment: {
                    duration_months: 1,
                    checks_required: 3,
                    cool_check: 12,
                    monthly_cost: 500
                }
            },
            'Nyctophobia': {
                description: 'Fear of darkness',
                rank: 1,
                points: 2,
                triggers: ['darkness', 'unlit areas', 'night operations without light'],
                cool_check: 12,
                effects: {
                    stat_modifiers: [{ stat: 'COOL', delta: -1 }],
                    skill_restrictions: ['Sight'],
                    other_effects: ['−1 to Sight in darkness']
                },
                treatment: {
                    duration_months: 1,
                    checks_required: 3,
                    cool_check: 12,
                    monthly_cost: 500
                }
            },
            'Thanatophobia': {
                description: 'Fear of death/dying',
                rank: 1,
                points: 2,
                triggers: ['mortality reminders', 'near-death experiences', 'death of others'],
                cool_check: 12,
                effects: {
                    stat_modifiers: [{ stat: 'COOL', delta: -1 }],
                    skill_restrictions: [],
                    other_effects: ['Hesitation in life-threatening situations']
                },
                treatment: {
                    duration_months: 2,
                    checks_required: 4,
                    cool_check: 13,
                    monthly_cost: 600
                }
            }
        }
    },
    
    // Rank 2 Phobias (4 points each)
    rank2: {
        name: 'Rank 2 Phobias',
        description: 'Moderate phobias causing significant penalties',
        phobia_data: {
            'Claustrophobia': {
                description: 'Fear of confined spaces',
                rank: 2,
                points: 4,
                triggers: ['elevators', 'tunnels', 'small rooms', 'armored suits'],
                cool_check: 15,
                effects: {
                    stat_modifiers: [{ stat: 'COOL', delta: -4 }],
                    skill_restrictions: ['all CONC-based skills'],
                    other_effects: ['Must make COOL check or exit confined space immediately']
                },
                treatment: {
                    duration_months: 3,
                    checks_required: 5,
                    cool_check: 15,
                    monthly_cost: 1500
                }
            },
            'Acrophobia': {
                description: 'Fear of heights',
                rank: 2,
                points: 4,
                triggers: ['high places', 'ledges', 'tall buildings', 'flying'],
                cool_check: 15,
                effects: {
                    stat_modifiers: [{ stat: 'COOL', delta: -3 }],
                    skill_restrictions: ['Climbing', 'Running'],
                    other_effects: ['−2 to PHYS-based checks at heights']
                },
                treatment: {
                    duration_months: 3,
                    checks_required: 5,
                    cool_check: 15,
                    monthly_cost: 1200
                }
            },
            'Social Phobia': {
                description: 'Fear of social situations',
                rank: 2,
                points: 4,
                triggers: ['public speaking', 'large crowds', 'authority figures'],
                cool_check: 15,
                effects: {
                    stat_modifiers: [{ stat: 'CHA', delta: -3 }, { stat: 'COOL', delta: -2 }],
                    skill_restrictions: ['Charisma', 'Flattery', 'Persuasion'],
                    other_effects: ['−3 to all social checks']
                },
                treatment: {
                    duration_months: 3,
                    checks_required: 5,
                    cool_check: 15,
                    monthly_cost: 1000
                }
            },
            'Authority Phobia': {
                description: 'Fear of authority figures',
                rank: 2,
                points: 4,
                triggers: ['police', 'corporate security', 'officers', 'bosses'],
                cool_check: 15,
                effects: {
                    stat_modifiers: [{ stat: 'COOL', delta: -2 }],
                    skill_restrictions: ['Interrogation', 'Persuasion'],
                    other_effects: ['Cannot lie to authority figures without COOL check']
                },
                treatment: {
                    duration_months: 2,
                    checks_required: 4,
                    cool_check: 14,
                    monthly_cost: 1000
                }
            },
            'Performance Anxiety': {
                description: 'Fear of performing under pressure',
                rank: 2,
                points: 4,
                triggers: ['during missions', 'while being watched', 'time pressure'],
                cool_check: 15,
                effects: {
                    stat_modifiers: [{ stat: 'COOL', delta: -3 }],
                    skill_restrictions: ['Marksman', 'Gunnery'],
                    other_effects: ['−2 to combat skills when observed']
                },
                treatment: {
                    duration_months: 2,
                    checks_required: 4,
                    cool_check: 14,
                    monthly_cost: 800
                }
            }
        }
    },
    
    // Rank 3 Phobias (6 points each)
    rank3: {
        name: 'Rank 3 Phobias',
        description: 'Severe phobias causing extreme penalties',
        phobia_data: {
            'Pyrophobia': {
                description: 'Fear of fire',
                rank: 3,
                points: 6,
                triggers: ['fire', 'flames', 'heat sources', 'explosions'],
                cool_check: 18,
                effects: {
                    stat_modifiers: [{ stat: 'COOL', delta: -5 }],
                    skill_restrictions: ['all skills when fire is visible'],
                    other_effects: ['Must make COOL 18 check or flee from fire. Auto-fail when engulfed.']
                },
                treatment: {
                    duration_months: 4,
                    checks_required: 6,
                    cool_check: 18,
                    monthly_cost: 2000
                }
            },
            'Necrophobia': {
                description: 'Fear of death and corpses',
                rank: 3,
                points: 6,
                triggers: ['corpses', 'death', 'mortuary settings', 'gore'],
                cool_check: 18,
                effects: {
                    stat_modifiers: [{ stat: 'COOL', delta: -5 }],
                    skill_restrictions: ['Medicine', 'Interrogation'],
                    other_effects: ['Cannot operate normally around corpses']
                },
                treatment: {
                    duration_months: 4,
                    checks_required: 6,
                    cool_check: 18,
                    monthly_cost: 1800
                }
            },
            'Ballistophobia': {
                description: 'Fear of projectiles and bullets',
                rank: 3,
                points: 6,
                triggers: ['being shot at', 'crossfire', 'gunfire'],
                cool_check: 18,
                effects: {
                    stat_modifiers: [{ stat: 'COOL', delta: -4 }, { stat: 'DEX', delta: -2 }],
                    skill_restrictions: ['Pistol', 'Rifle', 'Shotgun', 'Heavy Weapons'],
                    other_effects: ['−4 to combat when under fire. Take cover reflexively.']
                },
                treatment: {
                    duration_months: 4,
                    checks_required: 6,
                    cool_check: 18,
                    monthly_cost: 2500
                }
            },
            'Agoraphobia': {
                description: 'Fear of open or public spaces',
                rank: 3,
                points: 6,
                triggers: ['open spaces', 'public marketplaces', 'exposed positions'],
                cool_check: 18,
                effects: {
                    stat_modifiers: [{ stat: 'COOL', delta: -4 }],
                    skill_restrictions: ['Streetwise', 'Running'],
                    other_effects: ['Cannot operate in open areas without COOL check']
                },
                treatment: {
                    duration_months: 5,
                    checks_required: 7,
                    cool_check: 18,
                    monthly_cost: 2200
                }
            },
            'Astraphobia': {
                description: 'Fear of storms and lightning',
                rank: 3,
                points: 6,
                triggers: ['storms', 'lightning', 'thunder', 'severe weather'],
                cool_check: 18,
                effects: {
                    stat_modifiers: [{ stat: 'COOL', delta: -4 }],
                    skill_restrictions: ['Sense Ambush', 'Detect'],
                    other_effects: ['−2 to perception during storms']
                },
                treatment: {
                    duration_months: 3,
                    checks_required: 5,
                    cool_check: 17,
                    monthly_cost: 1500
                }
            }
        }
    }
};

// Max phobias rules
const PHOBIA_RULES = {
    max_at_creation: 2,
    max_lifetime: 3,
    min_rank: 1,
    max_rank: 3,
    conflicting_pairs: [
        ['Agoraphobia', 'Claustrophobia'],
        ['Acrophobia', 'Astraphobia']
    ],
    can_stack_same_rank: false
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PHOBIAS, PHOBIA_RULES };
}
