"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatMessage = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
exports.ChatMessage = react_1.default.memo(function ChatMessage({ message }) {
    const isUser = message.sender === 'user';
    return ((0, jsx_runtime_1.jsx)(react_native_1.View, { className: `flex-row my-1 ${isUser ? 'justify-end' : 'justify-start'}`, children: (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: `max-w-[82%] p-3 rounded-2xl gap-1 shadow-sm ${isUser
                ? 'bg-amber-500 rounded-tr-xs'
                : 'bg-zinc-900 border border-zinc-800 rounded-tl-xs'}`, children: [(0, jsx_runtime_1.jsx)(react_native_1.View, { className: "flex-row items-center justify-between gap-2", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: `text-[10px] font-extrabold uppercase ${isUser ? 'text-zinc-950' : 'text-amber-400'}`, children: isUser ? 'You' : '🤖 AI Hair Coach' }) }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: `text-xs font-medium leading-relaxed ${isUser ? 'text-zinc-950' : 'text-zinc-100'}`, children: message.text })] }) }));
});
