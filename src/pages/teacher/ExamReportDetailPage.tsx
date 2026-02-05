import { Link, useParams } from "react-router-dom";
import { useQuizStatistics } from "../../hooks/useQuizzes";

const ExamReportDetailPage = () => {
  const { id } = useParams();
  const { data: stats, isLoading, error } = useQuizStatistics(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <span className="material-symbols-outlined animate-spin text-4xl text-blue-600">
          progress_activity
        </span>
      </div>
    );
  }

  if (error || !stats) {
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

  // Incomplete isn't directly returned, and "totalAttempts" implies completed attempts usually.
  // We will assume totalAttempts = passed + failed for now, or just show passed/failed counts.

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
        <div className="flex gap-3">
          {/* Export button could be re-enabled if backend supports it later */}
          {/* <button className="flex items-center justify-center rounded-lg h-10 px-5 bg-[#0074bd] text-white text-sm font-bold shadow-md hover:opacity-90 transition-opacity">
            <span className="material-symbols-outlined mr-2 text-lg">download</span>
            Xuất báo cáo
          </button> */}
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

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 text-blue-800 text-sm">
        <span className="material-symbols-outlined text-xl">info</span>
        <p>
          Hiện tại hệ thống chỉ hỗ trợ xem báo cáo tổng quan. Tính năng xem chi
          tiết bài làm của từng học viên và biểu đồ phân tích sâu sẽ được cập
          nhật trong phiên bản sau.
        </p>
      </div>
    </div>
  );
};

export default ExamReportDetailPage;
