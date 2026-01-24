// SLA Industries Character Generator - Character Model

const STARTER_KIT = {
    armaments: {
        'FEN 603': 1
    },
    ammo: {
        '10mm Auto × STD': 2
    },
    equipment: {
        'Headset Communicator': 1,
        'Klippo Lighter': 1,
        'Pen': 1,
        'Blueprint News File Case': 1,
        'S.C.L. Card': 1,
        'Finance Chip': 1,
        'Package Card': 1,
        'Package Badge': 1,
        'Departmental Authorization Card': 1,
        'Pack of Contraceptives': 1,
        'Clothes (Set)': 2,
        'Footwear (Set)': 1,
        'Operative Organizer': 1,
        'SLA Badge': 1,
        'Weapons Maintenance Kit': 1
    }
};

class Character {
    constructor() {
        // Basic Info
        this.name = '';
        this.playerName = '';
        this.race = null;
        this.move = {
            walk: '',
            run: '',
            sprint: ''
        };
        
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
            FLUX: 0  // Only for Ebon/Brain Waster, will be set to 10 if flux user
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

        // Armament Inventory
        this.armamentInventory = {};  // { "GA47": 1, "FEN 706": 2 }

        // Armour Inventory
        this.armourInventory = {};  // { "Body Armour": 1 }

        // Armour selection + derived sheet fields
        this.selectedArmourType = '';
        this.armourHead = '--';
        this.armourTorso = '--';
        this.armourLArm = '--';
        this.armourRArm = '--';
        this.armourLLeg = '--';
        this.armourRLeg = '--';
        this.idHead = '--';
        this.idTorso = '--';
        this.idLArm = '--';
        this.idRArm = '--';
        this.idLLeg = '--';
        this.idRLeg = '--';

        // Weapons Inventory
        this.weaponInventory = {};  // { "Chain Axe": 1, "SLA Blade": 2 }

        // Ammunition Inventory
        this.ammoInventory = {};  // { "9mm BLA × AP": 2 }

        // Grenade Inventory
        this.grenadeInventory = {};  // { "Fragmentation": 2 }

        // Vehicle Inventory
        this.vehicleInventory = {};  // { "Augustus (Car)": 1 }

        // Specialist Ammunition Inventory
        this.specialistAmmoInventory = {};  // { "Vibro discs": 1 }

        // Equipment Inventory
        this.equipmentInventory = {};  // { "Telesight": 1 }

        // Ebon Equipment Inventory
        this.ebonEquipmentInventory = {};  // { "Force Ebb Kinetic — Flintlock": 1 }

        // Locked inventory (non-removable starter kit)
        this.lockedInventory = {
            armaments: {},
            ammo: {},
            equipment: {}
        };

        // Starter kit flag
        this.starterKitApplied = false;
        
        // Phobias
        this.phobias = [];  // Array of phobia objects with treatment progress
        
        // Training Package
        this.selectedTrainingPackage = null;  // Package ID or null
        this.packageSkills = {};  // Tracks skills granted by package for removal: { skillName: rank | { bonusRank, originalRank } }
        
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

        this.applyStarterKit();
    }

    applyStarterKit() {
        if (this.starterKitApplied) return;

        const addItems = (inventory, lockedInventory, items) => {
            if (!inventory || !items) return;
            for (const [name, qty] of Object.entries(items)) {
                const amount = Number(qty) || 0;
                if (amount <= 0) continue;
                inventory[name] = (inventory[name] || 0) + amount;
                if (lockedInventory) {
                    lockedInventory[name] = (lockedInventory[name] || 0) + amount;
                }
            }
        };

        addItems(this.armamentInventory, this.lockedInventory.armaments, STARTER_KIT.armaments);
        addItems(this.ammoInventory, this.lockedInventory.ammo, STARTER_KIT.ammo);
        addItems(this.equipmentInventory, this.lockedInventory.equipment, STARTER_KIT.equipment);

        if (STARTER_KIT.equipment && STARTER_KIT.equipment['Finance Chip']) {
            this.financeChip = true;
            this.financeCard = false;
        }

        this.starterKitApplied = true;
    }
    
    // Calculate derived stats based on primary stats
    calculateDerivedStats() {
        this.derivedStats.PHYS = Math.ceil((this.stats.STR + this.stats.DEX) / 2);
        this.derivedStats.KNOW = Math.ceil((this.stats.DIA + this.stats.CONC) / 2);
    }

    // Get phases/actions from DEX
    getPhaseData() {
        const dex = Number(this.stats?.DEX || 0);
        let actions = 1;
        let phases = [3];

        if (dex >= 4 && dex <= 6) {
            actions = 2;
            phases = [2, 4];
        } else if (dex >= 7 && dex <= 9) {
            actions = 3;
            phases = [1, 3, 5];
        } else if (dex >= 10 && dex <= 12) {
            actions = 4;
            phases = [1, 2, 4, 5];
        } else if (dex >= 13) {
            actions = 5;
            phases = [1, 2, 3, 4, 5];
        }

        return { actions, phases };
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

    // Calculate skill points spent (excludes free skills from race and training package)
    calculateSkillPointsSpent() {
        let spent = 0;
        const raceData = RACES[this.race];
        const freeSkills = raceData ? raceData.freeSkills || {} : {};

        for (const skillName in this.skills) {
            const rank = Number(this.skills[skillName] || 0);
            if (!rank || rank <= 0) continue;

            const freeRank = Number(freeSkills[skillName] || 0);

            // Determine training package bonus info (if any)
            let pkgBonus = 0;
            let pkgOriginalRank = null;
            const pkgEntry = this.packageSkills ? this.packageSkills[skillName] : null;
            if (pkgEntry) {
                if (typeof pkgEntry === 'number') {
                    pkgBonus = Number(pkgEntry || 0);
                } else if (typeof pkgEntry === 'object') {
                    pkgBonus = Number(pkgEntry.bonusRank || 0);
                    if (typeof pkgEntry.originalRank === 'number') {
                        pkgOriginalRank = pkgEntry.originalRank;
                    }
                }
            }

            // Build a set of free ranks (race free ranks are the lowest ranks)
            const freeRankSet = new Set();
            for (let i = 1; i <= Math.min(rank, freeRank); i++) {
                freeRankSet.add(i);
            }

            // Training package grants free ranks based on original rank at time of selection
            if (pkgBonus > 0) {
                let inferredOriginal = pkgOriginalRank;
                if (typeof inferredOriginal !== 'number') {
                    inferredOriginal = Math.max(0, rank - pkgBonus);
                }

                let startRank = 1;
                if (inferredOriginal > 0) {
                    startRank = inferredOriginal + 1;
                }
                const endRank = Math.min(rank, startRank + pkgBonus - 1);
                for (let i = startRank; i <= endRank; i++) {
                    freeRankSet.add(i);
                }
            }

            // Sum cost for non-free ranks
            for (let i = 1; i <= rank; i++) {
                if (!freeRankSet.has(i)) {
                    spent += i;
                }
            }
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
        const maximums = this.getStatMaximums();
        
        for (const stat in this.stats) {
            const baseValue = maximums?.[stat]?.min ?? 5;
            if (this.stats[stat] > baseValue) {
                spent += (this.stats[stat] - baseValue) * 5;
            } else if (this.stats[stat] < baseValue) {
                // Points gained from reducing stats (below racial minimums, if ever allowed)
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

    // Get remaining points (alias for backward compatibility)
    getRemainingPoints() {
        return this.getAvailablePoints();
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

    // Get move rate (W/R/S) including Running skill bonus (+0.3 per rank)
    getMoveRate() {
        const base = this.move || {};
        const runningRank = Number(this.skills?.Running || 0);
        const bonus = runningRank * 0.3;

        const applyBonus = (value) => {
            if (value === '' || value === null || typeof value === 'undefined') return '';
            const num = Number(value);
            if (!Number.isFinite(num)) return '';
            return Math.round((num + bonus) * 10) / 10;
        };

        return {
            walk: applyBonus(base.walk),
            run: applyBonus(base.run),
            sprint: applyBonus(base.sprint)
        };
    }

    // Apply training package skills
    applyTrainingPackage(packageId) {
        if (!packageId || typeof TRAINING_PACKAGES === 'undefined') return;
        
        // Remove current package first if any
        this.removeTrainingPackage();
        
        const packageData = TRAINING_PACKAGES[packageId];
        if (!packageData) return;
        
        this.selectedTrainingPackage = packageId;
        this.packageSkills = {};
        
        // Add skills: +1 if skill exists, +2 if new skill
        for (const skillName of packageData.skills) {
            const currentRank = this.skills[skillName] || 0;
            const bonusRank = currentRank > 0 ? 1 : 2;  // +1 if exists, +2 if new
            this.skills[skillName] = currentRank + bonusRank;
            this.packageSkills[skillName] = { bonusRank, originalRank: currentRank };  // Track actual bonus given
        }
    }

    // Remove training package skills
    removeTrainingPackage() {
        if (!this.selectedTrainingPackage) return;
        
        // Subtract package skills from character skills
        for (const skillName in this.packageSkills) {
            const packageEntry = this.packageSkills[skillName];
            const packageRank = (typeof packageEntry === 'object' && packageEntry !== null)
                ? (packageEntry.bonusRank || 0)
                : (packageEntry || 0);
            const currentRank = this.skills[skillName] || 0;
            const newRank = Math.max(0, currentRank - packageRank);
            
            if (newRank === 0) {
                delete this.skills[skillName];  // Remove skill if rank becomes 0
            } else {
                this.skills[skillName] = newRank;
            }
        }
        
        this.selectedTrainingPackage = null;
        this.packageSkills = {};
    }

    // Validate training package - auto-remove if points are available
    // Returns true if package was removed
    validateTrainingPackage() {
        if (!this.selectedTrainingPackage) return false;
        
        // If player has any remaining points, remove the package
        if (this.getRemainingPoints() !== 0) {
            this.removeTrainingPackage();
            return true;  // Package was removed
        }
        
        return false;  // Package still valid
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
            move: this.move,
            stats: this.stats,
            derivedStats: this.derivedStats,
            skills: this.skills,
            advantages: this.advantages,
            disadvantages: this.disadvantages,
            ebonAbilities: this.ebonAbilities,
            selectedFormulae: this.selectedFormulae,
            ebonRanks: this.ebonRanks,
            drugInventory: this.drugInventory,
            armamentInventory: this.armamentInventory,
            armourInventory: this.armourInventory,
            selectedArmourType: this.selectedArmourType,
            armourHead: this.armourHead,
            armourTorso: this.armourTorso,
            armourLArm: this.armourLArm,
            armourRArm: this.armourRArm,
            armourLLeg: this.armourLLeg,
            armourRLeg: this.armourRLeg,
            idHead: this.idHead,
            idTorso: this.idTorso,
            idLArm: this.idLArm,
            idRArm: this.idRArm,
            idLLeg: this.idLLeg,
            idRLeg: this.idRLeg,
            weaponInventory: this.weaponInventory,
            ammoInventory: this.ammoInventory,
            grenadeInventory: this.grenadeInventory,
            vehicleInventory: this.vehicleInventory,
            specialistAmmoInventory: this.specialistAmmoInventory,
            equipmentInventory: this.equipmentInventory,
            ebonEquipmentInventory: this.ebonEquipmentInventory,
            phobias: this.phobias,
            selectedTrainingPackage: this.selectedTrainingPackage,
            packageSkills: this.packageSkills,
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
            starterKitApplied: this.starterKitApplied,
            lockedInventory: this.lockedInventory,
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
        this.move = data.move || (this.race && RACES[this.race]?.move ? { ...RACES[this.race].move } : { walk: '', run: '', sprint: '' });
        this.stats = data.stats || { STR: 5, DEX: 5, DIA: 5, CONC: 5, CHA: 5, COOL: 5 };
        // Initialize FLUX to 10 only if this is a flux user race, otherwise 0
        const defaultFlux = (data.race && RACES[data.race]?.fluxUser) ? 10 : 0;
        this.derivedStats = data.derivedStats || { PHYS: 5, KNOW: 5, FLUX: defaultFlux };
        this.skills = data.skills || {};
        const skillAliases = {
            'SLA Info': 'SLA Information',
            'Paramedic': 'Medical, Paramedic',
            'Medical Practice': 'Medical, Practice',
            'Mechanics Repair': 'Mechanics, Repair',
            'Mechanics Industrial': 'Mechanics, Industrial',
            'Electronics Repair': 'Electronics, Repair',
            'Electronics Industrial': 'Electronics, Industrial',
            'Computer Subterfuge': 'Computer, Subterfuge',
            'Drive Civilian': 'Drive, Civilian',
            'Drive Military': 'Drive, Military',
            'Drive Motorcycle': 'Drive, Motorcycle',
            'Pilot Military': 'Pilot, Military'
        };
        const normalizeSkillMap = (map) => {
            const normalized = {};
            const getBonus = (entry) => (typeof entry === 'object' && entry !== null) ? (Number(entry.bonusRank || 0)) : Number(entry || 0);
            for (const [name, value] of Object.entries(map || {})) {
                const key = skillAliases[name] || name;
                const existing = normalized[key];
                if (!existing) {
                    normalized[key] = value;
                    continue;
                }

                const existingBonus = getBonus(existing);
                const incomingBonus = getBonus(value);
                if (incomingBonus >= existingBonus) {
                    normalized[key] = value;
                }
            }
            return normalized;
        };
        this.skills = normalizeSkillMap(this.skills);
        this.advantages = data.advantages || {};
        this.disadvantages = data.disadvantages || {};
        this.ebonAbilities = data.ebonAbilities || [];
        this.selectedFormulae = data.selectedFormulae || [];
        this.ebonRanks = data.ebonRanks || this.ebonRanks || {};
        this.drugInventory = data.drugInventory || {};
        this.armamentInventory = data.armamentInventory || {};
        this.armourInventory = data.armourInventory || {};
        this.selectedArmourType = data.selectedArmourType || this.selectedArmourType || '';
        this.armourHead = (typeof data.armourHead !== 'undefined') ? data.armourHead : (this.armourHead || '--');
        this.armourTorso = (typeof data.armourTorso !== 'undefined') ? data.armourTorso : (this.armourTorso || '--');
        this.armourLArm = (typeof data.armourLArm !== 'undefined') ? data.armourLArm : (this.armourLArm || '--');
        this.armourRArm = (typeof data.armourRArm !== 'undefined') ? data.armourRArm : (this.armourRArm || '--');
        this.armourLLeg = (typeof data.armourLLeg !== 'undefined') ? data.armourLLeg : (this.armourLLeg || '--');
        this.armourRLeg = (typeof data.armourRLeg !== 'undefined') ? data.armourRLeg : (this.armourRLeg || '--');
        this.idHead = (typeof data.idHead !== 'undefined') ? data.idHead : (this.idHead || '--');
        this.idTorso = (typeof data.idTorso !== 'undefined') ? data.idTorso : (this.idTorso || '--');
        this.idLArm = (typeof data.idLArm !== 'undefined') ? data.idLArm : (this.idLArm || '--');
        this.idRArm = (typeof data.idRArm !== 'undefined') ? data.idRArm : (this.idRArm || '--');
        this.idLLeg = (typeof data.idLLeg !== 'undefined') ? data.idLLeg : (this.idLLeg || '--');
        this.idRLeg = (typeof data.idRLeg !== 'undefined') ? data.idRLeg : (this.idRLeg || '--');
        this.weaponInventory = data.weaponInventory || {};
        this.ammoInventory = data.ammoInventory || {};
        this.grenadeInventory = data.grenadeInventory || {};
        this.vehicleInventory = data.vehicleInventory || {};
        this.specialistAmmoInventory = data.specialistAmmoInventory || {};
        this.equipmentInventory = data.equipmentInventory || {};
        this.ebonEquipmentInventory = data.ebonEquipmentInventory || {};
        this.phobias = data.phobias || [];
        this.selectedTrainingPackage = data.selectedTrainingPackage || null;
        this.packageSkills = normalizeSkillMap(data.packageSkills || {});
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
        this.starterKitApplied = (typeof data.starterKitApplied !== 'undefined') ? data.starterKitApplied : this.starterKitApplied;
        this.lockedInventory = data.lockedInventory || this.lockedInventory || { armaments: {}, ammo: {}, equipment: {} };
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
