import type { ProgressPhoto, ProgressPhotoVM, TimelineMonthGroup } from '../types';
import { ROUTINE_TIME_OPTIONS, PHOTO_ANGLE_OPTIONS } from '../constants/skincare.constants';

export function mapToProgressPhotoVM(photo: ProgressPhoto): ProgressPhotoVM {
  const timeOption = ROUTINE_TIME_OPTIONS.find((t) => t.value === photo.timeOfDay);
  const timeOfDayLabel = timeOption ? timeOption.label : photo.timeOfDay;

  const angleOption = PHOTO_ANGLE_OPTIONS.find((a) => a.value === photo.angle);
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

export function mapToProgressPhotoVMs(photos: ProgressPhoto[]): ProgressPhotoVM[] {
  return photos.map(mapToProgressPhotoVM);
}

export function groupPhotosByMonth(photoVMs: ProgressPhotoVM[]): TimelineMonthGroup[] {
  const groupsMap: Record<string, ProgressPhotoVM[]> = {};

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
    } else {
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
