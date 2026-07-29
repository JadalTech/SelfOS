/**
 * Notification Lifecycle Events
 *
 * Decoupled event emitter for reminder lifecycle changes.
 * Consumed by analytics, logs, and background sync without UI dependencies.
 */

import { logger } from '../utils/logger';
import type { NotificationPayload, ReminderModel } from './notification.types';

export type NotificationEventType =
  | 'REMINDER_SCHEDULED'
  | 'REMINDER_CANCELLED'
  | 'REMINDER_TRIGGERED'
  | 'REMINDER_TAPPED';

export interface NotificationEventDataMap {
  REMINDER_SCHEDULED: { reminder: ReminderModel; notificationId: string; scheduledAt: string };
  REMINDER_CANCELLED: { reminderId: string; notificationId?: string };
  REMINDER_TRIGGERED: { reminderId?: string; title: string; payload?: Record<string, unknown> };
  REMINDER_TAPPED: { payload: NotificationPayload };
}

export type NotificationEventListener<T extends NotificationEventType = NotificationEventType> = (
  type: T,
  data: NotificationEventDataMap[T]
) => void;

export class NotificationEventEmitter {
  private listeners: Set<NotificationEventListener> = new Set();

  /**
   * Subscribe to notification lifecycle events.
   * Returns an unsubscribe cleanup callback.
   */
  public subscribe(listener: NotificationEventListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Emit a notification event.
   */
  public emit<T extends NotificationEventType>(type: T, data: NotificationEventDataMap[T]): void {
    for (const listener of Array.from(this.listeners)) {
      try {
        listener(type, data);
      } catch (error) {
        logger.error('NotificationEventEmitter', `Error processing notification event: ${type}`, error);
      }
    }
  }

  /**
   * Clear all active listeners.
   */
  public removeAllListeners(): void {
    this.listeners.clear();
  }
}

/**
 * Singleton instance of NotificationEventEmitter.
 */
export const notificationEventEmitter = new NotificationEventEmitter();
