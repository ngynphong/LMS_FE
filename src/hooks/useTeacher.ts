import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getMyStudentsApi,
  importStudentApi,
  getStudentDetailApi,
  updateStudentApi,
  getDashboardSummaryApi,
  getAtRiskStudentsApi,
  getQuizPerformanceApi,
  getCourseHealthApi,
} from '../services/teacherService';
import type { UpdateStudentRequest } from '../types/student';
import { toast } from '../components/common/Toast';

// Query keys for cache management
export const teacherKeys = {
  all: ['teacher'] as const,
  students: (params: {
    page: number;
    size: number;
    keyword?: string;
    sortBy?: string;
    order?: string;
  }) => [...teacherKeys.all, 'students', params] as const,
  student: (id: string) => [...teacherKeys.all, 'student', id] as const,
  dashboardSummary: () => [...teacherKeys.all, 'dashboard-summary'] as const,
  atRiskStudents: () => [...teacherKeys.all, 'at-risk-students'] as const,
  quizPerformance: () => [...teacherKeys.all, 'quiz-performance'] as const,
  courseHealth: () => [...teacherKeys.all, 'course-health'] as const,
};

/**
 * Hook to fetch paginated student list
 */
export const useStudents = (
  page: number = 1,
  size: number = 10,
  keyword: string = '',
  sortBy: string = 'name',
  order: string = 'asc'
) => {
  return useQuery({
    queryKey: teacherKeys.students({ page, size, keyword, sortBy, order }),
    queryFn: async () => {
      const response = await getMyStudentsApi(page, size, keyword, sortBy, order);
      if (response.code === 0 || response.code === 1000) {
        return {
          students: response.data.content,
          totalPages: response.data.totalPages,
          totalElements: response.data.totalElements,
        };
      }
      throw new Error(response.message || 'Failed to fetch students');
    },
  });
};

/**
 * Hook to fetch single student details
 */
export const useStudentDetail = (id: string | undefined) => {
  return useQuery({
    queryKey: teacherKeys.student(id || ''),
    queryFn: async () => {
      if (!id) throw new Error('Student ID is required');
      const response = await getStudentDetailApi(id);
      if (response.code === 0 || response.code === 1000) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to fetch student');
    },
    enabled: !!id,
  });
};

/**
 * Hook to import students from file
 */
export const useImportStudents = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const response = await importStudentApi(file);
      if (response.code === 0 || response.code === 1000) {
        return response.data;
      }
      throw new Error(response.message || 'Import failed');
    },
    onSuccess: (data) => {
      toast.success(`Nhập thành công: ${data.success} học sinh.`);
      if (data.failed > 0) {
        toast.warning(`Lỗi khi nhập ${data.failed} dòng. Hãy kiểm tra lỗi`);
      }
      // Invalidate students list to refetch
      queryClient.invalidateQueries({ queryKey: teacherKeys.all });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Nhập thất bại');
    },
  });
};

/**
 * Hook to update student
 */
export const useUpdateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateStudentRequest;
    }) => {
      await updateStudentApi(id, data);
      return id;
    },
    onSuccess: (id) => {
      toast.success('Cập nhật thông tin học viên thành công');
      // Invalidate specific student and list
      queryClient.invalidateQueries({ queryKey: teacherKeys.student(id) });
      queryClient.invalidateQueries({ queryKey: teacherKeys.all });
    },
    onError: () => {
      toast.error('Lỗi khi cập nhật thông tin học viên');
    },
  });
};

// Dashboard hooks (already using React Query pattern)
export const useTeacherDashboardSummary = () => {
  return useQuery({
    queryKey: teacherKeys.dashboardSummary(),
    queryFn: getDashboardSummaryApi,
  });
};

export const useAtRiskStudents = () => {
  return useQuery({
    queryKey: teacherKeys.atRiskStudents(),
    queryFn: getAtRiskStudentsApi,
  });
};

export const useQuizPerformance = () => {
  return useQuery({
    queryKey: teacherKeys.quizPerformance(),
    queryFn: getQuizPerformanceApi,
  });
};

export const useCourseHealth = () => {
  return useQuery({
    queryKey: teacherKeys.courseHealth(),
    queryFn: getCourseHealthApi,
  });
};
