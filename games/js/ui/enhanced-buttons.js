// enhanced-buttons.js - Enhanced header buttons with improved styling and functionality

class EnhancedButtons {
    constructor() {
        this.buttons = [];
        this.initialized = false;
    }

    initialize() {
        if (this.initialized) return;
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.createButtons());
        } else {
            this.createButtons();
        }
        
        this.initialized = true;
    }

    createButtons() {
        const container = document.getElementById('header-buttons');
        if (!container) {
            console.error('Header buttons container not found');
            return;
        }

        // Prevent multiple initialization
        if (container.dataset.initialized === 'true') {
            console.log('✅ Enhanced buttons already initialized');
            return;
        }

        // Clear existing buttons
        container.innerHTML = '';

        // Create achievements button
        const achievementsBtn = this.createButton({
            id: 'achievements-btn',
            icon: '🏆',
            text: 'Achievements',
            className: 'achievements-btn',
            onClick: () => this.handleAchievementsClick(),
            tooltip: 'View your achievements and progress'
        });

        // Create characters button
        const charactersBtn = this.createButton({
            id: 'characters-btn',
            icon: '👥',
            text: 'Characters',
            className: 'characters-btn',
            onClick: () => this.handleCharactersClick(),
            tooltip: 'Switch between characters'
        });

        // Add buttons to container
        container.appendChild(achievementsBtn);
        container.appendChild(charactersBtn);

        // Store button references
        this.buttons = [achievementsBtn, charactersBtn];

        // Mark as initialized
        container.dataset.initialized = 'true';

        console.log('✨ Enhanced header buttons created successfully');
    }

    createButton(config) {
        const button = document.createElement('button');
        button.id = config.id;
        button.className = `enhanced-header-btn ${config.className}`;
        button.setAttribute('aria-label', config.tooltip);
        button.title = config.tooltip;

        // Create icon element
        const iconElement = document.createElement('span');
        iconElement.className = 'btn-icon';
        iconElement.textContent = config.icon;

        // Create text element
        const textElement = document.createElement('span');
        textElement.className = 'btn-text';
        textElement.textContent = config.text;

        // Assemble button
        button.appendChild(iconElement);
        button.appendChild(textElement);

        // Add click handler with enhanced feedback
        button.addEventListener('click', (e) => {
            e.preventDefault();
            this.addClickEffect(button);
            config.onClick();
        });

        // Add enhanced hover effects
        this.addHoverEffects(button);

        return button;
    }

    addClickEffect(button) {
        // Add ripple effect
        const rect = button.getBoundingClientRect();
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            pointer-events: none;
            transform: scale(0);
            animation: rippleEffect 0.6s linear;
            left: 50%;
            top: 50%;
            width: 20px;
            height: 20px;
            margin-left: -10px;
            margin-top: -10px;
        `;

        // Add ripple animation CSS if not exists
        if (!document.getElementById('ripple-styles')) {
            const style = document.createElement('style');
            style.id = 'ripple-styles';
            style.textContent = `
                @keyframes rippleEffect {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        button.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);

        // Add button press animation
        button.style.transform = 'translateY(0) scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
    }

    addHoverEffects(button) {
        // Removed sound effects - just use CSS hover effects
        // All hover styling is handled by CSS
    }


    handleAchievementsClick() {
        console.log('🏆 Achievements button clicked');
        
        // Add button-specific animation
        const btn = document.getElementById('achievements-btn');
        this.addSuccessAnimation(btn);

        // Call the original achievements function
        if (typeof showAchievementsPanel === 'function') {
            showAchievementsPanel();
        } else {
            console.error('showAchievementsPanel function not found');
        }
    }

    handleCharactersClick() {
        console.log('👥 Characters button clicked');
        
        // Add button-specific animation
        const btn = document.getElementById('characters-btn');
        this.addSuccessAnimation(btn);

        // Call the original character selector function
        if (typeof Game !== 'undefined' && Game.characterManager && typeof Game.characterManager.showCharacterSelector === 'function') {
            Game.characterManager.showCharacterSelector();
        } else {
            console.error('Game.characterManager.showCharacterSelector function not found');
        }
    }

    addSuccessAnimation(button) {
        const originalTransform = button.style.transform;
        
        // Create pulse effect
        button.style.animation = 'none';
        button.offsetHeight; // Trigger reflow
        button.style.animation = 'successPulse 0.5s ease-out';

        // Add CSS animation if not exists
        if (!document.getElementById('success-animation-styles')) {
            const style = document.createElement('style');
            style.id = 'success-animation-styles';
            style.textContent = `
                @keyframes successPulse {
                    0% { transform: scale(1); }
                    25% { transform: scale(1.1); box-shadow: 0 0 25px currentColor; }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); }
                }
            `;
            document.head.appendChild(style);
        }

        setTimeout(() => {
            button.style.animation = '';
            button.style.transform = originalTransform;
        }, 500);
    }

    updateButtonStates() {
        // Update button states based on game state
        const achievementsBtn = document.getElementById('achievements-btn');
        const charactersBtn = document.getElementById('characters-btn');

        if (achievementsBtn && typeof Game !== 'undefined' && Game.achievements) {
            // Show notification if there are new achievements
            const hasNewAchievements = this.checkForNewAchievements();
            if (hasNewAchievements) {
                this.addNotificationBadge(achievementsBtn);
            } else {
                this.removeNotificationBadge(achievementsBtn);
            }
        }

        if (charactersBtn && typeof Game !== 'undefined' && Game.player) {
            // Update character button with current character info
            const characterName = Game.player.state?.name || 'No Character';
            charactersBtn.title = `Switch Characters (Current: ${characterName})`;
        }
    }

    checkForNewAchievements() {
        // Check if there are recently unlocked achievements
        if (typeof Game === 'undefined' || !Game.achievements) return false;
        
        // This is a placeholder - implement based on your achievement system
        return false;
    }

    addNotificationBadge(button) {
        if (button.querySelector('.notification-badge')) return;

        const badge = document.createElement('div');
        badge.className = 'notification-badge';
        badge.style.cssText = `
            position: absolute;
            top: -5px;
            right: -5px;
            width: 12px;
            height: 12px;
            background: #ff4444;
            border-radius: 50%;
            border: 2px solid var(--primary-bg);
            animation: badgePulse 2s infinite;
        `;

        if (!document.getElementById('badge-animation-styles')) {
            const style = document.createElement('style');
            style.id = 'badge-animation-styles';
            style.textContent = `
                @keyframes badgePulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.2); opacity: 0.8; }
                }
            `;
            document.head.appendChild(style);
        }

        button.appendChild(badge);
    }

    removeNotificationBadge(button) {
        const badge = button.querySelector('.notification-badge');
        if (badge) {
            badge.remove();
        }
    }

    // Responsive utilities
    handleResize() {
        const isMobile = window.innerWidth <= 768;
        this.buttons.forEach(button => {
            const textElement = button.querySelector('.btn-text');
            if (textElement) {
                textElement.style.display = isMobile ? 'none' : 'inline';
            }
        });
    }

    // Initialize resize handler
    initializeResponsive() {
        window.addEventListener('resize', () => this.handleResize());
        this.handleResize(); // Initial call
    }
}

// Create global instance only if it doesn't exist
if (!window.enhancedButtons) {
    const enhancedButtons = new EnhancedButtons();
    
    // Auto-initialize when script loads
    enhancedButtons.initialize();
    
    // Set up periodic updates (only once)
    if (!window.enhancedButtonsUpdateInterval) {
        window.enhancedButtonsUpdateInterval = setInterval(() => {
            if (enhancedButtons.initialized) {
                enhancedButtons.updateButtonStates();
            }
        }, 5000);
    }
    
    // Initialize responsive handling
    document.addEventListener('DOMContentLoaded', () => {
        enhancedButtons.initializeResponsive();
    });
    
    // Export for global access
    window.enhancedButtons = enhancedButtons;
}