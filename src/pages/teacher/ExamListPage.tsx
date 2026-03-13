import { useState } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Link, useNavigate } from "react-router-dom";
import {
  useTeacherQuizzes,
  useGenerateQuizCode,
  usePublishQuiz,
  useDeleteQuiz,
} from "@/hooks/useQuizzes";
import { ConfirmationModal } from "@/components/common/ConfirmationModal";
import { useHostLiveQuiz } from "@/hooks/useLiveQuiz";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "@/components/common/Toast";
import PaginationControl from "@/components/common/PaginationControl";
import { IoIosAddCircle } from "react-icons/io";
import { IoCalendarSharp, IoSearch } from "react-icons/io5";
import { MdAllInclusive, MdDelete, MdEdit, MdOutlinePublicOff, MdPublic, MdQuiz, MdRefresh, MdTimer } from "react-icons/md";
import { FaCopy, FaKey } from "react-icons/fa";
import LoadingOverlay from "@/components/common/LoadingOverlay";

const ExamListPage = () => {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(9);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [selectedType, setSelectedType] = useState<"QUIZ" | "PRACTICE" | "">(
    "",
  );
  const [selectedStatus, setSelectedStatus] = useState<boolean | null>(null);

  const {
    data: exams,
    isLoading: loading,
    error,
  } = useTeacherQuizzes({
    pageNo: page,
    pageSize,
    keyword: debouncedSearchQuery || undefined,
    type: selectedType || undefined,
    isPublished: selectedStatus,
    sorts: "createdAt:desc",
  });
  const { mutateAsync: generate, isPending: isGenerating } =
    useGenerateQuizCode();
  const { mutateAsync: publish, isPending: isPublishing } = usePublishQuiz();
  const { mutateAsync: deleteQuiz, isPending: isDeleting } = useDeleteQuiz();
  const hostLiveQuiz = useHostLiveQuiz();
  const navigate = useNavigate();
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    quizId: string | null;
  }>({ isOpen: false, quizId: null });

  const handleGenerateCode = async (quizId: string) => {
    try {
      const res = await generate(quizId);
      toast.success(`Mã code mới: ${res.code}`);
      // Assuming refetch is no longer needed or handled by query invalidation
    } catch (error) {
      toast.error("Thất bại khi tạo mã code");
    }
  };

  const handlePublish = async (quizId: string, currentStatus: string) => {
    if (currentStatus === "PUBLISHED") return; // Assuming PUBLISHED is the new status string
    try {
      await publish(quizId);
      toast.success("Đã xuất bản bài kiểm tra");
    } catch (e) {
      toast.error("Có lỗi xảy ra khi xuất bản");
    }
  };

  const handleDeleteQuiz = async () => {
    if (!deleteModal.quizId) return;
    try {
      await deleteQuiz(deleteModal.quizId);
      toast.success("Đã xóa bài kiểm tra");
    } catch (error) {
      toast.error("Xóa bài kiểm tra thất bại");
    } finally {
      setDeleteModal({ isOpen: false, quizId: null });
    }
  };

  const handleHostLiveQuiz = async (quizId: string) => {
    try {
      const res = await hostLiveQuiz.mutateAsync(quizId);
      // Save host info just in case
      localStorage.setItem("host_live_quiz_pin", res.pin);
      navigate(`/teacher/live-quiz/lobby/${res.pin}`);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Không thể tải phòng Live Quiz",
      );
    }
  };

  // Exams list from server response
  const examsList = (exams as any)?.items || [];

  if (loading)
    return (
      <LoadingOverlay isLoading={loading} message="Đang tải"/>
    );
  if (error)
    return (
      <div className="p-8 text-center text-red-500">
        Đã xảy ra lỗi khi tải danh sách đề thi.
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-[#111518] text-2xl font-bold tracking-tight">
            Quản lý đề thi
          </h1>
          <p className="text-[#617a89] text-sm mt-1">
            Tạo và quản lý các bài kiểm tra, đề thi
          </p>
        </div>
        <Link
          to="/teacher/quizzes/new"
          className="color-primary-bg hover:translate-y-[-2px] duration-300 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-bold transition-all shadow-md"
        >
          <span className="text-lg">
            <IoIosAddCircle />
          </span>
          Tạo đề thi mới
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="flex-1 min-w-[250px]">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <IoSearch />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF] text-sm transition-all"
              placeholder="Tìm theo tiêu đề bài tập..."
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedType}
            onChange={(e) => {
              setSelectedType(e.target.value as any);
              setPage(1);
            }}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1E90FF] font-medium text-slate-600 cursor-pointer"
          >
            <option value="">Tất cả loại</option>
            <option value="QUIZ">Bài kiểm tra</option>
            <option value="PRACTICE">Luyện tập</option>
          </select>

          <select
            value={
              selectedStatus === null
                ? "all"
                : selectedStatus
                  ? "published"
                  : "draft"
            }
            onChange={(e) => {
              const val = e.target.value;
              setSelectedStatus(
                val === "all" ? null : val === "published" ? true : false,
              );
              setPage(1);
            }}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1E90FF] font-medium text-slate-600 cursor-pointer"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="published">Đã công khai</option>
            <option value="draft">Bản nháp</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {examsList.map((exam: any) => (
          <div
            key={exam.id}
            className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-5">
              <div className="flex items-start justify-between gap-2 mb-3">
                <h3 className="text-[#111518] text-base font-bold leading-tight line-clamp-2">
                  {exam.title}
                </h3>
                <div className="flex flex-col gap-1 items-end">
                  <span
                    className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${exam.isPublished ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                  >
                    {exam.isPublished ? "Public" : "Private"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                <div className="flex items-center gap-1">
                  <span className="text-xl">
                    <MdQuiz />
                  </span>
                  <span>{exam.totalQuestions} câu</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xl">
                    <MdTimer />
                  </span>
                  <span>{exam.durationInMinutes} phút</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                <div className="flex items-center gap-1">
                  <span className="text-xl">
                    <IoCalendarSharp />
                  </span>
                  <span>
                    {exam.closeTime
                      ? format(
                          new Date(exam.closeTime),
                          "HH:mm 'ngày' dd/MM/yyyy (EEEE)",
                          {
                            locale: vi,
                          },
                        )
                      : "Chưa đặt"}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() =>
                    handlePublish(
                      exam.id,
                      exam.isPublished ? "PUBLISHED" : "DRAFT",
                    )
                  }
                  disabled={isPublishing}
                  className={`flex items-center justify-center gap-1 p-2 rounded-lg text-sm font-bold transition-colors ${
                    exam.isPublished
                      ? "bg-green-50 text-green-600 hover:bg-green-100"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  title={
                    exam.isPublished ? "Đã công khai" : "Công khai bài thi"
                  }
                >
                  <span className="text-lg">
                    {exam.isPublished ? <MdPublic /> : <MdOutlinePublicOff />}
                  </span>
                  {exam.isPublished ? "Đã công khai" : "Công khai"}
                </button>
                {exam.isPublished && (
                  <button
                    onClick={() => handleHostLiveQuiz(exam.id)}
                    disabled={hostLiveQuiz.isPending}
                    className="flex items-center justify-center gap-1 p-2 rounded-lg bg-indigo-50 text-indigo-600 font-bold hover:bg-indigo-100 transition-colors shadow-sm ml-auto border border-indigo-200 group"
                    title="Mở phòng chơi trực tiếp"
                  >
                    <span className="text-lg group-hover:animate-spin-slow">
                      <MdAllInclusive />
                    </span>
                    Live Quiz
                  </button>
                )}
              </div>

              <div className="flex gap-2 pt-3 border-t border-slate-100 mt-3">
                <Link
                  to={`/teacher/quizzes/${exam.id}/edit`}
                  className="flex items-center justify-center gap-1 p-2 rounded-lg bg-[#0074bd]/10 text-[#0074bd] text-sm font-bold hover:bg-[#0074bd]/20 transition-colors"
                >
                  <span className="text-base">
                    <MdEdit />
                  </span>
                  Sửa
                </Link>
                <button
                  onClick={() => handleGenerateCode(exam.id)}
                  disabled={isGenerating}
                  className="flex items-center justify-center gap-1 p-2 rounded-lg bg-purple-50 text-purple-600 text-sm font-bold hover:bg-purple-100 transition-colors"
                  title="Tạo mã Code"
                >
                  <span className="text-lg">
                    {exam.code ? <MdRefresh /> : <FaKey />}
                  </span>
                  {exam.code ? "Đổi mã" : "Tạo mã"}
                </button>
                <button
                  onClick={() =>
                    setDeleteModal({ isOpen: true, quizId: exam.id })
                  }
                  className="flex items-center justify-center p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                  title="Xóa đề thi"
                >
                  <MdDelete className="text-lg" />
                </button>
                {exam.code && (
                  <div className="flex items-center gap-1 p-1 px-2 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="font-mono font-bold text-[#1A2B3C]">
                      {exam.code}
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(exam.code!);
                        toast.success("Đã sao chép mã!");
                      }}
                      className="text-gray-400 hover:text-[#1E90FF]"
                      title="Sao chép"
                    >
                      <span className="text-sm">
                        <FaCopy />
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {examsList.length === 0 && (
          <div className="col-span-full text-center py-10 text-slate-500">
            Không tìm thấy đề thi nào phù hợp.
          </div>
        )}
      </div>

      {/* Pagination */}
      {(exams?.totalPage || 0) > 1 && (
        <div className="mt-8 flex justify-center">
          <PaginationControl
            currentPage={page}
            totalPages={exams?.totalPage || 1}
            onPageChange={setPage}
          />
        </div>
      )}

      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, quizId: null })}
        onConfirm={handleDeleteQuiz}
        title="Xóa đề thị"
        message="Bạn có chắc chắn muốn xóa bài kiểm tra này? Hành động này không thể hoàn tác."
        variant="danger"
        confirmLabel="Xóa"
        cancelLabel="Hủy"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default ExamListPage;
