import { useState, useEffect, useCallback } from 'react';
import { 
    getQuestions, 
    createQuestion, 
    updateQuestion, 
    deleteQuestion, 
    importQuestions, 
    getQuestionTemplate 
} from '../services/questionService';
import type { 
    Question, 
    CreateQuestionRequest, 
    UpdateQuestionRequest, 
    ImportQuestionResult,
    GetQuestionsParams
} from '../types/question';

interface UseQuestionsReturn {
    data: Question[] | null;
    loading: boolean;
    error: Error | null;
    refetch: () => void;
    totalElements: number;
    totalPages: number;
}

export const useQuestions = (params?: GetQuestionsParams): UseQuestionsReturn => {
    const [data, setData] = useState<Question[] | null>(null);
    const [totalElements, setTotalElements] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [trigger, setTrigger] = useState<number>(0);

    const refetch = useCallback(() => {
        setTrigger(prev => prev + 1);
    }, []);

    useEffect(() => {
        const fetchQuestions = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await getQuestions(params);
                setData(response.items);
                setTotalElements(response.totalElement);
                setTotalPages(response.totalPage);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to fetch questions'));
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, [trigger, JSON.stringify(params)]);

    return { data, loading, error, refetch, totalElements, totalPages };
};

export const useCreateQuestion = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const create = async (data: CreateQuestionRequest) => {
        setLoading(true);
        setError(null);
        try {
            return await createQuestion(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to create question'));
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { create, loading, error };
};

export const useUpdateQuestion = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const update = async (id: string, data: UpdateQuestionRequest) => {
        setLoading(true);
        setError(null);
        try {
            return await updateQuestion(id, data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to update question'));
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { update, loading, error };
};

export const useDeleteQuestion = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const remove = async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            await deleteQuestion(id);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to delete question'));
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { remove, loading, error };
};

export const useImportQuestions = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const importFile = async (lessonId: string | undefined, file: File): Promise<ImportQuestionResult> => {
        setLoading(true);
        setError(null);
        try {
            return await importQuestions(lessonId, file);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to import questions'));
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { importFile, loading, error };
};

export const useQuestionTemplate = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const getTemplate = async () => {
        setLoading(true);
        setError(null);
        try {
            return await getQuestionTemplate();
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to get question template'));
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { getTemplate, loading, error };
};
