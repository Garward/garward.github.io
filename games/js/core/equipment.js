// equipment.js - Complete Equipment and inventory management with sprite system and pagination
const ITEM_TYPES = {
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

// Accessory stat types for randomization
const ACCESSORY_STATS = {
    maxHp: { name: "MAX HP", multiplier: 10 },
    maxMp: { name: "MAX MP", multiplier: 10 },
    expGain: { name: "EXP GAIN", multiplier: 1, suffix: "%" },
    lootChance: { name: "LOOT CHANCE", multiplier: 1, suffix: "%" },
    atkPercent: { name: "ATK", multiplier: 1, suffix: "%" },
    critChance: { name: "CRIT CHANCE", multiplier: 1, suffix: "%" },
    critDamage: { name: "CRIT DAMAGE", multiplier: 1, suffix: "%" },
    skillDamage: { name: "SKILL DAMAGE", multiplier: 1, suffix: "%" }
};

const RARITIES = ["common", "rare", "epic", "legendary", "mythic"];
const RARITY_MULTIPLIERS = { common: 1, rare: 1.5, epic: 2, legendary: 3, mythic: 5 };
const RARITY_DROP_RATES = { common: 0.6, rare: 0.25, epic: 0.08, legendary: 0.015, mythic: 0.005 };

const SHOP_ITEMS = [
    { name: "Health Potion", type: "potion", rarity: "common", price: 50, healing: 50, level: 1 },
    { name: "Greater Health Potion", type: "potion", rarity: "rare", price: 150, healing: 150, level: 10 },
    { name: "Super Health Potion", type: "potion", rarity: "epic", price: 500, healing: 300, level: 25 },
    { name: "Mana Potion", type: "mp_potion", rarity: "common", price: 40, mpRestore: 30, level: 1 },
    { name: "Greater Mana Potion", type: "mp_potion", rarity: "rare", price: 120, mpRestore: 80, level: 5 },
    { name: "Super Mana Potion", type: "mp_potion", rarity: "epic", price: 400, mpRestore: 150, level: 15 },
    // Experience Potions - Context Menu Shop Item
    { name: "Experience Potions", type: "exp_potion_menu", rarity: "legendary", price: 0, level: 1, isContextMenu: true }
];

// EXP Potion Options for Context Menu
const EXP_POTION_OPTIONS = [
    { name: "2x EXP Potion", type: "exp_potion", rarity: "legendary", price: 30000, expMultiplier: 2, level: 1 },
    { name: "4x EXP Potion", type: "exp_potion", rarity: "legendary", price: 60000, expMultiplier: 4, level: 1 },
    { name: "8x EXP Potion", type: "exp_potion", rarity: "legendary", price: 120000, expMultiplier: 8, level: 1 },
    { name: "16x EXP Potion", type: "exp_potion", rarity: "legendary", price: 240000, expMultiplier: 16, level: 1 },
    { name: "32x EXP Potion", type: "exp_potion", rarity: "legendary", price: 480000, expMultiplier: 32, level: 1 },
    { name: "64x EXP Potion", type: "exp_potion", rarity: "legendary", price: 960000, expMultiplier: 64, level: 1 },
    { name: "128x EXP Potion", type: "exp_potion", rarity: "mythic", price: 1920000, expMultiplier: 128, level: 1 },
    { name: "256x EXP Potion", type: "exp_potion", rarity: "mythic", price: 3840000, expMultiplier: 256, level: 1 },
    { name: "512x EXP Potion", type: "exp_potion", rarity: "mythic", price: 7680000, expMultiplier: 512, level: 1 }
];

// ===== MVP BOSS EXP POTION DROPS =====
const MVP_EXP_POTION_DROPS = {
    "Baphomet": {
        dropChance: 0.25, // 25% chance
        potionTypes: ["4x EXP Potion", "8x EXP Potion", "16x EXP Potion"],
        weights: [60, 30, 10] // 60% for 4x, 30% for 8x, 10% for 16x
    },
    "Osiris": {
        dropChance: 0.30, // 30% chance
        potionTypes: ["8x EXP Potion", "16x EXP Potion", "32x EXP Potion"],
        weights: [50, 35, 15] // 50% for 8x, 35% for 16x, 15% for 32x
    },
    "Thanatos": {
        dropChance: 0.35, // 35% chance
        potionTypes: ["16x EXP Potion", "32x EXP Potion", "64x EXP Potion", "128x EXP Potion"],
        weights: [40, 30, 20, 10] // 40% for 16x, 30% for 32x, 20% for 64x, 10% for 128x
    }
};

// MVP Boss Accessory Drops
const MVP_ACCESSORY_DROPS = {
    "Baphomet": {
        dropChance: 0.15, // 15% chance
        accessoryTypes: ["ring", "necklace"],
        rarities: ["epic", "legendary"],
        rarityWeights: [70, 30], // 70% epic, 30% legendary
        statMultiplier: 2.0 // Double normal accessory stats
    },
    "Osiris": {
        dropChance: 0.18, // 18% chance
        accessoryTypes: ["ring", "necklace"],
        rarities: ["epic", "legendary", "mythic"],
        rarityWeights: [50, 40, 10], // 50% epic, 40% legendary, 10% mythic
        statMultiplier: 2.5 // 2.5x normal accessory stats
    },
    "Thanatos": {
        dropChance: 0.22, // 22% chance
        accessoryTypes: ["ring", "necklace"],
        rarities: ["legendary", "mythic"],
        rarityWeights: [60, 40], // 60% legendary, 40% mythic
        statMultiplier: 3.0 // Triple normal accessory stats
    }
};

// Function to handle MVP EXP potion drops (to be called when MVP is defeated)
function handleMvpExpPotionDrop(mvpName) {
    const mvpConfig = MVP_EXP_POTION_DROPS[mvpName];
    if (!mvpConfig || !Game.equipment) return null;

    // Check if drop occurs
    if (Math.random() > mvpConfig.dropChance) return null;

    // Select which potion type to drop based on weights
    const totalWeight = mvpConfig.weights.reduce((sum, weight) => sum + weight, 0);
    let randomValue = Math.random() * totalWeight;

    for (let i = 0; i < mvpConfig.potionTypes.length; i++) {
        randomValue -= mvpConfig.weights[i];
        if (randomValue <= 0) {
            const potionName = mvpConfig.potionTypes[i];
            const shopItem = EXP_POTION_OPTIONS.find(item => item.name === potionName);

            if (shopItem) {
                // Create the potion item
                const potion = Game.equipment.generateItem(shopItem.type, shopItem.rarity, 1);
                if (potion) {
                    potion.stats = { exp_boost: shopItem.expMultiplier };
                    potion.name = shopItem.name;

                    // Add to inventory
                    if (Game.equipment.addToInventory(potion, 1)) {
                        Game.ui.showLootNotification(`🎉 MVP DROP: ${potionName}!`, 3000);
                        return potion;
                    }
                }
            }
            break;
        }
    }

    return null;
}

// Function to handle MVP accessory drops
function handleMvpAccessoryDrop(mvpName) {
    const mvpConfig = MVP_ACCESSORY_DROPS[mvpName];
    if (!mvpConfig || !Game.equipment) return null;

    // Check if drop occurs
    if (Math.random() > mvpConfig.dropChance) return null;

    // Select accessory type
    const accessoryType = mvpConfig.accessoryTypes[Math.floor(Math.random() * mvpConfig.accessoryTypes.length)];

    // Select rarity based on weights
    const totalWeight = mvpConfig.rarityWeights.reduce((sum, weight) => sum + weight, 0);
    let randomValue = Math.random() * totalWeight;
    let selectedRarity = mvpConfig.rarities[0];

    for (let i = 0; i < mvpConfig.rarities.length; i++) {
        randomValue -= mvpConfig.rarityWeights[i];
        if (randomValue <= 0) {
            selectedRarity = mvpConfig.rarities[i];
            break;
        }
    }

    // Generate the accessory with enhanced stats
    const accessory = Game.equipment.generateItem(accessoryType, selectedRarity, 120);

    if (accessory) {
        // Enhance stats based on MVP multiplier
        if (accessory.stats) {
            Object.keys(accessory.stats).forEach(stat => {
                accessory.stats[stat] = Math.floor(accessory.stats[stat] * mvpConfig.statMultiplier);
            });
        }

        // Add MVP prefix to name
        accessory.name = `${mvpName}'s ${accessory.name}`;

        // Add to inventory
        if (Game.equipment.addToInventory(accessory, 1)) {
            Game.ui.showLootNotification(`🎉 MVP DROP: ${accessory.name}!`, 3000);
            return accessory;
        }
    }

    return null;
}

// Export for future use
window.handleMvpExpPotionDrop = handleMvpExpPotionDrop;
window.handleMvpAccessoryDrop = handleMvpAccessoryDrop;

// FIXED: Sprite database that matches your ACTUAL files in the folder
class ActualSpriteDatabase {
    constructor() {
        this.spriteBasePath = "sprites/items/";
        
        // This EXACTLY matches your actual sprite files
        this.itemTemplates = {
            // === SWORDS ===
            sword: {
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
            },
            
            // === HELMETS ===
            helmet: {
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
            },
            
            // === CHESTPLATES ===
            chestplate: {
                common: { 
                    name: "Cloth Shirt", 
                    sprite: "cloth_shirt.png", // ✅ You have this
                    emoji: "👕",
                    description: "Basic cloth clothing offering minimal protection"
                },
                rare: { 
                    name: "Leather Armor", 
                    sprite: "leather_armor.png", // ✅ You have this
                    emoji: "🎽",
                    description: "Flexible leather armor for mobility"
                },
                epic: { 
                    name: "Chain Mail", 
                    sprite: "chain_mail.png", // ✅ You have this
                    emoji: "⛓️",
                    description: "Interlocking metal rings for solid defense"
                },
                legendary: { 
                    name: "Plate Armor", 
                    sprite: "plate_armor.png", // ✅ You have this
                    emoji: "🛡️",
                    description: "Heavy plate armor for maximum protection"
                },
                mythic: { 
                    name: "Dragon Scale Armor", 
                    sprite: "dragon_scale.png", // ✅ You have this
                    emoji: "🐉",
                    description: "Armor crafted from ancient dragon scales"
                }
            },
            
            // === SHIELDS ===
            shield: {
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
            },
            
            // === BOOTS ===
            boots: {
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
            },
            
            // === LEGGINGS ===
            leggings: {
                common: { 
                    name: "Cloth Pants", 
                    sprite: "cloth_pants.png", // ✅ You have this
                    emoji: "👖",
                    description: "Basic cloth leg protection"
                },
                rare: { 
                    name: "Leather Pants", 
                    sprite: "leather_pants.png", // ✅ You have this
                    emoji: "👖",
                    description: "Flexible leather leg armor"
                },
                epic: { 
                    name: "Chain Leggings", 
                    sprite: "chain_pants.png", // Reuse until you get more
                    emoji: "⛓️",
                    description: "Chain mail leg protection"
                },
                legendary: { 
                    name: "Plate Leggings", 
                    sprite: "plate_pants.png", // Reuse
                    emoji: "🦵",
                    description: "Heavy plate leg armor"
                },
                mythic: { 
                    name: "Crystal Leggings", 
                    sprite: "crystal_pants.png", // Reuse
                    emoji: "💎",
                    description: "Mystical crystal leg guards"
                }
            },
            
            // === POTIONS - PERCENTAGE BASED HEALING ===
            potion: {
                common: {
                    name: "Health Potion",
                    sprite: "health_potion.png",
                    emoji: "🧪",
                    healPercent: 10,
                    description: "Restores 10% Max HP"
                },
                rare: {
                    name: "Greater Health Potion",
                    sprite: "health_potion.png",
                    emoji: "🧪",
                    healPercent: 20,
                    description: "Restores 20% Max HP"
                },
                epic: {
                    name: "Super Health Potion",
                    sprite: "health_potion.png",
                    emoji: "🧪",
                    healPercent: 30,
                    description: "Restores 30% Max HP"
                },
                legendary: {
                    name: "Ultimate Health Potion",
                    sprite: "health_potion.png",
                    emoji: "🧪",
                    healPercent: 40,
                    description: "Restores 40% Max HP"
                },
                mythic: {
                    name: "Divine Health Potion",
                    sprite: "health_potion.png",
                    emoji: "🧪",
                    healPercent: 50,
                    description: "Restores 50% Max HP"
                }
            },

            mp_potion: {
                common: {
                    name: "Mana Potion",
                    sprite: "mana_potion.png",
                    emoji: "💙",
                    mpRestorePercent: 10,
                    description: "Restores 10% Max MP"
                },
                rare: {
                    name: "Greater Mana Potion",
                    sprite: "mana_potion.png",
                    emoji: "💙",
                    mpRestorePercent: 20,
                    description: "Restores 20% Max MP"
                },
                epic: {
                    name: "Super Mana Potion",
                    sprite: "mana_potion.png",
                    emoji: "💙",
                    mpRestorePercent: 30,
                    description: "Restores 30% Max MP"
                },
                legendary: {
                    name: "Ultimate Mana Potion",
                    sprite: "mana_potion.png",
                    emoji: "💙",
                    mpRestorePercent: 40,
                    description: "Restores 40% Max MP"
                },
                mythic: {
                    name: "Divine Mana Potion",
                    sprite: "mana_potion.png",
                    emoji: "💙",
                    mpRestorePercent: 50,
                    description: "Restores 50% Max MP"
                }
            },
            exp_potion: {
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
            },

            // === ACCESSORIES ===
            ring: {
                common: {
                    name: "Simple Ring",
                    sprite: "ring_common.png", // Placeholder - ready for sprites
                    emoji: "💍",
                    description: "A basic ring with random properties"
                },
                rare: {
                    name: "Silver Ring",
                    sprite: "ring_rare.png",
                    emoji: "💍",
                    description: "A silver ring with enhanced properties"
                },
                epic: {
                    name: "Gold Ring",
                    sprite: "ring_epic.png",
                    emoji: "💍",
                    description: "A golden ring with multiple enchantments"
                },
                legendary: {
                    name: "Platinum Ring",
                    sprite: "ring_legendary.png",
                    emoji: "💍",
                    description: "A platinum ring with powerful magic"
                },
                mythic: {
                    name: "Celestial Ring",
                    sprite: "ring_mythic.png",
                    emoji: "💍",
                    description: "A ring forged from celestial materials"
                }
            },

            necklace: {
                common: {
                    name: "Simple Necklace",
                    sprite: "necklace_common.png", // Placeholder - ready for sprites
                    emoji: "📿",
                    description: "A basic necklace with random properties"
                },
                rare: {
                    name: "Silver Necklace",
                    sprite: "necklace_rare.png",
                    emoji: "📿",
                    description: "A silver necklace with enhanced properties"
                },
                epic: {
                    name: "Gold Necklace",
                    sprite: "necklace_epic.png",
                    emoji: "📿",
                    description: "A golden necklace with multiple enchantments"
                },
                legendary: {
                    name: "Platinum Necklace",
                    sprite: "necklace_legendary.png",
                    emoji: "📿",
                    description: "A platinum necklace with powerful magic"
                },
                mythic: {
                    name: "Celestial Necklace",
                    sprite: "necklace_mythic.png",
                    emoji: "📿",
                    description: "A necklace forged from celestial materials"
                }
            }
        };
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
        
        // Calculate required level and stats based on monster level and rarity
        const requiredLevel = Math.max(1, Math.floor(monsterLevel * 0.9)); // Equipment requires 90% of monster level

        // Scale stats with required level for balanced progression
        // REBALANCED: Much lower base scaling to account for upgrade system
        const levelScaling = requiredLevel * 0.8; // Reduced from 2.5 to 0.8
        const rarityMult = RARITY_MULTIPLIERS[rarity];

        // Add variance (±15%) and ensure minimum stats
        const variance = 0.85 + Math.random() * 0.3;
        const statValue = Math.max(1, Math.floor(levelScaling * rarityMult * variance));

        const item = {
            name: template.name,
            type: type,
            rarity: rarity,
            icon: template.emoji,
            sprite: template.sprite,
            spriteUrl: this.spriteBasePath + template.sprite,
            description: template.description,
            slot: ITEM_TYPES[type]?.slot,
            id: Date.now() + Math.random(),
            level: requiredLevel, // Required level to equip
            itemLevel: monsterLevel, // Monster level it dropped from
            upgradeLevel: 0, // Starting upgrade level
            baseStats: null // Will store original stats for upgrade calculations
        };

        // Add appropriate stats
        if (type === 'potion') {
            item.stats = { healPercent: template.healPercent || 10 };
        } else if (type === 'mp_potion') {
            item.stats = { mpRestorePercent: template.mpRestorePercent || 10 };
        } else if (type === 'exp_potion') {
            item.stats = { exp_boost: template.expMultiplier || 2 };
        } else if (type === 'ring' || type === 'necklace') {
            // Generate randomized accessory stats
            const accessoryStats = this.generateAccessoryStats(rarity, statValue);
            item.stats = accessoryStats.stats;
            item.baseStats = { ...accessoryStats.stats };
        } else {
            const statType = ITEM_TYPES[type].statType;
            let finalStatValue = statValue;

            // Multiply maxHp items by 10 to make them meaningful
            if (statType === 'maxHp') {
                finalStatValue = statValue * 10;
            }

            item.stats = {
                [statType]: finalStatValue
            };
            // Store base stats for upgrade calculations
            item.baseStats = {
                [statType]: finalStatValue
            };
        }

        return item;
    }
    
    getSpriteUrl(sprite) {
        return this.spriteBasePath + sprite;
    }

    generateAccessoryStats(rarity, baseValue) {
        const stats = {};
        const rarityIndex = RARITIES.indexOf(rarity);

        // Determine number of stat lines based on rarity
        let numStats = 1; // Common, rare get 1 stat
        if (rarityIndex >= 2) numStats = 2; // Epic gets 2 stats
        if (rarityIndex >= 3) numStats = 3; // Legendary gets 3 stats
        if (rarityIndex >= 4) numStats = 4; // Mythic gets 4 stats

        const statKeys = Object.keys(ACCESSORY_STATS);

        for (let i = 0; i < numStats; i++) {
            // Pick random stat (can be duplicate)
            const statType = statKeys[Math.floor(Math.random() * statKeys.length)];
            const statConfig = ACCESSORY_STATS[statType];

            // Calculate stat value based on base value and multiplier
            let statValue = Math.floor(baseValue * statConfig.multiplier);

            // Special handling for percentage stats
            if (statConfig.suffix === '%') {
                statValue = Math.max(1, Math.floor(statValue / 5)); // Scale down percentage stats
            }

            // Add to existing stat if duplicate, otherwise create new
            if (stats[statType]) {
                stats[statType] += statValue;
            } else {
                stats[statType] = statValue;
            }
        }

        return { stats };
    }
}

class EquipmentManager {
constructor() {
    this.inventory = new Array(240).fill(null); // 5 pages × 48 slots = 240 slots total
    this.favorites = new Array(48).fill(null); // Favorites inventory (full page - 48 slots)
    this.currentPage = 0;
    this.slotsPerPage = 48; // 6x8 = 48 slots per page
    this.maxPages = 6; // 5 regular pages + 1 favorites page
    this.draggedItem = null;
    this.draggedFromSlot = null;
    this.spriteDB = new ActualSpriteDatabase();
    this.maxStackSize = {
        potion: 50,
        mp_potion: 50,
        exp_potion: 50
    };

    // Equipment upgrade system
    this.upgradeItem = null;
    this.upgradeSlot = null;
    this.upgradeFromEquipped = false;

    // Inventory management settings
    this.sortType = 'type'; // 'type', 'rarity', 'price'
    this.allowSellValuable = false; // Checkbox for selling epic+ and upgraded items

    // Clean up old items with MDEF on initialization
    this.cleanupOldItems();
}

    cleanupOldItems() {
        // Remove items with MDEF stats from inventory and equipped items
        let removedCount = 0;

        // Clean inventory
        for (let i = 0; i < this.inventory.length; i++) {
            const item = this.inventory[i];
            if (item && item.stats && item.stats.mdef !== undefined) {
                this.inventory[i] = null;
                removedCount++;
            }
        }

        // Clean equipped items
        if (Game && Game.player && Game.player.state && Game.player.state.equipped) {
            Object.keys(Game.player.state.equipped).forEach(slot => {
                const item = Game.player.state.equipped[slot];
                if (item && item.stats && item.stats.mdef !== undefined) {
                    Game.player.state.equipped[slot] = null;
                    removedCount++;
                }
            });
        }

        // Clean upgrade slot
        if (this.upgradeItem && this.upgradeItem.stats && this.upgradeItem.stats.mdef !== undefined) {
            this.upgradeItem = null;
            this.upgradeSlot = null;
            this.upgradeFromEquipped = false;
            removedCount++;
        }

        if (removedCount > 0) {
            console.log(`Cleaned up ${removedCount} old items with MDEF stats`);
            // Recalculate player stats after cleanup
            if (Game && Game.player && Game.player.calculateStats) {
                Game.player.calculateStats();
            }
        }
    }

    // Helper function to find empty inventory slot respecting potion-only slots
    findEmptyInventorySlot(item) {
        const isPotionType = item && (item.type === 'potion' || item.type === 'mp_potion' || item.type === 'exp_potion');

        if (isPotionType) {
            // Potions can go anywhere, but prefer potion-locked slots first
            // Check potion-locked slots (32-47) first
            for (let i = 32; i < 48; i++) {
                if (this.inventory[i] === null) {
                    return i;
                }
            }
            // Then check other slots
            for (let i = 0; i < 32; i++) {
                if (this.inventory[i] === null) {
                    return i;
                }
            }
            for (let i = 48; i < this.inventory.length; i++) {
                if (this.inventory[i] === null) {
                    return i;
                }
            }
        } else {
            // Non-potions avoid potion-locked slots (32-47)
            // Check slots 0-31 first
            for (let i = 0; i < 32; i++) {
                if (this.inventory[i] === null) {
                    return i;
                }
            }
            // If no space in 0-31, check slots 48+
            for (let i = 48; i < this.inventory.length; i++) {
                if (this.inventory[i] === null) {
                    return i;
                }
            }
        }

        return -1; // No empty slot found
    }

    // Create inventory grid with pagination
    createInventoryGrid() {
    const grid = document.getElementById('inventory-grid');
    if (!grid) return;
    
    // Clear existing grid
    grid.innerHTML = '';
    
    // Create page navigation
    this.createPageNavigation();
    
    // Create 48 slots for current page (6x8 grid)
    for (let i = 0; i < this.slotsPerPage; i++) {
        const actualIndex = (this.currentPage * this.slotsPerPage) + i;
        const slot = document.createElement('div');
        slot.className = 'inventory-slot';
        slot.dataset.slot = actualIndex;
        slot.ondrop = (e) => this.dropItem(e, actualIndex);
        slot.ondragover = (e) => this.allowDrop(e);
        slot.ondragleave = (e) => this.dragLeave(e);
        slot.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.selectItem(actualIndex, e);
        };

        // Add right-click context menu support
        slot.oncontextmenu = (e) => {
            e.preventDefault();
            const item = this.inventory[actualIndex];
            if (item && item.slot) {
                this.showEquipmentMenu(actualIndex, item);
            }
        };
        grid.appendChild(slot);
    }
    
    // Render items for current page
    this.renderCurrentPage();
}

    createPageNavigation() {
        const nav = document.querySelector('.inventory-nav');
        if (!nav) return;

        nav.innerHTML = '';

        for (let i = 0; i < this.maxPages; i++) {
            const btn = document.createElement('button');
            btn.className = `page-btn ${i === this.currentPage ? 'active' : ''}`;
            btn.dataset.page = i;

            // Special handling for favorites page (last page)
            if (i === this.maxPages - 1) {
                btn.textContent = '⭐';
                btn.classList.add('favorites-btn');
                btn.title = 'Favorites - Full inventory page for protected items';
            } else {
                btn.textContent = i + 1;
                btn.title = `Page ${i + 1} (Ctrl+${i + 1})`;
            }

            btn.onclick = () => this.switchPage(i);
            nav.appendChild(btn);
        }

        // Update page indicators
        this.updatePageIndicators();
    }

    switchPage(pageNumber) {
        if (pageNumber < 0 || pageNumber >= this.maxPages) return;
        
        this.currentPage = pageNumber;
        
        // Update navigation
        document.querySelectorAll('.page-btn').forEach((btn, index) => {
            btn.classList.toggle('active', index === pageNumber);
        });
        
        // Re-render grid for new page
        this.createInventoryGrid();
        
        // Show page switch notification
        if (Game && Game.ui) {
            Game.ui.showLootNotification(`Switched to page ${pageNumber + 1}`);
        }
    }

    renderCurrentPage() {
        const grid = document.getElementById('inventory-grid');
        if (!grid) return;

        // Check if we're on the favorites page
        const isFavoritesPage = this.currentPage === 5;

        if (isFavoritesPage) {
            // Render favorites inventory (48 slots - full page)
            const slots = grid.querySelectorAll('.inventory-slot');

            slots.forEach((slot, slotIndex) => {
                slot.innerHTML = '';
                slot.className = 'inventory-slot favorites-slot';
                slot.dataset.index = `fav-${slotIndex}`;
                slot.style.border = '2px solid gold';
                slot.title = 'Favorites - Items here ignore sorting and selling';

                const item = this.favorites[slotIndex];

                if (item) {
                    const itemDiv = document.createElement('div');
                    itemDiv.className = `item ${item.rarity}`;

                    this.renderItemIcon(item, itemDiv);

                    // Add event listeners
                    itemDiv.addEventListener('mouseenter', (e) => this.showTooltip(e, item));
                    itemDiv.addEventListener('mouseleave', () => this.hideTooltip());
                    itemDiv.addEventListener('mousemove', (e) => this.moveTooltip(e));

                    itemDiv.ondblclick = () => {
                        if (item.slot) {
                            this.autoEquipFavoriteItem(slotIndex);
                        }
                    };

                    slot.appendChild(itemDiv);
                }

                // Add event listeners for interaction
                slot.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (item) {
                        this.selectFavoriteItem(slotIndex, e);
                    }
                };
            });
        } else {
            // Render regular inventory
            const slots = grid.querySelectorAll('.inventory-slot');

            slots.forEach((slot, slotIndex) => {
                const actualIndex = (this.currentPage * this.slotsPerPage) + slotIndex;
                slot.innerHTML = '';

                // Lock bottom 2 rows (slots 32-47) on first page for potions
                if (this.currentPage === 0 && slotIndex >= 32) {
                    slot.classList.add('potion-locked');
                    slot.style.background = 'rgba(0, 100, 255, 0.1)';
                    slot.style.border = '2px solid rgba(0, 100, 255, 0.5)';
                    slot.title = 'Potion-only slot - Only potions can be placed here';
                }

                const item = this.inventory[actualIndex];
                if (item) {
                    const itemDiv = document.createElement('div');
                    itemDiv.className = `item ${item.rarity}`;

                    // Use existing render system
                    this.renderItemIcon(item, itemDiv);

                    itemDiv.draggable = true;
                    itemDiv.ondragstart = (e) => this.dragStart(e, actualIndex);

                    // Add event listeners
                    itemDiv.addEventListener('mouseenter', (e) => this.showTooltip(e, item));
                    itemDiv.addEventListener('mouseleave', () => this.hideTooltip());
                    itemDiv.addEventListener('mousemove', (e) => this.moveTooltip(e));

                    itemDiv.ondblclick = () => {
                        if (item.slot) {
                            this.autoEquipItem(actualIndex);
                        } else if (item.type === 'potion') {
                            this.usePotionFromInventory(actualIndex);
                        } else if (item.type === 'mp_potion') {
                            this.useMpPotionFromInventory(actualIndex);
                        } else if (item.type === 'exp_potion') {
                            this.useExpPotionFromInventory(actualIndex);
                        }
                    };

                    // Remove right-click context menu - favorites moved to left-click menu

                    // Add stack count if applicable
                    if (this.maxStackSize[item.type] && (item.count > 1 || item.count === undefined)) {
                        const count = document.createElement('div');
                        count.className = 'item-count';
                        const displayCount = item.count || 1;
                        count.textContent = displayCount;

                        if (displayCount >= 10) {
                            count.classList.add('large-stack');
                        }

                        itemDiv.appendChild(count);
                    }

                    slot.appendChild(itemDiv);
                }
            });
        }
    }

    // Override renderInventory to use pagination
    renderInventory() {
        this.renderCurrentPage();
        this.updatePageIndicators();
    }

    updatePageIndicators() {
    const pageButtons = document.querySelectorAll('.page-btn');

    pageButtons.forEach((btn, pageIndex) => {
        // Special handling for favorites page
        if (pageIndex === this.maxPages - 1) {
            // Check favorites inventory for items
            const favoritesItemCount = this.favorites.filter(item => item !== null).length;
            const hasFavorites = favoritesItemCount > 0;

            btn.classList.toggle('has-items', hasFavorites);

            if (pageIndex === this.currentPage) {
                btn.title = `Favorites - Current (${favoritesItemCount}/48 items)`;
            } else if (hasFavorites) {
                btn.title = `Favorites - ${favoritesItemCount}/48 protected items`;
            } else {
                btn.title = `Favorites - Empty (48 slots available)`;
            }
        } else {
            // Regular inventory pages
            const startIndex = pageIndex * this.slotsPerPage;
            const endIndex = startIndex + this.slotsPerPage;

            // Check if this page has any items
            const hasItems = this.inventory.slice(startIndex, endIndex).some(item => item !== null);
            const itemCount = this.inventory.slice(startIndex, endIndex).filter(item => item !== null).length;

            btn.classList.toggle('has-items', hasItems);

            if (hasItems && pageIndex !== this.currentPage) {
                btn.title = `Page ${pageIndex + 1} - ${itemCount}/48 items (Ctrl+${pageIndex + 1})`;
            } else if (pageIndex === this.currentPage) {
                btn.title = `Page ${pageIndex + 1} - Current (${itemCount}/48 items)`;
            } else {
                btn.title = `Page ${pageIndex + 1} - Empty (Ctrl+${pageIndex + 1})`;
            }
        }
    });
}

    // Find best page for new items
    findBestPageForItem(item) {
        // First, try to find a page with stackable items
        if (this.maxStackSize[item.type]) {
            for (let page = 0; page < this.maxPages; page++) {
                const startIndex = page * this.slotsPerPage;
                const endIndex = startIndex + this.slotsPerPage;
                
                for (let i = startIndex; i < endIndex; i++) {
                    if (this.canStack(this.inventory[i], item)) {
                        return page;
                    }
                }
            }
        }
        
        // Then, find a page with empty slots (prefer current page)
        const currentPageStart = this.currentPage * this.slotsPerPage;
        const currentPageEnd = currentPageStart + this.slotsPerPage;
        
        if (this.inventory.slice(currentPageStart, currentPageEnd).some(slot => slot === null)) {
            return this.currentPage;
        }
        
        // Check other pages
        for (let page = 0; page < this.maxPages; page++) {
            if (page === this.currentPage) continue;
            
            const startIndex = page * this.slotsPerPage;
            const endIndex = startIndex + this.slotsPerPage;
            
            if (this.inventory.slice(startIndex, endIndex).some(slot => slot === null)) {
                return page;
            }
        }
        
        return -1; // No space available
    }

    findPageWithItem(searchItem) {
        for (let page = 0; page < this.maxPages; page++) {
            const startIndex = page * this.slotsPerPage;
            const endIndex = startIndex + this.slotsPerPage;
            
            for (let i = startIndex; i < endIndex; i++) {
                const item = this.inventory[i];
                if (item && item.name === searchItem.name && item.type === searchItem.type) {
                    return page;
                }
            }
        }
        return -1;
    }

    // Keyboard shortcuts for page navigation
    handlePageNavigation(e) {
        if (e.ctrlKey && e.key >= '1' && e.key <= '5') {
            e.preventDefault();
            const pageIndex = parseInt(e.key) - 1;
            this.switchPage(pageIndex);
            return true;
        }
        return false;
    }

    // Enhanced item rendering with sprite support and error handling
    renderItemIcon(item, container) {
        container.innerHTML = '';
        
        if (item.spriteUrl) {
            const img = document.createElement('img');
            img.src = item.spriteUrl;
            img.style.cssText = `
                width: 100%;
                height: 100%;
                image-rendering: pixelated;
                image-rendering: -moz-crisp-edges;
                image-rendering: -webkit-crisp-edges;
                object-fit: contain;
            `;
            
            // Enhanced error handling with debugging
            img.onerror = (e) => {
                console.warn(`Failed to load sprite: ${item.spriteUrl} for item: ${item.name}`);
                container.innerHTML = '';
                container.textContent = item.icon;
                container.style.fontSize = 'clamp(1.2rem, 3vw, 1.8rem)';
            };
            
            img.onload = () => {
                console.log(`Successfully loaded sprite: ${item.spriteUrl}`);
            };
            
            container.appendChild(img);
        } else {
            // Use emoji fallback
            container.textContent = item.icon;
            container.style.fontSize = 'clamp(1.2rem, 3vw, 1.8rem)';
        }
    }

    generateItem(type, rarity, monsterLevel) {
        return this.spriteDB.generateItem(type, rarity, monsterLevel);
    }

    getRandomRarity() {
        const roll = Math.random();
        let cumulative = 0;
        
        for (const [rarity, rate] of Object.entries(RARITY_DROP_RATES)) {
            cumulative += rate;
            if (roll < cumulative) {
                return rarity;
            }
        }
        return 'common';
    }

    checkItemDrop(monster) {
        let dropChance = 0.3 + (monster.level / 100);

        // Apply loot chance bonus from accessories (but not for mythic items)
        let lootBonus = 0;
        if (Game.player && Game.player.state && Game.player.state.equipped) {
            Object.values(Game.player.state.equipped).forEach(item => {
                if (item && item.stats && item.stats.lootChance) {
                    lootBonus += item.stats.lootChance;
                }
            });
        }

        if (lootBonus > 0) {
            dropChance += (dropChance * (lootBonus / 100));
        }

        if (Math.random() < dropChance) {
            let rarity = this.getRandomRarity();

            // Mythic items are exempt from loot chance bonus - reroll if mythic and bonus was applied
            if (rarity === 'mythic' && lootBonus > 0) {
                // Reroll without loot bonus for mythic items
                const originalDropChance = 0.3 + (monster.level / 100);
                if (Math.random() >= originalDropChance) {
                    return; // Don't drop mythic item if it was only due to loot bonus
                }
            }

            const itemTypeKeys = Object.keys(ITEM_TYPES).filter(t => t !== 'potion' && t !== 'mp_potion' && t !== 'exp_potion');
            const randomType = itemTypeKeys[Math.floor(Math.random() * itemTypeKeys.length)];

            const item = this.generateItem(randomType, rarity, monster.level);
            if (item) {
                this.addToInventory(item);
            }
        }
        
        // Chance for potion drop
        if (Math.random() < 0.2) {
            const potionRarity = Math.random() < 0.7 ? 'common' : Math.random() < 0.9 ? 'rare' : 'epic';
            const potion = this.generateItem('potion', potionRarity, monster.level);
            if (potion) {
                const dropCount = Math.random() < 0.3 ? Math.floor(Math.random() * 3) + 2 : 1;
                this.addToInventory(potion, dropCount);
            }
        }
        
        // Chance for MP potion drop
        if (Math.random() < 0.15) {
            const mpPotionRarity = Math.random() < 0.7 ? 'common' : Math.random() < 0.9 ? 'rare' : 'epic';
            const mpPotion = this.generateItem('mp_potion', mpPotionRarity, monster.level);
            if (mpPotion) {
                const dropCount = Math.random() < 0.3 ? Math.floor(Math.random() * 3) + 2 : 1;
                this.addToInventory(mpPotion, dropCount);
            }
        }
    }

    canStack(item1, item2) {
        if (!item1 || !item2) return false;
        if (item1.type !== item2.type) return false;
        if (item1.name !== item2.name) return false;
        if (item1.rarity !== item2.rarity) return false;
        
        const maxStack = this.maxStackSize[item1.type];
        if (!maxStack) return false;
        
        return (item1.count || 1) < maxStack;
    }

    findBestStackSlot(item) {
        if (!this.maxStackSize[item.type]) return -1;
        
        for (let i = 0; i < this.inventory.length; i++) {
            const existingItem = this.inventory[i];
            if (this.canStack(existingItem, item)) {
                return i;
            }
        }
        return -1;
    }

    addToInventory(item, quantity = 1) {
        let remainingQuantity = quantity;
        
        // Handle stacking
        if (this.maxStackSize[item.type]) {
            while (remainingQuantity > 0) {
                const stackSlot = this.findBestStackSlot(item);
                
                if (stackSlot !== -1) {
                    const existingItem = this.inventory[stackSlot];
                    const currentCount = existingItem.count || 1;
                    const maxStack = this.maxStackSize[item.type];
                    const spaceLeft = maxStack - currentCount;
                    const amountToAdd = Math.min(spaceLeft, remainingQuantity);
                    
                    existingItem.count = currentCount + amountToAdd;
                    remainingQuantity -= amountToAdd;
                } else {
                    break;
                }
            }
        }
        
        // Add to empty slots
        while (remainingQuantity > 0) {
            let emptySlot = -1;

            // For potions, prefer potion-locked slots (32-47)
            const isPotionType = item.type === 'potion' || item.type === 'mp_potion' || item.type === 'exp_potion';
            if (isPotionType) {
                // First try to find empty potion-locked slots
                for (let i = 32; i < 48; i++) {
                    if (this.inventory[i] === null) {
                        emptySlot = i;
                        break;
                    }
                }
            }

            // If no potion slot found or not a potion, find any empty slot (excluding potion-locked slots for non-potions)
            if (emptySlot === -1) {
                if (isPotionType) {
                    // For potions, can use any empty slot
                    emptySlot = this.inventory.findIndex(slot => slot === null);
                } else {
                    // For non-potions, avoid potion-locked slots (32-47)
                    // Check slots 0-31 first
                    for (let i = 0; i < 32; i++) {
                        if (this.inventory[i] === null) {
                            emptySlot = i;
                            break;
                        }
                    }
                    // If no space in 0-31, check slots 48+
                    if (emptySlot === -1) {
                        for (let i = 48; i < this.inventory.length; i++) {
                            if (this.inventory[i] === null) {
                                emptySlot = i;
                                break;
                            }
                        }
                    }
                }
            }

            if (emptySlot === -1) {
                // Auto-sell items when inventory is full
                const sellPrice = this.calculateSellPrice(item);
                const totalValue = sellPrice * remainingQuantity;
                Game.player.state.gold += totalValue;

                if (Game && Game.ui) {
                    Game.ui.showLootNotification(`Inventory full! Auto-sold ${item.name} x${remainingQuantity} for ${totalValue} gold!`);
                    Game.ui.updatePlayerDisplay();
                }
                return true; // Successfully handled by auto-selling
            }

            const newItem = { ...item };
            const maxStack = this.maxStackSize[item.type] || 1;
            const amountForThisStack = Math.min(remainingQuantity, maxStack);

            if (maxStack > 1) {
                newItem.count = amountForThisStack;
            }

            this.inventory[emptySlot] = newItem;
            remainingQuantity -= amountForThisStack;

            // Track achievement progress for item collection
            if (Game.achievements) {
                Game.achievements.onItemCollected(newItem);
            }
        }

        this.renderInventory();
        if (Game && Game.ui) {
            Game.ui.showLootNotification(`Found: ${item.name} ${quantity > 1 ? `(x${quantity})` : ''}`);
        }
        
        // Update page indicators and switch to item page if needed
        const itemPage = this.findPageWithItem(item);
        if (itemPage !== -1 && itemPage !== this.currentPage) {
            setTimeout(() => {
                if (Game && Game.ui) {
                    Game.ui.showLootNotification(`Item added to page ${itemPage + 1}!`);
                }
            }, 500);
        }
        
        this.updatePageIndicators();
        return true;
    }

    equipItem(item, slot) {
        if (item.slot !== slot) return false;
        if (Game.player.level < item.level) {
            if (Game && Game.ui) {
                Game.ui.showLootNotification(`Requires level ${item.level} to equip!`);
            }
            return false;
        }
        
        const oldItem = Game.player.state.equipped[slot];
        Game.player.state.equipped[slot] = item;
        Game.player.calculateStats();

        // Track achievement progress for item equipped
        if (Game.achievements) {
            Game.achievements.onItemEquipped();
        }

        return oldItem;
    }

    unequipItem(slot) {
        const item = Game.player.state.equipped[slot];
        if (!item) return null;

        // Find empty inventory slot respecting potion-only slots
        const emptySlot = this.findEmptyInventorySlot(item);
        if (emptySlot === -1) {
            if (Game && Game.ui) {
                Game.ui.showLootNotification("Inventory is full!");
            }
            return null;
        }

        // Move item to inventory and clear equipment slot
        this.inventory[emptySlot] = item;
        Game.player.state.equipped[slot] = null;

        // Recalculate player stats (this will reset to base + remaining equipment)
        Game.player.calculateStats();

        // Update UI
        this.renderInventory();
        this.renderEquipment();
        if (Game && Game.ui) {
            Game.ui.updatePlayerDisplay();
            Game.ui.showLootNotification(`${item.name} unequipped!`);
        }

        return item;
    }

    usePotion() {
        const potionIndex = this.inventory.findIndex(item => item && item.type === 'potion');
        if (potionIndex !== -1) {
            this.usePotionFromInventory(potionIndex);
        } else {
            if (Game && Game.ui) {
                Game.ui.showLootNotification("No HP potions in inventory!");
            }
        }
    }

    useMpPotion() {
        const mpPotionIndex = this.inventory.findIndex(item => item && item.type === 'mp_potion');
        if (mpPotionIndex !== -1) {
            this.useMpPotionFromInventory(mpPotionIndex);
        } else {
            if (Game && Game.ui) {
                Game.ui.showLootNotification("No MP potions in inventory!");
            }
        }
    }

    useExpPotion() {
        const expPotionIndex = this.inventory.findIndex(item => item && item.type === 'exp_potion');
        if (expPotionIndex !== -1) {
            this.useExpPotionFromInventory(expPotionIndex);
        } else {
            if (Game && Game.ui) {
                Game.ui.showLootNotification("No EXP potions in inventory!");
            }
        }
    }

    usePotionFromInventory(index) {
        const potion = this.inventory[index];
        if (!potion || potion.type !== 'potion') return;
        
        const healPercent = potion.stats.healPercent || 10;
        const healing = Math.floor(Game.player.maxHp * (healPercent / 100));
        const actualHealing = Game.player.heal(healing);

        if (Game && Game.ui) {
            Game.ui.showLootNotification(`Healed for ${actualHealing} HP (${healPercent}%)!`);
        }
        
        if (potion.count && potion.count > 1) {
            potion.count--;
        } else {
            this.inventory[index] = null;
        }
        
        this.renderInventory();
        if (Game && Game.ui) {
            Game.ui.updatePlayerDisplay();
        }
    }

    useMpPotionFromInventory(index) {
        const mpPotion = this.inventory[index];
        if (!mpPotion || mpPotion.type !== 'mp_potion') return;

        const mpRestorePercent = mpPotion.stats.mpRestorePercent || 10;
        const mpRestore = Math.floor(Game.player.maxMp * (mpRestorePercent / 100));
        const actualRestore = Game.player.restoreMp(mpRestore);

        if (Game && Game.ui) {
            Game.ui.showLootNotification(`Restored ${actualRestore} MP (${mpRestorePercent}%)!`);
        }

        if (mpPotion.count && mpPotion.count > 1) {
            mpPotion.count--;
        } else {
            this.inventory[index] = null;
        }

        this.renderInventory();
        if (Game && Game.ui) {
            Game.ui.updatePlayerDisplay();
            Game.ui.updateHotbar(); // Update skill highlighting when MP changes
        }
    }

    useExpPotionFromInventory(index) {
        const expPotion = this.inventory[index];
        if (!expPotion || expPotion.type !== 'exp_potion') return;

        const multiplier = expPotion.stats.exp_boost || 2;

        // Check if there's already an active EXP boost (non-stacking)
        if (Game.skills && Game.skills.statusEffects.has('expBoost')) {
            if (Game && Game.ui) {
                Game.ui.showLootNotification("EXP boost already active! Potions don't stack.");
            }
            return;
        }

        // Apply the EXP boost effect for 30 minutes (1800000ms)
        if (Game.skills) {
            Game.skills.addStatusEffect('expBoost', `${multiplier}x EXP Boost`, '⭐', 1800000, {
                expMultiplier: multiplier
            });
        }

        if (Game && Game.ui) {
            Game.ui.showLootNotification(`${multiplier}x EXP boost activated for 30 minutes!`);
        }

        if (expPotion.count && expPotion.count > 1) {
            expPotion.count--;
        } else {
            this.inventory[index] = null;
        }

        this.renderInventory();
        if (Game && Game.ui) {
            Game.ui.updatePlayerDisplay();
        }
    }

    useAllPotionsOfType(index, type = 'potion') {
        const item = this.inventory[index];
        if (!item || item.type !== type) return;
        
        let totalHealing = 0;
        let potionsUsed = 0;
        
        for (let i = 0; i < this.inventory.length; i++) {
            const currentItem = this.inventory[i];
            if (currentItem && currentItem.type === type && 
                currentItem.name === item.name) {
                
                const count = currentItem.count || 1;
                
                for (let j = 0; j < count; j++) {
                    if (type === 'potion' && Game.player.hp >= Game.player.maxHp) break;
                    if (type === 'mp_potion' && Game.player.mp >= Game.player.maxMp) break;
                    
                    if (type === 'potion') {
                        const healPercent = currentItem.stats.healPercent || 10;
                        const healing = Math.floor(Game.player.maxHp * (healPercent / 100));
                        const actualHealing = Game.player.heal(healing);
                        totalHealing += actualHealing;
                    } else if (type === 'mp_potion') {
                        const mpRestorePercent = currentItem.stats.mpRestorePercent || 10;
                        const mpRestore = Math.floor(Game.player.maxMp * (mpRestorePercent / 100));
                        const actualRestore = Game.player.restoreMp(mpRestore);
                        totalHealing += actualRestore;
                    }
                    
                    potionsUsed++;
                    
                    if (currentItem.count > 1) {
                        currentItem.count--;
                    } else {
                        this.inventory[i] = null;
                        break;
                    }
                }
            }
        }
        
        if (potionsUsed > 0) {
            const message = type === 'potion' 
                ? `Used ${potionsUsed} potions for ${totalHealing} HP!`
                : `Used ${potionsUsed} MP potions for ${totalHealing} MP!`;
            if (Game && Game.ui) {
                Game.ui.showLootNotification(message);
            }
            this.renderInventory();
            if (Game && Game.ui) {
                Game.ui.updatePlayerDisplay();
                if (type === 'mp_potion') {
                    Game.ui.updateHotbar(); // Update skill highlighting when MP changes
                }
            }
        }
    }

    sellAllItems() {
        let totalGold = 0;
        let soldCount = 0;
        let protectedCount = 0;

        this.inventory = this.inventory.map((item, index) => {
            if (item && item.type !== 'potion' && item.type !== 'mp_potion' && item.type !== 'exp_potion') {
                // Don't sell from potion-locked slots (32-47 on page 1)
                if (index >= 32 && index < 48) {
                    return item; // Keep items in potion-locked slots
                }

                // Don't sell upgraded or epic+ items unless checkbox is checked
                const isUpgraded = item.upgradeLevel && item.upgradeLevel > 0;
                const isValuable = ['epic', 'legendary', 'mythic'].includes(item.rarity);

                if ((isUpgraded || isValuable) && !this.allowSellValuable) {
                    protectedCount++;
                    return item; // Keep the item
                }

                // Calculate sell price based on all stats
                let statValue = item.stats.atk || item.stats.def || item.stats.maxHp ||
                               item.stats.maxMp || item.stats.expGain || item.stats.lootChance ||
                               item.stats.atkPercent || item.stats.critChance || item.stats.critDamage ||
                               item.stats.skillDamage || 1;
                let sellPrice = Math.floor(10 * RARITY_MULTIPLIERS[item.rarity] * statValue);

                // Apply upgrade multiplier if any
                if (item.upgradeLevel && item.upgradeLevel > 0) {
                    const upgradeMultiplier = 1 + (item.upgradeLevel * 0.5);
                    sellPrice = Math.floor(sellPrice * upgradeMultiplier);
                }

                totalGold += sellPrice;
                soldCount++;
                return null;
            }
            return item;
        });

        if (totalGold > 0) {
            Game.player.gainGold(totalGold);
            if (Game && Game.ui) {
                let message = `Sold ${soldCount} items for ${totalGold.toLocaleString()} gold!`;
                if (protectedCount > 0) {
                    message += ` (${protectedCount} valuable items protected)`;
                }
                Game.ui.showLootNotification(message);
            }
            this.renderInventory();
            if (Game && Game.ui) {
                Game.ui.updatePlayerDisplay();
            }
        } else {
            if (Game && Game.ui) {
                if (protectedCount > 0) {
                    Game.ui.showLootNotification(`No items to sell! (${protectedCount} valuable items protected)`);
                } else {
                    Game.ui.showLootNotification("No items to sell!");
                }
            }
        }
    }

    buyItem(shopItem) {
        if (Game.player.gold >= shopItem.price) {
            if (Game.player.level < shopItem.level) {
                if (Game && Game.ui) {
                    Game.ui.showLootNotification(`Requires level ${shopItem.level}!`);
                }
                return false;
            }

            // FIXED: Use the sprite database to create proper shop items
            const item = this.generateItem(shopItem.type, shopItem.rarity, 1);
            if (item) {
                // Override with shop-specific stats
                if (shopItem.healing) {
                    item.stats = { heal: shopItem.healing };
                }
                if (shopItem.mpRestore) {
                    item.stats = { restore_mp: shopItem.mpRestore };
                }
                if (shopItem.expMultiplier) {
                    item.stats = { exp_boost: shopItem.expMultiplier };
                    item.name = shopItem.name; // Use the specific shop name for exp potions
                }
                
                if (this.addToInventory(item, 1)) {
                    Game.player.state.gold -= shopItem.price;
                    this.renderInventory();
                    if (Game && Game.ui) {
                        Game.ui.updatePlayerDisplay();
                        Game.ui.showLootNotification(`Bought ${shopItem.name}!`);
                    }
                    return true;
                } else {
                    return false;
                }
            }
        } else {
            if (Game && Game.ui) {
                Game.ui.showLootNotification("Not enough gold!");
            }
            return false;
        }
    }

    // Drag and drop functionality
    dragStart(e, index) {
        this.draggedItem = this.inventory[index];
        this.draggedFromSlot = { type: 'inventory', index: index };
        e.dataTransfer.effectAllowed = 'move';
        e.target.style.opacity = '0.5';
    }

    dragStartEquipped(e, slot) {
        this.draggedItem = Game.player.state.equipped[slot];
        this.draggedFromSlot = { type: 'equipped', slot: slot };
        e.dataTransfer.effectAllowed = 'move';
        e.target.style.opacity = '0.5';
    }

    allowDrop(e) {
        e.preventDefault();
        e.currentTarget.classList.add('drag-over');
    }

    dragLeave(e) {
        e.currentTarget.classList.remove('drag-over');
    }

    dropItem(e, index) {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');

        if (!this.draggedItem) return;

        // Check if trying to drop into potion-locked slots (32-47 on page 1)
        const isPotionLockedSlot = index >= 32 && index < 48;
        const isPotionType = this.draggedItem.type === 'potion' ||
                           this.draggedItem.type === 'mp_potion' ||
                           this.draggedItem.type === 'exp_potion';

        if (isPotionLockedSlot && !isPotionType) {
            if (Game && Game.ui) {
                Game.ui.showLootNotification("❌ Only potions can be placed in potion-locked slots!");
            }
            this.draggedItem = null;
            this.draggedFromSlot = null;
            return;
        }

        if (this.draggedFromSlot.type === 'inventory' && this.draggedFromSlot.index !== index) {
            const targetItem = this.inventory[index];
            if (targetItem && this.canStack(targetItem, this.draggedItem)) {
                const draggedCount = this.draggedItem.count || 1;
                const targetCount = targetItem.count || 1;
                const maxStack = this.maxStackSize[this.draggedItem.type];
                const spaceLeft = maxStack - targetCount;
                const amountToStack = Math.min(spaceLeft, draggedCount);

                targetItem.count = targetCount + amountToStack;

                if (draggedCount > amountToStack) {
                    this.draggedItem.count = draggedCount - amountToStack;
                } else {
                    this.inventory[this.draggedFromSlot.index] = null;
                }
            } else {
                const temp = this.inventory[index];
                this.inventory[index] = this.draggedItem;
                this.inventory[this.draggedFromSlot.index] = temp;
            }
        }

        if (this.draggedFromSlot.type === 'equipped') {
            const unequipped = this.unequipItem(this.draggedFromSlot.slot);
            if (unequipped && this.inventory[index] === null) {
                this.inventory[index] = unequipped;
            }
        }

        this.draggedItem = null;
        this.draggedFromSlot = null;
        this.renderInventory();
        this.renderEquipment();
        if (Game && Game.ui) {
            Game.ui.updatePlayerDisplay();
        }
    }

    dropEquipment(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');
        
        if (!this.draggedItem) return;
        
        const targetSlot = e.currentTarget.dataset.slot;
        
        // Special handling for rings - they can go in either ring slot
        const canEquip = (this.draggedItem.slot === targetSlot) ||
                        (this.draggedItem.type === 'ring' && (targetSlot === 'ring1' || targetSlot === 'ring2'));

        if (canEquip) {
            if (this.draggedFromSlot.type === 'inventory') {
                const oldItem = this.equipItem(this.draggedItem, targetSlot);
                if (oldItem !== false) {
                    this.inventory[this.draggedFromSlot.index] = oldItem;
                    if (Game && Game.ui) {
                        Game.ui.showLootNotification(`Equipped ${this.draggedItem.name}!`);
                    }
                }
            } else if (this.draggedFromSlot.type === 'equipped' && this.draggedFromSlot.slot !== targetSlot) {
                const temp = Game.player.state.equipped[targetSlot];
                Game.player.state.equipped[targetSlot] = this.draggedItem;
                Game.player.state.equipped[this.draggedFromSlot.slot] = temp;
                Game.player.calculateStats();
                if (Game && Game.ui) {
                    Game.ui.showLootNotification(`Swapped equipment!`);
                }
            }
        } else {
            if (Game && Game.ui) {
                Game.ui.showLootNotification(`Cannot equip ${this.draggedItem.name} in ${targetSlot} slot!`);
            }
        }
        
        this.draggedItem = null;
        this.draggedFromSlot = null;
        this.renderInventory();
        this.renderEquipment();
        if (Game && Game.ui) {
            Game.ui.updatePlayerDisplay();
        }
    }

    selectItem(index, event = null) {
        const item = this.inventory[index];
        if (!item) return;

        // Prevent rapid clicking issues by adding a small delay check
        const now = Date.now();
        if (this.lastClickTime && (now - this.lastClickTime) < 100) {
            return; // Ignore clicks that are too rapid
        }
        this.lastClickTime = now;

        // For equipment items, show enhanced context menu
        if (item.slot) {
            // Close any existing menu first
            this.hideEquipmentMenu();
            // Small delay to ensure clean menu display
            setTimeout(() => {
                this.showEquipmentMenu(index, item);
            }, 10);
            return;
        }

        // For consumables, show context menu with use options
        this.hideEquipmentMenu();
        setTimeout(() => {
            this.showConsumableMenu(index, item, event);
        }, 10);
    }

    showEquipmentMenu(index, item) {
        // Remove any existing menu
        this.hideEquipmentMenu();

        const menu = document.createElement('div');
        menu.id = 'equipment-context-menu';
        menu.style.cssText = `
            position: fixed;
            background: rgba(0, 0, 0, 0.95);
            border: 2px solid var(--gold);
            border-radius: 12px;
            padding: 8px;
            z-index: 10001;
            backdrop-filter: blur(15px);
            min-width: 150px;
        `;

        const buttons = [];

        // Equip button - special handling for rings
        if (item.type === 'ring') {
            // Check which ring slots are available
            const ring1Empty = !Game.player.state.equipped.ring1;
            const ring2Empty = !Game.player.state.equipped.ring2;

            if (ring1Empty && ring2Empty) {
                buttons.push({
                    text: '💍 Equip Ring 1',
                    action: () => {
                        this.equipItemToSlot(index, 'ring1');
                        this.hideEquipmentMenu();
                    }
                });
                buttons.push({
                    text: '💍 Equip Ring 2',
                    action: () => {
                        this.equipItemToSlot(index, 'ring2');
                        this.hideEquipmentMenu();
                    }
                });
            } else if (ring1Empty) {
                buttons.push({
                    text: '💍 Equip Ring 1',
                    action: () => {
                        this.equipItemToSlot(index, 'ring1');
                        this.hideEquipmentMenu();
                    }
                });
            } else if (ring2Empty) {
                buttons.push({
                    text: '💍 Equip Ring 2',
                    action: () => {
                        this.equipItemToSlot(index, 'ring2');
                        this.hideEquipmentMenu();
                    }
                });
            } else {
                buttons.push({
                    text: '💍 Replace Ring 1',
                    action: () => {
                        this.equipItemToSlot(index, 'ring1');
                        this.hideEquipmentMenu();
                    }
                });
                buttons.push({
                    text: '💍 Replace Ring 2',
                    action: () => {
                        this.equipItemToSlot(index, 'ring2');
                        this.hideEquipmentMenu();
                    }
                });
            }
        } else {
            buttons.push({
                text: '⚔️ Equip',
                action: () => {
                    this.autoEquipItem(index);
                    this.hideEquipmentMenu();
                }
            });
        }

        // Upgrade button (only for upgradeable items)
        if (this.canUpgradeItem(item)) {
            buttons.push({
                text: '⚡ Upgrade',
                action: () => {
                    this.moveToUpgradeSlot(index);
                    this.hideEquipmentMenu();
                }
            });
        }

        // Compare button (if item can be equipped and there's an equipped item)
        const equippedItem = Game.player.state.equipped[item.slot];
        if (equippedItem) {
            buttons.push({
                text: '📊 Compare',
                action: () => {
                    this.showCompareTooltips(item, equippedItem);
                    this.hideEquipmentMenu();
                }
            });
        }

        // Move to Favorites button
        buttons.push({
            text: '⭐ Move to Favorites',
            action: () => {
                this.moveToFavorites(index);
                this.hideEquipmentMenu();
            }
        });

        // Sell button
        buttons.push({
            text: '💰 Sell',
            action: () => {
                this.sellItemWithConfirmation(index, item);
                this.hideEquipmentMenu();
            }
        });

        // Create buttons
        buttons.forEach((btn, i) => {
            const button = document.createElement('button');
            button.textContent = btn.text;
            button.style.cssText = `
                width: 100%;
                background: var(--glass-bg);
                color: var(--text-primary);
                border: 1px solid var(--border-color);
                border-radius: 6px;
                padding: 8px 12px;
                margin: 2px 0;
                cursor: pointer;
                transition: all 0.2s ease;
                font-size: 0.9rem;
            `;
            button.onmouseover = () => {
                button.style.background = 'var(--blue)';
                button.style.borderColor = 'var(--blue)';
            };
            button.onmouseout = () => {
                button.style.background = 'var(--glass-bg)';
                button.style.borderColor = 'var(--border-color)';
            };
            button.onclick = btn.action;
            menu.appendChild(button);
        });

        document.body.appendChild(menu);

        // Position menu near the clicked item
        const slot = document.querySelector(`[data-slot="${index}"]`);
        if (slot) {
            const rect = slot.getBoundingClientRect();
            menu.style.left = (rect.right + 10) + 'px';
            menu.style.top = rect.top + 'px';

            // Adjust if menu goes off screen
            const menuRect = menu.getBoundingClientRect();
            if (menuRect.right > window.innerWidth) {
                menu.style.left = (rect.left - menuRect.width - 10) + 'px';
            }
            if (menuRect.bottom > window.innerHeight) {
                menu.style.top = (rect.bottom - menuRect.height) + 'px';
            }
        }

        // Close menu when clicking outside
        setTimeout(() => {
            document.addEventListener('click', this.hideEquipmentMenu.bind(this), { once: true });
        }, 100);
    }

    hideEquipmentMenu() {
        const menu = document.getElementById('equipment-context-menu');
        if (menu) {
            menu.remove();
        }
    }

    showConsumableMenu(index, item, event) {
        // Remove any existing menu
        this.hideEquipmentMenu();

        const menu = document.createElement('div');
        menu.id = 'equipment-context-menu';
        menu.style.cssText = `
            position: fixed;
            background: rgba(0, 0, 0, 0.95);
            border: 2px solid var(--gold);
            border-radius: 12px;
            padding: 8px;
            z-index: 10001;
            backdrop-filter: blur(15px);
            min-width: 150px;
        `;

        const buttons = [];

        // Use button for potions
        if (item.type === 'potion' || item.type === 'mp_potion') {
            buttons.push({
                text: `🧪 Use ${item.name}`,
                action: () => {
                    if (item.type === 'potion') {
                        this.usePotionFromInventory(index);
                    } else {
                        this.useMpPotionFromInventory(index);
                    }
                    this.hideEquipmentMenu();
                }
            });

            buttons.push({
                text: `🧪 Use All ${item.name}`,
                action: () => {
                    this.useAllPotionsOfType(index, item.type);
                    this.hideEquipmentMenu();
                }
            });
        } else if (item.type === 'exp_potion') {
            buttons.push({
                text: `⭐ Use ${item.name}`,
                action: () => {
                    this.useExpPotionFromInventory(index);
                    this.hideEquipmentMenu();
                }
            });
        }

        // Move to Favorites button
        buttons.push({
            text: '⭐ Move to Favorites',
            action: () => {
                this.moveToFavorites(index);
                this.hideEquipmentMenu();
            }
        });

        // Sell button
        buttons.push({
            text: '💰 Sell',
            action: () => {
                this.sellSingleItem(index);
                this.hideEquipmentMenu();
            }
        });

        // Create buttons
        buttons.forEach((btn) => {
            const button = document.createElement('button');
            button.textContent = btn.text;
            button.style.cssText = `
                width: 100%;
                background: var(--glass-bg);
                color: var(--text-primary);
                border: 1px solid var(--border-color);
                border-radius: 6px;
                padding: 8px 12px;
                margin: 2px 0;
                cursor: pointer;
                transition: all 0.2s ease;
                font-size: 0.9rem;
            `;
            button.onmouseover = () => {
                button.style.background = 'var(--blue)';
                button.style.borderColor = 'var(--blue)';
            };
            button.onmouseout = () => {
                button.style.background = 'var(--glass-bg)';
                button.style.borderColor = 'var(--border-color)';
            };
            button.onclick = btn.action;
            menu.appendChild(button);
        });

        document.body.appendChild(menu);

        // Position menu near the clicked item or use event position
        let rect;
        if (event && event.target) {
            rect = event.target.getBoundingClientRect();
        } else {
            const slot = document.querySelector(`[data-slot="${index}"]`);
            if (slot) {
                rect = slot.getBoundingClientRect();
            } else {
                // Fallback positioning
                rect = { right: 200, left: 150, top: 200, bottom: 250 };
            }
        }

        menu.style.left = (rect.right + 10) + 'px';
        menu.style.top = rect.top + 'px';

        // Adjust if menu goes off screen
        const menuRect = menu.getBoundingClientRect();
        if (menuRect.right > window.innerWidth) {
            menu.style.left = (rect.left - menuRect.width - 10) + 'px';
        }
        if (menuRect.bottom > window.innerHeight) {
            menu.style.top = (rect.bottom - menuRect.height) + 'px';
        }

        // Close menu when clicking outside
        setTimeout(() => {
            document.addEventListener('click', this.hideEquipmentMenu.bind(this), { once: true });
        }, 100);
    }

    showEquippedItemMenu(event, slot, item) {
        event.preventDefault();
        event.stopPropagation();

        // Remove any existing menu
        this.hideEquipmentMenu();

        const menu = document.createElement('div');
        menu.id = 'equipment-context-menu';
        menu.style.cssText = `
            position: fixed;
            background: rgba(0, 0, 0, 0.95);
            border: 2px solid var(--gold);
            border-radius: 12px;
            padding: 8px;
            z-index: 10001;
            backdrop-filter: blur(15px);
            min-width: 150px;
        `;

        const buttons = [];

        // Unequip button
        buttons.push({
            text: '🔓 Unequip',
            action: () => {
                this.unequipItem(slot);
                this.hideEquipmentMenu();
            }
        });

        // Upgrade button (only for upgradeable items)
        if (this.canUpgradeItem(item)) {
            buttons.push({
                text: '⚡ Upgrade',
                action: () => {
                    this.moveEquippedToUpgradeSlot(slot, item);
                    this.hideEquipmentMenu();
                }
            });
        }

        // Create buttons
        buttons.forEach((btn) => {
            const button = document.createElement('button');
            button.textContent = btn.text;
            button.style.cssText = `
                width: 100%;
                background: var(--glass-bg);
                color: var(--text-primary);
                border: 1px solid var(--border-color);
                border-radius: 6px;
                padding: 8px 12px;
                margin: 2px 0;
                cursor: pointer;
                transition: all 0.2s ease;
                font-size: 0.9rem;
            `;
            button.onmouseover = () => {
                button.style.background = 'var(--blue)';
                button.style.borderColor = 'var(--blue)';
            };
            button.onmouseout = () => {
                button.style.background = 'var(--glass-bg)';
                button.style.borderColor = 'var(--border-color)';
            };
            button.onclick = btn.action;
            menu.appendChild(button);
        });

        document.body.appendChild(menu);

        // Position menu near the clicked item
        const rect = event.target.getBoundingClientRect();
        menu.style.left = (rect.right + 10) + 'px';
        menu.style.top = rect.top + 'px';

        // Adjust if menu goes off screen
        const menuRect = menu.getBoundingClientRect();
        if (menuRect.right > window.innerWidth) {
            menu.style.left = (rect.left - menuRect.width - 10) + 'px';
        }
        if (menuRect.bottom > window.innerHeight) {
            menu.style.top = (rect.bottom - menuRect.height) + 'px';
        }

        // Close menu when clicking outside
        setTimeout(() => {
            document.addEventListener('click', this.hideEquipmentMenu.bind(this), { once: true });
        }, 100);
    }

    moveToUpgradeSlot(index) {
        const item = this.inventory[index];
        if (!item || !this.canUpgradeItem(item)) return;

        // Remove item from inventory
        this.inventory[index] = null;

        // Set as upgrade item
        this.upgradeItem = item;
        this.upgradeSlot = index;
        this.upgradeFromEquipped = false;

        // Update UI
        this.renderUpgradeSlot();
        this.renderInventory();

        Game.ui.showLootNotification(`${item.name} moved to upgrade slot!`);
    }

    moveEquippedToUpgradeSlot(slot, item) {
        if (!item || !this.canUpgradeItem(item)) return;

        // Remove item from equipped slot
        Game.player.state.equipped[slot] = null;

        // Set as upgrade item
        this.upgradeItem = item;
        this.upgradeSlot = slot;
        this.upgradeFromEquipped = true;

        // Recalculate player stats since item was unequipped
        Game.player.calculateStats();

        // Update UI
        this.renderUpgradeSlot();
        this.renderEquipment();
        Game.ui.updatePlayerDisplay();

        Game.ui.showLootNotification(`${item.name} moved to upgrade slot!`);
    }

    // Duplicate unequipItem function removed - using the one at line 1206

    showUpgradeSlotMenu(event) {
        event.preventDefault();
        event.stopPropagation();

        if (!this.upgradeItem) return;

        // Remove any existing menu
        this.hideEquipmentMenu();

        const menu = document.createElement('div');
        menu.id = 'equipment-context-menu';
        menu.style.cssText = `
            position: fixed;
            background: rgba(0, 0, 0, 0.95);
            border: 2px solid var(--gold);
            border-radius: 12px;
            padding: 8px;
            z-index: 10001;
            backdrop-filter: blur(15px);
            min-width: 150px;
        `;

        const buttons = [];

        // Move to inventory button
        buttons.push({
            text: '📦 To Inventory',
            action: () => {
                this.moveUpgradeItemToInventory();
                this.hideEquipmentMenu();
            }
        });

        // Equip button (if item can be equipped)
        if (this.upgradeItem.slot) {
            buttons.push({
                text: '⚔️ Equip',
                action: () => {
                    this.equipUpgradeItem();
                    this.hideEquipmentMenu();
                }
            });
        }

        // Create buttons
        buttons.forEach((btn) => {
            const button = document.createElement('button');
            button.textContent = btn.text;
            button.style.cssText = `
                width: 100%;
                background: var(--glass-bg);
                color: var(--text-primary);
                border: 1px solid var(--border-color);
                border-radius: 6px;
                padding: 8px 12px;
                margin: 2px 0;
                cursor: pointer;
                transition: all 0.2s ease;
                font-size: 0.9rem;
            `;
            button.onmouseover = () => {
                button.style.background = 'var(--blue)';
                button.style.borderColor = 'var(--blue)';
            };
            button.onmouseout = () => {
                button.style.background = 'var(--glass-bg)';
                button.style.borderColor = 'var(--border-color)';
            };
            button.onclick = btn.action;
            menu.appendChild(button);
        });

        document.body.appendChild(menu);

        // Position menu near the clicked item
        const rect = event.target.getBoundingClientRect();
        menu.style.left = (rect.right + 10) + 'px';
        menu.style.top = rect.top + 'px';

        // Adjust if menu goes off screen
        const menuRect = menu.getBoundingClientRect();
        if (menuRect.right > window.innerWidth) {
            menu.style.left = (rect.left - menuRect.width - 10) + 'px';
        }
        if (menuRect.bottom > window.innerHeight) {
            menu.style.top = (rect.bottom - menuRect.height) + 'px';
        }

        // Close menu when clicking outside
        setTimeout(() => {
            document.addEventListener('click', this.hideEquipmentMenu.bind(this), { once: true });
        }, 100);
    }

    moveUpgradeItemToInventory() {
        if (!this.upgradeItem) return;

        // Find empty inventory slot respecting potion-only slots
        const emptySlot = this.findEmptyInventorySlot(this.upgradeItem);
        if (emptySlot === -1) {
            Game.ui.showLootNotification("Inventory is full!");
            return;
        }

        // Move item to inventory
        this.inventory[emptySlot] = this.upgradeItem;

        // Clear upgrade slot
        this.upgradeItem = null;
        this.upgradeSlot = null;
        this.upgradeFromEquipped = false;

        // Update UI
        this.renderUpgradeSlot();
        this.renderInventory();

        Game.ui.showLootNotification("Item moved to inventory!");
    }

    equipUpgradeItem() {
        if (!this.upgradeItem || !this.upgradeItem.slot) return;

        // Check level requirement
        if (Game.player.level < this.upgradeItem.level) {
            Game.ui.showLootNotification(`Need level ${this.upgradeItem.level} to equip this item!`);
            return;
        }

        // Unequip current item if any
        const currentItem = Game.player.state.equipped[this.upgradeItem.slot];
        if (currentItem) {
            const emptySlot = this.findEmptyInventorySlot(currentItem);
            if (emptySlot === -1) {
                Game.ui.showLootNotification("Inventory is full!");
                return;
            }
            this.inventory[emptySlot] = currentItem;
        }

        // Equip the upgrade item
        Game.player.state.equipped[this.upgradeItem.slot] = this.upgradeItem;

        // Clear upgrade slot
        this.upgradeItem = null;
        this.upgradeSlot = null;
        this.upgradeFromEquipped = false;

        // Recalculate stats and update UI
        Game.player.calculateStats();
        this.renderUpgradeSlot();
        this.renderInventory();
        this.renderEquipment();
        Game.ui.updatePlayerDisplay();

        Game.ui.showLootNotification("Item equipped!");
    }

    equipItemToSlot(index, targetSlot) {
        const item = this.inventory[index];
        if (!item) return;

        // Check level requirement
        if (Game.player.level < item.level) {
            Game.ui.showLootNotification(`Need level ${item.level} to equip this item!`);
            return;
        }

        // Handle existing item in target slot
        const currentItem = Game.player.state.equipped[targetSlot];
        if (currentItem) {
            // Find empty inventory slot for displaced item
            const emptySlot = this.findEmptyInventorySlot(currentItem);
            if (emptySlot === -1) {
                Game.ui.showLootNotification("Inventory is full!");
                return;
            }
            this.inventory[emptySlot] = currentItem;
        }

        // Equip the new item
        Game.player.state.equipped[targetSlot] = item;
        this.inventory[index] = null;

        // Recalculate stats and update UI
        Game.player.calculateStats();
        this.renderInventory();
        this.renderEquipment();
        Game.ui.updatePlayerDisplay();

        Game.ui.showLootNotification(`${item.name} equipped to ${targetSlot}!`);
    }

    sellItemWithConfirmation(index, item) {
        // Check if item needs confirmation (upgraded or epic+)
        const needsConfirmation = (item.upgradeLevel && item.upgradeLevel > 0) ||
                                 ['epic', 'legendary', 'mythic'].includes(item.rarity);

        if (needsConfirmation) {
            this.showSellConfirmation(index, item);
        } else {
            this.sellSingleItem(index);
        }
    }

    showSellConfirmation(index, item) {
        // Create confirmation dialog
        const dialog = document.createElement('div');
        dialog.id = 'sell-confirmation';
        dialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.95);
            border: 2px solid var(--gold);
            border-radius: 12px;
            padding: 20px;
            z-index: 10003;
            backdrop-filter: blur(15px);
            min-width: 300px;
            text-align: center;
        `;

        // Calculate sell price based on all stats
        let statValue = item.stats.atk || item.stats.def || item.stats.maxHp || item.stats.maxMp ||
                       item.stats.expGain || item.stats.lootChance || item.stats.atkPercent ||
                       item.stats.critChance || item.stats.critDamage || item.stats.skillDamage ||
                       item.stats.heal || item.stats.restore_mp || item.stats.healPercent || item.stats.mpRestorePercent || 1;
        let sellPrice = Math.floor(10 * RARITY_MULTIPLIERS[item.rarity] * statValue);

        if (item.upgradeLevel && item.upgradeLevel > 0) {
            const upgradeMultiplier = 1 + (item.upgradeLevel * 0.5);
            sellPrice = Math.floor(sellPrice * upgradeMultiplier);
        }

        const rarityColor = this.getRarityColor(item.rarity);

        dialog.innerHTML = `
            <div style="color: ${rarityColor}; font-weight: bold; margin-bottom: 16px; font-size: 1.1rem;">
                Sell ${item.name}?
            </div>
            <div style="color: var(--text-secondary); margin-bottom: 16px;">
                This is a valuable item! Are you sure you want to sell it?
            </div>
            <div style="color: var(--gold); margin-bottom: 20px; font-weight: bold;">
                Sell Price: ${sellPrice.toLocaleString()} Gold
            </div>
            <div style="display: flex; gap: 12px; justify-content: center;">
                <button id="sell-yes" style="
                    background: var(--red);
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: bold;
                ">Yes, Sell</button>
                <button id="sell-no" style="
                    background: var(--glass-bg);
                    color: var(--text-primary);
                    border: 1px solid var(--border-color);
                    padding: 10px 20px;
                    border-radius: 6px;
                    cursor: pointer;
                ">Cancel</button>
            </div>
        `;

        document.body.appendChild(dialog);

        // Add button handlers
        document.getElementById('sell-yes').onclick = () => {
            this.sellSingleItem(index);
            dialog.remove();
        };

        document.getElementById('sell-no').onclick = () => {
            dialog.remove();
        };

        // Close on outside click
        setTimeout(() => {
            document.addEventListener('click', (e) => {
                if (!dialog.contains(e.target)) {
                    dialog.remove();
                }
            }, { once: true });
        }, 100);
    }

    showCompareTooltips(newItem, equippedItem) {
        // Hide any existing tooltips
        this.hideTooltip();

        // Create comparison container
        const container = document.createElement('div');
        container.id = 'comparison-tooltips';
        container.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            display: flex;
            gap: 20px;
            z-index: 10002;
            pointer-events: none;
        `;

        // Create tooltips for both items
        const newTooltip = this.createComparisonTooltip(newItem, 'New Item');
        const equippedTooltip = this.createComparisonTooltip(equippedItem, 'Equipped');

        container.appendChild(newTooltip);
        container.appendChild(equippedTooltip);
        document.body.appendChild(container);

        // Auto-hide after 5 seconds
        setTimeout(() => {
            if (container.parentNode) {
                container.remove();
            }
        }, 5000);

        // Click to close
        setTimeout(() => {
            document.addEventListener('click', () => {
                if (container.parentNode) {
                    container.remove();
                }
            }, { once: true });
        }, 100);
    }

    createComparisonTooltip(item, label) {
        const tooltip = document.createElement('div');
        const rarityColor = this.getRarityColor(item.rarity);

        tooltip.style.cssText = `
            background: rgba(0, 0, 0, 0.95);
            border: 2px solid ${rarityColor};
            border-radius: 12px;
            padding: 16px;
            min-width: 250px;
            max-width: 350px;
            backdrop-filter: blur(15px);
            font-family: 'Inter', sans-serif;
        `;

        let tooltipContent = `
            <div style="font-weight: 700; margin-bottom: 8px; font-size: 1rem; color: ${rarityColor}; text-align: center;">
                ${label}
            </div>
            <div style="font-weight: 700; margin-bottom: 12px; font-size: 1.1rem; color: ${rarityColor}; text-shadow: 0 0 10px ${rarityColor};">
                ${item.name}
            </div>
            <div style="color: ${rarityColor}; font-size: 0.9rem; margin-bottom: 8px; text-transform: uppercase; font-weight: 600;">
                ${item.rarity} ${item.type}
            </div>
        `;

        // Add upgrade level if item is upgraded
        if (item.upgradeLevel && item.upgradeLevel > 0) {
            tooltipContent += `
                <div style="color: #ffd700; font-size: 0.9rem; margin-bottom: 8px; font-weight: 600;">
                    ⚡ Upgrade Level: +${item.upgradeLevel}
                </div>
            `;
        }

        // Add stats
        if (Object.keys(item.stats).length > 0) {
            tooltipContent += `<div style="border-top: 1px solid rgba(255,255,255,0.2); padding-top: 8px; margin-top: 8px;">`;
            Object.entries(item.stats).forEach(([stat, value]) => {
                let statColor = '#4fc3f7';
                if (stat === 'atk') statColor = '#ff6b6b';
                if (stat === 'def') statColor = '#4caf50';

                tooltipContent += `
                    <div style="margin: 4px 0; color: ${statColor}; font-weight: 600;">
                        ${this.getStatDisplayName(stat)}: +${value}
                    </div>
                `;
            });
            tooltipContent += `</div>`;

            // Show base stats for upgraded items
            if (item.upgradeLevel && item.upgradeLevel > 0 && item.baseStats) {
                tooltipContent += `
                    <div style="border-top: 1px solid rgba(255,255,255,0.2); padding-top: 8px; margin-top: 8px;">
                        <div style="color: #b0b3c1; font-size: 0.85rem; margin-bottom: 4px;">Base Stats (before upgrades):</div>
                `;

                Object.entries(item.baseStats).forEach(([stat, value]) => {
                    if (value > 0) {
                        const statName = this.getStatDisplayName(stat);
                        const currentValue = item.stats[stat] || 0;
                        const increase = currentValue - value;
                        tooltipContent += `
                            <div style="color: #888; font-size: 0.8rem; margin: 1px 0;">
                                ${statName}: ${value} → ${currentValue}
                                <span style="color: #4fc3f7;">(+${increase})</span>
                            </div>
                        `;
                    }
                });

                tooltipContent += `</div>`;
            }
        }

        tooltip.innerHTML = tooltipContent;
        return tooltip;
    }

    autoEquipItem(index) {
        const item = this.inventory[index];
        if (!item || !item.slot) return;
        
        const oldItem = this.equipItem(item, item.slot);
        if (oldItem !== false) {
            this.inventory[index] = oldItem;
            this.renderInventory();
            this.renderEquipment();
            if (Game && Game.ui) {
                Game.ui.updatePlayerDisplay();
                Game.ui.showLootNotification(`Equipped ${item.name}!`);
            }
        }
    }

    // Old showContextMenu function removed - now using left-click menus only

    hideContextMenu() {
        if (this.currentContextMenu) {
            this.currentContextMenu.remove();
            this.currentContextMenu = null;
        }

        // Also remove any existing context menus
        const existingMenu = document.getElementById('context-menu');
        if (existingMenu) {
            existingMenu.remove();
        }
    }

    sellSingleItem(index) {
        const item = this.inventory[index];
        if (!item) return;

        // Calculate sell price based on all stats
        let statValue = item.stats.atk || item.stats.def || item.stats.maxHp || item.stats.maxMp ||
                       item.stats.expGain || item.stats.lootChance || item.stats.atkPercent ||
                       item.stats.critChance || item.stats.critDamage || item.stats.skillDamage ||
                       item.stats.heal || item.stats.restore_mp || item.stats.healPercent || item.stats.mpRestorePercent || 1;
        let sellPrice = Math.floor(10 * RARITY_MULTIPLIERS[item.rarity] * statValue);

        // Upgraded items sell for much more
        if (item.upgradeLevel && item.upgradeLevel > 0) {
            // Each upgrade level adds 50% to sell price
            const upgradeMultiplier = 1 + (item.upgradeLevel * 0.5);
            sellPrice = Math.floor(sellPrice * upgradeMultiplier);
        }

        Game.player.gainGold(sellPrice);
        this.inventory[index] = null;

        if (Game && Game.ui) {
            Game.ui.showLootNotification(`Sold ${item.name} for ${sellPrice} gold!`);
        }
        this.renderInventory();
        if (Game && Game.ui) {
            Game.ui.updatePlayerDisplay();
        }
    }

    renderEquipment() {
        Object.entries(Game.player.state.equipped).forEach(([slot, item]) => {
            const slotElement = document.querySelector(`[data-slot="${slot}"]`);
            if (slotElement) {
                const label = slotElement.querySelector('.slot-label');
                slotElement.innerHTML = '';
                if (label) slotElement.appendChild(label);
                
                if (item) {
                    slotElement.classList.add('filled');
                    const itemDiv = document.createElement('div');
                    itemDiv.className = `item ${item.rarity}`;
                    
                    // Use the enhanced sprite rendering system
                    this.renderItemIcon(item, itemDiv);
                    
                    itemDiv.draggable = true;
                    itemDiv.ondragstart = (e) => this.dragStartEquipped(e, slot);
                    
                    itemDiv.addEventListener('mouseenter', (e) => this.showTooltip(e, item));
                    itemDiv.addEventListener('mouseleave', () => this.hideTooltip());
                    itemDiv.addEventListener('mousemove', (e) => this.moveTooltip(e));
                    itemDiv.addEventListener('click', (e) => this.showEquippedItemMenu(e, slot, item));
                    
                    slotElement.appendChild(itemDiv);
                } else {
                    slotElement.classList.remove('filled');
                }
            }
        });
    }

    showTooltip(e, item) {
        let tooltip = document.getElementById('equipment-tooltip');
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.id = 'equipment-tooltip';
            tooltip.style.cssText = `
                position: fixed;
                background: rgba(0, 0, 0, 0.95);
                border: 2px solid;
                border-radius: 12px;
                padding: 16px;
                pointer-events: none;
                z-index: 10000;
                display: none;
                min-width: 250px;
                max-width: 350px;
                backdrop-filter: blur(15px);
                font-family: 'Inter', sans-serif;
            `;
            document.body.appendChild(tooltip);
        }
        
        const rarityColors = {
            common: '#6b7280',
            rare: '#4fc3f7', 
            epic: '#9c27b0',
            legendary: '#ff9800',
            mythic: '#ff1744'
        };
        
        const rarityColor = rarityColors[item.rarity] || '#ffffff';
        tooltip.style.borderColor = rarityColor;
        
        let tooltipContent = `
            <div style="font-weight: 700; margin-bottom: 12px; font-size: 1.2rem; color: ${rarityColor}; text-shadow: 0 0 10px ${rarityColor};">
                ${item.name}
            </div>
            <div style="color: ${rarityColor}; font-size: 0.9rem; margin-bottom: 8px; text-transform: uppercase; font-weight: 600;">
                ${item.rarity} ${item.type}
            </div>
        `;

        // Add upgrade level if item is upgraded
        if (item.upgradeLevel && item.upgradeLevel > 0) {
            tooltipContent += `
                <div style="color: #ffd700; font-size: 0.9rem; margin-bottom: 8px; font-weight: 600;">
                    ⚡ Upgrade Level: +${item.upgradeLevel}
                </div>
            `;
        }
        
        // Add description if available
        if (item.description) {
            tooltipContent += `
                <div style="color: #b0b3c1; font-size: 0.9rem; margin-bottom: 8px; font-style: italic;">
                    "${item.description}"
                </div>
            `;
        }
        
        // Add level requirements
        if (item.level) {
            const canEquip = Game.player.level >= item.level;
            tooltipContent += `
                <div style="color: ${canEquip ? '#4caf50' : '#f44336'}; font-size: 0.9rem; margin-bottom: 8px;">
                    Required Level: ${item.level}
                </div>
            `;
        }
        
        // Add item level
        if (item.itemLevel) {
            tooltipContent += `
                <div style="color: #b0b3c1; font-size: 0.85rem; margin-bottom: 8px;">
                    Item Level: ${item.itemLevel}
                </div>
            `;
        }
        
        if (Object.keys(item.stats).length > 0) {
            tooltipContent += `<div style="border-top: 1px solid rgba(255,255,255,0.2); padding-top: 8px; margin-top: 8px;">`;
            Object.entries(item.stats).forEach(([stat, value]) => {
                let statColor = '#4fc3f7';
                if (stat === 'atk') statColor = '#ff6b6b';
                if (stat === 'def') statColor = '#4caf50';
                if (stat === 'heal') statColor = '#9c27b0';
                if (stat === 'restore_mp') statColor = '#1e88e5';

                tooltipContent += `
                    <div style="margin: 4px 0; color: ${statColor}; font-weight: 600;">
                        ${this.getStatDisplayName(stat)}: +${value}
                    </div>
                `;
            });
            tooltipContent += `</div>`;

            // Show base stats for upgraded items in compare tooltip
            if (item.upgradeLevel && item.upgradeLevel > 0 && item.baseStats) {
                tooltipContent += `
                    <div style="border-top: 1px solid rgba(255,255,255,0.2); padding-top: 6px; margin-top: 6px;">
                        <div style="color: #b0b3c1; font-size: 0.8rem; margin-bottom: 3px;">Base Stats:</div>
                `;

                Object.entries(item.baseStats).forEach(([stat, value]) => {
                    if (value > 0) {
                        const statName = this.getStatDisplayName(stat);
                        const currentValue = item.stats[stat] || 0;
                        const increase = currentValue - value;
                        tooltipContent += `
                            <div style="color: #888; font-size: 0.75rem; margin: 1px 0;">
                                ${statName}: ${value} → ${currentValue}
                                <span style="color: #4fc3f7;">(+${increase})</span>
                            </div>
                        `;
                    }
                });

                tooltipContent += `</div>`;
            }
        }
        
        if (this.maxStackSize[item.type]) {
            const currentCount = item.count || 1;
            const maxStack = this.maxStackSize[item.type];
            tooltipContent += `
                <div style="border-top: 1px solid rgba(255,255,255,0.2); padding-top: 8px; margin-top: 8px; color: #4fc3f7; font-size: 0.85rem;">
                    <div style="font-weight: 600;">
                        Stack: ${currentCount} / ${maxStack}
                    </div>
                </div>
            `;
        }
        
        if (item.slot) {
            tooltipContent += `
                <div style="border-top: 1px solid rgba(255,255,255,0.2); padding-top: 8px; margin-top: 8px; color: #b0b3c1; font-size: 0.85rem;">
                    <div>• Double-click to equip</div>
                    <div>• Left-click for options</div>
                    <div>• Drag to equipment slot</div>
                </div>
            `;
        } else if (item.type === 'potion') {
            tooltipContent += `
                <div style="border-top: 1px solid rgba(255,255,255,0.2); padding-top: 8px; margin-top: 8px; color: #b0b3c1; font-size: 0.85rem;">
                    <div>• Double-click to use</div>
                    <div>• Left-click for options</div>
                    <div>• Press Q to use first HP potion</div>
                </div>
            `;
        } else if (item.type === 'mp_potion') {
            tooltipContent += `
                <div style="border-top: 1px solid rgba(255,255,255,0.2); padding-top: 8px; margin-top: 8px; color: #b0b3c1; font-size: 0.85rem;">
                    <div>• Double-click to use</div>
                    <div>• Left-click for options</div>
                    <div>• Press E to use first MP potion</div>
                </div>
            `;
        } else if (item.type === 'exp_potion') {
            const multiplier = item.stats.exp_boost || 2;
            tooltipContent += `
                <div style="border-top: 1px solid rgba(255,255,255,0.2); padding-top: 8px; margin-top: 8px; color: #b0b3c1; font-size: 0.85rem;">
                    <div>• Double-click to use</div>
                    <div>• Left-click for options</div>
                    <div>• ${multiplier}x EXP for 30 minutes</div>
                    <div>• Does not stack with other EXP potions</div>
                    <div style="color: #ffd700;">• Huge gold investment!</div>
                </div>
            `;
        }
        
        // Calculate sell price based on all stats
        let statValue = item.stats.atk || item.stats.def || item.stats.maxHp || item.stats.maxMp ||
                       item.stats.expGain || item.stats.lootChance || item.stats.atkPercent ||
                       item.stats.critChance || item.stats.critDamage || item.stats.skillDamage ||
                       item.stats.heal || item.stats.restore_mp || item.stats.healPercent || item.stats.mpRestorePercent || 1;
        let sellPrice = Math.floor(10 * RARITY_MULTIPLIERS[item.rarity] * statValue);

        // Upgraded items sell for much more
        if (item.upgradeLevel && item.upgradeLevel > 0) {
            const upgradeMultiplier = 1 + (item.upgradeLevel * 0.5);
            sellPrice = Math.floor(sellPrice * upgradeMultiplier);
        }

        tooltipContent += `
            <div style="border-top: 1px solid rgba(255,255,255,0.2); padding-top: 8px; margin-top: 8px; color: #ffd700; font-size: 0.9rem;">
                Sell Value: ${sellPrice} Gold
            </div>
        `;
        
        tooltip.innerHTML = tooltipContent;
        tooltip.style.display = 'block';
        this.moveTooltip(e);
    }

    moveTooltip(e) {
        const tooltip = document.getElementById('equipment-tooltip');
        if (!tooltip) return;
        
        const rect = tooltip.getBoundingClientRect();
        let left = e.clientX + 15;
        let top = e.clientY + 15;
        
        if (left + rect.width > window.innerWidth) {
            left = e.clientX - rect.width - 15;
        }
        if (top + rect.height > window.innerHeight) {
            top = e.clientY - rect.height - 15;
        }
        
        tooltip.style.left = left + 'px';
        tooltip.style.top = top + 'px';
    }

    getStatDisplayName(stat) {
        const statNames = {
            atk: 'Attack',
            def: 'Defense',
            heal: 'Healing',
            restore_mp: 'MP Restore',
            mdef: 'Defense' // Convert old MDEF to Defense for display
        };
        return statNames[stat] || stat.toUpperCase();
    }

    hideTooltip() {
        const tooltip = document.getElementById('equipment-tooltip');
        if (tooltip) tooltip.style.display = 'none';
    }

    getRarityColor(rarity) {
        const colors = {
            common: '#6b7280',
            rare: '#4fc3f7',
            epic: '#9c27b0',
            legendary: '#ff9800',
            mythic: '#ff1744'
        };
        return colors[rarity] || '#ffffff';
    }

    // === EQUIPMENT UPGRADE SYSTEM ===

    dropUpgradeItem(event) {
        event.preventDefault();
        const slot = event.target.closest('.upgrade-slot');

        if (this.draggedItem && this.canUpgradeItem(this.draggedItem)) {
            // Remove item from inventory
            this.inventory[this.draggedFromSlot] = null;

            // Set as upgrade item
            this.upgradeItem = this.draggedItem;
            this.upgradeSlot = this.draggedFromSlot;

            // Update UI
            this.renderUpgradeSlot();
            this.renderInventory();

            Game.ui.showLootNotification(`${this.draggedItem.name} ready for upgrade!`);
        }

        this.clearDragState();
        slot.classList.remove('drag-over');
    }

    canUpgradeItem(item) {
        // Only equipment can be upgraded (not potions)
        const equipmentTypes = ['helmet', 'chestplate', 'leggings', 'boots', 'sword', 'shield', 'ring', 'necklace'];
        return equipmentTypes.includes(item.type) && (!item.upgradeLevel || item.upgradeLevel < 15);
    }

    renderUpgradeSlot() {
        const slot = document.getElementById('upgrade-slot');
        const info = document.getElementById('upgrade-info');
        const button = document.getElementById('upgrade-button');

        if (!slot || !info || !button) return;

        if (this.upgradeItem) {
            // Show item in upgrade slot
            const itemElement = document.createElement('div');
            itemElement.className = `item ${this.upgradeItem.rarity}`;
            this.renderItemIcon(this.upgradeItem, itemElement);

            // Add click handler for context menu
            itemElement.addEventListener('click', (e) => this.showUpgradeSlotMenu(e));

            slot.innerHTML = '';
            slot.appendChild(itemElement);
            slot.classList.add('filled');

            // Show upgrade info
            const currentLevel = this.upgradeItem.upgradeLevel || 0;
            const nextLevel = currentLevel + 1;
            const cost = this.getUpgradeCost(currentLevel);
            const chance = this.getUpgradeChance(currentLevel);
            const currentStats = this.getItemStats(this.upgradeItem);
            const nextStats = this.getUpgradedStats(this.upgradeItem);

            document.getElementById('upgrade-stats').innerHTML = `
                <div style="color: var(--text-primary);">+${currentLevel} → +${nextLevel}</div>
                <div style="color: var(--blue);">Current: ${currentStats}</div>
                <div style="color: var(--gold);">Next: ${nextStats}</div>
            `;

            document.getElementById('upgrade-cost').innerHTML = `
                <div>Cost: ${cost.toLocaleString()} Gold</div>
            `;

            document.getElementById('upgrade-chance').innerHTML = `
                <div>Success Rate: ${chance}%</div>
            `;

            info.style.display = 'block';
            button.disabled = Game.player.state.gold < cost;
        } else {
            // Empty slot
            slot.innerHTML = '<div class="slot-label">Drop Equipment Here</div>';
            slot.classList.remove('filled');
            info.style.display = 'none';
            button.disabled = true;
        }
    }

    getUpgradeCost(currentLevel) {
        // Base cost 1000, doubles each level
        return 1000 * Math.pow(2, currentLevel);
    }

    getUpgradeChance(currentLevel) {
        // Decreasing success rate: 90% at +0, down to 10% at +14
        const baseChance = 90;
        const reduction = currentLevel * 5.33; // Reduces by ~5.33% per level
        return Math.max(10, Math.round(baseChance - reduction));
    }

    getItemStats(item) {
        if (!item.stats) return "No stats";
        const statEntries = Object.entries(item.stats);
        return statEntries.map(([stat, value]) => {
            // Handle accessory stats with proper display names
            if (ACCESSORY_STATS[stat]) {
                const config = ACCESSORY_STATS[stat];
                // Special handling for expGain to show actual percentage change
                if (stat === 'expGain') {
                    return `${config.name}: +${value}%`;
                }
                return `${config.name}: ${value}${config.suffix || ''}`;
            }
            // Handle regular stats
            const displayStat = stat === 'maxHp' ? 'MAX HP' :
                               stat === 'maxMp' ? 'MAX MP' :
                               stat.toUpperCase();
            return `${displayStat}: ${value}`;
        }).join(', ');
    }

    getUpgradedStats(item) {
        if (!item.stats) return "No stats";
        const upgradeLevel = item.upgradeLevel || 0;
        const nextLevel = upgradeLevel + 1;

        // Use base stats if available, otherwise current stats
        const baseStats = item.baseStats || item.stats;

        // Each upgrade level increases stats by 25%
        const multiplier = Math.pow(1.25, nextLevel);

        const statEntries = Object.entries(baseStats);
        return statEntries.map(([stat, baseValue]) => {
            const newValue = Math.floor(baseValue * multiplier);
            const displayStat = stat === 'maxHp' ? 'MAX HP' : stat.toUpperCase();
            return `${displayStat}: ${newValue}`;
        }).join(', ');
    }

    upgradeEquipment() {
        if (!this.upgradeItem) return;

        const currentLevel = this.upgradeItem.upgradeLevel || 0;
        const cost = this.getUpgradeCost(currentLevel);
        const chance = this.getUpgradeChance(currentLevel);

        // Check if player has enough gold
        if (Game.player.state.gold < cost) {
            Game.ui.showLootNotification("Not enough gold for upgrade!");
            return;
        }

        // Deduct gold
        Game.player.state.gold -= cost;

        // Roll for success
        const success = Math.random() * 100 < chance;

        if (success) {
            // Successful upgrade
            this.upgradeItem.upgradeLevel = currentLevel + 1;
            this.applyUpgradeStats(this.upgradeItem);

            // Update item name to show upgrade level
            const baseName = this.upgradeItem.name.replace(/ \+\d+$/, '');
            this.upgradeItem.name = `${baseName} +${this.upgradeItem.upgradeLevel}`;

            // Show success animation and message
            const slot = document.getElementById('upgrade-slot');
            slot.classList.add('upgrade-success');
            setTimeout(() => slot.classList.remove('upgrade-success'), 600);

            // Track achievement progress for item upgrade
            if (Game.achievements) {
                Game.achievements.onItemUpgraded(this.upgradeItem.upgradeLevel);
            }

            Game.ui.showLootNotification(`✅ Upgrade successful! ${this.upgradeItem.name}`);
        } else {
            // Failed upgrade - item remains but no upgrade
            Game.ui.showLootNotification(`💥 Upgrade failed! ${this.upgradeItem.name} remains unchanged.`);

            // Show fail animation
            const slot = document.getElementById('upgrade-slot');
            slot.classList.add('upgrade-fail');
            setTimeout(() => slot.classList.remove('upgrade-fail'), 600);
        }

        // Return item to appropriate location (inventory or equipped slot)
        if (this.upgradeFromEquipped) {
            // Return to equipped slot
            Game.player.state.equipped[this.upgradeSlot] = this.upgradeItem;
            // Recalculate stats since item was re-equipped
            Game.player.calculateStats();
        } else {
            // Return to inventory
            this.inventory[this.upgradeSlot] = this.upgradeItem;
        }

        // Clear upgrade slot
        this.upgradeItem = null;
        this.upgradeSlot = null;
        this.upgradeFromEquipped = false;

        // Update UI
        this.renderUpgradeSlot();
        this.renderInventory();
        this.renderEquipment();
        Game.ui.updatePlayerDisplay();
    }

    applyUpgradeStats(item) {
        if (!item.stats) return;

        // Store base stats if not already stored (for existing items)
        if (!item.baseStats) {
            // Calculate base stats by reverse engineering from current upgrade level
            const currentLevel = item.upgradeLevel || 0;
            if (currentLevel > 0) {
                // Reverse the upgrade multiplier to get base stats
                const currentMultiplier = Math.pow(1.25, currentLevel - 1);
                item.baseStats = {};
                Object.keys(item.stats).forEach(stat => {
                    item.baseStats[stat] = Math.floor(item.stats[stat] / currentMultiplier);
                });
            } else {
                item.baseStats = { ...item.stats };
            }
        }

        // Each upgrade level increases stats by 25% from base
        const upgradeLevel = item.upgradeLevel || 0;
        const multiplier = Math.pow(1.25, upgradeLevel);

        // Apply multiplier to base stats
        Object.keys(item.baseStats).forEach(stat => {
            item.stats[stat] = Math.floor(item.baseStats[stat] * multiplier);
        });
    }

    // === INVENTORY MANAGEMENT FUNCTIONS ===

    setSortType(type) {
        this.sortType = type;
    }

    setAllowSellValuable(allow) {
        this.allowSellValuable = allow;
    }

    sortInventory() {
        // Don't sort favorites
        const regularInventory = this.inventory.slice(0, 240); // Only regular inventory

        // Separate potions and non-potions from ALL inventory slots
        const potions = [];
        const nonPotions = [];

        for (let i = 0; i < regularInventory.length; i++) {
            if (regularInventory[i]) {
                const item = regularInventory[i];
                const isPotionType = item.type === 'potion' || item.type === 'mp_potion' || item.type === 'exp_potion';

                if (isPotionType) {
                    potions.push({ item, originalIndex: i });
                } else {
                    nonPotions.push({ item, originalIndex: i });
                }
            }
        }

        // Sort potions
        potions.sort((a, b) => {
            switch (this.sortType) {
                case 'type':
                    if (a.item.type !== b.item.type) {
                        return a.item.type.localeCompare(b.item.type);
                    }
                    return a.item.name.localeCompare(b.item.name);

                case 'rarity':
                    const rarityOrder = { common: 0, rare: 1, epic: 2, legendary: 3, mythic: 4 };
                    const rarityDiff = (rarityOrder[b.item.rarity] || 0) - (rarityOrder[a.item.rarity] || 0);
                    if (rarityDiff !== 0) return rarityDiff;
                    return a.item.name.localeCompare(b.item.name);

                case 'price':
                    const priceA = this.calculateSellPrice(a.item);
                    const priceB = this.calculateSellPrice(b.item);
                    return priceB - priceA;

                case 'level':
                    const levelA = a.item.level || 0;
                    const levelB = b.item.level || 0;
                    const levelDiff = levelB - levelA;
                    if (levelDiff !== 0) return levelDiff;
                    return a.item.name.localeCompare(b.item.name);

                default:
                    return 0;
            }
        });

        // Sort non-potions
        nonPotions.sort((a, b) => {
            switch (this.sortType) {
                case 'type':
                    if (a.item.type !== b.item.type) {
                        return a.item.type.localeCompare(b.item.type);
                    }
                    return a.item.name.localeCompare(b.item.name);

                case 'rarity':
                    const rarityOrder = { common: 0, rare: 1, epic: 2, legendary: 3, mythic: 4 };
                    const rarityDiff = (rarityOrder[b.item.rarity] || 0) - (rarityOrder[a.item.rarity] || 0);
                    if (rarityDiff !== 0) return rarityDiff;
                    return a.item.name.localeCompare(b.item.name);

                case 'price':
                    const priceA = this.calculateSellPrice(a.item);
                    const priceB = this.calculateSellPrice(b.item);
                    return priceB - priceA;

                case 'level':
                    const levelA = a.item.level || 0;
                    const levelB = b.item.level || 0;
                    const levelDiff = levelB - levelA;
                    if (levelDiff !== 0) return levelDiff;
                    return a.item.name.localeCompare(b.item.name);

                default:
                    return 0;
            }
        });

        // Clear all inventory slots
        for (let i = 0; i < regularInventory.length; i++) {
            this.inventory[i] = null;
        }

        // Place potions in potion-locked slots first (32-47)
        let potionIndex = 0;
        for (let i = 32; i < 48 && potionIndex < potions.length; i++) {
            this.inventory[i] = potions[potionIndex].item;
            potionIndex++;
        }

        // Place remaining potions in regular slots
        for (let i = 0; i < 32 && potionIndex < potions.length; i++) {
            if (this.inventory[i] === null) {
                this.inventory[i] = potions[potionIndex].item;
                potionIndex++;
            }
        }
        for (let i = 48; i < regularInventory.length && potionIndex < potions.length; i++) {
            if (this.inventory[i] === null) {
                this.inventory[i] = potions[potionIndex].item;
                potionIndex++;
            }
        }

        // Place non-potions in regular slots (avoid potion-locked slots)
        let nonPotionIndex = 0;
        for (let i = 0; i < 32 && nonPotionIndex < nonPotions.length; i++) {
            if (this.inventory[i] === null) {
                this.inventory[i] = nonPotions[nonPotionIndex].item;
                nonPotionIndex++;
            }
        }
        for (let i = 48; i < regularInventory.length && nonPotionIndex < nonPotions.length; i++) {
            if (this.inventory[i] === null) {
                this.inventory[i] = nonPotions[nonPotionIndex].item;
                nonPotionIndex++;
            }
        }

        this.renderInventory();
        if (Game && Game.ui) {
            const sortNames = {
                'type': 'Item Type',
                'rarity': 'Rarity',
                'price': 'Gold Value',
                'level': 'Required Level'
            };
            const sortName = sortNames[this.sortType] || this.sortType;
            Game.ui.showLootNotification(`Inventory sorted by ${sortName}! Potions moved to potion slots.`);
        }
    }

    // === FAVORITES FUNCTIONS ===

    selectFavoriteItem(index, event = null) {
        const item = this.favorites[index];
        if (!item) return;

        // Prevent rapid clicking issues
        const now = Date.now();
        if (this.lastClickTime && (now - this.lastClickTime) < 100) {
            return;
        }
        this.lastClickTime = now;

        // For equipment items, show enhanced context menu
        if (item.slot) {
            this.hideEquipmentMenu();
            setTimeout(() => {
                this.showFavoriteEquipmentMenu(index, item, event);
            }, 10);
            return;
        }

        // For consumables, show context menu
        this.hideEquipmentMenu();
        setTimeout(() => {
            this.showFavoriteConsumableMenu(index, item, event);
        }, 10);
    }

    autoEquipFavoriteItem(index) {
        const item = this.favorites[index];
        if (!item || !item.slot) return;

        const targetSlot = item.slot === 'ring' ? this.selectRingSlot() : item.slot;
        if (!targetSlot) return;

        if (Game.player.level < item.level) {
            if (Game && Game.ui) {
                Game.ui.showLootNotification(`Requires level ${item.level} to equip!`);
            }
            return;
        }

        const oldItem = Game.player.state.equipped[targetSlot];
        Game.player.state.equipped[targetSlot] = item;
        this.favorites[index] = oldItem;

        Game.player.calculateStats();
        this.renderInventory();
        this.renderEquipment();
        if (Game && Game.ui) {
            Game.ui.updatePlayerDisplay();
            Game.ui.showLootNotification(`${item.name} equipped from favorites!`);
        }
    }

    showFavoriteContextMenu(e, item, index) {
        this.hideContextMenu();

        const menu = document.createElement('div');
        menu.className = 'context-menu';
        menu.style.cssText = `
            position: fixed;
            left: ${e.clientX}px;
            top: ${e.clientY}px;
            background: var(--bg-secondary);
            border: 1px solid var(--border);
            border-radius: 4px;
            padding: 4px 0;
            z-index: 10000;
            min-width: 120px;
        `;

        const buttons = [
            { text: 'Remove from Favorites', action: () => this.removeFromFavorites(index) }
        ];

        if (item.slot) {
            buttons.unshift({ text: 'Equip', action: () => this.autoEquipFavoriteItem(index) });
        }

        buttons.forEach(btn => {
            const button = document.createElement('button');
            button.textContent = btn.text;
            button.style.cssText = `
                width: 100%;
                padding: 8px 12px;
                background: none;
                border: none;
                color: var(--text-primary);
                text-align: left;
                cursor: pointer;
                font-size: 0.9rem;
            `;
            button.onmouseover = () => button.style.background = 'rgba(255,255,255,0.1)';
            button.onmouseout = () => button.style.background = 'none';
            button.onclick = () => {
                btn.action();
                this.hideContextMenu();
            };
            menu.appendChild(button);
        });

        document.body.appendChild(menu);
        this.currentContextMenu = menu;

        // Close menu when clicking elsewhere
        setTimeout(() => {
            document.addEventListener('click', this.hideContextMenu.bind(this), { once: true });
        }, 10);
    }

    showFavoriteEquipmentMenu(index, item, event) {
        // Remove any existing menu
        this.hideEquipmentMenu();

        const menu = document.createElement('div');
        menu.id = 'equipment-context-menu';
        menu.style.cssText = `
            position: fixed;
            background: rgba(0, 0, 0, 0.95);
            border: 2px solid var(--gold);
            border-radius: 12px;
            padding: 8px;
            z-index: 10001;
            backdrop-filter: blur(15px);
            min-width: 150px;
        `;

        const buttons = [];

        // Equip button
        buttons.push({
            text: `⚔️ Equip ${item.name}`,
            action: () => {
                this.autoEquipFavoriteItem(index);
                this.hideEquipmentMenu();
            }
        });

        // Remove from Favorites button
        buttons.push({
            text: '❌ Remove from Favorites',
            action: () => {
                this.removeFromFavorites(index);
                this.hideEquipmentMenu();
            }
        });

        // Create buttons
        buttons.forEach((btn) => {
            const button = document.createElement('button');
            button.textContent = btn.text;
            button.style.cssText = `
                width: 100%;
                background: var(--glass-bg);
                color: var(--text-primary);
                border: 1px solid var(--border-color);
                border-radius: 6px;
                padding: 8px 12px;
                margin: 2px 0;
                cursor: pointer;
                transition: all 0.2s ease;
                font-size: 0.9rem;
            `;
            button.onmouseover = () => {
                button.style.background = 'var(--blue)';
                button.style.borderColor = 'var(--blue)';
            };
            button.onmouseout = () => {
                button.style.background = 'var(--glass-bg)';
                button.style.borderColor = 'var(--border-color)';
            };
            button.onclick = btn.action;
            menu.appendChild(button);
        });

        document.body.appendChild(menu);

        // Position menu near the clicked item or use event position
        let rect;
        if (event && event.target) {
            rect = event.target.getBoundingClientRect();
        } else {
            // Fallback positioning
            rect = { right: 200, left: 150, top: 200, bottom: 250 };
        }

        menu.style.left = (rect.right + 10) + 'px';
        menu.style.top = rect.top + 'px';

        // Adjust if menu goes off screen
        const menuRect = menu.getBoundingClientRect();
        if (menuRect.right > window.innerWidth) {
            menu.style.left = (rect.left - menuRect.width - 10) + 'px';
        }
        if (menuRect.bottom > window.innerHeight) {
            menu.style.top = (rect.bottom - menuRect.height) + 'px';
        }

        // Close menu when clicking outside
        setTimeout(() => {
            document.addEventListener('click', this.hideEquipmentMenu.bind(this), { once: true });
        }, 100);
    }

    showFavoriteConsumableMenu(index, item, event) {
        // Remove any existing menu
        this.hideEquipmentMenu();

        const menu = document.createElement('div');
        menu.id = 'equipment-context-menu';
        menu.style.cssText = `
            position: fixed;
            background: rgba(0, 0, 0, 0.95);
            border: 2px solid var(--gold);
            border-radius: 12px;
            padding: 8px;
            z-index: 10001;
            backdrop-filter: blur(15px);
            min-width: 150px;
        `;

        const buttons = [];

        // Use button for potions
        if (item.type === 'potion' || item.type === 'mp_potion') {
            buttons.push({
                text: `🧪 Use ${item.name}`,
                action: () => {
                    // Move to regular inventory first, then use
                    this.removeFromFavorites(index);
                    // Find the item in regular inventory and use it
                    const regularIndex = this.inventory.findIndex(invItem =>
                        invItem && invItem.name === item.name && invItem.type === item.type
                    );
                    if (regularIndex !== -1) {
                        if (item.type === 'potion') {
                            this.usePotionFromInventory(regularIndex);
                        } else {
                            this.useMpPotionFromInventory(regularIndex);
                        }
                    }
                    this.hideEquipmentMenu();
                }
            });
        } else if (item.type === 'exp_potion') {
            buttons.push({
                text: `⭐ Use ${item.name}`,
                action: () => {
                    // Move to regular inventory first, then use
                    this.removeFromFavorites(index);
                    const regularIndex = this.inventory.findIndex(invItem =>
                        invItem && invItem.name === item.name && invItem.type === item.type
                    );
                    if (regularIndex !== -1) {
                        this.useExpPotionFromInventory(regularIndex);
                    }
                    this.hideEquipmentMenu();
                }
            });
        }

        // Remove from Favorites button
        buttons.push({
            text: '❌ Remove from Favorites',
            action: () => {
                this.removeFromFavorites(index);
                this.hideEquipmentMenu();
            }
        });

        // Create buttons
        buttons.forEach((btn) => {
            const button = document.createElement('button');
            button.textContent = btn.text;
            button.style.cssText = `
                width: 100%;
                background: var(--glass-bg);
                color: var(--text-primary);
                border: 1px solid var(--border-color);
                border-radius: 6px;
                padding: 8px 12px;
                margin: 2px 0;
                cursor: pointer;
                transition: all 0.2s ease;
                font-size: 0.9rem;
            `;
            button.onmouseover = () => {
                button.style.background = 'var(--blue)';
                button.style.borderColor = 'var(--blue)';
            };
            button.onmouseout = () => {
                button.style.background = 'var(--glass-bg)';
                button.style.borderColor = 'var(--border-color)';
            };
            button.onclick = btn.action;
            menu.appendChild(button);
        });

        document.body.appendChild(menu);

        // Position menu near the clicked item or use event position
        let rect;
        if (event && event.target) {
            rect = event.target.getBoundingClientRect();
        } else {
            // Fallback positioning
            rect = { right: 200, left: 150, top: 200, bottom: 250 };
        }

        menu.style.left = (rect.right + 10) + 'px';
        menu.style.top = rect.top + 'px';

        // Adjust if menu goes off screen
        const menuRect = menu.getBoundingClientRect();
        if (menuRect.right > window.innerWidth) {
            menu.style.left = (rect.left - menuRect.width - 10) + 'px';
        }
        if (menuRect.bottom > window.innerHeight) {
            menu.style.top = (rect.bottom - menuRect.height) + 'px';
        }

        // Close menu when clicking outside
        setTimeout(() => {
            document.addEventListener('click', this.hideEquipmentMenu.bind(this), { once: true });
        }, 100);
    }

    moveToFavorites(inventoryIndex) {
        const item = this.inventory[inventoryIndex];
        if (!item) return;

        // Check if we can stack with existing favorites for stackable items
        if (this.maxStackSize[item.type]) {
            for (let i = 0; i < this.favorites.length; i++) {
                const favoriteItem = this.favorites[i];
                if (favoriteItem && this.canStack(favoriteItem, item)) {
                    const itemCount = item.count || 1;
                    const favoriteCount = favoriteItem.count || 1;
                    const maxStack = this.maxStackSize[item.type];
                    const spaceLeft = maxStack - favoriteCount;
                    const amountToStack = Math.min(spaceLeft, itemCount);

                    favoriteItem.count = favoriteCount + amountToStack;

                    if (itemCount > amountToStack) {
                        item.count = itemCount - amountToStack;
                    } else {
                        this.inventory[inventoryIndex] = null;
                    }

                    this.renderInventory();
                    if (Game && Game.ui) {
                        Game.ui.showLootNotification(`${item.name} x${amountToStack} stacked in favorites!`);
                    }
                    return;
                }
            }
        }

        const emptyFavoriteSlot = this.favorites.findIndex(slot => slot === null);
        if (emptyFavoriteSlot === -1) {
            if (Game && Game.ui) {
                Game.ui.showLootNotification("Favorites inventory is full! (48 slots)");
            }
            return;
        }

        // Create a deep copy to preserve all properties including count
        this.favorites[emptyFavoriteSlot] = JSON.parse(JSON.stringify(item));
        this.inventory[inventoryIndex] = null;

        this.renderInventory();
        if (Game && Game.ui) {
            const count = item.count || 1;
            const countText = count > 1 ? ` x${count}` : '';
            Game.ui.showLootNotification(`${item.name}${countText} moved to favorites!`);
        }
    }

    removeFromFavorites(index) {
        const item = this.favorites[index];
        if (!item) return;

        // Try to move back to regular inventory
        const emptySlot = this.findEmptyInventorySlot(item);
        if (emptySlot === -1) {
            if (Game && Game.ui) {
                Game.ui.showLootNotification("Inventory is full! Cannot remove from favorites.");
            }
            return;
        }

        this.inventory[emptySlot] = item;
        this.favorites[index] = null;

        this.renderInventory();
        if (Game && Game.ui) {
            Game.ui.showLootNotification(`${item.name} removed from favorites!`);
        }
    }

    // === EXP POTION CONTEXT MENU ===

    showExpPotionMenu(event) {
        // Remove any existing menu
        this.hideExpPotionMenu();

        const menu = document.createElement('div');
        menu.id = 'exp-potion-context-menu';
        menu.style.cssText = `
            position: fixed;
            background: rgba(0, 0, 0, 0.95);
            border: 2px solid var(--gold);
            border-radius: 12px;
            padding: 8px;
            z-index: 10001;
            backdrop-filter: blur(15px);
            min-width: 250px;
            max-height: 400px;
            overflow-y: auto;
        `;

        // Add title
        const title = document.createElement('div');
        title.style.cssText = `
            color: var(--gold);
            font-weight: bold;
            text-align: center;
            margin-bottom: 8px;
            font-size: 1.1rem;
        `;
        title.textContent = '⭐ Experience Potions ⭐';
        menu.appendChild(title);

        // Create buttons for each EXP potion option
        EXP_POTION_OPTIONS.forEach((potionOption) => {
            const button = document.createElement('button');
            const canBuy = Game.player.level >= potionOption.level && Game.player.gold >= potionOption.price;

            button.style.cssText = `
                width: 100%;
                background: ${canBuy ? 'var(--glass-bg)' : 'rgba(100, 100, 100, 0.3)'};
                color: ${canBuy ? 'var(--text-primary)' : '#888'};
                border: 1px solid ${canBuy ? 'var(--border-color)' : '#555'};
                border-radius: 6px;
                padding: 8px 12px;
                margin: 2px 0;
                cursor: ${canBuy ? 'pointer' : 'not-allowed'};
                transition: all 0.2s ease;
                font-size: 0.9rem;
                text-align: left;
                display: flex;
                justify-content: space-between;
                align-items: center;
            `;

            const leftSide = document.createElement('div');
            leftSide.style.cssText = `
                display: flex;
                flex-direction: column;
                align-items: flex-start;
            `;

            const potionName = document.createElement('div');
            potionName.textContent = potionOption.name;
            potionName.style.fontWeight = 'bold';

            const potionDesc = document.createElement('div');
            potionDesc.textContent = `${potionOption.expMultiplier}x EXP for 30 minutes`;
            potionDesc.style.cssText = `
                font-size: 0.8rem;
                color: ${canBuy ? '#b0b3c1' : '#666'};
                margin-top: 2px;
            `;

            leftSide.appendChild(potionName);
            leftSide.appendChild(potionDesc);

            const rightSide = document.createElement('div');
            rightSide.style.cssText = `
                text-align: right;
                color: var(--gold);
                font-weight: bold;
            `;
            rightSide.textContent = `${potionOption.price.toLocaleString()} G`;

            button.appendChild(leftSide);
            button.appendChild(rightSide);

            if (canBuy) {
                button.onmouseover = () => {
                    button.style.background = 'var(--blue)';
                    button.style.borderColor = 'var(--blue)';
                };
                button.onmouseout = () => {
                    button.style.background = 'var(--glass-bg)';
                    button.style.borderColor = 'var(--border-color)';
                };
                button.onclick = () => {
                    this.buyExpPotion(potionOption);
                    this.hideExpPotionMenu();
                };
            }

            menu.appendChild(button);
        });

        // Add close button
        const closeButton = document.createElement('button');
        closeButton.textContent = '❌ Close';
        closeButton.style.cssText = `
            width: 100%;
            background: rgba(255, 100, 100, 0.2);
            color: var(--text-primary);
            border: 1px solid #ff6b6b;
            border-radius: 6px;
            padding: 8px 12px;
            margin-top: 8px;
            cursor: pointer;
            transition: all 0.2s ease;
            font-size: 0.9rem;
        `;
        closeButton.onmouseover = () => {
            closeButton.style.background = 'rgba(255, 100, 100, 0.4)';
        };
        closeButton.onmouseout = () => {
            closeButton.style.background = 'rgba(255, 100, 100, 0.2)';
        };
        closeButton.onclick = () => this.hideExpPotionMenu();
        menu.appendChild(closeButton);

        document.body.appendChild(menu);

        // Position menu near the clicked element
        if (event && event.target) {
            const rect = event.target.getBoundingClientRect();
            menu.style.left = (rect.right + 10) + 'px';
            menu.style.top = rect.top + 'px';

            // Adjust if menu goes off screen
            const menuRect = menu.getBoundingClientRect();
            if (menuRect.right > window.innerWidth) {
                menu.style.left = (rect.left - menuRect.width - 10) + 'px';
            }
            if (menuRect.bottom > window.innerHeight) {
                menu.style.top = (rect.bottom - menuRect.height) + 'px';
            }
        } else {
            // Center the menu if no event provided
            menu.style.left = '50%';
            menu.style.top = '50%';
            menu.style.transform = 'translate(-50%, -50%)';
        }

        // Close menu when clicking outside
        setTimeout(() => {
            document.addEventListener('click', this.hideExpPotionMenu.bind(this), { once: true });
        }, 100);
    }

    hideExpPotionMenu() {
        const menu = document.getElementById('exp-potion-context-menu');
        if (menu) {
            menu.remove();
        }
    }

    buyExpPotion(potionOption) {
        if (Game.player.gold >= potionOption.price) {
            if (Game.player.level < potionOption.level) {
                if (Game && Game.ui) {
                    Game.ui.showLootNotification(`Requires level ${potionOption.level}!`);
                }
                return false;
            }

            // Create the EXP potion item
            const item = this.generateItem(potionOption.type, potionOption.rarity, 1);
            if (item) {
                item.stats = { exp_boost: potionOption.expMultiplier };
                item.name = potionOption.name;

                if (this.addToInventory(item, 1)) {
                    Game.player.state.gold -= potionOption.price;
                    this.renderInventory();
                    if (Game && Game.ui) {
                        Game.ui.updatePlayerDisplay();
                        Game.ui.showLootNotification(`Bought ${potionOption.name}!`);
                        // Update shop availability to reflect new gold amount
                        Game.ui.updateShopAvailability();
                    }
                    return true;
                } else {
                    return false;
                }
            }
        } else {
            if (Game && Game.ui) {
                Game.ui.showLootNotification("Not enough gold!");
            }
            return false;
        }
    }
}