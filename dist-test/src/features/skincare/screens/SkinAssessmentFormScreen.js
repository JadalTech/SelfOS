"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkinAssessmentFormScreen = SkinAssessmentFormScreen;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_native_1 = require("react-native");
const expo_router_1 = require("expo-router");
const useSkinAssessments_1 = require("../hooks/useSkinAssessments");
const AssessmentForm_1 = require("../components/AssessmentForm");
function SkinAssessmentFormScreen() {
    const router = (0, expo_router_1.useRouter)();
    const { createAssessment, isCreating } = (0, useSkinAssessments_1.useSkinAssessments)();
    const handleSubmit = async (values) => {
        await createAssessment(values);
        router.back();
    };
    return ((0, jsx_runtime_1.jsx)(react_native_1.SafeAreaView, { className: "flex-1 bg-zinc-950", children: (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-1 p-4 gap-4", children: [(0, jsx_runtime_1.jsx)(react_native_1.View, { className: "flex-row items-center justify-between border-b border-zinc-800 pb-3", children: (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center gap-3", children: [(0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { onPress: () => router.back(), className: "p-1", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-lg font-bold", children: "\u2190 Back" }) }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-50 text-xl font-extrabold", children: "New Skin Assessment" })] }) }), (0, jsx_runtime_1.jsx)(AssessmentForm_1.AssessmentForm, { isSubmitting: isCreating, onSubmit: handleSubmit })] }) }));
}
