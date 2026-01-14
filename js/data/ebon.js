// SLA Industries Character Generator - Ebon/Flux Abilities (Reworked to new specification)
//
// Structure:
// EBON_ABILITIES = {
//   categoryKey: {
//     name: 'Display Name',
//     slug: 'categoryKey',
//     freeAbility: 'description of free ability',
//     startingMaxRank: 10,           // maximum rank purchasable at character generation
//     canPurchase: true|false,      // false for Formulae (GM awarded), Gore Cannon handled via necanthropeOnly
//     necanthropeOnly: true|false,  // true for Gore Cannon category
//     ranks: [                       // 20 entries, index 0 => rank 1
//       { rank: 1, title: '...', cost: 1, armDmg: 2, dmg: 2, pen: 4, range: '25m', blastRadius: null, notes: '' },
//       ...
//     ]
//   }
// }
//
// FORMULAE is also represented as a category but flagged canPurchase:false and starts at Rank 1 by default.

const EBON_ABILITIES = {
  blast: {
    name: 'BLAST',
    slug: 'blast',
    freeAbility: 'Crack ice and glass.',
    startingMaxRank: 10,
    canPurchase: true,
    necanthropeOnly: false,
    ranks: [
      { rank: 1, title: 'Blast 1', armDmg: 2, dmg: 2, pen: 4, range: '25m', blastRadius: null, cost: 1, notes: '' },
      { rank: 2, title: 'Bomb 1', armDmg: 2, dmg: 2, pen: 4, range: '25m', blastRadius: '3m', cost: 2, notes: '' },
      { rank: 3, title: 'Blast 2', armDmg: 2, dmg: 5, pen: 5, range: '25m', blastRadius: null, cost: 3, notes: '' },
      { rank: 4, title: 'Bomb 2', armDmg: 2, dmg: 5, pen: 5, range: '25m', blastRadius: '3m', cost: 4, notes: '' },
      { rank: 5, title: 'Blast 3', armDmg: 2, dmg: 7, pen: 7, range: '25m', blastRadius: null, cost: 4, notes: '' },
      { rank: 6, title: 'Bomb 3', armDmg: 2, dmg: 7, pen: 7, range: '25m', blastRadius: '3m', cost: 6, notes: '' },
      { rank: 7, title: 'Blast 4', armDmg: 3, dmg: 10, pen: 8, range: '25m', blastRadius: null, cost: 7, notes: '' },
      { rank: 8, title: 'Bomb 4', armDmg: 3, dmg: 10, pen: 8, range: '25m', blastRadius: '3m', cost: 8, notes: '' },
      { rank: 9, title: 'Blast 5', armDmg: 3, dmg: 12, pen: 10, range: '25m', blastRadius: null, cost: 9, notes: '' },
      { rank: 10, title: 'Bomb 5', armDmg: 3, dmg: 12, pen: 10, range: '25m', blastRadius: '5m', cost: 10, notes: '' },
      { rank: 11, title: 'Blast 6', armDmg: 4, dmg: 15, pen: 12, range: '40m', blastRadius: null, cost: 11, notes: '' },
      { rank: 12, title: 'Bomb 6', armDmg: 4, dmg: 15, pen: 10, range: '40m', blastRadius: '5m', cost: 12, notes: '' },
      { rank: 13, title: 'Blast 7', armDmg: 4, dmg: 17, pen: 14, range: '40m', blastRadius: null, cost: 13, notes: '' },
      { rank: 14, title: 'Bomb 7', armDmg: 4, dmg: 17, pen: 10, range: '40m', blastRadius: '7m', cost: 14, notes: '' },
      { rank: 15, title: 'Blast 8', armDmg: 5, dmg: 20, pen: 15, range: '40m', blastRadius: null, cost: 15, notes: '' },
      { rank: 16, title: 'Bomb 8', armDmg: 5, dmg: 20, pen: 12, range: '40m', blastRadius: '9m', cost: 16, notes: '' },
      { rank: 17, title: 'Blast 9', armDmg: 5, dmg: 22, pen: 17, range: '40m', blastRadius: null, cost: 17, notes: '' },
      { rank: 18, title: 'Bomb 9', armDmg: 10, dmg: 30, pen: 15, range: '40m', blastRadius: '10m', cost: 18, notes: '' },
      { rank: 19, title: 'Blast 10', armDmg: 10, dmg: 25, pen: 20, range: '40m', blastRadius: null, cost: 19, notes: '' },
      { rank: 20, title: 'Bomb 10', armDmg: 20, dmg: 40, pen: 15, range: '40m', blastRadius: '10m', cost: 20, notes: '' }
    ]
  },

  blue_thermal: {
    name: 'BLUE THERMAL',
    slug: 'blue_thermal',
    freeAbility: 'Make ice cubes, keep drink cool, ice cream does not run etc.',
    startingMaxRank: 10,
    canPurchase: true,
    necanthropeOnly: false,
    ranks: [
      { rank: 1, title: 'Resist Heat 1', cost: 1, notes: 'Up to 50°C, duration = CONC minutes' },
      { rank: 2, title: 'Create Cold 1', cost: 2, notes: 'Lower object to -10°C, 1 action to lower, 2 rounds to heat up' },
      { rank: 3, title: 'Freezing Blast 1', cost: 2, armDmg: 2, dmg: 6, pen: 4, range: '8m' },
      { rank: 4, title: 'Ice Blade 1', cost: 4, dmg: 8, armDmg: 2, pen: 4, notes: 'When splintered DMG 2 with further wound' },
      { rank: 5, title: 'Cold Aura 1', cost: 5, dmg: 6, notes: 'Duration 1 round' },
      { rank: 6, title: 'Resist Heat 2', cost: 2, notes: 'Up to 80°C, duration = CONC minutes' },
      { rank: 7, title: 'Create Cold 2', cost: 6, notes: 'Lower object to -30°C, 1 action to lower, 3 rounds to heat up' },
      { rank: 8, title: 'Freezing Blast 2', cost: 4, armDmg: 4, dmg: 8, pen: 6, range: '12m' },
      { rank: 9, title: 'Ice Blade 2', cost: 8, dmg: 12, armDmg: 4, pen: 8, notes: 'When splintered DMG 4 with further wound' },
      { rank: 10, title: 'Cold Aura 2', cost: 15, dmg: 9, pen: 1, notes: 'Duration 1 round' },
      { rank: 11, title: 'Resist Heat 3', cost: 4, notes: 'Up to 100°C, duration = CONC minutes' },
      { rank: 12, title: 'Create Cold 3', cost: 10, notes: 'Lower object/area to -60°C within 1m, 1 action to lower, 4 rounds to heat up; can cool 20m diameter area' },
      { rank: 13, title: 'Freezing Blast 3', cost: 6, armDmg: 6, dmg: 10, pen: 8, range: '17m' },
      { rank: 14, title: 'Ice Blade 3', cost: 12, dmg: 16, armDmg: 6, pen: 12, notes: 'When splintered DMG 6 with further wound' },
      { rank: 15, title: 'Cold Aura 3', cost: 20, dmg: 11, armDmg: 1, pen: 2, notes: 'Duration 1 round' },
      { rank: 16, title: 'Resist Heat 4', cost: 6, notes: 'Up to 240°C, duration = CONC minutes' },
      { rank: 17, title: 'Create Cold 4', cost: 15, notes: 'Lower object to -254°C within 10m or cool 50m diameter area to -60°C, 1 action to cool, 5 rounds to heat' },
      { rank: 18, title: 'Freezing Blast 4', cost: 8, armDmg: 8, dmg: 12, pen: 10, range: '25m' },
      { rank: 19, title: 'Ice Blade 4', cost: 16, dmg: 20, armDmg: 8, pen: 16, notes: 'When splintered DMG 8 with further wound' },
      { rank: 20, title: 'Chill', cost: null, notes: 'Match hits in opponent body for FLUX to freeze until body naturally thaws' }
    ]
  },

  communication: {
    name: 'COMMUNICATION',
    slug: 'communication',
    freeAbility: '“Notice me...” They look round and notice you.',
    startingMaxRank: 10,
    canPurchase: true,
    necanthropeOnly: false,
    ranks: [
      { rank: 1, title: 'Thought Plant 1', cost: 1, notes: 'Short message ≤12 words, range sight' },
      { rank: 2, title: 'Thought Plant 2', cost: 2, notes: 'Short message ≤30 words, range sight' },
      { rank: 3, title: 'Thought Plant 3', cost: 4, notes: 'Send message to known Ebon, range sight within 100km, dur 30s, no word limit' },
      { rank: 4, title: 'Thought Plant 4', cost: 5, notes: 'Send message, range 100km, dur 30s' },
      { rank: 5, title: 'Converse 1', cost: 5, notes: 'Send and receive short message ≤12 words, range sight' },
      { rank: 6, title: 'Converse 2', cost: 6, notes: 'Send and receive, range 100km, unlimited duration' },
      { rank: 7, title: 'Converse 3', cost: 7, notes: 'Send and receive, range 500km, unlimited duration' },
      { rank: 8, title: 'Mind Read 1', cost: 8, notes: 'Basic info (name, DOB, address), range touch, dur 3min — Save required' },
      { rank: 9, title: 'Mind Read 2', cost: 9, notes: 'Moderate mind read (friends, family), range touch, dur 5min — Save required' },
      { rank: 10, title: 'Thought Plant 5', cost: 10, notes: 'Power aura: seen as trusted/followed by physically/mentally inferior, range touch, dur = CONC mins — Save required' },
      { rank: 11, title: 'Thought Plant 6', cost: 11, notes: 'Charm: person falls in love/admiration, dur = CHA hours — Save required' },
      { rank: 12, title: 'Converse 4', cost: 12, notes: 'Planet-wide comm with anyone known, dur = CONC seconds, range 18,000km' },
      { rank: 13, title: 'Mind Read 3', cost: 13, notes: 'Super mind read: intentions, secrets — dur = CONC mins — Save required' },
      { rank: 14, title: 'Thought Plant 7', cost: 14, notes: 'Transmits emotions, dur = CONC mins — Save required' },
      { rank: 15, title: 'Converse 5', cost: 15, notes: 'Planet-wide comm within 18,000km, dur = CONC mins' },
      { rank: 16, title: 'Mind Read 4', cost: 16, notes: 'Persuasion: tell truth — range touch, dur = CONC mins — Save required' },
      { rank: 17, title: 'Charm', cost: 0, notes: 'Permanent and passive, no cost — Save required' },
      { rank: 18, title: 'Thought Plant 8', cost: 25, notes: 'Rewrite memories (GM discretion), range touch, permanent — Save required' },
      { rank: 19, title: 'Thought Plant 9', cost: 19, notes: 'Slaver: total mind/body control, dur = CONC mins or until CONC broken, range 5m — Save required' },
      { rank: 20, title: 'Thought Plant 10', cost: 50, notes: 'Possession: dump consciousness into target — FLUX cost 50, duration until exorcised — Save required' }
    ]
  },

  detect: {
    name: 'DETECT',
    slug: 'detect',
    freeAbility: 'Sense Ebon.',
    startingMaxRank: 10,
    canPurchase: true,
    necanthropeOnly: false,
    ranks: [
      { rank: 1, title: 'Detect 1', cost: 1, notes: 'Range 1.5m radius, dur = CONC mins, checks for FLUX used in last 4 hours' },
      { rank: 2, title: 'Track 1', cost: 2, notes: 'Follow Ebon aura ≤6 hours, range 1.5m radius, dur = CONC mins' },
      { rank: 3, title: 'Detect 2', cost: 3, notes: 'Range 4m radius, dur = CONC mins, FLUX used in last 8 hours' },
      { rank: 4, title: 'Track 2', cost: 4, notes: 'Know by taste (aura), trail ≤12 hours, range 4m, dur = CONC mins' },
      { rank: 5, title: 'Detect 3', cost: 5, notes: 'Range 10m radius, FLUX used in last 24 hours, dur = CONC mins' },
      { rank: 6, title: 'Track 3', cost: 6, notes: 'Trail ≤24 hours, follow at range 8m, dur = CONC mins' },
      { rank: 7, title: 'Formulation 1', cost: 5, notes: 'Used with other abilities to find rank/how much FLUX used' },
      { rank: 8, title: 'True Track 1', cost: 8, notes: 'Bloodhound style: need personal item, scent ≤12 hours, dur = CONC hours' },
      { rank: 9, title: 'Detect 4', cost: 4, notes: 'Ebon knowledge: recognise Ebon scent (≤12 hours), follow within 10m, dur = CONC mins' },
      { rank: 10, title: 'Track 4', cost: 10, notes: 'Track flux ≤5 days old within 10m, dur = CONC mins' },
      { rank: 11, title: 'Formulation 2', cost: 11, notes: 'Physical description & how much FLUX in last 4 hours (with Detect)' },
      { rank: 12, title: 'Track 5', cost: 15, notes: 'Seek specific person within 500km, requires scent as Rank 9' },
      { rank: 13, title: 'True Track 2', cost: 2, notes: 'Track person from item with FLUX used in last 12 hours, dur = CONC×2 hours' },
      { rank: 14, title: 'Impression 1', cost: 14, notes: 'Vague recollection of incident ≤24 hours (GM discretion), dur = CONC rounds' },
      { rank: 15, title: 'Formulation 3', cost: 15, notes: 'Intimate knowledge of Ebon abilities/ranks/FLUX (use with others), dur = CONC minutes' },
      { rank: 16, title: 'Impression 2', cost: 16, notes: 'Clearer recollection (how many people, where, some images & conversation), dur = CONC minutes' },
      { rank: 17, title: 'Formulation 4', cost: 15, notes: 'As Formulation 3 but can clean up personality/manner pieces (GM discretion)' },
      { rank: 18, title: 'Impression 3', cost: 20, notes: 'Perfect recollection of incident in immediate area ≤10m in last 12 hours, dur = CONC rounds' },
      { rank: 19, title: 'Defensive Precognition', cost: 0, notes: 'Passive: “I\'ve got a bad feeling about this...” (GM discretion)' },
      { rank: 20, title: 'Death Seek', cost: 20, notes: 'See images from last 24 hours of life, images last CONC mins, range touch' }
    ]
  },

  enhancement: {
    name: 'ENHANCEMENT',
    slug: 'enhancement',
    freeAbility: 'Stronger skin, teeth, nails etc.',
    startingMaxRank: 10,
    canPurchase: true,
    necanthropeOnly: false,
    ranks: [
      { rank: 1, title: 'Teeth', cost: 1, dmg: 3, armDmg: 2, pen: 1, notes: 'Duration = CONC minutes' },
      { rank: 2, title: 'Claws', cost: 2, dmg: 5, armDmg: 2, pen: 2, notes: 'Duration = CONC minutes' },
      { rank: 3, title: 'Attribute Boost 1', cost: null, notes: '+1 STR / 2 FLUX, max +5, duration = CONC minutes' },
      { rank: 4, title: 'Attribute Boost 2', cost: null, notes: '+1 DEX / 2 FLUX, max +5, duration = CONC minutes' },
      { rank: 5, title: 'Attribute Boost 3', cost: null, notes: '+1 PHYS / 2 FLUX, max +5, duration = CONC minutes' },
      { rank: 6, title: 'Attribute Boost 4', cost: null, notes: 'Resist fatigue, 3 FLUX / 10 hours without rest' },
      { rank: 7, title: 'DNA Hallmark', cost: 1, notes: '1 FLUX / tattoo' },
      { rank: 8, title: 'Attribute Boost 5', cost: 8, notes: 'Toughened skin P.V. 4, duration = CONC minutes' },
      { rank: 9, title: 'Attribute Boost 6', cost: 1, notes: '+1 STR / 1 FLUX, max +7, duration = CONC minutes' },
      { rank: 10, title: 'Ebb Beast', cost: 20, notes: '+5 STR, +5 DEX, Tough Skin P.V.5, Teeth (Rank1), Claws (Rank2), duration = CONC minutes' },
      { rank: 11, title: 'Ebb Razor Claws', cost: 11, dmg: 10, armDmg: 4, pen: 6, notes: 'Duration = CONC minutes' },
      { rank: 12, title: 'Attribute Boost 7', cost: 1, notes: '+1 DEX / 1 FLUX, max +7, duration = CONC minutes' },
      { rank: 13, title: 'Physical Manipulation 1', cost: 20, notes: 'Teeth Rank1, Claws Rank2, permanent' },
      { rank: 14, title: 'Physical Manipulation 2', cost: 30, notes: 'Growth ±10% to ±50%, permanent' },
      { rank: 15, title: 'Attribute Boost 8', cost: 15, notes: 'Tough Skin P.V.10, duration = CONC minutes' },
      { rank: 16, title: 'Physical Manipulation 3', cost: 4, notes: 'Hits increase, duration = CONC minutes, 4 FLUX/hit up to double hits/location' },
      { rank: 17, title: 'Attribute Boost 9', cost: null, notes: 'Resist fatigue, 4 FLUX/day, no need to sleep, max 8 days' },
      { rank: 18, title: 'Attribute Boost 10', cost: 18, notes: 'Tough Skin P.V.18, duration = CONC minutes' },
      { rank: 19, title: 'Physical Manipulation 4', cost: 30, notes: 'Body Manipulation: grow extra joints/limbs, 30 FLUX/limb, 30 days, permanent (GM discretion)' },
      { rank: 20, title: 'Ebb Demon', cost: 50, notes: '+8 STR, +8 DEX, +5 PHYS, Tough Skin P.V.18, Teeth Rank1, Claws Rank11, duration = 1 hour' }
    ]
  },

  healing: {
    name: 'HEALING',
    slug: 'healing',
    freeAbility: 'Heal scratches, bruises etc.',
    startingMaxRank: 10,
    canPurchase: true,
    necanthropeOnly: false,
    ranks: [
      { rank: 1, title: 'Heal 1', cost: null, notes: 'Stop bleeding, one wound / FLUX' },
      { rank: 2, title: 'Heal 2', cost: null, notes: 'Repair tissue/bone, one hit / FLUX' },
      { rank: 3, title: 'Heal 3', cost: null, notes: 'Stop bleeding, two wounds / FLUX' },
      { rank: 4, title: 'Heal 4', cost: null, notes: 'Repair tissue/bone, two hits / FLUX' },
      { rank: 5, title: 'Heal 5', cost: null, notes: 'Stop bleeding, three wounds / FLUX' },
      { rank: 6, title: 'Heal 6', cost: null, notes: 'Repair tissue/bone, three hits / FLUX' },
      { rank: 7, title: 'Heal 7', cost: null, notes: 'Repair tissue/bone, four hits / FLUX' },
      { rank: 8, title: 'Heal 8', cost: null, notes: 'Repair tissue/bone, five hits / FLUX' },
      { rank: 9, title: 'Heal 9', cost: null, notes: 'Repair tissue/bone, six hits / FLUX' },
      { rank: 10, title: 'Heal 10', cost: null, notes: 'Stop all bleeding, all wounds / FLUX' },
      { rank: 11, title: 'Regeneration 1', cost: null, notes: 'Small: fingers/toes, 1 FLUX / hit point in location' },
      { rank: 12, title: 'Regeneration 2', cost: null, notes: 'Large: arms/legs, 1 FLUX / hit point in location' },
      { rank: 13, title: 'Regeneration 3', cost: null, notes: 'Super: torso, 1 FLUX / hit point in location' },
      { rank: 14, title: 'Body System Purification', cost: null, notes: 'Removes all drug addictions, double FLUX cost for combat drugs, takes 4 hours' },
      { rank: 15, title: 'Physical Manipulation 1', cost: 10, notes: 'Increase hits: 10 FLUX / hit permanent, max half original hits' },
      { rank: 16, title: 'Precognitive Healing', cost: 2, notes: '2 FLUX / hit up to max 20 hits' },
      { rank: 17, title: 'Retardation of Psychosis', cost: 10, notes: '10 FLUX / rank of Psychosis, duration 48 hours, takes 5 hours' },
      { rank: 18, title: 'Heal 11', cost: 5, notes: 'Passive Healing for self. Cure all hits / 5 FLUX' },
      { rank: 19, title: 'Heal 12', cost: 40, notes: 'Resurrection if no more than 4 minutes dead. Cost: 40 FLUX (30 with Ebon Medi-kit)' },
      { rank: 20, title: 'Soul Caging', cost: 20, notes: 'See explanation' }
    ]
  },

  illumination: {
    name: 'ILLUMINATION',
    slug: 'illumination',
    freeAbility: 'Dim lights slightly, make lights flicker. Give small static shocks. Range: touch.',
    startingMaxRank: 10,
    canPurchase: true,
    necanthropeOnly: false,
    ranks: [
      { rank: 1, title: 'Blind', cost: 1, notes: 'Blinding flash, CONC roll -6 or blind 1 round, 10m area' },
      { rank: 2, title: 'Light 1', cost: 2, notes: 'Finger torch, 10m beam, duration = CONC minutes' },
      { rank: 3, title: 'Light 2', cost: 3, notes: 'Finger torch, 20m beam, duration = CONC minutes' },
      { rank: 4, title: 'Light 3', cost: 4, notes: 'Hand/palm torch 2m wide, 25m beam, duration = CONC minutes' },
      { rank: 5, title: 'Charge 1', cost: 5, notes: 'Range touch, DMG: stun, PHYS -2 or stunned 4 rounds' },
      { rank: 6, title: 'Light 4', cost: 6, notes: 'Orb (free floating) illuminates 15m area, duration = CONC minutes' },
      { rank: 7, title: 'Light 5', cost: 7, notes: 'Eye torch, 10m beam, no effect on eyesight, duration = CONC minutes' },
      { rank: 8, title: 'Light 6', cost: 8, notes: 'Orb (follows user) illuminates 25m area, duration = CONC minutes' },
      { rank: 9, title: 'Charge 2', cost: 9, notes: 'Range touch, DMG: stun, PHYS -5 or stunned 10 rounds' },
      { rank: 10, title: 'Light 7', cost: 10, notes: 'Star Orb (small) duration 6 rounds, 70m area' },
      { rank: 11, title: 'Ebon Eyes', cost: 0, notes: 'Physical change: eyes glow, immunity to electric shocks to 10,000V (passive)' },
      { rank: 12, title: 'Light 8', cost: 12, notes: 'Orb directional control, range 30m, illuminates 30m area, duration = CONC minutes' },
      { rank: 13, title: 'Enlightenment', cost: 0, notes: 'All abilities with durations +1 minute per FLUX point extra spent' },
      { rank: 14, title: 'Charge 3', cost: 14, notes: 'Range touch, DMG: 5 + stun 10 rounds' },
      { rank: 15, title: 'Light 9', cost: 15, notes: 'Star Orb (large) duration 6 rounds, 150m area' },
      { rank: 16, title: 'Perfect Night Vision', cost: 1, notes: 'Cost 1 FLUX/hour' },
      { rank: 17, title: 'Charge 5', cost: 17, notes: 'Range 40m, DMG: 20 + stun 10 rounds, PEN: 14' },
      { rank: 18, title: 'Light 10', cost: 18, notes: 'Nova Orb: daylight, duration 10 minutes, 1km radius' },
      { rank: 19, title: 'Chameleon', cost: 19, notes: 'Refract light through DeathSuit — true chameleon skin, invisible, duration = CONC minutes' },
      { rank: 20, title: 'Glyph Creation', cost: null, notes: 'Simple 20 FLUX, Moderate 40 FLUX, Difficult 60 FLUX' }
    ]
  },

  protect: {
    name: 'PROTECT',
    slug: 'protect',
    freeAbility: 'Keep DeathSuit clean, no dust or rain etc.',
    startingMaxRank: 10,
    canPurchase: true,
    necanthropeOnly: false,
    ranks: [
      { rank: 1, title: 'Charge DeathSuit', cost: null, notes: '+1 P.V. per FLUX/day, max 5' },
      { rank: 2, title: 'Heal DeathSuit', cost: null, notes: '+1 per FLUX/round' },
      { rank: 3, title: 'Boost DeathSuit', cost: null, notes: '+10 I.D. per FLUX (lasts until used), max 25 per location' },
      { rank: 4, title: 'Channel 1', cost: null, notes: 'Store FLUX, maximum 10, passive' },
      { rank: 5, title: 'Light to Medium', cost: null, notes: 'Suit becomes medium DeathSuit and gets 1 FLUX/day, passive' },
      { rank: 6, title: 'First graft', cost: null, notes: '+2 Physique whilst wearing suit, passive' },
      { rank: 7, title: 'Repel', cost: null, notes: 'Protects against fire, cold, rain and electricity, passive' },
      { rank: 8, title: 'Soothing touch', cost: null, notes: '+2 Cool whilst wearing suit, passive' },
      { rank: 9, title: 'Channel 2', cost: null, notes: 'Store FLUX, maximum 20, passive' },
      { rank: 10, title: 'Medium to Heavy', cost: null, notes: 'Upgrade to heavy DeathSuit' },
      { rank: 11, title: 'Second graft', cost: null, notes: '+2 Strength whilst wearing suit, passive' },
      { rank: 12, title: 'Suck FLUX', cost: null, notes: 'One per touch to the suit’s maximum' },
      { rank: 13, title: 'Interdermalization', cost: 1, notes: 'Hide DeathSuit under skin. Cost 1 FLUX to put under, none to bring out' },
      { rank: 14, title: 'Channel 3', cost: null, notes: 'Store FLUX, 30 maximum, passive' },
      { rank: 15, title: 'Heavy to Super', cost: null, notes: 'Upgrade to super DeathSuit' },
      { rank: 16, title: 'Third graft', cost: null, notes: '+2 Dexterity whilst wearing suit, passive' },
      { rank: 17, title: 'Living Suit', cost: null, notes: 'DeathSuit is sentient and aware' },
      { rank: 18, title: 'Soul Store', cost: null, notes: 'Stores your soul for one day' },
      { rank: 19, title: 'Channel 4', cost: null, notes: 'Store FLUX, maximum 40, passive' },
      { rank: 20, title: 'Super to Angel', cost: null, notes: 'Upgrade suit to Angel tier' }
    ]
  },

  reality_folding: {
    name: 'REALITY FOLDING',
    slug: 'reality_folding',
    freeAbility: 'Palm object, real sleight. 1 /2lb objects or less.',
    startingMaxRank: 10,
    canPurchase: true,
    necanthropeOnly: false,
    ranks: [
      { rank: 1, title: 'Jump Port 1', cost: 1, notes: 'Self 5m, must see destination' },
      { rank: 2, title: 'Jump Port 2', cost: 2, notes: 'Self 10m, must see destination' },
      { rank: 3, title: 'Jump Port 3', cost: 3, notes: 'Self 20m, must see destination' },
      { rank: 4, title: 'Jump Port 4', cost: 5, notes: 'Object port: free standing inanimate, range 5m, max weight 1kg' },
      { rank: 5, title: 'Jump Port 5', cost: 5, notes: 'Object port: free standing inanimate, range 10m, max weight 2kg' },
      { rank: 6, title: 'Jump Port 6', cost: 6, notes: 'Object port: free standing inanimate, range 20m, max weight 10kg' },
      { rank: 7, title: 'Jump Port 7', cost: 7, notes: 'Self 50m, must see destination' },
      { rank: 8, title: 'Jump Port 8', cost: 8, notes: 'Self 100m, must see destination' },
      { rank: 9, title: 'Jump Port 9', cost: 9, notes: 'Self 200m, must see destination' },
      { rank: 10, title: 'Jump Port 10', cost: 10, notes: 'Self Wallwalk, duration = CONC seconds' },
      { rank: 11, title: 'Jump Port 11', cost: 11, notes: 'Self blind, if clear picture known, max 5km' },
      { rank: 12, title: 'Jump Port 12', cost: 12, notes: 'Self: see destination within 20m, can take one other person/object up to 80kg' },
      { rank: 13, title: 'Jump Port 13', cost: 13, notes: 'Self: see destination within 50m, can take one other up to 80kg' },
      { rank: 14, title: 'Jump Port 14', cost: 14, notes: 'Self Safe Port: know destination within 5km, can take one other up to 80kg' },
      { rank: 15, title: 'Mass Port 1', cost: 30, notes: 'Everything in 2.5m radius ported within 200m or sight' },
      { rank: 16, title: 'Mass Port 2', cost: 35, notes: 'Selective, up to 3 people if ≤5m to user within 200m or sight. Cost +5 FLUX/person' },
      { rank: 17, title: 'Jump Port 15', cost: 25, notes: 'Planet wide within 20,000km if known or picture' },
      { rank: 18, title: 'Jump Port 16', cost: 18, notes: 'Object: any (even guns/armour), max 50kg, ≤50m away' },
      { rank: 19, title: 'Jump Port 17', cost: null, notes: 'Gate: Navigational insight, universe known (GM discretion)' },
      { rank: 20, title: 'Jump Port 18', cost: null, notes: 'Foldship: Port foldship from A to B. Astral navigation must be known' }
    ]
  },

  red_thermal: {
    name: 'RED THERMAL',
    slug: 'red_thermal',
    freeAbility: 'Hand cigarette lighter',
    startingMaxRank: 10,
    canPurchase: true,
    necanthropeOnly: false,
    ranks: [
      { rank: 1, title: 'Resist Cold 1', cost: 1, notes: 'Min temp -10°C, duration = CONC minutes' },
      { rank: 2, title: 'Create Heat 1', cost: 2, notes: 'Raise temp of inanimate object (touch) to max 40°C, 1 action to heat, 2 rounds to cool' },
      { rank: 3, title: 'Burn 1', cost: 2, dmg: 6, armDmg: 2, pen: 3, range: '10m' },
      { rank: 4, title: 'Thermal Ball 1', cost: 4, dmg: 10, notes: 'Range 25m' },
      { rank: 5, title: 'Body Blaze 1', cost: 5, dmg: 6, pen: 0, range: 'touch', notes: 'Duration 1 round' },
      { rank: 6, title: 'Resist Cold 2', cost: 2, notes: 'Min temp -30°C, duration = CONC minutes' },
      { rank: 7, title: 'Create Heat 2', cost: 4, notes: 'Raise temp to max 70°C, 1 action to heat, 3 rounds to cool' },
      { rank: 8, title: 'Burn 2', cost: 4, dmg: 8, armDmg: 4, pen: 4, range: '15m' },
      { rank: 9, title: 'Thermal Ball 2', cost: 8, dmg: 15, notes: 'Range 25m' },
      { rank: 10, title: 'Body Blaze 2', cost: 15, dmg: 9, armDmg: 2, pen: 1, range: 'touch', notes: 'Duration 1 round' },
      { rank: 11, title: 'Resist Cold 3', cost: 4, notes: 'Min temp -60°C, duration = CONC minutes' },
      { rank: 12, title: 'Create Heat 3', cost: 10, notes: 'Raise object/area to max 100°C/30°C, range 1m/20m dia, 1 action to heat, 4 rounds to cool' },
      { rank: 13, title: 'Burn 3', cost: 10, dmg: 10, armDmg: 6, pen: 6, range: '20m' },
      { rank: 14, title: 'Thermal Ball 3', cost: 12, dmg: 20, notes: 'Range 25m' },
      { rank: 15, title: 'Body Blaze 3', cost: 20, dmg: 11, armDmg: 4, pen: 2, range: '1m', notes: 'Duration 1 round' },
      { rank: 16, title: 'Resist Cold 4', cost: 6, notes: 'Min temp -254°C, duration = CONC minutes' },
      { rank: 17, title: 'Create Heat 4', cost: 15, notes: 'Raise object/area to max 100°C/50°C, range 10m/50m dia, 1 action to heat, 5 rounds to cool' },
      { rank: 18, title: 'Burn 4', cost: 12, dmg: 12, armDmg: 8, pen: 8, range: '30m' },
      { rank: 19, title: 'Thermal Ball 4', cost: 16, dmg: 25, notes: 'Range 25m' },
      { rank: 20, title: 'Cinder', cost: null, notes: 'Destroys/burns to ash; FLUX cost = total hits per location of target. Range: touch' }
    ]
  },

  senses: {
    name: 'SENSES',
    slug: 'senses',
    freeAbility: '+1 Rank Exceptional Vision or Hearing (player choice)',
    startingMaxRank: 10,
    canPurchase: true,
    necanthropeOnly: false,
    ranks: [
      { rank: 1, title: 'Shock Sense 1', cost: 1, notes: 'Remove sense for CONC seconds, range touch — Save required' },
      { rank: 2, title: 'Shock Sense 2', cost: 2, notes: 'Remove sense for CONC rounds, range touch — Save required' },
      { rank: 3, title: 'Shock Sense 3', cost: 3, notes: 'Remove sense for CONC seconds, range 5m — Save required' },
      { rank: 4, title: 'Restore 1', cost: 4, notes: 'Restore sense deprived by Shock Sense 1, range 5m' },
      { rank: 5, title: 'Restore 2', cost: 5, notes: 'Restore sense deprived by Shock Sense 1 & 2, range 5m' },
      { rank: 6, title: 'Shock Sense 4', cost: 6, notes: 'Removes sense 1 minute, range 5m — Save required' },
      { rank: 7, title: 'Shock Sense 5', cost: 7, notes: 'Scare: Unmodified Fear roll, failure lose next 4 actions, range 80m — Save required' },
      { rank: 8, title: 'Restore 3', cost: 8, notes: 'Clear senses, sober up; removes shock/confusion for Shock Sense 1-5' },
      { rank: 9, title: 'Shock Sense 6', cost: 9, notes: 'Erase 5 minutes of memory permanent, range touch — Save required' },
      { rank: 10, title: 'Shock Sense 7', cost: 10, notes: 'Remove sense permanently at touch — Save required' },
      { rank: 11, title: 'Mind Block 1', cost: 1, notes: 'Cost 1 FLUX/hour, stops all detection by Ebon abilities' },
      { rank: 12, title: 'Super Sense 1', cost: 1, notes: 'See in infra-red spectrum, duration = CONC minutes' },
      { rank: 13, title: 'Super Sense 2', cost: 1, notes: 'See in ultra-violet spectrum, duration = CONC minutes' },
      { rank: 14, title: 'Restore 4', cost: 10, notes: 'Restore any permanently lost sense at touch' },
      { rank: 15, title: 'Audio Projection', cost: 5, notes: 'Save sound to disk, duration 2 hours' },
      { rank: 16, title: 'Video Projection', cost: 3, notes: 'Save sight to disk, duration 1 hour' },
      { rank: 17, title: 'Restore 5', cost: 0, notes: 'Clear sense passive — Shock Sense any rank has no effect' },
      { rank: 18, title: 'Super Sense 3', cost: 5, notes: 'Perfect/total recall: cost 5 FLUX / Ebon CONC minutes' },
      { rank: 19, title: 'Mind Block 2', cost: 0, notes: 'Permanent passive' },
      { rank: 20, title: 'Ebon Backlash', cost: null, notes: 'Match FLUX used and return to sender' }
    ]
  },

  telekinesis: {
    name: 'TELEKINESIS',
    slug: 'telekinesis',
    freeAbility: 'Move small objects up to 10g, max distance 1m slowly',
    startingMaxRank: 10,
    canPurchase: true,
    necanthropeOnly: false,
    ranks: [
      { rank: 1, title: 'Lift & Throw 1', cost: 1, notes: 'Within 10m, standard weight 1kg at 12m/round' },
      { rank: 2, title: 'Lift & Throw 2', cost: 2, notes: 'Within 10m, standard weight 1kg at 24m/round' },
      { rank: 3, title: 'Lift & Throw 3', cost: 3, notes: 'Within 10m, standard weight 1kg at 36m/round' },
      { rank: 4, title: 'Lift & Throw 4', cost: 4, notes: 'Within 10m, standard weight 1kg at 48m/round' },
      { rank: 5, title: 'Shield 1', cost: 5, notes: 'P.V.5, I.D.20, duration = CONC minutes or till destroyed' },
      { rank: 6, title: 'Manipulation 1', cost: 6, notes: 'Throttle/choke: target must make PHYS roll at -5 or stunned 5s, range 4m sight' },
      { rank: 7, title: 'Fly 1', cost: 7, notes: 'Speed 15m/round, dur = CONC rounds, max height 1000m' },
      { rank: 8, title: 'Lift & Throw 5', cost: 8, notes: 'Within 10m, standard weight 1kg at 60m/round' },
      { rank: 9, title: 'Lift & Throw 6', cost: 9, notes: 'Within 10m, standard weight 1kg at 72m/round' },
      { rank: 10, title: 'Lift & Throw 7', cost: 10, notes: 'Within 10m, standard weight 1kg at 84m/round' },
      { rank: 11, title: 'Lift & Throw 8', cost: 11, notes: 'Within 10m, standard weight 1kg at 96m/round' },
      { rank: 12, title: 'Fly 2', cost: 10, notes: 'Speed 60m/round, dur = CONC minutes, max height 2000m' },
      { rank: 13, title: 'Manipulation 2', cost: 12, notes: 'Throttle: DMG 15, ARM DMG 4, PEN 8, range 30m' },
      { rank: 14, title: 'Shield 2', cost: 10, notes: 'P.V.12, I.D.40, dur = CONC minutes or till destroyed' },
      { rank: 15, title: 'Lift & Throw 9', cost: 15, notes: 'Within 10m, standard weight 1kg at 108m/round' },
      { rank: 16, title: 'Lift & Throw 10', cost: 16, notes: 'Within 10m, standard weight 1kg at 120m/round' },
      { rank: 17, title: 'Lift & Throw 11', cost: 17, notes: 'Within 10m, standard weight 1kg at 132m/round' },
      { rank: 18, title: 'Lift & Throw 12', cost: 18, notes: 'Within 10m, standard weight 1kg at 144m/round' },
      { rank: 19, title: 'Lift & Throw 13', cost: 19, notes: 'Within 10m, standard weight 1kg at 156m/round' },
      { rank: 20, title: 'Manipulation 3', cost: 20, notes: 'Force intrusion: DMG 35, ARM DMG 10, PEN 15, range 25m' }
    ]
  },

  gore_cannon: {
    name: 'GORE CANNON (Necanthropes only)',
    slug: 'gore_cannon',
    freeAbility: 'Bad taste, curdle milk etc.',
    startingMaxRank: 10,
    canPurchase: false,
    necanthropeOnly: true,
    ranks: [
      { rank: 1, title: 'Ebb Gore Generation', cost: null, notes: 'Create Gore Cannon (one only).' },
      { rank: 2, title: 'Flesh Friction 1', cost: 2, dmg: 10, pen: null, range: '25m', notes: 'No Armour Save; damage taken by first living thing (DeathSuit counts as living)' },
      { rank: 3, title: 'Sting 1', cost: 3, notes: 'Paralysing sting: stun 3 rounds, PEN 6, range touch' },
      { rank: 4, title: 'Intrusion 1', cost: 4, notes: 'Fear roll at rating 4, range 10m' },
      { rank: 5, title: 'Psychovirus 1', cost: null, notes: 'COOL roll or lose 1 COOL/5 FLUX spent by Necanthrope; effects last 24 hours; range 10m' },
      { rank: 6, title: 'Flesh Friction 2', cost: 5, dmg: 15, notes: 'No Armour Save; damage to first living thing' },
      { rank: 7, title: 'Sting 2', cost: 7, notes: 'Paralysing sting: stunned 5 rounds, PEN 8, range 20m' },
      { rank: 8, title: 'Intrusion 2', cost: 8, notes: 'Fear roll at rating 6, range 25m' },
      { rank: 9, title: 'Psychovirus 2', cost: null, notes: 'COOL roll or lose 1 COOL/5 FLUX spent; effects last 4 days; range 20m' },
      { rank: 10, title: 'Flesh Friction 3', cost: 9, dmg: 20, notes: 'No Armour Save; damage to first living thing' },
      { rank: 11, title: 'Sentient Cannon', cost: null, notes: 'Gore Cannon Awakens' },
      { rank: 12, title: 'Interdermalisation', cost: 12, notes: 'Gore Cannon hidden under skin; small physical trace visible' },
      { rank: 13, title: 'Flesh Friction 4', cost: 13, dmg: 25, notes: 'Range 40m, No Armour Save; damage to first living thing' },
      { rank: 14, title: 'Sting 3', cost: 14, notes: 'Poison sting: -1 STR or DEX (chosen) permanent, PEN 15, range 30m' },
      { rank: 15, title: 'Drain 1', cost: 30, notes: 'Drain blood: range touch; requires successful unarmed combat roll each round; PEN 15; DMG 5 hits/round until target dead' },
      { rank: 16, title: 'Psychovirus 3', cost: null, notes: 'Lose 1 COOL/5 FLUX permanent, range 40m' },
      { rank: 17, title: 'Psychovirus 4', cost: null, notes: 'Rage: COOL roll -1/5 FLUX spent; DMG: +1 rank Psychosis/5 FLUX, range touch' },
      { rank: 18, title: 'Drain 2', cost: 5, notes: 'Drain Ebon FLUX: cost 5 FLUX, range touch; requires unarmed combat each round; DMG: -5 FLUX till empty or gore cannon full' },
      { rank: 19, title: 'Sting 4', cost: 10, notes: 'Psychotoxin: cost 10 FLUX/DMG rank. One DMG rank = -1 STR, -1 DEX, +1 rank Psychosis, range 50m, PEN 16' },
      { rank: 20, title: 'Psychovirus 5', cost: null, notes: 'Red Rain: Fear roll rating 15 & nightmares for 2 weeks' }
    ]
  },

  formulae: {
    name: 'FORMULAE',
    slug: 'formulae',
    freeAbility: 'Represents knowledge of the Ebb and glyph reading. All Ebon start with Formulae Rank 1.',
    startingMaxRank: 1,
    canPurchase: false,
    necanthropeOnly: false,
    ranks: [
      { rank: 1, title: 'Formulae 1', cost: 0, notes: 'All Ebon start with this; awarded/increased only by GM' },
      // Ranks 2-20 are represented but marked cannot be purchased/levellable by player
      { rank: 2, title: 'Formulae 2', cost: null, notes: 'Awarded by GM only' },
      { rank: 3, title: 'Formulae 3', cost: null, notes: 'Awarded by GM only' },
      { rank: 4, title: 'Formulae 4', cost: null, notes: 'Awarded by GM only' },
      { rank: 5, title: 'Formulae 5', cost: null, notes: 'Awarded by GM only' },
      { rank: 6, title: 'Formulae 6', cost: null, notes: 'Awarded by GM only' },
      { rank: 7, title: 'Formulae 7', cost: null, notes: 'Awarded by GM only' },
      { rank: 8, title: 'Formulae 8', cost: null, notes: 'Awarded by GM only' },
      { rank: 9, title: 'Formulae 9', cost: null, notes: 'Awarded by GM only' },
      { rank: 10, title: 'Formulae 10', cost: null, notes: 'Awarded by GM only' },
      { rank: 11, title: 'Formulae 11', cost: null, notes: 'Awarded by GM only' },
      { rank: 12, title: 'Formulae 12', cost: null, notes: 'Awarded by GM only' },
      { rank: 13, title: 'Formulae 13', cost: null, notes: 'Awarded by GM only' },
      { rank: 14, title: 'Formulae 14', cost: null, notes: 'Awarded by GM only' },
      { rank: 15, title: 'Formulae 15', cost: null, notes: 'Awarded by GM only' },
      { rank: 16, title: 'Formulae 16', cost: null, notes: 'Awarded by GM only' },
      { rank: 17, title: 'Formulae 17', cost: null, notes: 'Awarded by GM only' },
      { rank: 18, title: 'Formulae 18', cost: null, notes: 'Awarded by GM only' },
      { rank: 19, title: 'Formulae 19', cost: null, notes: 'Awarded by GM only' },
      { rank: 20, title: 'Formulae 20', cost: null, notes: 'Awarded by GM only' }
    ]
  }
};

// Helper: compute cumulative FLUX cost to reach a target rank in a category
function computeCumulativeCost(categoryKey, targetRank) {
  if (!EBON_ABILITIES[categoryKey] || !targetRank || targetRank < 1) return 0;
  const ranks = EBON_ABILITIES[categoryKey].ranks || [];
  let total = 0;
  for (let i = 0; i < Math.min(targetRank, ranks.length); i++) {
    const c = ranks[i].cost;
    if (typeof c === 'number') total += c;
  }
  return total;
}

function getStartingMaxRank() {
  return 10;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    EBON_ABILITIES,
    computeCumulativeCost,
    getStartingMaxRank
  };
}
