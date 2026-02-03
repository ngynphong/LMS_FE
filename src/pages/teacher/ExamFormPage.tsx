import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCreateQuiz, useUpdateQuiz, useQuiz } from "../../hooks/useQuizzes";
import { useMyCourses, useCourseDetail } from "../../hooks/useCourses";
import { useQuestions } from "../../hooks/useQuestions";
import { getLessonById, getLessonItemById } from "../../services/lessonService";
import type {
  CreateQuizRequest,
  DynamicConfig,
  StaticQuestion,
} from "../../types/quiz";
import type { Question } from "../../types/question";
import { toast } from "@/components/common/Toast";
import LoadingOverlay from "@/components/common/LoadingOverlay";

const ExamFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const { create, loading: createLoading } = useCreateQuiz();
  const { update, loading: updateLoading } = useUpdateQuiz();
  const {
    data: quizDetail,
    loading: quizLoading,
    error: quizError,
  } = useQuiz(id);

  // Debug logs
  useEffect(() => {
    if (isEditMode) {
      console.log("Edit Mode ID:", id);
      console.log("Quiz Detail:", quizDetail);
      console.log("Quiz Loading:", quizLoading);
      console.log("Quiz Error:", quizError);
      if (quizError && "response" in quizError) {
        console.log("Error Response Data:", (quizError as any).response?.data);
      }
    }
  }, [id, isEditMode, quizDetail, quizLoading, quizError]);

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
  const [dynamicConfig, setDynamicConfig] = useState<DynamicConfig>({
    targetLessonId: "",
    difficulty: "EASY",
    quantity: 10,
    scorePerQuestion: 1,
  });

  // Static Question State
  const [staticQuestions, setStaticQuestions] = useState<StaticQuestion[]>([]);
  // Question Bank Fetching
  const [questionSearch, setQuestionSearch] = useState("");
  const { data: availableQuestions, loading: loadingQuestions } = useQuestions({
    content: questionSearch,
    pageSize: 20, // Limit for now, could be paginated
    lessonId: selectedLessonId || undefined, // Optional: filter by selected lesson
  });

  // Fetch courses
  const { data: courses } = useMyCourses({ pageSize: 100 });
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

  // Resolve hierarchy for editing
  useEffect(() => {
    const resolveHierarchy = async () => {
      if (isEditMode && quizDetail?.lessonItemId) {
        console.log("Resolving hierarchy for item:", quizDetail.lessonItemId);
        try {
          // Get Lesson Item to find Lesson ID
          // Note: lessonId might not be in the strict TypeScript interface but usually returned
          const lessonItem = (await getLessonItemById(
            quizDetail.lessonItemId,
          )) as any;
          console.log("Resolved Lesson Item:", lessonItem);

          if (lessonItem && lessonItem.lessonId) {
            setSelectedLessonId(lessonItem.lessonId);

            // Get Lesson to find Course ID
            const lesson = await getLessonById(lessonItem.lessonId);
            console.log("Resolved Lesson:", lesson);

            if (lesson && lesson.courseId) {
              setSelectedCourseId(lesson.courseId);
            }
          }
        } catch (error) {
          console.error("Error resolving hierarchy:", error);
        }
      }
    };

    if (quizDetail) {
      resolveHierarchy();
    }
  }, [isEditMode, quizDetail]);

  // Populate form data when quizDetail is loaded
  useEffect(() => {
    if (quizDetail && isEditMode) {
      // Use fallback properties if needed, casting to any if structure might differ
      const qd = quizDetail as any;

      setFormData({
        title: qd.title || "",
        description: qd.description || "",
        duration: qd.durationInMinutes ?? qd.duration ?? 60,
        maxAttempts: qd.maxAttempts ?? 1,
        passingScore: qd.passScore ?? qd.passingScore ?? 50,
        shuffleQuestions: qd.shuffleQuestions ?? true,
        isDynamic: qd.isDynamic ?? true,
        type: qd.type || "PRACTICE",
        closeTime: qd.closeTime || "",
        showScoreAfterSubmit: qd.showScoreAfterSubmit ?? true,
        showResultAfterSubmit: qd.showResultAfterSubmit ?? true,
        isPublished: qd.isPublished ?? true,
      });

      // Populate Dynamic Config
      if (qd.isDynamic && qd.dynamicConfigs && qd.dynamicConfigs.length > 0) {
        setDynamicConfig(qd.dynamicConfigs[0]);
      }

      // Populate Static Questions
      if (!qd.isDynamic && qd.staticQuestions) {
        setStaticQuestions(qd.staticQuestions);
      }

      setSelectedLessonItemId(qd.lessonItemId || "");
    }
  }, [quizDetail, isEditMode]);

  const toggleStaticQuestion = (question: Question) => {
    const exists = staticQuestions.find((sq) => sq.questionId === question.id);
    if (exists) {
      setStaticQuestions(
        staticQuestions.filter((sq) => sq.questionId !== question.id),
      );
    } else {
      setStaticQuestions([
        ...staticQuestions,
        {
          questionId: question.id,
          score: question.defaultScore || 1,
          order: staticQuestions.length + 1,
        },
      ]);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      maxAttempts: formData.maxAttempts,
      shuffleQuestions: formData.shuffleQuestions,
      isDynamic: formData.isDynamic,
      type: formData.type,
      closeTime: formData.closeTime
        ? new Date(formData.closeTime).toISOString()
        : null,
      showScoreAfterSubmit: formData.showScoreAfterSubmit,
      showResultAfterSubmit: formData.showResultAfterSubmit,
      isPublished: formData.isPublished,
      dynamicConfigs: formData.isDynamic
        ? [
            {
              targetLessonId: dynamicConfig.targetLessonId || selectedLessonId,
              difficulty: dynamicConfig.difficulty,
              quantity: dynamicConfig.quantity,
              scorePerQuestion: dynamicConfig.scorePerQuestion,
            },
          ]
        : [],
      staticQuestions: formData.isDynamic ? [] : staticQuestions,
    };

    try {
      if (isEditMode && id) {
        await update(id, quizData);
        toast.success("Cập nhật đề thi thành công!");
      } else {
        await create(quizData);
        toast.success("Tạo đề thi thành công!");
      }
      navigate("/teacher/exams");
    } catch (error) {
      console.error(error);
      toast.error(isEditMode ? "Cập nhật thất bại" : "Tạo đề thi thất bại");
    }
  };

  return (
    <div className="space-y-6 pb-24">
      <LoadingOverlay
        isLoading={createLoading || updateLoading || quizLoading}
        message={isEditMode ? "Đang cập nhật..." : "Đang tạo bài thi..."}
      />
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm font-medium">
        <Link
          to="/teacher/exams"
          className="text-slate-500 hover:text-[#0074bd] transition-colors"
        >
          Đề thi
        </Link>
        <span className="text-slate-400">/</span>
        <span className="text-[#111518]">
          {isEditMode ? "Chỉnh sửa" : "Tạo mới"}
        </span>
      </nav>

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
                  value={formData.maxAttempts}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxAttempts: parseInt(e.target.value),
                    })
                  }
                  className="w-full h-12 rounded-lg border border-slate-200 bg-white px-4 focus:ring-2 focus:ring-[#1E90FF] focus:border-[#1E90FF] outline-none"
                >
                  <option value={-1}>Không giới hạn</option>
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
                <input
                  type="datetime-local"
                  value={formData.closeTime}
                  onChange={(e) =>
                    setFormData({ ...formData, closeTime: e.target.value })
                  }
                  className="w-full h-12 rounded-lg border border-slate-200 bg-white px-4 focus:ring-2 focus:ring-[#1E90FF] focus:border-[#1E90FF] outline-none"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Để trống nếu không có hạn chót
                </p>
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
          </div>
          <div className="p-6">
            {formData.isDynamic ? (
              <div className="space-y-4">
                <p className="text-sm text-slate-500 mb-4">
                  Hệ thống sẽ tự động chọn câu hỏi ngẫu nhiên dựa trên cấu hình
                  dưới đây.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">
                      Độ khó
                    </label>
                    <select
                      value={dynamicConfig.difficulty}
                      onChange={(e) =>
                        setDynamicConfig({
                          ...dynamicConfig,
                          difficulty: e.target.value as any,
                        })
                      }
                      className="w-full h-10 rounded border border-slate-200 px-3 text-sm"
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
                      value={dynamicConfig.quantity}
                      onChange={(e) =>
                        setDynamicConfig({
                          ...dynamicConfig,
                          quantity: parseInt(e.target.value),
                        })
                      }
                      className="w-full h-10 rounded border border-slate-200 px-3 text-sm"
                      min={1}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">
                      Điểm mỗi câu
                    </label>
                    <input
                      type="number"
                      value={dynamicConfig.scorePerQuestion}
                      onChange={(e) =>
                        setDynamicConfig({
                          ...dynamicConfig,
                          scorePerQuestion: parseInt(e.target.value),
                        })
                      }
                      className="w-full h-10 rounded border border-slate-200 px-3 text-sm"
                      min={0.5}
                      step={0.5}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">
                      Nguồn câu hỏi (Bài học)
                    </label>
                    <select
                      value={dynamicConfig.targetLessonId || ""}
                      onChange={(e) =>
                        setDynamicConfig({
                          ...dynamicConfig,
                          targetLessonId: e.target.value,
                        })
                      }
                      className="w-full h-10 rounded border border-slate-200 px-3 text-sm"
                    >
                      <option value="">(Tự động theo bài thi)</option>
                      {lessons.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              // STATIC QUESTIONS SELECTION UI
              <div className="space-y-6">
                <div className="flex gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Tìm kiếm câu hỏi..."
                    className="flex-1 h-10 rounded border border-slate-200 px-3 text-sm"
                    value={questionSearch}
                    onChange={(e) => setQuestionSearch(e.target.value)}
                  />
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-700 font-semibold border-b">
                      <tr>
                        <th className="px-4 py-3 w-10">Chọn</th>
                        <th className="px-4 py-3">Nội dung câu hỏi</th>
                        <th className="px-4 py-3 w-24">Loại</th>
                        <th className="px-4 py-3 w-24">Độ khó</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
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
                </div>

                {staticQuestions.length > 0 && (
                  <div className="mt-8">
                    <h4 className="font-bold text-[#111518] mb-3">
                      Câu hỏi đã chọn ({staticQuestions.length})
                    </h4>
                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-700 font-semibold border-b">
                          <tr>
                            <th className="px-4 py-3">Câu hỏi</th>
                            <th className="px-4 py-3 w-24">Điểm</th>
                            <th className="px-4 py-3 w-24">Thứ tự</th>
                            <th className="px-4 py-3 w-10"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {staticQuestions.map((sq) => {
                            const question = availableQuestions?.find(
                              (q) => q.id === sq.questionId,
                            );
                            return (
                              <tr key={sq.questionId}>
                                <td className="px-4 py-3">
                                  <div
                                    className="line-clamp-1"
                                    dangerouslySetInnerHTML={{
                                      __html: question?.content || "Loading...",
                                    }}
                                  />
                                </td>
                                <td className="px-4 py-3">
                                  <input
                                    type="number"
                                    className="w-16 h-8 border rounded px-2"
                                    value={sq.score}
                                    onChange={(e) =>
                                      updateStaticQuestion(
                                        sq.questionId,
                                        "score",
                                        parseFloat(e.target.value),
                                      )
                                    }
                                    min={0.5}
                                    step={0.5}
                                  />
                                </td>
                                <td className="px-4 py-3">
                                  <input
                                    type="number"
                                    className="w-16 h-8 border rounded px-2"
                                    value={sq.order}
                                    onChange={(e) =>
                                      updateStaticQuestion(
                                        sq.questionId,
                                        "order",
                                        parseInt(e.target.value),
                                      )
                                    }
                                  />
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <button
                                    onClick={() =>
                                      toggleStaticQuestion({
                                        id: sq.questionId,
                                      } as any)
                                    }
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <span className="material-symbols-outlined text-lg">
                                      delete
                                    </span>
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
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
            to="/teacher/exams"
            className="px-6 py-2.5 rounded-lg border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Hủy bỏ
          </Link>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={createLoading || updateLoading}
            className="px-6 py-2.5 rounded-lg bg-[#1E90FF] text-white font-bold hover:bg-[#0074bd] transition-colors shadow-lg shadow-blue-500/30 flex items-center gap-2"
          >
            {createLoading || updateLoading ? (
              <span className="material-symbols-outlined animate-spin text-xl">
                progress_activity
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
