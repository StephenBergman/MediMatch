import { Redirect, Slot } from 'expo-router';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function ProtectedLayout() {
	const { session, isReady } = useAuth();
	const scheme = useColorScheme() ?? 'light';
	const colors = Colors[scheme];

	if (!isReady) {
		return (
			<View style={[styles.loading, { backgroundColor: colors.background }]}>
				<ActivityIndicator size="large" color={colors.primary} />
			</View>
		);
	}

	if (!session) {
		return <Redirect href="/login" />;
	}

	return <Slot />;
}

const styles = StyleSheet.create({
	loading: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
});
