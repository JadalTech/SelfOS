"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorHaircare = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
exports.ErrorHaircare = react_1.default.memo(function ErrorHaircare({ errorMessage = 'Unable to load haircare data.', onRetry }) {
    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-1 items-center justify-center p-6 gap-3", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-3xl", children: "\u26A0\uFE0F" }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-100 text-base font-bold text-center", children: "Haircare Sync Error" }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs text-center", children: errorMessage }), onRetry ? ((0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { className: "px-5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl", onPress: onRetry, accessibilityRole: "button", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-200 font-bold text-xs", children: "Retry Connection" }) })) : null] }));
});
