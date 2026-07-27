"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSkinPhotos = useSkinPhotos;
const react_query_1 = require("@tanstack/react-query");
const auth_store_1 = require("../../../shared/stores/auth.store");
const skinPhoto_repository_1 = require("../repository/skinPhoto.repository");
const mappers_1 = require("../mappers");
const queryKeys_1 = require("./queryKeys");
function useSkinPhotos() {
    const queryClient = (0, react_query_1.useQueryClient)();
    const userId = (0, auth_store_1.useAuthStore)((s) => s.user?.uid);
    const query = (0, react_query_1.useQuery)({
        queryKey: queryKeys_1.skincareKeys.photos(),
        queryFn: async () => {
            if (!userId)
                return [];
            const res = await skinPhoto_repository_1.skinPhotoRepository.fetchPhotos(userId);
            if (!res.success)
                throw res.error;
            return res.data;
        },
        enabled: !!userId,
    });
    const photoVMs = (0, mappers_1.mapToProgressPhotoVMs)(query.data || []);
    const monthlyTimelineGroups = (0, mappers_1.groupPhotosByMonth)(photoVMs);
    const uploadMutation = (0, react_query_1.useMutation)({
        mutationFn: async (input) => {
            if (!userId)
                throw new Error('User is not authenticated');
            const res = await skinPhoto_repository_1.skinPhotoRepository.uploadPhoto(userId, input);
            if (!res.success)
                throw res.error;
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys_1.skincareKeys.photos() });
            queryClient.invalidateQueries({ queryKey: queryKeys_1.skincareKeys.dashboard() });
        },
    });
    const deleteMutation = (0, react_query_1.useMutation)({
        mutationFn: async (photoId) => {
            if (!userId)
                throw new Error('User is not authenticated');
            const targetPhoto = query.data?.find((p) => p.id === photoId);
            const res = await skinPhoto_repository_1.skinPhotoRepository.deletePhoto(userId, photoId, targetPhoto?.storagePath || '');
            if (!res.success)
                throw res.error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys_1.skincareKeys.photos() });
            queryClient.invalidateQueries({ queryKey: queryKeys_1.skincareKeys.dashboard() });
        },
    });
    return {
        photos: query.data || [],
        photoVMs,
        monthlyTimelineGroups,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
        uploadPhoto: uploadMutation.mutateAsync,
        isUploading: uploadMutation.isPending,
        deletePhoto: deleteMutation.mutateAsync,
        isDeleting: deleteMutation.isPending,
    };
}
