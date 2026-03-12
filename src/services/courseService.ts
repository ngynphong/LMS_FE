import axiosInstance from "@/config/axios";
import type { 
    CourseListResponse, 
    GetCoursesParams, 
    CreateCourseRequest, 
    UpdateCourseRequest, 
    CourseStudentsResponse, 
    CourseTeacherResponse, 
    TopEnrolledCoursesResponse,
    AddBatchStudentsRequest,
    CourseReferralRequest,
    ReferralRequestListResponse,
    PaginatedReferralRequestResponse,
    GetCourseReferralRequestsParams,
    ReferralRequestFilterParams
} from "@/types/courseApi";
import type { 
  ApiCourse, 
  EnrollCourseRequest,
  CreateInviteCodeRequest
} from "@/types/learningTypes";

export const getCourses = async (params: GetCoursesParams): Promise<CourseListResponse> => {
    try {
        const response = await axiosInstance.get<CourseListResponse>('/courses', {
            params: {
                pageNo: params.pageNo || 0,
                pageSize: params.pageSize || 10,
                sorts: params.sorts,
                keyword: params.keyword || undefined,
                visibility: params.visibility || undefined,
                teacherName: params.teacherName || undefined,
                fromDate: params.fromDate || undefined,
                toDate: params.toDate || undefined,
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getOtherTeachersCourses = async (params: GetCoursesParams): Promise<CourseListResponse> => {
    try {
        const response = await axiosInstance.get<CourseListResponse>('/courses/others', {
            params: {
                pageNo: params.pageNo || 0,
                pageSize: params.pageSize || 10,
                sorts: params.sorts,
                keyword: params.keyword || undefined,
                teacherKeyword: params.teacherKeyword || undefined,
                status: params.status || undefined,
                visibility: params.visibility || undefined,
                teacherName: params.teacherName || undefined,
                fromDate: params.fromDate || undefined,
                toDate: params.toDate || undefined,
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getAdminCourses = async (params: GetCoursesParams): Promise<CourseListResponse> => {
    try {
        const response = await axiosInstance.get<CourseListResponse>('/courses/admin', {
            params: {
                pageNo: params.pageNo || 0,
                pageSize: params.pageSize || 10,
                sorts: params.sorts,
                keyword: params.keyword || undefined,
                status: params.status || undefined,
                visibility: params.visibility || undefined,
                teacherName: params.teacherName || undefined,
                fromDate: params.fromDate || undefined,
                toDate: params.toDate || undefined,
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const approveCourse = async (id: string, status: string): Promise<void> => {
    try {
        await axiosInstance.patch(`/courses/${id}/approval`, { status });
    } catch (error) {
        throw error;
    }
};

export const banCourse = async (id: string, status: string = "BANNED"): Promise<void> => {
    try {
        await axiosInstance.patch(`/courses/${id}/ban`, { status });
    } catch (error) {
        throw error;
    }
};

export const reorderLessons = async (courseId: string, lessonIds: string[]): Promise<void> => {
    try {
        await axiosInstance.put(`/courses/${courseId}/lessons/reorder`, { lessonIds });
    } catch (error) {
        throw error;
    }
};

export const createCourse = async (data: CreateCourseRequest): Promise<ApiCourse> => {
    try {
        const res = await axiosInstance.post<{ code: number; message: string; data: ApiCourse }>(`/courses`, data);
        return res.data.data;
    } catch (error) {
        throw error;
    }
};

export const getCourseById = async (courseId: string): Promise<ApiCourse | null> => {
  const response = await axiosInstance.get<{ code: number; message: string; data: ApiCourse }>(`/courses/${courseId}`);
  return response.data.data;
};

export const getMyCourses = async (params?: {
  pageNo?: number;
  pageSize?: number;
  sorts?: string | string[];
  keyword?: string;
  status?: string;
  visibility?: string;
  teacherName?: string;
  fromDate?: string;
  toDate?: string;
}): Promise<{ items: ApiCourse[]; totalElement: number; totalPage: number }> => {
  const response = await axiosInstance.get<{ code: number; message: string; data: { items: ApiCourse[]; totalElement: number; totalPage: number } }>('/courses/my-courses', {
    params: {
      pageNo: params?.pageNo || 0,
      pageSize: params?.pageSize || 10,
      sorts: params?.sorts || 'createdAt:desc',
      keyword: params?.keyword || undefined,
      status: params?.status || undefined,
      visibility: params?.visibility || undefined,
      teacherName: params?.teacherName || undefined,
      fromDate: params?.fromDate || undefined,
      toDate: params?.toDate || undefined,
    }
  });
  return response.data.data;
};


export const getStudentCourses = async (params?: {
  pageNo?: number;
  pageSize?: number;
  sorts?: string | string[];
  keyword?: string;
  status?: string;
  visibility?: string;
  completed?: boolean;
  teacherName?: string;
  fromDate?: string;
  toDate?: string;
}): Promise<{ items: ApiCourse[]; totalElement: number; totalPage: number }> => {
  const response = await axiosInstance.get<{ code: number; message: string; data: { items: ApiCourse[]; totalElement: number; totalPage: number } }>('/courses/students/my-courses', {
    params: {
      pageNo: params?.pageNo || 0,
      pageSize: params?.pageSize || 10,
      sorts: params?.sorts || 'createdAt:desc',
      keyword: params?.keyword || undefined,
      status: params?.status || undefined,
      visibility: params?.visibility || undefined,
      completed: params?.completed,
      teacherName: params?.teacherName || undefined,
      fromDate: params?.fromDate || undefined,
      toDate: params?.toDate || undefined,
    }
  });
  return response.data.data;
};

export const deleteCourse = async (courseId: string): Promise<void> => {
    try {
        await axiosInstance.delete(`/courses/${courseId}`);
    } catch (error) {
        throw error;
    }
};

export const updateCourse = async (courseId: string, data: UpdateCourseRequest): Promise<ApiCourse> => {
    try {
        const res = await axiosInstance.put<{ code: number; message: string; data: ApiCourse }>(`/courses/${courseId}`, data);
        return res.data.data;
    } catch (error) {
        throw error;
    }
};

export const enrollCourse = async (courseId: string, data: EnrollCourseRequest): Promise<void> => {
    try {
        await axiosInstance.post<{ code: number; message: string; data: any }>(`/courses/${courseId}/enroll`, data);
    } catch (error) {
        throw error;
    }
};

export const createInviteCode = async (courseId: string, data: CreateInviteCodeRequest): Promise<string> => {
    try {
        const res = await axiosInstance.post<{ code: number; message: string; data: string }>(`/courses/${courseId}/invite-code`, data);
        return res.data.data;
    } catch (error) {
        throw error;
    }
};

export const getCourseStudents = async (courseId: string): Promise<CourseStudentsResponse> => {
    try {
        const res = await axiosInstance.get<CourseStudentsResponse>(`/courses/${courseId}/students`);
        return res.data;
    } catch (error) {
        throw error;
    }
};

export const getCourseTeachers = async (): Promise<CourseTeacherResponse> => {
    try {
        const res = await axiosInstance.get<CourseTeacherResponse>('/courses/teachers');
        return res.data;
    } catch (error) {
        throw error;
    }
}

export const getTopEnrolledCourses = async (): Promise<TopEnrolledCoursesResponse> => {
    try {
        const response = await axiosInstance.get<TopEnrolledCoursesResponse>('/courses/top-enrolled');
        return response.data;
    } catch (error) {
        throw error;
    }
};

// ==================== Student Referral & Batch Management ====================

export const addBatchStudents = async (courseId: string, data: AddBatchStudentsRequest): Promise<void> => {
    try {
        await axiosInstance.post(`/courses/add-batch-students/${courseId}`, data);
    } catch (error) {
        throw error;
    }
};

export const referStudents = async (courseId: string, data: CourseReferralRequest): Promise<void> => {
    try {
        await axiosInstance.post(`/courses/${courseId}/refer-students`, data);
    } catch (error) {
        throw error;
    }
};

export const getPendingReferralRequests = async (courseId: string): Promise<ReferralRequestListResponse> => {
    try {
        const response = await axiosInstance.get<ReferralRequestListResponse>(`/courses/${courseId}/referral-requests/pending`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getCourseReferralRequests = async (params: GetCourseReferralRequestsParams): Promise<PaginatedReferralRequestResponse> => {
    try {
        const { courseId, ...queryParams } = params;
        const response = await axiosInstance.get<PaginatedReferralRequestResponse>(`/courses/${courseId}/referral-requests`, {
            params: queryParams
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const acceptReferralRequest = async (requestId: string): Promise<void> => {
    try {
        await axiosInstance.post(`/courses/referral-requests/${requestId}/accept`);
    } catch (error) {
        throw error;
    }
};

export const rejectReferralRequest = async (requestId: string): Promise<void> => {
    try {
        await axiosInstance.post(`/courses/referral-requests/${requestId}/reject`);
    } catch (error) {
        throw error;
    }
};

export const getReferralRequestStudents = async (requestId: string, params: { pageNo?: number; pageSize?: number; sorts?: string[] }): Promise<any> => {
    try {
        const response = await axiosInstance.get(`/courses/referral-requests/${requestId}/students`, {
            params: {
                pageNo: params.pageNo || 0,
                pageSize: params.pageSize || 20,
                sorts: params.sorts
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const cancelReferralRequest = async (requestId: string): Promise<void> => {
    try {
        await axiosInstance.delete(`/courses/referral-requests/${requestId}/cancel`);
    } catch (error) {
        throw error;
    }
};

export const removeStudentsFromReferral = async (requestId: string, studentIds: string[]): Promise<void> => {
    try {
        await axiosInstance.delete(`/courses/referral-requests/${requestId}/students`, { data: { studentIds } });
    } catch (error) {
        throw error;
    }
};

export const rejectStudentsInReferral = async (requestId: string, studentIds: string[]): Promise<void> => {
    try {
        await axiosInstance.post(`/courses/referral-requests/${requestId}/students/reject`, { studentIds });
    } catch (error) {
        throw error;
    }
};

export const getMySentReferralRequests = async (params?: ReferralRequestFilterParams): Promise<PaginatedReferralRequestResponse> => {
    try {
        const response = await axiosInstance.get<PaginatedReferralRequestResponse>('courses/referral-requests/sent', {
            params: {
                status: params?.status,
                fromDate: params?.fromDate,
                toDate: params?.toDate,
                pageNo: params?.pageNo ?? 0,
                pageSize: params?.pageSize ?? 10,
                sorts: params?.sorts,
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getMyReceivedReferralRequests = async (params?: ReferralRequestFilterParams): Promise<PaginatedReferralRequestResponse> => {
  try {
    const response = await axiosInstance.get<PaginatedReferralRequestResponse>('courses/referral-requests/received', {
      params: {
        status: params?.status,
        fromDate: params?.fromDate,
        toDate: params?.toDate,
        pageNo: params?.pageNo ?? 0,
        pageSize: params?.pageSize ?? 10,
        sorts: params?.sorts,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const uploadCourseThumbnail = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axiosInstance.post<{ code: number; message: string; data: string }>(
        '/courses/upload/course-thumbnail',
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    );
    return response.data.data;
};
