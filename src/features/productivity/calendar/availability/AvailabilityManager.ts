/**
 * Availability Profile Manager
 * SelfOS v3.1.0 — Batch 14B
 */

import type { AvailabilityProfile, AvailabilityWindow } from '../domain/calendar.types';

export class AvailabilityManager {
  private static readonly PROFILES: Record<string, AvailabilityProfile> = {
    work: {
      profileId: 'prof_work',
      name: 'work',
      windows: [
        { dayOfWeek: 1, startHour: 9, endHour: 17 },
        { dayOfWeek: 2, startHour: 9, endHour: 17 },
        { dayOfWeek: 3, startHour: 9, endHour: 17 },
        { dayOfWeek: 4, startHour: 9, endHour: 17 },
        { dayOfWeek: 5, startHour: 9, endHour: 17 },
      ],
      quietHoursStart: 22,
      quietHoursEnd: 7,
    },
    weekend: {
      profileId: 'prof_weekend',
      name: 'weekend',
      windows: [
        { dayOfWeek: 0, startHour: 10, endHour: 15 },
        { dayOfWeek: 6, startHour: 10, endHour: 15 },
      ],
      quietHoursStart: 23,
      quietHoursEnd: 8,
    },
  };

  static getProfile(name: 'work' | 'weekend'): AvailabilityProfile {
    return this.PROFILES[name] || this.PROFILES.work;
  }
}
export default AvailabilityManager;
