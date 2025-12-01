import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Surface, Text, useTheme } from 'react-native-paper';

import { type ChatMessage } from '@/features/chat/types';

type Props = {
	message: ChatMessage;
};

/** Displays a single chat message with styling that varies by sender role. */
export function ChatMessageBubble({ message }: Props) {
	const theme = useTheme();
	const isUser = message.role === 'user';

	return (
		<View
			style={[
				styles.row,
				{ justifyContent: isUser ? 'flex-end' : 'flex-start' },
			]}
		>
			<Surface
				elevation={1}
				style={[
					styles.bubble,
					{
						alignSelf: isUser ? 'flex-end' : 'flex-start',
						backgroundColor: isUser
							? theme.colors.primaryContainer
							: theme.colors.surfaceVariant,
						borderColor: isUser
							? theme.colors.primary
							: theme.colors.outlineVariant,
					},
				]}
			>
				<Text
					style={[
						styles.sender,
						{
							color: isUser
								? theme.colors.onPrimaryContainer
								: theme.colors.onSurfaceVariant,
						},
					]}
				>
					{isUser ? 'You' : 'Assistant'}
				</Text>
				<Text
					style={[
						styles.content,
						{
							color: isUser
								? theme.colors.onPrimaryContainer
								: theme.colors.onSurface,
						},
					]}
				>
					{message.content}
				</Text>
			</Surface>
		</View>
	);
}

const styles = StyleSheet.create({
	row: {
		marginBottom: 12,
	},
	bubble: {
		padding: 12,
		maxWidth: '90%',
		borderRadius: 16,
		borderWidth: 1,
		gap: 4,
	},
	sender: {
		fontWeight: '600',
		fontSize: 12,
		letterSpacing: 0.2,
	},
	content: {
		fontSize: 16,
		lineHeight: 22,
	},
});
