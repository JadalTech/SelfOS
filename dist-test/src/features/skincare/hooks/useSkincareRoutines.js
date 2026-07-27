"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSkincareRoutines = useSkincareRoutines;
const react_query_1 = require("@tanstack/react-query");
const auth_store_1 = require("../../../shared/stores/auth.store");
const skincare_repository_1 = require("../repository/skincare.repository");
const mappers_1 = require("../mappers");
const useSkincareProducts_1 = require("./useSkincareProducts");
const queryKeys_1 = require("./queryKeys");
function useSkincareRoutines() {
    const queryClient = (0, react_query_1.useQueryClient)();
    const userId = (0, auth_store_1.useAuthStore)((s) => s.user?.uid);
    const { products } = (0, useSkincareProducts_1.useSkincareProducts)();
    const query = (0, react_query_1.useQuery)({
        queryKey: queryKeys_1.skincareKeys.routines(),
        queryFn: async () => {
            if (!userId)
                return [];
            const res = await skincare_repository_1.skincareRepository.fetchRoutines(userId);
            if (!res.success)
                throw res.error;
            return res.data;
        },
        enabled: !!userId,
        staleTime: 5 * 60 * 1000,
        gcTime: 15 * 60 * 1000,
    });
    const routineVMs = (0, mappers_1.mapToSkincareRoutineVMs)(query.data || [], products);
    const createMutation = (0, react_query_1.useMutation)({
        mutationFn: async (input) => {
            if (!userId)
                throw new Error('User is not authenticated');
            const res = await skincare_repository_1.skincareRepository.createSkincareRoutine(userId, input);
            if (!res.success)
                throw res.error;
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys_1.skincareKeys.routines() });
            queryClient.invalidateQueries({ queryKey: queryKeys_1.skincareKeys.dashboard() });
        },
    });
    const updateMutation = (0, react_query_1.useMutation)({
        mutationFn: async ({ skincareRoutineId, updates }) => {
            if (!userId)
                throw new Error('User is not authenticated');
            const res = await skincare_repository_1.skincareRepository.updateSkincareRoutine(userId, skincareRoutineId, updates);
            if (!res.success)
                throw res.error;
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys_1.skincareKeys.routines() });
            queryClient.invalidateQueries({ queryKey: queryKeys_1.skincareKeys.dashboard() });
        },
    });
    const deleteMutation = (0, react_query_1.useMutation)({
        mutationFn: async ({ skincareRoutineId, coreRoutineId }) => {
            if (!userId)
                throw new Error('User is not authenticated');
            const res = await skincare_repository_1.skincareRepository.deleteSkincareRoutine(userId, skincareRoutineId, coreRoutineId);
            if (!res.success)
                throw res.error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys_1.skincareKeys.routines() });
            queryClient.invalidateQueries({ queryKey: queryKeys_1.skincareKeys.dashboard() });
        },
    });
    return {
        routines: query.data || [],
        routineVMs,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
        createRoutine: createMutation.mutateAsync,
        isCreating: createMutation.isPending,
        updateRoutine: updateMutation.mutateAsync,
        isUpdating: updateMutation.isPending,
        deleteRoutine: deleteMutation.mutateAsync,
        isDeleting: deleteMutation.isPending,
    };
}
