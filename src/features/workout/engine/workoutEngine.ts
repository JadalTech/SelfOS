/**
 * Pure Workout Domain Engine
 *
 * All business logic algorithms remain 100% pure TypeScript:
 * - Framework independent
 * - Zero database imports
 * - Zero React dependencies
 */

import type { ExerciseSet, WorkoutExercise, MuscleGroup } from '../types/workout.types';

/**
 * Estimates 1-Rep Max (1RM) using the Epley formula:
 * 1RM = weight * (1 + reps / 30)
 */
export function calculateOneRepMax(weight: number, reps: number): number {
  if (weight <= 0 || reps <= 0) return 0;
  if (reps === 1) return Math.round(weight * 10) / 10;
  const val = weight * (1 + reps / 30);
  return Math.round(val * 10) / 10;
}

/**
 * Calculates training volume for a single set.
 * Warmup sets are excluded from training volume calculations.
 */
export function calculateVolumeForSet(set: ExerciseSet): number {
  if (!set.completed || set.type === 'warmup') {
    return 0;
  }
  return set.weight * set.reps;
}

/**
 * Converts weight value between kg and lbs.
 * 1 kg = 2.20462 lbs
 */
export function convertWeight(value: number, from: 'kg' | 'lbs', to: 'kg' | 'lbs'): number {
  if (value <= 0) return 0;
  if (from === to) return value;
  
  let result = 0;
  if (from === 'kg' && to === 'lbs') {
    result = value * 2.20462;
  } else if (from === 'lbs' && to === 'kg') {
    result = value / 2.20462;
  }
  return Math.round(result * 10) / 10;
}

/**
 * Calculates volume density per minute.
 */
export function calculateSessionDensity(totalVolume: number, durationSeconds: number): number {
  if (durationSeconds <= 0 || totalVolume <= 0) return 0;
  const minutes = durationSeconds / 60;
  return Math.round((totalVolume / minutes) * 10) / 10;
}

/**
 * Summarizes total training volume per muscle group.
 */
export function calculateMuscleGroupVolume(exercises: WorkoutExercise[]): Record<MuscleGroup, number> {
  const summary: Record<MuscleGroup, number> = {
    chest: 0,
    back: 0,
    shoulders: 0,
    biceps: 0,
    triceps: 0,
    forearms: 0,
    quadriceps: 0,
    hamstrings: 0,
    calves: 0,
    glutes: 0,
    abs: 0,
    cardio: 0,
    'full-body': 0,
    other: 0,
  };

  for (const ex of exercises) {
    let exerciseVolume = 0;
    for (const set of ex.sets) {
      exerciseVolume += calculateVolumeForSet(set);
    }
    const group = ex.primaryMuscleGroup;
    if (group in summary) {
      summary[group] += exerciseVolume;
    } else {
      summary.other += exerciseVolume;
    }
  }

  // Round values
  for (const key of Object.keys(summary) as MuscleGroup[]) {
    summary[key] = Math.round(summary[key] * 10) / 10;
  }

  return summary;
}

/**
 * Calculates execution frequencies of exercises across completed session logs.
 */
export function calculateExerciseFrequency(
  sessions: { exercises: WorkoutExercise[] }[]
): Record<string, number> {
  const frequencies: Record<string, number> = {};

  for (const session of sessions) {
    for (const ex of session.exercises) {
      // Exercise is counted if they completed at least one set
      const completedAnySet = ex.sets.some((s) => s.completed);
      if (completedAnySet) {
        frequencies[ex.exerciseId] = (frequencies[ex.exerciseId] || 0) + 1;
      }
    }
  }

  return frequencies;
}

export interface SessionTotals {
  readonly totalVolume: number;
  readonly totalReps: number;
  readonly durationSeconds: number;
  readonly completedExercisesCount: number;
  readonly averageRPE?: number;
  readonly averageRestDuration?: number;
  readonly estimatedIntensity: 'low' | 'moderate' | 'high';
  readonly caloriesBurned: number;
}

/**
 * Calculates aggregated session totals, intensity level, and calorie expenditure.
 */
export function calculateSessionTotals(
  exercises: WorkoutExercise[],
  startedAt: Date,
  completedAt?: Date,
  durationSecondsOverride = 0
): SessionTotals {
  let totalVolume = 0;
  let totalReps = 0;
  let completedExercisesCount = 0;
  
  let rpeSum = 0;
  let rpeCount = 0;
  
  let restSum = 0;
  let restCount = 0;

  for (const ex of exercises) {
    let hasCompletedSets = false;
    for (const set of ex.sets) {
      if (set.completed) {
        hasCompletedSets = true;
        if (set.type !== 'warmup') {
          totalReps += set.reps;
        }
        totalVolume += calculateVolumeForSet(set);
        
        if (set.rpe !== undefined && set.rpe > 0) {
          rpeSum += set.rpe;
          rpeCount++;
        }
        if (set.restTimeSeconds !== undefined && set.restTimeSeconds > 0) {
          restSum += set.restTimeSeconds;
          restCount++;
        }
      }
    }
    if (hasCompletedSets) {
      completedExercisesCount++;
    }
  }

  let durationSeconds = durationSecondsOverride;
  if (durationSeconds <= 0 && completedAt) {
    durationSeconds = Math.max(0, Math.floor((completedAt.getTime() - startedAt.getTime()) / 1000));
  }

  const averageRPE = rpeCount > 0 ? Math.round((rpeSum / rpeCount) * 10) / 10 : undefined;
  const averageRestDuration = restCount > 0 ? Math.round(restSum / restCount) : undefined;

  // Intensity heuristics based on density (volume per minute) and average RPE
  const density = calculateSessionDensity(totalVolume, durationSeconds);
  let estimatedIntensity: 'low' | 'moderate' | 'high' = 'moderate';
  
  const avgRpeVal = averageRPE || 7; // Default to moderate RPE if not logged
  
  if (density > 250 || (density > 150 && avgRpeVal >= 8)) {
    estimatedIntensity = 'high';
  } else if (density < 50 && avgRpeVal <= 5) {
    estimatedIntensity = 'low';
  }

  // Calorie calculations based on MET values for strength/cardio
  // MET: Low = 4.0, Moderate = 6.0, High = 8.5
  // Calorie estimate = (duration in minutes) * MET * multiplier (approx. 1.25 for average weight)
  const durationMinutes = durationSeconds / 60;
  let metValue = 6.0;
  if (estimatedIntensity === 'high') {
    metValue = 8.5;
  } else if (estimatedIntensity === 'low') {
    metValue = 4.0;
  }

  const caloriesBurned = Math.round(durationMinutes * metValue * 1.25);

  return {
    totalVolume: Math.round(totalVolume),
    totalReps,
    durationSeconds,
    completedExercisesCount,
    averageRPE,
    averageRestDuration,
    estimatedIntensity,
    caloriesBurned,
  };
}

/**
 * Calculates the current consecutive workout day streak.
 */
export function calculateWorkoutStreak(sessions: { date: string }[]): number {
  if (sessions.length === 0) return 0;

  // Deduplicate and sort dates descending
  const sortedDates = [...new Set(sessions.map((s) => s.date))].sort((a, b) => b.localeCompare(a));

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  // If streak was not maintained today or yesterday, it is broken
  if (sortedDates[0] !== todayStr && sortedDates[0] !== yesterdayStr) {
    return 0;
  }

  let streak = 0;
  let currentTarget = new Date(sortedDates[0]);

  for (const dateStr of sortedDates) {
    const expectedStr = currentTarget.toISOString().split('T')[0];
    if (dateStr === expectedStr) {
      streak++;
      currentTarget.setDate(currentTarget.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Calculates workout completion frequency since the start of a week.
 */
export function calculateWeeklyFrequency(sessions: { date: string }[], weekStartDateStr: string): number {
  const loggedDates = new Set(sessions.map((s) => s.date));
  let count = 0;
  for (const dateStr of loggedDates) {
    if (dateStr >= weekStartDateStr) {
      count++;
    }
  }
  return count;
}
