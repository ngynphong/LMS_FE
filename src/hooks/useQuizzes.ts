// ... imports
import { useState, useEffect, useCallback } from 'react';
import { 
    createQuiz, 
    getTeacherQuizzes,
    publishQuiz,
    generateQuizCode,
    getQuizStatistics,
    startQuiz, 
    submitQuiz, 
    saveQuizProgress, 
    getQuizHistory, 
    getQuizAttempt,
    getMyOngoingQuizzes,
    checkPracticeAnswer,
    reviewAttempt,
    joinQuizByCode,
    getStudentTeacherQuizzes,
    getQuizById,
    updateQuiz,
    getQuizByLessonItem
} from '../services/quizService';
import type { 
    CreateQuizRequest, 
    QuizSummary, 
    ApiOngoingQuiz, 
    CheckPracticeAnswerRequest, 
    CheckPracticeAnswerResponse,
    QuizAttemptReview,
    QuizStatistics,
    GenerateCodeResponse,
    JoinQuizResponse,
    StudentTeacherQuiz,
    QuizStartResponse, 
    SubmitQuizRequest, 
    SaveProgressRequest, 
    QuizHistoryItem, 
    QuizAttemptDetailResponse,
    UpdateQuizRequest,
    QuizDetailResponse
} from '../types/quiz';

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

export const useUpdateQuiz = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const update = async (id: string, data: UpdateQuizRequest) => {
        setLoading(true);
        setError(null);
        try {
            await updateQuiz(id, data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to update quiz'));
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { update, loading, error };
};

export const useQuiz = (id?: string) => {
    const [data, setData] = useState<QuizDetailResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!id) return;
        
        const fetchQuiz = async () => {
            setLoading(true);
            setError(null);
            try {
                const quiz = await getQuizById(id);
                setData(quiz);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to fetch quiz details'));
            } finally {
                setLoading(false);
            }
        };

        fetchQuiz();
    }, [id]);

    return { data, loading, error };
};

export const useQuizByLessonItem = (lessonItemId?: string) => {
    const [data, setData] = useState<QuizDetailResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!lessonItemId) {
            setData([]);
            return;
        }

        const fetchQuiz = async () => {
            setLoading(true);
            setError(null);
            try {
                const quizzes = await getQuizByLessonItem(lessonItemId);
                setData(quizzes);
            } catch (err) {
                // If it's a 404, it might just mean no quiz for this lesson item, which is fine
                // But generally we want to expose the error
                setError(err instanceof Error ? err : new Error('Failed to fetch quiz details'));
                setData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchQuiz();
    }, [lessonItemId]);

    return { data, loading, error };
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

export const usePublishQuiz = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const publish = async (quizId: string) => {
        setLoading(true);
        setError(null);
        try {
            await publishQuiz(quizId);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to publish quiz'));
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { publish, loading, error };
};

export const useGenerateQuizCode = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const generate = async (quizId: string): Promise<GenerateCodeResponse> => {
        setLoading(true);
        setError(null);
        try {
            const res = await generateQuizCode(quizId);
            return res;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to generate quiz code'));
            throw err;
        } finally {
            setLoading(false);
        }
    }

    return { generate, loading, error };
}

export const useQuizStatistics = (quizId?: string) => {
    const [data, setData] = useState<QuizStatistics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [trigger, setTrigger] = useState(0);

    const refetch = useCallback(() => {
        setTrigger(prev => prev + 1);
    }, []);

    useEffect(() => {
        if (!quizId) {
             setLoading(false);
             return;
        }

        const fetchStats = async () => {
            setLoading(true);
            setError(null);
            try {
                const stats = await getQuizStatistics(quizId);
                setData(stats);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to fetch quiz statistics'));
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [quizId, trigger]);

     return { data, loading, error, refetch };
}


// ==================== Student Quiz Hooks ====================

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
            const res = await submitQuiz(data);
            return res;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to submit quiz'));
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { submit, loading, error };
};

export const useCheckPracticeAnswer = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const check = async (data: CheckPracticeAnswerRequest): Promise<CheckPracticeAnswerResponse> => {
    setLoading(true);
    setError(null);
    try {
      const res = await checkPracticeAnswer(data);
      return res;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to check answer'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { check, loading, error };
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

export const useMyOngoingQuizzes = () => {
    const [data, setData] = useState<ApiOngoingQuiz[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [trigger, setTrigger] = useState(0);

    const refetch = useCallback(() => {
        setTrigger(prev => prev + 1);
    }, []);

    useEffect(() => {
        const fetchOngoing = async () => {
            setLoading(true);
            setError(null);
            try {
                const ongoing = await getMyOngoingQuizzes();
                setData(ongoing);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to fetch ongoing quizzes'));
            } finally {
                setLoading(false);
            }
        };

        fetchOngoing();
    }, [trigger]);

    return { data, loading, error, refetch };
};


export const useQuizReview = (attemptId?: string) => {
    const [data, setData] = useState<QuizAttemptReview | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!attemptId) {
             setLoading(false);
             return;
        }

        const fetchReview = async () => {
            setLoading(true);
            setError(null);
            try {
                const review = await reviewAttempt(attemptId);
                setData(review);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to fetch review'));
            } finally {
                setLoading(false);
            }
        };

        fetchReview();
    }, [attemptId]);

    return { data, loading, error };
};

export const useJoinQuizByCode = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const join = async (code: string, joinClass: boolean): Promise<JoinQuizResponse> => {
        setLoading(true);
        setError(null);
        try {
            const res = await joinQuizByCode(code, joinClass);
            return res;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to join quiz'));
            // Re-throw so component can handle it (show specific error message)
            throw err; 
        } finally {
            setLoading(false);
        }
    }

    return { join, loading, error };
}

export const useStudentTeacherQuizzes = () => {
    const [data, setData] = useState<StudentTeacherQuiz[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [trigger, setTrigger] = useState(0);

    const refetch = useCallback(() => {
        setTrigger(prev => prev + 1);
    }, []);

    useEffect(() => {
        const fetchQuizzes = async () => {
            setLoading(true);
            setError(null);
            try {
                const quizzes = await getStudentTeacherQuizzes();
                setData(quizzes);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to fetch teacher quizzes for student'));
            } finally {
                setLoading(false);
            }
        };

        fetchQuizzes();
    }, [trigger]);

    return { data, loading, error, refetch };
}
