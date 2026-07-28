/**
 * Presentation ViewModels for Productivity Module
 * SelfOS v3.0.0 — Batch 14A
 */

import { useState } from 'react';
import { useAuthStore } from '../../../../shared/stores/auth.store';
import { goalService, goalRepository } from '../../goals/GoalService';
import { taskService, taskRepository } from '../../tasks/TaskService';
import { projectService, projectRepository } from '../../projects/ProjectService';
import type { Goal, Task, Project } from '../../domain/productivity.types';

export function useGoalsViewModel() {
  const userId = useAuthStore((s) => s.user?.uid);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchGoals = async () => {
    if (!userId) return;
    setLoading(true);
    const res = await goalRepository.getAll(userId);
    if (res.success) setGoals([...res.data]);
    setLoading(false);
  };

  const createGoal = async (title: string, category: Goal['category'], targetDate: Date) => {
    if (!userId) return;
    const newGoal = await goalService.createGoal(userId, title, category, targetDate);
    setGoals((prev) => [...prev, newGoal]);
  };

  return { goals, loading, fetchGoals, createGoal };
}

export function useTasksViewModel() {
  const userId = useAuthStore((s) => s.user?.uid);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTasks = async () => {
    if (!userId) return;
    setLoading(true);
    const res = await taskRepository.getAll(userId);
    if (res.success) setTasks([...res.data]);
    setLoading(false);
  };

  const createTask = async (title: string, category: Task['category'], priority: Task['priority']) => {
    if (!userId) return;
    const newTask = await taskService.createTask(userId, title, category, priority);
    setTasks((prev) => [...prev, newTask]);
  };

  return { tasks, loading, fetchTasks, createTask };
}
