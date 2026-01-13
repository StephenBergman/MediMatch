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
				"I've provided a recommendation above. Would you like to be routed to the nearest suggested care facility?",
		},
		{
			message:
				"Based on your symptoms, I've outlined a care setting recommendation. Want directions to the nearest suggested care facility or do you have more questions?",
		},
		{
			message:
				'That covers the triage guidance for your situation. Should I route you to the nearest suggested care facility?',
		},
		{
			message:
				"I've shared my recommendation. Would you like directions to the nearest suggested care facility?",
		},
	];

	const variationIndex = assistantMessageCount % variations.length;
	const selectedVariation = variations[variationIndex];

	return {
		message: selectedVariation.message,
		actions: [
			{
				id: 'answered',
				label: 'No, thank you',
				description: 'I do not need anything else right now',
			},
			{
				id: 'more_questions',
				label: 'I have more questions',
				description: 'I would like to clarify or ask follow-ups',
			},
			{
				id: 'find_facility',
				label: 'Yes, route me',
				description: 'Open the map with directions to the nearest care option',
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
