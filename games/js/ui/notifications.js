// notifications.js - Toast and blocking message helpers
class NotificationUI {
    constructor(messageElement = null) {
        this.messageElement = messageElement || document.getElementById('message');
    }

    initialize() {
        if (document.getElementById('notification-container')) return;

        const container = document.createElement('div');
        container.id = 'notification-container';
        document.body.appendChild(container);
    }

    showMessage(text, duration = 2000) {
        if (!this.messageElement) return;

        this.messageElement.textContent = text;
        this.messageElement.style.display = 'block';

        setTimeout(() => {
            this.messageElement.style.display = 'none';
        }, duration);
    }

    showLootNotification(text) {
        const container = document.getElementById('notification-container');
        if (!container) return;

        const notification = document.createElement('div');
        notification.className = 'loot-notification';
        notification.textContent = text;

        container.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('visible');
        }, 50);

        setTimeout(() => {
            notification.classList.remove('visible');
            setTimeout(() => {
                if (container.contains(notification)) {
                    container.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

window.NotificationUI = NotificationUI;
