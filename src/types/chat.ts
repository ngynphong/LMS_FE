// Types for AI Chatbot

export interface ChatMessage {
    id: string;
    content: string;
    sender: 'user' | 'ai';
    timestamp: Date;
}

export interface ChatRequest {
    message: string;
}

export interface ChatResponse {
    code: number;
    message: string;
    data: string;
}
