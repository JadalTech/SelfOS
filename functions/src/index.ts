/**
 * Master Cloud Functions v2 Barrel Export File
 */

// Shared Infrastructure Exports
export * from './shared';

// HTTPS Callable Endpoints
export { pingCallable } from './https/health.callable';
export { exportUserDataCallable } from './https/user.callable';
export { getSystemStatusCallable } from './https/admin.callable';

// Firestore v2 Triggers
export { onUserCreated, onUserDeleted } from './triggers/firestore/user.triggers';
export { onRoutineCreated, onRoutineUpdated } from './triggers/firestore/routine.triggers';
export { onTaskCreated } from './triggers/firestore/task.triggers';

// Scheduled Cron Functions
export { dailyMaintenanceScheduled } from './scheduled/maintenance.scheduled';
export { hourlyStatsRefreshScheduled } from './scheduled/stats.scheduled';
