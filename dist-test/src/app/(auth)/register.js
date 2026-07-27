"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RegisterRoute;
const jsx_runtime_1 = require("react/jsx-runtime");
const RegisterScreen_1 = __importDefault(require("@/features/auth/screens/RegisterScreen"));
function RegisterRoute() {
    return (0, jsx_runtime_1.jsx)(RegisterScreen_1.default, {});
}
