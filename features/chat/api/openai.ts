import { ChatMessagePayload } from '@/features/chat/types';

const OPENAI_CHAT_URL = 'https://api.openai.com/v1/chat/completions';
const DEFAULT_MODEL = 'gpt-4o-mini';

const appOpenAiKey =
	process.env.EXPO_PUBLIC_OPENAI_API_KEY ??
	process.env.OPENAI_API_KEY ??
	undefined;

export function getOpenAiApiKey() {
	return appOpenAiKey?.trim() ?? '';
}

type CreateChatCompletionParams = {
	messages: ChatMessagePayload[];
	model?: string;
	apiKeyOverride?: string;
};

export async function createChatCompletion({
	messages,
	model = DEFAULT_MODEL,
	apiKeyOverride,
}: CreateChatCompletionParams): Promise<string> {
	const apiKey = (apiKeyOverride ?? getOpenAiApiKey()).trim();

	if (!apiKey) {
		throw new Error('OpenAI API key is not configured for this app.');
	}

	const response = await fetch(OPENAI_CHAT_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKey}`,
		},
		body: JSON.stringify({
			model,
			messages,
		}),
	});

	const json = await response.json().catch(() => null);

	if (!response.ok) {
		const message =
			(json as { error?: { message?: string } })?.error?.message ??
			'OpenAI request failed.';
		throw new Error(message);
	}

	const content = (
		json as {
			choices?: { message?: { content?: string } }[];
		}
	)?.choices?.[0]?.message?.content;

	if (!content) {
		throw new Error('OpenAI did not return a response.');
	}

	return content.trim();
}
