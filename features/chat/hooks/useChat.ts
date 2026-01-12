import { useCallback, useEffect, useRef, useState } from 'react';

import {
	createChatCompletion,
	getGeminiApiKey,
} from '@/features/chat/api/gemini';
import { buildMockMessage } from '@/features/chat/data/mock-guidance';
import {
	type ChatMessage,
	type ChatMessagePayload,
} from '@/features/chat/types';
import { AppError } from 'utils/ErrorHandling/errors';
import { decideUx, type UxDecision } from 'utils/ErrorHandling/errors/policy';
import { captureException } from 'utils/ErrorHandling/helpers/capture';
import { normalizeUnknown } from 'utils/ErrorHandling/errors/normalize';
import { invariantError } from 'utils/ErrorHandling/errors/types/invarient';
import { validationError } from 'utils/ErrorHandling/errors/types/validation';

const SYSTEM_PROMPT: ChatMessagePayload = {
	role: 'system',
	content:
		'You are a concise triage assistant for the MediMatch app. Do NOT provide medical advice, diagnoses, or treatment steps. Your only job is to recommend the appropriate care setting (e.g., call emergency services/ER, Urgent Care, Primary Care, or Self-care) with a brief rationale. If symptoms sound severe or life-threatening, instruct the user to call emergency services immediately. Keep replies short.',
};

const createId = () =>
	`${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const useMockAssistant =
	(process.env.EXPO_PUBLIC_USE_MOCK_ASSISTANT ?? '').toLowerCase() === 'true';

const formatOpenAiError = (message: string) => {
	const lower = message.toLowerCase();

	if (lower.includes('quota')) {
		return 'The Gemini key hit a quota limit. Add your own key via EXPO_PUBLIC_GEMINI_API_KEY (or GEMINI_API_KEY locally) to keep chatting.';
	}

	if (
		lower.includes('api key is not configured') ||
		lower.includes('missing api key')
	) {
		return 'Gemini API key is missing. Set EXPO_PUBLIC_GEMINI_API_KEY (or GEMINI_API_KEY locally).';
	}

	if (lower.includes('invalid api key') || lower.includes('api key')) {
		return 'Gemini rejected the API key. Double-check the value and billing status.';
	}

	return message;
};

/**
 * Client-side chat orchestrator: validates input, manages conversation state,
 * proxies messages to Gemini (or a mock assistant), and exposes loading/error flags.
 */
export function useChat() {
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [isSending, setIsSending] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const apiKey = getOpenAiApiKey();

	const clearError = useCallback(() => setError(null), []);

	const stopTypingSoon = useCallback(() => {
		if (typingTimerRef.current) {
			clearTimeout(typingTimerRef.current);
		}
		typingTimerRef.current = setTimeout(() => {
			setIsAssistantTyping(false);
		}, 320);
	}, []);

	const startTyping = useCallback(() => {
		if (typingTimerRef.current) {
			clearTimeout(typingTimerRef.current);
		}
		setIsAssistantTyping(true);
	}, []);

	const handleFailure = useCallback(
		(raw: unknown) => {
			const normalized = raw instanceof AppError ? raw : normalizeUnknown(raw);
			const appError = captureException(normalized, {
				where: 'useChat.sendMessage',
				context: { feature: 'chat' },
			});
			const ux = decideUx(appError);
			const baseMessage =
				ux.userMessage ||
				appError.message ||
				'Unable to reach the assistant right now. Please try again.';
			const friendly = formatGeminiError(baseMessage);
			setError({ appError, ux, message: friendly });
			return friendly;
		},
		[]
	);

	const resetChat = useCallback(() => {
		setMessages([]);
		setError(null);
		setIsAssistantTyping(false);
	}, []);

	const sendMessage = useCallback(
		async ({ content }: { content: string }): Promise<boolean> => {
			const trimmed = content.trim();
			if (!trimmed) {
				handleFailure(
					validationError('Please enter a message before sending.', {
						code: 'VALIDATION_REQUIRED',
					})
				);
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
				createdAt: Date.now(),
				status: 'sending',
			};

			setMessages((prev) => [...prev, userMessage]);
			setIsSending(true);
			startTyping();
			setError(null);

			let wasSuccessful = false;

			try {
				const reply = useMockAssistant
					? buildMockMessage(trimmed)
					: await createChatCompletion({
							messages: [
								SYSTEM_PROMPT,
								...messagesRef.current.map(({ role, content }) => ({
									role,
									content,
								})),
								{ role: 'user', content: trimmed },
							],
						});

				setMessages((prev) =>
					prev.map((msg) =>
						msg.id === userMessage.id ? { ...msg, status: 'sent' } : msg
					)
				);

				const assistantMessage: ChatMessage = {
					id: createId(),
					role: 'assistant',
					content: reply,
					createdAt: Date.now(),
					status: 'sent',
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
				stopTypingSoon();
			}

			return wasSuccessful;
		},
		[apiKey, handleFailure, startTyping, stopTypingSoon]
	);

	return {
		messages,
		sendMessage,
		isSending,
		isAssistantTyping,
		error,
		clearError,
		resetChat,
	};
}
