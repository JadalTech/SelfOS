/**
 * Coaching Scheduler
 * SelfOS v2.0.0 — Batch 13C
 */

export class CoachingScheduler {
  scheduleNextDailyReview(): Date {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(20, 0, 0, 0); // 8 PM
    return tomorrow;
  }
}

export const coachingScheduler = new CoachingScheduler();
export default coachingScheduler;
