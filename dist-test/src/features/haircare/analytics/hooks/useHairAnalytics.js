"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useHairAnalytics = useHairAnalytics;
const react_1 = require("react");
const routine_1 = require("@/features/routine");
const useHairProducts_1 = require("../../hooks/useHairProducts");
const useHairRoutines_1 = require("../../hooks/useHairRoutines");
const useHairLogs_1 = require("../../hooks/useHairLogs");
const useHairPhotos_1 = require("../../hooks/useHairPhotos");
const useHairConditions_1 = require("../../hooks/useHairConditions");
const hairAnalytics_1 = require("../utils/hairAnalytics");
function useHairAnalytics() {
    const coreRoutinesState = (0, routine_1.useRoutines)({ type: 'haircare' });
    const coreRoutines = (0, react_1.useMemo)(() => coreRoutinesState.data ?? [], [coreRoutinesState.data]);
    const { products, isLoading: isLoadingProducts } = (0, useHairProducts_1.useHairProducts)();
    const { hairRoutines, isLoading: isLoadingRoutines } = (0, useHairRoutines_1.useHairRoutines)();
    const { logs, isLoading: isLoadingLogs, isRefetching, refetch } = (0, useHairLogs_1.useHairLogs)();
    const { photos, isLoading: isLoadingPhotos } = (0, useHairPhotos_1.useHairPhotos)();
    const { conditions, isLoading: isLoadingConditions } = (0, useHairConditions_1.useHairConditions)();
    const isLoading = coreRoutinesState.isLoading ||
        isLoadingProducts ||
        isLoadingRoutines ||
        isLoadingLogs ||
        isLoadingPhotos ||
        isLoadingConditions;
    const isError = coreRoutinesState.isError ||
        Boolean(coreRoutinesState.error);
    const viewModel = (0, react_1.useMemo)(() => {
        return (0, hairAnalytics_1.buildHairAnalyticsVM)(products, hairRoutines, coreRoutines, logs, photos, conditions);
    }, [products, hairRoutines, coreRoutines, logs, photos, conditions]);
    return {
        viewModel,
        isLoading,
        isRefetching,
        isError,
        error: coreRoutinesState.error,
        refetch,
    };
}
