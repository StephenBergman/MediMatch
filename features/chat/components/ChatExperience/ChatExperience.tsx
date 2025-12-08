import React, { useEffect, useRef, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ChatComposer } from '@/features/chat/components/ChatComposer/ChatComposer';
import { ChatErrorNotice } from '@/features/chat/components/ChatErrorNotice/ChatErrorNotice';
import { ChatHeader } from '@/features/chat/components/ChatHeader/ChatHeader';
import { ChatMessageList } from '@/features/chat/components/ChatMessageList/ChatMessageList';
import { ChatProvider, useChatContext } from '@/features/chat/contexts/ChatContext';
import { type ChatMessage } from '@/features/chat/types';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

/** Top-level chat layout rendered inside `ChatExperience`. Handles scrolling, header, list, and composer. */
function ChatExperienceInner() {
	const colorScheme = useColorScheme() ?? 'light';
	const colors = Colors[colorScheme];
	const palette = Colors.palette;
	const [input, setInput] = useState('');
	const {
		messages,
		sendMessage,
		isSending,
		isAssistantTyping,
		error,
		clearError,
		resetChat,
	} = useChatContext();
	const listRef = useRef<FlatList<ChatMessage> | null>(null);

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
	}, [messages, isAssistantTyping]);

	return (
		<SafeAreaView
			style={[styles.safeArea, { backgroundColor: colors.background }]}
			edges={['top', 'left', 'right']}
		>
			<ChatHeader
				onReset={resetChat}
				messageCount={messages.length}
				isTyping={isAssistantTyping}
			/>

			<View
				style={[
					styles.container,
					{
						backgroundColor: colors.background,
					},
				]}
			>
				<View style={[styles.backdrop, { backgroundColor: palette.sky }]} />
				<ChatMessageList
					messages={messages}
					isTyping={isAssistantTyping}
					onSelectPrompt={setInput}
					listRef={listRef}
					ListFooterComponent={
						<ChatErrorNotice
							error={error}
							onDismiss={clearError}
							onRetry={handleSend}
						/>
					}
				/>
			</View>

			<View
				style={[
					styles.composerWrap,
					{
						borderColor: colors.border,
						backgroundColor: colors.surface,
					},
				]}
			>
				<ChatComposer
					value={input}
					onChange={(text) => {
						if (error) clearError();
						setInput(text);
					}}
					onSend={handleSend}
					isSending={isSending}
					disabled={false}
					placeholder="Describe what you’re feeling. Example: “sharp pain near my left ribs”"
				/>
			</View>
		</SafeAreaView>
	);
}

/** Screen-ready chat experience that wires up `ChatProvider` and renders the full UI. */
export function ChatExperience() {
	return (
		<ChatProvider>
			<ChatExperienceInner />
		</ChatProvider>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
	},
	container: {
		flex: 1,
		paddingHorizontal: 16,
		paddingTop: 12,
		position: 'relative',
	},
	backdrop: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		height: 80,
		opacity: 0.22,
	},
	composerWrap: {
		borderTopWidth: 1,
	},
});
