"use strict";
/**
 * Task Firestore Triggers (v2)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.onTaskCreated = void 0;
const firestore_1 = require("firebase-functions/v2/firestore");
const config_1 = require("../../shared/config");
const logger_1 = require("../../shared/logger");
const idempotency_1 = require("../../utils/idempotency");
exports.onTaskCreated = (0, firestore_1.onDocumentCreated)({
    document: 'tasks/{taskId}',
    region: config_1.FUNCTION_CONFIG.region,
}, async (event) => {
    const eventId = event.id;
    const taskId = event.params.taskId;
    await (0, idempotency_1.processIdempotently)(eventId, 'onTaskCreated', async () => {
        logger_1.logger.info('onTaskCreated', `Task created ID: "${taskId}"`);
    });
});
//# sourceMappingURL=task.triggers.js.map