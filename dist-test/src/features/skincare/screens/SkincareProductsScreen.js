"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkincareProductsScreen = SkincareProductsScreen;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_native_1 = require("react-native");
const useSkincareProducts_1 = require("../hooks/useSkincareProducts");
const ProductCard_1 = require("../components/ProductCard");
const ProductForm_1 = require("../components/ProductForm");
const EmptyStateCard_1 = require("../../../shared/components/feedback/EmptyStateCard");
const ErrorStateCard_1 = require("../../../shared/components/feedback/ErrorStateCard");
const SkeletonLoader_1 = require("../../../shared/components/loaders/SkeletonLoader");
const skincare_constants_1 = require("../constants/skincare.constants");
function SkincareProductsScreen() {
    const { productVMs, isLoading, isError, error, refetch, createProduct, updateProduct, deleteProduct, isCreating, isUpdating, } = (0, useSkincareProducts_1.useSkincareProducts)();
    const [searchQuery, setSearchQuery] = (0, react_1.useState)('');
    const [selectedCategory, setSelectedCategory] = (0, react_1.useState)('all');
    const [showFavoritesOnly, setShowFavoritesOnly] = (0, react_1.useState)(false);
    const [isFormOpen, setIsFormOpen] = (0, react_1.useState)(false);
    const [editingProduct, setEditingProduct] = (0, react_1.useState)(null);
    const filteredProducts = (0, react_1.useMemo)(() => {
        return productVMs.filter((p) => {
            if (selectedCategory !== 'all' && p.category !== selectedCategory)
                return false;
            if (showFavoritesOnly && !p.isFavorite)
                return false;
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                return (p.name.toLowerCase().includes(q) ||
                    p.brand.toLowerCase().includes(q) ||
                    p.keyIngredients.some((i) => i.toLowerCase().includes(q)));
            }
            return true;
        });
    }, [productVMs, selectedCategory, showFavoritesOnly, searchQuery]);
    const handleOpenCreateForm = () => {
        setEditingProduct(null);
        setIsFormOpen(true);
    };
    const handleOpenEditForm = (prod) => {
        setEditingProduct(prod);
        setIsFormOpen(true);
    };
    const handleFormSubmit = async (values) => {
        const parsedValues = {
            ...values,
            openedDate: values.openedDate ? new Date(values.openedDate) : undefined,
        };
        if (editingProduct) {
            await updateProduct({
                productId: editingProduct.id,
                updates: parsedValues,
            });
        }
        else {
            await createProduct(parsedValues);
        }
    };
    return ((0, jsx_runtime_1.jsx)(react_native_1.SafeAreaView, { className: "flex-1 bg-zinc-950", children: (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-1 p-4 gap-4", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center justify-between", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-500 text-[10px] font-bold uppercase tracking-wider", children: "Inventory & Vanity" }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-50 text-2xl font-black tracking-tight", children: "Skincare Products" })] }), (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { activeOpacity: 0.8, onPress: handleOpenCreateForm, className: "bg-pink-600 px-3.5 py-2 rounded-xl border border-pink-500/40 shadow-sm", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-white text-xs font-bold", children: "+ Add Product" }) })] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row gap-2", children: [(0, jsx_runtime_1.jsx)(react_native_1.TextInput, { className: "flex-1 bg-zinc-900 border border-zinc-800 px-3.5 py-2 rounded-xl text-zinc-50 text-xs", placeholder: "Search by brand, name, or active ingredients...", placeholderTextColor: "#71717a", value: searchQuery, onChangeText: setSearchQuery }), (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { onPress: () => setShowFavoritesOnly(!showFavoritesOnly), className: `px-3 items-center justify-center rounded-xl border ${showFavoritesOnly ? 'bg-amber-500/20 border-amber-500/50' : 'bg-zinc-900 border-zinc-800'}`, children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-sm", children: showFavoritesOnly ? '⭐' : '☆' }) })] }), (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "max-h-8", children: (0, jsx_runtime_1.jsx)(react_native_1.FlatList, { horizontal: true, showsHorizontalScrollIndicator: false, data: [{ value: 'all', label: 'All Categories' }, ...skincare_constants_1.PRODUCT_CATEGORY_OPTIONS], keyExtractor: (item) => item.value, contentContainerStyle: { gap: 8 }, renderItem: ({ item }) => {
                            const isSelected = selectedCategory === item.value;
                            return ((0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { onPress: () => setSelectedCategory(item.value), className: `px-3 py-1 rounded-xl border ${isSelected ? 'bg-pink-500/20 border-pink-500/50' : 'bg-zinc-900 border-zinc-800'}`, children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: `text-xs font-semibold ${isSelected ? 'text-pink-400' : 'text-zinc-400'}`, children: item.label }) }));
                        } }) }), isLoading ? ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-3 mt-2", children: [(0, jsx_runtime_1.jsx)(SkeletonLoader_1.SkeletonLoader, { height: 100 }), (0, jsx_runtime_1.jsx)(SkeletonLoader_1.SkeletonLoader, { height: 100 }), (0, jsx_runtime_1.jsx)(SkeletonLoader_1.SkeletonLoader, { height: 100 })] })) : isError ? ((0, jsx_runtime_1.jsx)(ErrorStateCard_1.ErrorStateCard, { message: error?.message, onRetry: refetch })) : filteredProducts.length === 0 ? ((0, jsx_runtime_1.jsx)(EmptyStateCard_1.EmptyStateCard, { icon: "\uD83E\uDDF4", title: "No Skincare Products Found", description: "Start building your skincare shelf by adding your cleansers, serums, moisturizers, and sunscreens.", actionLabel: "+ Add Your First Product", onAction: handleOpenCreateForm })) : ((0, jsx_runtime_1.jsx)(react_native_1.FlatList, { data: filteredProducts, keyExtractor: (item) => item.id, contentContainerStyle: { gap: 12, paddingBottom: 24 }, showsVerticalScrollIndicator: false, renderItem: ({ item }) => ((0, jsx_runtime_1.jsx)(ProductCard_1.ProductCard, { product: item, onToggleFavorite: () => updateProduct({ productId: item.id, updates: { isFavorite: !item.isFavorite } }), onToggleActive: () => updateProduct({ productId: item.id, updates: { isActive: !item.isActive } }), onEdit: () => handleOpenEditForm(item), onDelete: () => deleteProduct(item.id) })) })), (0, jsx_runtime_1.jsx)(ProductForm_1.ProductForm, { visible: isFormOpen, initialValues: editingProduct
                        ? {
                            name: editingProduct.name,
                            brand: editingProduct.brand,
                            category: editingProduct.category,
                            type: editingProduct.type,
                            keyIngredients: editingProduct.keyIngredients,
                            isFavorite: editingProduct.isFavorite,
                            notes: editingProduct.notes,
                        }
                        : undefined, isSubmitting: isCreating || isUpdating, onClose: () => setIsFormOpen(false), onSubmit: handleFormSubmit })] }) }));
}
