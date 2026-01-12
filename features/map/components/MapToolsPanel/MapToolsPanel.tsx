import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, IconButton, Surface, Text, useTheme } from 'react-native-paper';

import type { TravelMode } from '@/features/map/api/routes';

type Props = {
	mode: TravelMode;
	onModeChange: (mode: TravelMode) => void;
	onLocate: () => void;
	onClear: () => void;
	onStartRoute?: () => void;
	showStart?: boolean;
	nextStep?: string | null;
};

/** Bottom map tools panel with travel mode toggles and locator button. */
export function MapToolsPanel({
	mode,
	onModeChange,
	onLocate,
	onClear,
	onStartRoute,
	showStart = false,
	nextStep,
}: Props) {
	const theme = useTheme();
	const isDriving = mode === 'driving';
	const isWalking = mode === 'walking';

	return (
		<Surface
			style={[
				styles.container,
				{
					backgroundColor: theme.colors.surfaceVariant,
					borderColor: theme.colors.outline,
				},
			]}
			elevation={2}
		>
			<View style={styles.modeGroup}>
				<Text variant="labelSmall" style={{ color: theme.colors.onSurface }}>
					{nextStep ? 'Next step' : 'Mode'}
				</Text>
				{nextStep ? (
					<Text
						variant="labelMedium"
						numberOfLines={2}
						style={{ color: theme.colors.onSurface }}
					>
						{nextStep}
					</Text>
				) : null}
				<View style={styles.buttonsRow}>
					<IconButton
						icon="car"
						size={20}
						mode={isDriving ? 'contained' : 'outlined'}
						onPress={() => onModeChange('driving')}
						containerColor={
							isDriving ? theme.colors.primary : theme.colors.surfaceVariant
						}
						iconColor={
							isDriving ? theme.colors.onPrimary : theme.colors.onSurface
						}
						accessibilityLabel="Driving mode"
					/>
					<IconButton
						icon="walk"
						size={20}
						mode={isWalking ? 'contained' : 'outlined'}
						onPress={() => onModeChange('walking')}
						containerColor={
							isWalking ? theme.colors.primary : theme.colors.surfaceVariant
						}
						iconColor={
							isWalking ? theme.colors.onPrimary : theme.colors.onSurface
						}
						accessibilityLabel="Walking mode"
					/>
					<IconButton
						icon="close-circle-outline"
						size={20}
						mode="outlined"
						onPress={onClear}
						containerColor={theme.colors.surfaceVariant}
						accessibilityLabel="Clear map"
					/>
					<IconButton
						icon="crosshairs-gps"
						size={20}
						mode="contained"
						onPress={onLocate}
						containerColor={theme.colors.surface}
						accessibilityLabel="Center on my location"
					/>
					{showStart ? (
						<Button
							mode="contained"
							onPress={onStartRoute}
							style={styles.startButton}
							contentStyle={styles.startButtonContent}
							labelStyle={styles.startButtonLabel}
						>
							Start
						</Button>
					) : null}
				</View>
			</View>
		</Surface>
	);
}

const styles = StyleSheet.create({
	container: {
		borderRadius: 18,
		borderWidth: 1,
		paddingHorizontal: 12,
		paddingVertical: 6,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		gap: 10,
	},
	modeGroup: {
		flex: 1,
		gap: 4,
	},
	buttonsRow: {
		flexDirection: 'row',
		gap: 8,
		alignItems: 'center',
	},
	startButton: {
		borderRadius: 999,
	},
	startButtonContent: {
		minHeight: 36,
		paddingHorizontal: 12,
		paddingVertical: 0,
	},
	startButtonLabel: {
		lineHeight: 16,
	},
});
