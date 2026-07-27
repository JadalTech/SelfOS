"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSkincareDashboard = useSkincareDashboard;
const react_query_1 = require("@tanstack/react-query");
const auth_store_1 = require("../../../shared/stores/auth.store");
const skincare_repository_1 = require("../repository/skincare.repository");
const skinAssessment_repository_1 = require("../repository/skinAssessment.repository");
const skinPhoto_repository_1 = require("../repository/skinPhoto.repository");
const mappers_1 = require("../mappers");
const queryKeys_1 = require("./queryKeys");
function useSkincareDashboard() {
    const userId = (0, auth_store_1.useAuthStore)((s) => s.user?.uid);
    const query = (0, react_query_1.useQuery)({
        queryKey: queryKeys_1.skincareKeys.dashboard(),
        queryFn: async () => {
            if (!userId)
                return null;
            const [productsRes, routinesRes, logsRes, assessmentsRes, photosRes] = await Promise.all([
                skincare_repository_1.skincareRepository.fetchProducts(userId),
                skincare_repository_1.skincareRepository.fetchRoutines(userId),
                skincare_repository_1.skincareRepository.fetchLogs(userId, 30),
                skinAssessment_repository_1.skinAssessmentRepository.fetchAssessments(userId),
                skinPhoto_repository_1.skinPhotoRepository.fetchPhotos(userId),
            ]);
            const products = productsRes.success ? productsRes.data : [];
            const routines = routinesRes.success ? routinesRes.data : [];
            const logs = logsRes.success ? logsRes.data : [];
            const assessments = assessmentsRes.success ? assessmentsRes.data : [];
            const photos = photosRes.success ? photosRes.data : [];
            return (0, mappers_1.buildSkincareDashboardVM)({
                products,
                routines,
                logs,
                assessments,
                photos,
            });
        },
        enabled: !!userId,
    });
    return {
        dashboardVM: query.data || null,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    };
}
