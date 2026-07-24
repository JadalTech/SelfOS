import { ok, err } from '../../../shared/types';
import type { Result } from '../../../shared/types';
import { AppError } from '../../../shared/errors/AppError';
import type { SkinReminder, ReminderType, RoutineFrequency } from '../types';
import { skincareService, SkincareService } from '../services/skincare.service';

export interface CreateSkinReminderInput {
  readonly title: string;
  readonly time: string;
  readonly reminderType: ReminderType;
  readonly frequency: RoutineFrequency;
  readonly daysOfWeek?: number[];
  readonly isEnabled?: boolean;
}

export class SkinReminderRepository {
  constructor(private readonly service: SkincareService = skincareService) {}

  async fetchReminders(userId: string): Promise<Result<SkinReminder[], AppError>> {
    try {
      const reminders = await this.service.fetchReminders(userId);
      return ok(reminders);
    } catch (error) {
      return err(new AppError('FIREBASE_ERROR', 'Failed to fetch skin reminders', { originalError: error }));
    }
  }

  async createReminder(userId: string, input: CreateSkinReminderInput): Promise<Result<SkinReminder, AppError>> {
    try {
      const reminder = await this.service.createReminder(userId, {
        title: input.title,
        time: input.time,
        reminderType: input.reminderType,
        frequency: input.frequency,
        daysOfWeek: input.daysOfWeek || [],
        isEnabled: input.isEnabled ?? true,
      });
      return ok(reminder);
    } catch (error) {
      return err(new AppError('FIREBASE_ERROR', 'Failed to create skin reminder', { originalError: error }));
    }
  }

  async updateReminder(
    userId: string,
    reminderId: string,
    updates: Partial<SkinReminder>
  ): Promise<Result<SkinReminder, AppError>> {
    try {
      const updated = await this.service.updateReminder(userId, reminderId, updates);
      return ok(updated);
    } catch (error) {
      return err(new AppError('FIREBASE_ERROR', 'Failed to update skin reminder', { originalError: error }));
    }
  }

  async deleteReminder(userId: string, reminderId: string): Promise<Result<void, AppError>> {
    try {
      await this.service.deleteReminder(userId, reminderId);
      return ok(undefined);
    } catch (error) {
      return err(new AppError('FIREBASE_ERROR', 'Failed to delete skin reminder', { originalError: error }));
    }
  }
}

export const skinReminderRepository = new SkinReminderRepository();
