# SLA Industries Character Generator — Copilot Instructions

## Project Overview
Single-page character creation wizard for **SLA Industries** tabletop RPG. Generates pre-filled PDF clearance cards with validated character stats, skills, inventory, and abilities. Modern vanilla JavaScript architecture: no frameworks, modular step-based UI, data-driven configuration.

## Critical Architecture Decisions

### 1. **Step-Based Wizard Pattern** (js/ui/wizard.js)
- Single wizard controller managing 13 sequential creation steps
- Each step is a standalone render function in `js/ui/steps/*.js`
- Character updates trigger `WIZARD.renderCurrentStep()` → component re-renders
- Navigation validates step-specific rules before advancing (e.g., phobia conflicts)
- **Key pattern**: Steps receive character object + onUpdate callback; changes call `character.updateXxx()` then `onUpdate()`

### 2. **Data-Driven Configuration** (js/data/*.js)
All game data live in `RACES`, `SKILLS`, `ADVANTAGES`, `WEAPONS`, etc. — JavaScript object constants.
- **Character lookup pattern**: `RACES[character.race]` → read stat maxes, move rates, free skills
- **Validation pattern**: See `VALIDATORS.js` — cross-check user input against data object constraints
- Example: stat increases checked against `RACES[race].statMaximums[stat].max`
- **Skill cost formula**: `cost = (rank * (rank + 1)) / 2` — standard throughout

### 3. **Character Model Centrality** (js/character.js)
Single Character class holds all state: stats, skills, inventories, derived values. Methods like:
- `addAdvantage(name, rank)` → validates against points, updates character state
- `calculatePoints()` / `calculateCredits()` → real-time point tracking
- `toJSON()` / `fromJSON()` → serialization for save/load
- **Constraint**: Character logic must sync with VALIDATORS and UI display

### 4. **Persistence & Integration** (js/app.js)
- `localStorage` auto-saves character after each update (`onCharacterUpdate()` → `saveAutoSave()`)
- Export/import as `.sla` JSON files
- **PDF export** (pdfExport.js) reads `window.currentCharacter` — must keep in sync
- Clearance card has two pages: stats/equipment + flux abilities (if flux user)

## Common Development Tasks

### Adding a New Skill Type or Advantage
1. Add entry to `js/data/skills.js` or `js/data/advantages.js` with structure:
   ```javascript
   skillName: { governingStat: 'STR', description: '...', baseRank: 0, maxRank: 6 }
   ```
2. Validation auto-works if structure matches — `VALIDATORS.validateSkillAllocation()` checks existing rules
3. Update step render function (e.g., `skillsAdvantagesTraining.js`) if new UI needed
4. Run through full wizard to ensure point costs calculate correctly

### Adding a New Character Class
1. Entry in `TRAINING_PACKAGES` (js/data/trainingPackages.js) with `freeSkills`, `skillPoints`, `scl`, description
2. Class grants free skills; validation in `skillsAdvantagesTraining.js` prevents duplicate rank assignment
3. Test: Create character, select class, verify free skills appear in skill list

### Modifying PDF Layout
- Two pages: clearance card (`renderPurchasedWeapons()`, `renderPurchasedArmour()`, etc.) + flux abilities
- **Skill aliases** (line 380–389): Common alt names → canonical SKILLS lookup keys (e.g., 'Paramedic' → 'Medical, Paramedic')
- HTML2Canvas + jsPDF render approach; edit inline styles in `pdfExport.js`
- Test with `window.generateCharacterPdf()` console call

## Key Patterns & Conventions

- **Event flow**: User input → `character.updateXxx()` → `onUpdate()` → `WIZARD.renderCurrentStep()` → UI re-renders
- **Cost formulas**: Skills `(r*(r+1))/2`, advantages variable by type, stat increases free up to racial max
- **Validation first**: Always validate in VALIDATORS before modifying character state
- **Inventory tracking**: `character.weaponInventory`, `ammoInventory`, etc. use `{ itemName: quantity }` maps
- **Skill aliases**: Multiple names map to single canonical key in SKILLS (see pdfExport.js line 382–389)

## File Organization

```
js/
  ├─ app.js              # Main init, event listeners, save/load
  ├─ character.js        # Character model + methods
  ├─ validators.js       # Input validation against game rules
  ├─ pdfExport.js        # Clearance card PDF generation
  ├─ data/               # Game configuration (RACES, SKILLS, WEAPONS, etc.)
  └─ ui/
      ├─ wizard.js       # Step controller, navigation
      ├─ components.js   # Reusable UI elements (cards, stat rows, etc.)
      └─ steps/          # 13 step render functions (basicInfo.js, race.js, etc.)
```

## Integration Points

- **localStorage**: `saveAutoSave()` serializes character JSON after each change
- **PDF export**: Reads `window.currentCharacter` directly; test before adding new fields
- **Data hot-swap**: All game data is constant objects; can be swapped/reloaded without code changes
- **Skill aliases**: PDF export remaps user-entered skill names via `skillAliases` object for canonical lookup

## Testing Checklist for Changes

1. **UI modification**: Test full wizard flow (start → finish) to ensure layout/interaction works
2. **Data addition**: Validate cross-checks work (e.g., new skill doesn't break cost/max calculations)
3. **Character logic**: Run through auto-save, export as .sla, reload, verify field state matches
4. **PDF**: Generate PDF with test character; check new fields render correctly
5. **Mobile responsive**: Test on mobile viewport (CSS in `css/styles.css` and `theme.css`)

## Common Pitfalls

- **Character sync**: If adding fields to Character, update `toJSON()`/`fromJSON()` and update `window.currentCharacter`
- **Skill lookup failures**: Ensure skill name matches exactly with SKILLS data; use `skillAliases` for common variants
- **Point overflow**: New inventory items must deduct from credits (`character.creditsAvailable`); test total doesn't go negative
- **Race-dependent maxes**: Always check `RACES[character.race]` before allowing stat/skill increases
