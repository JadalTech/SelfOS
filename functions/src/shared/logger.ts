/**
 * Structured Cloud Logger
 *
 * Integrates with Firebase Cloud Logging to output structured JSON logs,
 * with fallback to standard console for standalone unit test environments.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
let loggerFunctions: any = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  loggerFunctions = require('firebase-functions/logger');
} catch {
  loggerFunctions = {
    info: (msg: string, data?: any) => console.log(msg, data || ''),
    warn: (msg: string, data?: any) => console.warn(msg, data || ''),
    error: (msg: string, data?: any) => console.error(msg, data || ''),
    debug: (msg: string, data?: any) => console.debug(msg, data || ''),
  };
}

export class CloudLogger {
  public info(context: string, message: string, data?: Record<string, unknown>): void {
    loggerFunctions.info(`[${context}] ${message}`, data || {});
  }

  public warn(context: string, message: string, data?: Record<string, unknown>): void {
    loggerFunctions.warn(`[${context}] ${message}`, data || {});
  }

  public error(context: string, message: string, error?: unknown, data?: Record<string, unknown>): void {
    const errorDetails = error instanceof Error
      ? { errorMessage: error.message, stack: error.stack }
      : { rawError: String(error) };

    loggerFunctions.error(`[${context}] ${message}`, {
      ...errorDetails,
      ...(data || {}),
    });
  }

  public debug(context: string, message: string, data?: Record<string, unknown>): void {
    loggerFunctions.debug(`[${context}] ${message}`, data || {});
  }
}

export const logger = new CloudLogger();
