import React, { useState, useCallback } from 'react';
import { View, ScrollView, RefreshControl, Text, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useHairProducts } from '../hooks/useHairProducts';
import { mapToHairProductVMs } from '../mappers/products.mapper';
import { ProductCard, ProductForm, LoadingHaircare, EmptyHaircare, ErrorHaircare } from '../components';

export const HairProductsScreen: React.FC = function HairProductsScreen() {
  const router = useRouter();
  const {
    products,
    isLoading,
    isRefetching,
    isError,
    error,
    refetch,
    createProduct,
    updateProduct,
    deleteProduct,
    isMutating,
  } = useHairProducts();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const productVMs = mapToHairProductVMs(products);

  const handleToggleFavorite = useCallback(
    async (productId: string) => {
      const prod = products.find((p) => p.id === productId);
      if (prod) {
        await updateProduct({ productId, updates: { isFavorite: !prod.isFavorite } });
      }
    },
    [products, updateProduct]
  );

  const handleDelete = useCallback(
    async (productId: string) => {
      await deleteProduct(productId);
    },
    [deleteProduct]
  );

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-zinc-950">
        <LoadingHaircare />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView className="flex-1 bg-zinc-950">
        <ErrorHaircare errorMessage={error?.message} onRetry={() => void refetch()} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, gap: 16 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => void refetch()}
            tintColor="#f59e0b"
          />
        }
      >
        <View className="flex-row items-center justify-between">
          <View>
            <TouchableOpacity onPress={() => router.back()} accessibilityRole="button">
              <Text className="text-amber-400 text-xs font-semibold mb-1">← Back to Haircare</Text>
            </TouchableOpacity>
            <Text className="text-zinc-50 text-2xl font-extrabold">Hair Products Catalog</Text>
          </View>

          <TouchableOpacity
            className="bg-amber-500 active:bg-amber-600 px-4 py-2.5 rounded-xl shadow-sm"
            onPress={() => setIsAddModalOpen(true)}
            accessibilityRole="button"
          >
            <Text className="text-zinc-950 font-extrabold text-xs">+ Add Product</Text>
          </TouchableOpacity>
        </View>

        {productVMs.length === 0 ? (
          <EmptyHaircare
            title="No Hair Products Yet"
            message="Add shampoos, conditioners, hair oils, or serums to build your regimen inventory."
            actionLabel="+ Add First Product"
            onAction={() => setIsAddModalOpen(true)}
          />
        ) : (
          <View className="gap-3">
            {productVMs.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onToggleFavorite={handleToggleFavorite}
                onDelete={handleDelete}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Add Product Modal */}
      <Modal
        visible={isAddModalOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setIsAddModalOpen(false)}
      >
        <View className="flex-1 bg-black/80 justify-end p-4">
          <View className="gap-2">
            <TouchableOpacity
              className="self-end p-2 bg-zinc-800 rounded-full"
              onPress={() => setIsAddModalOpen(false)}
            >
              <Text className="text-zinc-400 text-xs font-bold">✕ Close</Text>
            </TouchableOpacity>

            <ProductForm
              isSubmitting={isMutating}
              onSubmit={async (vals) => {
                await createProduct(vals);
                setIsAddModalOpen(false);
              }}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};
