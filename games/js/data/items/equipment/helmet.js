// helmet.js - helmet item templates
window.ITEM_TEMPLATES = window.ITEM_TEMPLATES || {};
window.ITEM_TEMPLATES.helmet = {
                common: { 
                    name: "Leather Cap", 
                    sprite: "leather_cap.png", // ✅ You have this
                    emoji: "🎭",
                    description: "Simple leather headwear"
                },
                rare: { 
                    name: "Reinforced Cap", 
                    sprite: "leather_cap.png", // Reuse until you get more
                    emoji: "⛑️",
                    description: "Sturdy reinforced protection"
                },
                epic: { 
                    name: "Battle Helm", 
                    sprite: "leather_cap.png", // Reuse
                    emoji: "⛑️",
                    description: "Advanced helmet with face guard"
                },
                legendary: { 
                    name: "Golden Crown", 
                    sprite: "golden_crown.png", // ✅ You have this
                    emoji: "👑",
                    description: "A royal crown fit for kings"
                },
                mythic: { 
                    name: "Divine Crown", 
                    sprite: "golden_crown.png", // Reuse crown
                    emoji: "💎",
                    description: "A divine crystal circlet of immense power"
                }
            };
