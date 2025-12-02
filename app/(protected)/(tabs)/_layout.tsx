<<<<<<< HEAD
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import 'react-native-reanimated'

import { SplashScreenController } from '@/components/splash-screen-controller'

import { useAuthContext } from '@/hooks/use-Auth-context'
import { useColorScheme } from '@/hooks/use-color-scheme'
import AuthProvider from '@/providers/auth-provider'

// Separate RootNavigator so we can access the AuthContext
function RootNavigator() {
  const { isLoggedIn } = useAuthContext()

  return (
    <Stack>
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="login" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Screen name="+not-found" />
    </Stack>
  )
=======
import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
	const colorScheme = useColorScheme();
	const showDevTab = __DEV__;

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
				headerShown: false,
				tabBarButton: HapticTab,
			}}
		>
			{showDevTab ? (
				<Tabs.Screen
					name="index"
					options={{
						title: 'Dev',
						tabBarIcon: ({ color, size }) => (
							<MaterialCommunityIcons
								name="wrench"
								size={size ?? 28}
								color={color}
							/>
						),
					}}
				/>
			) : null}
			<Tabs.Screen
				name="ChatWithRobot"
				options={{
					title: 'Assistant',
					tabBarIcon: ({ color, size }) => (
						<MaterialCommunityIcons
							name="robot-outline"
							size={size ?? 28}
							color={color}
						/>
					),
				}}
			/>
		</Tabs>
	);
>>>>>>> 6ec2c3e5d47522d9959ce6e1bdeff68ff87fad40
}

export default function RootLayout() {
  const colorScheme = useColorScheme()

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <SplashScreenController />
        <RootNavigator />
        <StatusBar style="auto" />
      </AuthProvider>
    </ThemeProvider>
  )
}