/**
 * Workout Validation Schemas (Zod)
 */

import { z } from 'zod';

export const muscleGroupSchema = z.enum([
  'chest',
  'back',
  'shoulders',
  'biceps',
  'triceps',
  'forearms',
  'quadriceps',
  'hamstrings',
  'calves',
  'glutes',
  'abs',
  'cardio',
  'full-body',
  'other',
]);

export const exerciseCategorySchema = z.enum([
  'strength',
  'cardio',
  'stretching',
  'plyometrics',
  'olympic',
  'other',
]);

export const equipmentSchema = z.enum([
  'barbell',
  'dumbbell',
  'kettlebell',
  'machine',
  'cable',
  'bodyweight',
  'bands',
  'none',
  'other',
]);

export const difficultySchema = z.enum(['beginner', 'intermediate', 'advanced']);

export const defaultUnitSchema = z.enum(['kg', 'lbs', 'bodyweight', 'seconds', 'reps']);

export const exerciseSchema = z.object({
  name: z.string().min(1, 'Exercise name is required').max(100),
  aliases: z.array(z.string()).optional(),
  primaryMuscleGroup: muscleGroupSchema,
  secondaryMuscleGroups: z.array(muscleGroupSchema).optional(),
  equipment: equipmentSchema,
  category: exerciseCategorySchema,
  difficulty: difficultySchema,
  unilateral: z.boolean().default(false),
  defaultRestDurationSeconds: z.number().min(0).optional(),
  defaultUnit: defaultUnitSchema,
  instructions: z.array(z.string()).optional(),
  source: z.enum(['global', 'user']).default('user'),
  userId: z.string().optional(),
});

export const setTypeSchema = z.enum(['warmup', 'working', 'drop', 'failure']);

export const exerciseSetSchema = z.object({
  id: z.string(),
  type: setTypeSchema,
  weight: z.number().min(0, 'Weight must be greater than or equal to 0'),
  reps: z.number().min(0, 'Reps or duration must be greater than or equal to 0'),
  completed: z.boolean().default(false),
  rpe: z.number().min(1).max(10).optional(),
  restTimeSeconds: z.number().min(0).optional(),
});

export const workoutExerciseSchema = z.object({
  id: z.string(),
  exerciseId: z.string().min(1, 'Exercise reference is required'),
  exerciseName: z.string().min(1, 'Exercise name is required'),
  exerciseCategory: exerciseCategorySchema,
  primaryMuscleGroup: muscleGroupSchema,
  sets: z.array(exerciseSetSchema),
  notes: z.string().max(500).optional(),
});

export const workoutPlanSchema = z.object({
  name: z.string().min(1, 'Plan name is required').max(100),
  description: z.string().max(500).optional(),
  exercises: z.array(workoutExerciseSchema),
  targetDaysPerWeek: z.number().min(1).max(7).optional(),
  isActive: z.boolean().default(true),
});

export const workoutSessionStatusSchema = z.enum([
  'planned',
  'active',
  'paused',
  'completed',
  'abandoned',
]);

export const workoutSessionSchema = z.object({
  name: z.string().min(1, 'Workout session name is required').max(100),
  status: workoutSessionStatusSchema,
  exercises: z.array(workoutExerciseSchema),
  startedAt: z.date().or(z.string().transform((val) => new Date(val))),
  pausedAt: z.date().optional().or(z.string().transform((val) => new Date(val)).optional()),
  resumedAt: z.date().optional().or(z.string().transform((val) => new Date(val)).optional()),
  completedAt: z.date().optional().or(z.string().transform((val) => new Date(val)).optional()),
  durationSeconds: z.number().min(0).default(0),
  notes: z.string().max(500).optional(),
  totalVolume: z.number().min(0).default(0),
  totalReps: z.number().min(0).default(0),
  estimatedIntensity: z.enum(['low', 'moderate', 'high']).optional(),
  averageRPE: z.number().min(1).max(10).optional(),
  averageRestDuration: z.number().min(0).optional(),
  caloriesBurned: z.number().min(0).optional(),
});

export const workoutTemplateSchema = z.object({
  name: z.string().min(1, 'Template name is required').max(100),
  description: z.string().max(500).optional(),
  exercises: z.array(workoutExerciseSchema),
});

export const personalRecordTypeSchema = z.enum([
  'one-rep-max',
  'max-weight',
  'max-reps',
  'longest-duration',
  'fastest-time',
  'highest-volume',
]);

export const personalRecordSchema = z.object({
  exerciseId: z.string().min(1, 'Exercise reference is required'),
  exerciseName: z.string().min(1, 'Exercise name is required'),
  type: personalRecordTypeSchema,
  value: z.number().min(0),
  unit: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  sessionId: z.string().optional(),
});

export type ExerciseFormValues = z.infer<typeof exerciseSchema>;
export type ExerciseSetFormValues = z.infer<typeof exerciseSetSchema>;
export type WorkoutExerciseFormValues = z.infer<typeof workoutExerciseSchema>;
export type WorkoutPlanFormValues = z.infer<typeof workoutPlanSchema>;
export type WorkoutSessionFormValues = z.infer<typeof workoutSessionSchema>;
export type WorkoutTemplateFormValues = z.infer<typeof workoutTemplateSchema>;
export type PersonalRecordFormValues = z.infer<typeof personalRecordSchema>;
