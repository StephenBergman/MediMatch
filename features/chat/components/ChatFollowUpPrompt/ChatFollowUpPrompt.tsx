import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Surface, Text, useTheme } from 'react-native-paper';

import { type ChatMessageAction } from '@/features/chat/types';

type Props = {
	followUpMessage: string;
	actions: ChatMessageAction[];
	onActionPress: (actionId: string) => void;
	disabled?: boolean;
};

/**
 * Renders a follow-up prompt with interactive action buttons.
 * Displayed below the assistant message to guide next steps elegantly.
 */
export function ChatFollowUpPrompt({
	followUpMessage,
	actions,
	onActionPress,
	disabled = false,
}: Props) {
	const theme = useTheme();

	return (
		<Surface
			style={[
				styles.container,
				{ backgroundColor: theme.colors.surfaceVariant },
			]}
			elevation={0}
		>
			<View style={styles.content}>
				<Text
					variant="bodyMedium"
					style={[styles.message, { color: theme.colors.onSurfaceVariant }]}
				>
					{followUpMessage}
				</Text>

				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={styles.actionsList}
					scrollEnabled={actions.length > 2}
				>
					{actions.map((action) => (
						<Button
							key={action.id}
							mode="contained"
							onPress={() => onActionPress(action.id)}
							disabled={disabled}
							style={styles.actionButton}
							labelStyle={styles.actionButtonLabel}
							contentStyle={styles.actionButtonContent}
						>
							{action.label}
						</Button>
					))}
				</ScrollView>

				{actions.some((a) => a.description) && (
					<Text
						variant="labelSmall"
						style={[styles.hint, { color: theme.colors.onSurfaceVariant }]}
					>
						Tap an option above to continue
					</Text>
				)}
			</View>
		</Surface>
	);
}

const styles = StyleSheet.create({
	container: {
		borderRadius: 12,
		marginVertical: 8,
		marginHorizontal: 0,
		paddingHorizontal: 12,
		paddingVertical: 12,
	},
	content: {
		gap: 12,
	},
	message: {
		lineHeight: 20,
	},
	actionsList: {
		flexDirection: 'row',
		gap: 8,
		paddingHorizontal: 0,
	},
	actionButton: {
		flex: 0,
		minWidth: 100,
		maxWidth: 160,
	},
	actionButtonLabel: {
		fontSize: 12,
	},
	actionButtonContent: {
		height: 36,
	},
	hint: {
		marginTop: 4,
		opacity: 0.7,
	},
});
