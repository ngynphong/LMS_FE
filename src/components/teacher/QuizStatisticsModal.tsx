import { createPortal } from "react-dom";
import {
  MdClose,
  MdAnalytics,
  MdGroup,
  MdCheckCircle,
  MdCancel,
  MdScore,
  MdTrendingUp,
  MdTrendingDown,
} from "react-icons/md";
import { useQuizStatistics } from "../../hooks/useQuizzes";

interface QuizStatisticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  quizId: string;
}

export const QuizStatisticsModal = ({
  isOpen,
  onClose,
  quizId,
}: QuizStatisticsModalProps) => {
  const {
    data: stats,
    loading,
    error,
  } = useQuizStatistics(isOpen ? quizId : undefined);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl transform transition-all scale-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 shrink-0 bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <MdAnalytics className="text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Thống kê bài thi
              </h3>
              <p className="text-sm text-gray-500 font-medium">
                {stats?.quizTitle || "Đang tải..."}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors p-1"
          >
            <MdClose className="text-2xl" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 bg-gray-50/50 max-h-[80vh] overflow-y-auto hidden-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mb-2"></div>
              <p>Đang tổng hợp số liệu...</p>
            </div>
          ) : error || !stats ? (
            <div className="flex flex-col items-center justify-center py-12 text-red-500">
              <MdCancel className="text-4xl mb-2" />
              <p>Không thể tải thống kê</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Total Attempts */}
              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="p-3 rounded-full bg-blue-50 text-blue-600">
                  <MdGroup className="text-2xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    Tổng lượt thi
                  </p>
                  <p className="text-2xl font-black text-gray-900">
                    {stats.totalAttempts}
                  </p>
                </div>
              </div>

              {/* Average Score */}
              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="p-3 rounded-full bg-orange-50 text-orange-600">
                  <MdScore className="text-2xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    Điểm trung bình
                  </p>
                  <p className="text-2xl font-black text-gray-900">
                    {stats.averageScore.toFixed(1)}
                  </p>
                </div>
              </div>

              {/* Passed */}
              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="p-3 rounded-full bg-green-50 text-green-600">
                  <MdCheckCircle className="text-2xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    Đạt (Passed)
                  </p>
                  <p className="text-2xl font-black text-green-600">
                    {stats.passedCount}
                    <span className="text-sm font-normal text-gray-400 ml-2">
                      (
                      {stats.totalAttempts > 0
                        ? Math.round(
                            (stats.passedCount / stats.totalAttempts) * 100,
                          )
                        : 0}
                      %)
                    </span>
                  </p>
                </div>
              </div>

              {/* Failed */}
              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="p-3 rounded-full bg-red-50 text-red-600">
                  <MdCancel className="text-2xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    Không đạt (Failed)
                  </p>
                  <p className="text-2xl font-black text-red-600">
                    {stats.failedCount}
                    <span className="text-sm font-normal text-gray-400 ml-2">
                      (
                      {stats.totalAttempts > 0
                        ? Math.round(
                            (stats.failedCount / stats.totalAttempts) * 100,
                          )
                        : 0}
                      %)
                    </span>
                  </p>
                </div>
              </div>

              {/* Highest Score */}
              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="p-3 rounded-full bg-teal-50 text-teal-600">
                  <MdTrendingUp className="text-2xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    Điểm cao nhất
                  </p>
                  <p className="text-2xl font-black text-gray-900">
                    {stats.highestScore}
                  </p>
                </div>
              </div>

              {/* Lowest Score */}
              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="p-3 rounded-full bg-pink-50 text-pink-600">
                  <MdTrendingDown className="text-2xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    Điểm thấp nhất
                  </p>
                  <p className="text-2xl font-black text-gray-900">
                    {stats.lowestScore}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 bg-gray-50 border-t border-gray-100 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};
