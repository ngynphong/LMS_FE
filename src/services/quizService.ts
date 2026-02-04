// ... imports
import axiosInstance from '../config/axios';
import type { 
    CreateQuizRequest, 
    QuizSummary, 
    ApiOngoingQuiz, 
    CheckPracticeAnswerRequest, 
    CheckPracticeAnswerResponse,
    QuizAttemptReview,
    QuizStatistics,
    GenerateCodeResponse,
    JoinQuizResponse,

    StudentTeacherQuiz,
    UpdateQuizRequest,
    QuizDetailResponse
} from '../types/quiz';

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

export const publishQuiz = async (quizId: string): Promise<void> => {
    try {
        await axiosInstance.put(`/quiz/${quizId}/publish`);
    } catch (error) {
        console.error('Failed to publish quiz:', error);
        throw error;
    }
};

export const generateQuizCode = async (quizId: string): Promise<GenerateCodeResponse> => {
    try {
        const response = await axiosInstance.put<{ code: number; message: string; data: GenerateCodeResponse }>(`/quiz/${quizId}/generate-code`);
        return response.data.data;
    } catch (error) {
        console.error('Failed to generate quiz code:', error);
        throw error;
    }
}

export const getQuizStatistics = async (quizId: string): Promise<QuizStatistics> => {
    try {
        const response = await axiosInstance.get<{ code: number; message: string; data: QuizStatistics }>(`/quiz/${quizId}/statistics`);
        return response.data.data;
    } catch (error) {
        console.error('Failed to get quiz statistics:', error);
        throw error;
    }
}

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

export const getMyOngoingQuizzes = async (): Promise<ApiOngoingQuiz[]> => {
    try {
        const response = await axiosInstance.get<{ code: number; message: string; data: ApiOngoingQuiz[] }>('/quiz/my-ongoing');
        return response.data.data;
    } catch (error) {
        console.error('Failed to fetch ongoing quizzes:', error);
        throw error;
    }
};

export const checkPracticeAnswer = async (data: CheckPracticeAnswerRequest): Promise<CheckPracticeAnswerResponse> => {
    try {
        const response = await axiosInstance.post<{ code: number; message: string; data: CheckPracticeAnswerResponse }>('/quiz/practice/check-answer', data);
        return response.data.data;
    } catch (error) {
        console.error('Failed to check practice answer:', error);
        throw error;
    }
};

export const reviewAttempt = async (attemptId: string): Promise<QuizAttemptReview> => {
    try {
        const response = await axiosInstance.get<{ code: number; message: string; data: QuizAttemptReview }>(`/quiz/attempts/${attemptId}/review`);
        return response.data.data;
    } catch (error) {
        console.error('Failed to review attempt:', error);
        throw error;
    }
};

export const joinQuizByCode = async (code: string, joinClass: boolean): Promise<JoinQuizResponse> => {
    try {
        // According to image: POST /quiz/join-by-code?code=...&joinClass=...
        const response = await axiosInstance.post<{ code: number; message: string; data: JoinQuizResponse }>(`/quiz/join-by-code`, null, {
            params: { code, joinClass }
        });
        return response.data.data;
    } catch (error) {
        console.error('Failed to join quiz by code:', error);
        throw error;
    }
}

export const getStudentTeacherQuizzes = async (): Promise<StudentTeacherQuiz[]> => {
    try {
        const response = await axiosInstance.get<{ code: number; message: string; data: StudentTeacherQuiz[] }>('/quiz/student/teacher-quizzes');
        return response.data.data;
    } catch (error) {
        console.error('Failed to fetch student teacher quizzes:', error);
        throw error;
    }
}

export const updateQuiz = async (id: string, data: UpdateQuizRequest): Promise<void> => {
    try {
        await axiosInstance.put(`/quiz/${id}`, data);
    } catch (error) {
        console.error('Failed to update quiz:', error);
        throw error;
    }
};

export const getQuizById = async (id: string): Promise<QuizDetailResponse> => {
    try {
        const response = await axiosInstance.get<{ code: number; message: string; data: QuizDetailResponse }>(`/quiz/${id}`);
        return response.data.data;
    } catch (error) {
        console.error('Failed to fetch quiz details:', error);
        throw error;
    }
};

export const getQuizByLessonItem = async (lessonItemId: string): Promise<QuizDetailResponse[]> => {
    try {
        const response = await axiosInstance.get<{ code: number; message: string; data: QuizDetailResponse[] }>(`/quiz/by-lesson-item/${lessonItemId}`);
        return response.data.data;
    } catch (error) {
        console.error('Failed to fetch quiz by lesson item:', error);
        throw error;
    }
};
