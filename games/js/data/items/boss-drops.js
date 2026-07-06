// boss-drops.js - World boss equipment drop tables
window.MVP_EXP_POTION_DROPS = {
    "Vargath": {
        dropChance: 0.25, // 25% chance
        potionTypes: ["4x EXP Potion", "8x EXP Potion", "16x EXP Potion"],
        weights: [60, 30, 10] // 60% for 4x, 30% for 8x, 10% for 16x
    },
    "King Neferok": {
        dropChance: 0.30, // 30% chance
        potionTypes: ["8x EXP Potion", "16x EXP Potion", "32x EXP Potion"],
        weights: [50, 35, 15] // 50% for 8x, 35% for 16x, 15% for 32x
    },
    "Seraphel": {
        dropChance: 0.35, // 35% chance
        potionTypes: ["16x EXP Potion", "32x EXP Potion", "64x EXP Potion", "128x EXP Potion"],
        weights: [40, 30, 20, 10] // 40% for 16x, 30% for 32x, 20% for 64x, 10% for 128x
    }
};

window.MVP_ACCESSORY_DROPS = {
    "Vargath": {
        dropChance: 0.15, // 15% chance
        accessoryTypes: ["ring", "necklace"],
        rarities: ["epic", "legendary"],
        rarityWeights: [70, 30], // 70% epic, 30% legendary
        statMultiplier: 2.0 // Double normal accessory stats
    },
    "King Neferok": {
        dropChance: 0.18, // 18% chance
        accessoryTypes: ["ring", "necklace"],
        rarities: ["epic", "legendary", "mythic"],
        rarityWeights: [50, 40, 10], // 50% epic, 40% legendary, 10% mythic
        statMultiplier: 2.5 // 2.5x normal accessory stats
    },
    "Seraphel": {
        dropChance: 0.22, // 22% chance
        accessoryTypes: ["ring", "necklace"],
        rarities: ["legendary", "mythic"],
        rarityWeights: [60, 40], // 60% legendary, 40% mythic
        statMultiplier: 3.0 // Triple normal accessory stats
    }
};
