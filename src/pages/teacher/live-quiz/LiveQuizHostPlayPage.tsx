import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLiveQuizSocket } from "@/hooks/useLiveQuizSocket";
import {
  useLiveQuizDetails,
  useShowLiveAnswer,
  useShowLiveLeaderboard,
  useNextLiveQuestion,
  useFinishLiveQuiz,
} from "@/hooks/useLiveQuiz";
import { LiveQuestionDisplay } from "@/components/live-quiz/LiveQuestionDisplay";
import { toast } from "@/components/common/Toast";
import type { LiveQuestion } from "@/types/live-quiz";

const LiveQuizHostPlayPage = () => {
  const { pin } = useParams<{ pin: string }>();
  const navigate = useNavigate();

  const { data: quizDetails, isLoading } = useLiveQuizDetails(pin);
  const showAnswerMutation = useShowLiveAnswer();
  const showLeaderboardMutation = useShowLiveLeaderboard();
  const nextQuestionMutation = useNextLiveQuestion();
  const finishQuizMutation = useFinishLiveQuiz();

  const { isConnected, playersList } = useLiveQuizSocket(pin || null, "HOST");

  // Controls State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState<LiveQuestion | null>(
    null,
  );
  const [gameState, setGameState] = useState<"QUESTION" | "RESULT">("QUESTION");

  // Timer State
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialization and Question Sync
  useEffect(() => {
    if (quizDetails && quizDetails.questions.length > 0) {
      setCurrentQuestion(quizDetails.questions[currentQuestionIndex]);
      if (gameState === "QUESTION") {
        startTimer(
          quizDetails.questions[currentQuestionIndex].timeLimitSeconds,
        );
      }
    }
  }, [quizDetails, currentQuestionIndex, gameState]);

  // Timer Logic
  const startTimer = (seconds: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeRemaining(seconds);

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0.1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 0.1;
      });
    }, 100);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Actions
  const handleShowAnswer = async () => {
    if (!pin || !currentQuestion) return;
    try {
      await showAnswerMutation.mutateAsync({
        pin,
        questionId: currentQuestion.id,
      });
      setGameState("RESULT");
      if (timerRef.current) clearInterval(timerRef.current);
    } catch (error) {
      toast.error("Không thể hiển thị đáp án");
    }
  };

  const handleShowLeaderboard = async () => {
    if (!pin) return;
    try {
      await showLeaderboardMutation.mutateAsync(pin);
      // After showing leaderboard briefly on host, we can transition to next question
      // In a more complex app we'd have a separate Leaderboard view for Host too.
      // For now, let's keep it simple: Host sees stats, then clicks Next.
      toast.success("Đã bật bảng xếp hạng trên máy người chơi.");
    } catch (error) {
      toast.error("Lỗi khi hiển thị bảng xếp hạng");
    }
  };

  const handleNextQuestion = async () => {
    if (!pin || !quizDetails) return;

    const nextIdx = currentQuestionIndex + 1;
    if (nextIdx >= quizDetails.questions.length) {
      handleFinishGame();
      return;
    }

    const nextQId = quizDetails.questions[nextIdx].id;

    try {
      await nextQuestionMutation.mutateAsync({ pin, questionId: nextQId });
      setCurrentQuestionIndex(nextIdx);
      setGameState("QUESTION");
    } catch (error) {
      toast.error("Không thể chuyển câu hỏi");
    }
  };

  const handleFinishGame = async () => {
    if (!pin) return;
    if (!window.confirm("Bạn có chắc chắn muốn kết thúc trò chơi này?")) return;

    try {
      await finishQuizMutation.mutateAsync(pin);
      navigate(`/teacher/live-quiz/result/${pin}`);
    } catch (error) {
      toast.error("Không thể kết thúc game");
    }
  };

  if (isLoading || !currentQuestion) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent flex items-center justify-center rounded-full animate-spin"></div>
      </div>
    );
  }

  // Since Host doesn't know the exact correct answer from the initial 'details' API call
  // due to security, the Host's view of 'SHOW_RESULT' doesn't highlight correct answer
  // locally unless we had another API for Host to fetch it.
  // We pass empty array for correct answers and rely purely on 'READ_ONLY' visual.

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center">
      {/* Host Control Header */}
      <div className="w-full bg-slate-900 text-white p-4 shadow-md flex flex-col md:flex-row justify-between items-center z-10 gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-slate-800 px-4 py-2 rounded-lg font-mono font-bold tracking-widest text-indigo-400 border border-slate-700">
            PIN: {pin}
          </div>
          <div className="flex items-center gap-2 text-slate-300 font-medium">
            <span className="material-symbols-outlined">group</span>
            {playersList.length} Học sinh
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="bg-indigo-600 text-white font-bold px-3 py-1 rounded-md">
            Câu {currentQuestionIndex + 1} / {quizDetails?.questions.length}
          </span>
          {!isConnected && (
            <span className="bg-red-500 text-white font-bold px-3 py-1 rounded-md flex items-center gap-1 text-sm animate-pulse">
              <span className="material-symbols-outlined text-sm">
                wifi_off
              </span>
              Mất kết nối
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleFinishGame}
            className="px-4 py-2 rounded-lg bg-red-500/10 text-red-500 font-bold hover:bg-red-500/20 transition-colors border border-red-500/30"
          >
            Kết thúc Sớm
          </button>
        </div>
      </div>

      {/* Game Stage */}
      <div className="w-full flex-1 p-4 md:p-8 flex flex-col items-center justify-center relative">
        {/* Timer Large Display */}
        {gameState === "QUESTION" && (
          <div className="absolute top-8 left-8 w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center border-4 border-indigo-100 z-20">
            <span
              className={`text-4xl font-black ${timeRemaining < 5 ? "text-red-500 animate-pulse" : "text-slate-800"}`}
            >
              {Math.ceil(timeRemaining)}
            </span>
          </div>
        )}

        <div className="w-full pointer-events-none">
          <LiveQuestionDisplay
            question={currentQuestion}
            mode="READ_ONLY"
            timeRemaining={gameState === "QUESTION" ? timeRemaining : 0}
            totalTime={currentQuestion.timeLimitSeconds}
          />
        </div>
      </div>

      {/* Action Footer */}
      <div className="w-full bg-white border-t border-slate-200 p-6 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] flex justify-center gap-6 z-20">
        {gameState === "QUESTION" ? (
          <button
            onClick={handleShowAnswer}
            disabled={showAnswerMutation.isPending}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xl font-bold py-4 px-12 rounded-xl shadow-lg transition-transform active:scale-95 disabled:bg-slate-400"
          >
            Hiện Đáp Án
          </button>
        ) : (
          <>
            <button
              onClick={handleShowLeaderboard}
              disabled={showLeaderboardMutation.isPending}
              className="bg-purple-600 hover:bg-purple-700 text-white text-lg font-bold py-4 px-8 rounded-xl shadow-md transition-transform active:scale-95 disabled:bg-slate-400 flex items-center gap-2"
            >
              <span className="material-symbols-outlined">leaderboard</span>
              Bật BXH trên máy học sinh
            </button>

            <button
              onClick={handleNextQuestion}
              disabled={nextQuestionMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold py-4 px-12 rounded-xl shadow-md transition-transform active:scale-95 disabled:bg-slate-400 flex items-center gap-2"
            >
              {currentQuestionIndex + 1 >=
              (quizDetails?.questions.length || 0) ? (
                <>
                  Kết thúc{" "}
                  <span className="material-symbols-outlined">flag</span>
                </>
              ) : (
                <>
                  Câu Tiếp Theo{" "}
                  <span className="material-symbols-outlined">
                    arrow_forward
                  </span>
                </>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default LiveQuizHostPlayPage;
