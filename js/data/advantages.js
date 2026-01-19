// SLA Industries - Advantages & Disadvantages (rewritten, spec-compliant)

/*
  Data model:
  - id: unique key
  - name: display name
  - type: 'advantage' | 'disadvantage'
  - maxRank: integer (0/1 for one-off)
  - costPerRank: points cost for each rank (advantages) or points granted (disadvantages)
  - oneOffCost: use for single-cost items (mutually exclusive with costPerRank)
  - description: short rule text
  - effects: optional structured effects (stat mods, special rules)
  - exclusiveWith: array of ids that are mutually exclusive
*/

const ADVANTAGES = {
  physical: {
    name: 'Physical',
    items: {
      handsome: {
        id: 'handsome',
        name: 'Handsome',
        type: 'advantage',
        maxRank: 10,
        costPerRank: 1,
        description: 'Improves appearance; costs 1 point per Rank (Rank 1 = slightly better, Rank 10 = stunning).',

      },
      ugly: {
        id: 'ugly',
        name: 'Ugly',
        type: 'disadvantage',
        maxRank: 10,
        costPerRank: 1,
        description: 'Worse appearance; grants 1 point per Rank (Rank 1 = slightly unattractive, Rank 10 = grotesque).'
      },
      ambidextrous: {
        id: 'ambidextrous',
        name: 'Ambidextrous',
        type: 'advantage',
        maxRank: 1,
        oneOffCost: 10,
        description: 'Use either hand without off-hand penalties. One-off cost: 10 points.',

      },
      good_vision: {
        id: 'good_vision',
        name: 'Good Vision',
        type: 'advantage',
        maxRank: 10,
        costPerRank: 2,
        description: 'See farther/clearer. Costs 2 points per Rank. Rank 7+: effectively blind in one eye if negative event; Rank 10: both eyes exceptional (per GM).',

      },
      bad_vision: {
        id: 'bad_vision',
        name: 'Bad Vision',
        type: 'disadvantage',
        maxRank: 10,
        costPerRank: 2,
        description: 'Reduced vision; grants 2 points per Rank. At low Ranks affects reading/VDU; Rank 7+: blind in one eye; Rank 10: blind in both eyes.'
      },
      good_hearing: {
        id: 'good_hearing',
        name: 'Good Hearing',
        type: 'advantage',
        maxRank: 10,
        costPerRank: 1,
        description: 'Hear fainter sounds. Costs 1 point per Rank. Rank 7+: deaf in one ear if negative event; Rank 10: excellent acute hearing (GM discretion).',

      },
      bad_hearing: {
        id: 'bad_hearing',
        name: 'Bad Hearing',
        type: 'disadvantage',
        maxRank: 10,
        costPerRank: 1,
        description: 'Reduced hearing; grants 1 point per Rank. Rank 7+: deaf in one ear; Rank 10: deaf in both ears.',


      },
      figure_good: {
        id: 'figure_good',
        name: 'Good Figure',
        type: 'advantage',
        maxRank: 10,
        costPerRank: 1,
        description: 'Athletic/attractive body; costs 1 point per Rank.',

      },
      figure_bad: {
        id: 'figure_bad',
        name: 'Bad Figure',
        type: 'disadvantage',
        maxRank: 10,
        costPerRank: 1,
        description: 'Dumpier or overweight body; grants 1 point per Rank.',


      },
      speech_good: {
        id: 'speech_good',
        name: 'Good Speech',
        type: 'advantage',
        maxRank: 1,
        costPerRank: 2,
        description: 'One Rank only. +1 to CHA-governed skill rolls when speaking in non-stressful situations.',
        effects: { chaSpeechBonus: 1 }
      },
      speech_bad: {
        id: 'speech_bad',
        name: 'Bad Speech',
        type: 'disadvantage',
        maxRank: 1,
        costPerRank: 2,
        description: 'One Rank only. -1 to CHA-governed skill rolls.',
        effects: { chaSpeechPenalty: -1 },

      },
      timekeeper_good: {
        id: 'timekeeper_good',
        name: 'Good Time Keeper',
        type: 'advantage',
        maxRank: 10,
        costPerRank: 1,
        description: 'Always on time; costs 1 point per Rank.',

      },
      timekeeper_bad: {
        id: 'timekeeper_bad',
        name: 'Bad Time Keeper',
        type: 'disadvantage',
        maxRank: 10,
        costPerRank: 1,
        description: 'Always late; grants 1 point per Rank.',


      },
      sleeper_good: {
        id: 'sleeper_good',
        name: 'Good Sleeper',
        type: 'advantage',
        maxRank: 10,
        costPerRank: 1,
        description: 'Sleeps well and knows how much rest is needed; costs 1 point per Rank.',

      },
      sleeper_bad: {
        id: 'sleeper_bad',
        name: 'Bad Sleeper',
        type: 'disadvantage',
        maxRank: 10,
        costPerRank: 1,
        description: 'Insomnia/tiredness; grants 1 point per Rank.',


      },
      sterile: {
        id: 'sterile',
        name: 'Sterile',
        type: 'disadvantage',
        maxRank: 1,
        oneOffCost: 10,
        description: 'Unable to have children. One-off disadvantage that grants 10 points.',

      },
      allergy: {
        id: 'allergy',
        name: 'Allergy',
        type: 'disadvantage',
        maxRank: 10,
        costPerRank: 2,
        description: 'Any allergy chosen with GM approval. Grants 2 points per Rank (severity increases with Rank).',

      },
      physical_general: {
        id: 'physical_general',
        name: 'General Physical',
        type: 'advantage',
        maxRank: 10,
        costPerRank: 2,
        description: 'Any physical advantage not listed. Costs 2 points per Rank; GM must approve specifics.',

      },
      medical: {
        id: 'medical',
        name: 'Medical Illness',
        type: 'disadvantage',
        maxRank: 10,
        costPerRank: 3,
        description: 'Specific illnesses mapped to Ranks 1–10. Grants 3 points per Rank. See effects mapping.',
        effects: {
          mapping: {
            1: { name: 'Psoriasis', notes: 'Cosmetic; no stat change unless GM decides.' },
            2: { name: 'Anaemia', stats: { PHYS: -1 } },
            3: { name: 'Asthma', stats: { PHYS: -1, DEX: -1 } },
            4: { name: 'Migraines', stats: { CONC: -4 }, notes: 'Recurring migraines: when active apply -4 CONC for the duration.' },
            5: { name: 'Albino', stats: { STR: -2 }, notes: 'Light sensitivity and medication required.' },
            6: { name: 'Immunodeficiency', notes: 'Susceptible to illnesses; when ill apply PHYS -2 and STR -1.' },
            7: { name: 'Epilepsy', notes: 'Fits or constant medication as GM decides.' },
            8: { name: 'Haemophilia', notes: 'Healing time doubled; healing and medical costs affected.' },
            9: { name: 'Parkinsons', stats: { STR: -2, DEX: -2, PHYS: -2 } },
            10: { name: 'Multiple Sclerosis', stats: { DEX: -3, PHYS: -1, CONC: -1 }, notes: 'Progressive deterioration over years.' }
          }
        }
      },
      dna_tattoo_good: {
        id: 'dna_tattoo_good',
        name: 'DNA Tattoo (Good)',
        type: 'advantage',
        maxRank: 10,
        costPerRank: 1,
        description: 'Permanent regenerative tattoo; costs 1 point per Rank. Higher Ranks are decorative/impressive.',

      },
      dna_tattoo_bad: {
        id: 'dna_tattoo_bad',
        name: 'DNA Tattoo (Bad)',
        type: 'disadvantage',
        maxRank: 10,
        costPerRank: 1,
        description: 'Poorly executed or grotesque tattoo; grants 1 point per Rank.',

      },
      drug_addict: {
        id: 'drug_addict',
        name: 'Drug Addict',
        type: 'disadvantage',
        maxRank: 10,
        costPerRank: 2,
        description: 'Pre-existing addiction. Grants 2 points per Rank; see Drugs chapter for in-play mechanics.',

      }
    }
  },

  mundane: {
    name: 'Mundane',
    items: {
      savings: {
        id: 'savings',
        name: 'Savings',
        type: 'advantage',
        maxRank: 10,
        costPerRank: 3,
        description: '100n per Rank in savings. Costs 3 points per Rank.',
        effects: { moneyPerRank: '100n' }
      },
      debt: {
        id: 'debt',
        name: 'Debt',
        type: 'disadvantage',
        maxRank: 10,
        costPerRank: 3,
        description: '100n per Rank in debt. Grants 3 points per Rank.',
        effects: { debtPerRank: '100n' }
      },
      vehicle: {
        id: 'vehicle',
        name: 'Vehicle',
        type: 'advantage',
        maxRank: 10,
        costPerRank: 2,
        description: 'Leased/assigned vehicle per Rank (SLA or civilian). Costs 2 points per Rank.',
        effects: {
          vehicleTable: {
            10: 'SLA A.P.C. (disarmed)',
            9: 'SLA military jeep (disarmed)',
            8: 'Large SLA car',
            7: 'SLA military motorcycle (disarmed)',
            6: 'Large SLA motorcycle',
            5: 'Small SLA car',
            4: 'Small SLA motorcycle',
            3: 'Large civilian motorcycle',
            2: 'Small civilian motorcycle',
            1: 'Use of parent/friend car or motorcycle'
          }
        }
      },
      housing: {
        id: 'housing',
        name: 'Housing',
        type: 'advantage',
        maxRank: 10,
        costPerRank: 3,
        description: 'Housing rank maps to living situation. Costs 3 points per Rank (positive ranks better housing).',
        effects: {
          housingTable: {
            10: 'Own lease for Mort apartment and own house off-planet',
            9: 'Uptown detached house (garden, garage, up to 3 bedrooms)',
            8: 'Uptown apartment (up to 3 bedrooms)',
            7: 'Uptown detached house (2 bedrooms)',
            6: 'Uptown semi-detached (3 bedrooms)',
            5: 'Uptown semi-detached (2 bedrooms)',
            4: 'Uptown semi-detached (2 bedrooms)',
            3: 'Uptown apartment (3 bedrooms)',
            2: 'Uptown apartment (2 bedrooms)',
            1: 'Uptown apartment (1 bedroom & living room)',
            0: 'Standard Uptown apartment (baseline)'
          }
        }
      },
      housing_poor: {
        id: 'housing_poor',
        name: 'Poor Housing',
        type: 'disadvantage',
        maxRank: 10,
        costPerRank: 3,
        description: 'Downgraded housing per negative Rank; grants 3 points per Rank.',

      },
      income_wealthy: {
        id: 'income_wealthy',
        name: 'Wealthy Income',
        type: 'advantage',
        maxRank: 10,
        costPerRank: 2,
        description: '10c per Rank monthly income. Costs 2 points per Rank.',
        effects: { incomePerRank: '10c' }
      },
      income_poor: {
        id: 'income_poor',
        name: 'Poor Income/Outgoings',
        type: 'disadvantage',
        maxRank: 10,
        costPerRank: 2,
        description: '10c per Rank monthly outgoing. Grants 2 points per Rank.',

      },
      mundane_general: {
        id: 'mundane_general',
        name: 'General Mundane',
        type: 'advantage',
        maxRank: 10,
        costPerRank: 1,
        description: 'Any mundane/financial advantage not listed. Costs 1 point per Rank.',

      },
      info_good: {
        id: 'info_good',
        name: 'Good Info',
        type: 'advantage',
        maxRank: 10,
        costPerRank: 1,
        description: 'Character knows useful mundane/financial info. Costs 1 point per Rank.',

      },
      info_bad: {
        id: 'info_bad',
        name: 'Bad Info',
        type: 'disadvantage',
        maxRank: 10,
        costPerRank: 1,
        description: 'Character knows harmful or forbidden info. Grants 1 point per Rank.',

      }
    }
  },

  mental: {
    name: 'Mental',
    items: {
      cool_exceed: {
        id: 'cool_exceed',
        name: 'Cool (Exceeding)',
        type: 'advantage',
        maxRank: 1,
        oneOffCost: 5,
        description: 'Increase racial COOL maximum by +1. One-off cost 5 points.',
        effects: { adjustCoolMax: 1 }
      },
      cool_jelly: {
        id: 'cool_jelly',
        name: 'Cool (Jelly)',
        type: 'disadvantage',
        maxRank: 1,
        oneOffCost: 5,
        description: 'Decrease racial COOL minimum by -1 (or reduce max by 1 depending on rules). Grants 5 points.',

      },
      phobia: {
        id: 'phobia',
        name: 'Phobia (placeholder)',
        type: 'disadvantage',
        maxRank: 10,
        costPerRank: 0,
        description: 'Placeholder entry to enable selecting detailed phobias in the Phobias step. Actual phobia point gains are determined in the Phobias step and do not come from this placeholder.',

        // marker to indicate special handling in UI/logic
        isPhobiaPlaceholder: true
      },
      arrogant: {
        id: 'arrogant',
        name: 'Arrogant',
        type: 'disadvantage',
        maxRank: 10,
        costPerRank: 2,
        description: 'Increasing arrogance; grants 2 points per Rank.',

      },
      mental_general: {
        id: 'mental_general',
        name: 'General Mental',
        type: 'advantage',
        maxRank: 10,
        costPerRank: 1,
        description: 'Any mental advantage not listed. Costs 1 point per Rank.',

      },
      psychoses: {
        id: 'psychoses',
        name: 'Psychoses',
        type: 'disadvantage',
        maxRank: 9,
        costPerRank: 3,
        description: 'Serious mental conditions. Grants 3 points per Rank. Max playable Rank 9; Rank 10 → character becomes NPC (GM).',

      }
    }
  },

  circumstantial: {
    name: 'Circumstantial',
    items: {
      major_friend: {
        id: 'major_friend',
        name: 'Major Friend',
        type: 'advantage',
        maxRank: 10,
        costPerRank: 5,
        description: 'Powerful ally who helps substantially. Costs 5 points per Rank.',

      },
      major_enemy: {
        id: 'major_enemy',
        name: 'Major Enemy',
        type: 'disadvantage',
        maxRank: 10,
        costPerRank: 5,
        description: 'Powerful foe who actively harms you. Grants 5 points per Rank.',

      },
      minor_friend: {
        id: 'minor_friend',
        name: 'Minor Friend',
        type: 'advantage',
        maxRank: 10,
        costPerRank: 1,
        description: 'Contact who helps occasionally. Costs 1 point per Rank.',

      },
      minor_enemy: {
        id: 'minor_enemy',
        name: 'Minor Enemy',
        type: 'disadvantage',
        maxRank: 10,
        costPerRank: 1,
        description: 'Annoying enemy; grants 1 point per Rank.',

      },
      luck: {
        id: 'luck',
        name: 'Luck',
        type: 'advantage',
        maxRank: 10,
        costPerRank: 4,
        description: 'GM-used mechanic. Costs 4 points per Rank.',

      },
      bad_luck: {
        id: 'bad_luck',
        name: 'Bad Luck',
        type: 'disadvantage',
        maxRank: 10,
        costPerRank: 4,
        description: 'Adverse luck; grants 4 points per Rank.',

      },
      dependant: {
        id: 'dependant',
        name: 'Dependant',
        type: 'disadvantage',
        maxRank: 10,
        costPerRank: 1,
        description: 'Care responsibility per Rank. Grants 1 point per Rank. See dependent table in rules.',

      },
      circumstantial_general: {
        id: 'circumstantial_general',
        name: 'General Circumstantial',
        type: 'advantage',
        maxRank: 10,
        costPerRank: 1,
        description: 'Other circumstantial advantages. Costs 1 point per Rank.',

      }
    }
  },

  social: {
    name: 'Social',
    items: {
      pacifist: {
        id: 'pacifist',
        name: 'Pacifist',
        type: 'disadvantage',
        maxRank: 10,
        costPerRank: 2,
        description: 'Reluctant/refuses combat. Grants 2 points per Rank. COOL roll to resist entering combat: COOL - Rank.',

      },
      chicken: {
        id: 'chicken',
        name: 'Chicken',
        type: 'disadvantage',
        maxRank: 10,
        costPerRank: 2,
        description: 'Cowardice in frightening situations. Grants 2 points per Rank. Roll COOL with modifier = -Rank when frightened.',

      },
      reputation_good: {
        id: 'reputation_good',
        name: 'Good Reputation',
        type: 'advantage',
        maxRank: 10,
        costPerRank: 2,
        description: 'Recognised positively by a group; costs 2 points per Rank.',

      },
      reputation_bad: {
        id: 'reputation_bad',
        name: 'Bad Reputation',
        type: 'disadvantage',
        maxRank: 10,
        costPerRank: 2,
        description: 'Distrusted or disliked; grants 2 points per Rank.',

      },
      social_general: {
        id: 'social_general',
        name: 'General Social',
        type: 'advantage',
        maxRank: 10,
        costPerRank: 2,
        description: 'Other social advantages; costs 2 points per Rank.',

      }
    }
  },

  hobby: {
    name: 'Hobby',
    items: {
      natural_aptitude: {
        id: 'natural_aptitude',
        name: 'Natural Aptitude',
        type: 'advantage',
        maxRank: 10,
        costPerRank: 3,
        description: 'Bonus ability tied to a non-combat skill. Costs 3 points per Rank.',

      },
      simple_hobby: {
        id: 'simple_hobby',
        name: 'Simple Hobby',
        type: 'advantage',
        maxRank: 10,
        costPerRank: 1,
        description: 'Minor hobby usable as a lesser skill. Costs 1 point per Rank.',

      },
      simple_hobby_bad: {
        id: 'simple_hobby_bad',
        name: 'Simple Hobby (Disadvantage)',
        type: 'disadvantage',
        maxRank: 10,
        costPerRank: 1,
        description: 'Hobby that consumes time or is a hindrance; grants 1 point per Rank.',

      }
    }
  }
};

// Utility: return net points for an item at given rank
// - For advantages: positive cost (points spent)
// - For disadvantages: negative points (points gained)
function getAdvantagePoints(item, rank = 1) {
  if (!item) return 0;
  // oneOffCost takes precedence
  if (item.oneOffCost) {
    return item.type === 'advantage' ? item.oneOffCost : -item.oneOffCost;
  }
  const r = Math.min(rank, item.maxRank || rank);
  const perRank = item.costPerRank || 0;
  return item.type === 'advantage' ? perRank * r : -perRank * r;
}

// Export for other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ADVANTAGES, getAdvantagePoints };
}
