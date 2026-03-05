import { useQuery, useMutation } from '@tanstack/react-query';
import {
    hostQuiz,
    getLiveQuizDetails,
    startLiveQuiz,
    showAnswer,
    showLeaderboard,
    nextQuestion,
    finishLiveQuiz,
    getLiveQuizResults,
    checkPinInfo,
    joinLiveQuiz,
    submitLiveAnswer,
    getLiveQuizState,
    getLiveQuizPlayers
} from '@/services/liveQuizApi';
import type { LiveQuizJoinRequest, LiveQuizSubmitRequest } from '@/types/live-quiz';

// ==================== Host (Teacher) Hooks ====================

export const useHostLiveQuiz = () => {
    return useMutation({
        mutationFn: (quizId: string) => hostQuiz(quizId),
    });
};

export const useLiveQuizDetails = (pin?: string) => {
    return useQuery({
        queryKey: ['live-quiz-details', pin],
        queryFn: () => getLiveQuizDetails(pin!),
        enabled: !!pin,
    });
};

export const useStartLiveQuiz = () => {
    return useMutation({
        mutationFn: (pin: string) => startLiveQuiz(pin),
    });
};

export const useShowLiveAnswer = () => {
    return useMutation({
        mutationFn: ({ pin, questionId }: { pin: string; questionId: string }) => showAnswer(pin, questionId),
    });
};

export const useShowLiveLeaderboard = () => {
    return useMutation({
        mutationFn: (pin: string) => showLeaderboard(pin),
    });
};

export const useNextLiveQuestion = () => {
    return useMutation({
        mutationFn: ({ pin, questionId }: { pin: string; questionId: string }) => nextQuestion(pin, questionId),
    });
};

export const useFinishLiveQuiz = () => {
    return useMutation({
        mutationFn: (pin: string) => finishLiveQuiz(pin),
    });
};

export const useLiveQuizResults = (pin?: string) => {
    return useQuery({
        queryKey: ['live-quiz-results', pin],
        queryFn: () => getLiveQuizResults(pin!),
        enabled: !!pin,
    });
};

// ==================== Player (Student) Hooks ====================

export const useCheckPinInfo = () => {
    return useMutation({
        mutationFn: (pin: string) => checkPinInfo(pin),
    });
};

export const useJoinLiveQuiz = () => {
    return useMutation({
        mutationFn: (data: LiveQuizJoinRequest) => joinLiveQuiz(data),
    });
};

export const useSubmitLiveAnswer = () => {
    return useMutation({
        mutationFn: ({ pin, data }: { pin: string; data: LiveQuizSubmitRequest }) => submitLiveAnswer(pin, data),
    });
};

// ==================== General Hooks ====================

export const useLiveQuizState = (pin?: string, enabled: boolean = false, refetchInterval: number | false | ((query: any) => number | false) = false) => {
    return useQuery({
        queryKey: ['live-quiz-state', pin],
        queryFn: () => getLiveQuizState(pin!),
        enabled: !!pin && enabled,
        refetchInterval,
    });
};

export const useLiveQuizPlayers = (pin?: string, enabled: boolean = false) => {
    return useQuery({
        queryKey: ['live-quiz-players', pin],
        queryFn: () => getLiveQuizPlayers(pin!),
        enabled: !!pin && enabled,
    });
};
