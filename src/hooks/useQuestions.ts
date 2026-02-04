import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
    getQuestions, 
    createQuestion, 
    updateQuestion, 
    deleteQuestion, 
    importQuestions, 
    getQuestionTemplate 
} from '../services/questionService';
import type { 
    // Question, 
    CreateQuestionRequest, 
    UpdateQuestionRequest,
    // ImportQuestionResult,
    GetQuestionsParams
} from '../types/question';

export const useQuestions = (params?: GetQuestionsParams) => {
    return useQuery({
        queryKey: ['questions', params],
        queryFn: () => getQuestions(params),
    });
};

export const useCreateQuestion = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateQuestionRequest) => createQuestion(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['questions'] });
        },
    });
};

export const useUpdateQuestion = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateQuestionRequest }) => updateQuestion(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['questions'] });
        },
    });
};

export const useDeleteQuestion = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteQuestion(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['questions'] });
        },
    });
};

export const useImportQuestions = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ lessonId, file }: { lessonId: string | undefined; file: File }) => importQuestions(lessonId, file),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['questions'] });
        },
    });
};

export const useQuestionTemplate = () => {
    return useMutation({
        mutationFn: () => getQuestionTemplate(),
    });
};
