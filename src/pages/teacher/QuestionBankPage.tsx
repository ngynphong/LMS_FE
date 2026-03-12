import { useState } from "react";
import { Link } from "react-router-dom";
import type { QuestionDifficulty } from "@/types/question";
import {
  useQuestions,
  useDeleteQuestion,
  useDeleteQuestionsBatch,
} from "@/hooks/useQuestions";
import { useMyCourses, useCourseDetail } from "@/hooks/useCourses";
import ImportQuestionsModal from "@/components/question/ImportQuestionsModal";
import { ConfirmationModal } from "@/components/common/ConfirmationModal";
import PaginationControl from "@/components/common/PaginationControl";
import LoadingOverlay from "@/components/common/LoadingOverlay";
import { toast } from "@/components/common/Toast";
import { FaFileUpload } from "react-icons/fa";
import { IoIosAddCircle } from "react-icons/io";
import { MdDelete, MdDeleteSweep, MdEdit, MdExpandMore, MdQuiz } from "react-icons/md";

const QuestionBankPage = () => {
  const [pagination, setPagination] = useState({
    pageNo: 1,
    pageSize: 10,
  });

  // const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedLessonId, setSelectedLessonId] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Fetch Courses for filter
  const { data: coursesData } = useMyCourses({ pageSize: 100 });
  const courses = coursesData?.items || [];

  // Fetch Lessons when Course selected
  const { data: courseDetail } = useCourseDetail(selectedCourseId || undefined);
  const lessons = courseDetail?.lessons || [];

  const {
    data: questionsResponse,
    isLoading: loading,
    isFetching: fetching,
    error,
  } = useQuestions({
    page: pagination.pageNo,
    size: pagination.pageSize,
    // content: searchQuery,
    // difficulty: difficultyFilter === "all" ? undefined : difficultyFilter,
    lessonId: selectedLessonId || undefined,
  });

  const questions = questionsResponse?.items || [];
  const totalPages = questionsResponse?.totalPage || 0;
  const totalElements = questionsResponse?.totalElement || 0;

  const { mutateAsync: deleteQuestion } = useDeleteQuestion();
  const { mutateAsync: deleteQuestionsBatch } = useDeleteQuestionsBatch();

  const [showImportModal, setShowImportModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    questionId: string | null;
    isBatch: boolean;
  }>({ isOpen: false, questionId: null, isBatch: false });

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
    setDeleteModal({ isOpen: true, questionId: id, isBatch: false });
  };

  const handleBatchDeleteClick = () => {
    if (selectedIds.length > 0) {
      setDeleteModal({ isOpen: true, questionId: null, isBatch: true });
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(questions.map((q) => q.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleConfirmDelete = async () => {
    try {
      if (deleteModal.isBatch) {
        await deleteQuestionsBatch(selectedIds);
        setSelectedIds([]);
        toast.success(`Đã xóa ${selectedIds.length} câu hỏi`);
      } else if (deleteModal.questionId) {
        await deleteQuestion(deleteModal.questionId);
        setSelectedIds((prev) =>
          prev.filter((id) => id !== deleteModal.questionId),
        );
        toast.success("Đã xóa câu hỏi");
      }
      setDeleteModal({ isOpen: false, questionId: null, isBatch: false });
    } catch (error) {
      console.error("Failed to delete:", error);
      toast.error(
        deleteModal.isBatch ? "Xóa hàng loạt thất bại" : "Xóa câu hỏi thất bại",
      );
    }
  };

  if (loading)
    return <LoadingOverlay isLoading={loading} message="Đang tải câu hỏi..." />;
  if (error)
    return (
      <LoadingOverlay
        isLoading={true}
        message="Đã xảy ra lỗi khi tải câu hỏi."
      />
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
            <span className="text-lg">
              <FaFileUpload />
            </span>
            Import
          </button>
          <Link
            to="/teacher/questions/new"
            className="color-primary-bg hover:translate-y-[-2px] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-bold transition-all duration-300 shadow-md"
          >
            <span className="text-lg">
              <IoIosAddCircle />
            </span>
            Thêm câu hỏi mới
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="flex flex-wrap gap-3">
          {/* Course Filter */}
          <div className="relative min-w-[200px]">
            <select
              value={selectedCourseId}
              onChange={(e) => {
                setSelectedCourseId(e.target.value);
                setSelectedLessonId(""); // Reset lesson when course changes
                setPagination((prev) => ({ ...prev, pageNo: 1 }));
                setSelectedIds([]);
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
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-lg">
              <MdExpandMore />
            </span>
          </div>

          {/* Lesson Filter */}
          <div className="relative min-w-[200px]">
            <select
              value={selectedLessonId}
              onChange={(e) => {
                setSelectedLessonId(e.target.value);
                setPagination((prev) => ({ ...prev, pageNo: 1 }));
                setSelectedIds([]);
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
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-lg">
              <MdExpandMore />
            </span>
          </div>
        </div>
      </div>

      {/* Statistics & Bulk Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="bg-[#0074bd]/10 p-3 rounded-lg">
            <span className="text-[#0074bd] text-2xl">
              <MdQuiz />
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

        {selectedIds.length > 0 && (
          <div className="md:col-span-2 bg-red-50 p-5 rounded-xl border border-red-100 shadow-sm flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-red-100 p-3 rounded-lg">
                <span className="text-red-600 text-2xl">
                  <MdDeleteSweep />
                </span>
              </div>
              <div>
                <p className="text-red-700 text-sm font-medium">
                  Đã chọn {selectedIds.length} câu hỏi
                </p>
                <p className="text-xs text-red-500">
                  Bạn có thể xóa tất cả các mục đã chọn
                </p>
              </div>
            </div>
            <button
              onClick={handleBatchDeleteClick}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold transition-all shadow-sm cursor-pointer"
            >
              <span className="text-lg"><MdDelete/></span>
              Xóa các mục đã chọn
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 w-10">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-[#0074bd] focus:ring-[#0074bd] cursor-pointer"
                  checked={
                    questions.length > 0 &&
                    selectedIds.length === questions.length
                  }
                  onChange={handleSelectAll}
                />
              </th>
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
          <tbody
            className={`divide-y divide-slate-100 transition-opacity duration-200 ${fetching && !loading ? "opacity-50 pointer-events-none" : ""}`}
          >
            {questions.length === 0 && !loading && (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-12 text-center text-slate-500"
                >
                  Không có câu hỏi nào
                </td>
              </tr>
            )}
            {questions.map((question) => {
              const badge = getDifficultyBadge(question.difficulty);
              return (
                <tr
                  key={question.id}
                  className={`hover:bg-slate-50 transition-colors ${selectedIds.includes(question.id) ? "bg-blue-50/50" : ""}`}
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 text-[#0074bd] focus:ring-[#0074bd] cursor-pointer"
                      checked={selectedIds.includes(question.id)}
                      onChange={() => handleSelectRow(question.id)}
                    />
                  </td>
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
                        <span className="text-lg">
                          <MdEdit/> 
                        </span>
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(question.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <span className="text-lg">
                          <MdDelete/>
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
            onPageChange={(page) => {
              setPagination((prev) => ({ ...prev, pageNo: page }));
              setSelectedIds([]);
            }}
            pageSize={pagination.pageSize}
            onPageSizeChange={(size) => {
              setPagination((prev) => ({
                ...prev,
                pageSize: size,
                pageNo: 1,
              }));
              setSelectedIds([]);
            }}
            pageSizeOptions={[10, 20, 50, 100, 1000]}
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
        onClose={() =>
          setDeleteModal({ isOpen: false, questionId: null, isBatch: false })
        }
        onConfirm={handleConfirmDelete}
        title={deleteModal.isBatch ? "Xóa hàng loạt câu hỏi" : "Xóa câu hỏi"}
        message={
          deleteModal.isBatch
            ? `Bạn có chắc chắn muốn xóa ${selectedIds.length} câu hỏi đã chọn? Hành động này không thể hoàn tác.`
            : "Bạn có chắc chắn muốn xóa câu hỏi này? Hành động này không thể hoàn tác."
        }
        variant="danger"
        confirmLabel="Xóa"
        cancelLabel="Hủy"
      />
    </div>
  );
};

export default QuestionBankPage;
