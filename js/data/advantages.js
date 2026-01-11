// SLA Industries Character Generator - Advantages/Disadvantages Data

const ADVANTAGES = {
    // Physical Advantages
    physical: {
        name: 'Physical Advantages',
        items: {
            'Good Looks': {
                type: 'advantage',
                description: 'Attractive appearance that helps in social situations.',
                basePoints: 1,
                maxRank: 5,
                stackingMultiplier: 1
            },
            'Bad Looks': {
                type: 'disadvantage',
                description: 'Unattractive appearance that hinders social interactions.',
                basePoints: -1,
                maxRank: 5,
                stackingMultiplier: 1
            },
            'Good Hearing': {
                type: 'advantage',
                description: 'Enhanced auditory perception.',
                basePoints: 1,
                maxRank: 5,
                stackingMultiplier: 1
            },
            'Bad Hearing': {
                type: 'disadvantage',
                description: 'Impaired hearing ability.',
                basePoints: -1,
                maxRank: 5,
                stackingMultiplier: 1
            },
            'Good Eyesight': {
                type: 'advantage',
                description: 'Excellent visual acuity and perception.',
                basePoints: 1,
                maxRank: 5,
                stackingMultiplier: 1
            },
            'Bad Eyesight': {
                type: 'disadvantage',
                description: 'Impaired vision requiring correction.',
                basePoints: -1,
                maxRank: 5,
                stackingMultiplier: 1
            },
            'Fast Healing': {
                type: 'advantage',
                description: 'Recovers from injuries at accelerated rate.',
                basePoints: 3,
                maxRank: 3,
                stackingMultiplier: 1
            },
            'Ambidextrous': {
                type: 'advantage',
                description: 'Can use both hands equally well.',
                basePoints: 2,
                maxRank: 1,
                stackingMultiplier: 1
            },
            'High Pain Threshold': {
                type: 'advantage',
                description: 'Resistant to pain and its effects.',
                basePoints: 2,
                maxRank: 1,
                stackingMultiplier: 1
            }
        }
    },

    // Mental Advantages
    mental: {
        name: 'Mental Advantages',
        items: {
            'Eidetic Memory': {
                type: 'advantage',
                description: 'Perfect recall of information.',
                basePoints: 3,
                maxRank: 1,
                stackingMultiplier: 1
            },
            'Photographic Memory': {
                type: 'advantage',
                description: 'Perfect visual memory.',
                basePoints: 4,
                maxRank: 1,
                stackingMultiplier: 1
            },
            'Mathematical Genius': {
                type: 'advantage',
                description: 'Exceptional mathematical ability.',
                basePoints: 2,
                maxRank: 1,
                stackingMultiplier: 1
            }
        }
    },

    // Professional Advantages
    professional: {
        name: 'Professional Advantages',
        items: {
            'Corporate Sponsorship': {
                type: 'advantage',
                description: 'Financial backing from an SLA corporation.',
                basePoints: 2,
                maxRank: 5,
                stackingMultiplier: 1
            },
            'Media Connections': {
                type: 'advantage',
                description: 'Favorable treatment from media outlets.',
                basePoints: 2,
                maxRank: 3,
                stackingMultiplier: 1
            },
            'Street Connections': {
                type: 'advantage',
                description: 'Contacts in gangs and street communities.',
                basePoints: 2,
                maxRank: 3,
                stackingMultiplier: 1
            },
            'Cybernetic Enhancement': {
                type: 'advantage',
                description: 'Pre-installed cybernetic implants.',
                basePoints: 3,
                maxRank: 5,
                stackingMultiplier: 1
            }
        }
    },

    // Mental Disadvantages
    mentalDis: {
        name: 'Mental Disadvantages',
        items: {
            'Phobia': {
                type: 'disadvantage',
                description: 'Irrational fear causing panic checks.',
                basePoints: -2,
                maxRank: 5,
                stackingMultiplier: 1
            },
            'Obsession': {
                type: 'disadvantage',
                description: 'Driven by specific goals or targets.',
                basePoints: -2,
                maxRank: 5,
                stackingMultiplier: 1
            },
            'Vengeful': {
                type: 'disadvantage',
                description: 'Seeks revenge against enemies.',
                basePoints: -2,
                maxRank: 5,
                stackingMultiplier: 1
            },
            'Addiction': {
                type: 'disadvantage',
                description: 'Dependent on drugs or stimulants.',
                basePoints: -3,
                maxRank: 5,
                stackingMultiplier: 1
            },
            'Paranoia': {
                type: 'disadvantage',
                description: 'Distrusts everyone, always suspicious.',
                basePoints: -2,
                maxRank: 5,
                stackingMultiplier: 1
            }
        }
    },

    // Physical Disadvantages
    physicalDis: {
        name: 'Physical Disadvantages',
        items: {
            'Cybernetic Reliance': {
                type: 'disadvantage',
                description: 'Must have cybernetics to function properly.',
                basePoints: -2,
                maxRank: 5,
                stackingMultiplier: 1
            },
            'One-Handed': {
                type: 'disadvantage',
                description: 'Missing or disabled limb.',
                basePoints: -4,
                maxRank: 1,
                stackingMultiplier: 1
            },
            'Deaf': {
                type: 'disadvantage',
                description: 'Complete hearing loss.',
                basePoints: -4,
                maxRank: 1,
                stackingMultiplier: 1
            },
            'Blind': {
                type: 'disadvantage',
                description: 'Complete vision loss.',
                basePoints: -6,
                maxRank: 1,
                stackingMultiplier: 1
            },
            'Frail': {
                type: 'disadvantage',
                description: 'Physically weak constitution.',
                basePoints: -2,
                maxRank: 5,
                stackingMultiplier: 1
            }
        }
    }
};

// Get points for an advantage/disadvantage at a given rank
function getAdvantagePoints(advantage, rank) {
    return advantage.basePoints * rank;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ADVANTAGES;
}
