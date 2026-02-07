import axiosInstance from '../config/axios';
import type { CourseListResponse, GetCoursesParams, CreateCourseRequest, UpdateCourseRequest } from '../types/courseApi';
import type { 
  ApiCourse, 
  EnrollCourseRequest,
  CreateInviteCodeRequest
} from '../types/learningTypes';

export const getCourses = async (params: GetCoursesParams): Promise<CourseListResponse> => {
    try {
        const response = await axiosInstance.get<CourseListResponse>('/courses', {
            params: {
                pageNo: params.pageNo || 0,
                pageSize: params.pageSize || 10,
                sorts: params.sorts,
                keyword: params.keyword,
                visibility: params.visibility
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
                keyword: params.keyword,
                status: params.status,
                visibility: params.visibility
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
  sorts?: string;
  keyword?: string;
  status?: string;
  visibility?: string;
}): Promise<{ items: ApiCourse[]; totalElement: number; totalPage: number }> => {
  const response = await axiosInstance.get<{ code: number; message: string; data: { items: ApiCourse[]; totalElement: number; totalPage: number } }>('/courses/my-courses', {
    params: {
      pageNo: params?.pageNo || 0,
      pageSize: params?.pageSize || 10,
      sorts: params?.sorts || 'createdAt:desc',
      keyword: params?.keyword,
      status: params?.status,
      visibility: params?.visibility
    }
  });
  return response.data.data;
};


export const getStudentCourses = async (params?: {
  pageNo?: number;
  pageSize?: number;
  sorts?: string;
  keyword?: string;
  status?: string;
  visibility?: string;
  completed?: boolean;
}): Promise<{ items: ApiCourse[]; totalElement: number; totalPage: number }> => {
  const response = await axiosInstance.get<{ code: number; message: string; data: { items: ApiCourse[]; totalElement: number; totalPage: number } }>('/courses/students/my-courses', {
    params: {
      pageNo: params?.pageNo || 0,
      pageSize: params?.pageSize || 10,
      sorts: params?.sorts || 'createdAt:desc',
      keyword: params?.keyword,
      status: params?.status,
      visibility: params?.visibility,
      completed: params?.completed
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
