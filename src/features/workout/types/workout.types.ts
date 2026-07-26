/**
 * Workout Module Domain Types & Enums
 */

export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'forearms'
  | 'quadriceps'
  | 'hamstrings'
  | 'calves'
  | 'glutes'
  | 'abs'
  | 'cardio'
  | 'full-body'
  | 'other';

export type ExerciseCategory =
  | 'strength'
  | 'cardio'
  | 'stretching'
  | 'plyometrics'
  | 'olympic'
  | 'other';

export type Equipment =
  | 'barbell'
  | 'dumbbell'
  | 'kettlebell'
  | 'machine'
  | 'cable'
  | 'bodyweight'
  | 'bands'
  | 'none'
  | 'other';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type DefaultUnit = 'kg' | 'lbs' | 'bodyweight' | 'seconds' | 'reps';

export interface Exercise {
  readonly id: string;
  readonly name: string;
  readonly aliases?: string[];
  readonly primaryMuscleGroup: MuscleGroup;
  readonly secondaryMuscleGroups?: MuscleGroup[];
  readonly equipment: Equipment;
  readonly category: ExerciseCategory;
  readonly difficulty: Difficulty;
  readonly unilateral: boolean;
  readonly defaultRestDurationSeconds?: number;
  readonly defaultUnit: DefaultUnit;
  readonly instructions?: string[];
  readonly source: 'global' | 'user';
  readonly userId?: string; // set for user custom exercises
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export type SetType = 'warmup' | 'working' | 'drop' | 'failure';

export interface ExerciseSet {
  readonly id: string;
  readonly type: SetType;
  readonly weight: number; // weight value (0 for bodyweight/cardio if not applicable)
  readonly reps: number; // number of reps (or duration in seconds if cardio)
  readonly completed: boolean;
  readonly rpe?: number; // Rate of Perceived Exertion (1 to 10)
  readonly restTimeSeconds?: number;
}

export interface WorkoutExercise {
  readonly id: string;
  readonly exerciseId: string;
  readonly exerciseName: string;
  readonly exerciseCategory: ExerciseCategory;
  readonly primaryMuscleGroup: MuscleGroup;
  readonly sets: ExerciseSet[];
  readonly notes?: string;
}

export interface WorkoutPlan {
  readonly id: string;
  readonly userId: string;
  readonly name: string;
  readonly description?: string;
  readonly exercises: WorkoutExercise[];
  readonly targetDaysPerWeek?: number;
  readonly isActive: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export type WorkoutSessionStatus = 'planned' | 'active' | 'paused' | 'completed' | 'abandoned';

export interface WorkoutSession {
  readonly id: string;
  readonly userId: string;
  readonly templateId?: string;
  readonly planId?: string;
  readonly name: string;
  readonly status: WorkoutSessionStatus;
  readonly exercises: WorkoutExercise[];
  readonly startedAt: Date;
  readonly pausedAt?: Date; // last paused timestamp
  readonly resumedAt?: Date; // last resumed timestamp
  readonly completedAt?: Date;
  readonly durationSeconds: number; // accumulated time tracked
  readonly notes?: string;
  readonly totalVolume: number; // Sum of weight * reps for completed sets
  readonly totalReps: number; // Sum of reps for completed sets
  readonly estimatedIntensity?: 'low' | 'moderate' | 'high';
  readonly averageRPE?: number;
  readonly averageRestDuration?: number; // average rest between sets
  readonly caloriesBurned?: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface WorkoutTemplate {
  readonly id: string;
  readonly userId: string;
  readonly name: string;
  readonly description?: string;
  readonly exercises: WorkoutExercise[];
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export type PersonalRecordType =
  | 'one-rep-max'
  | 'max-weight'
  | 'max-reps'
  | 'longest-duration'
  | 'fastest-time'
  | 'highest-volume';

export interface PersonalRecord {
  readonly id: string;
  readonly userId: string;
  readonly exerciseId: string;
  readonly exerciseName: string;
  readonly type: PersonalRecordType;
  readonly value: number; // weight or reps or seconds depending on type
  readonly unit: string; // e.g. "kg", "lbs", "reps", "seconds"
  readonly date: string; // YYYY-MM-DD
  readonly sessionId?: string; // sessionId where this record was achieved
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface WeeklyWorkoutSummary {
  readonly userId: string;
  readonly weekStartDate: string; // YYYY-MM-DD
  readonly workoutCount: number;
  readonly totalVolume: number;
  readonly totalReps: number;
  readonly totalDurationSeconds: number;
  readonly muscleGroupFrequency: Record<MuscleGroup, number>;
  readonly caloriesBurned: number;
  readonly personalRecordsCount: number;
}
