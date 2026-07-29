/**
 * Notification & Reminder Engine Unit Tests
 * SelfOS Notification Suite
 *
 * Verifies PermissionService, NotificationService, ReminderMappingStorage,
 * ReminderScheduler, RouteResolverRegistry, NotificationRouter, and Routine integration.
 *
 * Run with: npx tsx src/shared/notifications/__tests__/notifications.test.ts
 */

import { NotificationService } from '../notification-service';
import { PermissionService } from '../permission-service';
import { ReminderMappingStorage } from '../reminder-mapping';
import { ReminderScheduler } from '../scheduler';
import { RouteResolverRegistry, RoutineRouteResolver } from '../route-resolver';
import { NotificationRouter } from '../notification-router';
import { NotificationEventEmitter } from '../notification-events';
import type { StorageService } from '../../storage';
import type { ReminderModel } from '../notification.types';

// In-Memory StorageService mock for testing persistence
class MemoryStorageService implements StorageService {
  private data: Map<string, string> = new Map();

  async get(key: string): Promise<string | null> {
    return this.data.get(key) || null;
  }

  async set(key: string, value: string): Promise<void> {
    this.data.set(key, value);
  }

  async remove(key: string): Promise<void> {
    this.data.delete(key);
  }

  async clear(): Promise<void> {
    this.data.clear();
  }

  async contains(key: string): Promise<boolean> {
    return this.data.has(key);
  }

  async getObject<T>(key: string): Promise<T | null> {
    const raw = this.data.get(key);
    return raw ? (JSON.parse(raw) as T) : null;
  }

  async setObject<T>(key: string, value: T): Promise<void> {
    this.data.set(key, JSON.stringify(value));
  }
}

let passCount = 0;
let failCount = 0;

function assert(condition: boolean, message: string): void {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passCount++;
  } else {
    console.error(`  ✗ ${message}`);
    failCount++;
  }
}

async function runTests(): Promise<void> {
  console.log('\n--- Notification & Reminder Engine Unit Test Suite ---\n');

  // 1. PermissionService Tests
  console.log('Test Group: PermissionService');
  const permService = new PermissionService();
  const status = await permService.checkPermission();
  assert(status === 'granted' || status === 'undetermined', 'checkPermission returns valid PermissionStatus');
  assert(permService.getPermissionStatus() === status, 'getPermissionStatus returns cached status');

  // 2. NotificationService Tests
  console.log('\nTest Group: NotificationService');
  const notifService = new NotificationService();
  const notifId = await notifService.scheduleNotification(
    { title: 'Hydration', body: 'Drink water' },
    { seconds: 10 }
  );
  assert(typeof notifId === 'string' && notifId.length > 0, 'scheduleNotification returns non-empty notification ID');

  const list = await notifService.listScheduledNotifications();
  assert(Array.isArray(list), 'listScheduledNotifications returns array');

  await notifService.cancelNotification(notifId);
  await notifService.cancelAllNotifications();
  assert(true, 'cancelNotification and cancelAllNotifications execute cleanly');

  // 3. ReminderMappingStorage Tests
  console.log('\nTest Group: ReminderMappingStorage');
  const mockStorage = new MemoryStorageService();
  const mappingStorage = new ReminderMappingStorage(mockStorage);

  await mappingStorage.saveMapping({
    reminderId: 'rem_1',
    notificationId: 'notif_100',
    feature: 'routine',
    entityId: 'r_abc',
    scheduledAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const retrievedId = await mappingStorage.getNotificationId('rem_1');
  assert(retrievedId === 'notif_100', 'saveMapping and getNotificationId store and retrieve mapped notification ID');

  const entityMappings = await mappingStorage.getMappingsForEntity('routine', 'r_abc');
  assert(entityMappings.length === 1, 'getMappingsForEntity retrieves correct mapped items');

  await mappingStorage.removeMapping('rem_1');
  assert((await mappingStorage.getNotificationId('rem_1')) === null, 'removeMapping deletes stored mapping');

  // 4. ReminderScheduler Tests
  console.log('\nTest Group: ReminderScheduler');
  const mockStorage2 = new MemoryStorageService();
  const mappingStorage2 = new ReminderMappingStorage(mockStorage2);
  const notifService2 = new NotificationService();
  const emitter = new NotificationEventEmitter();

  const scheduler = new ReminderScheduler({
    notificationService: notifService2,
    mappingStorage: mappingStorage2,
    eventEmitter: emitter,
  });

  let eventFired = false;
  emitter.subscribe((type) => {
    if (type === 'REMINDER_SCHEDULED') eventFired = true;
  });

  const reminder: ReminderModel = {
    id: 'rem_routine_1',
    feature: 'routine',
    entityId: 'routine_99',
    title: 'Morning Workout',
    body: 'Time to exercise!',
    enabled: true,
    trigger: { type: 'time', time: { hour: 8, minute: 30 } },
    recurrence: { type: 'daily', interval: 1 },
    timezone: 'Asia/Kolkata',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const scheduledNotifId = await scheduler.scheduleReminder(reminder);
  assert(typeof scheduledNotifId === 'string', 'scheduleReminder returns scheduled notification ID');
  assert(eventFired === true, 'ReminderScheduler emits REMINDER_SCHEDULED lifecycle event');

  const mappedId = await mappingStorage2.getNotificationId('rem_routine_1');
  assert(mappedId === scheduledNotifId, 'ReminderScheduler persists mapping in ReminderMappingStorage');

  const cancelled = await scheduler.cancelReminder('rem_routine_1');
  assert(cancelled === true, 'cancelReminder cancels mapped notification');

  // 5. RouteResolverRegistry & NotificationRouter Tests
  console.log('\nTest Group: RouteResolverRegistry & NotificationRouter');
  const routeRegistry = new RouteResolverRegistry();
  routeRegistry.register(new RoutineRouteResolver());

  const resolvedRoute = routeRegistry.resolveRoute({
    reminderId: 'rem_1',
    feature: 'routine',
    entityId: 'routine_99',
  });

  assert(resolvedRoute === '/(app)/routine/details?id=routine_99', 'RoutineRouteResolver resolves correct route path');

  const router = new NotificationRouter({
    routeResolverRegistry: routeRegistry,
    eventEmitter: emitter,
  });

  let navigatedRoute = '';
  router.setNavigationHandler((route) => {
    navigatedRoute = route;
  });

  router.handleNotificationTap({
    reminderId: 'rem_1',
    feature: 'routine',
    entityId: 'routine_99',
  });

  assert(navigatedRoute === '/(app)/routine/details?id=routine_99', 'NotificationRouter handles tap and triggers navigation handler');

  console.log(`\n--- Test Results: ${passCount} Passed, ${failCount} Failed ---\n`);

  if (failCount > 0) {
    process.exit(1);
  }
}

void runTests();
