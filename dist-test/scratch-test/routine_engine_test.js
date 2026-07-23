"use strict";
/**
 * Scratch Unit Verification Script for Generic Routine Engine
 */
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../src/features/routine/index");
// Helper to assert conditions
function assert(condition, message) {
    if (!condition) {
        throw new Error(`[Assertion Failed] ${message}`);
    }
}
// Helper to create mock routine
function createMockRoutine(overrides = {}) {
    return {
        id: 'test-routine-id',
        userId: 'test-user-id',
        title: 'Test Routine',
        type: 'haircare',
        status: 'active',
        schedule: {
            frequency: 'daily',
            interval: 1,
            startDate: '2026-07-20',
            timezone: 'UTC'
        },
        reminders: [],
        currentStreak: 0,
        longestStreak: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...overrides
    };
}
console.log('=== Starting Generic Routine Engine Unit Tests ===');
// ---------------------------------------------------------------------------
// Test 1: Daily Scheduling Checks
// ---------------------------------------------------------------------------
console.log('Running Test 1: Daily Scheduling checks...');
const dailyRoutine = createMockRoutine({
    schedule: {
        frequency: 'daily',
        interval: 2, // every 2 days
        startDate: '2026-07-20',
        timezone: 'UTC'
    }
});
// Start date: scheduled
assert((0, index_1.isRoutineScheduledForDate)(dailyRoutine, new Date(2026, 6, 20)), 'Should be scheduled on start date');
// 1 day after: not scheduled
assert(!(0, index_1.isRoutineScheduledForDate)(dailyRoutine, new Date(2026, 6, 21)), 'Should not be scheduled 1 day after');
// 2 days after: scheduled
assert((0, index_1.isRoutineScheduledForDate)(dailyRoutine, new Date(2026, 6, 22)), 'Should be scheduled 2 days after');
// Before start date: not scheduled
assert(!(0, index_1.isRoutineScheduledForDate)(dailyRoutine, new Date(2026, 6, 19)), 'Should not be scheduled before start date');
// Test with End Date
const dailyWithEnd = createMockRoutine({
    schedule: {
        frequency: 'daily',
        interval: 1,
        startDate: '2026-07-20',
        endDate: '2026-07-22',
        timezone: 'UTC'
    }
});
assert((0, index_1.isRoutineScheduledForDate)(dailyWithEnd, new Date(2026, 6, 22)), 'Should be scheduled on end date');
assert(!(0, index_1.isRoutineScheduledForDate)(dailyWithEnd, new Date(2026, 6, 23)), 'Should not be scheduled after end date');
console.log('✅ Test 1 Passed');
// ---------------------------------------------------------------------------
// Test 2: Weekly Scheduling Checks
// ---------------------------------------------------------------------------
console.log('Running Test 2: Weekly Scheduling checks...');
// Weekly on Mon and Wed, every 2 weeks
const weeklyRoutine = createMockRoutine({
    schedule: {
        frequency: 'weekly',
        interval: 2,
        daysOfWeek: [1, 3], // Monday (1), Wednesday (3)
        startDate: '2026-07-20', // Monday
        timezone: 'UTC'
    }
});
// July 20, 2026 (Mon): scheduled (week 0)
assert((0, index_1.isRoutineScheduledForDate)(weeklyRoutine, new Date(2026, 6, 20)), 'Scheduled on week 0 Monday');
// July 22, 2026 (Wed): scheduled (week 0)
assert((0, index_1.isRoutineScheduledForDate)(weeklyRoutine, new Date(2026, 6, 22)), 'Scheduled on week 0 Wednesday');
// July 24, 2026 (Fri): not scheduled
assert(!(0, index_1.isRoutineScheduledForDate)(weeklyRoutine, new Date(2026, 6, 24)), 'Not scheduled on week 0 Friday');
// July 27, 2026 (Mon of next week): not scheduled because interval = 2 (week 1)
assert(!(0, index_1.isRoutineScheduledForDate)(weeklyRoutine, new Date(2026, 6, 27)), 'Not scheduled on week 1 Monday (interval 2)');
// Aug 3, 2026 (Mon of week 2): scheduled
assert((0, index_1.isRoutineScheduledForDate)(weeklyRoutine, new Date(2026, 7, 3)), 'Scheduled on week 2 Monday');
console.log('✅ Test 2 Passed');
// ---------------------------------------------------------------------------
// Test 3: Monthly Scheduling Checks
// ---------------------------------------------------------------------------
console.log('Running Test 3: Monthly Scheduling checks...');
const monthlyRoutine = createMockRoutine({
    schedule: {
        frequency: 'monthly',
        interval: 1,
        daysOfMonth: [15, 30],
        startDate: '2026-07-01',
        timezone: 'UTC'
    }
});
// July 15: scheduled
assert((0, index_1.isRoutineScheduledForDate)(monthlyRoutine, new Date(2026, 6, 15)), 'Scheduled on July 15');
// July 16: not scheduled
assert(!(0, index_1.isRoutineScheduledForDate)(monthlyRoutine, new Date(2026, 6, 16)), 'Not scheduled on July 16');
// July 30: scheduled
assert((0, index_1.isRoutineScheduledForDate)(monthlyRoutine, new Date(2026, 6, 30)), 'Scheduled on July 30');
console.log('✅ Test 3 Passed');
// ---------------------------------------------------------------------------
// Test 4: Streak Count Mutations
// ---------------------------------------------------------------------------
console.log('Running Test 4: Streak counts...');
let streakRoutine = createMockRoutine({
    lastCompletedDate: undefined,
    currentStreak: 0,
    longestStreak: 0
});
// First completion on July 20
let update = (0, index_1.calculateCompletionStreak)(streakRoutine, '2026-07-20');
assert(update.currentStreak === 1, 'First completion starts streak of 1');
assert(update.longestStreak === 1, 'Longest streak updates to 1');
assert(update.lastCompletedDate === '2026-07-20', 'lastCompletedDate updates');
// Consecutive completion on July 21
streakRoutine = { ...streakRoutine, ...update };
update = (0, index_1.calculateCompletionStreak)(streakRoutine, '2026-07-21');
assert(update.currentStreak === 2, 'Consecutive day increments streak to 2');
assert(update.longestStreak === 2, 'Longest updates to 2');
// Duplicate log on same day (July 21) does not change values
streakRoutine = { ...streakRoutine, ...update };
update = (0, index_1.calculateCompletionStreak)(streakRoutine, '2026-07-21');
assert(update.currentStreak === 2, 'Duplicate completion on same day retains streak of 2');
// Broken streak (gap on July 22, completed on July 23)
streakRoutine = { ...streakRoutine, ...update };
update = (0, index_1.calculateCompletionStreak)(streakRoutine, '2026-07-23');
assert(update.currentStreak === 1, 'Broken streak resets to 1');
assert(update.longestStreak === 2, 'Longest streak remains 2');
console.log('✅ Test 4 Passed');
// ---------------------------------------------------------------------------
// Test 5: Rebuilding Streaks (Undo Simulation)
// ---------------------------------------------------------------------------
console.log('Running Test 5: Rebuilding streaks from logs...');
const baseRoutine = createMockRoutine();
const logs = [
    { id: '1', routineId: 'r1', type: 'haircare', date: '2026-07-20', time: '10:00:00', status: 'completed', timestamp: new Date() },
    { id: '2', routineId: 'r1', type: 'haircare', date: '2026-07-21', time: '10:00:00', status: 'completed', timestamp: new Date() },
    { id: '3', routineId: 'r1', type: 'haircare', date: '2026-07-22', time: '10:00:00', status: 'completed', timestamp: new Date() }
];
// Rebuild with all 3 logs
let rebuilt = (0, index_1.rebuildStreakFromLogs)(baseRoutine, logs);
assert(rebuilt.currentStreak === 3, 'Rebuilt streak should be 3');
assert(rebuilt.lastCompletedDate === '2026-07-22', 'Rebuilt last completed date is July 22');
// Simulate Undo: remove the last log (July 22) and rebuild
const undoLogs = logs.slice(0, 2);
rebuilt = (0, index_1.rebuildStreakFromLogs)(baseRoutine, undoLogs);
assert(rebuilt.currentStreak === 2, 'Rebuilt streak after undo should fall back to 2');
assert(rebuilt.lastCompletedDate === '2026-07-21', 'Rebuilt last completed date falls back to July 21');
console.log('✅ Test 5 Passed');
// ---------------------------------------------------------------------------
// Test 6: Audit status for date
// ---------------------------------------------------------------------------
console.log('Running Test 6: getRoutineStatusForDate...');
const testLogs = [
    { id: '1', routineId: 'r1', type: 'haircare', date: '2026-07-20', time: '10:00:00', status: 'completed', timestamp: new Date() },
    { id: '2', routineId: 'r1', type: 'haircare', date: '2026-07-21', time: '10:00:00', status: 'skipped', timestamp: new Date() }
];
const auditRoutine = createMockRoutine({
    schedule: {
        frequency: 'daily',
        interval: 1,
        startDate: '2026-07-20',
        timezone: 'UTC'
    }
});
// July 20: completed
assert((0, index_1.getRoutineStatusForDate)(auditRoutine, testLogs, '2026-07-20', new Date(Date.UTC(2026, 6, 23))) === 'completed', 'Audit July 20 completed');
// July 21: skipped
assert((0, index_1.getRoutineStatusForDate)(auditRoutine, testLogs, '2026-07-21', new Date(Date.UTC(2026, 6, 23))) === 'skipped', 'Audit July 21 skipped');
// July 22: missed (past date relative to ref July 23, scheduled, no logs)
assert((0, index_1.getRoutineStatusForDate)(auditRoutine, testLogs, '2026-07-22', new Date(Date.UTC(2026, 6, 23))) === 'missed', 'Audit July 22 missed');
// July 24: pending (future date relative to ref July 23)
assert((0, index_1.getRoutineStatusForDate)(auditRoutine, testLogs, '2026-07-24', new Date(Date.UTC(2026, 6, 23))) === 'pending', 'Audit July 24 pending');
console.log('✅ Test 6 Passed');
// ---------------------------------------------------------------------------
// Test 7: Form Validator Checks
// ---------------------------------------------------------------------------
console.log('Running Test 7: Zod Validator checks...');
const validForm = {
    title: 'Ketoconazole Wash',
    description: 'Apply twice a week',
    type: 'haircare',
    status: 'active',
    schedule: {
        frequency: 'weekly',
        interval: 1,
        daysOfWeek: [0, 3], // Sunday and Wednesday
        startDate: '2026-07-20',
        timezone: 'Asia/Kolkata'
    },
    reminders: [
        { id: 'rem-1', time: '08:30', enabled: true }
    ]
};
const parseResult = index_1.routineFormSchema.safeParse(validForm);
assert(parseResult.success, 'Valid form should pass Zod parsing');
// Invalid form missing daysOfWeek for weekly
const invalidForm = {
    ...validForm,
    schedule: {
        ...validForm.schedule,
        daysOfWeek: [] // Empty days of week
    }
};
const invalidResult = index_1.routineFormSchema.safeParse(invalidForm);
assert(!invalidResult.success, 'Invalid weekly form should fail Zod parsing');
console.log('✅ Test 7 Passed');
console.log('\n=== All Generic Routine Engine Unit Tests Passed Successfully! ===');
