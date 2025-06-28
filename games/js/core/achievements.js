// achievements.js - Comprehensive Achievement System for Ragnarok Online Clicker

// Achievement Categories
const ACHIEVEMENT_CATEGORIES = {
    COMBAT: 'combat',
    EXPLORATION: 'exploration',
    PROGRESSION: 'progression',
    COLLECTION: 'collection',
    SPECIAL: 'special'
};

// Achievement Definitions
const ACHIEVEMENTS = {
    // === COMBAT ACHIEVEMENTS ===
    first_kill: {
        id: 'first_kill',
        name: 'First Blood',
        description: 'Defeat your first monster',
        category: ACHIEVEMENT_CATEGORIES.COMBAT,
        icon: '⚔️',
        requirement: { type: 'monsters_killed', value: 1 },
        reward: { gold: 100, exp: 50 }
    },
    monster_slayer: {
        id: 'monster_slayer',
        name: 'Monster Slayer',
        description: 'Defeat 100 monsters',
        category: ACHIEVEMENT_CATEGORIES.COMBAT,
        icon: '🗡️',
        requirement: { type: 'monsters_killed', value: 100 },
        reward: { gold: 1000, exp: 500 }
    },
    monster_hunter: {
        id: 'monster_hunter',
        name: 'Monster Hunter',
        description: 'Defeat 1,000 monsters',
        category: ACHIEVEMENT_CATEGORIES.COMBAT,
        icon: '🏹',
        requirement: { type: 'monsters_killed', value: 1000 },
        reward: { gold: 10000, exp: 5000 }
    },
    monster_legend: {
        id: 'monster_legend',
        name: 'Monster Legend',
        description: 'Defeat 10,000 monsters',
        category: ACHIEVEMENT_CATEGORIES.COMBAT,
        icon: '👑',
        requirement: { type: 'monsters_killed', value: 10000 },
        reward: { gold: 100000, exp: 50000 }
    },
    first_boss: {
        id: 'first_boss',
        name: 'Boss Slayer',
        description: 'Defeat your first boss monster',
        category: ACHIEVEMENT_CATEGORIES.COMBAT,
        icon: '💀',
        requirement: { type: 'bosses_killed', value: 1 },
        reward: { gold: 5000, exp: 2500 }
    },
    mvp_challenger: {
        id: 'mvp_challenger',
        name: 'MVP Challenger',
        description: 'Defeat your first MVP boss',
        category: ACHIEVEMENT_CATEGORIES.COMBAT,
        icon: '🏆',
        requirement: { type: 'mvps_killed', value: 1 },
        reward: { gold: 50000, exp: 25000 }
    },
    mvp_master: {
        id: 'mvp_master',
        name: 'MVP Master',
        description: 'Defeat all 3 MVP bosses',
        category: ACHIEVEMENT_CATEGORIES.COMBAT,
        icon: '👹',
        requirement: { type: 'unique_mvps_killed', value: 3 },
        reward: { gold: 200000, exp: 100000 }
    },

    // === EXPLORATION ACHIEVEMENTS ===
    first_steps: {
        id: 'first_steps',
        name: 'First Steps',
        description: 'Visit your first area',
        category: ACHIEVEMENT_CATEGORIES.EXPLORATION,
        icon: '🗺️',
        requirement: { type: 'areas_visited', value: 1 },
        reward: { gold: 200, exp: 100 }
    },
    explorer: {
        id: 'explorer',
        name: 'Explorer',
        description: 'Visit 5 different areas',
        category: ACHIEVEMENT_CATEGORIES.EXPLORATION,
        icon: '🧭',
        requirement: { type: 'areas_visited', value: 5 },
        reward: { gold: 2000, exp: 1000 }
    },
    world_traveler: {
        id: 'world_traveler',
        name: 'World Traveler',
        description: 'Visit 10 different areas',
        category: ACHIEVEMENT_CATEGORIES.EXPLORATION,
        icon: '🌍',
        requirement: { type: 'areas_visited', value: 10 },
        reward: { gold: 10000, exp: 5000 }
    },
    dungeon_delver: {
        id: 'dungeon_delver',
        name: 'Dungeon Delver',
        description: 'Visit 5 different dungeons',
        category: ACHIEVEMENT_CATEGORIES.EXPLORATION,
        icon: '🏰',
        requirement: { type: 'dungeons_visited', value: 5 },
        reward: { gold: 15000, exp: 7500 }
    },

    // === PROGRESSION ACHIEVEMENTS ===
    level_up: {
        id: 'level_up',
        name: 'Level Up!',
        description: 'Reach level 10',
        category: ACHIEVEMENT_CATEGORIES.PROGRESSION,
        icon: '📈',
        requirement: { type: 'level', value: 10 },
        reward: { gold: 1000, exp: 0 }
    },
    veteran: {
        id: 'veteran',
        name: 'Veteran',
        description: 'Reach level 50',
        category: ACHIEVEMENT_CATEGORIES.PROGRESSION,
        icon: '⭐',
        requirement: { type: 'level', value: 50 },
        reward: { gold: 25000, exp: 0 }
    },
    master: {
        id: 'master',
        name: 'Master',
        description: 'Reach level 100',
        category: ACHIEVEMENT_CATEGORIES.PROGRESSION,
        icon: '🌟',
        requirement: { type: 'level', value: 100 },
        reward: { gold: 100000, exp: 0 }
    },
    dragon_knight: {
        id: 'dragon_knight',
        name: 'Dragon Knight',
        description: 'Become a Dragon Knight through rebirth',
        category: ACHIEVEMENT_CATEGORIES.PROGRESSION,
        icon: '🐉',
        requirement: { type: 'is_dragon_knight', value: true },
        reward: { gold: 200000, exp: 0 }
    },
    skill_learner: {
        id: 'skill_learner',
        name: 'Skill Learner',
        description: 'Learn 5 different skills',
        category: ACHIEVEMENT_CATEGORIES.PROGRESSION,
        icon: '📚',
        requirement: { type: 'skills_learned', value: 5 },
        reward: { gold: 5000, exp: 2500 }
    },

    // === COLLECTION ACHIEVEMENTS ===
    first_equipment: {
        id: 'first_equipment',
        name: 'First Equipment',
        description: 'Equip your first item',
        category: ACHIEVEMENT_CATEGORIES.COLLECTION,
        icon: '⚔️',
        requirement: { type: 'items_equipped', value: 1 },
        reward: { gold: 500, exp: 250 }
    },
    collector: {
        id: 'collector',
        name: 'Collector',
        description: 'Collect 100 items',
        category: ACHIEVEMENT_CATEGORIES.COLLECTION,
        icon: '📦',
        requirement: { type: 'items_collected', value: 100 },
        reward: { gold: 5000, exp: 2500 }
    },
    hoarder: {
        id: 'hoarder',
        name: 'Hoarder',
        description: 'Collect 1,000 items',
        category: ACHIEVEMENT_CATEGORIES.COLLECTION,
        icon: '🏪',
        requirement: { type: 'items_collected', value: 1000 },
        reward: { gold: 50000, exp: 25000 }
    },
    rare_collector: {
        id: 'rare_collector',
        name: 'Rare Collector',
        description: 'Collect 10 epic or higher rarity items',
        category: ACHIEVEMENT_CATEGORIES.COLLECTION,
        icon: '💎',
        requirement: { type: 'rare_items_collected', value: 10 },
        reward: { gold: 25000, exp: 12500 }
    },
    upgrade_master: {
        id: 'upgrade_master',
        name: 'Upgrade Master',
        description: 'Successfully upgrade an item to +10',
        category: ACHIEVEMENT_CATEGORIES.COLLECTION,
        icon: '⚡',
        requirement: { type: 'max_upgrade_level', value: 10 },
        reward: { gold: 50000, exp: 25000 }
    },

    // === SPECIAL ACHIEVEMENTS ===
    gold_digger: {
        id: 'gold_digger',
        name: 'Gold Digger',
        description: 'Accumulate 1,000,000 gold',
        category: ACHIEVEMENT_CATEGORIES.SPECIAL,
        icon: '💰',
        requirement: { type: 'total_gold_earned', value: 1000000 },
        reward: { gold: 100000, exp: 50000 }
    },
    death_defier: {
        id: 'death_defier',
        name: 'Death Defier',
        description: 'Die 100 times (persistence pays off!)',
        category: ACHIEVEMENT_CATEGORIES.SPECIAL,
        icon: '💀',
        requirement: { type: 'deaths', value: 100 },
        reward: { gold: 10000, exp: 5000 }
    },
    potion_addict: {
        id: 'potion_addict',
        name: 'Potion Addict',
        description: 'Use 1,000 potions',
        category: ACHIEVEMENT_CATEGORIES.SPECIAL,
        icon: '🧪',
        requirement: { type: 'potions_used', value: 1000 },
        reward: { gold: 15000, exp: 7500 }
    },
    speed_runner: {
        id: 'speed_runner',
        name: 'Speed Runner',
        description: 'Reach level 50 in under 2 hours of playtime',
        category: ACHIEVEMENT_CATEGORIES.SPECIAL,
        icon: '⚡',
        requirement: { type: 'speed_level_50', value: 7200 }, // 2 hours in seconds
        reward: { gold: 100000, exp: 50000 }
    }
};

class AchievementManager {
    constructor() {
        this.unlockedAchievements = new Set();
        this.achievementProgress = new Map();
        this.statistics = this.initializeStatistics();
        this.loadFromStorage();
    }

    initializeStatistics() {
        return {
            monsters_killed: 0,
            bosses_killed: 0,
            mvps_killed: 0,
            unique_mvps_killed: new Set(),
            areas_visited: new Set(),
            dungeons_visited: new Set(),
            level: 1,
            is_dragon_knight: false,
            skills_learned: 0,
            items_equipped: 0,
            items_collected: 0,
            rare_items_collected: 0,
            max_upgrade_level: 0,
            total_gold_earned: 0,
            deaths: 0,
            potions_used: 0,
            playtime_start: Date.now(),
            level_50_time: null
        };
    }

    loadFromStorage() {
        const saved = localStorage.getItem('ragnarok_achievements');
        if (saved) {
            const data = JSON.parse(saved);
            this.unlockedAchievements = new Set(data.unlocked || []);
            this.achievementProgress = new Map(data.progress || []);
            
            // Load statistics with proper Set handling
            this.statistics = { ...this.initializeStatistics(), ...data.statistics };
            if (data.statistics.unique_mvps_killed) {
                this.statistics.unique_mvps_killed = new Set(data.statistics.unique_mvps_killed);
            }
            if (data.statistics.areas_visited) {
                this.statistics.areas_visited = new Set(data.statistics.areas_visited);
            }
            if (data.statistics.dungeons_visited) {
                this.statistics.dungeons_visited = new Set(data.statistics.dungeons_visited);
            }
        }
    }

    saveToStorage() {
        const data = {
            unlocked: Array.from(this.unlockedAchievements),
            progress: Array.from(this.achievementProgress),
            statistics: {
                ...this.statistics,
                unique_mvps_killed: Array.from(this.statistics.unique_mvps_killed),
                areas_visited: Array.from(this.statistics.areas_visited),
                dungeons_visited: Array.from(this.statistics.dungeons_visited)
            }
        };
        localStorage.setItem('ragnarok_achievements', JSON.stringify(data));
    }

    // Update statistics and check for achievements
    updateStatistic(statName, value, isIncrement = true) {
        if (isIncrement) {
            if (typeof this.statistics[statName] === 'number') {
                this.statistics[statName] += value;
            } else if (this.statistics[statName] instanceof Set) {
                this.statistics[statName].add(value);
            }
        } else {
            this.statistics[statName] = value;
        }

        // Check for newly unlocked achievements
        this.checkAchievements();
        this.saveToStorage();
    }

    // Check all achievements for completion
    checkAchievements() {
        Object.values(ACHIEVEMENTS).forEach(achievement => {
            if (!this.unlockedAchievements.has(achievement.id)) {
                if (this.isAchievementCompleted(achievement)) {
                    this.unlockAchievement(achievement);
                }
            }
        });
    }

    // Check if a specific achievement is completed
    isAchievementCompleted(achievement) {
        const req = achievement.requirement;
        const stat = this.statistics[req.type];

        switch (req.type) {
            case 'unique_mvps_killed':
            case 'areas_visited':
            case 'dungeons_visited':
                return stat instanceof Set ? stat.size >= req.value : false;
            case 'is_dragon_knight':
                return stat === req.value;
            case 'speed_level_50':
                return this.statistics.level >= 50 &&
                       this.statistics.level_50_time &&
                       (this.statistics.level_50_time - this.statistics.playtime_start) <= req.value;
            default:
                return typeof stat === 'number' ? stat >= req.value : false;
        }
    }

    // Unlock an achievement and grant rewards
    unlockAchievement(achievement) {
        this.unlockedAchievements.add(achievement.id);

        // Grant rewards
        if (achievement.reward.gold && Game.player) {
            Game.player.gainGold(achievement.reward.gold);
        }
        if (achievement.reward.exp && Game.player) {
            Game.player.gainExp(achievement.reward.exp);
        }

        // Show notification
        if (Game.ui) {
            Game.ui.showLootNotification(
                `🏆 ACHIEVEMENT UNLOCKED: ${achievement.name}! 🏆`,
                5000
            );
        }

        console.log(`🏆 Achievement unlocked: ${achievement.name}`);
        this.saveToStorage();
    }

    // Get achievement progress for UI
    getAchievementProgress(achievementId) {
        const achievement = ACHIEVEMENTS[achievementId];
        if (!achievement) return 0;

        const req = achievement.requirement;
        const stat = this.statistics[req.type];

        switch (req.type) {
            case 'unique_mvps_killed':
            case 'areas_visited':
            case 'dungeons_visited':
                return stat instanceof Set ? stat.size : 0;
            case 'is_dragon_knight':
                return stat ? 1 : 0;
            case 'speed_level_50':
                return this.statistics.level >= 50 ? 1 : 0;
            default:
                return typeof stat === 'number' ? stat : 0;
        }
    }

    // Get achievements by category
    getAchievementsByCategory(category) {
        return Object.values(ACHIEVEMENTS).filter(a => a.category === category);
    }

    // Get completion percentage
    getCompletionPercentage() {
        const total = Object.keys(ACHIEVEMENTS).length;
        const completed = this.unlockedAchievements.size;
        return Math.floor((completed / total) * 100);
    }

    // Event handlers for game events
    onMonsterKilled(monster) {
        this.updateStatistic('monsters_killed', 1);

        if (monster.isBoss) {
            this.updateStatistic('bosses_killed', 1);
        }

        if (monster.isMvp) {
            this.updateStatistic('mvps_killed', 1);
            this.updateStatistic('unique_mvps_killed', monster.name);
        }
    }

    onAreaVisited(location) {
        this.updateStatistic('areas_visited', location);

        if (MonsterUtils.isDungeon(location)) {
            this.updateStatistic('dungeons_visited', location);
        }
    }

    onLevelUp(newLevel) {
        this.updateStatistic('level', newLevel, false);

        // Track speed run achievement
        if (newLevel === 50 && !this.statistics.level_50_time) {
            this.statistics.level_50_time = Date.now();
        }
    }

    onDragonKnightRebirth() {
        this.updateStatistic('is_dragon_knight', true, false);
    }

    onSkillLearned() {
        this.updateStatistic('skills_learned', 1);
    }

    onItemEquipped() {
        this.updateStatistic('items_equipped', 1);
    }

    onItemCollected(item) {
        this.updateStatistic('items_collected', 1);

        if (['epic', 'legendary', 'mythic'].includes(item.rarity)) {
            this.updateStatistic('rare_items_collected', 1);
        }
    }

    onItemUpgraded(upgradeLevel) {
        if (upgradeLevel > this.statistics.max_upgrade_level) {
            this.updateStatistic('max_upgrade_level', upgradeLevel, false);
        }
    }

    onGoldEarned(amount) {
        this.updateStatistic('total_gold_earned', amount);
    }

    onPlayerDeath() {
        this.updateStatistic('deaths', 1);
    }

    onPotionUsed() {
        this.updateStatistic('potions_used', 1);
    }
}
