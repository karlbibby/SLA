// SLA Industries Character Generator - Race Data

const RACES = {
    human: {
        id: 'human',
        name: 'Human',
        description: 'The versatile baseline species of Mort. Humans adapt well to any role and form the backbone of SLA Industries operations.',
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
        special: 'Balanced stats with no racial penalties or bonuses',
        fluxUser: false,
        freeSkills: {
            Literacy: 1,
            Detect: 1,
            "SLA Information": 2,
            "Rival Company": 1,
            Streetwise: 2,
            "Unarmed Combat": 1
        }
    },
    frother: {
        id: 'frother',
        name: 'Frother',
        description: 'Genetically modified workers bred for strength and stamina. Frothers are physically powerful but less intellectually inclined.',
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
        special: '+2 STR, -2 DIA maximum. Industrial workers with enhanced musculature.',
        fluxUser: false,
        freeSkills: {
            Detect: 1,
            "SLA Information": 1,
            "Rival Company": 1,
            Streetwise: 2,
            "Unarmed Combat": 2,
            "Evaluate Opponent": 1
        }
    },
    ebon: {
        id: 'ebon',
        name: 'Ebon',
        description: 'Psychic humans with the ability to channel Ebon Flux. Ebons are rare and valued for their mental abilities.',
        move: {
            walk: 1,
            run: 2,
            sprint: 3
        },
        statMaximums: {
            STR: { min: 5, max: 9 },
            DEX: { min: 5, max: 10 },
            DIA: { min: 5, max: 10 },
            CONC: { min: 5, max: 13 },
            CHA: { min: 5, max: 13 },
            COOL: { min: 5, max: 9 }
        },
        special: 'Flux users. Higher CONC and CHA maximums. Can use Ebon Abilities.',
        fluxUser: true,
        freeSkills: {
            Literacy: 1,
            Detect: 1,
            "Rival Company": 1,
            "SLA Information": 2,
            Communique: 2,
            Persuasion: 1
        }
    },
    brainWaster: {
        id: 'brainWaster',
        name: 'Brain Waster',
        description: 'Ebons mutated by concentrated Flux exposure. Brain Wasters have corrupted psychic abilities and eerie physical features.',
        move: {
            walk: 1,
            run: 2,
            sprint: 3
        },
        statMaximums: {
            STR: { min: 5, max: 11 },
            DEX: { min: 5, max: 10 },
            DIA: { min: 5, max: 10 },
            CONC: { min: 5, max: 11 },
            CHA: { min: 5, max: 8 },
            COOL: { min: 5, max: 11 }
        },
        special: 'Flux users with corrupted abilities. Higher STR/CONC but lower CHA.',
        fluxUser: true,
        freeSkills: {
            Intimidate: 2,
            "Unarmed Combat": 2,
            Streetwise: 1,
            Literacy: 1,
            Detect: 1,
            "SLA Information": 1
        }
    },
    wraithRaider: {
        id: 'wraithRaider',
        name: 'Wraith Raider',
        description: 'Arctic survivors with pale features and keen senses. Wraith Raiders are agile scouts and expert navigators.',
        move: {
            walk: 2,
            run: 4,
            sprint: 6
        },
        statMaximums: {
            STR: { min: 5, max: 10 },
            DEX: { min: 5, max: 15 },
            DIA: { min: 5, max: 12 },
            CONC: { min: 5, max: 9 },
            CHA: { min: 5, max: 10 },
            COOL: { min: 5, max: 8 }
        },
        special: 'Highest DEX maximum. Enhanced perception from arctic survival.',
        fluxUser: false,
        freeSkills: {
            Detect: 1,
            "SLA Information": 1,
            "Rival Company": 1,
            Streetwise: 2,
            Sneaking: 2,
            Hide: 2
        }
    },
    shaktar: {
        id: 'shaktar',
        name: 'Shaktar',
        description: 'Warrior race with ritual scarification and combat training. Shaktars are formidable combatants.',
        move: {
            walk: 1,
            run: 3,
            sprint: 5
        },
        statMaximums: {
            STR: { min: 5, max: 13 },
            DEX: { min: 5, max: 13 },
            DIA: { min: 5, max: 8 },
            CONC: { min: 5, max: 8 },
            CHA: { min: 5, max: 9 },
            COOL: { min: 5, max: 12 }
        },
        special: 'High STR/DEX/COOL. Natural warriors with combat bonuses.',
        fluxUser: false,
        freeSkills: {
            "Unarmed Combat": 2,
            Detect: 1,
            "Evaluate Opponent": 1,
            "Rival Company": 1,
            Survival: 2,
            Climb: 2
        }
    },
    stormer: {
        id: 'stormer',
        name: 'Stormer 313',
        description: 'Biogenetic super-soldiers created for warfare. Stormers are living weapons with enhanced physiology.',
        move: {
            walk: 1,
            run: 2.5,
            sprint: 4
        },
        statMaximums: {
            STR: { min: 5, max: 15 },
            DEX: { min: 5, max: 13 },
            DIA: { min: 5, max: 8 },
            CONC: { min: 5, max: 8 },
            CHA: { min: 5, max: 8 },
            COOL: { min: 5, max: 15 }
        },
        special: 'Highest STR and COOL maximums. Biogenetic warriors with enhanced durability.',
        fluxUser: false,
        freeSkills: {
            "Unarmed Combat": 2,
            "SLA Information": 1,
            "Rival Company": 1,
            Intimidate: 2,
            Streetwise: 1,
            "Evaluate Opponent": 1
        }
    },
    vevaphon: {
        id: 'vevaphon',
        name: 'Vevaphon',
        description: "The Vevaphon, or 'Vev' for short, is the first creation to step forward from the Doppleganger Institute. A biogenetic polymorph, able to take on different shapes and forms through the manipulation of individual cells in their body by the million.",
        move: {
            walk: 1,
            run: 2,
            sprint: 4
        },
        statMaximums: {
            STR: { min: 5, max: 10 },
            DEX: { min: 5, max: 10 },
            DIA: { min: 5, max: 10 },
            CONC: { min: 5, max: 10 },
            CHA: { min: 5, max: 10 },
            COOL: { min: 5, max: 10 }
        },
        special: 'Biogenetic polymorphs with adaptable cell structure.',
        fluxUser: false,
        freeSkills: {
            Detect: 1,
            "SLA Information": 1,
            "Unarmed Combat": 1,
            "Blade, 1-H": 1,
            Sneaking: 2,
            Sleight: 2
        },
        racialAbilities: [
            {
                name: 'Cellular Adaptation',
                type: 'passive',
                shortDesc: 'Vevaphons can adapt their cellular structure to resist specific damage types',
                description: `**Innate Adaptation**: Through conscious cellular manipulation, a Vevaphon can attune their physiology to resist specific damage types. 

- **Adaptation Limit**: Maximum 3 damage type adaptations active simultaneously
- **Protection**: Each active adaptation grants **+2 PV** against that damage type
- **Duration**: Adaptations remain active until dismissed or changed
- **Activation**: Switching adaptations requires **10 minutes** of concentration
- **Supported Types**: Physical, Energy, Chemical, Biological, Radiation`,
                mechanics: {
                    pv: 2,
                    statMods: null,
                    cost: 'Inherent',
                    costType: 'racial',
                    duration: 'Sustained'
                }
            },
            {
                name: 'Regenerative Cells',
                type: 'passive',
                shortDesc: 'Natural cellular regeneration heals wounds over time',
                description: `**Enhanced Regeneration**: Vevaphon biology includes a natural healing mechanism at the cellular level.

- **Natural Healing**: Vevaphons recover **+1 hit point per hour** of rest
- **Accelerated Recovery**: With medical care, healing rate increases to **+2 hit points per hour**
- **Kick Start**: Can perform "Kick Start" protocol once per day, immediately recovering **4 hit points** at a cost of 2 COOL
- **Limitations**: Extreme damage (heavy trauma, dismemberment) may require medical intervention
- **Regeneration Rate**: Does not stack with other healing abilities; use highest available rate`,
                mechanics: {
                    healing: 1,
                    duration: 'Ongoing',
                    cost: 'Free (1 COOL per Kick Start)',
                    costType: 'racial'
                }
            }
        ]
    },
    chagrin: {
        id: 'chagrin',
        name: 'Stormer 714 - Chargrin',
        description: 'The Chagrin is designed to be the optimum combat efficient, self supporting, SLA soldier. This is a role that they fulfil perfectly. These unquestionably loyal killing machines are the perfect breed.',
        move: {
            walk: 1,
            run: 2,
            sprint: 3.5
        },
        statMaximums: {
            STR: { min: 5, max: 20 },
            DEX: { min: 5, max: 12 },
            DIA: { min: 1, max: 5 },
            CONC: { min: 2, max: 7 },
            CHA: { min: 1, max: 3 },
            COOL: { min: 5, max: 15 }
        },
        special: 'Lower minimum stats for this race only. Genetically engineered combat soldiers optimized for efficiency and loyalty.',
        fluxUser: false,
        freeSkills: {
            "Unarmed Combat": 3,
            Intimidate: 2,
            "Evaluate Opponent": 1
        }
    },
    xeno: {
        id: 'xeno',
        name: 'Stormer 711 - Xeno',
        description: 'The Stormers 313 and 714 are the muscle, the strong arm of SLA Industries, but Karma wanted more from their designers. The Xeno (Ze-no) is the first successful attempt at such diversification.',
        move: {
            walk: 2,
            run: 4,
            sprint: 6
        },
        statMaximums: {
            STR: { min: 5, max: 13 },
            DEX: { min: 5, max: 15 },
            DIA: { min: 5, max: 10 },
            CONC: { min: 5, max: 9 },
            CHA: { min: 5, max: 7 },
            COOL: { min: 5, max: 12 }
        },
        special: 'Biogenetic diversification beyond Stormer templates.',
        fluxUser: false,
        freeSkills: {
            "Unarmed Combat": 2,
            "SLA Information": 1,
            Sneaking: 1,
            Hide: 2,
            Climb: 1
        },
        racialAbilities: [
            {
                name: 'Enhanced Reflexes',
                type: 'passive',
                shortDesc: 'Xenos possess accelerated neural processing and reaction time',
                description: `**Genetic Combat Enhancement**: Xenos are engineered with optimized neuromuscular systems for rapid response.

- **Initiative Bonus**: Xenos gain **+2 to Initiative rolls** in combat
- **Action Efficiency**: Movement actions are **10% faster** than base movement rates
- **Reaction Window**: Can react to threats **1 round before** normal reaction timing
- **Sustained Benefit**: This enhancement is always active; no activation or deactivation required
- **Stacking**: Does not stack with other initiative or speed bonuses; use the highest available bonus`,
                mechanics: {
                    statMods: {
                        initiative: 2,
                        movementModifier: 1.1
                    },
                    cost: 'Inherent',
                    costType: 'racial',
                    duration: 'Ongoing'
                }
            },
            {
                name: 'Predatory Senses',
                type: 'passive',
                shortDesc: 'Xenos have heightened sensory perception for tracking and hunting',
                description: `**Engineered Sensory Superiority**: Xeno design includes enhanced sensory organs and neural processing for environmental awareness.

- **Detection Bonus**: Gain **+3 to Detect skill checks** for spotting movement or heat signatures
- **Night Vision**: Natural **thermal vision** allowing operation in complete darkness (100m range)
- **Tracking**: Can follow **scent trails** with exceptional accuracy (Survival skill +2 bonus)
- **Targeting**: In ranged combat, enemies gain **-1 to Defense** against Xeno ranged attacks
- **Sensory Limitation**: Extreme sensory input (bright flashes, loud noises) causes **-1 COOL until recovered**`,
                mechanics: {
                    statMods: {
                        detectBonus: 3,
                        survivalBonus: 2,
                        enemyDefenseMalus: 1
                    },
                    cost: 'Inherent',
                    costType: 'racial',
                    duration: 'Ongoing'
                }
            }
        ]
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RACES;
}
