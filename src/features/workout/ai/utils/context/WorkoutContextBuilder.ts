/**
 * Workout AI Context Builder
 */

import type { WorkoutAIContext } from '../../types/workoutAI.types';
import type { WorkoutPlan, WorkoutSession, PersonalRecord } from '../../../types/workout.types';
import {
  calculateWorkoutStreak,
  calculateWeeklyFrequency
} from '../../../engine/workoutEngine';
import {
  calculateVolumeTrends,
  calculateMuscleGroupStats
} from '../../../analytics/utils/workoutAnalytics';

export class WorkoutContextBuilder {
  static buildAIContext(
    activePlan: WorkoutPlan | null,
    sessions: WorkoutSession[],
    personalRecords: PersonalRecord[],
    refDate: Date = new Date()
  ): WorkoutAIContext {
    // 1. Calculate streak & weekly frequency
    const formattedSessions = sessions.map((s) => ({
      date: s.startedAt.toISOString().split('T')[0],
    }));

    const workoutStreak = calculateWorkoutStreak(formattedSessions);

    const today = refDate;
    const currentDay = today.getDay();
    const distance = currentDay === 0 ? 6 : currentDay - 1;
    const monday = new Date(today);
    monday.setDate(today.getDate() - distance);
    const mondayStr = monday.toISOString().split('T')[0];

    const weeklyFrequency = calculateWeeklyFrequency(formattedSessions, mondayStr);

    // 2. Volume trend (latest 5 completed sessions)
    const trendPoints = calculateVolumeTrends(sessions).slice(-5);
    const totalVolumeTrend = trendPoints.map((pt) => ({
      date: pt.date,
      volume: pt.volume,
    }));

    // 3. Muscle group workloads (sets percentage distribution)
    const stats = calculateMuscleGroupStats(sessions, refDate);
    const muscleWorkloads = Object.values(stats)
      .filter((st) => st.setPercentage > 0)
      .map((st) => ({
        muscleGroup: st.muscleGroup,
        percentage: st.setPercentage,
      }));

    // 4. Personal records
    const recentPersonalRecords = personalRecords.slice(0, 3).map((pr) => {
      let typeLabel = 'Record';
      switch (pr.type) {
        case 'one-rep-max':
          typeLabel = 'Est. 1RM';
          break;
        case 'max-weight':
          typeLabel = 'Max Weight';
          break;
        case 'max-reps':
          typeLabel = 'Max Reps';
          break;
        case 'longest-duration':
          typeLabel = 'Duration';
          break;
        case 'fastest-time':
          typeLabel = 'Fastest Time';
          break;
        case 'highest-volume':
          typeLabel = 'Volume';
          break;
      }

      return {
        exerciseName: pr.exerciseName,
        valueLabel: `${pr.value}${pr.unit}`,
        typeLabel,
      };
    });

    // 5. Inferred preferred equipment & goals
    const preferredEquipment = activePlan
      ? Array.from(new Set(activePlan.exercises.map((e) => e.exerciseCategory === 'cardio' ? 'none' : 'barbell'))) // mock/default inference if not set, or we can scan
      : ['dumbbell', 'barbell', 'bodyweight'];

    let userGoal = 'General Strength';
    if (activePlan) {
      const planName = activePlan.name.toLowerCase();
      const planDesc = (activePlan.description || '').toLowerCase();
      if (planName.includes('hypertrophy') || planDesc.includes('size') || planName.includes('bodybuilding')) {
        userGoal = 'Hypertrophy';
      } else if (planName.includes('powerlifting') || planName.includes('strength')) {
        userGoal = 'Power/Strength';
      } else if (planName.includes('cardio') || planDesc.includes('endurance') || planName.includes('fat loss')) {
        userGoal = 'Endurance/Fat Loss';
      }
    }

    return {
      feature: 'workout',
      activePlanName: activePlan?.name,
      targetDaysPerWeek: activePlan?.targetDaysPerWeek,
      workoutStreak,
      weeklyFrequency,
      totalVolumeTrend,
      muscleWorkloads,
      personalRecordsCount: personalRecords.length,
      recentPersonalRecords,
      preferredEquipment,
      userGoal,
      consistencyPercent: activePlan?.targetDaysPerWeek
        ? Math.round(Math.min(100, (weeklyFrequency / activePlan.targetDaysPerWeek) * 100))
        : 80,
      currentAveragesLabel: `${weeklyFrequency} sessions/week`,
    };
  }
}
