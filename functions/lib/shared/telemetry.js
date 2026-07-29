"use strict";
/**
 * Telemetry Abstraction
 *
 * Pluggable telemetry service allowing future integrations (OpenTelemetry, Sentry, Crashlytics)
 * without altering Cloud Function handlers.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.telemetry = exports.TelemetryService = void 0;
const logger_1 = require("./logger");
class TelemetryService {
    /**
     * Track an event with context metadata.
     */
    trackEvent(eventName, metadata) {
        logger_1.logger.info('Telemetry', `Event: ${eventName}`, metadata);
    }
    /**
     * Record execution latency or custom metric.
     */
    recordMetric(metric) {
        logger_1.logger.info('TelemetryMetric', `Metric: ${metric.name} = ${metric.value}${metric.unit || ''}`, {
            tags: metric.tags || {},
        });
    }
    /**
     * Capture an exception for telemetry analysis.
     */
    captureException(error, context) {
        logger_1.logger.error('TelemetryException', 'Exception captured', error, context);
    }
}
exports.TelemetryService = TelemetryService;
exports.telemetry = new TelemetryService();
//# sourceMappingURL=telemetry.js.map