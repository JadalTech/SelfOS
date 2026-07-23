"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDeleteHairPhoto = useDeleteHairPhoto;
const react_query_1 = require("@tanstack/react-query");
const stores_1 = require("@/shared/stores");
const hairPhoto_repository_1 = require("../repository/hairPhoto.repository");
const queryKeys_1 = require("./queryKeys");
function useDeleteHairPhoto() {
    const queryClient = (0, react_query_1.useQueryClient)();
    const user = (0, stores_1.useAuthStore)((state) => state.user);
    const userId = user?.uid;
    const deleteMutation = (0, react_query_1.useMutation)({
        mutationFn: async ({ photoId, storagePath }) => {
            if (!userId)
                throw new Error('User not authenticated');
            const res = await hairPhoto_repository_1.hairPhotoRepository.deletePhoto(userId, photoId, storagePath);
            if (!res.success)
                throw res.error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys_1.haircareKeys.photos() });
            queryClient.invalidateQueries({ queryKey: queryKeys_1.haircareKeys.all });
        },
    });
    return {
        deletePhoto: deleteMutation.mutateAsync,
        isDeleting: deleteMutation.isPending,
        isError: deleteMutation.isError,
        error: deleteMutation.error,
    };
}
