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
    message: string;
    data: QuizSummary[];
}
