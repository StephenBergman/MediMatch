# Chat Feature

End-to-end chat experience for MediMatch, covering UI, state, and Gemini integration. Use `ChatExperience` as the ready-made screen.

## Structure
- `components/ChatExperience/ChatExperience.tsx` — screen wrapper; renders header, message list, composer; wires `ChatProvider`.
- `components/ChatMessageList/ChatMessageList.tsx` — list with quick-start prompts and footer (typing + errors).
- `components/ChatComposer/ChatComposer.tsx` — message input, send action, helper copy.
- `components/ChatMessageBubble.tsx` — message bubble styling and status (sent/sending/failed).
- `components/ChatHeader/ChatHeader.tsx` — top bar with reset + metadata.
- `components/ChatErrorNotice/ChatErrorNotice.tsx` — friendly error card with retry/dismiss.
- `components/TypingIndicator/TypingIndicator.tsx` — assistant “typing” chip.
- `contexts/ChatContext.tsx` — React context exposing chat state/actions.
- `hooks/useChat.ts` — client-side orchestrator: validates input, manages messages, calls Gemini or mock, handles UX errors.
- `api/gemini.ts` — Gemini REST client + payload shaping.
- `data/mock-guidance.ts` — canned triage responses for demo/testing when mock mode is enabled.
- `data/quick-prompts.ts` — predefined chips shown above the list.
- `types.ts` — shared chat message/role types.

## Usage
```tsx
// Any screen component
import { ChatExperience } from '@/features/chat/components/ChatExperience/ChatExperience';

export default function ChatScreen() {
  return <ChatExperience />;
}
```
`ChatExperience` wraps children in `ChatProvider`, so no extra providers are required at the call site.

## Environment & configuration
- Gemini API key: set `EXPO_PUBLIC_GEMINI_API_KEY` (preferred) or `GEMINI_API_KEY`. Without a key, the hook surfaces a user-friendly error.
- Model: defaults to `gemini-3-pro-preview`. Override by passing `model` to `createChatCompletion` (if calling directly).
- Mock assistant: set `EXPO_PUBLIC_USE_MOCK_ASSISTANT=true` to bypass the API and return canned guidance from `data/mock-guidance.ts`.

## Behavior notes
- A system prompt enforces “triage-only” guidance—no diagnoses or treatment.
- Messages persist only in component state (no storage); `onReset` clears the conversation.
- Errors are normalized (`utils/ErrorHandling/...`), mapped to UX intents, and shown via `ChatErrorNotice` with retry support.
- The list auto-scrolls to the latest message and shows a typing indicator during requests.

## Extending
- Add/edit quick prompts: update `data/quick-prompts.ts`.
- Adjust mock responses: edit `data/mock-guidance.ts`.
- Customize assistant/system prompt: change `SYSTEM_PROMPT` in `hooks/useChat.ts`.
- Reuse state without the UI: consume `useChat` from `contexts/ChatContext` and render your own components.***
