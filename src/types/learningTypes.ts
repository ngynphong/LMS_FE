// Types for Course Learning feature
// Designed to work with mock data now, ready for API integration later

// ==================== API Response Types ====================
// These match the backend API structure

export interface EnrollCourseRequest {
  enrollmentCode: string;
}

export interface CreateInviteCodeRequest {
  expirationInMinutes: number;
}

export interface ApiTeacher {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  imgUrl?: string | null;
  dob?: string;
  roles: string[];
}

export interface ApiCourse {
  id: string;
  name: string;
  description?: string;
  thumbnailUrl?: string;
  status?: string; // DRAFT, PUBLISHED, etc.
  visibility?: string; // PUBLIC, PRIVATE
  published?: boolean; // Legacy support
  active?: boolean;
  schoolId?: string;
  teacherId?: string;
  teacherName?: string;
  schoolName?: string | null;
  teacher?: ApiTeacher;
  school?: { id: string; name: string } | null;
  lessonCount?: number;
  createdAt: string;
  updatedAt: string;
  progress?: number; // 0-100
  lessons?: ApiLesson[]; // Lessons included in course detail response
  
  // New fields for student course list
  completed?: boolean;
  progressPercent?: number;
  completedItemsCount?: number;
  lastAccessedItem?: any; // Define a more specific type if known, e.g. { id: string, title: string }
  enrolledAt?: string | null;
  completedAt?: string | null;
}

export interface LessonItemContent {
  id: string;
  resourceUrl: string;
  textContent: string;
  fileSize: number;
  mimeType: string;
  updatedAt: string;
  lastWatchedSecond?: number;
}

export interface LessonItem {
  id: string;
  title: string;
  description: string;
  type: 'VIDEO' | 'TEXT' | 'QUIZ' | 'PDF' | 'PPT';
  orderIndex: number;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  content: LessonItemContent;
  lessonId?: string; // For resolving hierarchy in edit mode
}

export interface ApiLesson {
  id: string;
  title: string;
  orderIndex: number;
  courseId: string;
  lessonItems?: LessonItem[];
  // Extended fields (may come from API later or use mock)
  duration?: string;
  videoUrl?: string;
  description?: string;
  tags?: string[];
  attachments?: LessonAttachment[];
  isCompleted?: boolean;
  isLocked?: boolean;
  
  // New fields from API
  completed: boolean;
  progressPercent: number;
  completedItemsCount: number;
  totalItemsCount: number;
  createdAt: string;
  updatedAt: string;
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

export interface VideoHeartbeatRequest {
  lessonItemId: string;
  currentSecond: number;
  totalDuration: number;
}
