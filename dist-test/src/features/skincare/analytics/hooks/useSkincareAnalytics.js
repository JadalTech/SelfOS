"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSkincareAnalytics = useSkincareAnalytics;
const react_query_1 = require("@tanstack/react-query");
const auth_store_1 = require("../../../../shared/stores/auth.store");
const skincare_repository_1 = require("../../repository/skincare.repository");
const skinAssessment_repository_1 = require("../../repository/skinAssessment.repository");
const queryKeys_1 = require("../../hooks/queryKeys");
const skincareAnalytics_1 = require("../utils/skincareAnalytics");
function useSkincareAnalytics() {
    const userId = (0, auth_store_1.useAuthStore)((s) => s.user?.uid);
    const query = (0, react_query_1.useQuery)({
        queryKey: queryKeys_1.skincareKeys.analytics(),
        queryFn: async () => {
            if (!userId)
                return null;
            const [assessmentsRes, logsRes, routinesRes, productsRes] = await Promise.all([
                skinAssessment_repository_1.skinAssessmentRepository.fetchAssessments(userId),
                skincare_repository_1.skincareRepository.fetchLogs(userId, 60),
                skincare_repository_1.skincareRepository.fetchRoutines(userId),
                skincare_repository_1.skincareRepository.fetchProducts(userId),
            ]);
            const assessments = assessmentsRes.success ? assessmentsRes.data : [];
            const logs = logsRes.success ? logsRes.data : [];
            const routines = routinesRes.success ? routinesRes.data : [];
            const products = productsRes.success ? productsRes.data : [];
            return (0, skincareAnalytics_1.buildSkincareAnalyticsVM)({
                assessments,
                logs,
                routines,
                products,
            });
        },
        enabled: !!userId,
    });
    return {
        analyticsVM: query.data || null,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    };
}
