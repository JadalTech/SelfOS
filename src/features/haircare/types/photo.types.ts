export type PhotoAngle = 'front' | 'back' | 'crown' | 'left' | 'right' | 'hairline';

export interface HairPhoto {
  readonly id: string;
  readonly userId: string;
  readonly photoUrl: string;
  readonly storagePath: string;
  readonly captureDate: string; // YYYY-MM-DD
  readonly angle: PhotoAngle;
  readonly notes?: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface HairPhotoVM {
  readonly id: string;
  readonly photoUrl: string;
  readonly storagePath: string;
  readonly captureDate: string;
  readonly formattedDate: string;
  readonly angle: PhotoAngle;
  readonly angleLabel: string;
  readonly notes?: string;
}

export interface TimelineMonthGroup {
  readonly monthYearLabel: string; // e.g. "July 2026"
  readonly photos: HairPhotoVM[];
}
