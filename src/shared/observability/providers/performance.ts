/**
 * Performance Tracer Provider
 *
 * Provider abstraction for performance benchmarking and span tracing.
 * Measures application startup, Firestore queries, Cloud Functions, and offline queue sync.
 */

import { logger } from '@/shared/utils/logger';
import type { IPerformanceTracer, PerformanceTraceSpan } from '../types';

export class SimpleTraceSpan implements PerformanceTraceSpan {
  public readonly name: string;
  private startTime: number;
  private attributes: Record<string, string> = {};
  private metrics: Record<string, number> = {};

  constructor(name: string) {
    this.name = name;
    this.startTime = Date.now();
  }

  public putAttribute(key: string, value: string): void {
    this.attributes[key] = value;
  }

  public putMetric(key: string, value: number): void {
    this.metrics[key] = value;
  }

  public stop(): void {
    const durationMs = Date.now() - this.startTime;
    logger.info('Performance', `Trace Span [${this.name}] completed in ${durationMs}ms`, {
      durationMs,
      attributes: this.attributes,
      metrics: this.metrics,
    });
  }
}

export class PerformanceTracer implements IPerformanceTracer {
  public startTrace(traceName: string): PerformanceTraceSpan {
    logger.debug('Performance', `Started trace span: "${traceName}"`);
    return new SimpleTraceSpan(traceName);
  }

  public async measureAsync<T>(traceName: string, fn: () => Promise<T>): Promise<T> {
    const span = this.startTrace(traceName);
    try {
      const result = await fn();
      span.putAttribute('status', 'success');
      return result;
    } catch (error) {
      span.putAttribute('status', 'error');
      throw error;
    } finally {
      span.stop();
    }
  }
}

export const defaultPerformanceTracer = new PerformanceTracer();
