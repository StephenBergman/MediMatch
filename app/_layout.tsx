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

import { AppToastProvider } from '@/components/common/AppToastProvider';
import { ErrorFallback } from '@/components/Tools/ErrorHandling/ErrorFallback';
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
	anchor: '(protected)/(tabs)',
};

function AppShell() {
	const scheme = useColorScheme() ?? 'light';

	const navigationTheme = useMemo(() => {
		const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
		return {
			...base,
			colors: {
				...base.colors,
				background: scheme === 'dark' ? '#000000' : '#ffffff',
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
				navigationTheme.colors.background
			).catch(() => {});
			NavigationBar.setButtonStyleAsync(
				scheme === 'dark' ? 'light' : 'dark'
			).catch(() => {});
		}
	}, [navigationTheme.colors.background, scheme]);

	const paperTheme = useMemo(
		() => (scheme === 'dark' ? MD3DarkTheme : MD3LightTheme),
		[scheme]
	);

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<PaperProvider theme={paperTheme}>
				<AppToastProvider>
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
											screenOptions={{
												headerShown: false,
												animation: 'none',
												contentStyle: {
													backgroundColor: navigationTheme.colors.background,
												},
											}}
										>
											<Stack.Screen
												name="(protected)/(tabs)"
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
				</AppToastProvider>
			</PaperProvider>
		</GestureHandlerRootView>
	);
}

export default function RootLayout() {
	return <AppShell />;
}
