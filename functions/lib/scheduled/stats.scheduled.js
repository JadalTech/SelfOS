"use strict";
/**
 * Statistics Refresh Scheduled Functions (v2)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.hourlyStatsRefreshScheduled = void 0;
const scheduler_1 = require("firebase-functions/v2/scheduler");
const config_1 = require("../shared/config");
const logger_1 = require("../shared/logger");
exports.hourlyStatsRefreshScheduled = (0, scheduler_1.onSchedule)({
    schedule: '0 * * * *', // Every hour
    region: config_1.FUNCTION_CONFIG.region,
    timeZone: 'UTC',
}, async () => {
    logger_1.logger.info('hourlyStatsRefreshScheduled', 'Executing hourly background stats refresh');
});
//# sourceMappingURL=stats.scheduled.js.map