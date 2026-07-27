"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkincareTimelineScreen = SkincareTimelineScreen;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_native_1 = require("react-native");
const expo_router_1 = require("expo-router");
const useSkinPhotos_1 = require("../hooks/useSkinPhotos");
const PhotoUploadForm_1 = require("../components/PhotoUploadForm");
const ProgressPhotoCard_1 = require("../../../shared/components/cards/ProgressPhotoCard");
const EmptyStateCard_1 = require("../../../shared/components/feedback/EmptyStateCard");
const ErrorStateCard_1 = require("../../../shared/components/feedback/ErrorStateCard");
const SkeletonLoader_1 = require("../../../shared/components/loaders/SkeletonLoader");
const skincare_constants_1 = require("../constants/skincare.constants");
function SkincareTimelineScreen() {
    const router = (0, expo_router_1.useRouter)();
    const { monthlyTimelineGroups, isLoading, isError, error, refetch, uploadPhoto, deletePhoto, isUploading } = (0, useSkinPhotos_1.useSkinPhotos)();
    const [selectedAngle, setSelectedAngle] = (0, react_1.useState)('all');
    const [isUploadOpen, setIsUploadOpen] = (0, react_1.useState)(false);
    const filteredGroups = monthlyTimelineGroups
        .map((group) => ({
        ...group,
        photos: group.photos.filter((p) => {
            if (selectedAngle === 'all')
                return true;
            return p.angle === selectedAngle;
        }),
    }))
        .filter((g) => g.photos.length > 0);
    const handleUploadSubmit = async (values) => {
        await uploadPhoto(values);
    };
    return ((0, jsx_runtime_1.jsx)(react_native_1.SafeAreaView, { className: "flex-1 bg-zinc-950", children: (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-1 p-4 gap-4", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center justify-between", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-500 text-[10px] font-bold uppercase tracking-wider", children: "Visual Progress Gallery" }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-50 text-2xl font-black tracking-tight", children: "Skin Timeline" })] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center gap-2", children: [(0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { activeOpacity: 0.8, onPress: () => router.push('/(app)/skincare/compare'), className: "bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-xl", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-cyan-400 text-xs font-bold", children: "\uD83D\uDD0D Compare" }) }), (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { activeOpacity: 0.8, onPress: () => setIsUploadOpen(true), className: "bg-cyan-600 px-3.5 py-2 rounded-xl border border-cyan-500/40 shadow-sm", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-white text-xs font-bold", children: "+ Upload" }) })] })] }), (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "flex-row gap-2", children: [{ value: 'all', label: 'All Angles' }, ...skincare_constants_1.PHOTO_ANGLE_OPTIONS].map((opt) => {
                        const isSelected = selectedAngle === opt.value;
                        return ((0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { onPress: () => setSelectedAngle(opt.value), className: `px-3 py-1.5 rounded-xl border ${isSelected ? 'bg-cyan-500/20 border-cyan-500/50' : 'bg-zinc-900 border-zinc-800'}`, children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: `text-xs font-semibold ${isSelected ? 'text-cyan-400' : 'text-zinc-400'}`, children: opt.label }) }, opt.value));
                    }) }), isLoading ? ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-3 mt-2", children: [(0, jsx_runtime_1.jsx)(SkeletonLoader_1.SkeletonLoader, { height: 180 }), (0, jsx_runtime_1.jsx)(SkeletonLoader_1.SkeletonLoader, { height: 180 })] })) : isError ? ((0, jsx_runtime_1.jsx)(ErrorStateCard_1.ErrorStateCard, { message: error?.message, onRetry: refetch })) : filteredGroups.length === 0 ? ((0, jsx_runtime_1.jsx)(EmptyStateCard_1.EmptyStateCard, { icon: "\uD83D\uDCF8", title: "No Progress Photos Yet", description: "Document your skin journey over time with frontal, left profile, and right profile progress photos.", actionLabel: "+ Upload First Photo", onAction: () => setIsUploadOpen(true) })) : ((0, jsx_runtime_1.jsx)(react_native_1.FlatList, { data: filteredGroups, keyExtractor: (item) => item.monthYear, contentContainerStyle: { gap: 20, paddingBottom: 24 }, showsVerticalScrollIndicator: false, renderItem: ({ item }) => ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-3", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center gap-2 border-b border-zinc-800/80 pb-2", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-cyan-400 text-xs font-bold uppercase tracking-wider", children: item.monthYear }), (0, jsx_runtime_1.jsxs)(react_native_1.Text, { className: "text-zinc-600 text-xs", children: ["\u2022 ", item.photos.length, " photos"] })] }), (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "flex-row flex-wrap gap-3", children: item.photos.map((photo) => ((0, jsx_runtime_1.jsx)(react_native_1.View, { className: "w-[48%]", children: (0, jsx_runtime_1.jsx)(ProgressPhotoCard_1.ProgressPhotoCard, { photoUrl: photo.photoUrl, dateFormatted: photo.dateFormatted, angleLabel: photo.angleLabel, timeOfDayLabel: photo.timeOfDayLabel, onDelete: () => deletePhoto(photo.id) }) }, photo.id))) })] })) })), (0, jsx_runtime_1.jsx)(PhotoUploadForm_1.PhotoUploadForm, { visible: isUploadOpen, isSubmitting: isUploading, onClose: () => setIsUploadOpen(false), onSubmit: handleUploadSubmit })] }) }));
}
