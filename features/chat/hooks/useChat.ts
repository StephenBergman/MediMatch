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
import {
	generateFollowUpMessage,
	shouldShowFollowUp,
} from '@/features/chat/utils/followUpPrompt';
import { AppError } from 'utils/ErrorHandling/errors';
import { normalizeUnknown } from 'utils/ErrorHandling/errors/normalize';
import { decideUx, type UxDecision } from 'utils/ErrorHandling/errors/policy';
import { validationError } from 'utils/ErrorHandling/errors/types/validation';
import { captureException } from 'utils/ErrorHandling/helpers/capture';

export type ChatUxError = {
	message: string;
	ux: UxDecision;
	appError?: AppError;
};

const SYSTEM_PROMPT: ChatMessagePayload = {
	role: 'system',
	content:
		'You are a concise triage assistant for the MediMatch app. Do NOT provide medical advice, diagnoses, or treatment steps. Your only job is to recommend the appropriate care setting (e.g., call emergency services/ER, Urgent Care, Primary Care, or Self-care) with a brief rationale. If symptoms sound severe or life-threatening, instruct the user to call emergency services immediately. Keep replies short.',
};

const createId = () =>
	`${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

type MessageStatus = NonNullable<ChatMessage['status']>;

const updateMessageStatus = (
	messages: ChatMessage[],
	messageId: string,
	nextStatus: MessageStatus
): ChatMessage[] =>
	messages.map((msg) =>
		msg.id === messageId ? { ...msg, status: nextStatus } : msg
	);

const useMockAssistant =
	(process.env.EXPO_PUBLIC_USE_MOCK_ASSISTANT ?? '').toLowerCase() === 'true';

const formatGeminiError = (message: string) => {
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
	const [isAssistantTyping, setIsAssistantTyping] = useState(false);
	const [error, setError] = useState<ChatUxError | null>(null);
	const apiKey = getGeminiApiKey();

	const messagesRef = useRef<ChatMessage[]>([]);
	const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		messagesRef.current = messages;
	}, [messages]);

	useEffect(
		() => () => {
			if (typingTimerRef.current) {
				clearTimeout(typingTimerRef.current);
			}
		},
		[]
	);

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

	const handleFailure = useCallback((raw: unknown) => {
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
		const chatError: ChatUxError = { message: friendly, ux, appError };
		setError(chatError);
		return chatError;
	}, []);

	const resetChat = useCallback(() => {
		setMessages([]);
		setError(null);
		setIsAssistantTyping(false);
	}, []);

	/**
	 * Handler for follow-up action clicks (e.g., "yes answered", "find facility").
	 * Returns action result and optionally triggers navigation.
	 */
	const handleFollowUpAction = useCallback(
		(
			actionId: string,
			onNavigateToFacility?: () => void
		): { type: string; message?: string } => {
			if (actionId === 'find_facility') {
				// Trigger facility search navigation
				onNavigateToFacility?.();
				return {
					type: 'navigation',
					message: 'Navigating to facility search...',
				};
			}

			if (actionId === 'answered') {
				return {
					type: 'message',
					message:
						"Great! I'm glad that was helpful. Feel free to ask if you have new concerns.",
				};
			}

			if (actionId === 'more_questions') {
				return {
					type: 'message',
					message: "I'm here to help—go ahead with your follow-up question!",
				};
			}

			return { type: 'unknown' };
		},
		[]
	);

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
				handleFailure(
					validationError(
						'Gemini API key is missing. Set EXPO_PUBLIC_GEMINI_API_KEY (or GEMINI_API_KEY).',
						{ code: 'VALIDATION_REQUIRED' }
					)
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
				const history = messagesRef.current.filter(
					(msg) => msg.status !== 'failed'
				);
				const reply = useMockAssistant
					? buildMockMessage(trimmed)
					: await createChatCompletion({
							apiKey,
							messages: [
								SYSTEM_PROMPT,
								...history.map(({ role, content: text }) => ({
									role,
									content: text,
								})),
								{ role: 'user', content: trimmed },
							],
						});

				// Count assistant messages to determine if follow-up should be shown
				const assistantMessageCount = messagesRef.current.filter(
					(msg) => msg.role === 'assistant' && msg.status !== 'failed'
				).length;

				const assistantMessage: ChatMessage = {
					id: createId(),
					role: 'assistant',
					content: reply,
					createdAt: Date.now(),
					status: 'sent',
				};

				// Add follow-up prompt if conditions are met
				if (shouldShowFollowUp(assistantMessageCount)) {
					const followUpData = generateFollowUpMessage(
						assistantMessageCount,
						reply
					);
					assistantMessage.followUp = {
						message: followUpData.message,
						actions: followUpData.actions,
					};
				}

				setMessages((prev) => {
					const updated = updateMessageStatus(prev, userMessage.id, 'sent');
					return [...updated, assistantMessage];
				});
				wasSuccessful = true;
			} catch (err) {
				handleFailure(err);
				setMessages((prev) =>
					updateMessageStatus(prev, userMessage.id, 'failed')
				);
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
		handleFollowUpAction,
	};
}
