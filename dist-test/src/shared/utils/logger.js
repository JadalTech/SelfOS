"use strict";
/**
 * Structured Logger
 *
 * Provides leveled, context-prefixed logging.
 * Output is suppressed in production builds via `__DEV__`.
 *
 * Usage:
 *   logger.info('Auth', 'User signed in', { uid: '123' });
 *   logger.error('Firebase', 'Init failed', error);
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
function formatPrefix(level, context) {
    const timestamp = new Date().toISOString().slice(11, 23); // HH:MM:SS.mmm
    return `[${timestamp}] [${level.toUpperCase()}] [${context}]`;
}
function createLogger() {
    const log = (level, context, message, ...data) => {
        // Suppress all logging in production
        if (!__DEV__) {
            return;
        }
        const prefix = formatPrefix(level, context);
        const args = data.length > 0 ? [prefix, message, ...data] : [prefix, message];
        switch (level) {
            case 'debug':
                console.debug(...args);
                break;
            case 'info':
                console.info(...args);
                break;
            case 'warn':
                console.warn(...args);
                break;
            case 'error':
                console.error(...args);
                break;
        }
    };
    return {
        debug: (context, message, ...data) => log('debug', context, message, ...data),
        info: (context, message, ...data) => log('info', context, message, ...data),
        warn: (context, message, ...data) => log('warn', context, message, ...data),
        error: (context, message, ...data) => log('error', context, message, ...data),
    };
}
/**
 * Application-wide logger instance.
 * Dev-only output. Zero overhead in production.
 */
exports.logger = createLogger();
