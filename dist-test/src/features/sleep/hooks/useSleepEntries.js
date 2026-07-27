"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSleepEntries = useSleepEntries;
const react_query_1 = require("@tanstack/react-query");
const stores_1 = require("../../../shared/stores");
const sleep_repository_1 = require("../repository/sleep.repository");
const queryKeys_1 = require("./queryKeys");
function useSleepEntries() {
    const queryClient = (0, react_query_1.useQueryClient)();
    const user = (0, stores_1.useAuthStore)((state) => state.user);
    const userId = user?.uid;
    const entriesQuery = (0, react_query_1.useQuery)({
        queryKey: queryKeys_1.sleepKeys.entries(),
        queryFn: async () => {
            if (!userId)
                return [];
            const res = await sleep_repository_1.sleepRepository.fetchEntries(userId);
            if (!res.success)
                throw res.error;
            return res.data;
        },
        enabled: Boolean(userId),
        staleTime: 5 * 60 * 1000,
        gcTime: 15 * 60 * 1000,
    });
    const saveEntryMutation = (0, react_query_1.useMutation)({
        mutationFn: async (input) => {
            if (!userId)
                throw new Error('User not authenticated');
            const res = await sleep_repository_1.sleepRepository.saveEntry(userId, input);
            if (!res.success)
                throw res.error;
            return res.data;
        },
        onMutate: async (newEntryInput) => {
            await queryClient.cancelQueries({ queryKey: queryKeys_1.sleepKeys.entries() });
            const previousEntries = queryClient.getQueryData(queryKeys_1.sleepKeys.entries());
            if (previousEntries) {
                const tempEntry = {
                    ...newEntryInput,
                    id: newEntryInput.id || newEntryInput.date || `temp_${Date.now()}`,
                    userId: userId || '',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };
                queryClient.setQueryData(queryKeys_1.sleepKeys.entries(), [tempEntry, ...previousEntries.filter((e) => e.date !== tempEntry.date)]);
            }
            return { previousEntries };
        },
        onError: (_err, _newEntry, context) => {
            if (context?.previousEntries) {
                queryClient.setQueryData(queryKeys_1.sleepKeys.entries(), context.previousEntries);
            }
        },
        onSuccess: () => {
            // Invalidate all sleep queries to ensure sync
            queryClient.invalidateQueries({ queryKey: queryKeys_1.sleepKeys.all });
        },
    });
    const deleteEntryMutation = (0, react_query_1.useMutation)({
        mutationFn: async (entryId) => {
            if (!userId)
                throw new Error('User not authenticated');
            const res = await sleep_repository_1.sleepRepository.deleteEntry(userId, entryId);
            if (!res.success)
                throw res.error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys_1.sleepKeys.all });
        },
    });
    return {
        entries: entriesQuery.data ?? [],
        isLoading: entriesQuery.isLoading,
        isRefetching: entriesQuery.isRefetching,
        isError: entriesQuery.isError,
        error: entriesQuery.error,
        refetch: entriesQuery.refetch,
        saveEntry: saveEntryMutation.mutateAsync,
        isSaving: saveEntryMutation.isPending,
        deleteEntry: deleteEntryMutation.mutateAsync,
        isDeleting: deleteEntryMutation.isPending,
    };
}
