// upgrades.js - Equipment upgrade slot actions, rendering, and upgrade math.

Object.assign(window.EquipmentManager.prototype, {
    moveToUpgradeSlot(index) {
        const item = this.inventory[index];
        if (!item || !this.canUpgradeItem(item)) return;

        this.inventory[index] = null;
        this.upgradeItem = item;
        this.upgradeSlot = index;
        this.upgradeFromEquipped = false;

        this.renderUpgradeSlot();
        this.renderInventory();

        Game.ui.showLootNotification(`${item.name} moved to upgrade slot!`);
    },

    moveEquippedToUpgradeSlot(slot, item) {
        if (!item || !this.canUpgradeItem(item)) return;

        Game.player.state.equipped[slot] = null;
        this.upgradeItem = item;
        this.upgradeSlot = slot;
        this.upgradeFromEquipped = true;

        Game.player.calculateStats();

        this.renderUpgradeSlot();
        this.renderEquipment();
        Game.ui.updatePlayerDisplay();

        Game.ui.showLootNotification(`${item.name} moved to upgrade slot!`);
    },

    showUpgradeSlotMenu(event) {
        event.preventDefault();
        event.stopPropagation();

        if (!this.upgradeItem) return;

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

        const buttons = [
            {
                text: '📦 To Inventory',
                action: () => {
                    this.moveUpgradeItemToInventory();
                    this.hideEquipmentMenu();
                }
            }
        ];

        if (this.upgradeItem.slot) {
            buttons.push({
                text: '⚔️ Equip',
                action: () => {
                    this.equipUpgradeItem();
                    this.hideEquipmentMenu();
                }
            });
        }

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

        const rect = event.target.getBoundingClientRect();
        menu.style.left = (rect.right + 10) + 'px';
        menu.style.top = rect.top + 'px';

        const menuRect = menu.getBoundingClientRect();
        if (menuRect.right > window.innerWidth) {
            menu.style.left = (rect.left - menuRect.width - 10) + 'px';
        }
        if (menuRect.bottom > window.innerHeight) {
            menu.style.top = (rect.bottom - menuRect.height) + 'px';
        }

        setTimeout(() => {
            document.addEventListener('click', this.hideEquipmentMenu.bind(this), { once: true });
        }, 100);
    },

    moveUpgradeItemToInventory() {
        if (!this.upgradeItem) return;

        const emptySlot = this.findEmptyInventorySlot(this.upgradeItem);
        if (emptySlot === -1) {
            Game.ui.showLootNotification("Inventory is full!");
            return;
        }

        this.inventory[emptySlot] = this.upgradeItem;
        this.upgradeItem = null;
        this.upgradeSlot = null;
        this.upgradeFromEquipped = false;

        this.renderUpgradeSlot();
        this.renderInventory();

        Game.ui.showLootNotification("Item moved to inventory!");
    },

    equipUpgradeItem() {
        if (!this.upgradeItem || !this.upgradeItem.slot) return;

        if (Game.player.level < this.upgradeItem.level) {
            Game.ui.showLootNotification(`Need level ${this.upgradeItem.level} to equip this item!`);
            return;
        }

        const currentItem = Game.player.state.equipped[this.upgradeItem.slot];
        if (currentItem) {
            const emptySlot = this.findEmptyInventorySlot(currentItem);
            if (emptySlot === -1) {
                Game.ui.showLootNotification("Inventory is full!");
                return;
            }
            this.inventory[emptySlot] = currentItem;
        }

        Game.player.state.equipped[this.upgradeItem.slot] = this.upgradeItem;
        this.upgradeItem = null;
        this.upgradeSlot = null;
        this.upgradeFromEquipped = false;

        Game.player.calculateStats();
        this.renderUpgradeSlot();
        this.renderInventory();
        this.renderEquipment();
        Game.ui.updatePlayerDisplay();

        Game.ui.showLootNotification("Item equipped!");
    },

    dropUpgradeItem(event) {
        event.preventDefault();
        const slot = event.target.closest('.upgrade-slot');

        if (this.draggedItem && this.canUpgradeItem(this.draggedItem)) {
            const item = this.draggedItem;

            if (this.draggedFromSlot?.type === 'inventory') {
                this.inventory[this.draggedFromSlot.index] = null;
                this.upgradeSlot = this.draggedFromSlot.index;
                this.upgradeFromEquipped = false;
            } else if (this.draggedFromSlot?.type === 'equipped') {
                Game.player.state.equipped[this.draggedFromSlot.slot] = null;
                this.upgradeSlot = this.draggedFromSlot.slot;
                this.upgradeFromEquipped = true;
                Game.player.calculateStats();
                this.renderEquipment();
            }

            this.upgradeItem = this.draggedItem;

            this.renderUpgradeSlot();
            this.renderInventory();

            Game.ui.showLootNotification(`${item.name} ready for upgrade!`);
        }

        this.draggedItem = null;
        this.draggedFromSlot = null;
        if (slot) {
            slot.classList.remove('drag-over');
        }
    },

    canUpgradeItem(item) {
        const equipmentTypes = ['helmet', 'chestplate', 'leggings', 'boots', 'sword', 'shield', 'ring', 'necklace'];
        return equipmentTypes.includes(item.type) && (!item.upgradeLevel || item.upgradeLevel < 15);
    },

    renderUpgradeSlot() {
        const slot = document.getElementById('upgrade-slot');
        const info = document.getElementById('upgrade-info');
        const button = document.getElementById('upgrade-button');

        if (!slot || !info || !button) return;

        if (this.upgradeItem) {
            const itemElement = document.createElement('div');
            itemElement.className = `item ${this.upgradeItem.rarity}`;
            this.renderItemIcon(this.upgradeItem, itemElement);
            itemElement.addEventListener('click', (e) => this.showUpgradeSlotMenu(e));

            slot.innerHTML = '';
            slot.appendChild(itemElement);
            slot.classList.add('filled');

            const currentLevel = this.upgradeItem.upgradeLevel || 0;
            const maxLevel = 15;
            const nextLevel = currentLevel + 1;
            const currentStats = this.getItemStats(this.upgradeItem);

            if (currentLevel >= maxLevel) {
                document.getElementById('upgrade-stats').innerHTML = `
                    <div style="color: var(--text-primary);">+${currentLevel} Max Level</div>
                    <div style="color: var(--blue);">Current: ${currentStats}</div>
                `;

                document.getElementById('upgrade-cost').innerHTML = `
                    <div>Fully upgraded</div>
                `;

                document.getElementById('upgrade-chance').innerHTML = `
                    <div>No further upgrades available</div>
                `;

                info.style.display = 'block';
                button.disabled = true;
                return;
            }

            const cost = this.getUpgradeCost(currentLevel);
            const chance = this.getUpgradeChance(currentLevel);
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
            slot.innerHTML = '<div class="slot-label">Drop Equipment Here</div>';
            slot.classList.remove('filled');
            info.style.display = 'none';
            button.disabled = true;
        }
    },

    getUpgradeCost(currentLevel) {
        return GloamFormula.getUpgradeCost(currentLevel);
    },

    getUpgradeChance(currentLevel) {
        return GloamFormula.getUpgradeChance(currentLevel);
    },

    getItemStats(item) {
        if (!item.stats) return "No stats";
        const statEntries = Object.entries(item.stats);
        return statEntries.map(([stat, value]) => {
            if (window.ACCESSORY_STATS[stat]) {
                const config = window.ACCESSORY_STATS[stat];
                if (stat === 'expGain') {
                    return `${config.name}: +${value}%`;
                }
                return `${config.name}: ${value}${config.suffix || ''}`;
            }

            const displayStat = stat === 'maxHp' ? 'MAX HP' :
                               stat === 'maxMp' ? 'MAX MP' :
                               stat.toUpperCase();
            return `${displayStat}: ${value}`;
        }).join(', ');
    },

    getUpgradedStats(item) {
        if (!item.stats) return "No stats";
        const upgradeLevel = item.upgradeLevel || 0;
        const nextLevel = upgradeLevel + 1;
        const baseStats = item.baseStats || item.stats;

        const nextStats = GloamFormula.calculateUpgradedStats(baseStats, nextLevel);
        return Object.entries(nextStats).map(([stat, newValue]) => {
            const displayStat = stat === 'maxHp' ? 'MAX HP' : stat.toUpperCase();
            return `${displayStat}: ${newValue}`;
        }).join(', ');
    },

    upgradeEquipment() {
        if (!this.upgradeItem) return;

        const currentLevel = this.upgradeItem.upgradeLevel || 0;
        if (currentLevel >= 15) {
            Game.ui.showLootNotification(`${this.upgradeItem.name} is already fully upgraded!`);
            this.renderUpgradeSlot();
            return;
        }

        const cost = this.getUpgradeCost(currentLevel);
        const chance = this.getUpgradeChance(currentLevel);

        if (Game.player.state.gold < cost) {
            Game.ui.showLootNotification("Not enough gold for upgrade!");
            return;
        }

        Game.player.state.gold -= cost;

        const success = Math.random() * 100 < chance;

        if (success) {
            this.upgradeItem.upgradeLevel = currentLevel + 1;
            this.applyUpgradeStats(this.upgradeItem);

            const baseName = this.upgradeItem.name.replace(/ \+\d+$/, '');
            this.upgradeItem.name = `${baseName} +${this.upgradeItem.upgradeLevel}`;

            const slot = document.getElementById('upgrade-slot');
            slot.classList.add('upgrade-success');
            setTimeout(() => slot.classList.remove('upgrade-success'), 600);

            if (Game.achievements) {
                Game.achievements.onItemUpgraded(this.upgradeItem.upgradeLevel);
            }

            Game.ui.showLootNotification(`✅ Upgrade successful! ${this.upgradeItem.name}`);
        } else {
            Game.ui.showLootNotification(`💥 Upgrade failed! ${this.upgradeItem.name} remains unchanged.`);

            const slot = document.getElementById('upgrade-slot');
            slot.classList.add('upgrade-fail');
            setTimeout(() => slot.classList.remove('upgrade-fail'), 600);
        }

        this.renderUpgradeSlot();
        this.renderInventory();
        this.renderEquipment();
        Game.ui.updatePlayerDisplay();
    },

    applyUpgradeStats(item) {
        if (!item.stats) return;

        if (!item.baseStats) {
            const currentLevel = item.upgradeLevel || 0;
            if (currentLevel > 0) {
                const currentMultiplier = GloamFormula.calculateUpgradeMultiplier(currentLevel - 1);
                item.baseStats = {};
                Object.keys(item.stats).forEach(stat => {
                    item.baseStats[stat] = Math.floor(item.stats[stat] / currentMultiplier);
                });
            } else {
                item.baseStats = { ...item.stats };
            }
        }

        const upgradeLevel = item.upgradeLevel || 0;
        item.stats = GloamFormula.calculateUpgradedStats(item.baseStats, upgradeLevel);
    }
});
