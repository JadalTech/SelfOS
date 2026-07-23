"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useHairProducts = useHairProducts;
const react_query_1 = require("@tanstack/react-query");
const stores_1 = require("@/shared/stores");
const haircare_repository_1 = require("../repository/haircare.repository");
const queryKeys_1 = require("./queryKeys");
function useHairProducts() {
    const queryClient = (0, react_query_1.useQueryClient)();
    const user = (0, stores_1.useAuthStore)((state) => state.user);
    const userId = user?.uid;
    const productsQuery = (0, react_query_1.useQuery)({
        queryKey: queryKeys_1.haircareKeys.products(),
        queryFn: async () => {
            if (!userId)
                return [];
            const res = await haircare_repository_1.haircareRepository.fetchProducts(userId);
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
            const res = await haircare_repository_1.haircareRepository.createProduct(userId, input);
            if (!res.success)
                throw res.error;
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys_1.haircareKeys.all });
        },
    });
    const updateMutation = (0, react_query_1.useMutation)({
        mutationFn: async ({ productId, updates }) => {
            if (!userId)
                throw new Error('User not authenticated');
            const res = await haircare_repository_1.haircareRepository.updateProduct(userId, productId, updates);
            if (!res.success)
                throw res.error;
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys_1.haircareKeys.all });
        },
    });
    const deleteMutation = (0, react_query_1.useMutation)({
        mutationFn: async (productId) => {
            if (!userId)
                throw new Error('User not authenticated');
            const res = await haircare_repository_1.haircareRepository.deleteProduct(userId, productId);
            if (!res.success)
                throw res.error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys_1.haircareKeys.all });
        },
    });
    return {
        products: productsQuery.data ?? [],
        isLoading: productsQuery.isLoading,
        isRefetching: productsQuery.isRefetching,
        isError: productsQuery.isError,
        error: productsQuery.error,
        refetch: productsQuery.refetch,
        createProduct: createMutation.mutateAsync,
        updateProduct: updateMutation.mutateAsync,
        deleteProduct: deleteMutation.mutateAsync,
        isMutating: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
    };
}
