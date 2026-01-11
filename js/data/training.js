// SLA Industries Character Generator - Training Packages Data

const TRAINING_PACKAGES = {
    'Military Training': {
        name: 'Military Training',
        description: 'Basic combat and tactical training from SLA military academies.',
        skills: {
            'Rifle': 2,
            'Auto/Support Fire': 1,
            'Dodge/Parry': 1,
            'Running': 2,
            'First Aid': 1
        },
        points: 10
    },
    'Street Survival': {
        name: 'Street Survival',
        description: 'Learn to survive in the dangerous streets of Mort.',
        skills: {
            'Streetwise': 2,
            'Sneaking': 2,
            'Detect': 1,
            'Melee': 1,
            'Lockpicking': 1
        },
        points: 10
    },
    'Corporate Management': {
        name: 'Corporate Management',
        description: 'Business and management training from corporate academies.',
        skills: {
            'Trading': 2,
            'Persuasion': 2,
            'Charisma': 1,
            'Acting': 1,
            'SLA Info': 1
        },
        points: 10
    },
    'Technical Specialist': {
        name: 'Technical Specialist',
        description: 'Advanced technical and engineering training.',
        skills: {
            'Engineering': 2,
            'Repair': 2,
            'Hacking': 1,
            'Elint': 1,
            'Science': 1
        },
        points: 10
    },
    'Combat Specialist': {
        name: 'Combat Specialist',
        description: 'Intensive combat training for frontline operatives.',
        skills: {
            'Melee': 2,
            'Pistol': 2,
            'Marksman': 1,
            'Dodge/Parry': 1,
            'Heavy Weapons': 1
        },
        points: 10
    },
    'Reconnaissance': {
        name: 'Reconnaissance',
        description: 'Scout and recon specialist training.',
        skills: {
            'Detect': 2,
            'Sneaking': 2,
            'Running': 1,
            'Climbing': 1,
            'Sight': 1
        },
        points: 10
    },
    'Medical Training': {
        name: 'Medical Training',
        description: 'Comprehensive medical and emergency treatment training.',
        skills: {
            'Medicine': 3,
            'First Aid': 2,
            'Biology': 1,
            'Psychology': 1
        },
        points: 10
    },
    'Social Engineering': {
        name: 'Social Engineering',
        description: 'Manipulation and social infiltration training.',
        skills: {
            'Acting': 2,
            'Flattery': 2,
            'Persuasion': 1,
            'Intimidation': 1,
            'Psychology': 1
        },
        points: 10
    },
    'Vehicle Operations': {
        name: 'Vehicle Operations',
        description: 'Comprehensive vehicle and aircraft training.',
        skills: {
            'Pilot': 2,
            'Drive': 2,
            'Gunnery': 1,
            'Repair': 1,
            'Running': 1
        },
        points: 10
    },
    'Underworld Connections': {
        name: 'Underworld Connections',
        description: 'Street-level criminal network training.',
        skills: {
            'Streetwise': 2,
            'Interrogation': 1,
            'Intimidation': 2,
            'Trading': 1,
            'Sneaking': 1
        },
        points: 10
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TRAINING_PACKAGES;
}
