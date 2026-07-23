import { z } from 'zod';

const routineTypeSchema = z.enum([
  'haircare',
  'skincare',
  'water',
  'nutrition',
  'gym',
  'sleep',
  'medication',
  'custom',
]);

const routineFrequencySchema = z.enum(['daily', 'weekly', 'monthly', 'custom']);
const routineStatusSchema = z.enum(['draft', 'active', 'paused', 'archived']);

/** Validates date format (YYYY-MM-DD) */
const dateStringSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format');

/** Validates 24-hour time format (HH:mm) */
const timeStringSchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Time must be in 24h format (HH:mm)');

export const routineReminderSchema = z.object({
  id: z.string(),
  time: timeStringSchema,
  enabled: z.boolean(),
});

export const routineScheduleSchema = z
  .object({
    frequency: routineFrequencySchema,
    interval: z.number().int().min(1, 'Interval must be at least 1'),
    daysOfWeek: z.array(z.number().int().min(0).max(6)).optional(),
    daysOfMonth: z.array(z.number().int().min(1).max(31)).optional(),
    startDate: dateStringSchema,
    endDate: dateStringSchema.optional().nullable(),
    timezone: z.string().min(1, 'Timezone is required'),
  })
  .refine(
    (data) => {
      if (data.frequency === 'weekly') {
        return data.daysOfWeek && data.daysOfWeek.length > 0;
      }
      return true;
    },
    {
      message: 'At least one weekday must be selected for weekly schedules',
      path: ['daysOfWeek'],
    }
  )
  .refine(
    (data) => {
      if (data.frequency === 'monthly') {
        return data.daysOfMonth && data.daysOfMonth.length > 0;
      }
      return true;
    },
    {
      message: 'At least one calendar day must be selected for monthly schedules',
      path: ['daysOfMonth'],
    }
  )
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return data.endDate >= data.startDate;
      }
      return true;
    },
    {
      message: 'End date must be on or after start date',
      path: ['endDate'],
    }
  );

export const routineFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, 'Title must be at least 2 characters')
    .max(100, 'Title is too long'),
  description: z.string().trim().max(500, 'Description is too long').optional(),
  type: routineTypeSchema,
  status: routineStatusSchema,
  schedule: routineScheduleSchema,
  reminders: z.array(routineReminderSchema),
});

export type RoutineFormValues = z.infer<typeof routineFormSchema>;
