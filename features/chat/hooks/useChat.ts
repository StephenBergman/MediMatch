import { useCallback, useState } from 'react';

import {
	createChatCompletion,
	getOpenAiApiKey,
} from '@/features/chat/api/openai';
import {
	type ChatMessage,
	type ChatMessagePayload,
} from '@/features/chat/types';

const SYSTEM_PROMPT: ChatMessagePayload = {
	role: 'system',
	content:
		'You are a concise, helpful medical assistant for the MediMatch app. Provide clear, actionable answers and keep responses short.',
};

const createId = () =>
	`${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export function useChat() {
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [isSending, setIsSending] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const apiKey = getOpenAiApiKey();

	const clearError = useCallback(() => setError(null), []);

	const resetChat = useCallback(() => {
		setMessages([]);
		setError(null);
	}, []);

	const sendMessage = useCallback(
		async ({ content }: { content: string }): Promise<boolean> => {
			const trimmed = content.trim();
			if (!trimmed) {
				setError('Please enter a message before sending.');
				return false;
			}

			if (!apiKey) {
				setError(
					'OpenAI API key is not configured. Add EXPO_PUBLIC_OPENAI_API_KEY to your app env.'
				);
				return false;
			}

			const userMessage: ChatMessage = {
				id: createId(),
				role: 'user',
				content: trimmed,
			};

			const conversation = [...messages, userMessage];
			setMessages(conversation);
			setIsSending(true);
			setError(null);

			let wasSuccessful = false;

			try {
				const reply = await createChatCompletion({
					messages: [
						SYSTEM_PROMPT,
						...conversation.map(({ role, content }) => ({
							role,
							content,
						})),
					],
				});

				const assistantMessage: ChatMessage = {
					id: createId(),
					role: 'assistant',
					content: reply,
				};

				setMessages((prev) => [...prev, assistantMessage]);
				wasSuccessful = true;
			} catch (err) {
				const message =
					err instanceof Error
						? err.message
						: 'Unable to reach the assistant right now.';
				setError(message);
			} finally {
				setIsSending(false);
			}

			return wasSuccessful;
		},
		[messages]
	);

	return {
		messages,
		sendMessage,
		isSending,
		error,
		clearError,
		resetChat,
	};
}
