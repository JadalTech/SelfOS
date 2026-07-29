/**
 * Telemetry Abstraction
 *
 * Pluggable telemetry service allowing future integrations (OpenTelemetry, Sentry, Crashlytics)
 * without altering Cloud Function handlers.
 */

import { logger } from './logger';

export interface MetricData {
  readonly name: string;
  readonly value: number;
  readonly unit?: string;
  readonly tags?: Record<string, string>;
}

export class TelemetryService {
  /**
   * Track an event with context metadata.
   */
  public trackEvent(eventName: string, metadata?: Record<string, unknown>): void {
    logger.info('Telemetry', `Event: ${eventName}`, metadata);
  }

  /**
   * Record execution latency or custom metric.
   */
  public recordMetric(metric: MetricData): void {
    logger.info('TelemetryMetric', `Metric: ${metric.name} = ${metric.value}${metric.unit || ''}`, {
      tags: metric.tags || {},
    });
  }

  /**
   * Capture an exception for telemetry analysis.
   */
  public captureException(error: unknown, context?: Record<string, unknown>): void {
    logger.error('TelemetryException', 'Exception captured', error, context);
  }
}

export const telemetry = new TelemetryService();
