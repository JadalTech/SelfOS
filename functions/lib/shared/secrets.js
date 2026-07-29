"use strict";
/**
 * Secret Manager Wrapper
 *
 * Centralized secret management for Cloud Functions v2.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.API_SECRET_KEY = void 0;
exports.getSecretValue = getSecretValue;
const params_1 = require("firebase-functions/params");
// Define centralized secret parameters
exports.API_SECRET_KEY = (0, params_1.defineSecret)('API_SECRET_KEY');
function getSecretValue(secret) {
    return secret.value();
}
//# sourceMappingURL=secrets.js.map