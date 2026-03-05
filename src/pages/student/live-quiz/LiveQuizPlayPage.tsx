import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLiveQuizSocket } from "@/hooks/useLiveQuizSocket";
import { useSubmitLiveAnswer, useLiveQuizState } from "@/hooks/useLiveQuiz";
import { LiveQuestionDisplay } from "@/components/live-quiz/LiveQuestionDisplay";
import type { LiveQuestion } from "@/types/live-quiz";
import { toast } from "@/components/common/Toast";
import { WifiOff, User, Loader2, CheckCircle2, XCircle } from "lucide-react";

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
    pendingTotalScore?: number;
  } | null>(null);

  // Refs for state accessed in WS event handler to avoid unnecessary dependencies
  const answerFeedbackRef = useRef<{
    correct: boolean;
    points: number;
    pendingTotalScore?: number;
  } | null>(null);

  const selectedAnswerIdRef = useRef<string | null>(null);
  const isTimeOutRef = useRef<boolean>(false);

  useEffect(() => {
    answerFeedbackRef.current = answerFeedback;
  }, [answerFeedback]);

  useEffect(() => {
    selectedAnswerIdRef.current = selectedAnswerId;
  }, [selectedAnswerId]);

  useEffect(() => {
    isTimeOutRef.current = isTimeOut;
  }, [isTimeOut]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const questionStartTimeRef = useRef<number>(0);

  const submitAnswerMutation = useSubmitLiveAnswer();
  const { isConnected, lastPlayerEvent } = useLiveQuizSocket(
    pin || null,
    "PLAYER",
  );

  // Fallback: fetch current question from API when WS connected but question was missed
  // (happens when lobby navigates here after receiving START_GAME - the event is consumed before play page subscribes)
  // Fallback: fetch current question from API when WS connected but question was missed
  // Constantly poll every 2 seconds if currentQuestion is null to recover from missed events
  const { data: gameState } = useLiveQuizState(
    pin,
    isConnected,
    !currentQuestion ? 2000 : false,
  );

  useEffect(() => {
    if (gameState?.currentQuestion && !currentQuestion) {
      setCurrentQuestion(gameState.currentQuestion);
      setSelectedAnswerId(null);
      setCorrectAnswerIds([]);
      setDisplayMode("INTERACTIVE");
      setAnswerFeedback(null);
      setTimeRemaining(20);
      setIsTimeOut(false);
      startTimer(20);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState]);

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
        setTimeRemaining(20);
        setIsTimeOut(false);
        startTimer(20);
        break;

      case "SHOW_ANSWER":
        if (timerRef.current) clearInterval(timerRef.current);
        setCorrectAnswerIds(lastPlayerEvent.data.correctAnswerIds);
        setDisplayMode("SHOW_RESULT");

        // If they guessed right, update their official total score now
        if (
          answerFeedbackRef.current &&
          answerFeedbackRef.current.correct &&
          answerFeedbackRef.current.pendingTotalScore !== undefined
        ) {
          setScore(answerFeedbackRef.current.pendingTotalScore);
        }

        // If they didn't answer in time
        if (!selectedAnswerIdRef.current && isTimeOutRef.current) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastPlayerEvent, navigate, pin]);

  const handleAnswerSelect = async (answerId: string) => {
    if (!currentQuestion || !playerId || !pin || selectedAnswerId || isTimeOut)
      return;

    const timeTakenMs = Date.now() - questionStartTimeRef.current;

    setSelectedAnswerId(answerId);

    try {
      const res = await submitAnswerMutation.mutateAsync({
        pin,
        data: {
          playerId,
          questionId: currentQuestion.id,
          answerId,
          timeTakenMs,
          maxTimeMs: 20000,
        },
      });

      // Do not update main score immediately to build suspense
      // setScore(res.totalScore);
      setAnswerFeedback({
        correct: res.correct,
        points: res.scoreEarned,
        pendingTotalScore: res.totalScore,
      });
    } catch (error) {
      toast.error("Không thể ghi nhận câu trả lời");
      setSelectedAnswerId(null); // allow retry
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-4 md:p-6 pb-24 relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#1E90FF]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#1E90FF]/5 blur-[100px] pointer-events-none" />

      {/* Top Bar Navigation/Info */}
      <div className="w-full max-w-5xl flex justify-between items-center mb-6 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-slate-200 z-10">
        <div className="flex items-center gap-3 font-bold text-slate-700">
          <div className="w-12 h-12 rounded-xl bg-[#1E90FF]/10 text-[#1E90FF] flex items-center justify-center">
            <User className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Người chơi
            </p>
            <p className="text-lg leading-none tracking-tight">{playerName}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
            Điểm số
          </p>
          <p className="text-3xl font-black text-[#1E90FF] leading-none tracking-tight">
            {Math.round(score)}
          </p>
        </div>
      </div>

      {/* Connection Status indicator */}
      {!isConnected && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500/90 backdrop-blur text-white px-5 py-2 rounded-full text-sm font-bold shadow-lg z-50 flex items-center gap-2 animate-pulse">
          <WifiOff className="w-4 h-4" />
          Mất kết nối
        </div>
      )}

      {/* Main Game Area */}
      {currentQuestion ? (
        <div className="w-full max-w-5xl flex-1 flex flex-col justify-center relative z-10 gap-6">
          {/* Feedback Overlay while waiting for teacher to show answer */}
          {selectedAnswerId && displayMode === "INTERACTIVE" && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/60 backdrop-blur-md rounded-[2.5rem] animate-fade-in border border-white/50 shadow-2xl">
              <Loader2 className="w-16 h-16 text-[#1E90FF] animate-spin mb-6" />
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                Đã ghi nhận!
              </h2>
              <p className="text-lg text-slate-500 mt-2 font-medium">
                Vui lòng đợi giáo viên hiện đáp án...
              </p>
            </div>
          )}

          {/* Result Feedback Overlay after teacher shows answer */}
          {displayMode === "SHOW_RESULT" && answerFeedback && (
            <div
              className={`absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-bounce-short border-2 ${answerFeedback.correct ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"}`}
            >
              {answerFeedback.correct ? (
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              ) : (
                <XCircle className="w-10 h-10 text-red-500" />
              )}
              <div>
                <h3 className="text-2xl font-black tracking-tight">
                  {answerFeedback.correct ? "Chính xác!" : "Sai rồi!"}
                </h3>
                <p className="font-bold opacity-90 text-lg">
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
            totalTime={20}
            disabled={isTimeOut || submitAnswerMutation.isPending}
          />
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center z-10">
          <div className="w-24 h-24 mb-6 bg-[#1E90FF]/10 rounded-full flex items-center justify-center shadow-inner">
            <Loader2 className="w-10 h-10 text-[#1E90FF] animate-spin" />
          </div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">
            Đang chuẩn bị câu hỏi...
          </h2>
          <p className="text-slate-500 mt-3 text-lg font-medium">
            Hãy chú ý lên màn hình của giáo viên.
          </p>
        </div>
      )}
    </div>
  );
};

export default LiveQuizPlayPage;
