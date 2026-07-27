/**
 * Workout Module ViewModels & Presentation Interfaces
 */

import type {
  MuscleGroup,
  ExerciseCategory,
  Equipment,
  Difficulty,
  DefaultUnit,
  SetType,
  WorkoutSessionStatus,
  PersonalRecordType,
} from './workout.types';

export interface ExerciseVM {
  readonly id: string;
  readonly name: string;
  readonly primaryMuscleGroup: MuscleGroup;
  readonly primaryMuscleGroupLabel: string;
  readonly secondaryMuscleGroups: MuscleGroup[];
  readonly secondaryMuscleGroupsLabel: string;
  readonly equipment: Equipment;
  readonly equipmentLabel: string;
  readonly category: ExerciseCategory;
  readonly categoryLabel: string;
  readonly difficulty: Difficulty;
  readonly difficultyLabel: string;
  readonly unilateral: boolean;
  readonly unilateralLabel: string;
  readonly defaultRestDurationSeconds?: number;
  readonly defaultRestDurationLabel?: string;
  readonly defaultUnit: DefaultUnit;
  readonly defaultUnitLabel: string;
  readonly instructions: string[];
  readonly source: 'global' | 'user';
  readonly isCustom: boolean;
}

export interface ExerciseSetVM {
  readonly id: string;
  readonly type: SetType;
  readonly typeLabel: string;
  readonly weight: number;
  readonly weightLabel: string;
  readonly reps: number;
  readonly repsLabel: string;
  readonly completed: boolean;
  readonly rpe?: number;
  readonly rpeLabel?: string;
  readonly restTimeSeconds?: number;
  readonly restTimeLabel?: string;
}

export interface WorkoutExerciseVM {
  readonly id: string;
  readonly exerciseId: string;
  readonly exerciseName: string;
  readonly exerciseCategory: ExerciseCategory;
  readonly exerciseCategoryLabel: string;
  readonly primaryMuscleGroup: MuscleGroup;
  readonly primaryMuscleGroupLabel: string;
  readonly sets: ExerciseSetVM[];
  readonly setsCount: number;
  readonly setsCompletedCount: number;
  readonly notes: string;
  readonly name: string;
  readonly setsCountLabel: string;
  readonly setsSummaryLabel: string;
  readonly equipmentLabel: string;
}

export interface WorkoutPlanVM {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly exercises: WorkoutExerciseVM[];
  readonly exercisesCount: number;
  readonly targetDaysPerWeek?: number;
  readonly targetDaysPerWeekLabel?: string;
  readonly isActive: boolean;
  readonly isActiveLabel: string;
  readonly scheduleLabel: string;
  readonly exercisesCountLabel: string;
  readonly muscleGroupLabels: string[];
}

export interface WorkoutSessionVM {
  readonly id: string;
  readonly name: string;
  readonly status: WorkoutSessionStatus;
  readonly statusLabel: string;
  readonly exercises: WorkoutExerciseVM[];
  readonly startedAt: string; // Formatted Date/Time
  readonly completedAt?: string; // Formatted Date/Time
  readonly durationFormatted: string; // e.g. "45m 30s" or "01:15:00"
  readonly durationSeconds: number;
  readonly notes: string;
  readonly totalVolume: number;
  readonly totalVolumeLabel: string;
  readonly totalReps: number;
  readonly totalRepsLabel: string;
  readonly estimatedIntensity: string; // e.g. "High Intensity"
  readonly averageRPE?: number;
  readonly averageRPELabel?: string;
  readonly averageRestDurationLabel?: string;
  readonly caloriesBurned?: number;
  readonly caloriesBurnedLabel?: string;
}

export interface WorkoutTemplateVM {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly exercises: WorkoutExerciseVM[];
  readonly exercisesCount: number;
}

export interface PersonalRecordVM {
  readonly id: string;
  readonly exerciseId: string;
  readonly exerciseName: string;
  readonly type: PersonalRecordType;
  readonly typeLabel: string;
  readonly value: number;
  readonly valueLabel: string;
  readonly unit: string;
  readonly dateFormatted: string;
  readonly sessionId?: string;
}

export interface WeeklyWorkoutSummaryVM {
  readonly weekStartDate: string;
  readonly weekStartDateFormatted: string;
  readonly workoutCount: number;
  readonly workoutCountLabel: string;
  readonly totalVolumeLabel: string;
  readonly totalRepsLabel: string;
  readonly totalDurationFormatted: string;
  readonly muscleGroupFrequency: { muscleGroup: MuscleGroup; label: string; count: number }[];
  readonly caloriesBurnedLabel: string;
  readonly personalRecordsCount: number;
  readonly personalRecordsCountLabel: string;
}
