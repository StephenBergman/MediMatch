import React from 'react';
import { StyleSheet, View } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { Avatar, Icon, Surface, Text, useTheme } from 'react-native-paper';

import { ChatFollowUpPrompt } from '@/features/chat/components/ChatFollowUpPrompt/ChatFollowUpPrompt';
import { type ChatMessage } from '@/features/chat/types';

function formatTime(timestamp?: number): string {
	if (!timestamp) return '';
	const date = new Date(timestamp);
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffMinutes = Math.floor(diffMs / 60000);
	const diffHours = Math.floor(diffMs / 3600000);

	if (diffMinutes < 1) return 'now';
	if (diffMinutes < 60) return `${diffMinutes}m ago`;
	if (diffHours < 24) return `${diffHours}h ago`;

	// For same day, show time; otherwise show date
	if (date.toDateString() === now.toDateString()) {
		return date.toLocaleTimeString('en-US', {
			hour: '2-digit',
			minute: '2-digit',
		});
	}
	return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

type Props = {
	message: ChatMessage;
	onFollowUpAction?: (actionId: string) => void;
};

export function ChatMessageBubble({ message, onFollowUpAction }: Props) {
	const theme = useTheme();
	const isUser = message.role === 'user';
	const timeLabel = formatTime(message.createdAt);
	const statusLabel = isUser
		? message.status === 'failed'
			? 'Not sent'
			: message.status === 'sending'
				? 'Sending…'
				: 'Sent'
		: timeLabel;
	const statusColor =
		message.status === 'failed'
			? theme.colors.error
			: isUser
				? theme.colors.onPrimaryContainer
				: theme.colors.onSurfaceVariant;
	const textColor = isUser
		? theme.colors.onPrimaryContainer
		: theme.colors.onSurface;

	const markdownStyles = {
		text: {
			color: textColor,
			fontSize: 16,
			lineHeight: 22,
		},
		strong: {
			fontWeight: 'bold' as const,
			color: textColor,
		},
		em: {
			fontStyle: 'italic' as const,
			color: textColor,
		},
		paragraph: {
			marginVertical: 4,
		},
		heading1: {
			fontWeight: 'bold' as const,
			fontSize: 20,
			marginVertical: 8,
			color: textColor,
		},
		heading2: {
			fontWeight: 'bold' as const,
			fontSize: 18,
			marginVertical: 6,
			color: textColor,
		},
		heading3: {
			fontWeight: 'bold' as const,
			fontSize: 16,
			marginVertical: 4,
			color: textColor,
		},
	};

	return (
		<View
			style={[
				styles.row,
				{ justifyContent: isUser ? 'flex-end' : 'flex-start' },
			]}
		>
			{!isUser && (
				<Avatar.Text
					size={32}
					label="AI"
					style={{ backgroundColor: theme.colors.surfaceVariant }}
					color={theme.colors.primary}
				/>
			)}
			<View
				style={[
					styles.bubble,
					{ alignSelf: isUser ? 'flex-end' : 'flex-start', maxWidth: '90%' },
				]}
			>
				<Surface
					elevation={1}
					style={[
						styles.bubbleContent,
						{
							backgroundColor: isUser
								? theme.colors.primaryContainer
								: theme.colors.surfaceVariant,
							borderColor: theme.colors.outlineVariant,
						},
					]}
				>
					{isUser ? (
						<Text style={[styles.content, { color: textColor }]}>
							{message.content}
						</Text>
					) : (
						<Markdown style={markdownStyles}>{message.content}</Markdown>
					)}
					<View style={styles.metaRow}>
						<Text style={[styles.timestamp, { color: statusColor }]}>
							{statusLabel || timeLabel}
						</Text>
						{isUser && message.status === 'sent' ? (
							<Icon source="check" color={statusColor} size={14} />
						) : null}
						{isUser && message.status === 'failed' ? (
							<Icon
								source="alert-circle"
								color={theme.colors.error}
								size={16}
							/>
						) : null}
					</View>
				</Surface>

				{/* Render follow-up prompt if available */}
				{!isUser && message.followUp && onFollowUpAction && (
					<ChatFollowUpPrompt
						followUpMessage={message.followUp.message}
						actions={message.followUp.actions}
						onActionPress={onFollowUpAction}
					/>
				)}
			</View>
			{isUser && (
				<Avatar.Text
					size={36}
					label="You"
					style={{ backgroundColor: theme.colors.primaryContainer }}
					color={theme.colors.onPrimaryContainer}
				/>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	row: {
		marginBottom: 12,
		gap: 8,
	},
	bubble: {
		gap: 8,
	},
	bubbleContent: {
		padding: 12,
		borderRadius: 16,
		borderWidth: 0,
		gap: 4,
	},
	content: {
		fontSize: 16,
		lineHeight: 22,
	},
	metaRow: {
		marginTop: 6,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
	},
	timestamp: {
		fontSize: 12,
	},
});
