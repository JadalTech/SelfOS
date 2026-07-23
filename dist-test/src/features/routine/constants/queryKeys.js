"use strict";
/**
 * Query Keys Factory for Routine Feature
 *
 * Provides type-safe, hierarchical Query Keys for React Query cache management.
 * Prevents string duplication and inline array errors.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.routineKeys = void 0;
exports.routineKeys = {
    all: ['routines'],
    lists: () => [...exports.routineKeys.all, 'list'],
    list: (filters) => [...exports.routineKeys.lists(), filters],
    details: () => [...exports.routineKeys.all, 'detail'],
    detail: (id) => [...exports.routineKeys.details(), id],
    logs: (routineId) => [...exports.routineKeys.all, 'logs', routineId],
    logsByDate: (routineId, startDate, endDate) => [...exports.routineKeys.logs(routineId), { startDate, endDate }],
};
