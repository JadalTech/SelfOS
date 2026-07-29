/**
 * User Document Firestore Converter
 */

import { createFirestoreConverter } from './generic.converter';
import type { UserDocument } from '../types/user-document';

export const userDocumentConverter = createFirestoreConverter<UserDocument>();
