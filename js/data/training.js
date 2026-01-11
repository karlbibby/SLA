// SLA Industries Character Generator - Training Packages Data
// Updated to align with reworked skill names

const TRAINING_PACKAGES = {
    'Military Training': {
        name: 'Military Training',
        description: 'Basic combat and tactical training from SLA military academies.',
        skills: {
            'Rifle': 2,
            'Auto/Support': 1,
            'Martial Arts': 1,
            'Running': 2,
            'Medical, Paramedic': 1
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
            'Unarmed Combat': 1,
            'Lock Picking': 1
        },
        points: 10
    },
    'Corporate Management': {
        name: 'Corporate Management',
        description: 'Business and management training from corporate academies.',
        skills: {
            'Haggle': 2,
            'Persuasion': 2,
            'Leadership': 1,
            'Disguise': 1,
            'SLA Information': 1
        },
        points: 10
    },
    'Technical Specialist': {
        name: 'Technical Specialist',
        description: 'Advanced technical and engineering training.',
        skills: {
            'Mechanics, Industrial': 2,
            'Mechanics, Repair': 2,
            'Computer, Subterfuge': 1,
            'Computer Use': 1,
            'Electronics, Repair': 1
        },
        points: 10
    },
    'Combat Specialist': {
        name: 'Combat Specialist',
        description: 'Intensive combat training for frontline operatives.',
        skills: {
            'Unarmed Combat': 2,
            'Pistol': 2,
            'Marksman': 1,
            'Martial Arts': 1,
            'Auto/Support': 1
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
            'Climb': 1,
            'Detect': 1
        },
        points: 10
    },
    'Medical Training': {
        name: 'Medical Training',
        description: 'Comprehensive medical and emergency treatment training.',
        skills: {
            'Medical, Practice': 3,
            'Medical, Paramedic': 2,
            'Pathology': 1,
            'Psychology': 1
        },
        points: 10
    },
    'Social Engineering': {
        name: 'Social Engineering',
        description: 'Manipulation and social infiltration training.',
        skills: {
            'Disguise': 2,
            'Interview': 2,
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
            'Pilot, Military': 2,
            'Drive, Civilian': 2,
            'Marksman': 1,
            'Mechanics, Repair': 1,
            'Running': 1
        },
        points: 10
    },
    'Underworld Connections': {
        name: 'Underworld Connections',
        description: 'Street-level criminal network training.',
        skills: {
            'Streetwise': 2,
            'Interview': 1,
            'Intimidation': 2,
            'Haggle': 1,
            'Sneaking': 1
        },
        points: 10
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TRAINING_PACKAGES;
}
