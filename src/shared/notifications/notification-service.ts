/**
 * Notification Service
 *
 * Platform-safe wrapper for Expo Notifications.
 * Provides scheduling, cancellation, listing, and handler configuration.
 * Hides all Expo-specific implementation details and provides graceful fallback on unsupported platforms.
 */

import { logger } from '../utils/logger';
import type { ScheduledNotificationItem } from './notification.types';

export interface NotificationContent {
  title: string;
  body: string;
  data?: Record<string, unknown>;
  sound?: boolean;
}

export interface NotificationServiceTrigger {
  date?: Date;
  seconds?: number;
  repeats?: boolean;
  hour?: number;
  minute?: number;
  weekday?: number;
}

export interface NotificationBehaviorOptions {
  shouldShowAlert?: boolean;
  shouldPlaySound?: boolean;
  shouldSetBadge?: boolean;
}

export class NotificationService {
  private isExpoAvailable = false;
  private expoNotifications: typeof import('expo-notifications') | null = null;
  private scheduledMockMap: Map<string, ScheduledNotificationItem> = new Map();

  constructor() {
    this.initExpoNotifications();
  }

  /**
   * Safely attempt to load expo-notifications module.
   */
  private initExpoNotifications(): void {
    try {
      // Dynamic import check for Expo Notifications availability
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const Notifications = require('expo-notifications') as typeof import('expo-notifications');
      if (Notifications && typeof Notifications.scheduleNotificationAsync === 'function') {
        this.expoNotifications = Notifications;
        this.isExpoAvailable = true;
        logger.info('NotificationService', 'Expo Notifications initialized successfully.');
      }
    } catch {
      this.isExpoAvailable = false;
      logger.info('NotificationService', 'Expo Notifications unavailable. Using fallback memory driver.');
    }
  }

  /**
   * Configure global notification behavior when received in foreground.
   */
  public configureNotificationHandler(options: NotificationBehaviorOptions = {}): void {
    const behavior = {
      shouldShowAlert: options.shouldShowAlert ?? true,
      shouldPlaySound: options.shouldPlaySound ?? true,
      shouldSetBadge: options.shouldSetBadge ?? false,
      shouldShowBanner: options.shouldShowAlert ?? true,
      shouldShowList: options.shouldShowAlert ?? true,
    };

    if (this.isExpoAvailable && this.expoNotifications) {
      try {
        this.expoNotifications.setNotificationHandler({
          handleNotification: async () => behavior as any,
        });
      } catch (error) {
        logger.error('NotificationService', 'Failed to set Expo notification handler', error);
      }
    }
  }

  /**
   * Schedule a local notification.
   * Returns a unique notification ID string.
   */
  public async scheduleNotification(
    content: NotificationContent,
    trigger: NotificationServiceTrigger
  ): Promise<string> {
    const notificationId = `notif_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    if (this.isExpoAvailable && this.expoNotifications) {
      try {
        const expoId = await this.expoNotifications.scheduleNotificationAsync({
          content: {
            title: content.title,
            body: content.body,
            data: content.data || {},
            sound: content.sound ?? true,
          },
          trigger: trigger as unknown as import('expo-notifications').NotificationTriggerInput,
        });
        return expoId || notificationId;
      } catch (error) {
        logger.error('NotificationService', 'Expo scheduleNotificationAsync failed', error);
      }
    }

    // Fallback in-memory driver
    this.scheduledMockMap.set(notificationId, {
      id: notificationId,
      title: content.title,
      body: content.body,
      payload: content.data,
    });

    logger.info('NotificationService', `Scheduled fallback notification ID: ${notificationId}`);
    return notificationId;
  }

  /**
   * Cancel a scheduled notification by notification ID.
   */
  public async cancelNotification(notificationId: string): Promise<void> {
    if (this.isExpoAvailable && this.expoNotifications) {
      try {
        await this.expoNotifications.cancelScheduledNotificationAsync(notificationId);
        return;
      } catch (error) {
        logger.error('NotificationService', `Failed to cancel Expo notification: ${notificationId}`, error);
      }
    }

    this.scheduledMockMap.delete(notificationId);
    logger.info('NotificationService', `Cancelled fallback notification ID: ${notificationId}`);
  }

  /**
   * Cancel all scheduled notifications.
   */
  public async cancelAllNotifications(): Promise<void> {
    if (this.isExpoAvailable && this.expoNotifications) {
      try {
        await this.expoNotifications.cancelAllScheduledNotificationsAsync();
        return;
      } catch (error) {
        logger.error('NotificationService', 'Failed to cancel all Expo notifications', error);
      }
    }

    this.scheduledMockMap.clear();
    logger.info('NotificationService', 'Cancelled all fallback notifications.');
  }

  /**
   * Retrieve list of all scheduled notifications.
   */
  public async listScheduledNotifications(): Promise<ScheduledNotificationItem[]> {
    if (this.isExpoAvailable && this.expoNotifications) {
      try {
        const list = await this.expoNotifications.getAllScheduledNotificationsAsync();
        return list.map((item) => ({
          id: item.identifier,
          title: item.content.title || '',
          body: item.content.body || '',
          payload: item.content.data,
        }));
      } catch (error) {
        logger.error('NotificationService', 'Failed to list Expo scheduled notifications', error);
      }
    }

    return Array.from(this.scheduledMockMap.values());
  }
}

/**
 * Singleton instance of NotificationService.
 */
export const notificationService = new NotificationService();
