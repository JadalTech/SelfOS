/**
 * Response Composer
 * SelfOS v2.0.0 — Batch 13C
 */

import { RecommendationConflictResolver } from '../resolvers/RecommendationConflictResolver';

export class ResponseComposer {
  static compose(agentOutputs: string[]): string {
    const resolved = RecommendationConflictResolver.resolveConflicts(agentOutputs);
    return resolved.join('\n\n');
  }
}
export default ResponseComposer;
