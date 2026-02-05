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
    getStudentCourses 
} from '../services/courseService';
import type { GetCoursesParams, CreateCourseRequest, UpdateCourseRequest } from '../types/courseApi';
import type { EnrollCourseRequest, CreateInviteCodeRequest } from '../types/learningTypes';

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
        // The service returns { items: [], totalElement: 0, totalPage: 0 }
        // We can keep specific selectors if we want to return just items, but usually returning the whole object is fine.
        // However, the original hook returned separate data, totalElements, totalPages.
        // React Query returns `data` which is the whole response.
        // The components using this will need to adapt or we can select to shape the data.
        // But for simplicity and consistency with standard React Query usage, we'll return the full response in `data`.
        // If the component expects { data, totalElements, totalPages }, we should check usage.
        // Looking at previous file content:
        // return { data, loading, error, refetch, totalElements, totalPages };
        // React Query returns { data, isLoading, error, refetch }. 
        // We might need to wrap this to match the exact return signature if we don't want to break ALL components,
        // OR we update the components. 
        // Given the request is to "Refactor ... to Reduce API requests", standardizing on React Query's return is best.
        // But to minimize breakage, I'll return an object that mimics the old signature where possible or the user will have to update components.
        // Actually, the prompt implies "Replacing manual State in useCourses.ts".
        // It's better to expose the query object directly so they get all benefits (isLoading, isError, data, etc).
        // I will return the query object.
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
        queryFn: () => getCourseById(courseId!),
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
