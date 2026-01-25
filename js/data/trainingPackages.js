// Training Packages for SLA Industries Character Creation
// Each package grants rank 2 to the listed skills

const TRAINING_PACKAGES = {
  deathSquad: {
    id: 'deathSquad',
    name: 'Death Squad Package',
    description: 'The Death Squad Package trains and places the operative in an advanced and heavy assault form of combat. The Death Squads are trained to analyse the enemy and are usually equipped heavily with armour and equipment, as they are faced with the toughest, most brutal missions and often battle rival company operatives and agents who are as well armed as they are. In these squads, promotion comes fast if the operative can survive for long enough. There are usually one or two Death Squad trained operatives in a normal squad.',
    skills: [
      'Auto/Support',
      'Rifle',
      'Rival Company',
      'Tactics',
      'Evaluate Opponent',
      'Unarmed Combat'
    ]
  },
  
  kickMurderSquad: {
    id: 'kickMurderSquad',
    name: 'Kick Murder Squad Package',
    description: 'The Kick Murder Squad Package trains the operative in the form of assassination and espionage. The trainee operative learns Martial Arts and other forms of close combat. Their missions can vary widely from murdering an important company representative to the retrieval of a secret Rival Company map or weapon. Any mission or job that involves stealth and silence is given to the Kick Murder Squad.',
    skills: [
      'Hide',
      'Sneaking',
      'Martial Arts',
      'Climb',
      'Acrobatics'
    ],
    selectableCombatSkill: true  // Flag to indicate this package has a selectable unarmed combat skill
  },
  
  investigationInterrogation: {
    id: 'investigationInterrogation',
    name: 'Investigation and Interrogation Package',
    description: 'The Investigation and Interrogation Package trains the operative in undercover work. The operative learns rapidly how to root out traitors, analyze the structure of Rival Companies, extract information from captives, gain reliable sources and recover lost information - all aspects that are essential to their company\'s survival. This package is usually appropriate to Ebons whose goal is knowledge and loyalty. This is also the basic training for Shiver Unit troops.',
    skills: [
      'Detect',
      'Rival Company',
      'SLA Information',
      'Streetwise',
      'Interview',
      'Forensics'
    ]
  },
  
  medical: {
    id: 'medical',
    name: 'Medical Package',
    description: 'The Medical Package is a very in-depth and specialized form of training and most companies find that an operative with these skills is an essential part of a squad, especially when there are no Ebons to compensate for the other operative\'s lack of medical skills. The operative\'s medical training includes Paramedic skills and Forensics as well as Pathology and Computer Use so that they are able to use the medical computer software available to them in SLA Industries.',
    skills: [
      'Medical, Paramedic',
      'Medical, Practice',
      'Forensics',
      'Psychology',
      'Pathology',
      'Computer Use'
    ]
  },
  
  mechanics: {
    id: 'mechanics',
    name: 'Mechanics Package',
    description: 'The Mechanics Package is similar to the Medical Package with respect to the amount of specialized training involved, and most squads with a vehicle of some sort find that an operative with a Mechanics training package is necessary for the upkeep of their vehicle, as it is usually a valuable asset to the squad. The Mechanics Package also includes training for the operative in Computer Use, Subterfuge and Electronics.',
    skills: [
      'Mechanics, Repair',
      'Mechanics, Industrial',
      'Electronics, Repair',
      'Electronics, Industrial',
      'Computer Use',
      'Computer, Subterfuge'
    ]
  },
  
  pilotNavigation: {
    id: 'pilotNavigation',
    name: 'Pilot and Navigation Package',
    description: 'The Pilot and Navigation Package trains the operative in all aspects of company transport. This involves learning how to drive and pilot the varying vehicle types, which range from small jeeps to the Line Mate tanks, from armed bikes to the heavily armed Kilcopter. The pilot is also given a knowledge of how to repair and analyse certain parts of damaged and non-functioning vehicles. The package includes training in navigation which comprises map-reading, a knowledge of navigational devices such as the Nava-map and land marks. An operative trained in this package is essential to a squad who frequently travel.',
    skills: [
      'Pilot, Military',
      'Drive, Military',
      'Drive, Motorcycle',
      'Navigation',
      'Auto/Support',
      'Mechanics, Repair'
    ]
  },
  
  business: {
    id: 'business',
    name: 'Business Package',
    description: 'This package is essential for any operative who wishes to climb the corporate ladder in the business side of SLA Industries or, alternatively, if a character wishes to become a combat financier for their squad. The training comprises of administration and financial skills as well as public speaking and diplomacy skills necessary for a corporate in the harsh environment of the corporate sector.',
    skills: [
      'Business Administration',
      'Business Finance',
      'Diplomacy',
      'Communique',
      'SLA Information',
      'Computer Use'
    ]
  },
  
  strikeSquad: {
    id: 'strikeSquad',
    name: 'Strike Squad Package',
    description: 'The Strike Squad Package training is the basic Militia training for operatives. The operative is not trained in a specialized field but a selection of the basic skills needed to be an operative. A player can further specialize his / her character later on in generation if he or she so desires. The Strike Squad Package training provides a good basis for versatility in SLA Industries.',
    skills: [
      'Drive, Civilian',
      'Drive, Military',
      'Pistol',
      'Rifle',
      'Medical, Paramedic'
    ],
    selectableCombatSkill: true  // Flag to indicate this package has a selectable unarmed combat skill
  },
  
  scouting: {
    id: 'scouting',
    name: 'Scouting Package',
    description: 'An operative trained in the Scouting Package is necessary in most squads as their specialized skills are nearly always required. The streets of the cities in the World of Progress are as vast, and as complex, as the great jungles on the Natural Worlds. Scouts are necessary for both. Training includes the use of sniper skills as well as tracking.',
    skills: [
      'Tracking',
      'Streetwise',
      'Detect',
      'Running',
      'Sneaking',
      'Rifle'
    ]
  }
};
