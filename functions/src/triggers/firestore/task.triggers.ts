/**
 * Task Firestore Triggers (v2)
 */

import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { FUNCTION_CONFIG } from '../../shared/config';
import { logger } from '../../shared/logger';
import { processIdempotently } from '../../utils/idempotency';

export const onTaskCreated = onDocumentCreated(
  {
    document: 'tasks/{taskId}',
    region: FUNCTION_CONFIG.region,
  },
  async (event) => {
    const eventId = event.id;
    const taskId = event.params.taskId;

    await processIdempotently(eventId, 'onTaskCreated', async () => {
      logger.info('onTaskCreated', `Task created ID: "${taskId}"`);
    });
  }
);
