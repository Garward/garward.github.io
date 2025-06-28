// enhanced-combat.js - Complete Enhanced Combat Area System for Ragnarok Online Clicker

class EnhancedCombatUI {
    constructor() {
        this.damageNumbers = [];
        this.backgroundType = 'field'; // 'field', 'dungeon', 'desert', etc.
    }

    // Initialize the enhanced combat area in your existing HTML
    initializeEnhancedCombatArea() {
        const battleArea = document.querySelector('.battle-area');
        if (!battleArea) {
            console.error('Battle area not found! Make sure you have a .battle-area element in your HTML.');
            return;
        }

        console.log('🎮 Initializing Enhanced Combat Area...');

        // Replace existing battle area content with enhanced version
        battleArea.innerHTML = this.getEnhancedCombatHTML();
        this.addEnhancedStyles();
        this.bindEvents();

        console.log('✅ Enhanced Combat Area initialized successfully!');
    }

    // Generate the enhanced combat HTML structure
    getEnhancedCombatHTML() {
        return `
            <div class="enhanced-combat-area">
                <!-- Dynamic Background -->
                <div class="pixel-background field" id="combat-background"></div>

                <!-- Status Effects Panel -->
                <div class="status-panel" id="enhanced-status-panel">
                    <div class="panel-title" onclick="toggleStatusPanel()" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
                        <span>⚡ Status Effects</span>
                        <span class="dropdown-arrow" id="status-arrow">▼</span>
                    </div>
                    <div id="enhanced-status-list" class="panel-content">
                        <div style="color: var(--text-secondary); font-size: 0.9rem;">No active effects</div>
                    </div>
                </div>

                <!-- Location Info Panel -->
                <div class="location-panel" id="enhanced-location-panel">
                    <div class="panel-title" onclick="toggleLocationPanel()" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
                        <span>🗺️ Location Info</span>
                        <span class="dropdown-arrow" id="location-arrow">▼</span>
                    </div>
                    <div id="enhanced-location-info" class="panel-content">
                        <div style="color: var(--text-secondary); font-size: 0.85rem;">Loading...</div>
                    </div>
                </div>

                <!-- Progression Panel -->
                <div class="progression-panel" id="enhanced-progression-panel">
                    <div class="panel-title" onclick="toggleProgressionPanel()" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
                        <span>📊 Progression</span>
                        <span class="dropdown-arrow" id="progression-arrow">▼</span>
                    </div>
                    <div id="enhanced-progression-info" class="panel-content">
                        <div style="color: var(--text-secondary); font-size: 0.85rem;">Loading...</div>
                    </div>
                </div>

                <!-- Combat Participants -->
                <div class="combat-participants">
                    <!-- Player (Warrior) -->
                    <div class="player-container">
                        <div class="player-info" id="enhanced-player-info">
                            <span id="player-name-level">Player - Lv.1</span>
                        </div>
                        <div class="player-sprite" id="enhanced-player-sprite"></div>
                    </div>

                    <!-- Monster -->
                    <div class="monster-container" id="enhanced-monster-container">
                        <div class="boss-crown" id="enhanced-boss-crown" style="display: none;">👑</div>
                        <div class="monster-info" id="enhanced-monster-info">
                            <div class="monster-name" id="enhanced-monster-name">No Monster</div>
                            <div class="monster-level" id="enhanced-monster-level">Lv.1 | DEF: 0</div>
                            <div class="monster-hp-bar">
                                <div class="monster-hp-fill" id="enhanced-monster-hp-fill" style="width: 100%;"></div>
                            </div>
                            <div class="monster-hp-text" id="enhanced-monster-hp-text">100 / 100</div>
                        </div>
                        <div class="monster-sprite" id="enhanced-monster-sprite">❓</div>
                    </div>
                </div>

                <!-- Combat Controls -->
                <div class="combat-controls">
                    <button class="combat-button start-battle-btn" id="enhanced-start-battle-btn">
                        ⚔️ Start Battle
                    </button>
                    <button class="combat-button attack-btn" id="enhanced-attack-btn" onclick="attackMonster()">
                        🗡️ Attack
                    </button>
                    <button class="combat-button flee-btn" id="enhanced-flee-btn" onclick="Game.combat.flee()">
                        🏃 Flee
                    </button>
                    <button class="combat-button auto-battle-btn" id="enhanced-auto-battle-btn">
                        🤖 Auto Battle
                    </button>
                </div>
            </div>
        `;
    }

    // Add enhanced styles to the page
    addEnhancedStyles() {
        if (document.getElementById('enhanced-combat-styles')) return;

        const style = document.createElement('style');
        style.id = 'enhanced-combat-styles';
        style.textContent = `
            /* Enhanced Combat Area Styles */
            .enhanced-combat-area {
                position: relative;
                width: 100%;
                height: 600px;
                background: linear-gradient(180deg, #87CEEB 0%, #87CEEB 35%, #90EE90 35%, #32CD32 100%);
                border-radius: 20px;
                overflow: hidden;
                box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8);
                margin: 20px auto;
                max-width: 1200px;
            }

            .pixel-background {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-size: cover;
                image-rendering: pixelated;
                image-rendering: -moz-crisp-edges;
                image-rendering: -webkit-crisp-edges;
                z-index: 1;
            }

            .pixel-background.field {
                background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"><rect width="800" height="210" fill="%2387CEEB"/><rect width="800" height="40" y="210" fill="%23B0E0E6"/><rect width="800" height="350" y="250" fill="%2390EE90"/><g fill="%2332CD32"><rect x="0" y="400" width="60" height="80"/><rect x="80" y="420" width="40" height="60"/><rect x="140" y="380" width="80" height="100"/><rect x="240" y="410" width="60" height="70"/><rect x="320" y="390" width="100" height="90"/><rect x="440" y="400" width="80" height="80"/><rect x="540" y="370" width="60" height="110"/><rect x="620" y="390" width="90" height="90"/><rect x="730" y="410" width="70" height="70"/></g><g fill="%23FFFFFF" opacity="0.8"><rect x="100" y="50" width="120" height="40" rx="20"/><rect x="300" y="30" width="160" height="50" rx="25"/><rect x="550" y="60" width="140" height="35" rx="17"/></g></svg>') center/cover;
            }

            .pixel-background.dungeon {
                background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"><rect width="800" height="600" fill="%23222"/><g fill="%23444"><rect x="0" y="0" width="800" height="100"/><rect x="0" y="500" width="800" height="100"/></g><g fill="%23333"><rect x="50" y="150" width="100" height="300"/><rect x="200" y="100" width="80" height="400"/><rect x="350" y="120" width="120" height="360"/><rect x="520" y="80" width="90" height="440"/><rect x="650" y="140" width="100" height="320"/></g><g fill="%23666"><rect x="0" y="450" width="800" height="50"/></g></svg>') center/cover;
            }

            .pixel-background.desert {
                background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"><rect width="800" height="200" fill="%23FFE4B5"/><rect width="800" height="400" y="200" fill="%23DEB887"/><g fill="%23D2691E"><rect x="100" y="350" width="80" height="150"/><rect x="250" y="380" width="60" height="120"/><rect x="400" y="340" width="100" height="160"/><rect x="580" y="370" width="70" height="130"/></g></svg>') center/cover;
            }

            .combat-participants {
                position: absolute;
                bottom: 100px;
                left: 0;
                right: 0;
                height: 300px;
                display: flex;
                align-items: flex-end;
                justify-content: space-between;
                padding: 0 100px;
                z-index: 10;
            }

            .player-container {
                position: relative;
                display: flex;
                flex-direction: column;
                align-items: center;
                z-index: 15;
            }

            .player-sprite {
                width: 120px;
                height: 120px;
                background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><g transform="scale(0.8) translate(8,4)"><rect x="24" y="8" width="16" height="16" fill="%23DEB887"/><rect x="20" y="12" width="8" height="4" fill="%23DEB887"/><rect x="36" y="12" width="8" height="4" fill="%23DEB887"/><rect x="26" y="10" width="4" height="4" fill="%23D2691E"/><rect x="34" y="10" width="4" height="4" fill="%23D2691E"/><rect x="28" y="14" width="8" height="2" fill="%23A0522D"/><rect x="16" y="24" width="32" height="20" fill="%23CD853F"/><rect x="20" y="26" width="8" height="16" fill="%23A9A9A9"/><rect x="36" y="26" width="8" height="16" fill="%23A9A9A9"/><rect x="24" y="28" width="16" height="12" fill="%23F4A460"/><rect x="16" y="44" width="12" height="16" fill="%23D2691E"/><rect x="36" y="44" width="12" height="16" fill="%23D2691E"/><rect x="12" y="32" width="16" height="8" fill="%23A0522D"/><rect x="40" y="32" width="16" height="8" fill="%23C0C0C0"/><rect x="54" y="30" width="8" height="12" fill="%23C0C0C0"/></g></svg>') center/contain;
                background-size: contain;
                image-rendering: pixelated;
                filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.5));
                animation: playerIdle 3s ease-in-out infinite;
            }

            @keyframes playerIdle {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-5px); }
            }

            .player-info {
                position: absolute;
                top: -60px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.8);
                border: 2px solid var(--blue);
                border-radius: 12px;
                padding: 8px 16px;
                backdrop-filter: blur(10px);
                font-size: 0.9rem;
                font-weight: 600;
                color: var(--blue);
                white-space: nowrap;
            }

            .monster-container {
                position: relative;
                display: flex;
                flex-direction: column;
                align-items: center;
                z-index: 15;
            }

            .monster-sprite {
                width: 150px;
                height: 150px;
                background: transparent; /* Remove the glass background */
                border: none; /* Remove the circular border */
                border-radius: 0; /* Remove rounded corners */
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 4rem;
                filter: drop-shadow(0 15px 30px rgba(0, 0, 0, 0.3)); /* Subtle shadow instead */
                animation: monsterFloat 2s ease-in-out infinite;
                transition: all 0.3s ease;
            }

            @keyframes monsterFloat {
                0%, 100% { transform: translateY(0px) scale(1); }
                50% { transform: translateY(-8px) scale(1.02); }
            }

            .monster-sprite.boss {
                border: none; /* Remove boss border too */
                box-shadow: none; /* Remove boss glow initially */
                animation: monsterFloat 2s ease-in-out infinite, bossGlow 1.5s ease-in-out infinite alternate;
            }

            @keyframes bossGlow {
                0% { 
                filter: drop-shadow(0 15px 30px rgba(0, 0, 0, 0.3)) brightness(1) hue-rotate(0deg);
            }
            100%{ 
                filter: drop-shadow(0 20px 40px rgba(255, 215, 0, 0.4)) brightness(1.2) hue-rotate(30deg);
                }
            }

            .monster-info {
                position: absolute;
                top: -80px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.9);
                border: 2px solid #ff6b6b;
                border-radius: 12px;
                padding: 12px 20px;
                backdrop-filter: blur(15px);
                min-width: 200px;
                text-align: center;
            }

            .monster-name {
                font-size: 1.2rem;
                font-weight: 700;
                color: #ff6b6b;
                margin-bottom: 4px;
            }

            .monster-level {
                font-size: 0.9rem;
                color: var(--text-secondary);
                margin-bottom: 8px;
            }

            .monster-hp-bar {
                width: 100%;
                height: 8px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 4px;
                overflow: hidden;
                margin-bottom: 4px;
            }

            .monster-hp-fill {
                height: 100%;
                background: linear-gradient(90deg, #ff4444, #ff6b6b);
                transition: width 0.3s ease;
                border-radius: 4px;
            }

            .monster-hp-text {
                font-size: 0.8rem;
                color: var(--text-primary);
            }

            .status-panel, .location-panel, .progression-panel {
                position: absolute;
                top: 20px;
                background: rgba(0, 0, 0, 0.85);
                border: 1px solid var(--border-color);
                border-radius: 12px;
                padding: 12px;
                backdrop-filter: blur(15px);
                max-width: 250px;
                z-index: 20;
                font-size: 0.85rem;
                transition: all 0.3s ease;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
                -webkit-touch-callout: none;
                -webkit-tap-highlight-color: transparent;
            }

            .status-panel {
                left: 20px;
            }

            .location-panel {
                right: 20px;
            }

            .progression-panel {
                right: 20px;
                top: 20px; /* Start at same position as location panel */
                transform: translateY(0); /* Will be adjusted dynamically */
            }

            .panel-content {
                transition: all 0.3s ease;
                overflow: hidden;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
                -webkit-touch-callout: none;
                -webkit-tap-highlight-color: transparent;
            }

            .panel-content.collapsed {
                max-height: 0;
                padding: 0;
                margin: 0;
                opacity: 0;
            }

            .dropdown-arrow {
                transition: transform 0.3s ease;
                font-size: 0.8rem;
                color: var(--text-secondary);
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
                -webkit-touch-callout: none;
                -webkit-tap-highlight-color: transparent;
            }

            .dropdown-arrow.collapsed {
                transform: rotate(-90deg);
            }

            .panel-title {
                font-weight: 700;
                color: var(--gold);
                margin-bottom: 8px;
                font-size: 1rem;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
                -webkit-touch-callout: none;
                -webkit-tap-highlight-color: transparent;
            }

            .combat-controls {
                position: absolute;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                display: flex;
                gap: 15px;
                z-index: 20;
            }

            .combat-button {
                padding: 12px 24px;
                border: none;
                border-radius: 12px;
                font-weight: 600;
                font-size: 1rem;
                cursor: pointer;
                transition: all 0.3s ease;
                backdrop-filter: blur(10px);
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
                min-width: 120px;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
                -webkit-touch-callout: none;
                -webkit-tap-highlight-color: transparent;
            }

            .start-battle-btn {
                background: linear-gradient(135deg, #4caf50, #388e3c);
                color: white;
            }

            .start-battle-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
            }

            .start-battle-btn.active {
                background: linear-gradient(135deg, #ff9800, #f57c00);
            }

            .start-battle-btn:disabled {
                opacity: 0.6;
                cursor: not-allowed;
                transform: none;
            }

            .attack-btn {
                background: linear-gradient(135deg, #ff6b6b, #ff4444);
                color: white;
            }

            .attack-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
            }

            .attack-btn:disabled {
                opacity: 0.6;
                cursor: not-allowed;
                transform: none;
                background: linear-gradient(135deg, #666, #555);
            }

            .flee-btn {
                background: linear-gradient(135deg, #ff9800, #f57c00);
                color: white;
            }

            .flee-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(255, 152, 0, 0.4);
            }

            .auto-battle-btn {
                background: linear-gradient(135deg, var(--blue), #29b6f6);
                color: white;
            }

            .auto-battle-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(79, 195, 247, 0.4);
            }

            .auto-battle-btn.active {
                background: linear-gradient(135deg, #ff9800, #f57c00);
            }

            .boss-crown {
                position: absolute;
                top: -40px;
                left: 50%;
                transform: translateX(-50%);
                font-size: 2rem;
                color: #ffd700;
                text-shadow: 0 0 10px rgba(255, 215, 0, 0.8);
                animation: crownBounce 2s ease-in-out infinite;
                z-index: 25;
            }

            @keyframes crownBounce {
                0%, 100% { transform: translateX(-50%) translateY(0); }
                50% { transform: translateX(-50%) translateY(-10px); }
            }

            .damage-number {
                position: absolute;
                font-size: 2rem;
                font-weight: 700;
                color: #ffd700;
                text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
                pointer-events: none;
                z-index: 30;
                animation: damageFloat 1.2s ease-out forwards;
            }

            .damage-number.crit {
                color: #ff1744;
                font-size: 2.5rem;
                text-shadow: 0 0 10px rgba(255, 23, 68, 0.8);
            }

            .damage-number.player-damage {
                color: #ff4444;
            }

            @keyframes damageFloat {
                0% { opacity: 1; transform: translateY(0) scale(1); }
                50% { transform: translateY(-30px) scale(1.2); }
                100% { opacity: 0; transform: translateY(-60px) scale(0.8); }
            }

            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-8px) rotate(-2deg); }
                75% { transform: translateX(8px) rotate(2deg); }
            }

            /* Responsive Design */
            @media (max-width: 768px) {
                .enhanced-combat-area { height: 500px; margin: 10px; }
                .combat-participants { padding: 0 50px; bottom: 80px; }
                .player-sprite, .monster-sprite { width: 100px; height: 100px; }
                .monster-sprite { font-size: 3rem; }
                .combat-controls { flex-direction: column; gap: 10px; }
                .combat-button { padding: 10px 20px; font-size: 0.9rem; min-width: 100px; }
                .status-panel, .location-panel { font-size: 0.8rem; padding: 8px; max-width: 180px; }
            }
        `;
        document.head.appendChild(style);
    }

    // Bind events to the enhanced combat area
    bindEvents() {
        // Start Battle button event
        const startBattleBtn = document.getElementById('enhanced-start-battle-btn');
        if (startBattleBtn && Game.combat) {
            startBattleBtn.onclick = null;
            startBattleBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                Game.combat.startBattle();
                this.updateBattleButtons();
            });
        }

        // Auto battle button event
        const autoBattleBtn = document.getElementById('enhanced-auto-battle-btn');
        if (autoBattleBtn && Game.ui) {
            autoBattleBtn.onclick = null;
            autoBattleBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                Game.ui.toggleAutoBattle();
                setTimeout(() => this.updateAutoBattleButton(), 100);
            });
        }

        // Attack button - disable until battle starts
        const attackBtn = document.getElementById('enhanced-attack-btn');
        if (attackBtn) {
            this.updateBattleButtons();
        }
    }

    // Update player display in enhanced UI
    updatePlayerDisplay() {
        const playerInfo = document.getElementById('enhanced-player-info');
        const playerSprite = document.getElementById('enhanced-player-sprite');
        
        if (playerInfo && Game.player) {
            const stats = Game.player.getDisplayStats();
            playerInfo.innerHTML = `${stats.name} - Lv.${stats.level}`;
            
            // Custom sprite loading based on player class
        if (playerSprite) {
            let spritePath = '';
            
            if (Game.player.isDragonKnight) {
                spritePath = 'sprites/characters/dragon-knight.png';
                playerSprite.style.borderColor = '#ff6b6b';
                playerSprite.style.boxShadow = '0 0 20px rgba(255, 107, 107, 0.6)';
            } else {
                spritePath = 'sprites/characters/swordsman.png';
                playerSprite.style.borderColor = '#4fc3f7';
                playerSprite.style.boxShadow = '0 0 20px rgba(79, 195, 247, 0.6)';
            }
            
            // Load the sprite with fallback
            const img = document.createElement('img');
            img.src = spritePath;
            img.style.cssText = `
                width: 100%;
                height: 100%;
                image-rendering: pixelated;
                image-rendering: -moz-crisp-edges;
                image-rendering: -webkit-crisp-edges;
                object-fit: contain;
            `;
            
            img.onload = () => {
                playerSprite.innerHTML = '';
                playerSprite.appendChild(img);
                console.log(`✅ Loaded player sprite: ${spritePath}`);
            };
            
            img.onerror = () => {
                console.warn(`⚠️ Failed to load sprite: ${spritePath}, using fallback`);
                // Keep the SVG fallback
                playerSprite.style.background = `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><!-- SVG warrior data --></svg>') center/contain`;
            };
        }
    }
}

    // Update monster display in enhanced UI
    updateMonsterDisplay() {
        if (!Game.combat || !Game.combat.currentMonster) return;

        const monster = Game.combat.getMonsterInfo();
        if (!monster) return;

        // Update monster info
        const monsterName = document.getElementById('enhanced-monster-name');
        const monsterLevel = document.getElementById('enhanced-monster-level');
        const monsterHpFill = document.getElementById('enhanced-monster-hp-fill');
        const monsterHpText = document.getElementById('enhanced-monster-hp-text');
        const monsterSprite = document.getElementById('enhanced-monster-sprite');
        const bossIcon = document.getElementById('enhanced-boss-crown');

        if (monsterName) monsterName.textContent = monster.name;
        if (monsterLevel) monsterLevel.textContent = `Lv.${monster.level} | DEF: ${monster.def}`;
        if (monsterHpFill) monsterHpFill.style.width = monster.hpPercent + '%';
        if (monsterHpText) monsterHpText.textContent = `${monster.currentHp} / ${monster.maxHp}`;

        // Update monster sprite
        if (monsterSprite) {
            if (monster.spriteUrl) {
                // Try to load actual sprite
                const img = document.createElement('img');
                img.src = monster.spriteUrl;
                img.style.cssText = `
                    width: 80%;
                    height: 80%;
                    image-rendering: pixelated;
                    object-fit: contain;
                `;
                img.onload = () => {
                    monsterSprite.innerHTML = '';
                    monsterSprite.appendChild(img);
                };
                img.onerror = () => {
                    monsterSprite.innerHTML = monster.emoji;
                };
            } else {
                monsterSprite.innerHTML = monster.emoji;
            }

            // Boss styling
            if (monster.isBoss) {
                monsterSprite.classList.add('boss');
                if (bossIcon) bossIcon.style.display = 'block';
            } else {
                monsterSprite.classList.remove('boss');
                if (bossIcon) bossIcon.style.display = 'none';
            }
        }
    }

    // Update location background and info
    // Replace the updateLocationDisplay method in enhanced-combat.js with this:

updateLocationDisplay() {
    const locationInfo = document.getElementById('enhanced-location-info');
    if (!locationInfo) return;

    const location = Game.player.state.currentLocation;
    
    // Get location data safely with fallbacks
    let locationData = { 
        name: 'Current Area', 
        type: 'field', 
        averageLevel: Game.player.level, 
        description: 'Adventure awaits...' 
    };
    
    // Try to get proper location data
    if (typeof MonsterUtils !== 'undefined' && MonsterUtils.getLocationData) {
        try {
            locationData = MonsterUtils.getLocationData(location);
        } catch (e) {
            console.warn('Could not get location data:', e);
        }
    }
    
    // Get difficulty info safely
    let difficultyInfo = locationData;
    if (Game.combat && typeof Game.combat.getLocationDifficultyInfo === 'function') {
        try {
            difficultyInfo = Game.combat.getLocationDifficultyInfo();
        } catch (e) {
            console.warn('Could not get difficulty info, using fallback:', e);
            difficultyInfo = locationData;
        }
    }

    // Calculate difficulty safely
    const playerLevel = Game.player ? Game.player.level : 1;
    const locationLevel = difficultyInfo.averageLevel || locationData.averageLevel || 1;
    const levelDiff = locationLevel - playerLevel;
    
    let difficultyText = '✅ Balanced';
    let difficultyColor = '#4caf50';

    if (levelDiff > 20) {
        difficultyText = '💀 EXTREMELY DANGEROUS';
        difficultyColor = '#9c27b0';
    } else if (levelDiff > 10) {
        difficultyText = '🔥 Very Challenging';
        difficultyColor = '#f44336';
    } else if (levelDiff > 5) {
        difficultyText = '⚔️ Challenging';
        difficultyColor = '#ff9800';
    } else if (levelDiff < -10) {
        difficultyText = '😴 Too Easy';
        difficultyColor = '#666';
    }

    // Determine location type
    const isDungeon = difficultyInfo.type === 'dungeon' || locationData.type === 'dungeon';
    const locationType = isDungeon ? '⚔️ Dungeon' : '🌱 Field';
    const bonusText = isDungeon ? 
        '<br>⚔️ +50% EXP/Gold<br>⚠️ No auto-heal' : 
        '<br>🌱 Auto-heal between fights';

    // Get the display name
    const displayName = difficultyInfo.name || locationData.name || 'Current Area';
    const description = difficultyInfo.description || locationData.description || 'Adventure awaits...';

    locationInfo.innerHTML = `
        <div style="font-weight: bold; color: var(--gold); margin-bottom: 6px;">
            ${locationType} - ${displayName}
        </div>
        <div style="font-size: 0.75rem; margin-bottom: 6px;">
            ${description}
        </div>
        <div style="color: ${difficultyColor}; font-weight: bold; margin-bottom: 4px;">
            ${difficultyText}
        </div>
        <div style="font-size: 0.75rem; color: var(--text-secondary);">
            Player Lv.${playerLevel} | Area Lv.${locationLevel}${bonusText}
        </div>
    `;
}

    // Update status effects display
    updateStatusEffectsDisplay() {
        const statusList = document.getElementById('enhanced-status-list');
        if (!statusList || !Game.skills) return;

        const effects = Game.skills.statusEffects;

        if (effects.size === 0) {
            statusList.innerHTML = '<div style="color: var(--text-secondary); font-size: 0.9rem;">No active effects</div>';
            return;
        }

        let effectsHTML = '';
        effects.forEach((effect, id) => {
            const timeLeft = (effect.duration / 1000).toFixed(1);
            effectsHTML += `
                <div style="margin-bottom: 4px;">
                    <span style="font-size: 1.1em;">${effect.icon}</span>
                    <span style="color: #ffd700; font-weight: bold;">${effect.name}</span>
                    <span style="color: #4fc3f7; font-size: 0.8em;">(${timeLeft}s)</span>
                </div>
            `;
        });

        statusList.innerHTML = effectsHTML;
    }

    // Update battle button states
    updateBattleButtons() {
        const startBattleBtn = document.getElementById('enhanced-start-battle-btn');
        const attackBtn = document.getElementById('enhanced-attack-btn');

        if (!Game.combat) return;

        const battleActive = Game.combat.battleActive || false;

        // Update Start Battle button
        if (startBattleBtn) {
            if (battleActive) {
                startBattleBtn.textContent = '⚔️ Battle Active';
                startBattleBtn.classList.add('active');
                startBattleBtn.disabled = true;
            } else {
                startBattleBtn.textContent = '⚔️ Start Battle';
                startBattleBtn.classList.remove('active');
                startBattleBtn.disabled = false;
            }
        }

        // Update Attack button
        if (attackBtn) {
            if (battleActive) {
                attackBtn.disabled = false;
                attackBtn.style.opacity = '1';
            } else {
                attackBtn.disabled = true;
                attackBtn.style.opacity = '0.6';
            }
        }
    }

    // Update auto battle button state
    updateAutoBattleButton() {
        const btn = document.getElementById('enhanced-auto-battle-btn');
        if (!btn || !Game.ui) return;

        if (Game.ui.autoBattle) {
            btn.classList.add('active');
            btn.textContent = '⏸️ Pause Battle';
            btn.style.background = 'linear-gradient(135deg, #ff9800, #f57c00)';
        } else {
            btn.classList.remove('active');
            btn.textContent = '⚔️ Auto Battle';
            btn.style.background = 'linear-gradient(135deg, var(--blue), #29b6f6)';
        }
    }

    // Show enhanced damage numbers
    showDamageNumber(damage, isCrit = false, isPlayerDamage = false) {
        const combatArea = document.querySelector('.enhanced-combat-area');
        if (!combatArea) return;

        const damageElement = document.createElement('div');
        damageElement.className = 'damage-number';
        
        if (isCrit) {
            damageElement.classList.add('crit');
            damageElement.textContent = damage + '!';
        } else if (isPlayerDamage) {
            damageElement.classList.add('player-damage');
            damageElement.textContent = '-' + damage;
        } else {
            damageElement.textContent = damage;
        }

        // Position based on target
        if (isPlayerDamage) {
            damageElement.style.left = Math.random() * 100 + 150 + 'px';
            damageElement.style.top = '350px';
        } else {
            damageElement.style.left = Math.random() * 150 + 650 + 'px';
            damageElement.style.top = '300px';
        }

        combatArea.appendChild(damageElement);

        // Remove after animation
        setTimeout(() => {
            if (damageElement.parentNode) {
                damageElement.remove();
            }
        }, 1200);
    }

    // Animate monster hit
    animateMonsterHit() {
        const monster = document.getElementById('enhanced-monster-sprite') || document.getElementById('monster-sprite');
        if (!monster) return;

            monster.style.animation = 'none';
            monster.offsetHeight; // Trigger reflow
            monster.style.animation = 'monsterFloat 2s ease-in-out infinite, shake 0.4s ease-in-out';
        
            setTimeout(() => {
            monster.style.animation = 'monsterFloat 2s ease-in-out infinite';
            }, 400);
    }

    // Update progression display in enhanced UI
    updateProgressionDisplay() {
        const progressionInfo = document.getElementById('enhanced-progression-info');
        if (!progressionInfo || !Game.player) return;

        const player = Game.player;
        const currentLocation = player.state.currentLocation;

        // Get area progression info
        const currentProgress = player.getAreaProgress(currentLocation);
        const monstersLeft = Math.max(0, 20 - currentProgress);
        const progressPercent = Math.floor((currentProgress / 20) * 100);

        // Check if next area is available
        const allAreas = player.getAllAreasInOrder();
        const currentIndex = allAreas.findIndex(area => area.key === currentLocation);
        const nextArea = currentIndex !== -1 && currentIndex < allAreas.length - 1 ?
            allAreas[currentIndex + 1] : null;

        let areaProgressHTML = '';
        if (monstersLeft > 0 && nextArea) {
            areaProgressHTML = `
                <div style="margin-bottom: 6px;">
                    <div style="font-size: 0.75rem; margin-bottom: 2px;">🗺️ Area Progress (${progressPercent}%)</div>
                    <div style="width: 100%; height: 4px; background: rgba(255,255,255,0.2); border-radius: 2px;">
                        <div style="width: ${progressPercent}%; height: 100%; background: linear-gradient(90deg, #4caf50, #8bc34a); border-radius: 2px; transition: width 0.3s ease;"></div>
                    </div>
                    <div style="font-size: 0.7rem; color: var(--text-secondary);">
                        ${monstersLeft} monsters left → ${nextArea.name}
                    </div>
                </div>
            `;
        } else if (monstersLeft === 0 && nextArea) {
            areaProgressHTML = `
                <div style="margin-bottom: 6px;">
                    <div style="color: #4caf50; font-size: 0.75rem; font-weight: bold;">✅ Area Complete!</div>
                    <div style="font-size: 0.7rem; color: var(--text-secondary);">
                        ${nextArea.name} unlocked!
                    </div>
                </div>
            `;
        } else if (!nextArea) {
            areaProgressHTML = `
                <div style="margin-bottom: 6px;">
                    <div style="color: #ff9800; font-size: 0.75rem; font-weight: bold;">🏆 Final Area!</div>
                    <div style="font-size: 0.7rem; color: var(--text-secondary);">
                        All areas unlocked!
                    </div>
                </div>
            `;
        }

        // Get next milestone
        const playerLevel = Game.player.level;
        const milestones = [
            { level: 10, text: "Basic Equipment", reward: "New gear available" },
            { level: 25, text: "Intermediate Areas", reward: "Access tougher dungeons" },
            { level: 50, text: "Advanced Training", reward: "Better skill scaling" },
            { level: 100, text: "Dragon Knight Rebirth", reward: "Unlock Dragon powers" }
        ];

        const nextMilestone = milestones.find(m => m.level > playerLevel);
        let milestoneHTML = '';

        if (nextMilestone) {
            const progress = Math.round((playerLevel / nextMilestone.level) * 100);
            milestoneHTML = `
                <div style="margin-bottom: 6px;">
                    <div style="font-size: 0.75rem; margin-bottom: 2px;">Next: ${nextMilestone.text}</div>
                    <div style="width: 100%; height: 4px; background: rgba(255,255,255,0.2); border-radius: 2px;">
                        <div style="width: ${progress}%; height: 100%; background: #ffd700; border-radius: 2px;"></div>
                    </div>
                    <div style="font-size: 0.7rem; color: var(--text-secondary);">Lv.${playerLevel}/${nextMilestone.level}</div>
                </div>
            `;
        } else {
            milestoneHTML = '<div style="color: #9c27b0; font-size: 0.75rem;">🐉 Dragon Knight Achieved!</div>';
        }

        progressionInfo.innerHTML = `
            ${areaProgressHTML}
            ${milestoneHTML}
        `;
    }

    // Update panel positioning to prevent overlaps
    updatePanelPositioning() {
        const locationPanel = document.getElementById('enhanced-location-panel');
        const progressionPanel = document.getElementById('enhanced-progression-panel');

        if (!locationPanel || !progressionPanel) return;

        // Get the height of the location panel
        const locationHeight = locationPanel.offsetHeight;
        const gap = 20; // Gap between panels

        // Position progression panel below location panel
        progressionPanel.style.transform = `translateY(${locationHeight + gap}px)`;
    }

    // Update all enhanced UI elements
    updateAll() {
        this.updatePlayerDisplay();
        this.updateMonsterDisplay();
        this.updateLocationDisplay();
        this.updateStatusEffectsDisplay();
        this.updateBattleButtons();
        this.updateAutoBattleButton();
        this.updateProgressionDisplay();
        this.updatePanelPositioning();
    }
}

// Integration with existing Display class
if (typeof Display !== 'undefined') {
    // Add enhanced combat initialization method
    Display.prototype.initializeEnhancedCombat = function() {
        if (!this.enhancedCombatUI) {
            this.enhancedCombatUI = new EnhancedCombatUI();
            this.enhancedCombatUI.initializeEnhancedCombatArea();
            console.log('✅ Enhanced Combat Area initialized!');
        }
    };

    // Override existing methods to use enhanced UI
    const originalUpdateMonsterDisplay = Display.prototype.updateMonsterDisplay;
    Display.prototype.updateMonsterDisplay = function() {
        // Call original method
        if (originalUpdateMonsterDisplay) {
            originalUpdateMonsterDisplay.call(this);
        }
        
        // Update enhanced UI if available
        if (this.enhancedCombatUI) {
            this.enhancedCombatUI.updateMonsterDisplay();
        }
    };

    const originalUpdatePlayerDisplay = Display.prototype.updatePlayerDisplay;
    Display.prototype.updatePlayerDisplay = function() {
        // Call original method
        if (originalUpdatePlayerDisplay) {
            originalUpdatePlayerDisplay.call(this);
        }
        
        // Update enhanced UI if available
        if (this.enhancedCombatUI) {
            this.enhancedCombatUI.updatePlayerDisplay();
        }
    };

    const originalShowDamageNumber = Display.prototype.showDamageNumber;
    Display.prototype.showDamageNumber = function(damage, isCrit = false) {
        // Call original method
        if (originalShowDamageNumber) {
            originalShowDamageNumber.call(this, damage, isCrit);
        }
        
        // Show enhanced damage number
        if (this.enhancedCombatUI) {
            this.enhancedCombatUI.showDamageNumber(damage, isCrit, false);
        }
    };

    const originalAnimateMonsterHit = Display.prototype.animateMonsterHit;
    Display.prototype.animateMonsterHit = function() {
        // Call original method
        if (originalAnimateMonsterHit) {
            originalAnimateMonsterHit.call(this);
        }
        
        // Animate enhanced monster
        if (this.enhancedCombatUI) {
            this.enhancedCombatUI.animateMonsterHit();
        }
    };

    const originalUpdateStatusEffectsDisplay = Display.prototype.updateStatusEffectsDisplay;
    Display.prototype.updateStatusEffectsDisplay = function() {
        // Call original method
        if (originalUpdateStatusEffectsDisplay) {
            originalUpdateStatusEffectsDisplay.call(this);
        }
        
        // Update enhanced status effects
        if (this.enhancedCombatUI) {
            this.enhancedCombatUI.updateStatusEffectsDisplay();
        }
    };

    const originalUpdateProgressionPanel = Display.prototype.updateProgressionPanel;
    Display.prototype.updateProgressionPanel = function() {
        // Call original method
        if (originalUpdateProgressionPanel) {
            originalUpdateProgressionPanel.call(this);
        }

        // Update enhanced progression display
        if (this.enhancedCombatUI) {
            this.enhancedCombatUI.updateProgressionDisplay();
        }
    };

    const originalUpdateAll = Display.prototype.updateAll;
    Display.prototype.updateAll = function() {
        // Call original method
        if (originalUpdateAll) {
            originalUpdateAll.call(this);
        }

        // Update enhanced UI
        if (this.enhancedCombatUI) {
            this.enhancedCombatUI.updateAll();
        }
    };
}

// Integration with existing Combat class
if (typeof Combat !== 'undefined') {
    const originalShowPlayerDamage = Combat.prototype.showPlayerDamage;
    Combat.prototype.showPlayerDamage = function(damage) {
        // Call original method
        if (originalShowPlayerDamage) {
            originalShowPlayerDamage.call(this, damage);
        }
        
        // Show enhanced player damage
        if (Game.ui && Game.ui.enhancedCombatUI) {
            Game.ui.enhancedCombatUI.showDamageNumber(damage, false, true);
        }
    };
}

// Add to window for global access
window.EnhancedCombatUI = EnhancedCombatUI;

console.log('✅ Enhanced Combat Area system loaded! Call Game.ui.initializeEnhancedCombat() to activate.');

// Auto-initialize if Game is already loaded
if (typeof Game !== 'undefined' && Game.ui) {
    setTimeout(() => {
        console.log('🎮 Auto-initializing Enhanced Combat Area...');
        Game.ui.initializeEnhancedCombat();
    }, 1000);
}

// Global functions for panel toggling
window.toggleLocationPanel = function() {
    const content = document.getElementById('enhanced-location-info');
    const arrow = document.getElementById('location-arrow');

    if (content && arrow) {
        const isCollapsed = content.classList.contains('collapsed');

        if (isCollapsed) {
            content.classList.remove('collapsed');
            arrow.classList.remove('collapsed');
            arrow.textContent = '▼';
        } else {
            content.classList.add('collapsed');
            arrow.classList.add('collapsed');
            arrow.textContent = '▶';
        }

        // Update positioning after toggle
        setTimeout(() => {
            if (Game.ui && Game.ui.enhancedCombatUI) {
                Game.ui.enhancedCombatUI.updatePanelPositioning();
            }
        }, 300); // Wait for animation to complete
    }
};

window.toggleProgressionPanel = function() {
    const content = document.getElementById('enhanced-progression-info');
    const arrow = document.getElementById('progression-arrow');

    if (content && arrow) {
        const isCollapsed = content.classList.contains('collapsed');

        if (isCollapsed) {
            content.classList.remove('collapsed');
            arrow.classList.remove('collapsed');
            arrow.textContent = '▼';
        } else {
            content.classList.add('collapsed');
            arrow.classList.add('collapsed');
            arrow.textContent = '▶';
        }
    }
};

window.toggleStatusPanel = function() {
    const content = document.getElementById('enhanced-status-list');
    const arrow = document.getElementById('status-arrow');

    if (content && arrow) {
        const isCollapsed = content.classList.contains('collapsed');

        if (isCollapsed) {
            content.classList.remove('collapsed');
            arrow.classList.remove('collapsed');
            arrow.textContent = '▼';
        } else {
            content.classList.add('collapsed');
            arrow.classList.add('collapsed');
            arrow.textContent = '▶';
        }
    }
};