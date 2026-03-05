import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLiveQuizSocket } from "@/hooks/useLiveQuizSocket";
import {
  useLiveQuizDetails,
  useShowLiveAnswer,
  useNextLiveQuestion,
  useFinishLiveQuiz,
  useLiveQuizPlayers,
} from "@/hooks/useLiveQuiz";
import { LiveQuestionDisplay } from "@/components/live-quiz/LiveQuestionDisplay";
import { ConfirmationModal } from "@/components/common/ConfirmationModal";
import { toast } from "@/components/common/Toast";
import type { LiveQuestion } from "@/types/live-quiz";

const LiveQuizHostPlayPage = () => {
  const { pin } = useParams<{ pin: string }>();
  const navigate = useNavigate();

  const { data: quizDetails, isLoading } = useLiveQuizDetails(pin);
  const showAnswerMutation = useShowLiveAnswer();
  const nextQuestionMutation = useNextLiveQuestion();
  const finishQuizMutation = useFinishLiveQuiz();

  const { data: initialPlayers } = useLiveQuizPlayers(pin, true);
  const { isConnected, playersList } = useLiveQuizSocket(pin || null, "HOST");

  // Combined player count (socket + initial fetch)
  const totalPlayersCount = Math.max(
    playersList.length,
    initialPlayers?.length || 0,
  );

  // Controls State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState<LiveQuestion | null>(
    null,
  );
  const [gameState, setGameState] = useState<"QUESTION" | "RESULT">("QUESTION");

  // Timer State
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Modal State
  const [isEndGameModalOpen, setIsEndGameModalOpen] = useState(false);

  // Initialization and Question Sync
  useEffect(() => {
    if (quizDetails && quizDetails.questions.length > 0) {
      setCurrentQuestion(quizDetails.questions[currentQuestionIndex]);
      setTimeRemaining(20);
      if (gameState === "QUESTION") {
        startTimer(20);
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

  // Auto-reveal answer when time runs out
  useEffect(() => {
    if (gameState === "QUESTION" && timeRemaining <= 0.1 && currentQuestion) {
      handleShowAnswer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRemaining, gameState]); // DO NOT depend on currentQuestion to avoid re-triggering when question switches

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

  const handleFinishGame = () => {
    setIsEndGameModalOpen(true);
  };

  const confirmFinishGame = async () => {
    if (!pin) return;

    try {
      await finishQuizMutation.mutateAsync(pin);
      setIsEndGameModalOpen(false);
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
            {totalPlayersCount} Học sinh
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
            totalTime={20}
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

      <ConfirmationModal
        isOpen={isEndGameModalOpen}
        onClose={() => setIsEndGameModalOpen(false)}
        onConfirm={confirmFinishGame}
        title="Kết thúc trò chơi"
        message="Bạn có chắc chắn muốn kết thúc trò chơi này sớm không? Hành động này không thể hoàn tác."
        confirmLabel="Kết thúc"
        cancelLabel="Hủy"
        variant="danger"
        isLoading={finishQuizMutation.isPending}
      />
    </div>
  );
};

export default LiveQuizHostPlayPage;
