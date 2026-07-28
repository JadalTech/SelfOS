/**
 * Calendar Analytics Engine
 * SelfOS v3.1.0 — Batch 14B
 */

import type { TimeBlock, CalendarAnalytics } from '../domain/calendar.types';

export class CalendarAnalyticsEngine {
  static computeAnalytics(blocks: readonly TimeBlock[]): CalendarAnalytics {
    let scheduledMinutes = 0;
    let focusMinutes = 0;
    let meetingMinutes = 0;
    let recoveryMinutes = 0;

    for (const b of blocks) {
      const dur = (b.endTime.getTime() - b.startTime.getTime()) / (1000 * 60);
      scheduledMinutes += dur;

      if (b.type === 'deep_work') focusMinutes += dur;
      if (b.type === 'meeting') meetingMinutes += dur;
      if (b.type === 'recovery' || b.type === 'break') recoveryMinutes += dur;
    }

    const totalHours = Math.round((scheduledMinutes / 60) * 10) / 10;
    const focusHours = Math.round((focusMinutes / 60) * 10) / 10;
    const deepWorkRatio = scheduledMinutes > 0 ? Math.round((focusMinutes / scheduledMinutes) * 100) / 100 : 0;

    return {
      scheduledHours: totalHours,
      focusHours,
      meetingHours: Math.round((meetingMinutes / 60) * 10) / 10,
      recoveryHours: Math.round((recoveryMinutes / 60) * 10) / 10,
      deepWorkRatio,
      contextSwitches: blocks.length,
    };
  }
}
export default CalendarAnalyticsEngine;
