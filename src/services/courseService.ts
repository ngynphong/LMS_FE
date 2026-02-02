import { mockQuizzes } from '@/data/learningData';
import axiosInstance from '../config/axios';
import type { CourseListResponse, GetCoursesParams, CreateCourseRequest, UpdateCourseRequest } from '../types/courseApi';
import type { 
  ApiCourse, 
  CourseProgress,
  LessonQuiz,
  EnrollCourseRequest,
  CreateInviteCodeRequest
} from '../types/learningTypes';
import { getLessonsByCourseId } from './lessonService';

export const getCourses = async (params: GetCoursesParams): Promise<CourseListResponse> => {
    try {
        const response = await axiosInstance.get<CourseListResponse>('/courses', {
            params: {
                pageNo: params.pageNo || 0,
                pageSize: params.pageSize || 10,
                sorts: params.sorts,
                keyword: params.keyword
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
}): Promise<{ items: ApiCourse[]; totalElement: number; totalPage: number }> => {
  const response = await axiosInstance.get<{ code: number; message: string; data: { items: ApiCourse[]; totalElement: number; totalPage: number } }>('/courses/students/my-courses', {
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

// ==================== Quiz APIs ====================

export const getQuizByLessonId = async (lessonId: string): Promise<LessonQuiz | null> => {
  const response = await axiosInstance.get<LessonQuiz>(`/lessons/${lessonId}/quiz`);
  return response.data;
  
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      const quiz = mockQuizzes.find((q: LessonQuiz) => q.lessonId === lessonId);
      resolve(quiz || null);
    }, 200);
  });
};

// ==================== Progress APIs ====================

export const getCourseProgress = async (courseId: string): Promise<CourseProgress> => {
  // TODO: Replace with API call when ready
  // const response = await axiosInstance.get<CourseProgress>(`/courses/${courseId}/progress`);
  // return response.data;
  
  // Mock implementation - return from localStorage
  const stored = localStorage.getItem(`course_progress_${courseId}`);
  if (stored) {
    return JSON.parse(stored);
  }
  
  // Default progress
  return {
    courseId,
    completedLessons: 0,
    totalLessons: 0,
    progressPercent: 0,
    lessonProgress: {}
  };
};

export const updateLessonProgress = async (
  courseId: string, 
  lessonId: string, 
  completed: boolean
): Promise<void> => {
  // TODO: Replace with API call when ready
  // await axiosInstance.post(`/lessons/${lessonId}/progress`, { completed });
  
  // Mock implementation - save to localStorage
  const progress = await getCourseProgress(courseId);
  const lessons = await getLessonsByCourseId(courseId);
  
  progress.lessonProgress[lessonId] = {
    lessonId,
    isCompleted: completed,
    videoProgress: 0,
    quizPassed: false,
    lastAccessedAt: new Date().toISOString()
  };
  
  const completedCount = Object.values(progress.lessonProgress).filter(p => p.isCompleted).length;
  progress.completedLessons = completedCount;
  progress.totalLessons = lessons.length;
  progress.progressPercent = Math.round((completedCount / lessons.length) * 100);
  
  localStorage.setItem(`course_progress_${courseId}`, JSON.stringify(progress));
};
