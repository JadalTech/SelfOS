/**
 * Structured Logger Provider
 *
 * Provides structured JSON logging and delegates to lower-level loggers.
 */

import { logger as baseLogger } from '@/shared/utils/logger';
import type { IStructuredLogger } from '../types';

export class StructuredLogger implements IStructuredLogger {
  public debug(context: string, message: string, data?: Record<string, unknown>): void {
    baseLogger.debug(context, message, data);
  }

  public info(context: string, message: string, data?: Record<string, unknown>): void {
    baseLogger.info(context, message, data);
  }

  public warn(context: string, message: string, data?: Record<string, unknown>): void {
    baseLogger.warn(context, message, data);
  }

  public error(context: string, message: string, error?: unknown, data?: Record<string, unknown>): void {
    baseLogger.error(context, message, error, data);
  }
}

export const defaultLogger = new StructuredLogger();
