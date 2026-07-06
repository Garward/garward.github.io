// storage.js - Save storage keys and one-time migration from older saves.

const SAVE_KEYS = {
    characters: 'gloamreach_characters',
    player: 'gloamreach_player',
    achievements: 'gloamreach_achievements',
    progression: 'gloamreach_progression',
    hotbar: 'gloamreach_hotbar',
    defeatedMvps: 'gloamreach_defeated_bosses',
    inventory: 'gloamreach_inventory',
    skills: 'gloamreach_skills',
    migrated: 'gloamreach_migrated_v1'
};

// Legacy key sets, in priority order (newest first).
const LEGACY_SAVE_KEY_SETS = [
    {
        characters: 'riftbound_characters',
        player: 'riftbound_player',
        achievements: 'riftbound_achievements',
        progression: 'riftbound_progression',
        hotbar: 'riftbound_hotbar',
        defeatedMvps: 'riftbound_defeated_bosses',
        inventory: 'riftbound_inventory',
        skills: 'riftbound_skills'
    }
];

// Kept for reset tooling: every legacy key that may hold save data.
const LEGACY_SAVE_KEYS = Object.assign({}, ...LEGACY_SAVE_KEY_SETS.slice().reverse());

// Old area key -> new area key
const LEGACY_AREA_MAP = {
};

// Old boss name -> new boss name (used for world-boss unlock tracking)
const LEGACY_BOSS_MAP = {
};

const SaveMigration = {
    mapArea(key) {
        return LEGACY_AREA_MAP[key] || key;
    },

    mapBoss(name) {
        return LEGACY_BOSS_MAP[name] || name;
    },

    // Remap area keys / boss names inside a character (or player state) object.
    // Safe to run on already-migrated data (mapping is a no-op then).
    migrateCharacter(char) {
        if (!char || typeof char !== 'object') return char;

        if (char.currentLocation) {
            char.currentLocation = this.mapArea(char.currentLocation);
        }
        if (Array.isArray(char.unlockedAreas)) {
            char.unlockedAreas = [...new Set(char.unlockedAreas.map(a => this.mapArea(a)))];
        }
        if (char.areaProgress && typeof char.areaProgress === 'object') {
            const remapped = {};
            Object.entries(char.areaProgress).forEach(([area, count]) => {
                const newArea = this.mapArea(area);
                remapped[newArea] = Math.max(remapped[newArea] || 0, count);
            });
            char.areaProgress = remapped;
        }
        return char;
    },

    run() {
        try {
            if (localStorage.getItem(SAVE_KEYS.migrated)) return;

            // 1. Copy every legacy key to its new home (never overwrite existing
            //    new saves, never delete the legacy data). Newer legacy formats
            //    win over older ones.
            let copied = 0;
            Object.keys(SAVE_KEYS).forEach(name => {
                if (name === 'migrated') return;
                if (localStorage.getItem(SAVE_KEYS[name]) !== null) return;
                for (const keySet of LEGACY_SAVE_KEY_SETS) {
                    const legacyValue = keySet[name] !== undefined
                        ? localStorage.getItem(keySet[name]) : null;
                    if (legacyValue !== null) {
                        localStorage.setItem(SAVE_KEYS[name], legacyValue);
                        copied++;
                        break;
                    }
                }
            });

            // 2. Remap identifiers inside the copied saves.
            // Characters
            const charsRaw = localStorage.getItem(SAVE_KEYS.characters);
            if (charsRaw) {
                const chars = JSON.parse(charsRaw);
                if (Array.isArray(chars)) {
                    chars.forEach(c => this.migrateCharacter(c));
                    localStorage.setItem(SAVE_KEYS.characters, JSON.stringify(chars));
                }
            }

            // Active player state
            const playerRaw = localStorage.getItem(SAVE_KEYS.player);
            if (playerRaw) {
                const player = this.migrateCharacter(JSON.parse(playerRaw));
                localStorage.setItem(SAVE_KEYS.player, JSON.stringify(player));
            }

            // Defeated world bosses
            const mvpsRaw = localStorage.getItem(SAVE_KEYS.defeatedMvps);
            if (mvpsRaw) {
                const mvps = JSON.parse(mvpsRaw);
                if (Array.isArray(mvps)) {
                    localStorage.setItem(SAVE_KEYS.defeatedMvps,
                        JSON.stringify([...new Set(mvps.map(n => this.mapBoss(n)))]));
                }
            }

            // Progression tracker (visited locations + defeated bosses)
            const progRaw = localStorage.getItem(SAVE_KEYS.progression);
            if (progRaw) {
                const prog = JSON.parse(progRaw);
                if (prog && typeof prog === 'object') {
                    if (Array.isArray(prog.locationsVisited)) {
                        prog.locationsVisited = [...new Set(prog.locationsVisited.map(a => this.mapArea(a)))];
                    }
                    if (Array.isArray(prog.bossesDefeated)) {
                        prog.bossesDefeated = [...new Set(prog.bossesDefeated.map(n => this.mapBoss(n)))];
                    }
                    localStorage.setItem(SAVE_KEYS.progression, JSON.stringify(prog));
                }
            }

            // Achievement statistics (unique world bosses killed stores boss names)
            const achRaw = localStorage.getItem(SAVE_KEYS.achievements);
            if (achRaw) {
                const ach = JSON.parse(achRaw);
                if (ach && ach.statistics && Array.isArray(ach.statistics.unique_mvps_killed)) {
                    ach.statistics.unique_mvps_killed =
                        [...new Set(ach.statistics.unique_mvps_killed.map(n => this.mapBoss(n)))];
                    localStorage.setItem(SAVE_KEYS.achievements, JSON.stringify(ach));
                }
            }

            localStorage.setItem(SAVE_KEYS.migrated, '1');
            if (copied > 0) {
                console.log('💾 Legacy saves migrated to Gloamreach format.');
            }
        } catch (error) {
            console.warn('Save migration failed (continuing with fresh state):', error);
        }
    }
};

// Run the migration immediately, before any other script reads from storage.
SaveMigration.run();

window.SAVE_KEYS = SAVE_KEYS;
window.SaveMigration = SaveMigration;
