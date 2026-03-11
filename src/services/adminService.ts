import axiosInstance from "@/config/axios";
import type { 
    AdminDashboardData, 
    CreateTeacherRequest, 
    CreateTeacherResponse,
    ResetPasswordRequest,
    ResetPasswordResponse,
    SystemLogResponse,
    UserManualResponse,
    UpdateUserManualRequest
} from "@/types/admin";
import axios from "axios";

// Helper for error handling
const handleApiError = (error: unknown, defaultMessage: string): never => {
    if (axios.isAxiosError(error) && error.response?.data) {
        const { message, error: errorMsg } = error.response.data;
        throw new Error(message || errorMsg || defaultMessage);
    }
    if (error instanceof Error) throw error;
    throw new Error(defaultMessage);
};

export const getAdminDashboardStats = async (): Promise<AdminDashboardData> => {
    try {
        const response = await axiosInstance.get<AdminDashboardData>('/admin/dashboard');
        return response.data;
    } catch (error) {
        return handleApiError(error, 'Failed to fetch admin dashboard stats');
    }
};

export const getSystemLogs = async (page: number = 1, size: number = 10): Promise<SystemLogResponse> => {
    try {
        const response = await axiosInstance.get<SystemLogResponse>('/admin', {
            params: { page, size }
        });
        return response.data;
    } catch (error) {
        // Fallback or rethrow
        throw error;
    }
};

export const createTeacherAccount = async (data: CreateTeacherRequest): Promise<CreateTeacherResponse> => {
    try {
        const response = await axiosInstance.post<CreateTeacherResponse>('/admin/teachers', data);
        return response.data;
    } catch (error) {
        return handleApiError(error, 'Failed to create teacher account');
    }
};

export const resetUserPassword = async (userId: string, data: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
    try {
        const response = await axiosInstance.patch<ResetPasswordResponse>(`/admin/users/${userId}/reset-password`, data);
        return response.data;
    } catch (error) {
        return handleApiError(error, 'Không thể đặt lại mật khẩu người dùng');
    }
};

export const getAdminUserManual = async (): Promise<UserManualResponse> => {
    try {
        const response = await axiosInstance.get<UserManualResponse>('/admin/user-manual');
        return response.data;
    } catch (error) {
        return handleApiError(error, 'Failed to fetch user manual');
    }
};

export const updateAdminUserManual = async (data: UpdateUserManualRequest): Promise<UserManualResponse> => {
    try {
        const response = await axiosInstance.put<UserManualResponse>('/admin/user-manual', null, {
            params: { content: data.content }
        });
        return response.data;
    } catch (error) {
        return handleApiError(error, 'Failed to update user manual');
    }
};
