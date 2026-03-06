import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { 
    getQuestions, 
    createQuestion, 
    updateQuestion, 
    deleteQuestion, 
    importQuestions, 
    getQuestionTemplate,
    getMyQuestions,
    getMyLessonNames
} from '@/services/questionService';
import type { 
    // Question, 
    CreateQuestionRequest, 
    UpdateQuestionRequest,
    // ImportQuestionResult,
    GetQuestionsParams,
    GetMyQuestionsParams
} from '@/types/question';

export const useQuestions = (params?: GetQuestionsParams) => {
    return useQuery({
        queryKey: ['questions', params],
        queryFn: () => getQuestions(params),
        placeholderData: keepPreviousData,
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

export const useMyQuestions = (params?: GetMyQuestionsParams) => {
    return useQuery({
        queryKey: ['my-questions', params],
        queryFn: () => getMyQuestions(params),
        placeholderData: keepPreviousData,
    });
};

export const useMyLessonNames = () => {
    return useQuery({
        queryKey: ['my-lesson-names'],
        queryFn: () => getMyLessonNames(),
    });
};
