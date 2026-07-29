/**
 * Routine Test Factory
 * SelfOS Testing Infrastructure
 *
 * Provides reusable factories for Routine entity, RoutineLog, and Frequency configurations.
 */

export interface RoutineTestModel {
  id: string;
  userId: string;
  title: string;
  description?: string;
  category: 'health' | 'fitness' | 'skincare' | 'haircare' | 'nutrition' | 'mindfulness';
  frequency: {
    type: 'daily' | 'weekly' | 'custom_days';
    daysOfWeek?: number[]; // 0 = Sunday, 1 = Monday, etc.
    timesPerDay?: number;
  };
  reminderTime?: string; // HH:mm format
  streak: {
    current: number;
    best: number;
    lastCompletedDate?: string;
  };
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export function buildRoutine(overrides: Partial<RoutineTestModel> = {}): RoutineTestModel {
  const timestamp = new Date().toISOString();
  return {
    id: `routine_${Math.random().toString(36).substring(2, 9)}`,
    userId: 'user_default_123',
    title: 'Daily Morning Hydration',
    description: 'Drink 500ml water upon waking up',
    category: 'health',
    frequency: {
      type: 'daily',
      timesPerDay: 1,
    },
    reminderTime: '07:30',
    streak: {
      current: 5,
      best: 14,
      lastCompletedDate: new Date().toISOString().split('T')[0],
    },
    isArchived: false,
    createdAt: timestamp,
    updatedAt: timestamp,
    ...overrides,
  };
}

export function buildWeeklyRoutine(days: number[] = [1, 3, 5], overrides: Partial<RoutineTestModel> = {}): RoutineTestModel {
  return buildRoutine({
    title: 'Alternate Day Workout',
    category: 'fitness',
    frequency: {
      type: 'weekly',
      daysOfWeek: days,
      timesPerDay: 1,
    },
    ...overrides,
  });
}
