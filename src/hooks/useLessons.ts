import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createLesson,
  reorderLessons,
  getLessonById,
  updateLesson,
  deleteLesson,
  createLessonItem,
  reorderLessonItems,
  getLessonItemById,
  updateLessonItem,
  deleteLessonItem,
  trackVideoHeartbeat,
  markLessonItemComplete,
} from '../services/lessonService';
import type { CreateLessonRequest, CreateLessonItemValues } from '../types/courseApi';
import type { VideoHeartbeatRequest } from '../types/learningTypes';

export const useCreateLesson = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      courseId,
      data,
    }: {
      courseId: string;
      data: CreateLessonRequest;
    }) => createLesson(courseId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['course', variables.courseId] });
    },
  });
};

export const useReorderLessons = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      courseId,
      lessonIds,
    }: {
      courseId: string;
      lessonIds: string[];
    }) => reorderLessons(courseId, lessonIds),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['course', variables.courseId] });
    },
  });
};

export const useLessonDetail = (lessonId: string | undefined) => {
  return useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: () => getLessonById(lessonId!),
    enabled: !!lessonId,
  });
};

export const useUpdateLesson = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      lessonId,
      title,
    }: {
      lessonId: string;
      title: string;
    }) => updateLesson(lessonId, title),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['lesson', variables.lessonId] });
      queryClient.invalidateQueries({ queryKey: ['course'] }); // Invalidate generic course queries to be safe, or we could pass courseId if we knew it
    },
  });
};

export const useDeleteLesson = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (lessonId: string) => deleteLesson(lessonId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course'] });
    },
  });
};

export const useCreateLessonItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      lessonId,
      data,
    }: {
      lessonId: string;
      data: CreateLessonItemValues;
    }) => createLessonItem(lessonId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['lesson', variables.lessonId] });
      queryClient.invalidateQueries({ queryKey: ['course'] });
    },
  });
};

export const useReorderLessonItems = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      lessonId,
      itemIds,
    }: {
      lessonId: string;
      itemIds: string[];
    }) => reorderLessonItems(lessonId, itemIds),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['lesson', variables.lessonId] });
    },
  });
};

export const useLessonItemDetail = (id: string | undefined) => {
  return useQuery({
    queryKey: ['lesson-item', id],
    queryFn: () => getLessonItemById(id!),
    enabled: !!id,
  });
};

export const useUpdateLessonItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { title?: string; description?: string; textContent?: string };
    }) => updateLessonItem(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['lesson-item', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['lesson'] });
      queryClient.invalidateQueries({ queryKey: ['course'] });
    },
  });
};

export const useDeleteLessonItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteLessonItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lesson'] });
      queryClient.invalidateQueries({ queryKey: ['course'] });
    },
  });
};

export const useVideoHeartbeat = () => {
  return useMutation({
    mutationFn: (data: VideoHeartbeatRequest) => trackVideoHeartbeat(data),
  });
};

export const useMarkLessonItemComplete = () => {
    const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (lessonItemId: string) => markLessonItemComplete(lessonItemId),
    onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['student-courses'] }); // Refresh progress
         queryClient.invalidateQueries({ queryKey: ['course'] });
    }
  });
};
