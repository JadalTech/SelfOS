"use strict";
/**
 * User Account Management HTTPS Callable Endpoints
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportUserDataCallable = void 0;
const callable_wrapper_1 = require("../middleware/callable-wrapper");
const firebase_1 = require("../shared/firebase");
exports.exportUserDataCallable = (0, callable_wrapper_1.createCallableHandler)({
    name: 'exportUserDataCallable',
    requireAuth: true,
    handler: async (_input, context) => {
        const uid = context.uid;
        const userDoc = await firebase_1.adminDb.collection('users').doc(uid).get();
        const routinesSnap = await firebase_1.adminDb.collection('routines').where('uid', '==', uid).get();
        const tasksSnap = await firebase_1.adminDb.collection('tasks').where('uid', '==', uid).get();
        return {
            exportedAt: new Date().toISOString(),
            userProfile: userDoc.exists ? userDoc.data() : null,
            routinesCount: routinesSnap.size,
            tasksCount: tasksSnap.size,
        };
    },
});
//# sourceMappingURL=user.callable.js.map