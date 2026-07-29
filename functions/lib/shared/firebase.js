"use strict";
/**
 * Firebase Admin SDK Singleton
 *
 * Safe, idempotent Admin SDK initialization preventing duplicate instance errors.
 * Exports adminDb, adminAuth, and adminStorage instances with fallback mocks for isolated test runners.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminStorage = exports.adminAuth = exports.adminDb = exports.adminApp = void 0;
exports.getAdminApp = getAdminApp;
/* eslint-disable @typescript-eslint/no-explicit-any */
let adminModule = null;
let mockAppInstance = null;
try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    adminModule = require('firebase-admin');
}
catch {
    mockAppInstance = { name: '[DEFAULT]' };
    // Mock fallback for test environment when firebase-admin isn't installed locally
    adminModule = {
        apps: [mockAppInstance],
        initializeApp: () => mockAppInstance,
        firestore: () => ({
            collection: () => ({
                doc: () => ({ get: async () => ({ exists: false, data: () => null }) }),
                where: () => ({ get: async () => ({ size: 0, docs: [], empty: true }) }),
            }),
            runTransaction: async (cb) => cb({ get: async () => ({ exists: false }), set: () => { } }),
            batch: () => ({ delete: () => { }, commit: async () => { } }),
        }),
        auth: () => ({}),
        storage: () => ({}),
    };
}
function getAdminApp() {
    if (adminModule.apps && adminModule.apps.length > 0 && adminModule.apps[0]) {
        return adminModule.apps[0];
    }
    const created = adminModule.initializeApp();
    if (!adminModule.apps || adminModule.apps.length === 0) {
        adminModule.apps = [created];
    }
    return created;
}
exports.adminApp = getAdminApp();
exports.adminDb = adminModule.firestore();
exports.adminAuth = adminModule.auth();
exports.adminStorage = adminModule.storage();
//# sourceMappingURL=firebase.js.map