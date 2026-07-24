"use strict";
/**
 * Firebase Cloud Storage
 *
 * Exports a lazily-initialized Storage instance.
 * No upload/download logic — initialization only.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFirebaseStorage = getFirebaseStorage;
const storage_1 = require("firebase/storage");
const app_1 = require("./app");
let _storage = null;
/**
 * Returns the Firebase Storage instance, initializing it on first call.
 */
function getFirebaseStorage() {
    if (_storage) {
        return _storage;
    }
    _storage = (0, storage_1.getStorage)((0, app_1.getFirebaseApp)());
    return _storage;
}
