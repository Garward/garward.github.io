// berserker.js - Berserker and Ravager. Momentum glass cannon.
(function (root) {
    const ClassKit = root.ClassKit;

    function furyDamage(ctx, perStack) {
        const fury = Math.min(50, ctx.classState?.fury || 0);
        ctx.damage *= 1 + (fury * perStack);
    }

    ClassKit.register({
        id: 'berserker', name: 'Berserker', tier: 'base', evolvesTo: 'ravager',
        description: 'A momentum fighter who grows stronger with each kill',
        tagline: { bestAt: 'Fast sustained farming when fury is maintained', cost: 'No shield and death resets momentum' },
        baseStats: { hp: 135, mp: 45, atk: 34, def: 0 },
        statGrowth: { hp: 14, mp: 2, atk: 6, def: 1 },
        skillSet: 'BERSERKER_SKILLS',
        initialState: { fury: 0 },
        forbiddenSlots: ['shield'],
        hooks: {
            modifyOutgoing(ctx) { furyDamage(ctx, 0.02); },
            modifyIncoming(ctx) { ctx.damage *= 1.08; },
            onKill(ctx) { ctx.classState.fury = Math.min(50, (ctx.classState.fury || 0) + 1); },
            onDeath(ctx) { ctx.classState.fury = 0; }
        }
    });

    ClassKit.register({
        id: 'ravager', name: 'Ravager', tier: 'evolved',
        description: 'A reborn berserker who turns fury into a weapon',
        tagline: { bestAt: 'Explosive farming with high fury stacks', cost: 'No shield and dangerous low-defense bossing' },
        baseStats: { hp: 190, mp: 65, atk: 62, def: 10 },
        statGrowth: { hp: 18, mp: 3, atk: 8, def: 3 },
        skillSet: 'RAVAGER_SKILLS',
        initialState: { fury: 0 },
        forbiddenSlots: ['shield'],
        hooks: {
            modifyOutgoing(ctx) { furyDamage(ctx, 0.025); },
            modifyIncoming(ctx) { ctx.damage *= 1.05; },
            onKill(ctx) { ctx.classState.fury = Math.min(50, (ctx.classState.fury || 0) + 1); },
            onDeath(ctx) { ctx.classState.fury = 0; }
        }
    });
})(typeof window !== 'undefined' ? window : globalThis);
