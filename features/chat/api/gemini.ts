import { ChatMessagePayload } from '@/features/chat/types';

const GEMINI_CHAT_URL =
	'https://generativelanguage.googleapis.com/v1beta/models';
const DEFAULT_MODEL = 'gemini-3-pro-preview';
const DEFAULT_APP_API_KEY = 'AIzaSyDobH2E28LXYwaurbdu4RpIcgo3Q39nhtY';

const appGeminiKey =
	process.env.EXPO_PUBLIC_GEMINI_API_KEY ??
	process.env.GEMINI_API_KEY ??
	DEFAULT_APP_API_KEY ??
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
		throw new Error('Gemini API key is not configured for this app.');
	}

	const url = `${GEMINI_CHAT_URL}/${model}:generateContent?key=${encodeURIComponent(
		apiKey
	)}`;

	const payload = buildGeminiPayload(messages);

	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(payload),
	});

	const json = await response.json().catch(() => null);

	if (!response.ok) {
		const message =
			(json as { error?: { message?: string } })?.error?.message ??
			'Gemini request failed.';
		throw new Error(message);
	}

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
		throw new Error('Gemini did not return a response.');
	}

	return text;
}
