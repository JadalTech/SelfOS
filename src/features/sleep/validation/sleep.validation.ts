import { z } from 'zod';

// Time string regex format (HH:MM)
const timeStringSchema = z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Must be in HH:MM format');

// Date string regex format (YYYY-MM-DD)
const dateStringSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be in YYYY-MM-DD format');

export const sleepQualitySchema = z.object({
  rating: z.number().int().min(1, 'Rating must be at least 1').max(10, 'Rating cannot exceed 10'),
  efficiencyPercentage: z.number().min(0).max(100).optional(),
  deepSleepMinutes: z.number().nonnegative().optional(),
  remSleepMinutes: z.number().nonnegative().optional(),
  lightSleepMinutes: z.number().nonnegative().optional(),
  awakeMinutes: z.number().nonnegative().optional(),
});

export const sleepEntrySchema = z.object({
  date: dateStringSchema,
  bedtime: z.date({ message: 'Bedtime is required' }),
  wakeTime: z.date({ message: 'Wake-up time is required' }),
  quality: sleepQualitySchema,
  notes: z.string().trim().optional(),
  timezone: z.string().trim().optional(),
  sleepSource: z.enum(['manual', 'wearable', 'imported']).default('manual'),
  sleepEfficiency: z.number().min(0).max(100).optional(),
  sleepLatency: z.number().nonnegative().optional(),
  awakeDuration: z.number().nonnegative().optional(),
  interruptionsCount: z.number().int().nonnegative().optional(),
  tags: z.array(z.string().trim()).optional(),
}).refine((data) => data.wakeTime > data.bedtime, {
  message: 'Wake-up time must be after bedtime',
  path: ['wakeTime'],
});

export type SleepEntryFormValues = z.infer<typeof sleepEntrySchema>;

export const sleepScheduleSchema = z.object({
  targetBedtime: timeStringSchema,
  targetWakeTime: timeStringSchema,
  targetDurationMinutes: z.number().int().positive('Target duration must be positive'),
  weekdayBedtime: timeStringSchema,
  weekdayWakeTime: timeStringSchema,
  weekendBedtime: timeStringSchema,
  weekendWakeTime: timeStringSchema,
  isActive: z.boolean().default(true),
  effectiveFrom: dateStringSchema,
  effectiveUntil: dateStringSchema.optional(),
});

export type SleepScheduleFormValues = z.infer<typeof sleepScheduleSchema>;

export const sleepGoalSchema = z.object({
  category: z.enum(['duration', 'bedtime', 'wake_time', 'consistency', 'recovery']),
  targetValue: z.number().nonnegative('Target value must be non-negative'),
  targetTime: timeStringSchema.optional(),
  isActive: z.boolean().default(true),
}).refine((data) => {
  if ((data.category === 'bedtime' || data.category === 'wake_time') && !data.targetTime) {
    return false;
  }
  return true;
}, {
  message: 'Target time is required for bedtime and wake-up time goals',
  path: ['targetTime'],
});

export type SleepGoalFormValues = z.infer<typeof sleepGoalSchema>;
