"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HairTimelineScreen = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_safe_area_context_1 = require("react-native-safe-area-context");
const expo_router_1 = require("expo-router");
const useHairTimeline_1 = require("../hooks/useHairTimeline");
const useUploadHairPhoto_1 = require("../hooks/useUploadHairPhoto");
const useDeleteHairPhoto_1 = require("../hooks/useDeleteHairPhoto");
const components_1 = require("../components");
const components_2 = require("@/shared/components");
const ANGLE_OPTIONS = [
    { label: 'Crown View', value: 'crown' },
    { label: 'Front Angle', value: 'front' },
    { label: 'Back View', value: 'back' },
    { label: 'Left Side', value: 'left' },
    { label: 'Right Side', value: 'right' },
    { label: 'Hairline Detail', value: 'hairline' },
];
const HairTimelineScreen = function HairTimelineScreen() {
    const router = (0, expo_router_1.useRouter)();
    const { monthGroups, totalPhotosCount, isLoading, isRefetching, isError, error, refetch } = (0, useHairTimeline_1.useHairTimeline)();
    const { uploadPhoto, isUploading } = (0, useUploadHairPhoto_1.useUploadHairPhoto)();
    const { deletePhoto, isDeleting } = (0, useDeleteHairPhoto_1.useDeleteHairPhoto)();
    // Modals & States
    const [isUploadModalOpen, setIsUploadModalOpen] = (0, react_1.useState)(false);
    const [photoToDelete, setPhotoToDelete] = (0, react_1.useState)(null);
    // Form states
    const [imageUriInput, setImageUriInput] = (0, react_1.useState)('');
    const [selectedAngle, setSelectedAngle] = (0, react_1.useState)('crown');
    const [captureDateInput, setCaptureDateInput] = (0, react_1.useState)(new Date().toISOString().split('T')[0]);
    const [notesInput, setNotesInput] = (0, react_1.useState)('');
    const handleOpenUpload = (0, react_1.useCallback)(() => {
        setImageUriInput('');
        setCaptureDateInput(new Date().toISOString().split('T')[0]);
        setSelectedAngle('crown');
        setNotesInput('');
        setIsUploadModalOpen(true);
    }, []);
    const handleConfirmUpload = (0, react_1.useCallback)(async () => {
        if (!imageUriInput.trim())
            return;
        await uploadPhoto({
            imageUri: imageUriInput.trim(),
            captureDate: captureDateInput.trim() || new Date().toISOString().split('T')[0],
            angle: selectedAngle,
            notes: notesInput.trim() || undefined,
        });
        setIsUploadModalOpen(false);
    }, [imageUriInput, captureDateInput, selectedAngle, notesInput, uploadPhoto]);
    const handleConfirmDelete = (0, react_1.useCallback)(async () => {
        if (!photoToDelete)
            return;
        await deletePhoto({
            photoId: photoToDelete.id,
            storagePath: photoToDelete.storagePath,
        });
        setPhotoToDelete(null);
    }, [photoToDelete, deletePhoto]);
    if (isLoading) {
        return ((0, jsx_runtime_1.jsx)(react_native_safe_area_context_1.SafeAreaView, { className: "flex-1 bg-zinc-950", children: (0, jsx_runtime_1.jsx)(components_1.LoadingHaircare, {}) }));
    }
    if (isError) {
        return ((0, jsx_runtime_1.jsx)(react_native_safe_area_context_1.SafeAreaView, { className: "flex-1 bg-zinc-950", children: (0, jsx_runtime_1.jsx)(components_1.ErrorHaircare, { errorMessage: error?.message, onRetry: () => void refetch() }) }));
    }
    return ((0, jsx_runtime_1.jsxs)(react_native_safe_area_context_1.SafeAreaView, { className: "flex-1 bg-zinc-950", children: [(0, jsx_runtime_1.jsxs)(react_native_1.ScrollView, { className: "flex-1", contentContainerStyle: { padding: 16, gap: 16 }, refreshControl: (0, jsx_runtime_1.jsx)(react_native_1.RefreshControl, { refreshing: isRefetching, onRefresh: () => void refetch(), tintColor: "#f59e0b" }), children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center justify-between", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { children: [(0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { onPress: () => router.back(), accessibilityRole: "button", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-amber-400 text-xs font-semibold mb-1", children: "\u2190 Back to Haircare" }) }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-50 text-2xl font-extrabold", children: "Hair Growth Timeline" })] }), totalPhotosCount >= 2 ? ((0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { className: "bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-xl", onPress: () => router.push('/(app)/haircare/compare'), accessibilityRole: "button", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-amber-400 text-xs font-bold", children: "Compare \u21C4" }) })) : null] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center justify-between bg-zinc-900/90 border border-zinc-800/80 p-3.5 rounded-2xl", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold", children: "Total Documented" }), (0, jsx_runtime_1.jsxs)(react_native_1.Text, { className: "text-zinc-100 text-lg font-black", children: [totalPhotosCount, " photos"] })] }), (0, jsx_runtime_1.jsx)(components_1.UploadPhotoButton, { onPress: handleOpenUpload, isUploading: isUploading })] }), totalPhotosCount === 0 ? ((0, jsx_runtime_1.jsx)(components_1.EmptyGallery, { onUploadPress: handleOpenUpload })) : ((0, jsx_runtime_1.jsx)(react_native_1.View, { className: "gap-4", children: monthGroups.map((group) => ((0, jsx_runtime_1.jsx)(components_1.TimelineCard, { group: group, onPhotoDelete: (photo) => setPhotoToDelete(photo) }, group.monthYearLabel))) }))] }), (0, jsx_runtime_1.jsx)(react_native_1.Modal, { visible: isUploadModalOpen, animationType: "slide", transparent: true, onRequestClose: () => setIsUploadModalOpen(false), children: (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "flex-1 bg-black/80 justify-end p-4", children: (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "bg-zinc-900 border border-zinc-800 rounded-2xl p-4 gap-4", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center justify-between", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-100 text-lg font-extrabold", children: "Upload Progress Photo" }), (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { onPress: () => setIsUploadModalOpen(false), children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-bold", children: "\u2715 Close" }) })] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-1", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold", children: "Photo Image URL or Local Path" }), (0, jsx_runtime_1.jsx)(react_native_1.TextInput, { className: "bg-zinc-950 border border-zinc-800 text-zinc-100 p-3 rounded-xl text-xs font-medium focus:border-amber-500", placeholder: "https://images.unsplash.com/... or file:///...", placeholderTextColor: "#71717a", value: imageUriInput, onChangeText: setImageUriInput })] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-1.5", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold", children: "Camera Angle" }), (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "flex-row flex-wrap gap-2", children: ANGLE_OPTIONS.map((opt) => {
                                            const isSelected = selectedAngle === opt.value;
                                            return ((0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { className: `px-3 py-2 rounded-xl border ${isSelected
                                                    ? 'bg-amber-500/20 border-amber-500'
                                                    : 'bg-zinc-950 border-zinc-800'}`, onPress: () => setSelectedAngle(opt.value), children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: `text-xs font-bold ${isSelected ? 'text-amber-400' : 'text-zinc-400'}`, children: opt.label }) }, opt.value));
                                        }) })] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-1", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold", children: "Capture Date (YYYY-MM-DD)" }), (0, jsx_runtime_1.jsx)(react_native_1.TextInput, { className: "bg-zinc-950 border border-zinc-800 text-zinc-100 p-3 rounded-xl text-xs font-medium focus:border-amber-500", value: captureDateInput, onChangeText: setCaptureDateInput })] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-1", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold", children: "Notes (Optional)" }), (0, jsx_runtime_1.jsx)(react_native_1.TextInput, { className: "bg-zinc-950 border border-zinc-800 text-zinc-100 p-3 rounded-xl text-xs font-medium focus:border-amber-500", placeholder: "e.g. Month 3 post-treatment growth", placeholderTextColor: "#71717a", value: notesInput, onChangeText: setNotesInput })] }), (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { className: "bg-amber-500 active:bg-amber-600 py-3.5 rounded-xl items-center justify-center shadow-lg shadow-amber-500/20", onPress: () => void handleConfirmUpload(), disabled: isUploading || !imageUriInput.trim(), children: isUploading ? ((0, jsx_runtime_1.jsx)(components_2.InlineLoader, { label: "Uploading photo...", color: "#09090b" })) : ((0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-950 font-extrabold text-xs", children: "Save Progress Photo" })) })] }) }) }), (0, jsx_runtime_1.jsx)(components_1.DeletePhotoDialog, { visible: Boolean(photoToDelete), photo: photoToDelete, isDeleting: isDeleting, onConfirm: handleConfirmDelete, onCancel: () => setPhotoToDelete(null) })] }));
};
exports.HairTimelineScreen = HairTimelineScreen;
