"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useHairPhotos = useHairPhotos;
const react_query_1 = require("@tanstack/react-query");
const stores_1 = require("@/shared/stores");
const hairPhoto_repository_1 = require("../repository/hairPhoto.repository");
const queryKeys_1 = require("./queryKeys");
function useHairPhotos() {
    const user = (0, stores_1.useAuthStore)((state) => state.user);
    const userId = user?.uid;
    const photosQuery = (0, react_query_1.useQuery)({
        queryKey: queryKeys_1.haircareKeys.photos(),
        queryFn: async () => {
            if (!userId)
                return [];
            const res = await hairPhoto_repository_1.hairPhotoRepository.fetchPhotos(userId);
            if (!res.success)
                throw res.error;
            return res.data;
        },
        enabled: Boolean(userId),
        staleTime: 5 * 60 * 1000,
    });
    return {
        photos: photosQuery.data ?? [],
        isLoading: photosQuery.isLoading,
        isRefetching: photosQuery.isRefetching,
        isError: photosQuery.isError,
        error: photosQuery.error,
        refetch: photosQuery.refetch,
    };
}
