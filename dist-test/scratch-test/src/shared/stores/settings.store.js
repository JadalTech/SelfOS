"use strict";
/**
 * Settings Store
 *
 * User preference state with AsyncStorage persistence.
 * Defaults to system theme preference per Revision §7.
 *
 * Persistence is handled via the StorageService abstraction,
 * keeping the store decoupled from the concrete storage backend.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSettingsStore = void 0;
const zustand_1 = require("zustand");
const storage_1 = require("@/shared/storage");
const constants_1 = require("@/shared/constants");
// ---------------------------------------------------------------------------
// Defaults
// ---------------------------------------------------------------------------
const DEFAULT_SETTINGS = {
    themeMode: 'system',
    notificationsEnabled: true,
    hapticEnabled: true,
    isHydrated: false,
};
async function persistSettings(partial) {
    const current = await storage_1.storage.getObject(constants_1.STORAGE_KEYS.SETTINGS);
    const merged = {
        themeMode: current?.themeMode ?? DEFAULT_SETTINGS.themeMode,
        notificationsEnabled: current?.notificationsEnabled ?? DEFAULT_SETTINGS.notificationsEnabled,
        hapticEnabled: current?.hapticEnabled ?? DEFAULT_SETTINGS.hapticEnabled,
        ...partial,
    };
    await storage_1.storage.setObject(constants_1.STORAGE_KEYS.SETTINGS, merged);
}
// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------
exports.useSettingsStore = (0, zustand_1.create)()((set, get) => ({
    ...DEFAULT_SETTINGS,
    setThemeMode: (themeMode) => {
        set({ themeMode });
        void persistSettings({ themeMode });
    },
    toggleNotifications: () => {
        const next = !get().notificationsEnabled;
        set({ notificationsEnabled: next });
        void persistSettings({ notificationsEnabled: next });
    },
    toggleHaptic: () => {
        const next = !get().hapticEnabled;
        set({ hapticEnabled: next });
        void persistSettings({ hapticEnabled: next });
    },
    hydrate: async () => {
        const persisted = await storage_1.storage.getObject(constants_1.STORAGE_KEYS.SETTINGS);
        if (persisted) {
            set({
                themeMode: persisted.themeMode ?? DEFAULT_SETTINGS.themeMode,
                notificationsEnabled: persisted.notificationsEnabled ?? DEFAULT_SETTINGS.notificationsEnabled,
                hapticEnabled: persisted.hapticEnabled ?? DEFAULT_SETTINGS.hapticEnabled,
                isHydrated: true,
            });
        }
        else {
            set({ isHydrated: true });
        }
    },
}));
