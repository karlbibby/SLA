// SLA Industries - Drug Data (reworked to match provided drug descriptions)

const DRUGS = {
    combat: {
        name: 'Combat Drugs',
        description: 'Performance and combat-focused pharmaceuticals used by SLA Industries operatives.',
        drugs: [
            {
                name: 'Rush',
                category: 'combat_stimulant',
                cost: 15,
                availability: 'restricted',
                description: 'The first mass-produced combat drug used to improve combat effectiveness. Strong stimulant with healing adjuncts; accelerates blood flow and adrenaline.',
                effects: {
                    game: '1 free action per round; duration 6 hours; no PHYS (Physique) rolls while active; damage taken reduced by 25%'
                },
                addiction: {
                    rate: '1 per 4 doses',
                    effects: '-1 PHYS per 4 doses',
                    type: 'continuous'
                },
                detox: {
                    effects: '-1 STR, -1 PHYS, -1 HITS (permanent)'
                },
                notes: 'Contains healing agents that partially mitigate tissue wear while active. Long-term use increases heart disease, stroke and brain damage risk; average life expectancy ≈ 7 years for heavy users.'
            },
            {
                name: 'Ultra Violence',
                category: 'combat_stimulant_advanced',
                cost: 15,
                availability: 'illegal_restricted',
                description: 'Next-generation combat drug; concentrated version of Rush with powerful hallucinogenics producing near-indestructible sensations at severe long-term cost.',
                effects: {
                    game: '2 free phases per round; duration 12 hours; no PHYS or COOL rolls while active; damage taken reduced by 50%'
                },
                addiction: {
                    rate: '1 per dose',
                    effects: '-1 PHYS per dose; +3 Ranks Psychosis',
                    type: 'continuous'
                },
                detox: {
                    effects: '-2 STR, -2 PHYS, -2 HITS (permanent)'
                },
                notes: 'Severely burns out the user—average lifespan ≈ 2 years for heavy users.'
            },
            {
                name: 'Pineal Stim',
                category: 'ebon_flux_adjuvant',
                cost: 20,
                availability: 'rare',
                description: 'Developed for Ebon races; enhances personal enhancement abilities and body-manipulation powers but can cause painful flux-related decline if misused.',
                effects: {
                    game: 'Doubles duration for Personal Enhancement abilities (flux/applications as GM adjudicates)'
                },
                addiction: {
                    rate: '2 per day',
                    effects: '-1 PHYS per 2 doses',
                    type: 'habit'
                },
                detox: {
                    effects: '-1 CONC, -2 FLUX, -1 Rank Personal Enhancement (permanent)'
                },
                notes: 'Physically mild in most cases but can cause brain haemorrhaging or permanent loss of flux power if abused.'
            },
            {
                name: 'Shatter',
                category: 'mutagenic_stimulant',
                cost: null,
                availability: 'illegal_black_market',
                description: 'A dangerous, unstable stimulant produced sporadically by DarkNight. Chemical contamination and mutant DNA-alteration codes make this extremely hazardous.',
                effects: {
                    game: 'Behaves similarly to Ultra Violence but with high risk of bodily mutation and erratic side effects; use discouraged and often lethal'
                },
                addiction: {
                    rate: 'variable',
                    effects: 'Severe addiction and physiological alteration; GM discretion',
                    type: 'continuous'
                },
                detox: {
                    effects: 'Unknown — often results in permanent mutation or death'
                },
                notes: 'Possession by operatives is capital offence. Produced and distributed by DarkNight in limited, forced quantities.'
            }
        ]
    },
    soft: {
        name: 'Soft (Recreational) Drugs',
        description: 'Non-medical pleasure and recreational drugs with varying social and mood effects.',
        drugs: [
            {
                name: 'Beat',
                category: 'recreational_relaxant',
                cost: 5,
                availability: 'common',
                description: 'Popular relaxation drug. Effects vary by user mood — can induce deep calm or, if the user is agitated, cause hyperactivity or aggression.',
                effects: {
                    game: '+2 COOL for 6 hours'
                },
                addiction: {
                    rate: '1 per day',
                    effects: '-1 PHYS per 2 doses',
                    type: 'daily'
                },
                detox: {
                    effects: '-1 CONC, -1 COOL (permanent)'
                },
                notes: 'Highly addictive despite mild initial effects.'
            },
            {
                name: 'Personal Interest',
                category: 'hallucinogenic_erotic',
                cost: 5,
                availability: 'common',
                description: 'Powerful hallucinogenic used to induce sensations equivalent to sexual intercourse; increases addiction figures for pleasure drugs.',
                effects: {
                    game: 'Duration ~1 hour (sensory hallucination)'
                },
                addiction: {
                    rate: '1 per day',
                    effects: '-1 PHYS per 4 doses',
                    type: 'daily'
                },
                detox: {
                    effects: '-1 COOL, -1 CONC (permanent)'
                },
                notes: 'Strong sensory bombardment leads to concentration and composure deficits after use.'
            }
        ]
    },
    medical: {
        name: 'Medical Drugs',
        description: 'Therapeutic and recovery drugs produced by the Soul Institute of Pharmacology.',
        drugs: [
            {
                name: 'Kick Start',
                category: 'healing_stimulant',
                cost: 5,
                availability: 'medical',
                description: 'Accelerates natural healing, aids coagulation, tissue regeneration and bone knitting. Widely used post-trauma.',
                effects: {
                    game: 'Recovers 2 HITS and stops 2 Wounds 3 phases after injection'
                },
                addiction: {
                    rate: '2 per day',
                    effects: '-1 PHYS per 30 doses',
                    type: 'rare'
                },
                detox: {
                    effects: '-1 PHYS, -2 HITS (permanent)'
                },
                notes: 'Occasional addiction in combat operatives; long-term use causes wasting and loss of physique.'
            },
            {
                name: 'Pain Away',
                category: 'analgesic_opiate_like',
                cost: 10,
                availability: 'restricted_medical',
                description: 'The most powerful painkiller created. Blocks pain signals and raises pain threshold dramatically; can lead to craving for pain when abstinent.',
                effects: {
                    game: 'No PHYS rolls while active; duration 6 hours; 3 phases to take effect if used during combat'
                },
                addiction: {
                    rate: 'continuous',
                    effects: '-1 PHYS per 3 doses',
                    type: 'continuous'
                },
                detox: {
                    effects: '-2 PHYS, -1 COOL, Rank 1 Phobia: Pain (heightened) — permanent'
                },
                notes: 'Users have been known to adopt masochistic behaviours when dependent.'
            },
            {
                name: 'Flush',
                category: 'detoxifier',
                cost: 5,
                availability: 'medical',
                description: 'Developed to relieve drug addicts and remove effects of prior addictions. Taken daily for ~30 days to purge impurities.',
                effects: {
                    game: 'Prevents the Detox effects of other drugs while taken'
                },
                addiction: {
                    rate: '1 per day',
                    effects: '-1 PHYS per 30 doses',
                    type: 'daily'
                },
                detox: {
                    effects: '-1 PHYS (permanent) — rare'
                },
                notes: 'Sometimes itself becomes addictive in rare instances.'
            },
            {
                name: 'Streak',
                category: 'psychosis_treatment_stimulant',
                cost: 20,
                availability: 'experimental',
                description: 'Originally intended to treat psychosis; functions as a powerful mental stimulant, heightening senses and perception but with high risk of brain damage or breakdown.',
                effects: {
                    game: '+2 to KNOW and CONC rolls for 1 hour'
                },
                addiction: {
                    rate: '1 per day',
                    effects: '-1 PHYS per 4 doses',
                    type: 'daily'
                },
                detox: {
                    effects: '-1 KNOW (permanent)'
                },
                notes: 'Use can produce long-term cognitive harm if misused.'
            },
            {
                name: 'Honesty',
                category: 'truth_serum',
                cost: 10,
                availability: 'controlled',
                description: 'Potent truth serum rendering subjects incapable of lying; used in extractions and interrogations.',
                effects: {
                    game: 'Duration ~30 minutes; subject cannot lie while effected'
                },
                addiction: {
                    rate: '2 per day',
                    effects: '-1 PHYS per 4 doses',
                    type: 'occasional'
                },
                detox: {
                    effects: '-1 CONC (permanent)'
                },
                notes: 'Extended dependency without Flush can leave subjects in vegetative-like, compliant states.'
            },
            {
                name: 'White Noise',
                category: 'dream_suppressant',
                cost: 10,
                availability: 'ebon_medical',
                description: 'Used to suppress Dream Demon nightmares in Ebons. Should be continued until the Ebon has fully turned, otherwise nightmares return.',
                effects: {
                    game: 'Stops Dream Demon nightmares while taken'
                },
                addiction: {
                    rate: '1 per day',
                    effects: '-1 PHYS per 5 doses',
                    type: 'daily'
                },
                detox: {
                    effects: 'Nightmares will return if treatment stops'
                },
                notes: 'Therapeutic for Ebons undergoing transition; cessation returns symptoms.'
            }
        ]
    },
    general_use_medical: {
        name: 'General Use Medical Drugs',
        description: 'Over-the-counter and general medical supplies available to civilians and low-clearance purchasers.',
        drugs: [
            {
                name: 'Pro-cane',
                type: 'Analgesic',
                amount: '50 Tablets',
                cost: 20,
                scl: 'Civilian'
            },
            {
                name: 'Pain solver',
                type: 'Analgesic',
                amount: '50 Tablets',
                cost: 30,
                scl: 'Civilian'
            },
            {
                name: 'Pre-solv Steroids',
                type: 'Steroids',
                amount: '30 Tablets',
                cost: 50,
                scl: 'Civilian',
                notes: '1 tablet/day after four hours exercise for 1 month = +1 STR'
            },
            {
                name: 'Aprolap Vitamins',
                type: 'Vitamins',
                amount: '100 Tablets',
                cost: 3,
                scl: 'Civilian'
            },
            {
                name: 'Glowgood',
                type: 'Anti-depressant',
                amount: '50 Tablets',
                cost: 50,
                scl: 'Civilian'
            },
            {
                name: 'Feelgood',
                type: 'Anti-depressant',
                amount: '20 Cigarettes',
                cost: 3,
                scl: 'Civilian'
            },
            {
                name: 'Bio-block',
                type: 'Anaesthetic',
                amount: '20 vials',
                cost: 100,
                scl: '11'
            },
            {
                name: 'Hyponock',
                type: 'Stimulant',
                amount: '40 Tablets',
                cost: 30,
                scl: 'Civilian'
            }
        ]
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = DRUGS;
}
