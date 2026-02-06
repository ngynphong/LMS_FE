import { Link } from "react-router-dom";
import type { QuizPerformanceResponse } from "../../../types/teacherDashboard";

interface QuizPerformanceSectionProps {
  data: QuizPerformanceResponse[] | undefined;
  isLoading: boolean;
}

const QuizPerformanceSection = ({
  data,
  isLoading,
}: QuizPerformanceSectionProps) => {
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-xl border border-[#dbe2e6] flex flex-col h-full">
        <div className="h-6 w-40 bg-gray-200 rounded mb-6 animate-pulse" />
        <div className="flex flex-col gap-4 flex-1">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50 animate-pulse"
            >
              <div className="flex flex-col gap-2 flex-1">
                <div className="h-4 w-32 bg-gray-200 rounded" />
                <div className="h-3 w-24 bg-gray-200 rounded" />
              </div>
              <div className="h-8 w-16 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const quizzes = data?.slice(0, 5) || [];

  if (quizzes.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl border border-[#dbe2e6] flex flex-col h-full">
        <h2 className="text-[#111518] text-lg font-bold mb-6">
          Hiệu suất Quiz
        </h2>
        <div className="flex items-center justify-center flex-1 text-[#607b8a]">
          Chưa có dữ liệu quiz
        </div>
      </div>
    );
  }

  const getPassRateColor = (rate: number) => {
    if (rate >= 70) return "text-green-600 bg-green-100";
    if (rate >= 50) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-[#dbe2e6] flex flex-col h-full">
      <h2 className="text-[#111518] text-lg font-bold mb-6">Hiệu suất Quiz</h2>

      <div className="flex flex-col gap-3 flex-1">
        {quizzes.map((quiz) => (
          <div
            key={quiz.quizId}
            className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex flex-col flex-1 min-w-0">
              <p
                className="text-sm font-semibold text-[#111518] truncate"
                title={quiz.quizTitle}
              >
                {quiz.quizTitle}
              </p>
              <div className="flex items-center gap-3 text-xs text-[#607b8a]">
                <span>Điểm TB: {quiz.averageScore.toFixed(1)}</span>
                <span>•</span>
                <span>{quiz.totalAttempts} lượt làm</span>
              </div>
            </div>
            <span
              className={`text-xs font-bold px-3 py-1.5 rounded-full ${getPassRateColor(quiz.passRate)}`}
            >
              {quiz.passRate.toFixed(0)}% đậu
            </span>
          </div>
        ))}
      </div>

      <Link to="/teacher/quizzes" className="flex items-center justify-center w-full mt-4 py-2 border border-dashed border-[#dbe2e6] rounded-lg text-xs font-medium text-[#607b8a] hover:bg-gray-50 transition-all">
        Xem tất cả quiz
      </Link>
    </div>
  );
};

export default QuizPerformanceSection;
