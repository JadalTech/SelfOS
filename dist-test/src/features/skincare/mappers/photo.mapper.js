"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapToProgressPhotoVM = mapToProgressPhotoVM;
exports.mapToProgressPhotoVMs = mapToProgressPhotoVMs;
exports.groupPhotosByMonth = groupPhotosByMonth;
const skincare_constants_1 = require("../constants/skincare.constants");
function mapToProgressPhotoVM(photo) {
    const timeOption = skincare_constants_1.ROUTINE_TIME_OPTIONS.find((t) => t.value === photo.timeOfDay);
    const timeOfDayLabel = timeOption ? timeOption.label : photo.timeOfDay;
    const angleOption = skincare_constants_1.PHOTO_ANGLE_OPTIONS.find((a) => a.value === photo.angle);
    const angleLabel = angleOption ? angleOption.label : photo.angle;
    return {
        id: photo.id,
        photoUrl: photo.photoUrl,
        date: photo.date,
        dateFormatted: photo.date,
        timeOfDayLabel,
        angle: photo.angle,
        angleLabel,
        lightingCondition: photo.lightingCondition,
        notes: photo.notes,
    };
}
function mapToProgressPhotoVMs(photos) {
    return photos.map(mapToProgressPhotoVM);
}
function groupPhotosByMonth(photoVMs) {
    const groupsMap = {};
    photoVMs.forEach((photo) => {
        // Expected date format: YYYY-MM-DD
        const parts = photo.date.split('-');
        if (parts.length >= 2) {
            const year = parts[0];
            const monthNum = parseInt(parts[1], 10) - 1;
            const monthNames = [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December',
            ];
            const monthYear = `${monthNames[monthNum] || parts[1]} ${year}`;
            if (!groupsMap[monthYear]) {
                groupsMap[monthYear] = [];
            }
            groupsMap[monthYear].push(photo);
        }
        else {
            const fallbackGroup = 'Other';
            if (!groupsMap[fallbackGroup]) {
                groupsMap[fallbackGroup] = [];
            }
            groupsMap[fallbackGroup].push(photo);
        }
    });
    return Object.keys(groupsMap).map((monthYear) => ({
        monthYear,
        photos: groupsMap[monthYear],
    }));
}
