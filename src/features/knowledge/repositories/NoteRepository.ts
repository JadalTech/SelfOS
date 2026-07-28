/**
 * Note Repository
 * SelfOS v3.2.0 — Batch 14C
 */

import type { Note } from '../domain/knowledge.types';
import type { IProductivityRepository } from '../../productivity/domain/IProductivityRepository';
import { ok } from '../../../../shared/types';
import type { Result } from '../../../../shared/types';
import { AppError } from '../../../../shared/errors/AppError';

export class NoteRepository implements IProductivityRepository<Note> {
  private readonly items = new Map<string, Note>();

  async getById(id: string): Promise<Result<Note | null, AppError>> {
    return ok(this.items.get(id) || null);
  }

  async getAll(userId: string): Promise<Result<readonly Note[], AppError>> {
    const userNotes = Array.from(this.items.values()).filter((n) => n.userId === userId);
    return ok(userNotes);
  }

  async save(note: Note): Promise<Result<Note, AppError>> {
    this.items.set(note.id, note);
    return ok(note);
  }

  async delete(id: string): Promise<Result<boolean, AppError>> {
    const deleted = this.items.delete(id);
    return ok(deleted);
  }
}

export const noteRepository = new NoteRepository();
