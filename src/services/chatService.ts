import axiosInstance from "../config/axios";
import type { ChatResponse } from "../types/chat";
import axios from "axios";

// Helper function to handle API errors
const handleApiError = (error: unknown, defaultMessage: string): never => {
    if (axios.isAxiosError(error) && error.response?.data) {
        const { message, error: errorMsg } = error.response.data;
        throw new Error(message || errorMsg || defaultMessage);
    }
    if (error instanceof Error) throw error;
    throw new Error(defaultMessage);
};

/**
 * Send a chat message to the AI chatbot API
 * @param message - The user's message
 * @returns The AI response string
 */
export const sendChatMessageApi = async (message: string): Promise<string> => {
    try {
        const response = await axiosInstance.post<ChatResponse>('/chat', message, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data.data || response.data as unknown as string;
    } catch (error) {
        return handleApiError(error, 'Không thể gửi tin nhắn. Vui lòng thử lại.');
    }
};
