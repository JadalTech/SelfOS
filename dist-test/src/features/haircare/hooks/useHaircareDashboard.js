"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useHaircareDashboard = useHaircareDashboard;
const react_1 = require("react");
const routine_1 = require("@/features/routine");
const useHairProducts_1 = require("./useHairProducts");
const useHairRoutines_1 = require("./useHairRoutines");
const useHairLogs_1 = require("./useHairLogs");
const dashboard_mapper_1 = require("../mappers/dashboard.mapper");
function useHaircareDashboard() {
    const productsState = (0, useHairProducts_1.useHairProducts)();
    const hairRoutinesState = (0, useHairRoutines_1.useHairRoutines)();
    const hairLogsState = (0, useHairLogs_1.useHairLogs)();
    const coreRoutinesState = (0, routine_1.useRoutines)({ type: 'haircare' });
    const products = productsState.products;
    const hairRoutines = hairRoutinesState.hairRoutines;
    const hairLogs = hairLogsState.logs;
    const coreRoutines = (0, react_1.useMemo)(() => coreRoutinesState.data ?? [], [coreRoutinesState.data]);
    const isLoading = productsState.isLoading ||
        hairRoutinesState.isLoading ||
        hairLogsState.isLoading ||
        coreRoutinesState.isLoading;
    const isRefetching = productsState.isRefetching ||
        hairRoutinesState.isRefetching ||
        hairLogsState.isRefetching ||
        coreRoutinesState.isRefetching;
    const isError = productsState.isError ||
        hairRoutinesState.isError ||
        hairLogsState.isError ||
        coreRoutinesState.isError;
    const error = productsState.error ||
        hairRoutinesState.error ||
        hairLogsState.error ||
        coreRoutinesState.error;
    const viewModel = (0, react_1.useMemo)(() => {
        if (isLoading)
            return null;
        return (0, dashboard_mapper_1.buildHaircareDashboardVM)(products, hairRoutines, coreRoutines, hairLogs);
    }, [products, hairRoutines, coreRoutines, hairLogs, isLoading]);
    const refetch = (0, react_1.useCallback)(async () => {
        await Promise.all([
            productsState.refetch(),
            hairRoutinesState.refetch(),
            hairLogsState.refetch(),
            coreRoutinesState.refetch(),
        ]);
    }, [productsState, hairRoutinesState, hairLogsState, coreRoutinesState]);
    return {
        viewModel,
        isLoading,
        isRefetching,
        isError,
        error,
        refetch,
        logExecution: hairLogsState.logExecution,
        isActionPending: hairLogsState.isMutating,
    };
}
