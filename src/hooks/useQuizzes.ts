import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
    createQuiz, 
    getTeacherQuizzes,
    publishQuiz,
    generateQuizCode,
    getQuizStatistics,
    startQuiz, 
    submitQuiz, 
    saveQuizProgress, 
    getQuizHistory, 
    getQuizAttempt,
    getMyOngoingQuizzes,
    checkPracticeAnswer,
    reviewAttempt,
    joinQuizByCode,
    getStudentTeacherQuizzes,
    getQuizById,
    updateQuiz,
    getQuizByLessonItem
} from '../services/quizService';
import type { 
    CreateQuizRequest, 
    CheckPracticeAnswerRequest, 
    SubmitQuizRequest, 
    SaveProgressRequest, 
    UpdateQuizRequest,
} from '../types/quiz';

export const useCreateQuiz = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateQuizRequest) => createQuiz(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['teacher-quizzes'] });
        },
    });
};

export const useUpdateQuiz = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateQuizRequest }) => updateQuiz(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['teacher-quizzes'] });
            queryClient.invalidateQueries({ queryKey: ['quiz', variables.id] });
        },
    });
};

export const useQuiz = (id?: string) => {
    return useQuery({
        queryKey: ['quiz', id],
        queryFn: () => getQuizById(id!),
        enabled: !!id,
    });
};

export const useQuizByLessonItem = (lessonItemId?: string) => {
    return useQuery({
        queryKey: ['quiz', 'lesson-item', lessonItemId],
        queryFn: () => getQuizByLessonItem(lessonItemId!),
        enabled: !!lessonItemId,
        retry: false, // Don't retry if not found, it's expected for some items
    });
};

export const useTeacherQuizzes = () => {
    return useQuery({
        queryKey: ['teacher-quizzes'],
        queryFn: getTeacherQuizzes,
    });
};

export const usePublishQuiz = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (quizId: string) => publishQuiz(quizId),
        onSuccess: (_, quizId) => {
            queryClient.invalidateQueries({ queryKey: ['teacher-quizzes'] });
            queryClient.invalidateQueries({ queryKey: ['quiz', quizId] });
        },
    });
};

export const useGenerateQuizCode = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (quizId: string) => generateQuizCode(quizId),
        onSuccess: (_, quizId) => {
            queryClient.invalidateQueries({ queryKey: ['quiz', quizId] });
        },
    });
};

export const useQuizStatistics = (quizId?: string) => {
    return useQuery({
        queryKey: ['quiz-statistics', quizId],
        queryFn: () => getQuizStatistics(quizId!),
        enabled: !!quizId,
    });
};

// ==================== Student Quiz Hooks ====================

export const useStartQuiz = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (quizId: string) => startQuiz(quizId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ongoing-quizzes'] });
        },
    });
};

export const useSubmitQuiz = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: SubmitQuizRequest) => submitQuiz(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['quiz-history'] });
            queryClient.invalidateQueries({ queryKey: ['ongoing-quizzes'] });
            queryClient.invalidateQueries({ queryKey: ['student-teacher-quizzes'] });
        },
    });
};

export const useCheckPracticeAnswer = () => {
    return useMutation({
        mutationFn: (data: CheckPracticeAnswerRequest) => checkPracticeAnswer(data),
    });
};

export const useSaveQuizProgress = () => {
    return useMutation({
        mutationFn: (data: SaveProgressRequest) => saveQuizProgress(data),
    });
};

export const useQuizHistory = (quizId?: string) => {
    return useQuery({
        queryKey: ['quiz-history', quizId],
        queryFn: () => getQuizHistory(quizId!),
        enabled: !!quizId,
    });
};

export const useQuizAttempt = (attemptId?: string) => {
    return useQuery({
        queryKey: ['quiz-attempt', attemptId],
        queryFn: () => getQuizAttempt(attemptId!),
        enabled: !!attemptId,
    });
};

export const useMyOngoingQuizzes = () => {
    return useQuery({
        queryKey: ['ongoing-quizzes'],
        queryFn: getMyOngoingQuizzes,
    });
};

export const useQuizReview = (attemptId?: string) => {
    return useQuery({
        queryKey: ['quiz-review', attemptId],
        queryFn: () => reviewAttempt(attemptId!),
        enabled: !!attemptId,
    });
};

export const useJoinQuizByCode = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ code, joinClass }: { code: string; joinClass: boolean }) => joinQuizByCode(code, joinClass),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ongoing-quizzes'] });
            queryClient.invalidateQueries({ queryKey: ['student-teacher-quizzes'] });
        },
    });
};

export const useStudentTeacherQuizzes = () => {
    return useQuery({
        queryKey: ['student-teacher-quizzes'],
        queryFn: getStudentTeacherQuizzes,
    });
};
