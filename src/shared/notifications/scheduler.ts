/**
 * Reminder Scheduler
 *
 * Platform-independent domain scheduler converting ReminderModel entities into
 * system notifications via NotificationService and ReminderMappingStorage.
 * Completely decoupled from specific business features (Routine, Tasks, Journal, etc.).
 */

import { logger } from '../utils/logger';
import { NotificationEventEmitter, notificationEventEmitter } from './notification-events';
import { NotificationService, notificationService } from './notification-service';
import type { NotificationFeature, NotificationMapping, ReminderModel } from './notification.types';
import { ReminderMappingStorage, reminderMappingStorage } from './reminder-mapping';

export interface ReminderSchedulerOptions {
  notificationService?: NotificationService;
  mappingStorage?: ReminderMappingStorage;
  eventEmitter?: NotificationEventEmitter;
}

export class ReminderScheduler {
  private notificationService: NotificationService;
  private mappingStorage: ReminderMappingStorage;
  private eventEmitter: NotificationEventEmitter;

  constructor(options: ReminderSchedulerOptions = {}) {
    this.notificationService = options.notificationService || notificationService;
    this.mappingStorage = options.mappingStorage || reminderMappingStorage;
    this.eventEmitter = options.eventEmitter || notificationEventEmitter;
  }

  /**
   * Calculate trigger parameters for NotificationService based on ReminderModel.
   */
  private calculateTrigger(reminder: ReminderModel) {
    const { trigger, recurrence } = reminder;

    if (trigger.type === 'date') {
      return { date: trigger.date };
    }

    if (trigger.type === 'interval') {
      return {
        seconds: trigger.seconds,
        repeats: recurrence.type !== 'none',
      };
    }

    if (trigger.type === 'time') {
      const { hour, minute } = trigger.time;
      if (recurrence.type === 'daily') {
        return { hour, minute, repeats: true };
      }

      if (recurrence.type === 'weekly' && recurrence.daysOfWeek && recurrence.daysOfWeek.length > 0) {
        // Return first day of week for simple schedule or default
        return { hour, minute, weekday: recurrence.daysOfWeek[0] + 1, repeats: true };
      }

      // Default time trigger for today/tomorrow
      const now = new Date();
      const targetDate = new Date();
      targetDate.setHours(hour, minute, 0, 0);

      if (targetDate.getTime() <= now.getTime()) {
        targetDate.setDate(targetDate.getDate() + 1);
      }
      return { date: targetDate };
    }

    return { seconds: 60 };
  }

  /**
   * Schedule a new or updated reminder.
   * Cancels any pre-existing system notification mapped to this reminderId first.
   */
  public async scheduleReminder(reminder: ReminderModel): Promise<string | null> {
    if (!reminder.enabled) {
      await this.cancelReminder(reminder.id);
      return null;
    }

    // Cancel existing notification for this reminder if present
    await this.cancelReminder(reminder.id);

    const triggerOptions = this.calculateTrigger(reminder);
    const payload = {
      reminderId: reminder.id,
      feature: reminder.feature,
      entityId: reminder.entityId,
      timezone: reminder.timezone,
      ...(reminder.payload || {}),
    };

    try {
      const notificationId = await this.notificationService.scheduleNotification(
        {
          title: reminder.title,
          body: reminder.body,
          data: payload,
        },
        triggerOptions
      );

      const now = new Date().toISOString();
      const mapping: NotificationMapping = {
        reminderId: reminder.id,
        notificationId,
        feature: reminder.feature,
        entityId: reminder.entityId,
        scheduledAt: now,
        updatedAt: now,
      };

      await this.mappingStorage.saveMapping(mapping);

      this.eventEmitter.emit('REMINDER_SCHEDULED', {
        reminder,
        notificationId,
        scheduledAt: now,
      });

      logger.info(
        'ReminderScheduler',
        `Scheduled reminder [${reminder.feature}:${reminder.id}] -> Notification ID: ${notificationId}`
      );
      return notificationId;
    } catch (error) {
      logger.error('ReminderScheduler', `Failed to schedule reminder ${reminder.id}`, error);
      return null;
    }
  }

  /**
   * Cancel a single reminder by reminderId.
   */
  public async cancelReminder(reminderId: string): Promise<boolean> {
    const existingNotificationId = await this.mappingStorage.getNotificationId(reminderId);

    if (existingNotificationId) {
      await this.notificationService.cancelNotification(existingNotificationId);
      await this.mappingStorage.removeMapping(reminderId);

      this.eventEmitter.emit('REMINDER_CANCELLED', {
        reminderId,
        notificationId: existingNotificationId,
      });

      logger.info('ReminderScheduler', `Cancelled reminder ID: ${reminderId}`);
      return true;
    }
    return false;
  }

  /**
   * Cancel all reminders associated with a specific domain entity.
   */
  public async cancelRemindersForEntity(
    feature: NotificationFeature,
    entityId: string
  ): Promise<void> {
    const mappings = await this.mappingStorage.getMappingsForEntity(feature, entityId);

    for (const mapping of mappings) {
      await this.notificationService.cancelNotification(mapping.notificationId);
      await this.mappingStorage.removeMapping(mapping.reminderId);

      this.eventEmitter.emit('REMINDER_CANCELLED', {
        reminderId: mapping.reminderId,
        notificationId: mapping.notificationId,
      });
    }

    logger.info(
      'ReminderScheduler',
      `Cancelled ${mappings.length} reminders for entity [${feature}:${entityId}]`
    );
  }

  /**
   * Bulk sync/reschedule a list of reminders (e.g. on application boot or timezone update).
   */
  public async syncReminders(reminders: ReminderModel[]): Promise<void> {
    logger.info('ReminderScheduler', `Syncing ${reminders.length} reminders...`);
    for (const reminder of reminders) {
      await this.scheduleReminder(reminder);
    }
  }
}

/**
 * Singleton instance of ReminderScheduler.
 */
export const reminderScheduler = new ReminderScheduler();
