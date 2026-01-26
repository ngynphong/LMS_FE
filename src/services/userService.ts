import axiosInstance from "../config/axios";
import type { AdminUserListResponse, UserDashboardParams, UpdateUserRoleRequest } from "../types/user";
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
        // Handle other filters if API supports them (isVerified, isLocked not explicit in swagger snippet but commonly used)
        
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

