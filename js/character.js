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
            FLUX: 0,  // Only for Ebon/Brain Waster, will be set to 10 if flux user
            hitPoints: {
                total: 10,  // STR + PHYS
                head: 4,    // ceil(total / 3)
                torso: 10,  // total
                leftArm: 5, // floor(total / 2)
                rightArm: 5,// floor(total / 2)
                leftLeg: 5, // ceil(total / 2)
                rightLeg: 5 // ceil(total / 2)
            }
        };
        
        // Top-level HP fields for PDF compatibility
        this.hpTotal = 10;
        this.hpHead = 4;
        this.hpTorso = 10;
        this.hpLArm = 5;
        this.hpRArm = 5;
        this.hpLLeg = 5;
        this.hpRLeg = 5;
        this.wounds = 0;
        
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

        // DeathSuit selection (owned via Ebon Equipment)
        this.deathsuitType = ''; // One of keys in DEATHSUIT_TYPES when owned

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
        this.packageSelectedCombatSkill = null;  // Track selected unarmed combat skill for packages with selectableCombatSkill flag
        
        // Starting SCL
        this.scl = '10';
        
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
        
        // Calculate Hit Points: Total = STR + PHYS
        const total = this.stats.STR + this.derivedStats.PHYS;
        this.derivedStats.hitPoints = {
            total: total,
            head: Math.ceil(total / 3),
            torso: total,
            leftArm: Math.floor(total / 2),
            rightArm: Math.floor(total / 2),
            leftLeg: Math.ceil(total / 2),
            rightLeg: Math.ceil(total / 2)
        };
        
        // Mirror to top-level fields for PDF compatibility
        this.hpTotal = total;
        this.hpHead = Math.ceil(total / 3);
        this.hpTorso = total;
        this.hpLArm = Math.floor(total / 2);
        this.hpRArm = Math.floor(total / 2);
        this.hpLLeg = Math.ceil(total / 2);
        this.hpRLeg = Math.ceil(total / 2);
    }

    // Get damage bonus (STR / 3 rounded down)
    getDamageBonus() {
        const str = Number(this.stats?.STR || 0);
        return Math.floor(str / 3);
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

    // Calculate DeathSuit type from Protect ability rank
    // 0-4: Light, 5-9: Medium, 10-14: Heavy, 15-19: Super, 20: Angel
    getDeathSuitTypeFromProtectRank() {
        const protectRank = Number(this.ebonRanks?.protect || 0);
        if (protectRank >= 20) return 'Angel';
        if (protectRank >= 15) return 'Super';
        if (protectRank >= 10) return 'Heavy';
        if (protectRank >= 5) return 'Medium';
        return 'Light';
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

    // Get detailed breakdown of points gained and spent
    getPointsBreakdown() {
        const gained = [];
        const spent = [];

        // Points Gained
        gained.push({ description: 'Starting Points', amount: this.totalPoints || 300 });

        // Disadvantages (from advantages object where type is 'disadvantage')
        for (const category in ADVANTAGES) {
            const categoryData = ADVANTAGES[category];
            for (const advName in categoryData.items) {
                const advData = categoryData.items[advName];
                const rank = this.disadvantages[advName] || 0;
                if (rank > 0 && advData.type === 'disadvantage') {
                    let points = 0;
                    if (typeof advData.oneOffCost === 'number') {
                        points = advData.oneOffCost;
                        gained.push({ description: `${advData.name || advName}`, amount: points });
                    } else {
                        const perRank = advData.costPerRank || 0;
                        points = perRank * rank;
                        gained.push({ description: `${advData.name || advName} (Rank ${rank})`, amount: points });
                    }
                }
            }
        }

        // Phobias
        if (Array.isArray(this.phobias)) {
            for (const ph of this.phobias) {
                const name = ph.name;
                const rank = ph.rank || 0;
                let perRank = 0;
                if (typeof PHOBIAS !== 'undefined' && PHOBIAS.items && PHOBIAS.items[name]) {
                    perRank = PHOBIAS.items[name].costPerRank || (PHOBIA_RULES && PHOBIA_RULES.costPerRank) || 0;
                } else {
                    perRank = (PHOBIA_RULES && PHOBIA_RULES.costPerRank) || 0;
                }
                const points = perRank * rank;
                gained.push({ description: `Phobia: ${name} (Rank ${rank})`, amount: points });
            }
        }

        // Points Spent - Stats (only increases above racial minimum)
        const raceData = RACES[this.race];
        if (raceData && raceData.statMaximums) {
            for (const stat in this.stats) {
                const currentValue = this.stats[stat];
                const minValue = raceData.statMaximums[stat]?.min || 5;
                if (currentValue > minValue) {
                    const increase = currentValue - minValue;
                    const cost = increase * 5;
                    spent.push({ description: `${stat} ${minValue}→${currentValue}: ${increase} × 5`, amount: cost, category: 'stat' });
                }
            }
        }

        // FLUX stat (if flux user, starts at 10, costs 5 per +1)
        if (this.isFluxUser && this.isFluxUser()) {
            const fluxValue = this.derivedStats?.FLUX || 10;
            const baseFlux = 10;
            if (fluxValue > baseFlux) {
                const increase = fluxValue - baseFlux;
                const cost = increase * 5;
                spent.push({ description: `FLUX ${baseFlux}→${fluxValue}: ${increase} × 5`, amount: cost, category: 'stat' });
            }
        }

        // Points Spent - Skills (with triangular formula, showing training package bonuses separately)
        const freeSkills = raceData ? raceData.freeSkills || {} : {};
        
        for (const skillName in this.skills) {
            const rank = Number(this.skills[skillName] || 0);
            if (!rank || rank <= 0) continue;

            const freeRank = Number(freeSkills[skillName] || 0);

            // Check if this skill has training package bonus
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

            // Build a set of free ranks
            const freeRankSet = new Set();
            for (let i = 1; i <= Math.min(rank, freeRank); i++) {
                freeRankSet.add(i);
            }

            // Training package ranks
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

                // Add training package bonus as free entry
                const packageName = this.selectedTrainingPackage && TRAINING_PACKAGES[this.selectedTrainingPackage] 
                    ? TRAINING_PACKAGES[this.selectedTrainingPackage].name 
                    : 'Training Package';
                spent.push({ 
                    description: `${skillName} +${pkgBonus} (${packageName})`, 
                    amount: 0, 
                    category: 'training-package' 
                });
            }

            // Calculate cost for non-free ranks with triangular formula
            let cost = 0;
            const paidRanks = [];
            for (let i = 1; i <= rank; i++) {
                if (!freeRankSet.has(i)) {
                    paidRanks.push(i);
                    cost += i;
                }
            }

            if (cost > 0) {
                const formula = paidRanks.length > 0 ? `(${paidRanks.join('+')})` : '';
                spent.push({ description: `${skillName} +${rank}: ${formula} = ${cost}`, amount: cost, category: 'skill' });
            }
        }

        // Points Spent - Advantages
        for (const category in ADVANTAGES) {
            const categoryData = ADVANTAGES[category];
            for (const advName in categoryData.items) {
                const advData = categoryData.items[advName];
                const rank = this.advantages[advName] || 0;
                if (rank > 0 && advData.type === 'advantage') {
                    let cost = 0;
                    if (typeof advData.oneOffCost === 'number') {
                        cost = advData.oneOffCost;
                        spent.push({ description: `${advData.name || advName}`, amount: cost, category: 'advantage' });
                    } else {
                        const perRank = advData.costPerRank || 0;
                        cost = perRank * rank;
                        spent.push({ description: `${advData.name || advName} (Rank ${rank})`, amount: cost, category: 'advantage' });
                    }
                }
            }
        }

        // Points Spent - Ebon Abilities (with triangular formula)
        if (this.ebonRanks && typeof EBON_ABILITIES !== 'undefined') {
            for (const catKey in this.ebonRanks) {
                const rank = Number(this.ebonRanks[catKey] || 0);
                if (!rank || rank <= 0) continue;
                const cat = EBON_ABILITIES[catKey];
                if (!cat || !cat.canPurchase) continue;

                const cost = (rank * (rank + 1)) / 2;
                const formula = Array.from({ length: rank }, (_, i) => i + 1).join('+');
                const rankData = Array.isArray(cat.ranks) ? cat.ranks[rank - 1] : null;
                const rankTitle = rankData && rankData.title ? rankData.title : `Rank ${rank}`;
                spent.push({ 
                    description: `${cat.name} (${rankTitle}): (${formula}) = ${cost}`, 
                    amount: cost, 
                    category: 'ebon' 
                });
            }
        }

        return { gained, spent };
    }

    // Get detailed breakdown of credits spent (excluding starter kit items)
    getCreditsBreakdown() {
        const spent = [];

        // Helper to find item cost from data arrays
        const findItemCost = (itemName, dataArray) => {
            if (!dataArray) return null;
            if (Array.isArray(dataArray)) {
                const item = dataArray.find(i => i.type === itemName || i.name === itemName || i.equipment === itemName);
                return item ? item.cost : null;
            }
            return null;
        };

        // Helper to find drug cost from nested DRUGS object
        const findDrugCost = (drugName) => {
            if (!DRUGS || typeof DRUGS !== 'object') return null;
            for (const categoryKey in DRUGS) {
                const category = DRUGS[categoryKey];
                if (category.drugs && Array.isArray(category.drugs)) {
                    const drug = category.drugs.find(d => d.name === drugName);
                    if (drug) return drug.cost;
                }
            }
            return null;
        };

        // Weapons
        if (this.weaponInventory && typeof WEAPONS !== 'undefined') {
            for (const [itemName, quantity] of Object.entries(this.weaponInventory)) {
                if (quantity <= 0) continue;
                // Skip starter kit items
                const lockedQty = this.lockedInventory?.armaments?.[itemName] || 0;
                const purchasedQty = quantity - lockedQty;
                if (purchasedQty <= 0) continue;

                const cost = findItemCost(itemName, WEAPONS);
                if (cost !== null) {
                    spent.push({
                        category: 'Weapons',
                        description: itemName,
                        quantity: purchasedQty,
                        unitCost: cost,
                        total: cost * purchasedQty
                    });
                }
            }
        }

        // Armaments
        if (this.armamentInventory && typeof ARMAMENTS !== 'undefined') {
            for (const [itemName, quantity] of Object.entries(this.armamentInventory)) {
                if (quantity <= 0) continue;
                const lockedQty = this.lockedInventory?.armaments?.[itemName] || 0;
                const purchasedQty = quantity - lockedQty;
                if (purchasedQty <= 0) continue;

                const cost = findItemCost(itemName, ARMAMENTS);
                if (cost !== null) {
                    spent.push({
                        category: 'Armaments',
                        description: itemName,
                        quantity: purchasedQty,
                        unitCost: cost,
                        total: cost * purchasedQty
                    });
                }
            }
        }

        // Armour
        if (this.armourInventory && typeof ARMOUR !== 'undefined') {
            for (const [itemName, quantity] of Object.entries(this.armourInventory)) {
                if (quantity <= 0) continue;
                const lockedQty = this.lockedInventory?.armour?.[itemName] || 0;
                const purchasedQty = quantity - lockedQty;
                if (purchasedQty <= 0) continue;

                const cost = findItemCost(itemName, ARMOUR);
                if (cost !== null) {
                    spent.push({
                        category: 'Armour',
                        description: itemName,
                        quantity: purchasedQty,
                        unitCost: cost,
                        total: cost * purchasedQty
                    });
                }
            }
        }

        // Ammunition
        if (this.ammoInventory && typeof AMMUNITION !== 'undefined') {
            for (const [itemName, quantity] of Object.entries(this.ammoInventory)) {
                if (quantity <= 0) continue;
                const lockedQty = this.lockedInventory?.ammo?.[itemName] || 0;
                const purchasedQty = quantity - lockedQty;
                if (purchasedQty <= 0) continue;

                // Parse itemName format: "Calibre × Type" (e.g., "10mm Auto × STD")
                const match = itemName.match(/^(.+?)\s*×\s*(.+)$/);
                if (match) {
                    const calibre = match[1].trim();
                    const type = match[2].trim();
                    const ammoData = AMMUNITION.find(a => a.calibre === calibre);
                    if (ammoData && ammoData.types && ammoData.types[type]) {
                        const cost = ammoData.types[type].stdCost || 0;
                        spent.push({
                            category: 'Ammunition',
                            description: itemName,
                            quantity: purchasedQty,
                            unitCost: cost,
                            total: cost * purchasedQty
                        });
                    }
                }
            }
        }

        // Grenades
        if (this.grenadeInventory && typeof GRENADES !== 'undefined') {
            for (const [itemName, quantity] of Object.entries(this.grenadeInventory)) {
                if (quantity <= 0) continue;
                const lockedQty = this.lockedInventory?.grenades?.[itemName] || 0;
                const purchasedQty = quantity - lockedQty;
                if (purchasedQty <= 0) continue;

                const cost = findItemCost(itemName, GRENADES);
                if (cost !== null) {
                    spent.push({
                        category: 'Grenades',
                        description: itemName,
                        quantity: purchasedQty,
                        unitCost: cost,
                        total: cost * purchasedQty
                    });
                }
            }
        }

        // Specialist Ammunition
        if (this.specialistAmmoInventory && typeof SPECIALIST_AMMUNITION !== 'undefined') {
            for (const [itemName, quantity] of Object.entries(this.specialistAmmoInventory)) {
                if (quantity <= 0) continue;
                const lockedQty = this.lockedInventory?.specialistAmmo?.[itemName] || 0;
                const purchasedQty = quantity - lockedQty;
                if (purchasedQty <= 0) continue;

                const cost = findItemCost(itemName, SPECIALIST_AMMUNITION);
                if (cost !== null) {
                    spent.push({
                        category: 'Specialist Ammunition',
                        description: itemName,
                        quantity: purchasedQty,
                        unitCost: cost,
                        total: cost * purchasedQty
                    });
                }
            }
        }

        // Equipment
        if (this.equipmentInventory && typeof EQUIPMENT !== 'undefined') {
            for (const [itemName, quantity] of Object.entries(this.equipmentInventory)) {
                if (quantity <= 0) continue;
                const lockedQty = this.lockedInventory?.equipment?.[itemName] || 0;
                const purchasedQty = quantity - lockedQty;
                if (purchasedQty <= 0) continue;

                const cost = findItemCost(itemName, EQUIPMENT);
                if (cost !== null) {
                    spent.push({
                        category: 'Equipment',
                        description: itemName,
                        quantity: purchasedQty,
                        unitCost: cost,
                        total: cost * purchasedQty
                    });
                }
            }
        }

        // Drugs
        if (this.drugInventory && typeof DRUGS !== 'undefined') {
            for (const [itemName, quantity] of Object.entries(this.drugInventory)) {
                if (quantity <= 0) continue;
                const lockedQty = this.lockedInventory?.drugs?.[itemName] || 0;
                const purchasedQty = quantity - lockedQty;
                if (purchasedQty <= 0) continue;

                const cost = findDrugCost(itemName);
                if (cost !== null) {
                    spent.push({
                        category: 'Drugs',
                        description: itemName,
                        quantity: purchasedQty,
                        unitCost: cost,
                        total: cost * purchasedQty
                    });
                }
            }
        }

        // Ebon Equipment
        if (this.ebonEquipmentInventory && typeof EBON_EQUIPMENT !== 'undefined') {
            for (const [itemName, quantity] of Object.entries(this.ebonEquipmentInventory)) {
                if (quantity <= 0) continue;
                const lockedQty = this.lockedInventory?.ebonEquipment?.[itemName] || 0;
                const purchasedQty = quantity - lockedQty;
                if (purchasedQty <= 0) continue;

                const cost = findItemCost(itemName, EBON_EQUIPMENT);
                if (cost !== null) {
                    spent.push({
                        category: 'Ebon Equipment',
                        description: itemName,
                        quantity: purchasedQty,
                        unitCost: cost,
                        total: cost * purchasedQty
                    });
                }
            }
        }

        // Vehicles
        if (this.vehicleInventory && typeof VEHICLES !== 'undefined') {
            for (const [itemName, quantity] of Object.entries(this.vehicleInventory)) {
                if (quantity <= 0) continue;
                const lockedQty = this.lockedInventory?.vehicles?.[itemName] || 0;
                const purchasedQty = quantity - lockedQty;
                if (purchasedQty <= 0) continue;

                const cost = findItemCost(itemName, VEHICLES);
                if (cost !== null) {
                    spent.push({
                        category: 'Vehicles',
                        description: itemName,
                        quantity: purchasedQty,
                        unitCost: cost,
                        total: cost * purchasedQty
                    });
                }
            }
        }

        // Sort by category for better organization
        spent.sort((a, b) => {
            if (a.category !== b.category) {
                return a.category.localeCompare(b.category);
            }
            return a.description.localeCompare(b.description);
        });

        return { spent };
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

    // Get move rate (W/R/S); Running skill bonus (+0.3 per rank) only applies to sprint
    getMoveRate() {
        const base = this.move || {};
        const runningRank = Number(this.skills?.Running || 0);
        const sprintBonus = runningRank * 0.3;

        const applyValue = (value, extra = 0) => {
            if (value === '' || value === null || typeof value === 'undefined') return '';
            const num = Number(value);
            if (!Number.isFinite(num)) return '';
            return Math.round((num + extra) * 10) / 10;
        };

        return {
            walk: applyValue(base.walk),
            run: applyValue(base.run),
            sprint: applyValue(base.sprint, sprintBonus)
        };
    }

    // Apply training package skills
    applyTrainingPackage(packageId, selectedCombatSkill = null) {
        if (!packageId || typeof TRAINING_PACKAGES === 'undefined') return;
        
        // Remove current package first if any
        this.removeTrainingPackage();
        
        const packageData = TRAINING_PACKAGES[packageId];
        if (!packageData) return;
        
        this.selectedTrainingPackage = packageId;
        this.packageSkills = {};
        
        // Handle packages with selectable combat skill
        if (packageData.selectableCombatSkill && selectedCombatSkill) {
            this.packageSelectedCombatSkill = selectedCombatSkill;
        }
        
        // Add skills: +1 if skill exists, +2 if new skill
        for (const skillName of packageData.skills) {
            // Skip placeholder - it will be handled by the selected combat skill
            if (skillName === 'Any Close Combat Skill') continue;
            
            const currentRank = this.skills[skillName] || 0;
            const bonusRank = currentRank > 0 ? 1 : 2;  // +1 if exists, +2 if new
            this.skills[skillName] = currentRank + bonusRank;
            this.packageSkills[skillName] = { bonusRank, originalRank: currentRank };  // Track actual bonus given
        }
        
        // If package has selectable combat skill and one is selected, add it to skills
        if (packageData.selectableCombatSkill && selectedCombatSkill) {
            const currentRank = this.skills[selectedCombatSkill] || 0;
            const bonusRank = currentRank > 0 ? 1 : 2;
            this.skills[selectedCombatSkill] = currentRank + bonusRank;
            this.packageSkills[selectedCombatSkill] = { bonusRank, originalRank: currentRank };
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
        this.packageSelectedCombatSkill = null;
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
            deathsuitType: this.deathsuitType,
            phobias: this.phobias,
            selectedTrainingPackage: this.selectedTrainingPackage,
            packageSkills: this.packageSkills,
            packageSelectedCombatSkill: this.packageSelectedCombatSkill,
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
            hpTotal: this.hpTotal,
            hpHead: this.hpHead,
            hpTorso: this.hpTorso,
            hpLArm: this.hpLArm,
            hpRArm: this.hpRArm,
            hpLLeg: this.hpLLeg,
            hpRLeg: this.hpRLeg,
            wounds: this.wounds,
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
        // Migration: deathsuitType is now calculated from Protect rank; clear old stored values
        this.deathsuitType = '';
        this.phobias = data.phobias || [];
        this.selectedTrainingPackage = data.selectedTrainingPackage || null;
        this.packageSkills = normalizeSkillMap(data.packageSkills || {});
        this.packageSelectedCombatSkill = data.packageSelectedCombatSkill || data.kickMurderSelectedCombatSkill || null;  // Support old property name
        this.scl = data.scl || '10';

        // Financials with sensible defaults / backwards compatibility
        this.credits = (typeof data.credits !== 'undefined') ? data.credits : (this.credits || 1500);
        this.inductionBonus = (typeof data.inductionBonus !== 'undefined') ? data.inductionBonus : (this.inductionBonus || 100);
        this.inductionLocked = (typeof data.inductionLocked !== 'undefined') ? data.inductionLocked : (this.inductionLocked !== undefined ? this.inductionLocked : true);
        this.financeChip = (typeof data.financeChip !== 'undefined') ? data.financeChip : this.financeChip;
        this.financeCard = (typeof data.financeCard !== 'undefined') ? data.financeCard : this.financeCard;
        this.housing = data.housing || this.housing;

        this.totalPoints = data.totalPoints || this.totalPoints || 300;
        this.spentPoints = data.spentPoints || this.spentPoints || 0;
        this.starterKitApplied = data.starterKitApplied || this.starterKitApplied || false;
        this.lockedInventory = data.lockedInventory || { armaments: {}, ammo: {}, equipment: {} };
        
        // Hit Points
        this.hpTotal = data.hpTotal || 10;
        this.hpHead = data.hpHead || 4;
        this.hpTorso = data.hpTorso || 10;
        this.hpLArm = data.hpLArm || 5;
        this.hpRArm = data.hpRArm || 5;
        this.hpLLeg = data.hpLLeg || 5;
        this.hpRLeg = data.hpRLeg || 5;
        this.wounds = data.wounds || 0;
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
