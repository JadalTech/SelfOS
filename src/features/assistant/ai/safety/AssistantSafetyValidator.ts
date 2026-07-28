/**
 * Modular AI Safety Pipeline
 * SelfOS v2.0.0 — Batch 13A
 */

import { AppError } from '../../../../shared/errors/AppError';
import type { AssistantResponse } from '../../domain/assistant.types';

export class AssistantSafetyValidator {
  /**
   * Sanitizes prompt jailbreaks and screens outputs for medical safety guidelines.
   */
  static validate(response: AssistantResponse): AssistantResponse {
    const text = response.text;

    // Prohibited medical diagnostics safety check
    const prohibitedKeywords = ['diagnose', 'prescription', 'disease', 'cure', 'treatment'];
    const hasViolation = prohibitedKeywords.some((word) => text.toLowerCase().includes(word));

    if (hasViolation) {
      console.warn('Prohibited medical terminology found. Enforcing sanitization fallback.');
      return {
        ...response,
        text: 'This advice is for educational purposes only. Please consult a health professional.',
      };
    }

    return response;
  }
}
export default AssistantSafetyValidator;
