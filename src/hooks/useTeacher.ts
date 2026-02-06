import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
    getMyStudentsApi, 
    importStudentApi, 
    getStudentDetailApi, 
    updateStudentApi,
    getDashboardSummaryApi,
    getAtRiskStudentsApi,
    getQuizPerformanceApi,
    getCourseHealthApi
} from '../services/teacherService';
import type { Student, UpdateStudentRequest } from '../types/student';
import { toast } from '../components/common/Toast';

export const useTeacher = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [student, setStudent] = useState<Student | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [totalElements, setTotalElements] = useState<number>(0);

    const getStudents = useCallback(async (
        page: number = 1, 
        size: number = 10, 
        keyword: string = '', 
        sortBy: string = 'name', 
        order: string = 'asc'
    ) => {
        setLoading(true);
        try {
            const response = await getMyStudentsApi(page, size, keyword, sortBy, order);
            if (response.code === 0 || response.code === 1000) {
                setStudents(response.data.content);
                setTotalPages(response.data.totalPages);
                setTotalElements(response.data.totalElements);
            }
            return response;
        } catch (error) {
            console.error(error);
            toast.error('Lỗi khi tải danh sách học viên');
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    const importStudent = useCallback(async (file: File) => {
        setLoading(true);
        try {
            const response = await importStudentApi(file);
            return response;
        } catch (error) {
            console.error(error);
            // toast.error is handled in component based on response usually, or here
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    const getStudent = useCallback(async (id: string) => {
        setLoading(true);
        try {
            const response = await getStudentDetailApi(id);
            if (response.code === 0 || response.code === 1000) {
                setStudent(response.data);
            }
            return response;
        } catch (error) {
            console.error(error);
            toast.error('Lỗi khi tải thông tin học viên');
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateStudent = useCallback(async (id: string, data: UpdateStudentRequest) => {
        setLoading(true);
        try {
            await updateStudentApi(id, data);
            toast.success('Cập nhật thông tin học viên thành công');
        } catch (error) {
            console.error(error);
            // Error handled in service usually displays toast? service throws, so we catch here.
            // Service returns void or throws. 
            // We should ensure service error handling is consistent.
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        students,
        student,
        loading,
        totalPages,
        totalElements,
        getStudents,
        importStudent,
        getStudent,
        updateStudent
    };
};

export const useTeacherDashboardSummary = () => {
    return useQuery({
        queryKey: ['teacher-dashboard-summary'],
        queryFn: getDashboardSummaryApi,
    });
};

export const useAtRiskStudents = () => {
    return useQuery({
        queryKey: ['teacher-at-risk-students'],
        queryFn: getAtRiskStudentsApi,
    });
};

export const useQuizPerformance = () => {
    return useQuery({
        queryKey: ['teacher-quiz-performance'],
        queryFn: getQuizPerformanceApi,
    });
};

export const useCourseHealth = () => {
    return useQuery({
        queryKey: ['teacher-course-health'],
        queryFn: getCourseHealthApi,
    });
};
