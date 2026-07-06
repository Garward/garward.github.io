// main.js - Game initialization and main game loop

// Declare global variables first
let Game;

class CharacterManager {
    constructor() {
        this.maxSlots = 9;
        this.characters = this.loadAllCharacters();
    }

    loadAllCharacters() {
        const saved = localStorage.getItem(SAVE_KEYS.characters);
        if (saved) {
            return JSON.parse(saved);
        }
        return Array(this.maxSlots).fill(null);
    }

    saveAllCharacters() {
        localStorage.setItem(SAVE_KEYS.characters, JSON.stringify(this.characters));
    }

    saveCharacter(slot, characterData) {
        if (slot >= 0 && slot < this.maxSlots) {
            // Get current inventory, skills, and status effects with deep copy to prevent reference issues
            const currentInventory = Game.equipment ? JSON.parse(JSON.stringify(Game.equipment.inventory)) : [];
            const currentSkills = Game.skills ? JSON.parse(JSON.stringify(Game.skills.activeSkills)) : [];
            const currentStatusEffects = Game.skills ? Array.from(Game.skills.statusEffects.entries()) : [];

            // Count items for logging
            const itemCount = currentInventory.filter(item => item).length;
            const learnedSkills = currentSkills.filter(skill => skill.currentLevel > 0).length;
            const activeEffects = currentStatusEffects.length;
            const unlockedAreas = characterData.unlockedAreas ? characterData.unlockedAreas.length : 1;

            this.characters[slot] = {
                ...characterData,
                inventory: currentInventory,
                skills: currentSkills,
                statusEffects: currentStatusEffects,
                // Ensure area progression is saved
                areaProgress: characterData.areaProgress || {},
                unlockedAreas: characterData.unlockedAreas || ["verdant_meadow"],
                savedAt: Date.now(),
                slot: slot
            };
            this.saveAllCharacters();

            console.log(`💾 Saved character "${characterData.name}" to slot ${slot}:`);
            console.log(`   📦 ${itemCount} items in inventory`);
            console.log(`   ⚔️ ${learnedSkills} learned skills`);
            console.log(`   ✨ ${activeEffects} active status effects`);
            console.log(`   🗺️ ${unlockedAreas} areas unlocked`);
            console.log(`   💰 ${characterData.gold} gold`);
            console.log(`   📊 Level ${characterData.level}`);
        }
    }

    loadCharacter(slot) {
        if (slot >= 0 && slot < this.maxSlots && this.characters[slot]) {
            return this.characters[slot];
        }
        return null;
    }

    deleteCharacter(slot) {
        if (slot >= 0 && slot < this.maxSlots) {
            this.characters[slot] = null;
            this.saveAllCharacters();
        }
    }

    getCharacterList() {
        return this.characters.map((char, index) => ({
            slot: index,
            character: char
        }));
    }

    // Load character with all their data (inventory, skills, etc.)
    loadCharacterWithData(slot) {
        const character = this.loadCharacter(slot);
        if (!character) {
            console.error(`❌ No character found in slot ${slot}`);
            return false;
        }

        console.log(`🔄 Loading character "${character.name}" from slot ${slot}`);

        // Load character stats
        Game.player.state = { ...Game.player.state, ...character };
        Game.player.state.currentSlot = slot;

        // Ensure area progression is loaded
        if (!Game.player.state.areaProgress) {
            Game.player.state.areaProgress = {};
        }
        if (!Game.player.state.unlockedAreas) {
            Game.player.state.unlockedAreas = ["verdant_meadow"];
        }

        // Load inventory
        if (Game.equipment) {
            if (character.inventory && Array.isArray(character.inventory)) {
                // Deep copy to prevent reference issues
                Game.equipment.inventory = JSON.parse(JSON.stringify(character.inventory));
                const itemCount = character.inventory.filter(item => item).length;
                console.log(`   📦 Loaded ${itemCount} items`);
            } else {
                Game.equipment.inventory = new Array(240).fill(null); // Fixed: Use correct inventory size
                console.log(`   📦 No inventory data, starting with empty inventory`);
            }
        }

        // Load skills using modular class system
        if (Game.skills) {
            // Determine the correct class for skill loading
            let characterClass = character.classId || "swordsman";

            if (character.isDragonKnight) {
                characterClass = "dragon_knight";
            } else if (character.isArchMage) {
                characterClass = "arch_mage";
            } else if (!character.classId && character.class) {
                characterClass = character.class.toLowerCase();
            }

            console.log(`   🎯 Loading skills for class: ${characterClass}`);

            // Switch to the correct skill set
            Game.skills.switchToClass(characterClass);

            // Apply saved skill levels if they exist
            if (character.skills && Array.isArray(character.skills)) {
                let learnedSkillsCount = 0;
                character.skills.forEach(savedSkill => {
                    const currentSkill = Game.skills.activeSkills.find(s => s.id === savedSkill.id);
                    if (currentSkill && savedSkill.currentLevel > 0) {
                        currentSkill.currentLevel = savedSkill.currentLevel;
                        learnedSkillsCount++;
                    }
                });
                console.log(`   ⚔️ Loaded ${learnedSkillsCount} learned skills`);
            } else {
                console.log(`   ⚔️ No skill data, starting with base skills`);
            }
        }

        // Load status effects if available
        if (character.statusEffects && Game.skills) {
            // Convert array back to Map and adjust remaining time
            Game.skills.statusEffects = new Map();
            const currentTime = Date.now();
            let loadedEffects = 0;

            character.statusEffects.forEach(([id, effect]) => {
                // Calculate how much time has passed since save
                const timePassed = currentTime - effect.startTime;
                const remainingTime = effect.duration - timePassed;

                // Only restore effects that still have time remaining
                if (remainingTime > 0) {
                    effect.duration = remainingTime;
                    Game.skills.statusEffects.set(id, effect);
                    loadedEffects++;
                }
            });

            console.log(`   ✨ Loaded ${loadedEffects} active status effects`);

            // Update UI to show restored effects
            if (Game.ui) {
                Game.ui.updateStatusEffectsDisplay();
            }
        } else {
            // Initialize empty status effects if none saved
            if (Game.skills) {
                Game.skills.statusEffects = new Map();
            }
        }

        console.log(`✅ Successfully loaded character "${character.name}"`);
        return true;
    }

    selectCharacter(slot) {
        console.log(`🔄 Switching from slot ${this.getCurrentCharacterSlot()} to slot ${slot}`);
        
        // STEP 1: Save current character's data BEFORE switching
        const currentSlot = this.getCurrentCharacterSlot();
        if (currentSlot !== slot && Game.player.state.name) {
            console.log(`💾 Saving current character data from slot ${currentSlot}`);
            this.saveCurrentCharacter();
        }
        
        // STEP 2: Load new character's data
        if (this.loadCharacterWithData(slot)) {
            // Close selector
            const modal = document.getElementById('character-selector-modal');
            if (modal) modal.remove();
            
            // STEP 3: Restart game with new character
            Game.restartWithCharacter();
            
            console.log(`✅ Successfully switched to character in slot ${slot}`);
        } else {
            console.error(`❌ Failed to load character from slot ${slot}`);
        }
    }

    createNewCharacter(slot) {
        console.log(`🆕 Creating new character in slot ${slot}`);
        
        // Save current character before creating new one
        if (Game.player.state.name) {
            console.log(`💾 Saving current character before creating new one`);
            this.saveCurrentCharacter();
        }
        
        // Close selector
        const modal = document.getElementById('character-selector-modal');
        if (modal) modal.remove();
        
        // Reset player to fresh state for new character
        Game.player.state = {
            name: "",
            class: "swordsman", // Use lowercase for consistency
            level: 1,
            hp: 150,
            maxHp: 150,
            mp: 50,
            maxMp: 50,
            atk: 25,
            matk: 10,
            def: 0,
            mdef: 0,
            exp: 0,
            maxExp: 100,
            skillPoints: 0,
            gold: 100,
            equipped: {
                helmet: null,
                chestplate: null,
                leggings: null,
                boots: null,
                sword: null,
                shield: null
            },
            classId: "swordsman",
            classState: {},
            rebirthCount: 0,
            currentLocation: "verdant_meadow",
            isNewPlayer: true,
            currentSlot: slot
        };

        // Clear inventory and reset skills to default swordsman
        if (Game.equipment) {
            Game.equipment.inventory = new Array(240).fill(null); // Fixed: Use correct inventory size
            Game.equipment.favorites = new Array(48).fill(null); // Initialize favorites
        }
        if (Game.skills) {
            Game.skills.switchToClass("swordsman"); // Use modular system
        }
        
        // Show character creation
        Game.showCharacterCreation();
    }

    showCharacterSelector() {
        // Save current character before showing selector
        if (Game.player.state.name) {
            console.log(`💾 Auto-saving current character before showing selector`);
            this.saveCurrentCharacter();
        }
        
        // Remove existing selector
        const existing = document.getElementById('character-selector-modal');
        if (existing) existing.remove();

        const dialog = UIPrimitives.createDialog({
            id: 'character-selector-modal',
            title: 'Select Character',
            icon: '👥',
            size: 'lg',
            closeLabel: 'Close character selector'
        });

        const grid = UIPrimitives.createElement('div', {
            id: 'character-grid',
            className: 'character-grid'
        });
        const footer = UIPrimitives.createElement('div', {
            className: 'ui-control-row',
            attributes: { style: 'justify-content: center; margin-top: 18px;' }
        }, UIPrimitives.createButton({
            label: 'Close',
            variant: 'secondary',
            onClick: () => dialog.close()
        }));

        dialog.body.appendChild(grid);
        dialog.body.appendChild(footer);
        document.body.appendChild(dialog.overlay);

        this.renderCharacterGrid();
    }

    renderCharacterGrid() {
        const grid = document.getElementById('character-grid');
        if (!grid) return;

        grid.innerHTML = '';

        for (let i = 0; i < this.maxSlots; i++) {
            const character = this.characters[i];

            if (character) {
                // Count items for display
                const itemCount = character.inventory ? character.inventory.filter(item => item).length : 0;
                const currentSlot = this.getCurrentCharacterSlot();
                const isCurrentCharacter = i === currentSlot;
                
                // Existing character
                const resolveClassId = (char) => {
                    if (char.classId) return char.classId;
                    if (char.isDragonKnight) return 'dragon_knight';
                    if (char.isArchMage) return 'arch_mage';
                    return (char.class || 'swordsman').toLowerCase();
                };

                const CLASS_ICONS = {
                    dragon_knight: '🐉', arch_mage: '🧙‍♂️', mage: '🔮',
                    rogue: '🗡️', shadowblade: '🌑', berserker: '🪓', ravager: '💢',
                    summoner: '🐾', archon: '👁️'
                };

                const getClassIcon = (char) => CLASS_ICONS[resolveClassId(char)] || '⚔️';

                const getClassDisplayName = (char) => {
                    const id = resolveClassId(char);
                    if (typeof ClassKit !== 'undefined' && ClassKit.get(id)) return ClassKit.get(id).name;
                    return id.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                };

                const slot = UIPrimitives.createCard({
                    className: 'character-slot-card',
                    selected: isCurrentCharacter,
                    disabled: isCurrentCharacter,
                    ariaLabel: `${character.name}, ${getClassDisplayName(character)}, level ${character.level}`,
                    onClick: () => this.selectCharacter(i)
                }, [
                    UIPrimitives.createElement('div', { className: 'character-slot-icon', text: getClassIcon(character) }),
                    UIPrimitives.createElement('div', {
                        className: 'character-slot-name',
                        text: `${character.name}${isCurrentCharacter ? ' (Current)' : ''}`
                    }),
                    UIPrimitives.createElement('div', { className: 'character-slot-class', text: getClassDisplayName(character) }),
                    UIPrimitives.createElement('div', { className: 'character-slot-meta', text: `Level ${character.level}` }),
                    UIPrimitives.createElement('div', {
                        className: 'character-slot-gold',
                        text: `💰 ${character.gold?.toLocaleString() || 0} Gold`
                    }),
                    UIPrimitives.createElement('div', { className: 'character-slot-meta', text: `📦 ${itemCount} items` }),
                    UIPrimitives.createButton({
                        icon: '×',
                        variant: 'danger',
                        size: 'icon',
                        className: 'delete-char-btn character-delete-button',
                        title: `Delete ${character.name}`,
                        ariaLabel: `Delete ${character.name}`
                    })
                ]);

                slot.querySelector('.delete-char-btn').onclick = (e) => {
                    e.stopPropagation();
                    if (confirm(`Delete character "${character.name}"?`)) {
                        this.deleteCharacter(i);
                        this.renderCharacterGrid();
                    }
                };

                grid.appendChild(slot);
            } else {
                // Empty slot
                const slot = UIPrimitives.createCard({
                    className: 'character-slot-card',
                    ariaLabel: `Create new character in slot ${i + 1}`,
                    onClick: () => this.createNewCharacter(i)
                }, [
                    UIPrimitives.createElement('div', {
                        className: 'character-slot-icon',
                        text: '➕',
                        attributes: { style: 'opacity: 0.55;' }
                    }),
                    UIPrimitives.createElement('div', {
                        className: 'character-slot-meta',
                        text: 'Create New Character'
                    })
                ]);

                grid.appendChild(slot);
            }
        }
    }

    getCurrentCharacterSlot() {
        return Game.player.state.currentSlot || 0;
    }

    saveCurrentCharacter() {
        const slot = this.getCurrentCharacterSlot();

        // Create backup before saving
        this.createBackup(slot);

        this.saveCharacter(slot, Game.player.state);
    }

    createBackup(slot) {
        try {
            const currentData = localStorage.getItem(`gloamreach_character_${slot}`);
            if (currentData) {
                const backupKey = `gloamreach_character_${slot}_backup_${Date.now()}`;
                localStorage.setItem(backupKey, currentData);

                // Keep only the 3 most recent backups per slot
                const backupKeys = Object.keys(localStorage)
                    .filter(k => k.startsWith(`gloamreach_character_${slot}_backup_`))
                    .sort();

                while (backupKeys.length > 3) {
                    const oldestBackup = backupKeys.shift();
                    localStorage.removeItem(oldestBackup);
                }

                console.log(`💾 Created backup: ${backupKey}`);
            }
        } catch (error) {
            console.warn("Failed to create backup:", error);
        }
    }

    // Manual save function for testing
    forceSaveCurrentCharacter() {
        console.log("🔧 FORCE SAVING current character...");
        this.saveCurrentCharacter();
        console.log("✅ Force save complete!");
    }
}

class GloamreachGame {
    constructor() {
        this.player = new Player();
        this.combat = new Combat();
        this.ui = new Display();
        this.skills = new SkillManager();
        this.equipment = new EquipmentManager();
        this.characterManager = new CharacterManager();
        this.achievements = new AchievementManager();
        this.gameLoops = [];
    }

    initialize() {
        console.log("🎮 Initializing Gloamreach Clicker RPG...");
        
        // Add character manager button to UI
        this.addCharacterManagerButton();
        
        // Check if player is new and show character creation
        this.player.loadFromStorage();
        if (this.player.state.isNewPlayer) {
            this.showCharacterCreation();
            return; // Don't initialize game until character is created
        }
        
        this.startGame();
    }

    addCharacterManagerButton() {
        // Add character manager button to the header
        const header = document.querySelector('.header');
        if (header) {
            const characterBtn = document.createElement('button');
            characterBtn.innerHTML = '👥 Characters';
            characterBtn.style.cssText = `
                position: absolute;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, var(--blue), #29b6f6);
                color: white;
                border: none;
                padding: 12px 20px;
                border-radius: 12px;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(79, 195, 247, 0.3);
            `;
            characterBtn.onclick = () => this.characterManager.showCharacterSelector();
            header.style.position = 'relative';
            header.appendChild(characterBtn);
        }
    }

    showCharacterCreation() {
        const modal = document.getElementById('character-creation-modal');
        modal.style.display = 'flex';
        
        // Add close button
        const content = modal.querySelector('.modal-content');
        if (!content.querySelector('.close-btn')) {
            const closeBtn = document.createElement('button');
            closeBtn.className = 'close-btn';
            closeBtn.innerHTML = '×';
            closeBtn.style.cssText = `
                position: absolute;
                top: 15px;
                right: 15px;
                background: rgba(255, 68, 68, 0.8);
                border: none;
                color: white;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 1.2rem;
            `;
            closeBtn.onclick = () => modal.style.display = 'none';
            content.appendChild(closeBtn);
        }

        // Add class selection handler
        const classSelect = document.getElementById('character-class');
        const classDescription = document.getElementById('class-description');

        const updateClassDescription = () => {
            const selectedClass = classSelect.value;
            const descriptions = {
                swordsman: "<strong>Swordsman:</strong> A balanced warrior focused on physical combat. Great for auto-battle with steady damage and good defense. Can rebirth into Dragon Knight at level 100.",
                mage: "<strong>Mage:</strong> A powerful spellcaster with devastating magical abilities. Requires active skill usage for maximum damage (2.5x DPS potential) but weak in auto-battle. Can rebirth into Arch Mage at level 100.",
                rogue: "<strong>Rogue:</strong> A crit-focused economy class. Earns more gold and loot through high crit uptime, then evolves into Shadowblade at level 100.",
                berserker: "<strong>Berserker:</strong> A shieldless momentum class. Fury increases damage with each kill, but death resets the streak. Evolves into Ravager at level 100.",
                summoner: "<strong>Summoner:</strong> A minion class built for long boss fights. Damage ramps every combat turn, but short trash fights end before the swarm reaches full strength. Evolves into Archon at level 100."
            };

            if (classDescription && descriptions[selectedClass]) {
                classDescription.innerHTML = descriptions[selectedClass];
            }
        };

        classSelect.onchange = updateClassDescription;
        updateClassDescription(); // Set initial description

        const form = document.getElementById('character-form');
        form.onsubmit = (e) => {
            e.preventDefault();
            const name = document.getElementById('character-name').value.trim();
            const characterClass = document.getElementById('character-class').value;

            if (name) {
                this.player.createCharacter(name, characterClass);
                modal.style.display = 'none';
                this.startGame();
            }
        };
    }

    startGame() {
        // Check if all required elements exist
        this.ui.checkElements();

        // Ensure starting area is unlocked and progression system is initialized
        this.ensureStartingAreaUnlocked();

        // Initialize UI
        this.ui.initialize();
        this.ui.addButtonFeedback();

        // Initialize enhanced combat UI immediately
        this.ui.initializeEnhancedCombat();

        // Initialize inventory grid
        this.equipment.createInventoryGrid();

        // Calculate initial player stats
        this.player.calculateStats();

        // Spawn first monster
        this.combat.spawnMonster();

        // Update all displays
        this.ui.updateAll();
        this.ui.renderSkills();
        this.ui.renderShop();
        this.equipment.renderInventory();
        this.equipment.renderEquipment();

        // Force update enhanced combat UI
        if (this.ui.enhancedCombatUI) {
            this.ui.enhancedCombatUI.updateAll();
        }

        // Start game loops
        this.startGameLoops();

        console.log("✅ Game initialized successfully!");
        this.ui.showLootNotification(`Welcome, ${this.player.state.name}! Ready for adventure?`);
    }

    ensureStartingAreaUnlocked() {
        // Make sure the starting area is always unlocked
        if (!this.player.state.unlockedAreas || !this.player.state.unlockedAreas.includes("verdant_meadow")) {
            if (!this.player.state.unlockedAreas) {
                this.player.state.unlockedAreas = [];
            }
            this.player.state.unlockedAreas.push("verdant_meadow");
        }

        // Initialize area progress if not exists
        if (!this.player.state.areaProgress) {
            this.player.state.areaProgress = {};
        }
    }

    restartWithCharacter() {
        // Stop existing loops
        this.gameLoops.forEach(interval => clearInterval(interval));
        this.gameLoops = [];
        
        // Restart game without loading from storage (character already loaded)
        this.startGameWithoutLoad();
    }

    startGameWithoutLoad() {
        // Check if all required elements exist
        this.ui.checkElements();

        // Ensure starting area is unlocked and progression system is initialized
        this.ensureStartingAreaUnlocked();

        // Initialize UI
        this.ui.initialize();
        this.ui.addButtonFeedback();

        // Initialize enhanced combat UI immediately
        this.ui.initializeEnhancedCombat();

        // Initialize inventory grid
        this.equipment.createInventoryGrid();

        // Calculate initial player stats
        this.player.calculateStats();

        // Spawn first monster
        this.combat.spawnMonster();

        // Update all displays
        this.ui.updateAll();
        this.ui.renderSkills();
        this.ui.renderShop();
        this.equipment.renderInventory();
        this.equipment.renderEquipment();

        // Force update enhanced combat UI
        if (this.ui.enhancedCombatUI) {
            this.ui.enhancedCombatUI.updateAll();
        }

        // Start game loops
        this.startGameLoops();

        console.log("✅ Game restarted with character data!");
        this.ui.showLootNotification(`Welcome back, ${this.player.state.name}! Ready for adventure?`);
    }

    startGameLoops() {
        // Auto-save every 30 seconds
        this.gameLoops.push(setInterval(() => {
            this.saveGame();
        }, 30000));

        // Update status effects and cooldowns every 100ms
        this.gameLoops.push(setInterval(() => {
            if (this.skills) {
                // Check if combat is inactive (paused or not active)
                const isCombatInactive = !this.combat.battleActive || this.combat.isPaused;

                // Status effects only tick when combat is active
                this.skills.updateStatusEffects(isCombatInactive);

                // Cooldowns always tick (skills should be ready when combat resumes)
                const cooldownUpdate = this.skills.updateCooldowns();
                if (cooldownUpdate) {
                    this.ui.updateHotbar();
                }
            }
        }, 100));

        // HP regeneration every 1 seconds (only during active combat)
            this.gameLoops.push(setInterval(() => {
            if (
            this.combat &&
            this.combat.battleActive &&
            this.player.hp > 0 &&
            this.player.hp < this.player.maxHp
    ) {
        const regenPercent = this.player.state.hpRegenPercent || 0;

        if (regenPercent > 0) {
            const healing = Math.floor(this.player.maxHp * regenPercent);
            this.player.heal(healing);
            this.ui.updatePlayerDisplay();
        }
    }
        }, 1000));


        // MP regeneration every 1 second (only during active combat)
        this.gameLoops.push(setInterval(() => {
            if (this.combat && this.combat.battleActive && this.player.mp < this.player.state.maxMp && this.player.hp > 0) {
                // Base MP regeneration: 2% of max MP per second
                let baseRegen = this.player.state.maxMp * 0.02;

                // Check for Increase Mana Recovery skill
                if (this.skills && this.skills.activeSkills) {
                    const manaRecoverySkill = this.skills.activeSkills.find(s => s.id === "increase_mana_recovery");
                    if (manaRecoverySkill && manaRecoverySkill.currentLevel > 0) {
                        // Each level adds 20% more regeneration (2% base + 20% per level)
                        const bonusMultiplier = 1 + (manaRecoverySkill.effect.value * manaRecoverySkill.currentLevel);
                        baseRegen *= bonusMultiplier;
                    }
                }

                // NEW: Check status effect boosts
                const statusBonuses = this.skills.getActiveStatusEffects();
                if (statusBonuses.mpRegenBoost) {
                 baseRegen *= (1 + statusBonuses.mpRegenBoost);
                }

                // Class-defined flat regen (e.g. mage mpRegenPerLevel)
                if (typeof ClassKit !== 'undefined') {
                    const classDef = ClassKit.get(this.player.state.classId);
                    if (classDef && classDef.mpRegenPerLevel) {
                        baseRegen += classDef.mpRegenPerLevel * this.player.state.level;
                    }
                }

                const actualRestore = this.player.restoreMp(Math.floor(baseRegen));
                if (actualRestore > 0) {
                    this.ui.updatePlayerDisplay();
                    this.ui.updateHotbar(); // Update skill highlighting when MP changes
                }
            }
        }, 1000));

        // Check for inactivity every 500ms
        this.gameLoops.push(setInterval(() => {
            this.combat.checkInactivity();
        }, 500));
    }

    saveGame() {
        try {
            this.player.saveToStorage();
            // Save to character manager
            this.characterManager.saveCurrentCharacter();
            
            console.log("💾 Game auto-saved to character slot!");
        } catch (error) {
            console.warn("Failed to save game:", error);
        }
    }
        
    // Utility method for external access
    getGameState() {
        return {
            player: this.player.state,
            monster: this.combat.currentMonster,
            isPaused: this.combat.isPaused,
            skills: this.skills ? this.skills.activeSkills : [],
            inventory: this.equipment ? this.equipment.inventory : []
        };
    }

    // Emergency reset function
    resetGame() {
        if (confirm("Are you sure you want to reset ALL progress and characters?")) {
            // Remove character data (current keys and any legacy saves)
            Object.values(SAVE_KEYS).forEach(key => localStorage.removeItem(key));
            Object.values(LEGACY_SAVE_KEYS).forEach(key => localStorage.removeItem(key));
            location.reload();
        }
    }

    // Stop all game loops (for cleanup)
    destroy() {
        this.gameLoops.forEach(interval => clearInterval(interval));
        this.gameLoops = [];
        
        // Stop auto battle if running
        if (this.ui.autoBattleInterval) {
            clearInterval(this.ui.autoBattleInterval);
        }
    }
}

// Global functions for HTML onclick events (defined BEFORE Game instance)
function attackMonster() {
    if (Game && Game.combat) {
        return Game.combat.attackMonster();
    }
}

function resetGame() {
    if (Game) {
        return Game.resetGame();
    }
}

function learnSkill(skillId) {
    if (Game && Game.skills && Game.skills.learnSkill(skillId)) {
        Game.ui.renderSkills();
        Game.ui.updatePlayerDisplay();
        Game.ui.updateHotbar();
    }
}

// Expose functions to window object immediately
window.attackMonster = attackMonster;
window.resetGame = resetGame;
window.learnSkill = learnSkill;

// Create global game instance (ONLY ONCE)
Game = new GloamreachGame();

// Also expose Game to window
window.Game = Game;

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded, initializing game...");
    Game.initialize();
});

// Handle page visibility for pause/resume
document.addEventListener('visibilitychange', () => {
    if (Game && Game.combat) {
        if (document.hidden) {
            Game.combat.isPaused = true;
        } else {
            Game.combat.updateActivity();
        }
    }
});

// DEBUG FUNCTIONS - Enhanced for character switching testing
window.debugPlayer = () => Game ? console.table(Game.player.state) : console.log("Game not loaded");
window.debugMonster = () => Game ? console.table(Game.combat.currentMonster) : console.log("Game not loaded");
window.debugSkills = () => Game && Game.skills ? console.table(Game.skills.activeSkills) : console.log("Skills not loaded");

// Test character switching with detailed logging
window.testCharacterSwitching = () => {
    console.log("=== CHARACTER SWITCHING TEST ===");
    const currentSlot = Game.characterManager.getCurrentCharacterSlot();
    const currentItems = Game.equipment.inventory.filter(i => i).length;
    
    console.log(`Current character: Slot ${currentSlot}`);
    console.log(`Current inventory: ${currentItems} items`);
    
    // Add test items if inventory is empty
    if (currentItems === 0) {
        console.log("Adding test items...");
        const sword = Game.equipment.generateItem('sword', 'rare', 10);
        const helmet = Game.equipment.generateItem('helmet', 'epic', 15);
        Game.equipment.addToInventory(sword);
        Game.equipment.addToInventory(helmet);
        console.log("Added test sword and helmet");
    }
    
    // Force save before switching
    Game.characterManager.forceSaveCurrentCharacter();
    
    // Show character selector
    Game.characterManager.showCharacterSelector();
    
    console.log("Character selector opened. Select a different character to test switching!");
};

// Force save current character (for testing)
window.forceSave = () => {
    if (Game && Game.characterManager) {
        Game.characterManager.forceSaveCurrentCharacter();
    }
};

// Emergency recovery function
window.emergencyRecover = () => {
    console.log("🚨 EMERGENCY RECOVERY INITIATED");

    // Try to restore from localStorage backup
    const backupKeys = Object.keys(localStorage).filter(k => k.includes('gloamreach') && k.includes('backup'));
    if (backupKeys.length > 0) {
        console.log("📦 Found backup saves:", backupKeys);
        backupKeys.forEach(key => {
            console.log(`${key}:`, localStorage.getItem(key).substring(0, 100) + '...');
        });
    }

    // Create a recovery character with reasonable stats
    const recoveryCharacter = {
        name: "Recovered Character",
        class: "swordsman",
        level: 20, // Give some levels back
        hp: 500,
        maxHp: 500,
        mp: 200,
        maxMp: 200,
        atk: 50,
        matk: 20,
        def: 10,
        mdef: 5,
        exp: 0,
        maxExp: 2000,
        skillPoints: 10, // Give some skill points
        gold: 50000, // Give some gold to buy equipment
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
        currentLocation: "verdant_meadow",
        areaProgress: {},
        unlockedAreas: ["verdant_meadow"],
        currentSlot: 0
    };

    // Apply recovery character
    Game.player.state = recoveryCharacter;

    // Give some starter equipment
    if (Game.equipment) {
        const sword = Game.equipment.generateItem('sword', 'rare', 15);
        const helmet = Game.equipment.generateItem('helmet', 'rare', 15);
        const chestplate = Game.equipment.generateItem('chestplate', 'rare', 15);

        if (sword) Game.equipment.addToInventory(sword);
        if (helmet) Game.equipment.addToInventory(helmet);
        if (chestplate) Game.equipment.addToInventory(chestplate);

        // Add some potions
        for (let i = 0; i < 10; i++) {
            const potion = Game.equipment.generateItem('potion', 'common', 1);
            if (potion) Game.equipment.addToInventory(potion);
        }
    }

    // Save the recovery
    Game.characterManager.saveCurrentCharacter();

    // Refresh UI
    Game.player.calculateStats();
    if (Game.ui) {
        Game.ui.updatePlayerDisplay();
        Game.ui.showLootNotification("🚨 Emergency recovery complete! Check your inventory for starter gear.");
    }
    if (Game.equipment) {
        Game.equipment.renderInventory();
        Game.equipment.renderEquipment();
    }

    console.log("✅ Emergency recovery complete!");
    console.log("📦 Added starter equipment and potions");
    console.log("💰 Added 50,000 gold");
    console.log("📊 Set to level 20 with 10 skill points");
};

// Debug equipment stat calculations
window.debugStatCalculation = () => {
    console.log("🔍 STAT CALCULATION DEBUG");

    const player = Game.player;
    if (!player) {
        console.log("❌ No player found");
        return;
    }

    console.log("📊 Current Player Stats:");
    console.log(`   ATK: ${player.state.atk}`);
    console.log(`   DEF: ${player.state.def}`);
    console.log(`   HP: ${player.state.hp}/${player.state.maxHp}`);
    console.log(`   MP: ${player.state.mp}/${player.state.maxMp}`);
    console.log(`   Crit: ${player.state.critChance}% / ${player.state.critDamage}%`);

    console.log("\n⚔️ Equipped Items:");
    Object.entries(player.state.equipped).forEach(([slot, item]) => {
        if (item) {
            console.log(`   ${slot}: ${item.name} (${JSON.stringify(item.stats)})`);
        } else {
            console.log(`   ${slot}: (empty)`);
        }
    });

    // Test stat recalculation
    console.log("\n🔄 Testing stat recalculation...");
    const oldAtk = player.state.atk;
    player.calculateStats();
    const newAtk = player.state.atk;

    console.log(`   ATK before recalc: ${oldAtk}`);
    console.log(`   ATK after recalc: ${newAtk}`);
    console.log(`   ${oldAtk === newAtk ? '✅ Stats consistent' : '❌ Stats changed during recalc!'}`);

    // Test equipment cycling
    console.log("\n🔄 Testing equipment unequip/equip cycle...");
    const sword = player.state.equipped.sword;
    if (sword) {
        console.log(`   Starting ATK: ${player.state.atk}`);

        // Unequip sword
        Game.equipment.unequipItem('sword');
        console.log(`   ATK after unequip: ${player.state.atk}`);

        // Find sword in inventory and re-equip
        const swordIndex = Game.equipment.inventory.findIndex(item =>
            item && item.name === sword.name
        );

        if (swordIndex !== -1) {
            Game.equipment.autoEquipItem(swordIndex);
            console.log(`   ATK after re-equip: ${player.state.atk}`);
            console.log(`   ${player.state.atk === oldAtk ? '✅ Stats restored correctly' : '❌ Stats not restored!'}`);
        } else {
            console.log("   ❌ Could not find sword in inventory");
        }
    } else {
        console.log("   ℹ️ No sword equipped to test");
    }
};

// Fix stat calculation issues
window.fixStatCalculation = () => {
    console.log("🔧 FIXING STAT CALCULATION ISSUES");

    // Force recalculate stats
    Game.player.calculateStats();

    // Update UI
    if (Game.ui) {
        Game.ui.updatePlayerDisplay();
    }
    if (Game.equipment) {
        Game.equipment.renderEquipment();
    }

    console.log("✅ Stats recalculated and UI updated");

    // Show current stats
    window.debugStatCalculation();
};

// Debug combat state
window.debugCombatState = () => {
    console.log("⚔️ COMBAT STATE DEBUG");

    if (!Game.combat) {
        console.log("❌ No combat system found");
        return;
    }

    console.log("🎯 Combat State:");
    console.log(`   Battle Active: ${Game.combat.battleActive}`);
    console.log(`   Auto Battle: ${Game.combat.autoBattleEnabled}`);
    console.log(`   Is Respawning: ${Game.combat.isRespawning}`);
    console.log(`   Battle Interval: ${Game.combat.battleInterval ? 'Running' : 'Stopped'}`);

    console.log("\n👹 Monster State:");
    if (Game.combat.currentMonster) {
        const monster = Game.combat.currentMonster;
        console.log(`   Name: ${monster.name}`);
        console.log(`   HP: ${monster.currentHp}/${monster.maxHp}`);
        console.log(`   Level: ${monster.level}`);
        console.log(`   Alive: ${monster.currentHp > 0}`);
    } else {
        console.log("   No monster spawned");
    }

    console.log("\n🧙 Player State:");
    console.log(`   HP: ${Game.player.hp}/${Game.player.maxHp}`);
    console.log(`   Level: ${Game.player.level}`);
    console.log(`   Location: ${Game.player.state.currentLocation}`);

    console.log("\n🎮 UI State:");
    const startBtn = document.getElementById('enhanced-start-battle-btn');
    const attackBtn = document.getElementById('enhanced-attack-btn');
    if (startBtn) {
        console.log(`   Start Button: ${startBtn.disabled ? 'Disabled' : 'Enabled'} - "${startBtn.textContent}"`);
    }
    if (attackBtn) {
        console.log(`   Attack Button: ${attackBtn.disabled ? 'Disabled' : 'Enabled'}`);
    }
};

// Fix combat state issues
window.fixCombatState = () => {
    console.log("🔧 FIXING COMBAT STATE");

    if (!Game.combat) {
        console.log("❌ No combat system found");
        return;
    }

    // Stop any active battle
    Game.combat.stopBattle();

    // Clear respawning flag
    Game.combat.isRespawning = false;

    // Spawn new monster if none exists
    if (!Game.combat.currentMonster || Game.combat.currentMonster.currentHp <= 0) {
        console.log("🔄 Spawning new monster...");
        Game.combat.spawnMonster();
    }

    // Update UI
    if (Game.ui && Game.ui.enhancedCombatUI) {
        Game.ui.enhancedCombatUI.updateBattleButtons();
    }

    console.log("✅ Combat state fixed!");

    // Show current state
    setTimeout(() => {
        window.debugCombatState();
    }, 100);
};

// Debug character storage
window.debugCharacterStorage = () => {
    if (Game && Game.characterManager) {
        const currentSlot = Game.characterManager.getCurrentCharacterSlot();
        const character = Game.characterManager.loadCharacter(currentSlot);
        console.log("=== CHARACTER STORAGE DEBUG ===");
        console.log("Current slot:", currentSlot);
        console.log("Character data:", character);
        if (character) {
            console.log("Stored inventory items:", character.inventory ? character.inventory.filter(i => i).length : 0);
            console.log("Stored skills data:", character.skills ? character.skills.filter(s => s.currentLevel > 0).length : 0);
        }
        console.log("Current live inventory:", Game.equipment.inventory.filter(i => i).length);
        console.log("Current live skills:", Game.skills.activeSkills.filter(s => s.currentLevel > 0).length);
    }
};

// Add items for testing
window.addTestItems = () => {
    if (Game && Game.equipment) {
        const items = [
            Game.equipment.generateItem('sword', 'legendary', 20),
            Game.equipment.generateItem('helmet', 'rare', 15),
            Game.equipment.generateItem('potion', 'common', 1)
        ];
        
        items.forEach(item => {
            if (item) Game.equipment.addToInventory(item);
        });
        
        console.log("Added test items to current character");
    }
};

window.debugStacks = () => {
    if (Game && Game.equipment) {
        const stacks = Game.equipment.inventory.filter(item => 
            item && Game.equipment.maxStackSize[item.type]
        );
        console.table(stacks.map(item => ({
            name: item.name,
            count: item.count || 1,
            maxStack: Game.equipment.maxStackSize[item.type]
        })));
    }
};

window.addPotions = (count = 10) => {
    if (Game && Game.equipment) {
        const potion = Game.equipment.generateItem('potion', 'common', 1);
        Game.equipment.addToInventory(potion, count);
    }
};

window.addMixedPotions = () => {
    if (Game && Game.equipment) {
        const potions = [
            { name: "Health Potion", rarity: "common", count: 15 },
            { name: "Greater Health Potion", rarity: "rare", count: 8 },
            { name: "Super Health Potion", rarity: "epic", count: 3 }
        ];
        
        potions.forEach(p => {
            const potion = Game.equipment.generateItem('potion', p.rarity, 1);
            potion.name = p.name;
            Game.equipment.addToInventory(potion, p.count);
        });
    }
};

window.giveGold = (amount) => {
    if (Game) {
        Game.player.gainGold(amount);
        Game.ui.updatePlayerDisplay();
    }
};

window.levelUp = () => {
    if (Game) {
        Game.player.gainExp(Game.player.maxExp);
        Game.ui.updateAll();
    }
};

window.testEquipment = () => {
    if (Game && Game.equipment) {
        const rarities = ['common', 'rare', 'epic', 'legendary', 'mythic'];
        const types = ['helmet', 'chestplate', 'sword', 'shield'];
        
        types.forEach((type, index) => {
            const rarity = rarities[index % rarities.length];
            const item = Game.equipment.generateItem(type, rarity, Game.player.level);
            Game.equipment.addToInventory(item);
        });
    }
};

window.debugCharacters = () => {
    if (Game && Game.characterManager) {
        console.table(Game.characterManager.getCharacterList());
    }
};

window.showCharacterSelector = () => {
    if (Game && Game.characterManager) {
        Game.characterManager.showCharacterSelector();
    }
};

// Add this to the very end of your main.js file:

// Enhanced Combat Auto-Initialization - Initialize immediately to prevent layout shifts
if (typeof EnhancedCombatUI !== 'undefined') {
    console.log('🎮 Auto-initializing Enhanced Combat...');
    // Initialize immediately when the script loads
    document.addEventListener('DOMContentLoaded', () => {
        if (Game && Game.ui) {
            Game.ui.initializeEnhancedCombat();

            // Force initial updates after a brief delay to ensure everything is loaded
            setTimeout(() => {
                if (Game.ui.enhancedCombatUI) {
                    Game.ui.enhancedCombatUI.updateAll();
                    console.log('✅ Enhanced Combat initialized and updated');
                }
            }, 100);
        }
    });
} else {
    console.warn('❌ Enhanced Combat could not auto-initialize');
}

// Console welcome message
console.log(`
🎮 Gloamreach Clicker RPG
🔧 Fixed Issues:
   ✅ Characters now save inventory before switching
   ✅ Auto-save before opening character selector
   ✅ Proper loading of character-specific data
   ✅ Enhanced debugging and logging
   
🧪 Test Commands:
   - testCharacterSwitching() - Complete switching test
   - addTestItems() - Add items to current character  
   - forceSave() - Manually save current character
   - debugCharacterStorage() - View storage details
   
⚔️ Each character now properly maintains their own inventory!
`);
