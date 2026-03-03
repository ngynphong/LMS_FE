import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
    getCourses, 
    getAdminCourses, 
    createCourse, 
    updateCourse, 
    deleteCourse, 
    approveCourse, 
    banCourse, 
    getMyCourses, 
    getCourseById, 
    enrollCourse, 
    createInviteCode, 
    getStudentCourses,
    getCourseStudents
} from '@/services/courseService';
import type { GetCoursesParams, CreateCourseRequest, UpdateCourseRequest } from '@/types/courseApi';
import type { EnrollCourseRequest, CreateInviteCodeRequest } from '@/types/learningTypes';

// ==================== Queries ====================

export const useCourses = (params: GetCoursesParams = {}, options: { enabled?: boolean } = {}) => {
    return useQuery({
        queryKey: ['courses', params],
        queryFn: () => getCourses(params),
        enabled: options.enabled,
    });
};

export const useAdminCourses = (params: GetCoursesParams = {}, ) => {
    return useQuery({
        queryKey: ['admin-courses', params],
        queryFn: () => getAdminCourses(params),
        staleTime: 30 * 1000, // 30s - tránh refetch liên tục
    });
};

export const useMyCourses = (params: {
    pageNo?: number;
    pageSize?: number;
    sorts?: string;
    keyword?: string;
    status?: string;
    visibility?: string;
} = {}) => {
    return useQuery({
        queryKey: ['my-courses', params],
        queryFn: () => getMyCourses(params),
    });
};

export const useStudentCourses = (params: {
    pageNo?: number;
    pageSize?: number;
    sorts?: string;
    keyword?: string;
    status?: string;
    visibility?: string;
    completed?: boolean;
} = {}, options: { enabled?: boolean } = {}) => {
    return useQuery({
        queryKey: ['student-courses', params],
        queryFn: () => getStudentCourses(params),
        enabled: options.enabled,
    });
};

export const useCourseDetail = (courseId: string | undefined) => {
    return useQuery({
        queryKey: ['course', courseId],
        queryFn: () => courseId ? getCourseById(courseId) : Promise.reject(new Error("No courseId provided")),
        enabled: !!courseId,
    });
};

export const useCourseStudents = (courseId: string | undefined) => {
    return useQuery({
        queryKey: ['course-students', courseId],
        queryFn: () => courseId ? getCourseStudents(courseId) : Promise.reject(new Error("No courseId provided")),
        enabled: !!courseId,
    });
};

// ==================== Mutations ====================

export const useCreateCourse = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateCourseRequest) => createCourse(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
            queryClient.invalidateQueries({ queryKey: ['courses'] });
        },
    });
};

export const useUpdateCourse = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateCourseRequest }) => updateCourse(id, data),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['course', variables.id] });
            queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
            queryClient.invalidateQueries({ queryKey: ['courses'] });
            queryClient.invalidateQueries({ queryKey: ['my-courses'] }); 
        },
    });
};

export const useDeleteCourse = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteCourse(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
            queryClient.invalidateQueries({ queryKey: ['courses'] });
            queryClient.invalidateQueries({ queryKey: ['my-courses'] });
        },
    });
};

export const useApproveCourse = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) => approveCourse(id, status),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['course', variables.id] });
            queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
            queryClient.invalidateQueries({ queryKey: ['courses'] });
        },
    });
};

export const useBanCourse = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => banCourse(id),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['course', variables] });
            queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
            queryClient.invalidateQueries({ queryKey: ['courses'] });
        },
    });
};

export const useEnrollCourse = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ courseId, data }: { courseId: string; data: EnrollCourseRequest }) => enrollCourse(courseId, data),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['course', variables.courseId] });
            queryClient.invalidateQueries({ queryKey: ['student-courses'] });
            queryClient.invalidateQueries({ queryKey: ['my-courses'] });
        },
    });
};

export const useCreateInviteCode = () => {
    // No specific invalidation needed usually, or maybe invalidate course detail if it shows the code.
    return useMutation({
        mutationFn: ({ courseId, data }: { courseId: string; data: CreateInviteCodeRequest }) => createInviteCode(courseId, data),
    });
};
