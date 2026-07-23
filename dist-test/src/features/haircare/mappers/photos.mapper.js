"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapToHairPhotoVM = mapToHairPhotoVM;
exports.mapToHairPhotoVMs = mapToHairPhotoVMs;
exports.groupPhotosByMonth = groupPhotosByMonth;
const ANGLE_LABELS = {
    front: 'Front Angle',
    back: 'Back View',
    crown: 'Crown View',
    left: 'Left Side',
    right: 'Right Side',
    hairline: 'Hairline Detail',
};
const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];
function mapToHairPhotoVM(photo) {
    const parts = photo.captureDate.split('-');
    let formattedDate = photo.captureDate;
    if (parts.length === 3) {
        const year = parts[0];
        const monthIdx = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        if (monthIdx >= 0 && monthIdx < 12) {
            formattedDate = `${MONTH_NAMES[monthIdx].substring(0, 3)} ${day}, ${year}`;
        }
    }
    return {
        id: photo.id,
        photoUrl: photo.photoUrl,
        storagePath: photo.storagePath,
        captureDate: photo.captureDate,
        formattedDate,
        angle: photo.angle,
        angleLabel: ANGLE_LABELS[photo.angle] || 'Crown View',
        notes: photo.notes,
    };
}
function mapToHairPhotoVMs(photos) {
    return photos.map(mapToHairPhotoVM);
}
function groupPhotosByMonth(photoVMs) {
    const groupsMap = new Map();
    for (const photo of photoVMs) {
        const parts = photo.captureDate.split('-');
        let groupKey = 'Other';
        if (parts.length === 3) {
            const year = parts[0];
            const monthIdx = parseInt(parts[1], 10) - 1;
            if (monthIdx >= 0 && monthIdx < 12) {
                groupKey = `${MONTH_NAMES[monthIdx]} ${year}`;
            }
        }
        const existing = groupsMap.get(groupKey) || [];
        existing.push(photo);
        groupsMap.set(groupKey, existing);
    }
    const result = [];
    groupsMap.forEach((photos, monthYearLabel) => {
        result.push({
            monthYearLabel,
            photos,
        });
    });
    return result;
}
