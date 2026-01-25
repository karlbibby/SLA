// Training Packages Step
// This step allows selection of a training package after all points are spent

// Track if package was just removed for notification
let packageWasRemoved = false;

function renderTrainingPackagesStep(character, container, onUpdate) {
    if (typeof TRAINING_PACKAGES === 'undefined') {
        container.innerHTML = '<p>Training packages data not loaded.</p>';
        return;
    }
    
    // Check validation and track if package was removed
    const wasRemoved = character.validateTrainingPackage();
    if (wasRemoved) {
        packageWasRemoved = true;
    }
    
    const remainingPoints = character.getRemainingPoints();
    const canSelectPackage = remainingPoints === 0;
    
    // Build header with notification
    let headerHtml = '<div class="section-header">' +
        '<h2 class="section-title">Training Packages</h2>' +
        '<p class="section-description">Select a specialized training package to enhance your operative. Each package grants rank 2 in listed skills.</p>';
    
    // Show notification if package was removed
    if (packageWasRemoved) {
        headerHtml += '<div class="alert alert-warning" style="margin-top: 15px; padding: 12px; background: var(--color-warning); border-radius: 8px; color: #000;">' +
            '<strong>⚠️ Training Package Removed</strong><br>' +
            'Your training package has been removed because you have unspent points. All 300 points must be spent to select a package.' +
            '</div>';
        packageWasRemoved = false; // Clear flag
    }
    
    // Show points status
    if (!canSelectPackage) {
        headerHtml += '<div class="alert alert-info" style="margin-top: 15px; padding: 12px; background: rgba(52, 152, 219, 0.1); border: 1px solid rgba(52, 152, 219, 0.3); border-radius: 8px;">' +
            '<strong>⏳ Spend All Points to Unlock</strong><br>' +
            'You must spend all 300 points before selecting a training package. Remaining: <strong>' + remainingPoints + ' points</strong>' +
            '</div>';
    } else {
        headerHtml += '<div class="alert alert-success" style="margin-top: 15px; padding: 12px; background: rgba(46, 204, 113, 0.1); border: 1px solid rgba(46, 204, 113, 0.3); border-radius: 8px;">' +
            '<strong>✓ Ready to Select</strong><br>' +
            'All points spent! You may now select a training package.' +
            '</div>';
    }
    
    headerHtml += '</div>';
    
    // Build packages grid with "None" option
    let packagesHtml = '<div class="grid-2" style="margin-top: 20px;">';
    
    // Add "None" option card
    const noneSelected = !character.selectedTrainingPackage;
    packagesHtml += '<div class="card package-card ' + (noneSelected ? 'selected' : '') + '" data-package-id="none" style="cursor:pointer; opacity: 1;">' +
        '<div class="card-header">' +
        '<div style="display: flex; align-items: center; gap: 10px;">' +
        '<input type="radio" name="training-package" value="none" ' + (noneSelected ? 'checked' : '') + ' style="cursor: pointer;">' +
        '<div class="card-title">No Package</div>' +
        '</div>' +
        '</div>' +
        '<div class="card-description">Choose not to select a training package.</div>' +
        '</div>';
    
    // Add package cards
    for (const packageId in TRAINING_PACKAGES) {
        const pkg = TRAINING_PACKAGES[packageId];
        const isSelected = character.selectedTrainingPackage === packageId;
        
        // Build skills list with current → new rank for selected package
        let skillsHtml = '<div class="skills-list" style="margin-top: 10px;">';
        
        // Add combat skill selector for packages with selectableCombatSkill flag
        if (isSelected && pkg.selectableCombatSkill) {
            // Build list of unarmed combat skills
            const unarmedCombatSkills = [];
            for (const category in SKILLS) {
                for (const skillName in SKILLS[category].skills) {
                    if (SKILLS[category].skills[skillName].unarmedCombat) {
                        unarmedCombatSkills.push(skillName);
                    }
                }
            }
            
            const selectedSkill = character.packageSelectedCombatSkill || '';
            skillsHtml += '<div style="margin-bottom: 12px; padding: 8px; background: rgba(46, 204, 113, 0.1); border: 1px solid rgba(46, 204, 113, 0.3); border-radius: 4px;">';
            skillsHtml += '<label style="display: block; margin-bottom: 6px; font-weight: 600; color: var(--color-success);">Select One Close Combat Skill:</label>';
            skillsHtml += '<select id="package-combat-select-' + packageId + '" style="width: 100%; padding: 6px; border: 1px solid #666; border-radius: 4px; background: #222; color: #fff;">';
            skillsHtml += '<option value="">-- Choose a skill --</option>';
            unarmedCombatSkills.sort().forEach(skill => {
                skillsHtml += '<option value="' + skill + '"' + (selectedSkill === skill ? ' selected' : '') + '>' + skill + '</option>';
            });
            skillsHtml += '</select>';
            skillsHtml += '</div>';
        }
        
        for (const skillName of pkg.skills) {
            // Find the skill to get governing stat
            let governingStat = '';
            for (const category in SKILLS) {
                if (SKILLS[category].skills[skillName]) {
                    governingStat = SKILLS[category].skills[skillName].governingStat;
                    break;
                }
            }
            
            const currentRank = character.skills[skillName] || 0;
            const bonusRank = currentRank > 0 ? 1 : 2;  // +1 if exists, +2 if new

            // If this package is selected, show pre-package rank → new rank
            let displayCurrentRank = currentRank;
            let displayNewRank = currentRank + bonusRank;
            if (isSelected && character.packageSkills && character.packageSkills[skillName]) {
                const pkgEntry = character.packageSkills[skillName];
                const pkgBonus = (typeof pkgEntry === 'object' && pkgEntry !== null)
                    ? (pkgEntry.bonusRank || 0)
                    : (pkgEntry || 0);
                const originalRank = (typeof pkgEntry === 'object' && pkgEntry !== null && typeof pkgEntry.originalRank === 'number')
                    ? pkgEntry.originalRank
                    : Math.max(0, currentRank - pkgBonus);
                displayCurrentRank = originalRank;
                displayNewRank = originalRank + pkgBonus;
            }
            
            const statLabel = governingStat ? ' <span style="color: var(--text-muted); font-size: 0.85em;">(' + governingStat + ')</span>' : '';

            // Show current → new rank if this package is selected
            if (isSelected) {
                skillsHtml += '<div class="skill-item" style="display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">' +
                    '<span>' + skillName + statLabel + '</span>' +
                    '<span style="color: var(--color-success); font-weight: 600;">' + displayCurrentRank + ' → ' + displayNewRank + '</span>' +
                    '</div>';
            } else {
                skillsHtml += '<div class="skill-item" style="display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">' +
                    '<span>' + skillName + statLabel + '</span>' +
                    '</div>';
            }
        }
        
        // Also show the selected combat skill if any
        if (isSelected && pkg.selectableCombatSkill && character.packageSelectedCombatSkill) {
            let governingStat = '';
            for (const category in SKILLS) {
                if (SKILLS[category].skills[character.packageSelectedCombatSkill]) {
                    governingStat = SKILLS[category].skills[character.packageSelectedCombatSkill].governingStat;
                    break;
                }
            }
            
            const skillName = character.packageSelectedCombatSkill;
            const currentRank = character.skills[skillName] || 0;
            const bonusRank = currentRank > 0 ? 1 : 2;
            
            let displayCurrentRank = currentRank;
            let displayNewRank = currentRank + bonusRank;
            if (character.packageSkills && character.packageSkills[skillName]) {
                const pkgEntry = character.packageSkills[skillName];
                const pkgBonus = (typeof pkgEntry === 'object' && pkgEntry !== null)
                    ? (pkgEntry.bonusRank || 0)
                    : (pkgEntry || 0);
                const originalRank = (typeof pkgEntry === 'object' && pkgEntry !== null && typeof pkgEntry.originalRank === 'number')
                    ? pkgEntry.originalRank
                    : Math.max(0, currentRank - pkgBonus);
                displayCurrentRank = originalRank;
                displayNewRank = originalRank + pkgBonus;
            }
            
            const statLabel = governingStat ? ' <span style="color: var(--text-muted); font-size: 0.85em;">(' + governingStat + ')</span>' : '';
            skillsHtml += '<div class="skill-item" style="display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid rgba(255,255,255,0.05); border-top: 1px solid rgba(46, 204, 113, 0.3); margin-top: 6px; padding-top: 6px; font-weight: 600; color: var(--color-success);">' +
                '<span>' + skillName + statLabel + '</span>' +
                '<span>' + displayCurrentRank + ' → ' + displayNewRank + '</span>' +
                '</div>';
        }
        
        skillsHtml += '</div>';
        
        const disabledStyle = !canSelectPackage ? 'opacity: 0.5; cursor: not-allowed;' : 'cursor: pointer;';
        const disabledClass = !canSelectPackage ? 'disabled' : '';
        
        packagesHtml += '<div class="card package-card ' + (isSelected ? 'selected' : '') + ' ' + disabledClass + '" data-package-id="' + packageId + '" style="' + disabledStyle + '">' +
            '<div class="card-header">' +
            '<div style="display: flex; align-items: center; gap: 10px;">' +
            '<input type="radio" name="training-package" value="' + packageId + '" ' + (isSelected ? 'checked' : '') + ' ' + (!canSelectPackage ? 'disabled' : '') + ' style="cursor: ' + (canSelectPackage ? 'pointer' : 'not-allowed') + ';">' +
            '<div>' +
            '<div class="card-title">' + pkg.name + '</div>' +
            '<div class="card-subtitle">' + pkg.skills.length + ' Skills (Rank 2 or +1)</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="card-description">' + pkg.description + '</div>' +
            skillsHtml +
            '</div>';
    }
    
    packagesHtml += '</div>';
    
    container.innerHTML = headerHtml + packagesHtml;
    
    // Add combat skill selector change handler for packages with selectableCombatSkill
    const packageCombatSelect = container.querySelector('[id^="package-combat-select-"]');
    if (packageCombatSelect) {
        const packageId = packageCombatSelect.id.replace('package-combat-select-', '');
        packageCombatSelect.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent card click handler from firing
        });
        packageCombatSelect.addEventListener('change', function(e) {
            e.stopPropagation(); // Prevent card click handler from firing
            const selectedSkill = this.value;
            character.applyTrainingPackage(packageId, selectedSkill);
            renderTrainingPackagesStep(character, container, onUpdate);
            onUpdate();
        });
    }
    
    // Add click handlers
    container.querySelectorAll('.package-card').forEach(card => {
        card.addEventListener('click', function() {
            // Only allow selection if points are spent
            if (!canSelectPackage && this.dataset.packageId !== 'none') {
                return;
            }
            
            const packageId = this.dataset.packageId;
            
            // Handle deselection (None option)
            if (packageId === 'none') {
                character.removeTrainingPackage();
                packageWasRemoved = false; // Don't show notification for manual deselection
                renderTrainingPackagesStep(character, container, onUpdate);
                onUpdate();
                return;
            }
            
            // Toggle selection: if clicking the same package, deselect it
            if (character.selectedTrainingPackage === packageId) {
                character.removeTrainingPackage();
                packageWasRemoved = false; // Don't show notification for manual deselection
            } else {
                // Apply new package (will remove old one first)
                character.applyTrainingPackage(packageId);
            }
            
            renderTrainingPackagesStep(character, container, onUpdate);
            onUpdate();
        });
    });
    
    // Add radio button click handlers
    container.querySelectorAll('input[name="training-package"]').forEach(radio => {
        radio.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent card click
            const packageId = this.value;
            
            if (!canSelectPackage && packageId !== 'none') {
                return;
            }
            
            if (packageId === 'none') {
                character.removeTrainingPackage();
                packageWasRemoved = false;
            } else {
                character.applyTrainingPackage(packageId);
            }
            
            renderTrainingPackagesStep(character, container, onUpdate);
            onUpdate();
        });
    });
}

// Export for use in wizard
if (typeof window !== 'undefined') {
    window.renderTrainingPackagesStep = renderTrainingPackagesStep;
}
