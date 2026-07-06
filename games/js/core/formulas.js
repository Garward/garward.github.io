// formulas.js - Shared combat, stat, item, and simulation formulas.
//
// Keep pure balance math here so the game and tooling use the same source.
(function (root) {
    const Formula = {
        defaultStatusBonuses() {
            return {
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
        },

        calculateClassStats(classDef, level) {
            if (!classDef) return null;
            const stats = { ...classDef.baseStats };
            Object.keys(classDef.statGrowth || {}).forEach(stat => {
                stats[stat] += classDef.statGrowth[stat] * (level - 1);
            });
            return stats;
        },

        calculatePlayerStats({ baseStats, equipped = {}, passiveApplier = null }) {
            const stats = {
                ...baseStats,
                critChance: baseStats.critChance ?? 15,
                critDamage: baseStats.critDamage ?? 100
            };

            Object.values(equipped).forEach(item => {
                if (!item || !item.stats) return;
                if (item.stats.atk) stats.atk += item.stats.atk;
                if (item.stats.def) stats.def += item.stats.def;
                if (item.stats.maxHp) stats.maxHp += item.stats.maxHp;
                if (item.stats.hp) stats.maxHp += item.stats.hp;
                if (item.stats.maxMp) stats.maxMp += item.stats.maxMp;
                if (item.stats.mp) stats.maxMp += item.stats.mp;
                if (item.stats.mdef) stats.def += item.stats.mdef;

                if (item.stats.atkPercent) {
                    stats.atk = Math.floor(stats.atk * (1 + item.stats.atkPercent / 100));
                }
                if (item.stats.critChance) stats.critChance += item.stats.critChance;
                if (item.stats.critDamage) stats.critDamage += item.stats.critDamage;
            });

            if (typeof passiveApplier === 'function') {
                passiveApplier(stats);
            }

            stats.atk = Math.max(1, stats.atk);
            stats.def = Math.max(0, stats.def);
            stats.maxHp = Math.max(50, stats.maxHp);
            stats.maxMp = Math.max(10, stats.maxMp);
            stats.critChance = Math.max(0, Math.min(100, stats.critChance));
            stats.critDamage = Math.max(100, stats.critDamage);
            stats.hp = Math.min(stats.maxHp, stats.hp ?? stats.maxHp);
            stats.mp = Math.min(stats.maxMp, stats.mp ?? stats.maxMp);
            return stats;
        },

        applyLocationDifficulty(monster, locationKey, locationData) {
            const adjusted = {
                ...monster,
                currentHp: monster.currentHp ?? monster.hp,
                maxHp: monster.maxHp ?? monster.hp
            };
            const isField = locationData?.type === 'field';
            const isDungeon = locationData?.type === 'dungeon';
            const isMvpArea = locationData?.isMvpArea === true;

            if (isField) {
                adjusted.maxHp = Math.floor(adjusted.maxHp * 0.9);
                adjusted.currentHp = adjusted.maxHp;
                adjusted.def = Math.floor(adjusted.def * 0.8);
                adjusted.baseAttack = locationKey === 'verdant_meadow'
                    ? adjusted.level * 2 + 5
                    : adjusted.level * 6 + 15;
            } else if (isDungeon) {
                adjusted.maxHp = Math.floor(adjusted.maxHp * 1.8);
                adjusted.currentHp = adjusted.maxHp;
                adjusted.def = Math.floor(adjusted.def * 1.5);
                adjusted.baseAttack = adjusted.level * 15 + 50;
            }

            if (isMvpArea && adjusted.isMvp) {
                adjusted.maxHp = Math.floor(adjusted.maxHp * 1.2);
                adjusted.currentHp = adjusted.maxHp;
                adjusted.def = Math.floor(adjusted.def * 1.3);
                adjusted.baseAttack = Math.floor(adjusted.baseAttack * 1.5);
            }

            return adjusted;
        },

        getSkillDamageBonus(equipped = {}) {
            return Object.values(equipped).reduce((total, item) => {
                return total + (item?.stats?.skillDamage || 0);
            }, 0);
        },

        calculatePlayerAttackDamage({
            player,
            monster,
            skill = null,
            statusBonuses = null,
            equipped = {},
            variance = 1,
            critRoll = 1,
            skillCritRoll = 1
        }) {
            const bonuses = { ...this.defaultStatusBonuses(), ...(statusBonuses || {}) };
            let damage = player.atk;
            let isCrit = false;

            damage *= bonuses.atkMultiplier;

            if (skill) {
                damage *= skill.damageMultiplier + (skill.currentLevel * 0.1);
                if (skill.critBonus && skillCritRoll < (skill.critBonus / 100)) {
                    damage *= 2;
                    isCrit = true;
                }

                const skillDamageBonus = this.getSkillDamageBonus(equipped);
                if (skillDamageBonus > 0) {
                    damage *= (1 + skillDamageBonus / 100);
                }
            }

            if (!isCrit && critRoll < (player.critChance / 100)) {
                const critMultiplier = 1 + (player.critDamage / 100);
                damage *= critMultiplier;
                isCrit = true;
            }

            damage *= (1 + bonuses.damageBonus);

            let defense = monster.def;
            if (skill?.armorPiercePercent) {
                defense = Math.floor(defense * (1 - skill.armorPiercePercent / 100));
            }

            const beforeVariance = Math.max(1, damage - defense);
            const finalDamage = Math.floor(beforeVariance * variance);

            return {
                damage: finalDamage,
                beforeVariance,
                defense,
                isCrit,
                variance
            };
        },

        calculatePlayerAttackRange(args) {
            const normalMin = this.calculatePlayerAttackDamage({ ...args, variance: 0.9, critRoll: 1, skillCritRoll: 1 }).damage;
            const normalAvg = this.calculatePlayerAttackDamage({ ...args, variance: 1, critRoll: 1, skillCritRoll: 1 }).damage;
            const normalMax = this.calculatePlayerAttackDamage({ ...args, variance: 1.1, critRoll: 1, skillCritRoll: 1 }).damage;
            const critAvg = this.calculatePlayerAttackDamage({ ...args, variance: 1, critRoll: 0, skillCritRoll: 0 }).damage;
            const critChance = Math.max(0, Math.min(1, (args.player.critChance || 0) / 100));
            const expected = Math.round((normalAvg * (1 - critChance)) + (critAvg * critChance));
            return { normalMin, normalAvg, normalMax, critAvg, critChance, expected };
        },

        calculateMonsterAttackDamage({ monster, player, statusBonuses = null }) {
            const bonuses = { ...this.defaultStatusBonuses(), ...(statusBonuses || {}) };
            let monsterDamage = monster.baseAttack || (monster.level * 8 + 20);
            if (monsterDamage < 1) monsterDamage = 1;
            if (monster.isBoss) monsterDamage *= 2.5;

            const totalDefense = (player.def + bonuses.defenseBonus) * bonuses.defMultiplier;
            const defenseScaling = totalDefense / (totalDefense + 100 + monster.level * 2);
            let reducedDamage = monsterDamage * (1 - defenseScaling);

            if (bonuses.skillDamageReduction > 0) {
                reducedDamage *= (1 - bonuses.skillDamageReduction);
            }

            const flatReduction = Math.min(0.5 * totalDefense, monsterDamage * 0.7);
            reducedDamage -= flatReduction;
            reducedDamage = Math.floor(Math.max(0, reducedDamage));

            const damage = Math.max(Math.floor(monsterDamage * 0.01), reducedDamage);
            const mpAbsorbed = Math.floor(damage * (bonuses.mpShieldRatio || 0));

            return {
                damage,
                monsterDamage,
                totalDefense,
                defenseScaling,
                flatReduction,
                mpAbsorbed
            };
        },

        calculateEquipmentStatValue({ monsterLevel, rarityMultiplier, variance = 1 }) {
            const requiredLevel = Math.max(1, Math.floor(monsterLevel * 0.9));
            const levelScaling = requiredLevel * 0.8;
            const statValue = Math.max(1, Math.floor(levelScaling * rarityMultiplier * variance));
            return { requiredLevel, statValue };
        },

        calculateEquipmentStats({ type, statType, monsterLevel, rarityMultiplier, variance = 1 }) {
            const { requiredLevel, statValue } = this.calculateEquipmentStatValue({
                monsterLevel,
                rarityMultiplier,
                variance
            });
            let finalStatValue = statValue;
            if (statType === 'maxHp') finalStatValue = statValue * 10;
            return {
                requiredLevel,
                stats: { [statType]: finalStatValue },
                baseStats: { [statType]: finalStatValue },
                type
            };
        },

        getAccessoryStatLineCount(rarity, rarities) {
            const rarityIndex = rarities.indexOf(rarity);
            if (rarityIndex >= 4) return 4;
            if (rarityIndex >= 3) return 3;
            if (rarityIndex >= 2) return 2;
            return 1;
        },

        calculateAccessoryStatValue({ baseValue, statConfig }) {
            let statValue = Math.floor(baseValue * statConfig.multiplier);
            if (statConfig.suffix === '%') {
                statValue = Math.max(1, Math.floor(statValue / 5));
            }
            return statValue;
        },

        calculateUpgradeMultiplier(upgradeLevel) {
            return Math.pow(1.25, upgradeLevel || 0);
        },

        calculateUpgradedStats(baseStats, upgradeLevel) {
            const multiplier = this.calculateUpgradeMultiplier(upgradeLevel);
            const stats = {};
            Object.keys(baseStats || {}).forEach(stat => {
                stats[stat] = Math.floor(baseStats[stat] * multiplier);
            });
            return stats;
        },

        getUpgradeCost(currentLevel) {
            return 1000 * Math.pow(2, currentLevel);
        },

        getUpgradeChance(currentLevel) {
            const baseChance = 90;
            const reduction = currentLevel * 5.33;
            return Math.max(10, Math.round(baseChance - reduction));
        }
    };

    root.GloamFormula = Formula;
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = Formula;
    }
})(typeof window !== 'undefined' ? window : globalThis);
