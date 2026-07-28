/**
 * Decoupled External Calendar Sync Provider Interface
 * SelfOS v3.1.0 — Batch 14B
 */

import type { CalendarEvent } from './calendar.types';
import type { Result } from '../../../../shared/types';
import { AppError } from '../../../../shared/errors/AppError';

export interface ICalendarSyncProvider {
  readonly providerName: 'google' | 'apple' | 'outlook';
  fetchExternalEvents(startDate: Date, endDate: Date): Promise<Result<readonly CalendarEvent[], AppError>>;
  syncEventToExternal(event: CalendarEvent): Promise<Result<boolean, AppError>>;
}
export default ICalendarSyncProvider;
