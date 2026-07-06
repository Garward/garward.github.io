// potions.js - Consumable item templates
window.ITEM_TEMPLATES = window.ITEM_TEMPLATES || {};
window.ITEM_TEMPLATES.potion = {
                common: {
                    name: "Health Potion",
                    sprite: "health_potion.png",
                    emoji: "🧪",
                    healPercent: 20,
                    description: "Restores 20% Max HP"
                },
                rare: {
                    name: "Greater Health Potion",
                    sprite: "health_potion.png",
                    emoji: "🧪",
                    healPercent: 40,
                    description: "Restores 40% Max HP"
                },
                epic: {
                    name: "Super Health Potion",
                    sprite: "health_potion.png",
                    emoji: "🧪",
                    healPercent: 70,
                    description: "Restores 70% Max HP"
                },
                legendary: {
                    name: "Ultimate Health Potion",
                    sprite: "health_potion.png",
                    emoji: "🧪",
                    healPercent: 100,
                    description: "Restores 100% Max HP"
                },
                mythic: {
                    name: "Divine Health Potion",
                    sprite: "health_potion.png",
                    emoji: "🧪",
                    healPercent: 100,
                    description: "Restores 100% Max HP"
                }
            };

window.ITEM_TEMPLATES.mp_potion = {
                common: {
                    name: "Mana Potion",
                    sprite: "mana_potion.png",
                    emoji: "💙",
                    mpRestorePercent: 20,
                    description: "Restores 20% Max MP"
                },
                rare: {
                    name: "Greater Mana Potion",
                    sprite: "mana_potion.png",
                    emoji: "💙",
                    mpRestorePercent: 40,
                    description: "Restores 40% Max MP"
                },
                epic: {
                    name: "Super Mana Potion",
                    sprite: "mana_potion.png",
                    emoji: "💙",
                    mpRestorePercent: 70,
                    description: "Restores 70% Max MP"
                },
                legendary: {
                    name: "Ultimate Mana Potion",
                    sprite: "mana_potion.png",
                    emoji: "💙",
                    mpRestorePercent: 100,
                    description: "Restores 100% Max MP"
                },
                mythic: {
                    name: "Divine Mana Potion",
                    sprite: "mana_potion.png",
                    emoji: "💙",
                    mpRestorePercent: 100,
                    description: "Restores 100% Max MP"
                }
            };

window.ITEM_TEMPLATES.exp_potion = {
                legendary: {
                    name: "Experience Potion",
                    sprite: "exp_potion.png", // Uses dedicated EXP potion sprite
                    emoji: "⭐",
                    expMultiplier: 2, // Default, will be overridden by shop item
                    description: "Multiplies EXP gain for 30 minutes"
                },
                mythic: {
                    name: "Greater Experience Potion",
                    sprite: "exp_potion.png", // Uses dedicated EXP potion sprite
                    emoji: "⭐",
                    expMultiplier: 4, // Will be overridden by shop item
                    description: "Multiplies EXP gain for 30 minutes"
                }
            };
