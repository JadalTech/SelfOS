/**
 * Crash Reporter Provider
 *
 * Provider abstraction for Crashlytics / Sentry / Bugsnag.
 * Automatically sanitizes sensitive PII data before reporting.
 */

import { logger } from '@/shared/utils/logger';
import type { ICrashReporter } from '../types';

/** Sensitive keys to automatically redact from exception metadata. */
const SENSITIVE_KEYS = new Set([
  'password',
  'token',
  'idToken',
  'refreshToken',
  'secret',
  'authorization',
  'journalContent',
  'content',
  'amount',
  'balance',
  'email',
]);

/**
 * Recursively sanitize context data object, replacing sensitive keys with '[REDACTED]'.
 */
export function sanitizePayload<T>(data: T): T {
  if (!data || typeof data !== 'object') return data;

  if (Array.isArray(data)) {
    return data.map((item) => sanitizePayload(item)) as unknown as T;
  }

  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
    const lowerKey = key.toLowerCase();
    if (SENSITIVE_KEYS.has(key) || Array.from(SENSITIVE_KEYS).some((s) => lowerKey.includes(s.toLowerCase()))) {
      sanitized[key] = '[REDACTED]';
    } else if (value && typeof value === 'object') {
      sanitized[key] = sanitizePayload(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized as T;
}

export class CrashReporter implements ICrashReporter {
  private userId: string | null = null;
  private breadcrumbs: Array<{ message: string; category?: string; timestamp: string }> = [];

  public setUserContext(userId: string | null): void {
    this.userId = userId;
    logger.info('CrashReporter', `User context set: ${userId || 'anonymous'}`);
  }

  public recordBreadcrumb(message: string, category?: string, data?: Record<string, unknown>): void {
    const sanitizedData = data ? sanitizePayload(data) : undefined;
    const entry = {
      message,
      category,
      timestamp: new Date().toISOString(),
      ...(sanitizedData ? { data: sanitizedData } : {}),
    };

    this.breadcrumbs.push(entry);
    if (this.breadcrumbs.length > 50) {
      this.breadcrumbs.shift(); // Keep last 50 breadcrumbs
    }

    logger.debug('CrashReporter', `Breadcrumb [${category || 'default'}]: ${message}`);
  }

  public captureException(error: unknown, context?: Record<string, unknown>): void {
    const sanitizedContext = context ? sanitizePayload(context) : undefined;
    const errorMessage = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : undefined;

    logger.error('CrashReporter', `Captured Exception: ${errorMessage}`, error, {
      userId: this.userId,
      context: sanitizedContext,
      recentBreadcrumbs: this.breadcrumbs.slice(-5),
      stack,
    });
  }

  public getRecentBreadcrumbs() {
    return [...this.breadcrumbs];
  }
}

export const defaultCrashReporter = new CrashReporter();
