/**
 * Observability Types & Contracts
 *
 * Core interfaces for analytics, crash reporting, performance tracing,
 * and structured logging. Provider-agnostic.
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * Interface for structured logging.
 */
export interface IStructuredLogger {
  debug(context: string, message: string, data?: Record<string, unknown>): void;
  info(context: string, message: string, data?: Record<string, unknown>): void;
  warn(context: string, message: string, data?: Record<string, unknown>): void;
  error(context: string, message: string, error?: unknown, data?: Record<string, unknown>): void;
}

/**
 * Interface for crash reporting with automatic PII sanitization.
 */
export interface ICrashReporter {
  captureException(error: unknown, context?: Record<string, unknown>): void;
  recordBreadcrumb(message: string, category?: string, data?: Record<string, unknown>): void;
  setUserContext(userId: string | null): void;
}

/**
 * Interface for strongly typed analytics tracking.
 */
export interface IAnalyticsProvider {
  trackEvent(eventName: string, params?: Record<string, unknown>): void;
  trackScreenView(screenName: string, screenClass?: string): void;
  setUserProperties(properties: Record<string, string | number | boolean>): void;
}

/**
 * Performance trace span handle.
 */
export interface PerformanceTraceSpan {
  readonly name: string;
  putAttribute(key: string, value: string): void;
  putMetric(key: string, value: number): void;
  stop(): void;
}

/**
 * Interface for performance tracing.
 */
export interface IPerformanceTracer {
  startTrace(traceName: string): PerformanceTraceSpan;
  measureAsync<T>(traceName: string, fn: () => Promise<T>): Promise<T>;
}
