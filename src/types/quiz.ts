export interface DynamicConfig {
    targetLessonId: string;
    difficulty: "EASY" | "MEDIUM" | "HARD";
    quantity: number;
    scorePerQuestion: number;
}

export interface StaticQuestion {
    questionId: string;
    score: number;
    order: number;
}

export interface CreateQuizRequest {
    title: string;
    description: string;
    lessonItemId: string;
    courseId: string;
    durationInMinutes: number;
    passScore: number;
    maxAttempts: number;
    shuffleQuestions: boolean;
    isDynamic: boolean;
    dynamicConfigs?: DynamicConfig[];
    staticQuestions?: StaticQuestion[];
}

export interface QuizSummary {
    id: string;
    title: string;
    isDynamic: boolean;
    durationInMinutes: number;
    totalQuestions: number;
}

export interface TeacherQuizzesResponse {
    code: number;
    data: QuizSummary[];
}

// ==================== Student Quiz Types ====================

export interface QuizAnswer {
    id: string;
    content: string;
}

export interface QuizQuestionAttempt {
    id: string;
    content: string;
    type: "SINGLE_CHOICE" | "MULTIPLE_CHOICE" | "TRUE_FALSE" | "TEXT";
    answers: QuizAnswer[];
}

export interface QuizStartResponse {
    id: string; // attemptId
    quizId: string;
    quizTitle: string;
    durationInMinutes: number;
    startedAt: string;
    status: "IN_PROGRESS" | "COMPLETED" | "PASSED" | "FAILED";
    questions: QuizQuestionAttempt[];
}

export interface SubmitAnswer {
    questionId: string;
    selectedAnswerIds: string[];
    textAnswer?: string;
}

export interface SubmitQuizRequest {
    attemptId: string;
    answers: SubmitAnswer[];
}

export interface SaveProgressRequest {
    attemptId: string;
    answers: SubmitAnswer[];
}

export interface QuizHistoryItem {
    id: string;
    totalScore: number;
    isPassed: boolean;
    startedAt: string;
    completedAt: string;
    status: "IN_PROGRESS" | "COMPLETED" | "PASSED" | "FAILED";
}

export interface QuizAttemptDetailResponse {
    id: string;
    quizId: string;
    // Add other fields as needed, seemingly similar to HistoryItem or StartResponse depending on state
    totalScore: number;
    isPassed: boolean;
    startedAt: string;
    completedAt: string;
    status: string;
    // questions? user answers? The screenshot was brief.
}
