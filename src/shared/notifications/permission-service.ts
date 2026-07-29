/**
 * Permission Service
 *
 * Manages notification permission checks and requests.
 * Platform-agnostic interface with zero UI coupling.
 */

import { logger } from '../utils/logger';
import type { PermissionStatus } from './notification.types';

export class PermissionService {
  private currentStatus: PermissionStatus = 'undetermined';

  /**
   * Check current notification permission status.
   */
  public async checkPermission(): Promise<PermissionStatus> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const Notifications = require('expo-notifications') as typeof import('expo-notifications');
      if (Notifications && typeof Notifications.getPermissionsAsync === 'function') {
        const settings = await Notifications.getPermissionsAsync();
        this.currentStatus = settings.granted
          ? 'granted'
          : settings.canAskAgain
            ? 'undetermined'
            : 'denied';
        return this.currentStatus;
      }
    } catch {
      logger.info('PermissionService', 'Expo Notifications unavailable. Assuming granted for web/mock.');
    }

    // Default fallback status for web / testing environment
    this.currentStatus = 'granted';
    return this.currentStatus;
  }

  /**
   * Request notification permissions from system.
   */
  public async requestPermission(): Promise<PermissionStatus> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const Notifications = require('expo-notifications') as typeof import('expo-notifications');
      if (Notifications && typeof Notifications.requestPermissionsAsync === 'function') {
        const settings = await Notifications.requestPermissionsAsync({
          ios: {
            allowAlert: true,
            allowBadge: true,
            allowSound: true,
          },
        });
        this.currentStatus = settings.granted ? 'granted' : 'denied';
        return this.currentStatus;
      }
    } catch (error) {
      logger.error('PermissionService', 'Failed to request notification permission', error);
    }

    this.currentStatus = 'granted';
    return this.currentStatus;
  }

  /**
   * Get cached permission status synchronously.
   */
  public getPermissionStatus(): PermissionStatus {
    return this.currentStatus;
  }
}

/**
 * Singleton instance of PermissionService.
 */
export const permissionService = new PermissionService();
