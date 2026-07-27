"use strict";
/**
 * Firestore Collection Name Constants
 *
 * Only collections from the approved architecture (SelfOS_Project_Support_Document).
 * Centralized to eliminate magic strings in future services.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.COLLECTIONS = void 0;
exports.COLLECTIONS = {
    USERS: 'users',
    DAILY_LOGS: 'daily_logs',
    HABITS: 'habits',
    PROTEIN_ROTATION: 'protein_rotation',
    NOTIFICATIONS: 'notifications',
    PHOTOS: 'photos',
    SETTINGS: 'settings',
    STREAKS: 'streaks',
    ANALYTICS: 'analytics',
};
