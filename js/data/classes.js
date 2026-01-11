// SLA Industries Character Generator - Class Data

const CLASSES = {
    scout: {
        id: 'scout',
        name: 'Scout',
        description: 'Reconnaissance specialists who gather intelligence and navigate dangerous territory.',
        freeSkills: {
            'Streetwise': 2,
            'Detect': 2,
            'Running': 2,
            'Sneaking': 1
        },
        skillPoints: 25,
        startingEquipment: [
            'Blitzer 12.7mm Pistol',
            'Combat Knife',
            'SLA Standard Light Armor',
            'Binoculars',
            'Radio Headset'
        ],
        scl: '9A',
        special: 'Expert reconnaissance and survival skills.'
    },
    corporate: {
        id: 'corporate',
        name: 'Corporate',
        description: 'Business professionals who manage contracts and resources for SLA operations.',
        freeSkills: {
            'Trading': 2,
            'Persuasion': 2,
            'SLA Info': 2,
            'Charisma': 1
        },
        skillPoints: 20,
        startingEquipment: [
            'FEN 9mm Pistol',
            'SLA Standard Light Armor',
            'Corporate Credit Chip',
            'Fake ID',
            'Portable Computer'
        ],
        scl: '9A',
        special: 'Business acumen and resource management.'
    },
    investigator: {
        id: 'investigator',
        name: 'Investigator',
        description: 'Cloak Division agents who solve crimes and uncover conspiracies.',
        freeSkills: {
            'Interrogation': 2,
            'Psychology': 2,
            'Detect': 1,
            'Streetwise': 1
        },
        skillPoints: 25,
        startingEquipment: [
            'FEN 9mm Pistol',
            'Detective Coat',
            'Evidence Kit',
            'Camera',
            'Handcuffs'
        ],
        scl: '9A',
        special: 'Expert deduction and interrogation skills.'
    },
    brainWaster: {
        id: 'brainWaster',
        name: 'Brain Waster',
        description: 'Flux-using operatives with corrupted psychic abilities.',
        freeSkills: {
            'Sneaking': 2,
            'Intimidation': 2,
            'Flux Control': 1,
            'Concentration': 1
        },
        skillPoints: 20,
        startingEquipment: [
            'Ebon Dagger',
            'DeathSuit (Basic)',
            'Flux Crystal',
            'Face Mask',
            'Tactical Gear'
        ],
        scl: '9A',
        special: 'Corrupted Flux abilities and stealth focus.'
    },
    pilot: {
        id: 'pilot',
        name: 'Pilot',
        description: 'Vehicle and aircraft operators for transportation and combat.',
        freeSkills: {
            'Pilot': 3,
            'Drive': 2,
            'Gunnery': 1,
            'Repair': 1
        },
        skillPoints: 20,
        startingEquipment: [
            'Blitzer 12.7mm Pistol',
            'Flight Suit',
            'Nav Computer',
            'Tool Kit',
            'Radio Headset'
        ],
        scl: '9A',
        special: 'Expert vehicle operation and navigation.'
    },
    gunfighter: {
        id: 'gunfighter',
        name: 'Gunfighter',
        description: 'Specialist marksmen and combat tacticians.',
        freeSkills: {
            'Pistol': 3,
            'Marksman': 2,
            'Dodge/Parry': 1,
            'Running': 1
        },
        skillPoints: 20,
        startingEquipment: [
            'CAF Blitzer 12.7mm',
            'Combat Knife',
            'SLA Standard Medium Armor',
            'Ammunition Belt',
            'Targeting Glasses'
        ],
        scl: '9A',
        special: 'Exceptional ranged combat prowess.'
    },
    stormtrooper: {
        id: 'stormtrooper',
        name: 'Stormtrooper',
        description: 'Heavy combat specialists with military training.',
        freeSkills: {
            'Rifle': 2,
            'Heavy Weapons': 2,
            'Auto/Support Fire': 1,
            'Dodge/Parry': 1
        },
        skillPoints: 20,
        startingEquipment: [
            'FEN AR Assault Rifle',
            'Shotgun',
            'SLA Standard Heavy Armor',
            'Grenades (2)',
            'Tactical Vest'
        ],
        scl: '9A',
        special: 'Heavy weapons and assault specialist.'
    },
    grunt: {
        id: 'grunt',
        name: 'Grunt',
        description: 'Basic SLA operatives for general operations.',
        freeSkills: {
            'Melee': 2,
            'Pistol': 2,
            'Running': 1,
            'Climbing': 1
        },
        skillPoints: 25,
        startingEquipment: [
            'FEN 9mm Pistol',
            'Combat Knife',
            'SLA Standard Light Armor',
            'First Aid Kit',
            'Radio Headset'
        ],
        scl: '9A',
        solid: 'General purpose operative with versatile skills.'
    },
    operative: {
        id: 'operative',
        name: 'Operative',
        description: 'Jack-of-all-trades agents for any situation.',
        freeSkills: {
            'Pistol': 2,
            'Streetwise': 2,
            'Sneaking': 1,
            'Detect': 1
        },
        skillPoints: 25,
        startingEquipment: [
            'Blitzer 12.7mm Pistol',
            'Combat Knife',
            'SLA Standard Light Armor',
            'Lockpick Set',
            'Tool Kit'
        ],
        scl: '9A',
        special: 'Versatile agent with balanced capabilities.'
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CLASSES;
}
