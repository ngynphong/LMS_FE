// Course Learning Service
// Uses mock data for now, ready for API integration
// Simply replace mock functions with API calls when backend is ready

import type { 
  ApiCourse, 
  ApiLesson, 
  LessonQuiz,
  CourseProgress
} from '../types/learningTypes';
import { mockCourses, mockLessons, mockQuizzes } from '../data/learningData';
// Uncomment below when API is ready:
// import axiosInstance from '../config/axios';

// ==================== Course APIs ====================

export const getCourseById = async (courseId: string): Promise<ApiCourse | null> => {
  // TODO: Replace with API call when ready
  // const response = await axiosInstance.get<ApiCourse>(`/courses/${courseId}`);
  // return response.data;
  
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      const course = mockCourses.find((c: ApiCourse) => c.id === courseId);
      resolve(course || null);
    }, 300);
  });
};

export const getMyCourses = async (): Promise<ApiCourse[]> => {
  // TODO: Replace with API call when ready
  // const response = await axiosInstance.get<ApiCourse[]>('/my-courses');
  // return response.data;
  
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockCourses);
    }, 300);
  });
};

// ==================== Lesson APIs ====================

export const getLessonsByCourseId = async (courseId: string): Promise<ApiLesson[]> => {
  // TODO: Replace with API call when ready
  // const response = await axiosInstance.get<ApiLesson[]>(`/courses/${courseId}/lessons`);
  // return response.data;
  
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      const lessons = mockLessons.filter((l: ApiLesson) => l.courseId === courseId);
      resolve(lessons.sort((a: ApiLesson, b: ApiLesson) => a.orderIndex - b.orderIndex));
    }, 300);
  });
};

export const getLessonById = async (lessonId: string): Promise<ApiLesson | null> => {
  // TODO: Replace with API call when ready
  // const response = await axiosInstance.get<ApiLesson>(`/lessons/${lessonId}`);
  // return response.data;
  
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      const lesson = mockLessons.find((l: ApiLesson) => l.id === lessonId);
      resolve(lesson || null);
    }, 200);
  });
};

// ==================== Quiz APIs ====================

export const getQuizByLessonId = async (lessonId: string): Promise<LessonQuiz | null> => {
  // TODO: Replace with API call when ready
  // const response = await axiosInstance.get<LessonQuiz>(`/lessons/${lessonId}/quiz`);
  // return response.data;
  
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
