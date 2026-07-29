/**
 * Health Check HTTPS Callable Endpoint
 */

import { createCallableHandler } from '../middleware/callable-wrapper';

export const pingCallable = createCallableHandler({
  name: 'pingCallable',
  requireAuth: false,
  handler: async (_input, context) => {
    return {
      status: 'ok',
      service: 'SelfOS Cloud Functions v2',
      timestamp: new Date().toISOString(),
      authenticatedUser: context.uid,
    };
  },
});
