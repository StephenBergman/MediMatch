import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import * as NavigationBar from "expo-navigation-bar";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ErrorFallback } from "@/components/Tools/ErrorHandling/ErrorFallback";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  installGlobalErrorHandlers,
  registerFatalPromoter,
  registerOriginLogger,
} from "@/utils/ErrorHandling/helpers/capture";
import ErrorBoundary from "@/utils/ErrorHandling/helpers/errorboundary";
import { ErrorNotificationsHost } from "@/utils/ErrorHandling/helpers/ErrorNotificationsHost";
import {
  FeedbackHost,
  requestFeedbackModal,
} from "@/utils/ErrorHandling/helpers/FeedbackHost";

export const unstable_settings = {
  anchor: "(protected)/(tabs)",
};

function AppShell() {
  const scheme = useColorScheme() ?? "light";

  const navigationTheme = useMemo(() => {
    const base = scheme === "dark" ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        background: scheme === "dark" ? "#000000" : "#ffffff",
      },
    };
  }, [scheme]);

  const [fatal, setFatal] = useState<Error | null>(null);
  const [origin, setOrigin] = useState<string | undefined>();
  const resetFatal = useCallback(() => setFatal(null), []);

  useEffect(() => {
    registerFatalPromoter(setFatal);
    registerOriginLogger(setOrigin);
    installGlobalErrorHandlers({ escalateUnhandled: true });
    return () => {
      registerFatalPromoter(() => {});
      registerOriginLogger(() => {});
    };
  }, []);

  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setBackgroundColorAsync(
        navigationTheme.colors.background
      ).catch(() => {});
      NavigationBar.setButtonStyleAsync(
        scheme === "dark" ? "light" : "dark"
      ).catch(() => {});
    }
  }, [navigationTheme.colors.background, scheme]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: navigationTheme.colors.background,
      }}
      edges={["top", "left", "right"]}
    >
      <GluestackUIProvider mode={scheme}>
        <ErrorNotificationsHost>
          <ErrorBoundary>
            <FeedbackHost>
              {fatal ? (
                <ErrorFallback
                  error={fatal}
                  origin={origin}
                  onRetry={resetFatal}
                  onReport={requestFeedbackModal}
                />
              ) : (
                <ThemeProvider value={navigationTheme}>
                  <Stack
                    screenOptions={{
                      headerShown: false,
                      animation: "none",
                      contentStyle: {
                        backgroundColor: navigationTheme.colors.background,
                      },
                    }}
                  >
                    <Stack.Screen name="(protected)/(tabs)" options={{ headerShown: false }} />
                  </Stack>
                  <StatusBar
                    style={scheme === "dark" ? "light" : "dark"}
                    translucent
                  />
                </ThemeProvider>
              )}
            </FeedbackHost>
          </ErrorBoundary>
        </ErrorNotificationsHost>
      </GluestackUIProvider>
    </SafeAreaView>
  );
}

export default function RootLayout() {
  return <AppShell />;
}
