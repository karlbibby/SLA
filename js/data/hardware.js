// Hardware catalogue with prices in Credits (c). Use names matching equipment labels.
const HARDWARE = {
    'FEN 603': { price: 200, description: 'Standard FEN sidearm (service issue).' },
    'FEN 9mm Pistol': { price: 250, description: 'Common SLA sidearm.' },
    'Blitzer 12.7mm Pistol': { price: 400, description: 'High-calibre pistol.' },
    'CAF Blitzer 12.7mm': { price: 600, description: 'Commercial assault variant.' },
    'FEN AR Assault Rifle': { price: 1200, description: 'Standard assault rifle.' },
    'Shotgun': { price: 350, description: 'Pump-action close-quarters weapon.' },
    'SLA Standard Light Armor': { price: 500, description: 'Light ballistic protection.' },
    'SLA Standard Medium Armor': { price: 900, description: 'Medium protection.' },
    'SLA Standard Heavy Armor': { price: 1500, description: 'Heavy protection.' },
    'DeathSuit (Basic)': { price: 2000, description: 'Specialised protective suit.' },
    'Combat Knife': { price: 40, description: 'Basic edged weapon.' },
    'Combat Knife (Ceramic)': { price: 120, description: 'Higher-grade blade.' },
    'Ammunition Belt': { price: 60, description: 'Ammo storage and feed.' },
    'FEN Ammo Clip': { price: 10, description: 'Single clip for FEN weapons.' },
    'Grenades (2)': { price: 120, description: 'Two fragmentation grenades.' },
    'Weapons Maintenance Kit': { price: 35, description: 'Basic field maintenance tools.' },
    'Radio Headset': { price: 25, description: 'Hands-free comms.' },
    'Portable Computer': { price: 300, description: 'Handheld computing device.' },
    'Finance Chip': { price: 0, description: 'Implanted finance chip (installation optional; some races disallowed).' },
    'Finance Card': { price: 0, description: 'Standard finance card.' },
    'Corporate Credit Chip': { price: 0, description: 'Company-backed finance chip.' },
    'First Aid Kit': { price: 45, description: 'Basic medical supplies.' },
    'Lockpick Set': { price: 30, description: 'Standard lockpicks.' },
    'Tool Kit': { price: 50, description: 'General repair tools.' },
    'Binoculars': { price: 40, description: 'Optical magnification.' },
    'Camera': { price: 60, description: 'Standard camera.' },
    'Evidence Kit': { price: 80, description: 'Forensic collection kit.' },
    'Tactical Vest': { price: 150, description: 'Load-bearing vest.' },
    'Nav Computer': { price: 200, description: 'Navigation aid for pilots.' },
    'Flux Crystal': { price: 0, description: 'Ebon-related item (not for sale).' },
    'Face Mask': { price: 10, description: 'Protective face covering.' },
    'Personal Effects': { price: 0, description: 'Minor personal items (included).' },
    'Contraceptives Pack': { price: 0, description: 'Included personal item.' }
};

// Helper to get price (returns null if unknown)
function getHardwarePrice(name) {
    if (!name) return null;
    const entry = HARDWARE[name];
    return entry ? entry.price : null;
}

// Export for commonjs environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { HARDWARE, getHardwarePrice };
}
