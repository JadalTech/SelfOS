/**
 * User Feature Master Barrel Export
 */

export type { UserProfile, UserPreferencesDomain, UserSubscriptionDomain } from './domain/entities/UserProfile';
export type { IUserRepository, UpdateUserProfilePayload } from './domain/repositories/user.repository.interface';
export { UserRepository, userRepository } from './infrastructure/repositories/user.repository';
export { UserProfileFirestoreService, userProfileFirestoreService } from './infrastructure/services/user-profile-firestore.service';
export { mapFirestoreToUserProfile, createDefaultUserDocument } from './infrastructure/mappers/firestore-user-profile.mapper';
export { useUserProfile, useUpdateProfile } from './hooks/useUserProfile';
