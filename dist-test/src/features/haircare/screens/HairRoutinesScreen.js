"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HairRoutinesScreen = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_safe_area_context_1 = require("react-native-safe-area-context");
const expo_router_1 = require("expo-router");
const useHairRoutines_1 = require("../hooks/useHairRoutines");
const useHairProducts_1 = require("../hooks/useHairProducts");
const routine_1 = require("@/features/routine");
const routines_mapper_1 = require("../mappers/routines.mapper");
const products_mapper_1 = require("../mappers/products.mapper");
const components_1 = require("../components");
const HairRoutinesScreen = function HairRoutinesScreen() {
    const router = (0, expo_router_1.useRouter)();
    const { hairRoutines, isLoading, isRefetching, isError, error, refetch, createHairRoutine, deleteHairRoutine, isMutating, } = (0, useHairRoutines_1.useHairRoutines)();
    const { products } = (0, useHairProducts_1.useHairProducts)();
    const coreRoutinesState = (0, routine_1.useRoutines)({ type: 'haircare' });
    const coreRoutines = (0, react_1.useMemo)(() => coreRoutinesState.data ?? [], [coreRoutinesState.data]);
    const [isAddModalOpen, setIsAddModalOpen] = (0, react_1.useState)(false);
    const productVMs = (0, products_mapper_1.mapToHairProductVMs)(products);
    const routineVMs = (0, routines_mapper_1.mapToHairRoutineVMs)(hairRoutines, coreRoutines, products);
    const handleDelete = (0, react_1.useCallback)(async (id, routineId) => {
        await deleteHairRoutine({ id, coreRoutineId: routineId });
    }, [deleteHairRoutine]);
    if (isLoading) {
        return ((0, jsx_runtime_1.jsx)(react_native_safe_area_context_1.SafeAreaView, { className: "flex-1 bg-zinc-950", children: (0, jsx_runtime_1.jsx)(components_1.LoadingHaircare, {}) }));
    }
    if (isError) {
        return ((0, jsx_runtime_1.jsx)(react_native_safe_area_context_1.SafeAreaView, { className: "flex-1 bg-zinc-950", children: (0, jsx_runtime_1.jsx)(components_1.ErrorHaircare, { errorMessage: error?.message, onRetry: () => void refetch() }) }));
    }
    return ((0, jsx_runtime_1.jsxs)(react_native_safe_area_context_1.SafeAreaView, { className: "flex-1 bg-zinc-950", children: [(0, jsx_runtime_1.jsxs)(react_native_1.ScrollView, { className: "flex-1", contentContainerStyle: { padding: 16, gap: 16 }, refreshControl: (0, jsx_runtime_1.jsx)(react_native_1.RefreshControl, { refreshing: isRefetching, onRefresh: () => void refetch(), tintColor: "#f59e0b" }), children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center justify-between", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { children: [(0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { onPress: () => router.back(), accessibilityRole: "button", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-amber-400 text-xs font-semibold mb-1", children: "\u2190 Back to Haircare" }) }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-50 text-2xl font-extrabold", children: "Hair Routines" })] }), (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { className: "bg-emerald-500 active:bg-emerald-600 px-4 py-2.5 rounded-xl shadow-sm", onPress: () => setIsAddModalOpen(true), accessibilityRole: "button", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-950 font-extrabold text-xs", children: "+ Create Routine" }) })] }), routineVMs.length === 0 ? ((0, jsx_runtime_1.jsx)(components_1.EmptyHaircare, { title: "No Hair Routines Created", message: "Create wash day, deep conditioning, or oiling schedules linked to your products.", actionLabel: "+ Create First Routine", onAction: () => setIsAddModalOpen(true) })) : ((0, jsx_runtime_1.jsx)(react_native_1.View, { className: "gap-3", children: routineVMs.map((routine) => ((0, jsx_runtime_1.jsx)(components_1.HairRoutineCard, { routine: routine, onDelete: handleDelete }, routine.id))) }))] }), (0, jsx_runtime_1.jsx)(react_native_1.Modal, { visible: isAddModalOpen, animationType: "slide", transparent: true, onRequestClose: () => setIsAddModalOpen(false), children: (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "flex-1 bg-black/80 justify-end p-4", children: (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-2", children: [(0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { className: "self-end p-2 bg-zinc-800 rounded-full", onPress: () => setIsAddModalOpen(false), children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-bold", children: "\u2715 Close" }) }), (0, jsx_runtime_1.jsx)(components_1.HairRoutineForm, { availableProducts: productVMs, isSubmitting: isMutating, onSubmit: async (vals) => {
                                    await createHairRoutine({
                                        title: vals.title,
                                        haircareCategory: vals.haircareCategory,
                                        productIds: vals.productIds,
                                        frequency: vals.frequency,
                                        daysOfWeek: vals.daysOfWeek,
                                        reminderTime: vals.reminderTime,
                                        instructions: vals.instructions,
                                    });
                                    setIsAddModalOpen(false);
                                } })] }) }) })] }));
};
exports.HairRoutinesScreen = HairRoutinesScreen;
