// SLA Industries - Armaments Data
// Columns: Type, Size, Clip, Cal, ROF, Recoil, Range, Weight, Cost, Black Market Cost

const ARMAMENTS = [
    { type: '10-10', size: 'R', clip: '10', cal: '10g', rof: '1', recoil: '8', range: '10m', weight: '3kg', cost: 200, costCurrency: 'c', blackMarketCost: 4000 },
    { type: 'AGB Chopper', size: 'R', clip: '24', cal: 'n/a', rof: '1', recoil: '6', range: '20m', weight: '4kg', cost: 1700, costCurrency: 'c', blackMarketCost: 30000 },
    { type: 'BLA 046M', size: 'P', clip: '6', cal: '12.7mm', rof: '1', recoil: '7', range: '20m', weight: '1.5kg', cost: 790, costCurrency: 'c', blackMarketCost: 20000 },
    { type: 'BLA 464M', size: 'P', clip: '2', cal: '12.7mm', rof: '2/1', recoil: '12/9', range: '3m', weight: '0.4kg', cost: 450, costCurrency: 'c', blackMarketCost: 9000 },
    { type: 'BLA 646M', size: 'P', clip: '180', cal: '9mm', rof: '10', recoil: '8', range: '10m', weight: '1.4kg', cost: 850, costCurrency: 'c', blackMarketCost: 17000 },
    { type: 'BLA 710M', size: 'P', clip: '14', cal: '9mm', rof: '2/1', recoil: '2', range: '15m', weight: '0.3kg', cost: 150, costCurrency: 'c', blackMarketCost: 3000 },
    { type: 'CAF AR', size: 'R', clip: '20', cal: 'CAF', rof: '2', recoil: '4', range: '15m', weight: '1.5kg', cost: 300, costCurrency: 'u', blackMarketCost: null },
    { type: 'CAF P50', size: 'P', clip: '8', cal: 'CAF', rof: '1', recoil: '2', range: '10m', weight: '0.3kg', cost: 150, costCurrency: 'c', blackMarketCost: null },
    { type: 'CAF R7', size: 'R', clip: '6', cal: 'CAF', rof: '1', recoil: '5', range: '45m', weight: '2kg', cost: null, costCurrency: 'c', blackMarketCost: null },
    { type: 'CAF SMG', size: 'P', clip: '30', cal: 'CAF', rof: '3', recoil: '5', range: '10m', weight: '0.6kg', cost: 250, costCurrency: 'u', blackMarketCost: null },
    { type: 'FEN 091', size: 'P', clip: '5', cal: '17mm', rof: '1', recoil: '10', range: '24m', weight: '2kg', cost: 800, costCurrency: 'c', blackMarketCost: 16000 },
    { type: 'FEN 204', size: 'P', clip: '40', cal: '10mm', rof: '5/3/1', recoil: '7/3/1', range: '15m', weight: '2kg', cost: 350, costCurrency: 'c', blackMarketCost: 7500 },
    { type: 'FEN 30-30', size: 'R(OS)', clip: '1', cal: '8mm', rof: '1', recoil: '6', range: '900m', weight: '5kg', cost: 1100, costCurrency: 'c', blackMarketCost: 23000 },
    { type: 'FEN 400', size: 'R(OS)', clip: '5', cal: '17mm', rof: '1', recoil: '15', range: '540m', weight: '24kg', cost: 2000, costCurrency: 'c', blackMarketCost: 200000 },
    { type: 'FEN 603', size: 'P', clip: '20', cal: '10mm', rof: '3', recoil: '3', range: '12m', weight: '0.5kg', cost: 150, costCurrency: 'c', blackMarketCost: 2500 },
    { type: 'FEN 706', size: 'R(OS)', clip: '100', cal: '10mm', rof: '10/5', recoil: '10/7', range: '26m', weight: '14.5kg', cost: 1575, costCurrency: 'c', blackMarketCost: 32000 },
    { type: 'FEN 808', size: 'R(OS)', clip: '80', cal: '12mm', rof: '10/5', recoil: '13/8', range: '30m', weight: '15.1kg', cost: 1850, costCurrency: 'c', blackMarketCost: 37000 },
    { type: 'FEN 93 GAG', size: 'R', clip: '10', cal: '12mm', rof: '2/1', recoil: '8/7', range: '75m', weight: '3kg', cost: 800, costCurrency: 'c', blackMarketCost: 16000 },
    { type: 'FEN AR', size: 'R', clip: '25', cal: '10mm', rof: '5/1', recoil: '8/2', range: '20m', weight: '3.5kg', cost: 750, costCurrency: 'c', blackMarketCost: 15000 },
    { type: 'FEN TRI', size: 'R', clip: '1', cal: '12.7mm', rof: '1', recoil: '0', range: '1200m', weight: '8kg', cost: 1450, costCurrency: 'c', blackMarketCost: 29000 },
    { type: 'GA 9442', size: 'R', clip: '300', cal: 'n/a', rof: '20', recoil: '0', range: '15m', weight: '2.4kg', cost: null, costCurrency: 'c', blackMarketCost: 2000 },
    { type: 'GA47', size: 'P', clip: '12', cal: '10mm', rof: '2', recoil: '2', range: '10m', weight: '0.5kg', cost: 75, costCurrency: 'c', blackMarketCost: 1500 },
    { type: 'GA50', size: 'R', clip: '18', cal: '10mm', rof: '3', recoil: '6', range: '15m', weight: '3kg', cost: 300, costCurrency: 'c', blackMarketCost: 6000 },
    { type: 'GAK 19', size: 'R', clip: '5', cal: '12.7mm', rof: '1', recoil: '8', range: '145m', weight: '11.5kg', cost: 1850, costCurrency: 'c', blackMarketCost: 40000 },
    { type: 'KK 20', size: 'P', clip: '20', cal: '12mm', rof: '2', recoil: '6', range: '15m', weight: '2kg', cost: 430, costCurrency: 'c', blackMarketCost: 9000 },
    { type: 'KK 30', size: 'P', clip: '20', cal: '12mm', rof: '5', recoil: '8', range: '15m', weight: '3.5kg', cost: 570, costCurrency: 'c', blackMarketCost: 12000 },
    { type: 'KPS', size: 'R', clip: '10', cal: '10g', rof: '3', recoil: '9', range: '10m', weight: '4kg', cost: 900, costCurrency: 'c', blackMarketCost: 25000 },
    { type: 'MAL AR', size: 'R', clip: '20', cal: '12.7mm', rof: '2', recoil: '9', range: '150m', weight: '12.7kg', cost: 2150, costCurrency: 'c', blackMarketCost: 50000 },
    { type: 'SP Vibro', size: 'P', clip: '4', cal: 'n/a', rof: '1', recoil: '0', range: '25m', weight: '2kg', cost: 760, costCurrency: 'c', blackMarketCost: 16000 }
];
