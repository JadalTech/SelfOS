/**
 * Calendar Repository
 * SelfOS v3.1.0 — Batch 14B
 */

import type { CalendarEvent } from '../domain/calendar.types';
import type { IProductivityRepository } from '../../domain/IProductivityRepository';
import { ok } from '../../../../shared/types';
import type { Result } from '../../../../shared/types';
import { AppError } from '../../../../shared/errors/AppError';

export class CalendarRepository implements IProductivityRepository<CalendarEvent> {
  private readonly items = new Map<string, CalendarEvent>();

  async getById(id: string): Promise<Result<CalendarEvent | null, AppError>> {
    return ok(this.items.get(id) || null);
  }

  async getAll(userId: string): Promise<Result<readonly CalendarEvent[], AppError>> {
    const events = Array.from(this.items.values()).filter((e) => e.userId === userId);
    return ok(events);
  }

  async save(event: CalendarEvent): Promise<Result<CalendarEvent, AppError>> {
    this.items.set(event.id, event);
    return ok(event);
  }

  async delete(id: string): Promise<Result<boolean, AppError>> {
    const deleted = this.items.delete(id);
    return ok(deleted);
  }
}

export const calendarRepository = new CalendarRepository();
