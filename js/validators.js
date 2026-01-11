// SLA Industries Character Generator - Validation Functions

const VALIDATORS = {
    // Validate race selection
    validateRace(raceId) {
        if (!raceId) {
            return { valid: false, message: 'Race must be selected' };
        }
        if (!RACES[raceId]) {
            return { valid: false, message: 'Invalid race selected' };
        }
        return { valid: true };
    },

    // Validate class selection
    validateClass(classId) {
        if (!classId) {
            return { valid: false, message: 'Class must be selected' };
        }
        if (!CLASSES[classId]) {
            return { valid: false, message: 'Invalid class selected' };
        }
        return { valid: true };
    },

    // Validate stat allocation
    validateStatAllocation(character, statName, newValue) {
        if (!character.race) {
            return { valid: false, message: 'Race must be selected first' };
        }

        const maximums = RACES[character.race].statMaximums;
        const statMax = maximums[statName];

        if (!statMax) {
            return { valid: false, message: `Invalid stat: ${statName}` };
        }

        if (newValue < statMax.min) {
            return { valid: false, message: `${statName} cannot be below ${statMax.min}` };
        }

        if (newValue > statMax.max) {
            return { valid: false, message: `${statName} cannot exceed ${statMax.max}` };
        }

        return { valid: true };
    },

    // Validate skill allocation
    validateSkillAllocation(character, skillName, newRank) {
        if (!character.race) {
            return { valid: false, message: 'Race must be selected first' };
        }

        // Find skill data
        let skillData = null;
        for (const category in SKILLS) {
            if (SKILLS[category].skills[skillName]) {
                skillData = SKILLS[category].skills[skillName];
                break;
            }
        }

        if (!skillData) {
            return { valid: false, message: `Invalid skill: ${skillName}` };
        }

        const governingStat = skillData.governingStat;
        let statValue;

        if (governingStat === 'PHYS') {
            character.calculateDerivedStats();
            statValue = character.derivedStats.PHYS;
        } else if (governingStat === 'KNOW') {
            character.calculateDerivedStats();
            statValue = character.derivedStats.KNOW;
        } else {
            statValue = character.stats[governingStat];
        }

        const maxRank = Math.min(10, statValue);

        if (newRank < 0) {
            return { valid: false, message: 'Skill rank cannot be negative' };
        }

        if (newRank > maxRank) {
            return { valid: false, message: `${skillName} cannot exceed rank ${maxRank} (governed by ${governingStat} of ${statValue})` };
        }

        return { valid: true };
    },

    // Validate advantage/disadvantage selection
    validateAdvantageSelection(character, advName, rank, isDisadvantage) {
        // Find advantage data
        let advData = null;
        for (const category in ADVANTAGES) {
            if (ADVANTAGES[category].items[advName]) {
                advData = ADVANTAGES[category].items[advName];
                break;
            }
        }

        if (!advData) {
            return { valid: false, message: `Invalid advantage: ${advName}` };
        }

        // Check if type matches (advantage vs disadvantage)
        if (advData.type === 'advantage' && isDisadvantage) {
            return { valid: false, message: `${advName} is an advantage, not a disadvantage` };
        }
        if (advData.type === 'disadvantage' && !isDisadvantage) {
            return { valid: false, message: `${advName} is a disadvantage, not an advantage` };
        }

        if (rank < 0) {
            return { valid: false, message: 'Rank cannot be negative' };
        }

        if (rank > advData.maxRank) {
            return { valid: false, message: `${advName} cannot exceed rank ${advData.maxRank}` };
        }

        // Check for conflicting advantages
        if (isDisadvantage) {
            const conflictCheck = VALIDATORS.checkConflictingAdvantages(character, advName, true);
            if (!conflictCheck.valid) {
                return conflictCheck;
            }
        } else {
            const conflictCheck = VALIDATORS.checkConflictingAdvantages(character, advName, false);
            if (!conflictCheck.valid) {
                return conflictCheck;
            }
        }

        return { valid: true };
    },

    // Check for conflicting advantages (e.g., Good Looking + Bad Looks)
    checkConflictingAdvantages(character, advName, isDisadvantage) {
        const conflicts = {
            'Good Looks': ['Bad Looks'],
            'Bad Looks': ['Good Looks'],
            'Good Hearing': ['Bad Hearing'],
            'Bad Hearing': ['Good Hearing'],
            'Good Eyesight': ['Bad Eyesight'],
            'Bad Eyesight': ['Good Eyesight']
        };

        const conflictList = conflicts[advName];
        if (!conflictList) {
            return { valid: true };
        }

        const collectionToCheck = isDisadvantage ? character.advantages : character.disadvantages;

        for (const conflict of conflictList) {
            if (collectionToCheck[conflict] && collectionToCheck[conflict] > 0) {
                return {
                    valid: false,
                    message: `Cannot have both ${advName} and ${conflict}`
                };
            }
        }

        return { valid: true };
    },

    // Validate point expenditure
    validatePointExpenditure(character) {
        const availablePoints = character.getAvailablePoints();
        
        if (availablePoints < 0) {
            return {
                valid: false,
                message: `Over budget by ${Math.abs(availablePoints)} points`
            };
        }

        return { valid: true };
    },

    // Validate character completion
    validateCharacterCompletion(character) {
        const errors = [];

        // Basic info validation
        if (!character.name || character.name.trim() === '') {
            errors.push('Character name is required');
        }

        if (!character.race) {
            errors.push('Race must be selected');
        }

        if (!character.class) {
            errors.push('Class must be selected');
        }

        // Stat validation
        if (character.race) {
            const maximums = RACES[character.race].statMaximums;
            for (const stat in character.stats) {
                if (maximums[stat]) {
                    if (character.stats[stat] < maximums[stat].min) {
                        errors.push(`${stat} cannot be below ${maximums[stat].min}`);
                    }
                    if (character.stats[stat] > maximums[stat].max) {
                        errors.push(`${stat} cannot exceed ${maximums[stat].max}`);
                    }
                }
            }
        }

        // Skill validation
        for (const skillName in character.skills) {
            const rank = character.skills[skillName];
            const maxRank = character.getSkillMaxRank(skillName);
            if (rank > maxRank) {
                errors.push(`${skillName} exceeds maximum rank of ${maxRank}`);
            }
        }

        // Point validation
        const availablePoints = character.getAvailablePoints();
        if (availablePoints < 0) {
            errors.push(`Over budget by ${Math.abs(availablePoints)} points`);
        }

        // Ebon validation
        if (character.isFluxUser() && character.derivedStats.FLUX < 10) {
            errors.push('FLUX cannot be below 10 for Ebon/Brain Waster characters');
        }

        return {
            valid: errors.length === 0,
            errors: errors
        };
    },

    // Validate training package selection
    validateTrainingPackage(character, packageName) {
        if (!TRAINING_PACKAGES[packageName]) {
            return { valid: false, message: 'Invalid training package' };
        }

        return { valid: true };
    },

    // Validate equipment selection
    validateEquipmentSelection(character, equipment) {
        if (!character.class) {
            return { valid: false, message: 'Class must be selected first' };
        }

        const classData = CLASSES[character.class];
        const classEquipment = classData.startingEquipment;

        // Check if equipment is valid for class
        const isValidEquipment = classEquipment.includes(equipment) ||
            character.selectedEquipment.includes(equipment);

        if (!isValidEquipment) {
            return {
                valid: false,
                message: `${equipment} is not available for ${classData.name} class`
            };
        }

        return { valid: true };
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VALIDATORS;
}
