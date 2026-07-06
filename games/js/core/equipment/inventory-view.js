// inventory-view.js - Inventory grid, pagination, and item icon rendering.

Object.assign(window.EquipmentManager.prototype, {
    createInventoryGrid() {
        const grid = document.getElementById('inventory-grid');
        if (!grid) return;

        grid.innerHTML = '';
        this.createPageNavigation();

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

            slot.oncontextmenu = (e) => {
                e.preventDefault();
                const item = this.inventory[actualIndex];
                if (item && item.slot) {
                    this.showEquipmentMenu(actualIndex, item);
                }
            };
            grid.appendChild(slot);
        }

        this.renderCurrentPage();
    },

    createPageNavigation() {
        const nav = document.querySelector('.inventory-nav');
        if (!nav) return;

        nav.innerHTML = '';

        for (let i = 0; i < this.maxPages; i++) {
            const btn = document.createElement('button');
            btn.className = `page-btn ${i === this.currentPage ? 'active' : ''}`;
            btn.dataset.page = i;

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

        this.updatePageIndicators();
    },

    switchPage(pageNumber) {
        if (pageNumber < 0 || pageNumber >= this.maxPages) return;

        this.currentPage = pageNumber;

        document.querySelectorAll('.page-btn').forEach((btn, index) => {
            btn.classList.toggle('active', index === pageNumber);
        });

        this.createInventoryGrid();

        if (Game && Game.ui) {
            Game.ui.showLootNotification(`Switched to page ${pageNumber + 1}`);
        }
    },

    renderCurrentPage() {
        const grid = document.getElementById('inventory-grid');
        if (!grid) return;

        const isFavoritesPage = this.currentPage === 5;

        if (isFavoritesPage) {
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

                slot.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (item) {
                        this.selectFavoriteItem(slotIndex, e);
                    }
                };
            });
        } else {
            const slots = grid.querySelectorAll('.inventory-slot');

            slots.forEach((slot, slotIndex) => {
                const actualIndex = (this.currentPage * this.slotsPerPage) + slotIndex;
                slot.innerHTML = '';

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

                    this.renderItemIcon(item, itemDiv);

                    itemDiv.draggable = true;
                    itemDiv.ondragstart = (e) => this.dragStart(e, actualIndex);

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
    },

    renderInventory() {
        this.renderCurrentPage();
        this.updatePageIndicators();
    },

    updatePageIndicators() {
        const pageButtons = document.querySelectorAll('.page-btn');

        pageButtons.forEach((btn, pageIndex) => {
            if (pageIndex === this.maxPages - 1) {
                const favoritesItemCount = this.favorites.filter(item => item !== null).length;
                const hasFavorites = favoritesItemCount > 0;

                btn.classList.toggle('has-items', hasFavorites);

                if (pageIndex === this.currentPage) {
                    btn.title = `Favorites - Current (${favoritesItemCount}/48 items)`;
                } else if (hasFavorites) {
                    btn.title = `Favorites - ${favoritesItemCount}/48 protected items`;
                } else {
                    btn.title = 'Favorites - Empty (48 slots available)';
                }
            } else {
                const startIndex = pageIndex * this.slotsPerPage;
                const endIndex = startIndex + this.slotsPerPage;
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
    },

    findBestPageForItem(item) {
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

        const currentPageStart = this.currentPage * this.slotsPerPage;
        const currentPageEnd = currentPageStart + this.slotsPerPage;

        if (this.inventory.slice(currentPageStart, currentPageEnd).some(slot => slot === null)) {
            return this.currentPage;
        }

        for (let page = 0; page < this.maxPages; page++) {
            if (page === this.currentPage) continue;

            const startIndex = page * this.slotsPerPage;
            const endIndex = startIndex + this.slotsPerPage;

            if (this.inventory.slice(startIndex, endIndex).some(slot => slot === null)) {
                return page;
            }
        }

        return -1;
    },

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
    },

    handlePageNavigation(e) {
        if (e.ctrlKey && e.key >= '1' && e.key <= '5') {
            e.preventDefault();
            const pageIndex = parseInt(e.key) - 1;
            this.switchPage(pageIndex);
            return true;
        }
        return false;
    },

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

            img.onerror = () => {
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
            container.textContent = item.icon;
            container.style.fontSize = 'clamp(1.2rem, 3vw, 1.8rem)';
        }
    }
});
