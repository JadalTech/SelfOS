/**
 * Notification Policy Manager
 * SelfOS v3.0.0 — Batch 14A
 */

export class NotificationPolicy {
  shouldSendPlanningReminder(hour: number): boolean {
    return hour === 8 || hour === 20; // 8 AM or 8 PM planning prompts
  }
}

export const notificationPolicy = new NotificationPolicy();
export default notificationPolicy;
