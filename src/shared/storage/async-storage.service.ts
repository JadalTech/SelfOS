/**
 * AsyncStorage Implementation of StorageService
 *
 * Concrete implementation using @react-native-async-storage/async-storage.
 * Full Expo Go compatibility — no native build required.
 *
 * To swap to MMKV or SecureStore in the future, create a new class
 * implementing StorageService and update the export in index.ts.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { StorageService } from './storage.interface';
import { logger } from '@/shared/utils/logger';

class AsyncStorageService implements StorageService {
  async get(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      logger.error('StorageService', `Failed to get key "${key}"`, error);
      return null;
    }
  }

  async set(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      logger.error('StorageService', `Failed to set key "${key}"`, error);
    }
  }

  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      logger.error('StorageService', `Failed to remove key "${key}"`, error);
    }
  }

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      logger.error('StorageService', 'Failed to clear storage', error);
    }
  }

  async contains(key: string): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value !== null;
    } catch (error) {
      logger.error('StorageService', `Failed to check key "${key}"`, error);
      return false;
    }
  }

  async getObject<T>(key: string): Promise<T | null> {
    try {
      const raw = await AsyncStorage.getItem(key);
      if (raw === null) {
        return null;
      }
      return JSON.parse(raw) as T;
    } catch (error) {
      logger.error(
        'StorageService',
        `Failed to get/parse object for key "${key}"`,
        error,
      );
      return null;
    }
  }

  async setObject<T>(key: string, value: T): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      await AsyncStorage.setItem(key, serialized);
    } catch (error) {
      logger.error(
        'StorageService',
        `Failed to serialize/set object for key "${key}"`,
        error,
      );
    }
  }
}

/**
 * Singleton storage service instance.
 *
 * To switch implementations, replace this instantiation:
 *   export const storage: StorageService = new MmkvStorageService();
 */
export const storage: StorageService = new AsyncStorageService();
