import { createPortal } from "react-dom";
import {
  MdClose,
  MdHistory,
  MdCheckCircle,
  MdCancel,
  MdPending,
  MdPlayArrow,
} from "react-icons/md";
import { useQuizHistory } from "../../hooks/useQuizzes";

interface QuizHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  quizId: string;
  quizTitle: string;
  onReview: (attemptId: string) => void;
}

export const QuizHistoryModal = ({
  isOpen,
  onClose,
  quizId,
  quizTitle,
  onReview,
}: QuizHistoryModalProps) => {
  const {
    data: historyData,
    isLoading: loading,
    error,
  } = useQuizHistory(isOpen ? quizId : undefined);
  const history = historyData || [];

  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PASSED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800">
            <MdCheckCircle /> Đạt
          </span>
        );
      case "FAILED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800">
            <MdCancel /> Không đạt
          </span>
        );
      case "SUBMITTED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
            <MdCheckCircle /> Đã nộp
          </span>
        );
      case "IN_PROGRESS":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800">
            <MdPending /> Đang làm
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-3xl transform transition-all scale-100 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <MdHistory className="text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Lịch sử làm bài
              </h3>
              <p className="text-sm text-gray-500 font-medium">{quizTitle}</p>
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
        <div className="p-0 overflow-y-auto flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
              <p>Đang tải dữ liệu...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 text-red-500">
              <MdCancel className="text-4xl mb-2" />
              <p>Không thể tải lịch sử làm bài</p>
            </div>
          ) : history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <div className="bg-gray-100 p-4 rounded-full mb-3">
                <MdHistory className="text-4xl text-gray-400" />
              </div>
              <p className="font-medium">Chưa có lượt làm bài nào</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Lần thi
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Thời gian nộp
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">
                    Điểm số
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">
                    Chi tiết
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {history.map((attempt, index) => (
                  <tr
                    key={attempt.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">
                      #{history.length - index}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {attempt.completedAt
                        ? formatDate(attempt.completedAt)
                        : formatDate(attempt.startedAt)}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900 text-center">
                      {attempt.status === "IN_PROGRESS"
                        ? "--"
                        : attempt.totalScore}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {getStatusBadge(attempt.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {attempt.status !== "IN_PROGRESS" && (
                        <button
                          onClick={() => onReview(attempt.id)}
                          className="inline-flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Xem chi tiết
                          <MdPlayArrow className="text-lg" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
