import { ChatMessagePayload } from '@/features/chat/types';
import { invariantError } from 'utils/ErrorHandling/errors/types/invarient';
import { networkError } from 'utils/ErrorHandling/errors/types/network';
import { validationError } from 'utils/ErrorHandling/errors/types/validation';
import { retry } from 'utils/retry';

const GEMINI_CHAT_URL =
	'https://generativelanguage.googleapis.com/v1beta/models';
const DEFAULT_MODEL = 'gemini-3-pro-preview';
const appGeminiKey =
	process.env.EXPO_PUBLIC_GEMINI_API_KEY ??
	process.env.GEMINI_API_KEY ??
	undefined;

/** Returns whichever Gemini API key is available to the client. */
export function getGeminiApiKey() {
	return appGeminiKey?.trim() ?? '';
}

type CreateChatCompletionParams = {
	messages: ChatMessagePayload[];
	model?: string;
	apiKeyOverride?: string;
};

type GeminiContent = { role: 'user' | 'model'; parts: { text: string }[] };

/**
 * Shapes our internal chat messages into the Gemini payload format, hoisting
 * any system messages into `system_instruction`.
 */
function buildGeminiPayload(messages: ChatMessagePayload[]) {
	const systemInstructions: string[] = [];
	const contents: GeminiContent[] = [];

	for (const message of messages) {
		if (message.role === 'system') {
			const text = message.content?.trim();
			if (text) {
				systemInstructions.push(text);
			}
			continue;
		}

		const role: GeminiContent['role'] =
			message.role === 'assistant' ? 'model' : 'user';

		contents.push({
			role,
			parts: [{ text: message.content }],
		});
	}

	const payload: Record<string, unknown> = {
		contents,
	};

	if (systemInstructions.length) {
		payload.system_instruction = {
			parts: [{ text: systemInstructions.join('\n\n') }],
		};
	}

	return payload;
}

/**
 * Calls the Gemini `generateContent` endpoint and returns the combined text of
 * the first candidate. Throws with a friendly error if the request fails.
 */
export async function createChatCompletion({
	messages,
	model = DEFAULT_MODEL,
	apiKeyOverride,
}: CreateChatCompletionParams): Promise<string> {
	const apiKey = (apiKeyOverride ?? getGeminiApiKey()).trim();

	if (!apiKey) {
		throw invariantError('Gemini API key is not configured for this app.', {
			code: 'INVARIANT_CONFIG_MISSING',
			severity: 'error',
		});
	}

	const url = `${GEMINI_CHAT_URL}/${model}:generateContent?key=${encodeURIComponent(
		apiKey
	)}`;

	const payload = buildGeminiPayload(messages);

	const { json } = await retry(
		async (attempt) => {
			let response: Response;
			try {
				response = await fetch(url, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(payload),
				});
			} catch (err) {
				const detail =
					err instanceof Error ? err.message : typeof err === 'string' ? err : '';
				throw networkError(
					`Unable to reach Gemini right now.${detail ? ` (${detail})` : ''}`,
					{
						method: 'POST',
						url,
						retryable: true,
						metadata: { feature: 'chat' },
						attempt,
					}
				);
			}

			const json = await response.json().catch(() => null);

			if (!response.ok) {
				const message =
					(json as { error?: { message?: string } })?.error?.message ??
					'Gemini request failed.';
				const statusSuffix = response.status
					? ` (status ${response.status}${
							response.statusText ? ` ${response.statusText}` : ''
						})`
					: '';
				throw networkError(`${message}${statusSuffix}`, {
					status: response.status,
					method: 'POST',
					url,
					retryable: response.status === 429 || response.status >= 500,
					attempt,
				});
			}

			return { json };
		},
		{
			attempts: 3,
			baseDelayMs: 400,
			maxDelayMs: 2000,
			jitter: true,
		}
	);

	const text = (
		(
			json as {
				candidates?: { content?: { parts?: { text?: string }[] } }[];
			}
		)?.candidates?.[0]?.content?.parts ?? []
	)
		.map((part) => part?.text ?? '')
		.join('')
		.trim();

	if (!text) {
		throw validationError('Gemini did not return a response.', {
			code: 'VALIDATION_REQUIRED',
		});
	}

	return text;
}
