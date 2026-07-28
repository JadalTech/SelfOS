/**
 * Provider Cost Manager
 * SelfOS v2.0.0 — Batch 13D
 */

export class ProviderCostManager {
  private totalTokensUsed = 0;

  recordUsage(tokens: number): void {
    this.totalTokensUsed += tokens;
  }

  getTotalTokens(): number {
    return this.totalTokensUsed;
  }
}

export const providerCostManager = new ProviderCostManager();
export default providerCostManager;
