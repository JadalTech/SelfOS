"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterBar = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
exports.FilterBar = react_1.default.memo(function FilterBar({ options, selectedValue, onSelect, activeColor = '#ec4899', }) {
    return ((0, jsx_runtime_1.jsx)(react_native_1.View, { className: "w-full", children: (0, jsx_runtime_1.jsx)(react_native_1.ScrollView, { horizontal: true, showsHorizontalScrollIndicator: false, contentContainerStyle: { paddingHorizontal: 4, gap: 8, paddingVertical: 6 }, children: options.map((option) => {
                const isSelected = option.value === selectedValue;
                return ((0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { activeOpacity: 0.8, onPress: () => onSelect(option.value), accessible: true, accessibilityRole: "tab", accessibilityState: { selected: isSelected }, accessibilityLabel: `Filter: ${option.label}`, hitSlop: { top: 8, bottom: 8, left: 6, right: 6 }, className: "px-3.5 py-2 rounded-xl border items-center justify-center", style: {
                        backgroundColor: isSelected ? `${activeColor}20` : '#18181b',
                        borderColor: isSelected ? activeColor : '#27272a',
                    }, children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-xs font-bold uppercase tracking-wider", style: { color: isSelected ? activeColor : '#a1a1aa' }, children: option.label }) }, option.value));
            }) }) }));
});
