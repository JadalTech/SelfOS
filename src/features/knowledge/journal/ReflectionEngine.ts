/**
 * Reflection Engine
 * SelfOS v3.2.0 — Batch 14C
 */

import type { Reflection } from '../domain/knowledge.types';

export class ReflectionEngine {
  static generateHealthTriggeredPrompts(sleepQualityScore?: number): Reflection[] {
    const prompts: Reflection[] = [
      { reflectionId: 'r_daily', promptText: 'What was your biggest win today?' },
    ];

    if (sleepQualityScore !== undefined && sleepQualityScore < 60) {
      prompts.push({
        reflectionId: 'r_sleep',
        promptText: 'Your sleep quality was low today. How did this affect your focus and energy levels?',
        healthTriggeredReason: 'Low sleep quality score detected',
      });
    }

    return prompts;
  }
}
export default ReflectionEngine;
