import { z } from 'zod';

export const hairProductSchema = z.object({
  name: z.string().trim().min(2, 'Product name must be at least 2 characters'),
  brand: z.string().trim().min(1, 'Brand name is required'),
  category: z.enum([
    'shampoo',
    'conditioner',
    'oil',
    'serum',
    'mask',
    'treatment',
    'custom',
  ]),
  isFavorite: z.boolean(),
  isActive: z.boolean(),
  notes: z.string().trim().optional(),
});

export type HairProductFormValues = z.infer<typeof hairProductSchema>;

export const hairRoutineSchema = z.object({
  title: z.string().trim().min(2, 'Routine title must be at least 2 characters'),
  haircareCategory: z.enum([
    'wash-day',
    'oiling',
    'scalp-massage',
    'deep-conditioning',
    'custom',
  ]),
  productIds: z.array(z.string()).min(1, 'Select at least one product for this routine'),
  frequency: z.enum(['daily', 'weekly', 'monthly', 'custom']),
  daysOfWeek: z.array(z.number().min(0).max(6)).optional(),
  reminderTime: z.string().optional(),
  instructions: z.string().trim().optional(),
});

export type HairRoutineFormValues = z.infer<typeof hairRoutineSchema>;

export const hairLogSchema = z.object({
  hairRoutineId: z.string().min(1, 'Select a hair routine'),
  appliedProductIds: z.array(z.string()).min(1, 'Select at least one applied product'),
  notes: z.string().trim().optional(),
});

export type HairLogFormValues = z.infer<typeof hairLogSchema>;

export const hairPhotoUploadSchema = z.object({
  imageUri: z.string().min(1, 'Please select or capture a photo'),
  captureDate: z.string().min(1, 'Capture date is required'),
  angle: z.enum(['front', 'back', 'crown', 'left', 'right', 'hairline']),
  notes: z.string().trim().optional(),
});

export type HairPhotoUploadFormValues = z.infer<typeof hairPhotoUploadSchema>;

export const hairConditionSchema = z.object({
  recordDate: z.string().min(1, 'Record date is required'),
  hairType: z.enum(['straight', 'wavy', 'curly', 'coily']),
  porosity: z.enum(['low', 'medium', 'high', 'unknown']),
  scalpType: z.enum(['dry', 'normal', 'oily', 'combination', 'sensitive']),
  hairDensity: z.enum(['thin', 'medium', 'thick']),
  sheddingLevel: z.number().min(1).max(5),
  dandruffLevel: z.number().min(1).max(5),
  itchinessLevel: z.number().min(1).max(5),
  oilinessLevel: z.number().min(1).max(5),
  drynessLevel: z.number().min(1).max(5),
  breakageLevel: z.number().min(1).max(5),
  frizzLevel: z.number().min(1).max(5),
  shineLevel: z.number().min(1).max(5),
  overallHealth: z.number().min(1).max(10),
  stressLevel: z.number().min(1).max(5).optional(),
  sleepHours: z.number().min(0).max(24).optional(),
  waterIntakeLiters: z.number().min(0).max(10).optional(),
  notes: z.string().trim().optional(),
});

export type HairConditionFormValues = z.infer<typeof hairConditionSchema>;
