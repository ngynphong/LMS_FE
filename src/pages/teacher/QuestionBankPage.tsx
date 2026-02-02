import { useState } from "react";
import { Link } from "react-router-dom";
import type { QuestionDifficulty } from "../../types/question";
import { useQuestions, useDeleteQuestion } from "../../hooks/useQuestions";
import ImportQuestionsModal from "../../components/question/ImportQuestionsModal";
import { ConfirmationModal } from "../../components/common/ConfirmationModal";

const QuestionBankPage = () => {
  const [pagination, setPagination] = useState({
    pageNo: 1,
    pageSize: 10,
  });

  const {
    data: rawQuestions,
    loading,
    error,
    refetch,
    totalPages,
    totalElements,
  } = useQuestions({
    pageNo: pagination.pageNo,
    pageSize: pagination.pageSize,
  });
  const { remove: deleteQuestion } = useDeleteQuestion();

  const questions = Array.isArray(rawQuestions) ? rawQuestions : [];
  const [showImportModal, setShowImportModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    questionId: string | null;
  }>({ isOpen: false, questionId: null });

  const [searchQuery, setSearchQuery] = useState("");
  const [topicFilter, setTopicFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");

  // Helper to extract unique topics from questions
  const topics = Array.from(
    new Set(
      questions?.map((q) => q.lessonName || "Khác").filter(Boolean) || [],
    ),
  );

  // Stats
  // Note: Question type in DB is SINGLE_CHOICE / MULTIPLE_CHOICE (uppercase)
  // Adjusting stat counts to match potential API values
  const totalQuestions = questions?.length || 0;
  const singleChoiceCount =
    questions?.filter((q) => q.type === "SINGLE_CHOICE").length || 0;
  // Assuming 'essay' might not exist in the new API or is handled differently, relying on SINGLE_CHOICE vs others for now or just generic stats
  // The screenshot showed "type": "SINGLE_CHOICE"
  const multiChoiceCount =
    questions?.filter((q) => q.type === "MULTIPLE_CHOICE").length || 0;

  // Filtered questions
  const filteredQuestions =
    questions?.filter((q) => {
      const matchesSearch = q.content
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      // We might filter by lessonName as 'topic' since 'topic' field is missing in Question interface
      const topic = q.lessonName || "Khác";
      const matchesTopic = topicFilter === "all" || topic === topicFilter;
      const matchesDifficulty =
        difficultyFilter === "all" || q.difficulty === difficultyFilter;
      return matchesSearch && matchesTopic && matchesDifficulty;
    }) || [];

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
        refetch();
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
            className="bg-white hover:bg-slate-50 color-primary border hover:translate-y-[-2px] px-5 py-2.5 rounded-lg flex items-center gap-2 font-bold transition-all duration-300 shadow-sm"
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
        <div className="flex-1 min-w-[300px]">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF] text-sm"
              placeholder="Tìm kiếm câu hỏi..."
            />
          </div>
        </div>
        <div className="flex gap-3">
          <div className="relative min-w-[150px]">
            <select
              value={topicFilter}
              onChange={(e) => setTopicFilter(e.target.value)}
              className="w-full appearance-none px-4 py-2.5 bg-slate-50 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF] text-sm pr-10"
            >
              <option value="all">Bài học: Tất cả</option>
              {topics.map((topic, index) => (
                <option key={index} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-lg">
              expand_more
            </span>
          </div>
          <div className="relative min-w-[150px]">
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
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

      {/* Statistics */}
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
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-lg">
            <span className="material-symbols-outlined text-green-600 text-2xl">
              checklist
            </span>
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">
              Chọn một đáp án
            </p>
            <p className="text-2xl font-bold text-[#111518]">
              {singleChoiceCount}
            </p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="bg-orange-100 p-3 rounded-lg">
            <span className="material-symbols-outlined text-orange-600 text-2xl">
              edit_note
            </span>
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">
              Chọn nhiều đáp án
            </p>
            <p className="text-2xl font-bold text-[#111518]">
              {multiChoiceCount}
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
            {filteredQuestions.map((question) => {
              const badge = getDifficultyBadge(question.difficulty);
              return (
                <tr
                  key={question.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="text-sm text-[#111518] font-medium line-clamp-1">
                      {question.content}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-[#111518]">
                      {question.lessonName || "-"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-[#111518]">
                      {question.explanation || "-"}
                    </span>
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
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="text-sm text-slate-500">
            Hiển thị từ {(pagination.pageNo - 1) * pagination.pageSize + 1} đến{" "}
            {Math.min(pagination.pageNo * pagination.pageSize, totalElements)}{" "}
            trong tổng số {totalElements} kết quả
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setPagination((prev) => ({ ...prev, pageNo: prev.pageNo - 1 }))
              }
              disabled={pagination.pageNo === 1}
              className="flex items-center justify-center p-2 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-slate-600"
            >
              <span className="material-symbols-outlined text-sm">
                chevron_left
              </span>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() =>
                  setPagination((prev) => ({ ...prev, pageNo: page }))
                }
                className={`min-w-[32px] h-8 rounded-lg text-sm font-medium transition-colors ${
                  pagination.pageNo === page
                    ? "bg-[#0074bd] text-white"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() =>
                setPagination((prev) => ({ ...prev, pageNo: prev.pageNo + 1 }))
              }
              disabled={pagination.pageNo === totalPages}
              className="flex items-center justify-center p-2 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-slate-600"
            >
              <span className="material-symbols-outlined text-sm">
                chevron_right
              </span>
            </button>
          </div>
        </div>
      </div>

      {showImportModal && (
        <ImportQuestionsModal
          onClose={() => setShowImportModal(false)}
          onSuccess={() => {
            refetch();
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
