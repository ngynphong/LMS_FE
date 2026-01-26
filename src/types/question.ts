export type QuestionDifficulty = 'easy' | 'medium' | 'hard';
export type QuestionType = 'multiple_choice' | 'essay';

export interface Question {
  id: string;
  content: string;
  topic: string;
  difficulty: QuestionDifficulty;
  type: QuestionType;
  createdAt: string;
  options?: string[];
  correctAnswer?: string;
}
