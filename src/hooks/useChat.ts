import { useState, useCallback } from 'react';
import { sendChatMessageApi } from '../services/chatService';
import type { ChatMessage } from '../types/chat';

// Generate unique ID for messages
const generateId = () => `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const useChat = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: 'welcome',
            content: 'Xin chào! Tôi là trợ lý AI của bạn. Tôi có thể giúp gì cho bạn về các khóa học và bài học hôm nay?',
            sender: 'ai',
            timestamp: new Date(),
        }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const sendMessage = useCallback(async (content: string) => {
        if (!content.trim()) return;

        // Add user message immediately
        const userMessage: ChatMessage = {
            id: generateId(),
            content: content.trim(),
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);
        setError(null);

        try {
            const aiResponse = await sendChatMessageApi(content.trim());
            
            const aiMessage: ChatMessage = {
                id: generateId(),
                content: aiResponse,
                sender: 'ai',
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Đã xảy ra lỗi. Vui lòng thử lại.';
            setError(errorMessage);
            
            // Add error message as AI response
            const errorAiMessage: ChatMessage = {
                id: generateId(),
                content: `⚠️ ${errorMessage}`,
                sender: 'ai',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorAiMessage]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const clearMessages = useCallback(() => {
        setMessages([
            {
                id: 'welcome',
                content: 'Xin chào! Tôi là trợ lý AI của bạn. Tôi có thể giúp gì cho bạn về các khóa học và bài học hôm nay?',
                sender: 'ai',
                timestamp: new Date(),
            }
        ]);
        setError(null);
    }, []);

    return {
        messages,
        isLoading,
        error,
        sendMessage,
        clearMessages,
    };
};
