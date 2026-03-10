import { Link, useParams } from "react-router-dom";
import {
  useQuizStatistics,
  useTeacherStudentAttempts,
} from "@/hooks/useQuizzes";
import LoadingOverlay from "@/components/common/LoadingOverlay";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useState } from "react";
import PaginationControl from "@/components/common/PaginationControl";
import { useDebounce } from "@/hooks/useDebounce";
import { QuizReviewModal } from "@/components/student/QuizReviewModal";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import type { TeacherStudentAttempt } from "@/types/quiz";

const ExamReportDetailPage = () => {
  const { id } = useParams();
  const [studentPage, setStudentPage] = useState(1);
  const [studentPageSize, setStudentPageSize] = useState(20);
  const [studentKeyword, setStudentKeyword] = useState("");
  const [selectedAttemptId, setSelectedAttemptId] = useState<string | null>(
    null,
  );
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const debouncedKeyword = useDebounce(studentKeyword, 500);

  const {
    data: stats,
    isLoading: isStatsLoading,
    error: statsError,
  } = useQuizStatistics(id);

  const { data: studentStats, isLoading: isStudentsLoading } =
    useTeacherStudentAttempts({
      quizId: id,
      pageNo: studentPage,
      pageSize: studentPageSize,
      keyword: debouncedKeyword || undefined,
      sorts: "startedAt:desc",
    });

  const handleViewReview = (attemptId: string) => {
    setSelectedAttemptId(attemptId);
    setIsReviewModalOpen(true);
  };

  if (isStatsLoading) {
    return <LoadingOverlay isLoading={true} message="Đang tải báo cáo..." />;
  }

  if (statsError || !stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <span className="material-symbols-outlined text-slate-300 text-6xl">
          error
        </span>
        <p className="text-slate-500 font-medium">
          Không thể tải báo cáo hoặc bài thi không tồn tại.
        </p>
        <Link
          to="/teacher/reports"
          className="px-6 py-2 bg-[#0074bd] text-white rounded-lg hover:bg-[#005fa3] transition-colors"
        >
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  const passRate =
    stats.totalAttempts > 0
      ? Math.round((stats.passedCount / stats.totalAttempts) * 100)
      : 0;

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="max-w-2xl">
          <nav className="flex items-center gap-2 text-sm font-medium mb-2">
            <Link
              to="/teacher/reports"
              className="text-slate-500 hover:text-[#0074bd] transition-colors"
            >
              Báo cáo
            </Link>
            <span className="text-slate-400">/</span>
            <span className="text-[#111518]">Chi tiết</span>
          </nav>
          <h2 className="text-[#111518] text-2xl font-bold leading-tight tracking-tight">
            Báo cáo kết quả: {stats.quizTitle}
          </h2>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white flex flex-col gap-2 rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 text-slate-500">
            <span className="material-symbols-outlined text-xl">groups</span>
            <p className="text-xs font-bold uppercase tracking-wider">
              Lượt làm bài
            </p>
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-1">
            {stats.totalAttempts}
          </p>
        </div>
        <div className="bg-white flex flex-col gap-2 rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 text-slate-500">
            <span className="material-symbols-outlined text-xl">star</span>
            <p className="text-xs font-bold uppercase tracking-wider">
              Điểm trung bình
            </p>
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-1">
            {stats.averageScore.toFixed(1)}
          </p>
        </div>
        <div className="bg-white flex flex-col gap-2 rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 text-slate-500">
            <span className="material-symbols-outlined text-xl">
              check_circle
            </span>
            <p className="text-xs font-bold uppercase tracking-wider">
              Tỷ lệ đạt
            </p>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-3xl font-bold text-green-600">{passRate}%</p>
            <span className="text-xs text-slate-400 font-medium">
              ({stats.passedCount} đạt)
            </span>
          </div>
        </div>
        <div className="bg-white flex flex-col gap-2 rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 text-slate-500">
            <span className="material-symbols-outlined text-xl">cancel</span>
            <p className="text-xs font-bold uppercase tracking-wider">
              Chưa đạt
            </p>
          </div>
          <p className="text-3xl font-bold text-red-500 mt-1">
            {stats.failedCount}
          </p>
        </div>
      </div>

      {/* Score Overview */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-[#111518] mb-6 flex items-center gap-2">
          <span className="size-2 rounded-full bg-[#0074bd]"></span>
          Tổng quan điểm số
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-green-50/50 border border-green-100 flex flex-col items-center justify-center group hover:bg-green-50 transition-colors">
            <span className="text-sm text-green-800 font-bold mb-2 uppercase tracking-tight">
              Điểm cao nhất
            </span>
            <span className="text-4xl font-black text-green-600">
              {stats.highestScore}
            </span>
          </div>
          <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100 flex flex-col items-center justify-center group hover:bg-blue-50 transition-colors">
            <span className="text-sm text-blue-800 font-bold mb-2 uppercase tracking-tight">
              Điểm trung bình
            </span>
            <span className="text-4xl font-black text-blue-600">
              {stats.averageScore.toFixed(1)}
            </span>
          </div>
          <div className="p-5 rounded-2xl bg-red-50/50 border border-red-100 flex flex-col items-center justify-center group hover:bg-red-50 transition-colors">
            <span className="text-sm text-red-800 font-bold mb-2 uppercase tracking-tight">
              Điểm thấp nhất
            </span>
            <span className="text-4xl font-black text-red-600">
              {stats.lowestScore}
            </span>
          </div>
        </div>
      </div>

      {/* Student List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h3 className="text-lg font-bold text-[#111518]">
              Danh sách học viên làm bài
            </h3>
            <span className="px-3 py-1 rounded-full bg-blue-50 text-[#0074bd] text-xs font-bold border border-blue-100">
              {studentStats?.totalElement || 0} lượt làm bài
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex-1 min-w-[300px]">
              <span className="text-slate-400 text-sm">Tìm kiếm học viên</span>
              <div className="flex items-center gap-2 relative">
                <span className="material-symbols-outlined text-xl text-slate-400 absolute left-3 top-1/2 -translate-y-1/2">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên hoặc email học viên..."
                  value={studentKeyword}
                  onChange={(e) => {
                    setStudentKeyword(e.target.value);
                    setStudentPage(1);
                  }}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:outline-none focus:ring-[#1E90FF] focus:border-[#1E90FF] transition-all"
                />
              </div>
            </div>

            {/* Reset Filters */}
            {studentKeyword && (
              <button
                onClick={() => {
                  setStudentKeyword("");
                  setStudentPage(1);
                }}
                className="flex items-center justify-center p-2.5 text-slate-400 hover:text-red-500 transition-colors bg-slate-50 border border-slate-200 rounded-xl group"
                title="Xóa bộ lọc"
              >
                <span className="material-symbols-outlined text-xl group-hover:rotate-90 transition-transform">
                  close
                </span>
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto relative min-h-[300px]">
          {isStudentsLoading && (
            <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center backdrop-blur-[1px]">
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-100 border-t-[#1E90FF]"></div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Đang tải dữ liệu...
                </span>
              </div>
            </div>
          )}

          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                  Học viên
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] text-center border-b border-slate-100">
                  Điểm số
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] text-center border-b border-slate-100">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                  Thời gian làm bài
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] text-right border-b border-slate-100">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {studentStats?.items?.map((attempt: TeacherStudentAttempt) => (
                <tr
                  key={attempt.attemptId}
                  className="hover:bg-slate-50/80 transition-all duration-200 group cursor-pointer"
                  onClick={() => handleViewReview(attempt.attemptId)}
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="shrink-0 size-11 rounded-2xl bg-[#0074bd]/5 flex items-center justify-center overflow-hidden border-2 border-slate-100 group-hover:border-[#0074bd]/20 transition-colors">
                        {attempt.studentImgUrl ? (
                          <img
                            src={attempt.studentImgUrl}
                            alt={attempt.studentName}
                            className="size-full object-cover"
                          />
                        ) : (
                          <span className="material-symbols-outlined text-[#0074bd] text-2xl">
                            person
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <p className="text-sm font-bold text-slate-900 group-hover:text-[#0074bd] transition-colors">
                          {attempt.studentName}
                        </p>
                        <p className="text-[11px] text-slate-500 font-medium">
                          {attempt.studentEmail}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="text-lg font-black text-slate-900 group-hover:scale-110 transition-transform inline-block">
                      {attempt.totalScore}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex justify-center">
                      <span
                        className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm ${
                          attempt.isPassed
                            ? "bg-green-50 text-green-700 border border-green-100"
                            : "bg-red-50 text-red-700 border border-red-100"
                        }`}
                      >
                        {attempt.isPassed ? "Đạt" : "Chưa đạt"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2 text-[11px] text-slate-600 font-bold">
                        <span className="material-symbols-outlined text-xs text-[#1E90FF]">
                          play_circle
                        </span>
                        {format(
                          new Date(attempt.startedAt),
                          "HH:mm, dd/MM/yyyy",
                          { locale: vi },
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                        <span className="material-symbols-outlined text-xs">
                          check_circle
                        </span>
                        {format(
                          new Date(attempt.completedAt),
                          "HH:mm, dd/MM/yyyy",
                          { locale: vi },
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex justify-end">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewReview(attempt.attemptId);
                        }}
                        className="flex items-center gap-2 px-3 py-1.5 text-[11px] font-black uppercase tracking-wider text-[#1E90FF] hover:bg-[#1E90FF] hover:text-white rounded-lg border border-[#1E90FF]/20 transition-all duration-200 cursor-pointer"
                      >
                        <MdOutlineRemoveRedEye className="text-base" />
                        Xem chi tiết
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!isStudentsLoading &&
                (!studentStats?.items || studentStats.items.length === 0) && (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-4 text-slate-400">
                        <div className="size-16 rounded-full bg-slate-50 flex items-center justify-center">
                          <span className="material-symbols-outlined text-4xl">
                            clinical_notes
                          </span>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-slate-600">
                            {studentKeyword
                              ? "Không tìm thấy kết quả phù hợp"
                              : "Chưa có lượt làm bài nào"}
                          </p>
                          <p className="text-xs font-medium">
                            Hãy thử thay đổi từ khóa tìm kiếm
                          </p>
                        </div>
                        {studentKeyword && (
                          <button
                            onClick={() => {
                              setStudentKeyword("");
                            }}
                            className="mt-2 text-[#0074bd] text-sm font-bold hover:underline"
                          >
                            Xóa tất cả bộ lọc
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {(studentStats?.totalPage || 0) > 1 && (
          <div className="p-8 border-t border-slate-50">
            <PaginationControl
              currentPage={studentPage}
              totalPages={studentStats?.totalPage || 1}
              onPageChange={setStudentPage}
              pageSize={studentPageSize}
              onPageSizeChange={(newSize) => {
                setStudentPageSize(newSize);
                setStudentPage(1);
              }}
            />
          </div>
        )}
      </div>

      {/* Review Modal */}
      <QuizReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => {
          setIsReviewModalOpen(false);
          setSelectedAttemptId(null);
        }}
        attemptId={selectedAttemptId}
      />
    </div>
  );
};

export default ExamReportDetailPage;
