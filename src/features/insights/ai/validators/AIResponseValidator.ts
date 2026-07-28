/**
 * AI Response Safety Validator
 * SelfOS v1.5.0 — Batch 12C
 */

import { AppError } from '../../../../shared/errors/AppError';
import type { HealthSummary } from '../types/ai.types';

export class AIResponseValidator {
  /**
   * Enforces safety boundaries (medical claims firewall) and schema integrity.
   */
  static validateHealthSummary(raw: Partial<HealthSummary>): HealthSummary {
    let wins = raw.wins || [];
    let areasForImprovement = raw.areasForImprovement || [];
    let priorityRecommendation = raw.priorityRecommendation || 'Continue tracking routine schedules.';
    let motivation = raw.motivation || 'Keep it up!';

    // 1. Enforce No Diagnostics / Medical claims
    const medicalRedFlags = ['diagnose', 'disease', 'cure', 'prescribe', 'treatment', 'medical', 'medication'];
    const sanitize = (text: string) => {
      let clean = text;
      medicalRedFlags.forEach((flag) => {
        if (clean.toLowerCase().includes(flag)) {
          clean = clean.replace(new RegExp(flag, 'gi'), 'general wellness focus');
        }
      });
      return clean;
    };

    wins = wins.map(sanitize);
    areasForImprovement = areasForImprovement.map(sanitize);
    priorityRecommendation = sanitize(priorityRecommendation);
    motivation = sanitize(motivation);

    const defaultExplainability = {
      reasoning: 'Derived from active health metrics logs.',
      supportingInsights: [],
      referencedMetrics: {},
      sourceModules: [],
      confidence: 0.8,
      generatedFrom: 'pipeline_fallback',
    };

    const defaultVersioning = {
      promptVersion: '1.0',
      templateVersion: '1.0',
      providerVersion: 'fallback-1.0',
      generatedAt: new Date(),
    };

    return {
      overallHealthScore: raw.overallHealthScore ?? 7,
      wins,
      areasForImprovement,
      priorityRecommendation,
      motivation,
      explainability: raw.explainability || defaultExplainability,
      versioning: raw.versioning || defaultVersioning,
    };
  }
}
export default AIResponseValidator;
