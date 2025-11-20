import React, { useEffect, useRef, useState } from 'react';
import {
	FlatList,
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
	View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
	Appbar,
	Button,
	Text,
	TextInput,
	useTheme,
} from 'react-native-paper';

import { ChatMessageBubble } from '@/features/chat/components/ChatMessageBubble';
import { useChat } from '@/features/chat/hooks/useChat';
import { type ChatMessage } from '@/features/chat/types';

export default function ChatScreen() {
	const theme = useTheme();
	const [input, setInput] = useState('');
	const {
		messages,
		sendMessage,
		isSending,
		error,
		clearError,
		resetChat,
	} = useChat();
	const listRef = useRef<FlatList<ChatMessage>>(null);

	const handleSend = async () => {
		const wasSent = await sendMessage({ content: input });
		if (wasSent) {
			setInput('');
		}
	};

	useEffect(() => {
		if (!messages.length) return;
		const timeout = setTimeout(() => {
			listRef.current?.scrollToEnd({ animated: true });
		}, 60);
		return () => clearTimeout(timeout);
	}, [messages]);

	return (
		<SafeAreaView
			style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
			edges={['top', 'left', 'right']}
		>
			<Appbar.Header mode="small">
				<Appbar.Content title="Assistant" subtitle="OpenAI-powered chat" />
				{messages.length > 0 ? (
					<Appbar.Action
						icon="delete-sweep"
						onPress={resetChat}
						accessibilityLabel="Clear conversation"
					/>
				) : null}
			</Appbar.Header>

			<KeyboardAvoidingView
				style={styles.flex}
				behavior={Platform.OS === 'ios' ? 'padding' : undefined}
				keyboardVerticalOffset={Platform.OS === 'ios' ? 76 : 0}
			>
				<View style={styles.container}>
					<Text style={styles.infoText} variant="bodySmall">
						Using the built-in MediMatch OpenAI key. Ask anything health related.
					</Text>

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
						ListEmptyComponent={
							<View style={styles.emptyState}>
								<Text variant="titleMedium">Start a conversation</Text>
								<Text style={styles.emptyCopy}>
									Type your question below to chat with MediMatch.
								</Text>
							</View>
						}
						keyboardShouldPersistTaps="handled"
						showsVerticalScrollIndicator={false}
					/>
				</View>

				<View
					style={[
						styles.composer,
						{
							borderColor: theme.colors.outlineVariant,
							backgroundColor: theme.colors.surface,
						},
					]}
				>
					<Text
						style={[
							styles.composerLabel,
							{ color: theme.colors.onSurfaceVariant },
						]}
					>
						Message
					</Text>
					<View style={styles.composerRow}>
						<TextInput
							mode="flat"
							placeholder="Message MediMatch..."
							value={input}
							onChangeText={(text) => {
								if (error) clearError();
								setInput(text);
							}}
							underlineColor="transparent"
							activeUnderlineColor="transparent"
							style={[
								styles.messageInput,
								{
									backgroundColor: theme.colors.surfaceVariant,
								},
							]}
							multiline
						/>
						<Button
							mode="contained"
							onPress={handleSend}
							disabled={!input.trim() || isSending}
							loading={isSending}
							contentStyle={styles.sendContent}
							style={styles.sendButton}
							icon="send"
						>
							Send
						</Button>
					</View>
					{error ? (
						<Text style={[styles.errorText, { color: theme.colors.error }]}>
							{error}
						</Text>
					) : null}
				</View>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
	},
	flex: {
		flex: 1,
	},
	container: {
		flex: 1,
		paddingHorizontal: 16,
		paddingTop: 16,
	},
	infoText: {
		marginBottom: 8,
	},
	listContent: {
		flexGrow: 1,
		paddingVertical: 12,
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
	composer: {
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderTopWidth: 1,
		flexDirection: 'row',
		alignItems: 'center',
	},
	composerLabel: {
		fontWeight: '600',
		marginRight: 12,
	},
	composerRow: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'flex-end',
		columnGap: 8,
	},
	messageInput: {
		flex: 1,
		marginRight: 8,
	},
	errorText: {
		marginTop: 6,
	},
	sendContent: {
		height: 44,
	},
	sendButton: {
		minWidth: 96,
		alignSelf: 'flex-end',
	},
});
