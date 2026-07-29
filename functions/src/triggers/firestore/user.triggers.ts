/**
 * User Profile Firestore Triggers (v2)
 */

import { onDocumentCreated, onDocumentDeleted } from 'firebase-functions/v2/firestore';
import { FUNCTION_CONFIG } from '../../shared/config';
import { logger } from '../../shared/logger';
import { processIdempotently } from '../../utils/idempotency';

export const onUserCreated = onDocumentCreated(
  {
    document: 'users/{userId}',
    region: FUNCTION_CONFIG.region,
  },
  async (event) => {
    const eventId = event.id;
    const userId = event.params.userId;
    const data = event.data?.data();

    await processIdempotently(eventId, 'onUserCreated', async () => {
      logger.info('onUserCreated', `Initializing profile defaults for user "${userId}"`, data);
    });
  }
);

export const onUserDeleted = onDocumentDeleted(
  {
    document: 'users/{userId}',
    region: FUNCTION_CONFIG.region,
  },
  async (event) => {
    const eventId = event.id;
    const userId = event.params.userId;

    await processIdempotently(eventId, 'onUserDeleted', async () => {
      logger.info('onUserDeleted', `Cleaned up resources for deleted user "${userId}"`);
    });
  }
);
