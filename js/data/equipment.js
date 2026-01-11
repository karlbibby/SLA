// Equipment dataset for PDF rendering (structured stat blocks)
const EQUIPMENT = {
  ammunitions: [
    { calibre: 'CAF', std: '1u', ap: '-', hp: '-', heap: '-', hesh: '-' },
    { calibre: '8mm long', std: '2c/40u', ap: '3c/60u', hp: '-', heap: '3c/60u', hesh: '-' },
    { calibre: '10mm Auto', std: 'lc/20u', ap: '2c/40u', hp: '3c/60u', heap: '2c/40u', hesh: '-' },
    { calibre: '12mm', std: '3c/60u', ap: '4c/80u', hp: '5c/100u', heap: '4c/80u', hesh: '6e/120u' },
    { calibre: '12.7mm', std: '3c/60u', ap: '5c/100u', hp: '6c/120u', heap: '5c/100u', hesh: '7c/140u' },
    { calibre: '17mm', std: '8c/160u', ap: '10c/200u', hp: '12c/240u', heap: '10c/200u', hesh: '15e/300u' },
    { calibre: '10ga. shot', std: '3c/60u', ap: '-', hp: '-', heap: '-', hesh: '-' },
    { calibre: '10ga. slug', std: '4c/80u', ap: '-', hp: '-', heap: '-', hesh: '-' }
  ],
  specialisedAmmunition: [
    { type: 'Ballbearings', dmg: 3, pen: null, arm: -4, dmgNote: 'n/a', cost: '1u/100', weight: '0.3kg/100', weapon: 'GA' },
    { type: 'Vibro discs', dmg: 8, pen: 12, arm: 2, dmgNote: '5c/disc', cost: '100u/disc', weight: '0.01kg', weapon: 'Vibro Disc' },
    { type: 'Chopper Packs', dmg: 15, pen: 8, arm: 6, dmgNote: '3c/pack', cost: '60u/pack', weight: '0.1kg', weapon: 'Chopper' }
  ],
  grenades: [
    { type: 'Blast', blast: 0, rating: null, pen: -5, weight: '0.5kg', cost: '10c', blackmarket: '200u' },
    { type: 'Fragmentation', blast: 10, rating: null, pen: 6, weight: '0.5kg', cost: '15c', blackmarket: '300u' },
    { type: 'Smoke', blast: null, rating: null, pen: null, weight: '0.5kg', cost: '4c', blackmarket: '80u' },
    { type: 'Gas (Riot)', blast: null, rating: null, pen: null, weight: '0.5kg', cost: '10c', blackmarket: '200u' }
  ],
  armour: [
    { name: 'Striker', cost: '10c', blackmarket: '100u', pv: 1, head: null, torso: 5, arms: 5, legs: 5, modifiers: '' },
    { name: 'Padquil Flak', cost: '20c', blackmarket: '200u', pv: 3, head: null, torso: 8, arms: null, legs: null, modifiers: '' },
    { name: 'Body Armour', cost: '400c', blackmarket: '8,000u', pv: 5, head: 8, torso: 14, arms: 10, legs: 12, modifiers: '' },
    { name: 'Exo - Base', cost: '750c', blackmarket: '15,000u', pv: 7, head: 10, torso: 20, arms: 15, legs: 17, modifiers: '-2 DEX' },
    { name: 'Exo - Heavy', cost: '1,250c', blackmarket: '25,000u', pv: 8, head: 15, torso: 35, arms: 25, legs: 28, modifiers: '' },
    { name: 'Exo - Stormer', cost: '1,500c', blackmarket: '30,000u', pv: 9, head: 20, torso: 50, arms: 40, legs: 45, modifiers: '+3 STR' },
    { name: 'HARD', cost: '1,750c', blackmarket: '35,000u', pv: 10, head: 20, torso: 50, arms: 40, legs: 45, modifiers: '-1 DEX' },
    { name: 'Powercell', cost: '2,000c', blackmarket: '40,000u', pv: 12, head: 20, torso: 70, arms: 50, legs: 60, modifiers: '+2 STR' },
    { name: 'Crackshot', cost: '3,000c', blackmarket: '60,000u', pv: 15, head: 20, torso: 80, arms: 60, legs: 70, modifiers: '' },
    { name: 'Dogeybone', cost: '5,000c', blackmarket: '100,000u', pv: 16, head: 60, torso: 150, arms: 80, legs: 120, modifiers: '+5 STR' },
    { name: 'Shock Armour', cost: '10,000c', blackmarket: '300,000u', pv: 18, head: 80, torso: 200, arms: 120, legs: 180, modifiers: 'STR 18, DEX 13' }
  ],
  vehicles: [
    { name: 'Augustus', type: 'Car', speed: '320km/h', skill: 'Drive,Civ', cost: '10,000c', pv_id: '17/200', crew: '1/4' },
    { name: 'Calaharvey', type: 'Bike', speed: '340km/h', skill: 'Drive,Mot', cost: '1000c', pv_id: '10/100', crew: '1/1' },
    { name: 'Battle Taxi', type: 'APC', speed: '180km/h', skill: 'Drive,Mil', cost: '125,000c', pv_id: '25/750', crew: '2/10' },
    { name: 'GA ‘J’ Jeep', type: 'Car', speed: '220km/h', skill: 'Drive,Civ', cost: '14,000c', pv_id: '15/300', crew: '1/5' },
    { name: 'Pandora', type: 'Bike', speed: '280km/h', skill: 'Drive,Mot', cost: '1500c', pv_id: '15/200', crew: '1/1' },
    { name: 'Kilcopter', type: 'Copter', speed: '1,000km/h', skill: 'Pilot,Mil', cost: '450,000c', pv_id: '19/550', crew: '2/4' },
    { name: 'SCAF', type: 'Copter', speed: '400km/h', skill: 'Pilot,Mil', cost: '125,000c', pv_id: '15/250', crew: '1/1' },
    { name: 'Civilian Taxi', type: 'Car', speed: '220km/h', skill: 'Drive,Civ', cost: '-', pv_id: '4/55', crew: '1/6' },
    { name: 'Civilian Car', type: 'Car', speed: '180km/h', skill: 'Drive,Civ', cost: '17,000u', pv_id: '2/30', crew: '1/4' },
    { name: 'Civilian Bike', type: 'Bike', speed: '280km/h', skill: 'Drive,Mot', cost: '750u', pv_id: '1/10', crew: '1/1' }
  ]
};

// expose to global for pdfExport usage
if (typeof window !== 'undefined') window.EQUIPMENT = EQUIPMENT;
if (typeof module !== 'undefined' && module.exports) module.exports = { EQUIPMENT };
