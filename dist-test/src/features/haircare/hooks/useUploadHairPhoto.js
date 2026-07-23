"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUploadHairPhoto = useUploadHairPhoto;
const react_query_1 = require("@tanstack/react-query");
const stores_1 = require("@/shared/stores");
const hairPhoto_repository_1 = require("../repository/hairPhoto.repository");
const queryKeys_1 = require("./queryKeys");
function useUploadHairPhoto() {
    const queryClient = (0, react_query_1.useQueryClient)();
    const user = (0, stores_1.useAuthStore)((state) => state.user);
    const userId = user?.uid;
    const uploadMutation = (0, react_query_1.useMutation)({
        mutationFn: async (input) => {
            if (!userId)
                throw new Error('User not authenticated');
            const res = await hairPhoto_repository_1.hairPhotoRepository.uploadPhoto(userId, input);
            if (!res.success)
                throw res.error;
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys_1.haircareKeys.photos() });
            queryClient.invalidateQueries({ queryKey: queryKeys_1.haircareKeys.all });
        },
    });
    return {
        uploadPhoto: uploadMutation.mutateAsync,
        isUploading: uploadMutation.isPending,
        isError: uploadMutation.isError,
        error: uploadMutation.error,
    };
}
