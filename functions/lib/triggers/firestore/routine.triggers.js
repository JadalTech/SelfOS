"use strict";
/**
 * Routine & Logs Firestore Triggers (v2)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.onRoutineUpdated = exports.onRoutineCreated = void 0;
const firestore_1 = require("firebase-functions/v2/firestore");
const config_1 = require("../../shared/config");
const logger_1 = require("../../shared/logger");
const idempotency_1 = require("../../utils/idempotency");
exports.onRoutineCreated = (0, firestore_1.onDocumentCreated)({
    document: 'routines/{routineId}',
    region: config_1.FUNCTION_CONFIG.region,
}, async (event) => {
    const eventId = event.id;
    const routineId = event.params.routineId;
    await (0, idempotency_1.processIdempotently)(eventId, 'onRoutineCreated', async () => {
        logger_1.logger.info('onRoutineCreated', `New routine created ID: "${routineId}"`);
    });
});
exports.onRoutineUpdated = (0, firestore_1.onDocumentUpdated)({
    document: 'routines/{routineId}',
    region: config_1.FUNCTION_CONFIG.region,
}, async (event) => {
    const eventId = event.id;
    const routineId = event.params.routineId;
    await (0, idempotency_1.processIdempotently)(eventId, 'onRoutineUpdated', async () => {
        logger_1.logger.info('onRoutineUpdated', `Routine updated ID: "${routineId}"`);
    });
});
//# sourceMappingURL=routine.triggers.js.map