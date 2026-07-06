// item-factory.js - Equipment item construction from item templates.

class ActualSpriteDatabase {
    constructor() {
        this.spriteBasePath = "sprites/items/";
        this.itemTemplates = window.ITEM_TEMPLATES || {};
    }

    getItemTemplate(type, rarity) {
        return this.itemTemplates[type]?.[rarity] || null;
    }

    generateItem(type, rarity, monsterLevel) {
        const template = this.getItemTemplate(type, rarity);
        if (!template) {
            console.warn(`No template found for ${type} ${rarity}`);
            return null;
        }

        const rarityMult = window.RARITY_MULTIPLIERS[rarity];

        const variance = 0.85 + Math.random() * 0.3;
        const statRoll = GloamFormula.calculateEquipmentStatValue({
            monsterLevel,
            rarityMultiplier: rarityMult,
            variance
        });
        const requiredLevel = statRoll.requiredLevel;
        const statValue = statRoll.statValue;

        const item = {
            name: template.name,
            type: type,
            rarity: rarity,
            icon: template.emoji,
            sprite: template.sprite,
            spriteUrl: this.spriteBasePath + template.sprite,
            description: template.description,
            slot: window.ITEM_TYPES[type]?.slot,
            id: Date.now() + Math.random(),
            level: requiredLevel,
            itemLevel: monsterLevel,
            upgradeLevel: 0,
            baseStats: null
        };

        if (type === 'potion') {
            item.stats = { healPercent: template.healPercent || 10 };
        } else if (type === 'mp_potion') {
            item.stats = { mpRestorePercent: template.mpRestorePercent || 10 };
        } else if (type === 'exp_potion') {
            item.stats = { exp_boost: template.expMultiplier || 2 };
        } else if (type === 'ring' || type === 'necklace') {
            const accessoryStats = this.generateAccessoryStats(rarity, statValue);
            item.stats = accessoryStats.stats;
            item.baseStats = { ...accessoryStats.stats };
        } else {
            const statType = window.ITEM_TYPES[type].statType;
            const generatedStats = GloamFormula.calculateEquipmentStats({
                type,
                statType,
                monsterLevel,
                rarityMultiplier: rarityMult,
                variance
            });

            item.stats = generatedStats.stats;
            item.baseStats = generatedStats.baseStats;
        }

        return item;
    }

    getSpriteUrl(sprite) {
        return this.spriteBasePath + sprite;
    }

    generateAccessoryStats(rarity, baseValue) {
        const stats = {};
        const numStats = GloamFormula.getAccessoryStatLineCount(rarity, window.RARITIES);
        const statKeys = Object.keys(window.ACCESSORY_STATS);

        for (let i = 0; i < numStats; i++) {
            const statType = statKeys[Math.floor(Math.random() * statKeys.length)];
            const statConfig = window.ACCESSORY_STATS[statType];
            const statValue = GloamFormula.calculateAccessoryStatValue({ baseValue, statConfig });

            if (stats[statType]) {
                stats[statType] += statValue;
            } else {
                stats[statType] = statValue;
            }
        }

        return { stats };
    }
}

window.ActualSpriteDatabase = ActualSpriteDatabase;
