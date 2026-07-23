"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUpdateHairCondition = useUpdateHairCondition;
const react_query_1 = require("@tanstack/react-query");
const stores_1 = require("@/shared/stores");
const hairCondition_repository_1 = require("../repository/hairCondition.repository");
const queryKeys_1 = require("./queryKeys");
function useUpdateHairCondition() {
    const queryClient = (0, react_query_1.useQueryClient)();
    const user = (0, stores_1.useAuthStore)((state) => state.user);
    const userId = user?.uid;
    const updateMutation = (0, react_query_1.useMutation)({
        mutationFn: async ({ id, updates }) => {
            if (!userId)
                throw new Error('User not authenticated');
            const res = await hairCondition_repository_1.hairConditionRepository.updateCondition(userId, id, updates);
            if (!res.success)
                throw res.error;
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys_1.haircareKeys.conditions() });
            queryClient.invalidateQueries({ queryKey: queryKeys_1.haircareKeys.all });
        },
    });
    return {
        updateCondition: updateMutation.mutateAsync,
        isUpdating: updateMutation.isPending,
        isError: updateMutation.isError,
        error: updateMutation.error,
    };
}
