"use strict";
/**
 * Maintenance Scheduled Functions (v2)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.dailyMaintenanceScheduled = void 0;
const scheduler_1 = require("firebase-functions/v2/scheduler");
const config_1 = require("../shared/config");
const logger_1 = require("../shared/logger");
const firebase_1 = require("../shared/firebase");
exports.dailyMaintenanceScheduled = (0, scheduler_1.onSchedule)({
    schedule: '0 2 * * *', // Every day at 02:00 AM UTC
    region: config_1.FUNCTION_CONFIG.region,
    timeZone: 'UTC',
}, async () => {
    logger_1.logger.info('dailyMaintenanceScheduled', 'Executing daily cleanup cron job');
    // Purge trigger events older than 7 days
    const cutoffDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const oldEventsSnap = await firebase_1.adminDb
        .collection('_trigger_events')
        .where('processedAt', '<', cutoffDate)
        .limit(100)
        .get();
    if (!oldEventsSnap.empty) {
        const batch = firebase_1.adminDb.batch();
        oldEventsSnap.docs.forEach((doc) => batch.delete(doc.ref));
        await batch.commit();
        logger_1.logger.info('dailyMaintenanceScheduled', `Purged ${oldEventsSnap.size} old idempotency logs.`);
    }
});
//# sourceMappingURL=maintenance.scheduled.js.map