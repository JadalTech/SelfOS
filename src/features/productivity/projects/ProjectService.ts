/**
 * Project Progress Engine & Storage Service
 * SelfOS v3.0.0 — Batch 14A
 */

import type { Project, Task } from '../domain/productivity.types';
import type { IProductivityRepository } from '../domain/IProductivityRepository';
import { ok } from '../../../shared/types';
import type { Result } from '../../../shared/types';
import { AppError } from '../../../shared/errors/AppError';
import { productivityEventBus } from '../events/ProductivityEventBus';

export class ProjectProgressEngine {
  static calculateProjectProgress(project: Project, projectTasks: readonly Task[]): number {
    if (projectTasks.length === 0) return project.progressPercentage;
    const completedTasks = projectTasks.filter((t) => t.status === 'completed').length;
    return Math.round((completedTasks / projectTasks.length) * 100);
  }
}

export class ProjectRepository implements IProductivityRepository<Project> {
  private readonly items = new Map<string, Project>();

  async getById(id: string): Promise<Result<Project | null, AppError>> {
    return ok(this.items.get(id) || null);
  }

  async getAll(userId: string): Promise<Result<readonly Project[], AppError>> {
    const userProjects = Array.from(this.items.values()).filter((p) => p.userId === userId);
    return ok(userProjects);
  }

  async save(project: Project): Promise<Result<Project, AppError>> {
    this.items.set(project.id, project);
    return ok(project);
  }

  async delete(id: string): Promise<Result<boolean, AppError>> {
    const deleted = this.items.delete(id);
    return ok(deleted);
  }
}

export const projectRepository = new ProjectRepository();

export class ProjectService {
  async createProject(userId: string, title: string, category: Project['category'], targetEndDate: Date): Promise<Project> {
    const newProject: Project = {
      id: `proj_${Date.now()}`,
      userId,
      title,
      category,
      status: 'active',
      milestones: [],
      progressPercentage: 0,
      startDate: new Date(),
      targetEndDate,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await projectRepository.save(newProject);
    productivityEventBus.emit('ProjectStarted', { projectId: newProject.id, title });
    return newProject;
  }
}

export const projectService = new ProjectService();
