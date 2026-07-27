"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComparePhotosScreen = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_safe_area_context_1 = require("react-native-safe-area-context");
const expo_router_1 = require("expo-router");
const useHairTimeline_1 = require("../hooks/useHairTimeline");
const components_1 = require("../components");
const ComparePhotosScreen = function ComparePhotosScreen() {
    const router = (0, expo_router_1.useRouter)();
    const { photos, isLoading, isError, error, refetch } = (0, useHairTimeline_1.useHairTimeline)();
    // Auto-select initial Before (oldest) and After (newest) photos
    const sortedChronological = (0, react_1.useMemo)(() => {
        return [...photos].sort((a, b) => a.captureDate.localeCompare(b.captureDate));
    }, [photos]);
    const defaultBefore = sortedChronological[0] || null;
    const defaultAfter = sortedChronological[sortedChronological.length - 1] || null;
    const [selectedBefore, setSelectedBefore] = (0, react_1.useState)(defaultBefore);
    const [selectedAfter, setSelectedAfter] = (0, react_1.useState)(defaultAfter);
    if (isLoading) {
        return ((0, jsx_runtime_1.jsx)(react_native_safe_area_context_1.SafeAreaView, { className: "flex-1 bg-zinc-950", children: (0, jsx_runtime_1.jsx)(components_1.LoadingHaircare, {}) }));
    }
    if (isError) {
        return ((0, jsx_runtime_1.jsx)(react_native_safe_area_context_1.SafeAreaView, { className: "flex-1 bg-zinc-950", children: (0, jsx_runtime_1.jsx)(components_1.ErrorHaircare, { errorMessage: error?.message, onRetry: () => void refetch() }) }));
    }
    if (photos.length < 2) {
        return ((0, jsx_runtime_1.jsxs)(react_native_safe_area_context_1.SafeAreaView, { className: "flex-1 bg-zinc-950 p-4 gap-4", children: [(0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { onPress: () => router.back(), accessibilityRole: "button", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-amber-400 text-xs font-semibold", children: "\u2190 Back to Timeline" }) }), (0, jsx_runtime_1.jsx)(components_1.EmptyGallery, { onUploadPress: () => router.push('/(app)/haircare/timeline') })] }));
    }
    const beforePhoto = selectedBefore || defaultBefore;
    const afterPhoto = selectedAfter || defaultAfter;
    return ((0, jsx_runtime_1.jsx)(react_native_safe_area_context_1.SafeAreaView, { className: "flex-1 bg-zinc-950", children: (0, jsx_runtime_1.jsxs)(react_native_1.ScrollView, { className: "flex-1", contentContainerStyle: { padding: 16, gap: 16 }, children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { children: [(0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { onPress: () => router.back(), accessibilityRole: "button", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-amber-400 text-xs font-semibold mb-1", children: "\u2190 Back to Timeline" }) }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-50 text-2xl font-extrabold", children: "Progress Comparison" }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs mt-0.5", children: "Select any two progress photos to compare growth and hair density changes." })] }), beforePhoto && afterPhoto ? ((0, jsx_runtime_1.jsx)(components_1.ComparisonCard, { beforePhoto: beforePhoto, afterPhoto: afterPhoto })) : null, (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-3 bg-zinc-900 border border-zinc-800 p-4 rounded-2xl", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold uppercase tracking-wider", children: "Select Photo Models" }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-1.5", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-amber-400 text-xs font-bold", children: "1. Select BEFORE Photo:" }), (0, jsx_runtime_1.jsx)(react_native_1.ScrollView, { horizontal: true, showsHorizontalScrollIndicator: false, contentContainerStyle: { gap: 8 }, children: photos.map((p) => {
                                        const isSelected = beforePhoto?.id === p.id;
                                        return ((0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { className: `w-16 h-16 rounded-xl overflow-hidden border-2 ${isSelected ? 'border-amber-500 scale-105' : 'border-zinc-800 opacity-60'}`, onPress: () => setSelectedBefore(p), children: (0, jsx_runtime_1.jsx)(react_native_1.Image, { source: { uri: p.photoUrl }, className: "w-full h-full", resizeMode: "cover" }) }, `before_${p.id}`));
                                    }) })] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-1.5 pt-2 border-t border-zinc-800/60", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-emerald-400 text-xs font-bold", children: "2. Select AFTER Photo:" }), (0, jsx_runtime_1.jsx)(react_native_1.ScrollView, { horizontal: true, showsHorizontalScrollIndicator: false, contentContainerStyle: { gap: 8 }, children: photos.map((p) => {
                                        const isSelected = afterPhoto?.id === p.id;
                                        return ((0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { className: `w-16 h-16 rounded-xl overflow-hidden border-2 ${isSelected ? 'border-emerald-500 scale-105' : 'border-zinc-800 opacity-60'}`, onPress: () => setSelectedAfter(p), children: (0, jsx_runtime_1.jsx)(react_native_1.Image, { source: { uri: p.photoUrl }, className: "w-full h-full", resizeMode: "cover" }) }, `after_${p.id}`));
                                    }) })] })] })] }) }));
};
exports.ComparePhotosScreen = ComparePhotosScreen;
