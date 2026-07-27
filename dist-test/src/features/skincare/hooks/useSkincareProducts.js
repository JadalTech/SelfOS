"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSkincareProducts = useSkincareProducts;
const react_query_1 = require("@tanstack/react-query");
const auth_store_1 = require("../../../shared/stores/auth.store");
const skincare_repository_1 = require("../repository/skincare.repository");
const mappers_1 = require("../mappers");
const queryKeys_1 = require("./queryKeys");
function useSkincareProducts() {
    const queryClient = (0, react_query_1.useQueryClient)();
    const userId = (0, auth_store_1.useAuthStore)((s) => s.user?.uid);
    const query = (0, react_query_1.useQuery)({
        queryKey: queryKeys_1.skincareKeys.products(),
        queryFn: async () => {
            if (!userId)
                return [];
            const res = await skincare_repository_1.skincareRepository.fetchProducts(userId);
            if (!res.success)
                throw res.error;
            return res.data;
        },
        enabled: !!userId,
        staleTime: 5 * 60 * 1000, // 5 minutes fresh cache
        gcTime: 15 * 60 * 1000, // 15 minutes garbage collection
    });
    const productVMs = (0, mappers_1.mapToSkincareProductVMs)(query.data || []);
    const createMutation = (0, react_query_1.useMutation)({
        mutationFn: async (input) => {
            if (!userId)
                throw new Error('User is not authenticated');
            const res = await skincare_repository_1.skincareRepository.createProduct(userId, input);
            if (!res.success)
                throw res.error;
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys_1.skincareKeys.products() });
            queryClient.invalidateQueries({ queryKey: queryKeys_1.skincareKeys.dashboard() });
        },
    });
    const updateMutation = (0, react_query_1.useMutation)({
        mutationFn: async ({ productId, updates }) => {
            if (!userId)
                throw new Error('User is not authenticated');
            const res = await skincare_repository_1.skincareRepository.updateProduct(userId, productId, updates);
            if (!res.success)
                throw res.error;
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys_1.skincareKeys.products() });
            queryClient.invalidateQueries({ queryKey: queryKeys_1.skincareKeys.dashboard() });
        },
    });
    const deleteMutation = (0, react_query_1.useMutation)({
        mutationFn: async (productId) => {
            if (!userId)
                throw new Error('User is not authenticated');
            const res = await skincare_repository_1.skincareRepository.deleteProduct(userId, productId);
            if (!res.success)
                throw res.error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys_1.skincareKeys.products() });
            queryClient.invalidateQueries({ queryKey: queryKeys_1.skincareKeys.dashboard() });
        },
    });
    return {
        products: query.data || [],
        productVMs,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
        createProduct: createMutation.mutateAsync,
        isCreating: createMutation.isPending,
        updateProduct: updateMutation.mutateAsync,
        isUpdating: updateMutation.isPending,
        deleteProduct: deleteMutation.mutateAsync,
        isDeleting: deleteMutation.isPending,
    };
}
