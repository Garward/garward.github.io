// boots.js - boots item templates
window.ITEM_TEMPLATES = window.ITEM_TEMPLATES || {};
window.ITEM_TEMPLATES.boots = {
                common: { 
                    name: "Cloth Shoes", 
                    sprite: "cloth_boots.png", // ✅ You have this
                    emoji: "👟",
                    description: "Simple cloth footwear for everyday use"
                },
                rare: { 
                    name: "Leather Boots", 
                    sprite: "leather_boots.png", // ✅ You have this
                    emoji: "🥾",
                    description: "Durable leather boots for adventuring"
                },
                epic: { 
                    name: "Iron Boots", 
                    sprite: "iron_boots.png", // Reuse leather until you get more
                    emoji: "🥾",
                    description: "Heavy iron boots for extra protection"
                },
                legendary: { 
                    name: "Golden Boots", 
                    sprite: "gold_boots.png", // Reuse leather
                    emoji: "👢",
                    description: "Magnificent golden boots of swiftness"
                },
                mythic: { 
                    name: "Crystal Boots", 
                    sprite: "crystal_boots.png", // Reuse leather
                    emoji: "💎",
                    description: "Ethereal crystal boots that float above ground"
                }
            };
