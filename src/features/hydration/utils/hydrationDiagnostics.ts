/**
 * Diagnostics Logging Utility for Hydration Module
 * SelfOS v1.4.0 — Batch 11D
 */

export interface LogMetrics {
  readonly latencyMs?: number;
  readonly cacheHit?: boolean;
  readonly providerName?: string;
}

export class HydrationDiagnostics {
  private static readonly IS_DEV = __DEV__;

  static log(message: string, metrics?: LogMetrics): void {
    if (!this.IS_DEV) return;

    const timestamp = new Date().toISOString();
    const metricsStr = metrics
      ? ` | Latency: ${metrics.latencyMs ?? 'N/A'}ms | CacheHit: ${metrics.cacheHit ?? 'N/A'} | Provider: ${metrics.providerName ?? 'N/A'}`
      : '';
    console.log(`[Hydration Diagnostics] [${timestamp}] ${message}${metricsStr}`);
  }

  static warn(message: string, error?: any): void {
    if (!this.IS_DEV) return;
    console.warn(`[Hydration Diagnostics Warning] ${message}`, error || '');
  }

  static error(message: string, error?: any): void {
    // Production errors should log to crash reporting but avoid leaking sensitive state
    const timestamp = new Date().toISOString();
    console.error(`[Hydration Diagnostics Error] [${timestamp}] ${message}`, error ? error.message || error : '');
  }
}
export default HydrationDiagnostics;
