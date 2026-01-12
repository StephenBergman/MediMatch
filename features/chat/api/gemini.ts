import type { ChatMessagePayload } from '@/features/chat/types';

type GeminiPart = {
	text: string;
};

type GeminiContent = {
	role: 'user' | 'model';
	parts: GeminiPart[];
};

type GeminiErrorResponse = {
	error?: {
		message?: string;
		status?: string;
		code?: number;
	};
};

type GeminiResponse = GeminiErrorResponse & {
	candidates?: Array<{
		content?: {
			parts?: GeminiPart[];
		};
	}>;
};

export type CreateChatCompletionParams = {
	messages: ChatMessagePayload[];
	apiKey?: string;
	model?: string;
	temperature?: number;
};

const DEFAULT_MODEL = 'gemini-3-pro-preview';
const GEMINI_ENDPOINT =
	'https://generativelanguage.googleapis.com/v1beta/models';

export function getGeminiApiKey() {
	const key =
		process.env.EXPO_PUBLIC_GEMINI_API_KEY ?? process.env.GEMINI_API_KEY;
	return key && key.trim().length > 0 ? key.trim() : undefined;
}

const buildSystemInstruction = (messages: ChatMessagePayload[]) => {
	const systemMessages = messages.filter((message) => message.role === 'system');
	if (!systemMessages.length) return undefined;
	return {
		parts: [
			{
				text: systemMessages.map((message) => message.content).join('\n'),
			},
		],
	};
};

const toGeminiContents = (messages: ChatMessagePayload[]): GeminiContent[] =>
	messages
		.filter((message) => message.role !== 'system')
		.map((message) => ({
			role: message.role === 'assistant' ? 'model' : 'user',
			parts: [{ text: message.content }],
		}));

/** Call Gemini to generate a single response string. */
export async function createChatCompletion({
	messages,
	apiKey,
	model = DEFAULT_MODEL,
	temperature,
}: CreateChatCompletionParams): Promise<string> {
	const resolvedKey = apiKey ?? getGeminiApiKey();
	if (!resolvedKey) {
		throw new Error('Gemini API key is not configured.');
	}

	const systemInstruction = buildSystemInstruction(messages);
	const contents = toGeminiContents(messages);
	if (!contents.length) {
		throw new Error('No chat messages provided.');
	}

	const body: Record<string, unknown> = {
		contents,
	};
	if (systemInstruction) {
		body.systemInstruction = systemInstruction;
	}
	if (typeof temperature === 'number') {
		body.generationConfig = { temperature };
	}

	const response = await fetch(
		`${GEMINI_ENDPOINT}/${model}:generateContent?key=${resolvedKey}`,
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body),
		},
	);

	const payload = (await response
		.json()
		.catch(() => null)) as GeminiResponse | null;

	if (!response.ok) {
		const message =
			payload?.error?.message ||
			`Gemini request failed (${response.status})`;
		const error = new Error(message);
		(error as { status?: number }).status = response.status;
		throw error;
	}

	const text = payload?.candidates?.[0]?.content?.parts
		?.map((part) => part.text ?? '')
		.join('')
		.trim();

	if (!text) {
		throw new Error('Gemini returned an empty response.');
	}

	return text;
}
