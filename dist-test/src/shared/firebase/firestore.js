"use strict";
/**
 * Firebase Firestore
 *
 * Exports a lazily-initialized Firestore instance.
 * No collections or queries — initialization only.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFirebaseFirestore = getFirebaseFirestore;
const firestore_1 = require("firebase/firestore");
const app_1 = require("./app");
let _firestore = null;
/**
 * Returns the Firestore instance, initializing it on first call.
 */
function getFirebaseFirestore() {
    if (_firestore) {
        return _firestore;
    }
    _firestore = (0, firestore_1.getFirestore)((0, app_1.getFirebaseApp)());
    return _firestore;
}
