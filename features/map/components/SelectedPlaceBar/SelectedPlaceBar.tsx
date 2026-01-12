import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Surface, Text, useTheme } from 'react-native-paper';

import type { PlaceResult } from '@/features/map/api/places';

type Props = {
	place: PlaceResult;
	onRoute: (place: PlaceResult) => void;
};

/** Compact top bar for a selected place. */
export function SelectedPlaceBar({ place, onRoute }: Props) {
	const theme = useTheme();

	return (
		<Surface
			style={[
				styles.container,
				{
					backgroundColor: theme.colors.surface,
					borderColor: theme.colors.outline,
				},
			]}
			elevation={2}
		>
			<View style={styles.content}>
				<Text
					variant="titleSmall"
					numberOfLines={1}
					style={{ color: theme.colors.onSurface }}
				>
					{place.name}
				</Text>
				<Text
					variant="labelSmall"
					numberOfLines={1}
					style={{ color: theme.colors.onSurfaceVariant }}
				>
					{place.address ?? 'Nearby care location'}
				</Text>
			</View>
			<Button
				mode="contained"
				onPress={() => onRoute(place)}
				contentStyle={styles.routeButtonContent}
				labelStyle={styles.routeButtonLabel}
			>
				Route
			</Button>
		</Surface>
	);
}

const styles = StyleSheet.create({
	container: {
		borderRadius: 16,
		borderWidth: 1,
		paddingHorizontal: 12,
		paddingVertical: 10,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		gap: 10,
	},
	content: {
		flex: 1,
		gap: 2,
	},
	routeButtonContent: {
		height: 36,
		paddingHorizontal: 12,
	},
	routeButtonLabel: {
		lineHeight: 16,
	},
});
