import type { HairPhoto, HairPhotoVM, TimelineMonthGroup, PhotoAngle } from '../types';

const ANGLE_LABELS: Record<PhotoAngle, string> = {
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

export function mapToHairPhotoVM(photo: HairPhoto): HairPhotoVM {
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

export function mapToHairPhotoVMs(photos: HairPhoto[]): HairPhotoVM[] {
  return photos.map(mapToHairPhotoVM);
}

export function groupPhotosByMonth(photoVMs: HairPhotoVM[]): TimelineMonthGroup[] {
  const groupsMap = new Map<string, HairPhotoVM[]>();

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

  const result: TimelineMonthGroup[] = [];
  groupsMap.forEach((photos, monthYearLabel) => {
    result.push({
      monthYearLabel,
      photos,
    });
  });

  return result;
}
