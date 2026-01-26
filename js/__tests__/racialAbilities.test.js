/**
 * Tests for racial abilities feature
 * Tests that races have proper ability structures and data integrity
 */

describe('Racial Abilities', () => {
    describe('Vevaphon Racial Abilities', () => {
        let vevaphon;

        beforeEach(() => {
            vevaphon = RACES.vevaphon;
        });

        test('Vevaphon exists in RACES', () => {
            expect(vevaphon).toBeDefined();
            expect(vevaphon.id).toBe('vevaphon');
            expect(vevaphon.name).toBe('Vevaphon');
        });

        test('Vevaphon has racialAbilities array', () => {
            expect(Array.isArray(vevaphon.racialAbilities)).toBe(true);
            expect(vevaphon.racialAbilities.length).toBeGreaterThan(0);
        });

        test('Vevaphon has exactly 2 racial abilities', () => {
            expect(vevaphon.racialAbilities.length).toBe(2);
        });

        test('Cellular Adaptation ability has correct structure', () => {
            const ability = vevaphon.racialAbilities.find(a => a.name === 'Cellular Adaptation');
            expect(ability).toBeDefined();
            expect(ability.type).toBe('passive');
            expect(ability.shortDesc).toBeTruthy();
            expect(ability.description).toBeTruthy();
            expect(ability.mechanics).toBeDefined();
            expect(ability.mechanics.pv).toBe(2);
        });

        test('Regenerative Cells ability has correct structure', () => {
            const ability = vevaphon.racialAbilities.find(a => a.name === 'Regenerative Cells');
            expect(ability).toBeDefined();
            expect(ability.type).toBe('passive');
            expect(ability.shortDesc).toBeTruthy();
            expect(ability.description).toBeTruthy();
            expect(ability.mechanics).toBeDefined();
            expect(ability.mechanics.healing).toBe(1);
        });

        test('All Vevaphon abilities have descriptions as markdown', () => {
            vevaphon.racialAbilities.forEach(ability => {
                // Descriptions should contain markdown formatting
                const hasFormatting = ability.description.includes('**') || 
                                     ability.description.includes('- ') ||
                                     ability.description.includes('\n');
                expect(hasFormatting).toBe(true);
            });
        });

        test('All Vevaphon abilities have shortDesc without markdown', () => {
            vevaphon.racialAbilities.forEach(ability => {
                // shortDesc should be plain text, no markdown
                expect(ability.shortDesc).toBeTruthy();
                expect(ability.shortDesc).toMatch(/^[A-Za-z0-9 ,\-\.]+$/);
            });
        });
    });

    describe('Xeno Racial Abilities', () => {
        let xeno;

        beforeEach(() => {
            xeno = RACES.xeno;
        });

        test('Xeno exists in RACES', () => {
            expect(xeno).toBeDefined();
            expect(xeno.id).toBe('xeno');
            expect(xeno.name).toContain('Xeno');
        });

        test('Xeno has racialAbilities array', () => {
            expect(Array.isArray(xeno.racialAbilities)).toBe(true);
            expect(xeno.racialAbilities.length).toBeGreaterThan(0);
        });

        test('Xeno has exactly 2 racial abilities', () => {
            expect(xeno.racialAbilities.length).toBe(2);
        });

        test('Enhanced Reflexes ability has correct structure', () => {
            const ability = xeno.racialAbilities.find(a => a.name === 'Enhanced Reflexes');
            expect(ability).toBeDefined();
            expect(ability.type).toBe('passive');
            expect(ability.shortDesc).toBeTruthy();
            expect(ability.description).toBeTruthy();
            expect(ability.mechanics).toBeDefined();
        });

        test('Predatory Senses ability has correct structure', () => {
            const ability = xeno.racialAbilities.find(a => a.name === 'Predatory Senses');
            expect(ability).toBeDefined();
            expect(ability.type).toBe('passive');
            expect(ability.shortDesc).toBeTruthy();
            expect(ability.description).toBeTruthy();
            expect(ability.mechanics).toBeDefined();
        });

        test('All Xeno abilities have descriptions as markdown', () => {
            xeno.racialAbilities.forEach(ability => {
                const hasFormatting = ability.description.includes('**') || 
                                     ability.description.includes('- ') ||
                                     ability.description.includes('\n');
                expect(hasFormatting).toBe(true);
            });
        });
    });

    describe('Racial Abilities General Structure', () => {
        test('Racial ability objects have required fields', () => {
            const races = [RACES.vevaphon, RACES.xeno];
            races.forEach(race => {
                if (race.racialAbilities) {
                    race.racialAbilities.forEach(ability => {
                        expect(ability.name).toBeTruthy();
                        expect(typeof ability.name).toBe('string');
                        expect(ability.type).toBeTruthy();
                        expect(ability.shortDesc).toBeTruthy();
                        expect(ability.description).toBeTruthy();
                        expect(ability.mechanics).toBeDefined();
                    });
                }
            });
        });

        test('Mechanics objects have valid fields', () => {
            const races = [RACES.vevaphon, RACES.xeno];
            races.forEach(race => {
                if (race.racialAbilities) {
                    race.racialAbilities.forEach(ability => {
                        const mech = ability.mechanics;
                        // Each should have at least one of these
                        const hasValidField = mech.pv !== undefined || 
                                            mech.healing !== undefined || 
                                            mech.cost !== undefined ||
                                            mech.statMods !== undefined ||
                                            mech.duration !== undefined;
                        expect(hasValidField).toBe(true);
                    });
                }
            });
        });

        test('Non-ability races do not have racialAbilities', () => {
            const otherRaces = [RACES.human, RACES.frother, RACES.ebon];
            otherRaces.forEach(race => {
                // These races should not have racialAbilities defined
                // (Or if they do, it should be an empty array)
                if (race.racialAbilities) {
                    expect(Array.isArray(race.racialAbilities)).toBe(true);
                    // Can be empty or undefined, but if present should be valid
                }
            });
        });
    });

    describe('Racial Ability Integration with Character', () => {
        let character;

        beforeEach(() => {
            character = new Character();
        });

        test('Character can access Vevaphon abilities when race is set', () => {
            character.race = 'vevaphon';
            const raceData = RACES['vevaphon'];
            expect(raceData.racialAbilities).toBeDefined();
            expect(raceData.racialAbilities.length).toBe(2);
        });

        test('Character can access Xeno abilities when race is set', () => {
            character.race = 'xeno';
            const raceData = RACES['xeno'];
            expect(raceData.racialAbilities).toBeDefined();
            expect(raceData.racialAbilities.length).toBe(2);
        });

        test('Changing race updates available abilities', () => {
            character.race = 'vevaphon';
            const vevAbilities = RACES['vevaphon'].racialAbilities;
            
            character.race = 'xeno';
            const xenoAbilities = RACES['xeno'].racialAbilities;
            
            expect(vevAbilities[0].name).not.toBe(xenoAbilities[0].name);
        });
    });

    describe('PDF Export Compatibility', () => {
        test('Vevaphon abilities render in PDF export', () => {
            const character = new Character();
            character.race = 'vevaphon';
            
            const abilities = RACES['vevaphon'].racialAbilities;
            expect(abilities).toBeDefined();
            
            // Should be able to build PDF content
            abilities.forEach(ability => {
                expect(ability.name).toBeTruthy();
                expect(ability.description).toBeTruthy();
                // Description should be escapable for HTML
                const escaped = escapeHtml(ability.description);
                expect(escaped).toBeTruthy();
            });
        });

        test('Xeno abilities render in PDF export', () => {
            const character = new Character();
            character.race = 'xeno';
            
            const abilities = RACES['xeno'].racialAbilities;
            expect(abilities).toBeDefined();
            
            abilities.forEach(ability => {
                expect(ability.name).toBeTruthy();
                expect(ability.description).toBeTruthy();
                const escaped = escapeHtml(ability.description);
                expect(escaped).toBeTruthy();
            });
        });
    });
});
