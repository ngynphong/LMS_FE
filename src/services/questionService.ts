import axiosInstance from '../config/axios';
import type { CreateQuestionRequest, ImportQuestionResult, Question, UpdateQuestionRequest, QuestionListResponse, GetQuestionsParams } from '../types/question';

// ==================== Question APIs ====================

export const getQuestions = async (params?: GetQuestionsParams): Promise<QuestionListResponse> => {
    try {
        const response = await axiosInstance.get<{ code: number; message: string; data: QuestionListResponse | Question[] }>('/questions', { params });
        const data = response.data?.data;
        
        // Handle paginated response { pageNo, pageSize, items: [], ... }
        if (data && 'items' in data && Array.isArray(data.items)) {
            return data as QuestionListResponse;
        }

        // Handle flat array response (fallback/legacy)
        if (Array.isArray(data)) {
            return {
                pageNo: 1,
                pageSize: data.length,
                totalPage: 1,
                totalElement: data.length,
                sortBy: null,
                items: data
            };
        }

        console.warn('Unexpected question API response structure:', response.data);
         return {
            pageNo: 1,
            pageSize: 0,
            totalPage: 0,
            totalElement: 0,
            sortBy: null,
            items: []
        };
    } catch (error) {
        console.error('Failed to fetch questions:', error);
        throw error;
    }
};

export const createQuestion = async (data: CreateQuestionRequest): Promise<Question> => {
    try {
        const response = await axiosInstance.post<{ code: number; message: string; data: Question }>('/questions', data);
        return response.data.data;
    } catch (error) {
        console.error('Failed to create question:', error);
        throw error;
    }
};

export const updateQuestion = async (id: string, data: UpdateQuestionRequest): Promise<Question> => {
    try {
        const response = await axiosInstance.put<{ code: number; message: string; data: Question }>(`/questions/${id}`, data);
        return response.data.data;
    } catch (error) {
        console.error('Failed to update question:', error);
        throw error;
    }
};

export const deleteQuestion = async (id: string): Promise<void> => {
    try {
        await axiosInstance.delete(`/questions/${id}`);
    } catch (error) {
        console.error('Failed to delete question:', error);
        throw error;
    }
};

export const importQuestions = async (lessonId: string | undefined, file: File): Promise<ImportQuestionResult> => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        
        // params: lessonId (query) - only if provided
        const params: any = {};
        if (lessonId) params.lessonId = lessonId;

        const response = await axiosInstance.post<{ code: number; message: string; data: ImportQuestionResult }>(
            `/questions/import`, 
            formData, 
            {
                params,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data.data;
    } catch (error) {
        console.error('Failed to import questions:', error);
        throw error;
    }
};

export const getQuestionTemplate = async (): Promise<Blob> => {
    try {
        const response = await axiosInstance.get('/questions/template', {
            responseType: 'blob'
        });
        return response.data;
    } catch (error) {
        console.error('Failed to get question template:', error);
        throw error;
    }
};
