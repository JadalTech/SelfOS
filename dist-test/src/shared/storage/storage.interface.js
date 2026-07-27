"use strict";
/**
 * Storage Service Interface
 *
 * Abstract contract for key-value storage.
 * Business code depends ONLY on this interface, never on a concrete
 * implementation (AsyncStorage, MMKV, SecureStore, etc.).
 *
 * This allows swapping storage backends without touching consumers.
 */
Object.defineProperty(exports, "__esModule", { value: true });
