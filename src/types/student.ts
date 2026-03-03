export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  fullName?: string;
  dob?: string;
  goal?: string;
  schoolName?: string;
  createdByTeacherName?: string;
  totalCourses?: number;
  createdAt?: string; 
  status?: 'active' | 'inactive'; // Kept for UI compatibility if needed, though not in API sample
  urlImg?: string; // Kept for UI compatibility
  
  // UI helper fields (might need to be computed or mapped)
  enrolledCourses?: number;
  completionRate?: number;
  lastAccess?: string;
  courseName?: string;
}

export interface StudentListResponse {
  code: number;
  message: string;
  data: {
    totalPages: number;
    totalElements: number;
    pageable: {
      paged: boolean;
      pageNumber: number;
      pageSize: number;
    };
    content: Student[];
  };
}

export interface ImportStudentResponse {
  code: number;
  message: string;
  data: string; // "Import job submitted successfully with job : {jobId}"
}

export interface ImportJobData {
  id: string;
  fileName: string;
  fileUrlMinio: string;
  fileSize: number;
  createdBy: string;
  schoolId: string | null;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  totalRows: number;
  processedRows: number;
  successCount: number;
  errorCount: number;
  createdAt: string;
  startedAt: string | null;
  completedAt: string | null;
  failureReason: string | null;
}

export interface ImportJobResponse {
  code: number;
  message: string;
  data: ImportJobData;
}

export interface ImportJobError {
  rowNumber: number;
  email: string;
  errorMessage: string;
}

export interface ImportJobErrorsResponse {
  code: number;
  message: string;
  data: {
    totalPages: number;
    totalElements: number;
    content: ImportJobError[];
  };
}

export interface StudentDetailResponse {
  code: number;
  message: string;
  data: Student;
}

export interface UpdateStudentRequest {
  firstName: string;
  lastName: string;
  phone: string;
  dob: string;
  goal: string;
}