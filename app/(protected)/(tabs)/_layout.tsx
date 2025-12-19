import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useAuthContext } from '@/hooks/use-Auth-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, Tabs } from 'expo-router';
import React from 'react';
export default function TabLayout() {
	const colorScheme = useColorScheme();
	const showDevTab = __DEV__;

	return (
		<Tabs
		initialRouteName='index'
			screenOptions={{
				tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
				headerShown: false,
				tabBarButton: HapticTab,
				
			}}
		>
			{showDevTab ? (
				<Tabs.Screen
					name="ReactDevTestComponents"
					options={{
						title: 'Dev',
						tabBarIcon: ({ color, size }) => (
							<MaterialCommunityIcons
								name="wrench"
								size={size ?? 30}
								color={color}
							/>
						),
					}}
				/>
			) : null}
			<Tabs.Screen
				name="maps"
				options={{
					title: 'Maps',
					tabBarIcon: ({ color, size }) => (
						<MaterialCommunityIcons
							name="map-outline"
							size={size ?? 30}
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="ChatWithRobot"
				options={{
					title: 'Assistant',
					tabBarIcon: ({ color, size }) => (
						<MaterialCommunityIcons
							name="robot-outline"
							size={size ?? 30}
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="home"
				options={{
					title: 'Home',
					tabBarIcon: ({ color, size }) => (
						<MaterialCommunityIcons
							name="home-outline"
							size={size ?? 30}
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: 'Profile',
					tabBarIcon: ({ color, size }) => (
						<MaterialCommunityIcons
							name="account-outline"
							size={size ?? 30}
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="settings"
				options={{
					title: 'Settings',
					tabBarIcon: ({ color, size }) => (
						<MaterialCommunityIcons
							name="cog-outline"
							size={size ?? 30}
							color={color}
						/>
					),
				}}
			/>

		</Tabs>
	);
}

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
}

