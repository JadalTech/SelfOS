"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NutritionChatMessage = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
exports.NutritionChatMessage = react_1.default.memo(function NutritionChatMessage({ message, }) {
    const isUser = message.sender === 'user';
    return ((0, jsx_runtime_1.jsx)(react_native_1.View, { className: `flex-row my-1.5 ${isUser ? 'justify-end' : 'justify-start'}`, accessible: true, accessibilityRole: "text", accessibilityLabel: `${isUser ? 'You' : 'AI Coach'}: ${message.text}`, children: (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: `max-w-[80%] px-4 py-3 rounded-2xl ${isUser
                ? 'bg-pink-600 rounded-tr-sm'
                : 'bg-zinc-900 border border-zinc-800 rounded-tl-sm'}`, children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: `text-sm leading-relaxed ${isUser ? 'text-white font-medium' : 'text-zinc-100'}`, children: message.text }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center justify-between mt-1.5 gap-2", children: [!isUser && message.providerName ? ((0, jsx_runtime_1.jsxs)(react_native_1.Text, { className: "text-zinc-500 text-[8px] font-bold uppercase tracking-widest", children: ["\uD83E\uDD16 ", message.providerName] })) : (0, jsx_runtime_1.jsx)(react_native_1.View, {}), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: `text-[8px] ${isUser ? 'text-pink-300' : 'text-zinc-500'} font-semibold`, children: new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) })] })] }) }));
});
