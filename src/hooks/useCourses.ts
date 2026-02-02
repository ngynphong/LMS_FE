import { useState, useEffect, useCallback } from 'react';
import { getCourses, getAdminCourses, createCourse, updateCourse, deleteCourse, approveCourse, banCourse, getMyCourses, getCourseById, enrollCourse, createInviteCode, getStudentCourses } from '../services/courseService';
import type { CourseListResponse, GetCoursesParams, CreateCourseRequest, UpdateCourseRequest } from '../types/courseApi';
import type { ApiCourse, EnrollCourseRequest, CreateInviteCodeRequest } from '../types/learningTypes';

interface UseCoursesReturn {
    data: CourseListResponse | null;
    loading: boolean;
    error: Error | null;
    refetch: () => void;
}

export const useCourses = (params: GetCoursesParams = {}): UseCoursesReturn => {
    const [data, setData] = useState<CourseListResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [trigger, setTrigger] = useState<number>(0);

    const refetch = useCallback(() => {
        setTrigger(prev => prev + 1);
    }, []);

    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await getCourses(params);
                setData(response);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to fetch courses'));
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, [trigger, params.pageNo, params.pageSize, params.keyword, JSON.stringify(params.sorts)]); // Use JSON.stringify for array dependency

    return { data, loading, error, refetch };
};

export const useAdminCourses = (params: GetCoursesParams = {}): UseCoursesReturn => {
    const [data, setData] = useState<CourseListResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [trigger, setTrigger] = useState<number>(0);

    const refetch = useCallback(() => {
        setTrigger(prev => prev + 1);
    }, []);

    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await getAdminCourses(params);
                setData(response);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to fetch admin courses'));
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, [trigger, params.pageNo, params.pageSize, params.keyword, params.status, params.visibility, JSON.stringify(params.sorts)]);

    return { data, loading, error, refetch };
};

export const useCreateCourse = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const create = async (data: CreateCourseRequest) => {
        setLoading(true);
        setError(null);
        try {
            return await createCourse(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to create course'));
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { create, loading, error };
};

export const useUpdateCourse = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const update = async (id: string, data: UpdateCourseRequest) => {
        setLoading(true);
        setError(null);
        try {
            return await updateCourse(id, data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to update course'));
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { update, loading, error };
};

export const useDeleteCourse = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const remove = async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            await deleteCourse(id);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to delete course'));
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { remove, loading, error };
};

export const useApproveCourse = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const approve = async (id: string, status: string) => {
        setLoading(true);
        setError(null);
        try {
            await approveCourse(id, status);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to approve course'));
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { approve, loading, error };
};

export const useBanCourse = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const ban = async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            await banCourse(id);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to ban course'));
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { ban, loading, error };
};

export const useMyCourses = (params?: {
    pageNo?: number;
    pageSize?: number;
    sorts?: string;
    keyword?: string;
    status?: string;
    visibility?: string;
}) => {
    const [data, setData] = useState<ApiCourse[] | null>(null);
    const [totalElements, setTotalElements] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [trigger, setTrigger] = useState<number>(0);

    const refetch = useCallback(() => {
        setTrigger(prev => prev + 1);
    }, []);

    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await getMyCourses(params);
                setData(response.items);
                setTotalElements(response.totalElement);
                setTotalPages(response.totalPage);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to fetch my courses'));
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, [trigger, JSON.stringify(params)]);

    return { data, loading, error, refetch, totalElements, totalPages };
};


export const useStudentCourses = (params?: {
    pageNo?: number;
    pageSize?: number;
    sorts?: string;
    keyword?: string;
    status?: string;
    visibility?: string;
}) => {
    const [data, setData] = useState<ApiCourse[] | null>(null);
    const [totalElements, setTotalElements] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [trigger, setTrigger] = useState<number>(0);

    const refetch = useCallback(() => {
        setTrigger(prev => prev + 1);
    }, []);

    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await getStudentCourses(params);
                setData(response.items);
                setTotalElements(response.totalElement);
                setTotalPages(response.totalPage);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to fetch my courses'));
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, [trigger, JSON.stringify(params)]);

    return { data, loading, error, refetch, totalElements, totalPages };
};

export const useCourseDetail = (courseId: string | undefined) => {
    const [data, setData] = useState<ApiCourse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [trigger, setTrigger] = useState<number>(0);

    const refetch = useCallback(() => {
        setTrigger(prev => prev + 1);
    }, []);

    useEffect(() => {
        if (!courseId) {
            setLoading(false);
            return;
        }

        const fetchCourse = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await getCourseById(courseId);
                setData(response);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to fetch course detail'));
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [courseId, trigger]);

    return { data, loading, error, refetch };
};

export const useEnrollCourse = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const enroll = async (courseId: string, data: EnrollCourseRequest) => {
        setLoading(true);
        setError(null);
        try {
            await enrollCourse(courseId, data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to enroll course'));
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { enroll, loading, error };
};

export const useCreateInviteCode = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const createCode = async (courseId: string, data: CreateInviteCodeRequest) => {
        setLoading(true);
        setError(null);
        try {
            return await createInviteCode(courseId, data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to create invite code'));
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { createCode, loading, error };
};

