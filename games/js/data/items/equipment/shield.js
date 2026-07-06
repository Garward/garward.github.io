// shield.js - shield item templates
window.ITEM_TEMPLATES = window.ITEM_TEMPLATES || {};
window.ITEM_TEMPLATES.shield = {
                common: { 
                    name: "Wooden Shield", 
                    sprite: "wooden_shield.png", // ✅ You have this
                    emoji: "🛡️",
                    description: "A simple wooden shield for basic defense"
                },
                rare: { 
                    name: "Iron Shield", 
                    sprite: "wooden_shield.png", // Reuse wooden until you get more
                    emoji: "🛡️",
                    description: "Solid iron shield with metal reinforcement"
                },
                epic: { 
                    name: "Steel Shield", 
                    sprite: "wooden_shield.png", // Reuse wooden
                    emoji: "🛡️",
                    description: "Advanced steel shield with intricate design"
                },
                legendary: { 
                    name: "Magic Shield", 
                    sprite: "crystal_shield.png", // ✅ You have this
                    emoji: "🛡️",
                    description: "A legendary shield of heroes"
                },
                mythic: { 
                    name: "Crystal Shield", 
                    sprite: "crystal_shield.png", // ✅ You have this
                    emoji: "💎",
                    description: "A mystical crystal shield with magical barriers"
                }
            };
