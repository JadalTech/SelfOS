"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCreateHairCondition = useCreateHairCondition;
const react_query_1 = require("@tanstack/react-query");
const stores_1 = require("@/shared/stores");
const hairCondition_repository_1 = require("../repository/hairCondition.repository");
const queryKeys_1 = require("./queryKeys");
function useCreateHairCondition() {
    const queryClient = (0, react_query_1.useQueryClient)();
    const user = (0, stores_1.useAuthStore)((state) => state.user);
    const userId = user?.uid;
    const createMutation = (0, react_query_1.useMutation)({
        mutationFn: async (input) => {
            if (!userId)
                throw new Error('User not authenticated');
            const res = await hairCondition_repository_1.hairConditionRepository.createCondition(userId, input);
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
        createCondition: createMutation.mutateAsync,
        isCreating: createMutation.isPending,
        isError: createMutation.isError,
        error: createMutation.error,
    };
}
