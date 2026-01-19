// SLA Industries Character Generator - Character Model

class Character {
    constructor() {
        // Basic Info
        this.name = '';
        this.playerName = '';
        this.race = null;
        
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
        
        // Ebon Abilities
        this.ebonAbilities = [];
        this.selectedFormulae = [];
        this.ebonRanks = {};
        
        // Drug Inventory
        this.drugInventory = {};  // { "Redline-9": 2, "Numbra-k": 3 }
        
        // Phobias
        this.phobias = [];  // Array of phobia objects with treatment progress
        
        // Starting SCL
        this.scl = '9A';
        
        // Financials
        // Credits are stored in Credits (c). Starting operative receives 1500c for purchases.
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
        
        // Creation metadata
        this.created = new Date().toISOString();
        this.version = '1.0';
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

    // Calculate skill points spent (excludes free skills from race)
    calculateSkillPointsSpent() {
        let spent = 0;
        const raceData = RACES[this.race];
        const freeSkills = raceData ? raceData.freeSkills || {} : {};
        
        for (const skillName in this.skills) {
            const rank = this.skills[skillName];
            const freeRank = freeSkills[skillName] || 0;
            const effectiveRank = Math.max(0, rank - freeRank);
            
            // Progressive cost: rank 1 = 1pt, rank 2 = 2pts, etc.
            spent += (effectiveRank * (effectiveRank + 1)) / 2;
        }
        return spent;
    }

    // Calculate Ebon/Flux points spent during generation using triangular cost (same as skills)
    calculateEbonPointsSpent() {
        let spent = 0;
        if (!this.ebonRanks || typeof EBON_ABILITIES === 'undefined') return 0;
        for (const catKey in this.ebonRanks) {
            const rank = Number(this.ebonRanks[catKey] || 0);
            if (!rank || rank <= 0) continue;
            const cat = EBON_ABILITIES[catKey];
            if (!cat) continue;
            // Players only spend points on purchasable categories
            if (!cat.canPurchase) continue;
            // Use triangular number: cost = 1 + 2 + ... + rank = rank*(rank+1)/2
            const cost = (rank * (rank + 1)) / 2;
            spent += cost;
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
                    // oneOffCost overrides per-rank costs
                    if (typeof advData.oneOffCost === 'number') {
                        points += advData.oneOffCost;
                    } else {
                        points += (advData.costPerRank || 0) * rank;
                    }
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
                    // oneOffCost grants a fixed amount; otherwise grant costPerRank * rank
                    if (typeof advData.oneOffCost === 'number') {
                        points += advData.oneOffCost;
                    } else {
                        points += (advData.costPerRank || 0) * rank;
                    }
                }
            }
        }
        
        // Include phobias explicitly (selected in Phobias step).
        // The 'phobia' placeholder in ADVANTAGES is zero-cost and must not change points;
        // actual phobia point gains come from character.phobias.
        if (Array.isArray(this.phobias)) {
            for (const ph of this.phobias) {
                const name = ph.name;
                const rank = ph.rank || 0;
                let perRank = 0;
                // Look up in PHOBIAS data if available, otherwise fall back to PHOBIA_RULES
                if (typeof PHOBIAS !== 'undefined' && PHOBIAS.items && PHOBIAS.items[name]) {
                    perRank = PHOBIAS.items[name].costPerRank || (PHOBIA_RULES && PHOBIA_RULES.costPerRank) || 0;
                } else {
                    perRank = (PHOBIA_RULES && PHOBIA_RULES.costPerRank) || 0;
                }
                points += perRank * rank;
            }
        }
        
        return points;
    }

    // Get total points available
    getAvailablePoints() {
        const basePoints = this.totalPoints;
        const statSpent = this.calculateStatPointsSpent();
        const skillSpent = this.calculateSkillPointsSpent();
        const ebonSpent = this.calculateEbonPointsSpent ? this.calculateEbonPointsSpent() : 0;
        const advPoints = this.calculateAdvantagePoints();
        const disPoints = this.calculateDisadvantagePoints();
        
        // Disadvantages give you points (positive value), so ADD them
        // Subtract points spent on stats, skills, advantages and Ebon abilities
        return basePoints + disPoints - statSpent - skillSpent - advPoints - ebonSpent;
    }

    // Check if race is a flux user
    isFluxUser() {
        if (!this.race) return false;
        return RACES[this.race].fluxUser;
    }

    // Apply free skills from race
    applyRaceSkills() {
        if (!this.race) return;
        const raceData = RACES[this.race];
        if (raceData.freeSkills) {
            for (const [skillName, rank] of Object.entries(raceData.freeSkills)) {
                this.skills[skillName] = rank;
            }
        }
    }

    // Validate character for completion
    validate() {
        const errors = [];
        
        if (!this.name) errors.push('Character name is required');
        if (!this.race) errors.push('Race must be selected');
        
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
        
        // Check Ebon/Flux ranks (generation rules)
        if (this.ebonRanks) {
            for (const catKey in this.ebonRanks) {
                const rank = Number(this.ebonRanks[catKey] || 0);
                const cat = (typeof EBON_ABILITIES !== 'undefined') ? EBON_ABILITIES[catKey] : null;
                if (!cat) continue;
                // Ensure numeric range
                if (!Number.isInteger(rank) || rank < 0 || rank > 20) {
                    errors.push(`${cat.name} rank must be an integer between 0 and 20`);
                    continue;
                }
                // Necanthrope-only check
                if (cat.necanthropeOnly) {
                    const isNec = (typeof this.isNecanthrope === 'function') ? !!this.isNecanthrope() : (this.class && String(this.class).toLowerCase().includes('necanthrope'));
                    if (rank > 0 && !isNec) {
                        errors.push(`${cat.name} is Necanthrope-only`);
                    }
                }
                // Purchase rules: players cannot purchase categories with canPurchase:false
                if (!cat.canPurchase && rank > (typeof cat.startingMaxRank === 'number' ? cat.startingMaxRank : 0)) {
                    errors.push(`${cat.name} cannot be purchased or increased by players`);
                }
                // Starting generation cap: enforce startingMaxRank for purchasable categories
                if (cat.canPurchase) {
                    const startMax = (typeof cat.startingMaxRank === 'number') ? cat.startingMaxRank : 10;
                    if (rank > startMax) {
                        errors.push(`${cat.name} cannot exceed starting rank ${startMax} during generation`);
                    }
                }
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
            stats: this.stats,
            derivedStats: this.derivedStats,
            skills: this.skills,
            advantages: this.advantages,
            disadvantages: this.disadvantages,
            ebonAbilities: this.ebonAbilities,
            selectedFormulae: this.selectedFormulae,
            ebonRanks: this.ebonRanks,
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
        this.stats = data.stats || { STR: 5, DEX: 5, DIA: 5, CONC: 5, CHA: 5, COOL: 5 };
        this.derivedStats = data.derivedStats || { PHYS: 5, KNOW: 5, FLUX: 10 };
        this.skills = data.skills || {};
        this.advantages = data.advantages || {};
        this.disadvantages = data.disadvantages || {};
        this.ebonAbilities = data.ebonAbilities || [];
        this.selectedFormulae = data.selectedFormulae || [];
        this.ebonRanks = data.ebonRanks || this.ebonRanks || {};
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
