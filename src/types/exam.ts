export interface Exam {
  id: string;
  title: string;
  description: string;
  courseId?: string;
  courseName?: string;
  startDate: string;
  endDate: string;
  duration: number; // in minutes
  maxAttempts: number;
  passingScore: number;
  shuffleQuestions: boolean;
  questionCount: number;
  status: 'draft' | 'published' | 'closed';
  createdAt: string;
}
