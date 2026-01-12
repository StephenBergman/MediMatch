import React, { type RefObject } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Chip, Text, useTheme } from 'react-native-paper';

import { ChatMessageBubble } from '@/features/chat/components/ChatMessageBubble';
import { TypingIndicator } from '@/features/chat/components/TypingIndicator/TypingIndicator';
import { chatPrompts } from '@/features/chat/data/quick-prompts';
import { type ChatMessage } from '@/features/chat/types';

type Props = {
	messages: ChatMessage[];
	isTyping: boolean;
	onSelectPrompt: (text: string) => void;
	listRef: RefObject<FlatList<ChatMessage> | null>;
	ListFooterComponent?: React.ReactNode;
};

/** Renders chat messages with quick-start chips, typing indicator, and footer content. */
export function ChatMessageList({
	messages,
	isTyping,
	onSelectPrompt,
	listRef,
	ListFooterComponent,
}: Props) {
	const theme = useTheme();

	return (
		<FlatList
			ref={listRef}
			data={messages}
			keyExtractor={(item) => item.id}
			renderItem={({ item }) => <ChatMessageBubble message={item} />}
			contentContainerStyle={[
				styles.listContent,
				{
					backgroundColor: theme.colors.background,
				},
			]}
			ListHeaderComponent={
				<View style={styles.promptRow}>
					<Text variant="titleSmall" style={{ color: theme.colors.onSurface }}>
						Quick starters
					</Text>
					<View style={styles.promptChips}>
						{chatPrompts.map((prompt) => (
							<Chip
								key={prompt.id}
								mode="outlined"
								compact
								onPress={() => onSelectPrompt(prompt.label)}
								icon="message-text-outline"
							>
								{prompt.label}
							</Chip>
						))}
					</View>
				</View>
			}
			ListEmptyComponent={
				<View style={styles.emptyState}>
					<Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
						Start a conversation
					</Text>
					<Text
						style={[
							styles.emptyCopy,
							{ color: theme.colors.onSurface, opacity: 0.72 },
						]}
					>
						Share symptoms or concerns and the assistant will suggest where to
						get care.
					</Text>
				</View>
			}
			ListFooterComponent={
				<View style={styles.footer}>
					{isTyping ? <TypingIndicator /> : null}
					{ListFooterComponent}
				</View>
			}
			keyboardShouldPersistTaps="handled"
			showsVerticalScrollIndicator={false}
		/>
	);
}

const styles = StyleSheet.create({
	listContent: {
		flexGrow: 1,
		paddingVertical: 12,
	},
	promptRow: {
		gap: 8,
		paddingHorizontal: 4,
		paddingBottom: 8,
	},
	promptChips: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 8,
	},
	emptyState: {
		alignItems: 'center',
		justifyContent: 'center',
		flex: 1,
		paddingHorizontal: 24,
	},
	emptyCopy: {
		textAlign: 'center',
		marginTop: 8,
	},
	footer: {
		gap: 8,
		marginBottom: 12,
	},
});
