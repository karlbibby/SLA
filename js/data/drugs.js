// SLA Industries - Drug Data

const DRUGS = {
    combat_stimulants: {
        name: 'Combat Stimulants',
        description: 'Performance-enhancing drugs for combat situations',
        drugs: [
            {
                name: 'Redline-9',
                category: 'combat_stim',
                cost_uni: 30,
                availability: 'restricted',
                effects: {
                    stat_modifiers: [
                        { stat: 'DEX', delta: 2, duration_rounds: 5 },
                        { stat: 'COOL', delta: 1, duration_rounds: 5 }
                    ],
                    skill_modifiers: [],
                    other_effects: ['Initiative improved as per higher DEX', 'Ignore first 1 point of recoil penalty']
                },
                side_effects: {
                    crash: { stat: 'COOL', delta: -1, duration_hours: 1 },
                    timing: 'after_5_rounds'
                },
                addiction: {
                    check_frequency: 'daily',
                    difficulty: 'moderate',
                    failure_effect: 'Must take Redline-9 or suffer −1 COOL that day'
                },
                legal_status: 'restricted'
            },
            {
                name: 'Stormshot',
                category: 'combat_stim_focus',
                cost_uni: 40,
                availability: 'restricted',
                effects: {
                    stat_modifiers: [],
                    skill_modifiers: [
                        { skill: 'Rifle', delta: 2, duration_rounds: 3 },
                        { skill: 'Pistol', delta: 2, duration_rounds: 3 },
                        { skill: 'Marksman', delta: 2, duration_rounds: 3 }
                    ],
                    other_effects: ['Ignore first 1 point of recoil penalty']
                },
                side_effects: {
                    crash: { skills: ['Rifle', 'Pistol', 'Shotgun', 'Heavy Weapons', 'Marksman'], delta: -2, duration_minutes: 30 },
                    timing: 'after_effect_ends'
                },
                addiction: {
                    check_frequency: 'every_third_dose',
                    difficulty: 'moderate',
                    failure_effect: '−1 to all non-combat social rolls when sober'
                },
                legal_status: 'restricted'
            }
        ]
    },
    anti_shock_pain: {
        name: 'Anti-Shock & Pain',
        description: 'Medical drugs for pain management and trauma response',
        drugs: [
            {
                name: 'Numbra-k',
                category: 'anti_shock_analgesic',
                cost_uni: 20,
                availability: 'common',
                effects: {
                    stat_modifiers: [],
                    skill_modifiers: [],
                    other_effects: [
                        'Ignore first 3 points of pain penalties for 1 hour',
                        'Counts as basic stabiliser: +1 to checks to stay conscious at low HP'
                    ]
                },
                side_effects: {
                    crash: { stat: 'DEX', delta: -1, duration_hours: 1 },
                    timing: 'after_1_hour'
                },
                addiction: {
                    check_frequency: 'weekly',
                    difficulty: 'low',
                    failure_effect: 'None significant'
                },
                legal_status: 'licensed'
            },
            {
                name: 'BlackFlood',
                category: 'emergency_trauma',
                cost_uni: 60,
                availability: 'restricted',
                effects: {
                    stat_modifiers: [],
                    skill_modifiers: [],
                    other_effects: [
                        'Immediately restores 3 HP (cannot exceed normal max)',
                        'Immune to stun effects and fear penalties from injury for 10 minutes'
                    ]
                },
                side_effects: {
                    crash: [
                        { damage: '1d3', type: 'body_overload' },
                        { check: 'COOL', failure_effect: 'Fatigued: −1 to all physical skills for 1 hour' }
                    ],
                    timing: 'after_10_minutes'
                },
                addiction: {
                    check_frequency: 'per_use',
                    difficulty: 'moderate',
                    failure_effect: 'Seeks BlackFlood whenever wounded'
                },
                legal_status: 'restricted_medical'
            }
        ]
    },
    focus_enhancers: {
        name: 'Focus Enhancers',
        description: 'Cognitive and perception enhancement drugs',
        drugs: [
            {
                name: 'WhiteWire',
                category: 'concentration_booster',
                cost_uni: 35,
                availability: 'common',
                effects: {
                    stat_modifiers: [
                        { stat: 'CONC', delta: 2, duration_minutes: 30 },
                        { stat: 'KNOW', delta: 1, duration_minutes: 30 }
                    ],
                    skill_modifiers: [
                        { skill: 'Elint', delta: 1, duration_minutes: 30 },
                        { skill: 'Hacking', delta: 1, duration_minutes: 30 },
                        { skill: 'Science', delta: 1, duration_minutes: 30 },
                        { skill: 'Medicine', delta: 1, duration_minutes: 30 }
                    ]
                },
                side_effects: {
                    crash: [
                        { stat: 'CONC', delta: -1, duration_hours: 2 },
                        { effect: '−2 to Sleep-related tests that day' }
                    ],
                    timing: 'after_30_minutes'
                },
                addiction: {
                    check_frequency: 'per_complex_task',
                    difficulty: 'moderate',
                    failure_effect: '−1 to KNOW/CONC checks without dose'
                },
                legal_status: 'licensed'
            },
            {
                name: 'GhostFocus',
                category: 'perception_enhancer',
                cost_uni: 30,
                availability: 'common',
                effects: {
                    stat_modifiers: [],
                    skill_modifiers: [
                        { skill: 'Detect', delta: 2, duration_minutes: 20 },
                        { skill: 'Sense_Ambush', delta: 2, duration_minutes: 20 },
                        { skill: 'Sight', delta: 2, duration_minutes: 20 }
                    ],
                    other_effects: ['Once during duration: re-roll one failed perception test (keep better)']
                },
                side_effects: {
                    crash: { stat: 'COOL', delta: -1, duration_hours: 1 },
                    timing: 'after_effect'
                },
                addiction: {
                    check_frequency: 'moderate',
                    difficulty: 'low_moderate',
                    failure_effect: '−1 to social checks in crowded places'
                },
                legal_status: 'common'
            }
        ]
    },
    mood_social: {
        name: 'Mood & Social',
        description: 'Drugs affecting mood and social interactions',
        drugs: [
            {
                name: 'GlowDust',
                category: 'mood_enhancer_social',
                cost_uni: 15,
                availability: 'common',
                effects: {
                    stat_modifiers: [
                        { stat: 'CHA', delta: 1, duration_hours: 2 },
                        { stat: 'COOL', delta: 1, duration_hours: 2 }
                    ],
                    skill_modifiers: [
                        { skill: 'Flattery', delta: 1, duration_hours: 2 },
                        { skill: 'Persuasion', delta: 1, duration_hours: 2 }
                    ],
                    other_effects: ['+1 to social checks involving charisma']
                },
                side_effects: {
                    crash: { stat: 'COOL', delta: -1, duration_hours: 2 },
                    timing: 'after_2_hours'
                },
                addiction: {
                    check_frequency: 'weekly',
                    difficulty: 'low',
                    failure_effect: 'Minor depression (−1 to all social checks)'
                },
                legal_status: 'common'
            },
            {
                name: 'Starkadone',
                category: 'depression_mood',
                cost_uni: 25,
                availability: 'licensed',
                effects: {
                    stat_modifiers: [],
                    skill_modifiers: [],
                    other_effects: [
                        'Immune to fear effects from death/horror for 1 hour',
                        '+2 to COOL checks against panic'
                    ]
                },
                side_effects: {
                    crash: { stat: 'COOL', delta: -2, duration_hours: 6 },
                    timing: 'after_effect_ends'
                },
                addiction: {
                    check_frequency: 'daily',
                    difficulty: 'high',
                    failure_effect: 'Severe panic attacks when exposed to horror'
                },
                legal_status: 'licensed'
            }
        ]
    },
    flux_drugs: {
        name: 'Flux & Psychic',
        description: 'Psychic enhancement and flux-related substances',
        drugs: [
            {
                name: 'VoidDust',
                category: 'flux_enhancer',
                cost_uni: 50,
                availability: 'restricted',
                effects: {
                    stat_modifiers: [
                        { stat: 'CONC', delta: 2, duration_hours: 1 },
                        { stat: 'FLUX', delta: 2, duration_hours: 1 }
                    ],
                    skill_modifiers: [],
                    other_effects: [
                        '+1 to Flux power usage',
                        'Extended flux ability duration by 50%'
                    ]
                },
                side_effects: {
                    crash: [
                        { stat: 'CONC', delta: -2, duration_hours: 4 },
                        { check: 'DIA', failure_effect: 'Severe headaches (−2 to concentration checks)' }
                    ],
                    timing: 'after_1_hour'
                },
                addiction: {
                    check_frequency: 'per_use',
                    difficulty: 'high',
                    failure_effect: 'Cannot use Flux abilities without dose'
                },
                legal_status: 'restricted'
            }
        ]
    },
    performance: {
        name: 'Performance',
        description: 'Physical performance enhancing substances',
        drugs: [
            {
                name: 'Goliath',
                category: 'muscle_enhancer',
                cost_uni: 45,
                availability: 'restricted',
                effects: {
                    stat_modifiers: [
                        { stat: 'STR', delta: 2, duration_hours: 1 },
                        { stat: 'PHYS', delta: 2, duration_hours: 1 }
                    ],
                    skill_modifiers: [
                        { skill: 'Melee', delta: 1, duration_hours: 1 },
                        { skill: 'Running', delta: 1, duration_hours: 1 }
                    ],
                    other_effects: ['+1 to damage with melee weapons']
                },
                side_effects: {
                    crash: [
                        { stat: 'STR', delta: -1, duration_hours: 2 },
                        { damage: '1d3', type: 'muscle_strain' }
                    ],
                    timing: 'after_1_hour'
                },
                addiction: {
                    check_frequency: 'weekly',
                    difficulty: 'moderate_high',
                    failure_effect: '−2 to STR-based tests when not using'
                },
                legal_status: 'restricted'
            }
        ]
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DRUGS;
}
