/**
 * Firebase Infrastructure Type Definitions
 *
 * Centralizes type aliases for Firebase SDK instances used across the application.
 * Prevents direct SDK import dependency in non-infrastructure layers.
 */

import type { FirebaseApp } from 'firebase/app';
import type { Auth, User, UserCredential } from 'firebase/auth';
import type { Firestore, DocumentData, QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore';
import type { FirebaseStorage } from 'firebase/storage';

export type FirebaseAppInstance = FirebaseApp;
export type FirebaseAuthInstance = Auth;
export type FirestoreDbInstance = Firestore;
export type FirebaseStorageInstance = FirebaseStorage;

export type FirebaseUser = User;
export type FirebaseUserCredential = UserCredential;

export type FirestoreDocumentData = DocumentData;
export type FirestoreQuerySnapshot<T = DocumentData> = QueryDocumentSnapshot<T>;
export type FirestoreSnapshotOptions = SnapshotOptions;
