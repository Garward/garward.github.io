// skills.js - Skills data and management system
const SWORDSMAN_SKILLS = [
    {
        id: "bash",
        name: "Bash",
        maxLevel: 10,
        currentLevel: 0,
        description: "Powerful single hit attack",
        damageMultiplier: 1.3,
        mpCost: 8,
        unlockLevel: 1,
        cooldown: 0,
        maxCooldown: 2000,
        hotkey: "1",
        icon: "⚔️"
    },
    {
        id: "magnum_break",
        name: "Magnum Break",
        maxLevel: 10,
        currentLevel: 0,
        description: "Fire explosion, +20% damage for 10s",
        damageMultiplier: 1.5,
        mpCost: 15,
        isFireDamage: true,
        unlockLevel: 5,
        cooldown: 0,
        maxCooldown: 8000,
        hotkey: "2",
        icon: "🔥"
    },
    {
        id: "endure",
        name: "Endure",
        maxLevel: 10,
        currentLevel: 0,
        description: "Increases defense by 25% + 2% per level",
        defenseMultiplier: 0.25,
        mpCost: 12,
        unlockLevel: 10,
        cooldown: 0,
        maxCooldown: 12000,
        hotkey: "3",
        icon: "🛡️"
    },
    {
        id: "hp_recovery",
        name: "HP Recovery",
        maxLevel: 10,
        currentLevel: 0,
        description: "Passive HP regeneration",
        regenAmount: 2,
        unlockLevel: 3,
        isPassive: true,
        icon: "❤️"
    },
    {
        id: "sword_mastery",
        name: "Sword Mastery",
        maxLevel: 10,
        currentLevel: 0,
        description: "Increases ATK permanently",
        atkBonus: 3,
        unlockLevel: 7,
        isPassive: true,
        icon: "⚔️"
    }
];

// Mage Skills
const MAGE_SKILLS = [
    {
        id: "fire_bolt",
        name: "Fire Bolt",
        maxLevel: 10,
        currentLevel: 0,
        description: "Launch a fiery projectile at the enemy",
        damageMultiplier: 3.6, // Doubled from 1.8
        mpCost: 12,
        unlockLevel: 1,
        cooldown: 0,
        maxCooldown: 1500,
        hotkey: "1",
        icon: "🔥",
        element: "fire",
        sprite: "fire_bolt.png"
    },
    {
        id: "ice_bolt",
        name: "Ice Bolt",
        maxLevel: 10,
        currentLevel: 0,
        description: "Launch an icy projectile that may slow enemies",
        damageMultiplier: 3.2, // Doubled from 1.6
        mpCost: 10,
        unlockLevel: 3,
        cooldown: 0,
        maxCooldown: 1500,
        hotkey: "2",
        icon: "❄️",
        element: "ice",
        sprite: "ice_bolt.png"
    },
    {
        id: "lightning_bolt",
        name: "Lightning Bolt",
        maxLevel: 10,
        currentLevel: 0,
        description: "Strike with lightning for high damage",
        damageMultiplier: 4.0, // Doubled from 2.0
        mpCost: 15,
        unlockLevel: 5,
        cooldown: 0,
        maxCooldown: 2000,
        hotkey: "3",
        icon: "⚡",
        element: "lightning",
        sprite: "lightning_bolt.png"
    },
    {
        id: "increase_mana_recovery",
        name: "Increase Mana Recovery",
        maxLevel: 10,
        currentLevel: 0,
        description: "Increases mana regeneration by 20% per level (base: 2% max MP/sec)",
        isPassive: true,
        unlockLevel: 7,
        icon: "💙",
        sprite: "mana_recovery.png",
        effect: {
            type: "mana_regen_bonus",
            value: 0.2 // 20% per level
        }
    },
    {
        id: "energy_coat",
        name: "Energy Coat",
        maxLevel: 10,
        currentLevel: 0,
        description: "Creates a magical barrier that reduces damage",
        mpCost: 30,
        unlockLevel: 10,
        cooldown: 0,
        maxCooldown: 25000, // 25 second cooldown
        hotkey: "4",
        icon: "🛡️",
        sprite: "energy_coat.png",
        isBuff: true,
        buffDuration: 5000, // 5 seconds
        effect: {
            type: "damage_reduction",
            baseValue: 10, // 10% at level 1
            perLevel: 8    // +8% per level (10% + 9*8% = 82% at level 10, but we'll cap at 90%)
        }
    }
];

// Arch Mage Skills
const ARCH_MAGE_SKILLS = [
    {
        id: "staff_mastery",
        name: "Staff Mastery",
        maxLevel: 10,
        currentLevel: 0,
        description: "Increases physical damage when wielding a staff",
        isPassive: true,
        unlockLevel: 1,
        icon: "🪄",
        sprite: "staff_mastery.png",
        effect: {
            type: "atk_bonus",
            value: 15 // 15% per level
        }
    },
    {
        id: "energy_coat",
        name: "Energy Coat",
        maxLevel: 10,
        currentLevel: 0,
        description: "Creates a magical barrier that reduces damage",
        mpCost: 25, // Reduced MP cost for Arch Mage
        unlockLevel: 1,
        cooldown: 0,
        maxCooldown: 20000, // 20 second cooldown
        hotkey: "1",
        icon: "🛡️",
        sprite: "energy_coat.png",
        isBuff: true,
        buffDuration: 5000,
        effect: {
            type: "damage_reduction",
            baseValue: 10,
            perLevel: 8
        }
    },
    {
        id: "soul_vulcan_strike",
        name: "Soul Vulcan Strike",
        maxLevel: 10,
        currentLevel: 0,
        description: "Rapid-fire magical projectiles - main DPS skill",
        damageMultiplier: 4.4, // Doubled from 2.2
        mpCost: 20,
        unlockLevel: 5,
        cooldown: 0,
        maxCooldown: 800, // Lowest cooldown for main DPS
        hotkey: "2",
        icon: "🌟",
        sprite: "soul_vulcan_strike.png",
        isMainDPS: true
    },
    {
        id: "mystical_amplification",
        name: "Mystical Amplification",
        maxLevel: 10,
        currentLevel: 0,
        description: "Temporarily amplifies physical damage",
        mpCost: 40,
        unlockLevel: 10,
        cooldown: 0,
        maxCooldown: 30000, // 30 second cooldown
        hotkey: "3",
        icon: "✨",
        sprite: "mystical_amplification.png",
        isBuff: true,
        buffDuration: 15000, // 15 seconds
        effect: {
            type: "atk_multiplier",
            baseValue: 1.3, // 30% damage increase at level 1
            perLevel: 0.1   // +10% per level
        }
    },
    {
        id: "drain_life",
        name: "Drain Life",
        maxLevel: 10,
        currentLevel: 0,
        description: "Heals you for a percentage of damage dealt",
        damageMultiplier: 3.0, // Doubled from 1.5
        mpCost: 35,
        unlockLevel: 15,
        cooldown: 0,
        maxCooldown: 30000, // 30 second cooldown
        hotkey: "4",
        icon: "🩸",
        sprite: "drain_life.png",
        effect: {
            type: "life_steal",
            baseValue: 25, // 25% life steal at level 1
            perLevel: 5    // +5% per level
        }
    },
    {
        id: "astral_strike",
        name: "Astral Strike",
        maxLevel: 10,
        currentLevel: 0,
        description: "Massive burst damage with long cooldown",
        damageMultiplier: 10.0, // Doubled from 5.0 - MASSIVE damage
        mpCost: 80,
        unlockLevel: 20,
        cooldown: 0,
        maxCooldown: 60000, // 60 second cooldown
        hotkey: "5",
        icon: "💫",
        sprite: "astral_strike.png",
        isBurst: true
    }
];

const DRAGON_KNIGHT_SKILLS = [
    {
        id: "dragon_breath",
        name: "Dragon Breath",
        maxLevel: 10,
        currentLevel: 0,
        description: "Breathe fire in a large area",
        damageMultiplier: 2.5,
        mpCost: 25,
        unlockLevel: 1,
        cooldown: 0,
        maxCooldown: 5000,
        hotkey: "1",
        icon: "🐉",
        isAoe: true,
        isDragonSkill: true
    },
    {
        id: "storm_slash",
        name: "Storm Slash",
        maxLevel: 10,
        currentLevel: 0,
        description: "Critical strike with wind element",
        damageMultiplier: 3.0,
        mpCost: 30,
        critBonus: 50,
        unlockLevel: 5,
        cooldown: 0,
        maxCooldown: 10000,
        hotkey: "2",
        icon: "🌪️",
        isDragonSkill: true
    },
    {
        id: "dragonic_aura",
        name: "Dragonic Aura",
        maxLevel: 10,
        currentLevel: 0,
        description: "+50% ATK and DEF for 20s",
        mpCost: 40,
        unlockLevel: 10,
        cooldown: 0,
        maxCooldown: 45000,
        hotkey: "3",
        icon: "🔴",
        isDragonSkill: true
    },
    {
        id: "vigor",
        name: "Vigor",
        maxLevel: 10,
        currentLevel: 0,
        description: "Instantly restore 30% HP",
        healPercent: 0.3,
        mpCost: 20,
        unlockLevel: 15,
        cooldown: 0,
        maxCooldown: 30000,
        hotkey: "4",
        icon: "💚",
        isDragonSkill: true
    },
    {
        id: "dragon_training",
        name: "Dragon Training",
        maxLevel: 10,
        currentLevel: 0,
        description: "Increases all stats",
        statBonus: 10,
        unlockLevel: 1,
        isPassive: true,
        isDragonSkill: true,
        icon: "🐲"
    }
];

class SkillManager {
    constructor() {
        this.activeSkills = [...SWORDSMAN_SKILLS];
        this.statusEffects = new Map();
        this.currentClass = "swordsman";
    }

    getCurrentSkills() {
        return this.activeSkills;
    }

    switchToClass(classId) {
        let newSkills = [];

        switch (classId) {
            case "swordsman":
                newSkills = [...SWORDSMAN_SKILLS];
                break;
            case "mage":
                newSkills = [...MAGE_SKILLS];
                break;
            case "dragon_knight":
                newSkills = [...DRAGON_KNIGHT_SKILLS];
                break;
            case "arch_mage":
                newSkills = [...ARCH_MAGE_SKILLS];
                break;
            default:
                newSkills = [...SWORDSMAN_SKILLS];
        }

        this.activeSkills = newSkills;
        this.activeSkills.forEach(skill => skill.currentLevel = 0);
        this.currentClass = classId;
    }

    // Legacy method for backward compatibility
    switchToDragonKnight() {
        this.switchToClass("dragon_knight");
    }

    learnSkill(skillId) {
        if (Game.player.state.skillPoints < 1) return false;

        const skill = this.activeSkills.find(s => s.id === skillId);
        if (skill && skill.currentLevel < skill.maxLevel && Game.player.level >= skill.unlockLevel) {
            skill.currentLevel++;
            Game.player.state.skillPoints--;
            Game.player.calculateStats(); // Recalculate for passive skills

            // Force skills panel refresh
            if (Game.ui && Game.ui.renderSkills) {
                setTimeout(() => {
                    Game.ui.renderSkills();
                    Game.ui.updateAll();
                }, 50);
            }

            return true;
        }
        return false;
    }

    useSkill(skillId) {
        const skill = this.activeSkills.find(s => s.id === skillId);
        if (!skill || skill.currentLevel === 0 || skill.cooldown > 0) return false;

        // Check if battle is active (skills can only be used during active battle)
        if (Game.combat && !Game.combat.battleActive) {
            Game.ui.showMessage("Start battle first to use skills!");
            return false;
        }

        // Check MP cost
        const mpCost = skill.mpCost ? skill.mpCost + (skill.currentLevel - 1) * 2 : 0;
        if (mpCost > 0 && !Game.player.canUseSkill(mpCost)) {
            Game.ui.showMessage("Not enough MP!");
            return false;
        }
        
        // Consume MP
        if (mpCost > 0) {
            Game.player.useMp(mpCost);
        }
        
        // Set cooldown with level scaling (reduced cooldown per level)
        const cooldownReduction = (skill.currentLevel - 1) * 0.1; // 10% reduction per level
        skill.cooldown = Math.floor(skill.maxCooldown * (1 - cooldownReduction));
        
        // Apply skill effects
        this.applySkillEffect(skill);
        
        // If it's an attack skill, trigger combat
        if (skill.damageMultiplier) {
            Game.combat.attackMonster(skill);
        }
        
        // Update hotbar to show cooldown
        Game.ui.updateHotbar();
        
        return true;
    }

    applySkillEffect(skill) {
        switch (skill.id) {
            case "magnum_break":
                const damageBonus = 0.2 + (skill.currentLevel * 0.05); // Scales with level
                this.addStatusEffect("magnumBreakBuff", "Fire Weapon", "🔥", 10000, { 
                    damageBonus: damageBonus 
                });
                break;
                
            case "endure":
                const defenseMultiplier = skill.defenseMultiplier + (skill.currentLevel * 0.02);
                this.addStatusEffect("endureBuff", "Endure", "🛡️", 15000 + (skill.currentLevel * 2000), { 
                    defMultiplier: 1 + defenseMultiplier 
                });
                break;
                
            case "dragonic_aura":
                const multiplier = 1.5 + (skill.currentLevel * 0.1);
                this.addStatusEffect("dragonicAura", "Dragonic Aura", "🔴", 20000 + (skill.currentLevel * 3000), { 
                    atkMultiplier: multiplier, 
                    defMultiplier: multiplier 
                });
                break;
                
            case "vigor":
                const healPercent = 0.3 + (skill.currentLevel * 0.05);
                const healing = Math.floor(Game.player.maxHp * healPercent);
                Game.player.heal(healing);
                Game.ui.showLootNotification(`Vigor restored ${healing} HP!`);
                break;

            // Mage Skills
            case "energy_coat":
                const reductionPercent = Math.min(90, 10 + (skill.currentLevel - 1) * 8);
                this.addStatusEffect('energy_coat', `Damage Reduction ${reductionPercent}%`, '🛡️', 5000, {
                    damageReduction: reductionPercent / 100
                });
                break;

            case "mystical_amplification":
                const atkMultiplier = 1.3 + (skill.currentLevel - 1) * 0.1;
                this.addStatusEffect('mystical_amplification', `ATK +${Math.round((atkMultiplier - 1) * 100)}%`, '✨', 15000, {
                    atkMultiplier: atkMultiplier
                });
                break;

            case "drain_life":
                // Drain Life healing effect is handled in combat
                if (Game.ui) {
                    Game.ui.showLootNotification("🩸 Life force drained!");
                }
                break;
        }
    }

    addStatusEffect(id, name, icon, duration, effects) {
        this.statusEffects.set(id, {
            name,
            icon,
            duration,
            maxDuration: duration,
            effects,
            startTime: Date.now()
        });
        
        // Update the UI immediately
        if (Game.ui) {
            Game.ui.updateStatusEffectsDisplay();
        }
    }

    updateStatusEffects(isPaused = false) {
        let needsUpdate = false;

        // Only tick down status effects when combat is active (not paused)
        if (!isPaused) {
            this.statusEffects.forEach((effect, id) => {
                effect.duration -= 100;
                if (effect.duration <= 0) {
                    this.statusEffects.delete(id);
                    needsUpdate = true;
                }
            });
        }

        // Always update UI if there are effects (to show current state)
        if (needsUpdate || this.statusEffects.size > 0) {
            if (Game.ui) {
                Game.ui.updateStatusEffectsDisplay();
            }
        }
    }

    updateCooldowns() {
        let needsUpdate = false;
        this.activeSkills.forEach(skill => {
            if (skill.cooldown > 0) {
                skill.cooldown = Math.max(0, skill.cooldown - 100);
                needsUpdate = true;
            }
        });
        return needsUpdate;
    }

    getActiveStatusEffects() {
        const effects = {
            damageBonus: 0,
            atkMultiplier: 1,
            defenseBonus: 0,
            defMultiplier: 1,
            damageReduction: 0
        };

        this.statusEffects.forEach(effect => {
            if (effect.effects.damageBonus) effects.damageBonus += effect.effects.damageBonus;
            if (effect.effects.atkMultiplier) effects.atkMultiplier *= effect.effects.atkMultiplier;
            if (effect.effects.defenseBonus) effects.defenseBonus += effect.effects.defenseBonus;
            if (effect.effects.defMultiplier) effects.defMultiplier *= effect.effects.defMultiplier;
            if (effect.effects.damageReduction) effects.damageReduction += effect.effects.damageReduction;
        });

        return effects;
    }

    applyPassiveSkillBonuses(player) {
        // Apply sword mastery
        const swordMastery = this.activeSkills.find(s => s.id === "sword_mastery");
        if (swordMastery && swordMastery.currentLevel > 0) {
            player.state.atk += swordMastery.atkBonus * swordMastery.currentLevel;
        }

        // Apply dragon training
        const dragonTraining = this.activeSkills.find(s => s.id === "dragon_training");
        if (dragonTraining && dragonTraining.currentLevel > 0 && dragonTraining.statBonus) {
            const bonus = dragonTraining.statBonus * dragonTraining.currentLevel;
            player.state.atk += bonus;
            player.state.def += Math.floor(bonus / 2);
            player.state.mdef += Math.floor(bonus / 2);
        }

        // Apply mage passive skills
        const increaseManaRecovery = this.activeSkills.find(s => s.id === "increase_mana_recovery");
        if (increaseManaRecovery && increaseManaRecovery.currentLevel > 0) {
            // Mana recovery bonus is handled in the player's mana regeneration
            // This is just for reference - actual implementation in player.js
        }

        // Apply staff mastery
        const staffMastery = this.activeSkills.find(s => s.id === "staff_mastery");
        if (staffMastery && staffMastery.currentLevel > 0) {
            const atkBonus = Math.floor(player.state.atk * (staffMastery.effect.value / 100) * staffMastery.currentLevel);
            player.state.atk += atkBonus;
        }
    }

    getSkillByHotkey(key) {
        return this.activeSkills.find(s => s.hotkey === key && !s.isPassive);
    }

    // Get skill cooldown percentage for UI
    getSkillCooldownPercent(skillId) {
        const skill = this.activeSkills.find(s => s.id === skillId);
        if (!skill || !skill.maxCooldown) return 0;
        return (skill.cooldown / skill.maxCooldown) * 100;
    }

    // Check if skill is ready to use
    isSkillReady(skillId) {
        const skill = this.activeSkills.find(s => s.id === skillId);
        return skill && skill.currentLevel > 0 && skill.cooldown === 0;
    }

    // Get skill damage with level scaling
    getSkillDamage(skill, baseDamage) {
        if (!skill.damageMultiplier) return baseDamage;

        const levelBonus = 1 + ((skill.currentLevel - 1) * 0.15); // 15% damage per level
        return Math.floor(baseDamage * skill.damageMultiplier * levelBonus);
    }
}

// Export for global use
window.MAGE_SKILLS = MAGE_SKILLS;
window.ARCH_MAGE_SKILLS = ARCH_MAGE_SKILLS;
window.SkillManager = SkillManager;