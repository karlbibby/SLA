// SLA Industries - Ebon DeathSuit type data
// Provides base and maximum PV/ID values per type

const DEATHSUIT_TYPES = {
  Light: {
    pv: { base: 6, max: 11 },
    head: { base: 10, max: 110 },
    torso: { base: 15, max: 115 },
    arms: { base: 12, max: 112 },
    legs: { base: 14, max: 114 }
  },
  Medium: {
    pv: { base: 7, max: 12 },
    head: { base: 10, max: 110 },
    torso: { base: 20, max: 120 },
    arms: { base: 15, max: 115 },
    legs: { base: 17, max: 117 }
  },
  Heavy: {
    pv: { base: 9, max: 16 },
    head: { base: 20, max: 120 },
    torso: { base: 40, max: 140 },
    arms: { base: 30, max: 130 },
    legs: { base: 35, max: 135 }
  },
  Super: {
    pv: { base: 13, max: 18 },
    head: { base: 20, max: 120 },
    torso: { base: 80, max: 180 },
    arms: { base: 60, max: 160 },
    legs: { base: 70, max: 170 }
  },
  Angel: {
    pv: { base: 17, max: 22 },
    head: { base: 60, max: 160 },
    torso: { base: 150, max: 250 },
    arms: { base: 80, max: 180 },
    legs: { base: 100, max: 200 }
  }
};
