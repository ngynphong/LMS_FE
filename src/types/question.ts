export interface QuestionAnswer {
    id: string;
    content: string;
    correct: boolean;
}

export type QuestionDifficulty = 'EASY' | 'MEDIUM' | 'HARD';
export type QuestionType = 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE';

export interface Question {
    id: string;
    content: string;
    explanation?: string;
    difficulty: QuestionDifficulty;
    type: QuestionType;
    defaultScore: number;
    lessonId: string;
    lessonName?: string;
    answers: QuestionAnswer[];
    active: boolean;
}

export interface CreateQuestionRequest {
    content: string;
    explanation?: string;
    difficulty: QuestionDifficulty;
    type: QuestionType;
    defaultScore: number;
    lessonId?: string; // Optional based on screenshot "Có thể gắn hoặc không gắn vào Lesson"
    answers: Omit<QuestionAnswer, 'id'>[];
}

export interface UpdateQuestionRequest extends CreateQuestionRequest {
    // Usually updates include the same fields
}

export interface QuestionImportResponse {
    row: number;
    email: string;
    reason: string;
}

export interface ImportQuestionResult {
    total: number;
    success: number;
    failed: number;
    duplicate: number;
    duplicateRows: QuestionImportResponse[];
    errors: QuestionImportResponse[];
}

export interface QuestionListResponse {
    pageNo: number;
    pageSize: number;
    totalPage: number;
    totalElement: number;
    sortBy: string | null;
    items: Question[];
}

export interface GetQuestionsParams {
    pageNo?: number;
    pageSize?: number;
    content?: string;
    difficulty?: string;
    lessonId?: string;
    type?: string;
}
