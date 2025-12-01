export type ChatRole = 'user' | 'assistant' | 'system';

export type ChatMessage = {
	id: string;
	role: ChatRole;
	content: string;
};

export type ChatMessagePayload = Omit<ChatMessage, 'id'>;
