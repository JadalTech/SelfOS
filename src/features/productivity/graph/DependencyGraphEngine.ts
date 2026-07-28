/**
 * Dependency Graph Engine
 * SelfOS v3.0.0 — Batch 14A
 */

import type { Task } from '../domain/productivity.types';

export class DependencyGraphEngine {
  static getBlockedTaskIds(tasks: readonly Task[]): Set<string> {
    const blockedIds = new Set<string>();

    for (const task of tasks) {
      if (task.dependsOnTaskId) {
        const prerequisite = tasks.find((t) => t.id === task.dependsOnTaskId);
        if (prerequisite && prerequisite.status !== 'completed') {
          blockedIds.add(task.id);
        }
      }
    }

    return blockedIds;
  }
}
export default DependencyGraphEngine;
