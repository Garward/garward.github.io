// hotbar.js - Skill hotbar rendering, persistence, keyboard, and picker UI
class HotbarUI {
    constructor(display) {
        this.display = display;
    }

    get config() {
        if (!this.display.hotbarConfig) {
            this.display.hotbarConfig = {
                slots: [null, null, null, null, null],
                locked: false
            };
        }
        return this.display.hotbarConfig;
    }

    render() {
        const hotbar = document.getElementById('skill-hotbar');
        if (!hotbar) return;

        hotbar.innerHTML = '';

        const lockBtn = document.createElement('div');
        lockBtn.className = `hotbar-lock-btn ${this.config.locked ? 'locked' : 'unlocked'}`;
        lockBtn.textContent = this.config.locked ? '🔒' : '🔓';
        lockBtn.title = this.config.locked ? 'Hotbar locked: drag editing disabled' : 'Hotbar unlocked: drag editing enabled';
        lockBtn.onclick = () => this.toggleLock();
        hotbar.appendChild(lockBtn);

        for (let i = 0; i < 5; i++) {
            hotbar.appendChild(this.createSlot(i));
        }
    }

    createSlot(index) {
        const slotDiv = document.createElement('div');
        slotDiv.className = 'hotbar-skill';
        slotDiv.dataset.slotIndex = index;

        const assignedSkill = this.config.slots[index];
        const skill = assignedSkill ? Game.skills.getCurrentSkills().find(s => s.id === assignedSkill) : null;

        if (skill && skill.currentLevel > 0) {
            this.renderSkillSlot(slotDiv, skill, index);
        } else {
            this.renderEmptySlot(slotDiv, index);
        }

        if (!this.config.locked) {
            slotDiv.ondrop = (event) => this.dropSkill(event, index);
            slotDiv.ondragover = (event) => this.allowSkillDrop(event);
            slotDiv.ondragleave = (event) => this.clearDropFeedback(event);

            if (skill && skill.currentLevel > 0) {
                slotDiv.draggable = true;
                slotDiv.ondragstart = (event) => this.dragSkill(event, index);
            }
        }

        return slotDiv;
    }

    renderSkillSlot(slotDiv, skill, index) {
        const onCooldown = skill.cooldown > 0;
        const mpCost = skill.mpCost ? skill.mpCost + (skill.currentLevel - 1) * 2 : 0;
        const canUse = mpCost === 0 || Game.player.mp >= mpCost;
        const battleActive = Game.combat && Game.combat.battleActive;

        if (onCooldown) slotDiv.classList.add('on-cooldown');
        if (!canUse && !onCooldown) slotDiv.classList.add('no-mp');
        if (!battleActive) slotDiv.classList.add('battle-inactive');

        slotDiv.innerHTML = `
            <div class="hotbar-skill-key">${index + 1}</div>
            <div class="hotbar-skill-icon">${skill.icon}</div>
            ${mpCost > 0 ? `<div class="hotbar-skill-mp">${mpCost}</div>` : ''}
            ${onCooldown ? `<div class="cooldown-overlay">${Math.ceil(skill.cooldown / 1000)}</div>` : ''}
        `;

        if (!onCooldown && canUse && battleActive) {
            slotDiv.onclick = () => Game.skills.useSkill(skill.id);
        } else if (!battleActive) {
            slotDiv.onclick = () => this.display.showMessage("Start battle first to use skills!");
        }

        slotDiv.setAttribute('data-tooltip', this.display.getSkillTooltip(skill));
        slotDiv.addEventListener('mouseenter', (event) => this.display.showTooltip(event));
        slotDiv.addEventListener('mouseleave', () => this.display.hideTooltip());
    }

    renderEmptySlot(slotDiv, index) {
        slotDiv.innerHTML = `
            <div class="hotbar-skill-key">${index + 1}</div>
            <div class="hotbar-empty-label">Empty</div>
        `;
        slotDiv.classList.add('empty');
        slotDiv.onclick = () => {
            if (this.config.locked) {
                this.display.showLootNotification("Unlock hotbar to assign a skill");
            } else {
                this.openSlotMenu(index);
            }
        };
    }

    toggleLock() {
        this.config.locked = !this.config.locked;
        this.saveConfig();
        this.render();
        this.display.showLootNotification(this.config.locked ? "Hotbar drag editing locked" : "Hotbar drag editing unlocked");
    }

    getAssignableSkills() {
        if (!Game.skills || !Game.skills.getCurrentSkills) return [];
        return Game.skills.getCurrentSkills()
            .filter(skill => skill.currentLevel > 0 && !skill.isPassive);
    }

    assignSkill(skillId, slotIndex) {
        if (slotIndex < 0 || slotIndex >= this.config.slots.length) return;

        const skill = this.getAssignableSkills().find(s => s.id === skillId);
        if (!skill) {
            this.display.showLootNotification("Learn an active skill first");
            return;
        }

        this.config.slots = this.config.slots.map((existing, index) =>
            existing === skillId && index !== slotIndex ? null : existing
        );
        this.config.slots[slotIndex] = skillId;
        this.saveConfig();
        this.render();
        this.display.renderSkills();
        this.closePicker();
        this.display.showLootNotification(`${skill.name} assigned to slot ${slotIndex + 1}`);
    }

    clearSlot(slotIndex) {
        if (slotIndex < 0 || slotIndex >= this.config.slots.length) return;

        this.config.slots[slotIndex] = null;
        this.saveConfig();
        this.render();
        this.display.renderSkills();
        this.closePicker();
        this.display.showLootNotification(`Cleared slot ${slotIndex + 1}`);
    }

    closePicker() {
        const existing = document.getElementById('skill-picker-modal');
        if (existing) existing.remove();
    }

    createPicker(title) {
        this.closePicker();

        const overlay = document.createElement('div');
        overlay.id = 'skill-picker-modal';
        overlay.className = 'skill-picker-overlay';

        const panel = UIPrimitives.createElement('div', { className: 'skill-picker-panel' });
        const header = UIPrimitives.createElement('div', { className: 'skill-picker-header' }, [
            UIPrimitives.createElement('h3', { text: title }),
            UIPrimitives.createButton({
                icon: '✕',
                variant: 'ghost',
                size: 'icon',
                id: 'skill-picker-close',
                ariaLabel: 'Close skill picker',
                title: 'Close skill picker',
                onClick: () => this.closePicker()
            })
        ]);
        const content = UIPrimitives.createElement('div', { id: 'skill-picker-content' });

        panel.appendChild(header);
        panel.appendChild(content);
        overlay.appendChild(panel);
        document.body.appendChild(overlay);

        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) this.closePicker();
        });

        return content;
    }

    openSkillAssignMenu(skillId) {
        const skill = this.getAssignableSkills().find(s => s.id === skillId);
        if (!skill) {
            this.display.showLootNotification("Learn an active skill first");
            return;
        }

        const content = this.createPicker(`Assign ${skill.name}`);
        const currentSlot = this.config.slots.findIndex(id => id === skillId);
        const slots = this.config.slots.map((assignedId, index) => {
            const assignedSkill = assignedId ? Game.skills.getCurrentSkills().find(s => s.id === assignedId) : null;
            const label = assignedSkill ? `Replace ${assignedSkill.name}` : 'Empty slot';
            return `
                <button type="button" class="skill-picker-option" data-slot="${index}">
                    <span class="skill-picker-slot-number">${index + 1}</span>
                    <span>${label}</span>
                </button>
            `;
        }).join('');

        content.innerHTML = `
            ${currentSlot >= 0 ? `<div class="skill-picker-note">Currently assigned to slot ${currentSlot + 1}.</div>` : ''}
            <div class="skill-picker-options">${slots}</div>
            ${currentSlot >= 0 ? `<button type="button" class="skill-picker-danger" data-clear="${currentSlot}">Clear current assignment</button>` : ''}
        `;

        content.querySelectorAll('[data-slot]').forEach(button => {
            button.onclick = () => this.assignSkill(skillId, Number(button.dataset.slot));
        });
        const clearButton = content.querySelector('[data-clear]');
        if (clearButton) {
            clearButton.onclick = () => this.clearSlot(Number(clearButton.dataset.clear));
        }
    }

    openSlotMenu(slotIndex) {
        const content = this.createPicker(`Hotbar Slot ${slotIndex + 1}`);
        const skills = this.getAssignableSkills();
        const assignedId = this.config.slots[slotIndex];

        if (skills.length === 0) {
            content.innerHTML = `<div class="skill-picker-empty">Learn an active skill before assigning hotbar slots.</div>`;
            return;
        }

        content.innerHTML = `
            <div class="skill-picker-options">
                ${skills.map(skill => `
                    <button type="button" class="skill-picker-option" data-skill-id="${skill.id}">
                        <span class="skill-picker-icon">${skill.icon || '❓'}</span>
                        <span>
                            <strong>${skill.name}</strong>
                            <small>Lv.${skill.currentLevel}${skill.mpCost ? ` · ${skill.mpCost + (skill.currentLevel - 1) * 2} MP` : ''}</small>
                        </span>
                    </button>
                `).join('')}
            </div>
            ${assignedId ? `<button type="button" class="skill-picker-danger" data-clear="${slotIndex}">Clear this slot</button>` : ''}
        `;

        content.querySelectorAll('[data-skill-id]').forEach(button => {
            button.onclick = () => this.assignSkill(button.dataset.skillId, slotIndex);
        });
        const clearButton = content.querySelector('[data-clear]');
        if (clearButton) {
            clearButton.onclick = () => this.clearSlot(Number(clearButton.dataset.clear));
        }
    }

    dragSkill(event, slotIndex) {
        const skill = this.config.slots[slotIndex];
        event.dataTransfer.setData('skill-id', skill);
        event.dataTransfer.setData('source', 'hotbar');
        event.dataTransfer.setData('source-slot', slotIndex);
        event.target.style.opacity = '0.5';
    }

    dropSkill(event, slotIndex) {
        event.preventDefault();
        this.clearDropFeedback(event);

        const skillId = event.dataTransfer.getData('skill-id');
        const source = event.dataTransfer.getData('source');
        const sourceSlot = event.dataTransfer.getData('source-slot');

        if (source === 'hotbar' && sourceSlot !== undefined) {
            const sourceIndex = parseInt(sourceSlot, 10);
            const temp = this.config.slots[slotIndex];
            this.config.slots[slotIndex] = this.config.slots[sourceIndex];
            this.config.slots[sourceIndex] = temp;
        } else {
            const skill = Game.skills.getCurrentSkills().find(s => s.id === skillId);
            if (skill && skill.currentLevel > 0) {
                this.config.slots[slotIndex] = skillId;
            }
        }

        this.saveConfig();
        this.render();
        this.display.renderSkills();
    }

    allowSkillDrop(event) {
        event.preventDefault();
        event.currentTarget.style.borderColor = '#4caf50';
        event.currentTarget.style.background = 'rgba(76, 175, 80, 0.2)';
    }

    clearDropFeedback(event) {
        event.currentTarget.style.borderColor = '';
        event.currentTarget.style.background = '';

        document.querySelectorAll('.hotbar-skill').forEach(skill => {
            skill.style.opacity = '';
        });
    }

    saveConfig() {
        localStorage.setItem(SAVE_KEYS.hotbar, JSON.stringify(this.config));
    }

    loadConfig() {
        const saved = localStorage.getItem(SAVE_KEYS.hotbar);
        if (saved) {
            this.display.hotbarConfig = JSON.parse(saved);
        }
    }

    useSlot(slotIndex) {
        const skillId = this.config.slots[slotIndex];
        if (!skillId) return;

        const skill = Game.skills.getCurrentSkills().find(s => s.id === skillId);
        if (skill && skill.currentLevel > 0) {
            Game.skills.useSkill(skill.id);
        }
    }
}

window.HotbarUI = HotbarUI;
