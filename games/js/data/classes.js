// classes.js - Modular class system for Ragnarok Online Clicker

// Base class definition structure
const CLASS_DEFINITIONS = {
    swordsman: {
        id: "swordsman",
        name: "Swordsman",
        description: "A melee warrior focused on physical combat and defense",
        baseStats: {
            hp: 150,
            mp: 50,
            atk: 25,
            def: 0
        },
        statGrowth: {
            hp: 15,    // HP per level
            mp: 3,     // MP per level
            atk: 5,    // ATK per level
            def: 2     // DEF per level
        },
        skills: "SWORDSMAN_SKILLS",
        rebirthClass: "dragon_knight",
        playstyle: "auto_battle", // Optimized for auto battle
        balancing: {
            autoAttackMultiplier: 1.0,
            skillDamageMultiplier: 1.0,
            defenseMultiplier: 1.2
        }
    },

    mage: {
        id: "mage",
        name: "Mage",
        description: "A magical spellcaster with powerful elemental abilities",
        baseStats: {
            hp: 80,
            mp: 120,
            atk: 15,
            def: 5
        },
        statGrowth: {
            hp: 8,     // Lower HP growth
            mp: 12,    // High MP growth
            atk: 2,    // Low ATK growth
            def: 4     // Combined DEF growth (was 1 + 3)
        },
        skills: "MAGE_SKILLS",
        rebirthClass: "arch_mage",
        playstyle: "active_skills", // Requires active skill usage
        balancing: {
            autoAttackMultiplier: 0.4,  // Weak auto attacks
            skillDamageMultiplier: 2.5, // 2.5x skill damage
            defenseMultiplier: 0.7      // Lower defense
        }
    }
};

// Rebirth class definitions
const REBIRTH_CLASS_DEFINITIONS = {
    dragon_knight: {
        id: "dragon_knight",
        name: "Dragon Knight",
        description: "A legendary warrior who has mastered dragon powers",
        parentClass: "swordsman",
        baseStats: {
            hp: 200,
            mp: 80,
            atk: 50,
            def: 20
        },
        statGrowth: {
            hp: 20,
            mp: 5,
            atk: 7,
            def: 5
        },
        skills: "DRAGON_KNIGHT_SKILLS",
        playstyle: "auto_battle",
        balancing: {
            autoAttackMultiplier: 1.3,
            skillDamageMultiplier: 1.5,
            defenseMultiplier: 1.5
        }
    },

    arch_mage: {
        id: "arch_mage",
        name: "Arch Mage",
        description: "A master of arcane arts with devastating magical powers",
        parentClass: "mage",
        baseStats: {
            hp: 120,
            mp: 200,
            atk: 20,
            def: 20
        },
        statGrowth: {
            hp: 10,
            mp: 18,
            atk: 3,
            def: 5
        },
        skills: "ARCH_MAGE_SKILLS",
        playstyle: "active_skills",
        balancing: {
            autoAttackMultiplier: 0.3,  // Even weaker auto attacks
            skillDamageMultiplier: 3.5, // Massive skill damage
            defenseMultiplier: 0.6      // Very low defense
        }
    }
};

// Class manager for handling class operations
class ClassManager {
    constructor() {
        this.availableClasses = ["swordsman", "mage"];
        this.currentClass = null;
        this.isRebirth = false;
    }

    getAvailableClasses() {
        return this.availableClasses.map(classId => ({
            id: classId,
            ...CLASS_DEFINITIONS[classId]
        }));
    }

    getClassDefinition(classId) {
        if (CLASS_DEFINITIONS[classId]) {
            return CLASS_DEFINITIONS[classId];
        }
        if (REBIRTH_CLASS_DEFINITIONS[classId]) {
            return REBIRTH_CLASS_DEFINITIONS[classId];
        }
        return null;
    }

    canRebirth(currentClass, playerLevel) {
        const classDef = this.getClassDefinition(currentClass);
        if (!classDef || !classDef.rebirthClass) return false;
        
        // Require level 100 for rebirth
        return playerLevel >= 100;
    }

    performRebirth(currentClass) {
        const classDef = this.getClassDefinition(currentClass);
        if (!classDef || !classDef.rebirthClass) return null;
        
        const rebirthClass = classDef.rebirthClass;
        return REBIRTH_CLASS_DEFINITIONS[rebirthClass];
    }

    getClassSkills(classId) {
        const classDef = this.getClassDefinition(classId);
        if (!classDef) return [];
        
        // Return the appropriate skill set
        switch (classDef.skills) {
            case "SWORDSMAN_SKILLS":
                return window.SWORDSMAN_SKILLS || [];
            case "MAGE_SKILLS":
                return window.MAGE_SKILLS || [];
            case "DRAGON_KNIGHT_SKILLS":
                return window.DRAGON_KNIGHT_SKILLS || [];
            case "ARCH_MAGE_SKILLS":
                return window.ARCH_MAGE_SKILLS || [];
            default:
                return [];
        }
    }

    calculateClassStats(classId, level) {
        const classDef = this.getClassDefinition(classId);
        if (!classDef) return null;
        
        const stats = { ...classDef.baseStats };
        
        // Apply level-based growth
        Object.keys(classDef.statGrowth).forEach(stat => {
            stats[stat] += classDef.statGrowth[stat] * (level - 1);
        });
        
        return stats;
    }

    getClassBalancing(classId) {
        const classDef = this.getClassDefinition(classId);
        return classDef ? classDef.balancing : null;
    }
}

// Export for global use
window.CLASS_DEFINITIONS = CLASS_DEFINITIONS;
window.REBIRTH_CLASS_DEFINITIONS = REBIRTH_CLASS_DEFINITIONS;
window.ClassManager = ClassManager;
