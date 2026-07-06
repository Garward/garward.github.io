// class-kit.js - Data-driven class registry + combat hook dispatcher.
//
// A class is a plain definition object registered here. Combat/stat code
// never special-cases a class id; it calls hooks. Pure & Node-loadable so
// tools/damage-sim.js simulates every class with the live rules.
(function (root) {
    const registry = new Map();

    const NOOP_HOOKS = {
        modifyOutgoing() {}, modifyIncoming() {},
        onKill() {}, onDeath() {}, onBattleTurn() {}, economy() {}
    };

    const ClassKit = {
        register(def) {
            if (!def || !def.id) throw new Error('ClassKit.register: def.id required');
            registry.set(def.id, def);
            return def;
        },
        get(id) { return registry.get(id) || null; },
        list() { return [...registry.values()]; },
        evolutionOf(id) {
            const def = registry.get(id);
            return def && def.evolvesTo ? registry.get(def.evolvesTo) || null : null;
        },
        hooks(id) {
            const def = registry.get(id);
            return { ...NOOP_HOOKS, ...(def && def.hooks ? def.hooks : {}) };
        },
        createState(id) {
            const def = registry.get(id);
            return def && def.initialState ? JSON.parse(JSON.stringify(def.initialState)) : {};
        }
    };

    root.ClassKit = ClassKit;
    if (typeof module !== 'undefined' && module.exports) module.exports = ClassKit;
})(typeof window !== 'undefined' ? window : globalThis);
