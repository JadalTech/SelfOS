/**
 * Task Test Factory
 * SelfOS Testing Infrastructure
 *
 * Provides reusable factories for Task items across features.
 */

export interface TaskTestModel {
  id: string;
  userId: string;
  title: string;
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  module: 'routine' | 'workout' | 'nutrition' | 'skincare' | 'haircare' | 'sleep';
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export function buildTask(overrides: Partial<TaskTestModel> = {}): TaskTestModel {
  const timestamp = new Date().toISOString();
  return {
    id: `task_${Math.random().toString(36).substring(2, 9)}`,
    userId: 'user_default_123',
    title: 'Log Evening Skincare Routine',
    status: 'pending',
    dueDate: new Date().toISOString().split('T')[0],
    priority: 'medium',
    module: 'skincare',
    metadata: { stepCount: 4 },
    createdAt: timestamp,
    updatedAt: timestamp,
    ...overrides,
  };
}

export function buildCompletedTask(overrides: Partial<TaskTestModel> = {}): TaskTestModel {
  return buildTask({
    status: 'completed',
    ...overrides,
  });
}
