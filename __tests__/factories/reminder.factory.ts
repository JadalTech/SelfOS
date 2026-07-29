/**
 * Reminder Test Factory
 * SelfOS Testing Infrastructure
 *
 * Provides reusable factories for Notification & Reminder objects.
 */

export interface ReminderTestModel {
  id: string;
  userId: string;
  title: string;
  body: string;
  triggerTime: string; // ISO String or HH:mm
  repeat: 'none' | 'daily' | 'weekly';
  channelId: string;
  routeParams?: {
    screen: string;
    params?: Record<string, string>;
  };
  isEnabled: boolean;
  createdAt: string;
}

export function buildReminder(overrides: Partial<ReminderTestModel> = {}): ReminderTestModel {
  const timestamp = new Date().toISOString();
  return {
    id: `rem_${Math.random().toString(36).substring(2, 9)}`,
    userId: 'user_default_123',
    title: 'Time for Evening Routine',
    body: 'Don\'t forget your skincare checklist before bed!',
    triggerTime: '21:00',
    repeat: 'daily',
    channelId: 'routine_reminders',
    routeParams: {
      screen: '/skincare',
    },
    isEnabled: true,
    createdAt: timestamp,
    ...overrides,
  };
}
