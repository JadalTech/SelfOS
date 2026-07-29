/**
 * Maintenance Scheduled Functions (v2)
 */

import { onSchedule } from 'firebase-functions/v2/scheduler';
import { QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { FUNCTION_CONFIG } from '../shared/config';
import { logger } from '../shared/logger';
import { adminDb } from '../shared/firebase';

export const dailyMaintenanceScheduled = onSchedule(
  {
    schedule: '0 2 * * *', // Every day at 02:00 AM UTC
    region: FUNCTION_CONFIG.region,
    timeZone: 'UTC',
  },
  async () => {
    logger.info('dailyMaintenanceScheduled', 'Executing daily cleanup cron job');

    // Purge trigger events older than 7 days
    const cutoffDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const oldEventsSnap = await adminDb
      .collection('_trigger_events')
      .where('processedAt', '<', cutoffDate)
      .limit(100)
      .get();

    if (!oldEventsSnap.empty) {
      const batch = adminDb.batch();
      oldEventsSnap.docs.forEach((doc: QueryDocumentSnapshot) => batch.delete(doc.ref));
      await batch.commit();
      logger.info('dailyMaintenanceScheduled', `Purged ${oldEventsSnap.size} old idempotency logs.`);
    }
  }
);
