# Chat Feature

Medical triage chatbot that helps users understand their symptoms and recommends appropriate care settings (ER, Urgent Care, Primary Care, or Self-care).

## Structure

```
chat/
  api/
    gemini.ts              # Gemini API integration for chat completions
  components/
    ChatComposer/          # Message input field with send button
    ChatErrorNotice/       # Error display component
    ChatExperience/        # Main chat screen layout
    ChatFollowUpPrompt/    # Follow-up prompt after triage
    ChatHeader/            # Chat header with reset button
    ChatMessageBubble.tsx  # Individual message display
    ChatMessageList/       # List of messages with typing indicator
  contexts/
    ChatContext.tsx        # React context for chat state
  data/
    mock-guidance.ts       # Mock assistant responses for testing
  hooks/
    useChat.ts             # Chat logic hook (messages, sending, errors)
  types.ts                 # TypeScript type definitions
  utils/
    followUpPrompt.ts      # Follow-up prompt generation logic
```

## Key Features

- **Gemini Integration**: Uses Google's Gemini API for triage recommendations
- **Mock Mode**: Can run with mock responses for testing via `EXPO_PUBLIC_USE_MOCK_ASSISTANT`
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Follow-Up Prompts**: Quick actions after recommendations to continue the conversation or route to care

## Usage

### ChatExperience Component

Main entry point for the chat feature:

```tsx
import { ChatExperience } from '@/features/chat/components/ChatExperience/ChatExperience';

export function ChatScreen() {
	return <ChatExperience />;
}
```

### useChat Hook

Direct access to chat logic:

```tsx
const {
	messages,
	sendMessage,
	isSending,
	isAssistantTyping,
	error,
	clearError,
	resetChat,
	handleFollowUpAction,
} = useChat();

// Send a message
await sendMessage({ content: 'I have chest pain' });

// Handle follow-up button clicks
handleFollowUpAction('find_facility', () => {
	router.push('/(protected)/(tabs)/map');
});
```

## API Integration

Requires `EXPO_PUBLIC_GEMINI_API_KEY` (or `GEMINI_API_KEY` locally) environment variable.

System prompt configures the assistant as a concise triage assistant that:

- Recommends appropriate care settings
- Does NOT provide medical advice or diagnoses
- Keeps responses brief and actionable

## Follow-Up Prompt System

After the assistant responds, a follow-up prompt automatically appears (configurable via `shouldShowFollowUp()` in `utils/followUpPrompt.ts`).

Users can select:

- **"No, thank you"** - Ends the thread politely and surfaces an end-chat prompt
- **"I have more questions"** - Continue the conversation
- **"Yes, route me"** - Navigate to facility search

When the user selects **"No, thank you"**, the assistant follows up with an end-chat prompt (Yes/No). Selecting **Yes** clears the chat after a brief fade-out animation.

## Adding New Components

When adding new chat components:

1. Create folder under `components/` with component name
2. Add TypeScript file(s) with the component
3. Export from `components/index.ts` (if using barrel export)
4. Update this README with component description
5. Add types to `types.ts` if needed

Example structure:

```
components/NewFeature/
  NewFeature.tsx
  NewFeature.styles.ts (if complex styling)
  index.ts (optional)
```
