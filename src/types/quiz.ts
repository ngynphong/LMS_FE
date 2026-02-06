// ==================== Quiz Requests ====================

// Request format for creating/updating quiz
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
    durationInMinutes: number;
    passScore: number;
    maxAttempts: number;
    shuffleQuestions: boolean;
    isDynamic: boolean;
    type: "PRACTICE" | "QUIZ";
    closeTime?: string | null;
    showScoreAfterSubmit: boolean;
    showResultAfterSubmit: boolean;
    isPublished: boolean;
    dynamicConfigs?: DynamicConfig[];
    staticQuestions?: StaticQuestion[];
}

export interface UpdateQuizRequest extends CreateQuizRequest {}

// ==================== Quiz Detail Response ====================

// Response format from GET /quiz/{id} - different structure from request
export interface QuizDetailDynamicConfig {
    id: string;
    questionType: "SINGLE_CHOICE" | "MULTIPLE_CHOICE" | "TRUE_FALSE" | "TEXT";
    difficulty: "EASY" | "MEDIUM" | "HARD";
    quantity: number;
    pointsPerQuestion: number;
}

export interface QuizDetailStaticQuestion {
    id: string;
    content: string;
    explanation?: string;
    difficulty: "EASY" | "MEDIUM" | "HARD";
    type: "SINGLE_CHOICE" | "MULTIPLE_CHOICE" | "TRUE_FALSE" | "TEXT";
    defaultScore: number;
    lessonId?: string;
    lessonName?: string;
    answers: {
        id: string;
        content: string;
        correct: boolean;
    }[];
    active: boolean;
}

export interface QuizDetailResponse {
    id: string;
    title: string;
    description: string;
    type: "PRACTICE" | "QUIZ";
    isDynamic: boolean;
    durationInMinutes: number;
    totalQuestions: number;
    passScore: number;
    maxAttempts: number;
    closeTime?: string | null;
    showScoreAfterSubmit: boolean;
    showResultAfterSubmit: boolean;
    code?: string;
    isPublished: boolean;
    lessonItemId: string;
    dynamicConfigs: QuizDetailDynamicConfig[];
    staticQuestions: QuizDetailStaticQuestion[];
    createdAt: string;
    attemptsCount?: number;
}

export interface GenerateCodeResponse {
    code: string;
    // other fields if needed from the response example, but usually code is the main thing
    // The example showed full quiz details but the key is the code
}

export interface JoinQuizRequest {
    code: string;
    joinClass: boolean;
}

export interface JoinQuizResponse {
    id: string;
    title: string;
    // ... other fields from response
}

export interface CheckPracticeAnswerRequest {
    questionId: string;
    selectedAnswerIds: string[];
    textAnswer?: string;
}

export interface CheckPracticeAnswerResponse {
    explanation: string;
    correctAnswerIds: string[];
    correct: boolean;
}

// ==================== Quiz Responses ====================

export interface QuizSummary {
    id: string;
    title: string;
    isDynamic: boolean;
    durationInMinutes: number;
    totalQuestions: number;
    type: "PRACTICE" | "QUIZ";
    maxAttempts: number;
    passScore: number;
    code?: string;
    isPublished?: boolean;
    closeTime?: string;
    showScoreAfterSubmit?: boolean;
    showResultAfterSubmit?: boolean;
}

export interface TeacherQuizzesResponse {
    code: number;
    data: QuizSummary[];
}

export interface ApiOngoingQuiz {
    id: string; // attempt id
    quizId: string;
    quizTitle: string;
    durationInMinutes: number;
    startedAt: string;
    status: "IN_PROGRESS" | "COMPLETED" | "PASSED" | "FAILED";
    questions: QuizQuestionAttempt[];
}

export interface StudentTeacherQuiz {
    id: string;
    title: string;
    isDynamic: boolean;
    durationInMinutes: number;
    totalQuestions: number;
    closeTime?: string;
    type: "PRACTICE" | "QUIZ";
    maxAttempts: number;
    passScore: number;
    showScoreAfterSubmit: boolean;
    showResultAfterSubmit: boolean;
    code: string;
    isPublished: boolean;
    lessonItemId: string;
    attemptsCount: number; // Added field for tracking usage
}

export interface QuizStatistics {
    quizId: string;
    quizTitle: string;
    totalAttempts: number;
    passedCount: number;
    failedCount: number;
    averageScore: number;
    highestScore: number;
    lowestScore: number;
}

export interface AnswerDetail {
    id: string;
    content: string;
    correct: boolean;
}

export interface QuizQuestionReview {
    questionId: string;
    questionContent: string;
    questionType: string;
    selectedAnswers: AnswerDetail[];
    textAnswer?: string;
    correctAnswers: AnswerDetail[];
    explanation?: string;
    isCorrect: boolean;
    scoreEarned: number;
}

export interface QuizAttemptReview {
    attemptId: string;
    quizTitle: string;
    studentName: string;
    submittedAt: string;
    totalScore: number;
    isPassed: boolean;
    details: QuizQuestionReview[];
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
    selectedAnswerIds?: string[];
    textAnswer?: string;
}

export interface QuizStartResponse {
    id: string; // attemptId
    quizId: string;
    quizTitle: string;
    durationInMinutes: number;
    startedAt: string;
    type: "PRACTICE" | "QUIZ";
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
    totalScore: number;
    isPassed: boolean;
    startedAt: string;
    completedAt: string;
    status: string;
}
