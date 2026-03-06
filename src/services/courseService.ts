import axiosInstance from "@/config/axios";
import type { CourseListResponse, GetCoursesParams, CreateCourseRequest, UpdateCourseRequest, CourseStudentsResponse, CourseTeacherResponse, TopEnrolledCoursesResponse } from "@/types/courseApi";
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

export const banCourse = async (id: string): Promise<void> => {
    try {
    await axiosInstance.patch(`/courses/${id}/ban`, { status: "BANNED" });
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
