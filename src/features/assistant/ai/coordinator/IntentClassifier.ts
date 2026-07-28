/**
 * Intent Classifier
 * SelfOS v2.0.0 — Batch 13A
 */

import type { AssistantIntent, AssistantIntentType } from '../../domain/assistant.types';

export class IntentClassifier {
  static classify(userMessage: string): AssistantIntent {
    const text = userMessage.toLowerCase();

    let intentType: AssistantIntentType = 'general_chat';
    let confidence = 0.9;

    if (text.includes('score') || text.includes('index')) {
      intentType = 'ask_health_score';
      confidence = 0.95;
    } else if (text.includes('recommend') || text.includes('suggest')) {
      intentType = 'ask_recommendation';
      confidence = 0.92;
    } else if (text.includes('predict') || text.includes('forecast')) {
      intentType = 'ask_prediction';
      confidence = 0.88;
    } else if (text.includes('sleep') || text.includes('bed')) {
      intentType = 'ask_sleep';
      confidence = 0.95;
    } else if (text.includes('workout') || text.includes('exercise')) {
      intentType = 'ask_workout';
      confidence = 0.95;
    } else if (text.includes('water') || text.includes('hydrate')) {
      intentType = 'ask_hydration';
      confidence = 0.95;
    } else if (text.includes('routine') || text.includes('schedule')) {
      intentType = 'ask_routine';
      confidence = 0.9;
    }

    return {
      intentType,
      confidence,
    };
  }
}
export default IntentClassifier;
