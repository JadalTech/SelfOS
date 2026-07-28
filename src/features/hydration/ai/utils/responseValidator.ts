/**
 * AI Response Validator and Safety Guard
 * SelfOS v1.4.0 — Batch 11C Revision
 */

import { DRINK_METADATA } from '../../constants/hydration.constants';
import type { HydrationAdvice } from '../types/hydrationAI.types';

export class HydrationAIResponseValidator {
  /**
   * Screens and normalizes coach advice payloads.
   *
   * Guards:
   *   1. Caps recommendations to a safe max of 1000 mL per drink.
   *   2. Prevents empty recommendations.
   *   3. Detects and sanitizes unrealistic advice.
   */
  static validateAdvice(raw: Partial<HydrationAdvice>): HydrationAdvice {
    const text = raw.text?.trim() || 'Keep monitoring your water intake to stay consistent.';
    let severity = raw.severity || 'info';
    let suggestedML = typeof raw.suggestedML === 'number' ? raw.suggestedML : 250;

    // Safety checks
    if (suggestedML > 1000) {
      console.warn(`AI suggested unsafe amount of ${suggestedML}mL. Normalizing to 500mL.`);
      suggestedML = 500;
      severity = 'info';
    }

    if (suggestedML < 0) {
      suggestedML = 0;
    }

    return {
      text,
      severity,
      suggestedML,
    };
  }

  /**
   * Screens predictions for boundary constraints.
   */
  static validatePredictions(raw: any) {
    return {
      expectedFinalIntakeML: Math.min(6000, Math.max(0, raw.expectedFinalIntakeML || 2000)),
      goalCompletionProbability: Math.min(1.0, Math.max(0.0, raw.goalCompletionProbability || 0.5)),
      expectedNextDrinkTime: typeof raw.expectedNextDrinkTime === 'string' ? raw.expectedNextDrinkTime : null,
      riskScore: Math.min(10, Math.max(0, raw.riskScore || 0)),
    };
  }
}
export default HydrationAIResponseValidator;
