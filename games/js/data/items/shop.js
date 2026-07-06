// shop.js - Shop item data
window.SHOP_ITEMS = [
    { name: "Health Potion", type: "potion", rarity: "common", priceBase: 5, healPercent: 0.20, level: 1 },
    { name: "Greater Health Potion", type: "potion", rarity: "rare", priceBase: 18, healPercent: 0.40, level: 10 },
    { name: "Super Health Potion", type: "potion", rarity: "epic", priceBase: 60, healPercent: 0.70, level: 25 },
    { name: "Mana Potion", type: "mp_potion", rarity: "common", priceBase: 4, mpRestorePercent: 0.30, level: 1 },
    { name: "Greater Mana Potion", type: "mp_potion", rarity: "rare", priceBase: 15, mpRestorePercent: 0.60, level: 5 },
    { name: "Super Mana Potion", type: "mp_potion", rarity: "epic", priceBase: 50, mpRestorePercent: 0.90, level: 15 },
    // Experience Potions - Context Menu Shop Item
    { name: "Experience Potions", type: "exp_potion_menu", rarity: "legendary", price: 0, level: 1, isContextMenu: true }
];

window.EXP_POTION_OPTIONS = [
    { name: "2x EXP Potion", type: "exp_potion", rarity: "legendary", price: 40000, expMultiplier: 2, level: 1 },
    { name: "4x EXP Potion", type: "exp_potion", rarity: "legendary", price: 100000, expMultiplier: 4, level: 1 },
    { name: "8x EXP Potion", type: "exp_potion", rarity: "legendary", price: 250000, expMultiplier: 8, level: 1 },
    { name: "16x EXP Potion", type: "exp_potion", rarity: "legendary", price: 600000, expMultiplier: 16, level: 1 },
    { name: "32x EXP Potion", type: "exp_potion", rarity: "legendary", price: 1500000, expMultiplier: 32, level: 1 },
    { name: "64x EXP Potion", type: "exp_potion", rarity: "legendary", price: 4000000, expMultiplier: 64, level: 1 },
    { name: "128x EXP Potion", type: "exp_potion", rarity: "mythic", price: 10000000, expMultiplier: 128, level: 1 },
    { name: "256x EXP Potion", type: "exp_potion", rarity: "mythic", price: 25000000, expMultiplier: 256, level: 1 },
    { name: "512x EXP Potion", type: "exp_potion", rarity: "mythic", price: 60000000, expMultiplier: 512, level: 1 }
];
