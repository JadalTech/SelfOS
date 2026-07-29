/**
 * Idempotency Utility
 *
 * Transactional event deduplication guard for Firestore triggers.
 * Prevents repeated trigger executions from corrupting data.
 */

import { adminDb } from '../shared/firebase';
import { logger } from '../shared/logger';

export const IDEMPOTENCY_COLLECTION = '_trigger_events';

export async function processIdempotently(
  eventId: string,
  triggerName: string,
  handler: () => Promise<void>
): Promise<boolean> {
  const eventRef = adminDb.collection(IDEMPOTENCY_COLLECTION).doc(eventId);

  try {
    const executed = await adminDb.runTransaction(async (transaction) => {
      const doc = await transaction.get(eventRef);
      if (doc.exists) {
        logger.info('IdempotencyGuard', `Event "${eventId}" for trigger "${triggerName}" already processed. Skipping.`);
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
  } catch (error) {
    logger.error('IdempotencyGuard', `Failed transactional idempotency check for event "${eventId}"`, error);
    throw error;
  }
}
