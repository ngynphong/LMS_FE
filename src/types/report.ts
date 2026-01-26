export interface ExamResult {
  id: string;
  studentName: string;
  studentInitials: string;
  studentColor: string;
  submittedAt: string;
  attempts: number;
  score: number | null;
  status: 'passed' | 'failed' | 'in_progress';
}

export interface ExamReport {
  id: string;
  examId: string;
  examTitle: string;
  courseName: string;
  lastUpdated: string;
  totalParticipants: number;
  averageScore: number;
  passRate: number;
  incompleteCount: number;
  gradeDistribution: {
    excellent: number; // Giỏi
    good: number; // Khá
    average: number; // Trung bình
    poor: number; // Yếu
  };
  questionPerformance: {
    questionId: string;
    correctRate: number;
  }[];
  results: ExamResult[];
}
