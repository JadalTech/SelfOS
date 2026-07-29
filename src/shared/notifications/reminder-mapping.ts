/**
 * Reminder Mapping Storage
 *
 * Persists mapping relationship between generic domain reminder IDs
 * and system notification IDs via StorageService.
 * Guarantees reliable updates, syncs, and cancellations.
 */

import type { StorageService } from '../storage';
import { storage } from '../storage';
import { logger } from '../utils/logger';
import type { NotificationFeature, NotificationMapping } from './notification.types';

export const REMINDER_MAPPING_STORAGE_KEY = '@selfos/reminder_mappings';

export class ReminderMappingStorage {
  private mappings: Map<string, NotificationMapping> = new Map();
  private isInitialized = false;
  private storageService: StorageService;

  constructor(storageService: StorageService = storage) {
    this.storageService = storageService;
  }

  /**
   * Initialize mappings from persistent storage.
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      const persisted = await this.storageService.getObject<NotificationMapping[]>(
        REMINDER_MAPPING_STORAGE_KEY
      );
      if (Array.isArray(persisted)) {
        this.mappings = new Map(persisted.map((item) => [item.reminderId, item]));
      } else {
        this.mappings = new Map();
      }
      this.isInitialized = true;
      logger.info('ReminderMappingStorage', `Initialized with ${this.mappings.size} stored mappings.`);
    } catch (error) {
      logger.error('ReminderMappingStorage', 'Failed to initialize reminder mappings from storage', error);
      this.mappings = new Map();
      this.isInitialized = true;
    }
  }

  /**
   * Save current map to storage.
   */
  private async persist(): Promise<void> {
    try {
      const list = Array.from(this.mappings.values());
      await this.storageService.setObject(REMINDER_MAPPING_STORAGE_KEY, list);
    } catch (error) {
      logger.error('ReminderMappingStorage', 'Failed to persist reminder mappings', error);
    }
  }

  /**
   * Store or update a reminder to notification mapping.
   */
  public async saveMapping(mapping: NotificationMapping): Promise<void> {
    await this.initialize();
    this.mappings.set(mapping.reminderId, mapping);
    await this.persist();
  }

  /**
   * Get notification ID for a reminder ID.
   */
  public async getNotificationId(reminderId: string): Promise<string | null> {
    await this.initialize();
    const found = this.mappings.get(reminderId);
    return found ? found.notificationId : null;
  }

  /**
   * Get full mapping entity by reminder ID.
   */
  public async getMapping(reminderId: string): Promise<NotificationMapping | null> {
    await this.initialize();
    return this.mappings.get(reminderId) || null;
  }

  /**
   * Remove mapping by reminder ID.
   */
  public async removeMapping(reminderId: string): Promise<boolean> {
    await this.initialize();
    const existed = this.mappings.delete(reminderId);
    if (existed) {
      await this.persist();
    }
    return existed;
  }

  /**
   * Get all stored mappings for a specific entity ID.
   */
  public async getMappingsForEntity(feature: NotificationFeature, entityId: string): Promise<NotificationMapping[]> {
    await this.initialize();
    return Array.from(this.mappings.values()).filter(
      (m) => m.feature === feature && m.entityId === entityId
    );
  }

  /**
   * Retrieve all stored mappings.
   */
  public async getAllMappings(): Promise<NotificationMapping[]> {
    await this.initialize();
    return Array.from(this.mappings.values());
  }

  /**
   * Clear all mappings.
   */
  public async clear(): Promise<void> {
    await this.initialize();
    this.mappings.clear();
    await this.persist();
  }
}

/**
 * Singleton instance of ReminderMappingStorage.
 */
export const reminderMappingStorage = new ReminderMappingStorage();
