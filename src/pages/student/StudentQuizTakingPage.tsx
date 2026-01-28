import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { MdTimer, MdFlag, MdArrowBack, MdArrowForward } from "react-icons/md";
import { ConfirmationModal } from "../../components/common/ConfirmationModal";

// Mock Data
const MOCK_QUESTIONS = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  text: `Câu hỏi số ${i + 1}: Để căn giữa một phần tử theo chiều ngang trong CSS Flexbox, bạn sử dụng thuộc tính nào?`,
  options: [
    { id: "A", text: "justify-content: center;" },
    { id: "B", text: "align-items: center;" },
    { id: "C", text: "text-align: center;" },
    { id: "D", text: "margin: auto;" },
  ],
}));

const StudentQuizTakingPage = () => {
  const { quizId: _ } = useParams();
  const navigate = useNavigate();

  // State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(
    new Set(),
  );
  const [timeLeft, setTimeLeft] = useState(15 * 60 + 45); // 15:45 in seconds
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  const currentQuestion = MOCK_QUESTIONS[currentQuestionIndex];

  // Timer Effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleAnswerSelect = (optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId,
    }));
  };

  const toggleFlag = () => {
    setFlaggedQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(currentQuestion.id)) {
        newSet.delete(currentQuestion.id);
      } else {
        newSet.add(currentQuestion.id);
      }
      return newSet;
    });
  };

  const handleSubmitRaw = () => {
    setIsSubmitModalOpen(true);
  };

  const onConfirmSubmit = () => {
    setIsSubmitModalOpen(false);
    navigate("/student/quizzes");
  };

  const getQuestionStatusClass = (accIndex: number) => {
    const qId = accIndex + 1;
    const isCurrent = currentQuestionIndex === accIndex;
    const isAnswered = answers[qId] !== undefined;
    const isFlagged = flaggedQuestions.has(qId);

    if (isCurrent)
      return "border-2 border-primary color-primary bg-blue-50 font-bold";
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
            IES Edu
          </h2>
        </div>
        <div className="flex flex-1 justify-end gap-4 lg:gap-8 items-center">
          <span className="hidden md:block text-gray-600 text-sm font-medium">
            Kiểm tra cuối khóa - Lập trình Web Fullstack
          </span>
          <div className="flex gap-3">
            <div className="flex h-10 px-4 items-center gap-2 rounded-lg bg-red-50 text-red-600 text-sm font-bold border border-red-100">
              <MdTimer className="text-[18px]" />
              <span>{formatTime(timeLeft)}</span>
            </div>
            <button
              onClick={handleSubmitRaw}
              className="color-primary-bg hover:bg-primary/90 text-white px-6 py-2 rounded-lg text-sm font-bold transition-all"
            >
              Nộp bài
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex max-w-[1440px] mx-auto w-full p-4 lg:p-8 gap-8">
        {/* SideNavBar: Question Navigation */}
        <aside className="hidden lg:flex flex-col w-[320px] shrink-0 gap-6">
          <div className="bg-white rounded-xl border border-[#e5e7eb] p-5 shadow-sm sticky top-24">
            <div className="mb-5">
              <h3 className="text-gray-800 text-base font-bold mb-1">
                Danh sách câu hỏi
              </h3>
              <p className="text-gray-500 text-sm font-normal">
                Đã hoàn thành: {Object.keys(answers).length}/
                {MOCK_QUESTIONS.length}
              </p>
            </div>
            <div className="grid grid-cols-5 gap-2 mb-8">
              {MOCK_QUESTIONS.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`flex items-center justify-center w-10 h-10 rounded-lg text-sm transition-all ${getQuestionStatusClass(idx)}`}
                >
                  {q.id}
                </button>
              ))}
            </div>
            <div className="space-y-3 pt-4 border-t border-[#e5e7eb]">
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
                <span className="w-4 h-4 rounded-sm border-2 border-blue-500 bg-blue-50"></span>
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

        {/* Main Content Area */}
        <section className="flex-1 flex flex-col gap-6">
          {/* PageHeading */}
          <div className="bg-white rounded-xl border border-[#e5e7eb] p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h1 className="text-gray-800 text-xl lg:text-2xl font-bold">
                Câu hỏi {currentQuestion.id} của {MOCK_QUESTIONS.length}
              </h1>
              <button
                onClick={toggleFlag}
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
            {/* BodyText */}
            <div className="mt-8">
              <p className="text-gray-800 text-lg lg:text-xl font-medium leading-relaxed">
                {currentQuestion.text}
              </p>
            </div>
            {/* RadioList */}
            <div className="mt-8 flex flex-col gap-4">
              {currentQuestion.options.map((option) => (
                <label
                  key={option.id}
                  className={`group flex items-center gap-4 rounded-xl border-2 border-solid p-4 cursor-pointer transition-all ${
                    answers[currentQuestion.id] === option.id
                      ? "border color-primary"
                      : "border-[#e5e7eb] hover:border-primary"
                  }`}
                >
                  <div className="relative flex items-center justify-center">
                    <input
                      checked={answers[currentQuestion.id] === option.id}
                      onChange={() => handleAnswerSelect(option.id)}
                      className="peer h-5 w-5 border-2 border-[#dbe0e6] bg-transparent text-transparent checked:border-primary checked:bg-primary focus:outline-none focus:ring-0 focus:ring-offset-0 transition-colors appearance-none rounded-full"
                      name={`question-${currentQuestion.id}`}
                      type="radio"
                    />
                    <div className="absolute w-2.5 h-2.5 rounded-full color-primary-bg scale-0 peer-checked:scale-100 transition-transform pointer-events-none" />
                  </div>

                  <div className="flex grow flex-col">
                    <p className="text-gray-600 text-base font-medium">
                      {option.id}. {option.text}
                    </p>
                  </div>
                </label>
              ))}
            </div>
            {/* Footer Navigation */}
            <div className="mt-12 flex justify-between border-t border-[#e5e7eb] pt-8">
              <button
                onClick={() =>
                  setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))
                }
                disabled={currentQuestionIndex === 0}
                className="flex items-center gap-2 px-6 py-3 bg-[#f0f2f4] hover:bg-[#e2e4e7] text-[#111418] rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MdArrowBack />
                <span>Câu trước</span>
              </button>
              <button
                onClick={() =>
                  setCurrentQuestionIndex((prev) =>
                    Math.min(MOCK_QUESTIONS.length - 1, prev + 1),
                  )
                }
                disabled={currentQuestionIndex === MOCK_QUESTIONS.length - 1}
                className="flex items-center gap-2 px-6 py-3 color-primary-bg hover:bg-primary/90 text-white rounded-lg font-bold transition-all shadow-md shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
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
        onConfirm={onConfirmSubmit}
        title="Xác nhận nộp bài"
        message="Bạn có chắc chắn muốn nộp bài kiểm tra này? Hành động này không thể hoàn tác."
        confirmLabel="Nộp bài"
        cancelLabel="Hủy"
        variant="danger"
      />
    </div>
  );
};

export default StudentQuizTakingPage;
