// summoner.js - Summoner and Archon. Ramping minion damage; boss marathon class.
(function (root) {
    const ClassKit = root.ClassKit;

    function summonOutgoing(directMult, rampCap) {
        return function (ctx) {
            const ramp = Math.min(rampCap, ctx.classState?.ramp || 0);
            const echo = Math.max(1, ctx.minionEcho || 1);
            const minionDamage = Math.floor(ctx.playerAtk * (ramp / 100) * echo);
            ctx.minionDamage = minionDamage;
            ctx.damage = (ctx.damage * directMult) + minionDamage;
        };
    }

    function rampTurn(cap, baseGain) {
        return function (ctx) {
            const bonus = Math.max(0, ctx.rampPerTurnBonus || 0);
            ctx.classState.ramp = Math.min(cap, (ctx.classState.ramp || 0) + baseGain + bonus);
        };
    }

    ClassKit.register({
        id: 'summoner', name: 'Summoner', tier: 'base', evolvesTo: 'archon',
        description: 'Why swing a sword when the swarm can?',
        tagline: { bestAt: 'Million-HP bosses where the swarm can ramp', cost: 'Worst trash clear because short fights end before the swarm arrives' },
        baseStats: { hp: 100, mp: 100, atk: 20, def: 3 },
        statGrowth: { hp: 10, mp: 10, atk: 3, def: 3 },
        skillSet: 'SUMMONER_SKILLS',
        mpRegenPerLevel: 0.3,
        initialState: { ramp: 0 },
        hooks: {
            modifyOutgoing: summonOutgoing(0.6, 300),
            onBattleTurn: rampTurn(300, 15)
        }
    });

    ClassKit.register({
        id: 'archon', name: 'Archon', tier: 'evolved',
        description: 'A general of the unseen host',
        tagline: { bestAt: 'World-boss marathons', cost: 'Still helpless in very short fights' },
        baseStats: { hp: 150, mp: 180, atk: 30, def: 10 },
        statGrowth: { hp: 12, mp: 15, atk: 4, def: 4 },
        skillSet: 'ARCHON_SKILLS',
        mpRegenPerLevel: 0.5,
        initialState: { ramp: 0 },
        hooks: {
            modifyOutgoing: summonOutgoing(0.6, 500),
            onBattleTurn: rampTurn(500, 20)
        }
    });
})(typeof window !== 'undefined' ? window : globalThis);
