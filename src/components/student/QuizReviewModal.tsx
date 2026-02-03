import { createPortal } from "react-dom";
import {
  MdClose,
  MdFactCheck,
  MdCheckCircle,
  MdCancel,
  MdInfoOutline,
} from "react-icons/md";
import { useQuizReview } from "../../hooks/useQuizzes";

interface QuizReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  attemptId: string | null;
}

export const QuizReviewModal = ({
  isOpen,
  onClose,
  attemptId,
}: QuizReviewModalProps) => {
  const {
    data: review,
    loading,
    error,
  } = useQuizReview(isOpen && attemptId ? attemptId : undefined);

  if (!isOpen || !attemptId) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-4xl transform transition-all scale-100 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 shrink-0 bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <MdFactCheck className="text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Chi tiết kết quả
              </h3>
              {review && (
                <div className="flex items-center gap-3 text-sm font-medium mt-0.5">
                  <span className="text-gray-600">
                    Điểm:{" "}
                    <span className="text-gray-900 font-bold">
                      {review.totalScore}
                    </span>
                  </span>
                  <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                  <span
                    className={`${review.isPassed ? "text-green-600" : "text-red-600"}`}
                  >
                    {review.isPassed ? "Đạt" : "Không đạt"}
                  </span>
                </div>
              )}
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
        <div className="p-6 overflow-y-auto flex-1 bg-gray-50">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mb-2"></div>
              <p>Đang tải chi tiết bài làm...</p>
            </div>
          ) : error || !review ? (
            <div className="flex flex-col items-center justify-center py-12 text-red-500">
              <MdCancel className="text-4xl mb-2" />
              <p>Không thể tải chi tiết bài làm</p>
            </div>
          ) : (
            <div className="space-y-6">
              {review.details.map((q, idx) => {
                const isQuestionCorrect = q.isCorrect;

                return (
                  <div
                    key={q.questionId}
                    className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
                  >
                    <div className="flex gap-4">
                      <span
                        className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold ${
                          isQuestionCorrect
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <div className="flex-1">
                        <div className="text-gray-900 font-medium text-lg leading-relaxed mb-4">
                          {q.questionContent}
                        </div>

                        {/* Options (We assume we can't render exact options unless API returns all options. 
                                        Usually review API returns question context including all options, 
                                        OR we only show User Answer vs Correct Answer.
                                        
                                        Based on `QuizQuestionReview` type:
                                        - `selectedAnswers`: AnswerDetail[]
                                        - `correctAnswers`: AnswerDetail[]
                                        
                                        Wait, if I only have selected and correct, I might not see the distractor options.
                                        But typically Review UI wants to see full context.
                                        If the API only returns selected/correct, we display those. 
                                        Let's assume we display what we have.
                                    */}

                        <div className="space-y-3">
                          {/* Since we might not have ALL options, we list Selected and Correct explicitly if structure is limited.
                                            But usually types might have `options` if full review.
                                            Checking types again: `QuizQuestionReview` has selectedAnswers, correctAnswers. No full options list.
                                            So we can only show which were selected and which are correct.
                                        */}

                          <div className="flex flex-col gap-2">
                            <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                              Câu trả lời của bạn:
                            </div>
                            {q.selectedAnswers.length > 0 ? (
                              q.selectedAnswers.map((ans) => (
                                <div
                                  key={ans.id}
                                  className={`p-3 rounded-lg border flex items-center gap-3 ${
                                    isQuestionCorrect
                                      ? "bg-green-50 border-green-200 text-green-900"
                                      : "bg-red-50 border-red-200 text-red-900"
                                  }`}
                                >
                                  {isQuestionCorrect ? (
                                    <MdCheckCircle className="text-green-500 text-xl" />
                                  ) : (
                                    <MdCancel className="text-red-500 text-xl" />
                                  )}
                                  <span>{ans.content}</span>
                                </div>
                              ))
                            ) : (
                              <div className="text-gray-400 italic text-sm">
                                Không trả lời
                              </div>
                            )}
                          </div>

                          {!isQuestionCorrect && (
                            <div className="flex flex-col gap-2 mt-2">
                              <div className="text-xs font-bold text-green-600 uppercase tracking-wide mb-1">
                                Đáp án đúng:
                              </div>
                              {q.correctAnswers.map((ans) => (
                                <div
                                  key={ans.id}
                                  className="p-3 rounded-lg border border-green-200 bg-white text-green-900 flex items-center gap-3"
                                >
                                  <MdCheckCircle className="text-green-500 text-xl" />
                                  <span>{ans.content}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {q.explanation && (
                          <div className="mt-4 p-4 bg-blue-50 rounded-lg text-blue-900 text-sm leading-relaxed flex gap-3">
                            <MdInfoOutline className="text-blue-500 text-xl shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold block mb-1 text-blue-700">
                                Giải thích:
                              </span>
                              {q.explanation}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="shrink-0 text-right">
                        <span
                          className={`text-sm font-bold ${isQuestionCorrect ? "text-green-600" : "text-red-600"}`}
                        >
                          {q.scoreEarned} điểm
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 bg-gray-50 border-t border-gray-100 shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-bold text-white bg-[#0078bd] rounded-xl hover:bg-[#006da8] shadow-sm hover:shadow transition-all"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};
