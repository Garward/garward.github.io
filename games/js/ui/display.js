// display.js - Enhanced UI display with complete progression system
class Display {
    constructor() {
        this.autoBattle = false;
        this.autoBattleInterval = null;
        this.notifications = [];
        this.statusEffectsExpanded = false;
        
        // Enhanced hotbar configuration
        this.hotbarConfig = {
            slots: [null, null, null, null, null], // 5 slots
            locked: false
        };
        
        // Advanced progression tracking
        this.progressionTracker = {
            locationsVisited: new Set(),
            bossesDefeated: new Set(),
            milestones: new Map()
        };
        this.locationMetrics = new Map();
        this.progressionMarkers = {
            beginner: { maxLevel: 15, color: '#4caf50' },
            intermediate: { maxLevel: 50, color: '#ff9800' },
            advanced: { maxLevel: 100, color: '#f44336' },
            dragon: { maxLevel: 999, color: '#9c27b0' }
        };
        
        this.elements = {
            // Player stats
            playerGold: document.getElementById('player-gold'),
            playerClass: document.getElementById('player-class'),
            playerLevel: document.getElementById('player-level'),
            playerHp: document.getElementById('player-hp'),
            playerMp: document.getElementById('player-mp'),
            playerAtk: document.getElementById('player-atk'),
            playerDef: document.getElementById('player-def'),
            playerSkillPoints: document.getElementById('player-skill-points'),
            
            // Monster display
            monsterSprite: document.getElementById('monster-sprite'),
            monsterName: document.getElementById('monster-name'),
            monsterLevel: document.getElementById('monster-level'),
            monsterDef: document.getElementById('monster-def'),
            monsterCurrentHp: document.getElementById('monster-current-hp'),
            monsterMaxHp: document.getElementById('monster-max-hp'),
            monsterHpFill: document.getElementById('monster-hp-fill'),
            
            // UI elements
            message: document.getElementById('message'),
            skillsContainer: document.getElementById('skills-container'),
            autoBattleButton: document.getElementById('enhanced-auto-battle-btn'),
            locationSelect: document.getElementById('location-select')
        };
        
        // Initialize basic systems first
        this.initializeNotificationSystem();
        this.initializeStatusEffectsUI();

        // Legacy progression system removed - using enhanced combat UI instead
    }

    // Advanced progression tracking
    loadProgressionData() {
        const saved = localStorage.getItem('ragnarok_progression');
        if (saved) {
            const data = JSON.parse(saved);
            this.progressionTracker.locationsVisited = new Set(data.locationsVisited || []);
            this.progressionTracker.bossesDefeated = new Set(data.bossesDefeated || []);
            this.progressionTracker.milestones = new Map(data.milestones || []);
        }
    }

    saveProgressionData() {
        const data = {
            locationsVisited: Array.from(this.progressionTracker.locationsVisited),
            bossesDefeated: Array.from(this.progressionTracker.bossesDefeated),
            milestones: Array.from(this.progressionTracker.milestones)
        };
        localStorage.setItem('ragnarok_progression', JSON.stringify(data));
    }

    // Track when player visits new location
    trackLocationVisit(location) {
        if (!this.progressionTracker.locationsVisited.has(location)) {
            this.progressionTracker.locationsVisited.add(location);
            this.showLootNotification(`🗺️ New area discovered: ${MonsterUtils.getLocationDisplayName(location)}!`);
            this.saveProgressionData();
        }
    }

    initializeNotificationSystem() {
        // Create notification container
        const container = document.createElement('div');
        container.id = 'notification-container';
        container.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            display: flex;
            flex-direction: column-reverse;
            gap: 8px;
            z-index: 1000;
            max-height: 400px;
            overflow: hidden;
            pointer-events: none;
        `;
        document.body.appendChild(container);
    }

    initializeStatusEffectsUI() {
        // Create status effects container in battle area
        const battleArea = document.querySelector('.battle-area');
        const statusContainer = document.createElement('div');
        statusContainer.id = 'status-effects-container';
        statusContainer.style.cssText = `
            position: absolute;
            top: 80px;
            left: 20px;
            z-index: 10;
            max-width: 250px;
        `;
        
        // Create toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'status-toggle-btn';
        toggleBtn.textContent = 'Status Effects ▼';
        toggleBtn.style.cssText = `
            background: rgba(0, 0, 0, 0.8);
            border: 1px solid var(--border-color);
            color: var(--text-primary);
            padding: 8px 12px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 0.9rem;
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
            width: 100%;
            min-height: 44px;
            touch-action: manipulation;
        `;
        toggleBtn.onclick = () => this.toggleStatusEffects();
        
        // Create effects list
        const effectsList = document.createElement('div');
        effectsList.id = 'status-effects-list';
        effectsList.style.cssText = `
            margin-top: 8px;
            display: none;
        `;
        
        statusContainer.appendChild(toggleBtn);
        statusContainer.appendChild(effectsList);
        battleArea.appendChild(statusContainer);
    }

    // Enhanced location info with detailed stats
    initializeLocationInfo() {
        const battleArea = document.querySelector('.battle-area');
        
        // Main location info panel
        const locationInfo = document.createElement('div');
        locationInfo.id = 'location-info';
        locationInfo.style.cssText = `
            position: absolute;
            top: 80px;
            right: 20px;
            background: rgba(0, 0, 0, 0.85);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 12px;
            backdrop-filter: blur(15px);
            font-size: 0.85rem;
            color: var(--text-secondary);
            max-width: 250px;
            z-index: 5;
            transition: all 0.3s ease;
        `;
        
        // Progression panel
        const progressPanel = document.createElement('div');
        progressPanel.id = 'progression-panel';
        progressPanel.style.cssText = `
            position: absolute;
            top: 250px;
            right: 20px;
            background: rgba(0, 0, 0, 0.85);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 12px;
            backdrop-filter: blur(15px);
            font-size: 0.8rem;
            color: var(--text-secondary);
            max-width: 250px;
            z-index: 5;
            transition: all 0.3s ease;
        `;
        
        battleArea.appendChild(locationInfo);
        battleArea.appendChild(progressPanel);
        
        this.updateLocationInfo();
        this.updateProgressionPanel();
    }

    // Comprehensive location info update
    updateLocationInfo() {
        const locationInfo = document.getElementById('location-info');
        if (!locationInfo || !Game.combat || !Game.combat.getLocationDifficultyInfo) return;
        
        const location = Game.player.state.currentLocation;
        const difficultyInfo = Game.combat.getLocationDifficultyInfo();
        const recommendation = this.getLocationRecommendation(difficultyInfo);
        const metrics = this.getLocationMetrics(location);
        
        // Track visit
        this.trackLocationVisit(location);
        
        let locationType = '🌱 Field';
        if (difficultyInfo.type === 'dungeon') locationType = '⚔️ Dungeon';
        if (difficultyInfo.type === 'advanced') locationType = '🐉 Dragon Area';
        
        const levelDiff = difficultyInfo.averageLevel - Game.player.level;
        let difficultyColor = this.getDifficultyColor(levelDiff);
        
        locationInfo.innerHTML = `
            <div style="font-weight: bold; color: var(--gold); margin-bottom: 6px; display: flex; justify-content: space-between;">
                <span>${locationType}</span>
                <span>Lv.${difficultyInfo.averageLevel}</span>
            </div>
            
            <div style="font-size: 0.75rem; margin-bottom: 6px;">
                ${difficultyInfo.description}
            </div>
            
            <div style="background: rgba(255,255,255,0.1); padding: 6px; border-radius: 6px; margin-bottom: 6px;">
                <div style="font-size: 0.75rem; color: ${difficultyColor}; font-weight: bold; margin-bottom: 2px;">
                    ${recommendation.text} ${recommendation.icon}
                </div>
                <div style="font-size: 0.7rem;">
                    Visits: ${metrics.visits} | Monsters: ${metrics.monstersKilled}
                </div>
            </div>
            
            ${this.getLocationBonuses(location)}
        `;
    }

    // Get location-specific bonuses and warnings
    getLocationBonuses(location) {
    let bonuses = '';
    const locData = MonsterUtils.getLocationData(location); // Assumes this method exists
    
    if (locData.type === 'field') {
        bonuses += '<div style="color: #4caf50; font-size: 0.7rem;">🌱 Auto-heal between fights</div>';
    }
    
    if (locData.type === 'dungeon' && !MonsterUtils.isAdvancedArea(location)) {
        bonuses += '<div style="color: #ff9800; font-size: 0.7rem;">⚔️ +50% EXP/Gold</div>';
        bonuses += '<div style="color: #f44336; font-size: 0.7rem;">⚠️ No auto-heal</div>';
    }
    
    if (MonsterUtils.isAdvancedArea(location)) {
        bonuses += '<div style="color: #9c27b0; font-size: 0.7rem;">🐉 +100% EXP/Gold</div>';
        bonuses += '<div style="color: #f44336; font-size: 0.7rem;">💀 Extreme danger</div>';
    }
    
    return bonuses;
}

    // Update progression panel with milestones and achievements
    updateProgressionPanel() {
        const panel = document.getElementById('progression-panel');
        if (!panel) return;

        const playerLevel = Game.player.level;
        const currentLocation = Game.player.state.currentLocation;

        // Get area progression info
        const currentProgress = Game.player.getAreaProgress(currentLocation);
        const monstersLeft = Math.max(0, 20 - currentProgress);
        const progressPercent = Math.floor((currentProgress / 20) * 100);

        // Check if next area is available
        const allAreas = Game.player.getAllAreasInOrder();
        const currentIndex = allAreas.findIndex(area => area.key === currentLocation);
        const nextArea = currentIndex !== -1 && currentIndex < allAreas.length - 1 ?
            allAreas[currentIndex + 1] : null;

        let areaProgressHTML = '';
        if (monstersLeft > 0 && nextArea) {
            areaProgressHTML = `
                <div style="margin-bottom: 8px;">
                    <div style="font-size: 0.8rem; margin-bottom: 2px; color: var(--gold);">🗺️ Area Progress (${progressPercent}%)</div>
                    <div style="width: 100%; height: 6px; background: rgba(255,255,255,0.2); border-radius: 3px;">
                        <div style="width: ${progressPercent}%; height: 100%; background: linear-gradient(90deg, #4caf50, #8bc34a); border-radius: 3px; transition: width 0.3s ease;"></div>
                    </div>
                    <div style="font-size: 0.7rem; color: var(--text-secondary); margin-top: 2px;">
                        ${monstersLeft} monsters left to unlock: ${nextArea.name}
                    </div>
                </div>
            `;
        } else if (monstersLeft === 0 && nextArea) {
            areaProgressHTML = `
                <div style="margin-bottom: 8px;">
                    <div style="color: #4caf50; font-size: 0.8rem; font-weight: bold;">✅ Area Complete!</div>
                    <div style="font-size: 0.7rem; color: var(--text-secondary);">
                        ${nextArea.name} is now unlocked!
                    </div>
                </div>
            `;
        } else if (!nextArea) {
            areaProgressHTML = `
                <div style="margin-bottom: 8px;">
                    <div style="color: #ff9800; font-size: 0.8rem; font-weight: bold;">🏆 Final Area!</div>
                    <div style="font-size: 0.7rem; color: var(--text-secondary);">
                        All areas unlocked!
                    </div>
                </div>
            `;
        }

        const locationsCount = this.progressionTracker.locationsVisited.size;
        const totalLocations = Object.keys(MONSTERS).length;
        const explorationPercent = Math.round((locationsCount / totalLocations) * 100);

        panel.innerHTML = `
            <div style="font-weight: bold; color: var(--gold); margin-bottom: 6px;">
                📊 Progression
            </div>

            ${areaProgressHTML}

            <div style="margin-bottom: 6px;">
                <div style="font-size: 0.75rem; margin-bottom: 2px;">Exploration: ${explorationPercent}%</div>
                <div style="width: 100%; height: 4px; background: rgba(255,255,255,0.2); border-radius: 2px;">
                    <div style="width: ${explorationPercent}%; height: 100%; background: #4fc3f7; border-radius: 2px;"></div>
                </div>
                <div style="font-size: 0.7rem; color: var(--text-secondary);">${locationsCount}/${totalLocations} areas</div>
            </div>

            ${this.getNextMilestone()}
            ${this.getRecommendedAreas()}
        `;
    }

    // Get next progression milestone
    getNextMilestone() {
        const playerLevel = Game.player.level;
        const milestones = [
            { level: 10, text: "Basic Equipment", reward: "New gear available" },
            { level: 25, text: "Intermediate Areas", reward: "Access tougher dungeons" },
            { level: 50, text: "Advanced Training", reward: "Better skill scaling" },
            { level: 100, text: "Dragon Knight Rebirth", reward: "Unlock Dragon powers" }
        ];
        
        const nextMilestone = milestones.find(m => m.level > playerLevel);
        
        if (!nextMilestone) {
            return '<div style="color: #9c27b0; font-size: 0.75rem;">🐉 Dragon Knight Achieved!</div>';
        }
        
        const progress = Math.round((playerLevel / nextMilestone.level) * 100);
        
        return `
            <div style="margin-bottom: 6px;">
                <div style="font-size: 0.75rem; margin-bottom: 2px;">Next: ${nextMilestone.text}</div>
                <div style="width: 100%; height: 4px; background: rgba(255,255,255,0.2); border-radius: 2px;">
                    <div style="width: ${progress}%; height: 100%; background: #ffd700; border-radius: 2px;"></div>
                </div>
                <div style="font-size: 0.7rem; color: var(--text-secondary);">Lv.${playerLevel}/${nextMilestone.level}</div>
            </div>
        `;
    }

    // Get recommended areas for current level
    getRecommendedAreas() {
        const playerLevel = Game.player.level;
        const allLocations = this.buildLocationData();
        
        // Find good training areas (within 5 levels)
        const goodAreas = allLocations.filter(loc => {
            const diff = Math.abs(loc.averageLevel - playerLevel);
            return diff <= 5 && !this.progressionTracker.locationsVisited.has(loc.key);
        }).slice(0, 2);
        
        if (goodAreas.length === 0) {
            return '<div style="color: var(--text-secondary); font-size: 0.7rem;">🗺️ All suitable areas explored</div>';
        }
        
        return `
            <div style="font-size: 0.75rem; margin-bottom: 4px; color: var(--gold);">🎯 Recommended:</div>
            ${goodAreas.map(area => 
                `<div style="font-size: 0.7rem; cursor: pointer; color: #4fc3f7;" 
                     onclick="Game.ui.switchToLocation('${area.key}')">
                    • ${area.name} (Lv.${area.averageLevel})
                </div>`
            ).join('')}
        `;
    }

    // Quick switch to recommended location
    switchToLocation(locationKey) {
        const locationSelect = this.elements.locationSelect;
        if (locationSelect) {
            locationSelect.value = locationKey;
            Game.combat.changeLocation();
            this.showLootNotification(`Switched to ${MonsterUtils.getLocationDisplayName(locationKey)}!`);
        }
    }

    // Get location recommendation for current location
    getLocationRecommendation(difficultyInfo) {
        const playerLevel = Game.player.level;
        const locationLevel = difficultyInfo.averageLevel;
        const levelDiff = locationLevel - playerLevel;
        
        if (levelDiff > 20) {
            return { text: "💀 EXTREMELY DANGEROUS", icon: "⚠️" };
        } else if (levelDiff > 10) {
            return { text: "🔥 Very Challenging", icon: "⚠️" };
        } else if (levelDiff > 5) {
            return { text: "⚔️ Challenging", icon: "" };
        } else if (levelDiff > 0) {
            return { text: "✅ Good for Training", icon: "👍" };
        } else if (levelDiff > -5) {
            return { text: "✅ Balanced", icon: "" };
        } else if (levelDiff > -15) {
            return { text: "📈 Easy EXP", icon: "" };
        } else {
            return { text: "😴 Too Easy", icon: "💤" };
        }
    }

    // Build complete location data
    buildLocationData() {
    const fields = MonsterUtils.getFieldsList();
    const allDungeons = MonsterUtils.getDungeonsList();
    
    // Separate dungeons into basic and advanced
    const basicDungeons = allDungeons.filter(loc => !MonsterUtils.isAdvancedArea(loc.key));
    const advancedDungeons = allDungeons.filter(loc => MonsterUtils.isAdvancedArea(loc.key));
    
    const locations = [
        ...fields.map(loc => ({
            key: loc.key,
            name: loc.name,
            averageLevel: loc.averageLevel,
            type: 'field',
            description: 'Safe for auto-battle'
        })),
        ...basicDungeons.map(loc => ({
            key: loc.key,
            name: loc.name,
            averageLevel: loc.averageLevel,
            type: 'dungeon',
            description: 'Challenging, higher rewards'
        }))
    ];
    
    // Add advanced dungeons for Dragon Knights only
    if (Game.player.isDragonKnight) {
        locations.push(...advancedDungeons.map(loc => ({
            key: loc.key,
            name: loc.name,
            averageLevel: loc.averageLevel,
            type: 'advanced',
            description: 'Extremely challenging'
        })));
    }
    
    return locations;
}

    // Get location metrics
    getLocationMetrics(location) {
        if (!this.locationMetrics.has(location)) {
            this.locationMetrics.set(location, {
                visits: 1,
                monstersKilled: 0,
                bossesKilled: 0,
                timeSpent: 0
            });
        }
        return this.locationMetrics.get(location);
    }

    // Get difficulty color based on level difference
    getDifficultyColor(levelDiff) {
        if (levelDiff > 20) return '#9c27b0'; // Purple - Dragon level
        if (levelDiff > 10) return '#f44336'; // Red - very hard
        if (levelDiff > 5) return '#ff9800';  // Orange - challenging
        if (levelDiff > 0) return '#4caf50';  // Green - good
        if (levelDiff > -10) return '#2196f3'; // Blue - easy
        return '#666'; // Gray - too easy
    }

    // Track monster encounters for metrics
    // Replace your trackMonsterEncounter method in display.js with this:

trackMonsterEncounter(monster) {
    if (!monster) return;
    
    const location = Game.player.state.currentLocation;
    if (!this.locationMetrics) {
        this.locationMetrics = new Map();
    }
    
    if (!this.locationMetrics.has(location)) {
        this.locationMetrics.set(location, {
            visits: 0,
            monstersKilled: 0,
            bossesKilled: 0,
            timeSpent: 0
        });
    }
    
    // This will be called when monster is defeated
    if (monster.currentHp <= 0) {
        const metrics = this.locationMetrics.get(location);
        metrics.monstersKilled++;
        
        if (monster.isBoss) {
            metrics.bossesKilled++;
            if (!this.progressionTracker) {
                this.progressionTracker = {
                    locationsVisited: new Set(),
                    bossesDefeated: new Set(),
                    milestones: new Map()
                };
            }
            this.progressionTracker.bossesDefeated.add(monster.name);
            this.showLootNotification(`🏆 Boss defeated: ${monster.name}!`);
        }
        
        if (this.saveProgressionData) {
            this.saveProgressionData();
        }
    }
}

    toggleStatusEffects() {
        this.statusEffectsExpanded = !this.statusEffectsExpanded;
        const btn = document.getElementById('status-toggle-btn');
        const list = document.getElementById('status-effects-list');
        
        if (this.statusEffectsExpanded) {
            btn.textContent = 'Status Effects ▲';
            list.style.display = 'block';
        } else {
            btn.textContent = 'Status Effects ▼';
            list.style.display = 'none';
        }
    }

    showLootNotification(text) {
        const container = document.getElementById('notification-container');
        const notification = document.createElement('div');
        notification.className = 'loot-notification';
        notification.textContent = text;
        notification.style.cssText = `
            background: rgba(0, 0, 0, 0.9);
            padding: 12px 20px;
            border-radius: 8px;
            border: 1px solid #4fc3f7;
            color: #ffffff;
            font-weight: 600;
            backdrop-filter: blur(10px);
            box-shadow: 0 4px 15px rgba(79, 195, 247, 0.3);
            transform: translateX(100%);
            opacity: 0;
            transition: all 0.3s ease;
            pointer-events: auto;
        `;
        
        container.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
            notification.style.opacity = '1';
        }, 50);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            notification.style.opacity = '0';
            setTimeout(() => {
                if (container.contains(notification)) {
                    container.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    updateStatusEffectsDisplay() {
        const list = document.getElementById('status-effects-list');
        const btn = document.getElementById('status-toggle-btn');
        if (!list || !btn) return;
        
        const effects = Game.skills.statusEffects;
        
        // Update button with count
        const count = effects.size;
        btn.textContent = `Status Effects (${count}) ${this.statusEffectsExpanded ? '▲' : '▼'}`;
        
        if (count === 0) {
            btn.style.opacity = '0.5';
            list.innerHTML = '<div style="color: var(--text-secondary); padding: 8px;">No active effects</div>';
            return;
        }
        
        btn.style.opacity = '1';
        list.innerHTML = '';
        
        effects.forEach((effect, id) => {
            const effectDiv = document.createElement('div');
            effectDiv.style.cssText = `
                background: rgba(0, 0, 0, 0.8);
                border: 1px solid rgba(79, 195, 247, 0.3);
                border-radius: 8px;
                padding: 8px 12px;
                margin-bottom: 8px;
                backdrop-filter: blur(10px);
            `;
            
            const progressPercent = (effect.duration / effect.maxDuration) * 100;
            const progressColor = progressPercent > 30 ? '#4fc3f7' : '#ff6b6b';
            
            // Get effect description
            const description = Game.skills.formatStatusBonuses(effect);
            
            effectDiv.innerHTML = `
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                    <span style="font-size: 1.2em;">${effect.icon}</span>
                    <div>
                        <div style="font-weight: bold; color: #ffd700; font-size: 0.9em;">${effect.name}${Game.combat && (!Game.combat.battleActive || Game.combat.isPaused) ? ' ⏸️' : ''}</div>
                        <div style="color: #4fc3f7; font-size: 0.8em;">${(effect.duration / 1000).toFixed(1)}s${Game.combat && (!Game.combat.battleActive || Game.combat.isPaused) ? ' (Paused)' : ''}</div>
                    </div>
                </div>
                ${description ? `<div style="color: var(--text-secondary); font-size: 0.8em; margin-bottom: 4px;">${description}</div>` : ''}
                <div style="width: 100%; height: 3px; background: rgba(255,255,255,0.2); border-radius: 2px;">
                    <div style="width: ${progressPercent}%; height: 100%; background: ${progressColor}; border-radius: 2px; transition: width 0.1s;"></div>
                </div>
            `;
            
            list.appendChild(effectDiv);
        });
    }

    // New Auto Battle system - automatically starts battle when new monsters spawn
    toggleAutoBattle() {
        this.autoBattle = !this.autoBattle;

        if (Game.combat) {
            Game.combat.autoBattleEnabled = this.autoBattle;
        }

        if (this.autoBattle) {
            // Start battle immediately if monster exists
            if (Game.combat && Game.combat.currentMonster && !Game.combat.battleActive) {
                Game.combat.startBattle();
            }

            if (this.elements.autoBattleButton) {
                this.elements.autoBattleButton.textContent = '⏸️ Disable Auto';
                this.elements.autoBattleButton.style.background = 'linear-gradient(135deg, #ff9800, #f57c00)';
            }

            const location = Game.player.state.currentLocation;
            const locationName = MonsterUtils.getLocationDisplayName ?
                MonsterUtils.getLocationDisplayName(location) : location;
            this.showLootNotification(`Auto battle enabled! Will start battle automatically in ${locationName}!`);
        } else {
            // Stop current battle and disable auto battle
            if (Game.combat) {
                Game.combat.stopBattle();
            }

            if (this.elements.autoBattleButton) {
                this.elements.autoBattleButton.textContent = '🤖 Auto Battle';
                this.elements.autoBattleButton.style.background = 'linear-gradient(135deg, var(--blue), #29b6f6)';
            }
            this.showLootNotification("Auto battle disabled!");
        }
    }

    // Smart auto-battle safety check
    shouldContinueAutoBattle() {
        const hpPercent = (Game.player.hp / Game.player.maxHp) * 100;
        const mpPercent = (Game.player.mp / Game.player.maxMp) * 100;
        
        // Fallback if advanced methods not available
        if (!Game.combat || !Game.combat.getLocationDifficultyInfo) {
            return Game.player.hp > 0 && 
                   Game.combat.currentMonster && 
                   Game.combat.currentMonster.currentHp > 0 && 
                   !Game.combat.isRespawning &&
                   hpPercent > 30 && 
                   mpPercent > 20;
        }
        
        // Dynamic thresholds based on area danger
        const location = Game.player.state.currentLocation;
        const difficultyInfo = Game.combat.getLocationDifficultyInfo();
        const isDangerous = difficultyInfo.averageLevel - Game.player.level > 5;
        
        const hpThreshold = isDangerous ? 50 : 30;
        const mpThreshold = isDangerous ? 30 : 20;
        
        return Game.player.hp > 0 && 
               Game.combat.currentMonster && 
               Game.combat.currentMonster.currentHp > 0 && 
               !Game.combat.isRespawning &&
               hpPercent > hpThreshold && 
               mpPercent > mpThreshold;
    }

    // Pause auto-battle with reason
    pauseAutoBattleWithReason() {
        this.autoBattle = false;
        if (this.autoBattleInterval) {
            clearInterval(this.autoBattleInterval);
            this.autoBattleInterval = null;
        }
        
        if (this.elements.autoBattleButton) {
            this.elements.autoBattleButton.textContent = '⚔️ Auto Battle';
            this.elements.autoBattleButton.style.background = 'linear-gradient(135deg, var(--blue), #29b6f6)';
        }
        this.showLootNotification("Auto-battle paused - Low HP/MP!");
    }

    // Disable auto-battle
    disableAutoBattle() {
        if (this.autoBattleInterval) {
            clearInterval(this.autoBattleInterval);
            this.autoBattleInterval = null;
        }
        
        if (this.elements.autoBattleButton) {
            this.elements.autoBattleButton.textContent = '⚔️ Auto Battle';
            this.elements.autoBattleButton.style.background = 'linear-gradient(135deg, var(--blue), #29b6f6)';
        }
        this.showLootNotification("Auto battle disabled!");
    }

    // Show recommended areas when auto-battle is too dangerous
    showRecommendedAreas() {
        const goodAreas = this.getGoodTrainingAreas();
        if (goodAreas.length > 0) {
            const message = `🎯 Recommended training areas for level ${Game.player.level}:\n\n` +
                          goodAreas.map(area => `• ${area.name} (Lv.${area.averageLevel})`).join('\n');
            
            setTimeout(() => alert(message), 100);
        }
    }

    // Get areas good for current level
    getGoodTrainingAreas() {
        const playerLevel = Game.player.level;
        const allLocations = this.buildLocationData();
        
        return allLocations.filter(loc => {
            const diff = loc.averageLevel - playerLevel;
            return diff >= -2 && diff <= 5; // Within reasonable range
        }).sort((a, b) => Math.abs(a.averageLevel - playerLevel) - Math.abs(b.averageLevel - playerLevel));
    }

    updatePlayerDisplay() {
        const stats = Game.player.getDisplayStats();

        // Update player stats
        this.elements.playerGold.textContent = stats.gold;
        this.elements.playerClass.textContent = stats.class;
        this.elements.playerLevel.textContent = stats.level;
        // Get bonuses from status effects
        const bonuses = Game.skills.getActiveStatusEffects();

        // Calculate buffed stats
        const buffedAtk = Math.floor(Game.player.atk * bonuses.atkMultiplier);
        const buffedDef = Math.floor((Game.player.def + bonuses.defenseBonus) * bonuses.defMultiplier);
        const flatReduction = bonuses.flatDamageReduction || 0;
        const skillReduction = Math.round((bonuses.skillDamageReduction || 0) * 100);

        // Update visible stat elements (ATK and DEF only — omit HP/MP)
        this.elements.playerAtk.textContent = `${buffedAtk}`;
        this.elements.playerDef.textContent = `${buffedDef} (${flatReduction} flat, -${skillReduction}% skill)`;


        // Update shop when gold changes to enable/disable buy buttons
        this.updateShopAvailability();
        
        // Update MP display
        if (this.elements.playerMp) {
            this.elements.playerMp.textContent = stats.mp;
        }
        
        // Update skill points display
        if (this.elements.playerSkillPoints) {
            this.elements.playerSkillPoints.textContent = Game.player.state.skillPoints;
        }

        // Update critical hit stats
        const critChanceEl = document.getElementById('player-crit-chance');
        const critDamageEl = document.getElementById('player-crit-damage');

        if (critChanceEl || critDamageEl) {
        const baseCritChance = Game.player.critChance;
        const baseCritDamage = 100 + Game.player.critDamage;
        const bonusCritChance = (bonuses.critChanceBonus || 0); // already in percent
        const bonusCritDamage = (bonuses.critDamageBonus || 0) * 100;

        const finalCritChance = baseCritChance + bonusCritChance;
        const finalCritDamage = baseCritDamage + bonusCritDamage;

        if (critChanceEl) {
            critChanceEl.innerHTML = `${finalCritChance.toFixed(1)}% <span style="color:gray;">(Base ${baseCritChance}%)</span>`;
        }
        if (critDamageEl) {
            critDamageEl.innerHTML = `${Math.round(finalCritDamage)}% <span style="color:gray;">(Base ${baseCritDamage}%)</span>`;
        }
        }


        
        // Update player name
        const playerNameEl = document.getElementById('player-name');
        if (playerNameEl) {
            playerNameEl.textContent = stats.name;
        }
        
        // Update EXP bar
        const expFill = document.getElementById('exp-fill');
        const currentExpEl = document.getElementById('current-exp');
        const maxExpEl = document.getElementById('max-exp');
        
        if (expFill) expFill.style.width = stats.expPercent + '%';
        if (currentExpEl) currentExpEl.textContent = stats.exp;
        if (maxExpEl) maxExpEl.textContent = stats.maxExp;
        
        // Update player HP bar
        const playerHpFill = document.getElementById('player-hp-fill');
        const playerCurrentHp = document.getElementById('player-current-hp');
        const playerMaxHp = document.getElementById('player-max-hp');
        
        if (playerHpFill) {
            const hpPercent = (Game.player.hp / Game.player.maxHp) * 100;
            playerHpFill.style.width = hpPercent + '%';
        }
        if (playerCurrentHp) playerCurrentHp.textContent = Math.ceil(Game.player.hp);
        if (playerMaxHp) playerMaxHp.textContent = Game.player.maxHp;
        
        // Update player MP bar
        const playerMpFill = document.getElementById('player-mp-fill');
        const playerCurrentMp = document.getElementById('player-current-mp');
        const playerMaxMp = document.getElementById('player-max-mp');
        
        if (playerMpFill) {
            const mpPercent = (Game.player.mp / Game.player.maxMp) * 100;
            playerMpFill.style.width = mpPercent + '%';
        }
        if (playerCurrentMp) playerCurrentMp.textContent = Math.ceil(Game.player.mp);
        if (playerMaxMp) playerMaxMp.textContent = Game.player.maxMp;
    
        
        // Update Dragon Knight styling if applicable
        if (Game.player.isDragonKnight) {
            this.elements.playerClass.className = 'stat-value dragon-knight';
            this.addDragonKnightStyling();
            
            // Show advanced areas
            const advancedAreas = document.getElementById('advanced-areas');
            if (advancedAreas) advancedAreas.style.display = 'block';
        }
        
        // Show rebirth button if eligible
        const rebirthButton = document.getElementById('rebirth-button');
        if (rebirthButton && Game.player.level >= 100 && !Game.player.isDragonKnight) {
            rebirthButton.style.display = 'block';
        }
    }

    // Enhanced monster display with progression tracking
    // Replace your updateMonsterDisplay method in display.js with this:

updateMonsterDisplay() {
    const monster = Game.combat.getMonsterInfo();
    if (!monster) return;
    
    // Update original elements (if they exist)
    const originalElements = {
        monsterName: document.getElementById('monster-name'),
        monsterLevel: document.getElementById('monster-level'),
        monsterDef: document.getElementById('monster-def'),
        monsterCurrentHp: document.getElementById('monster-current-hp'),
        monsterMaxHp: document.getElementById('monster-max-hp'),
        monsterHpFill: document.getElementById('monster-hp-fill'),
        monsterSprite: document.getElementById('monster-sprite')
    };
    
    // Update enhanced elements (if they exist)
    const enhancedElements = {
        monsterName: document.getElementById('enhanced-monster-name'),
        monsterLevel: document.getElementById('enhanced-monster-level'),
        monsterCurrentHp: document.getElementById('enhanced-monster-hp-text'),
        monsterHpFill: document.getElementById('enhanced-monster-hp-fill'),
        monsterSprite: document.getElementById('enhanced-monster-sprite'),
        bossIcon: document.getElementById('enhanced-boss-crown')
    };
    
    // Update original UI elements (if they exist)
    if (originalElements.monsterName) originalElements.monsterName.textContent = monster.name;
    if (originalElements.monsterLevel) originalElements.monsterLevel.textContent = monster.level;
    if (originalElements.monsterDef) originalElements.monsterDef.textContent = monster.def;
    if (originalElements.monsterCurrentHp) originalElements.monsterCurrentHp.textContent = monster.currentHp;
    if (originalElements.monsterMaxHp) originalElements.monsterMaxHp.textContent = monster.maxHp;
    if (originalElements.monsterHpFill) originalElements.monsterHpFill.style.width = monster.hpPercent + '%';
    
    // Update original sprite
    if (originalElements.monsterSprite) {
        if (monster.spriteUrl) {
            const img = document.createElement('img');
            img.src = monster.spriteUrl;
            img.style.cssText = `
                width: 80%;
                height: 80%;
                image-rendering: pixelated;
                object-fit: contain;
            `;
            img.onload = () => {
                originalElements.monsterSprite.innerHTML = '';
                originalElements.monsterSprite.appendChild(img);
            };
            img.onerror = () => {
                originalElements.monsterSprite.innerHTML = monster.emoji;
            };
        } else {
            originalElements.monsterSprite.innerHTML = monster.emoji;
        }
    }
    
    // Update enhanced UI elements (if they exist)
    if (enhancedElements.monsterName) enhancedElements.monsterName.textContent = monster.name;
    if (enhancedElements.monsterLevel) enhancedElements.monsterLevel.textContent = `Lv.${monster.level} | DEF: ${monster.def}`;
    if (enhancedElements.monsterCurrentHp) enhancedElements.monsterCurrentHp.textContent = `${monster.currentHp} / ${monster.maxHp}`;
    if (enhancedElements.monsterHpFill) enhancedElements.monsterHpFill.style.width = monster.hpPercent + '%';
    
    // Update enhanced sprite
    if (enhancedElements.monsterSprite) {
        if (monster.spriteUrl) {
            const img = document.createElement('img');
            img.src = monster.spriteUrl;
            img.style.cssText = `
                width: 80%;
                height: 80%;
                image-rendering: pixelated;
                object-fit: contain;
            `;
            img.onload = () => {
                enhancedElements.monsterSprite.innerHTML = '';
                enhancedElements.monsterSprite.appendChild(img);
            };
            img.onerror = () => {
                enhancedElements.monsterSprite.innerHTML = monster.emoji;
            };
        } else {
            enhancedElements.monsterSprite.innerHTML = monster.emoji;
        }
        
        // Handle boss styling
        if (monster.isBoss) {
            enhancedElements.monsterSprite.classList.add('boss');
            if (enhancedElements.bossIcon) enhancedElements.bossIcon.style.display = 'block';
        } else {
            enhancedElements.monsterSprite.classList.remove('boss');
            if (enhancedElements.bossIcon) enhancedElements.bossIcon.style.display = 'none';
        }
    }
    
    // Enhanced monster display (tracking and progression)
    this.trackMonsterEncounter(monster);
    this.addBossIndicators(monster);
    // Legacy location info removed
}

    // Enhanced monster sprite rendering with fallback
    renderMonsterSprite(monster) {
        const spriteContainer = this.elements.monsterSprite;
        
        if (monster.spriteUrl) {
            // Try to load sprite
            const img = document.createElement('img');
            img.src = monster.spriteUrl;
            img.style.cssText = `
                width: 80%;
                height: 80%;
                image-rendering: pixelated;
                image-rendering: -moz-crisp-edges;
                image-rendering: -webkit-crisp-edges;
                object-fit: contain;
            `;
            
            img.onload = () => {
                spriteContainer.innerHTML = '';
                spriteContainer.appendChild(img);
                console.log(`Successfully loaded monster sprite: ${monster.spriteUrl}`);
            };
            
            img.onerror = () => {
                console.warn(`Failed to load monster sprite: ${monster.spriteUrl}, using emoji fallback`);
                spriteContainer.innerHTML = '';
                spriteContainer.textContent = monster.emoji;
            };
        } else {
            // Use emoji fallback
            spriteContainer.innerHTML = '';
            spriteContainer.textContent = monster.emoji;
        }
    }

    // Add boss indicators to UI
// Replace your addBossIndicators method in display.js with this:

addBossIndicators(monster) {
    if (!monster.isBoss) {
        // Remove boss indicators if not a boss
        const crown = document.getElementById('boss-crown');
        if (crown) crown.style.display = 'none';
        
        const enhancedCrown = document.getElementById('enhanced-boss-crown');
        if (enhancedCrown) enhancedCrown.style.display = 'none';
        
        // Reset monster name styling for both UIs
        const originalMonsterName = document.getElementById('monster-name');
        const enhancedMonsterName = document.getElementById('enhanced-monster-name');
        
        if (originalMonsterName) originalMonsterName.style.cssText = '';
        if (enhancedMonsterName) enhancedMonsterName.style.cssText = '';
        
        return;
    }
    
    // Add crown above boss - for original UI
    const battleArea = document.querySelector('.battle-area');
    if (battleArea) {
        let crown = document.getElementById('boss-crown');
        
        if (!crown) {
            crown = document.createElement('div');
            crown.id = 'boss-crown';
            crown.style.cssText = `
                position: absolute;
                top: 140px;
                left: 50%;
                transform: translateX(-50%);
                font-size: 2rem;
                color: #ffd700;
                text-shadow: 0 0 10px rgba(255, 215, 0, 0.8);
                animation: bounce 2s ease-in-out infinite;
                z-index: 10;
            `;
            battleArea.appendChild(crown);
        }
        
        crown.textContent = '👑';
        crown.style.display = 'block';
    }
    
    // Handle enhanced UI crown (it creates its own)
    const enhancedCrown = document.getElementById('enhanced-boss-crown');
    if (enhancedCrown) {
        enhancedCrown.style.display = 'block';
    }
    
    // Add glow effect to monster name - for original UI
    const originalMonsterName = document.getElementById('monster-name');
    if (originalMonsterName) {
        originalMonsterName.style.cssText = `
            color: #ffd700;
            text-shadow: 0 0 15px rgba(255, 215, 0, 0.8);
            animation: bossGlow 2s ease-in-out infinite alternate;
        `;
    }
    
    // Add glow effect to enhanced monster name
    const enhancedMonsterName = document.getElementById('enhanced-monster-name');
    if (enhancedMonsterName) {
        enhancedMonsterName.style.cssText = `
            color: #ffd700;
            text-shadow: 0 0 15px rgba(255, 215, 0, 0.8);
            animation: bossGlow 2s ease-in-out infinite alternate;
        `;
    }
}

    showMessage(text, duration = 2000) {
        this.elements.message.textContent = text;
        this.elements.message.style.display = 'block';
        
        setTimeout(() => {
            this.elements.message.style.display = 'none';
        }, duration);
    }

    updateSkillsDisplay() {
        this.renderSkills();
    }

    // ENHANCED HOTBAR SYSTEM
    updateHotbar() {
        let hotbar = document.getElementById('skill-hotbar');
        if (!hotbar) return;
        
        // Initialize hotbar configuration if not exists
        if (!this.hotbarConfig) {
            this.hotbarConfig = {
                slots: [null, null, null, null, null], // 5 slots
                locked: false
            };
            this.loadHotbarConfig();
        }
        
        hotbar.innerHTML = '';
        
        // Add lock button
        const lockBtn = document.createElement('div');
        lockBtn.className = 'hotbar-lock-btn';
        lockBtn.innerHTML = this.hotbarConfig.locked ? '🔒' : '🔓';
        lockBtn.style.cssText = `
            width: 40px;
            height: 70px;
            background: ${this.hotbarConfig.locked ? 'rgba(255, 68, 68, 0.8)' : 'rgba(76, 175, 80, 0.8)'};
            border: 2px solid var(--border-color);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 1.5rem;
            margin-right: 8px;
            min-height: 44px;
            touch-action: manipulation;
        `;
        lockBtn.onclick = () => this.toggleHotbarLock();
        hotbar.appendChild(lockBtn);
        
        // Create 5 skill slots
        for (let i = 0; i < 5; i++) {
            const slotDiv = document.createElement('div');
            slotDiv.className = 'hotbar-skill';
            slotDiv.dataset.slotIndex = i;
            
            const assignedSkill = this.hotbarConfig.slots[i];
            const skill = assignedSkill ? Game.skills.getCurrentSkills().find(s => s.id === assignedSkill) : null;
            
            // Only show learned skills
            if (skill && skill.currentLevel > 0) {
                const onCooldown = skill.cooldown > 0;
                const mpCost = skill.mpCost ? skill.mpCost + (skill.currentLevel - 1) * 2 : 0;
                const canUse = mpCost === 0 || Game.player.mp >= mpCost;
                const battleActive = Game.combat && Game.combat.battleActive;

                if (onCooldown) slotDiv.classList.add('on-cooldown');
                if (!canUse && !onCooldown) slotDiv.classList.add('no-mp');
                if (!battleActive) slotDiv.classList.add('battle-inactive');
                
                slotDiv.innerHTML = `
                    <div class="hotbar-skill-key">${i + 1}</div>
                    <div class="hotbar-skill-icon">${skill.icon}</div>
                    ${mpCost > 0 ? `<div class="hotbar-skill-mp">${mpCost}</div>` : ''}
                    ${onCooldown ? `<div class="cooldown-overlay">${Math.ceil(skill.cooldown / 1000)}</div>` : ''}
                `;
                
                if (!onCooldown && canUse && battleActive && !this.hotbarConfig.locked) {
                    slotDiv.onclick = () => Game.skills.useSkill(skill.id);
                } else if (!battleActive) {
                    slotDiv.onclick = () => Game.ui.showMessage("Start battle first to use skills!");
                }
                
                // Add tooltip
                slotDiv.setAttribute('data-tooltip', this.getSkillTooltip(skill));
                slotDiv.addEventListener('mouseenter', (e) => this.showTooltip(e));
                slotDiv.addEventListener('mouseleave', () => this.hideTooltip());
            } else {
                // Empty slot
                slotDiv.innerHTML = `
                    <div class="hotbar-skill-key">${i + 1}</div>
                    <div style="color: var(--text-secondary); font-size: 0.8rem;">Empty</div>
                `;
                slotDiv.style.opacity = '0.5';
            }
            
            // Drag and drop functionality
            if (!this.hotbarConfig.locked) {
                slotDiv.ondrop = (e) => this.dropSkillOnHotbar(e, i);
                slotDiv.ondragover = (e) => this.allowSkillDrop(e);
                slotDiv.ondragleave = (e) => this.clearDropFeedback(e);
                
                if (skill && skill.currentLevel > 0) {
                    slotDiv.draggable = true;
                    slotDiv.ondragstart = (e) => this.dragSkillFromHotbar(e, i);
                }
            }
            
            hotbar.appendChild(slotDiv);
        }
    }

    toggleHotbarLock() {
        this.hotbarConfig.locked = !this.hotbarConfig.locked;
        this.saveHotbarConfig();
        this.updateHotbar();
        this.showLootNotification(this.hotbarConfig.locked ? "Hotbar locked" : "Hotbar unlocked");
    }

    dragSkillFromHotbar(e, slotIndex) {
        const skill = this.hotbarConfig.slots[slotIndex];
        e.dataTransfer.setData('skill-id', skill);
        e.dataTransfer.setData('source', 'hotbar');
        e.dataTransfer.setData('source-slot', slotIndex);
        e.target.style.opacity = '0.5';
    }

    dropSkillOnHotbar(e, slotIndex) {
        e.preventDefault();
        this.clearDropFeedback(e);
        
        const skillId = e.dataTransfer.getData('skill-id');
        const source = e.dataTransfer.getData('source');
        const sourceSlot = e.dataTransfer.getData('source-slot');
        
        if (source === 'hotbar' && sourceSlot !== undefined) {
            // Swap skills
            const sourceIndex = parseInt(sourceSlot);
            const temp = this.hotbarConfig.slots[slotIndex];
            this.hotbarConfig.slots[slotIndex] = this.hotbarConfig.slots[sourceIndex];
            this.hotbarConfig.slots[sourceIndex] = temp;
        } else {
            // Add skill from skills panel
            const skill = Game.skills.getCurrentSkills().find(s => s.id === skillId);
            if (skill && skill.currentLevel > 0) {
                this.hotbarConfig.slots[slotIndex] = skillId;
            }
        }
        
        this.saveHotbarConfig();
        this.updateHotbar();
        this.renderSkills(); // Refresh skills panel
    }

    allowSkillDrop(e) {
        e.preventDefault();
        e.currentTarget.style.borderColor = '#4caf50';
        e.currentTarget.style.background = 'rgba(76, 175, 80, 0.2)';
    }

    clearDropFeedback(e) {
        e.currentTarget.style.borderColor = '';
        e.currentTarget.style.background = '';
        
        // Reset drag opacity
        document.querySelectorAll('.hotbar-skill').forEach(skill => {
            skill.style.opacity = '';
        });
    }

    renderSkills() {
        const container = document.getElementById('skills-container');
        if (!container) return;
        
        // Add toggle button
        if (!document.getElementById('skills-toggle')) {
            const toggle = document.createElement('button');
            toggle.id = 'skills-toggle';
            toggle.innerHTML = 'Skills ▼';
            toggle.style.cssText = `
                width: 100%;
                background: rgba(79, 195, 247, 0.2);
                border: 1px solid var(--blue);
                color: var(--text-primary);
                padding: 8px;
                border-radius: 8px;
                cursor: pointer;
                margin-bottom: 10px;
                min-height: 44px;
                touch-action: manipulation;
            `;
            toggle.onclick = () => this.toggleSkillsView();
            container.parentNode.insertBefore(toggle, container);
        }
        
        // Check if expanded view
        const isExpanded = container.classList.contains('expanded');

        // Apply appropriate styles based on view mode
        if (isExpanded) {
            container.style.cssText = `
                min-height: 350px;
                height: 350px;
                max-height: 350px;
                overflow-y: auto;
                padding-right: 4px;
                display: block !important;
                visibility: visible !important;
            `;
        } else {
            // For compact view, respect the CSS-defined max-height and let content flow naturally
            container.style.cssText = `
                max-height: 360px;
                overflow-y: auto;
                padding-right: 4px;
                display: block !important;
                visibility: visible !important;
                height: auto;
            `;
        }

        container.innerHTML = '';
        container.className = isExpanded ? 'skills-container expanded' : 'skills-container';
        
        Game.skills.getCurrentSkills().forEach(skill => {
            const skillDiv = document.createElement('div');
            
            if (isExpanded) {
                // Full view (existing code)
                skillDiv.className = 'skill-item';
                if (skill.isDragonSkill) skillDiv.classList.add('dragon-skill');
                if (Game.player.level >= skill.unlockLevel) skillDiv.classList.add('unlocked');
                
                const mpCost = skill.mpCost ? skill.mpCost + (skill.currentLevel - 1) * 2 : 0;
                const mpCostText = mpCost > 0 ? ` (${mpCost} MP)` : '';
                
                skillDiv.innerHTML = `
                    <div>
                        <span class="skill-name ${skill.isDragonSkill ? 'dragon-skill' : ''}">${skill.name}${mpCostText}</span>
                        <span class="skill-level">${skill.currentLevel}/${skill.maxLevel}</span>
                    </div>
                    <div class="skill-description">${skill.description}</div>
                    ${Game.player.level >= skill.unlockLevel ? `
                        <button class="button-learn" onclick="learnSkill('${skill.id}')" 
                            ${skill.currentLevel >= skill.maxLevel || Game.player.state.skillPoints < 1 ? 'disabled' : ''}>
                            Learn (${Game.player.state.skillPoints} points)
                        </button>
                    ` : `<div style="color: #888; font-size: 0.8em;">Unlocks at level ${skill.unlockLevel}</div>`}
                `;
            } else {
                // Compact view - just icons with drag functionality
                skillDiv.className = 'skill-item-compact';
                skillDiv.style.cssText = `
                    display: inline-block;
                    width: 40px;
                    height: 40px;
                    background: var(--glass-bg);
                    border: 1px solid var(--border-color);
                    border-radius: 8px;
                    text-align: center;
                    line-height: 40px;
                    margin: 4px;
                    cursor: ${skill.currentLevel > 0 ? 'grab' : 'default'};
                    font-size: 1.2rem;
                    position: relative;
                    opacity: ${skill.currentLevel > 0 ? '1' : '0.3'};
                    min-height: 44px;
                    touch-action: manipulation;
                `;
                
                skillDiv.innerHTML = skill.icon || '❓'; // Add fallback icon
                
                // Add level indicator
                if (skill.currentLevel > 0) {
                    const level = document.createElement('div');
                    level.textContent = skill.currentLevel;
                    level.style.cssText = `
                        position: absolute;
                        bottom: -2px;
                        right: -2px;
                        background: var(--gold);
                        color: #000;
                        font-size: 0.7rem;
                        width: 16px;
                        height: 16px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-weight: bold;
                    `;
                    skillDiv.appendChild(level);
                    
                    // Add MP cost indicator for skills with MP cost
                    const mpCost = skill.mpCost ? skill.mpCost + (skill.currentLevel - 1) * 2 : 0;
                    if (mpCost > 0) {
                        const mpIndicator = document.createElement('div');
                        mpIndicator.textContent = mpCost;
                        mpIndicator.style.cssText = `
                            position: absolute;
                            top: -2px;
                            left: -2px;
                            background: #1e88e5;
                            color: #fff;
                            font-size: 0.6rem;
                            width: 14px;
                            height: 14px;
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-weight: bold;
                        `;
                        skillDiv.appendChild(mpIndicator);
                    }
                }
            }
            
            // Add drag functionality for learned skills
            if (skill.currentLevel > 0 && !skill.isPassive) {
                skillDiv.draggable = true;
                skillDiv.ondragstart = (e) => {
                    e.dataTransfer.setData('skill-id', skill.id);
                    e.dataTransfer.setData('source', 'skills');
                    skillDiv.style.opacity = '0.5';
                };
                skillDiv.ondragend = () => {
                    skillDiv.style.opacity = '';
                };
            }
            
            // Add tooltip with FIXED positioning
            skillDiv.setAttribute('data-tooltip', this.getSkillTooltip(skill));
            skillDiv.onmouseenter = (e) => this.showTooltip(e);
            skillDiv.onmouseleave = () => this.hideTooltip();
            skillDiv.onmousemove = (e) => this.moveTooltip(e);
            
            container.appendChild(skillDiv);
        });
        
        this.initializeTooltips();
    }

    toggleSkillsView() {
        const container = document.getElementById('skills-container');
        const toggle = document.getElementById('skills-toggle');
        
        container.classList.toggle('expanded');
        const isExpanded = container.classList.contains('expanded');
        
        toggle.innerHTML = isExpanded ? 'Skills ▲' : 'Skills ▼';
        this.renderSkills();
    }

    getSkillTooltip(skill) {
        let tooltip = `<strong>${skill.name}</strong><br>`;
        tooltip += `<em>${skill.description}</em><br><br>`;
        
        if (skill.damageMultiplier) {
            tooltip += `Damage: ${Math.round(skill.damageMultiplier * 100)}%<br>`;
        }
        if (skill.mpCost) {
            const mpCost = skill.mpCost + (skill.currentLevel - 1) * 2;
            tooltip += `MP Cost: ${mpCost}<br>`;
        }
        if (skill.maxCooldown) {
            tooltip += `Cooldown: ${skill.maxCooldown / 1000}s<br>`;
        }
        if (skill.defenseBonus) {
            tooltip += `Defense Bonus: +${skill.defenseBonus * skill.currentLevel}<br>`;
        }
        if (skill.defenseMultiplier) {
            const defPercent = (skill.defenseMultiplier + (skill.currentLevel * 0.02)) * 100;
            tooltip += `Defense Increase: +${defPercent}%<br>`;
        }
        if (skill.atkBonus) {
            tooltip += `Attack Bonus: +${skill.atkBonus * skill.currentLevel}<br>`;
        }
        
        if (skill.isPassive) {
            tooltip += '<br><span style="color: #4fc3f7;">Passive Skill</span>';
        } else if (skill.hotkey) {
            tooltip += `<br>Hotkey: ${skill.hotkey}`;
        }
        
        return tooltip;
    }

    initializeTooltips() {
        // Remove existing tooltips
        const existingTooltips = document.querySelectorAll('.custom-tooltip');
        existingTooltips.forEach(t => t.remove());
        
        // Add tooltips to items and skills
        document.querySelectorAll('[data-tooltip], .item, .skill-item').forEach(element => {
            element.addEventListener('mouseenter', (e) => this.showTooltip(e));
            element.addEventListener('mouseleave', () => this.hideTooltip());
            element.addEventListener('mousemove', (e) => this.moveTooltip(e));
        });
    }

    showTooltip(e) {
        const element = e.currentTarget;
        let tooltipContent = element.getAttribute('data-tooltip');
        
        // For inventory items, get tooltip from equipment manager
        if (element.classList.contains('item') && !tooltipContent) {
            return; // Let equipment manager handle this
        }
        
        if (!tooltipContent) return;
        
        let tooltip = document.getElementById('custom-tooltip');
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.id = 'custom-tooltip';
            tooltip.className = 'custom-tooltip';
            tooltip.style.cssText = `
                position: fixed;
                background: rgba(0, 0, 0, 0.95);
                border: 2px solid var(--border-color);
                border-radius: 8px;
                padding: 12px;
                color: var(--text-primary);
                font-size: 0.9rem;
                z-index: 10000;
                pointer-events: none;
                max-width: 300px;
                backdrop-filter: blur(10px);
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.6);
                display: none;
            `;
            document.body.appendChild(tooltip);
        }
        
        tooltip.innerHTML = tooltipContent;
        tooltip.style.display = 'block';
        this.moveTooltip(e);
    }

    moveTooltip(e) {
        const tooltip = document.getElementById('custom-tooltip');
        if (!tooltip || tooltip.style.display === 'none') return;
        
        // Get viewport dimensions
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Get tooltip dimensions
        const rect = tooltip.getBoundingClientRect();
        
        // Start with mouse position offset (use clientX/Y for viewport coordinates)
        let left = e.clientX + 15;
        let top = e.clientY + 15;
        
        // Check right edge
        if (left + rect.width > viewportWidth) {
            left = e.clientX - rect.width - 15;
        }
        
        // Check left edge
        if (left < 0) {
            left = 10;
        }
        
        // Check bottom edge
        if (top + rect.height > viewportHeight) {
            top = e.clientY - rect.height - 15;
        }
        
        // Check top edge
        if (top < 0) {
            top = 10;
        }
        
        // If tooltip is still too wide for viewport, place it centered
        if (rect.width > viewportWidth - 20) {
            left = 10;
            tooltip.style.maxWidth = (viewportWidth - 20) + 'px';
        }
        
        // Use fixed positioning (no scroll offset needed)
        tooltip.style.left = left + 'px';
        tooltip.style.top = top + 'px';
    }

    hideTooltip() {
        const tooltip = document.getElementById('custom-tooltip');
        if (tooltip) tooltip.style.display = 'none';
    }

    // Enhanced shop rendering with better item display
    renderShop() {
        const shopContainer = document.getElementById('shop-items');
        if (!shopContainer) return;
        
        shopContainer.innerHTML = '';
        
        SHOP_ITEMS.forEach(item => {
            const shopDiv = document.createElement('div');
            shopDiv.className = 'shop-item';
            
            const canBuy = item.isContextMenu || (Game.player.level >= item.level && Game.player.gold >= item.price);
            if (!canBuy) {
                shopDiv.classList.add('disabled');
            }
            
            // Generate proper item with sprite to get the icon - handle context menu items specially
            let generatedItem, itemIcon;
            if (item.isContextMenu) {
                // For context menu items, use exp_potion template
                generatedItem = Game.equipment.generateItem('exp_potion', 'legendary', 1);
                itemIcon = '⭐';
            } else {
                generatedItem = Game.equipment.generateItem(item.type, item.rarity, 1);
                itemIcon = generatedItem ? generatedItem.icon : item.icon || '❓';
            }
            
            // Create icon element that can use sprites
            const iconDiv = document.createElement('div');
            iconDiv.className = 'shop-item-icon';
            iconDiv.style.cssText = `
                font-size: clamp(1.8rem, 5vw, 2.5rem);
                margin-bottom: 8px;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 8px auto;
            `;
            
            // Use the same sprite rendering system as inventory
            if (generatedItem && generatedItem.spriteUrl) {
                const img = document.createElement('img');
                img.src = generatedItem.spriteUrl;
                img.style.cssText = `
                    width: 100%;
                    height: 100%;
                    image-rendering: pixelated;
                    object-fit: contain;
                `;
                img.onerror = () => {
                    iconDiv.innerHTML = '';
                    iconDiv.textContent = itemIcon;
                };
                iconDiv.appendChild(img);
            } else {
                iconDiv.textContent = itemIcon;
            }
            
            const priceText = item.isContextMenu ? "Browse Options" : `${item.price} Gold`;
            shopDiv.innerHTML = `
                <div class="shop-item-name">${item.name}</div>
                <div class="shop-item-level">Level ${item.level}</div>
                <div class="shop-item-price">${priceText}</div>
            `;
            
            // Insert icon at the beginning
            shopDiv.insertBefore(iconDiv, shopDiv.firstChild);
            
            if (canBuy) {
                if (item.isContextMenu) {
                    shopDiv.onclick = (e) => Game.equipment.showExpPotionMenu(e);
                } else {
                    shopDiv.onclick = () => Game.equipment.buyItem(item);
                }
            }
            
            shopContainer.appendChild(shopDiv);
        });
    }

    // Efficiently update shop item availability without full re-render
    updateShopAvailability() {
        const shopContainer = document.getElementById('shop-items');
        if (!shopContainer) return;

        const shopItems = shopContainer.querySelectorAll('.shop-item');

        SHOP_ITEMS.forEach((item, index) => {
            const shopDiv = shopItems[index];
            if (!shopDiv) return;

            const canBuy = item.isContextMenu || (Game.player.level >= item.level && Game.player.gold >= item.price);

            if (canBuy) {
                shopDiv.classList.remove('disabled');
                if (item.isContextMenu) {
                    shopDiv.onclick = (e) => Game.equipment.showExpPotionMenu(e);
                } else {
                    shopDiv.onclick = () => Game.equipment.buyItem(item);
                }
            } else {
                shopDiv.classList.add('disabled');
                shopDiv.onclick = null;
            }
        });
    }

    // Enhanced location selector with area unlocking system
    updateLocationSelector() {
        const locationSelect = this.elements.locationSelect;
        if (!locationSelect) return;

        const currentValue = locationSelect.value;
        locationSelect.innerHTML = '';

        // Get all areas in progression order
        const allAreas = Game.player.getAllAreasInOrder();

        // Group by type for better organization
        const fields = allAreas.filter(area => MonsterUtils.isField(area.key));
        const dungeons = allAreas.filter(area => MonsterUtils.isDungeon(area.key));

        // Add fields
        if (fields.length > 0) {
            const fieldGroup = document.createElement('optgroup');
            fieldGroup.label = '🌱 Fields (Safe Training)';

            fields.forEach(area => {
                const option = this.createLocationOption(area);
                if (option) fieldGroup.appendChild(option);
            });

            locationSelect.appendChild(fieldGroup);
        }

        // Add dungeons
        if (dungeons.length > 0) {
            const dungeonGroup = document.createElement('optgroup');
            dungeonGroup.label = '⚔️ Dungeons (Higher Rewards)';

            dungeons.forEach(area => {
                const option = this.createLocationOption(area);
                if (option) dungeonGroup.appendChild(option);
            });

            locationSelect.appendChild(dungeonGroup);
        }

        // Restore selection
        if (currentValue && Array.from(locationSelect.options).some(opt => opt.value === currentValue)) {
            locationSelect.value = currentValue;
        }
    }

    createLocationOption(area) {
        const isUnlocked = Game.player.isAreaUnlocked(area.key);
        const progress = Game.player.getAreaProgress(area.key);
        const playerLevel = Game.player.level;

        const option = document.createElement('option');
        option.value = area.key;

        // Create option text with progress info
        let statusIcon = '🔒'; // Locked
        if (isUnlocked) {
            statusIcon = progress >= 20 ? '✅' : '🔓'; // Complete or unlocked
        }

        const progressText = isUnlocked && progress > 0 ? ` (${progress}/20)` : '';
        option.textContent = `${statusIcon} ${area.name} (Lv.${area.averageLevel})${progressText}`;

        // Disable locked areas
        if (!isUnlocked) {
            option.disabled = true;
            option.style.color = '#666';
            option.style.fontStyle = 'italic';
        } else {
            // Style based on difficulty
            const levelDiff = area.averageLevel - playerLevel;

            if (levelDiff > 10) {
                option.style.color = '#f44336'; // Red for very hard
            } else if (levelDiff > 5) {
                option.style.color = '#ff9800'; // Orange for hard
            } else if (levelDiff > 0) {
                option.style.color = '#4caf50'; // Green for good
            } else {
                option.style.color = '#9e9e9e'; // Gray for easy
            }

            if (progress >= 20) {
                option.style.fontWeight = 'bold';
            }
        }

        return option;
    }

    // Group locations by progression tier
    groupLocationsByTier(locations) {
        const tiers = {
            beginner: [],
            intermediate: [],
            advanced: [],
            dragon: []
        };
        
        locations.forEach(location => {
            if (location.type === 'advanced') {
                tiers.dragon.push(location);
            } else if (location.averageLevel <= 15) {
                tiers.beginner.push(location);
            } else if (location.averageLevel <= 50) {
                tiers.intermediate.push(location);
            } else {
                tiers.advanced.push(location);
            }
        });
        
        return tiers;
    }

    // Get tier label with icons
    getTierLabel(tierName) {
        const labels = {
            beginner: '🌱 Beginner Areas (Lv.1-15)',
            intermediate: '⚔️ Intermediate Areas (Lv.16-50)', 
            advanced: '🔥 Advanced Areas (Lv.51-100)',
            dragon: '🐉 Dragon Knight Areas (Lv.100+)'
        };
        return labels[tierName] || tierName;
    }

    // Get difficulty indicator for location
    getDifficultyIndicator(location) {
        const playerLevel = Game.player.level;
        const levelDiff = location.averageLevel - playerLevel;
        
        if (levelDiff > 20) return '💀';
        if (levelDiff > 10) return '🔥';
        if (levelDiff > 5) return '⚠️';
        if (levelDiff > 0) return '✅';
        if (levelDiff > -10) return '📈';
        return '😴';
    }

    addDragonKnightStyling() {
        // Add special Dragon Knight visual effects
        if (!document.querySelector('#dragon-knight-styles')) {
            const style = document.createElement('style');
            style.id = 'dragon-knight-styles';
            style.textContent = `
                .stat-value.dragon-knight {
                    color: #ff6b6b;
                    text-shadow: 0 0 10px rgba(255, 107, 107, 0.7);
                    animation: dragonGlow 2s ease-in-out infinite alternate;
                }
                
                @keyframes dragonGlow {
                    from { text-shadow: 0 0 10px rgba(255, 107, 107, 0.7); }
                    to { text-shadow: 0 0 20px rgba(255, 107, 107, 1), 0 0 30px rgba(255, 107, 107, 0.5); }
                }
                
                /* Boss monster effects */
                .boss-monster {
                    animation: bossGlow 2s ease-in-out infinite alternate !important;
                    box-shadow: 0 0 30px rgba(255, 215, 0, 0.8) !important;
                }

                @keyframes bossGlow {
                    from { 
                        box-shadow: 0 15px 35px rgba(255, 107, 107, 0.4), 0 0 20px rgba(255, 215, 0, 0.6);
                        filter: brightness(1.1);
                    }
                    to { 
                        box-shadow: 0 20px 45px rgba(255, 107, 107, 0.6), 0 0 40px rgba(255, 215, 0, 1);
                        filter: brightness(1.3);
                    }
                }

                @keyframes bounce {
                    0%, 100% { transform: translateX(-50%) translateY(0); }
                    50% { transform: translateX(-50%) translateY(-10px); }
                }
                
                .hotbar-skill-mp {
                    position: absolute;
                    top: 2px;
                    left: 2px;
                    background: #1e88e5;
                    color: white;
                    font-size: 0.7rem;
                    padding: 2px 4px;
                    border-radius: 4px;
                    font-weight: bold;
                    -webkit-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                    user-select: none;
                    -webkit-touch-callout: none;
                    -webkit-tap-highlight-color: transparent;
                }

                .hotbar-skill.no-mp {
                    opacity: 0.4;
                    cursor: not-allowed;
                }

                .hotbar-skill.no-mp .hotbar-skill-mp {
                    background: #f44336;
                }

                .hotbar-skill.battle-inactive {
                    opacity: 0.3;
                    cursor: not-allowed;
                    filter: grayscale(100%);
                }

                .hotbar-skill.battle-inactive::after {
                    content: "⏸️";
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    font-size: 1.2rem;
                    z-index: 10;
                }

                /* Hotbar and skill elements non-selectable */
                .hotbar-skill,
                .hotbar-skill-icon,
                .hotbar-lock-btn,
                .skill-item,
                .skill-name,
                .skill-description,
                .skill-level,
                .skill-cost,
                .cooldown-overlay {
                    -webkit-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                    user-select: none;
                    -webkit-touch-callout: none;
                    -webkit-tap-highlight-color: transparent;
                }

                /* Progression panels */
                #progression-panel, #location-info {
                    transition: all 0.3s ease;
                    -webkit-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                    user-select: none;
                    -webkit-touch-callout: none;
                    -webkit-tap-highlight-color: transparent;
                }

                #progression-panel:hover, #location-info:hover {
                    transform: scale(1.02);
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
                }

                /* Mobile responsive adjustments */
                @media (max-width: 768px) {
                    #location-info, #progression-panel {
                        position: relative;
                        top: auto;
                        right: auto;
                        margin: 10px 0;
                        max-width: 100%;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Update all displays at once
    // In display.js, replace your updateAll method with this:

    updateAll() {
    this.updatePlayerDisplay();
    this.updateMonsterDisplay();
    this.updateSkillsDisplay();
    this.updateHotbar();
    this.updateStatusEffectsDisplay();
    this.updateLocationSelector();
    // Legacy progression panel removed
    
    // Update enhanced combat UI if it exists
    if (this.enhancedCombatUI) {
        try {
            this.enhancedCombatUI.updateAll();
        } catch (e) {
            console.warn('Enhanced combat update failed:', e);
        }
     }
    }

    // Initialize UI elements and event listeners
    initialize() {
        // Load hotbar config on init
        this.loadHotbarConfig();
        
        // Legacy location info removed - using enhanced combat UI instead

        // Update location selector with enhanced data
        this.updateLocationSelector();
        
        // Add click event listeners
        document.addEventListener('click', () => {
            Game.combat.updateActivity();
        });

        // Enhanced keyboard shortcuts with hotbar support
        document.addEventListener('keydown', (e) => {
            // Block all game inputs when character creation modal is open
            const charModal = document.getElementById('character-creation-modal');
            const selectorModal = document.getElementById('character-selector-modal');
            if ((charModal && charModal.style.display === 'flex') || selectorModal) {
                return;
            }
            
            Game.combat.updateActivity();
            
            const key = e.key.toLowerCase();
            if (key === 'space' || key === 'enter') {
                e.preventDefault();
                Game.combat.attackMonster();
            } else if (key === 'q') {
                e.preventDefault();
                Game.equipment.usePotion();
            } else if (key === 'e') {
                e.preventDefault();
                Game.equipment.useMpPotion();
            } else if (key >= '1' && key <= '5') {
                e.preventDefault();
                const slotIndex = parseInt(key) - 1;
                if (this.hotbarConfig && this.hotbarConfig.slots[slotIndex]) {
                    const skillId = this.hotbarConfig.slots[slotIndex];
                    const skill = Game.skills.getCurrentSkills().find(s => s.id === skillId);
                    if (skill && skill.currentLevel > 0) {
                        Game.skills.useSkill(skill.id);
                    }
                }
            } else if (key === 'f') {
                e.preventDefault();
                Game.combat.flee();
            } else if (key === 'a') {
                e.preventDefault();
                this.toggleAutoBattle();
            } else if (key === 'l') {
                e.preventDefault();
                this.toggleHotbarLock();
            }
        });

        // Initialize tooltips
        this.initializeTooltips();

        // Prevent multiple selection and dragging
        this.preventMultipleSelection();

        // Initial display update
        this.updateAll();
    }

    // Prevent multiple selection and dragging
    preventMultipleSelection() {
        // Prevent text selection on mousedown for interactive elements
        document.addEventListener('mousedown', (e) => {
            const target = e.target;
            const isInteractive = target.closest('.skill-item, .inventory-slot, .equipment-slot, .shop-item, .hotbar-slot, .combat-button');

            if (isInteractive) {
                e.preventDefault();
                // Clear any existing selection
                if (window.getSelection) {
                    window.getSelection().removeAllRanges();
                } else if (document.selection) {
                    document.selection.empty();
                }
            }
        });

        // Prevent drag start on interactive elements
        document.addEventListener('dragstart', (e) => {
            const target = e.target;
            const isInteractive = target.closest('.skill-item, .inventory-slot, .equipment-slot, .shop-item, .hotbar-slot');

            if (isInteractive) {
                e.preventDefault();
                return false;
            }
        });

        // Prevent context menu on interactive elements to avoid selection issues
        document.addEventListener('contextmenu', (e) => {
            const target = e.target;
            const isInteractive = target.closest('.skill-item, .inventory-slot, .equipment-slot, .shop-item, .hotbar-slot, .combat-button');

            if (isInteractive) {
                e.preventDefault();
                return false;
            }
        });
    }

    // Add visual feedback for interactions
    addButtonFeedback() {
        const attackButton = document.querySelector('.attack-button');
        if (attackButton) {
            attackButton.addEventListener('mousedown', () => {
                attackButton.style.transform = 'translateY(2px)';
            });
            
            attackButton.addEventListener('mouseup', () => {
                attackButton.style.transform = '';
            });
        }
    }

    // HELPER METHODS FOR HOTBAR SYSTEM
    saveHotbarConfig() {
        localStorage.setItem('ragnarok_hotbar', JSON.stringify(this.hotbarConfig));
    }

    loadHotbarConfig() {
        const saved = localStorage.getItem('ragnarok_hotbar');
        if (saved) {
            this.hotbarConfig = JSON.parse(saved);
        }
    }

    // Show loading state
    showLoading(message = "Loading...") {
        this.showMessage(message, 1000);
    }

    // Error handling for missing elements
    checkElements() {
        for (const [key, element] of Object.entries(this.elements)) {
            if (!element) {
                console.warn(`Missing UI element: ${key}`);
            }
        }
    }
}

// Achievement UI Functions
function showAchievementsPanel() {
    const modal = document.getElementById('achievements-modal');
    if (modal) {
        modal.style.display = 'flex';
        updateAchievementsDisplay();
        setupAchievementCategoryFilters();
    }
}

function closeAchievementsPanel() {
    const modal = document.getElementById('achievements-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function updateAchievementsDisplay(filterCategory = 'all') {
    if (!Game.achievements) return;

    const progressElement = document.getElementById('achievement-progress');
    const progressBarElement = document.getElementById('achievement-progress-bar');
    const listElement = document.getElementById('achievements-list');

    if (!progressElement || !progressBarElement || !listElement) return;

    // Update progress
    const completionPercentage = Game.achievements.getCompletionPercentage();
    const totalAchievements = Object.keys(ACHIEVEMENTS).length;
    const completedAchievements = Game.achievements.unlockedAchievements.size;

    progressElement.textContent = `${completionPercentage}% Complete (${completedAchievements}/${totalAchievements})`;
    progressBarElement.style.width = `${completionPercentage}%`;

    // Filter achievements
    let achievementsToShow = Object.values(ACHIEVEMENTS);
    if (filterCategory !== 'all') {
        achievementsToShow = achievementsToShow.filter(a => a.category === filterCategory);
    }

    // Sort: unlocked first, then by category
    achievementsToShow.sort((a, b) => {
        const aUnlocked = Game.achievements.unlockedAchievements.has(a.id);
        const bUnlocked = Game.achievements.unlockedAchievements.has(b.id);

        if (aUnlocked && !bUnlocked) return -1;
        if (!aUnlocked && bUnlocked) return 1;
        return a.name.localeCompare(b.name);
    });

    // Render achievements
    listElement.innerHTML = achievementsToShow.map(achievement => {
        const isUnlocked = Game.achievements.unlockedAchievements.has(achievement.id);
        const progress = Game.achievements.getAchievementProgress(achievement.id);
        const requirement = achievement.requirement.value;
        const progressPercentage = Math.min((progress / requirement) * 100, 100);

        return `
            <div class="achievement-item" style="
                background: ${isUnlocked ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 237, 78, 0.1))' : 'rgba(255,255,255,0.05)'};
                border: 2px solid ${isUnlocked ? 'var(--gold)' : 'var(--border-color)'};
                border-radius: 12px;
                padding: 16px;
                display: flex;
                align-items: center;
                gap: 16px;
                transition: all 0.3s ease;
                ${isUnlocked ? 'box-shadow: 0 4px 20px rgba(255, 215, 0, 0.3);' : ''}
            ">
                <div style="font-size: 2rem; ${isUnlocked ? '' : 'filter: grayscale(100%); opacity: 0.5;'}">${achievement.icon}</div>
                <div style="flex: 1;">
                    <div style="font-weight: bold; font-size: 1.1rem; color: ${isUnlocked ? 'var(--gold)' : 'var(--text-primary)'};">
                        ${achievement.name}
                        ${isUnlocked ? ' ✓' : ''}
                    </div>
                    <div style="color: var(--text-secondary); margin: 4px 0;">${achievement.description}</div>
                    <div style="font-size: 0.9rem; color: var(--text-secondary);">
                        Progress: ${progress}/${requirement} (${Math.floor(progressPercentage)}%)
                    </div>
                    <div style="width: 100%; height: 4px; background: rgba(255,255,255,0.2); border-radius: 2px; margin: 4px 0;">
                        <div style="width: ${progressPercentage}%; height: 100%; background: ${isUnlocked ? 'var(--gold)' : 'var(--blue)'}; border-radius: 2px; transition: width 0.3s ease;"></div>
                    </div>
                    <div style="font-size: 0.8rem; color: var(--gold);">
                        Reward: ${achievement.reward.gold ? `${achievement.reward.gold} gold` : ''} ${achievement.reward.exp ? `${achievement.reward.exp} exp` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function setupAchievementCategoryFilters() {
    const categoryButtons = document.querySelectorAll('.category-btn');

    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.style.background = 'rgba(255,255,255,0.1)';
                btn.style.color = 'var(--text-primary)';
            });

            // Add active class to clicked button
            button.classList.add('active');
            button.style.background = 'var(--blue)';
            button.style.color = 'white';

            // Update display
            const category = button.dataset.category;
            updateAchievementsDisplay(category);
        });
    });
}

// Global functions for UI interaction
window.showAchievementsPanel = showAchievementsPanel;
window.closeAchievementsPanel = closeAchievementsPanel;