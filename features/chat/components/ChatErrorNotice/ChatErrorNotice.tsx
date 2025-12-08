import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Icon, Surface, Text, useTheme } from 'react-native-paper';

import { type ChatUxError } from '@/features/chat/hooks/useChat';

type Props = {
	error: ChatUxError | null;
	onDismiss: () => void;
	onRetry?: () => void;
};

/** Friendly inline error card for chat failures, with optional retry. */
export function ChatErrorNotice({ error, onDismiss, onRetry }: Props) {
	const theme = useTheme();

	if (!error) return null;

	const intent = error.ux.intent ?? 'error';
	const background =
		intent === 'warning'
			? theme.colors.secondaryContainer
			: intent === 'info'
				? theme.colors.surfaceVariant
				: theme.colors.errorContainer;

	return (
		<Surface style={[styles.card, { backgroundColor: background }]} elevation={1}>
			<View style={styles.row}>
				<Icon
					source="alert-circle-outline"
					size={20}
					color={theme.colors.onSurfaceVariant}
				/>
				<View style={styles.copy}>
					<Text
						variant="titleSmall"
						style={{ color: theme.colors.onSurfaceVariant }}
					>
						{error.ux.title ?? 'Having trouble'}
					</Text>
					<Text style={[styles.message, { color: theme.colors.onSurface }]}>
						{error.message}
					</Text>
				</View>
			</View>
			<View style={styles.actions}>
				{onRetry ? (
					<Button
						mode="contained-tonal"
						compact
						onPress={onRetry}
						icon="refresh"
						textColor={theme.colors.onSurface}
						style={styles.action}
					>
						Try again
					</Button>
				) : null}
				<Button mode="text" compact onPress={onDismiss} style={styles.action}>
					Dismiss
				</Button>
			</View>
		</Surface>
	);
}

const styles = StyleSheet.create({
	card: {
		padding: 12,
		borderRadius: 16,
		gap: 12,
	},
	row: {
		flexDirection: 'row',
		gap: 10,
		alignItems: 'flex-start',
	},
	copy: {
		flex: 1,
		gap: 4,
	},
	message: {
		lineHeight: 18,
	},
	actions: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		gap: 6,
	},
	action: {
		margin: 0,
	},
});
