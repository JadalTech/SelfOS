"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhotoGrid = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const PhotoCard_1 = require("./PhotoCard");
exports.PhotoGrid = react_1.default.memo(function PhotoGrid({ photos, onPhotoPress, onPhotoDelete, }) {
    return ((0, jsx_runtime_1.jsx)(react_native_1.View, { className: "flex-row flex-wrap gap-3", children: photos.map((photo) => ((0, jsx_runtime_1.jsx)(react_native_1.View, { className: "w-[48%]", children: (0, jsx_runtime_1.jsx)(PhotoCard_1.PhotoCard, { photo: photo, onPress: onPhotoPress, onDelete: onPhotoDelete }) }, photo.id))) }));
});
