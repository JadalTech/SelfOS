import { ZodError } from 'zod';
import { ok, err } from '../../../shared/types';
import type { Result } from '../../../shared/types';
import { AppError } from '../../../shared/errors/AppError';
import {
  sleepEntrySchema,
  sleepScheduleSchema,
  sleepGoalSchema,
  type SleepEntryFormValues,
  type SleepScheduleFormValues,
  type SleepGoalFormValues,
} from '../validation/sleep.validation';

export class SleepValidationService {
  /**
   * Helper to format raw Zod errors into clean, user-friendly sentences.
   */
  private formatZodError(error: ZodError): string {
    return error.issues
      .map((e) => {
        const fieldName = e.path.join('.');
        return fieldName ? `${fieldName}: ${e.message}` : e.message;
      })
      .join(', ');
  }

  /**
   * Validates sleep entry logging form inputs.
   */
  validateEntry(input: unknown): Result<SleepEntryFormValues, AppError> {
    try {
      const parsed = sleepEntrySchema.parse(input);
      return ok(parsed);
    } catch (error) {
      if (error instanceof ZodError) {
        return err(AppError.validation(this.formatZodError(error)));
      }
      return err(AppError.validation('Invalid sleep entry parameters'));
    }
  }

  /**
   * Validates sleep target schedule configuration.
   */
  validateSchedule(input: unknown): Result<SleepScheduleFormValues, AppError> {
    try {
      const parsed = sleepScheduleSchema.parse(input);
      return ok(parsed);
    } catch (error) {
      if (error instanceof ZodError) {
        return err(AppError.validation(this.formatZodError(error)));
      }
      return err(AppError.validation('Invalid sleep schedule parameters'));
    }
  }

  /**
   * Validates sleep goals.
   */
  validateGoal(input: unknown): Result<SleepGoalFormValues, AppError> {
    try {
      const parsed = sleepGoalSchema.parse(input);
      return ok(parsed);
    } catch (error) {
      if (error instanceof ZodError) {
        return err(AppError.validation(this.formatZodError(error)));
      }
      return err(AppError.validation('Invalid sleep goal parameters'));
    }
  }
}

export const sleepValidationService = new SleepValidationService();
