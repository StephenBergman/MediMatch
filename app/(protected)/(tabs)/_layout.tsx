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
				name="dev/kitchensink/index"
				options={{
					tabBarButton: () => null,
				}}
			/>
			<Tabs.Screen
				name="dev/kitchensink/kitchensink"
				options={{
					tabBarButton: () => null,
				}}
			/>
			<Tabs.Screen
				name="dev/errortesting/index"
				options={{
					tabBarButton: () => null,
				}}
			/>
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
}
