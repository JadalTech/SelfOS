/**
 * Pure Analytics Engine for Workout Module
 */

import type { WorkoutSession, PersonalRecord, MuscleGroup } from '../../types/workout.types';
import type { FeatureAnalytics } from '../../../../shared/types/analytics.types';
import { calculateMuscleGroupVolume, calculateSessionTotals } from '../../engine/workoutEngine';

export interface VolumeTrendPoint {
  readonly date: string;
  readonly volume: number;
}

export interface MuscleGroupStats {
  readonly muscleGroup: MuscleGroup;
  readonly volume: number;
  readonly setPercentage: number;
  readonly daysSinceLastTrained: number;
}

/**
 * Calculates recovery gaps (days elapsed since last trained) for all muscle groups.
 * If a muscle group has never been trained, it defaults to 99 days.
 */
export function calculateRecoveryGaps(
  sessions: WorkoutSession[],
  refDate: Date = new Date()
): Record<MuscleGroup, number> {
  const latestTrainDate: Record<MuscleGroup, Date | null> = {
    chest: null,
    back: null,
    shoulders: null,
    biceps: null,
    triceps: null,
    forearms: null,
    quadriceps: null,
    hamstrings: null,
    calves: null,
    glutes: null,
    abs: null,
    cardio: null,
    'full-body': null,
    other: null,
  };

  const completedSessions = sessions
    .filter((s) => s.status === 'completed' && s.completedAt)
    .sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime()); // Descending

  for (const session of completedSessions) {
    const sessionDate = session.completedAt || session.startedAt;
    for (const ex of session.exercises) {
      const completedAnySet = ex.sets.some((s) => s.completed);
      if (completedAnySet) {
        const group = ex.primaryMuscleGroup;
        if (latestTrainDate[group] === null) {
          latestTrainDate[group] = sessionDate;
        }
      }
    }
  }

  const gaps: Record<MuscleGroup, number> = {
    chest: 99,
    back: 99,
    shoulders: 99,
    biceps: 99,
    triceps: 99,
    forearms: 99,
    quadriceps: 99,
    hamstrings: 99,
    calves: 99,
    glutes: 99,
    abs: 99,
    cardio: 99,
    'full-body': 99,
    other: 99,
  };

  const msInDay = 24 * 60 * 60 * 1000;
  for (const key of Object.keys(latestTrainDate) as MuscleGroup[]) {
    const dateVal = latestTrainDate[key];
    if (dateVal) {
      const diffMs = refDate.getTime() - dateVal.getTime();
      gaps[key] = Math.max(0, Math.floor(diffMs / msInDay));
    }
  }

  return gaps;
}

/**
 * Calculates volume trends sorted by session start date ascending.
 */
export function calculateVolumeTrends(sessions: WorkoutSession[]): VolumeTrendPoint[] {
  const completed = sessions.filter((s) => s.status === 'completed');
  const sorted = [...completed].sort((a, b) => a.startedAt.getTime() - b.startedAt.getTime());

  return sorted.map((s) => ({
    date: s.startedAt.toISOString().split('T')[0],
    volume: s.totalVolume,
  }));
}

/**
 * Calculates training consistency score (percentage of weeks meeting the target workouts).
 * Window is based on past windowWeeks (default 4).
 */
export function calculateWorkoutConsistency(
  sessions: WorkoutSession[],
  targetWorkoutsPerWeek = 3,
  windowWeeks = 4,
  refDate: Date = new Date()
): number {
  if (sessions.length === 0 || windowWeeks <= 0) return 0;

  const msInWeek = 7 * 24 * 60 * 60 * 1000;
  const windowStartMs = refDate.getTime() - windowWeeks * msInWeek;

  const completedInWindow = sessions.filter(
    (s) => s.status === 'completed' && s.startedAt.getTime() >= windowStartMs
  );

  if (completedInWindow.length === 0) return 0;

  // Group workouts by ISO week number or simple 7-day increments
  const weeklyCounts = new Array(windowWeeks).fill(0);
  for (const session of completedInWindow) {
    const timeDiff = refDate.getTime() - session.startedAt.getTime();
    const weekIndex = Math.floor(timeDiff / msInWeek);
    if (weekIndex >= 0 && weekIndex < windowWeeks) {
      weeklyCounts[weekIndex]++;
    }
  }

  let successfulWeeks = 0;
  for (const count of weeklyCounts) {
    if (count >= 1) {
      successfulWeeks++;
    }
  }

  const consistencyRatio = successfulWeeks / windowWeeks;
  return Math.round(consistencyRatio * 100);
}

/**
 * Calculates detailed statistics for all muscle groups including training percentage,
 * total volume, and recovery gaps.
 */
export function calculateMuscleGroupStats(
  sessions: WorkoutSession[],
  refDate: Date = new Date()
): Record<MuscleGroup, MuscleGroupStats> {
  const completed = sessions.filter((s) => s.status === 'completed');
  
  const volumeMap: Record<MuscleGroup, number> = {
    chest: 0, back: 0, shoulders: 0, biceps: 0, triceps: 0, forearms: 0,
    quadriceps: 0, hamstrings: 0, calves: 0, glutes: 0, abs: 0, cardio: 0,
    'full-body': 0, other: 0
  };

  const setCounts: Record<MuscleGroup, number> = {
    chest: 0, back: 0, shoulders: 0, biceps: 0, triceps: 0, forearms: 0,
    quadriceps: 0, hamstrings: 0, calves: 0, glutes: 0, abs: 0, cardio: 0,
    'full-body': 0, other: 0
  };

  let totalSets = 0;

  for (const s of completed) {
    const sessionVolume = calculateMuscleGroupVolume(s.exercises);
    for (const key of Object.keys(sessionVolume) as MuscleGroup[]) {
      volumeMap[key] += sessionVolume[key];
    }

    for (const ex of s.exercises) {
      const completedSets = ex.sets.filter((st) => st.completed).length;
      setCounts[ex.primaryMuscleGroup] += completedSets;
      totalSets += completedSets;
    }
  }

  const gaps = calculateRecoveryGaps(sessions, refDate);
  const stats: Partial<Record<MuscleGroup, MuscleGroupStats>> = {};

  for (const key of Object.keys(volumeMap) as MuscleGroup[]) {
    const setPercent = totalSets > 0 ? Math.round((setCounts[key] / totalSets) * 100) : 0;
    stats[key] = {
      muscleGroup: key,
      volume: Math.round(volumeMap[key] * 10) / 10,
      setPercentage: setPercent,
      daysSinceLastTrained: gaps[key],
    };
  }

  return stats as Record<MuscleGroup, MuscleGroupStats>;
}

/**
 * Calculates muscle group balance categories (Push vs Pull vs Legs vs Core vs Cardio).
 */
export interface MuscleBalance {
  readonly pushVolume: number;
  readonly pullVolume: number;
  readonly legsVolume: number;
  readonly coreVolume: number;
  readonly cardioDurationSeconds: number;
}

export function calculateMuscleBalance(sessions: WorkoutSession[]): MuscleBalance {
  const completed = sessions.filter((s) => s.status === 'completed');
  
  let push = 0;
  let pull = 0;
  let legs = 0;
  let core = 0;
  let cardioSec = 0;

  for (const s of completed) {
    for (const ex of s.exercises) {
      let exerciseVolume = 0;
      let completedAny = false;
      for (const set of ex.sets) {
        if (set.completed) {
          completedAny = true;
          if (set.type !== 'warmup') {
            exerciseVolume += set.weight * set.reps;
          }
        }
      }

      if (!completedAny) continue;

      const group = ex.primaryMuscleGroup;
      if (group === 'chest' || group === 'shoulders' || group === 'triceps') {
        push += exerciseVolume;
      } else if (group === 'back' || group === 'biceps' || group === 'forearms') {
        pull += exerciseVolume;
      } else if (group === 'quadriceps' || group === 'hamstrings' || group === 'calves' || group === 'glutes') {
        legs += exerciseVolume;
      } else if (group === 'abs') {
        core += exerciseVolume;
      } else if (group === 'cardio') {
        // Cardio represents duration in seconds stored in reps for cardio exercises
        for (const set of ex.sets) {
          if (set.completed) {
            cardioSec += set.reps;
          }
        }
      }
    }
  }

  return {
    pushVolume: Math.round(push),
    pullVolume: Math.round(pull),
    legsVolume: Math.round(legs),
    coreVolume: Math.round(core),
    cardioDurationSeconds: cardioSec,
  };
}

/**
 * Builds array of FeatureAnalytics for unified Insights Engine correlation.
 */
export function buildWorkoutAnalytics(
  sessions: WorkoutSession[],
  prs: PersonalRecord[],
  targetWorkoutsPerWeek = 3,
  refDate: Date = new Date()
): FeatureAnalytics[] {
  const completed = sessions.filter((s) => s.status === 'completed');
  const now = refDate;

  // 1. Calculate average workout frequency in past 4 weeks
  const past30DaysMs = 30 * 24 * 60 * 60 * 1000;
  const recentWorkouts = completed.filter((s) => now.getTime() - s.startedAt.getTime() <= past30DaysMs);
  const weeklyWorkoutsVal = Math.round((recentWorkouts.length / 4) * 10) / 10;
  
  const frequencyScore = Math.min(10, Math.round((weeklyWorkoutsVal / targetWorkoutsPerWeek) * 10));

  // 2. Average training volume per session
  let totalVolume = 0;
  let totalDuration = 0;
  let rpeSum = 0;
  let rpeCount = 0;

  for (const s of recentWorkouts) {
    totalVolume += s.totalVolume;
    totalDuration += s.durationSeconds;
    
    // Average RPE
    const totals = calculateSessionTotals(s.exercises, s.startedAt, s.completedAt, s.durationSeconds);
    if (totals.averageRPE) {
      rpeSum += totals.averageRPE;
      rpeCount++;
    }
  }

  const avgVolume = recentWorkouts.length > 0 ? Math.round(totalVolume / recentWorkouts.length) : 0;
  const avgDurationMin = recentWorkouts.length > 0 ? Math.round((totalDuration / recentWorkouts.length) / 60) : 0;
  const avgRPE = rpeCount > 0 ? Math.round((rpeSum / rpeCount) * 10) / 10 : 7.0;

  // Consistency Score
  const consistencyScore = calculateWorkoutConsistency(sessions, targetWorkoutsPerWeek, 4, now);

  // Volume Trend: compare last 2 weeks vs previous 2 weeks
  const msIn14Days = 14 * 24 * 60 * 60 * 1000;
  const last14DaysVolume = completed
    .filter((s) => now.getTime() - s.startedAt.getTime() <= msIn14Days)
    .reduce((sum, s) => sum + s.totalVolume, 0);
  const prev14DaysVolume = completed
    .filter((s) => {
      const diff = now.getTime() - s.startedAt.getTime();
      return diff > msIn14Days && diff <= 2 * msIn14Days;
    })
    .reduce((sum, s) => sum + s.totalVolume, 0);

  let volumeTrend: 'improving' | 'declining' | 'stable' = 'stable';
  if (last14DaysVolume > prev14DaysVolume * 1.05) {
    volumeTrend = 'improving';
  } else if (last14DaysVolume < prev14DaysVolume * 0.95) {
    volumeTrend = 'declining';
  }

  return [
    {
      feature: 'workout',
      metric: 'weekly-workouts',
      value: weeklyWorkoutsVal,
      score: frequencyScore,
      trend: weeklyWorkoutsVal >= targetWorkoutsPerWeek ? 'improving' : 'stable',
      timestamp: now,
    },
    {
      feature: 'workout',
      metric: 'average-volume',
      value: avgVolume,
      score: Math.min(10, Math.round((avgVolume / 5000) * 10)), // scaled relative to 5000kg
      trend: volumeTrend,
      timestamp: now,
    },
    {
      feature: 'workout',
      metric: 'average-duration',
      value: avgDurationMin,
      score: Math.min(10, Math.round((avgDurationMin / 60) * 10)),
      trend: 'stable',
      timestamp: now,
    },
    {
      feature: 'workout',
      metric: 'consistency',
      value: consistencyScore,
      score: Math.round(consistencyScore / 10),
      trend: consistencyScore >= 80 ? 'improving' : 'stable',
      timestamp: now,
    },
    {
      feature: 'workout',
      metric: 'average-intensity',
      value: avgRPE,
      score: Math.round(avgRPE),
      trend: 'stable',
      timestamp: now,
    },
    {
      feature: 'workout',
      metric: 'personal-records',
      value: prs.length,
      score: Math.min(10, prs.length),
      trend: 'improving',
      timestamp: now,
    },
  ];
}
