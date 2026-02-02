import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCreateQuiz } from "../../hooks/useQuizzes";
import { useMyCourses, useCourseDetail } from "../../hooks/useCourses";
import { getLessonById } from "../../services/lessonService";
import type { CreateQuizRequest, DynamicConfig } from "../../types/quiz";
import { toast } from "@/components/common/Toast";
import LoadingOverlay from "@/components/common/LoadingOverlay";

const ExamFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const { create, loading: createLoading } = useCreateQuiz();

  // Basic Form Data
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: 60,
    maxAttempts: 1,
    passingScore: 50,
    shuffleQuestions: true,
    isDynamic: true, // Default to dynamic
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

  // Fetch courses
  const { data: courses } = useMyCourses({ pageSize: 100 });
  const { data: courseDetail } = useCourseDetail(selectedCourseId || undefined);
  const lessons = courseDetail?.lessons || [];

  // Fetch lesson items when lesson changes
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

  const [lessonItems, setLessonItems] = useState<any[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCourseId || !selectedLessonId || !selectedLessonItemId) {
      toast.error("Vui lòng chọn khóa học, bài học và nội dung bài học");
      return;
    }

    const quizData: CreateQuizRequest = {
      title: formData.title,
      description: formData.description,
      lessonItemId: selectedLessonItemId,
      courseId: selectedCourseId,
      durationInMinutes: formData.duration,
      passScore: formData.passingScore,
      maxAttempts: formData.maxAttempts,
      shuffleQuestions: formData.shuffleQuestions,
      isDynamic: formData.isDynamic,
      dynamicConfigs: formData.isDynamic
        ? [
            {
              targetLessonId: dynamicConfig.targetLessonId || selectedLessonId, // Default to current lesson if not chosen
              difficulty: dynamicConfig.difficulty,
              quantity: dynamicConfig.quantity,
              scorePerQuestion: dynamicConfig.scorePerQuestion,
            },
          ]
        : [],
      staticQuestions: [], // Static not implemented in this MVP step
    };

    try {
      await create(quizData);
      toast.success("Tạo đề thi thành công!");
      navigate("/teacher/exams");
    } catch (error) {
      console.error(error);
      toast.error("Tạo đề thi thất bại");
    }
  };

  return (
    <div className="space-y-6 pb-24">
      <LoadingOverlay isLoading={createLoading} message="Đang tạo bài thi..." />
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
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-lg font-bold text-[#111518]">
              Thông tin chung
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="max-w-2xl">
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
            <div className="max-w-2xl">
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
                  Khóa học <span className="text-red-500">*</span>
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
                  Bài học (Module) <span className="text-red-500">*</span>
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
                  Nội dung (Quiz) <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full h-12 rounded-lg border border-slate-200 bg-white px-4 focus:outline-none focus:ring-2 focus:ring-[#1E90FF] focus:border-[#1E90FF] outline-none transition-all"
                  value={selectedLessonItemId}
                  onChange={(e) => setSelectedLessonItemId(e.target.value)}
                  disabled={!selectedLessonId}
                  required
                >
                  <option value="">-- Chọn nội dung --</option>
                  {lessonItems.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title} ({item.type})
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
          <div className="p-6">
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
                  <option value={1}>1 lần</option>
                  <option value={2}>2 lần</option>
                  <option value={3}>3 lần</option>
                  <option value={-1}>Không giới hạn</option>
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
            <div className="mt-4 flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div>
                <p className="font-bold text-[#111518]">Xáo trộn câu hỏi</p>
                <p className="text-xs text-slate-500 mt-1">
                  Thay đổi thứ tự hiển thị câu hỏi cho mỗi sinh viên
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.shuffleQuestions}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      shuffleQuestions: e.target.checked,
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1E90FF]"></div>
              </label>
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
              <div className="text-center py-10 text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                <span className="material-symbols-outlined text-4xl mb-2">
                  construction
                </span>
                <p>Chế độ chọn câu hỏi thủ công đang được phát triển.</p>
                <p className="text-xs mt-1">
                  Vui lòng sử dụng chế độ Tự động (Dynamic) tạm thời.
                </p>
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
            className="px-8 py-3 bg-slate-100 hover:bg-slate-200 text-[#111518] font-bold rounded-lg transition-all"
          >
            Hủy
          </Link>
          <button
            onClick={handleSubmit}
            disabled={createLoading}
            className="px-8 py-3 bg-[#0074bd] hover:bg-[#0074bd]/90 text-white font-bold rounded-lg shadow-lg shadow-[#0074bd]/20 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {createLoading && (
              <span className="material-symbols-outlined animate-spin text-sm">
                progress_activity
              </span>
            )}
            Lưu thiết lập
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamFormPage;
