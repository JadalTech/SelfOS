"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSkinAssessments = useSkinAssessments;
const react_query_1 = require("@tanstack/react-query");
const auth_store_1 = require("../../../shared/stores/auth.store");
const skinAssessment_repository_1 = require("../repository/skinAssessment.repository");
const mappers_1 = require("../mappers");
const queryKeys_1 = require("./queryKeys");
function useSkinAssessments() {
    const queryClient = (0, react_query_1.useQueryClient)();
    const userId = (0, auth_store_1.useAuthStore)((s) => s.user?.uid);
    const query = (0, react_query_1.useQuery)({
        queryKey: queryKeys_1.skincareKeys.assessments(),
        queryFn: async () => {
            if (!userId)
                return [];
            const res = await skinAssessment_repository_1.skinAssessmentRepository.fetchAssessments(userId);
            if (!res.success)
                throw res.error;
            return res.data;
        },
        enabled: !!userId,
        staleTime: 5 * 60 * 1000,
        gcTime: 15 * 60 * 1000,
    });
    const assessmentVMs = (0, mappers_1.mapToSkinAssessmentVMs)(query.data || []);
    const latestAssessmentVM = assessmentVMs.length > 0 ? assessmentVMs[0] : undefined;
    const createMutation = (0, react_query_1.useMutation)({
        mutationFn: async (input) => {
            if (!userId)
                throw new Error('User is not authenticated');
            const res = await skinAssessment_repository_1.skinAssessmentRepository.createAssessment(userId, input);
            if (!res.success)
                throw res.error;
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys_1.skincareKeys.assessments() });
            queryClient.invalidateQueries({ queryKey: queryKeys_1.skincareKeys.dashboard() });
            queryClient.invalidateQueries({ queryKey: queryKeys_1.skincareKeys.analytics() });
        },
    });
    const updateMutation = (0, react_query_1.useMutation)({
        mutationFn: async ({ assessmentId, updates }) => {
            if (!userId)
                throw new Error('User is not authenticated');
            const res = await skinAssessment_repository_1.skinAssessmentRepository.updateAssessment(userId, assessmentId, updates);
            if (!res.success)
                throw res.error;
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys_1.skincareKeys.assessments() });
            queryClient.invalidateQueries({ queryKey: queryKeys_1.skincareKeys.dashboard() });
            queryClient.invalidateQueries({ queryKey: queryKeys_1.skincareKeys.analytics() });
        },
    });
    const deleteMutation = (0, react_query_1.useMutation)({
        mutationFn: async (assessmentId) => {
            if (!userId)
                throw new Error('User is not authenticated');
            const res = await skinAssessment_repository_1.skinAssessmentRepository.deleteAssessment(userId, assessmentId);
            if (!res.success)
                throw res.error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys_1.skincareKeys.assessments() });
            queryClient.invalidateQueries({ queryKey: queryKeys_1.skincareKeys.dashboard() });
        },
    });
    return {
        assessments: query.data || [],
        assessmentVMs,
        latestAssessmentVM,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
        createAssessment: createMutation.mutateAsync,
        isCreating: createMutation.isPending,
        updateAssessment: updateMutation.mutateAsync,
        isUpdating: updateMutation.isPending,
        deleteAssessment: deleteMutation.mutateAsync,
        isDeleting: deleteMutation.isPending,
    };
}
