// ==================== Dashboard Summary ====================

export interface DashboardSummaryResponse {
    totalStudents: number;
    needingAttentionCount: number;
    totalCourses: number;
    publishedCourses: number;
    totalEnrollments: number;
    completedEnrollments: number;
    averageProgress: number;
    totalQuizzes: number;
    publishedQuizzes: number;
    totalQuizAttempts: number;
    averageQuizScore: number;
    overallPassRate: number;
}

// ==================== At-Risk Students ====================

export interface AtRiskStudentResponse {
    studentId: string;
    fullName: string;
    lowestQuizScore: number;
    lastActive: string; // ISO date-time string
}

// ==================== Quiz Performance ====================

export interface QuizPerformanceResponse {
    quizId: string;
    quizTitle: string;
    passRate: number;
    averageScore: number;
    totalAttempts: number;
}

// ==================== Course Health ====================

export interface CourseHealthResponse {
    courseId: string;
    courseName: string;
    enrolledCount: number;
    averageProgress: number;
    averageQuizScore: number;
}

// ==================== API Response Wrappers ====================

export interface ApiResponseDashboardSummary {
    code: number;
    message: string;
    data: DashboardSummaryResponse;
}

export interface ApiResponseAtRiskStudents {
    code: number;
    message: string;
    data: AtRiskStudentResponse[];
}

export interface ApiResponseQuizPerformance {
    code: number;
    message: string;
    data: QuizPerformanceResponse[];
}

export interface ApiResponseCourseHealth {
    code: number;
    message: string;
    data: CourseHealthResponse[];
}
