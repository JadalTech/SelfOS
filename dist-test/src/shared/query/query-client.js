"use strict";
/**
 * React Query Configuration
 *
 * Centralized QueryClient with production-ready defaults.
 * Singleton instance shared across the entire application.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryClient = void 0;
const react_query_1 = require("@tanstack/react-query");
/**
 * Application-wide QueryClient.
 *
 * Defaults are tuned for a mobile application:
 * - staleTime: 5 minutes — avoid refetching on every screen focus.
 * - gcTime: 30 minutes — keep unused cache for 30 min before garbage collection.
 * - retry: 2 — retry failed requests twice with automatic backoff.
 * - refetchOnWindowFocus: false — not useful on mobile; saves bandwidth.
 * - refetchOnReconnect: true — refetch stale data when network returns.
 */
exports.queryClient = new react_query_1.QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 30 * 60 * 1000, // 30 minutes
            retry: 2,
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
        },
        mutations: {
            retry: 1,
        },
    },
});
