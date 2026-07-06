// swordsman.js - Swordsman and its evolution. AFK specialist.
(function (root) {
    const ClassKit = root.ClassKit;

    ClassKit.register({
        id: 'swordsman', name: 'Swordsman', tier: 'base', evolvesTo: 'dragon_knight',
        description: 'A melee warrior focused on steady physical combat and defense',
        tagline: { bestAt: 'True AFK farming — even in dungeons', cost: 'Lowest ceiling: gains nothing from attention or streaks' },
        baseStats: { hp: 150, mp: 50, atk: 25, def: 0 },
        statGrowth: { hp: 15, mp: 3, atk: 5, def: 2 },
        skillSet: 'SWORDSMAN_SKILLS',
        hooks: {
            modifyOutgoing(ctx) { ctx.damage *= ctx.isSkill ? 0.9 : 1.1; },
            onKill(ctx) { ctx.healPercent = 0.03; }
        }
    });

    ClassKit.register({
        id: 'dragon_knight', name: 'Dragon Knight', tier: 'evolved',
        description: 'A legendary warrior who has mastered dragon powers',
        tagline: { bestAt: 'Unkillable AFK anywhere', cost: 'Still no attention scaling' },
        baseStats: { hp: 200, mp: 80, atk: 50, def: 20 },
        statGrowth: { hp: 20, mp: 5, atk: 7, def: 5 },
        skillSet: 'DRAGON_KNIGHT_SKILLS',
        hooks: {
            modifyOutgoing(ctx) { ctx.damage *= ctx.isSkill ? 0.9 : 1.15; },
            onKill(ctx) { ctx.healPercent = 0.05; }
        }
    });
})(typeof window !== 'undefined' ? window : globalThis);
