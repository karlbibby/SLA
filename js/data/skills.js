// SLA Industries Character Generator - Skills Data

const SKILLS = {
    // Combat Skills (DEX-based)
    combat: {
        name: 'Combat Skills',
        skills: {
            'Melee': {
                governingStat: 'DEX',
                description: 'Unarmed and melee weapon combat',
                baseDescription: 'Basic training in fighting with weapons and fists'
            },
            'Pistol': {
                governingStat: 'DEX',
                description: 'Handgun proficiency',
                baseDescription: 'Training with pistols and small firearms'
            },
            'Rifle': {
                governingStat: 'DEX',
                description: 'Longarm proficiency',
                baseDescription: 'Training with rifles and carbines'
            },
            'Shotgun': {
                governingStat: 'DEX',
                description: 'Shotgun proficiency',
                baseDescription: 'Training with pump-action and auto-shotguns'
            },
            'Heavy Weapons': {
                governingStat: 'DEX',
                description: 'Heavy weapon operation',
                baseDescription: 'Training with miniguns, rocket launchers, etc.'
            },
            'Auto/Support Fire': {
                governingStat: 'DEX',
                description: 'Suppressive fire techniques',
                baseDescription: 'Training in automatic weapon suppression'
            },
            'Marksman': {
                governingStat: 'DEX',
                description: 'Precision aiming',
                baseDescription: 'Aimed shots and long-range precision'
            },
            'Dodge/Parry': {
                governingStat: 'DEX',
                description: 'Evasion and defense',
                baseDescription: 'Dodging attacks and parrying blows'
            }
        }
    },

    // Survival Skills (PHYS-based)
    survival: {
        name: 'Survival Skills',
        skills: {
            'Running': {
                governingStat: 'PHYS',
                description: 'Sprinting and endurance running',
                baseDescription: 'Long-distance running and sprinting'
            },
            'Climbing': {
                governingStat: 'PHYS',
                description: 'Climbing surfaces',
                baseDescription: 'Scaling walls, ropes, and obstacles'
            },
            'Jumping': {
                governingStat: 'PHYS',
                description: 'Leaping and jumping',
                baseDescription: 'Vertical and horizontal jumping'
            },
            'Swimming': {
                governingStat: 'PHYS',
                description: 'Water traversal',
                baseDescription: 'Swimming and underwater operations'
            },
            'Falling': {
                governingStat: 'PHYS',
                description: 'Safe falling techniques',
                baseDescription: 'Reducing fall damage through technique'
            }
        }
    },

    // Knowledge Skills (KNOW-based)
    knowledge: {
        name: 'Knowledge Skills',
        skills: {
            'Elint': {
                governingStat: 'KNOW',
                description: 'Electronic intelligence',
                baseDescription: 'Intercepting and analyzing electronic communications'
            },
            'SLA Info': {
                governingStat: 'KNOW',
                description: 'SLA corporate knowledge',
                baseDescription: 'Knowledge of SLA Industries structure and operations'
            },
            'Streetwise': {
                governingStat: 'KNOW',
                description: 'Underworld knowledge',
                baseDescription: 'Knowledge of criminal networks and street life'
            },
            'Interrogation': {
                governingStat: 'KNOW',
                description: 'Information extraction',
                baseDescription: 'Techniques for extracting information from subjects'
            },
            'Science': {
                governingStat: 'KNOW',
                description: 'General science',
                baseDescription: 'Scientific knowledge across disciplines'
            },
            'Physics': {
                governingStat: 'KNOW',
                description: 'Physics knowledge',
                baseDescription: 'Understanding of physical laws and principles'
            },
            'Chemistry': {
                governingStat: 'KNOW',
                description: 'Chemistry knowledge',
                baseDescription: 'Understanding of chemicals and reactions'
            },
            'Biology': {
                governingStat: 'KNOW',
                description: 'Biological sciences',
                baseDescription: 'Understanding of living organisms'
            },
            'Medicine': {
                governingStat: 'KNOW',
                description: 'Medical procedures',
                baseDescription: 'Healing injuries and treating conditions'
            },
            'Hacking': {
                governingStat: 'KNOW',
                description: 'Computer intrusion',
                baseDescription: 'Breaking into computer systems'
            },
            'Engineering': {
                governingStat: 'KNOW',
                description: 'Technical engineering',
                baseDescription: 'Building and repairing devices'
            },
            'Psychology': {
                governingStat: 'KNOW',
                description: 'Mental understanding',
                baseDescription: 'Understanding human behavior and motivation'
            },
            'Languages': {
                governingStat: 'KNOW',
                description: 'Language proficiency',
                baseDescription: 'Ability to speak and understand languages'
            }
        }
    },

    // Perception Skills
    perception: {
        name: 'Perception Skills',
        skills: {
            'Detect': {
                governingStat: 'DIA',
                description: 'Observation',
                baseDescription: 'Noticing hidden objects and details'
            },
            'Sense Ambush': {
                governingStat: 'DIA',
                description: 'Danger detection',
                baseDescription: 'Sensing ambushes and threats'
            },
            'Sight': {
                governingStat: 'DIA',
                description: 'Visual acuity',
                baseDescription: 'Sharpness of vision and observation'
            }
        }
    },

    // Social Skills (CHA-based)
    social: {
        name: 'Social Skills',
        skills: {
            'Charisma': {
                governingStat: 'CHA',
                description: 'Personal magnetism',
                baseDescription: 'General social appeal and presence'
            },
            'Flattery': {
                governingStat: 'CHA',
                description: 'Insincere praise',
                baseDescription: 'Using compliments to influence'
            },
            'Persuasion': {
                governingStat: 'CHA',
                description: 'Convincing others',
                baseDescription: 'Logical argument and convincing speech'
            },
            'Intimidation': {
                governingStat: 'CHA',
                description: 'Fear induction',
                baseDescription: 'Using threats and force of personality'
            },
            'Trading': {
                governingStat: 'CHA',
                description: 'Negotiation',
                baseDescription: 'Buying and selling goods'
            },
            'Acting': {
                governingStat: 'CHA',
                description: 'Performance',
                baseDescription: 'Acting and deception'
            }
        }
    },

    // Technical Skills
    technical: {
        name: 'Technical Skills',
        skills: {
            'Pilot': {
                governingStat: 'DEX',
                description: 'Aircraft operation',
                baseDescription: 'Flying vehicles and aircraft'
            },
            'Drive': {
                governingStat: 'DEX',
                description: 'Ground vehicle operation',
                baseDescription: 'Driving cars, trucks, and bikes'
            },
            'Gunnery': {
                governingStat: 'DEX',
                description: 'Vehicle weapons',
                baseDescription: 'Operating vehicle-mounted weapons'
            },
            'Demolitions': {
                governingStat: 'KNOW',
                description: 'Explosives',
                baseDescription: 'Using and creating explosives'
            },
            'Lockpicking': {
                governingStat: 'DEX',
                description: 'Security bypass',
                baseDescription: 'Opening locks without keys'
            },
            'Sneaking': {
                governingStat: 'DEX',
                description: 'Stealth movement',
                baseDescription: 'Moving silently and unseen'
            },
            'Repair': {
                governingStat: 'KNOW',
                description: 'General repair',
                baseDescription: 'Fixing broken items and equipment'
            }
        }
    },

    // Specialist Skills
    specialist: {
        name: 'Specialist Skills',
        skills: {
            'Singing': {
                governingStat: 'CHA',
                description: 'Vocal performance',
                baseDescription: 'Singing ability'
            },
            'Photography': {
                governingStat: 'DIA',
                description: 'Photo operation',
                baseDescription: 'Using cameras effectively'
            },
            'First Aid': {
                governingStat: 'KNOW',
                description: 'Emergency medical',
                baseDescription: 'Basic emergency medical treatment'
            }
        }
    }
};

// Skill costs (progressive: 1pt for Rank 1, 2pts for Rank 2, etc.)
function getSkillCost(rank) {
    return rank;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SKILLS;
}
