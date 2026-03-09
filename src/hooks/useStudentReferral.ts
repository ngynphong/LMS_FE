import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { getMyCreatedStudents } from '@/services/userService';
import { 
    addBatchStudents, 
    referStudents, 
    getPendingReferralRequests, 
    acceptReferralRequest, 
    rejectReferralRequest, 
    cancelReferralRequest, 
    removeStudentsFromReferral, 
    rejectStudentsInReferral,
    getMySentReferralRequests,
    getCourseReferralRequests,
    getReferralRequestStudents
} from '@/services/courseService';
import type { 
    AddBatchStudentsRequest, 
    CourseReferralRequest,
    GetCourseReferralRequestsParams 
} from '@/types/courseApi';

// ==================== Queries ====================

export const useMyCreatedStudents = (params: { 
    pageNo?: number; 
    pageSize?: number; 
    keyword?: string; 
    fromDate?: string;
    toDate?: string;
    sorts?: string[] 
}) => {
    return useQuery({
        queryKey: ['my-created-students', params],
        queryFn: () => getMyCreatedStudents(params),
        placeholderData: keepPreviousData,
    });
};

export const usePendingReferralRequests = (courseId: string | undefined) => {
    return useQuery({
        queryKey: ['referral-requests', 'pending', courseId],
        queryFn: () => courseId ? getPendingReferralRequests(courseId) : Promise.reject(new Error("No courseId provided")),
        enabled: !!courseId,
    });
};

export const useMySentReferralRequests = () => {
    return useQuery({
        queryKey: ['referral-requests', 'sent'],
        queryFn: getMySentReferralRequests,
    });
};

export const useCourseReferralRequests = (params: GetCourseReferralRequestsParams, options: { enabled?: boolean } = {}) => {
    return useQuery({
        queryKey: ['referral-requests', 'course', params],
        queryFn: () => getCourseReferralRequests(params),
        enabled: options.enabled && !!params.courseId,
        placeholderData: keepPreviousData,
    });
};


export const useReferralRequestStudents = (requestId: string, params: { pageNo?: number; pageSize?: number; sorts?: string[] } = {}) => {
    return useQuery({
        queryKey: ['referral-request-students', requestId, params],
        queryFn: () => getReferralRequestStudents(requestId, params),
        enabled: !!requestId,
        placeholderData: keepPreviousData,
    });
};

// ==================== Mutations ====================

export const useAddBatchStudents = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ courseId, data }: { courseId: string; data: AddBatchStudentsRequest }) => 
            addBatchStudents(courseId, data),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['course-students', variables.courseId] });
        },
    });
};

export const useReferStudents = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ courseId, data }: { courseId: string; data: CourseReferralRequest }) => 
            referStudents(courseId, data),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['referral-requests', 'pending', variables.courseId] });
        },
    });
};

export const useAcceptReferralRequest = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (requestId: string) => acceptReferralRequest(requestId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['referral-requests', 'pending'] });
            queryClient.invalidateQueries({ queryKey: ['course-students'] });
        },
    });
};

export const useRejectReferralRequest = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (requestId: string) => rejectReferralRequest(requestId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['referral-requests', 'pending'] });
        },
    });
};

export const useCancelReferralRequest = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (requestId: string) => cancelReferralRequest(requestId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['referral-requests', 'pending'] });
        },
    });
};

export const useRemoveStudentsFromReferral = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ requestId, studentIds }: { requestId: string; studentIds: string[] }) => 
            removeStudentsFromReferral(requestId, studentIds),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['referral-requests'] });
            queryClient.invalidateQueries({ queryKey: ['referral-request-students'] });
        },
    });
};

export const useRejectStudentsInReferral = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ requestId, studentIds }: { requestId: string; studentIds: string[] }) => 
            rejectStudentsInReferral(requestId, studentIds),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['referral-requests'] });
            queryClient.invalidateQueries({ queryKey: ['referral-request-students'] });
        },
    });
};
