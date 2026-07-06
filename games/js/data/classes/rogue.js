// rogue.js - Rogue and Shadowblade. Crit-pierce economy class.
(function (root) {
    const ClassKit = root.ClassKit;

    ClassKit.register({
        id: 'rogue', name: 'Rogue', tier: 'base', evolvesTo: 'shadowblade',
        description: 'A precise skirmisher who turns critical hits into coin',
        tagline: { bestAt: 'Gold and loot acceleration through crits', cost: 'Fragile in long boss fights' },
        baseStats: { hp: 105, mp: 70, atk: 20, def: 2, critChance: 30, critDamage: 120 },
        statGrowth: { hp: 10, mp: 5, atk: 4, def: 2, critChance: 0.12, critDamage: 0.5 },
        skillSet: 'ROGUE_SKILLS',
        hooks: {
            modifyOutgoing(ctx) {
                if (ctx.isCrit) ctx.defenseMultiplier *= 0.7;
                if (ctx.classState?.plunderMarked) {
                    ctx.damage *= 1.15;
                }
            },
            economy(ctx) {
                ctx.goldMult *= ctx.classState?.plunderMarked ? 3.25 : 1.25;
                ctx.lootChanceBonus += 15;
            }
        }
    });

    ClassKit.register({
        id: 'shadowblade', name: 'Shadowblade', tier: 'evolved',
        description: 'An elite rogue who bleeds armor and bankrolls upgrades',
        tagline: { bestAt: 'Highest economy velocity with crit uptime', cost: 'Still folds if caught in boss attrition' },
        baseStats: { hp: 145, mp: 100, atk: 38, def: 16, critChance: 35, critDamage: 140 },
        statGrowth: { hp: 13, mp: 7, atk: 6, def: 4, critChance: 0.16, critDamage: 0.75 },
        skillSet: 'SHADOWBLADE_SKILLS',
        hooks: {
            modifyOutgoing(ctx) {
                if (ctx.isCrit) ctx.defenseMultiplier *= 0.55;
                if (ctx.classState?.plunderMarked) {
                    ctx.damage *= 1.25;
                }
            },
            economy(ctx) {
                ctx.goldMult *= ctx.classState?.plunderMarked ? 3.5 : 1.4;
                ctx.lootChanceBonus += 25;
            }
        }
    });
})(typeof window !== 'undefined' ? window : globalThis);
