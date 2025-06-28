// monsters.js - Monster database for different locations
const LOCATION_TYPES = {
    FIELD: 'field',
    DUNGEON: 'dungeon'
};
const MONSTERS = {
    // === FIELDS (Easier, Auto-Battle Friendly) ===
    prt_fild08: {
        name: "Prontera Field 08",
        type: LOCATION_TYPES.FIELD,
        averageLevel: 2,
        description: "Peaceful grasslands perfect for beginners",
        monsters: [
            { name: "Poring", level: 1, hp: 50, def: 0, exp: 10, gold: 5, emoji: "🐷", sprite: "poring.gif" },
            { name: "Lunatic", level: 3, hp: 60, def: 0, exp: 15, gold: 8, emoji: "🐰", sprite: "lunatic.gif" },
            { name: "Pupa", level: 2, hp: 100, def: 15, exp: 20, gold: 10, emoji: "🛡️", sprite: "pupa.gif" }
        ]
    },
    prt_fild01: {
        name: "Prontera Field 01",
        type: LOCATION_TYPES.FIELD,
        averageLevel: 10,
        description: "Rolling hills with stronger creatures",
        monsters: [
            { name: "Rocco", level: 8, hp: 180, def: 5, exp: 35, gold: 18, emoji: "🦗", sprite: "lunatic.gif" },
            { name: "Poporing", level: 14, hp: 344, def: 10, exp: 55, gold: 30, emoji: "🟢", sprite: "poporing.gif" },
            { name: "Mandragora", level: 12, hp: 405, def: 25, exp: 50, gold: 25, emoji: "🌱", sprite: "mandragora.gif" }
        ]
    },
    gef_fild: {
        name: "Geffen Field",
        type: LOCATION_TYPES.FIELD,
        averageLevel: 15,
        description: "Magical fields surrounding the wizard city",
        monsters: [
            { name: "Fabre", level: 12, hp: 163, def: 0, exp: 42, gold: 16, emoji: "🐛", sprite: "fabre.gif" },
            { name: "Creamy", level: 16, hp: 595, def: 0, exp: 65, gold: 35, emoji: "🦋", sprite: "creamy.gif" },
            { name: "Poporing", level: 17, hp: 544, def: 10, exp: 70, gold: 40, emoji: "🟢", sprite: "poporing.gif" }
        ]
    },
    pay_fild: {
        name: "Payon Field",
        type: LOCATION_TYPES.FIELD,
        averageLevel: 18,
        description: "Mysterious forests with lurking spirits",
        monsters: [
            { name: "Willow", level: 15, hp: 295, def: 40, exp: 60, gold: 22, emoji: "👻", sprite: "willow.gif" },
            { name: "Spore", level: 18, hp: 710, def: 5, exp: 80, gold: 38, emoji: "🍄", sprite: "spore.gif" },
            { name: "Wormtail", level: 20, hp: 826, def: 15, exp: 90, gold: 45, emoji: "🐭", sprite: "wormtail.gif" }
        ]
    },
    goblin_hell: {
        name: "Goblin Hell",
        type: LOCATION_TYPES.FIELD,
        averageLevel: 30,
        description: "The most dangerous field - a burning wasteland of goblins",
        monsters: [
            { name: "Goblin Warrior", level: 28, hp: 2100, def: 35, exp: 180, gold: 90, emoji: "👹", sprite: "goblin.gif" },
            { name: "Goblin Archer", level: 30, hp: 1800, def: 35, exp: 200, gold: 100, emoji: "🏹", sprite: "goblin.png" },
            { name: "Goblin King", level: 32, hp: 3500, def: 60, exp: 250, gold: 125, emoji: "👑", sprite: "hobgoblin.png", isBoss: true }
        ]
    },

    // === DUNGEONS (Harder, More Rewarding) ===
    prt_sewb: {
        name: "Prontera Culverts",
        type: LOCATION_TYPES.DUNGEON,
        averageLevel: 8,
        description: "Dark sewers beneath the capital city",
        monsters: [
            { name: "Thief Bug", level: 6, hp: 126, def: 20, exp: 45, gold: 25, emoji: "🪲", sprite: "thief_bug.gif" },
            { name: "Familiar", level: 8, hp: 155, def: 20, exp: 55, gold: 30, emoji: "🦇", sprite: "familiar.gif" },
            { name: "Tarou", level: 11, hp: 284, def: 10, exp: 75, gold: 40, emoji: "🐀", sprite: "tarou.gif" }
        ]
    },
    pay_dun: {
        name: "Payon Dungeon",
        type: LOCATION_TYPES.DUNGEON,
        averageLevel: 20,
        description: "Ancient caves filled with undead spirits",
        monsters: [
            { name: "Zombie", level: 18, hp: 734, def: 5, exp: 120, gold: 60, emoji: "🧟", sprite: "zombie.gif" },
            { name: "Skeleton", level: 20, hp: 834, def: 15, exp: 140, gold: 70, emoji: "💀", sprite: "skeleton.gif" },
            { name: "Munak", level: 25, hp: 2072, def: 45, exp: 200, gold: 100, emoji: "👤", sprite: "munak.gif" }
        ]
    },
    iz_dun: {
        name: "Byalan Dungeon",
        type: LOCATION_TYPES.DUNGEON,
        averageLevel: 25,
        description: "Underwater depths with aquatic monsters",
        monsters: [
            { name: "Hydra", level: 22, hp: 1060, def: 50, exp: 150, gold: 75, emoji: "🌊", sprite: "hydra.gif" },
            { name: "Marina", level: 25, hp: 1544, def: 15, exp: 180, gold: 90, emoji: "🎐", sprite: "marina.gif" },
            { name: "Thara Frog", level: 28, hp: 1834, def: 20, exp: 220, gold: 110, emoji: "🐸", sprite: "thara_frog.gif" }
        ]
    },
    moc_pryd: {
        name: "Pyramids",
        type: LOCATION_TYPES.DUNGEON,
        averageLevel: 45,
        description: "Ancient tombs with powerful guardians",
        monsters: [
            { name: "Mummy", level: 40, hp: 6176, def: 40, exp: 350, gold: 175, emoji: "🧻", sprite: "mummy.gif" },
            { name: "Verit", level: 45, hp: 6552, def: 55, exp: 400, gold: 200, emoji: "🦂", sprite: "verit.gif" },
            { name: "Ancient Mummy", level: 50, hp: 9613, def: 75, exp: 500, gold: 250, emoji: "⚰️", sprite: "ancient_mummy.gif" }
        ]
    },
    orc_dun: {
        name: "Orc Dungeon",
        type: LOCATION_TYPES.DUNGEON,
        averageLevel: 35,
        description: "Underground fortress of the orc tribes",
        monsters: [
            { name: "Orc Warrior", level: 32, hp: 3500, def: 35, exp: 280, gold: 140, emoji: "⚔️", sprite: "orc_warrior.gif" },
            { name: "Orc Lady", level: 35, hp: 4200, def: 50, exp: 320, gold: 160, emoji: "👸", sprite: "orc_lady.gif" },
            { name: "Orc Hero", level: 38, hp: 8500, def: 60, exp: 600, gold: 300, emoji: "🦾", sprite: "orc_hero.gif", isBoss: true },
            { name: "Orc Lord", level: 40, hp: 15000, def: 80, exp: 1000, gold: 500, emoji: "👑", sprite: "orc_lord.gif", isBoss: true }
        ]
    },
    
    // === ADVANCED DUNGEONS (Unlocked after rebirth) ===
    gef_dun: {
        name: "Geffen Dungeon",
        type: LOCATION_TYPES.DUNGEON,
        averageLevel: 70,
        description: "Deep magical caverns beneath Geffen",
        isAdvanced: true,
        monsters: [
            { name: "Nightmare", level: 69, hp: 12437, def: 75, exp: 700, gold: 350, emoji: "🐴", sprite: "nightmare.png" },
            { name: "Deviruchi", level: 64, hp: 10572, def: 75, exp: 650, gold: 325, emoji: "😈", sprite: "deviruchi.png" },
            { name: "Doppelganger", level: 77, hp: 249000, def: 110, exp: 8000, gold: 4000, emoji: "👤", sprite: "doppelganger.png", isBoss: true }
        ]
    },
    gl_knt: {
        name: "Glast Heim",
        type: LOCATION_TYPES.DUNGEON,
        averageLevel: 85,
        description: "Cursed castle of the undead knights",
        isAdvanced: true,
        monsters: [
            { name: "Raydric", level: 82, hp: 18408, def: 90, exp: 900, gold: 450, emoji: "⚔️", sprite: "raydric.png" },
            { name: "Khalitzburg", level: 90, hp: 25680, def: 110, exp: 1100, gold: 550, emoji: "🦴", sprite: "khalitzburg.png" },
            { name: "Dark Lord", level: 96, hp: 720000, def: 150, exp: 15000, gold: 7500, emoji: "👹", sprite: "dark_lord.png", isBoss: true }
        ]
    },
    thor_v: {
        name: "Thor Volcano",
        type: LOCATION_TYPES.DUNGEON,
        averageLevel: 110,
        description: "Fiery depths of the ancient volcano",
        isAdvanced: true,
        monsters: [
            { name: "Kasa", level: 108, hp: 42709, def: 130, exp: 1500, gold: 750, emoji: "🔥", sprite: "kasa.png" },
            { name: "Salamander", level: 115, hp: 56852, def: 150, exp: 1800, gold: 900, emoji: "🦎", sprite: "salamander.png" },
            { name: "Ifrit", level: 120, hp: 1260000, def: 190, exp: 25000, gold: 12500, emoji: "🔥", sprite: "ifrit.png", isBoss: true }
        ]
    },
    abbey: {
        name: "Nameless Island",
        type: LOCATION_TYPES.DUNGEON,
        averageLevel: 120,
        description: "Mysterious island with the highest level threats",
        isAdvanced: true,
        monsters: [
            { name: "Banshee", level: 115, hp: 48666, def: 160, exp: 1800, gold: 900, emoji: "👻", sprite: "banshee.png" },
            { name: "Necromancer", level: 120, hp: 62421, def: 180, exp: 2200, gold: 1100, emoji: "🧙", sprite: "necromancer.png" },
            { name: "Fallen Bishop", level: 125, hp: 2100000, def: 230, exp: 40000, gold: 20000, emoji: "⛪", sprite: "fallen_bishop.png", isBoss: true }
        ]
    },

    // === MVP BOSS AREAS (Extreme Difficulty) ===
    mvp_baphomet: {
        name: "Baphomet's Lair",
        type: LOCATION_TYPES.DUNGEON,
        averageLevel: 120,
        description: "The demonic realm of the goat-headed lord of darkness",
        isMvpArea: true,
        unlockRequirement: { level: 100, defeatedBosses: [] },
        monsters: [
            {
                name: "Baphomet",
                level: 120,
                hp: 668000,
                def: 100,
                exp: 50000,
                gold: 25000,
                emoji: "👹",
                sprite: "baphomet.gif",
                isMvp: true,
                mvpSkills: [
                    { name: "Hell's Judgment", damage: 2.5, cooldown: 8000, description: "Devastating dark magic attack" },
                    { name: "Demon Summon", effect: "summon", cooldown: 15000, description: "Summons demon minions" },
                    { name: "Dark Barrier", effect: "shield", cooldown: 12000, description: "Reduces incoming damage by 50%" }
                ],
                phases: [
                    { hpThreshold: 0.7, message: "Baphomet roars with fury!", effect: "rage" },
                    { hpThreshold: 0.3, message: "Baphomet enters demonic frenzy!", effect: "frenzy" }
                ]
            }
        ]
    },

    mvp_osiris: {
        name: "Pyramid of Osiris",
        type: LOCATION_TYPES.DUNGEON,
        averageLevel: 140,
        description: "Ancient tomb of the undead pharaoh king",
        isMvpArea: true,
        unlockRequirement: { level: 120, defeatedBosses: ["Baphomet"] },
        monsters: [
            {
                name: "Osiris",
                level: 140,
                hp: 1125000,
                def: 150,
                exp: 85000,
                gold: 40000,
                emoji: "🏺",
                sprite: "osiris.gif",
                isMvp: true,
                mvpSkills: [
                    { name: "Mummy Curse", damage: 1.8, cooldown: 6000, description: "Cursed bandages drain life", effect: "poison" },
                    { name: "Sandstorm", damage: 2.2, cooldown: 10000, description: "Blinding desert winds" },
                    { name: "Resurrection", effect: "heal", cooldown: 20000, description: "Restores 25% HP once per battle" }
                ],
                phases: [
                    { hpThreshold: 0.6, message: "Ancient curses awaken!", effect: "curse" },
                    { hpThreshold: 0.2, message: "Osiris calls upon the power of the afterlife!", effect: "desperation" }
                ]
            }
        ]
    },

    mvp_thanatos: {
        name: "Tower of Thanatos",
        type: LOCATION_TYPES.DUNGEON,
        averageLevel: 160,
        description: "The ultimate challenge - domain of the angel of death",
        isMvpArea: true,
        unlockRequirement: { level: 150, defeatedBosses: ["Baphomet", "Osiris"] },
        monsters: [
            {
                name: "Thanatos",
                level: 160,
                hp: 2200000,
                def: 200,
                exp: 150000,
                gold: 75000,
                emoji: "😇",
                sprite: "thanatos.gif",
                isMvp: true,
                mvpSkills: [
                    { name: "Divine Punishment", damage: 3.0, cooldown: 7000, description: "Holy light that pierces all defenses" },
                    { name: "Soul Drain", damage: 2.0, cooldown: 9000, description: "Steals MP and converts to damage", effect: "mpdrain" },
                    { name: "Angelic Blessing", effect: "fullheal", cooldown: 25000, description: "Fully restores HP once per battle" },
                    { name: "Judgment Day", damage: 4.0, cooldown: 15000, description: "Ultimate attack when below 10% HP" }
                ],
                phases: [
                    { hpThreshold: 0.5, message: "Thanatos spreads his divine wings!", effect: "ascension" },
                    { hpThreshold: 0.1, message: "The angel of death prepares final judgment!", effect: "judgment" }
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
        return MONSTERS[location] || MONSTERS.prt_fild08;
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

    // MVP-specific functions
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