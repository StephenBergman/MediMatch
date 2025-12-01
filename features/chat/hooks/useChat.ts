import { useCallback, useState } from 'react';

import {
	createChatCompletion,
	getOpenAiApiKey,
} from '@/features/chat/api/openai';
import { buildMockMessage } from '@/features/chat/data/mock-guidance';
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

const useMockAssistant =
	(process.env.EXPO_PUBLIC_USE_MOCK_ASSISTANT ?? '').toLowerCase() === 'true';

const formatOpenAiError = (message: string) => {
	const lower = message.toLowerCase();

	if (
		lower.includes('exceeded your current quota') ||
		lower.includes('insufficient_quota')
	) {
		return 'The shared OpenAI key hit its quota. Add your own key via EXPO_PUBLIC_OPENAI_API_KEY (or OPENAI_API_KEY locally) to keep chatting.';
	}

	if (lower.includes('api key is not configured')) {
		return 'OpenAI API key is missing. Set EXPO_PUBLIC_OPENAI_API_KEY (or OPENAI_API_KEY locally).';
	}

	if (lower.includes('invalid api key') || lower.includes('api key')) {
		return 'OpenAI rejected the API key. Double-check the value and billing status.';
	}

	return message;
};

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

			if (!useMockAssistant && !apiKey) {
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
				const reply = useMockAssistant
					? buildMockMessage(trimmed)
					: await createChatCompletion({
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
				const message = err instanceof Error ? err.message : '';
				const friendly =
					message.trim() ||
					'Unable to reach the assistant right now. Please try again.';
				setError(formatOpenAiError(friendly));
			} finally {
				setIsSending(false);
			}

			return wasSuccessful;
		},
		//eslint-disable-next-line react-hooks/exhaustive-deps
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
