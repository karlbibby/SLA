// SLA Industries Character Generator - Skills Data (reworked per requested layout)

const SKILLS = {
  strength: {
    name: 'STRENGTH',
    skills: {
      'Unarmed Combat': {
        governingStat: 'STR',
        description: "Unarmed Combat is the basic skill of fisticuffs with no flair and pile-driving blows. This skill also covers brawling, using bottles, etc."
      },
      'Blade, 1-H': {
        governingStat: 'STR',
        description: 'One-handed blades from pocket knives through daggers to MAC knives. Does not cover throwing knives.',
        unarmedCombat: true
      },
      'Blade, 2-H': {
        governingStat: 'STR',
        description: 'Two-handed blades such as greatswords and Power Claymores.',
        unarmedCombat: true
      },
      'Club, 1-H': {
        governingStat: 'STR',
        description: 'One-handed clubs including batons and similar blunt instruments.',
        unarmedCombat: true
      },
      'Club, 2-H': {
        governingStat: 'STR',
        description: 'Two-handed improvised or crafted clubs such as baseball bats and large poles.',
        unarmedCombat: true
      },
      'Chainaxe': {
        governingStat: 'STR',
        description: 'Specialised chainaxe technique with a defined method to avoid self-injury.',
        unarmedCombat: true
      },
      'Flexible Weapon': {
        governingStat: 'STR',
        description: 'Nunchaku, bike chains, whips and similar flexible weapons.',
        unarmedCombat: true
      },
      'Pole-arm': {
        governingStat: 'STR',
        description: "Spears, pole-arms and modern equivalents such as Flick Scythes.",
        unarmedCombat: true
      }
    }
  },

  dexterity: {
    name: 'DEXTERITY',
    skills: {
      'Martial Arts': {
        governingStat: 'DEX',
        description: 'Trained unarmed combat styles (judo, karate, ninjitsu) that improve both defence and offence.',
        unarmedCombat: true
      },
      'Gymnastics': {
        governingStat: 'DEX',
        description: 'Agility training used to dodge attacks and perform acrobatic manoeuvres.'
      },
      'Forgery, Manual': {
        governingStat: 'DEX',
        description: 'Manual forgery of documents that can fool visual/manual inspection (not electronic devices).'
      },
      'Sleight': {
        governingStat: 'DEX',
        description: 'Sleight of hand: palming, card cheating and pickpocketing.'
      },
      'Sneaking': {
        governingStat: 'DEX',
        description: 'Moving silently and unseen; essential for infiltration.'
      },
      'Hide': {
        governingStat: 'DEX',
        description: 'Using shadows and cover to avoid detection; passive against Detect.'
      },
      'Pistol': {
        governingStat: 'DEX',
        description: 'Proficiency with one-handed ballistic weapons (pistols and SMGs).'
      },
      'Rifle': {
        governingStat: 'DEX',
        description: 'Proficiency with two-handed ballistic weapons (rifles and carbines).'
      },
      'Drive, Motorcycle': {
        governingStat: 'DEX',
        description: 'Ability to operate light, heavy and military motorcycles safely and effectively.'
      }
    }
  },

  physique: {
    name: 'PHYSIQUE',
    skills: {
      'Wrestling': {
        governingStat: 'PHYS',
        description: 'Wrestling skill used for grappling, pins and combat holds.',
        unarmedCombat: true
      },
      'Acrobatics': {
        governingStat: 'PHYS',
        description: 'Acrobatic ability for both sport and combat movement.'
      },
      'Running': {
        governingStat: 'PHYS',
        description: 'Sprint and endurance running; adds to sprint rate.'
      },
      'Climb': {
        governingStat: 'PHYS',
        description: 'Techniques and tools for climbing and scaling surfaces.'
      },
      'Swim': {
        governingStat: 'PHYS',
        description: 'Professional swimming including snorkeling and scuba.'
      },
      'Auto/Support': {
        governingStat: 'PHYS',
        description: 'Controlling automatic or multi-rate firearms for suppressive fire.'
      },
      'Throw': {
        governingStat: 'PHYS',
        description: 'Throwing grenades, knives and everyday objects effectively.'
      }
    }
  },

  charisma: {
    name: 'CHARISMA',
    skills: {
      'Leadership': {
        governingStat: 'CHA',
        description: 'Ability to lead, persuade and calm others in stressful situations.'
      },
      'Seduction': {
        governingStat: 'CHA',
        description: 'Using appearance and voice to attract or manipulate.'
      },
      'Disguise': {
        governingStat: 'CHA',
        description: 'Conceal identity with make-up and prosthetics for undercover work.'
      },
      'Interview': {
        governingStat: 'CHA',
        description: 'Conducting successful conversations, extracting information without nervousness.'
      },
      'Diplomacy': {
        governingStat: 'CHA',
        description: 'Managing public and press relations tactfully and politely.'
      },
      'Communique': {
        governingStat: 'CHA',
        description: 'Making clear official announcements and reports to higher-ranking personnel.'
      },
      'Haggle': {
        governingStat: 'CHA',
        description: 'Bargaining and negotiating favourable deals and prices.'
      },
      'Persuasion': {
        governingStat: 'CHA',
        description: 'Convincing others to do things they normally would not.'
      }
    }
  },

  diagnose: {
    name: 'DIAGNOSE',
    skills: {
      'Computer Use': {
        governingStat: 'KNOW',
        description: 'Using computers, word processors and software to a professional standard.'
      },
      'Electronics, Industrial': {
        governingStat: 'KNOW',
        description: 'Design and understanding of industrial electronic systems and circuit boards.'
      },
      'Mechanics, Industrial': {
        governingStat: 'KNOW',
        description: 'Knowledge of industrial machinery design, construction and manufacture.'
      },
      'Demolitions': {
        governingStat: 'KNOW',
        description: 'Rigging, priming and handling explosives and timers.'
      },
      'Medical, Paramedic': {
        governingStat: 'KNOW',
        description: 'On-the-spot first aid: set bones, stop bleeding; requires a Medi-kit.'
      },
      'Tactics': {
        governingStat: 'KNOW',
        description: "Battlefield and combat encounter knowledge for effective troop and weapon use."
      },
      'Tracking': {
        governingStat: 'KNOW',
        description: 'Tracking prey through terrain and estimating age/type of tracks.'
      },
      'Bribery': {
        governingStat: 'KNOW',
        description: 'Persuading someone to act improperly for money or gifts.'
      },
      'Torture': {
        governingStat: 'KNOW',
        description: 'Inflicting pain effectively for persuasion or punishment.'
      },
      'Lock Picking': {
        governingStat: 'DEX',
        description: 'Manual opening of conventional locks and safes.'
      },
      'Electronic Locks': {
        governingStat: 'KNOW',
        description: 'Hacking electronic security systems and keypad-operated doors; requires tools.'
      },
      'Business Administration': {
        governingStat: 'KNOW',
        description: 'Managing administrative affairs and company paperwork.'
      },
      'Forensics': {
        governingStat: 'KNOW',
        description: 'Scientific scene investigation including fingerprinting and corpse examination.'
      },
      'Pathology': {
        governingStat: 'KNOW',
        description: 'Analysing organs for disease in live or dead bodies.'
      },
      'Read Lips': {
        governingStat: 'DIA',
        description: 'Reading lips at a distance and understanding spoken content.'
      },
      'Intimidation': {
        governingStat: 'CHA',
        description: 'Knowing what will scare another character and applying it.'
      }
    }
  },

  concentration: {
    name: 'CONCENTRATION',
    skills: {
      'Weapons Maintenance': {
        governingStat: 'CONC',
        description: 'Cleaning and maintaining personal weapons and related equipment.'
      },
      'Drive, Civilian': {
        governingStat: 'CONC',
        description: 'Driving civilian vehicles, taxis, light trucks and jeeps.'
      },
      'Drive, Military': {
        governingStat: 'CONC',
        description: 'Driving military trucks, APCs, tracked vehicles and tanks.'
      },
      'Detect': {
        governingStat: 'CONC',
        description: 'Spotting suspicious circumstances, traps, clues or hidden opponents.'
      },
      'Medical, Surgery': {
        governingStat: 'CONC',
        description: 'Professional surgical operations; requires Medical, Paramedic pre-requisites and proper equipment.'
      },
      'Marksman': {
        governingStat: 'CONC',
        description: 'Taking more accurate aimed shots given time and favourable conditions.'
      },
      'Business Finance': {
        governingStat: 'CONC',
        description: 'Managing and budgeting finances for a character or squad.'
      },
      'Photography': {
        governingStat: 'CONC',
        description: 'Producing quality photographs and films; developing film when required.'
      }
    }
  },

  knowledge: {
    name: 'KNOWLEDGE',
    skills: {
      'Computer, Subterfuge': {
        governingStat: 'KNOW',
        description: 'Hacking and breaching computer systems to obtain networked information.'
      },
      'Electronics, Repair': {
        governingStat: 'KNOW',
        description: 'Repairing small to medium electronic devices and diagnosing faults.'
      },
      'Mechanics, Repair': {
        governingStat: 'KNOW',
        description: 'Diagnosing and repairing mechanical problems with appropriate tools.'
      },
      'Demolitions Disposal': {
        governingStat: 'KNOW',
        description: 'Defusing and deactivating explosive charges, booby-traps and grenades.'
      },
      'Survival': {
        governingStat: 'KNOW',
        description: 'Finding water, shelter and food to survive in wilderness environments.'
      },
      'Medical, Practice': {
        governingStat: 'KNOW',
        description: 'Diagnosing illness and medical practice; Rank 5 equates to a doctorate. Requires Paramedic pre-req.'
      },
      'Streetwise': {
        governingStat: 'KNOW',
        description: "Knowledge of street laws, criminal networks and urban survival."
      },
      'Rival Company': {
        governingStat: 'KNOW',
        description: 'Knowledge of rival company structures, procedures and personnel.'
      },
      'Evaluate Opponent': {
        governingStat: 'KNOW',
        description: 'Judging an opponent\'s combat abilities to provide tactical insight.'
      },
      'Literacy': {
        governingStat: 'KNOW',
        description: 'Reading and writing to a competent professional standard.'
      },
      'SLA Information': {
        governingStat: 'KNOW',
        description: 'Knowledge of the SLA company structure, rules and personnel.'
      },
      'Psychology': {
        governingStat: 'KNOW',
        description: 'Study and clinical knowledge of the mind and mental diseases.'
      },
      'Astronomy': {
        governingStat: 'KNOW',
        description: 'Scientific study of celestial bodies and star systems.'
      },
      'Pilot, Military': {
        governingStat: 'KNOW',
        description: 'Piloting shuttles, hover vehicles and larger military aircraft.'
      },
      'Navigation': {
        governingStat: 'KNOW',
        description: 'Navigation using maps, Nava-map systems, stars and landmarks.'
      },
      'Space Navigation': {
        governingStat: 'KNOW',
        description: 'Specialised navigation of star systems and fold passages (rare skill).'
      }
    }
  },

  secondary: {
    name: 'SECONDARY-SPECIAL INTEREST- HOBBY SKILLS',
    skills: {
      'Gambling': { governingStat: 'CONC', description: 'Proficiency at games of chance and wagering.' },
      'Ecology': { governingStat: 'KNOW', description: 'Study of organisms and ecosystems.' },
      'Cooking': { governingStat: 'KNOW', description: 'Culinary arts and professional cooking.' },
      'Agriculture': { governingStat: 'KNOW', description: 'Knowledge and practice of farming and cultivation.' },
      'History': { governingStat: 'KNOW', description: 'Study of the World of Progress history.' },
      'Dance': { governingStat: 'PHYS', description: 'Training or interest in dance forms.' },
      'Artistic Ability': { governingStat: 'CONC', description: 'Skill in producing visual art.' },
      'Music - general': { governingStat: 'KNOW', description: 'Interest in music and basic music theory.' },
      'Sewing': { governingStat: 'DEX', description: 'Sewing and needlework skills.' },
      'Archaeology': { governingStat: 'KNOW', description: 'Study of ancient cultures via excavation.' },
      'Physiography': { governingStat: 'KNOW', description: 'Study of planetary surfaces.' },
      'Cinematography': { governingStat: 'KNOW', description: 'Filmmaking skill and technique.' },
      'Theatre': { governingStat: 'KNOW', description: 'Performance and theatrical knowledge.' },
      'Languages: Killan': { governingStat: 'KNOW', description: "Common human tongue (SLA English)." },
      'Languages: Wraith': { governingStat: 'KNOW', description: 'Standard Wraith Raider language.' },
      'Languages: Shaktarian': { governingStat: 'KNOW', description: 'Shaktarian language (written form easier for humans).' },
      'Languages: Sign Language': { governingStat: 'KNOW', description: 'Standard sign language for mute or deaf characters.' },
      'Languages: New Parisian': { governingStat: 'KNOW', description: 'New Parisian (French).' },
      'Sports: Various': { governingStat: 'PHYS', description: 'Training or interest in sport(s).' },
      'Architecture': { governingStat: 'KNOW', description: 'Design and construction of buildings.' },
      'Physiology': { governingStat: 'KNOW', description: 'Study of organism functions and anatomy.' },
      'Palaeography': { governingStat: 'KNOW', description: 'Study of ancient writing and manuscripts.' },
      'Botany': { governingStat: 'KNOW', description: 'Study and knowledge of plants.' },
      'Zoology': { governingStat: 'KNOW', description: 'Study and knowledge of animals.' },
      'Mathematics': { governingStat: 'KNOW', description: 'Abstract science of numbers, quantity and space.' },
      'Video Games': { governingStat: 'KNOW', description: 'Skill in playing or designing video games.' },
      'Sing': { governingStat: 'CHA', description: 'Singing ability and interest.' },
      'Play Instrument': { governingStat: 'KNOW', description: 'Ability to play musical instruments.' }
    }
  }
};

// Skill costs (progressive: 1pt for Rank 1, 2pts for Rank 2, etc.)
function getSkillCost(rank) {
  return rank;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SKILLS;
}
