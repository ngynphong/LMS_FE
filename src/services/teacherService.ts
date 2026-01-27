import axiosInstance from "../config/axios";
import type { 
  ImportStudentResponse, 
  StudentListResponse, 
  StudentDetailResponse, 
  UpdateStudentRequest 
} from "../types/student";
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

export const importStudentApi = async (file: File): Promise<ImportStudentResponse> => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axiosInstance.post<ImportStudentResponse>('/teacher/import-student', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        return handleApiError(error, 'Failed to import students');
    }
};

export const getMyStudentsApi = async (
    page: number = 1, 
    size: number = 10, 
    keyword: string = '', 
    sortBy: string = 'name', 
    order: string = 'asc'
): Promise<StudentListResponse> => {
    try {
        const response = await axiosInstance.get<StudentListResponse>('/teacher/my-students', {
            params: {
                page,
                size,
                keyword,
                sortBy,
                order
            }
        });
        return response.data;
    } catch (error) {
        return handleApiError(error, 'Failed to fetch student list');
    }
};

export const getStudentDetailApi = async (id: string): Promise<StudentDetailResponse> => {
    try {
        const response = await axiosInstance.get<StudentDetailResponse>(`/teacher/student/${id}`);
        return response.data;
    } catch (error) {
        return handleApiError(error, 'Failed to fetch student details');
    }
};

export const updateStudentApi = async (id: string, data: UpdateStudentRequest): Promise<void> => {
    try {
        const response = await axiosInstance.put(`/teacher/student/${id}`, data);
        if (response.data.code !== 0 && response.data.code !== 1000) {
            throw new Error(response.data.message || 'Update failed');
        }
    } catch (error) {
        return handleApiError(error, 'Failed to update student');
    }
};
