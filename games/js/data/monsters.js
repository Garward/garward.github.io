// monsters.js - Monster database for different locations
const LOCATION_TYPES = {
    FIELD: 'field',
    DUNGEON: 'dungeon'
};
const MONSTERS = {
    // === FIELDS (Easier, Auto-Battle Friendly) ===
    verdant_meadow: {
        name: "Verdant Meadow",
        type: LOCATION_TYPES.FIELD,
        averageLevel: 2,
        description: "Peaceful grasslands perfect for beginners",
        monsters: [
            { name: "Gloop", level: 1, hp: 50, def: 0, exp: 10, gold: 5, emoji: "🟢", sprite: "gloop.png" },
            { name: "Thistle Hare", level: 3, hp: 60, def: 0, exp: 15, gold: 8, emoji: "🐰", sprite: "thistle_hare.png" },
            { name: "Shellbug", level: 2, hp: 100, def: 15, exp: 20, gold: 10, emoji: "🛡️", sprite: "shellbug.png" }
        ]
    },
    rolling_hills: {
        name: "Rolling Hills",
        type: LOCATION_TYPES.FIELD,
        averageLevel: 10,
        description: "Rolling hills with stronger creatures",
        monsters: [
            { name: "Meadow Hopper", level: 8, hp: 180, def: 5, exp: 35, gold: 18, emoji: "🦗", sprite: "meadow_hopper.png" },
            { name: "Verdant Gloop", level: 14, hp: 344, def: 10, exp: 55, gold: 30, emoji: "🟢", sprite: "verdant_gloop.png" },
            { name: "Snapvine", level: 12, hp: 405, def: 25, exp: 50, gold: 25, emoji: "🌱", sprite: "snapvine.png" }
        ]
    },
    mistwood_edge: {
        name: "Mistwood Edge",
        type: LOCATION_TYPES.FIELD,
        averageLevel: 15,
        description: "Misty woods on the border of the arcane city",
        monsters: [
            { name: "Leafgrub", level: 12, hp: 163, def: 0, exp: 42, gold: 16, emoji: "🐛", sprite: "leafgrub.png" },
            { name: "Dustwing Moth", level: 16, hp: 595, def: 0, exp: 65, gold: 35, emoji: "🦋", sprite: "dustwing_moth.png" },
            { name: "Verdant Gloop", level: 17, hp: 544, def: 10, exp: 70, gold: 40, emoji: "🟢", sprite: "verdant_gloop.png" }
        ]
    },
    whisperpine: {
        name: "Whisperpine Forest",
        type: LOCATION_TYPES.FIELD,
        averageLevel: 18,
        description: "Mysterious forests with lurking spirits",
        monsters: [
            { name: "Gnarloak", level: 15, hp: 295, def: 40, exp: 60, gold: 22, emoji: "🌳", sprite: "gnarloak.png" },
            { name: "Puffcap", level: 18, hp: 710, def: 5, exp: 80, gold: 38, emoji: "🍄", sprite: "puffcap.png" },
            { name: "Burrow Rat", level: 20, hp: 826, def: 15, exp: 90, gold: 45, emoji: "🐭", sprite: "burrow_rat.png" }
        ]
    },
    ashen_wastes: {
        name: "Ashen Wastes",
        type: LOCATION_TYPES.FIELD,
        averageLevel: 30,
        description: "The most dangerous field - a burning wasteland of raiders",
        monsters: [
            { name: "Ashkin Raider", level: 28, hp: 2100, def: 35, exp: 180, gold: 90, emoji: "👹", sprite: "ashkin_raider.png" },
            { name: "Ashkin Stalker", level: 30, hp: 1800, def: 35, exp: 200, gold: 100, emoji: "🏹", sprite: "ashkin_stalker.png" },
            { name: "Ashkin Warlord", level: 32, hp: 3500, def: 60, exp: 250, gold: 125, emoji: "👑", sprite: "ashkin_warlord.png", isBoss: true }
        ]
    },

    // === DUNGEONS (Harder, More Rewarding) ===
    undercity_sewers: {
        name: "Undercity Sewers",
        type: LOCATION_TYPES.DUNGEON,
        averageLevel: 8,
        description: "Dark sewers beneath the capital city",
        monsters: [
            { name: "Gutter Roach", level: 6, hp: 126, def: 20, exp: 45, gold: 25, emoji: "🪲", sprite: "gutter_roach.png" },
            { name: "Cave Bat", level: 8, hp: 155, def: 20, exp: 55, gold: 30, emoji: "🦇", sprite: "cave_bat.png" },
            { name: "Sewer Rat", level: 11, hp: 284, def: 10, exp: 75, gold: 40, emoji: "🐀", sprite: "sewer_rat.png" }
        ]
    },
    hollow_crypt: {
        name: "Hollow Crypt",
        type: LOCATION_TYPES.DUNGEON,
        averageLevel: 20,
        description: "Ancient caves filled with undead spirits",
        monsters: [
            { name: "Shambler", level: 18, hp: 734, def: 5, exp: 120, gold: 60, emoji: "🧟", sprite: "shambler.png" },
            { name: "Skeleton", level: 20, hp: 834, def: 15, exp: 140, gold: 70, emoji: "💀", sprite: "skeleton.png" },
            { name: "Grave Husk", level: 25, hp: 2072, def: 45, exp: 200, gold: 100, emoji: "👤", sprite: "grave_husk.png" }
        ]
    },
    sunken_grotto: {
        name: "Sunken Grotto",
        type: LOCATION_TYPES.DUNGEON,
        averageLevel: 25,
        description: "Underwater depths with aquatic monsters",
        monsters: [
            { name: "Coral Creeper", level: 22, hp: 1060, def: 50, exp: 150, gold: 75, emoji: "🌊", sprite: "coral_creeper.png" },
            { name: "Sea Jelly", level: 25, hp: 1544, def: 15, exp: 180, gold: 90, emoji: "🎐", sprite: "sea_jelly.png" },
            { name: "Marsh Croaker", level: 28, hp: 1834, def: 20, exp: 220, gold: 110, emoji: "🐸", sprite: "marsh_croaker.png" }
        ]
    },
    dune_tombs: {
        name: "Dune Tombs",
        type: LOCATION_TYPES.DUNGEON,
        averageLevel: 45,
        description: "Ancient tombs with powerful guardians",
        monsters: [
            { name: "Mummy", level: 40, hp: 6176, def: 40, exp: 350, gold: 175, emoji: "🧻", sprite: "mummy.png" },
            { name: "Tomb Scarab", level: 45, hp: 6552, def: 55, exp: 400, gold: 200, emoji: "🦂", sprite: "tomb_scarab.png" },
            { name: "Ancient Mummy", level: 50, hp: 9613, def: 75, exp: 500, gold: 250, emoji: "⚰️", sprite: "ancient_mummy.png" }
        ]
    },
    ironfang_warrens: {
        name: "Ironfang Warrens",
        type: LOCATION_TYPES.DUNGEON,
        averageLevel: 35,
        description: "Underground fortress of the orc tribes",
        monsters: [
            { name: "Orc Warrior", level: 32, hp: 3500, def: 35, exp: 280, gold: 140, emoji: "⚔️", sprite: "orc_warrior.png" },
            { name: "Orc Shaman", level: 35, hp: 4200, def: 50, exp: 320, gold: 160, emoji: "🔮", sprite: "orc_shaman.png" },
            { name: "Orc Champion", level: 38, hp: 8500, def: 60, exp: 600, gold: 300, emoji: "🦾", sprite: "orc_champion.png", isBoss: true },
            { name: "Orc Overlord", level: 40, hp: 15000, def: 80, exp: 1000, gold: 500, emoji: "👑", sprite: "orc_overlord.png", isBoss: true }
        ]
    },

    // === ADVANCED DUNGEONS (Unlocked after rebirth) ===
    crystal_depths: {
        name: "Crystal Depths",
        type: LOCATION_TYPES.DUNGEON,
        averageLevel: 70,
        description: "Deep magical caverns beneath the arcane city",
        isAdvanced: true,
        monsters: [
            { name: "Gloom Mare", level: 69, hp: 12437, def: 75, exp: 700, gold: 350, emoji: "🐴", sprite: "gloom_mare.png" },
            { name: "Cave Imp", level: 64, hp: 10572, def: 75, exp: 650, gold: 325, emoji: "😈", sprite: "cave_imp.png" },
            { name: "Mirror Fiend", level: 77, hp: 249000, def: 110, exp: 8000, gold: 4000, emoji: "👤", sprite: "mirror_fiend.png", isBoss: true }
        ]
    },
    ruined_citadel: {
        name: "Ruined Citadel",
        type: LOCATION_TYPES.DUNGEON,
        averageLevel: 85,
        description: "Cursed castle of the undead knights",
        isAdvanced: true,
        monsters: [
            { name: "Phantom Knight", level: 82, hp: 18408, def: 90, exp: 900, gold: 450, emoji: "⚔️", sprite: "phantom_knight.png" },
            { name: "Bone Sentinel", level: 90, hp: 25680, def: 110, exp: 1100, gold: 550, emoji: "🦴", sprite: "bone_sentinel.png" },
            { name: "Shadow Tyrant", level: 96, hp: 720000, def: 150, exp: 15000, gold: 7500, emoji: "👹", sprite: "shadow_tyrant.png", isBoss: true }
        ]
    },
    cinderdeep: {
        name: "Cinderdeep Volcano",
        type: LOCATION_TYPES.DUNGEON,
        averageLevel: 110,
        description: "Fiery depths of the ancient volcano",
        isAdvanced: true,
        monsters: [
            { name: "Cinder Fiend", level: 108, hp: 42709, def: 130, exp: 1500, gold: 750, emoji: "🔥", sprite: "cinder_fiend.png" },
            { name: "Salamander", level: 115, hp: 56852, def: 150, exp: 1800, gold: 900, emoji: "🦎", sprite: "salamander.png" },
            { name: "Magma Titan", level: 120, hp: 1260000, def: 190, exp: 25000, gold: 12500, emoji: "🌋", sprite: "magma_titan.png", isBoss: true }
        ]
    },
    forsaken_isle: {
        name: "Forsaken Isle",
        type: LOCATION_TYPES.DUNGEON,
        averageLevel: 120,
        description: "Mysterious island with the highest level threats",
        isAdvanced: true,
        monsters: [
            { name: "Banshee", level: 115, hp: 48666, def: 160, exp: 1800, gold: 900, emoji: "👻", sprite: "banshee.png" },
            { name: "Necromancer", level: 120, hp: 62421, def: 180, exp: 2200, gold: 1100, emoji: "🧙", sprite: "necromancer.png" },
            { name: "Heretic Highpriest", level: 125, hp: 2100000, def: 230, exp: 40000, gold: 20000, emoji: "⛪", sprite: "heretic_highpriest.png", isBoss: true }
        ]
    },

    // === WORLD BOSS AREAS (Extreme Difficulty) ===
    boss_vargath: {
        name: "Vargath's Lair",
        type: LOCATION_TYPES.DUNGEON,
        averageLevel: 120,
        description: "The smouldering realm of the horned tyrant",
        isMvpArea: true,
        unlockRequirement: { level: 100, defeatedBosses: [] },
        monsters: [
            {
                name: "Vargath",
                level: 120,
                hp: 668000,
                def: 100,
                exp: 50000,
                gold: 25000,
                emoji: "👹",
                sprite: "vargath.png",
                isMvp: true,
                mvpSkills: [
                    { name: "Doombrand", damage: 2.5, cooldown: 8000, description: "Devastating dark magic attack" },
                    { name: "Summon Fiends", effect: "summon", cooldown: 15000, description: "Summons fiendish minions" },
                    { name: "Shadow Bulwark", effect: "shield", cooldown: 12000, description: "Reduces incoming damage by 50%" }
                ],
                phases: [
                    { hpThreshold: 0.7, message: "Vargath roars with fury!", effect: "rage" },
                    { hpThreshold: 0.3, message: "Vargath enters a burning frenzy!", effect: "frenzy" }
                ]
            }
        ]
    },

    boss_neferok: {
        name: "Tomb of Neferok",
        type: LOCATION_TYPES.DUNGEON,
        averageLevel: 140,
        description: "Ancient tomb of the undying desert king",
        isMvpArea: true,
        unlockRequirement: { level: 120, defeatedBosses: ["Vargath"] },
        monsters: [
            {
                name: "King Neferok",
                level: 140,
                hp: 1125000,
                def: 150,
                exp: 85000,
                gold: 40000,
                emoji: "🏺",
                sprite: "king_neferok.png",
                isMvp: true,
                mvpSkills: [
                    { name: "Wrapping Curse", damage: 1.8, cooldown: 6000, description: "Cursed bandages drain life", effect: "poison" },
                    { name: "Sandstorm", damage: 2.2, cooldown: 10000, description: "Blinding desert winds" },
                    { name: "Deathless Rite", effect: "heal", cooldown: 20000, description: "Restores 25% HP once per battle" }
                ],
                phases: [
                    { hpThreshold: 0.6, message: "Ancient curses awaken!", effect: "curse" },
                    { hpThreshold: 0.2, message: "Neferok calls upon the power of the afterlife!", effect: "desperation" }
                ]
            }
        ]
    },

    boss_seraphel: {
        name: "Spire of Seraphel",
        type: LOCATION_TYPES.DUNGEON,
        averageLevel: 160,
        description: "The ultimate challenge - domain of the fallen seraph",
        isMvpArea: true,
        unlockRequirement: { level: 150, defeatedBosses: ["Vargath", "King Neferok"] },
        monsters: [
            {
                name: "Seraphel",
                level: 160,
                hp: 2200000,
                def: 200,
                exp: 150000,
                gold: 75000,
                emoji: "😇",
                sprite: "seraphel.png",
                isMvp: true,
                mvpSkills: [
                    { name: "Radiant Verdict", damage: 3.0, cooldown: 7000, description: "Holy light that pierces all defenses" },
                    { name: "Soul Siphon", damage: 2.0, cooldown: 9000, description: "Steals MP and converts to damage", effect: "mpdrain" },
                    { name: "Winged Grace", effect: "fullheal", cooldown: 25000, description: "Fully restores HP once per battle" },
                    { name: "Final Reckoning", damage: 4.0, cooldown: 15000, description: "Ultimate attack when below 10% HP" }
                ],
                phases: [
                    { hpThreshold: 0.5, message: "Seraphel spreads her burning wings!", effect: "ascension" },
                    { hpThreshold: 0.1, message: "The fallen seraph prepares her final reckoning!", effect: "judgment" }
                ]
            }
        ]
    }
};

// Monster utility functions
const MonsterUtils = {
    getRandomMonster(location, playerLevel) {
        const locationData = this.getLocationData(location);
        const monsters = locationData.monsters;
        const weightedMonsters = [];

// Weight monsters based on player level
    monsters.forEach(monster => {                        // Iterate over the monsters array
        const levelDiff = Math.abs(playerLevel - monster.level);
        const weight = Math.max(1, 10 - levelDiff);
        for (let i = 0; i < weight; i++) {
            weightedMonsters.push(monster);
        }
    });

        const randomMonster = weightedMonsters[Math.floor(Math.random() * weightedMonsters.length)];
        return {
            ...randomMonster,
            currentHp: randomMonster.hp,
            maxHp: randomMonster.hp,
            spriteUrl: randomMonster.sprite ? `sprites/monsters/${randomMonster.sprite}` : null
        };
    },

    getLocationData(location) {
        return MONSTERS[location] || MONSTERS.verdant_meadow;
    },

        getLocationList() {
        return Object.keys(MONSTERS);
    },

    isField(location) {
        const locationData = MONSTERS[location];
        return locationData && locationData.type === LOCATION_TYPES.FIELD;
    },

    isDungeon(location) {
        const locationData = MONSTERS[location];
        return locationData && locationData.type === LOCATION_TYPES.DUNGEON;
    },

    isAdvancedArea(location) {
        const locationData = this.getLocationData(location);
        return locationData && locationData.type === LOCATION_TYPES.DUNGEON && locationData.isAdvanced === true;
    },

    getFieldsList() {
        return Object.entries(MONSTERS)
            .filter(([key, data]) => data.type === LOCATION_TYPES.FIELD)
            .map(([key, data]) => ({ key, ...data }));
    },

    getDungeonsList() {
        return Object.entries(MONSTERS)
            .filter(([key, data]) => data.type === LOCATION_TYPES.DUNGEON)
            .map(([key, data]) => ({ key, ...data }));
    },

    getAverageLevel(location) {
        const locationData = MONSTERS[location];
        return locationData ? locationData.averageLevel : 1;
    },

    getLocationMonsterCount(location) {
        return (MONSTERS[location] || []).length;
    },

    getLocationDangerLevel(location, playerLevel) {
        const avgLevel = this.getLocationAverageLevel(location);
        const diff = avgLevel - playerLevel;

        if (diff > 20) return 'EXTREME';
        if (diff > 10) return 'HIGH';
        if (diff > 5) return 'MODERATE';
        if (diff > 0) return 'LOW';
        return 'SAFE';
    },

    getLocationDisplayName(location) {
        const locationData = this.getLocationData(location, false);
        if (locationData && locationData.name) {
            return locationData.name;
        }
        return location.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    },

    getLocationDescription(location) {
        const locationData = this.getLocationData(location, false);
        if (locationData && locationData.description) {
            return locationData.description;
        }
        return 'Mysterious area awaiting exploration';
    },

     // Get location difficulty multiplier for rewards
    getDifficultyMultiplier(location) {
        if (this.isField(location)) {
            return 1.0; // Standard rewards for fields
        } else if (this.isDungeon(location)) {
            return 1.5; // 50% bonus rewards for dungeons
        }
        return 1.0;
    },

        // Get monster sprite with fallback
    getMonsterSprite(monster) {
        if (monster.spriteUrl) {
            return monster.spriteUrl;
        }
        return null; // Will use emoji fallback
    },

    // World-boss-specific functions
    isMvpArea(location) {
        const locationData = this.getLocationData(location, false);
        return locationData && locationData.isMvpArea === true;
    },

    isMvpBoss(monster) {
        return monster && monster.isMvp === true;
    },

    getMvpUnlockRequirement(location) {
        const locationData = this.getLocationData(location, false);
        return locationData && locationData.unlockRequirement ? locationData.unlockRequirement : null;
    },

    canAccessMvpArea(location, playerLevel, defeatedBosses = []) {
        const requirement = this.getMvpUnlockRequirement(location);
        if (!requirement) return true; // No requirement means accessible

        const levelMet = playerLevel >= requirement.level;
        const bossesMet = requirement.defeatedBosses.every(boss => defeatedBosses.includes(boss));

        return levelMet && bossesMet;
    },

    getMvpSkills(monster) {
        return monster && monster.mvpSkills ? monster.mvpSkills : [];
    },

    getMvpPhases(monster) {
        return monster && monster.phases ? monster.phases : [];
    }

};