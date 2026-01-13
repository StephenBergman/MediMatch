import { useCallback, useState } from 'react';

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
		'You are a concise, helpful medical assistant for the MediMatch app. Provide clear, actionable answers and keep responses short.',
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

	const appendMessages = useCallback((next: ChatMessage[]) => {
		setMessages((prev) => [...prev, ...next]);
	}, []);

	const resetChat = useCallback(() => {
		setMessages([]);
		setError(null);
	}, []);

	/**
	 * Handler for follow-up action clicks (e.g., "yes answered", "find facility").
	 * Returns action result and optionally triggers navigation.
	 */
	const handleFollowUpAction = useCallback(
		(
			actionId: string,
			onNavigateToFacility?: () => void,
			onEndChat?: () => void
		): { type: string; message?: string } => {
			const now = Date.now();
			const endChatPrompt = {
				message: 'Would you like to end this chat?',
				actions: [
					{
						id: 'end_chat_yes',
						label: 'Yes, end chat',
						description: 'End this conversation',
					},
					{
						id: 'end_chat_no',
						label: 'No, keep chatting',
						description: 'Continue the conversation',
					},
				],
			};

			const actionMap: Record<
				'answered' | 'more_questions' | 'find_facility' | 'end_chat_yes' | 'end_chat_no',
				{
					type: 'message' | 'navigation' | 'end';
					user: string;
					assistant: string;
					followUp?: { message: string; actions: { id: string; label: string; description?: string }[] };
				}
			> = {
				answered: {
					type: 'message',
					user: 'No, thank you',
					assistant:
						"Got it. If anything changes or you have more questions later, I'm here to help.",
					followUp: endChatPrompt,
				},
				more_questions: {
					type: 'message',
					user: 'I have more questions',
					assistant:
						"I'm here to help - go ahead with your follow-up question!",
				},
				find_facility: {
					type: 'navigation',
					user: 'Yes, route me',
					assistant: 'Opening the map and routing you to the nearest option.',
				},
				end_chat_yes: {
					type: 'end',
					user: 'Yes, end chat',
					assistant: 'Thanks for chatting. Take care!',
				},
				end_chat_no: {
					type: 'message',
					user: 'No, keep chatting',
					assistant: 'No problem - what else can I help you with?',
				},
			};

			const selection =
				actionMap[actionId as keyof typeof actionMap] ?? null;
			if (!selection) return { type: 'unknown' };

			appendMessages([
				{
					id: createId(),
					role: 'user',
					content: selection.user,
					createdAt: now,
					status: 'sent',
				},
				{
					id: createId(),
					role: 'assistant',
					content: selection.assistant,
					createdAt: now + 1,
					status: 'sent',
					followUp: selection.followUp,
				},
			]);

			if (selection.type === 'navigation') {
				onNavigateToFacility?.();
			}

			if (selection.type === 'end') {
				setTimeout(() => {
					onEndChat?.();
				}, 700);
			}

			return { type: selection.type, message: selection.assistant };
		},
		[appendMessages]
	);
	const sendMessage = useCallback(
		async ({ content }: { content: string }): Promise<boolean> => {
			const trimmed = content.trim();
			if (!trimmed) {
				setError('Please enter a message before sending.');
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
			};

			const conversation = [...messages, userMessage];
			setMessages(conversation);
			setIsSending(true);
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
		handleFollowUpAction,
	};
}
