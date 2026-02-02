import { useState, useEffect, useCallback } from 'react';
import { createLesson, reorderLessons, getLessonById, updateLesson, deleteLesson, createLessonItem, reorderLessonItems, getLessonItemById, updateLessonItem, deleteLessonItem, trackVideoHeartbeat, markLessonItemComplete } from '../services/lessonService';
import type { CreateLessonRequest, CreateLessonItemValues } from '../types/courseApi';
import type { VideoHeartbeatRequest } from '../types/learningTypes';

export const useCreateLesson = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const create = async (courseId: string, data: CreateLessonRequest) => {
        setLoading(true);
        setError(null);
        try {
            return await createLesson(courseId, data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to create lesson'));
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { create, loading, error };
};

export const useReorderLessons = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const reorder = async (courseId: string, lessonIds: string[]) => {
        setLoading(true);
        setError(null);
        try {
            await reorderLessons(courseId, lessonIds);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to reorder lessons'));
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { reorder, loading, error };
};

export const useLessonDetail = (lessonId: string | undefined) => {
    const [data, setData] = useState<any | null>(null); // Type should strictly be ApiLesson, but service might return wrapper
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [trigger, setTrigger] = useState<number>(0);

    const refetch = useCallback(() => {
        setTrigger(prev => prev + 1);
    }, []);

    useEffect(() => {
        if (!lessonId) {
            setLoading(false);
            return;
        }

        const fetchLesson = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await getLessonById(lessonId);
                setData(response);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to fetch lesson detail'));
            } finally {
                setLoading(false);
            }
        };

        fetchLesson();
    }, [lessonId, trigger]);

    return { data, loading, error, refetch };
};

export const useUpdateLesson = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const update = async (lessonId: string, title: string) => {
        setLoading(true);
        setError(null);
        try {
            return await updateLesson(lessonId, title);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to update lesson'));
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { update, loading, error };
};

export const useDeleteLesson = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const remove = async (lessonId: string) => {
        setLoading(true);
        setError(null);
        try {
            await deleteLesson(lessonId);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to delete lesson'));
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { remove, loading, error };
};

export const useCreateLessonItem = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const create = async (lessonId: string, data: CreateLessonItemValues) => {
        setLoading(true);
        setError(null);
        try {
            return await createLessonItem(lessonId, data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to create lesson item'));
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { create, loading, error };
};

export const useReorderLessonItems = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const reorder = async (lessonId: string, itemIds: string[]) => {
        setLoading(true);
        setError(null);
        try {
            await reorderLessonItems(lessonId, itemIds);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to reorder lesson items'));
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { reorder, loading, error };
};

export const useLessonItemDetail = (id: string | undefined) => {
    const [data, setData] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [trigger, setTrigger] = useState<number>(0);

    const refetch = useCallback(() => {
        setTrigger(prev => prev + 1);
    }, []);

    useEffect(() => {
        if (!id) {
            setLoading(false);
            return;
        }

        const fetchItem = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await getLessonItemById(id);
                setData(response);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to fetch lesson item detail'));
            } finally {
                setLoading(false);
            }
        };

        fetchItem();
    }, [id, trigger]);

    return { data, loading, error, refetch };
};

export const useUpdateLessonItem = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const update = async (id: string, data: { title?: string; description?: string; textContent?: string }) => {
        setLoading(true);
        setError(null);
        try {
            return await updateLessonItem(id, data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to update lesson item'));
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { update, loading, error };
};

export const useDeleteLessonItem = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const remove = async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            await deleteLessonItem(id);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to delete lesson item'));
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { remove, loading, error };
};



export const useVideoHeartbeat = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const track = async (data: VideoHeartbeatRequest) => {
        setLoading(true);
        setError(null);
        try {
            await trackVideoHeartbeat(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to track video heartbeat'));
            // Optionally suppress error for heartbeat to avoid disrupting user experience
        } finally {
            setLoading(false);
        }
    };

    return { track, loading, error };
};

export const useMarkLessonItemComplete = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const markComplete = async (lessonItemId: string) => {
        setLoading(true);
        setError(null);
        try {
            await markLessonItemComplete(lessonItemId);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to mark item complete'));
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { markComplete, loading, error };
};
