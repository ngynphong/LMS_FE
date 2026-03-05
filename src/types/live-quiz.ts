export interface LiveQuizJoinRequest {
    pin: string;
    studentName: string;
}

export interface LiveQuizJoinResponse {
    playerId: string;
    studentName: string;
    pin: string;
}

export interface LiveQuizHostResponse {
    pin: string;
    quizId: string;
    quizTitle: string;
}

export interface LiveAnswer {
    id: string;
    content: string;
}

export interface LiveQuestion {
    id: string;
    content: string;
    type: "SINGLE_CHOICE" | "MULTIPLE_CHOICE" | "TRUE_FALSE";
    timeLimitSeconds: number;
    answers: LiveAnswer[];
}

export interface LiveQuizDetails {
    quizId: string;
    title: string;
    description: string;
    timeLimitPerQuestion: number;
    questions: LiveQuestion[];
}

export interface LiveQuizSubmitRequest {
    playerId: string;
    questionId: string;
    answerId: string;
    timeTakenMs: number;
}

export interface LiveQuizSubmitResponse {
    correct: boolean;
    scoreEarned: number;
    totalScore: number;
    timeTakenMs: number;
}

export interface LiveQuizStateResponse {
    pin: string;
    state: "WAITING" | "IN_PROGRESS" | "FINISHED";
    currentQuestion: LiveQuestion | null;
    totalPlayers: number;
}

export interface LiveQuizPlayer {
    playerId: string;
    playerName: string;
}

export interface LiveQuizResult {
    id: string;
    quizId: string;
    roomPin: string;
    playerId: string;
    playerName: string;
    totalScore: number;
    rankPosition: number;
    createdAt: string;
}

export interface LiveQuizLeaderboardItem {
    rank: number;
    studentId: string;
    studentName: string;
    score: number;
}

// WebSocket Event Data Types
export interface WsPlayerJoinedData {
    studentId: string;
    studentName: string;
    totalPlayers: number;
}

export interface WsPlayerJoinedEvent {
    type: "PLAYER_JOINED";
    data: WsPlayerJoinedData;
}

export interface WsStartGameData {
    type: "START_GAME";
    data: LiveQuestion;
}

export interface WsNextQuestionData {
    type: "NEXT_QUESTION";
    data: LiveQuestion;
}

export interface WsShowAnswerData {
    type: "SHOW_ANSWER";
    data: {
        questionId: string;
        correctAnswerIds: string[];
    };
}

export interface WsShowLeaderboardData {
    type: "SHOW_LEADERBOARD";
    data: null;
}

export interface WsFinishGameData {
    type: "FINISH_GAME";
    data: null;
}

export type WsPlayerEvent = 
    | WsStartGameData
    | WsNextQuestionData
    | WsShowAnswerData
    | WsShowLeaderboardData
    | WsFinishGameData;
