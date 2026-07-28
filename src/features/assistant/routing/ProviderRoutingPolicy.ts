/**
 * Provider Routing Policy
 * SelfOS v2.0.0 — Batch 13D
 */

import { providerHealthManager } from '../resilience/ProviderHealthManager';

export class ProviderRoutingPolicy {
  selectOptimalProvider(preferred: 'gemini' | 'openai' | 'claude' | 'mock'): 'gemini' | 'openai' | 'claude' | 'mock' {
    if (providerHealthManager.isProviderHealthy(preferred)) {
      return preferred;
    }
    return 'mock'; // Fallback route
  }
}

export const providerRoutingPolicy = new ProviderRoutingPolicy();
export default providerRoutingPolicy;
