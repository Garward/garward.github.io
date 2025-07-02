// skills.js - Skills data and management system
const SWORDSMAN_SKILLS = [
    {
        id: "magnum_break",
        name: "Magnum Break",
        description: "Deals fire damage and increases your attack temporarily.",
        maxLevel: 10,
        currentLevel: 0,
        unlockLevel: 1,
        damageMultiplier: 1.5,
        atkMultiplierPerLevel: 0.05,
        durationBase: 5000,
        durationPerLevel: 250,
        mpCost: 15,
        cooldown: 0,
        maxCooldown: 8000,
        isFireDamage: true,
        hotkey: "1",
        icon: "🔥"
    },
    {
        id: "battle_focus",
        name: "Battle Focus",
        description: "Boosts critical chance and critical damage for a short duration.",
        maxLevel: 10,
        currentLevel: 0,
        unlockLevel: 5,
        critChancePerLevel: 1,
        critDamagePerLevel: 0.1,
        duration: 10000,
        mpCost: 15,
        cooldown: 0,
        maxCooldown: 12000,
        hotkey: "2",
        icon: "🎯"
    },
    {
        id: "fortify",
        name: "Fortify",
        description: "Boosts defense and reduces skill damage taken.",
        maxLevel: 10,
        currentLevel: 0,
        unlockLevel: 10,
        defMultiplierPerLevel: 0.05,
        skillDamageReductionPerLevel: 0.02,
        duration: 12000,
        mpCost: 25,
        cooldown: 0,
        maxCooldown: 20000,
        hotkey: "3",
        icon: "🛡️"
    },
    {
        id: "iron_will",
        name: "Iron Will",
        description: "Passively increases defense and flat damage reduction.",
        maxLevel: 10,
        currentLevel: 0,
        defenseBonus: 2,
        flatDamageReduction: 1,
        unlockLevel: 3,
        isPassive: true,
        icon: "🪓"
    },
    {
        id: "heavy_training",
        name: "Heavy Training",
        description: "Passively increases max HP and HP regen.",
        maxLevel: 10,
        currentLevel: 0,
        hpBonusPerLevel: 25,
        hpRegenBoostPerLevel: 0.01,
        unlockLevel: 7,
        isPassive: true,
        icon: "💪"
    }
];

const MAGE_SKILLS = [
    {
        id: "fire_bolt",
        name: "Fire Bolt",
        maxLevel: 10,
        currentLevel: 0,
        description: "Fast fire spell. +3% crit chance per level.",
        damageMultiplier: 3.6,
        mpCost: 12,
        unlockLevel: 1,
        cooldown: 0,
        maxCooldown: 1500,
        hotkey: "1",
        icon: "🔥",
        element: "fire"
    },
    {
        id: "lightning_spear",
        name: "Lightning Spear",
        maxLevel: 10,
        currentLevel: 0,
        description: "Ignores 30–60% of enemy DEF. Strong anti-boss spell.",
        damageMultiplier: 4.0,
        armorPiercePercent: 30, // can be used in damage calc
        mpCost: 20,
        unlockLevel: 4,
        cooldown: 0,
        maxCooldown: 5000,
        hotkey: "2",
        icon: "⚡",
        element: "lightning"
    },
    {
        id: "ice_spike",
        name: "Ice Spike",
        maxLevel: 10,
        currentLevel: 0,
        description: "Chance to freeze enemy for 1.5s.",
        damageMultiplier: 3.2,
        freezeChance: 20, // base chance
        mpCost: 18,
        unlockLevel: 7,
        cooldown: 0,
        maxCooldown: 6000,
        hotkey: "3",
        icon: "❄️",
        element: "ice"
    },
    {
        id: "meteor_burst",
        name: "Meteor Burst",
        maxLevel: 10,
        currentLevel: 0,
        description: "Delayed impact. Huge single-hit damage.",
        damageMultiplier: 6.0,
        mpCost: 40,
        unlockLevel: 12,
        cooldown: 0,
        maxCooldown: 12000,
        hotkey: "4",
        icon: "☄️",
        element: "fire"
    },
    {
        id: "arcane_shield",
        name: "Arcane Shield",
        maxLevel: 10,
        currentLevel: 0,
        description: "Converts 30% damage taken to MP loss for 20s.",
        mpCost: 25,
        unlockLevel: 6,
        cooldown: 0,
        maxCooldown: 20000,
        hotkey: "5",
        icon: "🛡️"
    },
    {
        id: "mana_infusion",
        name: "Mana Infusion",
        maxLevel: 10,
        currentLevel: 0,
        description: "Boost MP regen + reduce costs for 30s.",
        mpCost: 20,
        unlockLevel: 9,
        cooldown: 0,
        maxCooldown: 25000,
        hotkey: "6",
        icon: "🔄"
    },
    {
        id: "glass_soul",
        name: "Glass Soul",
        maxLevel: 10,
        currentLevel: 0,
        description: "+20–30% damage, +10–15% damage taken. Passive.",
        isPassive: true,
        unlockLevel: 5,
        icon: "🧪"
    },
    {
        id: "elemental_attunement",
        name: "Elemental Attunement",
        maxLevel: 10,
        currentLevel: 0,
        description: "+10–25% fire, ice, lightning spell damage. Passive.",
        isPassive: true,
        unlockLevel: 8,
        icon: "🌈"
    }
];

window.MAGE_SKILLS = MAGE_SKILLS;


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
        let mpCost = skill.mpCost ? skill.mpCost + (skill.currentLevel - 1) * 2 : 0;

        // Apply MP cost reduction from buffs (like Mana Infusion)
        const costReduction = Game.skills.getActiveStatusEffects().mpCostReduction || 0;
        if (costReduction > 0) {
            mpCost = Math.floor(mpCost * (1 - costReduction));
        }

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
            // Swordsman Skills
            case "magnum_break":
                const magAtkBuff = 1 + (skill.currentLevel * skill.atkMultiplierPerLevel);
                const magDuration = skill.effect?.duration || skill.durationBase + (skill.currentLevel * skill.durationPerLevel);
                this.addStatusEffect("magnumBreak", "Magnum Break", "🔥", magDuration, {
                    atkMultiplier: magAtkBuff
                });
                break;

            case "battle_focus":
                this.addStatusEffect("battleFocus", "Battle Focus", "🎯", skill.duration, {
                    critChanceBonus: skill.currentLevel * skill.critChancePerLevel,
                    critDamageBonus: skill.currentLevel * skill.critDamagePerLevel
                });
                break;


            case "fortify":
                this.addStatusEffect("fortifyBuff", "Fortify", "🛡️", skill.duration, {
                    defMultiplier: 1 + (skill.currentLevel * skill.defMultiplierPerLevel),
                    skillDamageReduction: skill.currentLevel * skill.skillDamageReductionPerLevel
                });
                break;

            // Dragon Knight Skills
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

            case "arcane_shield":
                const mpShieldRatio = 0.3 + (skill.currentLevel * 0.02); // scales to ~50%
                this.addStatusEffect("arcane_shield", "Arcane Shield", "🛡️", 20000, {
                    mpShieldRatio: mpShieldRatio
                });
                break;

            case "mana_infusion":
                 const regenBoost = 0.5 + (skill.currentLevel * 0.1); // +50% to +140%
                 const costReduction = 0.2 + (skill.currentLevel * 0.03); // 20–50%
                 this.addStatusEffect("mana_infusion", "Mana Infusion", "🔄", 30000, {
                     mpRegenBoost: regenBoost,
                     mpCostReduction: costReduction
                 });
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
            critChanceBonus: 0,
            critDamageBonus: 0,
            defenseBonus: 0,
            defMultiplier: 1,
            damageReduction: 0,
            flatDamageReduction: 0,
            skillDamageReduction: 0,
            mpShieldRatio: 0,
            mpRegenBoost: 0,
            mpCostReduction: 0
        };

    this.statusEffects.forEach(effect => {
        if (typeof effect.effects.damageBonus === "number") effects.damageBonus += effect.effects.damageBonus; // Always as multiplier (e.g., 0.2 for 20%)
        if (effect.effects.atkMultiplier) effects.atkMultiplier *= effect.effects.atkMultiplier;
        if (effect.effects.critChanceBonus) effects.critChanceBonus += effect.effects.critChanceBonus;
        if (effect.effects.critDamageBonus) effects.critDamageBonus += effect.effects.critDamageBonus;
        if (effect.effects.defenseBonus) effects.defenseBonus += effect.effects.defenseBonus;
        if (effect.effects.defMultiplier) effects.defMultiplier *= effect.effects.defMultiplier;
        if (effect.effects.damageReduction) effects.damageReduction += effect.effects.damageReduction;
        if (effect.effects.skillDamageReduction) effects.skillDamageReduction += effect.effects.skillDamageReduction;
        if (effect.effects.flatDamageReduction) effects.flatDamageReduction += effect.effects.flatDamageReduction;
        if (effect.effects.mpShieldRatio) effects.mpShieldRatio += effect.effects.mpShieldRatio;
        if (effect.effects.mpRegenBoost) effects.mpRegenBoost += effect.effects.mpRegenBoost;
        if (effect.effects.mpCostReduction) effects.mpCostReduction += effect.effects.mpCostReduction;
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

if (typeof Game !== "undefined") {
    Game.status.addMonsterStatus = function (id, name, duration, icon = "❄️") {
        if (!Game.monsterManager.currentMonster) return;
        Game.monsterManager.currentMonster.statusEffects = Game.monsterManager.currentMonster.statusEffects || {};
        Game.monsterManager.currentMonster.statusEffects[id] = {
            name,
            icon,
            expiresAt: Date.now() + duration
        };
    };

    Game.skills.formatStatusBonuses = function(effect) {
        if (typeof effect !== "object" || effect === null || !effect.effects) return "";

        const e = effect.effects;
        const parts = [];

        if (e.damageBonus) parts.push(`+${Math.round(e.damageBonus * 100)}% skill damage`);
        if (e.critChanceBonus) parts.push(`+${Math.round(e.critChanceBonus * 100)}% Crit Chance`);
        if (e.critDamageBonus) parts.push(`+${Math.round(e.critDamageBonus * 100)}% Crit Damage`);
        if (e.atkMultiplier && e.atkMultiplier !== 1) parts.push(`+${Math.round((e.atkMultiplier - 1) * 100)}% attack`);
        if (e.defenseBonus) parts.push(`+${e.defenseBonus} DEF`);
        if (e.defMultiplier && e.defMultiplier !== 1) parts.push(`+${Math.round((e.defMultiplier - 1) * 100)}% defense`);
        if (e.damageReduction) parts.push(`-${Math.round(e.damageReduction * 100)}% damage taken`);
        if (e.skillDamageReduction) parts.push(`-${Math.round(e.skillDamageReduction * 100)}% skill damage taken`);
        if (e.mpShieldRatio) parts.push(`${Math.round(e.mpShieldRatio * 100)}% MP Shield`);
        if (e.mpRegenBoost) parts.push(`+${Math.round(e.mpRegenBoost * 100)}% MP regen`);
        if (e.mpCostReduction) parts.push(`-${Math.round(e.mpCostReduction * 100)}% MP cost`);

        return parts.join("<br>");
    };
}


// Export for global use
window.MAGE_SKILLS = MAGE_SKILLS;
window.ARCH_MAGE_SKILLS = ARCH_MAGE_SKILLS;
window.SkillManager = SkillManager;