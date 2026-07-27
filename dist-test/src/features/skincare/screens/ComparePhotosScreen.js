"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComparePhotosScreen = ComparePhotosScreen;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_native_1 = require("react-native");
const expo_router_1 = require("expo-router");
const useSkinPhotos_1 = require("../hooks/useSkinPhotos");
const PhotoComparisonView_1 = require("../../../shared/components/media/PhotoComparisonView");
const EmptyStateCard_1 = require("../../../shared/components/feedback/EmptyStateCard");
const ErrorStateCard_1 = require("../../../shared/components/feedback/ErrorStateCard");
const SkeletonLoader_1 = require("../../../shared/components/loaders/SkeletonLoader");
function ComparePhotosScreen() {
    const router = (0, expo_router_1.useRouter)();
    const { photoVMs, isLoading, isError, error, refetch } = (0, useSkinPhotos_1.useSkinPhotos)();
    const [baselinePhotoId, setBaselinePhotoId] = (0, react_1.useState)(null);
    const [currentPhotoId, setCurrentPhotoId] = (0, react_1.useState)(null);
    const baselinePhoto = (0, react_1.useMemo)(() => photoVMs.find((p) => p.id === baselinePhotoId) || photoVMs[photoVMs.length - 1], [photoVMs, baselinePhotoId]);
    const currentPhoto = (0, react_1.useMemo)(() => photoVMs.find((p) => p.id === currentPhotoId) || photoVMs[0], [photoVMs, currentPhotoId]);
    return ((0, jsx_runtime_1.jsx)(react_native_1.SafeAreaView, { className: "flex-1 bg-zinc-950", children: (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-1 p-4 gap-4", children: [(0, jsx_runtime_1.jsx)(react_native_1.View, { className: "flex-row items-center justify-between border-b border-zinc-800 pb-3", children: (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center gap-3", children: [(0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { onPress: () => router.back(), className: "p-1", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-lg font-bold", children: "\u2190 Back" }) }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-50 text-xl font-extrabold", children: "Photo Comparison" })] }) }), isLoading ? ((0, jsx_runtime_1.jsx)(SkeletonLoader_1.SkeletonLoader, { height: 240 })) : isError ? ((0, jsx_runtime_1.jsx)(ErrorStateCard_1.ErrorStateCard, { message: error?.message, onRetry: refetch })) : photoVMs.length < 2 ? ((0, jsx_runtime_1.jsx)(EmptyStateCard_1.EmptyStateCard, { icon: "\uD83D\uDD0D", title: "Need At Least 2 Photos to Compare", description: "Upload baseline and current progress photos to compare skin texture, acne clearance, and hyperpigmentation.", actionLabel: "Back to Timeline", onAction: () => router.back() })) : ((0, jsx_runtime_1.jsxs)(react_native_1.ScrollView, { contentContainerStyle: { gap: 16, paddingBottom: 24 }, showsVerticalScrollIndicator: false, children: [(0, jsx_runtime_1.jsx)(PhotoComparisonView_1.PhotoComparisonView, { baselinePhotoUrl: baselinePhoto?.photoUrl, baselineDateFormatted: baselinePhoto?.dateFormatted, currentPhotoUrl: currentPhoto?.photoUrl, currentDateFormatted: currentPhoto?.dateFormatted, angleLabel: currentPhoto?.angleLabel }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-2 bg-zinc-900 border border-zinc-800 p-4 rounded-2xl", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-300 text-xs font-bold", children: "Select Baseline (Before) Photo:" }), (0, jsx_runtime_1.jsx)(react_native_1.ScrollView, { horizontal: true, showsHorizontalScrollIndicator: false, contentContainerStyle: { gap: 8 }, children: photoVMs.map((p) => {
                                        const isSelected = baselinePhoto?.id === p.id;
                                        return ((0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { onPress: () => setBaselinePhotoId(p.id), className: `px-3 py-2 rounded-xl border ${isSelected ? 'bg-pink-500/20 border-pink-500/50' : 'bg-zinc-950 border-zinc-800'}`, children: (0, jsx_runtime_1.jsxs)(react_native_1.Text, { className: `text-xs font-semibold ${isSelected ? 'text-pink-400' : 'text-zinc-400'}`, children: [p.dateFormatted, " (", p.angleLabel, ")"] }) }, p.id));
                                    }) })] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-2 bg-zinc-900 border border-zinc-800 p-4 rounded-2xl", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-300 text-xs font-bold", children: "Select Current (After) Photo:" }), (0, jsx_runtime_1.jsx)(react_native_1.ScrollView, { horizontal: true, showsHorizontalScrollIndicator: false, contentContainerStyle: { gap: 8 }, children: photoVMs.map((p) => {
                                        const isSelected = currentPhoto?.id === p.id;
                                        return ((0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { onPress: () => setCurrentPhotoId(p.id), className: `px-3 py-2 rounded-xl border ${isSelected ? 'bg-cyan-500/20 border-cyan-500/50' : 'bg-zinc-950 border-zinc-800'}`, children: (0, jsx_runtime_1.jsxs)(react_native_1.Text, { className: `text-xs font-semibold ${isSelected ? 'text-cyan-400' : 'text-zinc-400'}`, children: [p.dateFormatted, " (", p.angleLabel, ")"] }) }, p.id));
                                    }) })] })] }))] }) }));
}
