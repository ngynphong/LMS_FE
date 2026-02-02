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
