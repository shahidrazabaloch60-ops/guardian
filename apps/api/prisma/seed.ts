import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // ─── Service Categories ──────────────────────────────────────────────────────

  const skillsCategory = await prisma.serviceCategory.upsert({
    where: { slug: 'skills' },
    update: {},
    create: {
      name: 'Skills',
      slug: 'skills',
      description: 'Power-level any OSRS skill from 1-99 with our experienced boosters.',
      icon: '⚔️',
      sortOrder: 1,
    },
  });

  const bossesCategory = await prisma.serviceCategory.upsert({
    where: { slug: 'bosses' },
    update: {},
    create: {
      name: 'Bosses',
      slug: 'bosses',
      description: 'Get any boss kill count with our professional PvM teams.',
      icon: '🐉',
      sortOrder: 2,
    },
  });

  const questsCategory = await prisma.serviceCategory.upsert({
    where: { slug: 'quests' },
    update: {},
    create: {
      name: 'Quests',
      slug: 'quests',
      description: 'Complete any quest in OSRS, from novice to grandmaster.',
      icon: '📜',
      sortOrder: 3,
    },
  });

  const minigamesCategory = await prisma.serviceCategory.upsert({
    where: { slug: 'minigames' },
    update: {},
    create: {
      name: 'Minigames',
      slug: 'minigames',
      description: 'Earn rewards from any minigame with our dedicated boosters.',
      icon: '🎮',
      sortOrder: 4,
    },
  });

  console.log('✅ Service categories seeded');

  // ─── Skills (23 OSRS Skills) ─────────────────────────────────────────────────

  const skillsData = [
    {
      name: 'Attack',
      slug: 'attack',
      basePrice: 3.99,
      pricePerLevel: 0.50,
      description: 'Boost your Attack level to wield stronger melee weapons and increase your melee accuracy. Our boosters use the most efficient training methods available, from Ammonite Crabs to Nightmare Zone, ensuring rapid progress through every milestone.',
      shortDescription: 'Increase melee accuracy and unlock stronger weapons.',
      estimatedTime: '1-3 days per 10 levels',
    },
    {
      name: 'Strength',
      slug: 'strength',
      basePrice: 3.99,
      pricePerLevel: 0.50,
      description: 'Power-level your Strength to deal devastating melee damage. Our experienced boosters optimize training with the best gear and methods, pushing through plateaus efficiently from Sand Crabs to the most AFK-friendly spots.',
      shortDescription: 'Maximize your melee damage output.',
      estimatedTime: '1-3 days per 10 levels',
    },
    {
      name: 'Defence',
      slug: 'defence',
      basePrice: 3.99,
      pricePerLevel: 0.50,
      description: 'Level up your Defence to equip the best armour in the game and reduce incoming damage. From Rune to Bandos, each milestone unlocks critical upgrades for your account\'s survivability in PvM and PvP.',
      shortDescription: 'Unlock the best armour and reduce damage taken.',
      estimatedTime: '1-3 days per 10 levels',
    },
    {
      name: 'Ranged',
      slug: 'ranged',
      basePrice: 4.99,
      pricePerLevel: 0.60,
      description: 'Train your Ranged skill to become a lethal marksman. Unlock powerful ranged weapons like the Toxic Blowpipe, Armadyl Crossbow, and Twisted Bow. Our boosters use chinchompas and optimal training spots for maximum XP rates.',
      shortDescription: 'Master ranged combat and unlock powerful bows.',
      estimatedTime: '1-4 days per 10 levels',
    },
    {
      name: 'Prayer',
      slug: 'prayer',
      basePrice: 5.99,
      pricePerLevel: 0.80,
      description: 'Raise your Prayer level to access powerful overhead prayers and protection prayers. Essential for bossing and high-level PvM content. Our boosters use the most cost-effective methods including dragon bones on gilded altars.',
      shortDescription: 'Unlock powerful prayers for combat protection.',
      estimatedTime: '1-2 days per 10 levels',
    },
    {
      name: 'Magic',
      slug: 'magic',
      basePrice: 4.99,
      pricePerLevel: 0.60,
      description: 'Elevate your Magic level to cast devastating spells and access teleportation across Gielinor. From splashing to bursting, our boosters select the optimal training method for your budget and timeline.',
      shortDescription: 'Cast powerful spells and unlock teleports.',
      estimatedTime: '1-4 days per 10 levels',
    },
    {
      name: 'Runecrafting',
      slug: 'runecrafting',
      basePrice: 7.99,
      pricePerLevel: 1.20,
      description: 'Conquer the notoriously challenging Runecrafting skill. Craft your own runes for magic and earn significant profits at higher levels. Our boosters specialize in efficient methods including Ourania Altar and Blood/Soul runes.',
      shortDescription: 'Craft runes and unlock profitable crafting methods.',
      estimatedTime: '3-7 days per 10 levels',
    },
    {
      name: 'Construction',
      slug: 'construction',
      basePrice: 8.99,
      pricePerLevel: 1.50,
      description: 'Build the ultimate player-owned house with high Construction. Unlock ornate pools, fairy ring gardens, occult altars, and jewellery boxes. Our boosters use mahogany tables and other tick-perfect methods for rapid gains.',
      shortDescription: 'Build your dream player-owned house.',
      estimatedTime: '1-3 days per 10 levels',
    },
    {
      name: 'Hitpoints',
      slug: 'hitpoints',
      basePrice: 3.99,
      pricePerLevel: 0.40,
      description: 'Increase your Hitpoints for greater survivability in all combat encounters. Higher Hitpoints means more time in boss fights and better sustain throughout your adventures. Trained naturally alongside other combat skills.',
      shortDescription: 'Boost your health pool for better survivability.',
      estimatedTime: '1-3 days per 10 levels',
    },
    {
      name: 'Agility',
      slug: 'agility',
      basePrice: 6.99,
      pricePerLevel: 1.00,
      description: 'Train your Agility to unlock shortcuts across the map and restore run energy faster. Essential for efficient gameplay. Our boosters navigate rooftop courses and the Hallowed Sepulchre for optimal XP and marks of grace.',
      shortDescription: 'Unlock shortcuts and restore run energy faster.',
      estimatedTime: '2-5 days per 10 levels',
    },
    {
      name: 'Herblore',
      slug: 'herblore',
      basePrice: 7.99,
      pricePerLevel: 1.10,
      description: 'Advance your Herblore to create powerful potions essential for bossing and raids. From Super Restores to Divine Super Combat Potions, higher Herblore unlocks the consumables that define endgame PvM.',
      shortDescription: 'Brew powerful potions for endgame content.',
      estimatedTime: '1-3 days per 10 levels',
    },
    {
      name: 'Thieving',
      slug: 'thieving',
      basePrice: 5.99,
      pricePerLevel: 0.70,
      description: 'Level your Thieving to pickpocket NPCs and loot chests for valuable rewards. Unlock access to master farmers, Elves, and Vyres. Our boosters use blackjacking and artefact methods for blazing-fast XP.',
      shortDescription: 'Pickpocket and steal for valuable rewards.',
      estimatedTime: '1-4 days per 10 levels',
    },
    {
      name: 'Crafting',
      slug: 'crafting',
      basePrice: 5.99,
      pricePerLevel: 0.80,
      description: 'Boost your Crafting level to create jewellery, d\'hide armour, and other valuable items. A key requirement for many quests and diaries. Our boosters use cost-effective methods from cutting gems to crafting black d\'hide bodies.',
      shortDescription: 'Create jewellery and craft powerful gear.',
      estimatedTime: '1-3 days per 10 levels',
    },
    {
      name: 'Fletching',
      slug: 'fletching',
      basePrice: 4.99,
      pricePerLevel: 0.50,
      description: 'Train Fletching to create bows, crossbows, and ammunition. One of the faster buyable skills, our boosters can push through levels quickly using darts, broad bolts, and magic longbows for efficient progression.',
      shortDescription: 'Craft bows, crossbows, and ammunition.',
      estimatedTime: '1-2 days per 10 levels',
    },
    {
      name: 'Slayer',
      slug: 'slayer',
      basePrice: 8.99,
      pricePerLevel: 1.30,
      description: 'Master the art of Slayer and unlock access to lucrative boss monsters and exclusive drops. From Abyssal Demons to Hydras, higher Slayer levels open up the most profitable PvM content in the game.',
      shortDescription: 'Unlock boss monsters and exclusive drops.',
      estimatedTime: '3-7 days per 10 levels',
    },
    {
      name: 'Hunter',
      slug: 'hunter',
      basePrice: 5.99,
      pricePerLevel: 0.70,
      description: 'Level Hunter to catch chinchompas for Ranged training and herbiboars for Herblore secondaries. Our boosters use birdhouse runs and efficient trapping methods for consistent XP gains.',
      shortDescription: 'Catch creatures and gather valuable resources.',
      estimatedTime: '1-4 days per 10 levels',
    },
    {
      name: 'Mining',
      slug: 'mining',
      basePrice: 5.99,
      pricePerLevel: 0.80,
      description: 'Mine your way to 99 with our expert boosters. Unlock access to Amethyst, Runite, and other high-level ores. Our team uses 3-tick granite and Volcanic Mine for maximum efficiency.',
      shortDescription: 'Mine ores and unlock valuable mining spots.',
      estimatedTime: '2-5 days per 10 levels',
    },
    {
      name: 'Smithing',
      slug: 'smithing',
      basePrice: 5.99,
      pricePerLevel: 0.70,
      description: 'Forge powerful equipment by leveling Smithing. Unlock the ability to smith Rune and Dragon items. Our boosters use blast furnace and gold bars for the most efficient training methods available.',
      shortDescription: 'Forge powerful weapons and armour.',
      estimatedTime: '1-3 days per 10 levels',
    },
    {
      name: 'Fishing',
      slug: 'fishing',
      basePrice: 4.99,
      pricePerLevel: 0.60,
      description: 'Cast your line and reel in XP with our Fishing boosting service. From barbarian fishing to anglerfish, our boosters know every method to efficiently level your Fishing skill.',
      shortDescription: 'Catch fish and unlock the best fishing methods.',
      estimatedTime: '2-4 days per 10 levels',
    },
    {
      name: 'Cooking',
      slug: 'cooking',
      basePrice: 3.99,
      pricePerLevel: 0.40,
      description: 'Cook your way to mastery with our efficient Cooking service. Unlock the ability to cook sharks, anglerfish, and other high-level food. One of the fastest skills to train with wines and karambwans.',
      shortDescription: 'Cook high-level food for combat sustain.',
      estimatedTime: '1-2 days per 10 levels',
    },
    {
      name: 'Firemaking',
      slug: 'firemaking',
      basePrice: 3.99,
      pricePerLevel: 0.40,
      description: 'Light up your Firemaking level with our boosting service. Whether through traditional log burning or the Wintertodt minigame, our boosters will get you to your target level in no time.',
      shortDescription: 'Burn logs and master the art of fire.',
      estimatedTime: '1-2 days per 10 levels',
    },
    {
      name: 'Woodcutting',
      slug: 'woodcutting',
      basePrice: 4.99,
      pricePerLevel: 0.50,
      description: 'Chop your way to 99 Woodcutting with our professional boosters. Unlock access to Redwood trees and earn solid profits. Our team uses tick manipulation and Sulliuscep methods for optimal rates.',
      shortDescription: 'Chop trees and unlock valuable timber.',
      estimatedTime: '2-4 days per 10 levels',
    },
    {
      name: 'Farming',
      slug: 'farming',
      basePrice: 6.99,
      pricePerLevel: 0.90,
      description: 'Grow your Farming level with our comprehensive boosting service. Unlock profitable herb patches, spirit trees, and the Farming Guild. Our boosters handle every farm run cycle for maximum efficiency.',
      shortDescription: 'Grow herbs and unlock the Farming Guild.',
      estimatedTime: '3-7 days per 10 levels',
    },
  ];

  for (let i = 0; i < skillsData.length; i++) {
    const skill = skillsData[i];
    await prisma.service.upsert({
      where: { slug: skill.slug },
      update: {},
      create: {
        name: skill.name,
        slug: skill.slug,
        description: skill.description,
        shortDescription: skill.shortDescription,
        categoryId: skillsCategory.id,
        basePrice: skill.basePrice,
        pricePerLevel: skill.pricePerLevel,
        estimatedTime: skill.estimatedTime,
        sortOrder: i + 1,
        seoTitle: `${skill.name} Boosting Service | GuardianRS`,
        seoDescription: skill.shortDescription,
        skill: {
          create: {
            maxLevel: 99,
          },
        },
      },
    });
  }

  console.log('✅ 23 Skills seeded');

  // ─── Bosses (10 Bosses) ──────────────────────────────────────────────────────

  const bossesData = [
    {
      name: 'Zulrah',
      slug: 'zulrah',
      basePrice: 2.99,
      pricePerKc: 1.50,
      difficulty: 'Medium',
      minCombatLevel: 90,
      description: 'Take on the serpentine boss Zulrah in the poisonous swamps. Our boosters master all three rotations to efficiently farm kills for Toxic Blowpipe, Serpentine Visage, and Magic Fang drops.',
      shortDescription: 'Farm Zulrah for Blowpipe and unique drops.',
      estimatedTime: '2-3 min per kill',
    },
    {
      name: 'Vorkath',
      slug: 'vorkath',
      basePrice: 2.99,
      pricePerKc: 1.50,
      difficulty: 'Medium',
      minCombatLevel: 90,
      description: 'Slay the undead dragon Vorkath for consistent GP and the coveted Dragonbone Necklace and Skeletal Visage. Our boosters achieve fast kill times with DHCB or DHL setups.',
      shortDescription: 'Farm Vorkath for GP and rare drops.',
      estimatedTime: '2-3 min per kill',
    },
    {
      name: 'Theatre of Blood',
      slug: 'theatre-of-blood',
      basePrice: 9.99,
      pricePerKc: 5.00,
      difficulty: 'Very Hard',
      minCombatLevel: 110,
      description: 'Conquer the Theatre of Blood raid and chase the legendary Scythe of Vitur and Ghrazi Rapier. Our experienced raid teams handle all rooms including Verzik Vitur flawlessly.',
      shortDescription: 'Complete ToB raids for endgame weapons.',
      estimatedTime: '25-35 min per completion',
    },
    {
      name: 'Chambers of Xeric',
      slug: 'chambers-of-xeric',
      basePrice: 7.99,
      pricePerKc: 4.00,
      difficulty: 'Hard',
      minCombatLevel: 100,
      description: 'Raid the Chambers of Xeric for the Twisted Bow, Dragon Hunter Crossbow, and other powerful rewards. Our boosters run efficient raids with optimal layouts and strategies.',
      shortDescription: 'Run CoX raids for Twisted Bow and more.',
      estimatedTime: '20-30 min per completion',
    },
    {
      name: 'The Gauntlet',
      slug: 'the-gauntlet',
      basePrice: 4.99,
      pricePerKc: 2.50,
      difficulty: 'Hard',
      minCombatLevel: 85,
      description: 'Challenge The Gauntlet and gear up from scratch to defeat the Crystalline Hunllef. Our boosters are experts at resource gathering and boss mechanics for consistent completions.',
      shortDescription: 'Complete The Gauntlet challenge.',
      estimatedTime: '10-12 min per completion',
    },
    {
      name: 'Corrupted Gauntlet',
      slug: 'corrupted-gauntlet',
      basePrice: 6.99,
      pricePerKc: 3.50,
      difficulty: 'Very Hard',
      minCombatLevel: 90,
      description: 'Take on the ultimate challenge of the Corrupted Gauntlet for the Enhanced Crystal Weapon Seed. Our boosters have thousands of KC and maintain exceptional completion rates.',
      shortDescription: 'Farm CG for Enhanced Crystal Weapon Seed.',
      estimatedTime: '8-10 min per completion',
    },
    {
      name: 'Nightmare',
      slug: 'nightmare',
      basePrice: 5.99,
      pricePerKc: 3.00,
      difficulty: 'Hard',
      minCombatLevel: 100,
      description: 'Battle The Nightmare of Ashihama for Inquisitor\'s armour and the Nightmare Staff. Our teams coordinate perfectly to handle parasites and sleepwalker mechanics.',
      shortDescription: 'Fight Nightmare for Inquisitor\'s gear.',
      estimatedTime: '5-8 min per kill',
    },
    {
      name: 'Nex',
      slug: 'nex',
      basePrice: 6.99,
      pricePerKc: 3.50,
      difficulty: 'Very Hard',
      minCombatLevel: 110,
      description: 'Challenge the Angel of Death, Nex, for Ancient Godsword and Zaryte pieces. Our boosters run optimized mass and small-team strategies for efficient kill times.',
      shortDescription: 'Kill Nex for Torva and Ancient items.',
      estimatedTime: '3-5 min per kill',
    },
    {
      name: 'Tombs of Amascut',
      slug: 'tombs-of-amascut',
      basePrice: 8.99,
      pricePerKc: 4.50,
      difficulty: 'Very Hard',
      minCombatLevel: 105,
      description: 'Delve into the Tombs of Amascut for Tumeken\'s Shadow, Masori armour, and the Lightbearer ring. Our raid teams handle expert-level invocations with ease.',
      shortDescription: 'Raid ToA for Tumeken\'s Shadow and Masori.',
      estimatedTime: '25-40 min per completion',
    },
    {
      name: 'General Graardor',
      slug: 'general-graardor',
      basePrice: 1.99,
      pricePerKc: 1.00,
      difficulty: 'Medium',
      minCombatLevel: 85,
      description: 'Storm the Bandos chamber in the God Wars Dungeon and farm General Graardor for the iconic Bandos armour set. Our boosters handle tanking and DPS for efficient trips.',
      shortDescription: 'Farm Graardor for Bandos armour.',
      estimatedTime: '1-2 min per kill',
    },
  ];

  for (let i = 0; i < bossesData.length; i++) {
    const boss = bossesData[i];
    await prisma.service.upsert({
      where: { slug: boss.slug },
      update: {},
      create: {
        name: boss.name,
        slug: boss.slug,
        description: boss.description,
        shortDescription: boss.shortDescription,
        categoryId: bossesCategory.id,
        basePrice: boss.basePrice,
        pricePerKc: boss.pricePerKc,
        estimatedTime: boss.estimatedTime,
        sortOrder: i + 1,
        seoTitle: `${boss.name} Boosting Service | GuardianRS`,
        seoDescription: boss.shortDescription,
        boss: {
          create: {
            difficulty: boss.difficulty,
            minCombatLevel: boss.minCombatLevel,
          },
        },
      },
    });
  }

  console.log('✅ 10 Bosses seeded');

  // ─── Quests (5 Quests) ───────────────────────────────────────────────────────

  const questsData = [
    {
      name: 'Dragon Slayer II',
      slug: 'dragon-slayer-ii',
      basePrice: 29.99,
      questPoints: 5,
      difficulty: 'Grandmaster',
      members: true,
      requirements: {
        skills: { attack: 75, mining: 68, smithing: 70, magic: 75, agility: 60, thieving: 60, crafting: 62, hitpoints: 50, construction: 50 },
        quests: ['Legends Quest', 'Dream Mentor', 'A Tail of Two Cats', 'Animal Magnetism', 'Ghosts Ahoy', 'Bone Voyage'],
      },
      description: 'Complete the epic Dragon Slayer II grandmaster quest. Unlock access to Vorkath, the Myths Guild, and Adamant/Rune dragon areas. One of the most rewarding quests in Old School RuneScape.',
      shortDescription: 'Unlock Vorkath and the Myths Guild.',
      estimatedTime: '3-5 hours',
    },
    {
      name: 'Monkey Madness II',
      slug: 'monkey-madness-ii',
      basePrice: 24.99,
      questPoints: 4,
      difficulty: 'Grandmaster',
      members: true,
      requirements: {
        skills: { slayer: 69, crafting: 70, hunter: 60, agility: 55, thieving: 55, firemaking: 60 },
        quests: ['Monkey Madness I', 'Troll Stronghold', 'Enlightened Journey'],
      },
      description: 'Complete Monkey Madness II to unlock demonic gorillas, the heavy ballista, and Zenyte jewellery crafting. A challenging grandmaster quest with intense boss fights.',
      shortDescription: 'Unlock demonic gorillas and Zenyte jewellery.',
      estimatedTime: '2-4 hours',
    },
    {
      name: 'Song of the Elves',
      slug: 'song-of-the-elves',
      basePrice: 34.99,
      questPoints: 4,
      difficulty: 'Grandmaster',
      members: true,
      requirements: {
        skills: { agility: 70, construction: 70, farming: 70, herblore: 70, hunter: 70, mining: 70, smithing: 70, woodcutting: 70 },
        quests: ['Mournings End Part II', 'Making History'],
      },
      description: 'Complete Song of the Elves to unlock Prifddinas, the crystal city. Access the Gauntlet, Zalcano, elite Elf pickpocketing, and numerous other high-level activities.',
      shortDescription: 'Unlock Prifddinas and its endgame content.',
      estimatedTime: '3-6 hours',
    },
    {
      name: 'Sins of the Father',
      slug: 'sins-of-the-father',
      basePrice: 19.99,
      questPoints: 2,
      difficulty: 'Master',
      members: true,
      requirements: {
        skills: { woodcutting: 62, fletching: 60, crafting: 56, agility: 52, attack: 50, slayer: 50, magic: 49 },
        quests: ['A Taste of Hope', 'Vampyre Slayer'],
      },
      description: 'Complete Sins of the Father to unlock Darkmeyer and Vyrewatch Sentinels for profitable blood shard farming. Features an iconic boss fight against Vanstrom Klause.',
      shortDescription: 'Unlock Darkmeyer and blood shard farming.',
      estimatedTime: '2-3 hours',
    },
    {
      name: 'A Night at the Theatre',
      slug: 'a-night-at-the-theatre',
      basePrice: 14.99,
      questPoints: 2,
      difficulty: 'Master',
      members: true,
      requirements: {
        skills: {},
        quests: ['Sins of the Father'],
      },
      description: 'Complete A Night at the Theatre to gain entry to the Theatre of Blood without needing a team. Features a story-mode version of the raid with unique rewards and lore.',
      shortDescription: 'Unlock Theatre of Blood story mode access.',
      estimatedTime: '1-2 hours',
    },
  ];

  for (let i = 0; i < questsData.length; i++) {
    const quest = questsData[i];
    await prisma.service.upsert({
      where: { slug: quest.slug },
      update: {},
      create: {
        name: quest.name,
        slug: quest.slug,
        description: quest.description,
        shortDescription: quest.shortDescription,
        categoryId: questsCategory.id,
        basePrice: quest.basePrice,
        estimatedTime: quest.estimatedTime,
        sortOrder: i + 1,
        seoTitle: `${quest.name} Quest Completion | GuardianRS`,
        seoDescription: quest.shortDescription,
        quest: {
          create: {
            questPoints: quest.questPoints,
            difficulty: quest.difficulty,
            members: quest.members,
            requirements: quest.requirements,
          },
        },
      },
    });
  }

  console.log('✅ 5 Quests seeded');

  // ─── Minigames (5 Minigames) ─────────────────────────────────────────────────

  const minigamesData = [
    {
      name: 'Barbarian Assault',
      slug: 'barbarian-assault',
      basePrice: 14.99,
      pricePerPoint: 0.10,
      pricePerKc: undefined as number | undefined,
      rewards: {
        notable: ['Fighter Torso', 'Fighter Hat', 'Penance Skirt', 'Healer Hat', 'Runner Hat'],
        points: ['Attacker Points', 'Defender Points', 'Healer Points', 'Collector Points'],
      },
      description: 'Earn Barbarian Assault rewards including the coveted Fighter Torso. Our teams coordinate all four roles for efficient wave completions and point farming.',
      shortDescription: 'Earn Fighter Torso and BA rewards.',
      estimatedTime: '2-4 hours for Torso',
    },
    {
      name: 'Pest Control',
      slug: 'pest-control',
      basePrice: 9.99,
      pricePerPoint: 0.05,
      pricePerKc: undefined as number | undefined,
      rewards: {
        notable: ['Void Knight Equipment', 'Elite Void', 'Void Melee Helm', 'Void Ranger Helm', 'Void Mage Helm'],
        points: ['Commendation Points'],
      },
      description: 'Farm Pest Control commendation points for Void Knight equipment. Our boosters join the highest-tier boat for maximum points per game and fast completions.',
      shortDescription: 'Farm Void Knight equipment and points.',
      estimatedTime: '6-10 hours for full Void',
    },
    {
      name: 'Wintertodt',
      slug: 'wintertodt',
      basePrice: 7.99,
      pricePerPoint: undefined as number | undefined,
      pricePerKc: 0.50,
      rewards: {
        notable: ['Pyromancer Outfit', 'Tome of Fire', 'Phoenix Pet', 'Bruma Torch', 'Warm Gloves'],
        crates: ['Supply Crates (scaled to levels)'],
      },
      description: 'Subdue the Wintertodt for Firemaking XP, supply crates, and a chance at the Phoenix pet. Our boosters maintain high points per game for maximum crate rewards.',
      shortDescription: 'Farm Wintertodt for crates and Phoenix pet.',
      estimatedTime: '3-5 min per kill',
    },
    {
      name: 'Guardians of the Rift',
      slug: 'guardians-of-the-rift',
      basePrice: 8.99,
      pricePerPoint: 0.08,
      pricePerKc: undefined as number | undefined,
      rewards: {
        notable: ['Raiments of the Eye', 'Abyssal Lantern', 'Abyssal Needle', 'Abyssal Protector Pet'],
        points: ['Abyssal Pearls'],
      },
      description: 'Play Guardians of the Rift for Runecrafting XP and Abyssal Pearls. Earn the Raiments of the Eye outfit for bonus rune crafting. Our boosters maximize pearl gains per game.',
      shortDescription: 'Earn GOTR rewards and Runecrafting XP.',
      estimatedTime: '10-12 min per game',
    },
    {
      name: 'Tempoross',
      slug: 'tempoross',
      basePrice: 6.99,
      pricePerPoint: undefined as number | undefined,
      pricePerKc: 0.40,
      rewards: {
        notable: ['Angler Outfit', 'Tackle Box', 'Big Harpoonfish', 'Spirit Angler Outfit', 'Tiny Tempor Pet'],
        crates: ['Reward Permits'],
      },
      description: 'Battle the spirit of the sea, Tempoross, for Fishing XP and unique rewards. Our boosters achieve maximum reward permits per game for the best chance at the Angler outfit and Tiny Tempor pet.',
      shortDescription: 'Fish Tempoross for Angler outfit and rewards.',
      estimatedTime: '5-7 min per kill',
    },
  ];

  for (let i = 0; i < minigamesData.length; i++) {
    const minigame = minigamesData[i];
    await prisma.service.upsert({
      where: { slug: minigame.slug },
      update: {},
      create: {
        name: minigame.name,
        slug: minigame.slug,
        description: minigame.description,
        shortDescription: minigame.shortDescription,
        categoryId: minigamesCategory.id,
        basePrice: minigame.basePrice,
        pricePerPoint: minigame.pricePerPoint,
        pricePerKc: minigame.pricePerKc,
        estimatedTime: minigame.estimatedTime,
        sortOrder: i + 1,
        seoTitle: `${minigame.name} Boosting Service | GuardianRS`,
        seoDescription: minigame.shortDescription,
        minigame: {
          create: {
            rewards: minigame.rewards,
          },
        },
      },
    });
  }

  console.log('✅ 5 Minigames seeded');

  // ─── Admin User ──────────────────────────────────────────────────────────────

  const hashedPassword = await bcrypt.hash('admin123', 12);

  await prisma.user.upsert({
    where: { email: 'admin@guardianrs.com' },
    update: {},
    create: {
      email: 'admin@guardianrs.com',
      username: 'admin',
      passwordHash: hashedPassword,
      role: 'SUPER_ADMIN',
      emailVerified: true,
    },
  });

  console.log('✅ Admin user seeded');

  // ─── FAQs ────────────────────────────────────────────────────────────────────

  const faqsData = [
    {
      question: 'Is my account safe during boosting?',
      answer: 'Absolutely. Account security is our top priority at GuardianRS. We use VPN protection matching your region, never change any account settings, and our boosters are thoroughly vetted professionals with years of experience. We also offer the option to use a temporary PIN during your service for an extra layer of protection. Your login credentials are encrypted and never stored after the service is complete.',
      category: 'Security',
      sortOrder: 1,
    },
    {
      question: 'How long does a typical order take to complete?',
      answer: 'Completion times vary depending on the service. Skill boosting typically takes 1-7 days depending on the level range and skill. Boss kills are completed within hours of assignment. Quest completions usually take 1-6 hours depending on complexity. You can track your order progress in real-time through your dashboard, and our boosters provide regular updates throughout the process.',
      category: 'Orders',
      sortOrder: 2,
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept a variety of payment methods for your convenience. This includes all major credit and debit cards through Stripe, PayPal for quick and secure payments, and various cryptocurrencies including Bitcoin, Ethereum, and Litecoin for those who prefer decentralized payments. All transactions are processed securely with industry-standard encryption.',
      category: 'Payments',
      sortOrder: 3,
    },
    {
      question: 'Can I get a refund if I\'m not satisfied?',
      answer: 'Yes, we offer a comprehensive satisfaction guarantee. If your order has not yet been started, you can receive a full refund. For orders in progress, we offer partial refunds based on the work completed. If there are any issues with the quality of service, our support team will work with you to resolve the situation, which may include a redo of the service or a credit toward future orders.',
      category: 'Payments',
      sortOrder: 4,
    },
    {
      question: 'Do you support Ironman accounts?',
      answer: 'Yes! We fully support all Ironman account types including Regular Ironman, Hardcore Ironman, Ultimate Ironman, and Group Ironman. Our boosters are experienced with the unique restrictions of each mode and use appropriate methods. Please select your account type when placing an order so we can assign a specialist familiar with your account mode.',
      category: 'Services',
      sortOrder: 5,
    },
  ];

  for (const faq of faqsData) {
    await prisma.fAQ.upsert({
      where: { id: faq.question },
      update: {},
      create: faq,
    });
  }

  console.log('✅ FAQs seeded');

  // ─── Site Settings ───────────────────────────────────────────────────────────

  const settingsData = [
    {
      key: 'siteName',
      value: 'GuardianRS',
      type: 'string',
      description: 'The name of the website displayed in headers and titles.',
    },
    {
      key: 'siteDescription',
      value: 'Premium OSRS Boosting & Power Leveling Services',
      type: 'string',
      description: 'The main tagline and meta description for the site.',
    },
    {
      key: 'contactEmail',
      value: 'support@guardianrs.com',
      type: 'string',
      description: 'Primary contact email for customer support.',
    },
    {
      key: 'discordInvite',
      value: 'https://discord.gg/guardianrs',
      type: 'string',
      description: 'Discord server invite link for community and live support.',
    },
    {
      key: 'maintenanceMode',
      value: 'false',
      type: 'boolean',
      description: 'When enabled, the site displays a maintenance page to visitors.',
    },
    {
      key: 'minOrderAmount',
      value: '4.99',
      type: 'number',
      description: 'Minimum order amount in USD required to place an order.',
    },
  ];

  for (const setting of settingsData) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }

  console.log('✅ Site settings seeded');

  // ─── Announcement ────────────────────────────────────────────────────────────

  await prisma.announcement.create({
    data: {
      message: '🎉 Welcome to GuardianRS! Enjoy 10% off your first order with code WELCOME10. Our professional boosters are ready to help you achieve your OSRS goals safely and efficiently.',
      type: 'INFO',
      isActive: true,
    },
  });

  console.log('✅ Announcement seeded');

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
