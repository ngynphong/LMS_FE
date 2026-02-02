import axiosInstance from '../config/axios';
import type { CreateLessonRequest } from '../types/courseApi';
import type { ApiLesson, LessonQuiz, LessonItem, VideoHeartbeatRequest } from '../types/learningTypes';

// ==================== Lesson APIs ====================

export const getLessonsByCourseId = async (courseId: string): Promise<ApiLesson[]> => {
  try {
    const response = await axiosInstance.get<ApiLesson[] | { code: number; message: string; data: ApiLesson[] }>(`/courses/${courseId}/lessons`);
    // Handle wrapped response
    const data = response.data as any;
    if (data && data.data && Array.isArray(data.data)) {
      return data.data;
    }
    if (Array.isArray(data)) {
      return data;
    }
    return [];
  } catch (error) {
    // If the endpoint doesn't exist or returns error, return empty array
    // This is expected for newly created courses with no lessons
    console.warn('Failed to fetch lessons for course:', courseId, error);
    return [];
  }
};

export const getLessonById = async (lessonId: string): Promise<ApiLesson | null> => {
  const response = await axiosInstance.get<ApiLesson>(`/lessons/${lessonId}`);

  const res = response.data as any; 
  if (res && res.data && typeof res.code === 'number') {
      return res.data;
  }
  return response.data;
};

export const updateLesson = async (lessonId: string, title: string): Promise<ApiLesson> => {
    // Screenshot: PUT /lessons/{id} body { title: string }
    const response = await axiosInstance.put<{code: number, message: string, data: ApiLesson}>(`/lessons/${lessonId}`, { title });
    return response.data.data;
};

export const deleteLesson = async (lessonId: string): Promise<void> => {
    await axiosInstance.delete(`/lessons/${lessonId}`);
};

export const createLessonItem = async (lessonId: string, data: {
    title?: string;
    description?: string;
    type?: string;
    textContent?: string;
    file?: File | null;
}): Promise<any> => { 
    // Build query params
    const params = new URLSearchParams();
    if (data.title) params.append('title', data.title);
    if (data.description) params.append('description', data.description);
    if (data.type) params.append('type', data.type);
    // textContent luôn được truyền
    params.append('textContent', data.textContent || '');
    
    // Build form data for file
    const formData = new FormData();
    if (data.file) {
        formData.append('file', data.file);
    }
    
    const queryString = params.toString();
    const url = `/lessons/${lessonId}/items${queryString ? `?${queryString}` : ''}`;
    
    const response = await axiosInstance.post<{code: number, message: string, data: any}>(url, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data.data;
};

export const reorderLessonItems = async (lessonId: string, itemIds: string[]): Promise<void> => {
    // Screenshot: PUT /lessons/{lessonId}/items/reorder body { itemIds: ["string"] }
    await axiosInstance.put(`/lessons/${lessonId}/items/reorder`, { itemIds });
};

// ==================== Lesson Item Controller APIs ====================

export const getLessonItemById = async (id: string): Promise<LessonItem | null> => { 
    try {
        const response = await axiosInstance.get<{code: number, message: string, data: LessonItem}>(`/lesson-items/${id}`);
        return response.data.data;
    } catch (error) {
        return null;
    }
};

export const updateLessonItem = async (id: string, data: {
    title?: string;
    description?: string;
    textContent?: string;
}): Promise<any> => {
    const response = await axiosInstance.put<{code: number, message: string, data: any}>(`/lesson-items/${id}`, data);
    return response.data.data;
};

export const deleteLessonItem = async (id: string): Promise<void> => {
    await axiosInstance.delete(`/lesson-items/${id}`);
};


export const createLesson = async (courseId: string, data: CreateLessonRequest): Promise<ApiLesson> => {
    try {
        const res = await axiosInstance.post<{ code: number; message: string; data: ApiLesson }>(`/courses/${courseId}/lessons`, data);
        return res.data.data;
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

export const trackVideoHeartbeat = async (data: VideoHeartbeatRequest): Promise<void> => {
    try {
        await axiosInstance.post(`/lesson-items/progress/video/heartbeat`, data);
    } catch (error) {
        throw error;
    }
};

export const markLessonItemComplete = async (lessonItemId: string): Promise<void> => {
    try {
        await axiosInstance.patch(`/lesson-items/progress/${lessonItemId}/complete`);
    } catch (error) {
        throw error;
    }
};

// ==================== Quiz APIs ====================



export const getQuizByLessonId = async (lessonId: string): Promise<LessonQuiz | null> => {
  try {
    const response = await axiosInstance.get<LessonQuiz>(`/lessons/${lessonId}/quiz`);
    return response.data;
  } catch (error) {
    // Suppress error if quiz not found or other API error
    return null;
  }
};
