import { useState } from "react";
import { Link } from "react-router-dom";
import type { QuestionDifficulty } from "../../types/question";
import { useQuestions, useDeleteQuestion } from "../../hooks/useQuestions";
import { useMyCourses, useCourseDetail } from "../../hooks/useCourses";
import ImportQuestionsModal from "../../components/question/ImportQuestionsModal";
import { ConfirmationModal } from "../../components/common/ConfirmationModal";
import PaginationControl from "../../components/common/PaginationControl";

const QuestionBankPage = () => {
  const [pagination, setPagination] = useState({
    pageNo: 1,
    pageSize: 10,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedLessonId, setSelectedLessonId] = useState("");

  // Fetch Courses for filter
  const { data: coursesData } = useMyCourses({ pageSize: 100 });
  const courses = coursesData?.items || [];

  // Fetch Lessons when Course selected
  const { data: courseDetail } = useCourseDetail(selectedCourseId || undefined);
  const lessons = courseDetail?.lessons || [];

  const {
    data: questionsResponse,
    isLoading: loading,
    error,
  } = useQuestions({
    pageNo: pagination.pageNo,
    pageSize: pagination.pageSize,
    content: searchQuery,
    difficulty: difficultyFilter === "all" ? undefined : difficultyFilter,
    lessonId: selectedLessonId || undefined,
  });

  const questions = questionsResponse?.items || [];
  const totalPages = questionsResponse?.totalPage || 0;
  const totalElements = questionsResponse?.totalElement || 0;

  const { mutateAsync: deleteQuestion } = useDeleteQuestion();

  const [showImportModal, setShowImportModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    questionId: string | null;
  }>({ isOpen: false, questionId: null });

  // Helper stats (approximate based on current page or we'd need separate API for global stats)
  // For now, we can just show total questions from metadata
  const totalQuestions = totalElements;

  const getDifficultyBadge = (difficulty: QuestionDifficulty) => {
    switch (difficulty) {
      case "EASY":
        return { label: "Dễ", className: "bg-green-100 text-green-700" };
      case "MEDIUM":
        return { label: "Vừa", className: "bg-yellow-100 text-yellow-700" };
      case "HARD":
        return { label: "Khó", className: "bg-red-100 text-red-700" };
      default:
        return { label: difficulty, className: "bg-gray-100 text-gray-700" };
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteModal({ isOpen: true, questionId: id });
  };

  const handleConfirmDelete = async () => {
    if (deleteModal.questionId) {
      try {
        await deleteQuestion(deleteModal.questionId);
        // refetch is handled by invalidation
        setDeleteModal({ isOpen: false, questionId: null });
      } catch (error) {
        console.error("Failed to delete question:", error);
        alert("Xóa câu hỏi thất bại");
      }
    }
  };

  if (loading)
    return (
      <div className="p-8 text-center text-slate-500">Đang tải dữ liệu...</div>
    );
  if (error)
    return (
      <div className="p-8 text-center text-red-500">
        Đã xảy ra lỗi khi tải câu hỏi.
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-[#111518] text-2xl font-bold tracking-tight">
            Ngân hàng câu hỏi
          </h1>
          <p className="text-[#617a89] text-sm mt-1">
            Quản lý và tạo câu hỏi cho bài kiểm tra
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowImportModal(true)}
            className="bg-white hover:bg-slate-50 color-primary border hover:translate-y-[-2px] px-5 py-2.5 rounded-lg flex items-center gap-2 font-bold transition-all duration-300 shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">
              upload_file
            </span>
            Import
          </button>
          <Link
            to="/teacher/questions/new"
            className="color-primary-bg hover:translate-y-[-2px] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-bold transition-all duration-300 shadow-md"
          >
            <span className="material-symbols-outlined text-lg">
              add_circle
            </span>
            Thêm câu hỏi mới
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="flex-1 min-w-[250px]">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPagination((prev) => ({ ...prev, pageNo: 1 }));
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF] text-sm"
              placeholder="Tìm kiếm câu hỏi..."
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          {/* Course Filter */}
          <div className="relative min-w-[200px]">
            <select
              value={selectedCourseId}
              onChange={(e) => {
                setSelectedCourseId(e.target.value);
                setSelectedLessonId(""); // Reset lesson when course changes
                setPagination((prev) => ({ ...prev, pageNo: 1 }));
              }}
              className="w-full appearance-none px-4 py-2.5 bg-slate-50 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF] text-sm pr-10"
            >
              <option value="">Tất cả khóa học</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-lg">
              expand_more
            </span>
          </div>

          {/* Lesson Filter */}
          <div className="relative min-w-[200px]">
            <select
              value={selectedLessonId}
              onChange={(e) => {
                setSelectedLessonId(e.target.value);
                setPagination((prev) => ({ ...prev, pageNo: 1 }));
              }}
              className="w-full appearance-none px-4 py-2.5 bg-slate-50 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF] text-sm pr-10"
              disabled={!selectedCourseId}
            >
              <option value="">Tất cả bài học</option>
              {lessons.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.title}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-lg">
              expand_more
            </span>
          </div>

          {/* Difficulty Filter */}
          <div className="relative min-w-[150px]">
            <select
              value={difficultyFilter}
              onChange={(e) => {
                setDifficultyFilter(e.target.value);
                setPagination((prev) => ({ ...prev, pageNo: 1 }));
              }}
              className="w-full appearance-none px-4 py-2.5 bg-slate-50 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF] text-sm pr-10"
            >
              <option value="all">Mức độ: Tất cả</option>
              <option value="EASY">Dễ</option>
              <option value="MEDIUM">Vừa</option>
              <option value="HARD">Khó</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-lg">
              expand_more
            </span>
          </div>
        </div>
      </div>

      {/* Statistics - Simplified for now as we don't have aggregated stats from API */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="bg-[#0074bd]/10 p-3 rounded-lg">
            <span className="material-symbols-outlined text-[#0074bd] text-2xl">
              quiz
            </span>
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">
              Tổng số câu hỏi
            </p>
            <p className="text-2xl font-bold text-[#111518]">
              {totalQuestions}
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Nội dung câu hỏi
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Bài học
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Giải thích
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                Độ khó
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Loại
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {questions.map((question) => {
              const badge = getDifficultyBadge(question.difficulty);
              return (
                <tr
                  key={question.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div
                      className="text-sm text-[#111518] font-medium line-clamp-2"
                      dangerouslySetInnerHTML={{
                        __html: question.content,
                      }}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-[#111518]">
                      {question.lessonName || "-"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className="text-sm text-slate-500 line-clamp-2"
                      dangerouslySetInnerHTML={{
                        __html: question.explanation || "-",
                      }}
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${badge.className}`}
                    >
                      {badge.label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-500">
                      {question.type === "SINGLE_CHOICE"
                        ? "Một đáp án"
                        : "Nhiều đáp án"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/teacher/questions/${question.id}/edit`}
                        state={{ question }} // Pass question data to edit page to avoid refetch
                        className="p-1.5 text-[#0074bd] hover:bg-[#0074bd]/10 rounded-lg transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg">
                          edit
                        </span>
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(question.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg">
                          delete
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
          <PaginationControl
            currentPage={pagination.pageNo}
            totalPages={totalPages}
            onPageChange={(page) =>
              setPagination((prev) => ({ ...prev, pageNo: page }))
            }
            pageSize={pagination.pageSize}
            onPageSizeChange={(size) =>
              setPagination((prev) => ({
                ...prev,
                pageSize: size,
                pageNo: 1,
              }))
            }
          />
        </div>
      </div>

      {showImportModal && (
        <ImportQuestionsModal
          onClose={() => setShowImportModal(false)}
          onSuccess={() => {
            // refetch(); // Invalidation handles this
            setShowImportModal(false);
          }}
        />
      )}

      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, questionId: null })}
        onConfirm={handleConfirmDelete}
        title="Xóa câu hỏi"
        message="Bạn có chắc chắn muốn xóa câu hỏi này? Hành động này không thể hoàn tác."
        variant="danger"
        confirmLabel="Xóa"
        cancelLabel="Hủy"
      />
    </div>
  );
};

export default QuestionBankPage;
