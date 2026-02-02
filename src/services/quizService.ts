import axiosInstance from '../config/axios';
import type { CreateQuizRequest, QuizSummary } from '../types/quiz';

// ==================== Quiz APIs ====================

export const createQuiz = async (data: CreateQuizRequest): Promise<void> => {
    try {
        await axiosInstance.post('/quiz', data);
    } catch (error) {
        console.error('Failed to create quiz:', error);
        throw error;
    }
};

export const getTeacherQuizzes = async (): Promise<QuizSummary[]> => {
    try {
        const response = await axiosInstance.get<{ code: number; message: string; data: QuizSummary[] }>('/quiz/teacher/me');
        return response.data.data;
    } catch (error) {
        console.error('Failed to fetch teacher quizzes:', error);
        throw error;
    }
};
// ==================== Student Quiz APIs ====================
import type { 
    QuizStartResponse, 
    SubmitQuizRequest, 
    SaveProgressRequest, 
    QuizHistoryItem, 
    QuizAttemptDetailResponse
} from '../types/quiz';

export const startQuiz = async (quizId: string): Promise<QuizStartResponse> => {
    try {
        const response = await axiosInstance.post<{ code: number; message: string; data: QuizStartResponse }>(`/quiz/${quizId}/start`);
        return response.data.data;
    } catch (error) {
        console.error('Failed to start quiz:', error);
        throw error;
    }
};

export const submitQuiz = async (data: SubmitQuizRequest): Promise<QuizHistoryItem> => {
    try {
        const response = await axiosInstance.post<{ code: number; message: string; data: QuizHistoryItem }>('/quiz/submit', data);
        return response.data.data;
    } catch (error) {
        console.error('Failed to submit quiz:', error);
        throw error;
    }
};

export const saveQuizProgress = async (data: SaveProgressRequest): Promise<void> => {
    try {
        await axiosInstance.post('/quiz/save-progress', data);
    } catch (error) {
        console.error('Failed to save quiz progress:', error);
        throw error;
    }
};

export const getQuizHistory = async (quizId: string): Promise<QuizHistoryItem[]> => {
    try {
        const response = await axiosInstance.get<{ code: number; message: string; data: QuizHistoryItem[] }>(`/quiz/${quizId}/history`);
        return response.data.data;
    } catch (error) {
        console.error('Failed to fetch quiz history:', error);
        throw error;
    }
};

export const getQuizAttempt = async (attemptId: string): Promise<QuizAttemptDetailResponse> => {
    try {
        const response = await axiosInstance.get<{ code: number; message: string; data: QuizAttemptDetailResponse }>(`/quiz/attempts/${attemptId}`);
        return response.data.data;
    } catch (error) {
        console.error('Failed to fetch quiz attempt:', error);
        throw error;
    }
};
