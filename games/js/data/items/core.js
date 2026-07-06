// core.js - Equipment metadata and rarity tables
window.ITEM_TYPES = {
    helmet: { icon: "⛑️", slot: "helmet", statType: "maxHp" },
    chestplate: { icon: "🎽", slot: "chestplate", statType: "def" },
    leggings: { icon: "👖", slot: "leggings", statType: "def" },
    boots: { icon: "🥾", slot: "boots", statType: "maxHp" },
    sword: { icon: "⚔️", slot: "sword", statType: "atk" },
    shield: { icon: "🛡️", slot: "shield", statType: "def" },
    ring: { icon: "💍", slot: "ring", statType: "random" },
    necklace: { icon: "📿", slot: "necklace", statType: "random" },
    potion: { icon: "🧪", slot: null, statType: "heal" },
    mp_potion: { icon: "💙", slot: null, statType: "restore_mp" },
    exp_potion: { icon: "⭐", slot: null, statType: "exp_boost" }
};

window.ACCESSORY_STATS = {
    maxHp: { name: "MAX HP", multiplier: 10 },
    maxMp: { name: "MAX MP", multiplier: 10 },
    expGain: { name: "EXP GAIN", multiplier: 1, suffix: "%" },
    lootChance: { name: "LOOT CHANCE", multiplier: 1, suffix: "%" },
    atkPercent: { name: "ATK", multiplier: 1, suffix: "%" },
    critChance: { name: "CRIT CHANCE", multiplier: 1, suffix: "%" },
    critDamage: { name: "CRIT DAMAGE", multiplier: 1, suffix: "%" },
    skillDamage: { name: "SKILL DAMAGE", multiplier: 1, suffix: "%" }
};

window.RARITIES = ["common", "rare", "epic", "legendary", "mythic"];
window.RARITY_MULTIPLIERS = { common: 1, rare: 1.5, epic: 2, legendary: 3, mythic: 5 };
window.RARITY_DROP_RATES = { common: 0.6, rare: 0.25, epic: 0.08, legendary: 0.015, mythic: 0.005 };

window.ITEM_TEMPLATES = window.ITEM_TEMPLATES || {};
