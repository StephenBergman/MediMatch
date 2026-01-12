import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Button, Surface, Text, useTheme } from 'react-native-paper';

import type { PlaceResult } from '@/features/map/api/places';

type Props = {
	places: PlaceResult[];
	activePlaceId?: string;
	onRoute: (place: PlaceResult) => void;
};

/** Horizontal tray of nearby places with quick route actions. */
export function PlacesTray({ places, activePlaceId, onRoute }: Props) {
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
			<View style={styles.headerRow}>
				<Text variant="labelLarge" style={{ color: theme.colors.onSurface }}>
					Nearby care
				</Text>
			</View>
			<FlatList
				data={places}
				horizontal
				keyExtractor={(item) => item.id}
				contentContainerStyle={styles.listContent}
				showsHorizontalScrollIndicator={false}
				renderItem={({ item }) => {
					const isActive = item.id === activePlaceId;
					return (
						<Surface
							style={[
								styles.card,
								{
									backgroundColor: isActive
										? theme.colors.primaryContainer
										: theme.colors.surfaceVariant,
									borderColor: isActive
										? theme.colors.primary
										: theme.colors.outlineVariant,
								},
							]}
							elevation={0}
						>
							<Text
								variant="titleSmall"
								numberOfLines={1}
								style={{ color: theme.colors.onSurface }}
							>
								{item.name}
							</Text>
							<Text
								variant="labelSmall"
								numberOfLines={1}
								style={{ color: theme.colors.onSurfaceVariant }}
							>
								{item.address ?? 'Nearby care location'}
							</Text>
							<Button
								mode="contained"
								onPress={() => onRoute(item)}
								contentStyle={styles.routeButtonContent}
								style={styles.routeButton}
								labelStyle={styles.routeButtonLabel}
							>
								Route
							</Button>
						</Surface>
					);
				}}
			/>
		</Surface>
	);
}

const styles = StyleSheet.create({
	container: {
		borderRadius: 16,
		borderWidth: 1,
		paddingVertical: 8,
		paddingHorizontal: 12,
		gap: 6,
	},
	headerRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	listContent: {
		gap: 8,
		paddingRight: 4,
	},
	card: {
		width: 200,
		borderRadius: 14,
		borderWidth: 1,
		padding: 10,
		gap: 6,
	},
	routeButton: {
		alignSelf: 'flex-start',
	},
	routeButtonContent: {
		minHeight: 36,
		paddingHorizontal: 12,
		paddingVertical: 0,
	},
	routeButtonLabel: {
		lineHeight: 16,
	},
});
