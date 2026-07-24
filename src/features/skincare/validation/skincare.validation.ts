/**
 * Skincare Validation Schemas (Zod)
 */

import { z } from 'zod';

export const skincareProductSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(100, 'Product name must be less than 100 characters'),
  brand: z.string().min(1, 'Brand name is required').max(100, 'Brand name must be less than 100 characters'),
  category: z.enum([
    'cleanser',
    'toner',
    'essence',
    'serum',
    'ampoule',
    'moisturizer',
    'sunscreen',
    'exfoliant',
    'mask',
    'eye-cream',
    'spot-treatment',
    'face-oil',
    'mist',
  ]),
  type: z.enum([
    'liquid',
    'cream',
    'gel',
    'foam',
    'serum',
    'oil',
    'balm',
    'sheet',
    'powder',
  ]),
  keyIngredients: z.array(z.string()),
  openedDate: z.string().optional(),
  shelfLifeMonths: z.number().min(1).max(60).optional(),
  isFavorite: z.boolean(),
  notes: z.string().max(500, 'Notes must be under 500 characters').optional(),
});

export const routineStepSchema = z.object({
  productId: z.string().min(1, 'Product selection is required'),
  stepOrder: z.number().min(1),
  timeOfDay: z.enum(['morning', 'evening', 'both', 'weekly-special']),
  waitTimeMinutes: z.number().min(0).max(60).optional(),
  instructions: z.string().max(200).optional(),
  isOptional: z.boolean().optional(),
});

export const skincareRoutineSchema = z.object({
  title: z.string().min(1, 'Routine title is required').max(100),
  timeOfDay: z.enum(['morning', 'evening', 'both', 'weekly-special']),
  steps: z.array(routineStepSchema).min(1, 'At least one step is required'),
  targetedConcerns: z.array(z.enum([
    'acne',
    'aging',
    'hyperpigmentation',
    'dryness',
    'redness',
    'texture',
    'dark-circles',
    'dullness',
    'enlarged-pores',
    'barrier-damage',
  ])),
  frequency: z.enum(['daily', 'weekly', 'biweekly', 'custom']),
});

export const skincareLogSchema = z.object({
  skincareRoutineId: z.string().min(1, 'Routine selection is required'),
  coreRoutineId: z.string().min(1, 'Core routine ID is required'),
  dateStr: z.string().min(1, 'Date is required'),
  timeStr: z.string().min(1, 'Time is required'),
  completedStepIds: z.array(z.string()),
  skippedStepIds: z.array(z.string()),
  appliedProductIds: z.array(z.string()),
  weather: z.enum(['sunny', 'humid', 'dry', 'cold', 'hot', 'rainy', 'cloudy']).optional(),
  uvIndex: z.number().min(0).max(15).optional(),
  skinFeeling: z.number().min(1).max(5).optional(),
  notes: z.string().max(500).optional(),
});

export const skinAssessmentSchema = z.object({
  recordDate: z.string().min(1, 'Record date is required'),
  skinType: z.enum(['dry', 'oily', 'combination', 'normal', 'sensitive']),
  concerns: z.array(z.enum([
    'acne',
    'aging',
    'hyperpigmentation',
    'dryness',
    'redness',
    'texture',
    'dark-circles',
    'dullness',
    'enlarged-pores',
    'barrier-damage',
  ])),
  severityMap: z.record(z.string(), z.number().min(1).max(5)),
  overallHealthScore: z.number().min(1).max(10),
  hydrationLevel: z.number().min(1).max(5),
  sensitivityLevel: z.number().min(1).max(5),
  oilinessLevel: z.number().min(1).max(5),
  barrierHealthScore: z.number().min(1).max(5),
  sleepHours: z.number().min(0).max(24).optional(),
  stressLevel: z.number().min(1).max(5).optional(),
  notes: z.string().max(500).optional(),
});

export const progressPhotoUploadSchema = z.object({
  photoUri: z.string().min(1, 'Photo URI is required'),
  date: z.string().min(1, 'Date is required'),
  timeOfDay: z.enum(['morning', 'evening', 'both', 'weekly-special']),
  angle: z.enum(['front', 'left-profile', 'right-profile', 'close-up']),
  lightingCondition: z.string().max(100).optional(),
  notes: z.string().max(500).optional(),
});

export const skinReminderSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  time: z.string().min(1, 'Time is required'),
  reminderType: z.enum([
    'morning-routine',
    'evening-routine',
    'sunscreen-reapply',
    'weekly-exfoliation',
    'assessment-checkin',
  ]),
  frequency: z.enum(['daily', 'weekly', 'biweekly', 'custom']),
  daysOfWeek: z.array(z.number().min(0).max(6)).optional(),
  isEnabled: z.boolean(),
});

export type SkincareProductFormValues = z.infer<typeof skincareProductSchema>;
export type RoutineStepFormValues = z.infer<typeof routineStepSchema>;
export type SkincareRoutineFormValues = z.infer<typeof skincareRoutineSchema>;
export type SkincareLogFormValues = z.infer<typeof skincareLogSchema>;
export type SkinAssessmentFormValues = z.infer<typeof skinAssessmentSchema>;
export type ProgressPhotoUploadFormValues = z.infer<typeof progressPhotoUploadSchema>;
export type SkinReminderFormValues = z.infer<typeof skinReminderSchema>;
