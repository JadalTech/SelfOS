"use strict";
/**
 * Structured Cloud Logger
 *
 * Integrates with Firebase Cloud Logging to output structured JSON logs,
 * with fallback to standard console for standalone unit test environments.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.CloudLogger = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
let loggerFunctions = null;
try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    loggerFunctions = require('firebase-functions/logger');
}
catch {
    loggerFunctions = {
        info: (msg, data) => console.log(msg, data || ''),
        warn: (msg, data) => console.warn(msg, data || ''),
        error: (msg, data) => console.error(msg, data || ''),
        debug: (msg, data) => console.debug(msg, data || ''),
    };
}
class CloudLogger {
    info(context, message, data) {
        loggerFunctions.info(`[${context}] ${message}`, data || {});
    }
    warn(context, message, data) {
        loggerFunctions.warn(`[${context}] ${message}`, data || {});
    }
    error(context, message, error, data) {
        const errorDetails = error instanceof Error
            ? { errorMessage: error.message, stack: error.stack }
            : { rawError: String(error) };
        loggerFunctions.error(`[${context}] ${message}`, {
            ...errorDetails,
            ...(data || {}),
        });
    }
    debug(context, message, data) {
        loggerFunctions.debug(`[${context}] ${message}`, data || {});
    }
}
exports.CloudLogger = CloudLogger;
exports.logger = new CloudLogger();
//# sourceMappingURL=logger.js.map