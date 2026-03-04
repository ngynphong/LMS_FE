import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { requestBatchResetPasswordApi, getBatchResetPasswordRequestsApi } from '@/services/userService';
import { approveBatchResetPasswordApi } from '@/services/authService';
import type { BatchResetPasswordRequest, AdminBatchResetPasswordRequest } from '@/types/user';

export const useRequestBatchResetPassword = () => {
    return useMutation({
        mutationFn: (data: BatchResetPasswordRequest) => requestBatchResetPasswordApi(data),
    });
};

export const useGetBatchResetPasswordRequests = (params: { pageNo?: number; pageSize?: number; sorts?: string[] }) => {
    return useQuery({
        queryKey: ['batch-reset-password-requests', params],
        queryFn: () => getBatchResetPasswordRequestsApi(params),
        placeholderData: keepPreviousData,
    });
};

export const useApproveBatchResetPassword = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (data: AdminBatchResetPasswordRequest) => approveBatchResetPasswordApi(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['batch-reset-password-requests'] });
        },
    });
};
