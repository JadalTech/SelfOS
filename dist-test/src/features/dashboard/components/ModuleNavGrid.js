"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuleNavGrid = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
exports.ModuleNavGrid = react_1.default.memo(function ModuleNavGrid({ modules, onModulePress }) {
    const handlePress = (mod) => {
        if (mod.enabled) {
            onModulePress(mod.route);
        }
        else {
            react_native_1.Alert.alert(`${mod.title}`, `${mod.description}\n\nThis module is under active development and will launch in a future update!`, [{ text: 'Got it', style: 'default' }]);
        }
    };
    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-4 gap-3 shadow-md", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center justify-between", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold uppercase tracking-wider", children: "SelfOS Health Modules" }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-500 text-[10px]", children: "Portal" })] }), (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "flex-row flex-wrap gap-2.5", children: modules.map((mod) => ((0, jsx_runtime_1.jsxs)(react_native_1.TouchableOpacity, { className: `w-[48%] p-3.5 rounded-xl border ${mod.enabled
                        ? 'bg-zinc-950/80 border-emerald-500/40 active:border-emerald-500'
                        : 'bg-zinc-950/40 border-zinc-800/60 opacity-70'}`, onPress: () => handlePress(mod), accessibilityRole: "button", accessibilityLabel: `${mod.title}, ${mod.enabled ? 'Enabled' : 'Coming soon'}`, children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center justify-between mb-1.5", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-2xl", children: mod.icon }), mod.badge ? ((0, jsx_runtime_1.jsx)(react_native_1.View, { className: "bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-emerald-400 text-[9px] font-extrabold", children: mod.badge }) })) : mod.comingSoon ? ((0, jsx_runtime_1.jsx)(react_native_1.View, { className: "bg-zinc-800 px-2 py-0.5 rounded-full", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-[9px] font-semibold", children: "Soon" }) })) : null] }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-100 text-sm font-bold", numberOfLines: 1, children: mod.title }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-500 text-[10px] mt-0.5", numberOfLines: 1, children: mod.description })] }, mod.id))) })] }));
});
