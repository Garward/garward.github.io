// tooltips.js - Shared tooltip positioning and lifecycle
class TooltipUI {
    initialize() {
        document.querySelectorAll('.custom-tooltip').forEach(tooltip => tooltip.remove());

        document.querySelectorAll('[data-tooltip], .item, .skill-item').forEach(element => {
            element.addEventListener('mouseenter', (event) => this.show(event));
            element.addEventListener('mouseleave', () => this.hide());
            element.addEventListener('mousemove', (event) => this.move(event));
        });
    }

    show(event) {
        const element = event.currentTarget;
        const tooltipContent = element.getAttribute('data-tooltip');

        if (element.classList.contains('item') && !tooltipContent) {
            return;
        }

        if (!tooltipContent) return;

        let tooltip = document.getElementById('custom-tooltip');
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.id = 'custom-tooltip';
            tooltip.className = 'custom-tooltip';
            document.body.appendChild(tooltip);
        }

        tooltip.innerHTML = tooltipContent;
        tooltip.style.display = 'block';
        this.move(event);
    }

    move(event) {
        const tooltip = document.getElementById('custom-tooltip');
        if (!tooltip || tooltip.style.display === 'none') return;

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const rect = tooltip.getBoundingClientRect();

        let left = event.clientX + 15;
        let top = event.clientY + 15;

        if (left + rect.width > viewportWidth) {
            left = event.clientX - rect.width - 15;
        }

        if (left < 0) {
            left = 10;
        }

        if (top + rect.height > viewportHeight) {
            top = event.clientY - rect.height - 15;
        }

        if (top < 0) {
            top = 10;
        }

        if (rect.width > viewportWidth - 20) {
            left = 10;
            tooltip.style.maxWidth = `${viewportWidth - 20}px`;
        }

        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
    }

    hide() {
        const tooltip = document.getElementById('custom-tooltip');
        if (tooltip) tooltip.style.display = 'none';
    }
}

window.TooltipUI = TooltipUI;
