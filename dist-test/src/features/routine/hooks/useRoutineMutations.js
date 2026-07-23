"use strict";
/**
 * React Query Mutation Hooks for Routine Operations
 *
 * Manages cache invalidations and async mutation workflows for routines & logs.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCreateRoutine = useCreateRoutine;
exports.useUpdateRoutine = useUpdateRoutine;
exports.useArchiveRoutine = useArchiveRoutine;
exports.useRestoreRoutine = useRestoreRoutine;
exports.useCompleteRoutine = useCompleteRoutine;
exports.useSkipRoutine = useSkipRoutine;
exports.useUndoCompletion = useUndoCompletion;
const react_query_1 = require("@tanstack/react-query");
const routine_repository_1 = require("../repository/routine.repository");
const queryKeys_1 = require("../constants/queryKeys");
function useCreateRoutine() {
    const queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: async (formValues) => {
            const result = await routine_repository_1.routineRepository.createRoutine(formValues);
            if (!result.success) {
                throw result.error;
            }
            return result.data;
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: queryKeys_1.routineKeys.all });
        },
    });
}
function useUpdateRoutine() {
    const queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: async ({ routineId, formValues, }) => {
            const result = await routine_repository_1.routineRepository.updateRoutine(routineId, formValues);
            if (!result.success) {
                throw result.error;
            }
        },
        onSuccess: (_, variables) => {
            void queryClient.invalidateQueries({ queryKey: queryKeys_1.routineKeys.detail(variables.routineId) });
            void queryClient.invalidateQueries({ queryKey: queryKeys_1.routineKeys.lists() });
        },
    });
}
function useArchiveRoutine() {
    const queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: async (routineId) => {
            const result = await routine_repository_1.routineRepository.archiveRoutine(routineId);
            if (!result.success) {
                throw result.error;
            }
        },
        onSuccess: (_, routineId) => {
            void queryClient.invalidateQueries({ queryKey: queryKeys_1.routineKeys.detail(routineId) });
            void queryClient.invalidateQueries({ queryKey: queryKeys_1.routineKeys.lists() });
        },
    });
}
function useRestoreRoutine() {
    const queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: async (routineId) => {
            const result = await routine_repository_1.routineRepository.restoreRoutine(routineId);
            if (!result.success) {
                throw result.error;
            }
        },
        onSuccess: (_, routineId) => {
            void queryClient.invalidateQueries({ queryKey: queryKeys_1.routineKeys.detail(routineId) });
            void queryClient.invalidateQueries({ queryKey: queryKeys_1.routineKeys.lists() });
        },
    });
}
function useCompleteRoutine() {
    const queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: async ({ routineId, dateStr, payload, }) => {
            const result = await routine_repository_1.routineRepository.completeRoutine(routineId, dateStr, payload);
            if (!result.success) {
                throw result.error;
            }
            return result.data;
        },
        onSuccess: (_, variables) => {
            void queryClient.invalidateQueries({ queryKey: queryKeys_1.routineKeys.logs(variables.routineId) });
            void queryClient.invalidateQueries({ queryKey: queryKeys_1.routineKeys.detail(variables.routineId) });
            void queryClient.invalidateQueries({ queryKey: queryKeys_1.routineKeys.lists() });
        },
    });
}
function useSkipRoutine() {
    const queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: async ({ routineId, dateStr, payload, }) => {
            const result = await routine_repository_1.routineRepository.skipRoutine(routineId, dateStr, payload);
            if (!result.success) {
                throw result.error;
            }
            return result.data;
        },
        onSuccess: (_, variables) => {
            void queryClient.invalidateQueries({ queryKey: queryKeys_1.routineKeys.logs(variables.routineId) });
            void queryClient.invalidateQueries({ queryKey: queryKeys_1.routineKeys.detail(variables.routineId) });
            void queryClient.invalidateQueries({ queryKey: queryKeys_1.routineKeys.lists() });
        },
    });
}
function useUndoCompletion() {
    const queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: async ({ routineId, logId }) => {
            const result = await routine_repository_1.routineRepository.undoCompletion(routineId, logId);
            if (!result.success) {
                throw result.error;
            }
        },
        onSuccess: (_, variables) => {
            void queryClient.invalidateQueries({ queryKey: queryKeys_1.routineKeys.logs(variables.routineId) });
            void queryClient.invalidateQueries({ queryKey: queryKeys_1.routineKeys.detail(variables.routineId) });
            void queryClient.invalidateQueries({ queryKey: queryKeys_1.routineKeys.lists() });
        },
    });
}
