// SLA Industries - Ammunition Data
// Columns: Calibre, STD, AP, HP, HEAP, HESH (standard cost and black market cost)

const AMMUNITION = [
    {
        calibre: 'CAF',
        types: {
            STD: { stdCost: 1, stdCurrency: 'u', blackCost: 1, blackCurrency: 'u', available: true },
            AP: { available: false },
            HP: { available: false },
            HEAP: { available: false },
            HESH: { available: false }
        }
    },
    {
        calibre: '8mm long',
        types: {
            STD: { stdCost: 2, stdCurrency: 'c', blackCost: 40, blackCurrency: 'u', available: true },
            AP: { stdCost: 3, stdCurrency: 'c', blackCost: 60, blackCurrency: 'u', available: true },
            HP: { available: false },
            HEAP: { stdCost: 3, stdCurrency: 'c', blackCost: 60, blackCurrency: 'u', available: true },
            HESH: { available: false }
        }
    },
    {
        calibre: '9mm BLA',
        types: {
            STD: { stdCost: 2, stdCurrency: 'c', blackCost: 40, blackCurrency: 'u', available: true },
            AP: { stdCost: 3, stdCurrency: 'c', blackCost: 60, blackCurrency: 'u', available: true },
            HP: { stdCost: 3, stdCurrency: 'c', blackCost: 60, blackCurrency: 'u', available: true },
            HEAP: { stdCost: 4, stdCurrency: 'c', blackCost: 80, blackCurrency: 'u', available: true },
            HESH: { available: false }
        }
    },
    {
        calibre: '10mm Auto',
        types: {
            STD: { stdCost: 1, stdCurrency: 'c', blackCost: 20, blackCurrency: 'u', available: true },
            AP: { stdCost: 2, stdCurrency: 'c', blackCost: 40, blackCurrency: 'u', available: true },
            HP: { stdCost: 3, stdCurrency: 'c', blackCost: 60, blackCurrency: 'u', available: true },
            HEAP: { stdCost: 2, stdCurrency: 'c', blackCost: 40, blackCurrency: 'u', available: true },
            HESH: { available: false }
        }
    },
    {
        calibre: '12mm',
        types: {
            STD: { stdCost: 3, stdCurrency: 'c', blackCost: 60, blackCurrency: 'u', available: true },
            AP: { stdCost: 4, stdCurrency: 'c', blackCost: 80, blackCurrency: 'u', available: true },
            HP: { stdCost: 5, stdCurrency: 'c', blackCost: 100, blackCurrency: 'u', available: true },
            HEAP: { stdCost: 4, stdCurrency: 'c', blackCost: 80, blackCurrency: 'u', available: true },
            HESH: { stdCost: 6, stdCurrency: 'c', blackCost: 120, blackCurrency: 'u', available: true }
        }
    },
    {
        calibre: '12.7mm',
        types: {
            STD: { stdCost: 3, stdCurrency: 'c', blackCost: 60, blackCurrency: 'u', available: true },
            AP: { stdCost: 5, stdCurrency: 'c', blackCost: 100, blackCurrency: 'u', available: true },
            HP: { stdCost: 6, stdCurrency: 'c', blackCost: 120, blackCurrency: 'u', available: true },
            HEAP: { stdCost: 5, stdCurrency: 'c', blackCost: 100, blackCurrency: 'u', available: true },
            HESH: { stdCost: 7, stdCurrency: 'c', blackCost: 140, blackCurrency: 'u', available: true }
        }
    },
    {
        calibre: '17mm',
        types: {
            STD: { stdCost: 8, stdCurrency: 'c', blackCost: 160, blackCurrency: 'u', available: true },
            AP: { stdCost: 10, stdCurrency: 'c', blackCost: 200, blackCurrency: 'u', available: true },
            HP: { stdCost: 12, stdCurrency: 'c', blackCost: 240, blackCurrency: 'u', available: true },
            HEAP: { stdCost: 10, stdCurrency: 'c', blackCost: 200, blackCurrency: 'u', available: true },
            HESH: { stdCost: 15, stdCurrency: 'c', blackCost: 300, blackCurrency: 'u', available: true }
        }
    },
    {
        calibre: '10ga. shot',
        types: {
            STD: { stdCost: 3, stdCurrency: 'c', blackCost: 60, blackCurrency: 'u', available: true },
            AP: { available: false },
            HP: { available: false },
            HEAP: { available: false },
            HESH: { available: false }
        }
    },
    {
        calibre: '10ga. slug',
        types: {
            STD: { stdCost: 4, stdCurrency: 'c', blackCost: 80, blackCurrency: 'u', available: true },
            AP: { available: false },
            HP: { available: false },
            HEAP: { available: false },
            HESH: { available: false }
        }
    }
];
