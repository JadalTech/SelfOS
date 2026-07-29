/**
 * Routine Reminder Service
 *
 * Feature bridge delegating Routine reminder scheduling to shared ReminderScheduler.
 * Architecture: Routine Feature -> Reminder Scheduler -> Notification Service -> Expo Notifications.
 */

import { reminderScheduler } from '@/shared/notifications';
import type { ReminderModel } from '@/shared/notifications';
import type { Routine } from '../types';

/**
 * Synchronize routine reminders with the system notification scheduler.
 */
export async function syncRoutineReminders(routine: Routine): Promise<void> {
  if (routine.status !== 'active') {
    await reminderScheduler.cancelRemindersForEntity('routine', routine.id);
    return;
  }

  for (const reminder of routine.reminders) {
    if (!reminder.enabled) {
      await reminderScheduler.cancelReminder(reminder.id);
      continue;
    }

    const [hourStr, minuteStr] = reminder.time.split(':');
    const hour = parseInt(hourStr || '9', 10);
    const minute = parseInt(minuteStr || '0', 10);

    const reminderModel: ReminderModel = {
      id: reminder.id,
      feature: 'routine',
      entityId: routine.id,
      title: routine.title,
      body: routine.description || `Time for your ${routine.type} routine!`,
      enabled: reminder.enabled,
      trigger: { type: 'time', time: { hour, minute } },
      recurrence: {
        type: routine.schedule.frequency === 'weekly' ? 'weekly' : 'daily',
        interval: routine.schedule.interval,
        daysOfWeek: routine.schedule.daysOfWeek,
      },
      timezone: routine.schedule.timezone || 'Asia/Kolkata',
      payload: { routineId: routine.id, type: routine.type },
      createdAt: routine.createdAt instanceof Date ? routine.createdAt.toISOString() : new Date().toISOString(),
      updatedAt: routine.updatedAt instanceof Date ? routine.updatedAt.toISOString() : new Date().toISOString(),
    };

    await reminderScheduler.scheduleReminder(reminderModel);
  }
}

/**
 * Cancel all reminders for a specific routine ID.
 */
export async function cancelRoutineReminders(routineId: string): Promise<void> {
  await reminderScheduler.cancelRemindersForEntity('routine', routineId);
}
