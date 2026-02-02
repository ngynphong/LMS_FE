import { useState, useEffect } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import type {
  QuestionDifficulty,
  QuestionType,
  Question,
} from "../../types/question";
import {
  useCreateQuestion,
  useUpdateQuestion,
  useQuestions,
} from "../../hooks/useQuestions";
import { useMyCourses, useCourseDetail } from "../../hooks/useCourses";
import LoadingOverlay from "../../components/common/LoadingOverlay";

const QuestionFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = !!id;

  const { create: createQuestion, loading: createLoading } =
    useCreateQuestion();
  const { update: updateQuestion, loading: updateLoading } =
    useUpdateQuestion();

  // Try to get question from location state first, otherwise we might need to find it from the list
  // Since we don't have getQuestionById API, we rely on the list or passed state.
  // Ideally, if a user goes directly to the URL, we might need to fetch the full list to find it (fallback).
  const { data: qList } = useQuestions();

  // New hooks for selecting lesson
  const { data: courses } = useMyCourses({ pageSize: 100 }); // Fetch all courses for selection
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const { data: courseDetail, loading: lessonsLoading } = useCourseDetail(
    selectedCourseId || undefined,
  );
  const lessons = courseDetail?.lessons || [];

  const [formData, setFormData] = useState({
    explanation: "",
    difficulty: "EASY" as QuestionDifficulty,
    type: "SINGLE_CHOICE" as QuestionType,
    content: "",
    options: ["", "", "", ""],
    correctAnswerIndex: 0,
    defaultScore: 1,
    lessonId: "", // Optional
  });

  // Load data for edit mode
  useEffect(() => {
    if (isEditMode) {
      if (location.state?.question) {
        populateForm(location.state.question);
      } else if (qList) {
        const found = qList.find((q) => q.id === id);
        if (found) populateForm(found);
      }
    }
  }, [id, isEditMode, qList, location.state]);

  const populateForm = (question: Question) => {
    // Map answers back to options and index
    // Note: This logic assumes 4 options structure for UI simplicity, but API supports dynamic array.
    // We will try to map the first 4 answers.
    const newOptions = ["", "", "", ""];
    let correctIndex = 0;

    if (question.answers) {
      question.answers.forEach((ans, idx) => {
        if (idx < 4) newOptions[idx] = ans.content;
        if (ans.correct) correctIndex = idx;
      });
    }

    setFormData({
      explanation: question.explanation || "",
      difficulty: question.difficulty,
      type: question.type,
      content: question.content,
      options: newOptions,
      correctAnswerIndex: correctIndex,
      defaultScore: question.defaultScore || 1,
      lessonId: question.lessonId || "",
    });
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Construct answers array
    const answers = formData.options
      .map((opt, idx) => ({
        content: opt,
        correct: idx === formData.correctAnswerIndex,
      }))
      .filter((ans) => ans.content.trim() !== ""); // Filter out empty options if desired, or keep them?
    // User might want to enforce 4 options. API doesn't seem to enforce count in types but UI does.

    const requestData = {
      content: formData.content,
      explanation: formData.explanation,
      difficulty: formData.difficulty,
      type: formData.type,
      defaultScore: formData.defaultScore,
      lessonId: formData.lessonId || undefined,
      answers: answers,
    };

    try {
      if (isEditMode && id) {
        await updateQuestion(id, requestData);
      } else {
        await createQuestion(requestData);
      }
      navigate("/teacher/questions");
    } catch (error) {
      alert("Có lỗi xảy ra khi lưu câu hỏi");
      console.error(error);
    }
  };

  const isLoading = createLoading || updateLoading;

  return (
    <div className="min-h-screen">
      <LoadingOverlay isLoading={isLoading} message="Đang lưu câu hỏi..." />
      {/* Header */}
      <header className=" border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10 bg-white/80 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Link
            to="/teacher/questions"
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h2 className="text-xl font-bold text-[#111518]">
            {isEditMode ? "Chỉnh sửa câu hỏi" : "Thêm câu hỏi mới"}
          </h2>
        </div>
        <div className="flex gap-3">
          <Link
            to="/teacher/questions"
            className="px-5 py-2 text-sm font-semibold border border-slate-200 rounded-lg hover:bg-slate-50 transition-all"
          >
            Hủy
          </Link>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-5 py-2 text-sm font-bold bg-[#0074bd] hover:bg-[#0074bd]/90 text-white rounded-lg shadow-sm transition-all disabled:opacity-50"
          >
            {isLoading ? "Đang lưu..." : "Lưu câu hỏi"}
          </button>
        </div>
      </header>

      {/* Form Content */}
      <div className="p-8 max-w-5xl mx-auto w-full">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
          <form className="space-y-8" onSubmit={handleSubmit}>
            {/* Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#111518]">
                  Mức độ <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.difficulty}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        difficulty: e.target.value as QuestionDifficulty,
                      })
                    }
                    className="w-full appearance-none px-4 py-2.5 bg-slate-50 border-none rounded-lg focus:ring-2 focus:ring-[#0074bd] text-sm pr-10"
                    required
                  >
                    <option value="EASY">Dễ</option>
                    <option value="MEDIUM">Vừa</option>
                    <option value="HARD">Khó</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xl">
                    expand_more
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-[#111518]">
                  Loại câu hỏi <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: e.target.value as QuestionType,
                      })
                    }
                    className="w-full appearance-none px-4 py-2.5 bg-slate-50 border-none rounded-lg focus:ring-2 focus:ring-[#0074bd] text-sm pr-10"
                    required
                  >
                    <option value="SINGLE_CHOICE">Một đáp án đúng</option>
                    <option value="MULTIPLE_CHOICE">Nhiều đáp án đúng</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xl">
                    expand_more
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-[#111518]">
                  Điểm số <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.defaultScore}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      defaultScore: Number(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-lg focus:ring-2 focus:ring-[#0074bd] text-sm"
                />
              </div>
            </div>

            {/* Lesson Assign (New Section) */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h3 className="text-sm font-bold text-[#111518] mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-500">
                  school
                </span>
                Gán câu hỏi vào bài học (Tùy chọn)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Course Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    Chọn khóa học
                  </label>
                  <div className="relative">
                    <select
                      value={selectedCourseId}
                      onChange={(e) => {
                        setSelectedCourseId(e.target.value);
                        setFormData((prev) => ({ ...prev, lessonId: "" })); // Reset lesson when course changes
                      }}
                      className="w-full appearance-none px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0074bd] text-sm pr-10"
                    >
                      <option value="">-- Chọn khóa học --</option>
                      {courses &&
                        courses.map((course) => (
                          <option key={course.id} value={course.id}>
                            {course.name}
                          </option>
                        ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xl">
                      expand_more
                    </span>
                  </div>
                </div>

                {/* Lesson Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    Chọn bài học
                  </label>
                  <div className="relative">
                    <select
                      value={formData.lessonId}
                      disabled={!selectedCourseId && !formData.lessonId} // Allow if lessonId exists (edit mode) even if course not selected (edge case)
                      onChange={(e) =>
                        setFormData({ ...formData, lessonId: e.target.value })
                      }
                      className="w-full appearance-none px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0074bd] text-sm pr-10 disabled:bg-slate-100 disabled:text-slate-400"
                    >
                      <option value="">
                        {lessonsLoading
                          ? "Đang tải bài học..."
                          : "-- Chọn bài học --"}
                      </option>
                      {lessons &&
                        lessons.map((lesson) => (
                          <option key={lesson.id} value={lesson.id}>
                            {lesson.title}
                          </option>
                        ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xl">
                      expand_more
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                * Nếu không chọn bài học, câu hỏi sẽ được lưu vào ngân hàng
                chung.
              </p>
            </div>

            {/* Question Content */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#111518]">
                Nội dung câu hỏi <span className="text-red-500">*</span>
              </label>
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                {/* Simple toolbar */}
                <div className="bg-slate-50 border-b border-slate-200 p-2 flex gap-1">
                  <button
                    type="button"
                    className="p-1.5 hover:bg-slate-200 rounded transition-colors"
                    title="In đậm"
                  >
                    <span className="material-symbols-outlined text-xl">
                      format_bold
                    </span>
                  </button>
                  <button
                    type="button"
                    className="p-1.5 hover:bg-slate-200 rounded transition-colors"
                    title="In nghiêng"
                  >
                    <span className="material-symbols-outlined text-xl">
                      format_italic
                    </span>
                  </button>
                  <div className="w-px h-6 bg-slate-300 mx-1 self-center"></div>
                  <button
                    type="button"
                    className="p-1.5 hover:bg-slate-200 rounded transition-colors"
                    title="Danh sách"
                  >
                    <span className="material-symbols-outlined text-xl">
                      format_list_bulleted
                    </span>
                  </button>
                  <button
                    type="button"
                    className="p-1.5 hover:bg-slate-200 rounded transition-colors"
                    title="Chèn ảnh"
                  >
                    <span className="material-symbols-outlined text-xl">
                      image
                    </span>
                  </button>
                </div>
                <textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  className="w-full p-4 bg-transparent border-none focus:ring-0 text-sm min-h-[160px] resize-y"
                  placeholder="Nhập nội dung câu hỏi tại đây..."
                  required
                />
              </div>
            </div>

            {/* Answer Options */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-[#111518]">
                  Danh sách đáp án <span className="text-red-500">*</span>
                </label>
                <span className="text-xs text-slate-500">
                  Chọn nút radio cho đáp án đúng
                </span>
              </div>

              <div className="space-y-3">
                {["A", "B", "C", "D"].map((letter, index) => (
                  <div
                    key={letter}
                    className={`flex items-center gap-4 p-3 bg-slate-50 rounded-lg border transition-all ${
                      formData.correctAnswerIndex === index
                        ? "border-[#0074bd]/50 bg-[#0074bd]/5"
                        : "border-transparent hover:border-[#0074bd]/30"
                    }`}
                  >
                    <div className="flex-none">
                      <input
                        type="radio"
                        name="correct_answer"
                        checked={formData.correctAnswerIndex === index}
                        onChange={() =>
                          setFormData({
                            ...formData,
                            correctAnswerIndex: index,
                          })
                        }
                        className="w-5 h-5 text-[#0074bd] border-slate-300 focus:ring-[#0074bd]"
                      />
                    </div>
                    <span className="flex-none font-bold text-sm text-slate-500">
                      {letter}.
                    </span>
                    <input
                      type="text"
                      value={formData.options[index]}
                      onChange={(e) =>
                        handleOptionChange(index, e.target.value)
                      }
                      className="flex-1 bg-transparent border-none focus:ring-0 text-sm p-0"
                      placeholder={`Nhập nội dung đáp án ${letter}`}
                      required={index < 2} // At least 2 options required
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Explanation */}
            <div className="space-y-2 pt-4">
              <label className="text-sm font-bold text-[#111518]">
                Giải thích đáp án (Tùy chọn)
              </label>
              <textarea
                value={formData.explanation}
                onChange={(e) =>
                  setFormData({ ...formData, explanation: e.target.value })
                }
                className="w-full p-4 bg-slate-50 border-none rounded-lg focus:ring-2 focus:ring-[#0074bd] text-sm min-h-[100px]"
                placeholder="Nhập lời giải thích cho sinh viên sau khi hoàn thành câu hỏi..."
              />
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="p-8 text-center">
        <p className="text-xs text-slate-400">
          © 2024 Edu-Lms Learning Management System
        </p>
      </footer>
    </div>
  );
};

export default QuestionFormPage;
