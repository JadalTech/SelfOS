"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkinChatMessage = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_native_1 = require("react-native");
const SkinChatMessage = function SkinChatMessage({ message, }) {
    const isUser = message.sender === 'user';
    const timeStr = message.timestamp
        ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : '';
    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: `my-1.5 flex-row ${isUser ? 'justify-end' : 'justify-start'}`, children: [!isUser ? ((0, jsx_runtime_1.jsx)(react_native_1.View, { className: "w-8 h-8 rounded-full bg-pink-500/20 border border-pink-500/40 items-center justify-center mr-2 mt-1", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-pink-400 text-xs font-bold", children: "\u2728" }) })) : null, (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: `max-w-[82%] p-3.5 rounded-2xl ${isUser
                    ? 'bg-pink-600 rounded-tr-xs text-white'
                    : 'bg-zinc-900 border border-zinc-800 rounded-tl-xs text-zinc-100'}`, children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: `text-xs font-semibold mb-1 ${isUser ? 'text-pink-200' : 'text-pink-400'}`, children: isUser ? 'You' : 'Skin AI Coach' }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: `text-sm leading-5 ${isUser ? 'text-white font-medium' : 'text-zinc-200'}`, children: message.text }), timeStr ? ((0, jsx_runtime_1.jsx)(react_native_1.Text, { className: `text-[10px] mt-1.5 text-right ${isUser ? 'text-pink-200/70' : 'text-zinc-500'}`, children: timeStr })) : null] })] }));
};
exports.SkinChatMessage = SkinChatMessage;
