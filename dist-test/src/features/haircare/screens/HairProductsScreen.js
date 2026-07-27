"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HairProductsScreen = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_safe_area_context_1 = require("react-native-safe-area-context");
const expo_router_1 = require("expo-router");
const useHairProducts_1 = require("../hooks/useHairProducts");
const products_mapper_1 = require("../mappers/products.mapper");
const components_1 = require("../components");
const HairProductsScreen = function HairProductsScreen() {
    const router = (0, expo_router_1.useRouter)();
    const { products, isLoading, isRefetching, isError, error, refetch, createProduct, updateProduct, deleteProduct, isMutating, } = (0, useHairProducts_1.useHairProducts)();
    const [isAddModalOpen, setIsAddModalOpen] = (0, react_1.useState)(false);
    const productVMs = (0, products_mapper_1.mapToHairProductVMs)(products);
    const handleToggleFavorite = (0, react_1.useCallback)(async (productId) => {
        const prod = products.find((p) => p.id === productId);
        if (prod) {
            await updateProduct({ productId, updates: { isFavorite: !prod.isFavorite } });
        }
    }, [products, updateProduct]);
    const handleDelete = (0, react_1.useCallback)(async (productId) => {
        await deleteProduct(productId);
    }, [deleteProduct]);
    if (isLoading) {
        return ((0, jsx_runtime_1.jsx)(react_native_safe_area_context_1.SafeAreaView, { className: "flex-1 bg-zinc-950", children: (0, jsx_runtime_1.jsx)(components_1.LoadingHaircare, {}) }));
    }
    if (isError) {
        return ((0, jsx_runtime_1.jsx)(react_native_safe_area_context_1.SafeAreaView, { className: "flex-1 bg-zinc-950", children: (0, jsx_runtime_1.jsx)(components_1.ErrorHaircare, { errorMessage: error?.message, onRetry: () => void refetch() }) }));
    }
    return ((0, jsx_runtime_1.jsxs)(react_native_safe_area_context_1.SafeAreaView, { className: "flex-1 bg-zinc-950", children: [(0, jsx_runtime_1.jsxs)(react_native_1.ScrollView, { className: "flex-1", contentContainerStyle: { padding: 16, gap: 16 }, refreshControl: (0, jsx_runtime_1.jsx)(react_native_1.RefreshControl, { refreshing: isRefetching, onRefresh: () => void refetch(), tintColor: "#f59e0b" }), children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center justify-between", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { children: [(0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { onPress: () => router.back(), accessibilityRole: "button", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-amber-400 text-xs font-semibold mb-1", children: "\u2190 Back to Haircare" }) }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-50 text-2xl font-extrabold", children: "Hair Products Catalog" })] }), (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { className: "bg-amber-500 active:bg-amber-600 px-4 py-2.5 rounded-xl shadow-sm", onPress: () => setIsAddModalOpen(true), accessibilityRole: "button", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-950 font-extrabold text-xs", children: "+ Add Product" }) })] }), productVMs.length === 0 ? ((0, jsx_runtime_1.jsx)(components_1.EmptyHaircare, { title: "No Hair Products Yet", message: "Add shampoos, conditioners, hair oils, or serums to build your regimen inventory.", actionLabel: "+ Add First Product", onAction: () => setIsAddModalOpen(true) })) : ((0, jsx_runtime_1.jsx)(react_native_1.View, { className: "gap-3", children: productVMs.map((product) => ((0, jsx_runtime_1.jsx)(components_1.ProductCard, { product: product, onToggleFavorite: handleToggleFavorite, onDelete: handleDelete }, product.id))) }))] }), (0, jsx_runtime_1.jsx)(react_native_1.Modal, { visible: isAddModalOpen, animationType: "slide", transparent: true, onRequestClose: () => setIsAddModalOpen(false), children: (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "flex-1 bg-black/80 justify-end p-4", children: (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-2", children: [(0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { className: "self-end p-2 bg-zinc-800 rounded-full", onPress: () => setIsAddModalOpen(false), children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-bold", children: "\u2715 Close" }) }), (0, jsx_runtime_1.jsx)(components_1.ProductForm, { isSubmitting: isMutating, onSubmit: async (vals) => {
                                    await createProduct(vals);
                                    setIsAddModalOpen(false);
                                } })] }) }) })] }));
};
exports.HairProductsScreen = HairProductsScreen;
