/**
 * AI Request Telemetry and Metrics Tracker
 * SelfOS v1.5.0 — Batch 12C
 */

export interface TelemetryMetrics {
  promptTokens: number;
  completionTokens: number;
  latencyMs: number;
  validationFailures: number;
  fallbackCount: number;
}

export class AITelemetry {
  private static metrics: TelemetryMetrics = {
    promptTokens: 0,
    completionTokens: 0,
    latencyMs: 0,
    validationFailures: 0,
    fallbackCount: 0,
  };

  static recordRequest(promptT: number, completionT: number, latency: number): void {
    this.metrics.promptTokens += promptT;
    this.metrics.completionTokens += completionT;
    this.metrics.latencyMs += latency;
  }

  static recordFailure(): void {
    this.metrics.validationFailures += 1;
  }

  static recordFallback(): void {
    this.metrics.fallbackCount += 1;
  }

  static getMetrics(): TelemetryMetrics {
    return { ...this.metrics };
  }
}
export default AITelemetry;
