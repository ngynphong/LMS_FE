import { useState, useEffect, useCallback } from 'react';
import { createQuiz, getTeacherQuizzes } from '../services/quizService';
import type { CreateQuizRequest, QuizSummary } from '../types/quiz';

export const useCreateQuiz = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const create = async (data: CreateQuizRequest) => {
        setLoading(true);
        setError(null);
        try {
            await createQuiz(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to create quiz'));
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { create, loading, error };
};

interface UseTeacherQuizzesReturn {
    data: QuizSummary[];
    loading: boolean;
    error: Error | null;
    refetch: () => void;
}

export const useTeacherQuizzes = (): UseTeacherQuizzesReturn => {
    const [data, setData] = useState<QuizSummary[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [trigger, setTrigger] = useState<number>(0);

    const refetch = useCallback(() => {
        setTrigger(prev => prev + 1);
    }, []);

    useEffect(() => {
        const fetchQuizzes = async () => {
            setLoading(true);
            setError(null);
            try {
                const quizzes = await getTeacherQuizzes();
                setData(quizzes);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to fetch quizzes'));
            } finally {
                setLoading(false);
            }
        };

        fetchQuizzes();
    }, [trigger]);

    return { data, loading, error, refetch };
};

// ==================== Student Quiz Hooks ====================

import { 
    startQuiz, 
    submitQuiz, 
    saveQuizProgress, 
    getQuizHistory, 
    getQuizAttempt 
} from '../services/quizService';
import type { 
    QuizStartResponse, 
    SubmitQuizRequest, 
    SaveProgressRequest, 
    QuizHistoryItem, 
    QuizAttemptDetailResponse
} from '../types/quiz';

export const useStartQuiz = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const start = async (quizId: string): Promise<QuizStartResponse> => {
        setLoading(true);
        setError(null);
        try {
            const data = await startQuiz(quizId);
            return data;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to start quiz'));
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { start, loading, error };
};

export const useSubmitQuiz = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const submit = async (data: SubmitQuizRequest): Promise<QuizHistoryItem> => {
        setLoading(true);
        setError(null);
        try {
            const result = await submitQuiz(data);
            return result;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to submit quiz'));
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { submit, loading, error };
};

export const useSaveQuizProgress = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const save = async (data: SaveProgressRequest) => {
        setLoading(true);
        setError(null);
        try {
            await saveQuizProgress(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to save progress'));
            // Optional: throw err if you want the UI to handle it specifically
        } finally {
            setLoading(false);
        }
    };

    return { save, loading, error };
};

export const useQuizHistory = (quizId?: string) => {
    const [data, setData] = useState<QuizHistoryItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [trigger, setTrigger] = useState(0);

    const refetch = useCallback(() => {
        setTrigger(prev => prev + 1);
    }, []);

    useEffect(() => {
        if (!quizId) return;

        const fetchHistory = async () => {
            setLoading(true);
            setError(null);
            try {
                const history = await getQuizHistory(quizId);
                setData(history);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to fetch history'));
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [quizId, trigger]);

    return { data, loading, error, refetch };
};

export const useQuizAttempt = (attemptId?: string) => {
    const [data, setData] = useState<QuizAttemptDetailResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!attemptId) return;

        const fetchAttempt = async () => {
            setLoading(true);
            setError(null);
            try {
                const attempt = await getQuizAttempt(attemptId);
                setData(attempt);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to fetch attempt'));
            } finally {
                setLoading(false);
            }
        };

        fetchAttempt();
    }, [attemptId]);

    return { data, loading, error };
};
