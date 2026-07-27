"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromptInput = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const components_1 = require("@/shared/components");
exports.PromptInput = react_1.default.memo(function PromptInput({ onSend, isSending = false }) {
    const [inputText, setInputText] = (0, react_1.useState)('');
    const handleSend = async () => {
        if (!inputText.trim() || isSending)
            return;
        const text = inputText.trim();
        setInputText('');
        await onSend(text);
    };
    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center gap-2 bg-zinc-900 border border-zinc-800 p-2 rounded-2xl", children: [(0, jsx_runtime_1.jsx)(react_native_1.TextInput, { className: "flex-1 text-zinc-100 px-3 py-2 text-xs font-medium focus:outline-none", placeholder: "Ask AI Coach a question...", placeholderTextColor: "#71717a", value: inputText, onChangeText: setInputText, onSubmitEditing: () => void handleSend() }), (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { className: `px-4 py-2.5 rounded-xl ${inputText.trim() && !isSending
                    ? 'bg-amber-500 active:bg-amber-600'
                    : 'bg-zinc-800 opacity-50'}`, onPress: () => void handleSend(), disabled: !inputText.trim() || isSending, accessibilityRole: "button", children: isSending ? ((0, jsx_runtime_1.jsx)(components_1.InlineLoader, { label: "...", color: "#09090b" })) : ((0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-950 font-extrabold text-xs", children: "Send" })) })] }));
});
