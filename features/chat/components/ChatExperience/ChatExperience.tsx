import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import { useRouter } from 'expo-router';
import { Animated, FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';
import { ChatComposer } from '@/features/chat/components/ChatComposer/ChatComposer';
import { ChatErrorNotice } from '@/features/chat/components/ChatErrorNotice/ChatErrorNotice';
import { ChatHeader } from '@/features/chat/components/ChatHeader/ChatHeader';
import { ChatMessageList } from '@/features/chat/components/ChatMessageList/ChatMessageList';
import {
	ChatProvider,
	useChatContext,
} from '@/features/chat/contexts/ChatContext';
import { type ChatMessage } from '@/features/chat/types';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { guard } from '@/utils/ErrorHandling/helpers/capture';

/** Top-level chat layout rendered inside `ChatExperience`. Handles scrolling, header, list, and composer. */
function ChatExperienceInner() {
	const router = useRouter();
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
		handleFollowUpAction,
	} = useChatContext();
	const listRef = useRef<FlatList<ChatMessage> | null>(null);
	const fadeAnim = useRef(new Animated.Value(1)).current;
	const [isClearing, setIsClearing] = useState(false);

	const runClearAnimation = useCallback(() => {
		if (isClearing) return;
		setIsClearing(true);
		Animated.timing(fadeAnim, {
			toValue: 0,
			duration: 200,
			useNativeDriver: true,
		}).start(() => {
			setInput('');
			resetChat();
			Animated.timing(fadeAnim, {
				toValue: 1,
				duration: 200,
				useNativeDriver: true,
			}).start(() => {
				setIsClearing(false);
			});
		});
	}, [fadeAnim, isClearing, resetChat]);


	const guardedSend = useMemo(
		() =>
			guard(async (value: string) => {
				const wasSent = await sendMessage({ content: value });
				if (wasSent) {
					setInput('');
				}
			}),
		[sendMessage]
	);

	const handleSend = useCallback(() => {
		guardedSend(input);
	}, [guardedSend, input]);

	const guardedFollowUp = useMemo(
		() =>
			guard((actionId: string) => {
				const lastAssistantMessage = [...messages]
					.reverse()
					.find((message) => message.role === 'assistant')?.content;
				const normalized = lastAssistantMessage?.toLowerCase() ?? '';
				const prefersEmergency =
					normalized.includes('emergency room') ||
					/\ber\b/.test(normalized) ||
					normalized.includes('call 911') ||
					normalized.includes('emergency services');
				const carePreference = prefersEmergency ? 'emergency' : 'urgent';

				const result = handleFollowUpAction(
					actionId,
					() => {
						router.push({
							pathname: '/(protected)/(tabs)/map',
							params: { route: 'nearest', care: carePreference },
						});
					},
					runClearAnimation
				);

				// If it's a message response, optionally add to chat
				if (result.type === 'message' && result.message) {
					// Auto-add a contextual message showing the user's action
					console.log('User action:', actionId, result.message);
				}
			}),
		[handleFollowUpAction, messages, router, runClearAnimation]
	);

	const handleFollowUpClick = useCallback(
		(actionId: string) => {
			guardedFollowUp(actionId);
		},
		[guardedFollowUp]
	);

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

			<Animated.View style={[styles.contentWrap, { opacity: fadeAnim }]}>
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
						onFollowUpAction={handleFollowUpClick}
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
						disabled={isClearing}
						placeholder={
							'Describe what you\'re feeling. Example: "sharp pain near my left ribs"'
						}
					/>
				</View>
			</Animated.View>

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
	contentWrap: {
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
