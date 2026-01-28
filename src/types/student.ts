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
  data: {
    total: number;
    success: number;
    failed: number;
    errors: Array<{
      row: number;
      email: string;
      reason: string;
    }>;
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