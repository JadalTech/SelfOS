/**
 * Statistics Refresh Scheduled Functions (v2)
 */

import { onSchedule } from 'firebase-functions/v2/scheduler';
import { FUNCTION_CONFIG } from '../shared/config';
import { logger } from '../shared/logger';

export const hourlyStatsRefreshScheduled = onSchedule(
  {
    schedule: '0 * * * *', // Every hour
    region: FUNCTION_CONFIG.region,
    timeZone: 'UTC',
  },
  async () => {
    logger.info('hourlyStatsRefreshScheduled', 'Executing hourly background stats refresh');
  }
);
