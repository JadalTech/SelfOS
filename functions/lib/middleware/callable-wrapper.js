"use strict";
/**
 * Callable Handler Middleware Wrapper
 *
 * Higher-order function wrapping Cloud Functions v2 `onCall` endpoints.
 * Automatically enforces authentication, schema validation, telemetry tracking, and error normalization.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCallableHandler = createCallableHandler;
const https_1 = require("firebase-functions/v2/https");
const config_1 = require("../shared/config");
const logger_1 = require("../shared/logger");
const telemetry_1 = require("../shared/telemetry");
const errors_1 = require("../shared/errors");
const validation_1 = require("../shared/validation");
function createCallableHandler(options) {
    const { name, requireAuth = true, validatePayload, handler } = options;
    return (0, https_1.onCall)({
        region: config_1.FUNCTION_CONFIG.region,
        memory: config_1.FUNCTION_CONFIG.defaultMemory,
        timeoutSeconds: config_1.FUNCTION_CONFIG.defaultTimeoutSeconds,
    }, async (request) => {
        const startTime = Date.now();
        logger_1.logger.info(name, `Callable invocation initiated`);
        try {
            let uid = null;
            if (requireAuth) {
                uid = (0, validation_1.validateAuth)(request);
            }
            else if (request.auth) {
                uid = request.auth.uid;
            }
            const validatedInput = validatePayload
                ? validatePayload(request.data)
                : request.data;
            const result = await handler(validatedInput, {
                uid,
                request: request,
            });
            const durationMs = Date.now() - startTime;
            telemetry_1.telemetry.recordMetric({
                name: `${name}_latency`,
                value: durationMs,
                unit: 'ms',
            });
            logger_1.logger.info(name, `Callable completed successfully in ${durationMs}ms`);
            return result;
        }
        catch (error) {
            telemetry_1.telemetry.captureException(error, { callableName: name });
            throw (0, errors_1.normalizeCallableError)(error, name);
        }
    });
}
//# sourceMappingURL=callable-wrapper.js.map