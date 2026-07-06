// mage.js - Mage and its evolution. Active skill specialist.
(function (root) {
    const ClassKit = root.ClassKit;

    ClassKit.register({
        id: 'mage', name: 'Mage', tier: 'base', evolvesTo: 'arch_mage',
        description: 'A spellcaster whose power lives in her skills, not her staff swings',
        tagline: { bestAt: 'Active casting — efficient trash and mid-boss clears', cost: 'MP economy: needs mana potions and attention; terrible AFK' },
        baseStats: { hp: 80, mp: 120, atk: 15, def: 5 },
        statGrowth: { hp: 8, mp: 12, atk: 2, def: 4 },
        skillSet: 'MAGE_SKILLS',
        mpRegenPerLevel: 0.4,
        hooks: {
            modifyOutgoing(ctx) { ctx.damage *= ctx.isSkill ? 0.65 : 0.4; }
        }
    });

    ClassKit.register({
        id: 'arch_mage', name: 'Arch Mage', tier: 'evolved',
        description: 'A master of arcane arts with devastating magical powers',
        tagline: { bestAt: 'Sustained spell damage', cost: 'Glass everything; MP is life' },
        baseStats: { hp: 120, mp: 200, atk: 20, def: 20 },
        statGrowth: { hp: 10, mp: 18, atk: 3, def: 5 },
        skillSet: 'ARCH_MAGE_SKILLS',
        mpRegenPerLevel: 0.6,
        hooks: {
            modifyOutgoing(ctx) { ctx.damage *= ctx.isSkill ? 0.75 : 0.35; }
        }
    });
})(typeof window !== 'undefined' ? window : globalThis);
