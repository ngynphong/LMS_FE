import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { FaCircleNotch } from "react-icons/fa";
import type { QuizSummary } from "@/types/quiz";

interface ExtendedQuizSummary extends QuizSummary {
  description?: string;
}

interface CourseQuizTabProps {
  lessonQuizzes: ExtendedQuizSummary[] | undefined;
  quizLoading: boolean;
  onStartQuiz: (quizId: string) => void;
}

const CourseQuizTab = ({
  lessonQuizzes,
  quizLoading,
  onStartQuiz,
}: CourseQuizTabProps) => {
  if (quizLoading) {
    return (
      <div className="flex justify-center p-8">
        <span className="animate-spin text-3xl color-primary">
          <FaCircleNotch />
        </span>
      </div>
    );
  }

  if (!lessonQuizzes || lessonQuizzes.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 bg-slate-50 rounded-xl border border-dashed border-slate-300">
        <div className="text-center text-gray-500">
          <span className="material-symbols-outlined text-4xl mb-2 opacity-50">
            quiz
          </span>
          <p>Không có bài kiểm tra nào cho nội dung này.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-4">
      {lessonQuizzes.map((quiz) => (
        <div
          key={quiz.id}
          className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold text-[#1A2B3C]">
                  {quiz.title}
                </h3>
                <span
                  className={`text-xs px-2 py-0.5 rounded font-bold uppercase ${
                    quiz.type === "PRACTICE"
                      ? "bg-indigo-100 text-indigo-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {quiz.type === "PRACTICE" ? "Luyện tập" : "Kiểm tra"}
                </span>
              </div>
              <span className="text-sm text-gray-500 mb-2">
                {quiz.description}
              </span>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">
                    timer
                  </span>
                  {quiz.durationInMinutes} phút
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">
                    help
                  </span>
                  {quiz.totalQuestions} câu hỏi
                </span>
                {(quiz.maxAttempts || 0) > 0 && (
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">
                      repeat
                    </span>
                    {quiz.maxAttempts} lần
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base text-gray-500 font-semibold">
              Hạn chót:
            </span>
            <p className="text-sm text-gray-500">
              {quiz.closeTime
                ? format(
                    new Date(quiz.closeTime),
                    "HH:mm 'ngày' dd/MM/yyyy (EEEE)",
                    {
                      locale: vi,
                    },
                  )
                : "Chưa đặt"}
            </p>
          </div>

          {/* Actions Section */}
          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100 flex-wrap">
            {(() => {
              const isClosed =
                quiz.closeTime && new Date(quiz.closeTime) < new Date();

              return (
                <>
                  {/* Primary Action: Start Immediately */}
                  <button
                    onClick={() => onStartQuiz(quiz.id)}
                    disabled={isClosed || false}
                    className={`px-5 py-2.5 text-white font-bold rounded-xl shadow-sm transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed ${
                      isClosed
                        ? "bg-gray-400 hover:bg-gray-400"
                        : "color-primary-bg hover:bg-[#006da8] hover:shadow-md"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {isClosed ? "lock" : "play_arrow"}
                    </span>
                    {isClosed ? "Đã đóng" : "Bắt đầu làm bài"}
                  </button>

                  {isClosed && (
                    <span className="text-red-500 text-sm font-medium">
                      Bài quiz này đã đóng
                    </span>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CourseQuizTab;
