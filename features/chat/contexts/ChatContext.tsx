import React, { createContext, useContext, type PropsWithChildren } from 'react';

import { useChat } from '@/features/chat/hooks/useChat';

type ChatContextValue = ReturnType<typeof useChat>;

const ChatContext = createContext<ChatContextValue | null>(null);

/**Provides chat state/actions to the subtree via React context. */
export function ChatProvider({ children }: PropsWithChildren) {
    const value = useChat();
    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

/ Hook to consume chat state; throws if used outside ChatProvider. */
export function useChatContext(): ChatContextValue {
    const ctx = useContext(ChatContext);
    if (!ctx) {
        throw new Error('useChatContext must be used inside a ChatProvider');
    }
    return ctx;
}