import { useState, useEffect, useRef, useCallback } from "react";
import { format, isValid } from "date-fns";
import { vi } from "date-fns/locale";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCreateQuiz, useUpdateQuiz, useQuiz } from "@/hooks/useQuizzes";
import { useMyCourses, useCourseDetail } from "@/hooks/useCourses";
import { useMyQuestions, useMyLessonNames } from "@/hooks/useQuestions";
import {
  getLessonById,
  getLessonItemById,
  getLessonsByCourseId,
} from "@/services/lessonService";
import type {
  CreateQuizRequest,
  DynamicConfig,
  StaticQuestion,
} from "@/types/quiz";
import type { Question } from "@/types/question";
import { toast } from "@/components/common/Toast";
import LoadingOverlay from "@/components/common/LoadingOverlay";
import { FaCircleNotch } from "react-icons/fa";
import Breadcrumb from "@/components/common/Breadcrumb";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const DRAG_TYPE = "QUESTION_ROW";

interface DraggableRowProps {
  index: number;
  sq: StaticQuestion;
  cachedContent: string | undefined;
  onMove: (from: number, to: number) => void;
  onScoreChange: (questionId: string, score: number) => void;
  onDelete: (questionId: string) => void;
}

const DraggableRow = ({
  index,
  sq,
  cachedContent,
  onMove,
  onScoreChange,
  onDelete,
}: DraggableRowProps) => {
  const ref = useRef<HTMLTableRowElement>(null);

  const [{ isDragging }, drag, dragPreview] = useDrag({
    type: DRAG_TYPE,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop<
    { index: number },
    void,
    { isOver: boolean }
  >({
    accept: DRAG_TYPE,
    hover(item) {
      if (item.index === index) return;
      onMove(item.index, index);
      item.index = index;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  dragPreview(drop(ref));

  return (
    <tr
      ref={ref}
      style={{ opacity: isDragging ? 0.4 : 1 }}
      className={`transition-colors ${
        isOver ? "bg-blue-50" : "hover:bg-slate-50"
      }`}
    >
      {/* Drag Handle */}
      <td className="px-3 py-3 w-8">
        <div
          ref={drag as unknown as React.Ref<HTMLDivElement>}
          className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 flex items-center justify-center"
          title="Kéo để sắp xếp"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <circle cx="5" cy="4" r="1.5" />
            <circle cx="11" cy="4" r="1.5" />
            <circle cx="5" cy="8" r="1.5" />
            <circle cx="11" cy="8" r="1.5" />
            <circle cx="5" cy="12" r="1.5" />
            <circle cx="11" cy="12" r="1.5" />
          </svg>
        </div>
      </td>
      {/* Order number badge */}
      <td className="py-3 w-8">
        <span className="text-xs font-bold text-slate-400">{index + 1}</span>
      </td>
      {/* Question content */}
      <td className="px-4 py-3">
        <div
          className="line-clamp-1"
          dangerouslySetInnerHTML={{
            __html:
              cachedContent || sq.questionContent || "(Không có nội dung)",
          }}
        />
      </td>
      {/* Score input */}
      <td className="px-4 py-3">
        <input
          type="number"
          className="w-16 h-8 border border-slate-200 rounded px-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
          value={sq.score}
          onChange={(e) =>
            onScoreChange(sq.questionId, parseFloat(e.target.value))
          }
          min={0.5}
          step={0.5}
        />
      </td>
      {/* Delete button */}
      <td className="px-4 py-3 text-center">
        <button
          type="button"
          onClick={() => onDelete(sq.questionId)}
          className="text-red-400 hover:text-red-600 transition-colors"
          title="Xóa câu hỏi"
        >
          <span className="material-symbols-outlined text-lg">delete</span>
        </button>
      </td>
    </tr>
  );
};

const ExamFormPage = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();

  const { mutateAsync: createQuiz, isPending: creating } = useCreateQuiz();
  const { mutateAsync: updateQuiz, isPending: updating } = useUpdateQuiz();
  const {
    data: quizDetail,
    isLoading: quizLoading,
    // error: quizError,
  } = useQuiz(id);

  // Basic Form Data
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    duration: number;
    maxAttempts: number;
    passingScore: number;
    shuffleQuestions: boolean;
    isDynamic: boolean;
    type: "PRACTICE" | "QUIZ";
    closeTime: string;
    showScoreAfterSubmit: boolean;
    showResultAfterSubmit: boolean;
    isPublished: boolean;
  }>({
    title: "",
    description: "",
    duration: 60,
    maxAttempts: 1,
    passingScore: 50,
    shuffleQuestions: true,
    isDynamic: true,
    type: "PRACTICE",
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
  // Cache content câu hỏi đã chọn — persist qua mọi trang (dùng ref để không trigger re-render)
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
  const courses = coursesData?.items || [];
  const { data: courseDetail } = useCourseDetail(selectedCourseId || undefined);
  const lessons = courseDetail?.lessons || [];

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
      // Only set if the lessonItemId exists in the current lessonItems
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
        // Method 1: Try to get lessonId from lesson-items API
        const lessonItem = await getLessonItemById(quizDetail.lessonItemId);
        // console.log("Resolved Lesson Item:", lessonItem);

        if (lessonItem && (lessonItem as any).lessonId) {
          const lessonId = (lessonItem as any).lessonId;
          setSelectedLessonId(lessonId);

          const lesson = await getLessonById(lessonId);
          // console.log("Resolved Lesson:", lesson);

          if (lesson && lesson.courseId) {
            setSelectedCourseId(lesson.courseId);
          }
          return; // Success, exit early
        }

        for (const course of courses) {
          try {
            // Use getLessonsByCourseId to get lessons with lessonItems
            const lessons = await getLessonsByCourseId(course.id);
            // console.log("Course", course.id, "has", lessons.length, "lessons");

            if (!lessons || lessons.length === 0) continue;

            for (const lesson of lessons) {
              const items = lesson.lessonItems || [];
              // console.log("Lesson", lesson.id, "has", items.length, "items");

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
            // Continue to next course
          }
        }
        console.warn("❌ Could not find lessonItem in any course");
      } catch (error) {
        console.error("Error resolving hierarchy:", error);
      }
    };

    // Only run when BOTH quizDetail AND courses are loaded
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
        shuffleQuestions: true, // Not returned from API, default to true
        isDynamic: qd.isDynamic ?? true,
        type: qd.type || "PRACTICE",
        closeTime: qd.closeTime || "",
        showScoreAfterSubmit: qd.showScoreAfterSubmit ?? true,
        showResultAfterSubmit: qd.showResultAfterSubmit ?? true,
        isPublished: qd.isPublished ?? true,
      });

      // Populate Dynamic Config - map from API response format to form format
      if (qd.isDynamic && qd.dynamicConfigs && qd.dynamicConfigs.length > 0) {
        setDynamicConfigs(
          qd.dynamicConfigs.map((apiConfig) => ({
            targetLessonId:
              (apiConfig as any).targetLessonId || selectedLessonId || "", // Will be resolved by hierarchy
            difficulty: apiConfig.difficulty,
            quantity: apiConfig.quantity,
            scorePerQuestion: apiConfig.pointsPerQuestion,
          })),
        );
      }

      // Populate Static Questions - map from API response format to form format
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
      // Không xóa khỏi cache — giữ lại phòng trường hợp người dùng chọn lại
    } else {
      // Lưu content vào cache ref ngay khi chọn
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

  const isAllDisplayedSelected =
    availableQuestions.length > 0 &&
    availableQuestions.every((q) =>
      staticQuestions.some((sq) => sq.questionId === q.id),
    );

  const handleSelectAllDisplayed = () => {
    if (isAllDisplayedSelected) {
      const displayedIds = new Set(availableQuestions.map((q) => q.id));
      setStaticQuestions(
        staticQuestions.filter((sq) => !displayedIds.has(sq.questionId)),
      );
    } else {
      const notYetSelected = availableQuestions.filter(
        (q) => !staticQuestions.some((sq) => sq.questionId === q.id),
      );
      // Lưu content tất cả câu hỏi trang này vào cache ref
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

  // Reorder handler: kéo từ vị trí `from` sang `to`, cập nhật lại `order`
  const moveQuestion = useCallback((from: number, to: number) => {
    setStaticQuestions((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(from, 1);
      updated.splice(to, 0, moved);
      // Recalculate order theo vị trí mới
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

  return (
    <div className="space-y-6 pb-24">
      <LoadingOverlay
        isLoading={creating || updating || quizLoading}
        message={isEditMode ? "Đang cập nhật..." : "Đang tạo bài thi..."}
      />
      {/* Breadcrumbs */}
      <Breadcrumb
        items={[
          { label: "Đề thi", url: "/teacher/quizzes" },
          { label: isEditMode ? "Chỉnh sửa" : "Tạo mới" },
        ]}
        className="flex items-center gap-2 text-sm font-medium"
        itemClassName="text-slate-500 hover:text-[#0074bd] transition-colors"
        activeItemClassName="text-[#111518]"
        separator={<span className="text-slate-400">/</span>}
      />

      {/* Page Heading */}
      <div>
        <h2 className="text-3xl font-black text-[#111518] tracking-tight">
          {isEditMode ? "Chỉnh sửa đề thi" : "Thiết lập bài thi"}
        </h2>
        <p className="text-slate-500 mt-2">
          Cấu hình các thông số và câu hỏi cho bài kiểm tra của bạn.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Thông tin chung */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h3 className="text-lg font-bold text-[#111518]">
              Thông tin chung
            </h3>
            {/* Publish Toggle */}
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-sm font-semibold text-slate-700">
                Công khai
              </span>
              <div className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isPublished}
                  onChange={(e) =>
                    setFormData({ ...formData, isPublished: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
              </div>
            </label>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[#111518] mb-2">
                  Tiêu đề bài thi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full h-12 rounded-lg border border-slate-200 bg-white px-4 focus:outline-none focus:ring-2 focus:ring-[#1E90FF] focus:border-[#1E90FF] outline-none transition-all"
                  placeholder="Nhập tên bài thi..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#111518] mb-2">
                  Loại bài thi
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      type: e.target.value as "PRACTICE" | "QUIZ",
                    })
                  }
                  className="w-full h-12 rounded-lg border border-slate-200 bg-white px-4 focus:outline-none focus:ring-2 focus:ring-[#1E90FF] focus:border-[#1E90FF] outline-none transition-all"
                >
                  <option value="PRACTICE">Luyện tập (Practice)</option>
                  <option value="QUIZ">Kiểm tra (Quiz)</option>
                </select>
              </div>
            </div>

            <div className="max-w-full">
              <label className="block text-sm font-semibold text-[#111518] mb-2">
                Mô tả ngắn
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1E90FF] focus:border-[#1E90FF] outline-none transition-all"
                placeholder="Nhập mô tả cho sinh viên..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[#111518] mb-2">
                  Khóa học
                </label>
                <select
                  className="w-full h-12 rounded-lg border border-slate-200 bg-white px-4 focus:outline-none focus:ring-2 focus:ring-[#1E90FF] focus:border-[#1E90FF] outline-none transition-all"
                  value={selectedCourseId}
                  onChange={(e) => {
                    setSelectedCourseId(e.target.value);
                    setSelectedLessonId("");
                    setSelectedLessonItemId("");
                  }}
                  required
                >
                  <option value="">-- Chọn khóa học --</option>
                  {courses?.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#111518] mb-2">
                  Bài học (Module)
                </label>
                <select
                  className="w-full h-12 rounded-lg border border-slate-200 bg-white px-4 focus:outline-none focus:ring-2 focus:ring-[#1E90FF] focus:border-[#1E90FF] outline-none transition-all"
                  value={selectedLessonId}
                  onChange={(e) => {
                    setSelectedLessonId(e.target.value);
                    setSelectedLessonItemId("");
                  }}
                  disabled={!selectedCourseId}
                  required
                >
                  <option value="">-- Chọn bài học --</option>
                  {lessons.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#111518] mb-2">
                  Nội dung (Quiz)
                </label>
                <select
                  className="w-full h-12 rounded-lg border border-slate-200 bg-white px-4 focus:outline-none focus:ring-2 focus:ring-[#1E90FF] focus:border-[#1E90FF] outline-none transition-all"
                  value={selectedLessonItemId}
                  onChange={(e) => setSelectedLessonItemId(e.target.value)}
                  // Enable this even if lesson is not selected yet, to show value, but technically need lesson items
                  // We rely on resolveHierarchy to set selectedLessonId which then fetches items
                  disabled={!selectedLessonId}
                  required
                >
                  <option value="">-- Chọn nội dung --</option>
                  {lessonItems.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Cấu hình */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-lg font-bold text-[#111518]">Cấu hình</h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[#111518] mb-2">
                  Thời gian làm bài (phút)
                </label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      duration: parseInt(e.target.value),
                    })
                  }
                  className="w-full h-12 rounded-lg border border-slate-200 bg-white px-4 focus:ring-2 focus:ring-[#1E90FF] focus:border-[#1E90FF] outline-none"
                  min={1}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#111518] mb-2">
                  Số lần thử tối đa
                </label>
                <select
                  value={
                    formData.type === "PRACTICE" ? "" : formData.maxAttempts
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxAttempts:
                        e.target.value === "" ? 1 : parseInt(e.target.value),
                    })
                  }
                  disabled={formData.type === "PRACTICE"}
                  className="w-full h-12 rounded-lg border border-slate-200 bg-white px-4 focus:ring-2 focus:ring-[#1E90FF] focus:border-[#1E90FF] outline-none disabled:bg-slate-100 disabled:text-slate-500"
                >
                  {formData.type === "PRACTICE" && (
                    <option value="">Không giới hạn</option>
                  )}
                  {[1, 2, 3, 4, 5, 10].map((num) => (
                    <option key={num} value={num}>
                      {num} lần
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#111518] mb-2">
                  Điểm chuẩn (%)
                </label>
                <input
                  type="number"
                  value={formData.passingScore}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      passingScore: parseInt(e.target.value),
                    })
                  }
                  className="w-full h-12 rounded-lg border border-slate-200 bg-white px-4 focus:ring-2 focus:ring-[#1E90FF] focus:border-[#1E90FF] outline-none"
                  min={0}
                  max={100}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[#111518] mb-2">
                  Thời gian đóng đề (Hạn chót)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="date"
                    value={
                      formData.closeTime ? formData.closeTime.split("T")[0] : ""
                    }
                    onChange={(e) => {
                      const date = e.target.value;
                      const time = formData.closeTime
                        ? formData.closeTime.split("T")[1]
                        : "00:00";
                      if (date) {
                        setFormData({
                          ...formData,
                          closeTime: `${date}T${time}`,
                        });
                      } else {
                        setFormData({ ...formData, closeTime: "" });
                      }
                    }}
                    className="flex-1 h-12 rounded-lg border border-slate-200 bg-white px-4 focus:ring-2 focus:ring-[#1E90FF] focus:border-[#1E90FF] outline-none"
                  />
                  <input
                    type="time"
                    value={
                      formData.closeTime
                        ? formData.closeTime.split("T")[1]?.substring(0, 5)
                        : ""
                    }
                    onChange={(e) => {
                      const time = e.target.value;
                      const date = formData.closeTime
                        ? formData.closeTime.split("T")[0]
                        : "";
                      if (date && time) {
                        setFormData({
                          ...formData,
                          closeTime: `${date}T${time}`,
                        });
                      }
                    }}
                    className="min-w-36 h-12 rounded-lg border border-slate-200 bg-white px-4 focus:ring-2 focus:ring-[#1E90FF] focus:border-[#1E90FF] outline-none"
                  />
                </div>

                {formData.closeTime &&
                  isValid(new Date(formData.closeTime)) && (
                    <p className="text-sm text-[#1E90FF] font-medium flex items-center gap-1">
                      <span className="material-symbols-outlined text-lg">
                        event
                      </span>
                      {format(
                        new Date(formData.closeTime),
                        "HH:mm 'ngày' dd/MM/yyyy (EEEE)",
                        { locale: vi },
                      )}
                    </p>
                  )}
                {!formData.closeTime && (
                  <p className="text-xs text-slate-500 mt-1">
                    Để trống nếu không có hạn chót
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-3 justify-center">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.showScoreAfterSubmit}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        showScoreAfterSubmit: e.target.checked,
                      })
                    }
                    className="w-4 h-4 rounded border-gray-300 text-[#1E90FF] focus:ring-[#1E90FF]"
                  />
                  <span className="text-sm font-medium text-[#111518]">
                    Hiển thị điểm sau khi nộp
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.showResultAfterSubmit}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        showResultAfterSubmit: e.target.checked,
                      })
                    }
                    className="w-4 h-4 rounded border-gray-300 text-[#1E90FF] focus:ring-[#1E90FF]"
                  />
                  <span className="text-sm font-medium text-[#111518]">
                    Hiển thị đáp án chi tiết
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.shuffleQuestions}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        shuffleQuestions: e.target.checked,
                      })
                    }
                    className="w-4 h-4 rounded border-gray-300 text-[#1E90FF] focus:ring-[#1E90FF]"
                  />
                  <span className="text-sm font-medium text-[#111518]">
                    Xáo trộn câu hỏi
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Chọn câu hỏi */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h3 className="text-lg font-bold text-[#111518]">
              Cấu hình câu hỏi
            </h3>
            {!isEditMode && (
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm font-bold ${!formData.isDynamic ? "text-[#0074bd]" : "text-slate-400"}`}
                >
                  Thủ công
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isDynamic}
                    onChange={(e) =>
                      setFormData({ ...formData, isDynamic: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1E90FF]"></div>
                </label>
                <span
                  className={`text-sm font-bold ${formData.isDynamic ? "text-[#1E90FF]" : "text-slate-400"}`}
                >
                  Tự động (Dynamic)
                </span>
              </div>
            )}
          </div>
          <div className="p-6">
            {formData.isDynamic ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-sm text-slate-500">
                    Hệ thống sẽ tự động chọn câu hỏi ngẫu nhiên dựa trên các cấu
                    hình dưới đây.
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      setDynamicConfigs([
                        ...dynamicConfigs,
                        {
                          targetLessonId: "",
                          difficulty: "EASY",
                          quantity: 10,
                          scorePerQuestion: 1,
                        },
                      ])
                    }
                    className="text-sm font-semibold text-[#1E90FF] hover:text-[#0074bd] flex items-center gap-1 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors border border-blue-100"
                  >
                    <span className="material-symbols-outlined text-base">
                      add_circle
                    </span>
                    Thêm cấu hình
                  </button>
                </div>

                <div className="space-y-4">
                  {dynamicConfigs.map((config, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-xl bg-slate-50 relative group"
                    >
                      {dynamicConfigs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newConfigs = [...dynamicConfigs];
                            newConfigs.splice(index, 1);
                            setDynamicConfigs(newConfigs);
                          }}
                          className="absolute -top-3 -right-3 bg-white text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all border shadow-sm"
                          title="Xóa cấu hình"
                        >
                          <span className="material-symbols-outlined text-sm">
                            close
                          </span>
                        </button>
                      )}
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">
                          Độ khó
                        </label>
                        <select
                          value={config.difficulty}
                          onChange={(e) => {
                            const newConfigs = [...dynamicConfigs];
                            newConfigs[index].difficulty = e.target
                              .value as any;
                            setDynamicConfigs(newConfigs);
                          }}
                          className="w-full h-10 rounded-lg border border-slate-200 px-3 text-sm focus:ring-[#1E90FF] focus:border-[#1E90FF]"
                        >
                          <option value="EASY">Dễ</option>
                          <option value="MEDIUM">Vừa</option>
                          <option value="HARD">Khó</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">
                          Số lượng câu
                        </label>
                        <input
                          type="number"
                          value={config.quantity}
                          onChange={(e) => {
                            const newConfigs = [...dynamicConfigs];
                            newConfigs[index].quantity =
                              parseInt(e.target.value) || 0;
                            setDynamicConfigs(newConfigs);
                          }}
                          className="w-full h-10 rounded-lg border border-slate-200 px-3 text-sm focus:ring-[#1E90FF] focus:border-[#1E90FF]"
                          min={1}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">
                          Điểm mỗi câu
                        </label>
                        <input
                          type="number"
                          value={config.scorePerQuestion}
                          onChange={(e) => {
                            const newConfigs = [...dynamicConfigs];
                            newConfigs[index].scorePerQuestion =
                              parseFloat(e.target.value) || 0;
                            setDynamicConfigs(newConfigs);
                          }}
                          className="w-full h-10 rounded-lg border border-slate-200 px-3 text-sm focus:ring-[#1E90FF] focus:border-[#1E90FF]"
                          min={0.5}
                          step={0.5}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">
                          Nguồn câu hỏi (Bài học)
                        </label>
                        <select
                          value={config.targetLessonId || ""}
                          onChange={(e) => {
                            const newConfigs = [...dynamicConfigs];
                            newConfigs[index].targetLessonId = e.target.value;
                            setDynamicConfigs(newConfigs);
                          }}
                          className="w-full h-10 rounded-lg border border-slate-200 px-3 text-sm focus:ring-[#1E90FF] focus:border-[#1E90FF]"
                        >
                          <option value="">
                            (Tự động theo bài học hiện tại)
                          </option>
                          {lessons.map((l) => (
                            <option key={l.id} value={l.id}>
                              {l.title}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // STATIC QUESTIONS SELECTION UI
              <div className="space-y-6">
                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="flex-1 min-w-[200px]">
                    <input
                      type="text"
                      placeholder="Tìm kiếm câu hỏi..."
                      className="w-full h-10 rounded border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                      value={questionSearch}
                      onChange={(e) => {
                        setQuestionSearch(e.target.value);
                        setQPage(1); // Reset to page 1 on search
                      }}
                    />
                  </div>
                  <div className="min-w-[200px]">
                    <select
                      value={qLessonName}
                      onChange={(e) => {
                        setQLessonName(e.target.value);
                        setQPage(1);
                      }}
                      className="w-full h-10 rounded border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                    >
                      <option value="">Tất cả bài học</option>
                      {myLessonNames.map((name, idx) => (
                        <option key={idx} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-700 font-semibold border-b">
                      <tr>
                        <th className="px-4 py-3 w-10">
                          <input
                            type="checkbox"
                            checked={isAllDisplayedSelected}
                            onChange={handleSelectAllDisplayed}
                            disabled={
                              !availableQuestions ||
                              availableQuestions.length === 0
                            }
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer disabled:cursor-not-allowed"
                            title="Chọn tất cả trang này"
                          />
                        </th>
                        <th className="px-4 py-3">Nội dung câu hỏi</th>
                        <th className="px-4 py-3 w-28">Loại</th>
                        <th className="px-4 py-3 w-28">Độ khó</th>
                      </tr>
                    </thead>
                    <tbody
                      className={`divide-y divide-slate-100 transition-opacity duration-200 ${fetchingQuestions && !loadingQuestions ? "opacity-50 pointer-events-none" : ""}`}
                    >
                      {loadingQuestions ? (
                        <tr>
                          <td colSpan={4} className="p-4 text-center">
                            Đang tải câu hỏi...
                          </td>
                        </tr>
                      ) : availableQuestions?.length === 0 ? (
                        <tr>
                          <td
                            colSpan={4}
                            className="p-4 text-center text-slate-500"
                          >
                            Không tìm thấy câu hỏi nào.
                          </td>
                        </tr>
                      ) : (
                        availableQuestions?.map((q) => {
                          const isSelected = staticQuestions.some(
                            (sq) => sq.questionId === q.id,
                          );
                          return (
                            <tr
                              key={q.id}
                              className={
                                isSelected ? "bg-blue-50" : "hover:bg-slate-50"
                              }
                            >
                              <td className="px-4 py-3">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => toggleStaticQuestion(q)}
                                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                              </td>
                              <td className="px-4 py-3">
                                <div
                                  className="line-clamp-2"
                                  dangerouslySetInnerHTML={{
                                    __html: q.content,
                                  }}
                                />
                              </td>
                              <td className="px-4 py-3">
                                <span className="text-xs px-2 py-1 rounded bg-slate-100 text-slate-600">
                                  {q.type === "SINGLE_CHOICE"
                                    ? "1 Đáp án"
                                    : "Nhiều ĐA"}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <span
                                  className={`text-xs px-2 py-1 rounded ${
                                    q.difficulty === "EASY"
                                      ? "bg-green-100 text-green-700"
                                      : q.difficulty === "MEDIUM"
                                        ? "bg-amber-100 text-amber-700"
                                        : "bg-red-100 text-red-700"
                                  }`}
                                >
                                  {q.difficulty}
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>

                  {/* Pagination Controls */}
                  <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <span>Hiển thị</span>
                      <select
                        value={qPageSize}
                        onChange={(e) => {
                          setQPageSize(Number(e.target.value));
                          setQPage(1);
                        }}
                        className="bg-white border border-slate-300 text-slate-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block p-1"
                      >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                      </select>
                      <span>kết quả</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-500 mr-2">
                        Trang {qPage} / {qTotalPages || 1}
                      </span>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            setQPage((prev) => Math.max(prev - 1, 1))
                          }
                          disabled={qPage === 1}
                          className="p-1 px-2 rounded border border-slate-300 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium"
                        >
                          Trước
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setQPage((prev) => Math.min(prev + 1, qTotalPages))
                          }
                          disabled={qPage >= qTotalPages}
                          className="p-1 px-2 rounded border border-slate-300 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium"
                        >
                          Sau
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {staticQuestions.length > 0 && (
                  <div className="mt-8">
                    <h4 className="font-bold text-[#111518] mb-3 flex items-center gap-2">
                      Câu hỏi đã chọn ({staticQuestions.length})
                      <span className="text-xs font-normal text-slate-400">
                        — kéo để sắp xếp thứ tự
                      </span>
                    </h4>
                    <div className="border rounded-lg overflow-hidden">
                      <DndProvider backend={HTML5Backend}>
                        <table className="w-full text-sm text-left">
                          <thead className="bg-slate-50 text-slate-700 font-semibold border-b">
                            <tr>
                              <th className="px-3 py-3 w-8"></th>
                              <th className="py-3 w-8">#</th>
                              <th className="px-4 py-3">Câu hỏi</th>
                              <th className="px-4 py-3 w-24">Điểm</th>
                              <th className="px-4 py-3 w-10"></th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {staticQuestions.map((sq, index) => (
                              <DraggableRow
                                key={sq.questionId}
                                index={index}
                                sq={sq}
                                cachedContent={
                                  questionContentCacheRef.current[sq.questionId]
                                }
                                onMove={moveQuestion}
                                onScoreChange={(id, score) =>
                                  updateStaticQuestion(id, "score", score)
                                }
                                onDelete={(questionId) =>
                                  toggleStaticQuestion({
                                    id: questionId,
                                  } as any)
                                }
                              />
                            ))}
                          </tbody>
                        </table>
                      </DndProvider>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </form>

      {/* Sticky Footer Actions */}
      <div className="fixed bottom-0 left-64 right-0 bg-white border-t border-slate-200 px-8 py-4 z-20">
        <div className="max-w-5xl mx-auto flex justify-end gap-4">
          <Link
            to="/teacher/quizzes"
            className="px-6 py-2.5 rounded-lg border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Hủy bỏ
          </Link>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={creating || updating}
            className="px-6 py-2.5 rounded-lg bg-[#1E90FF] text-white font-bold hover:bg-[#0074bd] transition-colors shadow-lg shadow-blue-500/30 flex items-center gap-2"
          >
            {creating || updating ? (
              <span className="animate-spin text-xl">
                <FaCircleNotch />
              </span>
            ) : (
              <span className="material-symbols-outlined text-xl">save</span>
            )}
            {isEditMode ? "Lưu thay đổi" : "Tạo đề thi"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamFormPage;
