import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdAccessTime,
  MdFormatListBulleted,
  MdEventBusy,
  MdArrowForward,
  MdQuiz,
  MdHistory,
} from "react-icons/md";
import {
  useStudentTeacherQuizzes,
  useMyOngoingQuizzes,
} from "../../hooks/useQuizzes";
import { QuizHistoryModal } from "../../components/student/QuizHistoryModal";
import { QuizReviewModal } from "../../components/student/QuizReviewModal";
import type { StudentTeacherQuiz } from "../../types/quiz";

const StudentAvailableQuizzesPage = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  const { data: quizzes, loading } = useStudentTeacherQuizzes();
  const { data: ongoingQuizzes, loading: ongoingLoading } =
    useMyOngoingQuizzes();

  // Modal States
  const [historyQuiz, setHistoryQuiz] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [reviewAttemptId, setReviewAttemptId] = useState<string | null>(null);

  const getQuizStatus = (quiz: StudentTeacherQuiz) => {
    // If closeTime passed -> Closed
    if (quiz.closeTime && new Date(quiz.closeTime) < new Date()) {
      return "closed";
    }
    return "open";
  };

  // Combine and Normalize Data for Rendering
  const getDisplayData = () => {
    if (filter === "ongoing") {
      return ongoingQuizzes.map((q) => ({
        id: q.quizId, // Use quizId for navigation
        attemptId: q.id,
        title: q.quizTitle,
        duration: q.durationInMinutes,
        questionCount: q.questions?.length || 0,
        status: "ongoing",
        isAvailable: true,
        original: q,
        viewType: "ongoing",
        type: "QUIZ" as const, // Default or derived if possible, currently defaulting to QUIZ for ongoing
        closeTime: undefined,
        maxAttempts: undefined,
        attemptsCount: undefined,
      }));
    }

    const availableList = quizzes.map((q) => {
      const status = getQuizStatus(q);
      return {
        id: q.id,
        attemptId: null,
        title: q.title,
        duration: q.durationInMinutes,
        questionCount: q.totalQuestions,
        status: status,
        isAvailable: status === "open",
        closeTime: q.closeTime,
        original: q,
        viewType: "available",
        type: q.type,
        maxAttempts: q.maxAttempts,
        attemptsCount: q.attemptsCount || 0,
      };
    });

    if (filter === "all") return availableList;
    return availableList.filter((q) => q.status === filter);
  };

  const displayList = getDisplayData();
  const isLoading = filter === "ongoing" ? ongoingLoading : loading;

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-100px)]">
      {/* Header Section */}
      <div className="flex flex-col gap-2 md:gap-3 mb-6 md:mb-8">
        <h1 className="text-[#111827] text-2xl md:text-3xl font-black leading-tight tracking-tight">
          Bài thi & Quiz khả dụng
        </h1>
        <p className="text-gray-600 text-sm md:text-base font-normal max-w-2xl">
          Danh sách các bài kiểm tra hiện có. Hãy hoàn thành đúng hạn.
        </p>
      </div>

      {/* Tabs */}
      <div className="sticky top-0 z-20 bg-gray-50/95 backdrop-blur-sm -mx-4 px-4 md:static md:bg-transparent md:mx-0 md:px-0 mb-6 transition-all duration-200">
        <div className="w-full border-b border-gray-200/60">
          <div className="overflow-x-auto scrollbar-hide pb-1 -mb-px">
            <div className="flex gap-6 md:gap-8 min-w-max px-1">
              {[
                { id: "all", label: "Tất cả" },
                { id: "ongoing", label: "Đang làm dở" },
                { id: "open", label: "Đang mở" },
                { id: "closed", label: "Đã kết thúc" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`
                    relative py-3 text-sm md:text-base font-bold whitespace-nowrap transition-colors select-none
                    ${
                      filter === tab.id
                        ? "text-[#0077BE]"
                        : "text-gray-500 hover:text-gray-800"
                    }
                  `}
                >
                  {tab.label}
                  {filter === tab.id && (
                    <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#0077BE] rounded-t-full shadow-sm" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Grid */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      ) : displayList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6 px-2 pb-10">
          {displayList.map((quiz) => {
            const isOngoing = quiz.viewType === "ongoing";

            return (
              <div
                key={isOngoing ? quiz.attemptId : quiz.id}
                className={`
                group bg-white border border-gray-200 rounded-2xl 
                p-5 md:p-6 
                shadow-sm hover:shadow-lg hover:border-blue-100 hover:-translate-y-1 
                transition-all duration-300 ease-out
                flex flex-col h-full relative isolate
                ${!quiz.isAvailable && !isOngoing ? "opacity-75 grayscale-[0.3] hover:translate-y-0 hover:shadow-none" : ""}
              `}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-1 text-[10px] md:text-[11px] font-bold uppercase tracking-wide rounded-full bg-blue-50 text-blue-700">
                    {quiz.type === "PRACTICE" ? "Luyện tập" : "Bài kiểm tra"}
                  </span>
                  <span
                    className={`px-2.5 py-1 text-[10px] md:text-[11px] font-bold rounded-full border ${
                      isOngoing
                        ? "bg-yellow-50 text-yellow-700 border-yellow-100"
                        : quiz.status === "open"
                          ? "bg-green-50 text-green-700 border-green-100"
                          : "bg-gray-50 text-gray-500 border-gray-100"
                    }`}
                  >
                    {isOngoing
                      ? "Đang thực hiện"
                      : quiz.status === "open"
                        ? "Đang mở"
                        : "Đã kết thúc"}
                  </span>
                </div>

                <h3
                  className="text-gray-900 text-lg font-bold mb-4 leading-snug line-clamp-2 min-h-14"
                  title={quiz.title}
                >
                  {quiz.title}
                </h3>

                <div className="space-y-3 mb-6 flex-1">
                  <div className="flex items-center gap-3 text-gray-600 text-sm">
                    <MdAccessTime className="text-lg text-gray-400 shrink-0" />
                    <span className="truncate">
                      Thời gian:{" "}
                      <span className="font-semibold text-gray-700">
                        {quiz.duration} phút
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600 text-sm">
                    <MdFormatListBulleted className="text-lg text-gray-400 shrink-0" />
                    <span className="truncate">
                      Số câu hỏi:{" "}
                      <span className="font-semibold text-gray-700">
                        {quiz.questionCount}
                      </span>
                    </span>
                  </div>
                  {quiz.viewType === "available" && quiz.closeTime && (
                    <div className="flex items-center gap-3 text-gray-600 text-sm">
                      <MdEventBusy className="text-lg text-gray-400 shrink-0" />
                      <span className="truncate">
                        Hạn chót:{" "}
                        <span className="font-semibold text-gray-700">
                          {new Date(quiz.closeTime).toLocaleDateString("vi-VN")}
                        </span>
                      </span>
                    </div>
                  )}
                  {quiz.viewType === "available" &&
                    (quiz.maxAttempts || 0) > 0 && (
                      <div className="flex items-center gap-3 text-gray-600 text-sm">
                        <span className="material-symbols-outlined text-lg text-gray-400 shrink-0">
                          repeat
                        </span>
                        <span className="truncate">
                          Số lần thi:{" "}
                          <span className="font-semibold text-gray-700">
                            {quiz.maxAttempts}
                          </span>
                        </span>
                      </div>
                    )}
                  {isOngoing && (
                    <div className="flex items-center gap-3 text-gray-600 text-sm">
                      <MdAccessTime className="text-lg text-yellow-500 shrink-0" />
                      <span className="truncate text-yellow-700 font-medium">
                        Đang làm dở
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 mt-auto">
                  {!isOngoing && (
                    <button
                      onClick={() =>
                        setHistoryQuiz({ id: quiz.id, title: quiz.title })
                      }
                      className="flex-1 py-2.5 rounded-xl font-bold text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                    >
                      <MdHistory className="text-lg" />
                      Lịch sử
                    </button>
                  )}
                  <button
                    disabled={
                      (!quiz.isAvailable && !isOngoing) ||
                      (quiz.viewType === "available" &&
                        (quiz.maxAttempts || 0) > 0 &&
                        (quiz.attemptsCount || 0) >= (quiz.maxAttempts || 0))
                    }
                    onClick={() => navigate(`/student/quizzes/${quiz.id}/take`)}
                    className={`
                    ${isOngoing ? "w-full" : "flex-[1.5]"} py-2.5 rounded-xl font-bold text-sm
                    flex items-center justify-center gap-2 transition-all
                    ${
                      quiz.isAvailable || isOngoing
                        ? "color-primary-bg text-white hover:opacity-80 hover:cursor-pointer shadow-md shadow-blue-500/20 active:scale-[0.98]"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed hidden"
                    }
                    `}
                  >
                    {quiz.isAvailable || isOngoing ? (
                      <>
                        <span>
                          {isOngoing ? "Tiếp tục làm bài" : "Làm bài"}
                        </span>
                        <MdArrowForward
                          className={`text-lg ${isOngoing ? "animate-pulse" : ""}`}
                        />
                      </>
                    ) : (
                      <span>Chưa mở</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center px-4">
          <div className="bg-gray-50 p-6 rounded-full mb-4">
            <MdQuiz className="text-5xl text-gray-300" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">
            {filter === "ongoing"
              ? "Không có bài thi nào đang làm dở"
              : "Không tìm thấy bài thi nào"}
          </h3>
          <p className="text-gray-500 mt-2 text-sm max-w-xs">
            Thử thay đổi bộ lọc hoặc quay lại sau.
          </p>
        </div>
      )}

      {/* Modals */}
      <QuizHistoryModal
        isOpen={!!historyQuiz}
        onClose={() => setHistoryQuiz(null)}
        quizId={historyQuiz?.id || ""}
        quizTitle={historyQuiz?.title || ""}
        onReview={(attemptId) => setReviewAttemptId(attemptId)}
      />

      <QuizReviewModal
        isOpen={!!reviewAttemptId}
        onClose={() => setReviewAttemptId(null)}
        attemptId={reviewAttemptId}
      />
    </div>
  );
};

export default StudentAvailableQuizzesPage;
