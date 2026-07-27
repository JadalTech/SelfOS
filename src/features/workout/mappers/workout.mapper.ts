/**
 * Presentation Mappers for Workout Module
 */

import type {
  Exercise,
  ExerciseSet,
  WorkoutExercise,
  WorkoutPlan,
  WorkoutSession,
  WorkoutTemplate,
  PersonalRecord,
  WeeklyWorkoutSummary,
  MuscleGroup,
} from '../types/workout.types';
import type {
  ExerciseVM,
  ExerciseSetVM,
  WorkoutExerciseVM,
  WorkoutPlanVM,
  WorkoutSessionVM,
  WorkoutTemplateVM,
  PersonalRecordVM,
  WeeklyWorkoutSummaryVM,
} from '../types/viewmodel.types';
import {
  MUSCLE_GROUP_OPTIONS,
  EXERCISE_CATEGORY_OPTIONS,
  EQUIPMENT_OPTIONS,
  DIFFICULTY_OPTIONS,
  SET_TYPE_OPTIONS,
  PERSONAL_RECORD_TYPE_OPTIONS,
  STANDARD_EXERCISES,
} from '../constants/workout.constants';

export function mapToExerciseVM(ex: Exercise): ExerciseVM {
  const primaryOpt = MUSCLE_GROUP_OPTIONS.find((o) => o.value === ex.primaryMuscleGroup);
  const primaryMuscleGroupLabel = primaryOpt ? primaryOpt.label : ex.primaryMuscleGroup;

  const secLabels = (ex.secondaryMuscleGroups || []).map((sg) => {
    const opt = MUSCLE_GROUP_OPTIONS.find((o) => o.value === sg);
    return opt ? opt.label : sg;
  });
  const secondaryMuscleGroupsLabel = secLabels.length > 0 ? secLabels.join(', ') : 'None';

  const equipOpt = EQUIPMENT_OPTIONS.find((o) => o.value === ex.equipment);
  const equipmentLabel = equipOpt ? equipOpt.label : ex.equipment;

  const catOpt = EXERCISE_CATEGORY_OPTIONS.find((o) => o.value === ex.category);
  const categoryLabel = catOpt ? catOpt.label : ex.category;

  const diffOpt = DIFFICULTY_OPTIONS.find((o) => o.value === ex.difficulty);
  const difficultyLabel = diffOpt ? diffOpt.label : ex.difficulty;

  const unilateralLabel = ex.unilateral ? 'Unilateral' : 'Bilateral';
  
  let defaultRestDurationLabel = 'None';
  if (ex.defaultRestDurationSeconds) {
    const mins = Math.floor(ex.defaultRestDurationSeconds / 60);
    const secs = ex.defaultRestDurationSeconds % 60;
    defaultRestDurationLabel = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  }

  const defaultUnitLabel = ex.defaultUnit.toUpperCase();

  return {
    id: ex.id,
    name: ex.name,
    primaryMuscleGroup: ex.primaryMuscleGroup,
    primaryMuscleGroupLabel,
    secondaryMuscleGroups: ex.secondaryMuscleGroups || [],
    secondaryMuscleGroupsLabel,
    equipment: ex.equipment,
    equipmentLabel,
    category: ex.category,
    categoryLabel,
    difficulty: ex.difficulty,
    difficultyLabel,
    unilateral: ex.unilateral,
    unilateralLabel,
    defaultRestDurationSeconds: ex.defaultRestDurationSeconds,
    defaultRestDurationLabel,
    defaultUnit: ex.defaultUnit,
    defaultUnitLabel,
    instructions: ex.instructions || [],
    source: ex.source,
    isCustom: ex.source === 'user',
  };
}

export function mapToExerciseSetVM(set: ExerciseSet, defaultUnit = 'kg'): ExerciseSetVM {
  const typeOpt = SET_TYPE_OPTIONS.find((o) => o.value === set.type);
  const typeLabel = typeOpt ? typeOpt.label : set.type;

  const weightLabel = set.type === 'warmup' ? `${set.weight} ${defaultUnit} (Warm Up)` : `${set.weight} ${defaultUnit}`;
  const repsLabel = `${set.reps} reps`;

  return {
    id: set.id,
    type: set.type,
    typeLabel,
    weight: set.weight,
    weightLabel,
    reps: set.reps,
    repsLabel,
    completed: set.completed,
    rpe: set.rpe,
    rpeLabel: set.rpe ? `RPE ${set.rpe}` : undefined,
    restTimeSeconds: set.restTimeSeconds,
    restTimeLabel: set.restTimeSeconds ? `${set.restTimeSeconds}s` : undefined,
  };
}

export function mapToWorkoutExerciseVM(ex: WorkoutExercise): WorkoutExerciseVM {
  const catOpt = EXERCISE_CATEGORY_OPTIONS.find((o) => o.value === ex.exerciseCategory);
  const exerciseCategoryLabel = catOpt ? catOpt.label : ex.exerciseCategory;

  const primaryOpt = MUSCLE_GROUP_OPTIONS.find((o) => o.value === ex.primaryMuscleGroup);
  const primaryMuscleGroupLabel = primaryOpt ? primaryOpt.label : ex.primaryMuscleGroup;

  const setsVM = ex.sets.map((s) => mapToExerciseSetVM(s));

  const name = ex.exerciseName;
  const setsCountLabel = `${ex.sets.length} Set${ex.sets.length === 1 ? '' : 's'}`;

  const setsSummaryLabel = ex.sets.length > 0
    ? ex.sets.map((s) => `${s.weight}kg x ${s.reps}`).join(' | ')
    : 'No sets';

  const catalogEx = STANDARD_EXERCISES.find((e) => e.id === ex.exerciseId);
  const equipment = catalogEx ? catalogEx.equipment : 'other';
  const equipOpt = EQUIPMENT_OPTIONS.find((o) => o.value === equipment);
  const equipmentLabel = equipOpt ? equipOpt.label : 'Strength';

  return {
    id: ex.id,
    exerciseId: ex.exerciseId,
    exerciseName: ex.exerciseName,
    exerciseCategory: ex.exerciseCategory,
    exerciseCategoryLabel,
    primaryMuscleGroup: ex.primaryMuscleGroup,
    primaryMuscleGroupLabel,
    sets: setsVM,
    setsCount: ex.sets.length,
    setsCompletedCount: ex.sets.filter((s) => s.completed).length,
    notes: ex.notes || '',
    name,
    setsCountLabel,
    setsSummaryLabel,
    equipmentLabel,
  };
}

export function mapToWorkoutPlanVM(plan: WorkoutPlan): WorkoutPlanVM {
  const exercisesVM = plan.exercises.map(mapToWorkoutExerciseVM);

  const scheduleLabel = plan.targetDaysPerWeek ? `${plan.targetDaysPerWeek} days/week` : 'Flexible';
  const exercisesCountLabel = `${plan.exercises.length} exercise${plan.exercises.length === 1 ? '' : 's'}`;

  const muscleGroups = Array.from(new Set(plan.exercises.map((ex) => ex.primaryMuscleGroup)));
  const muscleGroupLabels = muscleGroups.map((g) => {
    const opt = MUSCLE_GROUP_OPTIONS.find((o) => o.value === g);
    return opt ? opt.label : g;
  });

  return {
    id: plan.id,
    name: plan.name,
    description: plan.description || '',
    exercises: exercisesVM,
    exercisesCount: plan.exercises.length,
    targetDaysPerWeek: plan.targetDaysPerWeek,
    targetDaysPerWeekLabel: plan.targetDaysPerWeek ? `${plan.targetDaysPerWeek} days/week` : undefined,
    isActive: plan.isActive,
    isActiveLabel: plan.isActive ? 'Active' : 'Inactive',
    scheduleLabel,
    exercisesCountLabel,
    muscleGroupLabels,
  };
}

function formatDuration(seconds: number): string {
  if (seconds <= 0) return '0s';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts = [];
  if (hrs > 0) parts.push(`${hrs}h`);
  if (mins > 0) parts.push(`${mins}m`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);

  return parts.join(' ');
}

export function mapToWorkoutSessionVM(session: WorkoutSession): WorkoutSessionVM {
  const exercisesVM = session.exercises.map(mapToWorkoutExerciseVM);

  const statusLabel = session.status.charAt(0).toUpperCase() + session.status.slice(1);
  
  const startedAtFormatted = session.startedAt.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const completedAtFormatted = session.completedAt
    ? session.completedAt.toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : undefined;

  const totalVolumeLabel = `${session.totalVolume} kg`;
  const totalRepsLabel = `${session.totalReps} reps`;

  let estimatedIntensity = 'Moderate Intensity';
  if (session.estimatedIntensity === 'high') {
    estimatedIntensity = 'High Intensity';
  } else if (session.estimatedIntensity === 'low') {
    estimatedIntensity = 'Low Intensity';
  }

  const averageRPELabel = session.averageRPE ? `Avg RPE: ${session.averageRPE}` : undefined;
  const averageRestDurationLabel = session.averageRestDuration ? `${session.averageRestDuration}s` : undefined;
  const caloriesBurnedLabel = session.caloriesBurned ? `${session.caloriesBurned} kcal` : undefined;

  return {
    id: session.id,
    name: session.name,
    status: session.status,
    statusLabel,
    exercises: exercisesVM,
    startedAt: startedAtFormatted,
    completedAt: completedAtFormatted,
    durationFormatted: formatDuration(session.durationSeconds),
    durationSeconds: session.durationSeconds,
    notes: session.notes || '',
    totalVolume: session.totalVolume,
    totalVolumeLabel,
    totalReps: session.totalReps,
    totalRepsLabel,
    estimatedIntensity,
    averageRPE: session.averageRPE,
    averageRPELabel,
    averageRestDurationLabel,
    caloriesBurned: session.caloriesBurned,
    caloriesBurnedLabel,
  };
}

export function mapToWorkoutTemplateVM(template: WorkoutTemplate): WorkoutTemplateVM {
  const exercisesVM = template.exercises.map(mapToWorkoutExerciseVM);

  return {
    id: template.id,
    name: template.name,
    description: template.description || '',
    exercises: exercisesVM,
    exercisesCount: template.exercises.length,
  };
}

export function mapToPersonalRecordVM(pr: PersonalRecord): PersonalRecordVM {
  const typeOpt = PERSONAL_RECORD_TYPE_OPTIONS.find((o) => o.value === pr.type);
  const typeLabel = typeOpt ? typeOpt.label : pr.type;

  let valueLabel = `${pr.value} ${pr.unit}`;
  if (pr.type === 'longest-duration' || pr.type === 'fastest-time') {
    valueLabel = formatDuration(pr.value);
  }

  const dateFormatted = new Date(pr.date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return {
    id: pr.id,
    exerciseId: pr.exerciseId,
    exerciseName: pr.exerciseName,
    type: pr.type,
    typeLabel,
    value: pr.value,
    valueLabel,
    unit: pr.unit,
    dateFormatted,
    sessionId: pr.sessionId,
  };
}

export function mapToWeeklyWorkoutSummaryVM(summary: WeeklyWorkoutSummary): WeeklyWorkoutSummaryVM {
  const dateObj = new Date(summary.weekStartDate);
  const weekStartDateFormatted = dateObj.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });

  const muscleGroupFreqVM = (Object.entries(summary.muscleGroupFrequency) as [MuscleGroup, number][])
    .map(([group, count]) => {
      const opt = MUSCLE_GROUP_OPTIONS.find((o) => o.value === group);
      const label = opt ? opt.label : group;
      return { muscleGroup: group, label, count };
    })
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count);

  return {
    weekStartDate: summary.weekStartDate,
    weekStartDateFormatted,
    workoutCount: summary.workoutCount,
    workoutCountLabel: `${summary.workoutCount} workouts`,
    totalVolumeLabel: `${summary.totalVolume} kg`,
    totalRepsLabel: `${summary.totalReps} reps`,
    totalDurationFormatted: formatDuration(summary.totalDurationSeconds),
    muscleGroupFrequency: muscleGroupFreqVM,
    caloriesBurnedLabel: `${summary.caloriesBurned} kcal`,
    personalRecordsCount: summary.personalRecordsCount,
    personalRecordsCountLabel: `${summary.personalRecordsCount} PRs`,
  };
}
