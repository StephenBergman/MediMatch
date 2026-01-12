import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
	const colorScheme = useColorScheme();

	return (
		<Tabs
			initialRouteName="chat"
			screenOptions={{
				tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
				headerShown: false,
				tabBarButton: HapticTab,
			}}
		>
			<Tabs.Screen
				name="home"
				options={{
					title: 'Home',
					tabBarIcon: ({ color, size }) => (
						<MaterialCommunityIcons
							name="home-outline"
							size={size ?? 28}
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="chat"
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
				name="map"
				options={{
					title: 'Map',
					tabBarIcon: ({ color, size }) => (
						<MaterialCommunityIcons
							name="map-marker-outline"
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
							size={size ?? 30}
							color={color}
						/>
					),
				}}
			/>
		</Tabs>
	);
}
