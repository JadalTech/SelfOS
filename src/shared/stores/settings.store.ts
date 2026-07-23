/**
 * Settings Store
 *
 * User preference state with AsyncStorage persistence.
 * Defaults to system theme preference per Revision §7.
 *
 * Persistence is handled via the StorageService abstraction,
 * keeping the store decoupled from the concrete storage backend.
 */

import { create } from 'zustand';
import type { ThemeMode } from '@/shared/types';
import { storage } from '@/shared/storage';
import { STORAGE_KEYS } from '@/shared/constants';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SettingsState {
  /** Theme mode: 'light' | 'dark' | 'system' */
  themeMode: ThemeMode;
  /** Whether push notifications are enabled */
  notificationsEnabled: boolean;
  /** Whether haptic feedback is enabled */
  hapticEnabled: boolean;
  /** Whether settings have been loaded from storage */
  isHydrated: boolean;
}

interface SettingsActions {
  setThemeMode: (mode: ThemeMode) => void;
  toggleNotifications: () => void;
  toggleHaptic: () => void;
  /** Load persisted settings from storage */
  hydrate: () => Promise<void>;
}

// ---------------------------------------------------------------------------
// Defaults
// ---------------------------------------------------------------------------

const DEFAULT_SETTINGS: SettingsState = {
  themeMode: 'system',
  notificationsEnabled: true,
  hapticEnabled: true,
  isHydrated: false,
};

// ---------------------------------------------------------------------------
// Persistence Helpers
// ---------------------------------------------------------------------------

interface PersistedSettings {
  themeMode: ThemeMode;
  notificationsEnabled: boolean;
  hapticEnabled: boolean;
}

async function persistSettings(partial: Partial<PersistedSettings>): Promise<void> {
  const current = await storage.getObject<PersistedSettings>(STORAGE_KEYS.SETTINGS);
  const merged: PersistedSettings = {
    themeMode: current?.themeMode ?? DEFAULT_SETTINGS.themeMode,
    notificationsEnabled: current?.notificationsEnabled ?? DEFAULT_SETTINGS.notificationsEnabled,
    hapticEnabled: current?.hapticEnabled ?? DEFAULT_SETTINGS.hapticEnabled,
    ...partial,
  };
  await storage.setObject(STORAGE_KEYS.SETTINGS, merged);
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useSettingsStore = create<SettingsState & SettingsActions>()(
  (set, get) => ({
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
      const persisted = await storage.getObject<PersistedSettings>(
        STORAGE_KEYS.SETTINGS,
      );
      if (persisted) {
        set({
          themeMode: persisted.themeMode ?? DEFAULT_SETTINGS.themeMode,
          notificationsEnabled:
            persisted.notificationsEnabled ?? DEFAULT_SETTINGS.notificationsEnabled,
          hapticEnabled: persisted.hapticEnabled ?? DEFAULT_SETTINGS.hapticEnabled,
          isHydrated: true,
        });
      } else {
        set({ isHydrated: true });
      }
    },
  }),
);
