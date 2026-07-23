"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAskHairCoach = useAskHairCoach;
const react_1 = require("react");
const react_query_1 = require("@tanstack/react-query");
const stores_1 = require("@/shared/stores");
const hairAIRepository_1 = require("../repository/hairAIRepository");
function useAskHairCoach() {
    const user = (0, stores_1.useAuthStore)((state) => state.user);
    const userId = user?.uid;
    const [messages, setMessages] = (0, react_1.useState)([
        {
            id: 'welcome_1',
            sender: 'coach',
            text: 'Hello! I am your AI Hair Coach. How can I help you improve your hair growth, routine consistency, or product usage today?',
            timestamp: new Date(),
        },
    ]);
    const askMutation = (0, react_query_1.useMutation)({
        mutationFn: async (userText) => {
            if (!userId)
                throw new Error('User not authenticated');
            const res = await hairAIRepository_1.hairAIRepository.askCoach(userId, userText, messages);
            if (!res.success)
                throw res.error;
            return res.data;
        },
    });
    const sendMessage = (0, react_1.useCallback)(async (text) => {
        if (!text.trim())
            return;
        const userMsg = {
            id: `user_${Date.now()}`,
            sender: 'user',
            text: text.trim(),
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMsg]);
        try {
            const coachAnswer = await askMutation.mutateAsync(text.trim());
            const coachMsg = {
                id: `coach_${Date.now()}`,
                sender: 'coach',
                text: coachAnswer,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, coachMsg]);
        }
        catch (err) {
            const errorMsg = {
                id: `err_${Date.now()}`,
                sender: 'coach',
                text: `Sorry, I encountered an issue retrieving your hair data: ${err?.message || 'Unknown error'}`,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMsg]);
        }
    }, [askMutation]);
    return {
        messages,
        sendMessage,
        isAsking: askMutation.isPending,
    };
}
