/**
 * Schedule Quality Scoring Engine
 * SelfOS v3.1.0 — Batch 14B
 */

import type { TimeBlock } from '../domain/calendar.types';

export class ScheduleScoreEngine {
  static evaluateScore(blocks: readonly TimeBlock[]): number {
    if (blocks.length === 0) return 100;

    let score = 85;
    const deepWorkBlocks = blocks.filter((b) => b.type === 'deep_work').length;
    score += deepWorkBlocks * 5; // Reward deep work

    // Context switching penalty
    if (blocks.length > 6) {
      score -= (blocks.length - 6) * 3;
    }

    return Math.min(100, Math.max(0, Math.round(score)));
  }
}
export default ScheduleScoreEngine;
