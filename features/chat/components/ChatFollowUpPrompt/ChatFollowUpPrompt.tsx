import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';

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
		<View style={styles.container}>
			<Text
				variant="bodySmall"
				style={[styles.message, { color: theme.colors.onSurfaceVariant }]}
			>
				{followUpMessage}
			</Text>

			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				style={styles.actionsScroll}
				contentContainerStyle={styles.actionsList}
				scrollEnabled={actions.length > 2}
			>
				{actions.map((action) => (
					<Button
						key={action.id}
						mode="outlined"
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
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginTop: 6,
		marginBottom: 2,
	},
	message: {
		lineHeight: 18,
		marginBottom: 8,
	},
	actionsList: {
		flexDirection: 'row',
		gap: 8,
		paddingHorizontal: 0,
		alignItems: 'center',
	},
	actionsScroll: {
		flexGrow: 0,
		alignSelf: 'flex-start',
	},
	actionButton: {
		flex: 0,
		minWidth: 88,
		alignSelf: 'flex-start',
	},
	actionButtonLabel: {
		fontSize: 12,
		lineHeight: 16,
	},
	actionButtonContent: {
		minHeight: 36,
		paddingVertical: 0,
	},
});
