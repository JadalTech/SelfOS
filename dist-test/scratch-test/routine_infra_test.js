"use strict";
/**
 * Scratch Infrastructure Test Script for Batch 4B
 */
Object.defineProperty(exports, "__esModule", { value: true });
const routine_converter_1 = require("../src/shared/firebase/converters/routine.converter");
const routine_log_converter_1 = require("../src/shared/firebase/converters/routine-log.converter");
const queryKeys_1 = require("../src/features/routine/constants/queryKeys");
const firestore_1 = require("firebase/firestore");
function assert(condition, message) {
    if (!condition) {
        throw new Error(`[Assertion Failed] ${message}`);
    }
}
console.log('=== Starting Batch 4B Infrastructure Integration Tests ===');
// ---------------------------------------------------------------------------
// Test 1: Routine Firestore Converter
// ---------------------------------------------------------------------------
console.log('Running Test 1: Routine Firestore Converter...');
const sampleRoutine = {
    id: 'r123',
    userId: 'user456',
    title: 'Ketoconazole Wash',
    description: 'Apply twice a week',
    type: 'haircare',
    status: 'active',
    schedule: {
        frequency: 'weekly',
        interval: 1,
        daysOfWeek: [1, 4],
        startDate: '2026-07-20',
        timezone: 'Asia/Kolkata',
    },
    reminders: [{ id: 'rem-1', time: '09:00', enabled: true }],
    currentStreak: 5,
    longestStreak: 12,
    lastCompletedDate: '2026-07-20',
    createdAt: new Date('2026-07-01T00:00:00Z'),
    updatedAt: new Date('2026-07-20T00:00:00Z'),
};
const docData = routine_converter_1.routineConverter.toFirestore(sampleRoutine);
assert(docData.title === 'Ketoconazole Wash', 'Converter title match');
assert(docData.currentStreak === 5, 'Converter current streak match');
assert(docData.schedule.timezone === 'Asia/Kolkata', 'Converter timezone match');
assert(docData.createdAt instanceof firestore_1.Timestamp, 'CreatedAt should be Timestamp');
// Test fromFirestore deserialization
const mockSnapshot = {
    id: 'r123',
    data: () => ({
        userId: 'user456',
        title: 'Ketoconazole Wash',
        description: 'Apply twice a week',
        type: 'haircare',
        status: 'active',
        schedule: {
            frequency: 'weekly',
            interval: 1,
            daysOfWeek: [1, 4],
            startDate: '2026-07-20',
            timezone: 'Asia/Kolkata',
        },
        reminders: [{ id: 'rem-1', time: '09:00', enabled: true }],
        currentStreak: 5,
        longestStreak: 12,
        lastCompletedDate: '2026-07-20',
        createdAt: firestore_1.Timestamp.fromDate(new Date('2026-07-01T00:00:00Z')),
        updatedAt: firestore_1.Timestamp.fromDate(new Date('2026-07-20T00:00:00Z')),
    }),
};
const deserialized = routine_converter_1.routineConverter.fromFirestore(mockSnapshot);
assert(deserialized.id === 'r123', 'Deserialized ID match');
assert(deserialized.createdAt instanceof Date, 'Deserialized createdAt should be Date');
assert(deserialized.schedule.timezone === 'Asia/Kolkata', 'Deserialized timezone match');
console.log('✅ Test 1 Passed');
// ---------------------------------------------------------------------------
// Test 2: RoutineLog Firestore Converter
// ---------------------------------------------------------------------------
console.log('Running Test 2: RoutineLog Firestore Converter...');
const sampleLog = {
    id: 'log789',
    routineId: 'r123',
    type: 'haircare',
    date: '2026-07-23',
    time: '14:30:00',
    status: 'completed',
    payload: { washType: 'shampoo', rating: 5 },
    timestamp: new Date('2026-07-23T14:30:00Z'),
};
const logDoc = routine_log_converter_1.routineLogConverter.toFirestore(sampleLog);
assert(logDoc.routineId === 'r123', 'Log routineId match');
assert(logDoc.payload.rating === 5, 'Log payload typed correctly');
assert(logDoc.timestamp instanceof firestore_1.Timestamp, 'Log timestamp should be Timestamp');
const mockLogSnapshot = {
    id: 'log789',
    data: () => ({
        routineId: 'r123',
        type: 'haircare',
        date: '2026-07-23',
        time: '14:30:00',
        status: 'completed',
        payload: { washType: 'shampoo', rating: 5 },
        timestamp: firestore_1.Timestamp.fromDate(new Date('2026-07-23T14:30:00Z')),
    }),
};
const deserializedLog = routine_log_converter_1.routineLogConverter.fromFirestore(mockLogSnapshot);
assert(deserializedLog.id === 'log789', 'Deserialized log ID match');
assert(deserializedLog.timestamp instanceof Date, 'Deserialized log timestamp should be Date');
console.log('✅ Test 2 Passed');
// ---------------------------------------------------------------------------
// Test 3: Query Keys Structure
// ---------------------------------------------------------------------------
console.log('Running Test 3: Query Keys Factory...');
assert(queryKeys_1.routineKeys.all[0] === 'routines', 'Query keys root match');
assert(queryKeys_1.routineKeys.detail('r123')[2] === 'r123', 'Query key detail match');
assert(queryKeys_1.routineKeys.logs('r123')[2] === 'r123', 'Query key logs match');
console.log('✅ Test 3 Passed');
console.log('\n=== All Batch 4B Infrastructure Integration Tests Passed! ===');
