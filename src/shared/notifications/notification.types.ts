/**
 * Notification Types & Entities
 *
 * Strongly-typed data models, feature unions, recurrence rules, and payload contracts.
 * Feature-agnostic shared infrastructure for SelfOS.
 */

/**
 * Strongly-typed union of application domain features supporting reminders.
 */
export type NotificationFeature =
  | 'routine'
  | 'task'
  | 'journal'
  | 'goal'
  | 'finance'
  | 'note'
  | 'custom';

/**
 * Platform permission statuses.
 */
export type PermissionStatus = 'granted' | 'denied' | 'undetermined';

/**
 * Recurrence type.
 */
export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly';

/**
 * Extensible Recurrence Rule model.
 */
export interface RecurrenceRule {
  readonly type: RecurrenceType;
  /** Repetition interval (e.g., every 1 day, every 2 weeks). Default: 1. */
  readonly interval?: number;
  /** Days of week (0 = Sunday, 6 = Saturday) for weekly recurrence. */
  readonly daysOfWeek?: number[];
  /** Days of month (1-31) for monthly recurrence. */
  readonly daysOfMonth?: number[];
}

/**
 * Time-of-day trigger (24-hour clock).
 */
export interface TimeOfDay {
  readonly hour: number;
  readonly minute: number;
}

/**
 * Reminder Trigger configuration.
 */
export type ReminderTrigger =
  | { type: 'date'; date: Date }
  | { type: 'time'; time: TimeOfDay }
  | { type: 'interval'; seconds: number };

/**
 * Core Reminder entity model.
 */
export interface ReminderModel {
  readonly id: string;
  readonly feature: NotificationFeature;
  readonly entityId: string;
  readonly title: string;
  readonly body: string;
  readonly enabled: boolean;
  readonly trigger: ReminderTrigger;
  readonly recurrence: RecurrenceRule;
  readonly timezone: string;
  readonly payload?: Record<string, unknown>;
  readonly createdAt: string;
  readonly updatedAt: string;
}

/**
 * Persistent Reminder to Notification ID Mapping entity.
 */
export interface NotificationMapping {
  readonly reminderId: string;
  readonly notificationId: string;
  readonly feature: NotificationFeature;
  readonly entityId: string;
  readonly scheduledAt: string;
  readonly updatedAt: string;
}

/**
 * Notification payload delivered on tap / interaction.
 */
export interface NotificationPayload {
  readonly reminderId: string;
  readonly feature: NotificationFeature;
  readonly entityId: string;
  readonly route?: string;
  readonly [key: string]: unknown;
}

/**
 * Scheduled notification item content wrapper.
 */
export interface ScheduledNotificationItem {
  readonly id: string;
  readonly title: string;
  readonly body: string;
  readonly payload?: Record<string, unknown>;
}
