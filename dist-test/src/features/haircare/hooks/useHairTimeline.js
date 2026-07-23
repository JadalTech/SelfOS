"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useHairTimeline = useHairTimeline;
const react_1 = require("react");
const useHairPhotos_1 = require("./useHairPhotos");
const photos_mapper_1 = require("../mappers/photos.mapper");
function useHairTimeline() {
    const { photos, isLoading, isRefetching, isError, error, refetch } = (0, useHairPhotos_1.useHairPhotos)();
    const photoVMs = (0, react_1.useMemo)(() => (0, photos_mapper_1.mapToHairPhotoVMs)(photos), [photos]);
    const monthGroups = (0, react_1.useMemo)(() => (0, photos_mapper_1.groupPhotosByMonth)(photoVMs), [photoVMs]);
    const latestPhoto = (0, react_1.useMemo)(() => photoVMs[0] || null, [photoVMs]);
    return {
        photos: photoVMs,
        monthGroups,
        latestPhoto,
        totalPhotosCount: photoVMs.length,
        isLoading,
        isRefetching,
        isError,
        error,
        refetch,
    };
}
