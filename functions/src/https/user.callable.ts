/**
 * User Account Management HTTPS Callable Endpoints
 */

import { createCallableHandler } from '../middleware/callable-wrapper';
import { adminDb } from '../shared/firebase';

export const exportUserDataCallable = createCallableHandler({
  name: 'exportUserDataCallable',
  requireAuth: true,
  handler: async (_input, context) => {
    const uid = context.uid!;

    const userDoc = await adminDb.collection('users').doc(uid).get();
    const routinesSnap = await adminDb.collection('routines').where('uid', '==', uid).get();
    const tasksSnap = await adminDb.collection('tasks').where('uid', '==', uid).get();

    return {
      exportedAt: new Date().toISOString(),
      userProfile: userDoc.exists ? userDoc.data() : null,
      routinesCount: routinesSnap.size,
      tasksCount: tasksSnap.size,
    };
  },
});
