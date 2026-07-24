/**
 * Skincare Module Constants & Options
 */

import type {
  ProductCategory,
  ProductType,
  RoutineTime,
  SkinType,
  SkinConcern,
  PhotoAngle,
  ReminderType,
} from '../types';

export const SKINCARE_COLLECTIONS = {
  PRODUCTS: 'skincare_products',
  ROUTINES: 'skincare_routines',
  LOGS: 'skincare_logs',
  ASSESSMENTS: 'skin_assessments',
  PHOTOS: 'skin_photos',
  REMINDERS: 'skin_reminders',
  GOALS: 'skin_goals',
} as const;

export const PRODUCT_CATEGORY_OPTIONS: { value: ProductCategory; label: string; icon: string }[] = [
  { value: 'cleanser', label: 'Cleanser', icon: 'water' },
  { value: 'toner', label: 'Toner', icon: 'beaker' },
  { value: 'essence', label: 'Essence', icon: 'sparkles' },
  { value: 'serum', label: 'Serum', icon: 'flask' },
  { value: 'ampoule', label: 'Ampoule', icon: 'flask-outline' },
  { value: 'moisturizer', label: 'Moisturizer', icon: 'leaf' },
  { value: 'sunscreen', label: 'Sunscreen', icon: 'sunny' },
  { value: 'exfoliant', label: 'Exfoliant', icon: 'refresh-circle' },
  { value: 'mask', label: 'Face Mask', icon: 'happy' },
  { value: 'eye-cream', label: 'Eye Cream', icon: 'eye' },
  { value: 'spot-treatment', label: 'Spot Treatment', icon: 'disc' },
  { value: 'face-oil', label: 'Face Oil', icon: 'drop' },
  { value: 'mist', label: 'Face Mist', icon: 'cloud-outline' },
];

export const PRODUCT_TYPE_OPTIONS: { value: ProductType; label: string }[] = [
  { value: 'liquid', label: 'Liquid' },
  { value: 'cream', label: 'Cream' },
  { value: 'gel', label: 'Gel' },
  { value: 'foam', label: 'Foam' },
  { value: 'serum', label: 'Serum' },
  { value: 'oil', label: 'Oil' },
  { value: 'balm', label: 'Balm' },
  { value: 'sheet', label: 'Sheet' },
  { value: 'powder', label: 'Powder' },
];

export const ROUTINE_TIME_OPTIONS: { value: RoutineTime; label: string; icon: string }[] = [
  { value: 'morning', label: 'Morning (AM)', icon: 'sunny-outline' },
  { value: 'evening', label: 'Evening (PM)', icon: 'moon-outline' },
  { value: 'both', label: 'Both (AM & PM)', icon: 'repeat-outline' },
  { value: 'weekly-special', label: 'Weekly Special', icon: 'calendar-outline' },
];

export const SKIN_TYPE_OPTIONS: { value: SkinType; label: string; description: string }[] = [
  { value: 'dry', label: 'Dry', description: 'Tight, flaky, or rough texture needing moisture' },
  { value: 'oily', label: 'Oily', description: 'Shiny, excess sebum production, prone to enlarged pores' },
  { value: 'combination', label: 'Combination', description: 'Oily T-zone (forehead, nose) with dry or normal cheeks' },
  { value: 'normal', label: 'Normal', description: 'Well-balanced moisture and oil levels' },
  { value: 'sensitive', label: 'Sensitive', description: 'Easily irritated, reactive, redness-prone' },
];

export const SKIN_CONCERN_OPTIONS: { value: SkinConcern; label: string }[] = [
  { value: 'acne', label: 'Acne & Breakouts' },
  { value: 'aging', label: 'Fine Lines & Aging' },
  { value: 'hyperpigmentation', label: 'Hyperpigmentation & Dark Spots' },
  { value: 'dryness', label: 'Dehydration & Dryness' },
  { value: 'redness', label: 'Redness & Rosacea' },
  { value: 'texture', label: 'Uneven Texture' },
  { value: 'dark-circles', label: 'Dark Circles' },
  { value: 'dullness', label: 'Dullness & Lack of Glow' },
  { value: 'enlarged-pores', label: 'Enlarged Pores' },
  { value: 'barrier-damage', label: 'Skin Barrier Damage' },
];

export const PHOTO_ANGLE_OPTIONS: { value: PhotoAngle; label: string }[] = [
  { value: 'front', label: 'Full Face (Front)' },
  { value: 'left-profile', label: 'Left Profile' },
  { value: 'right-profile', label: 'Right Profile' },
  { value: 'close-up', label: 'Close-Up' },
];

export const REMINDER_TYPE_OPTIONS: { value: ReminderType; label: string }[] = [
  { value: 'morning-routine', label: 'Morning Routine' },
  { value: 'evening-routine', label: 'Evening Routine' },
  { value: 'sunscreen-reapply', label: 'Sunscreen Reapplication' },
  { value: 'weekly-exfoliation', label: 'Weekly Exfoliation / Mask' },
  { value: 'assessment-checkin', label: 'Skin Health Check-In' },
];
