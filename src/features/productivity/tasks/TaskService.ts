/**
 * Task Engine & Storage Service
 * SelfOS v3.0.0 — Batch 14A
 */

import type { Task, TaskStatus } from '../domain/productivity.types';
import type { IProductivityRepository } from '../domain/IProductivityRepository';
import { ok, err } from '../../../shared/types';
import type { Result } from '../../../shared/types';
import { AppError } from '../../../shared/errors/AppError';
import { TaskLifecycle } from '../lifecycle/ProductivityLifecycles';
import { productivityEventBus } from '../events/ProductivityEventBus';

export class TaskEngine {
  static filterByStatus(tasks: readonly Task[], status: TaskStatus): Task[] {
    return tasks.filter((t) => t.status === status);
  }
}

export class TaskRepository implements IProductivityRepository<Task> {
  private readonly items = new Map<string, Task>();

  async getById(id: string): Promise<Result<Task | null, AppError>> {
    return ok(this.items.get(id) || null);
  }

  async getAll(userId: string): Promise<Result<readonly Task[], AppError>> {
    const userTasks = Array.from(this.items.values()).filter((t) => t.userId === userId);
    return ok(userTasks);
  }

  async save(task: Task): Promise<Result<Task, AppError>> {
    this.items.set(task.id, task);
    return ok(task);
  }

  async delete(id: string): Promise<Result<boolean, AppError>> {
    const deleted = this.items.delete(id);
    return ok(deleted);
  }
}

export const taskRepository = new TaskRepository();

export class TaskService {
  async createTask(
    userId: string,
    title: string,
    category: Task['category'],
    priority: Task['priority'],
    estimatedMinutes = 30
  ): Promise<Task> {
    const newTask: Task = {
      id: `task_${Date.now()}`,
      userId,
      title,
      category,
      priority,
      status: 'created',
      tags: [],
      subtasks: [],
      estimatedMinutes,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await taskRepository.save(newTask);
    productivityEventBus.emit('TaskCreated', { taskId: newTask.id, title });
    return newTask;
  }

  async updateStatus(taskId: string, newStatus: TaskStatus): Promise<Result<Task, AppError>> {
    const fetchRes = await taskRepository.getById(taskId);
    if (!fetchRes.success || !fetchRes.data) {
      return err(new AppError('NOT_FOUND', `Task ${taskId} not found.`));
    }

    const currentTask = fetchRes.data;
    if (!TaskLifecycle.isValidTransition(currentTask.status, newStatus)) {
      return err(new AppError('VALIDATION_ERROR', `Invalid task transition from ${currentTask.status} to ${newStatus}`));
    }

    const updatedTask: Task = {
      ...currentTask,
      status: newStatus,
      updatedAt: new Date(),
    };

    await taskRepository.save(updatedTask);

    if (newStatus === 'completed') {
      productivityEventBus.emit('TaskCompleted', { taskId: updatedTask.id });
    }

    return ok(updatedTask);
  }
}

export const taskService = new TaskService();
