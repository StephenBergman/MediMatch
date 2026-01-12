import React from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { Divider, Portal, Surface, Text, useTheme } from 'react-native-paper';

export type TurnByTurnStep = {
	instruction: string;
	distanceMeters: number;
	durationSeconds: number;
	endLocation?: { latitude: number; longitude: number };
};

type Props = {
	open: boolean;
	steps: TurnByTurnStep[];
	onClose: () => void;
};

const formatMeters = (meters: number) => {
	if (!meters) return '';
	if (meters < 1000) return `${Math.round(meters)} m`;
	return `${(meters / 1000).toFixed(1)} km`;
};

const formatDuration = (seconds: number) => {
	if (!seconds) return '';
	const minutes = Math.round(seconds / 60);
	if (minutes < 60) return `${minutes} min`;
	const hours = Math.floor(minutes / 60);
	const remaining = minutes % 60;
	return remaining ? `${hours}h ${remaining}m` : `${hours}h`;
};

/** Bottom drawer listing turn-by-turn steps. */
export function TurnByTurnDrawer({ open, steps, onClose }: Props) {
	const theme = useTheme();

	if (!open) return null;

	return (
		<Portal>
			<View style={styles.overlay} pointerEvents="box-none">
				<Pressable style={styles.backdrop} onPress={onClose} />
				<Surface
					style={[
						styles.drawer,
						{
							backgroundColor: theme.colors.surface,
							borderColor: theme.colors.outline,
						},
					]}
					elevation={4}
				>
					<View style={styles.header}>
						<Text variant="titleMedium">Turn-by-turn directions</Text>
						<Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
							{steps.length} steps
						</Text>
					</View>
					<Divider />
					{steps.length ? (
						<FlatList
							data={steps}
							keyExtractor={(_, index) => `step-${index}`}
							contentContainerStyle={styles.listContent}
							renderItem={({ item, index }) => (
								<View style={styles.stepRow}>
									<Text variant="labelSmall" style={styles.stepIndex}>
										{index + 1}
									</Text>
									<View style={styles.stepContent}>
										<Text variant="bodyMedium">{item.instruction}</Text>
										<Text
											variant="labelSmall"
											style={{ color: theme.colors.onSurfaceVariant }}
										>
											{[
												formatMeters(item.distanceMeters),
												formatDuration(item.durationSeconds),
											]
												.filter(Boolean)
												.join(' · ')}
										</Text>
									</View>
								</View>
							)}
						/>
					) : (
						<View style={styles.emptyState}>
							<Text variant="bodyMedium">
								No turn-by-turn steps available for this route.
							</Text>
						</View>
					)}
				</Surface>
			</View>
		</Portal>
	);
}

const styles = StyleSheet.create({
	overlay: {
		...StyleSheet.absoluteFillObject,
		justifyContent: 'flex-end',
	},
	backdrop: {
		...StyleSheet.absoluteFillObject,
	},
	drawer: {
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		borderWidth: 1,
		paddingTop: 12,
		paddingHorizontal: 16,
		paddingBottom: 24,
		maxHeight: '70%',
	},
	header: {
		gap: 2,
		paddingBottom: 10,
	},
	listContent: {
		paddingVertical: 12,
		gap: 12,
	},
	stepRow: {
		flexDirection: 'row',
		gap: 12,
	},
	stepIndex: {
		width: 22,
		textAlign: 'center',
		opacity: 0.6,
	},
	stepContent: {
		flex: 1,
		gap: 4,
	},
	emptyState: {
		paddingVertical: 16,
	},
});
