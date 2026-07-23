import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/shared/stores';
import { haircareRepository, CreateProductInput } from '../repository/haircare.repository';
import type { HairProduct } from '../types';
import { haircareKeys } from './queryKeys';

export function useHairProducts() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const userId = user?.uid;

  const productsQuery = useQuery<HairProduct[], Error>({
    queryKey: haircareKeys.products(),
    queryFn: async () => {
      if (!userId) return [];
      const res = await haircareRepository.fetchProducts(userId);
      if (!res.success) throw res.error;
      return res.data;
    },
    enabled: Boolean(userId),
    staleTime: 5 * 60 * 1000,
  });

  const createMutation = useMutation({
    mutationFn: async (input: CreateProductInput) => {
      if (!userId) throw new Error('User not authenticated');
      const res = await haircareRepository.createProduct(userId, input);
      if (!res.success) throw res.error;
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: haircareKeys.all });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ productId, updates }: { productId: string; updates: Partial<HairProduct> }) => {
      if (!userId) throw new Error('User not authenticated');
      const res = await haircareRepository.updateProduct(userId, productId, updates);
      if (!res.success) throw res.error;
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: haircareKeys.all });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (productId: string) => {
      if (!userId) throw new Error('User not authenticated');
      const res = await haircareRepository.deleteProduct(userId, productId);
      if (!res.success) throw res.error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: haircareKeys.all });
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
