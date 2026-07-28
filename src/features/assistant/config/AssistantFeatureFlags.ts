/**
 * Assistant Feature Flags
 * SelfOS v2.0.0 — Batch 13D
 */

export interface FeatureFlagSettings {
  readonly enableStreaming: boolean;
  readonly enableProactiveTips: boolean;
  readonly enableMultiAgentOrchestration: boolean;
}

export class AssistantFeatureFlags {
  private flags: FeatureFlagSettings = {
    enableStreaming: true,
    enableProactiveTips: true,
    enableMultiAgentOrchestration: true,
  };

  getFlags(): FeatureFlagSettings {
    return { ...this.flags };
  }
}

export const assistantFeatureFlags = new AssistantFeatureFlags();
export default assistantFeatureFlags;
