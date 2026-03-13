import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateQuiz, useUpdateQuiz, useQuiz } from "@/hooks/useQuizzes";
import { useMyCourses, useCourseDetail } from "@/hooks/useCourses";
import { useMyQuestions, useMyLessonNames } from "@/hooks/useQuestions";
import {
  getLessonById,
  getLessonItemById,
  getLessonsByCourseId,
} from "@/services/lessonService";
import { toast } from "@/components/common/Toast";
import type { 
    CreateQuizRequest, 
    DynamicConfig, 
    StaticQuestion 
} from "@/types/quiz";
import type { Question } from "@/types/question";
import type { ApiLesson } from "@/types/learningTypes";

export const useExamFormLogic = (id: string | undefined) => {
  const isEditMode = !!id;
  const navigate = useNavigate();

  const { mutateAsync: createQuiz, isPending: creating } = useCreateQuiz();
  const { mutateAsync: updateQuiz, isPending: updating } = useUpdateQuiz();
  const {
    data: quizDetail,
    isLoading: quizLoading,
  } = useQuiz(id);

  // Basic Form Data
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: 60,
    maxAttempts: 1,
    passingScore: 50,
    shuffleQuestions: true,
    isDynamic: true,
    type: "PRACTICE" as "PRACTICE" | "QUIZ",
    closeTime: "",
    showScoreAfterSubmit: true,
    showResultAfterSubmit: true,
    isPublished: true,
  });

  // Course & Lesson Selection state
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [selectedLessonId, setSelectedLessonId] = useState<string>("");
  const [selectedLessonItemId, setSelectedLessonItemId] = useState<string>("");

  // Dynamic Config State
  const [dynamicConfigs, setDynamicConfigs] = useState<DynamicConfig[]>([
    {
      targetLessonId: "",
      difficulty: "EASY",
      quantity: 10,
      scorePerQuestion: 1,
    },
  ]);

  // Static Question State
  const [staticQuestions, setStaticQuestions] = useState<StaticQuestion[]>([]);
  const questionContentCacheRef = useRef<Record<string, string>>({});

  // Question Bank Fetching
  const [questionSearch, setQuestionSearch] = useState("");
  const [qPage, setQPage] = useState(1);
  const [qPageSize, setQPageSize] = useState(10);
  const [qLessonName, setQLessonName] = useState<string>("");

  const { data: myLessonNames = [] } = useMyLessonNames();

  const {
    data: availableQuestionsResponse,
    isLoading: loadingQuestions,
    isFetching: fetchingQuestions,
  } = useMyQuestions({
    pageNo: qPage - 1 > 0 ? qPage - 1 : 0,
    pageSize: qPageSize,
    lessonName: qLessonName || undefined,
  });
  const availableQuestions = availableQuestionsResponse?.items || [];
  const qTotalPages = availableQuestionsResponse?.totalPage || 0;

  // Fetch courses
  const { data: coursesData } = useMyCourses({ pageNo: 0, pageSize: 50 });
  const courses = (coursesData as any)?.items || [];
  const { data: courseDetail } = useCourseDetail(selectedCourseId || undefined);
  const lessons: ApiLesson[] = (courseDetail as any)?.lessons || [];

  // Fetch lesson items when lesson changes
  const [lessonItems, setLessonItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchLessonItems = async () => {
      if (selectedLessonId) {
        try {
          const lessonData = await getLessonById(selectedLessonId);
          if (lessonData && lessonData.lessonItems) {
            setLessonItems(lessonData.lessonItems);
          } else {
            setLessonItems([]);
          }
        } catch (error) {
          console.error("Failed to fetch lesson items", error);
          setLessonItems([]);
        }
      } else {
        setLessonItems([]);
      }
    };
    fetchLessonItems();
  }, [selectedLessonId]);

  // Set selectedLessonItemId after lessonItems are loaded (for edit mode)
  useEffect(() => {
    if (isEditMode && quizDetail?.lessonItemId && lessonItems.length > 0) {
      const exists = lessonItems.some(
        (item) => item.id === quizDetail.lessonItemId,
      );
      if (exists) {
        setSelectedLessonItemId(quizDetail.lessonItemId);
      }
    }
  }, [isEditMode, quizDetail?.lessonItemId, lessonItems]);

  // Resolve hierarchy for editing (Course > Lesson > LessonItem)
  useEffect(() => {
    const resolveHierarchy = async () => {
      if (!isEditMode || !quizDetail?.lessonItemId) return;
      if (!courses || courses.length === 0) return;

      try {
        const lessonItem = await getLessonItemById(quizDetail.lessonItemId);

        if (lessonItem && (lessonItem as any).lessonId) {
          const lessonId = (lessonItem as any).lessonId;
          setSelectedLessonId(lessonId);

          const lesson = await getLessonById(lessonId);
          if (lesson && lesson.courseId) {
            setSelectedCourseId(lesson.courseId);
          }
          return;
        }

        for (const course of courses) {
          try {
            const lessons = await getLessonsByCourseId(course.id);
            if (!lessons || lessons.length === 0) continue;

            for (const lesson of lessons) {
              const items = lesson.lessonItems || [];
              const found = items.some(
                (item) => item.id === quizDetail.lessonItemId,
              );

              if (found) {
                setSelectedCourseId(course.id);
                setSelectedLessonId(lesson.id);
                return;
              }
            }
          } catch (e) {
            console.warn("Error fetching lessons for course", course.id, e);
          }
        }
      } catch (error) {
        console.error("Error resolving hierarchy:", error);
      }
    };

    if (quizDetail && courses && courses.length > 0) {
      resolveHierarchy();
    }
  }, [isEditMode, quizDetail, courses]);

  // Populate form data when quizDetail is loaded
  useEffect(() => {
    if (quizDetail && isEditMode) {
      const qd = quizDetail;

      setFormData({
        title: qd.title || "",
        description: qd.description || "",
        duration: qd.durationInMinutes ?? 60,
        maxAttempts: qd.maxAttempts ?? 1,
        passingScore: qd.passScore ?? 50,
        shuffleQuestions: true,
        isDynamic: qd.isDynamic ?? true,
        type: qd.type || "PRACTICE",
        closeTime: qd.closeTime || "",
        showScoreAfterSubmit: qd.showScoreAfterSubmit ?? true,
        showResultAfterSubmit: qd.showResultAfterSubmit ?? true,
        isPublished: qd.isPublished ?? true,
      });

      if (qd.isDynamic && qd.dynamicConfigs && qd.dynamicConfigs.length > 0) {
        setDynamicConfigs(
          qd.dynamicConfigs.map((apiConfig) => ({
            targetLessonId: (apiConfig as any).targetLessonId || selectedLessonId || "",
            difficulty: apiConfig.difficulty,
            quantity: apiConfig.quantity,
            scorePerQuestion: apiConfig.pointsPerQuestion,
          })),
        );
      }

      if (
        !qd.isDynamic &&
        qd.staticQuestions &&
        qd.staticQuestions.length > 0
      ) {
        const mappedQuestions = qd.staticQuestions.map((sq, index) => ({
          questionId: sq.id,
          score: sq.defaultScore || 1,
          order: index + 1,
          questionContent: sq.content,
        }));
        setStaticQuestions(mappedQuestions);
      }
    }
  }, [quizDetail, isEditMode, selectedLessonId]);

  const toggleStaticQuestion = (question: Question) => {
    const exists = staticQuestions.find((sq) => sq.questionId === question.id);
    if (exists) {
      setStaticQuestions(
        staticQuestions.filter((sq) => sq.questionId !== question.id),
      );
    } else {
      if (question.content) {
        questionContentCacheRef.current[question.id] = question.content;
      }
      setStaticQuestions([
        ...staticQuestions,
        {
          questionId: question.id,
          score: question.defaultScore || 1,
          order: staticQuestions.length + 1,
          questionContent: question.content,
        },
      ]);
    }
  };

  const handleSelectAllDisplayed = () => {
    const isAllDisplayedSelected =
        availableQuestions.length > 0 &&
        availableQuestions.every((q) =>
            staticQuestions.some((sq) => sq.questionId === q.id),
        );

    if (isAllDisplayedSelected) {
      const displayedIds = new Set(availableQuestions.map((q) => q.id));
      setStaticQuestions(
        staticQuestions.filter((sq) => !displayedIds.has(sq.questionId)),
      );
    } else {
      const notYetSelected = availableQuestions.filter(
        (q) => !staticQuestions.some((sq) => sq.questionId === q.id),
      );
      notYetSelected.forEach((q) => {
        if (q.content) {
          questionContentCacheRef.current[q.id] = q.content;
        }
      });
      const newSelections = notYetSelected.map((q, index) => ({
        questionId: q.id,
        score: q.defaultScore || 1,
        order: staticQuestions.length + index + 1,
        questionContent: q.content,
      }));
      setStaticQuestions([...staticQuestions, ...newSelections]);
    }
  };

  const updateStaticQuestion = (
    questionId: string,
    field: keyof StaticQuestion,
    value: any,
  ) => {
    setStaticQuestions(
      staticQuestions.map((sq) =>
        sq.questionId === questionId ? { ...sq, [field]: value } : sq,
      ),
    );
  };

  const moveQuestion = useCallback((from: number, to: number) => {
    setStaticQuestions((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(from, 1);
      updated.splice(to, 0, moved);
      return updated.map((sq, idx) => ({ ...sq, order: idx + 1 }));
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCourseId) {
      toast.error("Vui lòng chọn khóa học");
      return;
    }

    if (!selectedLessonId) {
      toast.error("Vui lòng chọn bài học (Module)");
      return;
    }

    if (!selectedLessonItemId) {
      toast.error("Vui lòng chọn nội dung (Quiz)");
      return;
    }

    if (!formData.isDynamic && staticQuestions.length === 0) {
      toast.error("Vui lòng chọn ít nhất 1 câu hỏi cho chế độ thủ công");
      return;
    }

    if (formData.closeTime) {
      const closeDate = new Date(formData.closeTime);
      if (closeDate <= new Date()) {
        toast.error("Thời gian đóng đề phải lớn hơn thời gian hiện tại");
        return;
      }
    }

    const quizData: CreateQuizRequest = {
      title: formData.title,
      description: formData.description,
      lessonItemId: selectedLessonItemId,
      durationInMinutes: formData.duration,
      passScore: formData.passingScore,
      maxAttempts: formData.type === "PRACTICE" ? null : formData.maxAttempts,
      shuffleQuestions: formData.shuffleQuestions,
      isDynamic: formData.isDynamic,
      type: formData.type,
      closeTime: formData.closeTime ? `${formData.closeTime}:00` : null,
      showScoreAfterSubmit: formData.showScoreAfterSubmit,
      showResultAfterSubmit: formData.showResultAfterSubmit,
      isPublished: formData.isPublished,
      dynamicConfigs: formData.isDynamic
        ? dynamicConfigs.map((config) => ({
            targetLessonId: config.targetLessonId || selectedLessonId,
            difficulty: config.difficulty,
            quantity: config.quantity,
            scorePerQuestion: config.scorePerQuestion,
          }))
        : [],
      staticQuestions: formData.isDynamic
        ? []
        : staticQuestions.map(({ questionContent, ...rest }) => rest),
    };

    try {
      if (isEditMode && id) {
        await updateQuiz({ id, data: quizData });
        toast.success("Cập nhật bài kiểm tra thành công");
      } else {
        await createQuiz(quizData);
        toast.success("Tạo bài kiểm tra thành công");
      }
      navigate("/teacher/quizzes");
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra");
    }
  };

  return {
    isEditMode,
    creating,
    updating,
    quizLoading,
    formData,
    setFormData,
    selectedCourseId,
    setSelectedCourseId,
    selectedLessonId,
    setSelectedLessonId,
    selectedLessonItemId,
    setSelectedLessonItemId,
    dynamicConfigs,
    setDynamicConfigs,
    staticQuestions,
    toggleStaticQuestion,
    handleSelectAllDisplayed,
    updateStaticQuestion,
    moveQuestion,
    handleSubmit,
    questionContentCache: questionContentCacheRef.current,
    questionSearch,
    setQuestionSearch,
    qPage,
    setQPage,
    qPageSize,
    setQPageSize,
    qLessonName,
    setQLessonName,
    myLessonNames,
    availableQuestions,
    loadingQuestions,
    fetchingQuestions,
    qTotalPages,
    courses,
    lessons,
    lessonItems,
  };
};
