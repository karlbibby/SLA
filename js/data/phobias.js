// SLA Industries - Phobias (rewritten, spec-compliant)

/*
  Structure:
  - PHOBIAS.items: keyed by id with { id, name, description, maxRank, costPerRank, notes }
  - PHOBIA_RULES: creation & mechanic rules
  - Panic mechanic: GM rolls 2d10 + phobiaRank
      - Result <= 20: character attempts to flee/avoid (GM adjudicates)
      - Result >= 21: character freezes for a duration (GM adjudicates)
*/

const PHOBIAS = {
  items: {
    agoraphobia: { id: 'agoraphobia', name: 'Agoraphobia', description: 'Fear of open or public spaces.', maxRank: 10, costPerRank: 2 },
    algophobia: { id: 'algophobia', name: 'Algophobia', description: 'Fear of pain.', maxRank: 10, costPerRank: 2 },
    altophobia: { id: 'altophobia', name: 'Altophobia', description: 'Fear of heights.', maxRank: 10, costPerRank: 2 },
    aluirophobia: { id: 'aluirophobia', name: 'Aluirophobia', description: 'Fear of cats.', maxRank: 10, costPerRank: 2 },
    androphobia: { id: 'androphobia', name: 'Androphobia', description: 'Fear of men.', maxRank: 10, costPerRank: 2 },
    anthropophobia: { id: 'anthropophobia', name: 'Anthropophobia', description: 'Fear of other people / human beings.', maxRank: 10, costPerRank: 2 },
    asthenophobia: { id: 'asthenophobia', name: 'Asthenophobia', description: 'Fear of weakness.', maxRank: 10, costPerRank: 2 },
    batrachophobia: { id: 'batrachophobia', name: 'Batrachophobia', description: 'Fear of reptiles.', maxRank: 10, costPerRank: 2 },
    brontophobia: { id: 'brontophobia', name: 'Brontophobia', description: 'Fear of thunder or loud noises.', maxRank: 10, costPerRank: 2 },
    chaetophobia: { id: 'chaetophobia', name: 'Chaetophobia', description: 'Fear of hair.', maxRank: 10, costPerRank: 2 },
    claustrophobia: { id: 'claustrophobia', name: 'Claustrophobia', description: 'Fear of enclosed spaces.', maxRank: 10, costPerRank: 2 },
    clinophobia: { id: 'clinophobia', name: 'Clinophobia', description: 'Fear of going to bed.', maxRank: 10, costPerRank: 2 },
    coprophobia: { id: 'coprophobia', name: 'Coprophobia', description: 'Fear of faeces.', maxRank: 10, costPerRank: 2 },
    cynophobia: { id: 'cynophobia', name: 'Cynophobia', description: 'Fear of dogs.', maxRank: 10, costPerRank: 2 },
    demophobia: { id: 'demophobia', name: 'Demophobia', description: 'Fear of crowds.', maxRank: 10, costPerRank: 2 },
    doraphobia: { id: 'doraphobia', name: 'Doraphobia', description: 'Fear of fur.', maxRank: 10, costPerRank: 2 },
    eisoptrophobia: { id: 'eisoptrophobia', name: 'Eisoptrophobia', description: 'Fear of mirrors.', maxRank: 10, costPerRank: 2 },
    eleutherophobia: { id: 'eleutherophobia', name: 'Eleutherophobia', description: 'Fear of freedom.', maxRank: 10, costPerRank: 2 },
    entomophobia: { id: 'entomophobia', name: 'Entomophobia', description: 'Fear of insects.', maxRank: 10, costPerRank: 2 },
    eremitophobia: { id: 'eremitophobia', name: 'Eremitophobia', description: 'Fear of being alone.', maxRank: 10, costPerRank: 2 },
    erythrophobia: { id: 'erythrophobia', name: 'Erythrophobia', description: 'Fear of blushing.', maxRank: 10, costPerRank: 2 },
    genophobia: { id: 'genophobia', name: 'Genophobia', description: 'Fear of sex.', maxRank: 10, costPerRank: 2 },
    gymnophobia: { id: 'gymnophobia', name: 'Gymnophobia', description: 'Fear of nudity.', maxRank: 10, costPerRank: 2 },
    gynophobia: { id: 'gynophobia', name: 'Gynophobia', description: 'Fear of women.', maxRank: 10, costPerRank: 2 },
    haematophobia: { id: 'haematophobia', name: 'Haematophobia', description: 'Fear of blood.', maxRank: 10, costPerRank: 2 },
    haptophobia: { id: 'haptophobia', name: 'Haptophobia', description: 'Fear of being touched.', maxRank: 10, costPerRank: 2 },
    hodophobia: { id: 'hodophobia', name: 'Hodophobia', description: 'Fear of travel.', maxRank: 10, costPerRank: 2 },
    hypegiaphobia: { id: 'hypegiaphobia', name: 'Hypegiaphobia', description: 'Fear of responsibility.', maxRank: 10, costPerRank: 2 },
    hypnophobia: { id: 'hypnophobia', name: 'Hypnophobia', description: 'Fear of sleep.', maxRank: 10, costPerRank: 2 },
    kakarrophiaphobia: { id: 'kakarrophiaphobia', name: 'Kakarrophiaphobia', description: 'Fear of failure.', maxRank: 10, costPerRank: 2 },
    katagelophobia: { id: 'katagelophobia', name: 'Katagelophobia', description: 'Fear of ridicule.', maxRank: 10, costPerRank: 2 },
    kinetophobia: { id: 'kinetophobia', name: 'Kinetophobia', description: 'Fear of motion.', maxRank: 10, costPerRank: 2 },
    linonophobia: { id: 'linonophobia', name: 'Linonophobia', description: 'Fear of string.', maxRank: 10, costPerRank: 2 },
    lyssophobia: { id: 'lyssophobia', name: 'Lyssophobia', description: 'Fear of insanity.', maxRank: 10, costPerRank: 2 },
    mastigophobia: { id: 'mastigophobia', name: 'Mastigophobia', description: 'Fear of flogging.', maxRank: 10, costPerRank: 2 },
    mysophobia: { id: 'mysophobia', name: 'Mysophobia', description: 'Fear of dirt.', maxRank: 10, costPerRank: 2 },
    myxophobia: { id: 'myxophobia', name: 'Myxophobia', description: 'Fear of slime.', maxRank: 10, costPerRank: 2 },
    necrophobia: { id: 'necrophobia', name: 'Necrophobia', description: 'Fear of the dead.', maxRank: 10, costPerRank: 2 },
    nelophobia: { id: 'nelophobia', name: 'Nelophobia', description: 'Fear of glass.', maxRank: 10, costPerRank: 2 },
    nyctophobia: { id: 'nyctophobia', name: 'Nyctophobia', description: 'Fear of the dark.', maxRank: 10, costPerRank: 2 },
    odontophobia: { id: 'odontophobia', name: 'Odontophobia', description: 'Fear of teeth.', maxRank: 10, costPerRank: 2 },
    ommetophobia: { id: 'ommetophobia', name: 'Ommetophobia', description: 'Fear of eyes.', maxRank: 10, costPerRank: 2 },
    ophiophobia: { id: 'ophiophobia', name: 'Ophiophobia', description: 'Fear of snakes.', maxRank: 10, costPerRank: 2 },
    panphobia: { id: 'panphobia', name: 'Panphobia', description: 'Fear of everything.', maxRank: 10, costPerRank: 2 },
    peccatophobia: { id: 'peccatophobia', name: 'Peccatophobia', description: 'Fear of sinning.', maxRank: 10, costPerRank: 2 },
    pharmocophobia: { id: 'pharmocophobia', name: 'Pharmocophobia', description: 'Fear of drugs.', maxRank: 10, costPerRank: 2 },
    phonophobia: { id: 'phonophobia', name: 'Phonophobia', description: 'Fear of speaking aloud.', maxRank: 10, costPerRank: 2 },
    photophobia: { id: 'photophobia', name: 'Photophobia', description: 'Fear of strong light.', maxRank: 10, costPerRank: 2 },
    piscophobia: { id: 'piscophobia', name: 'Piscophobia', description: 'Fear of fish.', maxRank: 10, costPerRank: 2 },
    poinephobia: { id: 'poinephobia', name: 'Poinephobia', description: 'Fear of punishment.', maxRank: 10, costPerRank: 2 },
    pteronophobia: { id: 'pteronophobia', name: 'Pteronophobia', description: 'Fear of feathers.', maxRank: 10, costPerRank: 2 },
    phobophobia: { id: 'phobophobia', name: 'Phobophobia', description: 'Fear of being afraid.', maxRank: 10, costPerRank: 2 },
    sciophobia: { id: 'sciophobia', name: 'Sciophobia', description: 'Fear of shadows.', maxRank: 10, costPerRank: 2 },
    selaphobia: { id: 'selaphobia', name: 'Selaphobia', description: 'Fear of flashes.', maxRank: 10, costPerRank: 2 },
    sitophobia: { id: 'sitophobia', name: 'Sitophobia', description: 'Fear of food.', maxRank: 10, costPerRank: 2 },
    tachophobia: { id: 'tachophobia', name: 'Tachophobia', description: 'Fear of speed.', maxRank: 10, costPerRank: 2 },
    technophobia: { id: 'technophobia', name: 'Technophobia', description: 'Fear of technology.', maxRank: 10, costPerRank: 2 },
    teratophobia: { id: 'teratophobia', name: 'Teratophobia', description: 'Fear of monsters.', maxRank: 10, costPerRank: 2 },
    thallasophobia: { id: 'thallasophobia', name: 'Thallasophobia', description: 'Fear of the sea.', maxRank: 10, costPerRank: 2 },
    traumatophobia: { id: 'traumatophobia', name: 'Traumatophobia', description: 'Fear of injury.', maxRank: 10, costPerRank: 2 },
    triskadecaphobia: { id: 'triskadecaphobia', name: 'Triskadecaphobia', description: 'Fear of the number 13.', maxRank: 10, costPerRank: 2 },
    trypanophobia: { id: 'trypanophobia', name: 'Trypanophobia', description: 'Fear of injections.', maxRank: 10, costPerRank: 2 },
    xenophobia: { id: 'xenophobia', name: 'Xenophobia', description: 'Fear of the unknown or strangers.', maxRank: 10, costPerRank: 2 }
  }
};

const PHOBIA_RULES = {
  max_at_creation: 3,
  max_lifetime: 3,
  min_rank: 1,
  max_rank: 10,
  costPerRank: 2,
  panic_mechanic: {
    roll: '2d10 + phobiaRank',
    outcome: {
      '<=20': 'Attempt to flee or avoid the trigger (GM adjudicates behaviour).',
      '>=21': 'Freeze / become immobile for a period (GM adjudicates duration).'
    }
  },
  conflicts: [
    ['agoraphobia', 'claustrophobia'],
    ['altophobia', 'thallasophobia'], // heights vs sea (example conflict)
    ['photophobia', 'nyctophobia']
  ],
  note: 'Characters may take up to three phobias. GM discretion required for triggers, effects, and roleplay consequences.'
};

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PHOBIAS, PHOBIA_RULES };
}
