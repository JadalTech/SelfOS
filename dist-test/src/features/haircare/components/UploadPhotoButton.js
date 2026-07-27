"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadPhotoButton = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
exports.UploadPhotoButton = react_1.default.memo(function UploadPhotoButton({ onPress, label = '+ Upload Progress Photo', isUploading = false }) {
    return ((0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { className: "bg-amber-500 active:bg-amber-600 px-4 py-3 rounded-xl flex-row items-center justify-center shadow-md shadow-amber-500/20", onPress: onPress, disabled: isUploading, accessibilityRole: "button", accessibilityLabel: label, children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-950 font-extrabold text-xs", children: isUploading ? 'Uploading Photo...' : label }) }));
});
