/**
 * Provider Circuit Breaker
 * SelfOS v2.0.0 — Batch 13D
 */

export type CircuitState = 'Closed' | 'Open' | 'Half-open';

export class ProviderCircuitBreaker {
  private state: CircuitState = 'Closed';
  private failureCount = 0;
  private readonly failureThreshold = 3;

  getState(): CircuitState {
    return this.state;
  }

  recordSuccess(): void {
    this.failureCount = 0;
    this.state = 'Closed';
  }

  recordFailure(): void {
    this.failureCount += 1;
    if (this.failureCount >= this.failureThreshold) {
      this.state = 'Open';
    }
  }

  reset(): void {
    this.failureCount = 0;
    this.state = 'Closed';
  }
}

export const providerCircuitBreaker = new ProviderCircuitBreaker();
export default providerCircuitBreaker;
