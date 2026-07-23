"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useHairRoutines = useHairRoutines;
const react_query_1 = require("@tanstack/react-query");
const stores_1 = require("@/shared/stores");
const haircare_repository_1 = require("../repository/haircare.repository");
const queryKeys_1 = require("./queryKeys");
const routine_1 = require("@/features/routine");
function useHairRoutines() {
    const queryClient = (0, react_query_1.useQueryClient)();
    const user = (0, stores_1.useAuthStore)((state) => state.user);
    const userId = user?.uid;
    const routinesQuery = (0, react_query_1.useQuery)({
        queryKey: queryKeys_1.haircareKeys.routines(),
        queryFn: async () => {
            if (!userId)
                return [];
            const res = await haircare_repository_1.haircareRepository.fetchHairRoutines(userId);
            if (!res.success)
                throw res.error;
            return res.data;
        },
        enabled: Boolean(userId),
        staleTime: 5 * 60 * 1000,
    });
    const createMutation = (0, react_query_1.useMutation)({
        mutationFn: async (input) => {
            if (!userId)
                throw new Error('User not authenticated');
            const res = await haircare_repository_1.haircareRepository.createHairRoutine(userId, input);
            if (!res.success)
                throw res.error;
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys_1.haircareKeys.all });
            queryClient.invalidateQueries({ queryKey: routine_1.routineKeys.all });
        },
    });
    const deleteMutation = (0, react_query_1.useMutation)({
        mutationFn: async ({ id, coreRoutineId }) => {
            if (!userId)
                throw new Error('User not authenticated');
            const res = await haircare_repository_1.haircareRepository.deleteHairRoutine(userId, id, coreRoutineId);
            if (!res.success)
                throw res.error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys_1.haircareKeys.all });
            queryClient.invalidateQueries({ queryKey: routine_1.routineKeys.all });
        },
    });
    return {
        hairRoutines: routinesQuery.data ?? [],
        isLoading: routinesQuery.isLoading,
        isRefetching: routinesQuery.isRefetching,
        isError: routinesQuery.isError,
        error: routinesQuery.error,
        refetch: routinesQuery.refetch,
        createHairRoutine: createMutation.mutateAsync,
        deleteHairRoutine: deleteMutation.mutateAsync,
        isMutating: createMutation.isPending || deleteMutation.isPending,
    };
}
