// formulas.js - Shared combat, stat, item, and simulation formulas.
//
// Keep pure balance math here so the game and tooling use the same source.
(function (root) {
    const kit = () => root.ClassKit || null;

    const Formula = {
        maxExpForLevel(level) {
            const safeLevel = Math.max(1, Number(level) || 1);
            return Math.round(80 * Math.pow(safeLevel, 1.9));
        },

        prestigeBonuses(rebirthCount = 0) {
            const count = Math.max(0, Number(rebirthCount) || 0);
            return {
                damageMultiplier: 1 + (count * 0.10),
                expMultiplier: 1 + (count * 0.10),
                goldMultiplier: 1 + (count * 0.05)
            };
        },

        applyRebirth(state, evolutionId = null) {
            if (!state) throw new Error('applyRebirth requires a state object');
            const nextClassId = evolutionId || state.classId || 'swordsman';
            state.rebirthCount = (state.rebirthCount || 0) + 1;
            state.classId = nextClassId;
            state.class = nextClassId;
            state.classState = kit() ? kit().createState(nextClassId) : {};
            state.level = 1;
            state.exp = 0;
            state.maxExp = this.maxExpForLevel(1);
            state.skillPoints = 1;
            state.unlockedAreas = ['verdant_meadow'];
            state.areaProgress = {};
            state.currentLocation = 'verdant_meadow';
            state.rebirthOfferShown = false;
            state.isDragonKnight = nextClassId === 'dragon_knight';
            state.isArchMage = nextClassId === 'arch_mage';
            return state;
        },

        rewardMultipliers({ classId, classState, rebirthCount }) {
            const eco = { goldMult: 1, expMult: 1, lootChanceBonus: 0, classState: classState || {} };
            if (classId && kit()) kit().hooks(classId).economy(eco);
            const p = this.prestigeBonuses(rebirthCount || 0);
            return {
                goldMult: eco.goldMult * p.goldMultiplier,
                expMult: eco.expMult * p.expMultiplier,
                lootChanceBonus: eco.lootChanceBonus
            };
        },

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

        potionPercentRatio(value) {
            const numeric = Number(value) || 0;
            return numeric > 1 ? numeric / 100 : numeric;
        },

        potionEffect(potion, playerMaxStat) {
            if (!potion) return 0;
            if (typeof potion.healing === 'number') return Math.floor(potion.healing);
            if (typeof potion.heal === 'number') return Math.floor(potion.heal);
            if (typeof potion.mpRestore === 'number') return Math.floor(potion.mpRestore);
            if (typeof potion.restore_mp === 'number') return Math.floor(potion.restore_mp);
            const percent = potion.healPercent ?? potion.mpRestorePercent;
            if (percent == null) return 0;
            return Math.floor((Number(playerMaxStat) || 0) * this.potionPercentRatio(percent));
        },

        potionPrice(potion, playerLevel) {
            if (!potion) return 0;
            if (typeof potion.priceBase === 'number') {
                return Math.floor(potion.priceBase * Math.max(1, Number(playerLevel) || 1));
            }
            return Math.floor(potion.price || 0);
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
            adjusted.maxHp = adjusted.hp;
            adjusted.currentHp = adjusted.maxHp;
            adjusted.baseAttack = adjusted.baseAttack ||
                this.calculateMonsterBaseAttack(this.getMonsterBand(monster, locationData), monster.level);

            return adjusted;
        },

        getMonsterBand(monster, locationData) {
            if (monster?.isMvp || locationData?.isMvpArea) return 'worldBoss';
            if (monster?.isBoss) return 'areaBoss';
            if (locationData?.type === 'dungeon') return 'dungeonTrash';
            return 'fieldTrash';
        },

        getMonsterBandConfig(band) {
            const bands = {
                fieldTrash: { attackPerLevel: 3.5, attackFlat: 5 },
                dungeonTrash: { attackPerLevel: 4.4, attackFlat: 18 },
                areaBoss: { attackPerLevel: 5.1, attackFlat: 40 },
                worldBoss: { attackPerLevel: 5.5, attackFlat: 55 }
            };
            return bands[band] || bands.fieldTrash;
        },

        calculateMonsterBaseAttack(band, level) {
            const cfg = this.getMonsterBandConfig(band);
            return Math.max(1, Math.round(cfg.attackFlat + (level * cfg.attackPerLevel)));
        },

        getSkillDamageBonus(equipped = {}) {
            return Object.values(equipped).reduce((total, item) => {
                return total + (item?.stats?.skillDamage || 0);
            }, 0);
        },

        calculatePlayerAttackDamage(args) {
            const {
                player,
                monster,
                skill = null,
                statusBonuses = null,
                equipped = {},
                variance = 1,
                critRoll = 1,
                skillCritRoll = 1
            } = args;
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

            const classId = args.classId;
            let classDefenseMultiplier = 1;
            let minionDamage = 0;
            if (classId && kit()) {
                const ctx = {
                    damage, isSkill: !!skill, isCrit,
                    player,
                    monster,
                    playerAtk: player.atk,
                    classState: args.classState || {},
                    turn: args.turn || 1,
                    defenseMultiplier: 1,
                    minionDamage: 0,
                    minionEcho: skill?.minionEcho || 1
                };
                kit().hooks(classId).modifyOutgoing(ctx);
                damage = ctx.damage;
                classDefenseMultiplier = ctx.defenseMultiplier;
                minionDamage = ctx.minionDamage || 0;
            }
            const rebirths = args.rebirthCount ?? player.rebirthCount ?? player.state?.rebirthCount ?? 0;
            damage *= this.prestigeBonuses(rebirths).damageMultiplier;

            let defense = monster.def;
            if (skill?.armorPiercePercent) {
                defense = Math.floor(defense * (1 - skill.armorPiercePercent / 100));
            }
            if (typeof classDefenseMultiplier === 'number') {
                defense = Math.floor(defense * classDefenseMultiplier);
            }

            const beforeVariance = Math.max(1, damage - defense);
            const finalDamage = Math.floor(beforeVariance * variance);

            return {
                damage: finalDamage,
                beforeVariance,
                defense,
                isCrit,
                variance,
                minionDamage
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

        calculateMonsterAttackDamage({ monster, player, statusBonuses = null, classId = null, classState = null }) {
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

            const flatReduction = Math.min(0.5 * totalDefense, monsterDamage * 0.4);
            reducedDamage -= flatReduction;
            reducedDamage = Math.floor(Math.max(0, reducedDamage));

            let damage = Math.max(Math.ceil(monsterDamage * 0.05), reducedDamage);
            if (classId && kit()) {
                const ctx = { damage, monster, classState: classState || {} };
                kit().hooks(classId).modifyIncoming(ctx);
                damage = Math.max(0, Math.floor(ctx.damage));
            }
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

        mvpBattleTurn({ monster, mvpState, turn, rng = Math.random }) {
            const state = mvpState || {};
            state.cooldowns = state.cooldowns || {};
            state.phasesTriggered = state.phasesTriggered || [];
            state.usedHeals = state.usedHeals || [];
            state.damageBonus = state.damageBonus || 0;

            let damageMultiplier = 1;
            let healPercent = 0;
            let shieldTurns = 0;
            const messages = [];

            const hpRatio = monster.maxHp > 0
                ? Math.max(0, Math.min(1, (monster.currentHp ?? monster.hp) / monster.maxHp))
                : 1;

            (monster.phases || []).forEach(phase => {
                const key = phase.effect || phase.message || String(phase.hpThreshold);
                if (hpRatio <= phase.hpThreshold && !state.phasesTriggered.includes(key)) {
                    state.phasesTriggered.push(key);
                    messages.push(phase.message);
                    if (['rage', 'curse', 'ascension'].includes(phase.effect)) {
                        state.damageBonus += 0.25;
                    } else if (['frenzy', 'desperation', 'judgment'].includes(phase.effect)) {
                        state.damageBonus += 0.5;
                    }
                }
            });

            const readySkills = (monster.mvpSkills || []).filter(skill => {
                const cooldownTurns = Math.max(1, Math.ceil((skill.cooldown || 1000) / 1000));
                const lastTurn = state.cooldowns[skill.name] || 0;
                return turn - lastTurn >= cooldownTurns;
            });

            if (readySkills.length > 0) {
                const skill = readySkills[Math.floor(rng() * readySkills.length)] || readySkills[0];
                state.cooldowns[skill.name] = turn;
                messages.push(skill.name);

                if (skill.damage) {
                    damageMultiplier = skill.damage;
                }

                if (skill.effect === 'summon') {
                    damageMultiplier = Math.max(damageMultiplier, 1.3);
                } else if (skill.effect === 'shield') {
                    shieldTurns = 3;
                    state.shieldTurns = Math.max(state.shieldTurns || 0, shieldTurns);
                } else if (skill.effect === 'heal' || skill.effect === 'fullheal') {
                    if (!state.usedHeals.includes(skill.name)) {
                        healPercent = skill.effect === 'fullheal' ? 1 : 0.25;
                        state.usedHeals.push(skill.name);
                    }
                }
            }

            damageMultiplier *= 1 + (state.damageBonus || 0);

            return {
                damageMultiplier,
                message: messages.filter(Boolean).join(' '),
                healPercent,
                shieldTurns
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
