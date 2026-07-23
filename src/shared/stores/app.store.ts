/**
 * App Store
 *
 * Application-level state that isn't feature-specific.
 * Tracks readiness, connectivity, and other global concerns.
 */

import { create } from 'zustand';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AppState {
  /** Whether the app has finished all initialization */
  isReady: boolean;
  /** Whether the device has network connectivity */
  isOnline: boolean;
}

interface AppActions {
  setReady: (isReady: boolean) => void;
  setOnline: (isOnline: boolean) => void;
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useAppStore = create<AppState & AppActions>()((set) => ({
  isReady: false,
  isOnline: true,

  setReady: (isReady) => set({ isReady }),
  setOnline: (isOnline) => set({ isOnline }),
}));
