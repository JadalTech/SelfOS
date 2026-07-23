"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLatestHairCondition = useLatestHairCondition;
const react_1 = require("react");
const useHairConditions_1 = require("./useHairConditions");
const condition_mapper_1 = require("../mappers/condition.mapper");
function useLatestHairCondition() {
    const { conditions, isLoading, isError, error, refetch } = (0, useHairConditions_1.useHairConditions)();
    const latestConditionVM = (0, react_1.useMemo)(() => {
        if (conditions.length === 0)
            return null;
        const sorted = [...conditions].sort((a, b) => b.recordDate.localeCompare(a.recordDate));
        return (0, condition_mapper_1.mapToHairConditionVM)(sorted[0]);
    }, [conditions]);
    return {
        latestCondition: latestConditionVM,
        totalCount: conditions.length,
        isLoading,
        isError,
        error,
        refetch,
    };
}
