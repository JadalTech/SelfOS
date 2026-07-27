"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmptyConversation = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const SAMPLE_PROMPTS = [
    'How is my overall hair health improving?',
    'Which hair products do I apply most frequently?',
    'Why is my routine consistency dropping?',
    'What should I focus on improving this month?',
];
exports.EmptyConversation = react_1.default.memo(function EmptyConversation({ onSelectSamplePrompt }) {
    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-5 items-center gap-3 my-2", children: [(0, jsx_runtime_1.jsx)(react_native_1.View, { className: "w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 items-center justify-center", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-2xl", children: "\uD83E\uDD16" }) }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-100 text-base font-bold text-center", children: "Ask Your Personal AI Hair Coach" }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs text-center leading-relaxed max-w-xs", children: "Select a sample question below or type your own question to receive contextual insights." }), (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "w-full gap-2 pt-2", children: SAMPLE_PROMPTS.map((prompt) => ((0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { className: "bg-zinc-950 border border-zinc-800 p-3 rounded-xl active:border-amber-500/60", onPress: () => onSelectSamplePrompt(prompt), children: (0, jsx_runtime_1.jsxs)(react_native_1.Text, { className: "text-amber-400 text-xs font-semibold", children: ["\uD83D\uDCA1 \"", prompt, "\""] }) }, prompt))) })] }));
});
