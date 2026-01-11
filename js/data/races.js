// SLA Industries Character Generator - Race Data

const RACES = {
    human: {
        id: 'human',
        name: 'Human',
        description: 'The versatile baseline species of Mort. Humans adapt well to any role and form the backbone of SLA Industries operations.',
        statMaximums: {
            STR: { min: 5, max: 10 },
            DEX: { min: 5, max: 10 },
            DIA: { min: 5, max: 10 },
            CONC: { min: 5, max: 10 },
            CHA: { min: 5, max: 10 },
            COOL: { min: 5, max: 10 }
        },
        special: 'Balanced stats with no racial penalties or bonuses',
        fluxUser: false
    },
    frother: {
        id: 'frother',
        name: 'Frother',
        description: 'Genetically modified workers bred for strength and stamina. Frothers are physically powerful but less intellectually inclined.',
        statMaximums: {
            STR: { min: 5, max: 12 },
            DEX: { min: 5, max: 10 },
            DIA: { min: 5, max: 8 },
            CONC: { min: 5, max: 10 },
            CHA: { min: 5, max: 10 },
            COOL: { min: 5, max: 10 }
        },
        special: '+2 STR, -2 DIA maximum. Industrial workers with enhanced musculature.',
        fluxUser: false
    },
    ebon: {
        id: 'ebon',
        name: 'Ebon',
        description: 'Psychic humans with the ability to channel Ebon Flux. Ebons are rare and valued for their mental abilities.',
        statMaximums: {
            STR: { min: 5, max: 9 },
            DEX: { min: 5, max: 10 },
            DIA: { min: 5, max: 10 },
            CONC: { min: 5, max: 13 },
            CHA: { min: 5, max: 13 },
            COOL: { min: 5, max: 9 }
        },
        special: 'Flux users. Higher CONC and CHA maximums. Can use Ebon Abilities.',
        fluxUser: true
    },
    brainWaster: {
        id: 'brainWaster',
        name: 'Brain Waster',
        description: 'Ebons mutated by concentrated Flux exposure. Brain Wasters have corrupted psychic abilities and eerie physical features.',
        statMaximums: {
            STR: { min: 5, max: 11 },
            DEX: { min: 5, max: 10 },
            DIA: { min: 5, max: 10 },
            CONC: { min: 5, max: 11 },
            CHA: { min: 5, max: 8 },
            COOL: { min: 5, max: 11 }
        },
        special: 'Flux users with corrupted abilities. Higher STR/CONC but lower CHA.',
        fluxUser: true
    },
    wraithRaider: {
        id: 'wraithRaider',
        name: 'Wraith Raider',
        description: 'Arctic survivors with pale features and keen senses. Wraith Raiders are agile scouts and expert navigators.',
        statMaximums: {
            STR: { min: 5, max: 10 },
            DEX: { min: 5, max: 15 },
            DIA: { min: 5, max: 12 },
            CONC: { min: 5, max: 9 },
            CHA: { min: 5, max: 10 },
            COOL: { min: 5, max: 8 }
        },
        special: 'Highest DEX maximum. Enhanced perception from arctic survival.',
        fluxUser: false
    },
    shaktar: {
        id: 'shaktar',
        name: 'Shaktar',
        description: 'Warrior race with ritual scarification and combat training. Shaktars are formidable combatants.',
        statMaximums: {
            STR: { min: 5, max: 13 },
            DEX: { min: 5, max: 13 },
            DIA: { min: 5, max: 8 },
            CONC: { min: 5, max: 8 },
            CHA: { min: 5, max: 9 },
            COOL: { min: 5, max: 12 }
        },
        special: 'High STR/DEX/COOL. Natural warriors with combat bonuses.',
        fluxUser: false
    },
    stormer: {
        id: 'stormer',
        name: 'Stormer',
        description: 'Biogenetic super-soldiers created for warfare. Stormers are living weapons with enhanced physiology.',
        statMaximums: {
            STR: { min: 5, max: 15 },
            DEX: { min: 5, max: 13 },
            DIA: { min: 5, max: 8 },
            CONC: { min: 5, max: 8 },
            CHA: { min: 5, max: 8 },
            COOL: { min: 5, max: 15 }
        },
        special: 'Highest STR and COOL maximums. Biogenetic warriors with enhanced durability.',
        fluxUser: false
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RACES;
}
