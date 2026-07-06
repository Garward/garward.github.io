// player.js - Player state and management
class Player {
    constructor() {
        this.state = {
            name: "",
            class: "Swordsman",
            level: 1,
            hp: 150,
            maxHp: 150,
            mp: 50,
            maxMp: 50,
            atk: 25,
            def: 0,
            exp: 0,
            maxExp: typeof GloamFormula !== 'undefined' ? GloamFormula.maxExpForLevel(1) : 80,
            skillPoints: 0,
            critChance: 15, // Base 15% crit chance
            critDamage: 100, // Base 100% crit damage (2x total)
            gold: 100,
            equipped: {
                helmet: null,
                chestplate: null,
                leggings: null,
                boots: null,
                sword: null,
                shield: null,
                ring1: null,
                ring2: null,
                necklace: null
            },
            classId: "swordsman",
            classState: {},
            rebirthCount: 0,
            currentLocation: "verdant_meadow",
            isNewPlayer: true,
            currentSlot: 0,
            // Area unlocking system
            areaProgress: {}, // Track monsters defeated per area
            unlockedAreas: ["verdant_meadow"] // Start with first area unlocked
        };
    }

    // Getters for easy access
    get level() { return this.state.level; }
    get hp() { return this.state.hp; }
    get maxHp() { return this.state.maxHp; }
    get mp() { return this.state.mp; }
    get maxMp() { return this.state.maxMp; }
    get atk() { return this.state.atk; }
    get def() { return this.state.def; }
    get gold() { return this.state.gold; }
    get exp() { return this.state.exp; }
    get maxExp() { return this.state.maxExp; }
    get critChance() { return this.state.critChance; }
    get critDamage() { return this.state.critDamage; }
    get classId() { return this.state.classId || 'swordsman'; }
    get isDragonKnight() { return this.state.classId === 'dragon_knight'; }
    get isArchMage() { return this.state.classId === 'arch_mage'; }

    // Setters
    set hp(value) { 
        this.state.hp = Math.max(0, Math.min(this.state.maxHp, value)); 
    }
    set mp(value) {
        this.state.mp = Math.max(0, Math.min(this.state.maxMp, value));
    }
    set gold(value) { 
        this.state.gold = Math.max(0, value); 
    }

    takeDamage(damage) {
        // Defense is now calculated in combat.js, so just apply the damage directly
        this.hp -= damage;

        if (this.hp <= 0) {
            this.die();
        }

        return damage;
    }

    heal(amount) {
        const oldHp = this.hp;
        this.hp += amount;
        return this.hp - oldHp;
    }

    restoreMp(amount) {
        const oldMp = this.mp;
        this.mp += amount;
        return this.mp - oldMp;
    }

    canUseSkill(mpCost) {
        return this.mp >= mpCost;
    }

    useMp(amount) {
        if (this.mp >= amount) {
            this.mp -= amount;
            return true;
        }
        return false;
    }

    gainExp(amount) {
        let finalAmount = amount;
        let multiplier = 1;
        let accessoryBonus = 0;

        // Apply EXP multiplier from potions if active
        if (Game.skills && Game.skills.statusEffects.has('expBoost')) {
            const expBoostEffect = Game.skills.statusEffects.get('expBoost');
            multiplier = expBoostEffect.effects.expMultiplier || 1;
            finalAmount = Math.floor(amount * multiplier);
        }

        // Apply EXP gain bonus from accessories (percentage bonus)
        Object.values(this.state.equipped).forEach(item => {
            if (item && item.stats && item.stats.expGain) {
                accessoryBonus += item.stats.expGain;
            }
        });

        if (accessoryBonus > 0) {
            const accessoryBonusAmount = Math.floor(finalAmount * (accessoryBonus / 100));
            finalAmount += accessoryBonusAmount;
        }

        if (typeof GloamFormula !== 'undefined') {
            const rm = GloamFormula.rewardMultipliers({
                classId: this.state.classId,
                classState: this.state.classState,
                rebirthCount: this.state.rebirthCount
            });
            finalAmount = Math.floor(finalAmount * rm.expMult);
            multiplier *= rm.expMult;
        }

        this.state.exp += finalAmount;

        // Check for level ups
        while (this.state.exp >= this.state.maxExp) {
            this.levelUp();
        }

        // Return the multiplier info for combat notifications
        return {
            finalAmount,
            multiplier,
            wasMultiplied: multiplier > 1,
            accessoryBonus,
            hasAccessoryBonus: accessoryBonus > 0
        };
    }

    gainGold(amount) {
        let finalAmount = amount;
        if (typeof GloamFormula !== 'undefined') {
            finalAmount = Math.floor(amount * GloamFormula.rewardMultipliers({
                classId: this.state.classId,
                classState: this.state.classState,
                rebirthCount: this.state.rebirthCount
            }).goldMult);
        }

        this.state.gold += finalAmount;

        // Track achievement progress
        if (Game.achievements) {
            Game.achievements.onGoldEarned(finalAmount);
        }
    }

    levelUp() {
        this.state.exp -= this.state.maxExp;
        this.state.level++;
        
        this.state.maxExp = typeof GloamFormula !== 'undefined'
            ? GloamFormula.maxExpForLevel(this.state.level)
            : Math.round(80 * Math.pow(this.state.level, 1.9));
        this.state.skillPoints++;

        // Recalculate all stats including equipment bonuses
        // This ensures equipment stats scale properly with level
        this.calculateStats();

        // Full heal and MP restore after stat recalculation
        this.hp = this.state.maxHp;
        this.mp = this.state.maxMp;

        // Show level up message
        Game.ui.showMessage(`Level Up! You are now level ${this.state.level}!`);

        // Track achievement progress
        if (Game.achievements) {
            Game.achievements.onLevelUp(this.state.level);
        }

        // Force comprehensive UI refresh when gaining skill points and leveling up
        if (Game.ui && Game.ui.renderSkills) {
            setTimeout(() => {
                Game.ui.renderSkills();
                Game.ui.updateAll();
                Game.ui.updatePlayerDisplay(); // Ensure player stats display is updated

                // Also refresh equipment display in case any level requirements changed
                if (Game.equipment) {
                    Game.equipment.renderEquipment();
                    Game.equipment.renderInventory();
                }
            }, 100);
        }

        // Surface rebirth availability through the menu instead of an auto-popup.
        if (this.state.level >= 100 && !this.state.rebirthOfferShown) {
            this.state.rebirthOfferShown = true;
            if (Game.ui) {
                Game.ui.showMessage("Rebirth available in the Character menu.", 4000);
                if (Game.ui.updateRebirthPanel) Game.ui.updateRebirthPanel();
            }
        }

        this.checkMvpAreaUnlocks();

        return true;
    }

    die() {
        // Set respawning flag in combat system
        if (Game.combat) {
            Game.combat.handlePlayerDeath();
        }
        
        // Death penalty: lose 5% of current EXP and Gold
        const expLoss = Math.floor(this.state.exp * 0.05);
        const goldLoss = Math.floor(this.state.gold * 0.05);
        
        this.state.exp = Math.max(0, this.state.exp - expLoss);
        this.state.gold = Math.max(0, this.state.gold - goldLoss);

        // Track achievement progress
        if (Game.achievements) {
            Game.achievements.onPlayerDeath();
        }

        // Recalculate stats to ensure equipment bonuses are properly applied
        this.calculateStats();

        // Restore HP and MP to new max values
        this.hp = this.state.maxHp;
        this.mp = this.state.maxMp;

        // Update UI to reflect stat changes
        if (Game.ui) {
            Game.ui.updateHotbar();
            Game.ui.updatePlayerDisplay();
        }
        
        // Show death message with both penalties
        const lossMessage = goldLoss > 0 ? 
            `You died! Lost ${expLoss} EXP and ${goldLoss} Gold. Respawning...` :
            `You died! Lost ${expLoss} EXP. Respawning...`;
        Game.ui.showMessage(lossMessage, 3000);
        
        // Spawn new enemy after death
        setTimeout(() => {
            if (Game.combat) {
                Game.combat.spawnMonster();
            }
        }, 1000);
        
        return { expLoss, goldLoss };
    }

    rebirthToDragonKnight() {
        return this.performRebirth();
    }

    performRebirth() {
        if (this.state.level < 100 || typeof GloamFormula === 'undefined') return false;

        const currentClassId = this.state.classId || 'swordsman';
        const evolution = typeof ClassKit !== 'undefined' ? ClassKit.evolutionOf(currentClassId) : null;
        const nextClassId = evolution ? evolution.id : currentClassId;

        GloamFormula.applyRebirth(this.state, nextClassId);

        if (Game.skills) {
            Game.skills.statusEffects.clear();
            Game.skills.switchToClass(nextClassId);
        }

        this.calculateStats();
        this.hp = this.state.maxHp;
        this.mp = this.state.maxMp;

        if (Game.combat) {
            Game.combat.stopBattle();
            Game.combat.spawnMonster();
        }

        if (Game.ui) {
            const className = typeof ClassKit !== 'undefined' && ClassKit.get(nextClassId)
                ? ClassKit.get(nextClassId).name
                : nextClassId;
            const bonuses = GloamFormula.prestigeBonuses(this.state.rebirthCount);
            Game.ui.showMessage(`Reborn as ${className}! Prestige bonuses: ${Math.round((bonuses.damageMultiplier - 1) * 100)}% damage/EXP, ${Math.round((bonuses.goldMultiplier - 1) * 100)}% gold.`, 6000);
            Game.ui.updateAll();
            if (Game.ui.updateRebirthPanel) Game.ui.updateRebirthPanel();
        }

        this.saveToStorage();
        if (Game.characterManager) {
            Game.characterManager.saveCurrentCharacter();
        }

        return true;
    }

    showRebirthOption() {
        // This will be implemented when we add the rebirth button to UI
        console.log("Rebirth option available!");
    }

    calculateStats() {
        // Store current HP/MP percentages to maintain them after stat changes
        const hpPercent = this.state.maxHp > 0 ? this.state.hp / this.state.maxHp : 1;
        const mpPercent = this.state.maxMp > 0 ? this.state.mp / this.state.maxMp : 1;

        // Use modular class system if available
        if (typeof ClassManager !== 'undefined') {
            const classManager = new ClassManager();
            const currentClass = this.state.classId || "swordsman";

            const classStats = classManager.calculateClassStats(currentClass, this.state.level);

            if (classStats) {
                // Set base stats from class definition (RESET to base values)
                this.state.atk = classStats.atk;
                this.state.def = classStats.def;
                this.state.maxHp = classStats.hp;
                this.state.maxMp = classStats.mp;
                this.state.critChance = classStats.critChance ?? 15;
                this.state.critDamage = classStats.critDamage ?? 100;
            }
        } else {
            // Fallback to legacy system (RESET to base values)
            const baseAtk = this.isDragonKnight ? 50 : 25;
            const baseDef = this.isDragonKnight ? 10 : 0;
            this.state.atk = baseAtk + (this.state.level * 5);
            this.state.def = baseDef;
            this.state.maxHp = 150 + (this.state.level * 50);
            this.state.maxMp = 50 + (this.state.level * 25);
            this.state.critChance = 15;
            this.state.critDamage = 100;
        }

        // Reset critical hit stats to base values
        this.state.critChance = this.state.critChance ?? 15;
        this.state.critDamage = this.state.critDamage ?? 100;

        // Apply equipment bonuses
        Object.values(this.state.equipped).forEach(item => {
            if (item && item.stats) {
                if (item.stats.atk) this.state.atk += item.stats.atk;
                if (item.stats.def) this.state.def += item.stats.def;
                if (item.stats.maxHp) this.state.maxHp += item.stats.maxHp;
                if (item.stats.maxMp) this.state.maxMp += item.stats.maxMp;
                // Magic defense removed - convert mdef items to def
                if (item.stats.mdef) this.state.def += item.stats.mdef;

                // Apply percentage-based accessory bonuses
                if (item.stats.atkPercent) {
                    this.state.atk = Math.floor(this.state.atk * (1 + item.stats.atkPercent / 100));
                }

                // Apply critical hit bonuses from accessories
                if (item.stats.critChance) {
                    this.state.critChance += item.stats.critChance;
                }
                if (item.stats.critDamage) {
                    this.state.critDamage += item.stats.critDamage;
                }
            }
        });

        // Apply skill bonuses
        if (Game.skills) {
            Game.skills.applyPassiveSkillBonuses(this);
        }

        // Restore HP/MP percentages after stat recalculation
        this.state.hp = Math.min(this.state.maxHp, Math.ceil(this.state.maxHp * hpPercent));
        this.state.mp = Math.min(this.state.maxMp, Math.ceil(this.state.maxMp * mpPercent));

        // Ensure minimum stat values (safety check)
        this.state.atk = Math.max(1, this.state.atk);
        this.state.def = Math.max(0, this.state.def);
        this.state.maxHp = Math.max(50, this.state.maxHp);
        this.state.maxMp = Math.max(10, this.state.maxMp);
        this.state.critChance = Math.max(0, Math.min(100, this.state.critChance));
        this.state.critDamage = Math.max(100, this.state.critDamage);

        // Force UI update to reflect stat changes
        if (Game.ui && Game.ui.updatePlayerDisplay) {
            setTimeout(() => Game.ui.updatePlayerDisplay(), 10);
        }
    }

    changeLocation(newLocation) {
        this.state.currentLocation = newLocation;
        this.hp = this.state.maxHp; // Full heal when changing zones
        this.mp = this.state.maxMp; // Full MP restore when changing zones
        Game.ui.showMessage("Entered new area - HP and MP restored!");
        if (Game.ui) {
            Game.ui.updateHotbar(); // Update skill highlighting when MP is restored
        }
    }

    // Area unlocking system methods
    trackMonsterDefeat(location) {
        // Initialize area progress if not exists
        if (!this.state.areaProgress[location]) {
            this.state.areaProgress[location] = 0;
        }

        this.state.areaProgress[location]++;

        // Check if we've defeated 20 monsters in this area
        if (this.state.areaProgress[location] >= 20) {
            this.checkForNewAreaUnlocks(location);
        }
    }

    checkForNewAreaUnlocks(completedArea) {
        const allAreas = this.getAllAreasInOrder();
        const currentIndex = allAreas.findIndex(area => area.key === completedArea);

        if (currentIndex !== -1 && currentIndex < allAreas.length - 1) {
            const nextArea = allAreas[currentIndex + 1];

            if (!this.state.unlockedAreas.includes(nextArea.key) && this.canAccessArea(nextArea.key)) {
                this.state.unlockedAreas.push(nextArea.key);
                Game.ui.showLootNotification(`🗺️ New area unlocked: ${nextArea.name}!`, 4000);

                // Update location selector
                if (Game.ui && Game.ui.updateLocationSelector) {
                    Game.ui.updateLocationSelector();
                }
            }
        }
    }

    getAllAreasInOrder() {
        if (MonsterUtils.getProgressionOrder) {
            return MonsterUtils.getProgressionOrder()
                .filter(area => !MonsterUtils.isMvpArea(area.key));
        }

        return MonsterUtils.getLocationList()
            .map(key => ({ key, ...MonsterUtils.getLocationData(key) }))
            .filter(area => !MonsterUtils.isMvpArea(area.key))
            .sort((a, b) => a.averageLevel - b.averageLevel);
    }

    checkMvpAreaUnlocks() {
        if (typeof MonsterUtils === 'undefined') return;

        let defeatedBosses = [];
        try {
            if (typeof localStorage !== 'undefined' && typeof SAVE_KEYS !== 'undefined') {
                defeatedBosses = JSON.parse(localStorage.getItem(SAVE_KEYS.defeatedMvps) || '[]');
            }
        } catch (error) {
            defeatedBosses = [];
        }

        const areas = MonsterUtils.getProgressionOrder
            ? MonsterUtils.getProgressionOrder()
            : MonsterUtils.getLocationList().map(key => ({ key, ...MonsterUtils.getLocationData(key) }));

        areas
            .filter(area => MonsterUtils.isMvpArea(area.key))
            .forEach(area => {
                if (this.state.unlockedAreas.includes(area.key)) return;
                if (!MonsterUtils.canAccessMvpArea(area.key, this.state.level, defeatedBosses)) return;

                this.state.unlockedAreas.push(area.key);
                if (typeof Game !== 'undefined' && Game.ui) {
                    Game.ui.showLootNotification(`🗺️ World boss unlocked: ${area.name}!`, 5000);
                }
            });
    }

    isAreaUnlocked(areaKey) {
        return this.state.unlockedAreas.includes(areaKey) && this.canAccessArea(areaKey);
    }

    hasEvolvedClass() {
        if (typeof ClassKit !== 'undefined') {
            const def = ClassKit.get(this.state.classId);
            if (def) return def.tier === 'evolved';
        }
        return this.state.classId === 'dragon_knight' || this.state.classId === 'arch_mage';
    }

    canAccessArea(areaKey) {
        const location = MonsterUtils.getLocationData(areaKey);
        if (!location) return false;

        if (MonsterUtils.isAdvancedArea(areaKey) &&
            ((this.state.rebirthCount || 0) < 1 || !this.hasEvolvedClass())) {
            return false;
        }

        if (MonsterUtils.isMvpArea(areaKey)) {
            let defeatedBosses = [];
            try {
                if (typeof localStorage !== 'undefined' && typeof SAVE_KEYS !== 'undefined') {
                    defeatedBosses = JSON.parse(localStorage.getItem(SAVE_KEYS.defeatedMvps) || '[]');
                }
            } catch (error) {
                defeatedBosses = [];
            }
            return MonsterUtils.canAccessMvpArea(areaKey, this.state.level, defeatedBosses);
        }

        return true;
    }

    getAreaProgress(areaKey) {
        return this.state.areaProgress[areaKey] || 0;
    }

    // UPDATED: Save/Load functionality now works with character manager only
    saveToStorage() {
        this.state.isNewPlayer = false;
        // Keep the old global storage for backwards compatibility of basic player data
        // But inventory/skills are now handled by character manager
        localStorage.setItem(SAVE_KEYS.player, JSON.stringify(this.state));
    }

    loadFromStorage() {
        // Check for existing character data first
        const saved = localStorage.getItem(SAVE_KEYS.player);
        if (saved) {
            const savedData = JSON.parse(saved);
            this.state = { ...this.state, ...savedData };
            
            // If this player has a current slot, try to load full character data
            if (this.state.currentSlot !== undefined && Game.characterManager) {
                const characterData = Game.characterManager.loadCharacter(this.state.currentSlot);
                if (characterData) {
                    console.log("🔄 Loading existing character from slot", this.state.currentSlot);
                    // Load the full character data instead of just basic player data
                    Game.characterManager.loadCharacterWithData(this.state.currentSlot);
                    return;
                }
            }
            
            this.calculateStats();
        }
    }

    // Character creation
    createCharacter(name, jobClass = "swordsman") {
        this.state.name = name || "Adventurer";
        this.state.class = jobClass.toLowerCase();
        this.state.classId = jobClass.toLowerCase();
        this.state.classState = typeof ClassKit !== 'undefined'
            ? ClassKit.createState(this.state.classId) : {};
        this.state.isNewPlayer = false;

        // Initialize class-specific stats
        this.initializeClassStats(jobClass.toLowerCase());

        // Set appropriate skills for the class
        if (Game.skills) {
            Game.skills.switchToClass(jobClass.toLowerCase());
        }

        // Save immediately to character slot
        this.saveToStorage();
        if (Game.characterManager) {
            Game.characterManager.saveCurrentCharacter();
        }
    }

    initializeClassStats(classId) {
        if (typeof ClassManager !== 'undefined') {
            const classManager = new ClassManager();
            const classStats = classManager.calculateClassStats(classId, 1);

            if (classStats) {
                this.state.hp = classStats.hp;
                this.state.maxHp = classStats.hp;
                this.state.mp = classStats.mp;
                this.state.maxMp = classStats.mp;
                this.state.atk = classStats.atk;
                this.state.def = classStats.def;
                // Magic defense removed - not implemented
            }
        }
    }

    // Get formatted stats for display
    getDisplayStats() {
        // Get proper class display name
        const getClassDisplayName = () => {
            if (typeof ClassKit !== 'undefined') {
                const def = ClassKit.get(this.state.classId);
                if (def) return def.name;
            }
            const id = this.state.classId || 'swordsman';
            return id.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        };

        return {
            name: this.state.name,
            class: getClassDisplayName(),
            level: this.state.level,
            hp: `${Math.ceil(this.state.hp)}/${this.state.maxHp}`,
            mp: `${Math.ceil(this.state.mp)}/${this.state.maxMp}`,
            atk: this.state.atk,
            def: this.state.def,
            critChance: this.state.critChance,
            critDamage: this.state.critDamage,
            gold: this.state.gold.toLocaleString(),
            exp: Math.floor(this.state.exp),
            maxExp: Math.floor(this.state.maxExp),
            expPercent: (this.state.exp / this.state.maxExp) * 100,
            mpPercent: (this.state.mp / this.state.maxMp) * 100,
            skillPoints: this.state.skillPoints
        };
    }
}
