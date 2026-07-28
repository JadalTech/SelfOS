/**
 * Productivity Search & Filter Service
 * SelfOS v3.0.0 — Batch 14A
 */

import type { Task } from '../domain/productivity.types';

export class ProductivitySearchService {
  static searchTasks(tasks: readonly Task[], query: string, categoryFilter?: Task['category']): Task[] {
    const q = query.toLowerCase().trim();
    return tasks.filter((t) => {
      const matchesQuery = !q || t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q);
      const matchesCategory = !categoryFilter || t.category === categoryFilter;
      return matchesQuery && matchesCategory;
    });
  }
}
export default ProductivitySearchService;
