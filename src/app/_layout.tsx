import { Stack } from "expo-router";
import { Providers } from "@/shared/providers";
import { ErrorBoundary } from "@/shared/errors";
import { useAuthState } from "@/features/auth/hooks/useAuthState";
import "../../global.css";

export default function RootLayout() {
  // Mount the singleton Auth State Listener once at the root level
  useAuthState();

  return (
    <Providers>
      <ErrorBoundary>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#09090b" },
          }}
        />
      </ErrorBoundary>
    </Providers>
  );
}

