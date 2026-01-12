/**
 * Follow-up prompt logic for elegantly guiding users after triage responses.
 * Generates contextual messages and interactive follow-up options.
 */

export type FollowUpAction = 'answered' | 'more_questions' | 'find_facility';

export type FollowUpPrompt = {
	/** Main follow-up message explaining what we did for them */
	message: string;
	/** Quick action buttons to offer the user */
	actions: FollowUpActionOption[];
	/** Metadata for tracking/analytics */
	context: {
		messageCount: number;
		lastAssistantMessage: string;
	};
};

export type FollowUpActionOption = {
	id: FollowUpAction;
	label: string;
	description: string;
};

/**
 * Determines if a follow-up prompt should be shown.
 * Generally after the first assistant message.
 */
export function shouldShowFollowUp(assistantMessageCount: number): boolean {
	return assistantMessageCount >= 0;
}

/**
 * Generates a contextual follow-up message based on conversation length.
 * Uses variation to feel natural across multiple exchanges.
 */
export function generateFollowUpMessage(
	assistantMessageCount: number,
	lastAssistantMessage: string
): FollowUpPrompt {
	const variations = [
		{
			message:
				"I've provided a recommendation above. Did I answer your question? Let me know if you'd like to explore further options or find a nearby facility.",
		},
		{
			message:
				"Based on your symptoms, I've outlined a care setting recommendation. Is this helpful? Feel free to ask follow-up questions or I can help you locate a facility.",
		},
		{
			message:
				'That covers the triage guidance for your situation. Is this helpful? You can ask more questions or request help finding a nearby care facility.',
		},
		{
			message:
				"I've shared my recommendation. Does this address your concern? You can ask more questions or request help finding a facility nearby.",
		},
	];

	const variationIndex = assistantMessageCount % variations.length;
	const selectedVariation = variations[variationIndex];

	return {
		message: selectedVariation.message,
		actions: [
			{
				id: 'answered',
				label: 'Yes, that helps',
				description: 'The recommendation answered my question',
			},
			{
				id: 'more_questions',
				label: 'I have more questions',
				description: 'I would like to clarify or ask follow-ups',
			},
			{
				id: 'find_facility',
				label: 'Find a facility',
				description: 'Help me locate nearby care options',
			},
		],
		context: {
			messageCount: assistantMessageCount,
			lastAssistantMessage,
		},
	};
}

/**
 * Handles user selection of a follow-up action.
 * Returns a system message or routing instruction.
 */
export function handleFollowUpAction(action: FollowUpAction): {
	type: 'message' | 'navigation' | 'modal';
	content: string;
} {
	const actionMap: Record<
		FollowUpAction,
		{ type: 'message' | 'navigation' | 'modal'; content: string }
	> = {
		answered: {
			type: 'message',
			content:
				"Great! I'm glad that was helpful. Feel free to chat again if you have new concerns or questions.",
		},
		more_questions: {
			type: 'message',
			content:
				"I'm here to help. Go ahead and ask your follow-up question, and I'll do my best to clarify.",
		},
		find_facility: {
			type: 'navigation',
			content: 'redirect_to_facility_search',
		},
	};

	return actionMap[action];
}
