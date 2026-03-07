import { Link, useParams } from "react-router-dom";
import {
  useQuizStatistics,
  useQuizStudentStatistics,
} from "@/hooks/useQuizzes";
import LoadingOverlay from "@/components/common/LoadingOverlay";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useState } from "react";
import PaginationControl from "@/components/common/PaginationControl";
import { useDebounce } from "@/hooks/useDebounce";

const ExamReportDetailPage = () => {
  const { id } = useParams();
  const [studentPage, setStudentPage] = useState(1);
  const [studentPageSize, setStudentPageSize] = useState(20);
  const [studentKeyword, setStudentKeyword] = useState("");
  const debouncedKeyword = useDebounce(studentKeyword, 500);

  const {
    data: stats,
    isLoading: isStatsLoading,
    error: statsError,
  } = useQuizStatistics(id);
  const {
    data: studentStats,
    isLoading: isStudentsLoading,
    // error: studentsError,
  } = useQuizStudentStatistics(id, {
    pageNo: studentPage,
    pageSize: studentPageSize,
    keyword: debouncedKeyword,
    sorts: "completedAt:desc",
  });

  if (isStatsLoading) {
    return <LoadingOverlay isLoading={true} message="Đang tải báo cáo..." />;
  }

  if (statsError || !stats) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <span className="material-symbols-outlined text-slate-300 text-6xl">
          error
        </span>
        <p className="text-slate-500">
          Không thể tải báo cáo hoặc bài thi không tồn tại.
        </p>
        <Link to="/teacher/reports" className="text-[#0074bd] hover:underline">
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
    <div className="space-y-6">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white flex flex-col gap-2 rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500">
            <span className="material-symbols-outlined text-xl">groups</span>
            <p className="text-sm font-medium uppercase tracking-wider">
              Lượt làm bài
            </p>
          </div>
          <div className="flex items-end gap-2 mt-1">
            <p className="text-3xl font-semibold leading-none">
              {stats.totalAttempts}
            </p>
          </div>
        </div>
        <div className="bg-white flex flex-col gap-2 rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500">
            <span className="material-symbols-outlined text-xl">star</span>
            <p className="text-sm font-medium uppercase tracking-wider">
              Điểm trung bình
            </p>
          </div>
          <div className="flex items-end gap-2 mt-1">
            <p className="text-3xl font-semibold leading-none">
              {stats.averageScore.toFixed(1)}
            </p>
          </div>
        </div>
        <div className="bg-white flex flex-col gap-2 rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500">
            <span className="material-symbols-outlined text-xl">
              check_circle
            </span>
            <p className="text-sm font-medium uppercase tracking-wider">
              Tỷ lệ đạt
            </p>
          </div>
          <div className="flex items-end gap-2 mt-1">
            <p className="text-3xl font-semibold leading-none text-green-600">
              {passRate}%
            </p>
            <span className="text-xs text-slate-400 ml-1">
              ({stats.passedCount} đạt)
            </span>
          </div>
        </div>
        <div className="bg-white flex flex-col gap-2 rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500">
            <span className="material-symbols-outlined text-xl">cancel</span>
            <p className="text-sm font-medium uppercase tracking-wider">
              Chưa đạt
            </p>
          </div>
          <div className="flex items-end gap-2 mt-1">
            <p className="text-3xl font-semibold leading-none text-red-500">
              {stats.failedCount}
            </p>
          </div>
        </div>
      </div>

      {/* Score Overview */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-lg font-bold mb-4">Tổng quan điểm số</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-lg bg-green-50 border border-green-100 flex flex-col items-center justify-center">
            <span className="text-sm text-green-800 font-medium mb-1">
              Điểm cao nhất
            </span>
            <span className="text-3xl font-bold text-green-700">
              {stats.highestScore}
            </span>
          </div>
          <div className="p-4 rounded-lg bg-blue-50 border border-blue-100 flex flex-col items-center justify-center">
            <span className="text-sm text-blue-800 font-medium mb-1">
              Điểm trung bình
            </span>
            <span className="text-3xl font-bold text-blue-700">
              {stats.averageScore.toFixed(1)}
            </span>
          </div>
          <div className="p-4 rounded-lg bg-red-50 border border-red-100 flex flex-col items-center justify-center">
            <span className="text-sm text-red-800 font-medium mb-1">
              Điểm thấp nhất
            </span>
            <span className="text-3xl font-bold text-red-700">
              {stats.lowestScore}
            </span>
          </div>
        </div>
      </div>

      {/* Student List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-[#111518]">
            Danh sách học viên làm bài
          </h3>
          <div className="flex items-center gap-4 flex-1 max-w-md">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                search
              </span>
              <input
                type="text"
                placeholder="Tìm kiếm học viên..."
                value={studentKeyword}
                onChange={(e) => {
                  setStudentKeyword(e.target.value);
                  setStudentPage(1);
                }}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm focus:ring-1 focus:ring-[#0074bd]"
              />
            </div>
            <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold whitespace-nowrap">
              {studentStats?.totalElement || 0} lượt làm bài
            </span>
          </div>
        </div>

        <div className="overflow-x-auto relative min-h-[200px]">
          {isStudentsLoading && (
            <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0074bd]"></div>
            </div>
          )}

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Học viên
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                  Điểm số
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Thời gian làm bài
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {studentStats?.items?.map((attempt) => (
                <tr
                  key={attempt.attemptId}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-[#0074bd]/10 flex items-center justify-center overflow-hidden border border-slate-100">
                        {attempt.studentImgUrl ? (
                          <img
                            src={attempt.studentImgUrl}
                            alt={attempt.studentName}
                            className="size-full object-cover"
                          />
                        ) : (
                          <span className="material-symbols-outlined text-[#0074bd]">
                            person
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#111518]">
                          {attempt.studentName}
                        </p>
                        <p className="text-xs text-slate-500">
                          {attempt.studentEmail}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-base font-bold text-[#111518]">
                      {attempt.totalScore}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          attempt.isPassed
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {attempt.isPassed ? "Đạt" : "Chưa đạt"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <span className="material-symbols-outlined text-sm">
                          play_arrow
                        </span>
                        {format(
                          new Date(attempt.startedAt),
                          "HH:mm, dd/MM/yyyy",
                          { locale: vi },
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <span className="material-symbols-outlined text-sm">
                          check
                        </span>
                        {format(
                          new Date(attempt.completedAt),
                          "HH:mm, dd/MM/yyyy",
                          { locale: vi },
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}

              {!isStudentsLoading &&
                (!studentStats?.items || studentStats.items.length === 0) && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-12 text-center text-slate-400"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <span className="material-symbols-outlined text-4xl">
                          folder_open
                        </span>
                        <p>
                          {studentKeyword
                            ? "Không tìm thấy học viên nào"
                            : "Chưa có học viên nào làm bài"}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {(studentStats?.totalPage || 0) > 1 && (
          <div className="p-6 border-t border-slate-100 flex justify-center">
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
    </div>
  );
};

export default ExamReportDetailPage;
