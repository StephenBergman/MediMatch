/** Supported roles for messages passed through the chat pipeline. */
export type ChatRole = 'user' | 'assistant' | 'system';

/** Shape stored in state and rendered in the UI. */
export type ChatMessage = {
	id: string;
	role: ChatRole;
	content: string;
};

/** Minimal payload sent to the model (IDs are client-only). */
export type ChatMessagePayload = Omit<ChatMessage, 'id'>;
