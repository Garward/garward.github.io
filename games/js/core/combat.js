// combat.js - Enhanced combat mechanics with location-based difficulty and monster sprites
class Combat {
    constructor() {
        this.currentMonster = null;
        this.lastActivity = Date.now();
        this.isPaused = false;
        this.isRespawning = false;
        this.battleActive = false;
        this.battleInterval = null;
        this.autoBattleEnabled = false;
    }

    spawnMonster() {
        const location = Game.player.state.currentLocation;
        const playerLevel = Game.player.level;

        // Stop any active battle before spawning new monster
        this.stopBattle();

        // Clear respawning flag when new monster spawns
        this.isRespawning = false;

        // Generate new monster
        this.currentMonster = MonsterUtils.getRandomMonster(location, playerLevel);

        // Apply location-based adjustments
        this.applyLocationDifficulty(location);

        // Update UI immediately
        Game.ui.updateMonsterDisplay();

        // Update battle buttons to reflect new monster state
        if (Game.ui && Game.ui.enhancedCombatUI) {
            Game.ui.enhancedCombatUI.updateBattleButtons();
        }

        // If auto battle is enabled, start battle automatically after a short delay
        if (this.autoBattleEnabled) {
            setTimeout(() => {
                if (this.currentMonster && this.currentMonster.currentHp > 0) {
                    this.startBattle();
                }
            }, 150); // Slightly longer delay to ensure UI updates
        }

        return this.currentMonster;
    }

    // Apply location-based difficulty adjustments
    applyLocationDifficulty(location) {
        if (!this.currentMonster) return;

        const isField = MonsterUtils.isField(location);
        const isDungeon = MonsterUtils.isDungeon(location);
        const isMvpArea = MonsterUtils.isMvpArea(location);

        if (isField) {
            // Fields: Easier for auto-battle (slightly reduced HP/DEF for faster kills)
            this.currentMonster.maxHp = Math.floor(this.currentMonster.maxHp * 0.9);
            this.currentMonster.currentHp = this.currentMonster.maxHp;
            this.currentMonster.def = Math.floor(this.currentMonster.def * 0.8);

            // Special case for starting area - much lower attack for beginners
            if (location === 'prt_fild08') {
                this.currentMonster.baseAttack = this.currentMonster.level * 2 + 5; // Very low for beginners
            } else {
                // Other fields: Moderate attack increase
                this.currentMonster.baseAttack = this.currentMonster.level * 6 + 15; // Reduced from 8+20
            }
        } else if (isDungeon) {
            // Dungeons: Much harder to compensate for equipment upgrades
            this.currentMonster.maxHp = Math.floor(this.currentMonster.maxHp * 1.8); // Increased from 1.3
            this.currentMonster.currentHp = this.currentMonster.maxHp;
            this.currentMonster.def = Math.floor(this.currentMonster.def * 1.5); // Increased from 1.2

            // Much higher attack for dungeons to compensate for upgrades
            this.currentMonster.baseAttack = this.currentMonster.level * 15 + 50; // Increased from 12+35

            // Apply dungeon reward multiplier
            const difficultyMultiplier = MonsterUtils.getDifficultyMultiplier(location);
            this.currentMonster.exp = Math.floor(this.currentMonster.exp * difficultyMultiplier);
            this.currentMonster.gold = Math.floor(this.currentMonster.gold * difficultyMultiplier);
        }

        // MVP areas: Extreme difficulty scaling
        if (isMvpArea && this.currentMonster.isMvp) {
            // MVP bosses are significantly harder
            this.currentMonster.maxHp = Math.floor(this.currentMonster.maxHp * 1.2); // Additional HP boost
            this.currentMonster.currentHp = this.currentMonster.maxHp;
            this.currentMonster.def = Math.floor(this.currentMonster.def * 1.3); // Additional defense
            this.currentMonster.baseAttack = Math.floor(this.currentMonster.baseAttack * 1.5); // Much higher attack

            // Initialize MVP-specific properties
            this.currentMonster.mvpSkillCooldowns = {};
            this.currentMonster.usedPhases = new Set();
            this.currentMonster.hasUsedResurrection = false;
            this.currentMonster.hasUsedFullHeal = false;
        }
    }

    // Track MVP defeats for unlocking other MVP areas
    trackMvpDefeat(mvpName) {
        let defeatedMvps = JSON.parse(localStorage.getItem('ragnarok_defeated_mvps') || '[]');
        if (!defeatedMvps.includes(mvpName)) {
            defeatedMvps.push(mvpName);
            localStorage.setItem('ragnarok_defeated_mvps', JSON.stringify(defeatedMvps));

            // Check if this unlocks new MVP areas
            this.checkMvpAreaUnlocks(defeatedMvps);
        }
    }

    // Check if defeating this MVP unlocks new areas
    checkMvpAreaUnlocks(defeatedMvps) {
        const playerLevel = Game.player.level;
        const mvpAreas = ['mvp_baphomet', 'mvp_osiris', 'mvp_thanatos'];

        mvpAreas.forEach(area => {
            if (!Game.player.state.unlockedAreas.includes(area)) {
                if (MonsterUtils.canAccessMvpArea(area, playerLevel, defeatedMvps)) {
                    Game.player.state.unlockedAreas.push(area);
                    const areaName = MonsterUtils.getLocationDisplayName(area);
                    Game.ui.showLootNotification(`🗺️ NEW MVP AREA UNLOCKED: ${areaName}!`, 5000);
                }
            }
        });
    }

    attackMonster(skillUsed = null) {
        // Block attacks during respawn timer
        if (this.isRespawning) {
            return;
        }

        // Block attacks if battle is not active (unless it's from the battle loop itself)
        if (!this.battleActive && !skillUsed) {
            Game.ui.showMessage("Start battle first to attack!");
            return;
        }

        if (!this.currentMonster || this.currentMonster.currentHp <= 0) return;
        if (Game.player.hp <= 0) {
            Game.ui.showMessage("You are dead! Wait for respawn...");
            return;
        }

        this.lastActivity = Date.now();
        this.isPaused = false;

        let damage = Game.player.atk;
        let isCrit = false;

        // Get status effect bonuses from skills
        const statusBonuses = Game.skills.getActiveStatusEffects();
        damage *= statusBonuses.atkMultiplier;

        // Apply skill effects if skill was used
        if (skillUsed) {
            damage *= skillUsed.damageMultiplier + (skillUsed.currentLevel * 0.1);
            if (skillUsed.critBonus && Math.random() < (skillUsed.critBonus / 100)) {
                damage *= 2;
                isCrit = true;
            }

            // Apply skill damage bonus from accessories (only for skills, not basic attacks)
            let skillDamageBonus = 0;
            Object.values(Game.player.state.equipped).forEach(item => {
                if (item && item.stats && item.stats.skillDamage) {
                    skillDamageBonus += item.stats.skillDamage;
                }
            });

            if (skillDamageBonus > 0) {
                damage *= (1 + skillDamageBonus / 100);
            }
        }

        // Check for critical hit (base 15% + accessories)
        if (!isCrit && Math.random() < (Game.player.critChance / 100)) {
            // Critical hit! Apply crit damage multiplier
            const critMultiplier = 1 + (Game.player.critDamage / 100);
            damage *= critMultiplier;
            isCrit = true;
        }

        // Apply status damage bonus (like Magnum Break buff)
        damage *= (1 + statusBonuses.damageBonus);
        
        // Calculate defense reduction
        const defense = this.currentMonster.def;
        damage = Math.max(1, damage - defense);
        
        // Random variance (±10%)
        damage = Math.floor(damage * (0.9 + Math.random() * 0.2));
        
        // Deal damage to monster
        this.currentMonster.currentHp -= damage;
        
        // Show damage number
        this.showDamageNumber(damage, isCrit);
        
        // Animate monster hit
        this.animateMonsterHit();
        
        // Check if monster died from this attack
        if (this.currentMonster.currentHp <= 0) {
            // Monster died, handle defeat immediately
            this.defeatMonster();
            return; // Exit early to prevent monster counter-attack
        }

        // Monster is still alive, it attacks back (unless AOE skill)
        if (!skillUsed || !skillUsed.isAoe) {
            this.monsterAttackPlayer();
        }
        
        Game.ui.updateMonsterDisplay();
        Game.ui.updatePlayerDisplay();
    }

    monsterAttackPlayer() {
        // Block monster attacks during respawn timer
        if (this.isRespawning) {
            return;
        }
        
        // Use the base attack value set by location difficulty
        let monsterDamage = this.currentMonster.baseAttack || (this.currentMonster.level * 8 + 20); // Increased base damage

        // Boss monsters hit much harder
        if (this.currentMonster.isBoss) {
            monsterDamage *= 2.5; // Increased from 1.5x for more challenge
        }

        // Get status effect bonuses from skills
        const statusBonuses = Game.skills.getActiveStatusEffects();

        // Apply player defense with status bonuses - defense is more effective now
        const totalDefense = (Game.player.def + statusBonuses.defenseBonus) * statusBonuses.defMultiplier;

        // Improved defense calculation: defense reduces damage by a percentage + flat amount
        // This prevents easy 1-damage scenarios while making defense meaningful
        const defenseReduction = Math.min(0.8, totalDefense * 0.02); // Max 80% reduction, 2% per defense point
        const flatReduction = totalDefense * 0.5; // Flat reduction

        let reducedDamage = Math.floor(monsterDamage * (1 - defenseReduction)) - flatReduction;

        // Apply skill-based damage reduction (like Energy Coat) - stacks with DEF
        const skillDamageReduction = this.getSkillDamageReduction();
        if (skillDamageReduction > 0) {
            reducedDamage = Math.floor(reducedDamage * (1 - skillDamageReduction));
        }

        const actualDamage = Math.max(Math.floor(monsterDamage * 0.1), reducedDamage); // Minimum 10% of original damage

        Game.player.takeDamage(actualDamage);
        
        // Show damage on player
        this.showPlayerDamage(actualDamage);
        
        Game.ui.updatePlayerDisplay();
    }

    defeatMonster() {
        if (!this.currentMonster) return;

        // Immediately stop battle to prevent race conditions
        this.stopBattle();

        const currentLocation = Game.player.state.currentLocation;
        const isDungeon = MonsterUtils.isDungeon(currentLocation);

        // Calculate rewards with location bonuses
        let goldGained = this.currentMonster.gold + Math.floor(Math.random() * this.currentMonster.level * 2);
        let expGained = this.currentMonster.exp;

        // Dungeon bonus rewards
        if (isDungeon) {
            goldGained = Math.floor(goldGained * 1.3); // 30% more gold in dungeons
            expGained = Math.floor(expGained * 1.2);   // 20% more exp in dungeons
        }

        // Boss bonus rewards
        if (this.currentMonster.isBoss) {
            goldGained = Math.floor(goldGained * 2);
            expGained = Math.floor(expGained * 1.5);
        }

        // MVP Boss bonus rewards (even higher than regular bosses)
        if (this.currentMonster.isMvp) {
            goldGained = Math.floor(goldGained * 3);
            expGained = Math.floor(expGained * 2.5);
        }

        // Grant rewards
        Game.player.gainGold(goldGained);
        const expResult = Game.player.gainExp(expGained);

        // Track monster defeat for area unlocking
        Game.player.trackMonsterDefeat(currentLocation);

        // Check for item drops
        Game.equipment.checkItemDrop(this.currentMonster);

        // Track achievement progress
        if (Game.achievements) {
            Game.achievements.onMonsterKilled(this.currentMonster);
        }

        // MVP Boss special drops
        if (this.currentMonster.isMvp) {
            // Track MVP defeat for unlocking other MVP areas
            this.trackMvpDefeat(this.currentMonster.name);

            // Check for MVP EXP potion drops
            if (typeof handleMvpExpPotionDrop === 'function') {
                handleMvpExpPotionDrop(this.currentMonster.name);
            }

            // Check for MVP accessory drops
            if (typeof handleMvpAccessoryDrop === 'function') {
                handleMvpAccessoryDrop(this.currentMonster.name);
            }

            // Special MVP defeat notification
            Game.ui.showLootNotification(`🏆 MVP DEFEATED: ${this.currentMonster.name}! 🏆`, 5000);
        }

        // Location-based healing
        if (MonsterUtils.isField(currentLocation)) {
            // Fields: Full heal for auto-battle friendliness
            Game.player.hp = Game.player.maxHp;
        } else if (isDungeon) {
            // Dungeons: No auto-heal (more challenging)
            // Players must manage their HP/MP in dungeons
        }

        // Enhanced loot notification with EXP multiplier and accessory bonus
        let notification = `+${goldGained} Gold, +${expResult.finalAmount} EXP`;

        // Add bonus info in order of priority
        if (expResult.wasMultiplied && expResult.hasAccessoryBonus) {
            notification += ` (${expResult.multiplier}x boost + ${expResult.accessoryBonus}% gear!)`;
        } else if (expResult.wasMultiplied) {
            notification += ` (${expResult.multiplier}x boost!)`;
        } else if (expResult.hasAccessoryBonus) {
            notification += ` (+${expResult.accessoryBonus}% from gear!)`;
        } else if (isDungeon) {
            notification += ` (Dungeon Bonus!)`;
        }

        Game.ui.showLootNotification(notification);
        
        // Spawn new monster after delay (faster in fields)
        const spawnDelay = MonsterUtils.isField(currentLocation) ? 300 : 500;
        setTimeout(() => {
            this.spawnMonsterWithAutoBattle();
        }, spawnDelay);
        
        Game.ui.updatePlayerDisplay();
    }

    flee() {
        // Block flee during respawn timer
        if (this.isRespawning) {
            return;
        }
        
        if (!this.currentMonster) return;
        
        const currentLocation = Game.player.state.currentLocation;
        const isField = MonsterUtils.isField(currentLocation);
        
        // Calculate flee success rate based on level difference and location
        const levelDiff = Game.player.level - this.currentMonster.level;
        let fleeChance = 0.5 + (levelDiff * 0.1); // Base 50% + 10% per level difference
        
        // Fields are easier to flee from
        if (isField) {
            fleeChance += 0.2; // +20% flee chance in fields
        }
        
        // Clamp between 10% and 95%
        fleeChance = Math.max(0.1, Math.min(0.95, fleeChance));
        
        if (Math.random() < fleeChance) {
            // Successful flee
            Game.ui.showMessage("You successfully fled from battle!", 2000);
            
            // Fields: Full heal on flee, Dungeons: partial heal
            if (isField) {
                Game.player.hp = Game.player.maxHp;
            } else {
                Game.player.heal(Math.floor(Game.player.maxHp * 0.3)); // 30% heal in dungeons
            }
            
            setTimeout(() => {
                this.spawnMonsterWithAutoBattle();
            }, 1000);
            
            Game.ui.updatePlayerDisplay();
        } else {
            // Failed flee - monster gets a free attack
            Game.ui.showMessage("Failed to flee! The monster attacks!", 2000);
            this.monsterAttackPlayer();
        }
    }

    // In combat.js, update your changeLocation method to include this at the end:

    changeLocation() {
    const locationSelect = document.getElementById('location-select');
    if (!locationSelect) return;
    
    const newLocation = locationSelect.value;
    const oldLocation = Game.player.state.currentLocation;
    
    // Check if area is unlocked
    if (!Game.player.isAreaUnlocked(newLocation)) {
        Game.ui.showMessage("This area is locked! Defeat 20 monsters in the previous area to unlock it.");
        locationSelect.value = oldLocation; // Reset selection
        return;
    }
    
    Game.player.changeLocation(newLocation);
    
    // Show location change notification with info
    const locationData = MonsterUtils.getLocationData ? MonsterUtils.getLocationData(newLocation) : { name: newLocation, type: 'field', averageLevel: 1 };
    const locationType = locationData.type === 'field' ? 'Field' : 'Dungeon';
    Game.ui.showLootNotification(`Entered ${locationData.name} (${locationType} - Avg Lv.${locationData.averageLevel})`);
    
    this.spawnMonster();
    Game.ui.updatePlayerDisplay();
    
    // Update enhanced combat location info
    setTimeout(() => {
        if (Game.ui && Game.ui.enhancedCombatUI && Game.ui.enhancedCombatUI.updateLocationDisplay) {
            Game.ui.enhancedCombatUI.updateLocationDisplay();
        }
        if (Game.ui && Game.ui.enhancedCombatUI && Game.ui.enhancedCombatUI.updateAll) {
            Game.ui.enhancedCombatUI.updateAll();
        }
    }, 100);
    }

    // Enhanced method to handle player death and set respawn timer
    handlePlayerDeath() {
        this.isRespawning = true;
        
        // Disable auto battle during respawn
        if (Game.ui && Game.ui.autoBattle) {
            Game.ui.toggleAutoBattle();
        }
        
        // Clear the respawn flag after the respawn timer
        setTimeout(() => {
            this.isRespawning = false;
        }, 1500);
    }

    showDamageNumber(damage, isCrit = false) {
        const battleArea = document.querySelector('.battle-area');
        const damageElement = document.createElement('div');
        damageElement.className = 'damage-number' + (isCrit ? ' crit' : '');
        damageElement.textContent = damage + (isCrit ? '!' : '');
        damageElement.style.cssText = `
            position: absolute;
            color: ${isCrit ? '#ff1744' : '#ffd700'};
            font-size: ${isCrit ? '2.2rem' : '1.8rem'};
            font-weight: 700;
            pointer-events: none;
            animation: floatUp 1.2s ease-out forwards;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
            z-index: 100;
            left: ${Math.random() * 200 + 100}px;
            top: 200px;
        `;
        
        // Add floating animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes floatUp {
                0% { opacity: 1; transform: translateY(0) scale(1); }
                50% { transform: translateY(-30px) scale(1.2); }
                100% { opacity: 0; transform: translateY(-60px) scale(0.8); }
            }
        `;
        if (!document.querySelector('#damage-animations')) {
            style.id = 'damage-animations';
            document.head.appendChild(style);
        }
        
        battleArea.appendChild(damageElement);
        
        setTimeout(() => damageElement.remove(), 1200);
    }

    showPlayerDamage(damage) {
        const battleArea = document.querySelector('.battle-area');
        const damageElement = document.createElement('div');
        damageElement.className = 'damage-number';
        damageElement.textContent = '-' + damage;
        damageElement.style.cssText = `
            position: absolute;
            color: #ff4444;
            font-size: 1.8rem;
            font-weight: 700;
            pointer-events: none;
            animation: floatUp 1.2s ease-out forwards;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
            z-index: 100;
            left: 50px;
            top: 100px;
        `;
        
        battleArea.appendChild(damageElement);
        
        setTimeout(() => damageElement.remove(), 1200);
    }

    animateMonsterHit() {
    // Try enhanced sprite first, then fallback to original
    const sprite = document.getElementById('enhanced-monster-sprite') || 
                   document.getElementById('monster-sprite');
    
    if (!sprite) {
        console.warn('No monster sprite found for animation');
        return;
    }
    
    sprite.style.animation = 'none';
    sprite.offsetHeight; // Trigger reflow
    sprite.style.animation = 'shake 0.4s ease-in-out';
    
    // Add shake animation if not exists
    if (!document.querySelector('#shake-animation')) {
        const style = document.createElement('style');
        style.id = 'shake-animation';
        style.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-8px) rotate(-2deg); }
                75% { transform: translateX(8px) rotate(2deg); }
            }
        `;
        document.head.appendChild(style);
    }
    
    setTimeout(() => {
        sprite.style.animation = '';
    }, 400);
}

    // Enhanced monster info for display with sprite support
    getMonsterInfo() {
        if (!this.currentMonster) return null;
        
        return {
            name: this.currentMonster.name,
            level: this.currentMonster.level,
            currentHp: Math.ceil(this.currentMonster.currentHp),
            maxHp: this.currentMonster.maxHp,
            def: this.currentMonster.def,
            emoji: this.currentMonster.emoji,
            spriteUrl: this.currentMonster.spriteUrl,
            hpPercent: (this.currentMonster.currentHp / this.currentMonster.maxHp) * 100,
            isBoss: this.currentMonster.isBoss || false
        };
    }

    // New Battle System Methods
    startBattle() {
        if (this.battleActive) return;

        this.battleActive = true;
        this.updateActivity();

        // Start battle loop - attacks every second
        this.battleInterval = setInterval(() => {
            // Check if battle should continue
            if (!this.battleActive) {
                return; // Battle was stopped, exit loop
            }

            // Check if player is alive
            if (Game.player.hp <= 0) {
                this.stopBattle();
                return;
            }

            // Check if monster exists and is alive
            if (!this.currentMonster || this.currentMonster.currentHp <= 0) {
                this.stopBattle();
                return;
            }

            // Check if respawning
            if (this.isRespawning) {
                return;
            }

            // All checks passed, attack the monster
            this.attackMonster();
        }, 1000);

        // Update UI
        if (Game.ui && Game.ui.enhancedCombatUI) {
            Game.ui.enhancedCombatUI.updateBattleButtons();
        }

        if (Game.ui) {
            Game.ui.showLootNotification("Battle started! Attacking every second...");
        }
    }

    stopBattle() {
        this.battleActive = false;

        if (this.battleInterval) {
            clearInterval(this.battleInterval);
            this.battleInterval = null;
        }

        // Update UI
        if (Game.ui && Game.ui.enhancedCombatUI) {
            Game.ui.enhancedCombatUI.updateBattleButtons();
        }
    }

    // Override spawnMonster to handle auto battle
    spawnMonsterWithAutoBattle() {
        this.spawnMonster();

        // If auto battle is enabled, start battle automatically
        if (this.autoBattleEnabled && !this.battleActive) {
            setTimeout(() => {
                this.startBattle();
            }, 100);
        }
    }

    // Activity tracking for idle systems
    updateActivity() {
        this.lastActivity = Date.now();
        this.isPaused = false;
    }

    checkInactivity() {
        if (Date.now() - this.lastActivity > 3000) {
            this.isPaused = true;
        }
    }

    // Enhanced auto-battle logic for location awareness
    isAutoBattleSafe() {
        if (!this.currentMonster) return false;
        
        const currentLocation = Game.player.state.currentLocation;
        const isField = MonsterUtils.isField(currentLocation);
        
        // Auto-battle safety checks
        const hpPercent = Game.player.hp / Game.player.maxHp;
        const mpPercent = Game.player.mp / Game.player.maxMp;
        
        if (isField) {
            // Fields: More relaxed safety (auto-heal on kill)
            return hpPercent > 0.3; // 30% HP minimum
        } else {
            // Dungeons: Stricter safety (no auto-heal)
            return hpPercent > 0.6 && mpPercent > 0.2; // 60% HP, 20% MP minimum
        }
    }

    // Get location type for UI display
    getCurrentLocationType() {
        const currentLocation = Game.player.state.currentLocation;
        return MonsterUtils.isField(currentLocation) ? 'Field' : 'Dungeon';
    }

    // Get location difficulty info
    getLocationDifficultyInfo() {
        const currentLocation = Game.player.state.currentLocation;
        const locationData = MonsterUtils.getLocationData(currentLocation);

        return {
            name: locationData.name,
            type: locationData.type,
            averageLevel: locationData.averageLevel,
            description: locationData.description,
            isAdvanced: MonsterUtils.isAdvancedArea(currentLocation)
        };
    }

    // Get skill-based damage reduction (like Energy Coat)
    getSkillDamageReduction() {
        if (!Game.skills || !Game.skills.statusEffects) return 0;

        let totalReduction = 0;
        Game.skills.statusEffects.forEach(effect => {
            if (effect.effects.damageReduction) {
                totalReduction += effect.effects.damageReduction;
            }
        });

        // Cap total skill-based damage reduction at 95%
        return Math.min(0.95, totalReduction);
    }
}