// Types for Course Learning feature
// Designed to work with mock data now, ready for API integration later

// ==================== API Response Types ====================
// These match the backend API structure

export interface ApiCourse {
  id: string;
  name: string;
  description: string;
  published: boolean;
  active: boolean;
  schoolId: string;
  teacherId: string;
  teacherName: string;
  lessonCount: number;
  createdAt: string;
  updatedAt: string;
  // Extended fields (may come from API later)
  thumbnail?: string;
  progress?: number; // 0-100
}

export interface ApiLesson {
  id: string;
  title: string;
  orderIndex: number;
  courseId: string;
  // Extended fields (may come from API later or use mock)
  duration?: string;
  videoUrl?: string;
  description?: string;
  tags?: string[];
  attachments?: LessonAttachment[];
  isCompleted?: boolean;
  isLocked?: boolean;
}

export interface LessonAttachment {
  id: string;
  name: string;
  type: 'pdf' | 'code' | 'link' | 'other';
  url: string;
  size?: string;
}

// ==================== Quiz Types ====================

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  correctOptionId: string;
  explanation?: string;
}

export interface LessonQuiz {
  id: string;
  lessonId: string;
  title: string;
  questions: QuizQuestion[];
  passingScore: number; // percentage 0-100
  timeLimit?: number; // minutes
}

export interface QuizAttempt {
  questionId: string;
  selectedOptionId: string | null;
}

export interface QuizResult {
  quizId: string;
  lessonId: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number; // percentage
  passed: boolean;
  attempts: QuizAttempt[];
  completedAt: string;
}

// ==================== UI State Types ====================

export interface LessonProgress {
  lessonId: string;
  isCompleted: boolean;
  videoProgress: number; // seconds watched
  quizPassed: boolean;
  lastAccessedAt: string;
}

export interface CourseProgress {
  courseId: string;
  completedLessons: number;
  totalLessons: number;
  progressPercent: number;
  lessonProgress: Record<string, LessonProgress>;
}

// ==================== Component Props Types ====================

export type LessonStatus = 'completed' | 'current' | 'locked' | 'available';

export interface LessonListItem extends ApiLesson {
  status: LessonStatus;
}
