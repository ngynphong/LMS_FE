import axiosInstance from "@/config/axios";
import type { AdminUserListResponse, UserDashboardParams, UpdateUserRoleRequest, BatchResetPasswordRequest, UpdateStudentProfileRequest, UpdateStudentProfileResponse } from "@/types/user";
import type { UpdateTeacherProfileRequest } from "@/types/teacherProfile";
import axios from "axios";

// Helper function to handle API errors (reused from authService or similar)
const handleApiError = (error: unknown, defaultMessage: string): never => {
    if (axios.isAxiosError(error) && error.response?.data) {
        const { message, error: errorMsg } = error.response.data;
        throw new Error(message || errorMsg || defaultMessage);
    }
    if (error instanceof Error) throw error;
    throw new Error(defaultMessage);
};

export const getUsersApi = async (params: UserDashboardParams): Promise<AdminUserListResponse> => {
    try {
        const queryParams = new URLSearchParams();
        if (params.pageNo !== undefined) queryParams.append('pageNo', params.pageNo.toString());
        if (params.pageSize !== undefined) queryParams.append('pageSize', params.pageSize.toString());
        if (params.keyword) queryParams.append('keyword', params.keyword);
        if (params.role && params.role !== 'All') queryParams.append('role', params.role.toUpperCase());
        if (params.isVerified !== undefined) queryParams.append('isVerified', params.isVerified.toString());
        if (params.isLocked !== undefined) queryParams.append('isLocked', params.isLocked.toString());
        
        if (params.sorts && params.sorts.length > 0) {
             params.sorts.forEach(sort => queryParams.append('sorts', sort));
        }

        const response = await axiosInstance.get<AdminUserListResponse>(`/users?${queryParams.toString()}`);
        return response.data;
    } catch (error) {
        return handleApiError(error, 'Failed to fetch users');
    }
};

export const deleteUserApi = async (userId: string): Promise<void> => {
    try {
        await axiosInstance.delete(`/users/${userId}`);
    } catch (error) {
        return handleApiError(error, 'Failed to delete user');
    }
};

export const updateUserRolesApi = async (userId: string, data: UpdateUserRoleRequest): Promise<void> => {
   try {
       await axiosInstance.patch(`/users/${userId}/roles`, data);
   } catch (error) {
       return handleApiError(error, 'Failed to update user roles');
   }
};

export const requestBatchResetPasswordApi = async (data: BatchResetPasswordRequest): Promise<void> => {
    try {
        await axiosInstance.patch(`/users/reset-password/batch`, data);
    } catch (error) {
        return handleApiError(error, 'Failed to request batch password reset');
    }
};

export const getBatchResetPasswordRequestsApi = async (params: { pageNo?: number; pageSize?: number; sorts?: string[] }): Promise<AdminUserListResponse> => {
    try {
        const queryParams = new URLSearchParams();
        if (params.pageNo !== undefined) queryParams.append('pageNo', params.pageNo.toString());
        if (params.pageSize !== undefined) queryParams.append('pageSize', params.pageSize.toString());
        
        if (params.sorts && params.sorts.length > 0) {
             params.sorts.forEach(sort => queryParams.append('sorts', sort));
        }

        const response = await axiosInstance.get<AdminUserListResponse>(`/users/reset-password/batch?${queryParams.toString()}`);
        return response.data;
    } catch (error) {
        return handleApiError(error, 'Failed to fetch batch password reset requests');
    }
};


// ==================== Profile Update APIs ====================

export const updateStudentProfileApi = async (data: UpdateStudentProfileRequest): Promise<UpdateStudentProfileResponse> => {
    try {
        const response = await axiosInstance.put<UpdateStudentProfileResponse>('/student-profiles', data);
        return response.data;
    } catch (error) {
        return handleApiError(error, 'Cập nhật hồ sơ học viên thất bại');
    }
};

export const updateTeacherProfileApi = async (data: UpdateTeacherProfileRequest): Promise<void> => {
    try {
        await axiosInstance.put('/teacher', data);
    } catch (error) {
        return handleApiError(error, 'Cập nhật hồ sơ giảng viên thất bại');
    }
};
