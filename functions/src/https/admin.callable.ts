/**
 * Administrative HTTPS Callable Endpoints
 */

import { createCallableHandler } from '../middleware/callable-wrapper';

export const getSystemStatusCallable = createCallableHandler({
  name: 'getSystemStatusCallable',
  requireAuth: true,
  handler: async (_input, context) => {
    return {
      nodeVersion: process.version,
      uptimeSeconds: Math.floor(process.uptime()),
      requestedBy: context.uid,
    };
  },
});
