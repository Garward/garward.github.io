// menu.js - Bottom navigation and menu sheet manager for the Gloamreach UI
//
// The main screen only shows the combat loop; secondary systems (character,
// inventory, skills, shop) live in menu sheets that are toggled from the
// bottom navigation bar. Achievements and the character selector reuse their
// existing modal implementations.

const MenuManager = {
    currentMenuId: null,

    overlay() {
        return document.getElementById('menu-overlay');
    },

    open(menuId) {
        if (this.currentMenuId === menuId) {
            this.close();
            return;
        }

        this.close();

        const sheet = document.getElementById(menuId);
        if (!sheet) return;

        sheet.classList.add('open');
        const overlay = this.overlay();
        if (overlay) overlay.classList.add('open');

        const navBtn = document.querySelector(`.nav-btn[data-menu="${menuId}"]`);
        if (navBtn) {
            navBtn.classList.add('active');
            navBtn.setAttribute('aria-expanded', 'true');
        }

        this.currentMenuId = menuId;

        // Refresh dynamic content when a menu opens so it is never stale.
        try {
            if (typeof Game !== 'undefined' && Game.ui) {
                if (menuId === 'menu-skills' && Game.ui.renderSkills) {
                    Game.ui.renderSkills();
                } else if (menuId === 'menu-shop' && Game.ui.renderShop) {
                    Game.ui.renderShop();
                } else if (menuId === 'menu-inventory' && Game.equipment) {
                    Game.equipment.renderInventory();
                } else if (menuId === 'menu-character') {
                    Game.ui.updatePlayerDisplay();
                    if (Game.equipment) Game.equipment.renderEquipment();
                }
            }
        } catch (e) {
            console.warn('Menu refresh failed:', e);
        }
    },

    close() {
        if (this.currentMenuId) {
            const sheet = document.getElementById(this.currentMenuId);
            if (sheet) sheet.classList.remove('open');

            const navBtn = document.querySelector(`.nav-btn[data-menu="${this.currentMenuId}"]`);
            if (navBtn) {
                navBtn.classList.remove('active');
                navBtn.setAttribute('aria-expanded', 'false');
            }
        }

        const overlay = this.overlay();
        if (overlay) overlay.classList.remove('open');
        this.currentMenuId = null;
    },

    isOpen() {
        return this.currentMenuId !== null;
    },

    initialize() {
        // Menu toggle buttons
        document.querySelectorAll('.nav-btn[data-menu]').forEach(btn => {
            btn.setAttribute('aria-expanded', 'false');
            btn.addEventListener('click', () => this.open(btn.dataset.menu));
        });

        // Action buttons (reuse existing modals)
        document.querySelectorAll('.nav-btn[data-action]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.close();
                const action = btn.dataset.action;
                if (action === 'achievements' && typeof showAchievementsPanel === 'function') {
                    showAchievementsPanel();
                } else if (action === 'characters' && typeof Game !== 'undefined' &&
                           Game.characterManager) {
                    Game.characterManager.showCharacterSelector();
                }
            });
        });

        // Close buttons inside sheets
        document.querySelectorAll('[data-close-menu]').forEach(btn => {
            btn.addEventListener('click', () => this.close());
        });

        // Clicking the dimmed backdrop closes the menu
        const overlay = this.overlay();
        if (overlay) {
            overlay.addEventListener('click', () => this.close());
        }

        // Escape closes the current menu
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen()) {
                this.close();
            }
        });
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => MenuManager.initialize());
} else {
    MenuManager.initialize();
}

window.MenuManager = MenuManager;
