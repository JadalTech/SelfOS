"use strict";
/**
 * Administrative HTTPS Callable Endpoints
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSystemStatusCallable = void 0;
const callable_wrapper_1 = require("../middleware/callable-wrapper");
exports.getSystemStatusCallable = (0, callable_wrapper_1.createCallableHandler)({
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
//# sourceMappingURL=admin.callable.js.map