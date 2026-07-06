// sword.js - sword item templates
window.ITEM_TEMPLATES = window.ITEM_TEMPLATES || {};
window.ITEM_TEMPLATES.sword = {
                common: { 
                    name: "Iron Sword", 
                    sprite: "iron_sword.png",  // ✅ You have this
                    emoji: "⚔️",
                    description: "A basic iron sword for beginners"
                },
                rare: { 
                    name: "Steel Sword", 
                    sprite: "steel_sword.png", // ✅ You have this
                    emoji: "⚔️",
                    description: "A well-crafted steel blade"
                },
                epic: { 
                    name: "Enchanted Sword", 
                    sprite: "steel_sword.png", // Reuse steel until you get more
                    emoji: "🗡️",
                    description: "A magically enhanced blade"
                },
                legendary: { 
                    name: "Hero's Sword", 
                    sprite: "crystal_sword.png",
                    emoji: "🗡️",
                    description: "A legendary weapon of heroes"
                },
                mythic: { 
                    name: "DragonSlayer", 
                    sprite: "dragonslayer.png", 
                    emoji: "💎",
                    description: "A cursed blade forged to slay dragons, its blood-red edge thirsts for vengeance."
                }
            };
