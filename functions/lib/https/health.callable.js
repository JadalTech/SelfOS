"use strict";
/**
 * Health Check HTTPS Callable Endpoint
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.pingCallable = void 0;
const callable_wrapper_1 = require("../middleware/callable-wrapper");
exports.pingCallable = (0, callable_wrapper_1.createCallableHandler)({
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
//# sourceMappingURL=health.callable.js.map