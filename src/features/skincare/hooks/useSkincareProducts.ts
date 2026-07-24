import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../../shared/stores/auth.store';
import { skincareRepository, CreateSkincareProductInput } from '../repository/skincare.repository';
import { mapToSkincareProductVMs } from '../mappers';
import { skincareKeys } from './queryKeys';
import type { SkincareProduct } from '../types';

export function useSkincareProducts() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.user?.uid);

  const query = useQuery({
    queryKey: skincareKeys.products(),
    queryFn: async () => {
      if (!userId) return [];
      const res = await skincareRepository.fetchProducts(userId);
      if (!res.success) throw res.error;
      return res.data;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes fresh cache
    gcTime: 15 * 60 * 1000, // 15 minutes garbage collection
  });

  const productVMs = mapToSkincareProductVMs(query.data || []);

  const createMutation = useMutation({
    mutationFn: async (input: CreateSkincareProductInput) => {
      if (!userId) throw new Error('User is not authenticated');
      const res = await skincareRepository.createProduct(userId, input);
      if (!res.success) throw res.error;
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: skincareKeys.products() });
      queryClient.invalidateQueries({ queryKey: skincareKeys.dashboard() });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ productId, updates }: { productId: string; updates: Partial<SkincareProduct> }) => {
      if (!userId) throw new Error('User is not authenticated');
      const res = await skincareRepository.updateProduct(userId, productId, updates);
      if (!res.success) throw res.error;
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: skincareKeys.products() });
      queryClient.invalidateQueries({ queryKey: skincareKeys.dashboard() });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (productId: string) => {
      if (!userId) throw new Error('User is not authenticated');
      const res = await skincareRepository.deleteProduct(userId, productId);
      if (!res.success) throw res.error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: skincareKeys.products() });
      queryClient.invalidateQueries({ queryKey: skincareKeys.dashboard() });
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
