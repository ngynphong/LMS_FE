import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
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
    getOtherTeachersCourses,
    enrollCourse, 
    createInviteCode, 
    getStudentCourses,
    getCourseStudents,
    getCourseTeachers,
    getTopEnrolledCourses,
    uploadCourseThumbnail
} from '@/services/courseService';
import type { GetCoursesParams, CreateCourseRequest, UpdateCourseRequest } from '@/types/courseApi';
import type { EnrollCourseRequest, CreateInviteCodeRequest } from '@/types/learningTypes';

// ==================== Queries ====================

export const useCourses = (params: GetCoursesParams = {}, options: { enabled?: boolean } = {}) => {
    return useQuery({
        queryKey: ['courses', params],
        queryFn: () => getCourses(params),
        enabled: options.enabled,
        placeholderData: keepPreviousData,
    });
};

export const useOtherTeachersCourses = (params: GetCoursesParams = {}, options: { enabled?: boolean } = {}) => {
    return useQuery({
        queryKey: ['courses-others', params],
        queryFn: () => getOtherTeachersCourses(params),
        enabled: options.enabled,
        placeholderData: keepPreviousData,
    });
};

export const useAdminCourses = (params: GetCoursesParams = {}, ) => {
    return useQuery({
        queryKey: ['admin-courses', params],
        queryFn: () => getAdminCourses(params),
        staleTime: 30 * 1000, // 30s - tránh refetch liên tục
        placeholderData: keepPreviousData,
    });
};

export const useMyCourses = (params: {
    pageNo?: number;
    pageSize?: number;
    sorts?: string | string[];
    keyword?: string | undefined;
    status?: string | undefined;
    visibility?: string | undefined;
    teacherName?: string;
    fromDate?: string;
    toDate?: string;
} = {}) => {
    return useQuery({
        queryKey: ['my-courses', params],
        queryFn: () => getMyCourses(params),
        placeholderData: keepPreviousData,
    });
};

export const useStudentCourses = (params: {
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
} = {}, options: { enabled?: boolean } = {}) => {
    return useQuery({
        queryKey: ['student-courses', params],
        queryFn: () => getStudentCourses(params),
        enabled: options.enabled,
        placeholderData: keepPreviousData,
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

export const useCourseTeachers = () => {
    return useQuery({
        queryKey: ['course-teachers'],
        queryFn: () => getCourseTeachers(),
        staleTime: 5 * 60 * 1000, // 5 mins
    });
};

export const useTopEnrolledCourses = (options: { enabled?: boolean } = {}) => {
    return useQuery({
        queryKey: ['courses-top-enrolled'],
        queryFn: getTopEnrolledCourses,
        enabled: options.enabled,
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
        mutationFn: ({ id, status }: { id: string; status: string }) => banCourse(id, status),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['course', variables.id] });
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

export const useUploadCourseThumbnail = () => {
    return useMutation({
        mutationFn: (file: File) => uploadCourseThumbnail(file),
    });
};
