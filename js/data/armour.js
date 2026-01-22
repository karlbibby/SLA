// SLA Industries - Armour Data
// Columns: Armour Types, Cost, Black Market Cost, P.V., Head, Torso, Arms, Legs, Modifiers

const ARMOUR = [
    { type: 'Striker', cost: 10, costCurrency: 'c', blackMarketCost: 100, blackMarketCurrency: 'u', pv: '1', head: '—', torso: '5', arms: '5', legs: '5', modifiers: '—' },
    { type: 'Padquil Flak', cost: 20, costCurrency: 'c', blackMarketCost: 200, blackMarketCurrency: 'u', pv: '3', head: '—', torso: '8', arms: '—', legs: '—', modifiers: '—' },
    { type: 'Body Armour', cost: 400, costCurrency: 'c', blackMarketCost: 8000, blackMarketCurrency: 'u', pv: '5', head: '8', torso: '14', arms: '10', legs: '12', modifiers: '—' },
    { type: 'Exo - Base', cost: 750, costCurrency: 'c', blackMarketCost: 15000, blackMarketCurrency: 'u', pv: '7', head: '10', torso: '20', arms: '15', legs: '17', modifiers: '-2 DEX' },
    { type: 'Exo - Heavy', cost: 1250, costCurrency: 'c', blackMarketCost: 25000, blackMarketCurrency: 'u', pv: '8', head: '15', torso: '35', arms: '25', legs: '28', modifiers: '—' },
    { type: 'Exo - Stormer', cost: 1500, costCurrency: 'c', blackMarketCost: 30000, blackMarketCurrency: 'u', pv: '9', head: '20', torso: '50', arms: '40', legs: '45', modifiers: '+3 STR' },
    { type: 'HARD', cost: 1750, costCurrency: 'c', blackMarketCost: 35000, blackMarketCurrency: 'u', pv: '10', head: '20', torso: '50', arms: '40', legs: '45', modifiers: '-1 DEX' },
    { type: 'Powercell', cost: 2000, costCurrency: 'c', blackMarketCost: 40000, blackMarketCurrency: 'u', pv: '12', head: '20', torso: '70', arms: '50', legs: '60', modifiers: '+2 STR' },
    { type: 'Crackshot', cost: 3000, costCurrency: 'c', blackMarketCost: 60000, blackMarketCurrency: 'u', pv: '15', head: '20', torso: '80', arms: '60', legs: '70', modifiers: '—' },
    { type: 'SilverBack', cost: 4000, costCurrency: 'c', blackMarketCost: 80000, blackMarketCurrency: 'u', pv: '15', head: '10', torso: '24', arms: '18', legs: '20', modifiers: '+3m Sprint' },
    { type: 'Dogeybone', cost: 5000, costCurrency: 'c', blackMarketCost: 100000, blackMarketCurrency: 'u', pv: '16', head: '60', torso: '150', arms: '80', legs: '120', modifiers: '+5 STR' },
    { type: 'Shock Armour', cost: 10000, costCurrency: 'c', blackMarketCost: 300000, blackMarketCurrency: 'u', pv: '18', head: '80', torso: '200', arms: '120', legs: '180', modifiers: 'STR 18, DEX 13' }
];
