import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLiveQuizSocket } from "@/hooks/useLiveQuizSocket";
import { useSubmitLiveAnswer } from "@/hooks/useLiveQuiz";
import { LiveQuestionDisplay } from "@/components/live-quiz/LiveQuestionDisplay";
import type { LiveQuestion } from "@/types/live-quiz";
import { toast } from "@/components/common/Toast";

const LiveQuizPlayPage = () => {
  const { pin } = useParams<{ pin: string }>();
  const navigate = useNavigate();

  const [playerId, setPlayerId] = useState<string>("");
  const [playerName, setPlayerName] = useState<string>("");
  const [score, setScore] = useState<number>(0);

  const [currentQuestion, setCurrentQuestion] = useState<LiveQuestion | null>(
    null,
  );
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [correctAnswerIds, setCorrectAnswerIds] = useState<string[]>([]);

  // Timer state
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isTimeOut, setIsTimeOut] = useState<boolean>(false);

  // UI Mode State
  const [displayMode, setDisplayMode] = useState<"INTERACTIVE" | "SHOW_RESULT">(
    "INTERACTIVE",
  );
  const [answerFeedback, setAnswerFeedback] = useState<{
    correct: boolean;
    points: number;
  } | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const questionStartTimeRef = useRef<number>(0);

  const submitAnswerMutation = useSubmitLiveAnswer();
  const { isConnected, lastPlayerEvent } = useLiveQuizSocket(
    pin || null,
    "PLAYER",
  );

  useEffect(() => {
    const storedId = localStorage.getItem("live_quiz_player_id");
    const storedName = localStorage.getItem("live_quiz_player_name");
    if (!storedId) {
      navigate("/student/live-quiz/join");
      return;
    }
    setPlayerId(storedId);
    setPlayerName(storedName || "Người chơi");
  }, [navigate]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startTimer = (seconds: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeRemaining(seconds);
    setIsTimeOut(false);
    questionStartTimeRef.current = Date.now();

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0.1) {
          // use 0.1 to account for ms differences
          if (timerRef.current) clearInterval(timerRef.current);
          setIsTimeOut(true);
          return 0;
        }
        return prev - 0.1;
      });
    }, 100);
  };

  // Handle WebSocket Events
  useEffect(() => {
    if (!lastPlayerEvent) return;

    switch (lastPlayerEvent.type) {
      case "START_GAME":
      case "NEXT_QUESTION":
        const questionData = lastPlayerEvent.data;
        setCurrentQuestion(questionData);
        setSelectedAnswerId(null);
        setCorrectAnswerIds([]);
        setDisplayMode("INTERACTIVE");
        setAnswerFeedback(null);
        startTimer(questionData.timeLimitSeconds);
        break;

      case "SHOW_ANSWER":
        if (timerRef.current) clearInterval(timerRef.current);
        setCorrectAnswerIds(lastPlayerEvent.data.correctAnswerIds);
        setDisplayMode("SHOW_RESULT");

        // If they didn't answer in time
        if (!selectedAnswerId && isTimeOut) {
          setAnswerFeedback({ correct: false, points: 0 });
        }
        break;

      case "SHOW_LEADERBOARD":
        navigate(`/student/live-quiz/result/${pin}`);
        break;

      case "FINISH_GAME":
        navigate(`/student/live-quiz/result/${pin}?ended=true`);
        break;
    }
  }, [lastPlayerEvent, navigate, pin, selectedAnswerId, isTimeOut]);

  const handleAnswerSelect = async (answerId: string) => {
    if (!currentQuestion || !playerId || !pin || selectedAnswerId || isTimeOut)
      return;

    const timeTakenMs = Date.now() - questionStartTimeRef.current;
    const maxTimeMs = currentQuestion.timeLimitSeconds * 1000;

    setSelectedAnswerId(answerId);

    try {
      const res = await submitAnswerMutation.mutateAsync({
        pin,
        data: {
          playerId,
          questionId: currentQuestion.id,
          answerId,
          timeTakenMs,
          maxTimeMs,
        },
      });

      setScore(res.totalScore);
      setAnswerFeedback({
        correct: res.correct,
        points: res.scoreEarned,
      });
    } catch (error) {
      toast.error("Không thể ghi nhận câu trả lời");
      setSelectedAnswerId(null); // allow retry
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 md:p-6 pb-24">
      {/* Top Bar Navigation/Info */}
      <div className="w-full max-w-5xl flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 font-bold text-gray-700">
          <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-xl">face</span>
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Player</p>
            <p className="text-lg leading-none">{playerName}</p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-sm text-gray-500 font-medium">Điểm số</p>
          <p className="text-2xl font-black text-indigo-600 leading-none">
            {Math.round(score)}
          </p>
        </div>
      </div>

      {/* Connection Status indicator */}
      {!isConnected && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg z-50 flex items-center gap-2 animate-pulse">
          <span className="material-symbols-outlined text-sm">wifi_off</span>
          Mất kết nối
        </div>
      )}

      {/* Main Game Area */}
      {currentQuestion ? (
        <div className="w-full flex-1 flex flex-col justify-center relative">
          {/* Feedback Overlay while waiting for teacher to show answer */}
          {selectedAnswerId && displayMode === "INTERACTIVE" && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm rounded-2xl animate-fade-in">
              <div className="w-24 h-24 mb-6 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
              <h2 className="text-3xl font-bold text-gray-800">
                Đã nhận câu trả lời!
              </h2>
              <p className="text-lg text-gray-600 mt-2">
                Vui lòng đợi giáo viên hiện đáp án...
              </p>
            </div>
          )}

          {/* Result Feedback Overlay after teacher shows answer */}
          {displayMode === "SHOW_RESULT" && answerFeedback && (
            <div
              className={`absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 px-8 py-4 rounded-full shadow-2xl flex items-center gap-4 animate-bounce-short ${answerFeedback.correct ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
            >
              <span className="material-symbols-outlined text-4xl font-bold">
                {answerFeedback.correct ? "check_circle" : "cancel"}
              </span>
              <div>
                <h3 className="text-2xl font-black">
                  {answerFeedback.correct ? "Chính xác!" : "Sai rồi!"}
                </h3>
                <p className="font-medium opacity-90">
                  +{Math.round(answerFeedback.points)} điểm
                </p>
              </div>
            </div>
          )}

          <LiveQuestionDisplay
            question={currentQuestion}
            mode={displayMode}
            onAnswerSelect={handleAnswerSelect}
            selectedAnswerId={selectedAnswerId}
            correctAnswerIds={correctAnswerIds}
            timeRemaining={timeRemaining}
            totalTime={currentQuestion.timeLimitSeconds}
            disabled={isTimeOut || submitAnswerMutation.isPending}
          />
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 mb-6 bg-indigo-100 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-4xl text-indigo-500 animate-spin-slow">
              sync
            </span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            Đang chuẩn bị câu hỏi...
          </h2>
          <p className="text-gray-500 mt-2">
            Hãy chú ý lên màn hình của giáo viên.
          </p>
        </div>
      )}
    </div>
  );
};

export default LiveQuizPlayPage;
