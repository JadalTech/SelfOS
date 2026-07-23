"use strict";
/**
 * Scratch Unit Verification Script for Dashboard Mappers & View Model Construction
 */
Object.defineProperty(exports, "__esModule", { value: true });
const dashboardMapper_1 = require("../src/features/dashboard/utils/dashboardMapper");
function assert(condition, message) {
    if (!condition) {
        throw new Error(`[Assertion Failed] ${message}`);
    }
}
console.log('=== Starting Dashboard Architecture Unit & Integration Tests ===');
const mockUser = {
    uid: 'user_123',
    email: 'test@selfos.app',
    displayName: 'Alex Rivers',
    emailVerified: true,
};
const referenceDate = new Date(2026, 6, 23, 9, 0, 0); // July 23, 2026 at 9:00 AM local time
const mockRoutines = [
    {
        id: 'r1',
        userId: 'user_123',
        title: 'Morning Hydration',
        type: 'water',
        status: 'active',
        schedule: {
            frequency: 'daily',
            interval: 1,
            startDate: '2026-07-01',
            timezone: 'UTC',
        },
        reminders: [{ id: 'rem1', time: '08:00', enabled: true }],
        currentStreak: 5,
        longestStreak: 10,
        lastCompletedDate: '2026-07-22',
        createdAt: new Date('2026-07-01'),
        updatedAt: new Date('2026-07-22'),
    },
    {
        id: 'r2',
        userId: 'user_123',
        title: 'Ketoconazole Wash',
        type: 'haircare',
        status: 'active',
        schedule: {
            frequency: 'weekly',
            interval: 1,
            daysOfWeek: [4], // Thursday (July 23, 2026 is Thursday)
            startDate: '2026-07-01',
            timezone: 'UTC',
        },
        reminders: [],
        currentStreak: 2,
        longestStreak: 4,
        lastCompletedDate: '2026-07-16',
        createdAt: new Date('2026-07-01'),
        updatedAt: new Date('2026-07-16'),
    },
];
const mockLogs = [
    {
        id: 'l1',
        routineId: 'r1',
        type: 'water',
        date: '2026-07-23',
        time: '08:15:00',
        status: 'completed',
        timestamp: new Date('2026-07-23T08:15:00Z'),
    },
    {
        id: 'l2',
        routineId: 'r1',
        type: 'water',
        date: '2026-07-22',
        time: '08:10:00',
        status: 'completed',
        timestamp: new Date('2026-07-22T08:10:00Z'),
    },
];
// ---------------------------------------------------------------------------
// Test 1: Greeting Mapper
// ---------------------------------------------------------------------------
console.log('Running Test 1: mapGreeting...');
const greeting = (0, dashboardMapper_1.mapGreeting)(mockUser, referenceDate);
assert(greeting.name === 'Alex Rivers', 'User name mapped');
assert(greeting.greetingText.includes('Good Morning'), 'Time of day greeting mapped');
console.log('✅ Test 1 Passed');
// ---------------------------------------------------------------------------
// Test 2: Today Progress Mapper
// ---------------------------------------------------------------------------
console.log('Running Test 2: mapTodayProgress...');
const progress = (0, dashboardMapper_1.mapTodayProgress)(mockRoutines, mockLogs, referenceDate);
assert(progress.scheduledCount === 2, '2 routines scheduled today (daily + Thursday weekly)');
assert(progress.completedCount === 1, '1 routine completed today (r1)');
assert(progress.percentage === 50, '50% progress calculated');
console.log('✅ Test 2 Passed');
// ---------------------------------------------------------------------------
// Test 3: Today Routines List Mapper
// ---------------------------------------------------------------------------
console.log('Running Test 3: mapTodayRoutines...');
const todayList = (0, dashboardMapper_1.mapTodayRoutines)(mockRoutines, mockLogs, referenceDate);
assert(todayList.length === 2, '2 routines mapped in today list');
assert(todayList[0].status === 'completed', 'r1 is completed');
assert(todayList[1].status === 'pending', 'r2 is pending');
console.log('✅ Test 3 Passed');
// ---------------------------------------------------------------------------
// Test 4: Stats Grid Mapper
// ---------------------------------------------------------------------------
console.log('Running Test 4: mapStats...');
const stats = (0, dashboardMapper_1.mapStats)(mockRoutines, mockLogs);
assert(stats.activeRoutinesCount === 2, '2 active routines count');
assert(stats.topStreakCount === 5, 'Top streak count is 5');
assert(stats.topStreakTitle === 'Morning Hydration', 'Top streak title matched');
assert(stats.totalCompletionsAllTime === 2, 'Total completed logs is 2');
console.log('✅ Test 4 Passed');
// ---------------------------------------------------------------------------
// Test 5: Master ViewModel Construction
// ---------------------------------------------------------------------------
console.log('Running Test 5: buildDashboardViewModel...');
const vm = (0, dashboardMapper_1.buildDashboardViewModel)(mockUser, mockRoutines, mockLogs, referenceDate);
assert(vm.greeting.name === 'Alex Rivers', 'Master VM greeting valid');
assert(vm.todayRoutines.length === 2, 'Master VM today routines valid');
assert(vm.topPendingRoutine?.id === 'r2', 'Top pending routine is r2');
assert(vm.modules.length > 0, 'Module portals registered');
console.log('✅ Test 5 Passed');
console.log('\n=== All Dashboard Architecture Integration Tests Passed! ===');
