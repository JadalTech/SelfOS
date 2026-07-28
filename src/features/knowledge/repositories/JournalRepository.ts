/**
 * Journal Repository
 * SelfOS v3.2.0 — Batch 14C
 */

import type { JournalEntry } from '../domain/knowledge.types';
import type { IProductivityRepository } from '../../productivity/domain/IProductivityRepository';
import { ok } from '../../../../shared/types';
import type { Result } from '../../../../shared/types';
import { AppError } from '../../../../shared/errors/AppError';

export class JournalRepository implements IProductivityRepository<JournalEntry> {
  private readonly items = new Map<string, JournalEntry>();

  async getById(id: string): Promise<Result<JournalEntry | null, AppError>> {
    return ok(this.items.get(id) || null);
  }

  async getAll(userId: string): Promise<Result<readonly JournalEntry[], AppError>> {
    const userEntries = Array.from(this.items.values()).filter((j) => j.userId === userId);
    return ok(userEntries);
  }

  async save(entry: JournalEntry): Promise<Result<JournalEntry, AppError>> {
    this.items.set(entry.id, entry);
    return ok(entry);
  }

  async delete(id: string): Promise<Result<boolean, AppError>> {
    const deleted = this.items.delete(id);
    return ok(deleted);
  }
}

export const journalRepository = new JournalRepository();
