/**
 * Workout Module Constants & Configurations
 */

import type {
  MuscleGroup,
  ExerciseCategory,
  Equipment,
  Difficulty,
  SetType,
  PersonalRecordType,
  Exercise,
} from '../types/workout.types';

export const WORKOUT_COLLECTIONS = {
  PLANS: 'workout_plans',
  SESSIONS: 'workout_sessions',
  TEMPLATES: 'workout_templates',
  HISTORY: 'workout_history',
  PERSONAL_RECORDS: 'personal_records',
  USER_EXERCISES: 'user_exercises',
} as const;

export const MUSCLE_GROUP_OPTIONS: { value: MuscleGroup; label: string; icon: string }[] = [
  { value: 'chest', label: 'Chest', icon: 'barbell-outline' },
  { value: 'back', label: 'Back', icon: 'body-outline' },
  { value: 'shoulders', label: 'Shoulders', icon: 'move-outline' },
  { value: 'biceps', label: 'Biceps', icon: 'trending-up-outline' },
  { value: 'triceps', label: 'Triceps', icon: 'trending-down-outline' },
  { value: 'forearms', label: 'Forearms', icon: 'hand-left-outline' },
  { value: 'quadriceps', label: 'Quadriceps', icon: 'footsteps-outline' },
  { value: 'hamstrings', label: 'Hamstrings', icon: 'walk-outline' },
  { value: 'calves', label: 'Calves', icon: 'ellipsis-vertical-outline' },
  { value: 'glutes', label: 'Glutes', icon: 'sparkles-outline' },
  { value: 'abs', label: 'Abs & Core', icon: 'shield-outline' },
  { value: 'cardio', label: 'Cardio', icon: 'heart-outline' },
  { value: 'full-body', label: 'Full Body', icon: 'people-outline' },
  { value: 'other', label: 'Other', icon: 'help-circle-outline' },
];

export const EXERCISE_CATEGORY_OPTIONS: { value: ExerciseCategory; label: string }[] = [
  { value: 'strength', label: 'Strength' },
  { value: 'cardio', label: 'Cardio' },
  { value: 'stretching', label: 'Stretching' },
  { value: 'plyometrics', label: 'Plyometrics' },
  { value: 'olympic', label: 'Olympic Weightlifting' },
  { value: 'other', label: 'Other' },
];

export const EQUIPMENT_OPTIONS: { value: Equipment; label: string }[] = [
  { value: 'barbell', label: 'Barbell' },
  { value: 'dumbbell', label: 'Dumbbell' },
  { value: 'kettlebell', label: 'Kettlebell' },
  { value: 'machine', label: 'Machine' },
  { value: 'cable', label: 'Cable' },
  { value: 'bodyweight', label: 'Bodyweight' },
  { value: 'bands', label: 'Resistance Bands' },
  { value: 'none', label: 'No Equipment' },
  { value: 'other', label: 'Other' },
];

export const DIFFICULTY_OPTIONS: { value: Difficulty; label: string }[] = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

export const SET_TYPE_OPTIONS: { value: SetType; label: string; abbrev: string }[] = [
  { value: 'warmup', label: 'Warm Up', abbrev: 'W' },
  { value: 'working', label: 'Working Set', abbrev: 'S' },
  { value: 'drop', label: 'Drop Set', abbrev: 'D' },
  { value: 'failure', label: 'To Failure', abbrev: 'F' },
];

export const PERSONAL_RECORD_TYPE_OPTIONS: { value: PersonalRecordType; label: string }[] = [
  { value: 'one-rep-max', label: 'Estimated 1RM' },
  { value: 'max-weight', label: 'Maximum Weight' },
  { value: 'max-reps', label: 'Maximum Repetitions' },
  { value: 'longest-duration', label: 'Longest Duration' },
  { value: 'fastest-time', label: 'Fastest Time' },
  { value: 'highest-volume', label: 'Highest Set Volume' },
];

// Pre-seeded standard exercises for the Global Exercise Catalog
export const STANDARD_EXERCISES: Exercise[] = [
  {
    id: 'global-bench-press',
    name: 'Barbell Bench Press',
    aliases: ['Flat Bench Press', 'Bench Press'],
    primaryMuscleGroup: 'chest',
    secondaryMuscleGroups: ['shoulders', 'triceps'],
    equipment: 'barbell',
    category: 'strength',
    difficulty: 'intermediate',
    unilateral: false,
    defaultRestDurationSeconds: 120,
    defaultUnit: 'kg',
    instructions: [
      'Lie flat on the bench, feet flat on the floor.',
      'Grip the barbell with hands slightly wider than shoulder-width.',
      'Unrack the bar and lower it under control to your mid-chest.',
      'Push the bar back up forcefully to full arm extension, keeping your shoulders retracted.'
    ],
    source: 'global',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  },
  {
    id: 'global-incline-db-press',
    name: 'Incline Dumbbell Press',
    primaryMuscleGroup: 'chest',
    secondaryMuscleGroups: ['shoulders', 'triceps'],
    equipment: 'dumbbell',
    category: 'strength',
    difficulty: 'intermediate',
    unilateral: false,
    defaultRestDurationSeconds: 90,
    defaultUnit: 'kg',
    instructions: [
      'Set an incline bench to around 30 to 45 degrees.',
      'Sit on the bench with dumbbells resting on your knees.',
      'Lie back and press the dumbbells up above your chest.',
      'Lower the dumbbells slowly to the sides of your upper chest, then press them back up.'
    ],
    source: 'global',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  },
  {
    id: 'global-barbell-squat',
    name: 'Barbell Back Squat',
    aliases: ['Squats', 'Back Squat'],
    primaryMuscleGroup: 'quadriceps',
    secondaryMuscleGroups: ['glutes', 'hamstrings', 'calves', 'abs'],
    equipment: 'barbell',
    category: 'strength',
    difficulty: 'intermediate',
    unilateral: false,
    defaultRestDurationSeconds: 180,
    defaultUnit: 'kg',
    instructions: [
      'Rest the barbell across your upper back (traps).',
      'Stand with feet shoulder-width apart, toes pointed slightly outward.',
      'Initiate the squat by breaking at the hips, bending your knees, and keeping your chest up.',
      'Lower until your thighs are at least parallel to the floor, then drive back up to the starting position.'
    ],
    source: 'global',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  },
  {
    id: 'global-deadlift',
    name: 'Conventional Deadlift',
    aliases: ['Barbell Deadlift'],
    primaryMuscleGroup: 'hamstrings',
    secondaryMuscleGroups: ['back', 'glutes', 'forearms', 'abs'],
    equipment: 'barbell',
    category: 'strength',
    difficulty: 'advanced',
    unilateral: false,
    defaultRestDurationSeconds: 180,
    defaultUnit: 'kg',
    instructions: [
      'Stand with feet flat under the barbell, shin close to the bar.',
      'Bend at hips and knees, gripping the bar outside shin width with flat back.',
      'Keep arms straight, chest up, and pull standard deadlift by driving your feet into the floor.',
      'Lock out hips at the top, then lower the bar under control.'
    ],
    source: 'global',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  },
  {
    id: 'global-pullup',
    name: 'Pull-up',
    aliases: ['Pullups'],
    primaryMuscleGroup: 'back',
    secondaryMuscleGroups: ['biceps', 'shoulders', 'forearms'],
    equipment: 'bodyweight',
    category: 'strength',
    difficulty: 'intermediate',
    unilateral: false,
    defaultRestDurationSeconds: 90,
    defaultUnit: 'bodyweight',
    instructions: [
      'Grasp a pull-up bar with an overhand grip, slightly wider than shoulder-width.',
      'Hang with arms fully extended.',
      'Pull your chest up toward the bar, driving your elbows down toward your sides.',
      'Lower yourself back down under control to a dead hang.'
    ],
    source: 'global',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  },
  {
    id: 'global-db-row',
    name: 'Single-Arm Dumbbell Row',
    primaryMuscleGroup: 'back',
    secondaryMuscleGroups: ['biceps', 'forearms'],
    equipment: 'dumbbell',
    category: 'strength',
    difficulty: 'beginner',
    unilateral: true,
    defaultRestDurationSeconds: 75,
    defaultUnit: 'kg',
    instructions: [
      'Place one knee and one hand on a flat bench for support.',
      'Keep your torso parallel to the ground and spine neutral.',
      'Hold a dumbbell in your free hand, letting it hang straight down.',
      'Pull the dumbbell up to your hip, keeping your elbow close to your side, then lower slowly.'
    ],
    source: 'global',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  },
  {
    id: 'global-overhead-press',
    name: 'Barbell Overhead Press',
    aliases: ['Military Press', 'OHP'],
    primaryMuscleGroup: 'shoulders',
    secondaryMuscleGroups: ['triceps', 'chest', 'abs'],
    equipment: 'barbell',
    category: 'strength',
    difficulty: 'intermediate',
    unilateral: false,
    defaultRestDurationSeconds: 120,
    defaultUnit: 'kg',
    instructions: [
      'Stand with feet shoulder-width apart and rack bar on your front shoulders.',
      'Grip the bar slightly wider than shoulders, elbows directly under the bar.',
      'Press the bar straight overhead, pulling your head back slightly to clear the bar.',
      'Lock out at the top, then lower the bar slowly to shoulder level.'
    ],
    source: 'global',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  },
  {
    id: 'global-db-curl',
    name: 'Dumbbell Bicep Curl',
    aliases: ['Bicep Curls'],
    primaryMuscleGroup: 'biceps',
    secondaryMuscleGroups: ['forearms'],
    equipment: 'dumbbell',
    category: 'strength',
    difficulty: 'beginner',
    unilateral: false,
    defaultRestDurationSeconds: 60,
    defaultUnit: 'kg',
    instructions: [
      'Stand upright holding dumbbells at your sides, palms facing forward.',
      'Squeeze biceps to curl the weights up to shoulder height, keeping elbows pinned to your sides.',
      'Lower weights slowly under control.'
    ],
    source: 'global',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  },
  {
    id: 'global-tricep-pushdown',
    name: 'Tricep Rope Pushdown',
    primaryMuscleGroup: 'triceps',
    equipment: 'cable',
    category: 'strength',
    difficulty: 'beginner',
    unilateral: false,
    defaultRestDurationSeconds: 60,
    defaultUnit: 'kg',
    instructions: [
      'Attach a rope handle to a high cable pulley.',
      'Hold the rope, lean forward slightly, and keep elbows close to your torso.',
      'Extend your arms down, pulling the rope apart at the bottom to contract your triceps.',
      'Slowly return to starting position.'
    ],
    source: 'global',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  },
  {
    id: 'global-db-lunge',
    name: 'Dumbbell Lunge',
    primaryMuscleGroup: 'quadriceps',
    secondaryMuscleGroups: ['glutes', 'hamstrings'],
    equipment: 'dumbbell',
    category: 'strength',
    difficulty: 'beginner',
    unilateral: true,
    defaultRestDurationSeconds: 90,
    defaultUnit: 'kg',
    instructions: [
      'Stand holding dumbbells at your sides.',
      'Take a large step forward with one foot.',
      'Lower your hips until your rear knee is close to the floor and front knee is at 90 degrees.',
      'Push back up through your front heel to return to the start, then alternate legs.'
    ],
    source: 'global',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  },
  {
    id: 'global-plank',
    name: 'Forearm Plank',
    aliases: ['Plank'],
    primaryMuscleGroup: 'abs',
    secondaryMuscleGroups: ['shoulders', 'glutes'],
    equipment: 'bodyweight',
    category: 'strength',
    difficulty: 'beginner',
    unilateral: false,
    defaultRestDurationSeconds: 60,
    defaultUnit: 'seconds',
    instructions: [
      'Lie face down on the floor with forearms flat on the ground, elbows under shoulders.',
      'Raise hips and rest your weight on forearms and toes.',
      'Keep your body in a straight line, squeezing core and glutes.',
      'Hold for the target duration.'
    ],
    source: 'global',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  },
  {
    id: 'global-run',
    name: 'Outdoor Running',
    aliases: ['Running', 'Jogging'],
    primaryMuscleGroup: 'cardio',
    secondaryMuscleGroups: ['quadriceps', 'hamstrings', 'calves'],
    equipment: 'none',
    category: 'cardio',
    difficulty: 'beginner',
    unilateral: false,
    defaultRestDurationSeconds: 0,
    defaultUnit: 'seconds',
    instructions: [
      'Maintain an upright torso, look forward.',
      'Land on mid-foot or fore-foot, avoiding hard heel strikes.',
      'Breathe rhythmically.'
    ],
    source: 'global',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  }
];
