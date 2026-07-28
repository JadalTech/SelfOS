/**
 * Telemetry Service for AI Assistant
 * SelfOS v2.0.0 — Batch 13A
 */

import type { TelemetryMetrics } from '../../domain/assistant.types';

export class AssistantTelemetryService {
  private static metrics: TelemetryMetrics = {
    intentDistribution: {},
    agentSelectionFrequency: {},
    providerUsage: {},
    providerFailures: 0,
    averageLatencyMs: 0,
    safetyValidationFailures: 0,
    fallbackCount: 0,
  };

  static recordMetric(
    intent: string,
    agentName: string,
    latency: number,
    validationFailed = false
  ): void {
    // Intent counts
    this.metrics.intentDistribution[intent] = (this.metrics.intentDistribution[intent] || 0) + 1;
    // Agent counts
    this.metrics.agentSelectionFrequency[agentName] = (this.metrics.agentSelectionFrequency[agentName] || 0) + 1;
    // Latency trackers
    this.metrics.averageLatencyMs = Math.round((this.metrics.averageLatencyMs + latency) / 2);

    if (validationFailed) {
      this.metrics.safetyValidationFailures += 1;
    }
  }

  static getMetrics(): TelemetryMetrics {
    return { ...this.metrics };
  }
}
export default AssistantTelemetryService;
