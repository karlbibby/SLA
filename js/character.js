// SLA Industries Character Generator - Character Model

class Character {
    constructor() {
        // Basic Info
        this.name = '';
        this.playerName = '';
        this.race = null;
        this.class = null;
        
        // Primary Statistics (base values start at 5)
        this.stats = {
            STR: 5,
            DEX: 5,
            DIA: 5,
            CONC: 5,
            CHA: 5,
            COOL: 5
        };
        
        // Derived Statistics
        this.derivedStats = {
            PHYS: 5,  // (STR + DEX) / 2, rounded up
            KNOW: 5,  // (DIA + CONC) / 2, rounded up
            FLUX: 10  // Only for Ebon/Brain Waster
        };
        
        // Skills
        this.skills = {};
        
        // Advantages/Disadvantages
        this.advantages = {};  // { name: rank }
        this.disadvantages = {};  // { name: rank }
        
        // Training Packages
        this.trainingPackages = [];
        
        // Ebon Abilities
        this.ebonAbilities = [];
        this.selectedFormulae = [];
        
        // Equipment (selectedEquipment starts with standard SLA kit)
        this.selectedEquipment = [
            'Headset Communicator',
            'Klippo Lighter',
            'Pen',
            'FEN 603',
            'FEN Ammo Clip',
            'FEN Ammo Clip',
            'Blueprint News File Case',
            'S.C.L. Card',
            'Finance Card',
            'Package Card',
            'Departmental Authorization Card',
            'Clothes (2 sets)',
            'Footwear (1 set)',
            'Operative Organizer',
            'SLA Badge',
            'Weapons Maintenance Kit',
            'Personal Effects',
            'Contraceptives Pack'
        ];
        
        // Drug Inventory
        this.drugInventory = {};  // { "Redline-9": 2, "Numbra-k": 3 }
        
        // Phobias
        this.phobias = [];  // Array of phobia objects with treatment progress
        
        // Starting SCL
        this.scl = '9A';
        
        // Financials
        // Credits are stored in Credits (c). Starting operative receives 1500c to spend on hardware.
        this.credits = 1500;
        // Induction bonus (credited to account but locked until game start)
        this.inductionBonus = 100;
        this.inductionLocked = true;
        // Finance medium: by default a Finance Card is provided; financeChip can be toggled in UI (some races disallowed)
        this.financeChip = false;
        this.financeCard = true;
        // Housing provided by SLA by default unless user selects Housing advantage/disadvantage
        this.housing = {
            type: 'SLA Apartment',
            providedBySLA: true
        };
        
        // Point tracking
        this.totalPoints = 300;
        this.spentPoints = 0;
        
        // Ensure starting kit exists (avoid duplicate entries)
        this.selectedEquipment = this.selectedEquipment || [];
        const defaultKit = ['Headset Communicator', 'Klippo Lighter', 'Pen', 'FEN 603', 'Blueprint News File case', 'S.C.L. card', 'Finance card', 'Package card and badge', 'Departmental Authorization Card', 'Two sets of clothes', 'One set of footwear', 'Operative organizer', 'SLA badge', 'Weapons Maintenance Kit', 'Minor personal effects', 'Pack of contraceptives'];
        defaultKit.forEach(item => { if (!this.selectedEquipment.includes(item)) this.selectedEquipment.push(item); });
        
        // Creation metadata
        this.created = new Date().toISOString();
        this.version = '1.0';
    }
    
    // helper for finance display conversions
    getCredits() {
        return typeof this.credits !== 'undefined' ? this.credits : 1500;
    }

    // Calculate derived stats based on primary stats
    calculateDerivedStats() {
        this.derivedStats.PHYS = Math.ceil((this.stats.STR + this.stats.DEX) / 2);
        this.derivedStats.KNOW = Math.ceil((this.stats.DIA + this.stats.CONC) / 2);
    }

    // Get race stat maximums
    getStatMaximums() {
        if (!this.race) return null;
        return RACES[this.race].statMaximums;
    }

    // Check if stat can be increased
    canIncreaseStat(statName, newValue) {
        const maximums = this.getStatMaximums();
        if (!maximums) return false;
        
        const statMax = maximums[statName];
        if (!statMax) return false;
        
        return newValue <= statMax.max;
    }

    // Check if stat can be decreased
    canDecreaseStat(statName, newValue) {
        const minimums = this.getStatMaximums();
        if (!minimums) return false;
        
        const statMin = minimums[statName];
        if (!statMin) return false;
        
        return newValue >= statMin.min;
    }

    // Get the governing stat value for a skill
    getGoverningStatValue(skillName) {
        // Find which category this skill belongs to
        for (const category in SKILLS) {
            if (SKILLS[category].skills[skillName]) {
                const governingStat = SKILLS[category].skills[skillName].governingStat;
                if (governingStat === 'PHYS' || governingStat === 'KNOW') {
                    return this.derivedStats[governingStat];
                }
                return this.stats[governingStat];
            }
        }
        return 5; // Default
    }

    // Get maximum rank for a skill based on governing stat
    getSkillMaxRank(skillName) {
        return Math.min(10, this.getGoverningStatValue(skillName));
    }

    // Calculate skill points spent (excludes free skills from class)
    calculateSkillPointsSpent() {
        let spent = 0;
        const classData = this.class ? CLASSES[this.class] : null;
        const freeSkills = classData ? classData.freeSkills : {};
        
        for (const skillName in this.skills) {
            const rank = this.skills[skillName];
            const freeRank = freeSkills[skillName] || 0;
            
            if (rank > freeRank) {
                // Calculate cost for ranks above free rank
                // Progressive cost: rank 1 = 1pt, rank 2 = 2pts, etc.
                // But we only charge for ranks ABOVE free rank
                const billableRanks = rank - freeRank;
                spent += (billableRanks * (billableRanks + 1)) / 2;
            }
        }
        return spent;
    }

    // Calculate stat points spent
    calculateStatPointsSpent() {
        let spent = 0;
        const baseValue = 5;
        
        for (const stat in this.stats) {
            if (this.stats[stat] > baseValue) {
                spent += (this.stats[stat] - baseValue) * 5;
            } else if (this.stats[stat] < baseValue) {
                // Points gained from reducing stats
                spent -= (baseValue - this.stats[stat]) * 5;
            }
        }
        
        // FLUX points (starts at 10, costs 5pts per extra point)
        if (this.isFluxUser() && this.derivedStats.FLUX > 10) {
            spent += (this.derivedStats.FLUX - 10) * 5;
        }
        
        return spent;
    }

    // Calculate advantage points (positive = costs points)
    calculateAdvantagePoints() {
        let points = 0;
        
        for (const category in ADVANTAGES) {
            const categoryData = ADVANTAGES[category];
            for (const advName in categoryData.items) {
                const advData = categoryData.items[advName];
                const rank = this.advantages[advName] || 0;
                if (rank > 0 && advData.type === 'advantage') {
                    points += advData.basePoints * rank;
                }
            }
        }
        
        return points;
    }

    // Calculate disadvantage points (returns POSITIVE point gain for disadvantages)
    calculateDisadvantagePoints() {
        let points = 0;
        
        for (const category in ADVANTAGES) {
            const categoryData = ADVANTAGES[category];
            for (const advName in categoryData.items) {
                const advData = categoryData.items[advName];
                const rank = this.disadvantages[advName] || 0;
                if (rank > 0 && advData.type === 'disadvantage') {
                    // basePoints is negative, so we negate it to get positive point gain
                    points += Math.abs(advData.basePoints * rank);
                }
            }
        }
        
        return points;
    }

    // Get total points available
    getAvailablePoints() {
        const basePoints = this.totalPoints;
        const statSpent = this.calculateStatPointsSpent();
        const skillSpent = this.calculateSkillPointsSpent();
        const advPoints = this.calculateAdvantagePoints();
        const disPoints = this.calculateDisadvantagePoints();
        
        // Disadvantages give you points (positive value), so ADD them
        return basePoints + disPoints - statSpent - skillSpent - advPoints;
    }

    // Apply free skills from class
    applyClassSkills() {
        if (!this.class) return;
        
        const classData = CLASSES[this.class];
        for (const skillName in classData.freeSkills) {
            this.skills[skillName] = classData.freeSkills[skillName];
        }
    }

    // Check if race is a flux user
    isFluxUser() {
        if (!this.race) return false;
        return RACES[this.race].fluxUser;
    }

    // Validate character for completion
    validate() {
        const errors = [];
        
        if (!this.name) errors.push('Character name is required');
        if (!this.race) errors.push('Race must be selected');
        if (!this.class) errors.push('Class must be selected');
        
        // Check stat limits
        const maximums = this.getStatMaximums();
        if (maximums) {
            for (const stat in this.stats) {
                if (maximums[stat]) {
                    if (this.stats[stat] < maximums[stat].min) {
                        errors.push(`${stat} cannot be below ${maximums[stat].min}`);
                    }
                    if (this.stats[stat] > maximums[stat].max) {
                        errors.push(`${stat} cannot be above ${maximums[stat].max}`);
                    }
                }
            }
        }
        
        // Check skill limits
        for (const skillName in this.skills) {
            const rank = this.skills[skillName];
            const maxRank = this.getSkillMaxRank(skillName);
            if (rank > maxRank) {
                errors.push(`${skillName} cannot exceed rank ${maxRank}`);
            }
        }
        
        return {
            valid: errors.length === 0,
            errors: errors
        };
    }

    // Serialize character to JSON
    toJSON() {
        return {
            name: this.name,
            playerName: this.playerName,
            race: this.race,
            class: this.class,
            stats: this.stats,
            derivedStats: this.derivedStats,
            skills: this.skills,
            advantages: this.advantages,
            disadvantages: this.disadvantages,
            trainingPackages: this.trainingPackages,
            ebonAbilities: this.ebonAbilities,
            selectedFormulae: this.selectedFormulae,
            selectedEquipment: this.selectedEquipment,
            drugInventory: this.drugInventory,
            phobias: this.phobias,
            scl: this.scl,
            // Financials
            credits: this.credits,
            inductionBonus: this.inductionBonus,
            inductionLocked: this.inductionLocked,
            financeChip: this.financeChip,
            financeCard: this.financeCard,
            housing: this.housing,
            totalPoints: this.totalPoints,
            spentPoints: this.spentPoints,
            created: this.created,
            version: this.version
        };
    }

    // Load character from JSON
    fromJSON(data) {
        data = data || {};
        this.name = data.name || '';
        this.playerName = data.playerName || '';
        this.race = data.race || null;
        this.class = data.class || null;
        this.stats = data.stats || { STR: 5, DEX: 5, DIA: 5, CONC: 5, CHA: 5, COOL: 5 };
        this.derivedStats = data.derivedStats || { PHYS: 5, KNOW: 5, FLUX: 10 };
        this.skills = data.skills || {};
        this.advantages = data.advantages || {};
        this.disadvantages = data.disadvantages || {};
        this.trainingPackages = data.trainingPackages || [];
        this.ebonAbilities = data.ebonAbilities || [];
        this.selectedFormulae = data.selectedFormulae || [];
        this.selectedEquipment = data.selectedEquipment || this.selectedEquipment;
        this.drugInventory = data.drugInventory || {};
        this.phobias = data.phobias || [];
        this.scl = data.scl || '9A';

        // Financials with sensible defaults / backwards compatibility
        this.credits = (typeof data.credits !== 'undefined') ? data.credits : (this.credits || 1500);
        this.inductionBonus = (typeof data.inductionBonus !== 'undefined') ? data.inductionBonus : (this.inductionBonus || 100);
        this.inductionLocked = (typeof data.inductionLocked !== 'undefined') ? data.inductionLocked : (this.inductionLocked !== undefined ? this.inductionLocked : true);
        this.financeChip = (typeof data.financeChip !== 'undefined') ? data.financeChip : this.financeChip;
        this.financeCard = (typeof data.financeCard !== 'undefined') ? data.financeCard : this.financeCard;
        this.housing = data.housing || this.housing;

        this.totalPoints = data.totalPoints || this.totalPoints || 300;
        this.spentPoints = data.spentPoints || this.spentPoints || 0;
        this.created = data.created || this.created || new Date().toISOString();
        this.version = data.version || this.version || '1.0';
    }

    // Create a copy of this character
    clone() {
        const copy = new Character();
        copy.fromJSON(this.toJSON());
        return copy;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Character;
}
