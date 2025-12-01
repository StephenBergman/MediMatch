import React, { useEffect, useRef, useState } from 'react';
import {
	FlatList,
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
	View,
} from 'react-native';
import { Appbar, Button, Text, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';
import { ChatMessageBubble } from '@/features/chat/components/ChatMessageBubble';
import { useChat } from '@/features/chat/hooks/useChat';
import { type ChatMessage } from '@/features/chat/types';
import { useColorScheme } from '@/hooks/use-color-scheme';

/**
 * Chat tab that wires the message list, composer, and header actions to the
 * `useChat` hook so user see the end-to-end assistant experience.
 */
export default function ChatScreen() {
	const colorScheme = useColorScheme() ?? 'light';
	const colors = Colors[colorScheme];
	const palette = Colors.palette;
	const [input, setInput] = useState('');
	const { messages, sendMessage, isSending, error, clearError, resetChat } =
		useChat();
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
			style={[styles.safeArea, { backgroundColor: colors.background }]}
			edges={['top', 'left', 'right']}
		>
			<Appbar.Header mode="small" style={{ backgroundColor: palette.midnight }}>
				<View style={styles.headerTitleWrap}>
					<Text
						variant="titleMedium"
						style={[styles.headerTitle, { color: colors.inverseText }]}
					>
						Assistant
					</Text>
					<Text variant="labelSmall" style={{ color: palette.sky }}>
						Gemini-powered chat
					</Text>
				</View>
				{messages.length > 0 ? (
					<Appbar.Action
						icon="delete-sweep"
						onPress={resetChat}
						accessibilityLabel="Clear conversation"
						color={colors.accent}
					/>
				) : null}
			</Appbar.Header>

			<KeyboardAvoidingView
				style={styles.flex}
				behavior={Platform.OS === 'ios' ? 'padding' : undefined}
				keyboardVerticalOffset={Platform.OS === 'ios' ? 76 : 0}
			>
				<View
					style={[styles.container, { backgroundColor: colors.background }]}
				>
					<Text
						style={[styles.infoText, { color: colors.secondary }]}
						variant="bodySmall"
					>
						Ask me anything health related!
					</Text>

					<FlatList
						ref={listRef}
						data={messages}
						keyExtractor={(item) => item.id}
						renderItem={({ item }) => <ChatMessageBubble message={item} />}
						contentContainerStyle={[
							styles.listContent,
							{
								backgroundColor: colors.background,
							},
						]}
						ListEmptyComponent={
							<View style={styles.emptyState}>
								<Text variant="titleMedium" style={{ color: colors.text }}>
									Start a conversation
								</Text>
								<Text
									style={[
										styles.emptyCopy,
										{ color: colors.text, opacity: 0.72 },
									]}
								>
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
							borderColor: colors.border,
							backgroundColor: colors.surface,
						},
					]}
				>
					<Text style={[styles.composerLabel, { color: colors.text }]}>
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
									backgroundColor: colors.card,
								},
							]}
							textColor={colors.text}
							placeholderTextColor={palette.sky}
							multiline
						/>
						<Button
							mode="contained"
							onPress={handleSend}
							disabled={!input.trim() || isSending}
							loading={isSending}
							contentStyle={styles.sendContent}
							style={[styles.sendButton, { backgroundColor: colors.primary }]}
							textColor={colors.inverseText}
							icon="send"
						>
							Send
						</Button>
					</View>
					{error ? (
						<Text style={[styles.errorText, { color: colors.danger }]}>
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
	headerTitleWrap: {
		flex: 1,
		gap: 2,
	},
	headerTitle: {
		fontWeight: '700',
	},
});
