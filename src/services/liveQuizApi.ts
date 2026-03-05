import axiosInstance, { publicAxios } from "@/config/axios";
import type {
    LiveQuizHostResponse,
    LiveQuizDetails,
    LiveQuizJoinRequest,
    LiveQuizJoinResponse,
    LiveQuizSubmitRequest,
    LiveQuizSubmitResponse,
    LiveQuizStateResponse,
    LiveQuizPlayer,
    LiveQuizResult
} from "@/types/live-quiz";

const BASE_URL = '/live-quiz';

// ==================== Host (Teacher) APIs ====================

export const hostQuiz = async (quizId: string): Promise<LiveQuizHostResponse> => {
    const response = await axiosInstance.post<{ code: number; message: string; data: LiveQuizHostResponse }>(`${BASE_URL}/host/${quizId}`);
    return response.data.data;
};

export const getLiveQuizDetails = async (pin: string): Promise<LiveQuizDetails> => {
    const response = await axiosInstance.get<{ code: number; message: string; data: LiveQuizDetails }>(`${BASE_URL}/${pin}/details`);
    return response.data.data;
};

export const startLiveQuiz = async (pin: string): Promise<void> => {
    await axiosInstance.post<{ code: number; message: string }>(`${BASE_URL}/${pin}/start`);
};

export const showAnswer = async (pin: string, questionId: string): Promise<void> => {
    await axiosInstance.post<{ code: number; message: string }>(`${BASE_URL}/${pin}/show-answer/${questionId}`);
};

export const showLeaderboard = async (pin: string): Promise<void> => {
    await axiosInstance.post<{ code: number; message: string }>(`${BASE_URL}/${pin}/show-leaderboard`);
};

export const nextQuestion = async (pin: string, questionId: string): Promise<void> => {
    await axiosInstance.post<{ code: number; message: string }>(`${BASE_URL}/${pin}/next-question/${questionId}`);
};

export const finishLiveQuiz = async (pin: string): Promise<void> => {
    await axiosInstance.post<{ code: number; message: string }>(`${BASE_URL}/${pin}/finish`);
};

export const getLiveQuizResults = async (pin: string): Promise<LiveQuizResult[]> => {
    const response = await axiosInstance.get<{ code: number; message: string; data: LiveQuizResult[] }>(`${BASE_URL}/${pin}/results`);
    return response.data.data;
};


// ==================== Player (Student) APIs ====================

export const checkPinInfo = async (pin: string): Promise<{ valid: boolean }> => {
    const response = await publicAxios.get<{ code: number; message: string; data: { valid: boolean } }>(`${BASE_URL}/${pin}/check`);
    return response.data.data;
};

export const joinLiveQuiz = async (data: LiveQuizJoinRequest): Promise<LiveQuizJoinResponse> => {
    const response = await publicAxios.post<{ code: number; message: string; data: LiveQuizJoinResponse }>(`${BASE_URL}/join`, data);
    return response.data.data;
};

export const submitLiveAnswer = async (pin: string, data: LiveQuizSubmitRequest): Promise<LiveQuizSubmitResponse> => {
    const response = await publicAxios.post<{ code: number; message: string; data: LiveQuizSubmitResponse }>(`${BASE_URL}/${pin}/submit`, data);
    return response.data.data;
};

// ==================== General APIs ====================

export const getLiveQuizState = async (pin: string): Promise<LiveQuizStateResponse> => {
    const response = await publicAxios.get<{ code: number; message: string; data: LiveQuizStateResponse }>(`${BASE_URL}/${pin}/state`);
    return response.data.data;
};

export const getLiveQuizPlayers = async (pin: string): Promise<LiveQuizPlayer[]> => {
    const response = await publicAxios.get<{ code: number; message: string; data: LiveQuizPlayer[] }>(`${BASE_URL}/${pin}/players`);
    return response.data.data;
};
