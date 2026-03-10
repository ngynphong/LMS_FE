import { useParams, useNavigate } from "react-router-dom";
import { useQuizReview } from "@/hooks/useQuizzes";
import { FaCircleNotch } from "react-icons/fa";
import {
  MdCheckCircle,
  MdCancel,
  MdInfoOutline,
  MdArrowBack,
  MdFactCheck,
} from "react-icons/md";

const QuizAttemptResultPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: review, isLoading, isError } = useQuizReview(id);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="animate-spin text-4xl color-primary">
          <FaCircleNotch />
        </span>
      </div>
    );
  }

  if (isError || !review) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <MdInfoOutline className="text-6xl text-slate-300" />
        <h2 className="text-xl font-bold text-slate-700">
          Không tìm thấy kết quả bài làm
        </h2>
        <p className="text-sm text-slate-500">
          Bài làm không tồn tại hoặc bạn không có quyền xem.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 color-primary-bg text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          <MdArrowBack />
          Quay lại
        </button>
      </div>
    );
  }

  const correctCount = review.details?.filter((q) => q.isCorrect)?.length ?? 0;
  const totalCount = review.details?.length ?? 0;
  const scorePercent =
    totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          title="Quay lại"
        >
          <MdArrowBack className="text-xl text-slate-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Kết quả bài làm</h1>
          <p className="text-md text-slate-500 mt-0.5">
            {review.quizTitle || "Chi tiết bài kiểm tra"}
          </p>
        </div>
      </div>

      {/* Score Summary Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Circular Score */}
          <div className="relative w-28 h-28 shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
              <circle
                cx="64"
                cy="64"
                r="56"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="12"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                fill="none"
                stroke={
                  scorePercent >= 70
                    ? "#22c55e"
                    : scorePercent >= 50
                      ? "#f59e0b"
                      : "#ef4444"
                }
                strokeWidth="12"
                strokeDasharray={`${(scorePercent / 100) * 352} 352`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-slate-900">
                {scorePercent}%
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-4 text-center sm:text-left">
            <div>
              <p className="text-sm text-slate-500">Số câu đúng</p>
              <p className="text-xl font-bold text-green-600">
                {correctCount}/{totalCount}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Điểm số</p>
              <p className="text-xl font-bold text-slate-900">
                {review.totalScore ?? "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Kết quả</p>
              <p
                className={`text-xl font-bold ${review.isPassed ? "text-green-600" : "text-red-500"}`}
              >
                {review.isPassed ? "Đạt" : "Không đạt"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Answer List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
          <MdFactCheck className="text-lg color-primary" />
          <h3 className="font-bold text-slate-800">Chi tiết câu trả lời</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {review.details?.map((question, index) => (
            <div key={question.questionId || index} className="p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <span className="shrink-0 mt-0.5">
                  {question.isCorrect ? (
                    <MdCheckCircle className="text-xl text-green-500" />
                  ) : (
                    <MdCancel className="text-xl text-red-500" />
                  )}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-slate-800">
                      Câu {index + 1}: {question.questionContent}
                    </p>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        question.isCorrect
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      +{question.scoreEarned}
                    </span>
                  </div>

                  {/* Selected answers */}
                  {question.selectedAnswers &&
                    question.selectedAnswers.length > 0 && (
                      <div className="space-y-1 mb-2">
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Đã chọn
                        </p>
                        {question.selectedAnswers.map((ans) => (
                          <div
                            key={ans.id}
                            className={`text-sm px-3 py-1.5 rounded-lg ${
                              ans.correct
                                ? "bg-green-50 text-green-700"
                                : "bg-red-50 text-red-700"
                            }`}
                          >
                            {ans.content}
                          </div>
                        ))}
                      </div>
                    )}

                  {/* Text answer */}
                  {question.textAnswer && (
                    <div className="mb-2">
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                        Câu trả lời
                      </p>
                      <div
                        className={`text-sm px-3 py-1.5 rounded-lg ${
                          question.isCorrect
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {question.textAnswer}
                      </div>
                    </div>
                  )}

                  {/* Correct answers (khi trả lời sai) */}
                  {!question.isCorrect &&
                    question.correctAnswers &&
                    question.correctAnswers.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Đáp án đúng
                        </p>
                        {question.correctAnswers.map((ans) => (
                          <div
                            key={ans.id}
                            className="text-sm px-3 py-1.5 rounded-lg bg-green-50 text-green-700"
                          >
                            {ans.content}
                          </div>
                        ))}
                      </div>
                    )}

                  {/* Explanation */}
                  {question.explanation && (
                    <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                      <p className="text-xs font-medium text-blue-600 uppercase tracking-wider mb-1">
                        Giải thích
                      </p>
                      <p className="text-sm text-blue-800">
                        {question.explanation}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizAttemptResultPage;
