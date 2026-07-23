import { Stack } from "expo-router";
import { Providers } from "@/shared/providers";
import { ErrorBoundary } from "@/shared/errors";
import "../../global.css";

export default function RootLayout() {
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
