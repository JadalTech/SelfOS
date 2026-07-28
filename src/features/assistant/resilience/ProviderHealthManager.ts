/**
 * Provider Health Manager
 * SelfOS v2.0.0 — Batch 13D
 */

import { providerCircuitBreaker } from './ProviderCircuitBreaker';

export class ProviderHealthManager {
  isProviderHealthy(providerName: string): boolean {
    const circuitState = providerCircuitBreaker.getState();
    return circuitState !== 'Open';
  }
}

export const providerHealthManager = new ProviderHealthManager();
export default providerHealthManager;
