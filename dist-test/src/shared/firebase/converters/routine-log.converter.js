"use strict";
/**
 * Firestore Data Converter for RoutineLog documents
 *
 * Handles automatic Date ⇄ Timestamp conversion and payload typing.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.routineLogConverter = void 0;
const firestore_1 = require("firebase/firestore");
exports.routineLogConverter = {
    toFirestore(log) {
        return {
            routineId: log.routineId,
            type: log.type,
            date: log.date,
            time: log.time,
            status: log.status,
            payload: log.payload ?? null,
            timestamp: firestore_1.Timestamp.fromDate(log.timestamp ?? new Date()),
        };
    },
    fromFirestore(snapshot, options) {
        const data = snapshot.data(options);
        const timestampObj = data.timestamp;
        return {
            id: snapshot.id,
            routineId: data.routineId ?? '',
            type: data.type ?? 'custom',
            date: data.date ?? '',
            time: data.time ?? '',
            status: data.status ?? 'completed',
            payload: data.payload ?? undefined,
            timestamp: timestampObj ? timestampObj.toDate() : new Date(),
        };
    },
};
