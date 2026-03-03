import axiosInstance from "@/config/axios";
import type { 
  ImportStudentResponse, 
  StudentListResponse, 
  StudentDetailResponse, 
  UpdateStudentRequest,
  ImportJobResponse,
  ImportJobErrorsResponse
} from "@/types/student";
import type {
  ApiResponseDashboardSummary,
  ApiResponseAtRiskStudents,
  ApiResponseQuizPerformance,
  ApiResponseCourseHealth
} from "@/types/teacherDashboard";
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

export const downloadImportTemplateApi = async (): Promise<void> => {
    try {
        const response = await axiosInstance.get('/import/template', {
            responseType: 'blob',
        });

        // Lấy tên file từ header hoặc dùng tên mặc định
        const contentDisposition = response.headers['content-disposition'];
        let filename = 'import_student_template.xlsx';
        if (contentDisposition) {
            const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
            if (match?.[1]) {
                filename = match[1].replace(/['"]/g, '');
            }
        }

        const blob = new Blob([response.data]);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        return handleApiError(error, 'Tải template thất bại');
    }
};

export const getImportJobApi = async (jobId: string): Promise<ImportJobResponse> => {
    try {
        const response = await axiosInstance.get<ImportJobResponse>(`/import/${jobId}`);
        return response.data;
    } catch (error) {
        return handleApiError(error, 'Không thể lấy thông tin import job');
    }
};

export const getImportJobErrorsApi = async (
    jobId: string, 
    page: number = 0, 
    size: number = 20
): Promise<ImportJobErrorsResponse> => {
    try {
        const response = await axiosInstance.get<ImportJobErrorsResponse>(`/import/${jobId}/errors`, {
            params: { page, size }
        });
        return response.data;
    } catch (error) {
        return handleApiError(error, 'Không thể lấy danh sách lỗi import');
    }
};

export const cancelImportJobApi = async (jobId: string): Promise<{ code: number; message: string; data: string }> => {
    try {
        const response = await axiosInstance.delete<{ code: number; message: string; data: string }>(`/cancel-import/${jobId}`);
        return response.data;
    } catch (error) {
        return handleApiError(error, 'Huỷ import thất bại');
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

// ==================== Dashboard APIs ====================

export const getDashboardSummaryApi = async (): Promise<ApiResponseDashboardSummary> => {
    try {
        const response = await axiosInstance.get<ApiResponseDashboardSummary>('/teacher/dashboard/summary');
        return response.data;
    } catch (error) {
        return handleApiError(error, 'Failed to fetch dashboard summary');
    }
};

export const getAtRiskStudentsApi = async (): Promise<ApiResponseAtRiskStudents> => {
    try {
        const response = await axiosInstance.get<ApiResponseAtRiskStudents>('/teacher/dashboard/students/at-risk');
        return response.data;
    } catch (error) {
        return handleApiError(error, 'Failed to fetch at-risk students');
    }
};

export const getQuizPerformanceApi = async (): Promise<ApiResponseQuizPerformance> => {
    try {
        const response = await axiosInstance.get<ApiResponseQuizPerformance>('/teacher/dashboard/quizzes/performance');
        return response.data;
    } catch (error) {
        return handleApiError(error, 'Failed to fetch quiz performance');
    }
};

export const getCourseHealthApi = async (): Promise<ApiResponseCourseHealth> => {
    try {
        const response = await axiosInstance.get<ApiResponseCourseHealth>('/teacher/dashboard/courses');
        return response.data;
    } catch (error) {
        return handleApiError(error, 'Failed to fetch course health');
    }
};
