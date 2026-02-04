import { useState, useEffect, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { MdTimer, MdFlag, MdArrowBack, MdArrowForward } from "react-icons/md";
import { ConfirmationModal } from "../../components/common/ConfirmationModal";
import {
  useStartQuiz,
  useSubmitQuiz,
  useSaveQuizProgress,
  useCheckPracticeAnswer,
} from "../../hooks/useQuizzes";
import { toast } from "../../components/common/Toast";
import type {
  QuizStartResponse,
  QuizQuestionAttempt,
  CheckPracticeAnswerResponse,
} from "../../types/quiz";

const StudentQuizTakingPage = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();

  // API Hooks
  const { start } = useStartQuiz();
  const { submit, loading: submitLoading } = useSubmitQuiz();
  const { save } = useSaveQuizProgress();
  const { check: checkAnswer, loading: checkLoading } =
    useCheckPracticeAnswer();

  // State
  const [attempt, setAttempt] = useState<QuizStartResponse | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(
    new Set(),
  );
  const [practiceFeedback, setPracticeFeedback] = useState<
    Record<string, CheckPracticeAnswerResponse>
  >({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // Auto-save refs
  const lastSavedAnswersRef = useRef<Record<string, string[]>>({});
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Quiz
  useEffect(() => {
    if (!quizId) return;
    const init = async () => {
      try {
        const data = await start(quizId);
        setAttempt(data);

        // Pre-fill answers if resuming an attempt
        const initialAnswers: Record<string, string[]> = {};
        if (data.questions) {
          data.questions.forEach((q) => {
            if (q.selectedAnswerIds && q.selectedAnswerIds.length > 0) {
              initialAnswers[q.id] = q.selectedAnswerIds;
            }
          });
        }
        setAnswers(initialAnswers);
        lastSavedAnswersRef.current = JSON.parse(
          JSON.stringify(initialAnswers),
        );

        // Initialize timer from server time if possible, or just duration
        // Assuming startedAt is ISO string
        if (data.status === "IN_PROGRESS" && data.startedAt) {
          const startTime = new Date(data.startedAt).getTime();
          const durationMs = data.durationInMinutes * 60 * 1000;
          const endTime = startTime + durationMs;
          const now = Date.now();
          const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
          setTimeLeft(remaining);
        } else if (data.status !== "IN_PROGRESS") {
          // Already completed?
          toast.info("Bài kiểm tra đã hoàn thành");
          // navigate result?
        }
      } catch (error) {
        toast.error("Không thể bắt đầu bài kiểm tra");
        navigate(-1);
      }
    };
    init();
  }, [quizId]);

  // Timer Tick
  useEffect(() => {
    if (!attempt || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(); // Auto submit
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [attempt, timeLeft]);

  // Auto Save
  useEffect(() => {
    if (!attempt || Object.keys(answers).length === 0) return;

    // Check if answers changed significantly (simple check)
    const hasChanges = Object.keys(answers).some(
      (qId) =>
        JSON.stringify(answers[qId]) !==
        JSON.stringify(lastSavedAnswersRef.current[qId]),
    );

    if (hasChanges) {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => {
        const formattedAnswers = Object.entries(answers).map(
          ([qId, selectedIds]) => ({
            questionId: qId,
            selectedAnswerIds: selectedIds,
          }),
        );
        save({ attemptId: attempt.id, answers: formattedAnswers }).then(() => {
          lastSavedAnswersRef.current = JSON.parse(JSON.stringify(answers));
        });
      }, 5000); // 2 seconds debounce
    }

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [answers, attempt]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleAnswerSelect = (
    questionId: string,
    optionId: string,
    type: string,
  ) => {
    // Clear feedback when changing answer
    if (practiceFeedback[questionId]) {
      setPracticeFeedback((prev) => {
        const next = { ...prev };
        delete next[questionId];
        return next;
      });
    }

    setAnswers((prev) => {
      const currentSelected = prev[questionId] || [];
      let newSelected: string[];

      if (type === "MULTIPLE_CHOICE") {
        if (currentSelected.includes(optionId)) {
          newSelected = currentSelected.filter((id) => id !== optionId);
        } else {
          newSelected = [...currentSelected, optionId];
        }
      } else {
        // Single Choice / True False
        newSelected = [optionId];
      }

      return {
        ...prev,
        [questionId]: newSelected,
      };
    });
  };

  const handleCheckAnswer = async (questionId: string) => {
    if (!attempt) return;
    const selectedAnswerIds = answers[questionId];
    if (!selectedAnswerIds || selectedAnswerIds.length === 0) {
      toast.info("Vui lòng chọn đáp án trước khi kiểm tra");
      return;
    }

    try {
      const res = await checkAnswer({
        questionId,
        selectedAnswerIds,
      });
      setPracticeFeedback((prev) => ({ ...prev, [questionId]: res }));
    } catch (err) {
      toast.error("Không thể kiểm tra đáp án");
    }
  };

  const toggleFlag = (questionId: string) => {
    setFlaggedQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) newSet.delete(questionId);
      else newSet.add(questionId);
      return newSet;
    });
  };

  const handleSubmit = async () => {
    if (!attempt) return;
    try {
      const formattedAnswers = Object.entries(answers).map(
        ([qId, selectedIds]) => ({
          questionId: qId,
          selectedAnswerIds: selectedIds,
        }),
      );
      await submit({ attemptId: attempt.id, answers: formattedAnswers });
      toast.success("Nộp bài thành công!");
      navigate("/student/quizzes"); // Or result page?
    } catch (error) {
      toast.error("Nộp bài thất bại");
    } finally {
      setIsSubmitModalOpen(false);
    }
  };

  if (!attempt) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Đang tải đề thi...
      </div>
    );
  }

  const currentQuestion = attempt.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === attempt.questions.length - 1;

  const getQuestionStatusClass = (
    question: QuizQuestionAttempt,
    index: number,
  ) => {
    const isCurrent = currentQuestionIndex === index;
    const isAnswered = answers[question.id] && answers[question.id].length > 0;
    const isFlagged = flaggedQuestions.has(question.id);

    if (isCurrent)
      return "border-2 border-[#007bff] color-primary bg-blue-50 font-bold";
    if (isFlagged) return "border-2 border-amber-400 font-bold bg-amber-50";
    if (isAnswered) return "color-primary-bg text-white font-bold";
    return "bg-gray-100 hover:bg-gray-200 font-medium";
  };

  return (
    <div className="flex flex-col min-h-screen bg-white transition-colors duration-200">
      {/* TopNavBar */}
      <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-[#e5e7eb] bg-white px-6 py-3 lg:px-10">
        <div className="flex items-center gap-4">
          <Link to="/student/quizzes" className="text-primary w-8 h-8">
            <img src="/ies-edu-logo.png" alt="Logo" className="w-8 h-8" />
          </Link>
          <h2 className="color-primary text-lg font-bold leading-tight hidden sm:block">
            IES EDU
          </h2>
        </div>
        <div className="flex flex-1 justify-end gap-4 lg:gap-8 items-center">
          <span className="hidden md:block text-gray-600 text-sm font-medium">
            {attempt.quizTitle}
          </span>
          <div className="flex gap-3">
            <div
              className={`flex h-10 px-4 items-center gap-2 rounded-lg text-sm font-bold border ${timeLeft < 60 ? "bg-red-50 text-red-600 border-red-100" : "bg-gray-50 text-gray-700 border-gray-100"}`}
            >
              <MdTimer className="text-[18px]" />
              <span>{formatTime(timeLeft)}</span>
            </div>
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="color-primary-bg hover:bg-primary/90 text-white px-6 py-2 rounded-lg text-sm font-bold transition-all disabled:opacity-50"
              disabled={submitLoading}
            >
              {submitLoading ? "Đang nộp..." : "Nộp bài"}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex max-w-[1440px] mx-auto w-full p-4 lg:p-8 gap-8">
        {/* SideNavBar */}
        <aside className="hidden lg:flex flex-col w-[320px] shrink-0 gap-6">
          <div className="bg-white rounded-xl border border-[#e5e7eb] p-5 shadow-sm sticky top-24">
            <div className="mb-5">
              <h3 className="text-gray-800 text-base font-bold mb-1">
                Danh sách câu hỏi
              </h3>
              <p className="text-gray-500 text-sm font-normal">
                Đã hoàn thành: {Object.keys(answers).length}/
                {attempt.questions.length}
              </p>
            </div>
            <div className="grid grid-cols-5 gap-2 mb-8">
              {attempt.questions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`flex items-center justify-center w-10 h-10 rounded-lg text-sm transition-all ${getQuestionStatusClass(q, idx)}`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
            <div className="space-y-3 pt-4 border-t border-[#e5e7eb]">
              {/* Legend - Same as before */}
              <div className="flex items-center gap-3">
                <span className="w-4 h-4 rounded-sm color-primary-bg"></span>
                <span className="text-sm font-medium text-gray-600">
                  Đã làm
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-4 h-4 rounded-sm bg-gray-100"></span>
                <span className="text-sm font-medium text-gray-600">
                  Chưa làm
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-4 h-4 rounded-sm border-2 border-[#007bff] bg-blue-50"></span>
                <span className="text-sm font-medium text-gray-600">
                  Đang chọn
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-4 h-4 rounded-sm border-2 border-amber-400 bg-amber-50"></span>
                <span className="text-sm font-medium text-gray-600">
                  Xem lại
                </span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <section className="flex-1 flex flex-col gap-6">
          <div className="bg-white rounded-xl border border-[#e5e7eb] p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h1 className="text-gray-800 text-xl lg:text-2xl font-bold">
                Câu hỏi {currentQuestionIndex + 1} của{" "}
                {attempt.questions.length}
              </h1>
              <button
                onClick={() => toggleFlag(currentQuestion.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  flaggedQuestions.has(currentQuestion.id)
                    ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                    : "bg-[#f0f2f4] hover:bg-[#e2e4e7] text-[#111418]"
                }`}
              >
                <MdFlag
                  className={`text-[20px] ${flaggedQuestions.has(currentQuestion.id) ? "fill-amber-600" : ""}`}
                />
                <span>
                  {flaggedQuestions.has(currentQuestion.id)
                    ? "Bỏ đánh dấu"
                    : "Đánh dấu xem lại"}
                </span>
              </button>
            </div>

            <div className="mt-8">
              <p className="text-gray-800 text-lg lg:text-xl font-medium leading-relaxed">
                {currentQuestion.content}
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-4">
              {currentQuestion.answers.map((option) => {
                const isSelected = answers[currentQuestion.id]?.includes(
                  option.id,
                );
                return (
                  <label
                    key={option.id}
                    className={`group flex items-center gap-4 rounded-xl border-2 border-solid p-4 cursor-pointer transition-all ${
                      isSelected
                        ? "border color-primary"
                        : "border-[#e5e7eb] hover:border-[#007bff]"
                    }`}
                  >
                    <div className="relative flex items-center justify-center">
                      <input
                        checked={isSelected || false}
                        onChange={() =>
                          handleAnswerSelect(
                            currentQuestion.id,
                            option.id,
                            currentQuestion.type,
                          )
                        }
                        className="peer h-5 w-5 border border-[#dbe0e6] bg-transparent text-transparent checked:border-[#007bff] checked:bg-white focus:outline-none focus:ring-0 focus:ring-offset-0 transition-colors appearance-none rounded-full"
                        name={`question-${currentQuestion.id}`}
                        type={
                          currentQuestion.type === "MULTIPLE_CHOICE"
                            ? "checkbox"
                            : "radio"
                        }
                      />
                      <div className="absolute w-2.5 h-2.5 rounded-full color-primary-bg scale-0 peer-checked:scale-100 transition-transform pointer-events-none" />
                    </div>

                    <div className="flex grow flex-col">
                      <p className="text-gray-600 text-base font-medium">
                        {option.content}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>

            {/* Practice Mode Feedback */}
            {attempt.type === "PRACTICE" && (
              <div className="mt-8">
                {!practiceFeedback[currentQuestion.id] && (
                  <button
                    onClick={() => handleCheckAnswer(currentQuestion.id)}
                    disabled={checkLoading}
                    className="px-6 py-2.5 bg-indigo-50 text-indigo-700 font-bold rounded-lg hover:bg-indigo-100 transition-colors flex items-center gap-2 border border-indigo-200"
                  >
                    {checkLoading ? "Đang kiểm tra..." : "Kiểm tra đáp án"}
                    {!checkLoading && (
                      <span className="material-symbols-outlined text-sm">
                        check_circle
                      </span>
                    )}
                  </button>
                )}

                {practiceFeedback[currentQuestion.id] && (
                  <div
                    className={`p-5 rounded-xl border ${practiceFeedback[currentQuestion.id].correct ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`material-symbols-outlined text-2xl ${practiceFeedback[currentQuestion.id].correct ? "text-green-600" : "text-red-600"}`}
                      >
                        {practiceFeedback[currentQuestion.id].correct
                          ? "check_circle"
                          : "cancel"}
                      </span>
                      <div>
                        <h4
                          className={`font-bold text-lg mb-1 ${practiceFeedback[currentQuestion.id].correct ? "text-green-800" : "text-red-800"}`}
                        >
                          {practiceFeedback[currentQuestion.id].correct
                            ? "Chính xác!"
                            : "Chưa chính xác"}
                        </h4>
                        <p className="text-gray-700 leading-relaxed mb-3">
                          {practiceFeedback[currentQuestion.id].explanation}
                        </p>

                        {!practiceFeedback[currentQuestion.id].correct &&
                          practiceFeedback[currentQuestion.id]
                            .correctAnswerIds && (
                            <div className="text-sm bg-white/50 p-3 rounded-lg inline-block">
                              <span className="font-bold text-gray-800">
                                Đáp án đúng:{" "}
                              </span>
                              <span className="text-gray-700">
                                {currentQuestion.answers
                                  .filter((a) =>
                                    practiceFeedback[
                                      currentQuestion.id
                                    ].correctAnswerIds?.includes(a.id),
                                  )
                                  .map((a) => a.content)
                                  .join(", ")}
                              </span>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="mt-12 flex justify-between border-t border-[#e5e7eb] pt-8">
              <button
                onClick={() =>
                  setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))
                }
                disabled={currentQuestionIndex === 0}
                className="flex items-center gap-2 px-6 py-3 bg-[#f0f2f4] hover:bg-[#e2e4e7] text-[#111418] rounded-lg font-bold transition-all disabled:opacity-50"
              >
                <MdArrowBack />
                <span>Câu trước</span>
              </button>
              <button
                onClick={() =>
                  setCurrentQuestionIndex((prev) =>
                    Math.min(attempt.questions.length - 1, prev + 1),
                  )
                }
                disabled={isLastQuestion}
                className="flex items-center gap-2 px-6 py-3 color-primary-bg hover:bg-primary/90 text-white rounded-lg font-bold transition-all shadow-md shadow-primary/20 disabled:opacity-50 disabled:shadow-none"
              >
                <span>Câu tiếp theo</span>
                <MdArrowForward />
              </button>
            </div>
          </div>
        </section>
      </main>

      <ConfirmationModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onConfirm={handleSubmit}
        title="Xác nhận nộp bài"
        message="Bạn có chắc chắn muốn nộp bài kiểm tra này? Hành động này không thể hoàn tác."
        confirmLabel={submitLoading ? "Đang nộp..." : "Nộp bài"}
        cancelLabel="Hủy"
        variant="danger"
      />
    </div>
  );
};

export default StudentQuizTakingPage;
