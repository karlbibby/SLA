// SLA Industries - Weapons Data
// Columns: Type, DMG, PEN, Armour DMG, Weight, Cost, Black Market Cost

const WEAPONS = [
    { type: 'Chain Axe', dmg: '5', pen: '4', armourDmg: '3', weight: '3kg', cost: 85, costCurrency: 'c', blackMarketCost: 1500, blackMarketCurrency: 'u' },
    { type: 'Pacifier Baton', dmg: '5', pen: '0', armourDmg: '5', weight: '1kg', cost: 80, costCurrency: 'c', blackMarketCost: 1000, blackMarketCurrency: 'u' },
    { type: 'Vibro Sabre', dmg: '4', pen: '4', armourDmg: '2', weight: '1.5kg', cost: 100, costCurrency: 'c', blackMarketCost: 2000, blackMarketCurrency: 'u' },
    { type: 'Gash Fist', dmg: '4', pen: '4', armourDmg: '2', weight: '1kg', cost: 80, costCurrency: 'c', blackMarketCost: 1600, blackMarketCurrency: 'u' },
    { type: 'Flick Scythe', dmg: '5', pen: '5', armourDmg: '2', weight: '2.5kg', cost: 120, costCurrency: 'c', blackMarketCost: 2400, blackMarketCurrency: 'u' },
    { type: 'MAC Knife', dmg: '4', pen: '1', armourDmg: '1', weight: '0.75kg', cost: 80, costCurrency: 'c', blackMarketCost: 1200, blackMarketCurrency: 'u' },
    { type: 'Mutilator', dmg: '5', pen: '3', armourDmg: '3', weight: '1kg', cost: 85, costCurrency: 'c', blackMarketCost: 1700, blackMarketCurrency: 'u' },
    { type: 'Power Disc', dmg: '4', pen: '4', armourDmg: '2', weight: '0.4kg', cost: 100, costCurrency: 'c', blackMarketCost: 1900, blackMarketCurrency: 'u' },
    { type: 'Power Claymore', dmg: '6', pen: '4', armourDmg: '3', weight: '3kg', cost: 100, costCurrency: 'c', blackMarketCost: 2200, blackMarketCurrency: 'u' },
    { type: 'SLA Blade', dmg: '1', pen: '0', armourDmg: '0', weight: '0.25kg', cost: 2, costCurrency: 'c', blackMarketCost: 40, blackMarketCurrency: 'u' },
    { type: 'Knife', dmg: '1', pen: '0', armourDmg: '0', weight: '0.4kg', cost: 5, costCurrency: 'u', blackMarketCost: null, blackMarketCurrency: 'u' },
    { type: 'Club/Bat', dmg: '2', pen: '-1', armourDmg: '0', weight: '1kg', cost: 20, costCurrency: 'u', blackMarketCost: null, blackMarketCurrency: 'u' },
    { type: 'Sledgehammer', dmg: '3', pen: '-1', armourDmg: '1', weight: '3.5kg', cost: 35, costCurrency: 'u', blackMarketCost: null, blackMarketCurrency: 'u' },
    { type: 'Sword', dmg: '2', pen: '0', armourDmg: '1', weight: '1.5kg', cost: 10, costCurrency: 'u', blackMarketCost: null, blackMarketCurrency: 'u' },
    { type: 'Jolt Glove', dmg: 'as user', pen: 'as user', armourDmg: 'as user', weight: '0.25kg', cost: 105, costCurrency: 'c', blackMarketCost: 2100, blackMarketCurrency: 'u' }
];
