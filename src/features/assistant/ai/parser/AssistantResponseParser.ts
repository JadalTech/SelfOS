/**
 * Assistant Response Parser
 * SelfOS v2.0.0 — Batch 13A
 */

import { z } from 'zod';
import type { AssistantResponse } from '../../domain/assistant.types';

export const responseSchema = z.object({
  text: z.string(),
  followUpQuestions: z.array(z.string()),
  actionItems: z.array(z.object({
    id: z.string(),
    description: z.string(),
    priority: z.enum(['low', 'medium', 'high']),
  })),
  classification: z.object({
    intentType: z.string(),
    confidence: z.number(),
  }),
});

export class AssistantResponseParser {
  static parse(rawText: string): AssistantResponse {
    const parsed = JSON.parse(rawText);
    const result = responseSchema.parse(parsed);
    return result as AssistantResponse;
  }
}
export default AssistantResponseParser;
