"use strict";
/**
 * User Profile Firestore Triggers (v2)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.onUserDeleted = exports.onUserCreated = void 0;
const firestore_1 = require("firebase-functions/v2/firestore");
const config_1 = require("../../shared/config");
const logger_1 = require("../../shared/logger");
const idempotency_1 = require("../../utils/idempotency");
exports.onUserCreated = (0, firestore_1.onDocumentCreated)({
    document: 'users/{userId}',
    region: config_1.FUNCTION_CONFIG.region,
}, async (event) => {
    const eventId = event.id;
    const userId = event.params.userId;
    const data = event.data?.data();
    await (0, idempotency_1.processIdempotently)(eventId, 'onUserCreated', async () => {
        logger_1.logger.info('onUserCreated', `Initializing profile defaults for user "${userId}"`, data);
    });
});
exports.onUserDeleted = (0, firestore_1.onDocumentDeleted)({
    document: 'users/{userId}',
    region: config_1.FUNCTION_CONFIG.region,
}, async (event) => {
    const eventId = event.id;
    const userId = event.params.userId;
    await (0, idempotency_1.processIdempotently)(eventId, 'onUserDeleted', async () => {
        logger_1.logger.info('onUserDeleted', `Cleaned up resources for deleted user "${userId}"`);
    });
});
//# sourceMappingURL=user.triggers.js.map