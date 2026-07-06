// classes.js - Compatibility shim: builds legacy class tables from ClassKit.
(function (root) {
    const ClassKit = root.ClassKit;

    function toLegacy(def) {
        return {
            id: def.id, name: def.name, description: def.description,
            baseStats: {
                hp: def.baseStats.hp,
                mp: def.baseStats.mp,
                atk: def.baseStats.atk,
                def: def.baseStats.def,
                critChance: def.baseStats.critChance,
                critDamage: def.baseStats.critDamage
            },
            statGrowth: { ...def.statGrowth },
            skills: def.skillSet,
            rebirthClass: def.evolvesTo || null,
            parentClass: null
        };
    }

    const CLASS_DEFINITIONS = {};
    const REBIRTH_CLASS_DEFINITIONS = {};
    ClassKit.list().forEach(def => {
        (def.tier === 'evolved' ? REBIRTH_CLASS_DEFINITIONS : CLASS_DEFINITIONS)[def.id] = toLegacy(def);
    });

    class ClassManager {
        constructor() { this.availableClasses = ClassKit.list().filter(d => d.tier === 'base').map(d => d.id); }
        getAvailableClasses() { return this.availableClasses.map(id => ({ id, ...this.getClassDefinition(id) })); }
        getClassDefinition(classId) { return CLASS_DEFINITIONS[classId] || REBIRTH_CLASS_DEFINITIONS[classId] || null; }
        canRebirth(currentClass, playerLevel) { return playerLevel >= 100; }
        performRebirth(currentClass) {
            const evo = ClassKit.evolutionOf(currentClass);
            return evo ? REBIRTH_CLASS_DEFINITIONS[evo.id] : null;
        }
        getClassSkills(classId) {
            const def = this.getClassDefinition(classId);
            return def ? (root[def.skills] || []) : [];
        }
        calculateClassStats(classId, level) {
            const def = this.getClassDefinition(classId);
            if (!def) return null;
            const stats = { ...def.baseStats };
            Object.keys(def.statGrowth || {}).forEach(s => { stats[s] += def.statGrowth[s] * (level - 1); });
            return stats;
        }
    }

    root.CLASS_DEFINITIONS = CLASS_DEFINITIONS;
    root.REBIRTH_CLASS_DEFINITIONS = REBIRTH_CLASS_DEFINITIONS;
    root.ClassManager = ClassManager;
})(typeof window !== 'undefined' ? window : globalThis);
