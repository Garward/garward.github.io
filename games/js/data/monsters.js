// monsters.js - Monster database for different locations
const LOCATION_TYPES = {
    FIELD: 'field',
    DUNGEON: 'dungeon'
};

const AREA_PROGRESSION_ORDER = [
    "verdant_meadow",
    "undercity_sewers",
    "rolling_hills",
    "mistwood_edge",
    "whisperpine",
    "hollow_crypt",
    "sunken_grotto",
    "ashen_wastes",
    "ironfang_warrens",
    "dune_tombs",
    "crystal_depths",
    "ruined_citadel",
    "cinderdeep",
    "forsaken_isle",
    "boss_vargath",
    "boss_neferok",
    "boss_seraphel"
];

const MONSTERS = {
    "verdant_meadow": {
        "name": "Verdant Meadow",
        "type": "field",
        "averageLevel": 2,
        "description": "Peaceful grasslands perfect for beginners",
        "monsters": [
            {
                "name": "Gloop",
                "level": 1,
                "hp": 164,
                "def": 0,
                "exp": 5,
                "gold": 2,
                "emoji": "🟢",
                "sprite": "gloop.png",
                "baseAttack": 9
            },
            {
                "name": "Thistle Hare",
                "level": 3,
                "hp": 160,
                "def": 1,
                "exp": 39,
                "gold": 18,
                "emoji": "🐰",
                "sprite": "thistle_hare.png",
                "baseAttack": 16
            },
            {
                "name": "Shellbug",
                "level": 2,
                "hp": 160,
                "def": 1,
                "exp": 19,
                "gold": 9,
                "emoji": "🛡️",
                "sprite": "shellbug.png",
                "baseAttack": 12
            }
        ]
    },
    "undercity_sewers": {
        "name": "Undercity Sewers",
        "type": "dungeon",
        "averageLevel": 8,
        "description": "Dark sewers beneath the capital city",
        "monsters": [
            {
                "name": "Gutter Roach",
                "level": 6,
                "hp": 731,
                "def": 5,
                "exp": 142,
                "gold": 60,
                "emoji": "🪲",
                "sprite": "gutter_roach.png",
                "baseAttack": 44
            },
            {
                "name": "Cave Bat",
                "level": 8,
                "hp": 723,
                "def": 6,
                "exp": 229,
                "gold": 97,
                "emoji": "🦇",
                "sprite": "cave_bat.png",
                "baseAttack": 53
            },
            {
                "name": "Sewer Rat",
                "level": 11,
                "hp": 706,
                "def": 8,
                "exp": 384,
                "gold": 162,
                "emoji": "🐀",
                "sprite": "sewer_rat.png",
                "baseAttack": 66
            }
        ]
    },
    "rolling_hills": {
        "name": "Rolling Hills",
        "type": "field",
        "averageLevel": 10,
        "description": "Rolling hills with stronger creatures",
        "monsters": [
            {
                "name": "Meadow Hopper",
                "level": 8,
                "hp": 433,
                "def": 4,
                "exp": 210,
                "gold": 95,
                "emoji": "🦗",
                "sprite": "meadow_hopper.png",
                "baseAttack": 33
            },
            {
                "name": "Verdant Gloop",
                "level": 14,
                "hp": 424,
                "def": 6,
                "exp": 511,
                "gold": 230,
                "emoji": "🟢",
                "sprite": "verdant_gloop.png",
                "baseAttack": 54
            },
            {
                "name": "Snapvine",
                "level": 12,
                "hp": 428,
                "def": 5,
                "exp": 403,
                "gold": 181,
                "emoji": "🌱",
                "sprite": "snapvine.png",
                "baseAttack": 47
            }
        ]
    },
    "mistwood_edge": {
        "name": "Mistwood Edge",
        "type": "field",
        "averageLevel": 15,
        "description": "Misty woods on the border of the arcane city",
        "monsters": [
            {
                "name": "Leafgrub",
                "level": 12,
                "hp": 605,
                "def": 5,
                "exp": 403,
                "gold": 181,
                "emoji": "🐛",
                "sprite": "leafgrub.png",
                "baseAttack": 47
            },
            {
                "name": "Dustwing Moth",
                "level": 16,
                "hp": 596,
                "def": 7,
                "exp": 626,
                "gold": 282,
                "emoji": "🦋",
                "sprite": "dustwing_moth.png",
                "baseAttack": 61
            },
            {
                "name": "Verdant Gloop",
                "level": 17,
                "hp": 592,
                "def": 8,
                "exp": 685,
                "gold": 308,
                "emoji": "🟢",
                "sprite": "verdant_gloop.png",
                "baseAttack": 65
            }
        ]
    },
    "whisperpine": {
        "name": "Whisperpine Forest",
        "type": "field",
        "averageLevel": 18,
        "description": "Mysterious forests with lurking spirits",
        "monsters": [
            {
                "name": "Gnarloak",
                "level": 15,
                "hp": 706,
                "def": 7,
                "exp": 568,
                "gold": 256,
                "emoji": "🌳",
                "sprite": "gnarloak.png",
                "baseAttack": 58
            },
            {
                "name": "Puffcap",
                "level": 18,
                "hp": 701,
                "def": 8,
                "exp": 745,
                "gold": 335,
                "emoji": "🍄",
                "sprite": "puffcap.png",
                "baseAttack": 68
            },
            {
                "name": "Burrow Rat",
                "level": 20,
                "hp": 697,
                "def": 9,
                "exp": 869,
                "gold": 391,
                "emoji": "🐭",
                "sprite": "burrow_rat.png",
                "baseAttack": 75
            }
        ]
    },
    "hollow_crypt": {
        "name": "Hollow Crypt",
        "type": "dungeon",
        "averageLevel": 20,
        "description": "Ancient caves filled with undead spirits",
        "monsters": [
            {
                "name": "Shambler",
                "level": 18,
                "hp": 1513,
                "def": 14,
                "exp": 815,
                "gold": 345,
                "emoji": "🧟",
                "sprite": "shambler.png",
                "baseAttack": 97
            },
            {
                "name": "Skeleton",
                "level": 20,
                "hp": 1505,
                "def": 15,
                "exp": 951,
                "gold": 402,
                "emoji": "💀",
                "sprite": "skeleton.png",
                "baseAttack": 106
            },
            {
                "name": "Grave Husk",
                "level": 25,
                "hp": 1471,
                "def": 19,
                "exp": 1305,
                "gold": 552,
                "emoji": "👤",
                "sprite": "grave_husk.png",
                "baseAttack": 128
            }
        ]
    },
    "sunken_grotto": {
        "name": "Sunken Grotto",
        "type": "dungeon",
        "averageLevel": 25,
        "description": "Underwater depths with aquatic monsters",
        "monsters": [
            {
                "name": "Coral Creeper",
                "level": 22,
                "hp": 1845,
                "def": 17,
                "exp": 1090,
                "gold": 461,
                "emoji": "🌊",
                "sprite": "coral_creeper.png",
                "baseAttack": 115
            },
            {
                "name": "Sea Jelly",
                "level": 25,
                "hp": 1828,
                "def": 19,
                "exp": 1305,
                "gold": 552,
                "emoji": "🎐",
                "sprite": "sea_jelly.png",
                "baseAttack": 128
            },
            {
                "name": "Marsh Croaker",
                "level": 28,
                "hp": 1811,
                "def": 21,
                "exp": 1525,
                "gold": 645,
                "emoji": "🐸",
                "sprite": "marsh_croaker.png",
                "baseAttack": 141
            }
        ]
    },
    "ashen_wastes": {
        "name": "Ashen Wastes",
        "type": "field",
        "averageLevel": 30,
        "description": "The most dangerous field - a burning wasteland of raiders",
        "monsters": [
            {
                "name": "Ashkin Raider",
                "level": 28,
                "hp": 1546,
                "def": 13,
                "exp": 1394,
                "gold": 627,
                "emoji": "👹",
                "sprite": "ashkin_raider.png",
                "baseAttack": 103
            },
            {
                "name": "Ashkin Stalker",
                "level": 30,
                "hp": 1541,
                "def": 14,
                "exp": 777,
                "gold": 350,
                "emoji": "🏹",
                "sprite": "ashkin_stalker.png",
                "baseAttack": 110
            },
            {
                "name": "Ashkin Warlord",
                "level": 32,
                "hp": 20515,
                "def": 38,
                "exp": 5649,
                "gold": 2260,
                "emoji": "👑",
                "sprite": "ashkin_warlord.png",
                "isBoss": true,
                "baseAttack": 203
            }
        ]
    },
    "ironfang_warrens": {
        "name": "Ironfang Warrens",
        "type": "dungeon",
        "averageLevel": 35,
        "description": "Underground fortress of the orc tribes",
        "monsters": [
            {
                "name": "Orc Warrior",
                "level": 32,
                "hp": 3494,
                "def": 24,
                "exp": 927,
                "gold": 392,
                "emoji": "⚔️",
                "sprite": "orc_warrior.png",
                "baseAttack": 159
            },
            {
                "name": "Orc Shaman",
                "level": 35,
                "hp": 3477,
                "def": 26,
                "exp": 1043,
                "gold": 441,
                "emoji": "🔮",
                "sprite": "orc_shaman.png",
                "baseAttack": 172
            },
            {
                "name": "Orc Champion",
                "level": 38,
                "hp": 23485,
                "def": 46,
                "exp": 5894,
                "gold": 1814,
                "emoji": "🦾",
                "sprite": "orc_champion.png",
                "isBoss": true,
                "baseAttack": 234
            },
            {
                "name": "Orc Overlord",
                "level": 40,
                "hp": 23375,
                "def": 48,
                "exp": 6294,
                "gold": 1937,
                "emoji": "👑",
                "sprite": "orc_overlord.png",
                "isBoss": true,
                "baseAttack": 244
            }
        ]
    },
    "dune_tombs": {
        "name": "Dune Tombs",
        "type": "dungeon",
        "averageLevel": 45,
        "description": "Ancient tombs with powerful guardians",
        "monsters": [
            {
                "name": "Mummy",
                "level": 40,
                "hp": 4480,
                "def": 30,
                "exp": 1239,
                "gold": 524,
                "emoji": "🧻",
                "sprite": "mummy.png",
                "baseAttack": 194
            },
            {
                "name": "Tomb Scarab",
                "level": 45,
                "hp": 4446,
                "def": 34,
                "exp": 1438,
                "gold": 608,
                "emoji": "🦂",
                "sprite": "tomb_scarab.png",
                "baseAttack": 216
            },
            {
                "name": "Ancient Mummy",
                "level": 50,
                "hp": 4412,
                "def": 38,
                "exp": 1331,
                "gold": 563,
                "emoji": "⚰️",
                "sprite": "ancient_mummy.png",
                "baseAttack": 238
            }
        ]
    },
    "crystal_depths": {
        "name": "Crystal Depths",
        "type": "dungeon",
        "averageLevel": 70,
        "description": "Deep magical caverns beneath the arcane city",
        "isAdvanced": true,
        "monsters": [
            {
                "name": "Gloom Mare",
                "level": 69,
                "hp": 23528,
                "def": 52,
                "exp": 1183,
                "gold": 313,
                "emoji": "🐴",
                "sprite": "gloom_mare.png",
                "baseAttack": 322
            },
            {
                "name": "Cave Imp",
                "level": 64,
                "hp": 23562,
                "def": 48,
                "exp": 1084,
                "gold": 287,
                "emoji": "😈",
                "sprite": "cave_imp.png",
                "baseAttack": 300
            },
            {
                "name": "Mirror Fiend",
                "level": 77,
                "hp": 155430,
                "def": 92,
                "exp": 4064,
                "gold": 782,
                "emoji": "👤",
                "sprite": "mirror_fiend.png",
                "isBoss": true,
                "baseAttack": 433
            }
        ]
    },
    "ruined_citadel": {
        "name": "Ruined Citadel",
        "type": "dungeon",
        "averageLevel": 85,
        "description": "Cursed castle of the undead knights",
        "isAdvanced": true,
        "monsters": [
            {
                "name": "Phantom Knight",
                "level": 82,
                "hp": 28322,
                "def": 62,
                "exp": 859,
                "gold": 227,
                "emoji": "⚔️",
                "sprite": "phantom_knight.png",
                "baseAttack": 379
            },
            {
                "name": "Bone Sentinel",
                "level": 90,
                "hp": 28271,
                "def": 68,
                "exp": 953,
                "gold": 252,
                "emoji": "🦴",
                "sprite": "bone_sentinel.png",
                "baseAttack": 414
            },
            {
                "name": "Shadow Tyrant",
                "level": 96,
                "hp": 187220,
                "def": 115,
                "exp": 5200,
                "gold": 1000,
                "emoji": "👹",
                "sprite": "shadow_tyrant.png",
                "isBoss": true,
                "baseAttack": 530
            }
        ]
    },
    "cinderdeep": {
        "name": "Cinderdeep Volcano",
        "type": "dungeon",
        "averageLevel": 110,
        "description": "Fiery depths of the ancient volcano",
        "isAdvanced": true,
        "monsters": [
            {
                "name": "Cinder Fiend",
                "level": 108,
                "hp": 36652,
                "def": 81,
                "exp": 1164,
                "gold": 308,
                "emoji": "🔥",
                "sprite": "cinder_fiend.png",
                "baseAttack": 493
            },
            {
                "name": "Salamander",
                "level": 115,
                "hp": 36610,
                "def": 86,
                "exp": 1246,
                "gold": 329,
                "emoji": "🦎",
                "sprite": "salamander.png",
                "baseAttack": 524
            },
            {
                "name": "Magma Titan",
                "level": 120,
                "hp": 239085,
                "def": 144,
                "exp": 6622,
                "gold": 1273,
                "emoji": "🌋",
                "sprite": "magma_titan.png",
                "isBoss": true,
                "baseAttack": 652
            }
        ]
    },
    "forsaken_isle": {
        "name": "Forsaken Isle",
        "type": "dungeon",
        "averageLevel": 120,
        "description": "Mysterious island with the highest level threats",
        "isAdvanced": true,
        "monsters": [
            {
                "name": "Banshee",
                "level": 115,
                "hp": 40010,
                "def": 86,
                "exp": 1246,
                "gold": 329,
                "emoji": "👻",
                "sprite": "banshee.png",
                "baseAttack": 524
            },
            {
                "name": "Necromancer",
                "level": 120,
                "hp": 39976,
                "def": 90,
                "exp": 1304,
                "gold": 345,
                "emoji": "🧙",
                "sprite": "necromancer.png",
                "baseAttack": 546
            },
            {
                "name": "Heretic Highpriest",
                "level": 125,
                "hp": 260700,
                "def": 150,
                "exp": 6916,
                "gold": 1330,
                "emoji": "⛪",
                "sprite": "heretic_highpriest.png",
                "isBoss": true,
                "baseAttack": 678
            }
        ]
    },
    "boss_vargath": {
        "name": "Vargath's Lair",
        "type": "dungeon",
        "averageLevel": 120,
        "description": "The smouldering realm of the horned tyrant",
        "isMvpArea": true,
        "unlockRequirement": {
            "level": 100,
            "defeatedBosses": []
        },
        "monsters": [
            {
                "name": "Vargath",
                "level": 120,
                "hp": 1389300,
                "def": 162,
                "exp": 16389,
                "gold": 4202,
                "emoji": "👹",
                "sprite": "vargath.png",
                "isMvp": true,
                "mvpSkills": [
                    {
                        "name": "Doombrand",
                        "damage": 2.5,
                        "cooldown": 8000,
                        "description": "Devastating dark magic attack"
                    },
                    {
                        "name": "Summon Fiends",
                        "effect": "summon",
                        "cooldown": 15000,
                        "description": "Summons fiendish minions"
                    },
                    {
                        "name": "Shadow Bulwark",
                        "effect": "shield",
                        "cooldown": 12000,
                        "description": "Reduces incoming damage by 50%"
                    }
                ],
                "phases": [
                    {
                        "hpThreshold": 0.7,
                        "message": "Vargath roars with fury!",
                        "effect": "rage"
                    },
                    {
                        "hpThreshold": 0.3,
                        "message": "Vargath enters a burning frenzy!",
                        "effect": "frenzy"
                    }
                ],
                "baseAttack": 715
            }
        ]
    },
    "boss_neferok": {
        "name": "Tomb of Neferok",
        "type": "dungeon",
        "averageLevel": 140,
        "description": "Ancient tomb of the undying desert king",
        "isMvpArea": true,
        "unlockRequirement": {
            "level": 120,
            "defeatedBosses": [
                "Vargath"
            ]
        },
        "monsters": [
            {
                "name": "King Neferok",
                "level": 140,
                "hp": 1617000,
                "def": 189,
                "exp": 19288,
                "gold": 4946,
                "emoji": "🏺",
                "sprite": "king_neferok.png",
                "isMvp": true,
                "mvpSkills": [
                    {
                        "name": "Wrapping Curse",
                        "damage": 1.8,
                        "cooldown": 6000,
                        "description": "Cursed bandages drain life",
                        "effect": "poison"
                    },
                    {
                        "name": "Sandstorm",
                        "damage": 2.2,
                        "cooldown": 10000,
                        "description": "Blinding desert winds"
                    },
                    {
                        "name": "Deathless Rite",
                        "effect": "heal",
                        "cooldown": 20000,
                        "description": "Restores 25% HP once per battle"
                    }
                ],
                "phases": [
                    {
                        "hpThreshold": 0.6,
                        "message": "Ancient curses awaken!",
                        "effect": "curse"
                    },
                    {
                        "hpThreshold": 0.2,
                        "message": "Neferok calls upon the power of the afterlife!",
                        "effect": "desperation"
                    }
                ],
                "baseAttack": 825
            }
        ]
    },
    "boss_seraphel": {
        "name": "Spire of Seraphel",
        "type": "dungeon",
        "averageLevel": 160,
        "description": "The ultimate challenge - domain of the fallen seraph",
        "isMvpArea": true,
        "unlockRequirement": {
            "level": 150,
            "defeatedBosses": [
                "Vargath",
                "King Neferok"
            ]
        },
        "monsters": [
            {
                "name": "Seraphel",
                "level": 160,
                "hp": 1844700,
                "def": 216,
                "exp": 22156,
                "gold": 5681,
                "emoji": "😇",
                "sprite": "seraphel.png",
                "isMvp": true,
                "mvpSkills": [
                    {
                        "name": "Radiant Verdict",
                        "damage": 3,
                        "cooldown": 7000,
                        "description": "Holy light that pierces all defenses"
                    },
                    {
                        "name": "Soul Siphon",
                        "damage": 2,
                        "cooldown": 9000,
                        "description": "Steals MP and converts to damage",
                        "effect": "mpdrain"
                    },
                    {
                        "name": "Winged Grace",
                        "effect": "fullheal",
                        "cooldown": 25000,
                        "description": "Fully restores HP once per battle"
                    },
                    {
                        "name": "Final Reckoning",
                        "damage": 4,
                        "cooldown": 15000,
                        "description": "Ultimate attack when below 10% HP"
                    }
                ],
                "phases": [
                    {
                        "hpThreshold": 0.5,
                        "message": "Seraphel spreads her burning wings!",
                        "effect": "ascension"
                    },
                    {
                        "hpThreshold": 0.1,
                        "message": "The fallen seraph prepares her final reckoning!",
                        "effect": "judgment"
                    }
                ],
                "baseAttack": 935
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

    getProgressionOrder() {
        return AREA_PROGRESSION_ORDER
            .map(key => ({ key, ...MONSTERS[key] }))
            .filter(area => area.name);
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
