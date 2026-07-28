/**
 * Hydration Validation Schemas & Utilities (Zod + Pure Functions)
 * SelfOS v1.4.0 — Batch 11A Revision
 *
 * Schema-based validation for Firestore writes (via Zod) and pure
 * business-rule validation functions that return structured results.
 */

import { z } from 'zod';
import {
  HYDRATION_MIN_AMOUNT_ML,
  HYDRATION_MAX_AMOUNT_ML,
  HYDRATION_MIN_TARGET_ML,
  HYDRATION_MAX_TARGET_ML,
  HYDRATION_MIN_REMINDER_INTERVAL,
  HYDRATION_MAX_REMINDER_INTERVAL,
  HYDRATION_MIN_ENTRY_GAP_MINUTES,
  HYDRATION_MAX_ENTRIES_PER_DAY,
  HYDRATION_MAX_SNOOZES,
} from '../constants/hydration.constants';
import type {
  HydrationEntry,
  HydrationValidationResult,
  ReminderWindow,
  HydrationGoalVersion,
} from '../types/hydration.types';

// ---------------------------------------------------------------------------
// Enum Schemas
// ---------------------------------------------------------------------------

export const drinkTypeSchema = z.enum([
  'water',
  'electrolyte',
  'tea',
  'coffee',
  'milk',
  'juice',
  'other',
]);

export const drinkTemperatureSchema = z.enum(['cold', 'normal', 'warm']);

export const hydrationSourceSchema = z.enum([
  'quick-add',
  'manual',
  'reminder',
  'smart-suggestion',
  'widget',
  'voice',
  'apple-health',
  'google-fit',
  'imported',
  'wearable',
]);

export const activityLevelSchema = z.enum([
  'sedentary',
  'moderate',
  'high',
  'very-high',
]);

export const climateTypeSchema = z.enum(['cold', 'normal', 'hot', 'very-hot']);

export const hydrationStatusSchema = z.enum(['low', 'normal', 'good', 'excellent']);

export const reminderTypeSchema = z.enum(['push', 'in-app', 'both']);

export const scheduleTypeSchema = z.enum(['fixed', 'interval']);

export const reminderStatusSchema = z.enum(['active', 'paused', 'disabled']);

export const goalChangeReasonSchema = z.enum([
  'manual',
  'weight-update',
  'activity-change',
  'climate-change',
  'ai-recommendation',
  'import',
  'other',
]);

// ---------------------------------------------------------------------------
// Time String Schema (HH:mm)
// ---------------------------------------------------------------------------

const timeStringSchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Time must be in HH:mm format');

const dateStringSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format');

// ---------------------------------------------------------------------------
// Hydration Entry Schema
// ---------------------------------------------------------------------------

export const hydrationEntrySchema = z.object({
  date: dateStringSchema,
  time: timeStringSchema,
  timestamp: z
    .date()
    .or(z.string().transform((val) => new Date(val)))
    .refine((d) => d.getTime() <= Date.now() + 60_000, {
      message: 'Timestamp cannot be in the future',
    }),
  amountML: z
    .number()
    .min(HYDRATION_MIN_AMOUNT_ML, `Amount must be at least ${HYDRATION_MIN_AMOUNT_ML} mL`)
    .max(HYDRATION_MAX_AMOUNT_ML, `Amount must not exceed ${HYDRATION_MAX_AMOUNT_ML} mL`),
  drinkType: drinkTypeSchema,
  temperature: drinkTemperatureSchema.default('normal'),
  source: hydrationSourceSchema.default('manual'),
  notes: z.string().max(500).optional(),
});

// ---------------------------------------------------------------------------
// Hydration Goal Schema
// ---------------------------------------------------------------------------

export const hydrationGoalSchema = z.object({
  dailyTargetML: z
    .number()
    .min(HYDRATION_MIN_TARGET_ML, `Target must be at least ${HYDRATION_MIN_TARGET_ML} mL`)
    .max(HYDRATION_MAX_TARGET_ML, `Target must not exceed ${HYDRATION_MAX_TARGET_ML} mL`),
  customTargetEnabled: z.boolean().default(false),
  weightKg: z.number().min(20).max(300).optional(),
  activityLevel: activityLevelSchema.default('moderate'),
  climate: climateTypeSchema.default('normal'),
  wakeTime: timeStringSchema.default('07:00'),
  sleepTime: timeStringSchema.default('23:00'),
  reminderEnabled: z.boolean().default(true),
  reminderIntervalMinutes: z
    .number()
    .min(
      HYDRATION_MIN_REMINDER_INTERVAL,
      `Interval must be at least ${HYDRATION_MIN_REMINDER_INTERVAL} minutes`
    )
    .max(
      HYDRATION_MAX_REMINDER_INTERVAL,
      `Interval must not exceed ${HYDRATION_MAX_REMINDER_INTERVAL} minutes`
    )
    .default(60),
  smartAdjustments: z.boolean().default(true),
});

// ---------------------------------------------------------------------------
// Hydration Reminder Schema
// ---------------------------------------------------------------------------

export const hydrationReminderSchema = z.object({
  enabled: z.boolean().default(true),
  reminderType: reminderTypeSchema.default('push'),
  scheduleType: scheduleTypeSchema.default('interval'),
  reminderTimes: z.array(timeStringSchema).default([]),
  intervalMinutes: z
    .number()
    .min(HYDRATION_MIN_REMINDER_INTERVAL)
    .max(HYDRATION_MAX_REMINDER_INTERVAL)
    .default(60),
  startTime: timeStringSchema.default('07:00'),
  endTime: timeStringSchema.default('23:00'),
  weekdays: z.array(z.number().int().min(1).max(7)).default([1, 2, 3, 4, 5, 6, 7]),
  smartReminderEnabled: z.boolean().default(false),
  snoozeMinutes: z.number().min(1).max(60).default(10),
  maxSnoozes: z.number().min(0).max(HYDRATION_MAX_SNOOZES).default(3),
  status: reminderStatusSchema.default('active'),
});

// ---------------------------------------------------------------------------
// Goal Version Schema
// ---------------------------------------------------------------------------

export const goalVersionSchema = z.object({
  previousTargetML: z.number().min(0),
  newTargetML: z.number().min(HYDRATION_MIN_TARGET_ML).max(HYDRATION_MAX_TARGET_ML),
  reason: goalChangeReasonSchema,
  effectiveDate: dateStringSchema,
});

// ---------------------------------------------------------------------------
// Inferred Form Types
// ---------------------------------------------------------------------------

export type HydrationEntryFormValues = z.infer<typeof hydrationEntrySchema>;
export type HydrationGoalFormValues = z.infer<typeof hydrationGoalSchema>;
export type HydrationReminderFormValues = z.infer<typeof hydrationReminderSchema>;
export type GoalVersionFormValues = z.infer<typeof goalVersionSchema>;

// =========================================================================
// Pure Business-Rule Validation Functions
// =========================================================================

/**
 * Validates a new entry against existing entries for the same day.
 *
 * Checks:
 *   1. Duplicate timestamp — rejects entries within HYDRATION_MIN_ENTRY_GAP_MINUTES
 *      of an existing entry.
 *   2. Unrealistic frequency — rejects when the day already has
 *      HYDRATION_MAX_ENTRIES_PER_DAY entries.
 *   3. Negative / zero amount (redundant with Zod, but included for
 *      standalone use).
 */
export function validateEntryAgainstExisting(
  newEntry: Pick<HydrationEntry, 'timestamp' | 'amountML' | 'date'>,
  existingEntries: ReadonlyArray<Pick<HydrationEntry, 'timestamp' | 'date'>>
): HydrationValidationResult {
  const errors: Array<{ field: string; code: string; message: string }> = [];

  // Amount guard
  if (newEntry.amountML <= 0) {
    errors.push({
      field: 'amountML',
      code: 'NEGATIVE_AMOUNT',
      message: 'Amount must be greater than zero.',
    });
  }

  // Frequency guard
  const sameDayEntries = existingEntries.filter((e) => e.date === newEntry.date);
  if (sameDayEntries.length >= HYDRATION_MAX_ENTRIES_PER_DAY) {
    errors.push({
      field: 'date',
      code: 'MAX_ENTRIES_EXCEEDED',
      message: `Maximum of ${HYDRATION_MAX_ENTRIES_PER_DAY} entries per day exceeded.`,
    });
  }

  // Duplicate / too-close timestamp
  const newMs = newEntry.timestamp.getTime();
  const gapMs = HYDRATION_MIN_ENTRY_GAP_MINUTES * 60 * 1000;
  for (const existing of sameDayEntries) {
    const diff = Math.abs(newMs - existing.timestamp.getTime());
    if (diff < gapMs) {
      errors.push({
        field: 'timestamp',
        code: 'DUPLICATE_TIMESTAMP',
        message: `An entry already exists within ${HYDRATION_MIN_ENTRY_GAP_MINUTES} minute(s) of this timestamp.`,
      });
      break;
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validates that a reminder window does not overlap with existing reminder windows.
 *
 * Two windows overlap when their time ranges intersect. Overnight windows
 * (end < start) are normalised to a 24 + end representation.
 */
export function validateReminderWindow(
  newWindow: ReminderWindow,
  existingWindows: ReadonlyArray<ReminderWindow>
): HydrationValidationResult {
  const errors: Array<{ field: string; code: string; message: string }> = [];

  if (newWindow.intervalMinutes <= 0) {
    errors.push({
      field: 'intervalMinutes',
      code: 'INVALID_INTERVAL',
      message: 'Interval must be greater than zero.',
    });
  }

  const normalise = (w: ReminderWindow): [number, number] => {
    const s = parseTime(w.start);
    let e = parseTime(w.end);
    if (e <= s) e += 24 * 60;
    return [s, e];
  };

  const [newStart, newEnd] = normalise(newWindow);

  for (const existing of existingWindows) {
    const [exStart, exEnd] = normalise(existing);
    if (newStart < exEnd && newEnd > exStart) {
      errors.push({
        field: 'startTime',
        code: 'OVERLAPPING_WINDOW',
        message: `Reminder window ${newWindow.start}–${newWindow.end} overlaps with ${existing.start}–${existing.end}.`,
      });
      break;
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validates a fixed reminder schedule for internal consistency.
 *
 * Checks:
 *   - At least one time is specified.
 *   - All times are valid HH:mm.
 *   - No duplicate times.
 *   - Times fall within the wake/sleep window.
 */
export function validateFixedReminderSchedule(
  times: ReadonlyArray<string>,
  wakeTime: string,
  sleepTime: string
): HydrationValidationResult {
  const errors: Array<{ field: string; code: string; message: string }> = [];
  const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

  if (times.length === 0) {
    errors.push({
      field: 'reminderTimes',
      code: 'EMPTY_SCHEDULE',
      message: 'At least one reminder time is required for fixed schedules.',
    });
    return { valid: false, errors };
  }

  const wakeMin = parseTime(wakeTime);
  const sleepMin = parseTime(sleepTime);
  const seen = new Set<string>();

  for (const t of times) {
    if (!timeRegex.test(t)) {
      errors.push({
        field: 'reminderTimes',
        code: 'INVALID_TIME_FORMAT',
        message: `"${t}" is not a valid HH:mm time.`,
      });
      continue;
    }
    if (seen.has(t)) {
      errors.push({
        field: 'reminderTimes',
        code: 'DUPLICATE_TIME',
        message: `Duplicate reminder time "${t}".`,
      });
    }
    seen.add(t);

    const m = parseTime(t);
    const inRange = sleepMin > wakeMin
      ? m >= wakeMin && m < sleepMin
      : m >= wakeMin || m < sleepMin;
    if (!inRange) {
      errors.push({
        field: 'reminderTimes',
        code: 'OUT_OF_RANGE',
        message: `Reminder time "${t}" is outside the wake/sleep window (${wakeTime}–${sleepTime}).`,
      });
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validates a goal version record for internal consistency.
 */
export function validateGoalVersion(
  version: Pick<HydrationGoalVersion, 'previousTargetML' | 'newTargetML' | 'effectiveDate'>
): HydrationValidationResult {
  const errors: Array<{ field: string; code: string; message: string }> = [];

  if (version.newTargetML === version.previousTargetML) {
    errors.push({
      field: 'newTargetML',
      code: 'NO_CHANGE',
      message: 'New target must differ from the previous target.',
    });
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(version.effectiveDate)) {
    errors.push({
      field: 'effectiveDate',
      code: 'INVALID_DATE',
      message: 'Effective date must be in YYYY-MM-DD format.',
    });
  }

  return { valid: errors.length === 0, errors };
}

// ---------------------------------------------------------------------------
// Utility
// ---------------------------------------------------------------------------

function parseTime(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}
