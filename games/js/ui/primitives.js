// primitives.js - Small reusable UI builders for Gloamreach menus and modals
(function () {
    function normalizeChildren(children) {
        if (children == null) return [];
        return Array.isArray(children) ? children : [children];
    }

    function appendChildren(parent, children) {
        normalizeChildren(children).forEach(child => {
            if (child == null) return;
            parent.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
        });
        return parent;
    }

    function createElement(tag, options = {}, children = []) {
        const element = document.createElement(tag);
        const {
            className,
            text,
            html,
            dataset,
            attributes,
            events,
            title,
            id,
            disabled
        } = options;

        if (id) element.id = id;
        if (className) element.className = className;
        if (title) element.title = title;
        if (disabled) element.disabled = true;
        if (text != null) element.textContent = text;
        if (html != null) element.innerHTML = html;

        if (dataset) {
            Object.entries(dataset).forEach(([key, value]) => {
                element.dataset[key] = value;
            });
        }

        if (attributes) {
            Object.entries(attributes).forEach(([key, value]) => {
                if (value == null) return;
                element.setAttribute(key, value);
            });
        }

        if (events) {
            Object.entries(events).forEach(([key, handler]) => {
                element.addEventListener(key, handler);
            });
        }

        return appendChildren(element, children);
    }

    function createButton({
        label = '',
        icon = '',
        variant = 'secondary',
        size = 'md',
        className = '',
        title = '',
        id = '',
        ariaLabel = '',
        disabled = false,
        type = 'button',
        onClick = null,
        dataset = null
    } = {}) {
        const button = createElement('button', {
            id,
            className: `ui-button ui-button-${variant} ui-button-${size} ${className}`.trim(),
            title,
            disabled,
            dataset,
            attributes: {
                type,
                'aria-label': ariaLabel || null
            }
        });

        if (icon) {
            button.appendChild(createElement('span', {
                className: 'ui-button-glyph',
                text: icon,
                attributes: { 'aria-hidden': 'true' }
            }));
        }

        if (label) {
            button.appendChild(createElement('span', {
                className: 'ui-button-label',
                text: label
            }));
        }

        if (onClick) button.addEventListener('click', onClick);
        return button;
    }

    function createDialog({
        id = '',
        title = '',
        icon = '',
        size = 'md',
        className = '',
        closeLabel = 'Close',
        onClose = null,
        content = null
    } = {}) {
        const overlay = createElement('div', {
            id,
            className: `modal ui-modal ${className}`.trim(),
            attributes: {
                role: 'dialog',
                'aria-modal': 'true',
                'aria-label': title || null
            }
        });

        const dialog = createElement('div', {
            className: `modal-content ui-dialog ui-dialog-${size}`
        });

        const close = () => {
            overlay.remove();
            if (onClose) onClose();
        };

        const header = createElement('div', { className: 'ui-dialog-header' }, [
            createElement('h2', { text: `${icon ? `${icon} ` : ''}${title}` }),
            createButton({
                icon: '✕',
                variant: 'ghost',
                size: 'icon',
                className: 'ui-dialog-close',
                ariaLabel: closeLabel,
                title: closeLabel,
                onClick: close
            })
        ]);

        const body = createElement('div', { className: 'ui-dialog-body' });
        appendChildren(body, content);

        dialog.appendChild(header);
        dialog.appendChild(body);
        overlay.appendChild(dialog);
        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) close();
        });

        return { overlay, dialog, body, close };
    }

    function createCard({
        className = '',
        selected = false,
        disabled = false,
        role = 'button',
        tabIndex = 0,
        onClick = null,
        ariaLabel = ''
    } = {}, children = []) {
        const card = createElement('div', {
            className: `ui-card ${selected ? 'is-selected' : ''} ${disabled ? 'is-disabled' : ''} ${className}`.trim(),
            attributes: {
                role,
                tabindex: disabled ? -1 : tabIndex,
                'aria-label': ariaLabel || null,
                'aria-current': selected ? 'true' : null
            }
        }, children);

        if (onClick && !disabled) {
            card.addEventListener('click', onClick);
            card.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    onClick(event);
                }
            });
        }

        return card;
    }

    function setActiveButton(buttons, activeButton) {
        buttons.forEach(button => {
            const isActive = button === activeButton;
            button.classList.toggle('active', isActive);
            button.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
    }

    window.UIPrimitives = {
        appendChildren,
        createButton,
        createCard,
        createDialog,
        createElement,
        setActiveButton
    };
})();
