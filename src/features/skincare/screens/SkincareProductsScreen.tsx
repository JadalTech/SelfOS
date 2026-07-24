import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import { useSkincareProducts } from '../hooks/useSkincareProducts';
import { ProductCard } from '../components/ProductCard';
import { ProductForm } from '../components/ProductForm';
import { EmptyStateCard } from '../../../shared/components/feedback/EmptyStateCard';
import { ErrorStateCard } from '../../../shared/components/feedback/ErrorStateCard';
import { SkeletonLoader } from '../../../shared/components/loaders/SkeletonLoader';
import { PRODUCT_CATEGORY_OPTIONS } from '../constants/skincare.constants';
import type { ProductCategory, SkincareProductVM } from '../types';
import type { SkincareProductFormValues } from '../validation/skincare.validation';

export function SkincareProductsScreen() {
  const {
    productVMs,
    isLoading,
    isError,
    error,
    refetch,
    createProduct,
    updateProduct,
    deleteProduct,
    isCreating,
    isUpdating,
  } = useSkincareProducts();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<SkincareProductVM | null>(null);

  const filteredProducts = useMemo(() => {
    return productVMs.filter((p) => {
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
      if (showFavoritesOnly && !p.isFavorite) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.keyIngredients.some((i) => i.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [productVMs, selectedCategory, showFavoritesOnly, searchQuery]);

  const handleOpenCreateForm = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (prod: SkincareProductVM) => {
    setEditingProduct(prod);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (values: SkincareProductFormValues) => {
    const parsedValues = {
      ...values,
      openedDate: values.openedDate ? new Date(values.openedDate) : undefined,
    };

    if (editingProduct) {
      await updateProduct({
        productId: editingProduct.id,
        updates: parsedValues,
      });
    } else {
      await createProduct(parsedValues);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <View className="flex-1 p-4 gap-4">
        {/* Top Header */}
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">
              Inventory & Vanity
            </Text>
            <Text className="text-zinc-50 text-2xl font-black tracking-tight">
              Skincare Products
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleOpenCreateForm}
            className="bg-pink-600 px-3.5 py-2 rounded-xl border border-pink-500/40 shadow-sm"
          >
            <Text className="text-white text-xs font-bold">+ Add Product</Text>
          </TouchableOpacity>
        </View>

        {/* Search & Favorites Toggle */}
        <View className="flex-row gap-2">
          <TextInput
            className="flex-1 bg-zinc-900 border border-zinc-800 px-3.5 py-2 rounded-xl text-zinc-50 text-xs"
            placeholder="Search by brand, name, or active ingredients..."
            placeholderTextColor="#71717a"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity
            onPress={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`px-3 items-center justify-center rounded-xl border ${
              showFavoritesOnly ? 'bg-amber-500/20 border-amber-500/50' : 'bg-zinc-900 border-zinc-800'
            }`}
          >
            <Text className="text-sm">{showFavoritesOnly ? '⭐' : '☆'}</Text>
          </TouchableOpacity>
        </View>

        {/* Category Filters */}
        <View className="max-h-8">
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={[{ value: 'all', label: 'All Categories' }, ...PRODUCT_CATEGORY_OPTIONS]}
            keyExtractor={(item) => item.value}
            contentContainerStyle={{ gap: 8 }}
            renderItem={({ item }) => {
              const isSelected = selectedCategory === item.value;
              return (
                <TouchableOpacity
                  onPress={() => setSelectedCategory(item.value as ProductCategory | 'all')}
                  className={`px-3 py-1 rounded-xl border ${
                    isSelected ? 'bg-pink-500/20 border-pink-500/50' : 'bg-zinc-900 border-zinc-800'
                  }`}
                >
                  <Text
                    className={`text-xs font-semibold ${
                      isSelected ? 'text-pink-400' : 'text-zinc-400'
                    }`}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>

        {/* Main List / States */}
        {isLoading ? (
          <View className="gap-3 mt-2">
            <SkeletonLoader height={100} />
            <SkeletonLoader height={100} />
            <SkeletonLoader height={100} />
          </View>
        ) : isError ? (
          <ErrorStateCard message={error?.message} onRetry={refetch} />
        ) : filteredProducts.length === 0 ? (
          <EmptyStateCard
            icon="🧴"
            title="No Skincare Products Found"
            description="Start building your skincare shelf by adding your cleansers, serums, moisturizers, and sunscreens."
            actionLabel="+ Add Your First Product"
            onAction={handleOpenCreateForm}
          />
        ) : (
          <FlatList
            data={filteredProducts}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ gap: 12, paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <ProductCard
                product={item}
                onToggleFavorite={() =>
                  updateProduct({ productId: item.id, updates: { isFavorite: !item.isFavorite } })
                }
                onToggleActive={() =>
                  updateProduct({ productId: item.id, updates: { isActive: !item.isActive } })
                }
                onEdit={() => handleOpenEditForm(item)}
                onDelete={() => deleteProduct(item.id)}
              />
            )}
          />
        )}

        {/* Form Modal */}
        <ProductForm
          visible={isFormOpen}
          initialValues={
            editingProduct
              ? {
                  name: editingProduct.name,
                  brand: editingProduct.brand,
                  category: editingProduct.category,
                  type: editingProduct.type,
                  keyIngredients: editingProduct.keyIngredients,
                  isFavorite: editingProduct.isFavorite,
                  notes: editingProduct.notes,
                }
              : undefined
          }
          isSubmitting={isCreating || isUpdating}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleFormSubmit}
        />
      </View>
    </SafeAreaView>
  );
}
