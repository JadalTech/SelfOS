"use strict";
/**
 * Idempotency Utility
 *
 * Transactional event deduplication guard for Firestore triggers.
 * Prevents repeated trigger executions from corrupting data.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.IDEMPOTENCY_COLLECTION = void 0;
exports.processIdempotently = processIdempotently;
const firebase_1 = require("../shared/firebase");
const logger_1 = require("../shared/logger");
exports.IDEMPOTENCY_COLLECTION = '_trigger_events';
async function processIdempotently(eventId, triggerName, handler) {
    const eventRef = firebase_1.adminDb.collection(exports.IDEMPOTENCY_COLLECTION).doc(eventId);
    try {
        const executed = await firebase_1.adminDb.runTransaction(async (transaction) => {
            const doc = await transaction.get(eventRef);
            if (doc.exists) {
                logger_1.logger.info('IdempotencyGuard', `Event "${eventId}" for trigger "${triggerName}" already processed. Skipping.`);
                return false;
            }
            transaction.set(eventRef, {
                eventId,
                triggerName,
                processedAt: new Date().toISOString(),
            });
            return true;
        });
        if (executed) {
            await handler();
        }
        return executed;
    }
    catch (error) {
        logger_1.logger.error('IdempotencyGuard', `Failed transactional idempotency check for event "${eventId}"`, error);
        throw error;
    }
}
//# sourceMappingURL=idempotency.js.map