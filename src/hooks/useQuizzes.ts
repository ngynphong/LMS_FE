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
