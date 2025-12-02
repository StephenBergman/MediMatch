import { HapticTab } from '@/components/haptic-tab';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
	const colorScheme = useColorScheme();

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
				headerShown: false,
				tabBarButton: HapticTab,
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: 'Home',
					tabBarIcon: ({ color, size }) => (
						<MaterialCommunityIcons name="home" size={size ?? 28} color={color} />
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
							size={size ?? 28}
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
							size={size ?? 28}
							color={color}
						/>
					),
				}}
			/>
		</Tabs>
	);
}
