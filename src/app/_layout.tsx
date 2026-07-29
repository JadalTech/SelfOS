import React from "react";
import { Stack } from "expo-router";
import { Providers } from "@/shared/providers";
import { ErrorBoundary } from "@/shared/errors";
import { RouteGuard } from "@/features/auth/presentation/providers/RouteGuard";
import { useAuth } from "@/shared/hooks/useAuth";
import { FullScreenLoader } from "@/shared/components";
import "../../global.css";

function RootContent() {
  const { isInitializing } = useAuth();

  // Hold off on mounting navigation tree until initial auth session check completes
  if (isInitializing) {
    return <FullScreenLoader message="Restoring session..." />;
  }

  return (
    <RouteGuard>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#09090b" },
        }}
      />
    </RouteGuard>
  );
}

export default function RootLayout() {
  return (
    <Providers>
      <ErrorBoundary>
        <RootContent />
      </ErrorBoundary>
    </Providers>
  );
}
