"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSkinReminders = useSkinReminders;
const react_query_1 = require("@tanstack/react-query");
const auth_store_1 = require("../../../shared/stores/auth.store");
const skinReminder_repository_1 = require("../repository/skinReminder.repository");
const queryKeys_1 = require("./queryKeys");
function useSkinReminders() {
    const queryClient = (0, react_query_1.useQueryClient)();
    const userId = (0, auth_store_1.useAuthStore)((s) => s.user?.uid);
    const query = (0, react_query_1.useQuery)({
        queryKey: queryKeys_1.skincareKeys.reminders(),
        queryFn: async () => {
            if (!userId)
                return [];
            const res = await skinReminder_repository_1.skinReminderRepository.fetchReminders(userId);
            if (!res.success)
                throw res.error;
            return res.data;
        },
        enabled: !!userId,
    });
    const createMutation = (0, react_query_1.useMutation)({
        mutationFn: async (input) => {
            if (!userId)
                throw new Error('User is not authenticated');
            const res = await skinReminder_repository_1.skinReminderRepository.createReminder(userId, input);
            if (!res.success)
                throw res.error;
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys_1.skincareKeys.reminders() });
        },
    });
    const updateMutation = (0, react_query_1.useMutation)({
        mutationFn: async ({ reminderId, updates }) => {
            if (!userId)
                throw new Error('User is not authenticated');
            const res = await skinReminder_repository_1.skinReminderRepository.updateReminder(userId, reminderId, updates);
            if (!res.success)
                throw res.error;
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys_1.skincareKeys.reminders() });
        },
    });
    const deleteMutation = (0, react_query_1.useMutation)({
        mutationFn: async (reminderId) => {
            if (!userId)
                throw new Error('User is not authenticated');
            const res = await skinReminder_repository_1.skinReminderRepository.deleteReminder(userId, reminderId);
            if (!res.success)
                throw res.error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys_1.skincareKeys.reminders() });
        },
    });
    return {
        reminders: query.data || [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
        createReminder: createMutation.mutateAsync,
        isCreating: createMutation.isPending,
        updateReminder: updateMutation.mutateAsync,
        isUpdating: updateMutation.isPending,
        deleteReminder: deleteMutation.mutateAsync,
        isDeleting: deleteMutation.isPending,
    };
}
