/** Supported roles for messages passed through the chat pipeline. */
export type ChatRole = 'user' | 'assistant' | 'system';

/** Interactive action option in a follow-up prompt. */
export type ChatMessageAction = {
	id: string;
	label: string;
	description?: string;
};

/** Shape stored in state and rendered in the UI. */
export type ChatMessage = {
	id: string;
	role: ChatRole;
	content: string;
	createdAt?: number;
	status?: 'sending' | 'sent' | 'failed';
	/** Optional follow-up prompt with interactive actions */
	followUp?: {
		message: string;
		actions: ChatMessageAction[];
	};
};

/** Minimal payload sent to the model (IDs are client-only). */
export type ChatMessagePayload = Omit<ChatMessage, 'id'>;
