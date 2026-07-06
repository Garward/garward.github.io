// boss-drops.js - Special boss item drop handlers.

function handleMvpExpPotionDrop(mvpName) {
    const mvpConfig = window.MVP_EXP_POTION_DROPS[mvpName];
    if (!mvpConfig || !Game.equipment) return null;

    if (Math.random() > mvpConfig.dropChance) return null;

    const totalWeight = mvpConfig.weights.reduce((sum, weight) => sum + weight, 0);
    let randomValue = Math.random() * totalWeight;

    for (let i = 0; i < mvpConfig.potionTypes.length; i++) {
        randomValue -= mvpConfig.weights[i];
        if (randomValue <= 0) {
            const potionName = mvpConfig.potionTypes[i];
            const shopItem = window.EXP_POTION_OPTIONS.find(item => item.name === potionName);

            if (shopItem) {
                const potion = Game.equipment.generateItem(shopItem.type, shopItem.rarity, 1);
                if (potion) {
                    potion.stats = { exp_boost: shopItem.expMultiplier };
                    potion.name = shopItem.name;

                    if (Game.equipment.addToInventory(potion, 1)) {
                        Game.ui.showLootNotification(`🎉 BOSS DROP: ${potionName}!`, 3000);
                        return potion;
                    }
                }
            }
            break;
        }
    }

    return null;
}

function handleMvpAccessoryDrop(mvpName) {
    const mvpConfig = window.MVP_ACCESSORY_DROPS[mvpName];
    if (!mvpConfig || !Game.equipment) return null;

    if (Math.random() > mvpConfig.dropChance) return null;

    const accessoryType = mvpConfig.accessoryTypes[Math.floor(Math.random() * mvpConfig.accessoryTypes.length)];
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

    const accessory = Game.equipment.generateItem(accessoryType, selectedRarity, 120);

    if (accessory) {
        if (accessory.stats) {
            Object.keys(accessory.stats).forEach(stat => {
                accessory.stats[stat] = Math.floor(accessory.stats[stat] * mvpConfig.statMultiplier);
            });
        }

        accessory.name = `${mvpName}'s ${accessory.name}`;

        if (Game.equipment.addToInventory(accessory, 1)) {
            Game.ui.showLootNotification(`🎉 BOSS DROP: ${accessory.name}!`, 3000);
            return accessory;
        }
    }

    return null;
}

window.handleMvpExpPotionDrop = handleMvpExpPotionDrop;
window.handleMvpAccessoryDrop = handleMvpAccessoryDrop;
