import { useState } from "react";
import type {
  LessonQuiz as LessonQuizType,
  QuizAttempt,
  QuizResult,
} from "../../types/learningTypes";

interface LessonQuizProps {
  quiz: LessonQuizType;
  onComplete?: (result: QuizResult) => void;
}

const LessonQuiz = ({ quiz, onComplete }: LessonQuizProps) => {
  const [currentStep, setCurrentStep] = useState<"intro" | "quiz" | "result">(
    "intro",
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  const handleStartQuiz = () => {
    setCurrentStep("quiz");
    setCurrentQuestionIndex(0);
    setAttempts([]);
    setSelectedOption(null);
    setShowExplanation(false);
    setResult(null);
  };

  const handleSelectOption = (optionId: string) => {
    if (!showExplanation) {
      setSelectedOption(optionId);
    }
  };

  const handleSubmitAnswer = () => {
    if (!selectedOption) return;

    const newAttempt: QuizAttempt = {
      questionId: currentQuestion.id,
      selectedOptionId: selectedOption,
    };

    const newAttempts = [...attempts, newAttempt];
    setAttempts(newAttempts);
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      const correctCount =
        attempts.filter((attempt, idx) => {
          return (
            attempt.selectedOptionId === quiz.questions[idx].correctOptionId
          );
        }).length +
        (selectedOption === currentQuestion.correctOptionId ? 1 : 0);

      const score = Math.round((correctCount / quiz.questions.length) * 100);
      const quizResult: QuizResult = {
        quizId: quiz.id,
        lessonId: quiz.lessonId,
        totalQuestions: quiz.questions.length,
        correctAnswers: correctCount,
        score,
        passed: score >= quiz.passingScore,
        attempts: [
          ...attempts,
          { questionId: currentQuestion.id, selectedOptionId: selectedOption },
        ],
        completedAt: new Date().toISOString(),
      };

      setResult(quizResult);
      setCurrentStep("result");
      onComplete?.(quizResult);
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    }
  };

  const getOptionClass = (optionId: string) => {
    const baseClass =
      "w-full p-4 rounded-lg border-2 text-left transition-all flex items-center gap-3";

    if (!showExplanation) {
      if (selectedOption === optionId) {
        return `${baseClass} border-[#0077BE] color-primary`;
      }
      return `${baseClass} border-gray-200 hover:border-[#0077BE]/50 hover:bg-gray-50`;
    }

    if (optionId === currentQuestion.correctOptionId) {
      return `${baseClass} border-emerald-500 bg-emerald-50`;
    }
    if (
      selectedOption === optionId &&
      optionId !== currentQuestion.correctOptionId
    ) {
      return `${baseClass} border-red-500 bg-red-50`;
    }
    return `${baseClass} border-gray-200 opacity-50`;
  };

  // Intro screen
  if (currentStep === "intro") {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <span className="material-symbols-outlined text-[64px] color-primary mb-4">
          quiz
        </span>
        <h3 className="text-xl font-bold text-[#1A2B3C] mb-2">{quiz.title}</h3>
        <p className="text-[#4A5568] mb-6">
          {quiz.questions.length} câu hỏi • Điểm đậu: {quiz.passingScore}%
          {quiz.timeLimit && ` • Thời gian: ${quiz.timeLimit} phút`}
        </p>
        <button
          onClick={handleStartQuiz}
          className="px-8 py-3 color-primary-bg text-white font-bold rounded-lg hover:opacity-80 transition-all"
        >
          Bắt đầu làm Quiz
        </button>
      </div>
    );
  }

  // Result screen
  if (currentStep === "result" && result) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <span
          className={`material-symbols-outlined FILL text-[80px] mb-4 ${
            result.passed ? "text-emerald-500" : "text-orange-500"
          }`}
        >
          {result.passed ? "emoji_events" : "sentiment_dissatisfied"}
        </span>
        <h3 className="text-2xl font-bold text-[#1A2B3C] mb-2">
          {result.passed ? "Chúc mừng! Bạn đã vượt qua!" : "Chưa đạt yêu cầu"}
        </h3>
        <p className="text-[#4A5568] mb-6">
          Bạn trả lời đúng {result.correctAnswers}/{result.totalQuestions} câu (
          {result.score}%)
        </p>

        <div className="w-full max-w-xs mx-auto mb-6">
          <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                result.passed ? "bg-emerald-500" : "bg-orange-500"
              }`}
              style={{ width: `${result.score}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0%</span>
            <span className="color-primary font-medium">
              Đậu: {quiz.passingScore}%
            </span>
            <span>100%</span>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={handleStartQuiz}
            className="px-6 py-2 border-2 border-[#0077BE] color-primary font-medium rounded-lg hover:opacity-80 transition-all"
          >
            Làm lại
          </button>
          {result.passed && (
            <button className="px-6 py-2 color-primary text-white font-medium rounded-lg hover:brightness-110 transition-all">
              Tiếp tục học
            </button>
          )}
        </div>
      </div>
    );
  }

  // Quiz screen
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
        <span className="text-sm font-medium text-[#4A5568]">
          Câu {currentQuestionIndex + 1} / {quiz.questions.length}
        </span>
        <div className="flex items-center gap-2">
          {quiz.questions.map((_, idx) => (
            <div
              key={idx}
              className={`w-2 h-2 rounded-full transition-all ${
                idx < currentQuestionIndex
                  ? "bg-emerald-500"
                  : idx === currentQuestionIndex
                    ? "color-primary w-6"
                    : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="p-6">
        <h4 className="text-lg font-semibold text-[#1A2B3C] mb-6">
          {currentQuestion.question}
        </h4>

        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => (
            <button
              key={option.id}
              onClick={() => handleSelectOption(option.id)}
              className={getOptionClass(option.id)}
              disabled={showExplanation}
            >
              <span
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  selectedOption === option.id
                    ? "color-primary text-white"
                    : "bg-gray-100 text-[#4A5568]"
                }`}
              >
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="text-[#1A2B3C]">{option.text}</span>
              {showExplanation &&
                option.id === currentQuestion.correctOptionId && (
                  <span className="material-symbols-outlined FILL text-emerald-500 ml-auto">
                    check_circle
                  </span>
                )}
              {showExplanation &&
                selectedOption === option.id &&
                option.id !== currentQuestion.correctOptionId && (
                  <span className="material-symbols-outlined FILL text-red-500 ml-auto">
                    cancel
                  </span>
                )}
            </button>
          ))}
        </div>

        {showExplanation && currentQuestion.explanation && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined color-primary">
                lightbulb
              </span>
              <div>
                <p className="font-medium color-primary text-sm">Giải thích</p>
                <p className="text-[#4A5568] text-sm mt-1">
                  {currentQuestion.explanation}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-100 flex justify-end gap-3">
        {!showExplanation ? (
          <button
            onClick={handleSubmitAnswer}
            disabled={!selectedOption}
            className="px-6 py-2 color-primary-bg text-white font-medium rounded-lg hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Xác nhận
          </button>
        ) : (
          <button
            onClick={handleNextQuestion}
            className="px-6 py-2 color-primary-bg text-white font-medium rounded-lg hover:opacity-80 transition-all flex items-center gap-2"
          >
            {isLastQuestion ? "Xem kết quả" : "Câu tiếp theo"}
            <span className="material-symbols-outlined text-[18px]">
              arrow_forward
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default LessonQuiz;
