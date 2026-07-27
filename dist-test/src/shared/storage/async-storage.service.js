"use strict";
/**
 * AsyncStorage Implementation of StorageService
 *
 * Concrete implementation using @react-native-async-storage/async-storage.
 * Full Expo Go compatibility — no native build required.
 *
 * To swap to MMKV or SecureStore in the future, create a new class
 * implementing StorageService and update the export in index.ts.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = void 0;
const async_storage_1 = __importDefault(require("@react-native-async-storage/async-storage"));
const logger_1 = require("@/shared/utils/logger");
class AsyncStorageService {
    async get(key) {
        try {
            return await async_storage_1.default.getItem(key);
        }
        catch (error) {
            logger_1.logger.error('StorageService', `Failed to get key "${key}"`, error);
            return null;
        }
    }
    async set(key, value) {
        try {
            await async_storage_1.default.setItem(key, value);
        }
        catch (error) {
            logger_1.logger.error('StorageService', `Failed to set key "${key}"`, error);
        }
    }
    async remove(key) {
        try {
            await async_storage_1.default.removeItem(key);
        }
        catch (error) {
            logger_1.logger.error('StorageService', `Failed to remove key "${key}"`, error);
        }
    }
    async clear() {
        try {
            await async_storage_1.default.clear();
        }
        catch (error) {
            logger_1.logger.error('StorageService', 'Failed to clear storage', error);
        }
    }
    async contains(key) {
        try {
            const value = await async_storage_1.default.getItem(key);
            return value !== null;
        }
        catch (error) {
            logger_1.logger.error('StorageService', `Failed to check key "${key}"`, error);
            return false;
        }
    }
    async getObject(key) {
        try {
            const raw = await async_storage_1.default.getItem(key);
            if (raw === null) {
                return null;
            }
            return JSON.parse(raw);
        }
        catch (error) {
            logger_1.logger.error('StorageService', `Failed to get/parse object for key "${key}"`, error);
            return null;
        }
    }
    async setObject(key, value) {
        try {
            const serialized = JSON.stringify(value);
            await async_storage_1.default.setItem(key, serialized);
        }
        catch (error) {
            logger_1.logger.error('StorageService', `Failed to serialize/set object for key "${key}"`, error);
        }
    }
}
/**
 * Singleton storage service instance.
 *
 * To switch implementations, replace this instantiation:
 *   export const storage: StorageService = new MmkvStorageService();
 */
exports.storage = new AsyncStorageService();
