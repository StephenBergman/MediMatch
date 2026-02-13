import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from '@react-navigation/native';
import * as NavigationBar from 'expo-navigation-bar';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from 'react-native-paper';
import 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppToastProvider } from '@/components/contexts/AppToastProvider';
import { ErrorFallback } from '@/components/Tools/ErrorHandling/ErrorFallback';
import { Colors } from '@/constants/theme';
import { AuthProvider } from '@/features/auth/contexts/AuthContext';
import '@/global.css';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
	installGlobalErrorHandlers,
	registerFatalPromoter,
	registerOriginLogger,
} from '@/utils/ErrorHandling/helpers/capture';
import ErrorBoundary from '@/utils/ErrorHandling/helpers/errorboundary';
import { ErrorNotificationsHost } from '@/utils/ErrorHandling/helpers/ErrorNotificationsHost';
import {
	FeedbackHost,
	requestFeedbackModal,
} from '@/utils/ErrorHandling/helpers/FeedbackHost';

export const unstable_settings = {
	anchor: '(protected)',
};

function AppShell() {
	const scheme = useColorScheme() ?? 'light';
	const palette = Colors.palette;

	const navigationTheme = useMemo(() => {
		const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
		const tokens = Colors[scheme];
		return {
			...base,
			colors: {
				...base.colors,
				primary: tokens.primary,
				background: tokens.background,
				card: tokens.surface,
				text: tokens.text,
				border: tokens.border,
				notification: tokens.danger,
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
		if (Platform.OS === 'android') {
			NavigationBar.setBackgroundColorAsync(
				navigationTheme.colors.background,
			).catch(() => {});
			NavigationBar.setButtonStyleAsync(
				scheme === 'dark' ? 'light' : 'dark',
			).catch(() => {});
		}
	}, [navigationTheme.colors.background, scheme]);

	const paperTheme = useMemo(() => {
		const base = scheme === 'dark' ? MD3DarkTheme : MD3LightTheme;
		const tokens = Colors[scheme];
		return {
			...base,
			colors: {
				...base.colors,
				primary: tokens.primary,
				onPrimary: tokens.inverseText,
				primaryContainer: scheme === 'dark' ? palette.teal : palette.sky,
				onPrimaryContainer:
					scheme === 'dark' ? palette.white : palette.midnight,
				secondary: tokens.secondary,
				onSecondary: tokens.inverseText,
				secondaryContainer: scheme === 'dark' ? palette.violet : palette.sage,
				onSecondaryContainer:
					scheme === 'dark' ? palette.white : palette.midnight,
				background: tokens.background,
				onBackground: tokens.text,
				surface: tokens.surface,
				onSurface: tokens.text,
				surfaceVariant: scheme === 'dark' ? palette.midnight : palette.sage,
				onSurfaceVariant: scheme === 'dark' ? palette.sky : palette.midnight,
				outline: tokens.border,
				outlineVariant: tokens.border,
				error: tokens.danger,
				onError: palette.white,
				errorContainer: scheme === 'dark' ? palette.crimson : palette.blush,
				onErrorContainer: scheme === 'dark' ? palette.white : palette.midnight,
			},
		};
	}, [scheme]);

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<PaperProvider theme={paperTheme}>
				<AppToastProvider>
					<AuthProvider>
						<SafeAreaView
							style={{
								flex: 1,
								backgroundColor: navigationTheme.colors.background,
							}}
							edges={['top', 'left', 'right']}
						>
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
													initialRouteName="onboarding1"
													screenOptions={{
														headerShown: false,
														animation: 'fade',
														contentStyle: {
															backgroundColor:
																navigationTheme.colors.background,
														},
													}}
												>
							<Stack.Screen
								name="(protected)"
								options={{ headerShown: false }}
							/>
													<Stack.Screen
														name="dev"
														options={{ headerShown: false }}
													/>
												</Stack>
												<StatusBar
													style={scheme === 'dark' ? 'light' : 'dark'}
													translucent
												/>
											</ThemeProvider>
										)}
									</FeedbackHost>
								</ErrorBoundary>
							</ErrorNotificationsHost>
						</SafeAreaView>
					</AuthProvider>
				</AppToastProvider>
			</PaperProvider>
		</GestureHandlerRootView>
	);
}

export default function RootLayout() {
	return <AppShell />;
}
