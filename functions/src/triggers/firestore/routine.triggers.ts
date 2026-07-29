/**
 * Routine & Logs Firestore Triggers (v2)
 */

import { onDocumentCreated, onDocumentUpdated } from 'firebase-functions/v2/firestore';
import { FUNCTION_CONFIG } from '../../shared/config';
import { logger } from '../../shared/logger';
import { processIdempotently } from '../../utils/idempotency';

export const onRoutineCreated = onDocumentCreated(
  {
    document: 'routines/{routineId}',
    region: FUNCTION_CONFIG.region,
  },
  async (event) => {
    const eventId = event.id;
    const routineId = event.params.routineId;

    await processIdempotently(eventId, 'onRoutineCreated', async () => {
      logger.info('onRoutineCreated', `New routine created ID: "${routineId}"`);
    });
  }
);

export const onRoutineUpdated = onDocumentUpdated(
  {
    document: 'routines/{routineId}',
    region: FUNCTION_CONFIG.region,
  },
  async (event) => {
    const eventId = event.id;
    const routineId = event.params.routineId;

    await processIdempotently(eventId, 'onRoutineUpdated', async () => {
      logger.info('onRoutineUpdated', `Routine updated ID: "${routineId}"`);
    });
  }
);
